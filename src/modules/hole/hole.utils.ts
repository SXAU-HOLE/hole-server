import { SelectQueryBuilder } from 'typeorm';
import { IUser } from '../user/user.controller';
import { Comment } from 'src/entity/hole/comment.entity';
import { Reply } from 'src/entity/hole/reply.entity';

export const addCommentIsLiked = (
  query: SelectQueryBuilder<Comment>,
  reqUser: IUser,
) => {
  query.loadRelationCountAndMap(
    'comment.isLiked',
    'comment.favoriteUsers',
    'isLiked',
    (qb) =>
      qb.andWhere('isLiked.studentId = :studentId', {
        studentId: reqUser,
      }),
  );
};

export const addReplyIsLiked = (
  query: SelectQueryBuilder<Reply>,
  reqUser: IUser,
) => {
  query.loadRelationCountAndMap(
    'reply.isLiked',
    'reply.favoriteUsers',
    'isLiked',
    (qb) =>
      qb.andWhere('isLiked.studentId = :studentId', {
        studentId: reqUser,
      }),
  );
};
