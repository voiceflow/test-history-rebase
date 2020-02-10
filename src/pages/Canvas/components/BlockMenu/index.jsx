import React from 'react';

import ExpandingList from '@/components/ExpandingList';
import * as Panel from '@/components/Panel';
import { openBlockMenuSectionsSelector, toggleBlockMenuSection } from '@/ducks/ui';
import { connect } from '@/hocs';
import { BLOCK_MENU, BLOCK_MENU_CATEGORIES } from '@/pages/Canvas/constants';
import { ManagerContext } from '@/pages/Canvas/contexts';

import BlockMenuItem from './components/BlockMenuItem';
import BlockMenuPanel from './components/BlockMenuPanel';

function BlockMenu({ onClose, expandedSections, toggleSection }) {
  const getManager = React.useContext(ManagerContext);

  return (
    <BlockMenuPanel title="Blocks" onClose={onClose}>
      <Panel.Content>
        <Panel.Section>
          <ExpandingList
            expanded={expandedSections}
            onToggle={toggleSection}
            itemComponent={BlockMenuItem}
            sections={BLOCK_MENU.map(({ type, items }) => {
              const { label, color } = BLOCK_MENU_CATEGORIES[type];

              return {
                key: type,
                label,
                color,
                items: items.map((itemType) => {
                  const manager = getManager(itemType);

                  return { key: itemType, label: manager.label, type: itemType };
                }),
              };
            })}
          />
        </Panel.Section>
      </Panel.Content>
    </BlockMenuPanel>
  );
}

const mapStateToProps = {
  expandedSections: openBlockMenuSectionsSelector,
};

const mapDispatchToProps = {
  toggleSection: toggleBlockMenuSection,
};

export default connect(mapStateToProps, mapDispatchToProps)(BlockMenu);
