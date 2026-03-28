import {
  Controller,
  Post,
  Body,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { 
  CreateUserRequestDto, 
  UpdateUserRequestDto, 
  GetUserRequestDto, 
  DeleteUserRequestDto, 
  ListUserRequestDto 
} from './dto/user-requests.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
  })
  @ApiResponse({ status: 409, description: 'User already exists.' })
  create(@Body() envelope: CreateUserRequestDto) {
    return this.usersService.create(envelope.body);
  }

  @Post('list')
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Return all users.' })
  findAll(@Body() envelope: ListUserRequestDto) {
    return this.usersService.findAll();
  }

  @Post('get')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiResponse({ status: 200, description: 'Return the user.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  findOne(@Body() envelope: GetUserRequestDto) {
    return this.usersService.findOne(envelope.body.id);
  }

  @Post('update')
  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({ status: 200, description: 'The user has been updated.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  update(@Body() envelope: UpdateUserRequestDto) {
    return this.usersService.update(envelope.body.id, envelope.body);
  }

  @Post('delete')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({ status: 204, description: 'The user has been deleted.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  remove(@Body() envelope: DeleteUserRequestDto) {
    return this.usersService.remove(envelope.body.id);
  }
}
