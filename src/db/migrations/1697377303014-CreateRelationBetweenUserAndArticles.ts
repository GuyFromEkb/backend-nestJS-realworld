import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateRelationBetweenUserAndArticles1697377303014 implements MigrationInterface {
  name = "CreateRelationBetweenUserAndArticles1697377303014";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ADD "favoritesId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_8c5bb8649ae04edcfaf93d57574" FOREIGN KEY ("favoritesId") REFERENCES "articles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_8c5bb8649ae04edcfaf93d57574"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "favoritesId"`);
  }
}
