import { Migration } from '@mikro-orm/migrations';

export class Migration20240610094750 extends Migration {
  async up(): Promise<void> {
    this.addSql(`
      update designer.function
      set path_order = array(
        select fp.id
        from designer.function_path fp
        where designer.function.id = fp.function_id
        order by fp.created_at desc
      )`);
  }

  async down(): Promise<void> {
    this.addSql('update designer.function set path_order = array[]::varchar[]');
  }
}
