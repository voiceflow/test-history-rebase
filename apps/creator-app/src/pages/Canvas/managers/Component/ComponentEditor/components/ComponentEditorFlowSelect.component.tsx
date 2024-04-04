import { Utils } from '@voiceflow/common';
import { Flow } from '@voiceflow/dtos';
import { ActionButtons, Box, Button, Divider, Dropdown, Menu, Search } from '@voiceflow/ui-next';
import React from 'react';

import { CMSRoute } from '@/config/routes';
import { Designer } from '@/ducks';
import * as Router from '@/ducks/router';
import { useDispatch, useSelector } from '@/hooks';
import { useDeferredSearch } from '@/hooks/search.hook';
import * as ModalsV2 from '@/ModalsV2';

interface IComponentEditorFlowSelect {
  diagramID?: string | null;
  onSelect: (flow: Flow) => void;
  activeNodeID: string;
}
export const ComponentEditorFlowSelect: React.FC<IComponentEditorFlowSelect> = ({ diagramID, onSelect, activeNodeID }) => {
  const flows = useSelector(Designer.Flow.selectors.allOrderedByName);
  const flow = useSelector(Designer.Flow.selectors.byDiagramID, { diagramID: diagramID ?? null });
  const createModal = ModalsV2.useModal(ModalsV2.Flow.Create);
  const goToCMSResource = useDispatch(Router.goToCMSResource);

  const goToDiagramHistoryPush = useDispatch(Router.goToDiagramHistoryPush);

  const onClick = () => {
    if (diagramID) goToDiagramHistoryPush(diagramID, undefined, activeNodeID);
  };

  const search = useDeferredSearch({
    items: flows,
    searchBy: (item) => item.name,
  });

  const onCreateFlow = async () => {
    const result = await createModal.openVoid({ name: search.value, folderID: null });

    if (result) onSelect(result);
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
          <Button label="Edit component" fullWidth onClick={onClick} />
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
