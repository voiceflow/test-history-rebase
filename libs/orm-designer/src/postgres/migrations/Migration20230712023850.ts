import { Migration } from '@mikro-orm/migrations';

export class Migration20230712023850 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "designer"."response_payload_to_attachment" drop constraint "response_payload_to_attachment_payload_id_foreign";'
    );

    this.addSql(
      'alter table "response_payload_attachments" drop constraint "response_payload_attachments_base_response_payload_id_foreign";'
    );

    this.addSql(
      'alter table "response_payload_attachments" drop constraint "response_payload_attachments_base_response_payloa_931d6_foreign";'
    );

    this.addSql(
      'create table "designer"."response_discriminator" ("id" varchar(255) not null, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "deleted_at" timestamptz(0) null default null, "language" text check ("language" in (\'en-us\')) not null, "channel" text check ("channel" in (\'default\')) not null, "variant_order" text[] not null, "response_id" varchar(255) not null, "assistant_id" varchar(255) not null, constraint "response_discriminator_pkey" primary key ("id"));'
    );

    this.addSql(
      'create table "designer"."response_attachment" ("id" varchar(255) not null, "created_at" timestamptz(0) not null default now(), "deleted_at" timestamptz(0) null default null, "type" text check ("type" in (\'card\', \'media\')) not null, "variant_id" varchar(255) not null, "assistant_id" varchar(255) not null, "card_id" varchar(255) null, "media_id" varchar(255) null, constraint "response_attachment_pkey" primary key ("id"));'
    );
    this.addSql('create index "response_attachment_type_index" on "designer"."response_attachment" ("type");');

    this.addSql(
      'create table "response_variant_attachments" ("base_response_variant_id" varchar(255) not null, "base_response_attachment_id" varchar(255) not null, constraint "response_variant_attachments_pkey" primary key ("base_response_variant_id", "base_response_attachment_id"));'
    );

    this.addSql(
      'alter table "designer"."response_discriminator" add constraint "response_discriminator_response_id_foreign" foreign key ("response_id") references "designer"."response" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."response_discriminator" add constraint "response_discriminator_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade;'
    );

    this.addSql(
      'alter table "designer"."response_attachment" add constraint "response_attachment_variant_id_foreign" foreign key ("variant_id") references "designer"."response_variant" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."response_attachment" add constraint "response_attachment_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."response_attachment" add constraint "response_attachment_card_id_foreign" foreign key ("card_id") references "designer"."card_attachment" ("id") on update cascade on delete set null;'
    );
    this.addSql(
      'alter table "designer"."response_attachment" add constraint "response_attachment_media_id_foreign" foreign key ("media_id") references "designer"."media_attachment" ("id") on update cascade on delete set null;'
    );

    this.addSql(
      'alter table "response_variant_attachments" add constraint "response_variant_attachments_base_response_variant_id_foreign" foreign key ("base_response_variant_id") references "designer"."response_variant" ("id") on update cascade on delete cascade;'
    );
    this.addSql(
      'alter table "response_variant_attachments" add constraint "response_variant_attachments_base_response_attachment_id_foreign" foreign key ("base_response_attachment_id") references "designer"."response_attachment" ("id") on update cascade on delete cascade;'
    );

    this.addSql('drop table if exists "designer"."response_payload" cascade;');

    this.addSql('drop table if exists "designer"."response_payload_to_attachment" cascade;');

    this.addSql('drop table if exists "response_payload_attachments" cascade;');

    this.addSql('alter table "designer"."response_variant" drop constraint "response_variant_response_id_foreign";');

    this.addSql(
      'alter table "designer"."response_variant" add column "type" text check ("type" in (\'json\', \'prompt\', \'text\')) not null, add column "speed" int not null, add column "card_layout" text check ("card_layout" in (\'carousel\', \'list\')) not null, add column "condition_id" varchar(255) null default null, add column "json" jsonb null, add column "turns" int null, add column "context" text check ("context" in (\'prompt\', \'memory\', \'knowledge_base\')) null, add column "prompt_id" varchar(255) null default null, add column "text" jsonb null;'
    );
    this.addSql(
      'alter table "designer"."response_variant" add constraint "response_variant_condition_id_foreign" foreign key ("condition_id") references "designer"."condition" ("id") on update cascade on delete set null;'
    );
    this.addSql(
      'alter table "designer"."response_variant" add constraint "response_variant_prompt_id_foreign" foreign key ("prompt_id") references "designer"."prompt" ("id") on update cascade on delete set null;'
    );
    this.addSql('alter table "designer"."response_variant" drop column "language";');
    this.addSql('alter table "designer"."response_variant" drop column "channel";');
    this.addSql('alter table "designer"."response_variant" rename column "payload_order" to "attachment_order";');
    this.addSql('alter table "designer"."response_variant" rename column "response_id" to "discriminator_id";');
    this.addSql(
      'alter table "designer"."response_variant" add constraint "response_variant_discriminator_id_foreign" foreign key ("discriminator_id") references "designer"."response_discriminator" ("id") on update cascade;'
    );
    this.addSql('create index "response_variant_type_index" on "designer"."response_variant" ("type");');
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "designer"."response_variant" drop constraint "response_variant_discriminator_id_foreign";'
    );

    this.addSql(
      'alter table "response_variant_attachments" drop constraint "response_variant_attachments_base_response_attachment_id_foreign";'
    );

    this.addSql(
      'create table "designer"."response_payload" ("id" varchar(255) not null, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "deleted_at" timestamptz(0) null default null, "type" text check ("type" in (\'json\', \'prompt\', \'text\')) not null, "card_layout" text check ("card_layout" in (\'carousel\', \'list\')) not null, "speed" int not null, "attachment_order" text[] not null, "condition_id" varchar(255) null default null, "variant_id" varchar(255) not null, "assistant_id" varchar(255) not null, "json" jsonb null, "turns" int null, "context" text check ("context" in (\'prompt\', \'memory\', \'knowledge_base\')) null, "prompt_id" varchar(255) null default null, "text" jsonb null, constraint "response_payload_pkey" primary key ("id"));'
    );
    this.addSql('create index "response_payload_type_index" on "designer"."response_payload" ("type");');

    this.addSql(
      'create table "designer"."response_payload_to_attachment" ("id" varchar(255) not null, "created_at" timestamptz(0) not null default now(), "deleted_at" timestamptz(0) null default null, "type" text check ("type" in (\'card\', \'media\')) not null, "payload_id" varchar(255) not null, "assistant_id" varchar(255) not null, "card_id" varchar(255) null, "media_id" varchar(255) null, constraint "response_payload_to_attachment_pkey" primary key ("id"));'
    );
    this.addSql(
      'create index "response_payload_to_attachment_type_index" on "designer"."response_payload_to_attachment" ("type");'
    );

    this.addSql(
      'create table "response_payload_attachments" ("base_response_payload_id" varchar(255) not null, "base_response_payload_to_attachment_id" varchar(255) not null, constraint "response_payload_attachments_pkey" primary key ("base_response_payload_id", "base_response_payload_to_attachment_id"));'
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
      'alter table "designer"."response_payload_to_attachment" add constraint "response_payload_to_attachment_payload_id_foreign" foreign key ("payload_id") references "designer"."response_payload" ("id") on update cascade;'
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
      'alter table "response_payload_attachments" add constraint "response_payload_attachments_base_response_payload_id_foreign" foreign key ("base_response_payload_id") references "designer"."response_payload" ("id") on update cascade on delete cascade;'
    );
    this.addSql(
      'alter table "response_payload_attachments" add constraint "response_payload_attachments_base_response_payloa_931d6_foreign" foreign key ("base_response_payload_to_attachment_id") references "designer"."response_payload_to_attachment" ("id") on update cascade on delete cascade;'
    );

    this.addSql('drop table if exists "designer"."response_discriminator" cascade;');

    this.addSql('drop table if exists "designer"."response_attachment" cascade;');

    this.addSql('drop table if exists "response_variant_attachments" cascade;');

    this.addSql('alter table "designer"."response_variant" drop constraint "response_variant_condition_id_foreign";');
    this.addSql('alter table "designer"."response_variant" drop constraint "response_variant_prompt_id_foreign";');

    this.addSql(
      'alter table "designer"."response_variant" add column "language" text check ("language" in (\'en-us\')) not null, add column "channel" text check ("channel" in (\'default\')) not null;'
    );
    this.addSql('drop index "designer"."response_variant_type_index";');
    this.addSql('alter table "designer"."response_variant" drop column "type";');
    this.addSql('alter table "designer"."response_variant" drop column "speed";');
    this.addSql('alter table "designer"."response_variant" drop column "card_layout";');
    this.addSql('alter table "designer"."response_variant" drop column "condition_id";');
    this.addSql('alter table "designer"."response_variant" drop column "json";');
    this.addSql('alter table "designer"."response_variant" drop column "turns";');
    this.addSql('alter table "designer"."response_variant" drop column "context";');
    this.addSql('alter table "designer"."response_variant" drop column "prompt_id";');
    this.addSql('alter table "designer"."response_variant" drop column "text";');
    this.addSql('alter table "designer"."response_variant" rename column "attachment_order" to "payload_order";');
    this.addSql('alter table "designer"."response_variant" rename column "discriminator_id" to "response_id";');
    this.addSql(
      'alter table "designer"."response_variant" add constraint "response_variant_response_id_foreign" foreign key ("response_id") references "designer"."response" ("id") on update cascade;'
    );
  }
}
