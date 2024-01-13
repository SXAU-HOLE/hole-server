import { Column, Entity, ManyToMany, ManyToOne } from 'typeorm';
import { CommonEntity } from '../../common/entity/common.entity';
import { Vote } from './vote.entity';
import { User } from '../user/user.entity';

@Entity()
export class VoteItem extends CommonEntity {
  @Column()
  option: string;

  @Column({
    default: 0,
  })
  count: number;

  @ManyToOne(() => Vote, (vote) => vote.items)
  vote: Vote;

  @ManyToMany(() => User, (user) => user.voteItems)
  users: User[];
}
