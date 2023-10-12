import { Migration } from '@mikro-orm/migrations';

export class Migration20230529213244 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "designer"."media_attachment" ("id" varchar(255) not null, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "deleted_at" timestamptz(0) null, "name" varchar(255) not null, "datatype" text check ("datatype" in (\'image\', \'video\')) not null, "is_asset" boolean not null, "url" jsonb not null, "assistant_id" varchar(255) not null, constraint "media_attachment_pkey" primary key ("id"));'
    );

    this.addSql(
      'create table "designer"."response" ("id" varchar(255) not null, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "deleted_at" timestamptz(0) null, "name" varchar(255) not null, "assistant_id" varchar(255) not null, "created_by_id" int not null, "updated_by_id" int not null, "folder_id" varchar(255) null, constraint "response_pkey" primary key ("id"));'
    );

    this.addSql(
      'create table "designer"."response_variant" ("id" varchar(255) not null, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "deleted_at" timestamptz(0) null, "language" text check ("language" in (\'en-us\')) not null, "channel" text check ("channel" in (\'default\')) not null, "payload_order" text[] not null, "response_id" varchar(255) not null, "assistant_id" varchar(255) not null, constraint "response_variant_pkey" primary key ("id"));'
    );

    this.addSql(
      'create table "designer"."persona" ("id" varchar(255) not null, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "deleted_at" timestamptz(0) null, "is_override" boolean not null, "name" varchar(255) null, "model" text check ("model" in (\'gpt_3\', \'gpt_3.5\', \'gpt_4\')) null, "temperature" int null, "max_length" int null, "prompt" varchar(255) null, "assistant_id" varchar(255) not null, "created_by_id" int not null, "updated_by_id" int not null, "folder_id" varchar(255) null, constraint "persona_pkey" primary key ("id"));'
    );

    this.addSql(
      'create table "designer"."prompt" ("id" varchar(255) not null, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "deleted_at" timestamptz(0) null, "name" varchar(255) not null, "text" jsonb not null, "persona_id" varchar(255) null, "assistant_id" varchar(255) not null, "created_by_id" int not null, "updated_by_id" int not null, "folder_id" varchar(255) null, constraint "prompt_pkey" primary key ("id"));'
    );

    this.addSql(
      'create table "designer"."intent" ("id" varchar(255) not null, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "deleted_at" timestamptz(0) null, "name" varchar(255) not null, "automatic_reprompt" boolean not null, "entity_order" text[] not null, "assistant_id" varchar(255) not null, "created_by_id" int not null, "updated_by_id" int not null, "folder_id" varchar(255) null, constraint "intent_pkey" primary key ("id"));'
    );

    this.addSql(
      'create table "designer"."utterance" ("id" varchar(255) not null, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "deleted_at" timestamptz(0) null, "language" text check ("language" in (\'en-us\')) not null, "text" jsonb not null, "intent_id" varchar(255) not null, "assistant_id" varchar(255) not null, constraint "utterance_pkey" primary key ("id"));'
    );

    this.addSql(
      'create table "designer"."event" ("id" varchar(255) not null, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "deleted_at" timestamptz(0) null, "name" varchar(255) not null, "request_name" varchar(255) not null, "assistant_id" varchar(255) not null, "created_by_id" int not null, "updated_by_id" int not null, "folder_id" varchar(255) null, constraint "event_pkey" primary key ("id"));'
    );

    this.addSql(
      'create table "designer"."entity" ("id" varchar(255) not null, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "deleted_at" timestamptz(0) null, "name" varchar(255) not null, "color" varchar(255) not null, "classifier" varchar(255) null, "is_array" boolean not null, "assistant_id" varchar(255) not null, "created_by_id" int not null, "updated_by_id" int not null, "folder_id" varchar(255) null, constraint "entity_pkey" primary key ("id"));'
    );

    this.addSql(
      'create table "designer"."required_entity" ("id" varchar(255) not null, "created_at" timestamptz(0) not null default now(), "deleted_at" timestamptz(0) null, "reprompt_id" varchar(255) null, "entity_id" varchar(255) not null, "intent_id" varchar(255) not null, "assistant_id" varchar(255) not null, constraint "required_entity_pkey" primary key ("id"));'
    );

    this.addSql(
      'create table "designer"."entity_variant" ("id" varchar(255) not null, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "deleted_at" timestamptz(0) null, "language" text check ("language" in (\'en-us\')) not null, "value" varchar(255) not null, "synonyms" text[] not null, "entity_id" varchar(255) not null, "assistant_id" varchar(255) not null, constraint "entity_variant_pkey" primary key ("id"));'
    );

    this.addSql(
      'create table "designer"."card_attachment" ("id" varchar(255) not null, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "deleted_at" timestamptz(0) null, "title" jsonb not null, "description" jsonb not null, "button_order" text[] not null, "media_id" varchar(255) null, "assistant_id" varchar(255) not null, constraint "card_attachment_pkey" primary key ("id"));'
    );

    this.addSql(
      'create table "designer"."card_button" ("id" varchar(255) not null, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "deleted_at" timestamptz(0) null, "label" jsonb not null, "card_id" varchar(255) not null, "assistant_id" varchar(255) not null, constraint "card_button_pkey" primary key ("id"));'
    );

    this.addSql(
      'create table "designer"."response_payload_to_attachment" ("id" varchar(255) not null, "created_at" timestamptz(0) not null default now(), "deleted_at" timestamptz(0) null, "type" text check ("type" in (\'card\', \'media\')) not null, "assistant_id" varchar(255) not null, "card_id" varchar(255) null, "media_id" varchar(255) null, constraint "response_payload_to_attachment_pkey" primary key ("id"));'
    );
    this.addSql(
      'create index "response_payload_to_attachment_type_index" on "designer"."response_payload_to_attachment" ("type");'
    );

    this.addSql(
      'create table "designer"."flow" ("id" varchar(255) not null, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "deleted_at" timestamptz(0) null, "name" varchar(255) not null, "type" text check ("type" in (\'story\', \'component\')) not null, "diagram_id" varchar(255) not null, "assistant_id" varchar(255) not null, "created_by_id" int null, "updated_by_id" int null, "folder_id" varchar(255) null, constraint "flow_pkey" primary key ("id"));'
    );
    this.addSql('create index "flow_type_index" on "designer"."flow" ("type");');

    this.addSql(
      'create table "designer"."story" ("id" varchar(255) not null, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "deleted_at" timestamptz(0) null, "name" varchar(255) not null, "status" text check ("status" in (\'to_do\', \'in_progress\', \'complete\')) null, "is_enabled" boolean not null, "is_start" boolean not null, "trigger_order" text[] not null, "assignee_id" int not null, "flow_id" varchar(255) null, "assistant_id" varchar(255) not null, "created_by_id" int not null, "updated_by_id" int not null, "folder_id" varchar(255) null, constraint "story_pkey" primary key ("id"));'
    );

    this.addSql(
      'create table "designer"."trigger" ("id" varchar(255) not null, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "deleted_at" timestamptz(0) null, "name" varchar(255) not null, "target" text check ("target" in (\'event\', \'intent\')) not null, "story_id" varchar(255) not null, "assistant_id" varchar(255) not null, "event_id" varchar(255) null, "intent_id" varchar(255) null, constraint "trigger_pkey" primary key ("id"));'
    );
    this.addSql('create index "trigger_target_index" on "designer"."trigger" ("target");');

    this.addSql(
      'create table "designer"."variable" ("id" varchar(255) not null, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "deleted_at" timestamptz(0) null, "name" varchar(255) not null, "scope" text check ("scope" in (\'global\', \'local\')) not null, "datatype" text check ("datatype" in (\'text\', \'number\', \'date\', \'boolean\', \'image\')) not null, "is_array" boolean not null, "default_value" varchar(255) null, "color" varchar(255) not null, "assistant_id" varchar(255) not null, "created_by_id" int null, "updated_by_id" int null, "folder_id" varchar(255) null, "flow_id" varchar(255) null, constraint "variable_pkey" primary key ("id"));'
    );
    this.addSql('create index "variable_scope_index" on "designer"."variable" ("scope");');

    this.addSql(
      'create table "out_flow_mapping" ("id" varchar(255) not null, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "deleted_at" timestamptz(0) null, "direction" text check ("direction" in (\'in\', \'out\')) not null, "flow_id" varchar(255) not null, "assistant_id" varchar(255) not null, "out_from_id" varchar(255) null, "out_to_id" varchar(255) null, constraint "out_flow_mapping_pkey" primary key ("id"));'
    );

    this.addSql(
      'create table "in_flow_mapping" ("id" varchar(255) not null, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "deleted_at" timestamptz(0) null, "direction" text check ("direction" in (\'in\', \'out\')) not null, "flow_id" varchar(255) not null, "assistant_id" varchar(255) not null, "in_from" jsonb not null, "in_to_id" varchar(255) null, constraint "in_flow_mapping_pkey" primary key ("id"));'
    );

    this.addSql(
      'create table "designer"."event_mapping" ("id" varchar(255) not null, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "deleted_at" timestamptz(0) null, "path" jsonb not null, "variable_id" varchar(255) null, "event_id" varchar(255) not null, "assistant_id" varchar(255) not null, constraint "event_mapping_pkey" primary key ("id"));'
    );

    this.addSql(
      'create table "designer"."flow_mapping" ("id" varchar(255) not null, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "deleted_at" timestamptz(0) null, "direction" text check ("direction" in (\'in\', \'out\')) not null, "flow_id" varchar(255) not null, "assistant_id" varchar(255) not null, constraint "flow_mapping_pkey" primary key ("id"));'
    );

    this.addSql(
      'create table "designer"."condition" ("id" varchar(255) not null, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "deleted_at" timestamptz(0) null, "type" text check ("type" in (\'expression\', \'prompt\', \'script\')) not null, "assistant_id" varchar(255) not null, "match_all" boolean null, "turns" int null, "prompt_id" varchar(255) null, "code" jsonb null, constraint "condition_pkey" primary key ("id"));'
    );
    this.addSql('create index "condition_type_index" on "designer"."condition" ("type");');

    this.addSql(
      'create table "designer"."condition_predicate" ("id" varchar(255) not null, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "deleted_at" timestamptz(0) null, "operation" text check ("operation" in (\'is\', \'is_not\', \'is_empty\', \'is_not_empty\', \'greater_than\', \'greater_or_equal\', \'less_than\', \'less_or_equal\', \'contains\', \'not_contains\', \'starts_with\', \'ends_with\')) not null, "rhs" jsonb not null, "condition_id" varchar(255) not null, "assistant_id" varchar(255) not null, constraint "condition_predicate_pkey" primary key ("id"));'
    );

    this.addSql(
      'create table "designer"."condition_assertion" ("id" varchar(255) not null, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "deleted_at" timestamptz(0) null, "operation" text check ("operation" in (\'is\', \'is_not\', \'is_empty\', \'is_not_empty\', \'greater_than\', \'greater_or_equal\', \'less_than\', \'less_or_equal\', \'contains\', \'not_contains\', \'starts_with\', \'ends_with\')) not null, "lhs" jsonb not null, "rhs" jsonb not null, "condition_id" varchar(255) not null, "assistant_id" varchar(255) not null, constraint "condition_assertion_pkey" primary key ("id"));'
    );

    this.addSql(
      'create table "designer"."response_payload" ("id" varchar(255) not null, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "deleted_at" timestamptz(0) null, "type" text check ("type" in (\'json\', \'prompt\', \'text\')) not null, "card_layout" text check ("card_layout" in (\'carousel\', \'list\')) not null, "speed" int not null, "attachment_order" text[] not null, "condition_id" varchar(255) null, "variant_id" varchar(255) not null, "assistant_id" varchar(255) not null, "json" jsonb null, "turns" int null, "memory_only" boolean null, "prompt_id" varchar(255) null, "text" jsonb null, constraint "response_payload_pkey" primary key ("id"));'
    );
    this.addSql('create index "response_payload_type_index" on "designer"."response_payload" ("type");');

    this.addSql(
      'create table "response_payload_attachments" ("base_response_payload_id" varchar(255) not null, "base_response_payload_to_attachment_id" varchar(255) not null, constraint "response_payload_attachments_pkey" primary key ("base_response_payload_id", "base_response_payload_to_attachment_id"));'
    );

    this.addSql(
      'alter table "designer"."media_attachment" add constraint "media_attachment_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade;'
    );

    this.addSql(
      'alter table "designer"."response" add constraint "response_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."response" add constraint "response_created_by_id_foreign" foreign key ("created_by_id") references "identity"."user" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."response" add constraint "response_updated_by_id_foreign" foreign key ("updated_by_id") references "identity"."user" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."response" add constraint "response_folder_id_foreign" foreign key ("folder_id") references "designer"."folder" ("id") on update cascade on delete set null;'
    );

    this.addSql(
      'alter table "designer"."response_variant" add constraint "response_variant_response_id_foreign" foreign key ("response_id") references "designer"."response" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."response_variant" add constraint "response_variant_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade;'
    );

    this.addSql(
      'alter table "designer"."persona" add constraint "persona_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."persona" add constraint "persona_created_by_id_foreign" foreign key ("created_by_id") references "identity"."user" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."persona" add constraint "persona_updated_by_id_foreign" foreign key ("updated_by_id") references "identity"."user" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."persona" add constraint "persona_folder_id_foreign" foreign key ("folder_id") references "designer"."folder" ("id") on update cascade on delete set null;'
    );

    this.addSql(
      'alter table "designer"."prompt" add constraint "prompt_persona_id_foreign" foreign key ("persona_id") references "designer"."persona" ("id") on update cascade on delete set null;'
    );
    this.addSql(
      'alter table "designer"."prompt" add constraint "prompt_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."prompt" add constraint "prompt_created_by_id_foreign" foreign key ("created_by_id") references "identity"."user" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."prompt" add constraint "prompt_updated_by_id_foreign" foreign key ("updated_by_id") references "identity"."user" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."prompt" add constraint "prompt_folder_id_foreign" foreign key ("folder_id") references "designer"."folder" ("id") on update cascade on delete set null;'
    );

    this.addSql(
      'alter table "designer"."intent" add constraint "intent_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."intent" add constraint "intent_created_by_id_foreign" foreign key ("created_by_id") references "identity"."user" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."intent" add constraint "intent_updated_by_id_foreign" foreign key ("updated_by_id") references "identity"."user" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."intent" add constraint "intent_folder_id_foreign" foreign key ("folder_id") references "designer"."folder" ("id") on update cascade on delete set null;'
    );

    this.addSql(
      'alter table "designer"."utterance" add constraint "utterance_intent_id_foreign" foreign key ("intent_id") references "designer"."intent" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."utterance" add constraint "utterance_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade;'
    );

    this.addSql(
      'alter table "designer"."event" add constraint "event_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."event" add constraint "event_created_by_id_foreign" foreign key ("created_by_id") references "identity"."user" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."event" add constraint "event_updated_by_id_foreign" foreign key ("updated_by_id") references "identity"."user" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."event" add constraint "event_folder_id_foreign" foreign key ("folder_id") references "designer"."folder" ("id") on update cascade on delete set null;'
    );

    this.addSql(
      'alter table "designer"."entity" add constraint "entity_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."entity" add constraint "entity_created_by_id_foreign" foreign key ("created_by_id") references "identity"."user" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."entity" add constraint "entity_updated_by_id_foreign" foreign key ("updated_by_id") references "identity"."user" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."entity" add constraint "entity_folder_id_foreign" foreign key ("folder_id") references "designer"."folder" ("id") on update cascade on delete set null;'
    );

    this.addSql(
      'alter table "designer"."required_entity" add constraint "required_entity_reprompt_id_foreign" foreign key ("reprompt_id") references "designer"."response" ("id") on update cascade on delete set null;'
    );
    this.addSql(
      'alter table "designer"."required_entity" add constraint "required_entity_entity_id_foreign" foreign key ("entity_id") references "designer"."entity" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."required_entity" add constraint "required_entity_intent_id_foreign" foreign key ("intent_id") references "designer"."intent" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."required_entity" add constraint "required_entity_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade;'
    );

    this.addSql(
      'alter table "designer"."entity_variant" add constraint "entity_variant_entity_id_foreign" foreign key ("entity_id") references "designer"."entity" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."entity_variant" add constraint "entity_variant_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade;'
    );

    this.addSql(
      'alter table "designer"."card_attachment" add constraint "card_attachment_media_id_foreign" foreign key ("media_id") references "designer"."media_attachment" ("id") on update cascade on delete set null;'
    );
    this.addSql(
      'alter table "designer"."card_attachment" add constraint "card_attachment_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade;'
    );

    this.addSql(
      'alter table "designer"."card_button" add constraint "card_button_card_id_foreign" foreign key ("card_id") references "designer"."card_attachment" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."card_button" add constraint "card_button_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade;'
    );

    this.addSql(
      'alter table "designer"."response_payload_to_attachment" add constraint "response_payload_to_attachment_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."response_payload_to_attachment" add constraint "response_payload_to_attachment_card_id_foreign" foreign key ("card_id") references "designer"."card_attachment" ("id") on update cascade on delete set null;'
    );
    this.addSql(
      'alter table "designer"."response_payload_to_attachment" add constraint "response_payload_to_attachment_media_id_foreign" foreign key ("media_id") references "designer"."media_attachment" ("id") on update cascade on delete set null;'
    );

    this.addSql(
      'alter table "designer"."flow" add constraint "flow_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."flow" add constraint "flow_created_by_id_foreign" foreign key ("created_by_id") references "identity"."user" ("id") on update cascade on delete set null;'
    );
    this.addSql(
      'alter table "designer"."flow" add constraint "flow_updated_by_id_foreign" foreign key ("updated_by_id") references "identity"."user" ("id") on update cascade on delete set null;'
    );
    this.addSql(
      'alter table "designer"."flow" add constraint "flow_folder_id_foreign" foreign key ("folder_id") references "designer"."folder" ("id") on update cascade on delete set null;'
    );

    this.addSql(
      'alter table "designer"."story" add constraint "story_assignee_id_foreign" foreign key ("assignee_id") references "identity"."user" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."story" add constraint "story_flow_id_foreign" foreign key ("flow_id") references "designer"."flow" ("id") on update cascade on delete set null;'
    );
    this.addSql(
      'alter table "designer"."story" add constraint "story_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."story" add constraint "story_created_by_id_foreign" foreign key ("created_by_id") references "identity"."user" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."story" add constraint "story_updated_by_id_foreign" foreign key ("updated_by_id") references "identity"."user" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."story" add constraint "story_folder_id_foreign" foreign key ("folder_id") references "designer"."folder" ("id") on update cascade on delete set null;'
    );

    this.addSql(
      'alter table "designer"."trigger" add constraint "trigger_story_id_foreign" foreign key ("story_id") references "designer"."story" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."trigger" add constraint "trigger_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."trigger" add constraint "trigger_event_id_foreign" foreign key ("event_id") references "designer"."event" ("id") on update cascade on delete set null;'
    );
    this.addSql(
      'alter table "designer"."trigger" add constraint "trigger_intent_id_foreign" foreign key ("intent_id") references "designer"."intent" ("id") on update cascade on delete set null;'
    );

    this.addSql(
      'alter table "designer"."variable" add constraint "variable_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."variable" add constraint "variable_created_by_id_foreign" foreign key ("created_by_id") references "identity"."user" ("id") on update cascade on delete set null;'
    );
    this.addSql(
      'alter table "designer"."variable" add constraint "variable_updated_by_id_foreign" foreign key ("updated_by_id") references "identity"."user" ("id") on update cascade on delete set null;'
    );
    this.addSql(
      'alter table "designer"."variable" add constraint "variable_folder_id_foreign" foreign key ("folder_id") references "designer"."folder" ("id") on update cascade on delete set null;'
    );
    this.addSql(
      'alter table "designer"."variable" add constraint "variable_flow_id_foreign" foreign key ("flow_id") references "designer"."flow" ("id") on update cascade on delete set null;'
    );

    this.addSql(
      'alter table "out_flow_mapping" add constraint "out_flow_mapping_flow_id_foreign" foreign key ("flow_id") references "designer"."flow" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "out_flow_mapping" add constraint "out_flow_mapping_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "out_flow_mapping" add constraint "out_flow_mapping_out_from_id_foreign" foreign key ("out_from_id") references "designer"."variable" ("id") on update cascade on delete set null;'
    );
    this.addSql(
      'alter table "out_flow_mapping" add constraint "out_flow_mapping_out_to_id_foreign" foreign key ("out_to_id") references "designer"."variable" ("id") on update cascade on delete set null;'
    );

    this.addSql(
      'alter table "in_flow_mapping" add constraint "in_flow_mapping_flow_id_foreign" foreign key ("flow_id") references "designer"."flow" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "in_flow_mapping" add constraint "in_flow_mapping_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "in_flow_mapping" add constraint "in_flow_mapping_in_to_id_foreign" foreign key ("in_to_id") references "designer"."variable" ("id") on update cascade on delete set null;'
    );

    this.addSql(
      'alter table "designer"."event_mapping" add constraint "event_mapping_variable_id_foreign" foreign key ("variable_id") references "designer"."variable" ("id") on update cascade on delete set null;'
    );
    this.addSql(
      'alter table "designer"."event_mapping" add constraint "event_mapping_event_id_foreign" foreign key ("event_id") references "designer"."event" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."event_mapping" add constraint "event_mapping_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade;'
    );

    this.addSql(
      'alter table "designer"."flow_mapping" add constraint "flow_mapping_flow_id_foreign" foreign key ("flow_id") references "designer"."flow" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."flow_mapping" add constraint "flow_mapping_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade;'
    );

    this.addSql(
      'alter table "designer"."condition" add constraint "condition_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."condition" add constraint "condition_prompt_id_foreign" foreign key ("prompt_id") references "designer"."prompt" ("id") on update cascade on delete set null;'
    );

    this.addSql(
      'alter table "designer"."condition_predicate" add constraint "condition_predicate_condition_id_foreign" foreign key ("condition_id") references "designer"."condition" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."condition_predicate" add constraint "condition_predicate_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade;'
    );

    this.addSql(
      'alter table "designer"."condition_assertion" add constraint "condition_assertion_condition_id_foreign" foreign key ("condition_id") references "designer"."condition" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."condition_assertion" add constraint "condition_assertion_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade;'
    );

    this.addSql(
      'alter table "designer"."response_payload" add constraint "response_payload_condition_id_foreign" foreign key ("condition_id") references "designer"."condition" ("id") on update cascade on delete set null;'
    );
    this.addSql(
      'alter table "designer"."response_payload" add constraint "response_payload_variant_id_foreign" foreign key ("variant_id") references "designer"."response_variant" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."response_payload" add constraint "response_payload_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."response_payload" add constraint "response_payload_prompt_id_foreign" foreign key ("prompt_id") references "designer"."prompt" ("id") on update cascade on delete set null;'
    );

    this.addSql(
      'alter table "response_payload_attachments" add constraint "response_payload_attachments_base_response_payload_id_foreign" foreign key ("base_response_payload_id") references "designer"."response_payload" ("id") on update cascade on delete cascade;'
    );
    this.addSql(
      'alter table "response_payload_attachments" add constraint "response_payload_attachments_base_response_payloa_931d6_foreign" foreign key ("base_response_payload_to_attachment_id") references "designer"."response_payload_to_attachment" ("id") on update cascade on delete cascade;'
    );

    this.addSql('alter table "designer"."folder" drop constraint if exists "folder_scope_check";');

    this.addSql('alter table "designer"."assistant" add column "active_persona_id" varchar(255) null;');
    this.addSql(
      'alter table "designer"."assistant" add constraint "assistant_active_persona_id_foreign" foreign key ("active_persona_id") references "designer"."persona" ("id") on update cascade on delete set null;'
    );
    this.addSql(
      'alter table "designer"."assistant" add constraint "assistant_active_persona_id_unique" unique ("active_persona_id");'
    );

    this.addSql('alter table "designer"."folder" alter column "scope" type text using ("scope"::text);');
    this.addSql(
      "alter table \"designer\".\"folder\" add constraint \"folder_scope_check\" check (\"scope\" in ('entity', 'event', 'flow', 'intent', 'prompt', 'persona', 'response', 'story', 'variable'));"
    );
  }

  async down(): Promise<void> {
    this.addSql('alter table "designer"."card_attachment" drop constraint "card_attachment_media_id_foreign";');

    this.addSql(
      'alter table "designer"."response_payload_to_attachment" drop constraint "response_payload_to_attachment_media_id_foreign";'
    );

    this.addSql('alter table "designer"."response_variant" drop constraint "response_variant_response_id_foreign";');

    this.addSql('alter table "designer"."required_entity" drop constraint "required_entity_reprompt_id_foreign";');

    this.addSql('alter table "designer"."response_payload" drop constraint "response_payload_variant_id_foreign";');

    this.addSql('alter table "designer"."assistant" drop constraint "assistant_active_persona_id_foreign";');

    this.addSql('alter table "designer"."prompt" drop constraint "prompt_persona_id_foreign";');

    this.addSql('alter table "designer"."condition" drop constraint "condition_prompt_id_foreign";');

    this.addSql('alter table "designer"."response_payload" drop constraint "response_payload_prompt_id_foreign";');

    this.addSql('alter table "designer"."utterance" drop constraint "utterance_intent_id_foreign";');

    this.addSql('alter table "designer"."required_entity" drop constraint "required_entity_intent_id_foreign";');

    this.addSql('alter table "designer"."trigger" drop constraint "trigger_intent_id_foreign";');

    this.addSql('alter table "designer"."trigger" drop constraint "trigger_event_id_foreign";');

    this.addSql('alter table "designer"."event_mapping" drop constraint "event_mapping_event_id_foreign";');

    this.addSql('alter table "designer"."required_entity" drop constraint "required_entity_entity_id_foreign";');

    this.addSql('alter table "designer"."entity_variant" drop constraint "entity_variant_entity_id_foreign";');

    this.addSql('alter table "designer"."card_button" drop constraint "card_button_card_id_foreign";');

    this.addSql(
      'alter table "designer"."response_payload_to_attachment" drop constraint "response_payload_to_attachment_card_id_foreign";'
    );

    this.addSql(
      'alter table "response_payload_attachments" drop constraint "response_payload_attachments_base_response_payloa_931d6_foreign";'
    );

    this.addSql('alter table "designer"."story" drop constraint "story_flow_id_foreign";');

    this.addSql('alter table "designer"."variable" drop constraint "variable_flow_id_foreign";');

    this.addSql('alter table "out_flow_mapping" drop constraint "out_flow_mapping_flow_id_foreign";');

    this.addSql('alter table "in_flow_mapping" drop constraint "in_flow_mapping_flow_id_foreign";');

    this.addSql('alter table "designer"."flow_mapping" drop constraint "flow_mapping_flow_id_foreign";');

    this.addSql('alter table "designer"."trigger" drop constraint "trigger_story_id_foreign";');

    this.addSql('alter table "out_flow_mapping" drop constraint "out_flow_mapping_out_from_id_foreign";');

    this.addSql('alter table "out_flow_mapping" drop constraint "out_flow_mapping_out_to_id_foreign";');

    this.addSql('alter table "in_flow_mapping" drop constraint "in_flow_mapping_in_to_id_foreign";');

    this.addSql('alter table "designer"."event_mapping" drop constraint "event_mapping_variable_id_foreign";');

    this.addSql(
      'alter table "designer"."condition_predicate" drop constraint "condition_predicate_condition_id_foreign";'
    );

    this.addSql(
      'alter table "designer"."condition_assertion" drop constraint "condition_assertion_condition_id_foreign";'
    );

    this.addSql('alter table "designer"."response_payload" drop constraint "response_payload_condition_id_foreign";');

    this.addSql(
      'alter table "response_payload_attachments" drop constraint "response_payload_attachments_base_response_payload_id_foreign";'
    );

    this.addSql('drop table if exists "designer"."media_attachment" cascade;');

    this.addSql('drop table if exists "designer"."response" cascade;');

    this.addSql('drop table if exists "designer"."response_variant" cascade;');

    this.addSql('drop table if exists "designer"."persona" cascade;');

    this.addSql('drop table if exists "designer"."prompt" cascade;');

    this.addSql('drop table if exists "designer"."intent" cascade;');

    this.addSql('drop table if exists "designer"."utterance" cascade;');

    this.addSql('drop table if exists "designer"."event" cascade;');

    this.addSql('drop table if exists "designer"."entity" cascade;');

    this.addSql('drop table if exists "designer"."required_entity" cascade;');

    this.addSql('drop table if exists "designer"."entity_variant" cascade;');

    this.addSql('drop table if exists "designer"."card_attachment" cascade;');

    this.addSql('drop table if exists "designer"."card_button" cascade;');

    this.addSql('drop table if exists "designer"."response_payload_to_attachment" cascade;');

    this.addSql('drop table if exists "designer"."flow" cascade;');

    this.addSql('drop table if exists "designer"."story" cascade;');

    this.addSql('drop table if exists "designer"."trigger" cascade;');

    this.addSql('drop table if exists "designer"."variable" cascade;');

    this.addSql('drop table if exists "out_flow_mapping" cascade;');

    this.addSql('drop table if exists "in_flow_mapping" cascade;');

    this.addSql('drop table if exists "designer"."event_mapping" cascade;');

    this.addSql('drop table if exists "designer"."flow_mapping" cascade;');

    this.addSql('drop table if exists "designer"."condition" cascade;');

    this.addSql('drop table if exists "designer"."condition_predicate" cascade;');

    this.addSql('drop table if exists "designer"."condition_assertion" cascade;');

    this.addSql('drop table if exists "designer"."response_payload" cascade;');

    this.addSql('drop table if exists "response_payload_attachments" cascade;');

    this.addSql('alter table "designer"."folder" drop constraint if exists "folder_scope_check";');

    this.addSql('alter table "designer"."assistant" drop constraint "assistant_active_persona_id_unique";');
    this.addSql('alter table "designer"."assistant" drop column "active_persona_id";');

    this.addSql('alter table "designer"."folder" alter column "scope" type text using ("scope"::text);');
    this.addSql(
      'alter table "designer"."folder" add constraint "folder_scope_check" check ("scope" in (\'example\'));'
    );
  }
}
