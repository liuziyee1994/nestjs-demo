import { SelectQueryBuilder } from 'typeorm';

export const conditionUtils = <T>(queryBuilder: SelectQueryBuilder<T>, conditions: Record<string, unknown>) => {
  Object.keys(conditions).forEach((key) => {
    if (conditions[key]) {
      // [key]会取key的值做为字段名
      queryBuilder.andWhere(`${key} = :${key}`, { [key]: conditions[key] });
    }
  });

  return queryBuilder;
};