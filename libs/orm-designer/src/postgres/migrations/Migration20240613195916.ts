import { Migration } from '@mikro-orm/migrations';

export class Migration20240613195916 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "designer"."reference_resource" drop constraint "reference_resource_environment_id_type_diagram_id__00745_unique";');

    this.addSql('alter table "designer"."reference" drop constraint "reference_environment_id_resource_id_referrer_resource_id_unique";');

    this.addSql('alter table "designer"."response" add column "type" text check ("type" in (\'prompt\', \'text\')) null default \'text\';');

    this.addSql('alter table "designer"."function" drop column "path_order";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "designer"."reference_resource" add constraint "reference_resource_environment_id_type_diagram_id__00745_unique" unique ("environment_id", "type", "diagram_id", "resource_id");');

    this.addSql('alter table "designer"."reference" add constraint "reference_environment_id_resource_id_referrer_resource_id_unique" unique ("environment_id", "resource_id", "referrer_resource_id");');

    this.addSql('alter table "designer"."response" drop column "type";');

    this.addSql('alter table "designer"."function" add column "path_order" text[] not null default \'{}\';');
  }

}
