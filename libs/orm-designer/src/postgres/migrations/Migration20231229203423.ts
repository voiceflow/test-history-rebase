import { Migration } from '@mikro-orm/migrations';

export class Migration20231229203423 extends Migration {
  async up(): Promise<void> {
    this.addSql('create index "entity_environment_id_index" on "designer"."entity" ("environment_id");');

    this.addSql(
      'create index "required_entity_environment_id_index" on "designer"."required_entity" ("environment_id");'
    );

    this.addSql(
      'create index "entity_variant_environment_id_index" on "designer"."entity_variant" ("environment_id");'
    );
  }

  async down(): Promise<void> {
    this.addSql('drop index "designer"."entity_environment_id_index";');

    this.addSql('drop index "designer"."required_entity_environment_id_index";');

    this.addSql('drop index "designer"."entity_variant_environment_id_index";');
  }
}
