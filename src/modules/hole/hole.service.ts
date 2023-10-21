import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { IUser } from '../user/user.controller';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity/user/user.entity';
import { Repository } from 'typeorm';
import { Hole } from 'src/entity/hole/hole.entity';
import { Tags } from 'src/entity/hole/tags.entity';
import { Comment } from 'src/entity/hole/comment.entity';
import { createResponse } from 'src/utils/create';
import {
  CreateHoleDto,
  DeleteHoleDto,
  GetHoleDetailQuery,
  GetHoleListQuery,
  HoleListMode,
} from './dto/hole.dto';
import {
  CreateCommentDto,
  CreateCommentReplyDto,
  GetHoleCommentDto,
} from './dto/comment.dto';
import { paginate } from 'nestjs-typeorm-paginate';
import { Reply } from 'src/entity/hole/reply.entity';
import { ReplyReplyDto } from './dto/reply.dto';

@Injectable()
export class HoleService {
  @InjectRepository(User)
  private readonly userRepo: Repository<User>;

  @InjectRepository(Hole)
  private readonly holeRepo: Repository<Hole>;

  @InjectRepository(Tags)
  private readonly tagsRepo: Repository<Tags>;

  @InjectRepository(Comment)
  private readonly commentRepo: Repository<Comment>;

  @InjectRepository(Reply)
  private readonly replyRepo: Repository<Reply>;

  async create(dto: CreateHoleDto, reqUser: IUser) {
    const user = await this.userRepo.findOne({
      where: {
        studentId: reqUser,
      },
    });

    const tags = dto.tags?.map((tag) =>
      this.tagsRepo.create({
        body: tag,
      }),
    );

    const hole = await this.holeRepo.create({
      user,
      body: dto.body,
      imgs: dto.imgs || [],
      tags,
      title: dto.title || '', //TODO 树洞分类category
    });

    await this.holeRepo.save(hole);

    return createResponse('创建树洞成功！', {
      id: hole.id,
    });
  }

  async delete(dto: DeleteHoleDto, reqUser: IUser) {
    const hole = await this.holeRepo.findOne({
      relations: { user: true },
      where: { id: dto.id },
      select: { user: { studentId: true } },
    });

    if (hole.user.studentId !== reqUser) {
      throw new ForbiddenException('只能删除自己的树洞哦');
    }

    await this.holeRepo.delete({ id: hole.id });

    return createResponse('删除成功');
  }

  async getHoleDetail(query: GetHoleDetailQuery, reqUser: IUser) {
    const data = await this.holeRepo
      .createQueryBuilder('hole')
      .setFindOptions({
        relations: {
          user: true,
        },
        where: {
          id: query.id,
        },
        select: {
          user: {
            username: true,
            avatar: true,
          },
        },
      })
      .loadRelationCountAndMap(
        'hole.isLiked',
        'hole.favoriteUsers',
        'isLiked',
        (qb) =>
          qb.where('isLiked.studentId = :studentId', {
            studentId: reqUser,
          }),
      )
      .loadRelationCountAndMap('hole.commentCounts', 'hole.comments')
      .getOne();

    return createResponse('获取树洞详细成功', data);
  }

  async likeHole(dto: GetHoleDetailQuery, reqUser: IUser) {
    const isLiked = await this.holeRepo.findOne({
      relations: { favoriteUsers: true },
      where: {
        id: dto.id,
        favoriteUsers: { studentId: reqUser },
      },
    });

    if (isLiked) {
      throw new BadRequestException('你已经点赞过了哦');
    }

    const user = await this.userRepo.findOne({
      where: { studentId: reqUser },
    });

    const hole = await this.holeRepo.findOne({
      relations: { user: true },
      where: { id: dto.id },
      select: {
        user: {
          username: true,
          studentId: true,
        },
      },
    });

    // 更新当前user的favoriteHole
    await this.userRepo
      .createQueryBuilder()
      .relation(User, 'favoriteHole')
      .of(user)
      .add(hole);

    // 更新hole的点赞数
    await this.holeRepo
      .createQueryBuilder()
      .update(Hole)
      .set({ favoriteCount: () => 'favoriteCount + 1' })
      .where('id = :id', { id: dto.id })
      .execute();

    return createResponse('点赞成功');
  }

  async deleteLike(dto: GetHoleDetailQuery, reqUser: IUser) {
    const hole = await this.holeRepo.findOne({
      relations: { favoriteUsers: true },
      where: {
        id: dto.id,
        favoriteUsers: {
          studentId: reqUser,
        },
      },
    });

    if (!hole) {
      throw new BadRequestException('你还没有点赞哦');
    }

    const user = await this.userRepo.findOne({
      where: { studentId: reqUser },
    });

    await this.userRepo
      .createQueryBuilder()
      .relation(User, 'favoriteHole')
      .of(user)
      .remove(hole);

    await this.holeRepo
      .createQueryBuilder()
      .update(Hole)
      .set({ favoriteCount: () => 'favoriteCount - 1' } as any)
      .where('id = :id', { id: dto.id })
      .execute();

    return createResponse('取消点赞成功');
  }

  async getList(query: GetHoleListQuery, reqUser: IUser) {
    const holeQuery = this.holeRepo
      .createQueryBuilder('hole')
      .setFindOptions({
        relations: { user: true },
      })
      .loadRelationCountAndMap('hole.commentCounts', 'hole.comments');

    if (query.mode === HoleListMode.hot) {
      holeQuery
        .addSelect(`LOG10(RAND(hole.id)) * RAND() * 100`, 'score')
        .orderBy('score', 'DESC');
    } else {
      holeQuery.orderBy('hole.createAt', 'DESC');
    }

    const data = await paginate(holeQuery, {
      limit: query.limit || 10,
      page: query.page || 1,
    });

    return data;
  }

  async createComment(dto: CreateCommentDto, reqUser: IUser) {
    const hole = await this.holeRepo.findOne({
      relations: { user: true },
      select: { user: { studentId: true } },
      where: { id: dto.id },
    });

    const user = await this.userRepo.findOneBy({ studentId: reqUser });

    const comment = this.commentRepo.create({
      body: dto.body,
      hole,
      user,
      imgs: dto.imgs || [],
    });

    await this.commentRepo.save(comment);

    return createResponse('留言成功', {
      id: comment.id,
    });
  }

  async getComment(dto: GetHoleCommentDto, reqUser: IUser) {
    const commentQuery = this.commentRepo
      .createQueryBuilder('comment')
      .setFindOptions({
        relations: { user: true },
        order: {
          createAt: 'DESC',
        },
        where: {
          hole: { id: dto.id },
        },
      });

    const data = await paginate<Comment>(commentQuery, {
      limit: dto.limit,
      page: dto.page,
    });

    return data;
  }

  async replyComment(dto: CreateCommentReplyDto, reqUser: IUser) {
    const comment = await this.commentRepo.findOne({
      relations: { user: true },
      where: { id: dto.commentId },
      select: {
        user: {
          studentId: true,
          id: true,
        },
      },
    });

    const user = await this.userRepo.findOneBy({ studentId: reqUser });

    const reply = this.replyRepo.create({
      body: dto.body,
      imgs: dto.imgs || [],
      comment,
      user,
    });

    await this.replyRepo.save(reply);

    return createResponse('回复成功', { id: reply.id });
  }

  async getReplies(query: ReplyReplyDto, reqUser: IUser) {}
}
