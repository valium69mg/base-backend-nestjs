import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserSessionsTable1764857859729 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`
                CREATE TABLE \`user_sessions\` (
                    \`session_id\` varchar(36) NOT NULL,
                    \`user_id\` varchar(36) NOT NULL,
                    \`refresh_token\` varchar(255) NOT NULL,
                    \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    \`expires_at\` datetime NOT NULL,
                    PRIMARY KEY (\`session_id\`),
                    FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`user_id\`) ON DELETE CASCADE
                ) ENGINE=InnoDB
                `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`user_sessions\``);
    }

}
