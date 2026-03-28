import { IsNotEmpty, IsOptional, ValidateNested, IsString, IsEnum, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum Platform {
  ANDROID = 'android',
  IOS = 'ios',
  WEB = 'web',
}

export class RequestHeader {
  @ApiProperty({ enum: Platform, example: Platform.WEB })
  @IsEnum(Platform)
  platform: Platform;

  @ApiPropertyOptional({ example: '00000000-0000-0000-0000-000000000001' })
  @IsUUID()
  @IsOptional()
  userID?: string;

  @ApiPropertyOptional({ example: 'req-123456' })
  @IsString()
  @IsOptional()
  requestID?: string;

  @ApiPropertyOptional({ example: '1.0.0' })
  @IsString()
  @IsOptional()
  version?: string;

  @ApiPropertyOptional({ example: 'UTC+7' })
  @IsString()
  @IsOptional()
  tz?: string;
}

export class BaseRequest<T> {
  @ApiProperty({ type: RequestHeader })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => RequestHeader)
  header: RequestHeader;

  @IsOptional()
  @ValidateNested()
  // Note: Actual Type() will be handled in the specific implementation
  body?: T;
}
