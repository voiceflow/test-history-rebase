import { Migration } from '@mikro-orm/migrations';

export class Migration20230720163857 extends Migration {
  async up(): Promise<void> {
    this.addSql('drop table if exists "response_variant_attachments" cascade;');
  }

  async down(): Promise<void> {
    this.addSql(
      'create table "response_variant_attachments" ("base_response_variant_id" varchar(255) not null, "base_response_attachment_id" varchar(255) not null, constraint "response_variant_attachments_pkey" primary key ("base_response_variant_id", "base_response_attachment_id"));'
    );

    this.addSql(
      'alter table "response_variant_attachments" add constraint "response_variant_attachments_base_response_variant_id_foreign" foreign key ("base_response_variant_id") references "designer"."response_variant" ("id") on update cascade on delete cascade;'
    );
    this.addSql(
      'alter table "response_variant_attachments" add constraint "response_variant_attachments_base_response_attachment_id_foreign" foreign key ("base_response_attachment_id") references "designer"."response_attachment" ("id") on update cascade on delete cascade;'
    );
  }
}
