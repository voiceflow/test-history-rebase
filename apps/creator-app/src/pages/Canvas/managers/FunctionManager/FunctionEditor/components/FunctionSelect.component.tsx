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
import { FunctionMapContext } from '@/pages/Canvas/contexts';
import { getItemFromMap } from '@/pages/Canvas/utils';

interface FunctionSelectProps {
  onChange: (value: Partial<Realtime.NodeData.Function>) => void;
  functionID?: string;
}

export const FunctionSelect = ({ onChange, functionID }: FunctionSelectProps) => {
  const goToCMSResource = useDispatch(Router.goToCMSResource);
  const functionMap = React.useContext(FunctionMapContext)!;
  const functionData = getItemFromMap(functionMap, functionID!);
  const search = useDeferredSearch({
    items: Object.values(functionMap),
    searchBy: (item) => item.name,
  });
  const hasSelectedFunction = !!functionID;

  const goToCMSFunctionCreateModal = useGoToCMSResourceModal(CMSRoute.FUNCTION);

  const onCreateFunction = () => {
    goToCMSFunctionCreateModal(ModalsV2.Function.Create, { name: search.value, folderID: null });
  };

  return (
    <>
      <Box justify="center" align="center" pt={20} px={24} direction="column">
        <Dropdown
          value={functionData.name || null}
          placeholder="Select a function"
          onPrefixIconClick={hasSelectedFunction ? () => goToCMSResource(CMSRoute.FUNCTION, functionID) : undefined}
          prefixIconName={hasSelectedFunction ? 'EditS' : undefined}
          prefixIcon={hasSelectedFunction}
        >
          {({ onClose, referenceRef }) => (
            <Menu
              actionButtons={
                search.hasItems && <ActionButtons firstButton={<ActionButtons.Button label="Create function" onClick={onCreateFunction} />} />
              }
              searchSection={<Search placeholder="Search" value={search.value} onValueChange={search.setValue} />}
              width={referenceRef.current?.clientWidth}
            >
              {search.hasItems ? (
                search.items.map((functionItem) => (
                  <Menu.Item.WithButton
                    searchValue={search.value}
                    label={functionItem.name}
                    key={functionItem.id}
                    suffixButton={{
                      onClick: () => goToCMSResource(CMSRoute.FUNCTION, functionItem.id),
                      iconName: 'EditS',
                    }}
                    onClick={Utils.functional.chain(
                      onClose,
                      () =>
                        onChange({
                          functionID: functionItem.id,
                        }),
                      () => search.setValue('')
                    )}
                  />
                ))
              ) : (
                <Menu.CreateItem label={search.value} onClick={onCreateFunction} />
              )}
            </Menu>
          )}
        </Dropdown>
      </Box>

      {!functionID && (
        <>
          <Box py={12} px={24}>
            <Divider label="Or" centeredLabel noPadding />
          </Box>
          <Box px={24} justify="center">
            <Button label="Create function" fullWidth onClick={onCreateFunction} />
          </Box>
        </>
      )}
    </>
  );
};
