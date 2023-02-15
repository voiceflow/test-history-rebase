/* eslint-disable no-param-reassign */

import { Transform } from './types';

/**
 * fix diagram.menuItems not defined
 */
const migrateToV3_96: Transform = ({ diagrams }) => {
  diagrams.forEach((dbDiagram) => {
    if (Array.isArray(dbDiagram.menuItems)) return;

    dbDiagram.menuItems = [];
  });
};

export default migrateToV3_96;
