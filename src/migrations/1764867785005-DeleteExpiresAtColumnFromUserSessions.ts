import { MigrationInterface, QueryRunner } from "typeorm";

export class DeleteExpiresAtColumnFromUserSessions1764867785005 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE user_sessions
            DROP COLUMN expires_at;
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
         await queryRunner.query(`
            ALTER TABLE user_sessions
            ADD expires_at datetime;
        `)
    }

}
