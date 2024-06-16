import { Migration } from '@mikro-orm/migrations';

export class Migration20240606154418 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "designer"."function" add column "path_order" text[] not null default \'{}\';');
  }

  async down(): Promise<void> {
    this.addSql('alter table "designer"."function" drop column "path_order";');
  }

}
