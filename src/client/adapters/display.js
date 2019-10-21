import { createAdapter } from './utils';

const displayAdapter = createAdapter(
  ({ id, title, creator_id, skill_id, datasource, description, document }) => ({
    id,
    name: title,
    creatorID: creator_id,
    skillID: skill_id,
    datasource,
    description,
    document,
  }),
  ({ id, name, creatorID, skillID, datasource, description, document }) => ({
    id,
    title: name,
    creator_id: creatorID,
    skill_id: skillID,
    datasource,
    description,
    document,
  })
);

export default displayAdapter;
