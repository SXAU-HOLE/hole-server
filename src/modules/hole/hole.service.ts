import { ForbiddenException, Injectable } from '@nestjs/common';
import { IUser } from '../user/user.controller';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity/user/user.entity';
import { Repository } from 'typeorm';
import { Hole } from 'src/entity/hole/hole.entity';
import { Tags } from 'src/entity/hole/tags.entity';
import { createResponse } from 'src/utils/create';
import { CreateHoleDto, DeleteHoleDto, GetHoleDetailQuery } from './dto/hole.dto';

@Injectable()
export class HoleService {
  @InjectRepository(User)
  private readonly userRepo: Repository<User>

  @InjectRepository(Hole)
  private readonly holeRepo: Repository<Hole>

  @InjectRepository(Tags)
  private readonly tagsRepo: Repository<Tags>

  async create(dto: CreateHoleDto, reqUser: IUser) {
    const user = await this.userRepo.findOne({
      where: {
        studentId: reqUser
      }
    })

    const tags = dto.tags.map(tag => this.tagsRepo.create({
      body: tag
    }))

    const hole = await this.holeRepo.create({
      user,
      body: dto.body,
      imgs: dto.imgs,
      tags,
      title: dto.title || '', //TODO 树洞分类category
    })

    await this.holeRepo.save(hole)

    return createResponse("创建树洞成功！", {
      id: hole.id      
    })
  }

  async delete(dto: DeleteHoleDto, reqUser: IUser) {
    const hole = await this.holeRepo.findOne({
      relations: { user: true },
      where: { id: dto.id },
      select: { user: { studentId: true } }
    })

    if (hole.user.studentId !== reqUser) {
      throw new ForbiddenException('只能删除自己的树洞哦')
    }

    await this.holeRepo.delete({ id: hole.id })

    return createResponse("删除成功")
  }

  async getHoleDetail(query: GetHoleDetailQuery,reqUser: IUser) {
    const data = await this.holeRepo
      .createQueryBuilder('hole')
      .setFindOptions({
        relations: { 
          user: true,
        },
        where: {
          id: query.id
        },
        select: {
          user: {
            username: true,
            avatar: true
          }
        }
      })
      .getOne()
    
    return createResponse('获取树洞详细成功',data)
  }
}
