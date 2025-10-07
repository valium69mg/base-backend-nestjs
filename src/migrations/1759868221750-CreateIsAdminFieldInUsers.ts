import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateIsAdminFieldInUsers1759868221750 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE users
      ADD COLUMN isAdmin BOOLEAN NULL
    `);

    await queryRunner.query(`
      UPDATE users
      SET isAdmin = 0
      WHERE isAdmin IS NULL
    `);

    await queryRunner.query(`
      ALTER TABLE users
      MODIFY COLUMN isAdmin BOOLEAN NOT NULL DEFAULT 0
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE users
      DROP COLUMN isAdmin
    `);
  }
}