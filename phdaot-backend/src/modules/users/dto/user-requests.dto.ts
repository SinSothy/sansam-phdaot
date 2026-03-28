import { ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseRequest } from '../../../common/dto/request-envelope.dto';
import { CreateUserDto } from './create-user.dto';
import { UpdateUserDto } from './update-user.dto';
import { UserIdDto } from './user-id.dto';

export class CreateUserRequestDto extends BaseRequest<CreateUserDto> {
  @ApiProperty({ type: CreateUserDto })
  @ValidateNested()
  @Type(() => CreateUserDto)
  body: CreateUserDto;
}

export class UpdateUserRequestDto extends BaseRequest<UpdateUserDto> {
  @ApiProperty({ type: UpdateUserDto })
  @ValidateNested()
  @Type(() => UpdateUserDto)
  body: UpdateUserDto;
}

export class GetUserRequestDto extends BaseRequest<UserIdDto> {
  @ApiProperty({ type: UserIdDto })
  @ValidateNested()
  @Type(() => UserIdDto)
  body: UserIdDto;
}

export class DeleteUserRequestDto extends BaseRequest<UserIdDto> {
  @ApiProperty({ type: UserIdDto })
  @ValidateNested()
  @Type(() => UserIdDto)
  body: UserIdDto;
}

export class ListUserRequestDto extends BaseRequest<any> {
  @ApiPropertyOptional({ type: Object })
  @IsOptional()
  body?: any;
}
