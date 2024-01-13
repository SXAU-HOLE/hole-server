import { AutoIncIdEntity } from 'src/common/entity/common.entity';
import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { Hole } from '../hole/hole.entity';
import { Comment } from '../hole/comment.entity';
import { Reply } from '../hole/reply.entity';
import { Vote } from '../hole/vote.entity';
import { VoteItem } from '../hole/VoteItem.entity';

export enum Gender {
  Mele = '男',
  Female = '女',
}

export enum Role {
  User = 'user',
  Admin = 'admin',
  Banned = 'banned',
}

@Entity()
export class User extends AutoIncIdEntity {
  @Index()
  @Column({ comment: '学号', select: false })
  studentId: string;

  @Index()
  @Column({ comment: '用户名' })
  username: string;

  @Column({ comment: '密码', select: false })
  password: string;

  @Column({ comment: '教务系统密码', select: false })
  sxauPassword: string;

  @Column({ comment: '性别', type: 'enum', enum: Gender, select: false })
  gender: Gender;

  @Column({ comment: '角色权限', type: 'enum', enum: Role, default: Role.User })
  role: Role;

  @Column({ comment: '头像' })
  avatar?: string;

  @OneToMany(() => Hole, (hole) => hole.user, { cascade: true })
  holes: Hole[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @ManyToMany(() => Hole, (hole) => hole.favoriteUsers, { cascade: true })
  @JoinTable()
  favoriteHole: Hole[];

  @ManyToMany(() => Comment, (comment) => comment.favoriteUsers, {
    cascade: true,
  })
  @JoinTable()
  favoriteComment: Comment[];

  @ManyToMany(() => Reply, (reply) => reply.favoriteUsers, { cascade: true })
  @JoinTable()
  favoriteReply: Reply[];

  @OneToMany(() => Reply, (reply) => reply.user)
  replies: Reply[];

  // 被回复的评论
  @OneToMany(() => Reply, (reply) => reply.replyUser)
  repliedReply: Reply[];

  @ManyToMany(() => Vote, (vote) => vote.users, { cascade: true })
  @JoinTable()
  votes: Vote[];

  @ManyToMany(() => VoteItem, (voteItem) => voteItem.users, { cascade: true })
  @JoinTable()
  voteItems: VoteItem[];
}
