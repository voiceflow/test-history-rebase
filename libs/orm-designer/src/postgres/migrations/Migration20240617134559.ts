import { Migration } from '@mikro-orm/migrations';

export class Migration20240617134559 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "designer"."reference_resource" drop constraint if exists "reference_resource_type_check";'
    );

    this.addSql('alter table "designer"."reference_resource" alter column "type" type text using ("type"::text);');
    this.addSql(
      "alter table \"designer\".\"reference_resource\" add constraint \"reference_resource_type_check\" check (\"type\" in ('node', 'intent', 'prompt', 'message', 'diagram', 'function'));"
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "designer"."reference_resource" drop constraint if exists "reference_resource_type_check";'
    );

    this.addSql('alter table "designer"."reference_resource" alter column "type" type text using ("type"::text);');
    this.addSql(
      "alter table \"designer\".\"reference_resource\" add constraint \"reference_resource_type_check\" check (\"type\" in ('node', 'intent', 'diagram', 'function', 'response'));"
    );
  }
}
