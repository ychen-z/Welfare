import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEmail,
  IsDateString,
  MaxLength,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateEmployeeDto {
  @ApiProperty({ description: "工号", example: "EMP001" })
  @IsNotEmpty({ message: "工号不能为空" })
  @IsString()
  @MaxLength(50)
  employeeNo!: string;

  @ApiProperty({ description: "姓名", example: "张三" })
  @IsNotEmpty({ message: "姓名不能为空" })
  @IsString()
  @MaxLength(50)
  name!: string;

  @ApiProperty({ description: "部门", example: "技术部", required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  department?: string;

  @ApiProperty({ description: "职位", example: "工程师", required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  position?: string;

  @ApiProperty({
    description: "手机号",
    example: "13800138000",
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @ApiProperty({
    description: "邮箱",
    example: "zhangsan@example.com",
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { message: "邮箱格式不正确" })
  @MaxLength(100)
  email?: string;

  @ApiProperty({
    description: "入职日期",
    example: "2024-01-01",
    required: false,
  })
  @IsOptional()
  @IsDateString()
  hireDate?: string;

  @ApiProperty({ description: "关联用户ID", required: false })
  @IsOptional()
  userId?: number;
}
