import {IsString} from 'class-validator';

export class AuthDto {
  @IsString()
  login: string;

  @IsString()
  password: string;
}

export class RegisterAuthDto {
  @IsString()
  name: string;

  @IsString()
  login: string;

  @IsString()
  password: string;
}
