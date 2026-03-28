import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateWorkspaceDto } from './create-workspace.dto';
import { IsUUID, IsNotEmpty } from 'class-validator';

export class UpdateWorkspaceDto extends PartialType(CreateWorkspaceDto) {
  @ApiProperty({ example: '00000000-0000-0000-0000-000000000001' })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
