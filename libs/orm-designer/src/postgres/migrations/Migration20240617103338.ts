import { Migration } from '@mikro-orm/migrations';

export class Migration20240617103338 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "designer"."reference_resource" drop constraint if exists "reference_resource_type_check";'
    );

    this.addSql('alter table "designer"."reference_resource" alter column "type" type text using ("type"::text);');
    this.addSql(
      "alter table \"designer\".\"reference_resource\" add constraint \"reference_resource_type_check\" check (\"type\" in ('node', 'intent', 'diagram', 'function', 'response'));"
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "designer"."reference_resource" drop constraint if exists "reference_resource_type_check";'
    );

    this.addSql('alter table "designer"."reference_resource" alter column "type" type text using ("type"::text);');
    this.addSql(
      "alter table \"designer\".\"reference_resource\" add constraint \"reference_resource_type_check\" check (\"type\" in ('node', 'flow', 'intent', 'diagram', 'response', 'workflow'));"
    );
  }
}
