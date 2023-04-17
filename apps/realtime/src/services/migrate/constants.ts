export enum MigrationState {
  /**
   * migration has started
   */
  STARTED = 'started',
  /**
   * migration completed successfully
   */
  DONE = 'done',
  /**
   * cannot perform the migration as this schema is already checked out at a particular version
   */
  NOT_ALLOWED = 'not_allowed',
  /**
   * cannot perform the migration as the target version is not supported
   */
  NOT_SUPPORTED = 'not_supported',
  /**
   * no migrations can be performed on the current schema
   */
  NOT_REQUIRED = 'not_required',
}
