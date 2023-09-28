import { snowflake } from 'src/common/entity/common.entity';

for (let i = 0; i < 100; i++) {
  console.log(snowflake.NextBigId().toString());
}
