import { Migration } from '@mikro-orm/migrations';

export class Migration20231128162047 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "designer"."intent" alter column "id" type varchar(64) using ("id"::varchar(64));');

    this.addSql(
      'alter table "designer"."utterance" alter column "intent_id" type varchar(64) using ("intent_id"::varchar(64));'
    );

    this.addSql(
      'alter table "designer"."required_entity" alter column "intent_id" type varchar(64) using ("intent_id"::varchar(64));'
    );

    this.addSql(
      'alter table "designer"."trigger" alter column "intent_id" type varchar(64) using ("intent_id"::varchar(64));'
    );
  }

  async down(): Promise<void> {
    this.addSql('alter table "designer"."intent" alter column "id" type varchar(24) using ("id"::varchar(24));');

    this.addSql(
      'alter table "designer"."utterance" alter column "intent_id" type varchar(24) using ("intent_id"::varchar(24));'
    );

    this.addSql(
      'alter table "designer"."required_entity" alter column "intent_id" type varchar(24) using ("intent_id"::varchar(24));'
    );

    this.addSql(
      'alter table "designer"."trigger" alter column "intent_id" type varchar(24) using ("intent_id"::varchar(24));'
    );
  }
}
