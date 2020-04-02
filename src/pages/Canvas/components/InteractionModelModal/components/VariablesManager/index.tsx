// import cuid from 'cuid';
import React from 'react';

import { Scrollbars } from '@/components/CustomScrollbars';
import DraggableList, { DeleteComponent } from '@/components/DraggableList';
import SearchableList from '@/components/SearchableList';
import { GLOBAL_VARIABLES } from '@/constants';
import * as Skill from '@/ducks/skill';
import * as VariableSet from '@/ducks/variableSet';
import { connect } from '@/hocs';
import { useEnableDisable } from '@/hooks';
import * as Selectors from '@/store/selectors';
import { reorder as reorderArray } from '@/utils/array';

import LeftColumn from '../LeftColumn';
import RightColumn from '../RightColumn';
import { DraggableItem, Manager } from './components';
import { VARIABLE_DESCRIPTION } from './constants';
import { VariableType } from './types';

export type VariablesManagerProps = {
  localVariables: string[];
  globalVariables: string[];
  removeLocalVariable: (variable: string) => void;
  removeGlobalVariable: (variable: string) => void;
  replaceLocalVariables: (variables: string[]) => void;
  replaceGlobalVariables: (variables: string[]) => void;
};

const VariablesManager: React.FC<VariablesManagerProps> = ({
  localVariables,
  globalVariables,
  removeLocalVariable,
  removeGlobalVariable,
  replaceLocalVariables,
  replaceGlobalVariables,
}) => {
  const mergedVariables = React.useMemo(() => [...localVariables, ...globalVariables, ...GLOBAL_VARIABLES], [localVariables, globalVariables]);

  const [selectedVariable, setSelectedVariable] = React.useState(mergedVariables[0]);
  const [isDragging, startDragging, stopDragging] = useEnableDisable(false);

  const selectedVariableType = React.useMemo(() => {
    if (localVariables.includes(selectedVariable)) {
      return VariableType.LOCAL;
    }

    if (globalVariables.includes(selectedVariable)) {
      return VariableType.GLOBAL;
    }

    return VariableType.BUILT_IN;
  }, [selectedVariable]);

  const scrollbarsRef = React.useRef<Scrollbars>(null);

  const getItemKey = React.useCallback((item: string) => item, []);
  const getItemLabel = React.useCallback((item: string) => item, []);

  const onDeleteGlobal = React.useCallback(
    (index: string | number, { item }: { item: string }) => {
      removeGlobalVariable(item);

      if (selectedVariable === item) {
        setSelectedVariable(mergedVariables[index === 0 ? 1 : 0]);
      }
    },
    [removeGlobalVariable, mergedVariables, selectedVariable]
  );

  const onDeleteLocal = React.useCallback(
    (index: string | number, { item }: { item: string }) => {
      removeLocalVariable(item);

      if (selectedVariable === item) {
        setSelectedVariable(mergedVariables[index === 0 ? 1 : 0]);
      }
    },
    [removeLocalVariable, mergedVariables, selectedVariable]
  );

  const onDeleteFromManager = React.useCallback(
    (variable: string) => {
      if (selectedVariableType === VariableType.LOCAL) {
        onDeleteLocal(localVariables.indexOf(variable), { item: variable });
      } else if (selectedVariableType === VariableType.GLOBAL) {
        onDeleteGlobal(globalVariables.indexOf(variable), { item: variable });
      }
    },
    [onDeleteLocal, onDeleteGlobal, localVariables, globalVariables, selectedVariableType]
  );

  const onFilter = React.useCallback(
    (_, items: string[]) => {
      if (!items.some((variable) => variable === selectedVariable)) {
        setSelectedVariable(items[0]);
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
        <DraggableList
          type="global-variables"
          onDrop={stopDragging}
          onDelete={onDeleteGlobal}
          onReorder={onReorderGlobalVariables}
          itemProps={{ addToIndex: localVariables.length, withoutHover: isDragging, selectedVariable, onSelectVariable: setSelectedVariable }}
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
              itemProps={{ withoutHover: isDragging, selectedVariable, onSelectVariable: setSelectedVariable, isLocal: true }}
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
                  renderItem={(item, index) =>
                    // eslint-disable-next-line no-nested-ternary
                    index < localVariables.length ? (
                      renderLocalVariable({ key: item, itemKey: item, item, index })
                    ) : index < mergedVariables.length - GLOBAL_VARIABLES.length ? (
                      renderGlobalItem({ key: item, itemKey: item, item, index: index - localVariables.length })
                    ) : (
                      <DraggableItem key={item} item={item} isBuiltIn selectedVariable={selectedVariable} onSelectVariable={setSelectedVariable} />
                    )
                  }
                  placeholder="Search Variables"
                />
              )}
            </DraggableList>
          )}
        </DraggableList>
      </LeftColumn>

      <RightColumn withTopPadding>
        <Manager
          variable={selectedVariable}
          description={VARIABLE_DESCRIPTION[selectedVariable]}
          isBuiltIn={selectedVariableType === VariableType.BUILT_IN}
          removeVariable={onDeleteFromManager}
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
  { diagramID }: { diagramID: string },
  {
    removeVariableFromDiagram,
    replaceVariableSetDiagram,
  }: {
    removeVariableFromDiagram: typeof VariableSet.removeVariableFromDiagram;
    replaceVariableSetDiagram: typeof VariableSet.replaceVariableSetDiagram;
  }
) => ({
  removeLocalVariable: (variable: string) => removeVariableFromDiagram(diagramID, variable),
  replaceLocalVariables: (variables: string[]) => replaceVariableSetDiagram(diagramID, variables),
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(VariablesManager);
