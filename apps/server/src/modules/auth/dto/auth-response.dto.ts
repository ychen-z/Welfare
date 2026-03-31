import { ApiProperty } from "@nestjs/swagger";

export class AuthResponseDto {
  @ApiProperty({ description: "Access Token" })
  accessToken!: string;

  @ApiProperty({
    description: "Refresh Token",
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  })
  refreshToken!: string;

  @ApiProperty({ description: "Token 类型", example: "Bearer" })
  tokenType!: string;

  @ApiProperty({ description: "过期时间（秒）", example: 7200 })
  expiresIn!: number;
}
