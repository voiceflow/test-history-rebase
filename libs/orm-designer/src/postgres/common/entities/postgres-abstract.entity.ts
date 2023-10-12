import { Entity } from '@mikro-orm/core';

// @Entity is needed on this empty class otherwise metadata scanning fails
@Entity({ abstract: true })
export abstract class PostgresAbstractEntity {}
