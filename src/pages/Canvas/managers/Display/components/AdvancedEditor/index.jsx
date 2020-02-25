import React from 'react';

import AceEditor from '@/components/AceEditor';
import { SectionToggleVariant } from '@/components/Section';
import SvgIcon from '@/components/SvgIcon';
import ClickableText from '@/components/Text/ClickableText';
import { toast } from '@/components/Toast';
import JsonUpload from '@/components/Upload/JsonUpload';
import { APL_TOOL_LINK } from '@/constants';
import { FormControl } from '@/pages/Canvas/components/Editor';
import EditorSection from '@/pages/Canvas/components/EditorSection';
import { DataTypes, download } from '@/utils/dom';
import { handleJSONFileRead } from '@/utils/files';

function AdvancedEditor({ jsonFileName, createDisplay, updateDisplay, skillID, displayID, onChange, aplCommand = '', datasource = '', display }) {
  const removeFile = () => {
    onChange({ jsonFileName: null, displayID: null, datasource: null, aplCommand: null });
  };

  const customOnDropAccept = async (acceptedFiles) => {
    // eslint-disable-next-line compat/compat
    const fileReader = new FileReader();

    const onFinishedReading = async (parsedData, fileName) => {
      const document = parsedData.document;
      const datasource = parsedData.datasources;
      const commands = document.commands;

      const documentString = JSON.stringify(document, null, '\t');
      const datasourceString = JSON.stringify(datasource, null, '\t');
      const aplCommandString = JSON.stringify(commands, null, '\t');

      const payload = {
        document: documentString,
        datasource: datasourceString,
        aplCommand: aplCommandString,
        title: fileName,
      };

      if (displayID) {
        await updateDisplay(skillID, displayID, payload);
        onChange({ jsonFileName: fileName, datasource: datasourceString, aplCommand: aplCommandString });
      } else {
        const displayID = await createDisplay(skillID, payload);
        onChange({ displayID, jsonFileName: fileName, datasource: datasourceString, aplCommand: aplCommandString });
      }
    };

    fileReader.onloadend = (data) => {
      handleJSONFileRead(acceptedFiles[0], data.target, ['document', 'datasources'], onFinishedReading);
    };

    fileReader.readAsText(acceptedFiles[0]);
  };

  const downloadAPL = () => {
    try {
      const document = JSON.parse(display.document);
      const datasources = JSON.parse(display.datasource);
      download(jsonFileName, JSON.stringify({ document, datasources }, null, '\t'), DataTypes.JSON);
    } catch (err) {
      toast.error('Invalid JSON Format');
    }
  };

  return (
    <>
      <EditorSection
        variant="tertiary"
        header="JSON File"
        isDividerNested
        suffix={display && <SvgIcon variant="standard" icon="downloads" onClick={downloadAPL} size={14} />}
      >
        <JsonUpload customOnDropAccept={customOnDropAccept} file={jsonFileName} onRemove={removeFile} />
        <ClickableText link={APL_TOOL_LINK}>Authoring Tool</ClickableText>
      </EditorSection>
      {jsonFileName && (
        <>
          <EditorSection header="Datasource" namespace={['datasource']} isDividerNested headerToggle collapseVariant={SectionToggleVariant.ARROW}>
            <FormControl>
              <AceEditor
                name="datasourceEditor"
                mode="json"
                onChange={(datasource) => onChange({ datasource })}
                fontSize={14}
                showPrintMargin={false}
                showGutter
                highlightActiveLine
                value={datasource}
                setOptions={{
                  tabSize: 2,
                }}
              />
            </FormControl>
          </EditorSection>
          <EditorSection header="APL Commands" namespace={['aplCommand']} isDividerNested headerToggle collapseVariant={SectionToggleVariant.ARROW}>
            <FormControl>
              <AceEditor
                name="aplCommandEditor"
                mode="json"
                onChange={(aplCommand) => onChange({ aplCommand })}
                fontSize={14}
                showPrintMargin={false}
                showGutter
                highlightActiveLine
                value={aplCommand}
                setOptions={{
                  tabSize: 2,
                }}
              />
            </FormControl>
          </EditorSection>
        </>
      )}
    </>
  );
}

export default AdvancedEditor;
