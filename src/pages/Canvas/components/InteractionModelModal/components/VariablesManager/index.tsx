import React from 'react';

import { Scrollbars } from '@/components/CustomScrollbars';
import DraggableList, { DeleteComponent } from '@/components/DraggableList';
import SearchableList from '@/components/SearchableList';
import { BUILT_IN_VARIABLES, InteractionModelTabType } from '@/constants';
import * as Diagram from '@/ducks/diagram';
import * as Session from '@/ducks/session';
import * as SlotDuck from '@/ducks/slot';
import * as Version from '@/ducks/version';
import { connect } from '@/hocs';
import { useEnableDisable, useSetup } from '@/hooks';
import { ConnectedProps } from '@/types';
import { reorder as reorderArray } from '@/utils/array';

import LeftColumn from '../LeftColumn';
import RightColumn from '../RightColumn';
import { DraggableItem, Manager, VariableInput, VariableListContainer } from './components';
import { VARIABLE_DESCRIPTION, VariableType } from './constants';
import { Variable } from './types';
import { addPrefix } from './utils';

export type VariablesManagerProps = {
  selectedID?: string;
  setSelectedID: (id: string) => void;
  setSelectedTypeAndID: (type: InteractionModelTabType, id: string) => void;
};

const createVariablesList = (type: VariableType, variables: string[]) =>
  variables.map((variable) => ({ id: addPrefix(type, variable), name: variable, type }));

