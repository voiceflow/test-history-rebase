import { Migration } from '@mikro-orm/migrations';

export class Migration20230727155559 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "designer"."response_variant" alter column "speed" type int using ("speed"::int);');
    this.addSql('alter table "designer"."response_variant" alter column "speed" drop not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "designer"."response_variant" alter column "speed" type int using ("speed"::int);');
    this.addSql('alter table "designer"."response_variant" alter column "speed" set not null;');
  }
}
