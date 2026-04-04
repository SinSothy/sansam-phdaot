import {
  Controller,
  Post,
  Body,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { BoardsService } from "./boards.service";
import { 
  CreateBoardRequestDto, 
  UpdateBoardRequestDto, 
  GetBoardRequestDto, 
  DeleteBoardRequestDto, 
  ListBoardRequestDto 
} from "./dto/board-requests.dto";

@ApiTags("boards")
@Controller("boards")
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Post('create')
  @ApiOperation({ summary: "Create a new board" })
  @ApiResponse({
    status: 201,
    description: "The board has been successfully created.",
  })
  create(@Body() envelope: CreateBoardRequestDto) {
    const userId = envelope.header.userID || '00000000-0000-0000-0000-000000000001';
    return this.boardsService.create(userId, envelope.body);
  }

  @Post('list')
  @ApiOperation({ summary: "Get boards for a workspace" })
  findAll(@Body() envelope: ListBoardRequestDto) {
    const workspaceId = envelope.body?.workspace_id;
    return this.boardsService.findAll(workspaceId);
  }

  @Post('get')
  @ApiOperation({ summary: "Get a board by ID" })
  findOne(@Body() envelope: GetBoardRequestDto) {
    return this.boardsService.findOne(envelope.body.id);
  }

  @Post('update')
  @ApiOperation({ summary: "Update a board" })
  update(@Body() envelope: UpdateBoardRequestDto) {
    return this.boardsService.update(envelope.body.id, envelope.body);
  }

  @Post('delete')
  @ApiOperation({ summary: "Delete a board" })
  remove(@Body() envelope: DeleteBoardRequestDto) {
    return this.boardsService.remove(envelope.body.id);
  }
}
