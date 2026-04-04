import { IsString, IsNotEmpty, IsUUID, IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BoardVisibility, BoardStatus } from '../entities/board.entity';

export class CreateBoardDto {
  @ApiProperty({ example: 'My New Board' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '00000000-0000-0000-0000-000000000001' })
  @IsUUID()
  @IsNotEmpty()
  workspace_id: string;

  @ApiPropertyOptional({ enum: BoardVisibility, default: BoardVisibility.WORKSPACE })
  @IsEnum(BoardVisibility)
  @IsOptional()
  visibility?: BoardVisibility;

  @ApiPropertyOptional({ example: 'bg-blue-600' })
  @IsString()
  @IsOptional()
  background?: string;

  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  is_image?: boolean;
}

export class UpdateBoardDto {
  @ApiProperty({ example: '00000000-0000-0000-0000-000000000001' })
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @ApiPropertyOptional({ example: 'Updated Board Name' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ enum: BoardVisibility })
  @IsEnum(BoardVisibility)
  @IsOptional()
  visibility?: BoardVisibility;

  @ApiPropertyOptional({ example: 'bg-purple-600' })
  @IsString()
  @IsOptional()
  background?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  is_image?: boolean;

  @ApiPropertyOptional({ enum: BoardStatus })
  @IsEnum(BoardStatus)
  @IsOptional()
  status?: BoardStatus;
}
