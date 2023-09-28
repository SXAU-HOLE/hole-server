import { SnowflakeIdv1 } from 'simple-flakeid';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export const snowflake = new SnowflakeIdv1({
  workerId: 1,
});

@Entity()
export class CommonEntity {
  @Index()
  @PrimaryColumn({
    type: 'bigint',
    unsigned: true, // 无符号
  })
  id: string | number = snowflake.NextBigId().toString();

  @CreateDateColumn({
    type: 'timestamp',
    comment: '创建时间',
    name: 'create_at',
  })
  createAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    name: 'update_date',
    comment: '更新时间',
    select: false,
  })
  updateAt: Date;
}

export class AutoIncIdEntity {
  @PrimaryGeneratedColumn()
  @Index()
  id: number;

  @CreateDateColumn({
    type: 'timestamp',
    comment: '创建时间',
    name: 'create_at',
  })
  createAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    name: 'update_date',
    comment: '更新时间',
    select: false,
  })
  updateAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    name: 'delete_date',
    comment: '删除时间',
    select: false,
  })
  deleteAt: Date;

  @Column('boolean', {
    default: false,
    name: 'is_hidden',
    comment: '是否隐藏',
    select: false,
  })
  isHidden: boolean;
}
