import { Migration } from '@mikro-orm/migrations';

export class Migration20240515115632 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "designer"."condition" add column "assertions" jsonb null default \'[]\';');
  }

  async down(): Promise<void> {
    this.addSql('alter table "designer"."condition" drop column "assertions";');
  }
}