const VariablesManager: React.FC<VariablesManagerProps & ConnectedVariablesManagerProps> = ({
  slots,
  selectedID,
  setSelectedID,
  localVariables,
  globalVariables,
  replaceVariableSetDiagram,
  removeGlobalVariable,
  setSelectedTypeAndID,
  removeVariableFromDiagram,
  replaceGlobalVariables,
}) => {
  const [mergedVariables, mergedVariablesMap] = React.useMemo(() => {
    const list = [
      ...createVariablesList(VariableType.LOCAL, localVariables),
      ...createVariablesList(VariableType.GLOBAL, globalVariables),
      ...createVariablesList(VariableType.BUILT_IN, BUILT_IN_VARIABLES),
    ];

    const map = list.reduce<Record<string, Variable>>((acc, item) => Object.assign(acc, { [item.id]: item }), {});

    return [list, map];
  }, [localVariables, globalVariables]);

  const selectedVariableID = selectedID || mergedVariables[0].id;
  const [isDragging, startDragging, stopDragging] = useEnableDisable(false);

  const selectedVariable = selectedVariableID ? mergedVariablesMap[selectedVariableID] : null;

  const scrollbarsRef = React.useRef<Scrollbars>(null);

  const getItemKey = React.useCallback((item: Variable) => item.id, []);
  const getItemLabel = React.useCallback((item: Variable) => item.name, []);

  const onDeleteGlobal = React.useCallback(
    (_, { item }: { item: Variable }) => {
      removeGlobalVariable(item.name);

      if (selectedVariableID === item.id) {
        const index = mergedVariables.findIndex(({ id }) => id === item.id);

        setSelectedID(mergedVariables[index === 0 ? 1 : 0].id);
      }
    },
    [removeGlobalVariable, mergedVariables, selectedVariableID, setSelectedID]
  );

  const onDeleteLocal = React.useCallback(
    (_, { item }: { item: Variable }) => {
      removeVariableFromDiagram(item.name);

      if (selectedVariableID === item.id) {
        const index = mergedVariables.findIndex(({ id }) => id === item.id);

        setSelectedID(mergedVariables[index === 0 ? 1 : 0].id);
      }
    },
    [removeVariableFromDiagram, mergedVariables, selectedVariableID, setSelectedID]
  );

  const deleteSelectedVariable = React.useCallback(() => {
    if (selectedVariable?.type === VariableType.LOCAL) {
      onDeleteLocal(0, { item: selectedVariable });
    } else if (selectedVariable?.type === VariableType.GLOBAL) {
      onDeleteGlobal(0, { item: selectedVariable });
    }
  }, [onDeleteLocal, onDeleteGlobal, localVariables, globalVariables, selectedVariable]);

  const onFilter = React.useCallback(
    (_, items: Variable[]) => {
      if (!items.some((variable) => variable.id === selectedVariable?.id)) {
        setSelectedID(items[0]?.id);
      }
    },
    [selectedVariable, setSelectedID]
  );

  const onReorderGlobalVariables = React.useCallback((from: number, to: number) => replaceGlobalVariables(reorderArray(globalVariables, from, to)), [
    globalVariables,
    replaceGlobalVariables,
  ]);

  const onReorderLocalVariables = React.useCallback((from: number, to: number) => replaceVariableSetDiagram(reorderArray(localVariables, from, to)), [
    localVariables,
    replaceVariableSetDiagram,
  ]);

  useSetup(() => {
    if (selectedID && !selectedID.match(new RegExp(`(${Object.values(VariableType).join('|')}):.+`))) {
      if (mergedVariablesMap[addPrefix(VariableType.LOCAL, selectedID)]) {
        setSelectedID(addPrefix(VariableType.LOCAL, selectedID));
      } else if (mergedVariablesMap[addPrefix(VariableType.GLOBAL, selectedID)]) {
        setSelectedID(addPrefix(VariableType.GLOBAL, selectedID));
      } else if (mergedVariablesMap[addPrefix(VariableType.BUILT_IN, selectedID)]) {
        setSelectedID(addPrefix(VariableType.BUILT_IN, selectedID));
      } else if (slots.find((slot) => slot.name === selectedID)) {
        setSelectedTypeAndID(InteractionModelTabType.SLOTS, slots.find((slot) => slot.name === selectedID)!.id);
      }
    }
  });

  return (
    <>
      <LeftColumn isDragging={isDragging}>
        <VariableInput setSelected={(type: VariableType, variable: string) => setSelectedID(addPrefix(type, variable))} />

        <VariableListContainer>
          <DraggableList
            type="global-variables"
            onDrop={stopDragging}
            onDelete={onDeleteGlobal}
            onReorder={onReorderGlobalVariables}
            itemProps={{ addToIndex: localVariables.length, withoutHover: isDragging, selectedVariableID, onSelectVariableID: setSelectedID }}
            onEndDrag={stopDragging}
            getItemKey={getItemKey}
            onStartDrag={startDragging}
            itemComponent={DraggableItem}
            deleteComponent={DeleteComponent}
            previewComponent={DraggableItem}
            renderDeleteDelayed
            unmountableDuringDrag
            withContextMenuDelete
          >
            {({ renderItem: renderGlobalItem }) => (
              <DraggableList
                type="local-variables"
                onDrop={stopDragging}
                onDelete={onDeleteLocal}
                onReorder={onReorderLocalVariables}
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
                {({ renderItem: renderLocalVariable }) => (
                  <SearchableList
                    ref={scrollbarsRef}
                    items={mergedVariables}
                    onChange={onFilter}
                    getLabel={getItemLabel}
                    renderItem={(item: Variable, index) =>
                      // eslint-disable-next-line no-nested-ternary
                      index < localVariables.length ? (
                        renderLocalVariable({ key: item.id, itemKey: item.id, item, index })
                      ) : index < mergedVariables.length - BUILT_IN_VARIABLES.length ? (
                        renderGlobalItem({ key: item.id, itemKey: item.id, item, index: index - localVariables.length })
                      ) : (
                        <DraggableItem
                          key={item.id}
                          item={item}
                          index={index}
                          style={{ opacity: 1 }}
                          itemKey={item.id}
                          isDragging={false}
                          selectedVariableID={selectedVariableID}
                          onSelectVariableID={setSelectedID}
                        />
                      )
                    }
                    placeholder="Search Variables"
                  />
                )}
              </DraggableList>
            )}
          </DraggableList>
        </VariableListContainer>
      </LeftColumn>

      <RightColumn withTopPadding>
        <Manager
          variable={selectedVariable?.name ?? ''}
          description={selectedVariable ? VARIABLE_DESCRIPTION[selectedVariable.name] : ''}
          isBuiltIn={selectedVariable?.type === VariableType.BUILT_IN}
          removeVariable={deleteSelectedVariable}
        />
      </RightColumn>
    </>
  );
};

const mapStateToProps = {
  slots: SlotDuck.allSlotsSelector,
  diagramID: Session.activeDiagramIDSelector,
  localVariables: Diagram.activeDiagramLocalVariablesSelector,
  globalVariables: Version.activeGlobalVariablesSelector,
};

const mapDispatchToProps = {
  removeGlobalVariable: Version.removeGlobalVariable,
  replaceGlobalVariables: Version.replaceGlobalVariables,
  removeVariableFromDiagram: Diagram.removeActiveDiagramVariable,
  replaceVariableSetDiagram: Diagram.replaceActiveDiagramVariables,
};

type ConnectedVariablesManagerProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(VariablesManager) as React.FC<VariablesManagerProps>;
