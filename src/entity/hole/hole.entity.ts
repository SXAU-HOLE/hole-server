import { AutoIncIdEntity } from 'src/common/entity/common.entity';
import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Tags } from './tags.entity';
import { Comment } from './comment.entity';
import { HoleCategoryEntity } from './category/HoleCategory.entity';


@Entity()
export class Hole extends AutoIncIdEntity {
  @Index({
    fulltext: true,
  })
  @Column({ type: 'text', comment: '文章' })
  body: string;

  @Index({
    fulltext: true,
  })
  @Column({ type: 'text', comment: '标题' })
  title: string;

  @Column({ type: 'simple-array', comment: '树洞图片' })
  imgs: string[];

  @ManyToOne(() => User, (user) => user.holes)
  user: User;

  @ManyToMany(() => Tags, (tag) => tag.holes, { eager: true, cascade: true })
  @JoinTable()
  tags: Tags[];

  @OneToMany(() => Comment, (comment) => comment.hole)
  comments: Comment[];

  @Column({ default: 0, comment: '点赞数' })
  @Index()
  favoriteCount: number;

  @ManyToMany(() => User, (user) => user.favoriteHole)
  favoriteUsers: User[];

  @ManyToOne(() => HoleCategoryEntity, (category) => category.holes,{ cascade: true})
  category: HoleCategoryEntity

  readonly isLiked?: number;

  readonly commentCounts?: number;

  // TODO reports
}
