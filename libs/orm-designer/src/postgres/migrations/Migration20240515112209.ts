import { Migration } from '@mikro-orm/migrations';

export class Migration20240515112209 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "designer"."condition" drop constraint "condition_prompt_id_environment_id_foreign";');

    this.addSql('alter table "designer"."response_variant" drop constraint "response_variant_prompt_id_environment_id_foreign";');

    this.addSql('alter table "designer"."condition" add column "prompt" jsonb null default null;');
    this.addSql('alter table "designer"."condition" drop column "prompt_id";');

    this.addSql('alter table "designer"."response_variant" add column "prompt" jsonb null default null;');
    this.addSql('alter table "designer"."response_variant" drop column "prompt_id";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "designer"."condition" add column "prompt_id" varchar(24) null default null;');
    this.addSql('alter table "designer"."condition" drop column "prompt";');
    this.addSql('alter table "designer"."condition" add constraint "condition_prompt_id_environment_id_foreign" foreign key ("prompt_id", "environment_id") references "designer"."prompt" ("id", "environment_id") on update cascade on delete set default;');

    this.addSql('alter table "designer"."response_variant" add column "prompt_id" varchar(24) null default null;');
    this.addSql('alter table "designer"."response_variant" drop column "prompt";');
    this.addSql('alter table "designer"."response_variant" add constraint "response_variant_prompt_id_environment_id_foreign" foreign key ("prompt_id", "environment_id") references "designer"."prompt" ("id", "environment_id") on update cascade on delete set default;');
  }

}
