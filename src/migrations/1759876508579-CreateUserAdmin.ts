import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserAdmin1759876508579 implements MigrationInterface {
    name = 'CreateUserAdmin1759876508579'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`users\` 
            CHANGE \`isAdmin\` \`isAdmin\` tinyint(1) NOT NULL
        `);

        await queryRunner.query(`
            INSERT INTO \`users\` (\`user_id\`, \`email\`, \`password\`, \`created_at\`, \`isAdmin\`) 
            VALUES (
                'edb597ae-2fda-4ad9-843d-9a71973479c9',
                'croman@admin.com',
                '$2b$10$VlwOI3wpcWhgzxEGJG7qtu8PfwtLzgU1w33uqhPruIRoW2MwURirO',
                '2025-10-07 15:55:29',
                1
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM \`users\` 
            WHERE \`user_id\` = 'edb597ae-2fda-4ad9-843d-9a71973479c9'
        `);

        await queryRunner.query(`
            ALTER TABLE \`users\` 
            CHANGE \`isAdmin\` \`isAdmin\` tinyint(1) NOT NULL DEFAULT 0
        `);
    }
}