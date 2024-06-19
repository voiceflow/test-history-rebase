import { Migration } from '@mikro-orm/migrations';

export class Migration20240619185006 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "designer"."reference_resource" drop constraint if exists "reference_resource_type_check";');

    this.addSql('alter table "designer"."folder" drop constraint if exists "folder_scope_check";');

    this.addSql('alter table "designer"."reference_resource" alter column "type" type text using ("type"::text);');
    this.addSql('alter table "designer"."reference_resource" add constraint "reference_resource_type_check" check ("type" in (\'node\', \'flow\', \'intent\', \'diagram\', \'response\', \'workflow\'));');

    this.addSql('alter table "designer"."folder" alter column "scope" type text using ("scope"::text);');
    this.addSql('alter table "designer"."folder" add constraint "folder_scope_check" check ("scope" in (\'flow\', \'event\', \'entity\', \'intent\', \'prompt\', \'persona\', \'workflow\', \'response\', \'message\', \'variable\', \'function\', \'knowledge-base\'));');
  }

  async down(): Promise<void> {
    this.addSql('alter table "designer"."reference_resource" drop constraint if exists "reference_resource_type_check";');

    this.addSql('alter table "designer"."folder" drop constraint if exists "folder_scope_check";');

    this.addSql('alter table "designer"."reference_resource" alter column "type" type text using ("type"::text);');
    this.addSql('alter table "designer"."reference_resource" add constraint "reference_resource_type_check" check ("type" in (\'node\', \'intent\', \'diagram\', \'function\', \'response\'));');

    this.addSql('alter table "designer"."folder" alter column "scope" type text using ("scope"::text);');
    this.addSql('alter table "designer"."folder" add constraint "folder_scope_check" check ("scope" in (\'flow\', \'event\', \'entity\', \'intent\', \'prompt\', \'persona\', \'workflow\', \'response\', \'variable\', \'function\', \'knowledge-base\'));');
  }

}
