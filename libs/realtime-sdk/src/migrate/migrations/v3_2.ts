/* eslint-disable no-param-reassign */
import type { Transform } from './types';

/**
 * some people used "converted to topic" on their root flow,
 * this changes the root diagram's diagramID and now version.rootDiagramID points to a non-existent diagram
 * this is for a very specific error case
 */
const migrateToV3_2: Transform = ({ version, diagrams }) => {
  // if the version's rootDiagramID doesn't match any of the diagrams, we have a problem
  const rootDiagramExists = diagrams.some(({ diagramID }) => String(diagramID) === String(version.rootDiagramID));

  if (!rootDiagramExists) {
    const diagramCandidate = diagrams.find(({ name }) => ['HOME', 'ROOT'].includes(name.toUpperCase()));
    const candidate = diagramCandidate?.diagramID;

    if (candidate) {
      version.rootDiagramID = String(candidate);
    } else {
      // we can't add new diagrams as part of a migration, need to throw error
      throw new Error('unable to find home topic');
    }
  }
};

export default migrateToV3_2;
