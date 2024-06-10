import { Migration } from '@mikro-orm/migrations';

export class Migration20240610141832 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "designer"."response_variant" drop constraint if exists "response_variant_type_check";');

    this.addSql(
      'alter table "designer"."response" add column "type" text check ("type" in (\'prompt\', \'text\')) null default \'text\';'
    );

    this.addSql('alter table "designer"."response_variant" alter column "type" type text using ("type"::text);');
    this.addSql(
      'alter table "designer"."response_variant" add constraint "response_variant_type_check" check ("type" in (\'prompt\', \'text\'));'
    );
    this.addSql('alter table "designer"."response_variant" alter column "type" set default \'text\';');
    this.addSql('alter table "designer"."response_variant" alter column "type" drop not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "designer"."response_variant" drop constraint if exists "response_variant_type_check";');

    this.addSql('alter table "designer"."response" drop column "type";');

    this.addSql('alter table "designer"."response_variant" alter column "type" drop default;');
    this.addSql('alter table "designer"."response_variant" alter column "type" type text using ("type"::text);');
    this.addSql(
      'alter table "designer"."response_variant" add constraint "response_variant_type_check" check ("type" in (\'prompt\', \'text\'));'
    );
    this.addSql('alter table "designer"."response_variant" alter column "type" set not null;');
  }
}
