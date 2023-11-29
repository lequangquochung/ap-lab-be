import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitDatabase1601348305050 implements MigrationInterface {
  name = 'InitDatabase1601348305050';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.query(
    //   "CREATE TABLE if not exists `user` (`id` int UNSIGNED NOT NULL AUTO_INCREMENT, `username` varchar(100) NOT NULL, `password` text NOT NULL, `full_name` varchar(255) NULL, `email` varchar(255) NULL, `phone_number` varchar(20) NULL, `avatar` varchar(255) NULL, `status` tinyint NOT NULL COMMENT '0: Inactive, 1: Active.' DEFAULT 1, `role_id` tinyint NOT NULL, `created_date` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `last_logged` datetime NULL, `last_change_pass` datetime NULL, `modified_date` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `refresh_token` text NULL, UNIQUE INDEX `IDX_78a916df40e02a9deb1c4b75ed` (`username`), UNIQUE INDEX `IDX_e12875dfb3b1d92d7d7c5377e2` (`email`), UNIQUE INDEX `IDX_29fd51e9cf9241d022c5a4e02e` (`phone_number`), PRIMARY KEY (`id`)) ENGINE=InnoDB"
    // );S
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.query('ALTER TABLE `role_permission` DROP FOREIGN KEY `FK_3d0a7155eafd75ddba5a7013368`');
    // await queryRunner.query('DROP TABLE `user_permission`');
    // await queryRunner.query('DROP INDEX `IDX_29fd51e9cf9241d022c5a4e02e` ON `user`');
    // await queryRunner.query('DROP INDEX `IDX_e12875dfb3b1d92d7d7c5377e2` ON `user`');
    // await queryRunner.query('DROP INDEX `IDX_78a916df40e02a9deb1c4b75ed` ON `user`');
    // await queryRunner.query('DROP TABLE `user`');
    // await queryRunner.query('DROP TABLE `role_permission`');
    // await queryRunner.query('DROP INDEX `IDX_4810bc474fe6394c6f58cb7c9e` ON `role`');
    // await queryRunner.query('DROP TABLE `role`');
    // await queryRunner.query('DROP INDEX `IDX_032c209da98ae7c1a915b51c27` ON `permission_group`');
    // await queryRunner.query('DROP TABLE `permission_group`');
    // await queryRunner.query('DROP TABLE `permission`');
    // await queryRunner.query('DROP TABLE `member`');
    // await queryRunner.query('DROP TABLE `language_static_by_lang`');
    // await queryRunner.query('DROP TABLE `language_static_by_env`');
    // await queryRunner.query('DROP TABLE `language_static`');
    // await queryRunner.query('DROP TABLE `language_env`');
    // await queryRunner.query('DROP TABLE `language`');
  }
}
