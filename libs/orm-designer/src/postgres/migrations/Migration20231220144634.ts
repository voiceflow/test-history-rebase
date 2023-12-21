import { Migration } from '@mikro-orm/migrations';

export class Migration20231220144634 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "designer"."folder" drop constraint if exists "folder_scope_check";');

    this.addSql(
      'alter table "designer"."assistant" alter column "active_environment_id" type varchar(24) using ("active_environment_id"::varchar(24));'
    );
    this.addSql('alter table "designer"."assistant" alter column "active_environment_id" drop not null;');

    this.addSql(
      'alter table "designer"."folder" alter column "environment_id" type varchar(24) using ("environment_id"::varchar(24));'
    );
    this.addSql('alter table "designer"."folder" alter column "environment_id" set not null;');
    this.addSql('alter table "designer"."folder" alter column "scope" type text using ("scope"::text);');
    this.addSql(
      "alter table \"designer\".\"folder\" add constraint \"folder_scope_check\" check (\"scope\" in ('entity', 'event', 'flow', 'function', 'intent', 'prompt', 'persona', 'response', 'story', 'variable', 'knowledge-base'));"
    );

    this.addSql(
      'alter table "designer"."variable" alter column "environment_id" type varchar(24) using ("environment_id"::varchar(24));'
    );
    this.addSql('alter table "designer"."variable" alter column "environment_id" set not null;');

    this.addSql(
      'alter table "designer"."response" alter column "environment_id" type varchar(24) using ("environment_id"::varchar(24));'
    );
    this.addSql('alter table "designer"."response" alter column "environment_id" set not null;');

    this.addSql(
      'alter table "designer"."persona" alter column "environment_id" type varchar(24) using ("environment_id"::varchar(24));'
    );
    this.addSql('alter table "designer"."persona" alter column "environment_id" set not null;');

    this.addSql(
      'alter table "designer"."prompt" alter column "environment_id" type varchar(24) using ("environment_id"::varchar(24));'
    );
    this.addSql('alter table "designer"."prompt" alter column "environment_id" set not null;');

    this.addSql(
      'alter table "designer"."intent" alter column "environment_id" type varchar(24) using ("environment_id"::varchar(24));'
    );
    this.addSql('alter table "designer"."intent" alter column "environment_id" set not null;');

    this.addSql(
      'alter table "designer"."function" alter column "environment_id" type varchar(24) using ("environment_id"::varchar(24));'
    );
    this.addSql('alter table "designer"."function" alter column "environment_id" set not null;');

    this.addSql(
      'alter table "designer"."flow" alter column "environment_id" type varchar(24) using ("environment_id"::varchar(24));'
    );
    this.addSql('alter table "designer"."flow" alter column "environment_id" set not null;');

    this.addSql(
      'alter table "designer"."story" alter column "environment_id" type varchar(24) using ("environment_id"::varchar(24));'
    );
    this.addSql('alter table "designer"."story" alter column "environment_id" set not null;');

    this.addSql(
      'alter table "designer"."event" alter column "environment_id" type varchar(24) using ("environment_id"::varchar(24));'
    );
    this.addSql('alter table "designer"."event" alter column "environment_id" set not null;');

    this.addSql(
      'alter table "designer"."event_mapping" alter column "environment_id" type varchar(24) using ("environment_id"::varchar(24));'
    );
    this.addSql('alter table "designer"."event_mapping" alter column "environment_id" set not null;');

    this.addSql(
      'alter table "designer"."entity" alter column "environment_id" type varchar(24) using ("environment_id"::varchar(24));'
    );
    this.addSql('alter table "designer"."entity" alter column "environment_id" set not null;');

    this.addSql(
      'alter table "designer"."required_entity" alter column "environment_id" type varchar(24) using ("environment_id"::varchar(24));'
    );
    this.addSql('alter table "designer"."required_entity" alter column "environment_id" set not null;');

    this.addSql(
      'alter table "designer"."card_attachment" alter column "environment_id" type varchar(24) using ("environment_id"::varchar(24));'
    );
    this.addSql('alter table "designer"."card_attachment" alter column "environment_id" set not null;');

    this.addSql(
      'alter table "designer"."trigger" alter column "environment_id" type varchar(24) using ("environment_id"::varchar(24));'
    );
    this.addSql('alter table "designer"."trigger" alter column "environment_id" set not null;');

    this.addSql(
      'alter table "designer"."condition" alter column "environment_id" type varchar(24) using ("environment_id"::varchar(24));'
    );
    this.addSql('alter table "designer"."condition" alter column "environment_id" set not null;');

    this.addSql(
      'alter table "designer"."response_variant" alter column "environment_id" type varchar(24) using ("environment_id"::varchar(24));'
    );
    this.addSql('alter table "designer"."response_variant" alter column "environment_id" set not null;');

    this.addSql(
      'alter table "designer"."response_attachment" alter column "environment_id" type varchar(24) using ("environment_id"::varchar(24));'
    );
    this.addSql('alter table "designer"."response_attachment" alter column "environment_id" set not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "designer"."folder" drop constraint if exists "folder_scope_check";');

    this.addSql(
      'alter table "designer"."assistant" alter column "active_environment_id" type varchar(24) using ("active_environment_id"::varchar(24));'
    );
    this.addSql('alter table "designer"."assistant" alter column "active_environment_id" set not null;');

    this.addSql(
      'alter table "designer"."folder" alter column "environment_id" type varchar(24) using ("environment_id"::varchar(24));'
    );
    this.addSql('alter table "designer"."folder" alter column "environment_id" drop not null;');
    this.addSql('alter table "designer"."folder" alter column "scope" type text using ("scope"::text);');
    this.addSql(
      "alter table \"designer\".\"folder\" add constraint \"folder_scope_check\" check (\"scope\" in ('entity', 'event', 'flow', 'function', 'intent', 'prompt', 'persona', 'response', 'story', 'variable'));"
    );

    this.addSql(
      'alter table "designer"."variable" alter column "environment_id" type varchar(24) using ("environment_id"::varchar(24));'
    );
    this.addSql('alter table "designer"."variable" alter column "environment_id" drop not null;');

    this.addSql(
      'alter table "designer"."response" alter column "environment_id" type varchar(24) using ("environment_id"::varchar(24));'
    );
    this.addSql('alter table "designer"."response" alter column "environment_id" drop not null;');

    this.addSql(
      'alter table "designer"."persona" alter column "environment_id" type varchar(24) using ("environment_id"::varchar(24));'
    );
    this.addSql('alter table "designer"."persona" alter column "environment_id" drop not null;');

    this.addSql(
      'alter table "designer"."prompt" alter column "environment_id" type varchar(24) using ("environment_id"::varchar(24));'
    );
    this.addSql('alter table "designer"."prompt" alter column "environment_id" drop not null;');

    this.addSql(
      'alter table "designer"."intent" alter column "environment_id" type varchar(24) using ("environment_id"::varchar(24));'
    );
    this.addSql('alter table "designer"."intent" alter column "environment_id" drop not null;');

    this.addSql(
      'alter table "designer"."function" alter column "environment_id" type varchar(24) using ("environment_id"::varchar(24));'
    );
    this.addSql('alter table "designer"."function" alter column "environment_id" drop not null;');

    this.addSql(
      'alter table "designer"."flow" alter column "environment_id" type varchar(24) using ("environment_id"::varchar(24));'
    );
    this.addSql('alter table "designer"."flow" alter column "environment_id" drop not null;');

    this.addSql(
      'alter table "designer"."story" alter column "environment_id" type varchar(24) using ("environment_id"::varchar(24));'
    );
    this.addSql('alter table "designer"."story" alter column "environment_id" drop not null;');

    this.addSql(
      'alter table "designer"."event" alter column "environment_id" type varchar(24) using ("environment_id"::varchar(24));'
    );
    this.addSql('alter table "designer"."event" alter column "environment_id" drop not null;');

    this.addSql(
      'alter table "designer"."event_mapping" alter column "environment_id" type varchar(24) using ("environment_id"::varchar(24));'
    );
    this.addSql('alter table "designer"."event_mapping" alter column "environment_id" drop not null;');

    this.addSql(
      'alter table "designer"."entity" alter column "environment_id" type varchar(24) using ("environment_id"::varchar(24));'
    );
    this.addSql('alter table "designer"."entity" alter column "environment_id" drop not null;');

    this.addSql(
      'alter table "designer"."required_entity" alter column "environment_id" type varchar(24) using ("environment_id"::varchar(24));'
    );
    this.addSql('alter table "designer"."required_entity" alter column "environment_id" drop not null;');

    this.addSql(
      'alter table "designer"."card_attachment" alter column "environment_id" type varchar(24) using ("environment_id"::varchar(24));'
    );
    this.addSql('alter table "designer"."card_attachment" alter column "environment_id" drop not null;');

    this.addSql(
      'alter table "designer"."trigger" alter column "environment_id" type varchar(24) using ("environment_id"::varchar(24));'
    );
    this.addSql('alter table "designer"."trigger" alter column "environment_id" drop not null;');

    this.addSql(
      'alter table "designer"."condition" alter column "environment_id" type varchar(24) using ("environment_id"::varchar(24));'
    );
    this.addSql('alter table "designer"."condition" alter column "environment_id" drop not null;');

    this.addSql(
      'alter table "designer"."response_variant" alter column "environment_id" type varchar(24) using ("environment_id"::varchar(24));'
    );
    this.addSql('alter table "designer"."response_variant" alter column "environment_id" drop not null;');

    this.addSql(
      'alter table "designer"."response_attachment" alter column "environment_id" type varchar(24) using ("environment_id"::varchar(24));'
    );
    this.addSql('alter table "designer"."response_attachment" alter column "environment_id" drop not null;');
  }
}
