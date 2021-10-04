import { Diagram as DiagramType } from '@voiceflow/realtime-sdk';
import { Alert, AlertVariant, Select } from '@voiceflow/ui';
import React from 'react';

import { DIAGRAM_ID_SEPARATOR, ROOT_DIAGRAM_NAME } from '@/constants';
import * as Diagram from '@/ducks/diagram';
import * as Router from '@/ducks/router';
import { connect } from '@/hocs';
import { NodeData } from '@/models';
import { NodeDataUpdater } from '@/pages/Canvas/types';
import { ConnectedProps } from '@/types';

interface ComponentProps {
  enterOnCreate?: boolean;
  onChange: NodeDataUpdater<NodeData.Component>;
  diagram: DiagramType | null;
  diagramID: string | null;
}

const generateDiagramValue = (data: Pick<DiagramType, 'id' | 'name'>) => `${data.id}${DIAGRAM_ID_SEPARATOR}${data.name}`;

const buildOptions = (diagrams: ConnectedComponentProps['diagrams']) =>
  diagrams
    .filter((diagram) => diagram.name !== ROOT_DIAGRAM_NAME)
    .map((diagram) => ({
      value: generateDiagramValue(diagram),
      label: diagram.name,
    }));

const Component: React.FC<ComponentProps & ConnectedComponentProps> = ({
  onChange,
  diagrams,
  diagram,
  diagramID,
  goToDiagram,
  enterOnCreate = true,
  createDiagram,
  saveActiveDiagram,
}) => {
  const [value, setValue] = React.useState(diagram ? generateDiagramValue(diagram) : null);
  const options = React.useMemo(() => buildOptions(diagrams), [diagrams]);
  const optionsMap = React.useMemo<{ [key: string]: typeof options[number] }>(
    () => options.reduce((obj, option) => Object.assign(obj, { [option.value]: option }), {}),
    [options]
  );
  const setSelectedDiagram = React.useCallback((diagramID: string) => onChange({ diagramID, inputs: [], outputs: [] }), [onChange]);

  const componentDoesNotExist = diagramID && !diagram;

  const setComponent = React.useCallback(
    (selected) => {
      const diagramID = selected?.substring(0, selected.indexOf(DIAGRAM_ID_SEPARATOR));
      setSelectedDiagram(diagramID);
      setValue(selected);
    },
    [setSelectedDiagram]
  );

  const onCreate = React.useCallback(
    async (name: string) => {
      await saveActiveDiagram();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const newDiagramID = await createDiagram(name);

      setValue(generateDiagramValue({ id: newDiagramID, name }));
      setSelectedDiagram(newDiagramID);
      if (enterOnCreate) {
        goToDiagram(newDiagramID);
      }
    },
    [options, setSelectedDiagram, goToDiagram, createDiagram, saveActiveDiagram, enterOnCreate]
  );

  const validateCreate = (name: string) => {
    options.forEach((component) => {
      if (component.label.toLowerCase() === name.toLowerCase()) throw new Error('Component name already in use, choose a different name.');
    });

    return true;
  };

  return (
    <>
      <Select
        value={value}
        options={options}
        onSelect={setComponent}
        onCreate={onCreate}
        creatable
        searchable
        validateCreate={validateCreate}
        clearable={Boolean(value)}
        getOptionValue={(option) => option?.value}
        getOptionLabel={(optionValue) => optionValue && optionsMap[optionValue]?.label}
        placeholder="Create new component or select existing"
        createInputPlaceholder="New Component Name"
      />
      {componentDoesNotExist && (
        <Alert variant={AlertVariant.WARNING} mt={10}>
          Previously selected Component is broken or has been deleted.
        </Alert>
      )}
    </>
  );
};

const mapStateToProps = {
  diagrams: Diagram.allDiagramsSelector,
};

const mapDispatchToProps = {
  createDiagram: Diagram.createDiagram,
  saveActiveDiagram: Diagram.saveActiveDiagram,
  goToDiagram: Router.goToDiagramHistoryPush,
};

type ConnectedComponentProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;
export default connect(mapStateToProps, mapDispatchToProps)(Component) as React.FC<ComponentProps>;
