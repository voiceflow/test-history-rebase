import { Migration } from '@mikro-orm/migrations';

export class Migration20240111214820 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "designer"."function_variable" alter column "created_at" type timestamptz using ("created_at"::timestamptz);'
    );

    this.addSql(
      'alter table "designer"."function_path" alter column "created_at" type timestamptz using ("created_at"::timestamptz);'
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "designer"."function_variable" alter column "created_at" type timestamptz(0) using ("created_at"::timestamptz(0));'
    );

    this.addSql(
      'alter table "designer"."function_path" alter column "created_at" type timestamptz(0) using ("created_at"::timestamptz(0));'
    );
  }
}
