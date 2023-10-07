import { Controller, Post, Body, Delete, Get, Query } from '@nestjs/common';
import { HoleService } from './hole.service';
import { IUser } from '../user/user.controller';
import { User } from 'src/common/decorator/user.decorator';
import {
  CreateHoleDto,
  DeleteHoleDto,
  GetHoleDetailQuery,
  GetHoleListQuery,
} from './dto/hole.dto';
import { CreateCommentDto, GetHoleCommentDto } from './dto/comment.dto';

@Controller('hole')
export class HoleController {
  constructor(private readonly holeService: HoleService) {}

  @Get('/list')
  getList(@Body() dto: GetHoleListQuery, @User() user: IUser) {
    return this.holeService.getList(dto, user);
  }

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

  @Post('/like')
  likeHole(@Body() dto: GetHoleDetailQuery, @User() user: IUser) {
    return this.holeService.likeHole(dto, user);
  }

  @Delete('/like')
  deleteLike(@Body() dto: GetHoleDetailQuery, @User() user: IUser) {
    return this.holeService.deleteLike(dto, user);
  }

  @Post('/comment')
  createComment(@Body() dto: CreateCommentDto, @User() user: IUser) {
    return this.holeService.createComment(dto, user);
  }

  @Get('/comment')
  getComment(@Query() dto: GetHoleCommentDto, @User() user: IUser) {
    return this.holeService.getComment(dto, user);
  }
}
