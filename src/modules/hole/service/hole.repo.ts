import { ConflictException, Injectable } from '@nestjs/common';
import { IProcessLikeOptions } from '../hole.types';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity/user/user.entity';
import { Repository } from 'typeorm';
import { createResponse } from 'src/utils/create';

@Injectable()
export class HoleRepoService {
  @InjectRepository(User)
  private userRepo: Repository<User>;

  async processLike({
    entity,
    repo,
    reqUser,
    dto,
    property,
  }: IProcessLikeOptions) {
    const isLiked = await repo.findOne({
      relations: { favoriteUsers: true },
      where: {
        id: dto.id,
        favoriteUsers: { studentId: reqUser },
      },
    });

    if (isLiked) {
      throw new ConflictException('你已经点过赞了');
    }

    const user = await this.userRepo.findOne({
      where: { studentId: reqUser },
    });

    const target = await repo.findOne({
      relations: { user: true },
      where: { id: dto.id },
    });

    await this.userRepo
      .createQueryBuilder()
      .relation(User, property)
      .of(user)
      .add(target);

    await repo
      .createQueryBuilder()
      .update(entity)
      .set({ favoriteCount: () => 'favoriteCount + 1' })
      .where('id = :id', { id: dto.id })
      .execute();

    return createResponse('点赞成功');
  }

  async processDeleteLike({
    dto,
    entity,
    property,
    repo,
    reqUser,
  }: IProcessLikeOptions) {
    const target = await repo.findOne({
      relations: { favoriteUsers: true },
      where: {
        id: dto.id,
        favoriteUsers: {
          studentId: reqUser,
        },
      },
    });

    if (!target) {
      throw new ConflictException('你还没有点赞哦');
    }

    const user = await this.userRepo.findOne({
      where: {
        studentId: reqUser,
      },
    });

    await this.userRepo
      .createQueryBuilder()
      .relation(User, property)
      .of(user)
      .remove(target);

    await repo
      .createQueryBuilder()
      .update(entity)
      .set({ favoriteCount: () => 'favoriteCount - 1' })
      .where('id = :id', { id: dto.id })
      .execute();

    return createResponse('取消点赞成功');
  }
}
