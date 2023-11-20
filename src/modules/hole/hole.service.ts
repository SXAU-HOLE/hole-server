import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Inject,
} from '@nestjs/common';
import { IUser } from '../user/user.controller';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity/user/user.entity';
import { Repository, FindManyOptions, Like } from 'typeorm';
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
import { GetRepliesQuery } from './dto/reply.dto';
import { addCommentIsLiked, addReplyIsLiked } from './hole.utils';
import { HoleCategoryEntity } from '../../entity/hole/category/HoleCategory.entity';
import { HoleRepoService } from './service/hole.repo';
import { SearchQuery } from './dto/search.dto';

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

  @InjectRepository(HoleCategoryEntity)
  private readonly categoryRepo: Repository<HoleCategoryEntity>;

  @Inject()
  private readonly holeRepoService: HoleRepoService;

  async create(dto: CreateHoleDto, reqUser: IUser) {
    const user = await this.userRepo.findOne({
      where: {
        studentId: reqUser,
      },
    });

    const tagsFunc = dto.tags?.map(async (tag) => {
      const exitedTags = await this.tagsRepo.findOne({
        where: { body: tag },
      });

      if (exitedTags) return exitedTags;

      return await this.tagsRepo.create({ body: tag });
    });

    const tags = await Promise.all(tagsFunc);

    const category = await this.categoryRepo.create({
      name: dto.category,
    });

    const hole = await this.holeRepo.create({
      user,
      body: dto.body,
      imgs: dto.imgs,
      title: dto.title,
      category,
      tags: tags,
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
    return await this.holeRepoService.processLike({
      dto,
      reqUser,
      repo: this.holeRepo,
      property: 'favoriteHole',
      entity: Hole as any,
    });
  }

  async deleteLike(dto: GetHoleDetailQuery, reqUser: IUser) {
    return await this.holeRepoService.processDeleteLike({
      dto,
      reqUser,
      repo: this.holeRepo,
      property: 'favoriteHole',
      entity: Hole as any,
    });
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

    holeQuery.loadRelationCountAndMap(
      'hole.isLiked',
      'hole.favoriteUsers',
      'isLiked',
      (qb) =>
        qb.andWhere('isLiked.studentId = :studentId', {
          studentId: reqUser,
        }),
    );

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
      ...comment,
    });
  }

  async getComment(dto: GetHoleCommentDto, reqUser: IUser) {
    const commentQuery = this.commentRepo
      .createQueryBuilder('comment')
      .setFindOptions({
        relations: {
          user: true,
          replies: {
            user: true,
            replyUser: true,
          },
        },
        order: {
          createAt: 'DESC',
          replies: {
            createAt: 'ASC',
          },
        },
        where: {
          hole: { id: dto.id },
        },
      })
      .loadRelationCountAndMap('comment.repliesCount', 'comment.replies');

    // 评论是否被赞过
    addCommentIsLiked(commentQuery, reqUser);

    const data = await paginate<Comment>(commentQuery, {
      limit: dto.limit || 10,
      page: dto.page || 1,
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

    if (!comment) {
      throw new BadRequestException('该评论不存在');
    }

    const user = await this.userRepo.findOneBy({ studentId: reqUser });

    const reply = this.replyRepo.create({
      body: dto.body,
      imgs: dto.imgs || [],
      comment,
      user,
    });

    if (dto.replyId) {
      const parentReply = await this.replyRepo.findOne({
        relations: { user: true },
        where: { id: dto.replyId },
        select: {
          user: {
            studentId: true,
            id: true,
          },
        },
      });

      reply.parentReply = parentReply;
      reply.replyUser = parentReply.user;
    }

    await this.replyRepo.save(reply);

    return createResponse('回复成功', { id: reply.id });
  }

  async getReplies(query: GetRepliesQuery, reqUser: IUser) {
    const replyQuery = await this.replyRepo
      .createQueryBuilder('reply')
      .setFindOptions({
        relations: {
          user: true,
          replyUser: true,
        },
        where: {
          comment: {
            id: query.id,
          },
        },
        order: {
          createAt: 'ASC',
        },
      });

    addReplyIsLiked(replyQuery, reqUser);

    const data = await paginate(replyQuery, {
      limit: query.limit || 10,
      page: query.page || 1,
    });

    return data;
  }

  async likeComment(dto: GetHoleDetailQuery, reqUser: IUser) {
    return await this.holeRepoService.processLike({
      dto,
      reqUser,
      repo: this.commentRepo,
      property: 'favoriteComment',
      entity: Comment as any,
    });
  }

  async deleteLikeComment(dto: GetHoleDetailQuery, reqUser: IUser) {
    return await this.holeRepoService.processDeleteLike({
      dto,
      reqUser,
      repo: this.commentRepo,
      property: 'favoriteComment',
      entity: Comment as any,
    });
  }

  async likeReply(dto: GetHoleDetailQuery, reqUser: IUser) {
    return await this.holeRepoService.processLike({
      dto,
      reqUser,
      repo: this.replyRepo,
      property: 'favoriteReply',
      entity: Reply as any,
    });
  }

  async deleteLikeReply(dto: GetHoleDetailQuery, reqUser: IUser) {
    return await this.holeRepoService.processDeleteLike({
      dto,
      reqUser,
      repo: this.replyRepo,
      property: 'favoriteReply',
      entity: Reply as any,
    });
  }

  async getTags(tag: string) {
    const exitedTags = await this.tagsRepo.findOne({
      where: { body: tag },
    });

    if (exitedTags) return exitedTags;

    return await this.tagsRepo.create({ body: tag });
  }

  async getHotTags() {
    // const query = `
    //   SELECT tags.*, COUNT(hole.id) as holesCount
    //   FROM tags
    //   LEFT JOIN hole ON x = x
    //   GROUP BY tags.id
    //   ORDER BY holesCount DESC
    // `;
    // const hotTags = await this.tagsRepo.query(query);
    // return hotTags;
    const tags = await this.tagsRepo
      .createQueryBuilder('tags')
      .loadRelationCountAndMap('tags.holesCount', 'tags.holes')
      .getMany();

    tags.sort((a, b) => b.holesCount - a.holesCount);

    return tags.slice(0, Math.min(tags.length, 20));
  }

  async search(query: SearchQuery) {
    const { keywords, ...paginateQuery } = query;

    let searchOptions: FindManyOptions<Hole> = {
      relations: {
        user: true,
        comments: { user: true },
        tags: true,
      },
      order: {
        createAt: 'DESC',
      },
    };

    if (keywords.startsWith('#')) {
      const keyword = keywords.slice(1);
      // hole id
      if (!isNaN(Number(keyword))) {
        searchOptions = {
          ...searchOptions,
          where: {
            id: Number(keyword),
          },
        };
      } else {
        // hole tag
        searchOptions = {
          ...searchOptions,
          where: {
            tags: {
              body: keyword,
            },
          },
        };
      }
    } else {
      // hole body
      searchOptions = {
        ...searchOptions,
        where: {
          body: Like(`%${keywords}%`),
        },
      };
    }

    const data = await paginate(this.holeRepo, paginateQuery, searchOptions);

    return data;
  }
}
