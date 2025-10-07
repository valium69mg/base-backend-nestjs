// src/data-source.ts
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config()

const port = process.env.DB_PORT;

if (port === undefined) {   
    throw new Error("Database port is undefined");
}

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(port, 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [],
  //migrations: ['src/migrations/*.ts'],
  synchronize: false,
});