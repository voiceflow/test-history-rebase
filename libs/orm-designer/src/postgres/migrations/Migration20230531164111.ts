import { Migration } from '@mikro-orm/migrations';

export class Migration20230531164111 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "designer"."response_payload_to_attachment" add column "payload_id" varchar(255) not null;'
    );
    this.addSql(
      'alter table "designer"."response_payload_to_attachment" add constraint "response_payload_to_attachment_payload_id_foreign" foreign key ("payload_id") references "designer"."response_payload" ("id") on update cascade;'
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "designer"."response_payload_to_attachment" drop constraint "response_payload_to_attachment_payload_id_foreign";'
    );

    this.addSql('alter table "designer"."response_payload_to_attachment" drop column "payload_id";');
  }
}
