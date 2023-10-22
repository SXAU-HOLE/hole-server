import { CommonEntity } from 'src/common/entity/common.entity';
import {
  AfterUpdate,
  Column,
  Entity,
  Index,
  ManyToMany,
  ManyToOne,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Comment } from './comment.entity';

@Entity()
export class Reply extends CommonEntity {
  @Index({
    fulltext: true,
  })
  @Column({ type: 'text', comment: '回复内容' })
  body: string;

  @Column({ type: 'simple-array', comment: '回复图片' })
  imgs: string[];

  @ManyToOne(() => User, (user) => user.replies, { cascade: true })
  user: User;

  @ManyToOne(() => Comment, (comment) => comment.replies, { cascade: true })
  comment: Comment;

  @ManyToOne(() => Reply, (reply) => reply.parentReply)
  parentReply: Reply;

  @Column({ default: 0, comment: '回复点赞数' })
  @Index()
  favoriteCount: number;

  @ManyToMany(() => User, (user) => user.favoriteRelply)
  favoriteUsers: User[];

  @ManyToOne(() => User, (user) => user.repliedReply, { cascade: true })
  replyUser: User;

  @AfterUpdate()
  async afterLoad() {
    this.favoriteCount = this.favoriteUsers?.length;
  }
}
