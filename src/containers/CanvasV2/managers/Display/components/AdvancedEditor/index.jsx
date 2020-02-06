import React from 'react';

import AceEditor from '@/components/AceEditor';
import { SectionToggleVariant } from '@/componentsV2/Section';
import ClickableText from '@/componentsV2/Text/ClickableText';
import JsonUpload from '@/componentsV2/Upload/JsonUpload';
import { APL_TOOL_LINK } from '@/constants';
import { FormControl } from '@/containers/CanvasV2/components/Editor';
import EditorSection from '@/containers/CanvasV2/components/EditorSection';
import { handleJSONFileRead } from '@/utils/files';

function AdvancedEditor({ jsonFileName, createDisplay, updateDisplay, skillID, displayID, onChange, aplCommands = '' }) {
  const removeFile = () => {
    onChange({ jsonFileName: null, displayID: null, datasource: null });
  };

  const customOnDropAccept = async (acceptedFiles) => {
    // eslint-disable-next-line compat/compat
    const fileReader = new FileReader();

    const onFinishedReading = async (parsedData, fileName) => {
      const document = parsedData.document;
      const datasource = parsedData.datasources;

      const documentString = JSON.stringify(document, null, '\t');
      const datasourceString = JSON.stringify(datasource, null, '\t');

      const payload = { document: documentString, datasource: datasourceString, title: fileName };
      if (displayID) {
        await updateDisplay(skillID, displayID, payload);
        onChange({ jsonFileName: fileName, datasource: datasourceString });
      } else {
        const displayID = await createDisplay(skillID, payload);
        onChange({ displayID, jsonFileName: fileName, datasource: datasourceString });
      }
    };

    fileReader.onloadend = (data) => {
      handleJSONFileRead(acceptedFiles[0], data.target, ['document', 'datasources'], onFinishedReading);
    };

    fileReader.readAsText(acceptedFiles[0]);
  };

  return (
    <>
      <EditorSection isDividerNested>
        <FormControl label="JSON File" contentBottomUnits={0}>
          <JsonUpload customOnDropAccept={customOnDropAccept} file={jsonFileName} onRemove={removeFile} />
          <ClickableText link={APL_TOOL_LINK}>Authoring Tool</ClickableText>
        </FormControl>
      </EditorSection>
      <EditorSection header="APL Commands" isDividerNested headerToggle collapseVariant={SectionToggleVariant.ARROW}>
        <FormControl>
          <AceEditor
            name="apl_commands_editor"
            mode="json"
            onChange={(aplCommands) => onChange({ aplCommands })}
            fontSize={14}
            showPrintMargin={false}
            showGutter
            highlightActiveLine
            value={aplCommands}
            setOptions={{
              tabSize: 2,
            }}
          />
        </FormControl>
      </EditorSection>
    </>
  );
}

export default AdvancedEditor;
