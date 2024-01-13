import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { PostVoteDto } from '../dto/vote.dto';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Vote, VoteType } from '../../../entity/hole/vote.entity';
import { EntityManager, In, Repository } from 'typeorm';
import { User } from '../../../entity/user/user.entity';
import { VoteItem } from '../../../entity/hole/VoteItem.entity';
import { createResponse } from '../../../utils/create';

@Injectable()
export class VoteService {
  @InjectRepository(Vote)
  private readonly voteRepo: Repository<Vote>;

  @InjectRepository(VoteItem)
  private readonly voteItemRepo: Repository<VoteItem>;

  @InjectRepository(User)
  private readonly userRepo: Repository<User>;

  @InjectEntityManager()
  private readonly manager: EntityManager;

  async vote(dto: PostVoteDto, reqUser: string) {
    const isPosted = await this.userRepo.findOne({
      where: { studentId: reqUser, votes: { id: dto.id } },
    });

    if (isPosted) {
      throw new ConflictException('你已经投过票了');
    }

    const vote = await this.voteRepo.findOne({ where: { id: dto.id } });
    if (vote.type === VoteType.single && dto.ids.length >= 2) {
      throw new BadRequestException('该投票为单选');
    }

    if (this.IsVoteExpired(vote)) {
      throw new ConflictException('投票已过期~');
    }

    await this.voteItemRepo.increment({ id: In(dto.ids) }, 'count', 1);

    const voteItems = await this.voteItemRepo.findBy({ id: In(dto.ids) });
    const user = await this.userRepo.findBy({ studentId: reqUser });
    await this.manager.transaction(async (t) => {
      await t
        .getRepository(User)
        .createQueryBuilder()
        .relation(User, 'votes')
        .of(user)
        .add(vote);

      await t
        .getRepository(User)
        .createQueryBuilder()
        .relation(User, 'voteItems')
        .of(user)
        .add(voteItems);
    });

    return createResponse('投票成功');
  }

  async findVote(dto: { id: number }, reqUser: string) {
    const vote = await this.voteRepo
      .createQueryBuilder('vote')
      .setFindOptions({
        where: {
          hole: {
            id: dto.id,
          },
        },
      })
      .leftJoinAndSelect('vote.items', 'voteItems')
      .loadRelationCountAndMap('vote.isVoted', 'vote.users', 'isVoted', (qb) =>
        qb.andWhere('isVoted.studentId = :studentId', { studentId: reqUser }),
      )
      .getOne();

    if (!vote) {
      return null;
    }

    const voteItems = await this.voteItemRepo
      .createQueryBuilder('items')
      .setFindOptions({
        where: {
          vote: { id: vote.id },
        },
      })
      .loadRelationCountAndMap(
        'items.isVoted',
        'items.users',
        'isVoted',
        (qb) =>
          qb.andWhere('isVoted.studentId = :studentId', { studentId: reqUser }),
      )
      .getMany();

    const total = voteItems
      .map((item) => item.count)
      .reduce((a, b) => a + b, 0);

    vote.totalCount = total;
    vote.items = voteItems;
    vote.isExpired = this.IsVoteExpired(vote);

    return vote;
  }

  IsVoteExpired(vote: Vote) {
    if (vote.endTime.getTime() > new Date().getTime()) {
      return true;
    }
    return false;
  }
}
