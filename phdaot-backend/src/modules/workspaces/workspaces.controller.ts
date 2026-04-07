import { Controller, Post, Body } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { WorkspacesService } from "./workspaces.service";
import {
  CreateWorkspaceRequestDto,
  UpdateWorkspaceRequestDto,
  GetWorkspaceRequestDto,
  DeleteWorkspaceRequestDto,
  ListWorkspaceRequestDto,
  WorkspaceMembersRequestDto,
} from "./dto/workspace-requests.dto";

@ApiTags("workspaces")
@Controller("workspaces")
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Post("create")
  @ApiOperation({ summary: "Create a new workspace" })
  @ApiResponse({
    status: 201,
    description: "The workspace has been successfully created.",
  })
  create(@Body() envelope: CreateWorkspaceRequestDto) {
    return this.workspacesService.create(envelope.body.userID, envelope.body);
  }

  @Post("list")
  @ApiOperation({ summary: "Get all workspaces" })
  findAll(@Body() envelope: ListWorkspaceRequestDto) {
    const testUserId = "d933b066-f00a-4402-a782-c731a481c823";
    return this.workspacesService.findAll(testUserId);
  }

  @Post("get")
  @ApiOperation({ summary: "Get a workspace by ID" })
  findOne(@Body() envelope: GetWorkspaceRequestDto) {
    const testUserId = "d933b066-f00a-4402-a782-c731a481c823";
    return this.workspacesService.findOne(envelope.body.id, testUserId);
  }

  @Post("update")
  @ApiOperation({ summary: "Update a workspace" })
  update(@Body() envelope: UpdateWorkspaceRequestDto) {
    const testUserId = "d933b066-f00a-4402-a782-c731a481c823";
    return this.workspacesService.update(
      envelope.body.id,
      testUserId,
      envelope.body,
    );
  }

  @Post("delete")
  @ApiOperation({ summary: "Delete a workspace" })
  remove(@Body() envelope: DeleteWorkspaceRequestDto) {
    const testUserId = "d933b066-f00a-4402-a782-c731a481c823";
    return this.workspacesService.remove(envelope.body.id, testUserId);
  }

  @Post("members")
  @ApiOperation({ summary: "Get workspace members" })
  getMembers(@Body() envelope: WorkspaceMembersRequestDto) {
    const testUserId = "d933b066-f00a-4402-a782-c731a481c823";
    return this.workspacesService.getMembers(envelope.body.id, testUserId);
  }
}
