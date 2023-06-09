/* eslint-disable no-param-reassign */
import { Transform } from './types';

/**
 * some people used "converted to topic" on their root flow,
 * this changes the root diagram's _id and now version.rootDiagramID points to a non-existent diagram
 * this is for a very specific error case
 */
const migrateToV3_2: Transform = ({ version, diagrams }) => {
  // if the version's rootDiagramID doesn't match any of the diagrams, we have a problem
  const rootDiagramExists = diagrams.some(({ _id }) => String(_id) === String(version.rootDiagramID));

  if (!rootDiagramExists) {
    const candidate = diagrams.find(({ name }) => ['HOME', 'ROOT'].includes(name.toUpperCase()))?._id;

    if (candidate) {
      version.rootDiagramID = String(candidate);
    } else {
      // we can't add new diagrams as part of a migration, need to throw error
      throw new Error(`unable to find home topic`);
    }
  }
};

export default migrateToV3_2;
