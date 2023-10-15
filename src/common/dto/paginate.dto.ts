import { IsNumber, IsPositive, Max } from 'class-validator';

export class PaginateQuery {
  limit: number = 10;

  page: number = 1;
}
