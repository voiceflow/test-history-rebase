import { GLOBAL_VARIABLES, PlatformType } from '@/constants';

import intentAdapter from '../intent';
import slotAdapter from '../slot';
import { createAdapter } from '../utils';
import skillMetaAdapter from './meta';

const skillAdapter = createAdapter(
  ({
    name,
    skill_id,
    creator_id,
    project_id,
    diagram,
    platform,
    google_publish_info,
    locales,
    global,
    amzn_id,
    vendor_id,
    live,
    google_id,
    review,
    ...meta
  }) => ({
    name,
    id: skill_id,
    creatorID: creator_id,
    projectID: project_id,
    rootDiagramID: diagram,
    diagramID: diagram,
    platform,
    publishInfo: {
      [PlatformType.GOOGLE]: {
        ...google_publish_info,
        googleId: google_id,
      },
      [PlatformType.ALEXA]: {
        amznID: amzn_id,
        vendorId: vendor_id,
        review,
        live,
      },
    },
    locales,
    globalVariables: global.filter((variable) => !GLOBAL_VARIABLES.includes(variable)),
    meta: skillMetaAdapter.fromDB(meta),
  }),
  ({ meta }) => ({
    ...skillMetaAdapter.toDB(meta),
  })
);

export default skillAdapter;

export const extractProject = (skill) => ({
  id: skill.project_id,
  name: skill.name,
  diagramID: skill.diagram,
  locales: skill.locales,
  intents: [],
  slots: [],
});

export const extractIntents = (skill) => intentAdapter.mapFromDB(skill.intents);

export const extractSlots = (skill) => slotAdapter.mapFromDB(skill.slots);
