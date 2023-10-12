import { Migration } from '@mikro-orm/migrations';

export class Migration20230615111848 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "designer"."response_payload" add column "context" text check ("context" in (\'prompt\', \'memory\', \'knowledge_base\')) null;'
    );
    this.addSql('alter table "designer"."response_payload" drop column "memory_only";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "designer"."response_payload" add column "memory_only" boolean null;');
    this.addSql('alter table "designer"."response_payload" drop column "context";');
  }
}
