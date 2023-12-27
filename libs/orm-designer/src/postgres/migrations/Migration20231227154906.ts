import { Migration } from '@mikro-orm/migrations';

export class Migration20231227154906 extends Migration {
  async up(): Promise<void> {
    this.addSql('create index "folder_environment_id_index" on "designer"."folder" ("environment_id");');

    this.addSql('create index "variable_environment_id_index" on "designer"."variable" ("environment_id");');

    this.addSql('create index "response_environment_id_index" on "designer"."response" ("environment_id");');

    this.addSql(
      'create index "response_discriminator_environment_id_index" on "designer"."response_discriminator" ("environment_id");'
    );

    this.addSql('create index "persona_environment_id_index" on "designer"."persona" ("environment_id");');

    this.addSql(
      'create index "persona_override_environment_id_index" on "designer"."persona_override" ("environment_id");'
    );

    this.addSql('create index "intent_environment_id_index" on "designer"."intent" ("environment_id");');

    this.addSql('create index "utterance_environment_id_index" on "designer"."utterance" ("environment_id");');

    this.addSql('create index "function_environment_id_index" on "designer"."function" ("environment_id");');

    this.addSql(
      'create index "function_variable_environment_id_index" on "designer"."function_variable" ("environment_id");'
    );

    this.addSql('create index "flow_environment_id_index" on "designer"."flow" ("environment_id");');

    this.addSql('create index "story_environment_id_index" on "designer"."story" ("environment_id");');

    this.addSql('create index "event_environment_id_index" on "designer"."event" ("environment_id");');

    this.addSql('create index "event_mapping_environment_id_index" on "designer"."event_mapping" ("environment_id");');

    this.addSql(
      'create index "card_attachment_environment_id_index" on "designer"."card_attachment" ("environment_id");'
    );

    this.addSql('create index "card_button_environment_id_index" on "designer"."card_button" ("environment_id");');

    this.addSql('create index "trigger_environment_id_index" on "designer"."trigger" ("environment_id");');

    this.addSql('create index "condition_environment_id_index" on "designer"."condition" ("environment_id");');

    this.addSql(
      'create index "condition_predicate_environment_id_index" on "designer"."condition_predicate" ("environment_id");'
    );

    this.addSql(
      'create index "condition_assertion_environment_id_index" on "designer"."condition_assertion" ("environment_id");'
    );

    this.addSql(
      'create index "response_variant_environment_id_index" on "designer"."response_variant" ("environment_id");'
    );
  }

  async down(): Promise<void> {
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

    this.addSql('drop index "designer"."story_environment_id_index";');

    this.addSql('drop index "designer"."event_environment_id_index";');

    this.addSql('drop index "designer"."event_mapping_environment_id_index";');

    this.addSql('drop index "designer"."card_attachment_environment_id_index";');

    this.addSql('drop index "designer"."card_button_environment_id_index";');

    this.addSql('drop index "designer"."trigger_environment_id_index";');

    this.addSql('drop index "designer"."condition_environment_id_index";');

    this.addSql('drop index "designer"."condition_predicate_environment_id_index";');

    this.addSql('drop index "designer"."condition_assertion_environment_id_index";');

    this.addSql('drop index "designer"."response_variant_environment_id_index";');
  }
}
