import { IsOptional, IsString, IsInt, Min, IsIn } from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class QueryEmployeeDto {
  @ApiProperty({ description: "页码", example: 1, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({ description: "每页数量", example: 20, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageSize?: number = 20;

  @ApiProperty({ description: "搜索关键词（姓名/工号）", required: false })
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiProperty({ description: "部门", required: false })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiProperty({ description: "状态：1在职 2离职", required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsIn([1, 2])
  status?: number;

  @ApiProperty({
    description: "排序字段",
    example: "createTime",
    required: false,
  })
  @IsOptional()
  @IsString()
  sortBy?: string = "createTime";

  @ApiProperty({ description: "排序方向", example: "DESC", required: false })
  @IsOptional()
  @IsIn(["ASC", "DESC"])
  sortOrder?: "ASC" | "DESC" = "DESC";
}
