/* eslint-disable no-param-reassign */
import { Transform } from './types';

// sync diagramIDs
const migrateToV4_07: Transform = ({ diagrams }) => {
  diagrams.forEach((diagram) => {
    if (diagram._id !== diagram.diagramID) {
      diagram.diagramID = diagram._id;
    }
  });
};

export default migrateToV4_07;
