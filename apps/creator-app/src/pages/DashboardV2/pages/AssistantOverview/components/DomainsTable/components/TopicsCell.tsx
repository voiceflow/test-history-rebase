import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Menu, Select, System, TableTypes } from '@voiceflow/ui';
import React from 'react';

import * as DiagramV2 from '@/ducks/diagramV2';
import * as Router from '@/ducks/router';
import { useDispatch, useSelector } from '@/hooks';
import { getDiagramName } from '@/utils/diagram';

const TopicCell: React.FC<TableTypes.ItemProps<Realtime.Domain>> = ({ item }) => {
  const diagramMap = useSelector(DiagramV2.diagramMapSelector);
  const goToDomainDiagram = useDispatch(Router.goToDomainDiagram, item.id);

  return (
    <Box.FlexEnd pr={12} fullWidth>
      <Select
        options={item.topicIDs}
        onSelect={(topicID) => goToDomainDiagram(topicID)}
        minWidth={false}
        placement="left-start"
        useLayers
        modifiers={{ offset: { offset: '0,2' }, preventOverflow: { enabled: true } }}
        searchable
        minMenuWidth={200}
        maxMenuWidth={200}
        getOptionLabel={(value) => value && getDiagramName(diagramMap[value]?.name)}
        alwaysShowCreate
        inDropdownSearch
        createInputPlaceholder="topics"
        renderTrigger={({ ref, onOpenMenu, onHideMenu, isOpen }) => (
          <System.Link.Button
            ref={ref as React.RefObject<HTMLButtonElement>}
            active={isOpen}
            onClick={isOpen ? onHideMenu : onOpenMenu}
            textDecoration
          >
            {item.topicIDs.length}
          </System.Link.Button>
        )}
        renderEmpty={({ search }) => <Menu.NotFound>{!search ? 'No topics exist in your assistant. ' : 'No topics found. '}</Menu.NotFound>}
      />
    </Box.FlexEnd>
  );
};

export default TopicCell;
