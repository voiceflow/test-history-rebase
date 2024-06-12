import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { ActionButtons, Box, Button, Divider, Dropdown, Menu, Search } from '@voiceflow/ui-next';
import React from 'react';

import { CMSRoute } from '@/config/routes';
import { Designer } from '@/ducks';
import * as Router from '@/ducks/router';
import { useDispatch } from '@/hooks';
import { useGoToCMSResourceModal } from '@/hooks/cms-resource.hook';
import { useDeferredSearch } from '@/hooks/search.hook';
import { useSelector } from '@/hooks/store.hook';
import * as ModalsV2 from '@/ModalsV2';

interface FunctionSelectProps {
  onChange: (value: Partial<Realtime.NodeData.Function>) => void;
  functionID: string | null;
}

export const FunctionSelect = ({ onChange, functionID }: FunctionSelectProps) => {
  const functions = useSelector(Designer.Function.selectors.all);
  const functionDef = useSelector(Designer.Function.selectors.oneByID, { id: functionID });

  const goToCMSResource = useDispatch(Router.goToCMSResource);

  const search = useDeferredSearch({
    items: functions,
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
          value={functionDef?.name ?? null}
          prefixIcon={hasSelectedFunction}
          placeholder="Select existing function"
          prefixIconName={hasSelectedFunction ? 'EditS' : undefined}
          onPrefixIconClick={hasSelectedFunction ? () => goToCMSResource(CMSRoute.FUNCTION, functionID) : undefined}
        >
          {({ onClose, referenceRef }) => (
            <Menu
              width={referenceRef.current?.clientWidth}
              actionButtons={
                search.hasItems && (
                  <ActionButtons
                    firstButton={<ActionButtons.Button label="Create function" onClick={onCreateFunction} />}
                  />
                )
              }
              searchSection={<Search placeholder="Search" value={search.value} onValueChange={search.setValue} />}
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
                      () => onChange({ functionID: functionItem.id }),
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
