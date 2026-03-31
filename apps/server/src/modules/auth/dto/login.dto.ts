import { IsNotEmpty, IsString, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
  @ApiProperty({
    description: "用户名",
    example: "admin",
    required: true,
  })
  @IsNotEmpty({ message: "用户名不能为空" })
  @IsString()
  username!: string;

  @ApiProperty({
    description: "密码",
    example: "123456",
    minLength: 6,
    required: true,
  })
  @IsNotEmpty({ message: "密码不能为空" })
  @IsString()
  @MinLength(6, { message: "密码长度不能少于6位" })
  password!: string;
}
