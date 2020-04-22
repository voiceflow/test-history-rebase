import React from 'react';

import { Scrollbars } from '@/components/CustomScrollbars';
import DraggableList, { DeleteComponent } from '@/components/DraggableList';
import SearchableList from '@/components/SearchableList';
import { BUILT_IN_VARIABLES } from '@/constants';
import * as Skill from '@/ducks/skill';
import * as VariableSet from '@/ducks/variableSet';
import { connect } from '@/hocs';
import { useEnableDisable } from '@/hooks';
import * as Selectors from '@/store/selectors';
import { ConnectedProps, MergeArguments } from '@/types';
import { reorder as reorderArray } from '@/utils/array';

import LeftColumn from '../LeftColumn';
import RightColumn from '../RightColumn';
import { DraggableItem, Manager, VariableInput, VariableListContainer } from './components';
import { VARIABLE_DESCRIPTION, VariableType } from './constants';
import { Variable } from './types';
import { addPrefix } from './utils';

const createVariablesList = (type: VariableType, variables: string[]) =>
  variables.map((variable) => ({ id: addPrefix(type, variable), name: variable, type }));

const VariablesManager: React.FC<ConnectedVariablesManagerProps> = ({
  localVariables,
  globalVariables,
  removeLocalVariable,
  removeGlobalVariable,
  replaceLocalVariables,
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

  const [selectedVariableID, setSelectedVariableID] = React.useState<string | undefined>(mergedVariables[0].id);
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

        setSelectedVariableID(mergedVariables[index === 0 ? 1 : 0].id);
      }
    },
    [removeGlobalVariable, mergedVariables, selectedVariableID]
  );

  const onDeleteLocal = React.useCallback(
    (_, { item }: { item: Variable }) => {
      removeLocalVariable(item.name);

      if (selectedVariableID === item.id) {
        const index = mergedVariables.findIndex(({ id }) => id === item.id);

        setSelectedVariableID(mergedVariables[index === 0 ? 1 : 0].id);
      }
    },
    [removeLocalVariable, mergedVariables, selectedVariableID]
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
        setSelectedVariableID(items[0]?.id);
      }
    },
    [selectedVariable]
  );

  const onReorderGlobalVariables = React.useCallback((from: number, to: number) => replaceGlobalVariables(reorderArray(globalVariables, from, to)), [
    globalVariables,
    replaceGlobalVariables,
  ]);

  const onReorderLocalVariables = React.useCallback((from: number, to: number) => replaceLocalVariables(reorderArray(localVariables, from, to)), [
    localVariables,
    replaceLocalVariables,
  ]);

  return (
    <>
      <LeftColumn>
        <VariableInput setSelected={(type: VariableType, variable: string) => setSelectedVariableID(addPrefix(type, variable))} />

        <VariableListContainer>
          <DraggableList
            type="global-variables"
            onDrop={stopDragging}
            onDelete={onDeleteGlobal}
            onReorder={onReorderGlobalVariables}
            itemProps={{ addToIndex: localVariables.length, withoutHover: isDragging, selectedVariableID, onSelectVariableID: setSelectedVariableID }}
            onEndDrag={stopDragging}
            getItemKey={getItemKey}
            onStartDrag={startDragging}
            itemComponent={DraggableItem}
            deleteComponent={DeleteComponent}
            previewComponent={DraggableItem}
            unmountableDuringDrag
            withContextMenuDelete
          >
            {({ renderItem: renderGlobalItem }) => (
              <DraggableList
                type="local-variables"
                onDrop={stopDragging}
                onDelete={onDeleteLocal}
                onReorder={onReorderLocalVariables}
                itemProps={{ withoutHover: isDragging, selectedVariableID, onSelectVariableID: setSelectedVariableID }}
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
                        <DraggableItem key={item.id} item={item} selectedVariableID={selectedVariableID} onSelectVariableID={setSelectedVariableID} />
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
  diagramID: Skill.activeDiagramIDSelector,
  localVariables: Selectors.activeDiagramVariablesSelector,
  globalVariables: Skill.globalVariablesSelector,
};

const mapDispatchToProps = {
  removeGlobalVariable: Skill.removeGlobalVariable,
  replaceGlobalVariables: Skill.replaceGlobalVariables,
  removeVariableFromDiagram: VariableSet.removeVariableFromDiagram,
  replaceVariableSetDiagram: VariableSet.replaceVariableSetDiagram,
};

const mergeProps = (
  ...[{ diagramID }, { removeVariableFromDiagram, replaceVariableSetDiagram }]: MergeArguments<typeof mapStateToProps, typeof mapDispatchToProps>
) => ({
  removeLocalVariable: (variable: string) => removeVariableFromDiagram(diagramID, variable),
  replaceLocalVariables: (variables: string[]) => replaceVariableSetDiagram(diagramID, variables),
});

type ConnectedVariablesManagerProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps, typeof mergeProps>;

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(VariablesManager);
