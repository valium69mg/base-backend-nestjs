// src/data-source.ts
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from './users/users.entity';
import { UserSession } from './users/users_session.entity';

dotenv.config();

const port = process.env.DB_PORT;

if (port === undefined) {
  throw new Error('Database port is undefined');
}

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(port, 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [User, UserSession],
  //migrations: ['src/migrations/*.ts'],
  synchronize: false,
});
