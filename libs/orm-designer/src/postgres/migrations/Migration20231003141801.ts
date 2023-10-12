import { Migration } from '@mikro-orm/migrations';

export class Migration20231003141801 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "designer"."assistant" drop constraint "assistant_active_persona_id_foreign";');

    this.addSql('alter table "designer"."folder" drop constraint "folder_parent_id_foreign";');

    this.addSql('alter table "designer"."variable" drop constraint "variable_folder_id_foreign";');

    this.addSql('alter table "designer"."response" drop constraint "response_folder_id_foreign";');

    this.addSql(
      'alter table "designer"."response_discriminator" drop constraint "response_discriminator_response_id_foreign";'
    );

    this.addSql('alter table "designer"."persona" drop constraint "persona_folder_id_foreign";');

    this.addSql('alter table "designer"."persona_override" drop constraint "persona_override_persona_id_foreign";');

    this.addSql('alter table "designer"."prompt" drop constraint "prompt_folder_id_foreign";');
    this.addSql('alter table "designer"."prompt" drop constraint "prompt_persona_id_foreign";');

    this.addSql('alter table "designer"."intent" drop constraint "intent_folder_id_foreign";');

    this.addSql('alter table "designer"."utterance" drop constraint "utterance_intent_id_foreign";');

    this.addSql('alter table "designer"."function" drop constraint "function_folder_id_foreign";');

    this.addSql('alter table "designer"."function_variable" drop constraint "function_variable_function_id_foreign";');

    this.addSql('alter table "designer"."function_path" drop constraint "function_path_function_id_foreign";');

    this.addSql('alter table "designer"."flow" drop constraint "flow_folder_id_foreign";');

    this.addSql('alter table "designer"."story" drop constraint "story_folder_id_foreign";');
    this.addSql('alter table "designer"."story" drop constraint "story_flow_id_foreign";');

    this.addSql('alter table "designer"."event" drop constraint "event_folder_id_foreign";');

    this.addSql('alter table "designer"."event_mapping" drop constraint "event_mapping_event_id_foreign";');
    this.addSql('alter table "designer"."event_mapping" drop constraint "event_mapping_variable_id_foreign";');

    this.addSql('alter table "designer"."entity" drop constraint "entity_folder_id_foreign";');

    this.addSql('alter table "designer"."required_entity" drop constraint "required_entity_entity_id_foreign";');
    this.addSql('alter table "designer"."required_entity" drop constraint "required_entity_intent_id_foreign";');
    this.addSql('alter table "designer"."required_entity" drop constraint "required_entity_reprompt_id_foreign";');

    this.addSql('alter table "designer"."entity_variant" drop constraint "entity_variant_entity_id_foreign";');

    this.addSql('alter table "designer"."card_attachment" drop constraint "card_attachment_media_id_foreign";');

    this.addSql('alter table "designer"."card_button" drop constraint "card_button_card_id_foreign";');

    this.addSql('alter table "designer"."trigger" drop constraint "trigger_story_id_foreign";');
    this.addSql('alter table "designer"."trigger" drop constraint "trigger_event_id_foreign";');
    this.addSql('alter table "designer"."trigger" drop constraint "trigger_intent_id_foreign";');

    this.addSql('alter table "designer"."condition" drop constraint "condition_prompt_id_foreign";');

    this.addSql(
      'alter table "designer"."condition_predicate" drop constraint "condition_predicate_condition_id_foreign";'
    );

    this.addSql(
      'alter table "designer"."condition_assertion" drop constraint "condition_assertion_condition_id_foreign";'
    );

    this.addSql('alter table "designer"."response_variant" drop constraint "response_variant_condition_id_foreign";');
    this.addSql(
      'alter table "designer"."response_variant" drop constraint "response_variant_discriminator_id_foreign";'
    );
    this.addSql('alter table "designer"."response_variant" drop constraint "response_variant_prompt_id_foreign";');

    this.addSql(
      'alter table "designer"."response_attachment" drop constraint "response_attachment_variant_id_foreign";'
    );
    this.addSql('alter table "designer"."response_attachment" drop constraint "response_attachment_card_id_foreign";');
    this.addSql('alter table "designer"."response_attachment" drop constraint "response_attachment_media_id_foreign";');

    this.addSql('alter table "designer"."assistant" add column "active_environment_id" varchar(255) not null;');
    this.addSql('alter table "designer"."assistant" alter column "id" type varchar(24) using ("id"::varchar(24));');
    this.addSql(
      'alter table "designer"."assistant" alter column "active_persona_id" type varchar(24) using ("active_persona_id"::varchar(24));'
    );
    this.addSql('alter table "designer"."assistant" drop constraint "assistant_active_persona_id_unique";');
    this.addSql(
      'alter table "designer"."assistant" add constraint "assistant_active_persona_id_active_environment_id_unique" unique ("active_persona_id", "active_environment_id");'
    );
    this.addSql('alter table "designer"."assistant" add constraint "assistant_id_unique" unique ("id");');

    this.addSql('alter table "designer"."media_attachment" add column "environment_id" varchar(24) not null;');
    this.addSql(
      'alter table "designer"."media_attachment" alter column "id" type varchar(24) using ("id"::varchar(24));'
    );
    this.addSql(
      'alter table "designer"."media_attachment" alter column "assistant_id" type varchar(24) using ("assistant_id"::varchar(24));'
    );
    this.addSql('alter table "designer"."media_attachment" drop constraint "media_attachment_pkey";');
    this.addSql(
      'alter table "designer"."media_attachment" add constraint "media_attachment_id_environment_id_unique" unique ("id", "environment_id");'
    );
    this.addSql(
      'alter table "designer"."media_attachment" add constraint "media_attachment_pkey" primary key ("id", "environment_id");'
    );

    this.addSql('alter table "designer"."folder" add column "environment_id" varchar(24) null default null;');
    this.addSql('alter table "designer"."folder" alter column "id" type varchar(24) using ("id"::varchar(24));');
    this.addSql(
      'alter table "designer"."folder" alter column "parent_id" type varchar(24) using ("parent_id"::varchar(24));'
    );
    this.addSql(
      'alter table "designer"."folder" alter column "assistant_id" type varchar(24) using ("assistant_id"::varchar(24));'
    );
    this.addSql('alter table "designer"."folder" drop constraint "folder_pkey";');
    this.addSql(
      'alter table "designer"."folder" add constraint "folder_id_environment_id_unique" unique ("id", "environment_id");'
    );
    this.addSql(
      'alter table "designer"."folder" add constraint "folder_parent_id_environment_id_foreign" foreign key ("parent_id", "environment_id") references "designer"."folder" ("id", "environment_id") on update cascade on delete set null;'
    );
    this.addSql('alter table "designer"."folder" add constraint "folder_pkey" primary key ("id", "environment_id");');

    this.addSql('alter table "designer"."variable" add column "environment_id" varchar(24) null default null;');
    this.addSql('alter table "designer"."variable" alter column "id" type varchar(24) using ("id"::varchar(24));');
    this.addSql(
      'alter table "designer"."variable" alter column "folder_id" type varchar(24) using ("folder_id"::varchar(24));'
    );
    this.addSql(
      'alter table "designer"."variable" alter column "assistant_id" type varchar(24) using ("assistant_id"::varchar(24));'
    );
    this.addSql('alter table "designer"."variable" drop constraint "variable_pkey";');
    this.addSql(
      'alter table "designer"."variable" add constraint "variable_folder_id_environment_id_foreign" foreign key ("folder_id", "environment_id") references "designer"."folder" ("id", "environment_id") on update cascade on delete set null;'
    );
    this.addSql(
      'alter table "designer"."variable" add constraint "variable_id_environment_id_unique" unique ("id", "environment_id");'
    );
    this.addSql(
      'alter table "designer"."variable" add constraint "variable_pkey" primary key ("id", "environment_id");'
    );

    this.addSql('alter table "designer"."response" add column "environment_id" varchar(24) null default null;');
    this.addSql('alter table "designer"."response" alter column "id" type varchar(24) using ("id"::varchar(24));');
    this.addSql(
      'alter table "designer"."response" alter column "folder_id" type varchar(24) using ("folder_id"::varchar(24));'
    );
    this.addSql(
      'alter table "designer"."response" alter column "assistant_id" type varchar(24) using ("assistant_id"::varchar(24));'
    );
    this.addSql('alter table "designer"."response" drop constraint "response_pkey";');
    this.addSql(
      'alter table "designer"."response" add constraint "response_folder_id_environment_id_foreign" foreign key ("folder_id", "environment_id") references "designer"."folder" ("id", "environment_id") on update cascade on delete set null;'
    );
    this.addSql(
      'alter table "designer"."response" add constraint "response_id_environment_id_unique" unique ("id", "environment_id");'
    );
    this.addSql(
      'alter table "designer"."response" add constraint "response_pkey" primary key ("id", "environment_id");'
    );

    this.addSql('alter table "designer"."response_discriminator" add column "environment_id" varchar(24) not null;');
    this.addSql(
      'alter table "designer"."response_discriminator" alter column "id" type varchar(24) using ("id"::varchar(24));'
    );
    this.addSql(
      'alter table "designer"."response_discriminator" alter column "response_id" type varchar(24) using ("response_id"::varchar(24));'
    );
    this.addSql(
      'alter table "designer"."response_discriminator" alter column "assistant_id" type varchar(24) using ("assistant_id"::varchar(24));'
    );
    this.addSql('alter table "designer"."response_discriminator" drop constraint "response_discriminator_pkey";');
    this.addSql(
      'alter table "designer"."response_discriminator" add constraint "response_discriminator_response_id_environment_id_foreign" foreign key ("response_id", "environment_id") references "designer"."response" ("id", "environment_id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."response_discriminator" add constraint "response_discriminator_id_environment_id_unique" unique ("id", "environment_id");'
    );
    this.addSql(
      'alter table "designer"."response_discriminator" add constraint "response_discriminator_pkey" primary key ("id", "environment_id");'
    );

    this.addSql('alter table "designer"."persona" add column "environment_id" varchar(24) null default null;');
    this.addSql('alter table "designer"."persona" alter column "id" type varchar(24) using ("id"::varchar(24));');
    this.addSql(
      'alter table "designer"."persona" alter column "folder_id" type varchar(24) using ("folder_id"::varchar(24));'
    );
    this.addSql(
      'alter table "designer"."persona" alter column "assistant_id" type varchar(24) using ("assistant_id"::varchar(24));'
    );
    this.addSql('alter table "designer"."persona" drop constraint "persona_pkey";');
    this.addSql(
      'alter table "designer"."persona" add constraint "persona_folder_id_environment_id_foreign" foreign key ("folder_id", "environment_id") references "designer"."folder" ("id", "environment_id") on update cascade on delete set null;'
    );
    this.addSql(
      'alter table "designer"."persona" add constraint "persona_id_environment_id_unique" unique ("id", "environment_id");'
    );
    this.addSql('alter table "designer"."persona" add constraint "persona_pkey" primary key ("id", "environment_id");');

    this.addSql('alter table "designer"."persona_override" add column "environment_id" varchar(24) not null;');
    this.addSql(
      'alter table "designer"."persona_override" alter column "id" type varchar(24) using ("id"::varchar(24));'
    );
    this.addSql(
      'alter table "designer"."persona_override" alter column "persona_id" type varchar(24) using ("persona_id"::varchar(24));'
    );
    this.addSql(
      'alter table "designer"."persona_override" alter column "assistant_id" type varchar(24) using ("assistant_id"::varchar(24));'
    );
    this.addSql('alter table "designer"."persona_override" drop constraint "persona_override_pkey";');
    this.addSql(
      'alter table "designer"."persona_override" add constraint "persona_override_persona_id_environment_id_foreign" foreign key ("persona_id", "environment_id") references "designer"."persona" ("id", "environment_id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."persona_override" add constraint "persona_override_id_environment_id_unique" unique ("id", "environment_id");'
    );
    this.addSql(
      'alter table "designer"."persona_override" add constraint "persona_override_pkey" primary key ("id", "environment_id");'
    );

    this.addSql('alter table "designer"."prompt" add column "environment_id" varchar(24) null default null;');
    this.addSql('alter table "designer"."prompt" alter column "id" type varchar(24) using ("id"::varchar(24));');
    this.addSql(
      'alter table "designer"."prompt" alter column "folder_id" type varchar(24) using ("folder_id"::varchar(24));'
    );
    this.addSql(
      'alter table "designer"."prompt" alter column "assistant_id" type varchar(24) using ("assistant_id"::varchar(24));'
    );
    this.addSql(
      'alter table "designer"."prompt" alter column "persona_id" type varchar(24) using ("persona_id"::varchar(24));'
    );
    this.addSql('alter table "designer"."prompt" drop constraint "prompt_pkey";');
    this.addSql(
      'alter table "designer"."prompt" add constraint "prompt_folder_id_environment_id_foreign" foreign key ("folder_id", "environment_id") references "designer"."folder" ("id", "environment_id") on update cascade on delete set null;'
    );
    this.addSql(
      'alter table "designer"."prompt" add constraint "prompt_persona_id_environment_id_foreign" foreign key ("persona_id", "environment_id") references "designer"."persona_override" ("id", "environment_id") on update cascade on delete set null;'
    );
    this.addSql(
      'alter table "designer"."prompt" add constraint "prompt_id_environment_id_unique" unique ("id", "environment_id");'
    );
    this.addSql('alter table "designer"."prompt" add constraint "prompt_pkey" primary key ("id", "environment_id");');

    this.addSql('alter table "designer"."intent" add column "environment_id" varchar(24) null default null;');
    this.addSql('alter table "designer"."intent" alter column "id" type varchar(24) using ("id"::varchar(24));');
    this.addSql(
      'alter table "designer"."intent" alter column "folder_id" type varchar(24) using ("folder_id"::varchar(24));'
    );
    this.addSql(
      'alter table "designer"."intent" alter column "assistant_id" type varchar(24) using ("assistant_id"::varchar(24));'
    );
    this.addSql('alter table "designer"."intent" drop constraint "intent_pkey";');
    this.addSql(
      'alter table "designer"."intent" add constraint "intent_folder_id_environment_id_foreign" foreign key ("folder_id", "environment_id") references "designer"."folder" ("id", "environment_id") on update cascade on delete set null;'
    );
    this.addSql(
      'alter table "designer"."intent" add constraint "intent_id_environment_id_unique" unique ("id", "environment_id");'
    );
    this.addSql('alter table "designer"."intent" add constraint "intent_pkey" primary key ("id", "environment_id");');

    this.addSql('alter table "designer"."utterance" add column "environment_id" varchar(24) not null;');
    this.addSql('alter table "designer"."utterance" alter column "id" type varchar(24) using ("id"::varchar(24));');
    this.addSql(
      'alter table "designer"."utterance" alter column "intent_id" type varchar(24) using ("intent_id"::varchar(24));'
    );
    this.addSql(
      'alter table "designer"."utterance" alter column "assistant_id" type varchar(24) using ("assistant_id"::varchar(24));'
    );
    this.addSql('alter table "designer"."utterance" drop constraint "utterance_pkey";');
    this.addSql(
      'alter table "designer"."utterance" add constraint "utterance_intent_id_environment_id_foreign" foreign key ("intent_id", "environment_id") references "designer"."intent" ("id", "environment_id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."utterance" add constraint "utterance_id_environment_id_unique" unique ("id", "environment_id");'
    );
    this.addSql(
      'alter table "designer"."utterance" add constraint "utterance_pkey" primary key ("id", "environment_id");'
    );

    this.addSql('alter table "designer"."function" add column "environment_id" varchar(24) null default null;');
    this.addSql('alter table "designer"."function" alter column "id" type varchar(24) using ("id"::varchar(24));');
    this.addSql(
      'alter table "designer"."function" alter column "folder_id" type varchar(24) using ("folder_id"::varchar(24));'
    );
    this.addSql(
      'alter table "designer"."function" alter column "assistant_id" type varchar(24) using ("assistant_id"::varchar(24));'
    );
    this.addSql('alter table "designer"."function" drop constraint "function_pkey";');
    this.addSql(
      'alter table "designer"."function" add constraint "function_folder_id_environment_id_foreign" foreign key ("folder_id", "environment_id") references "designer"."folder" ("id", "environment_id") on update cascade on delete set null;'
    );
    this.addSql(
      'alter table "designer"."function" add constraint "function_id_environment_id_unique" unique ("id", "environment_id");'
    );
    this.addSql(
      'alter table "designer"."function" add constraint "function_pkey" primary key ("id", "environment_id");'
    );

    this.addSql('alter table "designer"."function_variable" add column "environment_id" varchar(24) not null;');
    this.addSql(
      'alter table "designer"."function_variable" alter column "id" type varchar(24) using ("id"::varchar(24));'
    );
    this.addSql(
      'alter table "designer"."function_variable" alter column "function_id" type varchar(24) using ("function_id"::varchar(24));'
    );
    this.addSql(
      'alter table "designer"."function_variable" alter column "assistant_id" type varchar(24) using ("assistant_id"::varchar(24));'
    );
    this.addSql('alter table "designer"."function_variable" drop constraint "function_variable_pkey";');
    this.addSql(
      'alter table "designer"."function_variable" add constraint "function_variable_function_id_environment_id_foreign" foreign key ("function_id", "environment_id") references "designer"."function" ("id", "environment_id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."function_variable" add constraint "function_variable_id_environment_id_unique" unique ("id", "environment_id");'
    );
    this.addSql(
      'alter table "designer"."function_variable" add constraint "function_variable_pkey" primary key ("id", "environment_id");'
    );

    this.addSql('alter table "designer"."function_path" add column "environment_id" varchar(24) not null;');
    this.addSql('alter table "designer"."function_path" alter column "id" type varchar(24) using ("id"::varchar(24));');
    this.addSql(
      'alter table "designer"."function_path" alter column "function_id" type varchar(24) using ("function_id"::varchar(24));'
    );
    this.addSql(
      'alter table "designer"."function_path" alter column "assistant_id" type varchar(24) using ("assistant_id"::varchar(24));'
    );
    this.addSql('alter table "designer"."function_path" drop constraint "function_path_pkey";');
    this.addSql(
      'alter table "designer"."function_path" add constraint "function_path_function_id_environment_id_foreign" foreign key ("function_id", "environment_id") references "designer"."function" ("id", "environment_id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."function_path" add constraint "function_path_id_environment_id_unique" unique ("id", "environment_id");'
    );
    this.addSql(
      'alter table "designer"."function_path" add constraint "function_path_pkey" primary key ("id", "environment_id");'
    );

    this.addSql('alter table "designer"."flow" add column "environment_id" varchar(24) null default null;');
    this.addSql('alter table "designer"."flow" alter column "id" type varchar(24) using ("id"::varchar(24));');
    this.addSql(
      'alter table "designer"."flow" alter column "folder_id" type varchar(24) using ("folder_id"::varchar(24));'
    );
    this.addSql(
      'alter table "designer"."flow" alter column "assistant_id" type varchar(24) using ("assistant_id"::varchar(24));'
    );
    this.addSql('alter table "designer"."flow" drop constraint "flow_pkey";');
    this.addSql(
      'alter table "designer"."flow" add constraint "flow_folder_id_environment_id_foreign" foreign key ("folder_id", "environment_id") references "designer"."folder" ("id", "environment_id") on update cascade on delete set null;'
    );
    this.addSql(
      'alter table "designer"."flow" add constraint "flow_id_environment_id_unique" unique ("id", "environment_id");'
    );
    this.addSql('alter table "designer"."flow" add constraint "flow_pkey" primary key ("id", "environment_id");');

    this.addSql('alter table "designer"."story" add column "environment_id" varchar(24) null default null;');
    this.addSql('alter table "designer"."story" alter column "id" type varchar(24) using ("id"::varchar(24));');
    this.addSql(
      'alter table "designer"."story" alter column "folder_id" type varchar(24) using ("folder_id"::varchar(24));'
    );
    this.addSql(
      'alter table "designer"."story" alter column "assistant_id" type varchar(24) using ("assistant_id"::varchar(24));'
    );
    this.addSql(
      'alter table "designer"."story" alter column "flow_id" type varchar(24) using ("flow_id"::varchar(24));'
    );
    this.addSql('alter table "designer"."story" drop constraint "story_pkey";');
    this.addSql(
      'alter table "designer"."story" add constraint "story_folder_id_environment_id_foreign" foreign key ("folder_id", "environment_id") references "designer"."folder" ("id", "environment_id") on update cascade on delete set null;'
    );
    this.addSql(
      'alter table "designer"."story" add constraint "story_flow_id_environment_id_foreign" foreign key ("flow_id", "environment_id") references "designer"."flow" ("id", "environment_id") on update cascade on delete set null;'
    );
    this.addSql(
      'alter table "designer"."story" add constraint "story_id_environment_id_unique" unique ("id", "environment_id");'
    );
    this.addSql('alter table "designer"."story" add constraint "story_pkey" primary key ("id", "environment_id");');

    this.addSql('alter table "designer"."event" add column "environment_id" varchar(24) null default null;');
    this.addSql('alter table "designer"."event" alter column "id" type varchar(24) using ("id"::varchar(24));');
    this.addSql(
      'alter table "designer"."event" alter column "folder_id" type varchar(24) using ("folder_id"::varchar(24));'
    );
    this.addSql(
      'alter table "designer"."event" alter column "assistant_id" type varchar(24) using ("assistant_id"::varchar(24));'
    );
    this.addSql('alter table "designer"."event" drop constraint "event_pkey";');
    this.addSql(
      'alter table "designer"."event" add constraint "event_folder_id_environment_id_foreign" foreign key ("folder_id", "environment_id") references "designer"."folder" ("id", "environment_id") on update cascade on delete set null;'
    );
    this.addSql(
      'alter table "designer"."event" add constraint "event_id_environment_id_unique" unique ("id", "environment_id");'
    );
    this.addSql('alter table "designer"."event" add constraint "event_pkey" primary key ("id", "environment_id");');

    this.addSql('alter table "designer"."event_mapping" add column "environment_id" varchar(24) null default null;');
    this.addSql('alter table "designer"."event_mapping" alter column "id" type varchar(24) using ("id"::varchar(24));');
    this.addSql(
      'alter table "designer"."event_mapping" alter column "event_id" type varchar(24) using ("event_id"::varchar(24));'
    );
    this.addSql(
      'alter table "designer"."event_mapping" alter column "variable_id" type varchar(24) using ("variable_id"::varchar(24));'
    );
    this.addSql(
      'alter table "designer"."event_mapping" alter column "assistant_id" type varchar(24) using ("assistant_id"::varchar(24));'
    );
    this.addSql('alter table "designer"."event_mapping" drop constraint "event_mapping_pkey";');
    this.addSql(
      'alter table "designer"."event_mapping" add constraint "event_mapping_event_id_environment_id_foreign" foreign key ("event_id", "environment_id") references "designer"."event" ("id", "environment_id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."event_mapping" add constraint "event_mapping_variable_id_environment_id_foreign" foreign key ("variable_id", "environment_id") references "designer"."variable" ("id", "environment_id") on update cascade on delete set null;'
    );
    this.addSql(
      'alter table "designer"."event_mapping" add constraint "event_mapping_id_environment_id_unique" unique ("id", "environment_id");'
    );
    this.addSql(
      'alter table "designer"."event_mapping" add constraint "event_mapping_pkey" primary key ("id", "environment_id");'
    );

    this.addSql('alter table "designer"."entity" add column "environment_id" varchar(24) null default null;');
    this.addSql('alter table "designer"."entity" alter column "id" type varchar(24) using ("id"::varchar(24));');
    this.addSql(
      'alter table "designer"."entity" alter column "folder_id" type varchar(24) using ("folder_id"::varchar(24));'
    );
    this.addSql(
      'alter table "designer"."entity" alter column "assistant_id" type varchar(24) using ("assistant_id"::varchar(24));'
    );
    this.addSql('alter table "designer"."entity" drop constraint "entity_pkey";');
    this.addSql(
      'alter table "designer"."entity" add constraint "entity_folder_id_environment_id_foreign" foreign key ("folder_id", "environment_id") references "designer"."folder" ("id", "environment_id") on update cascade on delete set null;'
    );
    this.addSql('alter table "designer"."entity" add constraint "entity_pkey" primary key ("id", "environment_id");');

    this.addSql('alter table "designer"."required_entity" add column "environment_id" varchar(24) null default null;');
    this.addSql(
      'alter table "designer"."required_entity" alter column "id" type varchar(24) using ("id"::varchar(24));'
    );
    this.addSql(
      'alter table "designer"."required_entity" alter column "entity_id" type varchar(24) using ("entity_id"::varchar(24));'
    );
    this.addSql(
      'alter table "designer"."required_entity" alter column "intent_id" type varchar(24) using ("intent_id"::varchar(24));'
    );
    this.addSql(
      'alter table "designer"."required_entity" alter column "reprompt_id" type varchar(24) using ("reprompt_id"::varchar(24));'
    );
    this.addSql(
      'alter table "designer"."required_entity" alter column "assistant_id" type varchar(24) using ("assistant_id"::varchar(24));'
    );
    this.addSql('alter table "designer"."required_entity" drop constraint "required_entity_pkey";');
    this.addSql(
      'alter table "designer"."required_entity" add constraint "required_entity_entity_id_environment_id_foreign" foreign key ("entity_id", "environment_id") references "designer"."entity" ("id", "environment_id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."required_entity" add constraint "required_entity_intent_id_environment_id_foreign" foreign key ("intent_id", "environment_id") references "designer"."intent" ("id", "environment_id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."required_entity" add constraint "required_entity_reprompt_id_environment_id_foreign" foreign key ("reprompt_id", "environment_id") references "designer"."response" ("id", "environment_id") on update cascade on delete set null;'
    );
    this.addSql(
      'alter table "designer"."required_entity" add constraint "required_entity_pkey" primary key ("id", "environment_id");'
    );

    this.addSql('alter table "designer"."entity_variant" add column "environment_id" varchar(24) not null;');
    this.addSql(
      'alter table "designer"."entity_variant" alter column "id" type varchar(24) using ("id"::varchar(24));'
    );
    this.addSql(
      'alter table "designer"."entity_variant" alter column "entity_id" type varchar(24) using ("entity_id"::varchar(24));'
    );
    this.addSql(
      'alter table "designer"."entity_variant" alter column "assistant_id" type varchar(24) using ("assistant_id"::varchar(24));'
    );
    this.addSql('alter table "designer"."entity_variant" drop constraint "entity_variant_pkey";');
    this.addSql(
      'alter table "designer"."entity_variant" add constraint "entity_variant_entity_id_environment_id_foreign" foreign key ("entity_id", "environment_id") references "designer"."entity" ("id", "environment_id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."entity_variant" add constraint "entity_variant_pkey" primary key ("id", "environment_id");'
    );

    this.addSql('alter table "designer"."card_attachment" add column "environment_id" varchar(24) null default null;');
    this.addSql(
      'alter table "designer"."card_attachment" alter column "id" type varchar(24) using ("id"::varchar(24));'
    );
    this.addSql(
      'alter table "designer"."card_attachment" alter column "media_id" type varchar(24) using ("media_id"::varchar(24));'
    );
    this.addSql(
      'alter table "designer"."card_attachment" alter column "assistant_id" type varchar(24) using ("assistant_id"::varchar(24));'
    );
    this.addSql('alter table "designer"."card_attachment" drop constraint "card_attachment_pkey";');
    this.addSql(
      'alter table "designer"."card_attachment" add constraint "card_attachment_media_id_environment_id_foreign" foreign key ("media_id", "environment_id") references "designer"."media_attachment" ("id", "environment_id") on update cascade on delete set null;'
    );
    this.addSql(
      'alter table "designer"."card_attachment" add constraint "card_attachment_id_environment_id_unique" unique ("id", "environment_id");'
    );
    this.addSql(
      'alter table "designer"."card_attachment" add constraint "card_attachment_pkey" primary key ("id", "environment_id");'
    );

    this.addSql('alter table "designer"."card_button" add column "environment_id" varchar(24) not null;');
    this.addSql('alter table "designer"."card_button" alter column "id" type varchar(24) using ("id"::varchar(24));');
    this.addSql(
      'alter table "designer"."card_button" alter column "card_id" type varchar(24) using ("card_id"::varchar(24));'
    );
    this.addSql(
      'alter table "designer"."card_button" alter column "assistant_id" type varchar(24) using ("assistant_id"::varchar(24));'
    );
    this.addSql('alter table "designer"."card_button" drop constraint "card_button_pkey";');
    this.addSql(
      'alter table "designer"."card_button" add constraint "card_button_card_id_environment_id_foreign" foreign key ("card_id", "environment_id") references "designer"."card_attachment" ("id", "environment_id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."card_button" add constraint "card_button_id_environment_id_unique" unique ("id", "environment_id");'
    );
    this.addSql(
      'alter table "designer"."card_button" add constraint "card_button_pkey" primary key ("id", "environment_id");'
    );

    this.addSql('alter table "designer"."trigger" add column "environment_id" varchar(24) null;');
    this.addSql('alter table "designer"."trigger" alter column "id" type varchar(24) using ("id"::varchar(24));');
    this.addSql(
      'alter table "designer"."trigger" alter column "story_id" type varchar(24) using ("story_id"::varchar(24));'
    );
    this.addSql(
      'alter table "designer"."trigger" alter column "assistant_id" type varchar(24) using ("assistant_id"::varchar(24));'
    );
    this.addSql(
      'alter table "designer"."trigger" alter column "event_id" type varchar(24) using ("event_id"::varchar(24));'
    );
    this.addSql(
      'alter table "designer"."trigger" alter column "intent_id" type varchar(24) using ("intent_id"::varchar(24));'
    );
    this.addSql('alter table "designer"."trigger" drop constraint "trigger_pkey";');
    this.addSql(
      'alter table "designer"."trigger" add constraint "trigger_story_id_environment_id_foreign" foreign key ("story_id", "environment_id") references "designer"."story" ("id", "environment_id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."trigger" add constraint "trigger_event_id_environment_id_foreign" foreign key ("event_id", "environment_id") references "designer"."event" ("id", "environment_id") on update cascade on delete set null;'
    );
    this.addSql(
      'alter table "designer"."trigger" add constraint "trigger_intent_id_environment_id_foreign" foreign key ("intent_id", "environment_id") references "designer"."intent" ("id", "environment_id") on update cascade on delete set null;'
    );
    this.addSql(
      'alter table "designer"."trigger" add constraint "trigger_id_environment_id_unique" unique ("id", "environment_id");'
    );
    this.addSql('alter table "designer"."trigger" add constraint "trigger_pkey" primary key ("id", "environment_id");');

    this.addSql('alter table "designer"."condition" add column "environment_id" varchar(24) null default null;');
    this.addSql('alter table "designer"."condition" alter column "id" type varchar(24) using ("id"::varchar(24));');
    this.addSql(
      'alter table "designer"."condition" alter column "assistant_id" type varchar(24) using ("assistant_id"::varchar(24));'
    );
    this.addSql(
      'alter table "designer"."condition" alter column "prompt_id" type varchar(24) using ("prompt_id"::varchar(24));'
    );
    this.addSql('alter table "designer"."condition" drop constraint "condition_pkey";');
    this.addSql(
      'alter table "designer"."condition" add constraint "condition_prompt_id_environment_id_foreign" foreign key ("prompt_id", "environment_id") references "designer"."prompt" ("id", "environment_id") on update cascade on delete set null;'
    );
    this.addSql(
      'alter table "designer"."condition" add constraint "condition_id_environment_id_unique" unique ("id", "environment_id");'
    );
    this.addSql(
      'alter table "designer"."condition" add constraint "condition_pkey" primary key ("id", "environment_id");'
    );

    this.addSql('alter table "designer"."condition_predicate" add column "environment_id" varchar(24) not null;');
    this.addSql(
      'alter table "designer"."condition_predicate" alter column "id" type varchar(24) using ("id"::varchar(24));'
    );
    this.addSql(
      'alter table "designer"."condition_predicate" alter column "condition_id" type varchar(24) using ("condition_id"::varchar(24));'
    );
    this.addSql(
      'alter table "designer"."condition_predicate" alter column "assistant_id" type varchar(24) using ("assistant_id"::varchar(24));'
    );
    this.addSql('alter table "designer"."condition_predicate" drop constraint "condition_predicate_pkey";');
    this.addSql(
      'alter table "designer"."condition_predicate" add constraint "condition_predicate_condition_id_environment_id_foreign" foreign key ("condition_id", "environment_id") references "designer"."condition" ("id", "environment_id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."condition_predicate" add constraint "condition_predicate_id_environment_id_unique" unique ("id", "environment_id");'
    );
    this.addSql(
      'alter table "designer"."condition_predicate" add constraint "condition_predicate_pkey" primary key ("id", "environment_id");'
    );

    this.addSql('alter table "designer"."condition_assertion" add column "environment_id" varchar(24) not null;');
    this.addSql(
      'alter table "designer"."condition_assertion" alter column "id" type varchar(24) using ("id"::varchar(24));'
    );
    this.addSql(
      'alter table "designer"."condition_assertion" alter column "condition_id" type varchar(24) using ("condition_id"::varchar(24));'
    );
    this.addSql(
      'alter table "designer"."condition_assertion" alter column "assistant_id" type varchar(24) using ("assistant_id"::varchar(24));'
    );
    this.addSql('alter table "designer"."condition_assertion" drop constraint "condition_assertion_pkey";');
    this.addSql(
      'alter table "designer"."condition_assertion" add constraint "condition_assertion_condition_id_environment_id_foreign" foreign key ("condition_id", "environment_id") references "designer"."condition" ("id", "environment_id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."condition_assertion" add constraint "condition_assertion_id_environment_id_unique" unique ("id", "environment_id");'
    );
    this.addSql(
      'alter table "designer"."condition_assertion" add constraint "condition_assertion_pkey" primary key ("id", "environment_id");'
    );

    this.addSql('alter table "designer"."response_variant" add column "environment_id" varchar(24) null default null;');
    this.addSql(
      'alter table "designer"."response_variant" alter column "id" type varchar(24) using ("id"::varchar(24));'
    );
    this.addSql(
      'alter table "designer"."response_variant" alter column "condition_id" type varchar(24) using ("condition_id"::varchar(24));'
    );
    this.addSql(
      'alter table "designer"."response_variant" alter column "assistant_id" type varchar(24) using ("assistant_id"::varchar(24));'
    );
    this.addSql(
      'alter table "designer"."response_variant" alter column "discriminator_id" type varchar(24) using ("discriminator_id"::varchar(24));'
    );
    this.addSql(
      'alter table "designer"."response_variant" alter column "prompt_id" type varchar(24) using ("prompt_id"::varchar(24));'
    );
    this.addSql('alter table "designer"."response_variant" drop constraint "response_variant_pkey";');
    this.addSql(
      'alter table "designer"."response_variant" add constraint "response_variant_condition_id_environment_id_foreign" foreign key ("condition_id", "environment_id") references "designer"."condition" ("id", "environment_id") on update cascade on delete set null;'
    );
    this.addSql(
      'alter table "designer"."response_variant" add constraint "response_variant_discriminator_id_environment_id_foreign" foreign key ("discriminator_id", "environment_id") references "designer"."response_discriminator" ("id", "environment_id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."response_variant" add constraint "response_variant_prompt_id_environment_id_foreign" foreign key ("prompt_id", "environment_id") references "designer"."prompt" ("id", "environment_id") on update cascade on delete set null;'
    );
    this.addSql(
      'alter table "designer"."response_variant" add constraint "response_variant_id_environment_id_unique" unique ("id", "environment_id");'
    );
    this.addSql(
      'alter table "designer"."response_variant" add constraint "response_variant_pkey" primary key ("id", "environment_id");'
    );

    this.addSql('alter table "designer"."response_attachment" add column "environment_id" varchar(24) null;');
    this.addSql(
      'alter table "designer"."response_attachment" alter column "id" type varchar(24) using ("id"::varchar(24));'
    );
    this.addSql(
      'alter table "designer"."response_attachment" alter column "variant_id" type varchar(24) using ("variant_id"::varchar(24));'
    );
    this.addSql(
      'alter table "designer"."response_attachment" alter column "assistant_id" type varchar(24) using ("assistant_id"::varchar(24));'
    );
    this.addSql(
      'alter table "designer"."response_attachment" alter column "card_id" type varchar(24) using ("card_id"::varchar(24));'
    );
    this.addSql(
      'alter table "designer"."response_attachment" alter column "media_id" type varchar(24) using ("media_id"::varchar(24));'
    );
    this.addSql('alter table "designer"."response_attachment" drop constraint "response_attachment_pkey";');
    this.addSql(
      'alter table "designer"."response_attachment" add constraint "response_attachment_variant_id_environment_id_foreign" foreign key ("variant_id", "environment_id") references "designer"."response_variant" ("id", "environment_id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."response_attachment" add constraint "response_attachment_card_id_environment_id_foreign" foreign key ("card_id", "environment_id") references "designer"."card_attachment" ("id", "environment_id") on update cascade on delete set null;'
    );
    this.addSql(
      'alter table "designer"."response_attachment" add constraint "response_attachment_media_id_environment_id_foreign" foreign key ("media_id", "environment_id") references "designer"."media_attachment" ("id", "environment_id") on update cascade on delete set null;'
    );
    this.addSql(
      'alter table "designer"."response_attachment" add constraint "response_attachment_id_environment_id_unique" unique ("id", "environment_id");'
    );
    this.addSql(
      'alter table "designer"."response_attachment" add constraint "response_attachment_pkey" primary key ("id", "environment_id");'
    );

    this.addSql(
      'alter table "designer"."assistant" add constraint "assistant_active_persona_id_active_environment_id_foreign" foreign key ("active_persona_id", "active_environment_id") references "designer"."persona" ("id", "environment_id") on update cascade on delete set null;'
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "designer"."assistant" drop constraint "assistant_active_persona_id_active_environment_id_foreign";'
    );

    this.addSql('alter table "designer"."folder" drop constraint "folder_parent_id_environment_id_foreign";');

    this.addSql('alter table "designer"."variable" drop constraint "variable_folder_id_environment_id_foreign";');

    this.addSql('alter table "designer"."response" drop constraint "response_folder_id_environment_id_foreign";');

    this.addSql(
      'alter table "designer"."response_discriminator" drop constraint "response_discriminator_response_id_environment_id_foreign";'
    );

    this.addSql('alter table "designer"."persona" drop constraint "persona_folder_id_environment_id_foreign";');

    this.addSql(
      'alter table "designer"."persona_override" drop constraint "persona_override_persona_id_environment_id_foreign";'
    );

    this.addSql('alter table "designer"."prompt" drop constraint "prompt_folder_id_environment_id_foreign";');
    this.addSql('alter table "designer"."prompt" drop constraint "prompt_persona_id_environment_id_foreign";');

    this.addSql('alter table "designer"."intent" drop constraint "intent_folder_id_environment_id_foreign";');

    this.addSql('alter table "designer"."utterance" drop constraint "utterance_intent_id_environment_id_foreign";');

    this.addSql('alter table "designer"."function" drop constraint "function_folder_id_environment_id_foreign";');

    this.addSql(
      'alter table "designer"."function_variable" drop constraint "function_variable_function_id_environment_id_foreign";'
    );

    this.addSql(
      'alter table "designer"."function_path" drop constraint "function_path_function_id_environment_id_foreign";'
    );

    this.addSql('alter table "designer"."flow" drop constraint "flow_folder_id_environment_id_foreign";');

    this.addSql('alter table "designer"."story" drop constraint "story_folder_id_environment_id_foreign";');
    this.addSql('alter table "designer"."story" drop constraint "story_flow_id_environment_id_foreign";');

    this.addSql('alter table "designer"."event" drop constraint "event_folder_id_environment_id_foreign";');

    this.addSql(
      'alter table "designer"."event_mapping" drop constraint "event_mapping_event_id_environment_id_foreign";'
    );
    this.addSql(
      'alter table "designer"."event_mapping" drop constraint "event_mapping_variable_id_environment_id_foreign";'
    );

    this.addSql('alter table "designer"."entity" drop constraint "entity_folder_id_environment_id_foreign";');

    this.addSql(
      'alter table "designer"."required_entity" drop constraint "required_entity_entity_id_environment_id_foreign";'
    );
    this.addSql(
      'alter table "designer"."required_entity" drop constraint "required_entity_intent_id_environment_id_foreign";'
    );
    this.addSql(
      'alter table "designer"."required_entity" drop constraint "required_entity_reprompt_id_environment_id_foreign";'
    );

    this.addSql(
      'alter table "designer"."entity_variant" drop constraint "entity_variant_entity_id_environment_id_foreign";'
    );

    this.addSql(
      'alter table "designer"."card_attachment" drop constraint "card_attachment_media_id_environment_id_foreign";'
    );

    this.addSql('alter table "designer"."card_button" drop constraint "card_button_card_id_environment_id_foreign";');

    this.addSql('alter table "designer"."trigger" drop constraint "trigger_story_id_environment_id_foreign";');
    this.addSql('alter table "designer"."trigger" drop constraint "trigger_event_id_environment_id_foreign";');
    this.addSql('alter table "designer"."trigger" drop constraint "trigger_intent_id_environment_id_foreign";');

    this.addSql('alter table "designer"."condition" drop constraint "condition_prompt_id_environment_id_foreign";');

    this.addSql(
      'alter table "designer"."condition_predicate" drop constraint "condition_predicate_condition_id_environment_id_foreign";'
    );

    this.addSql(
      'alter table "designer"."condition_assertion" drop constraint "condition_assertion_condition_id_environment_id_foreign";'
    );

    this.addSql(
      'alter table "designer"."response_variant" drop constraint "response_variant_condition_id_environment_id_foreign";'
    );
    this.addSql(
      'alter table "designer"."response_variant" drop constraint "response_variant_discriminator_id_environment_id_foreign";'
    );
    this.addSql(
      'alter table "designer"."response_variant" drop constraint "response_variant_prompt_id_environment_id_foreign";'
    );

    this.addSql(
      'alter table "designer"."response_attachment" drop constraint "response_attachment_variant_id_environment_id_foreign";'
    );
    this.addSql(
      'alter table "designer"."response_attachment" drop constraint "response_attachment_card_id_environment_id_foreign";'
    );
    this.addSql(
      'alter table "designer"."response_attachment" drop constraint "response_attachment_media_id_environment_id_foreign";'
    );

    this.addSql('alter table "designer"."assistant" alter column "id" type varchar(255) using ("id"::varchar(255));');
    this.addSql(
      'alter table "designer"."assistant" alter column "active_persona_id" type varchar(255) using ("active_persona_id"::varchar(255));'
    );
    this.addSql(
      'alter table "designer"."assistant" drop constraint "assistant_active_persona_id_active_environment_id_unique";'
    );
    this.addSql('alter table "designer"."assistant" drop constraint "assistant_id_unique";');
    this.addSql('alter table "designer"."assistant" drop column "active_environment_id";');
    this.addSql(
      'alter table "designer"."assistant" add constraint "assistant_active_persona_id_foreign" foreign key ("active_persona_id") references "designer"."persona" ("id") on update cascade on delete set null;'
    );
    this.addSql(
      'alter table "designer"."assistant" add constraint "assistant_active_persona_id_unique" unique ("active_persona_id");'
    );

    this.addSql(
      'alter table "designer"."media_attachment" alter column "id" type varchar(255) using ("id"::varchar(255));'
    );
    this.addSql(
      'alter table "designer"."media_attachment" alter column "assistant_id" type varchar(255) using ("assistant_id"::varchar(255));'
    );
    this.addSql(
      'alter table "designer"."media_attachment" drop constraint "media_attachment_id_environment_id_unique";'
    );
    this.addSql('alter table "designer"."media_attachment" drop constraint "media_attachment_pkey";');
    this.addSql('alter table "designer"."media_attachment" drop column "environment_id";');
    this.addSql('alter table "designer"."media_attachment" add constraint "media_attachment_pkey" primary key ("id");');

    this.addSql('alter table "designer"."folder" alter column "id" type varchar(255) using ("id"::varchar(255));');
    this.addSql(
      'alter table "designer"."folder" alter column "parent_id" type varchar(255) using ("parent_id"::varchar(255));'
    );
    this.addSql(
      'alter table "designer"."folder" alter column "assistant_id" type varchar(255) using ("assistant_id"::varchar(255));'
    );
    this.addSql('alter table "designer"."folder" drop constraint "folder_id_environment_id_unique";');
    this.addSql('alter table "designer"."folder" drop constraint "folder_pkey";');
    this.addSql('alter table "designer"."folder" drop column "environment_id";');
    this.addSql(
      'alter table "designer"."folder" add constraint "folder_parent_id_foreign" foreign key ("parent_id") references "designer"."folder" ("id") on update cascade on delete set null;'
    );
    this.addSql('alter table "designer"."folder" add constraint "folder_pkey" primary key ("id");');

    this.addSql('alter table "designer"."variable" alter column "id" type varchar(255) using ("id"::varchar(255));');
    this.addSql(
      'alter table "designer"."variable" alter column "assistant_id" type varchar(255) using ("assistant_id"::varchar(255));'
    );
    this.addSql(
      'alter table "designer"."variable" alter column "folder_id" type varchar(255) using ("folder_id"::varchar(255));'
    );
    this.addSql('alter table "designer"."variable" drop constraint "variable_id_environment_id_unique";');
    this.addSql('alter table "designer"."variable" drop constraint "variable_pkey";');
    this.addSql('alter table "designer"."variable" drop column "environment_id";');
    this.addSql(
      'alter table "designer"."variable" add constraint "variable_folder_id_foreign" foreign key ("folder_id") references "designer"."folder" ("id") on update cascade on delete set null;'
    );
    this.addSql('alter table "designer"."variable" add constraint "variable_pkey" primary key ("id");');

    this.addSql('alter table "designer"."response" alter column "id" type varchar(255) using ("id"::varchar(255));');
    this.addSql(
      'alter table "designer"."response" alter column "assistant_id" type varchar(255) using ("assistant_id"::varchar(255));'
    );
    this.addSql(
      'alter table "designer"."response" alter column "folder_id" type varchar(255) using ("folder_id"::varchar(255));'
    );
    this.addSql('alter table "designer"."response" drop constraint "response_id_environment_id_unique";');
    this.addSql('alter table "designer"."response" drop constraint "response_pkey";');
    this.addSql('alter table "designer"."response" drop column "environment_id";');
    this.addSql(
      'alter table "designer"."response" add constraint "response_folder_id_foreign" foreign key ("folder_id") references "designer"."folder" ("id") on update cascade on delete set null;'
    );
    this.addSql('alter table "designer"."response" add constraint "response_pkey" primary key ("id");');

    this.addSql(
      'alter table "designer"."response_discriminator" alter column "id" type varchar(255) using ("id"::varchar(255));'
    );
    this.addSql(
      'alter table "designer"."response_discriminator" alter column "response_id" type varchar(255) using ("response_id"::varchar(255));'
    );
    this.addSql(
      'alter table "designer"."response_discriminator" alter column "assistant_id" type varchar(255) using ("assistant_id"::varchar(255));'
    );
    this.addSql(
      'alter table "designer"."response_discriminator" drop constraint "response_discriminator_id_environment_id_unique";'
    );
    this.addSql('alter table "designer"."response_discriminator" drop constraint "response_discriminator_pkey";');
    this.addSql('alter table "designer"."response_discriminator" drop column "environment_id";');
    this.addSql(
      'alter table "designer"."response_discriminator" add constraint "response_discriminator_response_id_foreign" foreign key ("response_id") references "designer"."response" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."response_discriminator" add constraint "response_discriminator_pkey" primary key ("id");'
    );

    this.addSql('alter table "designer"."persona" alter column "id" type varchar(255) using ("id"::varchar(255));');
    this.addSql(
      'alter table "designer"."persona" alter column "assistant_id" type varchar(255) using ("assistant_id"::varchar(255));'
    );
    this.addSql(
      'alter table "designer"."persona" alter column "folder_id" type varchar(255) using ("folder_id"::varchar(255));'
    );
    this.addSql('alter table "designer"."persona" drop constraint "persona_id_environment_id_unique";');
    this.addSql('alter table "designer"."persona" drop constraint "persona_pkey";');
    this.addSql('alter table "designer"."persona" drop column "environment_id";');
    this.addSql(
      'alter table "designer"."persona" add constraint "persona_folder_id_foreign" foreign key ("folder_id") references "designer"."folder" ("id") on update cascade on delete set null;'
    );
    this.addSql('alter table "designer"."persona" add constraint "persona_pkey" primary key ("id");');

    this.addSql(
      'alter table "designer"."persona_override" alter column "id" type varchar(255) using ("id"::varchar(255));'
    );
    this.addSql(
      'alter table "designer"."persona_override" alter column "persona_id" type varchar(255) using ("persona_id"::varchar(255));'
    );
    this.addSql(
      'alter table "designer"."persona_override" alter column "assistant_id" type varchar(255) using ("assistant_id"::varchar(255));'
    );
    this.addSql(
      'alter table "designer"."persona_override" drop constraint "persona_override_id_environment_id_unique";'
    );
    this.addSql('alter table "designer"."persona_override" drop constraint "persona_override_pkey";');
    this.addSql('alter table "designer"."persona_override" drop column "environment_id";');
    this.addSql(
      'alter table "designer"."persona_override" add constraint "persona_override_persona_id_foreign" foreign key ("persona_id") references "designer"."persona" ("id") on update cascade;'
    );
    this.addSql('alter table "designer"."persona_override" add constraint "persona_override_pkey" primary key ("id");');

    this.addSql('alter table "designer"."prompt" alter column "id" type varchar(255) using ("id"::varchar(255));');
    this.addSql(
      'alter table "designer"."prompt" alter column "assistant_id" type varchar(255) using ("assistant_id"::varchar(255));'
    );
    this.addSql(
      'alter table "designer"."prompt" alter column "folder_id" type varchar(255) using ("folder_id"::varchar(255));'
    );
    this.addSql(
      'alter table "designer"."prompt" alter column "persona_id" type varchar(255) using ("persona_id"::varchar(255));'
    );
    this.addSql('alter table "designer"."prompt" drop constraint "prompt_id_environment_id_unique";');
    this.addSql('alter table "designer"."prompt" drop constraint "prompt_pkey";');
    this.addSql('alter table "designer"."prompt" drop column "environment_id";');
    this.addSql(
      'alter table "designer"."prompt" add constraint "prompt_folder_id_foreign" foreign key ("folder_id") references "designer"."folder" ("id") on update cascade on delete set null;'
    );
    this.addSql(
      'alter table "designer"."prompt" add constraint "prompt_persona_id_foreign" foreign key ("persona_id") references "designer"."persona_override" ("id") on update cascade on delete set null;'
    );
    this.addSql('alter table "designer"."prompt" add constraint "prompt_pkey" primary key ("id");');

    this.addSql('alter table "designer"."intent" alter column "id" type varchar(255) using ("id"::varchar(255));');
    this.addSql(
      'alter table "designer"."intent" alter column "assistant_id" type varchar(255) using ("assistant_id"::varchar(255));'
    );
    this.addSql(
      'alter table "designer"."intent" alter column "folder_id" type varchar(255) using ("folder_id"::varchar(255));'
    );
    this.addSql('alter table "designer"."intent" drop constraint "intent_id_environment_id_unique";');
    this.addSql('alter table "designer"."intent" drop constraint "intent_pkey";');
    this.addSql('alter table "designer"."intent" drop column "environment_id";');
    this.addSql(
      'alter table "designer"."intent" add constraint "intent_folder_id_foreign" foreign key ("folder_id") references "designer"."folder" ("id") on update cascade on delete set null;'
    );
    this.addSql('alter table "designer"."intent" add constraint "intent_pkey" primary key ("id");');

    this.addSql('alter table "designer"."utterance" alter column "id" type varchar(255) using ("id"::varchar(255));');
    this.addSql(
      'alter table "designer"."utterance" alter column "intent_id" type varchar(255) using ("intent_id"::varchar(255));'
    );
    this.addSql(
      'alter table "designer"."utterance" alter column "assistant_id" type varchar(255) using ("assistant_id"::varchar(255));'
    );
    this.addSql('alter table "designer"."utterance" drop constraint "utterance_id_environment_id_unique";');
    this.addSql('alter table "designer"."utterance" drop constraint "utterance_pkey";');
    this.addSql('alter table "designer"."utterance" drop column "environment_id";');
    this.addSql(
      'alter table "designer"."utterance" add constraint "utterance_intent_id_foreign" foreign key ("intent_id") references "designer"."intent" ("id") on update cascade;'
    );
    this.addSql('alter table "designer"."utterance" add constraint "utterance_pkey" primary key ("id");');

    this.addSql('alter table "designer"."function" alter column "id" type varchar(255) using ("id"::varchar(255));');
    this.addSql(
      'alter table "designer"."function" alter column "assistant_id" type varchar(255) using ("assistant_id"::varchar(255));'
    );
    this.addSql(
      'alter table "designer"."function" alter column "folder_id" type varchar(255) using ("folder_id"::varchar(255));'
    );
    this.addSql('alter table "designer"."function" drop constraint "function_id_environment_id_unique";');
    this.addSql('alter table "designer"."function" drop constraint "function_pkey";');
    this.addSql('alter table "designer"."function" drop column "environment_id";');
    this.addSql(
      'alter table "designer"."function" add constraint "function_folder_id_foreign" foreign key ("folder_id") references "designer"."folder" ("id") on update cascade on delete set null;'
    );
    this.addSql('alter table "designer"."function" add constraint "function_pkey" primary key ("id");');

    this.addSql(
      'alter table "designer"."function_variable" alter column "id" type varchar(255) using ("id"::varchar(255));'
    );
    this.addSql(
      'alter table "designer"."function_variable" alter column "function_id" type varchar(255) using ("function_id"::varchar(255));'
    );
    this.addSql(
      'alter table "designer"."function_variable" alter column "assistant_id" type varchar(255) using ("assistant_id"::varchar(255));'
    );
    this.addSql(
      'alter table "designer"."function_variable" drop constraint "function_variable_id_environment_id_unique";'
    );
    this.addSql('alter table "designer"."function_variable" drop constraint "function_variable_pkey";');
    this.addSql('alter table "designer"."function_variable" drop column "environment_id";');
    this.addSql(
      'alter table "designer"."function_variable" add constraint "function_variable_function_id_foreign" foreign key ("function_id") references "designer"."function" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."function_variable" add constraint "function_variable_pkey" primary key ("id");'
    );

    this.addSql(
      'alter table "designer"."function_path" alter column "id" type varchar(255) using ("id"::varchar(255));'
    );
    this.addSql(
      'alter table "designer"."function_path" alter column "function_id" type varchar(255) using ("function_id"::varchar(255));'
    );
    this.addSql(
      'alter table "designer"."function_path" alter column "assistant_id" type varchar(255) using ("assistant_id"::varchar(255));'
    );
    this.addSql('alter table "designer"."function_path" drop constraint "function_path_id_environment_id_unique";');
    this.addSql('alter table "designer"."function_path" drop constraint "function_path_pkey";');
    this.addSql('alter table "designer"."function_path" drop column "environment_id";');
    this.addSql(
      'alter table "designer"."function_path" add constraint "function_path_function_id_foreign" foreign key ("function_id") references "designer"."function" ("id") on update cascade;'
    );
    this.addSql('alter table "designer"."function_path" add constraint "function_path_pkey" primary key ("id");');

    this.addSql('alter table "designer"."flow" alter column "id" type varchar(255) using ("id"::varchar(255));');
    this.addSql(
      'alter table "designer"."flow" alter column "assistant_id" type varchar(255) using ("assistant_id"::varchar(255));'
    );
    this.addSql(
      'alter table "designer"."flow" alter column "folder_id" type varchar(255) using ("folder_id"::varchar(255));'
    );
    this.addSql('alter table "designer"."flow" drop constraint "flow_id_environment_id_unique";');
    this.addSql('alter table "designer"."flow" drop constraint "flow_pkey";');
    this.addSql('alter table "designer"."flow" drop column "environment_id";');
    this.addSql(
      'alter table "designer"."flow" add constraint "flow_folder_id_foreign" foreign key ("folder_id") references "designer"."folder" ("id") on update cascade on delete set null;'
    );
    this.addSql('alter table "designer"."flow" add constraint "flow_pkey" primary key ("id");');

    this.addSql('alter table "designer"."story" alter column "id" type varchar(255) using ("id"::varchar(255));');
    this.addSql(
      'alter table "designer"."story" alter column "assistant_id" type varchar(255) using ("assistant_id"::varchar(255));'
    );
    this.addSql(
      'alter table "designer"."story" alter column "folder_id" type varchar(255) using ("folder_id"::varchar(255));'
    );
    this.addSql(
      'alter table "designer"."story" alter column "flow_id" type varchar(255) using ("flow_id"::varchar(255));'
    );
    this.addSql('alter table "designer"."story" drop constraint "story_id_environment_id_unique";');
    this.addSql('alter table "designer"."story" drop constraint "story_pkey";');
    this.addSql('alter table "designer"."story" drop column "environment_id";');
    this.addSql(
      'alter table "designer"."story" add constraint "story_folder_id_foreign" foreign key ("folder_id") references "designer"."folder" ("id") on update cascade on delete set null;'
    );
    this.addSql(
      'alter table "designer"."story" add constraint "story_flow_id_foreign" foreign key ("flow_id") references "designer"."flow" ("id") on update cascade on delete set null;'
    );
    this.addSql('alter table "designer"."story" add constraint "story_pkey" primary key ("id");');

    this.addSql('alter table "designer"."event" alter column "id" type varchar(255) using ("id"::varchar(255));');
    this.addSql(
      'alter table "designer"."event" alter column "assistant_id" type varchar(255) using ("assistant_id"::varchar(255));'
    );
    this.addSql(
      'alter table "designer"."event" alter column "folder_id" type varchar(255) using ("folder_id"::varchar(255));'
    );
    this.addSql('alter table "designer"."event" drop constraint "event_id_environment_id_unique";');
    this.addSql('alter table "designer"."event" drop constraint "event_pkey";');
    this.addSql('alter table "designer"."event" drop column "environment_id";');
    this.addSql(
      'alter table "designer"."event" add constraint "event_folder_id_foreign" foreign key ("folder_id") references "designer"."folder" ("id") on update cascade on delete set null;'
    );
    this.addSql('alter table "designer"."event" add constraint "event_pkey" primary key ("id");');

    this.addSql(
      'alter table "designer"."event_mapping" alter column "id" type varchar(255) using ("id"::varchar(255));'
    );
    this.addSql(
      'alter table "designer"."event_mapping" alter column "event_id" type varchar(255) using ("event_id"::varchar(255));'
    );
    this.addSql(
      'alter table "designer"."event_mapping" alter column "variable_id" type varchar(255) using ("variable_id"::varchar(255));'
    );
    this.addSql(
      'alter table "designer"."event_mapping" alter column "assistant_id" type varchar(255) using ("assistant_id"::varchar(255));'
    );
    this.addSql('alter table "designer"."event_mapping" drop constraint "event_mapping_id_environment_id_unique";');
    this.addSql('alter table "designer"."event_mapping" drop constraint "event_mapping_pkey";');
    this.addSql('alter table "designer"."event_mapping" drop column "environment_id";');
    this.addSql(
      'alter table "designer"."event_mapping" add constraint "event_mapping_event_id_foreign" foreign key ("event_id") references "designer"."event" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."event_mapping" add constraint "event_mapping_variable_id_foreign" foreign key ("variable_id") references "designer"."variable" ("id") on update cascade on delete set null;'
    );
    this.addSql('alter table "designer"."event_mapping" add constraint "event_mapping_pkey" primary key ("id");');

    this.addSql('alter table "designer"."entity" alter column "id" type varchar(255) using ("id"::varchar(255));');
    this.addSql(
      'alter table "designer"."entity" alter column "assistant_id" type varchar(255) using ("assistant_id"::varchar(255));'
    );
    this.addSql(
      'alter table "designer"."entity" alter column "folder_id" type varchar(255) using ("folder_id"::varchar(255));'
    );
    this.addSql('alter table "designer"."entity" drop constraint "entity_pkey";');
    this.addSql('alter table "designer"."entity" drop column "environment_id";');
    this.addSql(
      'alter table "designer"."entity" add constraint "entity_folder_id_foreign" foreign key ("folder_id") references "designer"."folder" ("id") on update cascade on delete set null;'
    );
    this.addSql('alter table "designer"."entity" add constraint "entity_pkey" primary key ("id");');

    this.addSql(
      'alter table "designer"."required_entity" alter column "id" type varchar(255) using ("id"::varchar(255));'
    );
    this.addSql(
      'alter table "designer"."required_entity" alter column "entity_id" type varchar(255) using ("entity_id"::varchar(255));'
    );
    this.addSql(
      'alter table "designer"."required_entity" alter column "intent_id" type varchar(255) using ("intent_id"::varchar(255));'
    );
    this.addSql(
      'alter table "designer"."required_entity" alter column "reprompt_id" type varchar(255) using ("reprompt_id"::varchar(255));'
    );
    this.addSql(
      'alter table "designer"."required_entity" alter column "assistant_id" type varchar(255) using ("assistant_id"::varchar(255));'
    );
    this.addSql('alter table "designer"."required_entity" drop constraint "required_entity_pkey";');
    this.addSql('alter table "designer"."required_entity" drop column "environment_id";');
    this.addSql(
      'alter table "designer"."required_entity" add constraint "required_entity_entity_id_foreign" foreign key ("entity_id") references "designer"."entity" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."required_entity" add constraint "required_entity_intent_id_foreign" foreign key ("intent_id") references "designer"."intent" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."required_entity" add constraint "required_entity_reprompt_id_foreign" foreign key ("reprompt_id") references "designer"."response" ("id") on update cascade on delete set null;'
    );
    this.addSql('alter table "designer"."required_entity" add constraint "required_entity_pkey" primary key ("id");');

    this.addSql(
      'alter table "designer"."entity_variant" alter column "id" type varchar(255) using ("id"::varchar(255));'
    );
    this.addSql(
      'alter table "designer"."entity_variant" alter column "entity_id" type varchar(255) using ("entity_id"::varchar(255));'
    );
    this.addSql(
      'alter table "designer"."entity_variant" alter column "assistant_id" type varchar(255) using ("assistant_id"::varchar(255));'
    );
    this.addSql('alter table "designer"."entity_variant" drop constraint "entity_variant_pkey";');
    this.addSql('alter table "designer"."entity_variant" drop column "environment_id";');
    this.addSql(
      'alter table "designer"."entity_variant" add constraint "entity_variant_entity_id_foreign" foreign key ("entity_id") references "designer"."entity" ("id") on update cascade;'
    );
    this.addSql('alter table "designer"."entity_variant" add constraint "entity_variant_pkey" primary key ("id");');

    this.addSql(
      'alter table "designer"."card_attachment" alter column "id" type varchar(255) using ("id"::varchar(255));'
    );
    this.addSql(
      'alter table "designer"."card_attachment" alter column "media_id" type varchar(255) using ("media_id"::varchar(255));'
    );
    this.addSql(
      'alter table "designer"."card_attachment" alter column "assistant_id" type varchar(255) using ("assistant_id"::varchar(255));'
    );
    this.addSql('alter table "designer"."card_attachment" drop constraint "card_attachment_id_environment_id_unique";');
    this.addSql('alter table "designer"."card_attachment" drop constraint "card_attachment_pkey";');
    this.addSql('alter table "designer"."card_attachment" drop column "environment_id";');
    this.addSql(
      'alter table "designer"."card_attachment" add constraint "card_attachment_media_id_foreign" foreign key ("media_id") references "designer"."media_attachment" ("id") on update cascade on delete set null;'
    );
    this.addSql('alter table "designer"."card_attachment" add constraint "card_attachment_pkey" primary key ("id");');

    this.addSql('alter table "designer"."card_button" alter column "id" type varchar(255) using ("id"::varchar(255));');
    this.addSql(
      'alter table "designer"."card_button" alter column "card_id" type varchar(255) using ("card_id"::varchar(255));'
    );
    this.addSql(
      'alter table "designer"."card_button" alter column "assistant_id" type varchar(255) using ("assistant_id"::varchar(255));'
    );
    this.addSql('alter table "designer"."card_button" drop constraint "card_button_id_environment_id_unique";');
    this.addSql('alter table "designer"."card_button" drop constraint "card_button_pkey";');
    this.addSql('alter table "designer"."card_button" drop column "environment_id";');
    this.addSql(
      'alter table "designer"."card_button" add constraint "card_button_card_id_foreign" foreign key ("card_id") references "designer"."card_attachment" ("id") on update cascade;'
    );
    this.addSql('alter table "designer"."card_button" add constraint "card_button_pkey" primary key ("id");');

    this.addSql('alter table "designer"."trigger" alter column "id" type varchar(255) using ("id"::varchar(255));');
    this.addSql(
      'alter table "designer"."trigger" alter column "story_id" type varchar(255) using ("story_id"::varchar(255));'
    );
    this.addSql(
      'alter table "designer"."trigger" alter column "assistant_id" type varchar(255) using ("assistant_id"::varchar(255));'
    );
    this.addSql(
      'alter table "designer"."trigger" alter column "event_id" type varchar(255) using ("event_id"::varchar(255));'
    );
    this.addSql(
      'alter table "designer"."trigger" alter column "intent_id" type varchar(255) using ("intent_id"::varchar(255));'
    );
    this.addSql('alter table "designer"."trigger" drop constraint "trigger_id_environment_id_unique";');
    this.addSql('alter table "designer"."trigger" drop constraint "trigger_pkey";');
    this.addSql('alter table "designer"."trigger" drop column "environment_id";');
    this.addSql(
      'alter table "designer"."trigger" add constraint "trigger_story_id_foreign" foreign key ("story_id") references "designer"."story" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."trigger" add constraint "trigger_event_id_foreign" foreign key ("event_id") references "designer"."event" ("id") on update cascade on delete set null;'
    );
    this.addSql(
      'alter table "designer"."trigger" add constraint "trigger_intent_id_foreign" foreign key ("intent_id") references "designer"."intent" ("id") on update cascade on delete set null;'
    );
    this.addSql('alter table "designer"."trigger" add constraint "trigger_pkey" primary key ("id");');

    this.addSql('alter table "designer"."condition" alter column "id" type varchar(255) using ("id"::varchar(255));');
    this.addSql(
      'alter table "designer"."condition" alter column "assistant_id" type varchar(255) using ("assistant_id"::varchar(255));'
    );
    this.addSql(
      'alter table "designer"."condition" alter column "prompt_id" type varchar(255) using ("prompt_id"::varchar(255));'
    );
    this.addSql('alter table "designer"."condition" drop constraint "condition_id_environment_id_unique";');
    this.addSql('alter table "designer"."condition" drop constraint "condition_pkey";');
    this.addSql('alter table "designer"."condition" drop column "environment_id";');
    this.addSql(
      'alter table "designer"."condition" add constraint "condition_prompt_id_foreign" foreign key ("prompt_id") references "designer"."prompt" ("id") on update cascade on delete set null;'
    );
    this.addSql('alter table "designer"."condition" add constraint "condition_pkey" primary key ("id");');

    this.addSql(
      'alter table "designer"."condition_predicate" alter column "id" type varchar(255) using ("id"::varchar(255));'
    );
    this.addSql(
      'alter table "designer"."condition_predicate" alter column "condition_id" type varchar(255) using ("condition_id"::varchar(255));'
    );
    this.addSql(
      'alter table "designer"."condition_predicate" alter column "assistant_id" type varchar(255) using ("assistant_id"::varchar(255));'
    );
    this.addSql(
      'alter table "designer"."condition_predicate" drop constraint "condition_predicate_id_environment_id_unique";'
    );
    this.addSql('alter table "designer"."condition_predicate" drop constraint "condition_predicate_pkey";');
    this.addSql('alter table "designer"."condition_predicate" drop column "environment_id";');
    this.addSql(
      'alter table "designer"."condition_predicate" add constraint "condition_predicate_condition_id_foreign" foreign key ("condition_id") references "designer"."condition" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."condition_predicate" add constraint "condition_predicate_pkey" primary key ("id");'
    );

    this.addSql(
      'alter table "designer"."condition_assertion" alter column "id" type varchar(255) using ("id"::varchar(255));'
    );
    this.addSql(
      'alter table "designer"."condition_assertion" alter column "condition_id" type varchar(255) using ("condition_id"::varchar(255));'
    );
    this.addSql(
      'alter table "designer"."condition_assertion" alter column "assistant_id" type varchar(255) using ("assistant_id"::varchar(255));'
    );
    this.addSql(
      'alter table "designer"."condition_assertion" drop constraint "condition_assertion_id_environment_id_unique";'
    );
    this.addSql('alter table "designer"."condition_assertion" drop constraint "condition_assertion_pkey";');
    this.addSql('alter table "designer"."condition_assertion" drop column "environment_id";');
    this.addSql(
      'alter table "designer"."condition_assertion" add constraint "condition_assertion_condition_id_foreign" foreign key ("condition_id") references "designer"."condition" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."condition_assertion" add constraint "condition_assertion_pkey" primary key ("id");'
    );

    this.addSql(
      'alter table "designer"."response_variant" alter column "id" type varchar(255) using ("id"::varchar(255));'
    );
    this.addSql(
      'alter table "designer"."response_variant" alter column "condition_id" type varchar(255) using ("condition_id"::varchar(255));'
    );
    this.addSql(
      'alter table "designer"."response_variant" alter column "assistant_id" type varchar(255) using ("assistant_id"::varchar(255));'
    );
    this.addSql(
      'alter table "designer"."response_variant" alter column "discriminator_id" type varchar(255) using ("discriminator_id"::varchar(255));'
    );
    this.addSql(
      'alter table "designer"."response_variant" alter column "prompt_id" type varchar(255) using ("prompt_id"::varchar(255));'
    );
    this.addSql(
      'alter table "designer"."response_variant" drop constraint "response_variant_id_environment_id_unique";'
    );
    this.addSql('alter table "designer"."response_variant" drop constraint "response_variant_pkey";');
    this.addSql('alter table "designer"."response_variant" drop column "environment_id";');
    this.addSql(
      'alter table "designer"."response_variant" add constraint "response_variant_condition_id_foreign" foreign key ("condition_id") references "designer"."condition" ("id") on update cascade on delete set null;'
    );
    this.addSql(
      'alter table "designer"."response_variant" add constraint "response_variant_discriminator_id_foreign" foreign key ("discriminator_id") references "designer"."response_discriminator" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."response_variant" add constraint "response_variant_prompt_id_foreign" foreign key ("prompt_id") references "designer"."prompt" ("id") on update cascade on delete set null;'
    );
    this.addSql('alter table "designer"."response_variant" add constraint "response_variant_pkey" primary key ("id");');

    this.addSql(
      'alter table "designer"."response_attachment" alter column "id" type varchar(255) using ("id"::varchar(255));'
    );
    this.addSql(
      'alter table "designer"."response_attachment" alter column "variant_id" type varchar(255) using ("variant_id"::varchar(255));'
    );
    this.addSql(
      'alter table "designer"."response_attachment" alter column "assistant_id" type varchar(255) using ("assistant_id"::varchar(255));'
    );
    this.addSql(
      'alter table "designer"."response_attachment" alter column "card_id" type varchar(255) using ("card_id"::varchar(255));'
    );
    this.addSql(
      'alter table "designer"."response_attachment" alter column "media_id" type varchar(255) using ("media_id"::varchar(255));'
    );
    this.addSql(
      'alter table "designer"."response_attachment" drop constraint "response_attachment_id_environment_id_unique";'
    );
    this.addSql('alter table "designer"."response_attachment" drop constraint "response_attachment_pkey";');
    this.addSql('alter table "designer"."response_attachment" drop column "environment_id";');
    this.addSql(
      'alter table "designer"."response_attachment" add constraint "response_attachment_variant_id_foreign" foreign key ("variant_id") references "designer"."response_variant" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."response_attachment" add constraint "response_attachment_card_id_foreign" foreign key ("card_id") references "designer"."card_attachment" ("id") on update cascade on delete set null;'
    );
    this.addSql(
      'alter table "designer"."response_attachment" add constraint "response_attachment_media_id_foreign" foreign key ("media_id") references "designer"."media_attachment" ("id") on update cascade on delete set null;'
    );
    this.addSql(
      'alter table "designer"."response_attachment" add constraint "response_attachment_pkey" primary key ("id");'
    );
  }
}
