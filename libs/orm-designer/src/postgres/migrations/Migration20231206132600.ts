import { Migration } from '@mikro-orm/migrations';

export class Migration20231206132600 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "designer"."assistant" add column "updated_by_id" int null default null;');
    this.addSql(
      'alter table "designer"."assistant" add constraint "assistant_updated_by_id_foreign" foreign key ("updated_by_id") references "identity"."user" ("id") on update cascade on delete set null;'
    );

    this.addSql('alter table "designer"."media_attachment" add column "updated_by_id" int null default null;');
    this.addSql(
      'alter table "designer"."media_attachment" add constraint "media_attachment_updated_by_id_foreign" foreign key ("updated_by_id") references "identity"."user" ("id") on update cascade on delete set null;'
    );

    this.addSql('alter table "designer"."folder" add column "updated_by_id" int null default null;');
    this.addSql(
      'alter table "designer"."folder" add constraint "folder_updated_by_id_foreign" foreign key ("updated_by_id") references "identity"."user" ("id") on update cascade on delete set null;'
    );

    this.addSql('alter table "designer"."response_discriminator" add column "updated_by_id" int null default null;');
    this.addSql(
      'alter table "designer"."response_discriminator" add constraint "response_discriminator_updated_by_id_foreign" foreign key ("updated_by_id") references "identity"."user" ("id") on update cascade on delete set null;'
    );

    this.addSql('alter table "designer"."persona_override" add column "updated_by_id" int null default null;');
    this.addSql(
      'alter table "designer"."persona_override" add constraint "persona_override_updated_by_id_foreign" foreign key ("updated_by_id") references "identity"."user" ("id") on update cascade on delete set null;'
    );

    this.addSql('alter table "designer"."utterance" add column "updated_by_id" int null default null;');
    this.addSql(
      'alter table "designer"."utterance" add constraint "utterance_updated_by_id_foreign" foreign key ("updated_by_id") references "identity"."user" ("id") on update cascade on delete set null;'
    );

    this.addSql('alter table "designer"."function_variable" add column "updated_by_id" int null default null;');
    this.addSql(
      'alter table "designer"."function_variable" add constraint "function_variable_updated_by_id_foreign" foreign key ("updated_by_id") references "identity"."user" ("id") on update cascade on delete set null;'
    );

    this.addSql('alter table "designer"."function_path" add column "updated_by_id" int null default null;');
    this.addSql(
      'alter table "designer"."function_path" add constraint "function_path_updated_by_id_foreign" foreign key ("updated_by_id") references "identity"."user" ("id") on update cascade on delete set null;'
    );

    this.addSql('alter table "designer"."event_mapping" add column "updated_by_id" int null default null;');
    this.addSql(
      'alter table "designer"."event_mapping" add constraint "event_mapping_updated_by_id_foreign" foreign key ("updated_by_id") references "identity"."user" ("id") on update cascade on delete set null;'
    );

    this.addSql(
      'alter table "designer"."required_entity" add column "updated_at" timestamptz(0) not null default now(), add column "updated_by_id" int null default null;'
    );
    this.addSql(
      'alter table "designer"."required_entity" add constraint "required_entity_updated_by_id_foreign" foreign key ("updated_by_id") references "identity"."user" ("id") on update cascade on delete set null;'
    );

    this.addSql('alter table "designer"."entity_variant" add column "updated_by_id" int null default null;');
    this.addSql(
      'alter table "designer"."entity_variant" add constraint "entity_variant_updated_by_id_foreign" foreign key ("updated_by_id") references "identity"."user" ("id") on update cascade on delete set null;'
    );

    this.addSql('alter table "designer"."card_attachment" add column "updated_by_id" int null default null;');
    this.addSql(
      'alter table "designer"."card_attachment" add constraint "card_attachment_updated_by_id_foreign" foreign key ("updated_by_id") references "identity"."user" ("id") on update cascade on delete set null;'
    );

    this.addSql('alter table "designer"."card_button" add column "updated_by_id" int null default null;');
    this.addSql(
      'alter table "designer"."card_button" add constraint "card_button_updated_by_id_foreign" foreign key ("updated_by_id") references "identity"."user" ("id") on update cascade on delete set null;'
    );

    this.addSql('alter table "designer"."trigger" add column "updated_by_id" int null default null;');
    this.addSql(
      'alter table "designer"."trigger" add constraint "trigger_updated_by_id_foreign" foreign key ("updated_by_id") references "identity"."user" ("id") on update cascade on delete set null;'
    );

    this.addSql('alter table "designer"."condition" add column "updated_by_id" int null default null;');
    this.addSql(
      'alter table "designer"."condition" add constraint "condition_updated_by_id_foreign" foreign key ("updated_by_id") references "identity"."user" ("id") on update cascade on delete set null;'
    );

    this.addSql('alter table "designer"."condition_predicate" add column "updated_by_id" int null default null;');
    this.addSql(
      'alter table "designer"."condition_predicate" add constraint "condition_predicate_updated_by_id_foreign" foreign key ("updated_by_id") references "identity"."user" ("id") on update cascade on delete set null;'
    );

    this.addSql('alter table "designer"."condition_assertion" add column "updated_by_id" int null default null;');
    this.addSql(
      'alter table "designer"."condition_assertion" add constraint "condition_assertion_updated_by_id_foreign" foreign key ("updated_by_id") references "identity"."user" ("id") on update cascade on delete set null;'
    );

    this.addSql('alter table "designer"."response_variant" add column "updated_by_id" int null default null;');
    this.addSql(
      'alter table "designer"."response_variant" add constraint "response_variant_updated_by_id_foreign" foreign key ("updated_by_id") references "identity"."user" ("id") on update cascade on delete set null;'
    );
  }

  async down(): Promise<void> {
    this.addSql('alter table "designer"."assistant" drop constraint "assistant_updated_by_id_foreign";');

    this.addSql('alter table "designer"."media_attachment" drop constraint "media_attachment_updated_by_id_foreign";');

    this.addSql('alter table "designer"."folder" drop constraint "folder_updated_by_id_foreign";');

    this.addSql(
      'alter table "designer"."response_discriminator" drop constraint "response_discriminator_updated_by_id_foreign";'
    );

    this.addSql('alter table "designer"."persona_override" drop constraint "persona_override_updated_by_id_foreign";');

    this.addSql('alter table "designer"."utterance" drop constraint "utterance_updated_by_id_foreign";');

    this.addSql(
      'alter table "designer"."function_variable" drop constraint "function_variable_updated_by_id_foreign";'
    );

    this.addSql('alter table "designer"."function_path" drop constraint "function_path_updated_by_id_foreign";');

    this.addSql('alter table "designer"."event_mapping" drop constraint "event_mapping_updated_by_id_foreign";');

    this.addSql('alter table "designer"."required_entity" drop constraint "required_entity_updated_by_id_foreign";');

    this.addSql('alter table "designer"."entity_variant" drop constraint "entity_variant_updated_by_id_foreign";');

    this.addSql('alter table "designer"."card_attachment" drop constraint "card_attachment_updated_by_id_foreign";');

    this.addSql('alter table "designer"."card_button" drop constraint "card_button_updated_by_id_foreign";');

    this.addSql('alter table "designer"."trigger" drop constraint "trigger_updated_by_id_foreign";');

    this.addSql('alter table "designer"."condition" drop constraint "condition_updated_by_id_foreign";');

    this.addSql(
      'alter table "designer"."condition_predicate" drop constraint "condition_predicate_updated_by_id_foreign";'
    );

    this.addSql(
      'alter table "designer"."condition_assertion" drop constraint "condition_assertion_updated_by_id_foreign";'
    );

    this.addSql('alter table "designer"."response_variant" drop constraint "response_variant_updated_by_id_foreign";');

    this.addSql('alter table "designer"."assistant" drop column "updated_by_id";');

    this.addSql('alter table "designer"."media_attachment" drop column "updated_by_id";');

    this.addSql('alter table "designer"."folder" drop column "updated_by_id";');

    this.addSql('alter table "designer"."response_discriminator" drop column "updated_by_id";');

    this.addSql('alter table "designer"."persona_override" drop column "updated_by_id";');

    this.addSql('alter table "designer"."utterance" drop column "updated_by_id";');

    this.addSql('alter table "designer"."function_variable" drop column "updated_by_id";');

    this.addSql('alter table "designer"."function_path" drop column "updated_by_id";');

    this.addSql('alter table "designer"."event_mapping" drop column "updated_by_id";');

    this.addSql('alter table "designer"."required_entity" drop column "updated_at";');
    this.addSql('alter table "designer"."required_entity" drop column "updated_by_id";');

    this.addSql('alter table "designer"."entity_variant" drop column "updated_by_id";');

    this.addSql('alter table "designer"."card_attachment" drop column "updated_by_id";');

    this.addSql('alter table "designer"."card_button" drop column "updated_by_id";');

    this.addSql('alter table "designer"."trigger" drop column "updated_by_id";');

    this.addSql('alter table "designer"."condition" drop column "updated_by_id";');

    this.addSql('alter table "designer"."condition_predicate" drop column "updated_by_id";');

    this.addSql('alter table "designer"."condition_assertion" drop column "updated_by_id";');

    this.addSql('alter table "designer"."response_variant" drop column "updated_by_id";');
  }
}
