import { Migration } from '@mikro-orm/migrations';

export class Migration20231020122033 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "designer"."assistant" drop constraint "assistant_workspace_id_foreign";');
    this.addSql(
      'alter table "designer"."assistant" drop constraint "assistant_active_persona_id_active_environment_id_foreign";'
    );

    this.addSql('alter table "designer"."media_attachment" drop constraint "media_attachment_assistant_id_foreign";');

    this.addSql('alter table "designer"."folder" drop constraint "folder_parent_id_environment_id_foreign";');
    this.addSql('alter table "designer"."folder" drop constraint "folder_assistant_id_foreign";');

    this.addSql('alter table "designer"."variable" drop constraint "variable_assistant_id_foreign";');
    this.addSql('alter table "designer"."variable" drop constraint "variable_folder_id_environment_id_foreign";');

    this.addSql('alter table "designer"."response" drop constraint "response_assistant_id_foreign";');
    this.addSql('alter table "designer"."response" drop constraint "response_folder_id_environment_id_foreign";');

    this.addSql(
      'alter table "designer"."response_discriminator" drop constraint "response_discriminator_response_id_environment_id_foreign";'
    );
    this.addSql(
      'alter table "designer"."response_discriminator" drop constraint "response_discriminator_assistant_id_foreign";'
    );

    this.addSql('alter table "designer"."persona" drop constraint "persona_assistant_id_foreign";');
    this.addSql('alter table "designer"."persona" drop constraint "persona_folder_id_environment_id_foreign";');

    this.addSql(
      'alter table "designer"."persona_override" drop constraint "persona_override_persona_id_environment_id_foreign";'
    );
    this.addSql('alter table "designer"."persona_override" drop constraint "persona_override_assistant_id_foreign";');

    this.addSql('alter table "designer"."prompt" drop constraint "prompt_assistant_id_foreign";');
    this.addSql('alter table "designer"."prompt" drop constraint "prompt_folder_id_environment_id_foreign";');
    this.addSql('alter table "designer"."prompt" drop constraint "prompt_persona_id_environment_id_foreign";');

    this.addSql('alter table "designer"."intent" drop constraint "intent_assistant_id_foreign";');
    this.addSql('alter table "designer"."intent" drop constraint "intent_folder_id_environment_id_foreign";');

    this.addSql('alter table "designer"."utterance" drop constraint "utterance_intent_id_environment_id_foreign";');
    this.addSql('alter table "designer"."utterance" drop constraint "utterance_assistant_id_foreign";');

    this.addSql('alter table "designer"."function" drop constraint "function_assistant_id_foreign";');
    this.addSql('alter table "designer"."function" drop constraint "function_folder_id_environment_id_foreign";');

    this.addSql(
      'alter table "designer"."function_variable" drop constraint "function_variable_function_id_environment_id_foreign";'
    );
    this.addSql('alter table "designer"."function_variable" drop constraint "function_variable_assistant_id_foreign";');

    this.addSql(
      'alter table "designer"."function_path" drop constraint "function_path_function_id_environment_id_foreign";'
    );
    this.addSql('alter table "designer"."function_path" drop constraint "function_path_assistant_id_foreign";');

    this.addSql('alter table "designer"."flow" drop constraint "flow_assistant_id_foreign";');
    this.addSql('alter table "designer"."flow" drop constraint "flow_folder_id_environment_id_foreign";');

    this.addSql('alter table "designer"."story" drop constraint "story_assistant_id_foreign";');
    this.addSql('alter table "designer"."story" drop constraint "story_folder_id_environment_id_foreign";');
    this.addSql('alter table "designer"."story" drop constraint "story_flow_id_environment_id_foreign";');
    this.addSql('alter table "designer"."story" drop constraint "story_assignee_id_foreign";');

    this.addSql('alter table "designer"."event" drop constraint "event_assistant_id_foreign";');
    this.addSql('alter table "designer"."event" drop constraint "event_folder_id_environment_id_foreign";');

    this.addSql(
      'alter table "designer"."event_mapping" drop constraint "event_mapping_event_id_environment_id_foreign";'
    );
    this.addSql(
      'alter table "designer"."event_mapping" drop constraint "event_mapping_variable_id_environment_id_foreign";'
    );
    this.addSql('alter table "designer"."event_mapping" drop constraint "event_mapping_assistant_id_foreign";');

    this.addSql('alter table "designer"."entity" drop constraint "entity_assistant_id_foreign";');
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
    this.addSql('alter table "designer"."required_entity" drop constraint "required_entity_assistant_id_foreign";');

    this.addSql(
      'alter table "designer"."entity_variant" drop constraint "entity_variant_entity_id_environment_id_foreign";'
    );
    this.addSql('alter table "designer"."entity_variant" drop constraint "entity_variant_assistant_id_foreign";');

    this.addSql(
      'alter table "designer"."card_attachment" drop constraint "card_attachment_media_id_environment_id_foreign";'
    );
    this.addSql('alter table "designer"."card_attachment" drop constraint "card_attachment_assistant_id_foreign";');

    this.addSql('alter table "designer"."card_button" drop constraint "card_button_card_id_environment_id_foreign";');
    this.addSql('alter table "designer"."card_button" drop constraint "card_button_assistant_id_foreign";');

    this.addSql('alter table "designer"."trigger" drop constraint "trigger_story_id_environment_id_foreign";');
    this.addSql('alter table "designer"."trigger" drop constraint "trigger_assistant_id_foreign";');
    this.addSql('alter table "designer"."trigger" drop constraint "trigger_event_id_environment_id_foreign";');
    this.addSql('alter table "designer"."trigger" drop constraint "trigger_intent_id_environment_id_foreign";');

    this.addSql('alter table "designer"."condition" drop constraint "condition_assistant_id_foreign";');
    this.addSql('alter table "designer"."condition" drop constraint "condition_prompt_id_environment_id_foreign";');

    this.addSql(
      'alter table "designer"."condition_predicate" drop constraint "condition_predicate_condition_id_environment_id_foreign";'
    );
    this.addSql(
      'alter table "designer"."condition_predicate" drop constraint "condition_predicate_assistant_id_foreign";'
    );

    this.addSql(
      'alter table "designer"."condition_assertion" drop constraint "condition_assertion_condition_id_environment_id_foreign";'
    );
    this.addSql(
      'alter table "designer"."condition_assertion" drop constraint "condition_assertion_assistant_id_foreign";'
    );

    this.addSql(
      'alter table "designer"."response_variant" drop constraint "response_variant_condition_id_environment_id_foreign";'
    );
    this.addSql('alter table "designer"."response_variant" drop constraint "response_variant_assistant_id_foreign";');
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
      'alter table "designer"."response_attachment" drop constraint "response_attachment_assistant_id_foreign";'
    );
    this.addSql(
      'alter table "designer"."response_attachment" drop constraint "response_attachment_card_id_environment_id_foreign";'
    );
    this.addSql(
      'alter table "designer"."response_attachment" drop constraint "response_attachment_media_id_environment_id_foreign";'
    );

    this.addSql(
      'alter table "designer"."assistant" add constraint "assistant_workspace_id_foreign" foreign key ("workspace_id") references "identity"."workspace" ("id") on update cascade on delete cascade;'
    );
    this.addSql(
      'alter table "designer"."assistant" add constraint "assistant_active_persona_id_active_environment_id_foreign" foreign key ("active_persona_id", "active_environment_id") references "designer"."persona" ("id", "environment_id") on update cascade on delete set default;'
    );

    this.addSql(
      'alter table "designer"."media_attachment" add constraint "media_attachment_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade on delete cascade;'
    );

    this.addSql(
      'alter table "designer"."folder" add constraint "folder_parent_id_environment_id_foreign" foreign key ("parent_id", "environment_id") references "designer"."folder" ("id", "environment_id") on update cascade on delete cascade;'
    );
    this.addSql(
      'alter table "designer"."folder" add constraint "folder_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade on delete cascade;'
    );

    this.addSql(
      'alter table "designer"."variable" add constraint "variable_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade on delete cascade;'
    );
    this.addSql(
      'alter table "designer"."variable" add constraint "variable_folder_id_environment_id_foreign" foreign key ("folder_id", "environment_id") references "designer"."folder" ("id", "environment_id") on update cascade on delete cascade;'
    );

    this.addSql(
      'alter table "designer"."response" add constraint "response_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade on delete cascade;'
    );
    this.addSql(
      'alter table "designer"."response" add constraint "response_folder_id_environment_id_foreign" foreign key ("folder_id", "environment_id") references "designer"."folder" ("id", "environment_id") on update cascade on delete cascade;'
    );

    this.addSql(
      'alter table "designer"."response_discriminator" add constraint "response_discriminator_response_id_environment_id_foreign" foreign key ("response_id", "environment_id") references "designer"."response" ("id", "environment_id") on update cascade on delete cascade;'
    );
    this.addSql(
      'alter table "designer"."response_discriminator" add constraint "response_discriminator_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade on delete cascade;'
    );

    this.addSql(
      'alter table "designer"."persona" add constraint "persona_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade on delete cascade;'
    );
    this.addSql(
      'alter table "designer"."persona" add constraint "persona_folder_id_environment_id_foreign" foreign key ("folder_id", "environment_id") references "designer"."folder" ("id", "environment_id") on update cascade on delete cascade;'
    );

    this.addSql(
      'alter table "designer"."persona_override" add constraint "persona_override_persona_id_environment_id_foreign" foreign key ("persona_id", "environment_id") references "designer"."persona" ("id", "environment_id") on update cascade on delete cascade;'
    );
    this.addSql(
      'alter table "designer"."persona_override" add constraint "persona_override_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade on delete cascade;'
    );

    this.addSql(
      'alter table "designer"."prompt" add constraint "prompt_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade on delete cascade;'
    );
    this.addSql(
      'alter table "designer"."prompt" add constraint "prompt_folder_id_environment_id_foreign" foreign key ("folder_id", "environment_id") references "designer"."folder" ("id", "environment_id") on update cascade on delete cascade;'
    );
    this.addSql(
      'alter table "designer"."prompt" add constraint "prompt_persona_id_environment_id_foreign" foreign key ("persona_id", "environment_id") references "designer"."persona_override" ("id", "environment_id") on update cascade on delete set default;'
    );

    this.addSql(
      'alter table "designer"."intent" add constraint "intent_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade on delete cascade;'
    );
    this.addSql(
      'alter table "designer"."intent" add constraint "intent_folder_id_environment_id_foreign" foreign key ("folder_id", "environment_id") references "designer"."folder" ("id", "environment_id") on update cascade on delete cascade;'
    );

    this.addSql(
      'alter table "designer"."utterance" add constraint "utterance_intent_id_environment_id_foreign" foreign key ("intent_id", "environment_id") references "designer"."intent" ("id", "environment_id") on update cascade on delete cascade;'
    );
    this.addSql(
      'alter table "designer"."utterance" add constraint "utterance_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade on delete cascade;'
    );

    this.addSql(
      'alter table "designer"."function" add constraint "function_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade on delete cascade;'
    );
    this.addSql(
      'alter table "designer"."function" add constraint "function_folder_id_environment_id_foreign" foreign key ("folder_id", "environment_id") references "designer"."folder" ("id", "environment_id") on update cascade on delete cascade;'
    );

    this.addSql(
      'alter table "designer"."function_variable" add constraint "function_variable_function_id_environment_id_foreign" foreign key ("function_id", "environment_id") references "designer"."function" ("id", "environment_id") on update cascade on delete cascade;'
    );
    this.addSql(
      'alter table "designer"."function_variable" add constraint "function_variable_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade on delete cascade;'
    );

    this.addSql(
      'alter table "designer"."function_path" add constraint "function_path_function_id_environment_id_foreign" foreign key ("function_id", "environment_id") references "designer"."function" ("id", "environment_id") on update cascade on delete cascade;'
    );
    this.addSql(
      'alter table "designer"."function_path" add constraint "function_path_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade on delete cascade;'
    );

    this.addSql(
      'alter table "designer"."flow" add constraint "flow_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade on delete cascade;'
    );
    this.addSql(
      'alter table "designer"."flow" add constraint "flow_folder_id_environment_id_foreign" foreign key ("folder_id", "environment_id") references "designer"."folder" ("id", "environment_id") on update cascade on delete cascade;'
    );

    this.addSql('alter table "designer"."story" alter column "assignee_id" type int using ("assignee_id"::int);');
    this.addSql('alter table "designer"."story" alter column "assignee_id" drop not null;');
    this.addSql(
      'alter table "designer"."story" add constraint "story_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade on delete cascade;'
    );
    this.addSql(
      'alter table "designer"."story" add constraint "story_folder_id_environment_id_foreign" foreign key ("folder_id", "environment_id") references "designer"."folder" ("id", "environment_id") on update cascade on delete cascade;'
    );
    this.addSql(
      'alter table "designer"."story" add constraint "story_flow_id_environment_id_foreign" foreign key ("flow_id", "environment_id") references "designer"."flow" ("id", "environment_id") on update cascade on delete set default;'
    );
    this.addSql(
      'alter table "designer"."story" add constraint "story_assignee_id_foreign" foreign key ("assignee_id") references "identity"."user" ("id") on update cascade on delete set default;'
    );

    this.addSql(
      'alter table "designer"."event" add constraint "event_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade on delete cascade;'
    );
    this.addSql(
      'alter table "designer"."event" add constraint "event_folder_id_environment_id_foreign" foreign key ("folder_id", "environment_id") references "designer"."folder" ("id", "environment_id") on update cascade on delete cascade;'
    );

    this.addSql(
      'alter table "designer"."event_mapping" add constraint "event_mapping_event_id_environment_id_foreign" foreign key ("event_id", "environment_id") references "designer"."event" ("id", "environment_id") on update cascade on delete cascade;'
    );
    this.addSql(
      'alter table "designer"."event_mapping" add constraint "event_mapping_variable_id_environment_id_foreign" foreign key ("variable_id", "environment_id") references "designer"."variable" ("id", "environment_id") on update cascade on delete set default;'
    );
    this.addSql(
      'alter table "designer"."event_mapping" add constraint "event_mapping_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade on delete cascade;'
    );

    this.addSql(
      'alter table "designer"."entity" add constraint "entity_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade on delete cascade;'
    );
    this.addSql(
      'alter table "designer"."entity" add constraint "entity_folder_id_environment_id_foreign" foreign key ("folder_id", "environment_id") references "designer"."folder" ("id", "environment_id") on update cascade on delete cascade;'
    );

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
      'alter table "designer"."required_entity" add constraint "required_entity_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade on delete cascade;'
    );

    this.addSql(
      'alter table "designer"."entity_variant" add constraint "entity_variant_entity_id_environment_id_foreign" foreign key ("entity_id", "environment_id") references "designer"."entity" ("id", "environment_id") on update cascade on delete cascade;'
    );
    this.addSql(
      'alter table "designer"."entity_variant" add constraint "entity_variant_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade on delete cascade;'
    );

    this.addSql(
      'alter table "designer"."card_attachment" add constraint "card_attachment_media_id_environment_id_foreign" foreign key ("media_id", "environment_id") references "designer"."media_attachment" ("id", "environment_id") on update cascade on delete set default;'
    );
    this.addSql(
      'alter table "designer"."card_attachment" add constraint "card_attachment_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade on delete cascade;'
    );

    this.addSql(
      'alter table "designer"."card_button" add constraint "card_button_card_id_environment_id_foreign" foreign key ("card_id", "environment_id") references "designer"."card_attachment" ("id", "environment_id") on update cascade on delete cascade;'
    );
    this.addSql(
      'alter table "designer"."card_button" add constraint "card_button_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade on delete cascade;'
    );

    this.addSql(
      'alter table "designer"."trigger" add constraint "trigger_story_id_environment_id_foreign" foreign key ("story_id", "environment_id") references "designer"."story" ("id", "environment_id") on update cascade on delete cascade;'
    );
    this.addSql(
      'alter table "designer"."trigger" add constraint "trigger_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade on delete cascade;'
    );
    this.addSql(
      'alter table "designer"."trigger" add constraint "trigger_event_id_environment_id_foreign" foreign key ("event_id", "environment_id") references "designer"."event" ("id", "environment_id") on update cascade on delete cascade;'
    );
    this.addSql(
      'alter table "designer"."trigger" add constraint "trigger_intent_id_environment_id_foreign" foreign key ("intent_id", "environment_id") references "designer"."intent" ("id", "environment_id") on update cascade on delete cascade;'
    );

    this.addSql(
      'alter table "designer"."condition" add constraint "condition_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade on delete cascade;'
    );
    this.addSql(
      'alter table "designer"."condition" add constraint "condition_prompt_id_environment_id_foreign" foreign key ("prompt_id", "environment_id") references "designer"."prompt" ("id", "environment_id") on update cascade on delete set default;'
    );

    this.addSql(
      'alter table "designer"."condition_predicate" add constraint "condition_predicate_condition_id_environment_id_foreign" foreign key ("condition_id", "environment_id") references "designer"."condition" ("id", "environment_id") on update cascade on delete cascade;'
    );
    this.addSql(
      'alter table "designer"."condition_predicate" add constraint "condition_predicate_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade on delete cascade;'
    );

    this.addSql(
      'alter table "designer"."condition_assertion" add constraint "condition_assertion_condition_id_environment_id_foreign" foreign key ("condition_id", "environment_id") references "designer"."condition" ("id", "environment_id") on update cascade on delete cascade;'
    );
    this.addSql(
      'alter table "designer"."condition_assertion" add constraint "condition_assertion_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade on delete cascade;'
    );

    this.addSql(
      'alter table "designer"."response_variant" add constraint "response_variant_condition_id_environment_id_foreign" foreign key ("condition_id", "environment_id") references "designer"."condition" ("id", "environment_id") on update cascade on delete set default;'
    );
    this.addSql(
      'alter table "designer"."response_variant" add constraint "response_variant_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade on delete cascade;'
    );
    this.addSql(
      'alter table "designer"."response_variant" add constraint "response_variant_discriminator_id_environment_id_foreign" foreign key ("discriminator_id", "environment_id") references "designer"."response_discriminator" ("id", "environment_id") on update cascade on delete cascade;'
    );
    this.addSql(
      'alter table "designer"."response_variant" add constraint "response_variant_prompt_id_environment_id_foreign" foreign key ("prompt_id", "environment_id") references "designer"."prompt" ("id", "environment_id") on update cascade on delete set default;'
    );

    this.addSql(
      'alter table "designer"."response_attachment" add constraint "response_attachment_variant_id_environment_id_foreign" foreign key ("variant_id", "environment_id") references "designer"."response_variant" ("id", "environment_id") on update cascade on delete cascade;'
    );
    this.addSql(
      'alter table "designer"."response_attachment" add constraint "response_attachment_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade on delete cascade;'
    );
    this.addSql(
      'alter table "designer"."response_attachment" add constraint "response_attachment_card_id_environment_id_foreign" foreign key ("card_id", "environment_id") references "designer"."card_attachment" ("id", "environment_id") on update cascade on delete cascade;'
    );
    this.addSql(
      'alter table "designer"."response_attachment" add constraint "response_attachment_media_id_environment_id_foreign" foreign key ("media_id", "environment_id") references "designer"."media_attachment" ("id", "environment_id") on update cascade on delete cascade;'
    );
  }

  async down(): Promise<void> {
    this.addSql('alter table "designer"."assistant" drop constraint "assistant_workspace_id_foreign";');
    this.addSql(
      'alter table "designer"."assistant" drop constraint "assistant_active_persona_id_active_environment_id_foreign";'
    );

    this.addSql('alter table "designer"."media_attachment" drop constraint "media_attachment_assistant_id_foreign";');

    this.addSql('alter table "designer"."folder" drop constraint "folder_parent_id_environment_id_foreign";');
    this.addSql('alter table "designer"."folder" drop constraint "folder_assistant_id_foreign";');

    this.addSql('alter table "designer"."variable" drop constraint "variable_assistant_id_foreign";');
    this.addSql('alter table "designer"."variable" drop constraint "variable_folder_id_environment_id_foreign";');

    this.addSql('alter table "designer"."response" drop constraint "response_assistant_id_foreign";');
    this.addSql('alter table "designer"."response" drop constraint "response_folder_id_environment_id_foreign";');

    this.addSql(
      'alter table "designer"."response_discriminator" drop constraint "response_discriminator_response_id_environment_id_foreign";'
    );
    this.addSql(
      'alter table "designer"."response_discriminator" drop constraint "response_discriminator_assistant_id_foreign";'
    );

    this.addSql('alter table "designer"."persona" drop constraint "persona_assistant_id_foreign";');
    this.addSql('alter table "designer"."persona" drop constraint "persona_folder_id_environment_id_foreign";');

    this.addSql(
      'alter table "designer"."persona_override" drop constraint "persona_override_persona_id_environment_id_foreign";'
    );
    this.addSql('alter table "designer"."persona_override" drop constraint "persona_override_assistant_id_foreign";');

    this.addSql('alter table "designer"."prompt" drop constraint "prompt_assistant_id_foreign";');
    this.addSql('alter table "designer"."prompt" drop constraint "prompt_folder_id_environment_id_foreign";');
    this.addSql('alter table "designer"."prompt" drop constraint "prompt_persona_id_environment_id_foreign";');

    this.addSql('alter table "designer"."intent" drop constraint "intent_assistant_id_foreign";');
    this.addSql('alter table "designer"."intent" drop constraint "intent_folder_id_environment_id_foreign";');

    this.addSql('alter table "designer"."utterance" drop constraint "utterance_intent_id_environment_id_foreign";');
    this.addSql('alter table "designer"."utterance" drop constraint "utterance_assistant_id_foreign";');

    this.addSql('alter table "designer"."function" drop constraint "function_assistant_id_foreign";');
    this.addSql('alter table "designer"."function" drop constraint "function_folder_id_environment_id_foreign";');

    this.addSql(
      'alter table "designer"."function_variable" drop constraint "function_variable_function_id_environment_id_foreign";'
    );
    this.addSql('alter table "designer"."function_variable" drop constraint "function_variable_assistant_id_foreign";');

    this.addSql(
      'alter table "designer"."function_path" drop constraint "function_path_function_id_environment_id_foreign";'
    );
    this.addSql('alter table "designer"."function_path" drop constraint "function_path_assistant_id_foreign";');

    this.addSql('alter table "designer"."flow" drop constraint "flow_assistant_id_foreign";');
    this.addSql('alter table "designer"."flow" drop constraint "flow_folder_id_environment_id_foreign";');

    this.addSql('alter table "designer"."story" drop constraint "story_assistant_id_foreign";');
    this.addSql('alter table "designer"."story" drop constraint "story_folder_id_environment_id_foreign";');
    this.addSql('alter table "designer"."story" drop constraint "story_flow_id_environment_id_foreign";');
    this.addSql('alter table "designer"."story" drop constraint "story_assignee_id_foreign";');

    this.addSql('alter table "designer"."event" drop constraint "event_assistant_id_foreign";');
    this.addSql('alter table "designer"."event" drop constraint "event_folder_id_environment_id_foreign";');

    this.addSql(
      'alter table "designer"."event_mapping" drop constraint "event_mapping_event_id_environment_id_foreign";'
    );
    this.addSql(
      'alter table "designer"."event_mapping" drop constraint "event_mapping_variable_id_environment_id_foreign";'
    );
    this.addSql('alter table "designer"."event_mapping" drop constraint "event_mapping_assistant_id_foreign";');

    this.addSql('alter table "designer"."entity" drop constraint "entity_assistant_id_foreign";');
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
    this.addSql('alter table "designer"."required_entity" drop constraint "required_entity_assistant_id_foreign";');

    this.addSql(
      'alter table "designer"."entity_variant" drop constraint "entity_variant_entity_id_environment_id_foreign";'
    );
    this.addSql('alter table "designer"."entity_variant" drop constraint "entity_variant_assistant_id_foreign";');

    this.addSql(
      'alter table "designer"."card_attachment" drop constraint "card_attachment_media_id_environment_id_foreign";'
    );
    this.addSql('alter table "designer"."card_attachment" drop constraint "card_attachment_assistant_id_foreign";');

    this.addSql('alter table "designer"."card_button" drop constraint "card_button_card_id_environment_id_foreign";');
    this.addSql('alter table "designer"."card_button" drop constraint "card_button_assistant_id_foreign";');

    this.addSql('alter table "designer"."trigger" drop constraint "trigger_story_id_environment_id_foreign";');
    this.addSql('alter table "designer"."trigger" drop constraint "trigger_assistant_id_foreign";');
    this.addSql('alter table "designer"."trigger" drop constraint "trigger_event_id_environment_id_foreign";');
    this.addSql('alter table "designer"."trigger" drop constraint "trigger_intent_id_environment_id_foreign";');

    this.addSql('alter table "designer"."condition" drop constraint "condition_assistant_id_foreign";');
    this.addSql('alter table "designer"."condition" drop constraint "condition_prompt_id_environment_id_foreign";');

    this.addSql(
      'alter table "designer"."condition_predicate" drop constraint "condition_predicate_condition_id_environment_id_foreign";'
    );
    this.addSql(
      'alter table "designer"."condition_predicate" drop constraint "condition_predicate_assistant_id_foreign";'
    );

    this.addSql(
      'alter table "designer"."condition_assertion" drop constraint "condition_assertion_condition_id_environment_id_foreign";'
    );
    this.addSql(
      'alter table "designer"."condition_assertion" drop constraint "condition_assertion_assistant_id_foreign";'
    );

    this.addSql(
      'alter table "designer"."response_variant" drop constraint "response_variant_condition_id_environment_id_foreign";'
    );
    this.addSql('alter table "designer"."response_variant" drop constraint "response_variant_assistant_id_foreign";');
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
      'alter table "designer"."response_attachment" drop constraint "response_attachment_assistant_id_foreign";'
    );
    this.addSql(
      'alter table "designer"."response_attachment" drop constraint "response_attachment_card_id_environment_id_foreign";'
    );
    this.addSql(
      'alter table "designer"."response_attachment" drop constraint "response_attachment_media_id_environment_id_foreign";'
    );

    this.addSql(
      'alter table "designer"."assistant" add constraint "assistant_workspace_id_foreign" foreign key ("workspace_id") references "identity"."workspace" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."assistant" add constraint "assistant_active_persona_id_active_environment_id_foreign" foreign key ("active_persona_id", "active_environment_id") references "designer"."persona" ("id", "environment_id") on update cascade on delete set null;'
    );

    this.addSql(
      'alter table "designer"."media_attachment" add constraint "media_attachment_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade;'
    );

    this.addSql(
      'alter table "designer"."folder" add constraint "folder_parent_id_environment_id_foreign" foreign key ("parent_id", "environment_id") references "designer"."folder" ("id", "environment_id") on update cascade on delete set null;'
    );
    this.addSql(
      'alter table "designer"."folder" add constraint "folder_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade;'
    );

    this.addSql(
      'alter table "designer"."variable" add constraint "variable_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."variable" add constraint "variable_folder_id_environment_id_foreign" foreign key ("folder_id", "environment_id") references "designer"."folder" ("id", "environment_id") on update cascade on delete set null;'
    );

    this.addSql(
      'alter table "designer"."response" add constraint "response_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."response" add constraint "response_folder_id_environment_id_foreign" foreign key ("folder_id", "environment_id") references "designer"."folder" ("id", "environment_id") on update cascade on delete set null;'
    );

    this.addSql(
      'alter table "designer"."response_discriminator" add constraint "response_discriminator_response_id_environment_id_foreign" foreign key ("response_id", "environment_id") references "designer"."response" ("id", "environment_id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."response_discriminator" add constraint "response_discriminator_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade;'
    );

    this.addSql(
      'alter table "designer"."persona" add constraint "persona_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."persona" add constraint "persona_folder_id_environment_id_foreign" foreign key ("folder_id", "environment_id") references "designer"."folder" ("id", "environment_id") on update cascade on delete set null;'
    );

    this.addSql(
      'alter table "designer"."persona_override" add constraint "persona_override_persona_id_environment_id_foreign" foreign key ("persona_id", "environment_id") references "designer"."persona" ("id", "environment_id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."persona_override" add constraint "persona_override_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade;'
    );

    this.addSql(
      'alter table "designer"."prompt" add constraint "prompt_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."prompt" add constraint "prompt_folder_id_environment_id_foreign" foreign key ("folder_id", "environment_id") references "designer"."folder" ("id", "environment_id") on update cascade on delete set null;'
    );
    this.addSql(
      'alter table "designer"."prompt" add constraint "prompt_persona_id_environment_id_foreign" foreign key ("persona_id", "environment_id") references "designer"."persona_override" ("id", "environment_id") on update cascade on delete set null;'
    );

    this.addSql(
      'alter table "designer"."intent" add constraint "intent_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."intent" add constraint "intent_folder_id_environment_id_foreign" foreign key ("folder_id", "environment_id") references "designer"."folder" ("id", "environment_id") on update cascade on delete set null;'
    );

    this.addSql(
      'alter table "designer"."utterance" add constraint "utterance_intent_id_environment_id_foreign" foreign key ("intent_id", "environment_id") references "designer"."intent" ("id", "environment_id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."utterance" add constraint "utterance_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade;'
    );

    this.addSql(
      'alter table "designer"."function" add constraint "function_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."function" add constraint "function_folder_id_environment_id_foreign" foreign key ("folder_id", "environment_id") references "designer"."folder" ("id", "environment_id") on update cascade on delete set null;'
    );

    this.addSql(
      'alter table "designer"."function_variable" add constraint "function_variable_function_id_environment_id_foreign" foreign key ("function_id", "environment_id") references "designer"."function" ("id", "environment_id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."function_variable" add constraint "function_variable_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade;'
    );

    this.addSql(
      'alter table "designer"."function_path" add constraint "function_path_function_id_environment_id_foreign" foreign key ("function_id", "environment_id") references "designer"."function" ("id", "environment_id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."function_path" add constraint "function_path_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade;'
    );

    this.addSql(
      'alter table "designer"."flow" add constraint "flow_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."flow" add constraint "flow_folder_id_environment_id_foreign" foreign key ("folder_id", "environment_id") references "designer"."folder" ("id", "environment_id") on update cascade on delete set null;'
    );

    this.addSql('alter table "designer"."story" alter column "assignee_id" type int using ("assignee_id"::int);');
    this.addSql('alter table "designer"."story" alter column "assignee_id" set not null;');
    this.addSql(
      'alter table "designer"."story" add constraint "story_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."story" add constraint "story_folder_id_environment_id_foreign" foreign key ("folder_id", "environment_id") references "designer"."folder" ("id", "environment_id") on update cascade on delete set null;'
    );
    this.addSql(
      'alter table "designer"."story" add constraint "story_flow_id_environment_id_foreign" foreign key ("flow_id", "environment_id") references "designer"."flow" ("id", "environment_id") on update cascade on delete set null;'
    );
    this.addSql(
      'alter table "designer"."story" add constraint "story_assignee_id_foreign" foreign key ("assignee_id") references "identity"."user" ("id") on update cascade;'
    );

    this.addSql(
      'alter table "designer"."event" add constraint "event_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."event" add constraint "event_folder_id_environment_id_foreign" foreign key ("folder_id", "environment_id") references "designer"."folder" ("id", "environment_id") on update cascade on delete set null;'
    );

    this.addSql(
      'alter table "designer"."event_mapping" add constraint "event_mapping_event_id_environment_id_foreign" foreign key ("event_id", "environment_id") references "designer"."event" ("id", "environment_id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."event_mapping" add constraint "event_mapping_variable_id_environment_id_foreign" foreign key ("variable_id", "environment_id") references "designer"."variable" ("id", "environment_id") on update cascade on delete set null;'
    );
    this.addSql(
      'alter table "designer"."event_mapping" add constraint "event_mapping_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade;'
    );

    this.addSql(
      'alter table "designer"."entity" add constraint "entity_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."entity" add constraint "entity_folder_id_environment_id_foreign" foreign key ("folder_id", "environment_id") references "designer"."folder" ("id", "environment_id") on update cascade on delete set null;'
    );

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
      'alter table "designer"."required_entity" add constraint "required_entity_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade;'
    );

    this.addSql(
      'alter table "designer"."entity_variant" add constraint "entity_variant_entity_id_environment_id_foreign" foreign key ("entity_id", "environment_id") references "designer"."entity" ("id", "environment_id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."entity_variant" add constraint "entity_variant_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade;'
    );

    this.addSql(
      'alter table "designer"."card_attachment" add constraint "card_attachment_media_id_environment_id_foreign" foreign key ("media_id", "environment_id") references "designer"."media_attachment" ("id", "environment_id") on update cascade on delete set null;'
    );
    this.addSql(
      'alter table "designer"."card_attachment" add constraint "card_attachment_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade;'
    );

    this.addSql(
      'alter table "designer"."card_button" add constraint "card_button_card_id_environment_id_foreign" foreign key ("card_id", "environment_id") references "designer"."card_attachment" ("id", "environment_id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."card_button" add constraint "card_button_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade;'
    );

    this.addSql(
      'alter table "designer"."trigger" add constraint "trigger_story_id_environment_id_foreign" foreign key ("story_id", "environment_id") references "designer"."story" ("id", "environment_id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."trigger" add constraint "trigger_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."trigger" add constraint "trigger_event_id_environment_id_foreign" foreign key ("event_id", "environment_id") references "designer"."event" ("id", "environment_id") on update cascade on delete set null;'
    );
    this.addSql(
      'alter table "designer"."trigger" add constraint "trigger_intent_id_environment_id_foreign" foreign key ("intent_id", "environment_id") references "designer"."intent" ("id", "environment_id") on update cascade on delete set null;'
    );

    this.addSql(
      'alter table "designer"."condition" add constraint "condition_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."condition" add constraint "condition_prompt_id_environment_id_foreign" foreign key ("prompt_id", "environment_id") references "designer"."prompt" ("id", "environment_id") on update cascade on delete set null;'
    );

    this.addSql(
      'alter table "designer"."condition_predicate" add constraint "condition_predicate_condition_id_environment_id_foreign" foreign key ("condition_id", "environment_id") references "designer"."condition" ("id", "environment_id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."condition_predicate" add constraint "condition_predicate_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade;'
    );

    this.addSql(
      'alter table "designer"."condition_assertion" add constraint "condition_assertion_condition_id_environment_id_foreign" foreign key ("condition_id", "environment_id") references "designer"."condition" ("id", "environment_id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."condition_assertion" add constraint "condition_assertion_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade;'
    );

    this.addSql(
      'alter table "designer"."response_variant" add constraint "response_variant_condition_id_environment_id_foreign" foreign key ("condition_id", "environment_id") references "designer"."condition" ("id", "environment_id") on update cascade on delete set null;'
    );
    this.addSql(
      'alter table "designer"."response_variant" add constraint "response_variant_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."response_variant" add constraint "response_variant_discriminator_id_environment_id_foreign" foreign key ("discriminator_id", "environment_id") references "designer"."response_discriminator" ("id", "environment_id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."response_variant" add constraint "response_variant_prompt_id_environment_id_foreign" foreign key ("prompt_id", "environment_id") references "designer"."prompt" ("id", "environment_id") on update cascade on delete set null;'
    );

    this.addSql(
      'alter table "designer"."response_attachment" add constraint "response_attachment_variant_id_environment_id_foreign" foreign key ("variant_id", "environment_id") references "designer"."response_variant" ("id", "environment_id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."response_attachment" add constraint "response_attachment_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."response_attachment" add constraint "response_attachment_card_id_environment_id_foreign" foreign key ("card_id", "environment_id") references "designer"."card_attachment" ("id", "environment_id") on update cascade on delete set null;'
    );
    this.addSql(
      'alter table "designer"."response_attachment" add constraint "response_attachment_media_id_environment_id_foreign" foreign key ("media_id", "environment_id") references "designer"."media_attachment" ("id", "environment_id") on update cascade on delete set null;'
    );
  }
}
