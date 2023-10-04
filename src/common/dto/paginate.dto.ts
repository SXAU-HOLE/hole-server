import { IsNumber, IsPositive, Max } from 'class-validator';

export class PaginateQuery {
  @Max(50)
  @IsPositive()
  @IsNumber()
  limit: number = 10;

  @IsPositive()
  @IsNumber()
  page: number = 1;
}
