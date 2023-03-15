import { Box, Menu, Select, System, TableTypes } from '@voiceflow/ui';
import React from 'react';

import * as Router from '@/ducks/router';
import { useDispatch } from '@/hooks';

import { Topic } from '../types';

const IntentsCell: React.FC<TableTypes.ItemProps<Topic>> = ({ item }) => {
  const goToDiagram = useDispatch(Router.goToDomainDiagram, item.domainID);

  return (
    <Box.FlexEnd pr={12} fullWidth>
      <Select
        options={item.intents}
        onSelect={({ nodeID, diagramID }) => goToDiagram(diagramID, nodeID)}
        minWidth={false}
        placement="left-start"
        useLayers
        modifiers={{ offset: { offset: '0,2' }, preventOverflow: { enabled: true } }}
        searchable
        minMenuWidth={200}
        maxMenuWidth={200}
        getOptionLabel={(option) => option?.name}
        getOptionKey={(option) => option?.nodeID}
        alwaysShowCreate
        inDropdownSearch
        createInputPlaceholder="intents"
        renderTrigger={({ ref, onOpenMenu, onHideMenu, isOpen }) => (
          <System.Link.Button
            ref={ref as React.RefObject<HTMLButtonElement>}
            active={isOpen}
            onClick={isOpen ? onHideMenu : onOpenMenu}
            textDecoration
          >
            {item.intents.length}
          </System.Link.Button>
        )}
        renderEmpty={({ search }) => <Menu.NotFound>{!search ? 'No intents exist in your assistant. ' : 'No intents found. '}</Menu.NotFound>}
      />
    </Box.FlexEnd>
  );
};

export default IntentsCell;
