import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from 'src/common/decorator/user.decorator';
import { EditProFileDto } from './dto/profile.dto';

export type IUser = string;

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/profile')
  getProfile(@User() user: IUser) {
    return this.userService.getProfile(user);
  }

  @Post('/profile')
  editProfile(@Body() dto: EditProFileDto, @User() user: IUser) {
    return this.userService.editProfile(dto, user);
  }
}
