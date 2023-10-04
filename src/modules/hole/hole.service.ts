import { ForbiddenException, Injectable } from '@nestjs/common';
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
} from './dto/hole.dto';
import { CreateCommentDto, GetHoleCommentDto } from './dto/comment.dto';
import { paginate } from 'nestjs-typeorm-paginate';

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

  async create(dto: CreateHoleDto, reqUser: IUser) {
    const user = await this.userRepo.findOne({
      where: {
        studentId: reqUser,
      },
    });

    const tags = dto.tags.map((tag) =>
      this.tagsRepo.create({
        body: tag,
      }),
    );

    const hole = await this.holeRepo.create({
      user,
      body: dto.body,
      imgs: dto.imgs,
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
      .getOne();

    return createResponse('获取树洞详细成功', data);
  }

  async getList(query: GetHoleListQuery, reqUser: IUser) {
    const holeQuery = this.holeRepo.createQueryBuilder('hole');

    const data = await paginate(holeQuery, {
      limit: query.limit,
      page: query.page,
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

    return createResponse('获取评论成功', {
      data,
    });
  }
}
