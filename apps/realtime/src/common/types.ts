import type {
  CMSObjectORM,
  CreateData,
  MutableORM,
  ORMDiscriminatorEntity,
  PatchData as EntityPatchData,
} from '@voiceflow/orm-designer';

export type CMSPatchData<Orm extends CMSObjectORM<any, any>> = EntityPatchData<ORMDiscriminatorEntity<Orm>>;

export type CMSCreateData<Orm extends MutableORM<any, any>> = Omit<
  CreateData<ORMDiscriminatorEntity<Orm>>,
  'assistantID' | 'environmentID'
>;

export type CMSCreateForUserData<Orm extends CMSObjectORM<any, any>> = Omit<
  CMSCreateData<Orm>,
  'createdByID' | 'updatedByID'
>;
