import { Controller, Post, Body, ValidationPipe, Get, Query, Patch, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { IReadableUser } from 'src/user/interfaces/readable-user.interface';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { ConfirmAccountDto } from './dto/confirm-account.dto';
import { SignInDto } from './dto/signin.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { GetUser } from '../components/decorators/get-user.decorator';
import { IUser } from '../user/interfaces/user.interface';
import { ChangePasswordDto } from './dto/change-password.dto';

@ApiTags('auth')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-up')
  async signUp(@Body(new ValidationPipe()) createUserDto: CreateUserDto): Promise<boolean> {
    return this.authService.signUp(createUserDto);
  }

  @Get('/confirm')
  async confirm(@Query(new ValidationPipe()) query: ConfirmAccountDto): Promise<boolean> {
    await this.authService.confirm(query.token);
    return true;
  }

  @Post('/sign-in')
  async signIn(@Body(new ValidationPipe()) signInDto: SignInDto): Promise<IReadableUser> {
    return await this.authService.signIn(signInDto);
  }

  @Post('/forgot-password')
  async forgotPassword(@Body(new ValidationPipe()) forgotPasswordDto: ForgotPasswordDto): Promise<void> {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Patch('/change-password')
  @UseGuards(AuthGuard())
  async changePassword(
    @GetUser() user: IUser,
    @Body(new ValidationPipe()) changePasswordDto: ChangePasswordDto,
  ): Promise<boolean> {
    return this.authService.changePassword(user._id, changePasswordDto);
  }
}
