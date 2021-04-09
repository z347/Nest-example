import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, IsNotEmpty } from 'class-validator';

import { passwordPattern } from 'src/user/constants/reg-exp.constant';

export class ChangePasswordDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Matches(passwordPattern, { message: 'Weak password' })
  readonly password: string;
}
