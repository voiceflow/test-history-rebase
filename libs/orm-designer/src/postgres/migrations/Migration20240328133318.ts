import { Migration } from '@mikro-orm/migrations';

export class Migration20240328133318 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "designer"."folder" drop constraint if exists "folder_scope_check";');

    this.addSql('alter table "designer"."folder" alter column "scope" type text using ("scope"::text);');
    this.addSql(
      "alter table \"designer\".\"folder\" add constraint \"folder_scope_check\" check (\"scope\" in ('flow', 'event', 'entity', 'intent', 'prompt', 'persona', 'workflow', 'response', 'variable', 'function', 'knowledge-base'));"
    );
  }

  async down(): Promise<void> {
    this.addSql('alter table "designer"."folder" drop constraint if exists "folder_scope_check";');

    this.addSql('alter table "designer"."folder" alter column "scope" type text using ("scope"::text);');
    this.addSql(
      "alter table \"designer\".\"folder\" add constraint \"folder_scope_check\" check (\"scope\" in ('entity', 'event', 'flow', 'function', 'intent', 'prompt', 'persona', 'response', 'story', 'variable', 'knowledge-base'));"
    );
  }
}
