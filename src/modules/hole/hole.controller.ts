import { Controller, Post, Body, Delete, Get, Query } from '@nestjs/common';
import { HoleService } from './hole.service';
import { IUser } from '../user/user.controller';
import { User } from 'src/common/decorator/user.decorator';
import {
  CreateHoleDto,
  DeleteHoleDto,
  GetHoleDetailQuery,
} from './dto/hole.dto';

@Controller('hole')
export class HoleController {
  constructor(private readonly holeService: HoleService) {}

  // TODO 节流防止一直请求
  @Post('/create')
  create(@Body() dto: CreateHoleDto, @User() user: IUser) {
    return this.holeService.create(dto, user);
  }

  @Delete('/delete')
  delete(@Body() dto: DeleteHoleDto, @User() user: IUser) {
    return this.holeService.delete(dto, user);
  }

  @Get('/detail')
  getDetail(@Query() dto: GetHoleDetailQuery, @User() user: IUser) {
    return this.holeService.getHoleDetail(dto, user);
  }
}
