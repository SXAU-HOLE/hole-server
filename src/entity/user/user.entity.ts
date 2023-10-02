import { AutoIncIdEntity } from 'src/common/entity/common.entity';
import { Column, Entity, Index } from 'typeorm';

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
}
