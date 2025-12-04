import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifyRefreshTokenTypeToText1764867667775 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE user_sessions MODIFY refresh_token TEXT;
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE user_sessions MODIFY refresh_token VARCHAR(255);
        `)
    }

}
