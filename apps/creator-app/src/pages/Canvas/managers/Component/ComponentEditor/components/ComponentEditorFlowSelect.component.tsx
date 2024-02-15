import { Utils } from '@voiceflow/common';
import { Flow } from '@voiceflow/dtos';
import { ActionButtons, Box, Button, Divider, Dropdown, Menu, Search } from '@voiceflow/ui-next';
import React from 'react';

import { CMSRoute } from '@/config/routes';
import { Designer } from '@/ducks';
import * as Router from '@/ducks/router';
import { useDispatch, useSelector } from '@/hooks';
import { useGoToCMSResourceModal } from '@/hooks/cms-resource.hook';
import { useDeferredSearch } from '@/hooks/search.hook';
import * as ModalsV2 from '@/ModalsV2';

import { useGoToDiagram } from '../../ComponentManager.hook';

interface IComponentEditorFlowSelect {
  flowID?: string | null;
  onSelect: (flow: Flow) => void;
  activeNodeID: string;
}
export const ComponentEditorFlowSelect: React.FC<IComponentEditorFlowSelect> = ({ flowID, onSelect, activeNodeID }) => {
  const flow = useSelector(Designer.Flow.selectors.oneByID, { id: flowID });
  const flows = useSelector(Designer.Flow.selectors.all);
  const goToDiagram = useGoToDiagram({ diagramID: flow?.diagramID, activeNodeID });
  const goToCMSResource = useDispatch(Router.goToCMSResource);

  const search = useDeferredSearch({
    items: flows,
    searchBy: (item) => item.name,
  });

  const goToCMSFlowCreateModal = useGoToCMSResourceModal(CMSRoute.FLOW);
  const onCreateFlow = () => {
    goToCMSFlowCreateModal(ModalsV2.Flow.Create, { name: search.value, folderID: null });
  };

  return (
    <>
      <Box justify="center" align="center" pt={20} px={24} direction="column">
        <Dropdown
          value={flow?.name || null}
          placeholder="Select existing component"
          onPrefixIconClick={flow ? () => goToCMSResource(CMSRoute.FLOW, flow.id) : undefined}
          prefixIconName={flow ? 'EditS' : undefined}
          prefixIcon={!!flow}
        >
          {({ onClose, referenceRef }) => (
            <Menu
              actionButtons={
                search.hasItems && <ActionButtons firstButton={<ActionButtons.Button label="Create component" onClick={onCreateFlow} />} />
              }
              searchSection={<Search placeholder="Search" value={search.value} onValueChange={search.setValue} />}
              width={referenceRef.current?.clientWidth}
            >
              {search.hasItems ? (
                search.items.map((item) => (
                  <Menu.Item.WithButton
                    searchValue={search.value}
                    label={item?.name}
                    key={item.id}
                    suffixButton={{
                      onClick: () => goToCMSResource(CMSRoute.FLOW, item.id),
                      iconName: 'EditS',
                    }}
                    onClick={Utils.functional.chainVoid(
                      onClose,
                      () => onSelect(item),
                      () => search.setValue('')
                    )}
                  />
                ))
              ) : (
                <Menu.CreateItem label={search.value} onClick={onCreateFlow} />
              )}
            </Menu>
          )}
        </Dropdown>
      </Box>

      {flow ? (
        <Box px={24} pt={10}>
          <Button label="Edit component" fullWidth onClick={goToDiagram} />
        </Box>
      ) : (
        <>
          <Box py={12} px={24}>
            <Divider label="Or" centeredLabel noPadding />
          </Box>
          <Box px={24} justify="center">
            <Button label="New component" fullWidth onClick={onCreateFlow} />
          </Box>
        </>
      )}
    </>
  );
};
