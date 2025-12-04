import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIvToUserSessions1764865991684 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`
            ALTER TABLE user_sessions
            ADD iv VARCHAR(255);
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE user_sessions
            DROP COLUMN iv;
        `);
    }

}
