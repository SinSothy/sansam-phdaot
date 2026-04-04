import { ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseRequest } from '../../../common/dto/request-envelope.dto';
import { CreateBoardDto, UpdateBoardDto } from './board.dto';
import { IdDto } from '../../../common/dto/id.dto';

export class CreateBoardRequestDto extends BaseRequest<CreateBoardDto> {
  @ApiProperty({ type: CreateBoardDto })
  @ValidateNested()
  @Type(() => CreateBoardDto)
  body: CreateBoardDto;
}

export class UpdateBoardRequestDto extends BaseRequest<UpdateBoardDto> {
  @ApiProperty({ type: UpdateBoardDto })
  @ValidateNested()
  @Type(() => UpdateBoardDto)
  body: UpdateBoardDto;
}

export class GetBoardRequestDto extends BaseRequest<IdDto> {
  @ApiProperty({ type: IdDto })
  @ValidateNested()
  @Type(() => IdDto)
  body: IdDto;
}

export class DeleteBoardRequestDto extends BaseRequest<IdDto> {
  @ApiProperty({ type: IdDto })
  @ValidateNested()
  @Type(() => IdDto)
  body: IdDto;
}

export class ListBoardRequestDto extends BaseRequest<any> {
  @ApiPropertyOptional({ type: Object })
  @IsOptional()
  body?: any;
}
