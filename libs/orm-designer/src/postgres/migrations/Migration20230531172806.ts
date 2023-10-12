import { Migration } from '@mikro-orm/migrations';

export class Migration20230531172806 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "designer"."flow_mapping" drop constraint "flow_mapping_out_to_id_foreign";');

    this.addSql('alter table "designer"."flow_mapping" rename column "out_to_id" to "to_id";');
    this.addSql(
      'alter table "designer"."flow_mapping" add constraint "flow_mapping_to_id_foreign" foreign key ("to_id") references "designer"."variable" ("id") on update cascade on delete set null;'
    );
  }

  async down(): Promise<void> {
    this.addSql('alter table "designer"."flow_mapping" drop constraint "flow_mapping_to_id_foreign";');

    this.addSql('alter table "designer"."flow_mapping" rename column "to_id" to "out_to_id";');
    this.addSql(
      'alter table "designer"."flow_mapping" add constraint "flow_mapping_out_to_id_foreign" foreign key ("out_to_id") references "designer"."variable" ("id") on update cascade on delete set null;'
    );
  }
}
