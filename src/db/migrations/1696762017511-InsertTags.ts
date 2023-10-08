import { MigrationInterface, QueryRunner } from "typeorm";

export class InsertTags1696762017511 implements MigrationInterface {
  name = "InsertTags1696762017511";
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO tags (name)
      VALUES
      ('welcome'),
      ('implementations'),
      ('introduction'),
      ('codebaseShow'),
      ('ipsum'),
      ('qui'),
      ('cupiditate'),
      ('et'),
      ('quia'),
      ('deserunt');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM tags
      WHERE name IN 
      ('welcome', 'implementations', 'introduction', 'codebaseShow', 'ipsum', 'qui', 'cupiditate', 'et', 'quia', 'deserunt');
    `);
  }
}
