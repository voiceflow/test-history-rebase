import { Migration } from '@mikro-orm/migrations';

export class Migration20231020114109 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "designer"."assistant" drop column "deleted_at";');

    this.addSql('alter table "designer"."media_attachment" drop column "deleted_at";');

    this.addSql('alter table "designer"."folder" drop column "deleted_at";');

    this.addSql('alter table "designer"."variable" drop column "deleted_at";');

    this.addSql('alter table "designer"."response" drop column "deleted_at";');

    this.addSql('alter table "designer"."response_discriminator" drop column "deleted_at";');

    this.addSql('alter table "designer"."persona" drop column "deleted_at";');

    this.addSql('alter table "designer"."persona_override" drop column "deleted_at";');

    this.addSql('alter table "designer"."prompt" drop column "deleted_at";');

    this.addSql('alter table "designer"."intent" drop column "deleted_at";');

    this.addSql('alter table "designer"."utterance" drop column "deleted_at";');

    this.addSql('alter table "designer"."function" drop column "deleted_at";');

    this.addSql('alter table "designer"."function_variable" drop column "deleted_at";');

    this.addSql('alter table "designer"."function_path" drop column "deleted_at";');

    this.addSql('alter table "designer"."flow" drop column "deleted_at";');

    this.addSql('alter table "designer"."story" drop column "deleted_at";');

    this.addSql('alter table "designer"."event" drop column "deleted_at";');

    this.addSql('alter table "designer"."event_mapping" drop column "deleted_at";');

    this.addSql('alter table "designer"."entity" drop column "deleted_at";');

    this.addSql('alter table "designer"."required_entity" drop column "deleted_at";');

    this.addSql('alter table "designer"."entity_variant" drop column "deleted_at";');

    this.addSql('alter table "designer"."card_attachment" drop column "deleted_at";');

    this.addSql('alter table "designer"."card_button" drop column "deleted_at";');

    this.addSql('alter table "designer"."trigger" drop column "deleted_at";');

    this.addSql('alter table "designer"."condition" drop column "deleted_at";');

    this.addSql('alter table "designer"."condition_predicate" drop column "deleted_at";');

    this.addSql('alter table "designer"."condition_assertion" drop column "deleted_at";');

    this.addSql('alter table "designer"."response_variant" drop column "deleted_at";');

    this.addSql('alter table "designer"."response_attachment" drop column "deleted_at";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "designer"."assistant" add column "deleted_at" timestamptz(0) null default null;');

    this.addSql('alter table "designer"."media_attachment" add column "deleted_at" timestamptz(0) null default null;');

    this.addSql('alter table "designer"."folder" add column "deleted_at" timestamptz(0) null default null;');

    this.addSql('alter table "designer"."variable" add column "deleted_at" timestamptz(0) null default null;');

    this.addSql('alter table "designer"."response" add column "deleted_at" timestamptz(0) null default null;');

    this.addSql(
      'alter table "designer"."response_discriminator" add column "deleted_at" timestamptz(0) null default null;'
    );

    this.addSql('alter table "designer"."persona" add column "deleted_at" timestamptz(0) null default null;');

    this.addSql('alter table "designer"."persona_override" add column "deleted_at" timestamptz(0) null default null;');

    this.addSql('alter table "designer"."prompt" add column "deleted_at" timestamptz(0) null default null;');

    this.addSql('alter table "designer"."intent" add column "deleted_at" timestamptz(0) null default null;');

    this.addSql('alter table "designer"."utterance" add column "deleted_at" timestamptz(0) null default null;');

    this.addSql('alter table "designer"."function" add column "deleted_at" timestamptz(0) null default null;');

    this.addSql('alter table "designer"."function_variable" add column "deleted_at" timestamptz(0) null default null;');

    this.addSql('alter table "designer"."function_path" add column "deleted_at" timestamptz(0) null default null;');

    this.addSql('alter table "designer"."flow" add column "deleted_at" timestamptz(0) null default null;');

    this.addSql('alter table "designer"."story" add column "deleted_at" timestamptz(0) null default null;');

    this.addSql('alter table "designer"."event" add column "deleted_at" timestamptz(0) null default null;');

    this.addSql('alter table "designer"."event_mapping" add column "deleted_at" timestamptz(0) null default null;');

    this.addSql('alter table "designer"."entity" add column "deleted_at" timestamptz(0) null default null;');

    this.addSql('alter table "designer"."required_entity" add column "deleted_at" timestamptz(0) null default null;');

    this.addSql('alter table "designer"."entity_variant" add column "deleted_at" timestamptz(0) null default null;');

    this.addSql('alter table "designer"."card_attachment" add column "deleted_at" timestamptz(0) null default null;');

    this.addSql('alter table "designer"."card_button" add column "deleted_at" timestamptz(0) null default null;');

    this.addSql('alter table "designer"."trigger" add column "deleted_at" timestamptz(0) null default null;');

    this.addSql('alter table "designer"."condition" add column "deleted_at" timestamptz(0) null default null;');

    this.addSql(
      'alter table "designer"."condition_predicate" add column "deleted_at" timestamptz(0) null default null;'
    );

    this.addSql(
      'alter table "designer"."condition_assertion" add column "deleted_at" timestamptz(0) null default null;'
    );

    this.addSql('alter table "designer"."response_variant" add column "deleted_at" timestamptz(0) null default null;');

    this.addSql(
      'alter table "designer"."response_attachment" add column "deleted_at" timestamptz(0) null default null;'
    );
  }
}
