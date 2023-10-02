import { CommonEntity } from 'src/common/entity/common.entity';
import {
  AfterUpdate,
  Column,
  Entity,
  Index,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Hole } from './hole.entity';
import { User } from '../user/user.entity';
import { Reply } from './reply.entity';

@Entity()
export class Comment extends CommonEntity {
  @Column({ type: 'text', comment: '留言内容' })
  body: string;

  @ManyToOne(() => Hole, (hole) => hole.comments, { cascade: true })
  hole: Hole;

  @ManyToOne(() => User, (user) => user.comments, { cascade: true })
  user: User;

  @OneToMany(() => Reply, (reply) => reply.comment)
  replies: Reply[];

  @Column({ default: 0, comment: '点赞数量' })
  @Index()
  favoriteCount: number;

  @ManyToMany(() => User, (user) => user.favoriteComment)
  favoriteUsers: User[];

  @Column({ type: 'simple-array', comment: '留言图片' })
  imgs: string[];

  @AfterUpdate()
  async afterLoad() {
    this.favoriteCount = this.favoriteUsers?.length;
  }
}
