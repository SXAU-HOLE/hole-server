import { IsString } from "class-validator";
import { PaginateQuery } from "src/common/dto/paginate.dto";

export class SearchQuery extends PaginateQuery {
  @IsString()
  keywords: string
}
