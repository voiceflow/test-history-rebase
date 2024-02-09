import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { ActionButtons, Box, Button, Divider, Dropdown, Menu, Search } from '@voiceflow/ui-next';
import React from 'react';

import { CMSRoute } from '@/config/routes';
import * as Router from '@/ducks/router';
import { useDispatch } from '@/hooks';
import { useGoToCMSResourceModal } from '@/hooks/cms-resource.hook';
import { useDeferredSearch } from '@/hooks/search.hook';
import * as ModalsV2 from '@/ModalsV2';
import { FlowMapContext } from '@/pages/Canvas/contexts';

import { useMemoizedPropertyFilter } from '../../../hooks/memoized-property-filter.hook';
import { useGoToDiagram } from '../../ComponentManager.hook';

interface SelectComponentProps {
  onChange: (value: Partial<Realtime.NodeData.Component>) => void;
  diagramID?: string;
  nodeID: string;
}

export const SelectComponent = ({ onChange, diagramID, nodeID }: SelectComponentProps) => {
  const goToDiagram = useGoToDiagram({ diagramID, nodeID });
  const goToCMSResource = useDispatch(Router.goToCMSResource);
  const componentMap = React.useContext(FlowMapContext)!;
  const [componentData] = useMemoizedPropertyFilter(Object.values(componentMap), { diagramID });
  const search = useDeferredSearch({
    items: Object.values(componentMap),
    searchBy: (item) => item?.name,
  });
  const hasSelectedComponent = !!diagramID;

  const goToCMSComponentCreateModal = useGoToCMSResourceModal(CMSRoute.COMPONENT);

  const onCreateComponent = () => {
    goToCMSComponentCreateModal(ModalsV2.Component.Create, { name: search.value, folderID: null });
  };

  return (
    <>
      <Box justify="center" align="center" pt={20} px={24} direction="column">
        <Dropdown
          value={componentData?.name || null}
          placeholder="Select existing component"
          onPrefixIconClick={hasSelectedComponent ? () => goToCMSResource(CMSRoute.COMPONENT, componentData.id) : undefined}
          prefixIconName={hasSelectedComponent ? 'EditS' : undefined}
          prefixIcon={hasSelectedComponent}
        >
          {({ onClose, referenceRef }) => (
            <Menu
              actionButtons={
                search.hasItems && <ActionButtons firstButton={<ActionButtons.Button label="Create component" onClick={onCreateComponent} />} />
              }
              searchSection={<Search placeholder="Search" value={search.value} onValueChange={search.setValue} />}
              width={referenceRef.current?.clientWidth}
            >
              {search.hasItems ? (
                search.items.map((componentItem) => (
                  <Menu.Item.WithButton
                    searchValue={search.value}
                    label={componentItem?.name}
                    key={componentItem.id}
                    suffixButton={{
                      onClick: () => goToCMSResource(CMSRoute.COMPONENT, componentItem.id),
                      iconName: 'EditS',
                    }}
                    onClick={Utils.functional.chain(
                      onClose,
                      () =>
                        onChange({
                          diagramID: componentItem.diagramID,
                        }),
                      () => search.setValue('')
                    )}
                  />
                ))
              ) : (
                <Menu.CreateItem label={search.value} onClick={onCreateComponent} />
              )}
            </Menu>
          )}
        </Dropdown>
      </Box>

      {hasSelectedComponent && (
        <Box px={24} pt={10}>
          <Button label="Edit component" fullWidth onClick={goToDiagram} />
        </Box>
      )}

      {!hasSelectedComponent && (
        <>
          <Box py={12} px={24}>
            <Divider label="Or" centeredLabel noPadding />
          </Box>
          <Box px={24} justify="center">
            <Button label="New component" fullWidth onClick={onCreateComponent} />
          </Box>
        </>
      )}
    </>
  );
};
