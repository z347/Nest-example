import { BadRequestException, Injectable, MethodNotAllowedException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { SignOptions } from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import * as _ from 'lodash';
import * as moment from 'moment';

import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { RoleEnum as roleEnum } from 'src/user/enums/role.enum';
import { IReadableUser } from 'src/user/interfaces/readable-user.interface';
import { StatusEnum as statusEnum } from 'src/user/enums/status.enum';
import { UserSensitiveFieldsEnum } from 'src/user/enums/protected-fields.enum';
import { IUser } from 'src/user/interfaces/user.interface';
import { TokenService } from 'src/token/token.service';
import { CreateUserTokenDto } from 'src/token/dto/create-user-token.dto';
import { IUserToken } from 'src/token/interfaces/user-token.interface';
import { EmailService } from 'src/email/email.service';

import { SignInDto } from './dto/signin.dto';
import { ITokenPayload } from './interfaces/token-payload.interface';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';

@Injectable()
export class AuthService {
  /* eslint-disable @typescript-eslint/lines-between-class-members */
  private readonly port: number;
  private readonly host: string;
  private readonly clientAppUrl: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService,
    private readonly mailService: EmailService,
  ) {
    this.port = configService.get<number>('SERVER_PORT');
    this.host = configService.get<string>('SERVER_HOST');
    this.clientAppUrl = `${this.host}:${this.port}`;
  }

  async signUp(createUserDto: CreateUserDto): Promise<boolean> {
    const user = await this.userService.create(createUserDto, [roleEnum.user]);
    await this.sendConfirmation(user);
    return true;
  }

  async signIn({ email, password }: SignInDto): Promise<IReadableUser> {
    const user = await this.userService.findByEmail(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = await this.signUser(user, true);
      const readableUser = user.toObject() as IReadableUser;
      readableUser.accessToken = token;

      return _.omit<any>(readableUser, Object.values(UserSensitiveFieldsEnum)) as IReadableUser;
    }

    throw new BadRequestException('Invalid credentials');
  }

  async signUser(user: IUser, withStatusCheck: boolean): Promise<string> {
    if (withStatusCheck && user.status !== statusEnum.active) {
      throw new MethodNotAllowedException();
    }

    const tokenPayload: ITokenPayload = {
      _id: user._id,
      status: user.status,
      roles: user.roles,
    };
    const token = await this.generateToken(tokenPayload);
    const expireAt = moment().add(1, 'day').toISOString();

    await this.saveToken({
      token,
      expireAt,
      userId: user._id,
    });

    return token;
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<boolean> {
    const password = await this.userService.hashPassword(changePasswordDto.password);
    await this.userService.update(userId, { password });
    await this.tokenService.deleteAll(userId);
    return true;
  }

  async confirm(token: string): Promise<IUser> {
    const data = await this.verifyToken(token);
    const user = await this.userService.find(data._id);

    await this.tokenService.delete(data._id, token);

    if (user && user.status === statusEnum.pending) {
      user.status = statusEnum.active;
      return user.save();
    }
    throw new BadRequestException('Confirmation error');
  }

  async sendConfirmation(user: IUser): Promise<void> {
    const token = await this.signUser(user, false);
    const confirmLink = `${this.clientAppUrl}/api/auth/confirm?token=${token}`;

    await this.mailService.send({
      from: this.configService.get<string>('EMAIL_SEND_FROM'),
      to: user.email,
      subject: 'Verify User',
      html: `
                <h3>Hello ${user.firstName}!</h3>
                <p>Please use this <a href="${confirmLink}">link</a> to confirm your account.</p>
            `,
    });
  }

  private async generateToken(data: ITokenPayload, options?: SignOptions): Promise<string> {
    return this.jwtService.sign(data, options);
  }

  private async verifyToken(token): Promise<any> {
    const data = this.jwtService.verify(token) as ITokenPayload;
    const tokenExists = await this.tokenService.exists(data._id, token);

    if (tokenExists) return data;

    throw new UnauthorizedException();
  }

  private saveToken(createUserTokenDto: CreateUserTokenDto): Promise<IUserToken> {
    return this.tokenService.create(createUserTokenDto);
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<void> {
    const user = await this.userService.findByEmail(forgotPasswordDto.email);

    if (!user) throw new BadRequestException('Invalid email');

    const token = await this.signUser(user, true);
    const forgotLink = `${this.clientAppUrl}/api/auth/forgotPassword?token=${token}`;

    await this.mailService.send({
      from: this.configService.get<string>('EMAIL_SEND_FROM'),
      to: user.email,
      subject: 'Forgot Password',
      html: `
                <h3>Hello ${user.firstName}!</h3>
                <p>Please use this <a href="${forgotLink}">link</a> to reset your password.</p>
            `,
    });
  }
}
