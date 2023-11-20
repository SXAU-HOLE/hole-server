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
import {
  CreateCommentDto,
  CreateCommentReplyDto,
  GetHoleCommentDto,
} from './dto/comment.dto';
import { GetRepliesQuery } from './dto/reply.dto';
import { SearchQuery } from './dto/search.dto';

@Controller('hole')
export class HoleController {
  constructor(private readonly holeService: HoleService) {}

  @Get('/list')
  getList(@Query() dto: GetHoleListQuery, @User() user: IUser) {
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

  @Post('/comment/like')
  likeComment(@Body() dto: GetHoleCommentDto, @User() user: IUser) {
    return this.holeService.likeComment(dto, user);
  }

  @Delete('/comment/like')
  deleteLikeComment(@Body() dto: GetHoleCommentDto, @User() user: IUser) {
    return this.holeService.deleteLikeComment(dto, user);
  }

  @Post('/comment/reply')
  replyComment(@Body() dto: CreateCommentReplyDto, @User() user: IUser) {
    return this.holeService.replyComment(dto, user);
  }

  @Get('/comment/reply')
  getReplies(@Query() dto: GetRepliesQuery, @User() user: IUser) {
    return this.holeService.getReplies(dto, user);
  }

  @Post('/comment/reply/like')
  likeReplyHole(@Body() dto: GetHoleDetailQuery, @User() user: IUser) {
    return this.holeService.likeReply(dto, user);
  }

  @Delete('/comment/reply/like')
  deleteReplyLike(@Body() dto: GetHoleDetailQuery, @User() user: IUser) {
    return this.holeService.deleteLikeReply(dto, user);
  }

  @Get('/tags')
  getHotTags() {
    return this.holeService.getHotTags();
  }

  @Get('/search')
  search(@Query() query: SearchQuery) {
    return this.holeService.search(query);
  }
}
