import { Migration } from '@mikro-orm/migrations';

export class Migration20240513113231 extends Migration {
  async up(): Promise<void> {
    this.addSql('create index "media_attachment_environment_id_index" on "designer"."media_attachment" ("environment_id");');

    this.addSql('create index "prompt_environment_id_index" on "designer"."prompt" ("environment_id");');

    this.addSql('create index "function_path_environment_id_index" on "designer"."function_path" ("environment_id");');

    this.addSql('alter table "designer"."entity" add constraint "entity_id_environment_id_unique" unique ("id", "environment_id");');

    this.addSql(
      'alter table "designer"."required_entity" add constraint "required_entity_id_environment_id_unique" unique ("id", "environment_id");'
    );

    this.addSql('alter table "designer"."entity_variant" add constraint "entity_variant_id_environment_id_unique" unique ("id", "environment_id");');

    this.addSql('create index "response_attachment_environment_id_index" on "designer"."response_attachment" ("environment_id");');
  }

  async down(): Promise<void> {
    this.addSql('drop index "designer"."media_attachment_environment_id_index";');

    this.addSql('drop index "designer"."prompt_environment_id_index";');

    this.addSql('drop index "designer"."function_path_environment_id_index";');

    this.addSql('alter table "designer"."entity" drop constraint "entity_id_environment_id_unique";');

    this.addSql('alter table "designer"."required_entity" drop constraint "required_entity_id_environment_id_unique";');

    this.addSql('alter table "designer"."entity_variant" drop constraint "entity_variant_id_environment_id_unique";');

    this.addSql('drop index "designer"."response_attachment_environment_id_index";');
  }
}
