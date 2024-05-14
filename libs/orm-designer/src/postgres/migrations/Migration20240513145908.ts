import { Migration } from '@mikro-orm/migrations';

export class Migration20240513145908 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "designer"."assistant" drop constraint "assistant_active_persona_id_active_environment_id_foreign";');

    this.addSql('alter table "designer"."folder" drop constraint "folder_parent_id_environment_id_foreign";');

    this.addSql('alter table "designer"."workflow" drop constraint "workflow_folder_id_environment_id_foreign";');

    this.addSql('alter table "designer"."variable" drop constraint "variable_folder_id_environment_id_foreign";');

    this.addSql('alter table "designer"."response" drop constraint "response_folder_id_environment_id_foreign";');

    this.addSql('alter table "designer"."response_discriminator" drop constraint "response_discriminator_response_id_environment_id_foreign";');

    this.addSql('alter table "designer"."persona" drop constraint "persona_folder_id_environment_id_foreign";');

    this.addSql('alter table "designer"."persona_override" drop constraint "persona_override_persona_id_environment_id_foreign";');

    this.addSql('alter table "designer"."prompt" drop constraint "prompt_folder_id_environment_id_foreign";');
    this.addSql('alter table "designer"."prompt" drop constraint "prompt_persona_id_environment_id_foreign";');

    this.addSql('alter table "designer"."intent" drop constraint "intent_folder_id_environment_id_foreign";');

    this.addSql('alter table "designer"."utterance" drop constraint "utterance_intent_id_environment_id_foreign";');

    this.addSql('alter table "designer"."function" drop constraint "function_folder_id_environment_id_foreign";');

    this.addSql('alter table "designer"."function_variable" drop constraint "function_variable_function_id_environment_id_foreign";');

    this.addSql('alter table "designer"."function_path" drop constraint "function_path_function_id_environment_id_foreign";');

    this.addSql('alter table "designer"."flow" drop constraint "flow_folder_id_environment_id_foreign";');

    this.addSql('alter table "designer"."event" drop constraint "event_folder_id_environment_id_foreign";');

    this.addSql('alter table "designer"."event_mapping" drop constraint "event_mapping_event_id_environment_id_foreign";');
    this.addSql('alter table "designer"."event_mapping" drop constraint "event_mapping_variable_id_environment_id_foreign";');

    this.addSql('alter table "designer"."entity" drop constraint "entity_folder_id_environment_id_foreign";');

    this.addSql('alter table "designer"."required_entity" drop constraint "required_entity_entity_id_environment_id_foreign";');
    this.addSql('alter table "designer"."required_entity" drop constraint "required_entity_intent_id_environment_id_foreign";');
    this.addSql('alter table "designer"."required_entity" drop constraint "required_entity_reprompt_id_environment_id_foreign";');

    this.addSql('alter table "designer"."entity_variant" drop constraint "entity_variant_entity_id_environment_id_foreign";');

    this.addSql('alter table "designer"."card_attachment" drop constraint "card_attachment_media_id_environment_id_foreign";');

    this.addSql('alter table "designer"."card_button" drop constraint "card_button_card_id_environment_id_foreign";');

    this.addSql('alter table "designer"."condition" drop constraint "condition_prompt_id_environment_id_foreign";');

    this.addSql('alter table "designer"."condition_predicate" drop constraint "condition_predicate_condition_id_environment_id_foreign";');

    this.addSql('alter table "designer"."condition_assertion" drop constraint "condition_assertion_condition_id_environment_id_foreign";');

    this.addSql('alter table "designer"."response_variant" drop constraint "response_variant_condition_id_environment_id_foreign";');
    this.addSql('alter table "designer"."response_variant" drop constraint "response_variant_discriminator_id_environment_id_foreign";');
    this.addSql('alter table "designer"."response_variant" drop constraint "response_variant_prompt_id_environment_id_foreign";');

    this.addSql('alter table "designer"."response_attachment" drop constraint "response_attachment_variant_id_environment_id_foreign";');
    this.addSql('alter table "designer"."response_attachment" drop constraint "response_attachment_card_id_environment_id_foreign";');
    this.addSql('alter table "designer"."response_attachment" drop constraint "response_attachment_media_id_environment_id_foreign";');

    this.addSql('alter table "designer"."assistant" drop constraint "assistant_active_persona_id_active_environment_id_unique";');

    this.addSql('alter table "designer"."media_attachment" drop constraint "media_attachment_id_environment_id_unique";');
    this.addSql('alter table "designer"."media_attachment" drop constraint "media_attachment_pkey";');
    this.addSql('alter table "designer"."media_attachment" add constraint "media_attachment_pkey" primary key ("environment_id", "id");');

    this.addSql('alter table "designer"."folder" drop constraint "folder_id_environment_id_unique";');
    this.addSql('alter table "designer"."folder" drop constraint "folder_pkey";');
    this.addSql('alter table "designer"."folder" add constraint "folder_pkey" primary key ("environment_id", "id");');
    this.addSql(
      'alter table "designer"."folder" add constraint "folder_environment_id_parent_id_foreign" foreign key ("environment_id", "parent_id") references "designer"."folder" ("environment_id", "id") on update cascade on delete cascade;'
    );

    this.addSql('alter table "designer"."workflow" drop constraint "workflow_id_environment_id_unique";');
    this.addSql(
      'alter table "designer"."workflow" add constraint "workflow_environment_id_folder_id_foreign" foreign key ("environment_id", "folder_id") references "designer"."folder" ("environment_id", "id") on update cascade on delete cascade;'
    );

    this.addSql('alter table "designer"."variable" drop constraint "variable_id_environment_id_unique";');
    this.addSql('alter table "designer"."variable" drop constraint "variable_pkey";');
    this.addSql(
      'alter table "designer"."variable" add constraint "variable_environment_id_folder_id_foreign" foreign key ("environment_id", "folder_id") references "designer"."folder" ("environment_id", "id") on update cascade on delete cascade;'
    );
    this.addSql('alter table "designer"."variable" add constraint "variable_pkey" primary key ("environment_id", "id");');

    this.addSql('alter table "designer"."response" drop constraint "response_id_environment_id_unique";');
    this.addSql(
      'alter table "designer"."response" add constraint "response_environment_id_folder_id_foreign" foreign key ("environment_id", "folder_id") references "designer"."folder" ("environment_id", "id") on update cascade on delete cascade;'
    );

    this.addSql('alter table "designer"."response_discriminator" drop constraint "response_discriminator_id_environment_id_unique";');
    this.addSql('alter table "designer"."response_discriminator" drop constraint "response_discriminator_pkey";');
    this.addSql(
      'alter table "designer"."response_discriminator" add constraint "response_discriminator_environment_id_response_id_foreign" foreign key ("environment_id", "response_id") references "designer"."response" ("environment_id", "id") on update cascade on delete cascade;'
    );

    this.addSql('alter table "designer"."response_discriminator" add constraint "response_discriminator_pkey" primary key ("environment_id", "id");');

    this.addSql('alter table "designer"."persona" drop constraint "persona_id_environment_id_unique";');
    this.addSql(
      'alter table "designer"."persona" add constraint "persona_environment_id_folder_id_foreign" foreign key ("environment_id", "folder_id") references "designer"."folder" ("environment_id", "id") on update cascade on delete cascade;'
    );

    this.addSql('alter table "designer"."persona_override" drop constraint "persona_override_id_environment_id_unique";');
    this.addSql('alter table "designer"."persona_override" drop constraint "persona_override_pkey";');
    this.addSql(
      'alter table "designer"."persona_override" add constraint "persona_override_environment_id_persona_id_foreign" foreign key ("environment_id", "persona_id") references "designer"."persona" ("environment_id", "id") on update cascade on delete cascade;'
    );
    this.addSql('alter table "designer"."persona_override" add constraint "persona_override_pkey" primary key ("environment_id", "id");');

    this.addSql('alter table "designer"."prompt" drop constraint "prompt_id_environment_id_unique";');
    this.addSql(
      'alter table "designer"."prompt" add constraint "prompt_environment_id_folder_id_foreign" foreign key ("environment_id", "folder_id") references "designer"."folder" ("environment_id", "id") on update cascade on delete cascade;'
    );
    this.addSql(
      'alter table "designer"."prompt" add constraint "prompt_environment_id_persona_id_foreign" foreign key ("environment_id", "persona_id") references "designer"."persona_override" ("environment_id", "id") on update cascade on delete set default;'
    );

    this.addSql('alter table "designer"."intent" drop constraint "intent_id_environment_id_unique";');
    this.addSql('alter table "designer"."intent" drop constraint "intent_pkey";');
    this.addSql(
      'alter table "designer"."intent" add constraint "intent_environment_id_folder_id_foreign" foreign key ("environment_id", "folder_id") references "designer"."folder" ("environment_id", "id") on update cascade on delete cascade;'
    );
    this.addSql('alter table "designer"."intent" add constraint "intent_pkey" primary key ("environment_id", "id");');

    this.addSql('alter table "designer"."utterance" alter column "environment_id" type varchar(64) using ("environment_id"::varchar(64));');
    this.addSql('alter table "designer"."utterance" alter column "intent_id" type varchar(24) using ("intent_id"::varchar(24));');
    this.addSql('alter table "designer"."utterance" drop constraint "utterance_id_environment_id_unique";');
    this.addSql('alter table "designer"."utterance" drop constraint "utterance_pkey";');
    this.addSql(
      'alter table "designer"."utterance" add constraint "utterance_environment_id_intent_id_foreign" foreign key ("environment_id", "intent_id") references "designer"."intent" ("environment_id", "id") on update cascade on delete cascade;'
    );
    this.addSql('alter table "designer"."utterance" add constraint "utterance_pkey" primary key ("environment_id", "id");');

    this.addSql('alter table "designer"."function" drop constraint "function_id_environment_id_unique";');
    this.addSql(
      'alter table "designer"."function" add constraint "function_environment_id_folder_id_foreign" foreign key ("environment_id", "folder_id") references "designer"."folder" ("environment_id", "id") on update cascade on delete cascade;'
    );

    this.addSql('alter table "designer"."function_variable" drop constraint "function_variable_id_environment_id_unique";');
    this.addSql('alter table "designer"."function_variable" drop constraint "function_variable_pkey";');
    this.addSql(
      'alter table "designer"."function_variable" add constraint "function_variable_environment_id_function_id_foreign" foreign key ("environment_id", "function_id") references "designer"."function" ("environment_id", "id") on update cascade on delete cascade;'
    );
    this.addSql('alter table "designer"."function_variable" add constraint "function_variable_pkey" primary key ("environment_id", "id");');

    this.addSql('alter table "designer"."function_path" drop constraint "function_path_id_environment_id_unique";');
    this.addSql('alter table "designer"."function_path" drop constraint "function_path_pkey";');
    this.addSql(
      'alter table "designer"."function_path" add constraint "function_path_environment_id_function_id_foreign" foreign key ("environment_id", "function_id") references "designer"."function" ("environment_id", "id") on update cascade on delete cascade;'
    );
    this.addSql('alter table "designer"."function_path" add constraint "function_path_pkey" primary key ("environment_id", "id");');

    this.addSql('alter table "designer"."flow" drop constraint "flow_id_environment_id_unique";');
    this.addSql(
      'alter table "designer"."flow" add constraint "flow_environment_id_folder_id_foreign" foreign key ("environment_id", "folder_id") references "designer"."folder" ("environment_id", "id") on update cascade on delete cascade;'
    );

    this.addSql('alter table "designer"."event" drop constraint "event_id_environment_id_unique";');
    this.addSql(
      'alter table "designer"."event" add constraint "event_environment_id_folder_id_foreign" foreign key ("environment_id", "folder_id") references "designer"."folder" ("environment_id", "id") on update cascade on delete cascade;'
    );

    this.addSql('alter table "designer"."event_mapping" alter column "environment_id" type varchar(64) using ("environment_id"::varchar(64));');
    this.addSql('alter table "designer"."event_mapping" alter column "variable_id" type varchar(24) using ("variable_id"::varchar(24));');
    this.addSql('alter table "designer"."event_mapping" drop constraint "event_mapping_id_environment_id_unique";');
    this.addSql('alter table "designer"."event_mapping" drop constraint "event_mapping_pkey";');
    this.addSql(
      'alter table "designer"."event_mapping" add constraint "event_mapping_environment_id_event_id_foreign" foreign key ("environment_id", "event_id") references "designer"."event" ("environment_id", "id") on update cascade on delete cascade;'
    );
    this.addSql(
      'alter table "designer"."event_mapping" add constraint "event_mapping_environment_id_variable_id_foreign" foreign key ("environment_id", "variable_id") references "designer"."variable" ("environment_id", "id") on update cascade on delete set default;'
    );
    this.addSql('alter table "designer"."event_mapping" add constraint "event_mapping_pkey" primary key ("environment_id", "id");');

    this.addSql('alter table "designer"."entity" drop constraint "entity_id_environment_id_unique";');
    this.addSql('alter table "designer"."entity" drop constraint "entity_pkey";');
    this.addSql(
      'alter table "designer"."entity" add constraint "entity_environment_id_folder_id_foreign" foreign key ("environment_id", "folder_id") references "designer"."folder" ("environment_id", "id") on update cascade on delete cascade;'
    );
    this.addSql('alter table "designer"."entity" add constraint "entity_pkey" primary key ("environment_id", "id");');

    this.addSql('alter table "designer"."required_entity" alter column "entity_id" type varchar(24) using ("entity_id"::varchar(24));');
    this.addSql('alter table "designer"."required_entity" alter column "intent_id" type varchar(24) using ("intent_id"::varchar(24));');
    this.addSql('alter table "designer"."required_entity" drop constraint "required_entity_id_environment_id_unique";');
    this.addSql('alter table "designer"."required_entity" drop constraint "required_entity_pkey";');
    this.addSql(
      'alter table "designer"."required_entity" add constraint "required_entity_environment_id_entity_id_foreign" foreign key ("environment_id", "entity_id") references "designer"."entity" ("environment_id", "id") on update cascade on delete cascade;'
    );
    this.addSql(
      'alter table "designer"."required_entity" add constraint "required_entity_environment_id_intent_id_foreign" foreign key ("environment_id", "intent_id") references "designer"."intent" ("environment_id", "id") on update cascade on delete cascade;'
    );
    this.addSql(
      'alter table "designer"."required_entity" add constraint "required_entity_environment_id_reprompt_id_foreign" foreign key ("environment_id", "reprompt_id") references "designer"."response" ("environment_id", "id") on update cascade on delete set default;'
    );
    this.addSql('alter table "designer"."required_entity" add constraint "required_entity_pkey" primary key ("environment_id", "id");');

    this.addSql('alter table "designer"."entity_variant" alter column "environment_id" type varchar(64) using ("environment_id"::varchar(64));');
    this.addSql('alter table "designer"."entity_variant" alter column "entity_id" type varchar(24) using ("entity_id"::varchar(24));');
    this.addSql('alter table "designer"."entity_variant" drop constraint "entity_variant_id_environment_id_unique";');
    this.addSql('alter table "designer"."entity_variant" drop constraint "entity_variant_pkey";');
    this.addSql(
      'alter table "designer"."entity_variant" add constraint "entity_variant_environment_id_entity_id_foreign" foreign key ("environment_id", "entity_id") references "designer"."entity" ("environment_id", "id") on update cascade on delete cascade;'
    );
    this.addSql('alter table "designer"."entity_variant" add constraint "entity_variant_pkey" primary key ("environment_id", "id");');

    this.addSql('alter table "designer"."card_attachment" drop constraint "card_attachment_id_environment_id_unique";');
    this.addSql(
      'alter table "designer"."card_attachment" add constraint "card_attachment_environment_id_media_id_foreign" foreign key ("environment_id", "media_id") references "designer"."media_attachment" ("environment_id", "id") on update cascade on delete set default;'
    );

    this.addSql('alter table "designer"."card_button" drop constraint "card_button_id_environment_id_unique";');
    this.addSql('alter table "designer"."card_button" drop constraint "card_button_pkey";');
    this.addSql(
      'alter table "designer"."card_button" add constraint "card_button_environment_id_card_id_foreign" foreign key ("environment_id", "card_id") references "designer"."card_attachment" ("environment_id", "id") on update cascade on delete cascade;'
    );
    this.addSql('alter table "designer"."card_button" add constraint "card_button_pkey" primary key ("environment_id", "id");');

    this.addSql('alter table "designer"."condition" drop constraint "condition_id_environment_id_unique";');
    this.addSql('alter table "designer"."condition" drop constraint "condition_pkey";');
    this.addSql(
      'alter table "designer"."condition" add constraint "condition_environment_id_prompt_id_foreign" foreign key ("environment_id", "prompt_id") references "designer"."prompt" ("environment_id", "id") on update cascade on delete set default;'
    );
    this.addSql('alter table "designer"."condition" add constraint "condition_pkey" primary key ("environment_id", "id");');

    this.addSql('alter table "designer"."condition_predicate" drop constraint "condition_predicate_id_environment_id_unique";');
    this.addSql('alter table "designer"."condition_predicate" drop constraint "condition_predicate_pkey";');
    this.addSql(
      'alter table "designer"."condition_predicate" add constraint "condition_predicate_environment_id_condition_id_foreign" foreign key ("environment_id", "condition_id") references "designer"."condition" ("environment_id", "id") on update cascade on delete cascade;'
    );
    this.addSql('alter table "designer"."condition_predicate" add constraint "condition_predicate_pkey" primary key ("environment_id", "id");');

    this.addSql('alter table "designer"."condition_assertion" drop constraint "condition_assertion_id_environment_id_unique";');
    this.addSql('alter table "designer"."condition_assertion" drop constraint "condition_assertion_pkey";');
    this.addSql(
      'alter table "designer"."condition_assertion" add constraint "condition_assertion_environment_id_condition_id_foreign" foreign key ("environment_id", "condition_id") references "designer"."condition" ("environment_id", "id") on update cascade on delete cascade;'
    );
    this.addSql('alter table "designer"."condition_assertion" add constraint "condition_assertion_pkey" primary key ("environment_id", "id");');

    this.addSql('alter table "designer"."response_variant" drop constraint "response_variant_id_environment_id_unique";');
    this.addSql('alter table "designer"."response_variant" drop constraint "response_variant_pkey";');
    this.addSql(
      'alter table "designer"."response_variant" add constraint "response_variant_environment_id_condition_id_foreign" foreign key ("environment_id", "condition_id") references "designer"."condition" ("environment_id", "id") on update cascade on delete set default;'
    );
    this.addSql(
      'alter table "designer"."response_variant" add constraint "response_variant_environment_id_discriminator_id_foreign" foreign key ("environment_id", "discriminator_id") references "designer"."response_discriminator" ("environment_id", "id") on update cascade on delete cascade;'
    );
    this.addSql(
      'alter table "designer"."response_variant" add constraint "response_variant_environment_id_prompt_id_foreign" foreign key ("environment_id", "prompt_id") references "designer"."prompt" ("environment_id", "id") on update cascade on delete set default;'
    );
    this.addSql('alter table "designer"."response_variant" add constraint "response_variant_pkey" primary key ("environment_id", "id");');

    this.addSql('alter table "designer"."response_attachment" drop constraint "response_attachment_id_environment_id_unique";');
    this.addSql('alter table "designer"."response_attachment" drop constraint "response_attachment_pkey";');
    this.addSql(
      'alter table "designer"."response_attachment" add constraint "response_attachment_environment_id_variant_id_foreign" foreign key ("environment_id", "variant_id") references "designer"."response_variant" ("environment_id", "id") on update cascade on delete cascade;'
    );
    this.addSql(
      'alter table "designer"."response_attachment" add constraint "response_attachment_environment_id_card_id_foreign" foreign key ("environment_id", "card_id") references "designer"."card_attachment" ("environment_id", "id") on update cascade on delete cascade;'
    );
    this.addSql(
      'alter table "designer"."response_attachment" add constraint "response_attachment_environment_id_media_id_foreign" foreign key ("environment_id", "media_id") references "designer"."media_attachment" ("environment_id", "id") on update cascade on delete cascade;'
    );
    this.addSql('alter table "designer"."response_attachment" add constraint "response_attachment_pkey" primary key ("environment_id", "id");');

    this.addSql(
      'alter table "designer"."assistant" add constraint "assistant_active_environment_id_active_persona_id_foreign" foreign key ("active_environment_id", "active_persona_id") references "designer"."persona" ("environment_id", "id") on update cascade on delete set default;'
    );
    this.addSql(
      'alter table "designer"."assistant" add constraint "assistant_active_environment_id_active_persona_id_unique" unique ("active_environment_id", "active_persona_id");'
    );

    this.addSql('drop index "designer"."media_attachment_environment_id_index";');

    this.addSql('drop index "designer"."prompt_environment_id_index";');

    this.addSql('drop index "designer"."function_path_environment_id_index";');

    this.addSql('drop index "designer"."response_attachment_environment_id_index";');

    this.addSql('drop index "designer"."folder_environment_id_index";');

    this.addSql('drop index "designer"."variable_environment_id_index";');

    this.addSql('drop index "designer"."response_environment_id_index";');

    this.addSql('drop index "designer"."response_discriminator_environment_id_index";');

    this.addSql('drop index "designer"."persona_environment_id_index";');

    this.addSql('drop index "designer"."persona_override_environment_id_index";');

    this.addSql('drop index "designer"."intent_environment_id_index";');

    this.addSql('drop index "designer"."utterance_environment_id_index";');

    this.addSql('drop index "designer"."function_environment_id_index";');

    this.addSql('drop index "designer"."function_variable_environment_id_index";');

    this.addSql('drop index "designer"."flow_environment_id_index";');

    this.addSql('drop index "designer"."workflow_environment_id_index";');

    this.addSql('drop index "designer"."event_environment_id_index";');

    this.addSql('drop index "designer"."event_mapping_environment_id_index";');

    this.addSql('drop index "designer"."card_attachment_environment_id_index";');

    this.addSql('drop index "designer"."card_button_environment_id_index";');

    this.addSql('drop index "designer"."condition_environment_id_index";');

    this.addSql('drop index "designer"."condition_predicate_environment_id_index";');

    this.addSql('drop index "designer"."condition_assertion_environment_id_index";');

    this.addSql('drop index "designer"."response_variant_environment_id_index";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "designer"."assistant" drop constraint "assistant_active_environment_id_active_persona_id_foreign";');

    this.addSql('alter table "designer"."folder" drop constraint "folder_environment_id_parent_id_foreign";');

    this.addSql('alter table "designer"."workflow" drop constraint "workflow_environment_id_folder_id_foreign";');

    this.addSql('alter table "designer"."variable" drop constraint "variable_environment_id_folder_id_foreign";');

    this.addSql('alter table "designer"."response" drop constraint "response_environment_id_folder_id_foreign";');

    this.addSql('alter table "designer"."response_discriminator" drop constraint "response_discriminator_environment_id_response_id_foreign";');

    this.addSql('alter table "designer"."persona" drop constraint "persona_environment_id_folder_id_foreign";');

    this.addSql('alter table "designer"."persona_override" drop constraint "persona_override_environment_id_persona_id_foreign";');

    this.addSql('alter table "designer"."prompt" drop constraint "prompt_environment_id_folder_id_foreign";');
    this.addSql('alter table "designer"."prompt" drop constraint "prompt_environment_id_persona_id_foreign";');

    this.addSql('alter table "designer"."intent" drop constraint "intent_environment_id_folder_id_foreign";');

    this.addSql('alter table "designer"."utterance" drop constraint "utterance_environment_id_intent_id_foreign";');

    this.addSql('alter table "designer"."function" drop constraint "function_environment_id_folder_id_foreign";');

    this.addSql('alter table "designer"."function_variable" drop constraint "function_variable_environment_id_function_id_foreign";');

    this.addSql('alter table "designer"."function_path" drop constraint "function_path_environment_id_function_id_foreign";');

    this.addSql('alter table "designer"."flow" drop constraint "flow_environment_id_folder_id_foreign";');

    this.addSql('alter table "designer"."event" drop constraint "event_environment_id_folder_id_foreign";');

    this.addSql('alter table "designer"."event_mapping" drop constraint "event_mapping_environment_id_event_id_foreign";');
    this.addSql('alter table "designer"."event_mapping" drop constraint "event_mapping_environment_id_variable_id_foreign";');

    this.addSql('alter table "designer"."entity" drop constraint "entity_environment_id_folder_id_foreign";');

    this.addSql('alter table "designer"."required_entity" drop constraint "required_entity_environment_id_entity_id_foreign";');
    this.addSql('alter table "designer"."required_entity" drop constraint "required_entity_environment_id_intent_id_foreign";');
    this.addSql('alter table "designer"."required_entity" drop constraint "required_entity_environment_id_reprompt_id_foreign";');

    this.addSql('alter table "designer"."entity_variant" drop constraint "entity_variant_environment_id_entity_id_foreign";');

    this.addSql('alter table "designer"."card_attachment" drop constraint "card_attachment_environment_id_media_id_foreign";');

    this.addSql('alter table "designer"."card_button" drop constraint "card_button_environment_id_card_id_foreign";');

    this.addSql('alter table "designer"."condition" drop constraint "condition_environment_id_prompt_id_foreign";');

    this.addSql('alter table "designer"."condition_predicate" drop constraint "condition_predicate_environment_id_condition_id_foreign";');

    this.addSql('alter table "designer"."condition_assertion" drop constraint "condition_assertion_environment_id_condition_id_foreign";');

    this.addSql('alter table "designer"."response_variant" drop constraint "response_variant_environment_id_condition_id_foreign";');
    this.addSql('alter table "designer"."response_variant" drop constraint "response_variant_environment_id_discriminator_id_foreign";');
    this.addSql('alter table "designer"."response_variant" drop constraint "response_variant_environment_id_prompt_id_foreign";');

    this.addSql('alter table "designer"."response_attachment" drop constraint "response_attachment_environment_id_variant_id_foreign";');
    this.addSql('alter table "designer"."response_attachment" drop constraint "response_attachment_environment_id_card_id_foreign";');
    this.addSql('alter table "designer"."response_attachment" drop constraint "response_attachment_environment_id_media_id_foreign";');

    this.addSql(
      'alter table "designer"."assistant" add constraint "assistant_active_persona_id_active_environment_id_foreign" foreign key ("active_persona_id", "active_environment_id") references "designer"."persona" ("id", "environment_id") on update cascade on delete set default;'
    );
    this.addSql(
      'alter table "designer"."assistant" add constraint "assistant_active_persona_id_active_environment_id_unique" unique ("active_persona_id", "active_environment_id");'
    );

    this.addSql('alter table "designer"."media_attachment" drop constraint "media_attachment_pkey";');
    this.addSql(
      'alter table "designer"."media_attachment" add constraint "media_attachment_id_environment_id_unique" unique ("id", "environment_id");'
    );
    this.addSql('alter table "designer"."media_attachment" add constraint "media_attachment_pkey" primary key ("id", "environment_id");');

    this.addSql('alter table "designer"."folder" drop constraint "folder_pkey";');
    this.addSql('alter table "designer"."folder" add constraint "folder_id_environment_id_unique" unique ("id", "environment_id");');
    this.addSql('alter table "designer"."folder" add constraint "folder_pkey" primary key ("id", "environment_id");');
    this.addSql(
      'alter table "designer"."folder" add constraint "folder_parent_id_environment_id_foreign" foreign key ("parent_id", "environment_id") references "designer"."folder" ("id", "environment_id") on update cascade on delete cascade;'
    );

    this.addSql(
      'alter table "designer"."workflow" add constraint "workflow_folder_id_environment_id_foreign" foreign key ("folder_id", "environment_id") references "designer"."folder" ("id", "environment_id") on update cascade on delete cascade;'
    );
    this.addSql('alter table "designer"."workflow" add constraint "workflow_id_environment_id_unique" unique ("id", "environment_id");');

    this.addSql('alter table "designer"."variable" drop constraint "variable_pkey";');
    this.addSql(
      'alter table "designer"."variable" add constraint "variable_folder_id_environment_id_foreign" foreign key ("folder_id", "environment_id") references "designer"."folder" ("id", "environment_id") on update cascade on delete cascade;'
    );
    this.addSql('alter table "designer"."variable" add constraint "variable_id_environment_id_unique" unique ("id", "environment_id");');
    this.addSql('alter table "designer"."variable" add constraint "variable_pkey" primary key ("id", "environment_id");');

    this.addSql(
      'alter table "designer"."response" add constraint "response_folder_id_environment_id_foreign" foreign key ("folder_id", "environment_id") references "designer"."folder" ("id", "environment_id") on update cascade on delete cascade;'
    );
    this.addSql('alter table "designer"."response" add constraint "response_id_environment_id_unique" unique ("id", "environment_id");');

    this.addSql('alter table "designer"."response_discriminator" drop constraint "response_discriminator_pkey";');
    this.addSql(
      'alter table "designer"."response_discriminator" add constraint "response_discriminator_response_id_environment_id_foreign" foreign key ("response_id", "environment_id") references "designer"."response" ("id", "environment_id") on update cascade on delete cascade;'
    );
    this.addSql(
      'alter table "designer"."response_discriminator" add constraint "response_discriminator_id_environment_id_unique" unique ("id", "environment_id");'
    );
    this.addSql('alter table "designer"."response_discriminator" add constraint "response_discriminator_pkey" primary key ("id", "environment_id");');

    this.addSql(
      'alter table "designer"."persona" add constraint "persona_folder_id_environment_id_foreign" foreign key ("folder_id", "environment_id") references "designer"."folder" ("id", "environment_id") on update cascade on delete cascade;'
    );
    this.addSql('alter table "designer"."persona" add constraint "persona_id_environment_id_unique" unique ("id", "environment_id");');

    this.addSql('alter table "designer"."persona_override" drop constraint "persona_override_pkey";');
    this.addSql(
      'alter table "designer"."persona_override" add constraint "persona_override_persona_id_environment_id_foreign" foreign key ("persona_id", "environment_id") references "designer"."persona" ("id", "environment_id") on update cascade on delete cascade;'
    );
    this.addSql(
      'alter table "designer"."persona_override" add constraint "persona_override_id_environment_id_unique" unique ("id", "environment_id");'
    );
    this.addSql('alter table "designer"."persona_override" add constraint "persona_override_pkey" primary key ("id", "environment_id");');

    this.addSql(
      'alter table "designer"."prompt" add constraint "prompt_folder_id_environment_id_foreign" foreign key ("folder_id", "environment_id") references "designer"."folder" ("id", "environment_id") on update cascade on delete cascade;'
    );
    this.addSql(
      'alter table "designer"."prompt" add constraint "prompt_persona_id_environment_id_foreign" foreign key ("persona_id", "environment_id") references "designer"."persona_override" ("id", "environment_id") on update cascade on delete set default;'
    );
    this.addSql('alter table "designer"."prompt" add constraint "prompt_id_environment_id_unique" unique ("id", "environment_id");');

    this.addSql('alter table "designer"."intent" drop constraint "intent_pkey";');
    this.addSql(
      'alter table "designer"."intent" add constraint "intent_folder_id_environment_id_foreign" foreign key ("folder_id", "environment_id") references "designer"."folder" ("id", "environment_id") on update cascade on delete cascade;'
    );
    this.addSql('alter table "designer"."intent" add constraint "intent_id_environment_id_unique" unique ("id", "environment_id");');
    this.addSql('alter table "designer"."intent" add constraint "intent_pkey" primary key ("id", "environment_id");');

    this.addSql('alter table "designer"."utterance" alter column "environment_id" type varchar(24) using ("environment_id"::varchar(24));');
    this.addSql('alter table "designer"."utterance" alter column "intent_id" type varchar(64) using ("intent_id"::varchar(64));');
    this.addSql('alter table "designer"."utterance" drop constraint "utterance_pkey";');
    this.addSql(
      'alter table "designer"."utterance" add constraint "utterance_intent_id_environment_id_foreign" foreign key ("intent_id", "environment_id") references "designer"."intent" ("id", "environment_id") on update cascade on delete cascade;'
    );
    this.addSql('alter table "designer"."utterance" add constraint "utterance_id_environment_id_unique" unique ("id", "environment_id");');
    this.addSql('alter table "designer"."utterance" add constraint "utterance_pkey" primary key ("id", "environment_id");');

    this.addSql(
      'alter table "designer"."function" add constraint "function_folder_id_environment_id_foreign" foreign key ("folder_id", "environment_id") references "designer"."folder" ("id", "environment_id") on update cascade on delete cascade;'
    );
    this.addSql('alter table "designer"."function" add constraint "function_id_environment_id_unique" unique ("id", "environment_id");');

    this.addSql('alter table "designer"."function_variable" drop constraint "function_variable_pkey";');
    this.addSql(
      'alter table "designer"."function_variable" add constraint "function_variable_function_id_environment_id_foreign" foreign key ("function_id", "environment_id") references "designer"."function" ("id", "environment_id") on update cascade on delete cascade;'
    );
    this.addSql(
      'alter table "designer"."function_variable" add constraint "function_variable_id_environment_id_unique" unique ("id", "environment_id");'
    );
    this.addSql('alter table "designer"."function_variable" add constraint "function_variable_pkey" primary key ("id", "environment_id");');

    this.addSql('alter table "designer"."function_path" drop constraint "function_path_pkey";');
    this.addSql(
      'alter table "designer"."function_path" add constraint "function_path_function_id_environment_id_foreign" foreign key ("function_id", "environment_id") references "designer"."function" ("id", "environment_id") on update cascade on delete cascade;'
    );
    this.addSql('alter table "designer"."function_path" add constraint "function_path_id_environment_id_unique" unique ("id", "environment_id");');
    this.addSql('alter table "designer"."function_path" add constraint "function_path_pkey" primary key ("id", "environment_id");');

    this.addSql(
      'alter table "designer"."flow" add constraint "flow_folder_id_environment_id_foreign" foreign key ("folder_id", "environment_id") references "designer"."folder" ("id", "environment_id") on update cascade on delete cascade;'
    );
    this.addSql('alter table "designer"."flow" add constraint "flow_id_environment_id_unique" unique ("id", "environment_id");');

    this.addSql(
      'alter table "designer"."event" add constraint "event_folder_id_environment_id_foreign" foreign key ("folder_id", "environment_id") references "designer"."folder" ("id", "environment_id") on update cascade on delete cascade;'
    );
    this.addSql('alter table "designer"."event" add constraint "event_id_environment_id_unique" unique ("id", "environment_id");');

    this.addSql('alter table "designer"."event_mapping" alter column "environment_id" type varchar(24) using ("environment_id"::varchar(24));');
    this.addSql('alter table "designer"."event_mapping" alter column "variable_id" type varchar(64) using ("variable_id"::varchar(64));');
    this.addSql('alter table "designer"."event_mapping" drop constraint "event_mapping_pkey";');
    this.addSql(
      'alter table "designer"."event_mapping" add constraint "event_mapping_event_id_environment_id_foreign" foreign key ("event_id", "environment_id") references "designer"."event" ("id", "environment_id") on update cascade on delete cascade;'
    );
    this.addSql(
      'alter table "designer"."event_mapping" add constraint "event_mapping_variable_id_environment_id_foreign" foreign key ("variable_id", "environment_id") references "designer"."variable" ("id", "environment_id") on update cascade on delete set default;'
    );
    this.addSql('alter table "designer"."event_mapping" add constraint "event_mapping_id_environment_id_unique" unique ("id", "environment_id");');
    this.addSql('alter table "designer"."event_mapping" add constraint "event_mapping_pkey" primary key ("id", "environment_id");');

    this.addSql('alter table "designer"."entity" drop constraint "entity_pkey";');
    this.addSql(
      'alter table "designer"."entity" add constraint "entity_folder_id_environment_id_foreign" foreign key ("folder_id", "environment_id") references "designer"."folder" ("id", "environment_id") on update cascade on delete cascade;'
    );
    this.addSql('alter table "designer"."entity" add constraint "entity_id_environment_id_unique" unique ("id", "environment_id");');
    this.addSql('alter table "designer"."entity" add constraint "entity_pkey" primary key ("id", "environment_id");');

    this.addSql('alter table "designer"."required_entity" alter column "entity_id" type varchar(64) using ("entity_id"::varchar(64));');
    this.addSql('alter table "designer"."required_entity" alter column "intent_id" type varchar(64) using ("intent_id"::varchar(64));');
    this.addSql('alter table "designer"."required_entity" drop constraint "required_entity_pkey";');
    this.addSql(
      'alter table "designer"."required_entity" add constraint "required_entity_entity_id_environment_id_foreign" foreign key ("entity_id", "environment_id") references "designer"."entity" ("id", "environment_id") on update cascade on delete cascade;'
    );
    this.addSql(
      'alter table "designer"."required_entity" add constraint "required_entity_intent_id_environment_id_foreign" foreign key ("intent_id", "environment_id") references "designer"."intent" ("id", "environment_id") on update cascade on delete cascade;'
    );
    this.addSql(
      'alter table "designer"."required_entity" add constraint "required_entity_reprompt_id_environment_id_foreign" foreign key ("reprompt_id", "environment_id") references "designer"."response" ("id", "environment_id") on update cascade on delete set default;'
    );
    this.addSql(
      'alter table "designer"."required_entity" add constraint "required_entity_id_environment_id_unique" unique ("id", "environment_id");'
    );
    this.addSql('alter table "designer"."required_entity" add constraint "required_entity_pkey" primary key ("id", "environment_id");');

    this.addSql('alter table "designer"."entity_variant" alter column "environment_id" type varchar(24) using ("environment_id"::varchar(24));');
    this.addSql('alter table "designer"."entity_variant" alter column "entity_id" type varchar(64) using ("entity_id"::varchar(64));');
    this.addSql('alter table "designer"."entity_variant" drop constraint "entity_variant_pkey";');
    this.addSql(
      'alter table "designer"."entity_variant" add constraint "entity_variant_entity_id_environment_id_foreign" foreign key ("entity_id", "environment_id") references "designer"."entity" ("id", "environment_id") on update cascade on delete cascade;'
    );
    this.addSql('alter table "designer"."entity_variant" add constraint "entity_variant_id_environment_id_unique" unique ("id", "environment_id");');
    this.addSql('alter table "designer"."entity_variant" add constraint "entity_variant_pkey" primary key ("id", "environment_id");');

    this.addSql(
      'alter table "designer"."card_attachment" add constraint "card_attachment_media_id_environment_id_foreign" foreign key ("media_id", "environment_id") references "designer"."media_attachment" ("id", "environment_id") on update cascade on delete set default;'
    );
    this.addSql(
      'alter table "designer"."card_attachment" add constraint "card_attachment_id_environment_id_unique" unique ("id", "environment_id");'
    );

    this.addSql('alter table "designer"."card_button" drop constraint "card_button_pkey";');
    this.addSql(
      'alter table "designer"."card_button" add constraint "card_button_card_id_environment_id_foreign" foreign key ("card_id", "environment_id") references "designer"."card_attachment" ("id", "environment_id") on update cascade on delete cascade;'
    );
    this.addSql('alter table "designer"."card_button" add constraint "card_button_id_environment_id_unique" unique ("id", "environment_id");');
    this.addSql('alter table "designer"."card_button" add constraint "card_button_pkey" primary key ("id", "environment_id");');

    this.addSql('alter table "designer"."condition" drop constraint "condition_pkey";');
    this.addSql(
      'alter table "designer"."condition" add constraint "condition_prompt_id_environment_id_foreign" foreign key ("prompt_id", "environment_id") references "designer"."prompt" ("id", "environment_id") on update cascade on delete set default;'
    );
    this.addSql('alter table "designer"."condition" add constraint "condition_id_environment_id_unique" unique ("id", "environment_id");');
    this.addSql('alter table "designer"."condition" add constraint "condition_pkey" primary key ("id", "environment_id");');

    this.addSql('alter table "designer"."condition_predicate" drop constraint "condition_predicate_pkey";');
    this.addSql(
      'alter table "designer"."condition_predicate" add constraint "condition_predicate_condition_id_environment_id_foreign" foreign key ("condition_id", "environment_id") references "designer"."condition" ("id", "environment_id") on update cascade on delete cascade;'
    );
    this.addSql(
      'alter table "designer"."condition_predicate" add constraint "condition_predicate_id_environment_id_unique" unique ("id", "environment_id");'
    );
    this.addSql('alter table "designer"."condition_predicate" add constraint "condition_predicate_pkey" primary key ("id", "environment_id");');

    this.addSql('alter table "designer"."condition_assertion" drop constraint "condition_assertion_pkey";');
    this.addSql(
      'alter table "designer"."condition_assertion" add constraint "condition_assertion_condition_id_environment_id_foreign" foreign key ("condition_id", "environment_id") references "designer"."condition" ("id", "environment_id") on update cascade on delete cascade;'
    );
    this.addSql(
      'alter table "designer"."condition_assertion" add constraint "condition_assertion_id_environment_id_unique" unique ("id", "environment_id");'
    );
    this.addSql('alter table "designer"."condition_assertion" add constraint "condition_assertion_pkey" primary key ("id", "environment_id");');

    this.addSql('alter table "designer"."response_variant" drop constraint "response_variant_pkey";');
    this.addSql(
      'alter table "designer"."response_variant" add constraint "response_variant_condition_id_environment_id_foreign" foreign key ("condition_id", "environment_id") references "designer"."condition" ("id", "environment_id") on update cascade on delete set default;'
    );
    this.addSql(
      'alter table "designer"."response_variant" add constraint "response_variant_discriminator_id_environment_id_foreign" foreign key ("discriminator_id", "environment_id") references "designer"."response_discriminator" ("id", "environment_id") on update cascade on delete cascade;'
    );
    this.addSql(
      'alter table "designer"."response_variant" add constraint "response_variant_prompt_id_environment_id_foreign" foreign key ("prompt_id", "environment_id") references "designer"."prompt" ("id", "environment_id") on update cascade on delete set default;'
    );
    this.addSql(
      'alter table "designer"."response_variant" add constraint "response_variant_id_environment_id_unique" unique ("id", "environment_id");'
    );
    this.addSql('alter table "designer"."response_variant" add constraint "response_variant_pkey" primary key ("id", "environment_id");');

    this.addSql('alter table "designer"."response_attachment" drop constraint "response_attachment_pkey";');
    this.addSql(
      'alter table "designer"."response_attachment" add constraint "response_attachment_variant_id_environment_id_foreign" foreign key ("variant_id", "environment_id") references "designer"."response_variant" ("id", "environment_id") on update cascade on delete cascade;'
    );
    this.addSql(
      'alter table "designer"."response_attachment" add constraint "response_attachment_card_id_environment_id_foreign" foreign key ("card_id", "environment_id") references "designer"."card_attachment" ("id", "environment_id") on update cascade on delete cascade;'
    );
    this.addSql(
      'alter table "designer"."response_attachment" add constraint "response_attachment_media_id_environment_id_foreign" foreign key ("media_id", "environment_id") references "designer"."media_attachment" ("id", "environment_id") on update cascade on delete cascade;'
    );
    this.addSql(
      'alter table "designer"."response_attachment" add constraint "response_attachment_id_environment_id_unique" unique ("id", "environment_id");'
    );
    this.addSql('alter table "designer"."response_attachment" add constraint "response_attachment_pkey" primary key ("id", "environment_id");');

    this.addSql('create index "media_attachment_environment_id_index" on "designer"."media_attachment" ("environment_id");');

    this.addSql('create index "prompt_environment_id_index" on "designer"."prompt" ("environment_id");');

    this.addSql('create index "function_path_environment_id_index" on "designer"."function_path" ("environment_id");');

    this.addSql('create index "response_attachment_environment_id_index" on "designer"."response_attachment" ("environment_id");');

    this.addSql('create index "folder_environment_id_index" on "designer"."folder" ("environment_id");');

    this.addSql('create index "variable_environment_id_index" on "designer"."variable" ("environment_id");');

    this.addSql('create index "response_environment_id_index" on "designer"."response" ("environment_id");');

    this.addSql('create index "response_discriminator_environment_id_index" on "designer"."response_discriminator" ("environment_id");');

    this.addSql('create index "persona_environment_id_index" on "designer"."persona" ("environment_id");');

    this.addSql('create index "persona_override_environment_id_index" on "designer"."persona_override" ("environment_id");');

    this.addSql('create index "intent_environment_id_index" on "designer"."intent" ("environment_id");');

    this.addSql('create index "utterance_environment_id_index" on "designer"."utterance" ("environment_id");');

    this.addSql('create index "function_environment_id_index" on "designer"."function" ("environment_id");');

    this.addSql('create index "function_variable_environment_id_index" on "designer"."function_variable" ("environment_id");');

    this.addSql('create index "flow_environment_id_index" on "designer"."flow" ("environment_id");');

    this.addSql('create index "workflow_environment_id_index" on "designer"."workflow" ("environment_id");');

    this.addSql('create index "event_environment_id_index" on "designer"."event" ("environment_id");');

    this.addSql('create index "event_mapping_environment_id_index" on "designer"."event_mapping" ("environment_id");');

    this.addSql('create index "card_attachment_environment_id_index" on "designer"."card_attachment" ("environment_id");');

    this.addSql('create index "card_button_environment_id_index" on "designer"."card_button" ("environment_id");');

    this.addSql('create index "condition_environment_id_index" on "designer"."condition" ("environment_id");');

    this.addSql('create index "condition_predicate_environment_id_index" on "designer"."condition_predicate" ("environment_id");');

    this.addSql('create index "condition_assertion_environment_id_index" on "designer"."condition_assertion" ("environment_id");');

    this.addSql('create index "response_variant_environment_id_index" on "designer"."response_variant" ("environment_id");');

    this.addSql('alter table "designer"."assistant" drop constraint "assistant_active_environment_id_active_persona_id_unique";');
  }
}
