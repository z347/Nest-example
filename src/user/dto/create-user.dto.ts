import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsString, IsNotEmpty, Matches, IsOptional, IsEnum } from 'class-validator';

import { GenderEnum } from '../enums/gender.enum';
import { passwordPattern } from '../constants/reg-exp.constant';

export class CreateUserDto {
  @ApiProperty()
  @IsEmail()
  readonly email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly lastName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsEnum(GenderEnum)
  readonly gender: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly phone: string;

  readonly roles: string[];

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Matches(passwordPattern, { message: 'Weak password' })
  readonly password: string;
}
