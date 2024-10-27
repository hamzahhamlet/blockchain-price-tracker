import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail, IsNumber } from 'class-validator';
import { ETokenName } from '../blockchain/types';

export class CreateAlertDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Token name that you want to set alert on',
  })
  tokenName: ETokenName;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'Dollar amount change that should trigger alert', example: 10 })
  dollarChange: number;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ description: 'Email address to send an alert message to', example: 'email@example.com' })
  email: string;
}
