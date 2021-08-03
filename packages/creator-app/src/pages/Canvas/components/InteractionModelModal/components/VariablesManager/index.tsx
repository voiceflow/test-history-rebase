import { PlatformType } from '@voiceflow/internal';
import _sortBy from 'lodash/sortBy';
import React from 'react';

import { Scrollbars } from '@/components/CustomScrollbars';
import DraggableList, { DeleteComponent } from '@/components/DraggableList';
import SearchableList from '@/components/SearchableList';
import { BUILT_IN_VARIABLES, BuiltInVariable, InteractionModelTabType } from '@/constants';
import * as Diagram from '@/ducks/diagram';
import * as Project from '@/ducks/project';
import * as Session from '@/ducks/session';
import * as SlotDuck from '@/ducks/slot';
import * as Version from '@/ducks/version';
import { connect } from '@/hocs';
import { useEnableDisable, useSetup } from '@/hooks';
import { ConnectedProps } from '@/types';
import { createPlatformSelector } from '@/utils/platform';

import LeftColumn from '../LeftColumn';
import RightColumn from '../RightColumn';
import { DraggableItem, Manager, VariableInput, VariableListContainer } from './components';
import { VARIABLE_DESCRIPTION, VariableType } from './constants';
import { Variable } from './types';
import { addPrefix } from './utils';

/** Get global variables for the given platform. */
const getPlatformGlobalVariables = createPlatformSelector(
  {
    [PlatformType.GOOGLE]: [...BUILT_IN_VARIABLES, BuiltInVariable.LAST_UTTERANCE],
    [PlatformType.GENERAL]: [...BUILT_IN_VARIABLES, BuiltInVariable.LAST_UTTERANCE],
  },
  BUILT_IN_VARIABLES
);

export interface VariablesManagerProps {
  selectedID?: string;
  setSelectedID: (id: string) => void;
  setSelectedTypeAndID: (type: InteractionModelTabType, id: string) => void;
}

const createVariablesList = (type: VariableType, variables: string[]) =>
  variables.map((variable) => ({ id: addPrefix(type, variable), name: variable, type }));

const VariablesManager: React.FC<VariablesManagerProps & ConnectedVariablesManagerProps> = ({
  slots,
  selectedID,
  platform,
  setSelectedID,
  localVariables,
  globalVariables,
  removeGlobalVariable,
  setSelectedTypeAndID,
  removeVariableFromDiagram,
}) => {
  const [mergedVariables, mergedVariablesMap] = React.useMemo(() => {
    const variables = {
      [VariableType.LOCAL]: localVariables,
      [VariableType.GLOBAL]: globalVariables,
      [VariableType.BUILT_IN]: getPlatformGlobalVariables(platform),
    };

    const list = Object.entries(variables).flatMap(([type, variables]) =>
      _sortBy(createVariablesList(type as VariableType, variables), (variable) => variable.name.toLowerCase())
    );

    const map = list.reduce<Record<string, Variable>>((acc, item) => Object.assign(acc, { [item.id]: item }), {});

    return [list, map];
  }, [localVariables, globalVariables]);

  const selectedVariableID = selectedID || mergedVariables[0].id;
  const [isDragging, startDragging, stopDragging] = useEnableDisable(false);

  const selectedVariable = selectedVariableID ? mergedVariablesMap[selectedVariableID] : null;

  const scrollbarsRef = React.useRef<Scrollbars>(null);

  const getItemKey = React.useCallback((item: Variable) => item.id, []);
  const getItemLabel = React.useCallback((item: Variable) => item.name, []);

  const onDelete = React.useCallback(
    (_, { item }: { item: Variable }) => {
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
    (_, items: Variable[]) => {
      if (!items.some((variable) => variable.id === selectedVariable?.id)) {
        setSelectedID(items[0]?.id);
      }
    },
    [selectedVariable, setSelectedID]
  );

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
                renderItem={(item: Variable, index) =>
                  item.type === VariableType.BUILT_IN ? (
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
                  ) : (
                    renderItem({ key: item.id, itemKey: item.id, item, index })
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
  platform: Project.activePlatformSelector,
};

const mapDispatchToProps = {
  removeGlobalVariable: Version.removeGlobalVariable,
  removeVariableFromDiagram: Diagram.removeActiveDiagramVariable,
};

type ConnectedVariablesManagerProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(VariablesManager) as React.FC<VariablesManagerProps>;
