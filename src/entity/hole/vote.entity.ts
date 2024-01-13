import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { CommonEntity } from '../../common/entity/common.entity';
import { Hole } from './hole.entity';
import { User } from '../user/user.entity';
import { VoteItem } from './VoteItem.entity';

export enum VoteType {
  // 单选
  single = 'single',

  // 多选
  multiple = 'multiple',
}

@Entity()
export class Vote extends CommonEntity {
  @Column({
    type: 'enum',
    enum: VoteType,
    default: VoteType.single,
  })
  type: VoteType;

  @Column({
    comment: '投票标题',
  })
  title: string;

  @CreateDateColumn({
    type: 'timestamp',
    comment: '投票结束时间',
  })
  endTime: Date;

  @OneToOne(() => Hole, (hole) => hole.vote)
  hole: Hole;

  @ManyToMany(() => User, (user) => user.votes)
  users: User[];

  @OneToMany(() => VoteItem, (voteItem) => voteItem.vote, {
    cascade: true,
    eager: true,
  })
  @JoinColumn()
  items: VoteItem[];

  totalCount: number;
  isExpired: boolean;
}
