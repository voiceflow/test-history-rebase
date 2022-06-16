import { CustomScrollbarsTypes } from '@voiceflow/ui';
import _sortBy from 'lodash/sortBy';
import React from 'react';

import DraggableList, { DeleteComponent } from '@/components/DraggableList';
import SearchableList from '@/components/SearchableList';
import { InteractionModelTabType, VariableType } from '@/constants';
import * as Diagram from '@/ducks/diagram';
import * as DiagramV2 from '@/ducks/diagramV2';
import * as ProjectV2 from '@/ducks/projectV2';
import * as SlotV2 from '@/ducks/slotV2';
import * as Version from '@/ducks/version';
import * as VersionV2 from '@/ducks/versionV2';
import { OrderedVariable, useDispatch, useEnableDisable, useSelector, useSetup } from '@/hooks';
import { getPlatformGlobalVariables } from '@/utils/globalVariables';
import { addVariablePrefix, getVariableDescription } from '@/utils/variable';

import LeftColumn from '../LeftColumn';
import RightColumn from '../RightColumn';
import { DraggableItem, Manager, VariableInput, VariableListContainer } from './components';

export interface VariablesManagerProps {
  selectedID?: string;
  setSelectedID: (id: string) => void;
  setSelectedTypeAndID: (type: InteractionModelTabType, id: string) => void;
}

const createVariablesList = (type: VariableType, variables: string[]) =>
  variables.map((variable) => ({ id: addVariablePrefix(type, variable), name: variable, type }));

const VariablesManager: React.FC<VariablesManagerProps> = ({ selectedID, setSelectedID, setSelectedTypeAndID }) => {
  const removeGlobalVariable = useDispatch(Version.removeGlobalVariable);
  const removeVariableFromDiagram = useDispatch(Diagram.removeActiveDiagramVariable);
  const slots = useSelector(SlotV2.allSlotsSelector);
  const localVariables = useSelector(DiagramV2.active.localVariablesSelector);
  const globalVariables = useSelector(VersionV2.active.globalVariablesSelector);
  const platform = useSelector(ProjectV2.active.platformSelector);

  const [mergedVariables, mergedVariablesMap] = React.useMemo(() => {
    const variables = {
      [VariableType.LOCAL]: localVariables,
      [VariableType.GLOBAL]: globalVariables,
      [VariableType.BUILT_IN]: getPlatformGlobalVariables(platform),
    };

    const list = Object.entries(variables).flatMap(([type, variables]) =>
      _sortBy(createVariablesList(type as VariableType, variables), (variable) => variable.name.toLowerCase())
    );

    const map = list.reduce<Record<string, OrderedVariable>>((acc, item) => Object.assign(acc, { [item.id]: item }), {});

    return [list, map];
  }, [localVariables, globalVariables]);

  const selectedVariableID = selectedID || mergedVariables[0].id;
  const [isDragging, startDragging, stopDragging] = useEnableDisable(false);

  const selectedVariable = selectedVariableID ? mergedVariablesMap[selectedVariableID] : null;

  const scrollbarsRef = React.useRef<CustomScrollbarsTypes.Scrollbars>(null);

  const getItemKey = React.useCallback((item: OrderedVariable) => item.id, []);
  const getItemLabel = React.useCallback((item: OrderedVariable) => item.name, []);

  const onDelete = React.useCallback(
    (_, { item }: { item: OrderedVariable }) => {
      if (item.type === VariableType.GLOBAL) {
        removeGlobalVariable(item.name);
      } else {
        removeVariableFromDiagram(item.name);
      }

      if (selectedVariableID === item.id) {
        const index = mergedVariables.findIndex(({ id }) => id === item.id);

        setSelectedID(mergedVariables[index === 0 ? 1 : 0].id);
      }
    },
    [removeGlobalVariable, removeVariableFromDiagram, mergedVariables, selectedVariableID, setSelectedID]
  );

  const deleteSelectedVariable = React.useCallback(() => {
    if (selectedVariable) {
      onDelete(0, { item: selectedVariable });
    }
  }, [onDelete, localVariables, globalVariables, selectedVariable]);

  const onFilter = React.useCallback(
    (_, items: OrderedVariable[]) => {
      if (!items.some((variable) => variable.id === selectedVariable?.id)) {
        setSelectedID(items[0]?.id);
      }
    },
    [selectedVariable, setSelectedID]
  );

  useSetup(() => {
    if (selectedID && !selectedID.match(new RegExp(`(${Object.values(VariableType).join('|')}):.+`))) {
      if (mergedVariablesMap[addVariablePrefix(VariableType.LOCAL, selectedID)]) {
        setSelectedID(addVariablePrefix(VariableType.LOCAL, selectedID));
      } else if (mergedVariablesMap[addVariablePrefix(VariableType.GLOBAL, selectedID)]) {
        setSelectedID(addVariablePrefix(VariableType.GLOBAL, selectedID));
      } else if (mergedVariablesMap[addVariablePrefix(VariableType.BUILT_IN, selectedID)]) {
        setSelectedID(addVariablePrefix(VariableType.BUILT_IN, selectedID));
      } else if (slots.find((slot) => slot.name === selectedID)) {
        setSelectedTypeAndID(InteractionModelTabType.SLOTS, slots.find((slot) => slot.name === selectedID)!.id);
      }
    }
  });

  return (
    <>
      <LeftColumn isDragging={isDragging}>
        <VariableInput setSelected={(type: VariableType, variable: string) => setSelectedID(addVariablePrefix(type, variable))} />

        <VariableListContainer>
          <DraggableList
            type="global-variables"
            onDrop={stopDragging}
            onDelete={onDelete}
            itemProps={{ withoutHover: isDragging, selectedVariableID, onSelectVariableID: setSelectedID }}
            onEndDrag={stopDragging}
            getItemKey={getItemKey}
            onStartDrag={startDragging}
            itemComponent={DraggableItem}
            deleteComponent={DeleteComponent}
            previewComponent={DraggableItem}
            unmountableDuringDrag
            withContextMenuDelete
          >
            {({ renderItem }) => (
              <SearchableList
                ref={scrollbarsRef}
                items={mergedVariables}
                onChange={onFilter}
                getLabel={getItemLabel}
                renderItem={(item: OrderedVariable, index) =>
                  item.type === VariableType.BUILT_IN ? (
                    <DraggableItem
                      key={item.id}
                      item={item}
                      index={index}
                      style={{ opacity: 1 }}
                      isLast={index === mergedVariables.length - 1}
                      isFirst={index === 0}
                      itemKey={item.id}
                      isDragging={false}
                      selectedVariableID={selectedVariableID}
                      onSelectVariableID={setSelectedID}
                    />
                  ) : (
                    renderItem({
                      key: item.id,
                      item,
                      index,
                      isLast: index === mergedVariables.length - 1,
                      isFirst: index === 0,
                      itemKey: item.id,
                    })
                  )
                }
                placeholder="Search Variables"
              />
            )}
          </DraggableList>
        </VariableListContainer>
      </LeftColumn>

      <RightColumn withTopPadding>
        <Manager
          variable={selectedVariable?.name ?? ''}
          isBuiltIn={selectedVariable?.type === VariableType.BUILT_IN}
          description={getVariableDescription(selectedVariable?.name)}
          removeVariable={deleteSelectedVariable}
        />
      </RightColumn>
    </>
  );
};

export default VariablesManager;
