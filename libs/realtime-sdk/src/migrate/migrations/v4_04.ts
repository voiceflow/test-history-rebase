/* eslint-disable no-param-reassign */

import type { Transform } from './types';

/**
 * cleans duplicate topicIDs from domains and duplicate menuItems from diagrams
 */
const migrateToV4_04: Transform = ({ diagrams, version }) => {
  version.domains?.forEach((domain) => {
    const topicIDs = new Set<string>();
    if (!Array.isArray(domain.topicIDs)) return;

    domain.topicIDs = domain.topicIDs.filter((topicID) => {
      if (topicIDs.has(topicID)) return false;
      topicIDs.add(topicID);
      return true;
    });
  });

  diagrams.forEach((diagram) => {
    const menuItems = new Set<string>();
    if (!Array.isArray(diagram.menuItems)) return;

    diagram.menuItems = diagram.menuItems.filter((menuItem) => {
      if (menuItems.has(menuItem.type + menuItem.sourceID)) return false;
      menuItems.add(menuItem.type + menuItem.sourceID);
      return true;
    });
  });
};

export default migrateToV4_04;
