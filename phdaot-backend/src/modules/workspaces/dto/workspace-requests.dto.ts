import { ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseRequest } from '../../../common/dto/request-envelope.dto';
import { CreateWorkspaceDto } from './create-workspace.dto';
import { UpdateWorkspaceDto } from './update-workspace.dto';
import { IdDto } from '../../../common/dto/id.dto';

export class CreateWorkspaceRequestDto extends BaseRequest<CreateWorkspaceDto> {
  @ApiProperty({ type: CreateWorkspaceDto })
  @ValidateNested()
  @Type(() => CreateWorkspaceDto)
  body: CreateWorkspaceDto;
}

export class UpdateWorkspaceRequestDto extends BaseRequest<UpdateWorkspaceDto> {
  @ApiProperty({ type: UpdateWorkspaceDto })
  @ValidateNested()
  @Type(() => UpdateWorkspaceDto)
  body: UpdateWorkspaceDto;
}

export class GetWorkspaceRequestDto extends BaseRequest<IdDto> {
  @ApiProperty({ type: IdDto })
  @ValidateNested()
  @Type(() => IdDto)
  body: IdDto;
}

export class DeleteWorkspaceRequestDto extends BaseRequest<IdDto> {
  @ApiProperty({ type: IdDto })
  @ValidateNested()
  @Type(() => IdDto)
  body: IdDto;
}

export class ListWorkspaceRequestDto extends BaseRequest<any> {
  @ApiPropertyOptional({ type: Object })
  @IsOptional()
  body?: any;
}

export class WorkspaceMembersRequestDto extends BaseRequest<IdDto> {
  @ApiProperty({ type: IdDto })
  @ValidateNested()
  @Type(() => IdDto)
  body: IdDto;
}
