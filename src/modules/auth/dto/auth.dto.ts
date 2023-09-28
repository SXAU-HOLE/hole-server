import { IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginDTO {
  @IsNotEmpty()
  @IsString()
  @Length(11, 11, {
    message: '学号格式错误',
  })
  studentId: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 20, {
    message: '密码只能为6-20位长度',
  })
  password: string;
}
export class RegisterDTO extends LoginDTO {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  sxauPassword: string;
}
export class ForgetPasswordDTO extends LoginDTO {
  @IsNotEmpty()
  sxauPassword: string;
}
