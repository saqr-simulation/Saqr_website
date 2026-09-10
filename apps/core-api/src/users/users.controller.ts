import { Controller, Get, Inject, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard, type AuthenticatedRequest } from '../auth/auth.guard';
import { UsersService } from './users.service';
@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(@Inject(UsersService) private readonly users: UsersService) {}
  @Get('me') me(@Req() request: AuthenticatedRequest) {
    return this.users.profile(request.identity);
  }
}
