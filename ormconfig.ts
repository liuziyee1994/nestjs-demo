import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
import { ConfigEnum } from './src/enum/config.enum';
import * as process from 'node:process';

function getEnv(env: string): Record<string, unknown> {
  if (fs.existsSync(env)) {
    return dotenv.parse(fs.readFileSync(env));
  }
  return {};
}

function buildDBParams() {
  const defaultConfig = getEnv('.env');
  const envConfig = getEnv(`.env.${process.env.NODE_ENV || 'dev'}`);
  const config = { ...defaultConfig, ...envConfig };

  const entityDir = process.env.NODE_ENV === 'test' ?
    [__dirname + '/**/*.entity.ts'] : [__dirname + '/**/*.entity{.js,.ts}'];

  return {
    type: config[ConfigEnum.DB_TYPE],
    host: config[ConfigEnum.DB_HOST],
    port: config[ConfigEnum.DB_PORT],
    database: config[ConfigEnum.DB_DATABASE],
    username: config[ConfigEnum.DB_USERNAME],
    password: config[ConfigEnum.DB_PASSWORD],
    entities: entityDir,
    synchronize: true,
    logging: process.env.NODE_ENV === 'dev',
  } as TypeOrmModuleOptions;
}

export const dbParams = buildDBParams();

export default new DataSource({
  ...dbParams,
  migrations: ['src/migrations/**'],
  subscribers: [],
} as DataSourceOptions);