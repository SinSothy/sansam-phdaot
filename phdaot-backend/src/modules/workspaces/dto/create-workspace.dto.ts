import { IsString, IsNotEmpty, IsOptional, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWorkspaceDto {
  @ApiProperty({ example: 'My Awesome Workspace' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'This is my workspace description', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'my-awesome-workspace' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ example: 'https://example.com/logo.png', required: false })
  @IsUrl()
  @IsOptional()
  logo_url?: string;
}
