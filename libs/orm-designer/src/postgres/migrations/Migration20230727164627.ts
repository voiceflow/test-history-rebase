import { Migration } from '@mikro-orm/migrations';

export class Migration20230727164627 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "designer"."response_variant" drop constraint if exists "response_variant_card_layout_check";'
    );

    this.addSql(
      'alter table "designer"."response_variant" alter column "card_layout" type text using ("card_layout"::text);'
    );
    this.addSql(
      'alter table "designer"."response_variant" add constraint "response_variant_card_layout_check" check ("card_layout" in (\'carousel\', \'list\'));'
    );
    this.addSql('alter table "designer"."response_variant" alter column "card_layout" drop not null;');
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "designer"."response_variant" drop constraint if exists "response_variant_card_layout_check";'
    );

    this.addSql(
      'alter table "designer"."response_variant" alter column "card_layout" type text using ("card_layout"::text);'
    );
    this.addSql(
      'alter table "designer"."response_variant" add constraint "response_variant_card_layout_check" check ("card_layout" in (\'carousel\', \'list\'));'
    );
    this.addSql('alter table "designer"."response_variant" alter column "card_layout" set not null;');
  }
}
