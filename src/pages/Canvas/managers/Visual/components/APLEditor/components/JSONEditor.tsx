import React from 'react';

import AceEditor from '@/components/AceEditor';
import { SectionToggleVariant, SectionVariant } from '@/components/Section';
import SvgIcon, { IconVariant } from '@/components/SvgIcon';
import { Link } from '@/components/Text';
import { toast } from '@/components/Toast';
import JsonUpload from '@/components/Upload/JsonUpload';
import { APL_TOOL_LINK } from '@/constants';
import { FormControl } from '@/pages/Canvas/components/Editor';
import EditorSection from '@/pages/Canvas/components/EditorSection';
import { DataTypes, download } from '@/utils/dom';
import { handleJSONFileRead } from '@/utils/files';

const AnyJsonUpload = JsonUpload as any;

type JSONEditorProps = {
  onChange: (data: { datasource?: string; aplCommands?: string; jsonFileName?: string; document?: string }) => void;
  datasource?: string;
  aplCommands?: string;
  jsonFileName: string;
  document?: string;
};

const JSONEditor: React.FC<JSONEditorProps> = ({ onChange, datasource = '', aplCommands = '', jsonFileName, document: documentData = '' }) => {
  const [localDatasource, setLocalDatasource] = React.useState(datasource);
  const [localAPL, setLocalAPL] = React.useState(aplCommands);

  const removeFile = () => {
    onChange({ document: '', datasource: '', jsonFileName: '' });
  };

  const customOnDropAccept = async (acceptedFiles: File[]) => {
    const fileReader = new FileReader();

    fileReader.onloadend = (event) => {
      try {
        const { data, fileName } = handleJSONFileRead<{ document?: object; datasources?: object }>(acceptedFiles[0], event.target!, [
          'document',
          'datasources',
        ]);

        const documentString = JSON.stringify(data.document, null, '\t');
        const datasourceString = JSON.stringify(data.datasources, null, '\t');

        onChange({ jsonFileName: fileName, datasource: datasourceString, document: documentString });
      } catch {
        toast.error('Invalid JSON Format');
      }
    };

    fileReader.readAsText(acceptedFiles[0]);
  };

  const downloadAPL = () => {
    try {
      const document = JSON.parse(documentData);
      const datasources = JSON.parse(datasource);

      download(`${jsonFileName || 'apl'}.json`, JSON.stringify({ document, datasources }, null, '\t'), DataTypes.JSON);
    } catch (err) {
      toast.error('Invalid JSON Format');
    }
  };

  return (
    <>
      <EditorSection
        header="JSON File"
        suffix={documentData && datasource && <SvgIcon variant={IconVariant.STANDARD} icon="downloads" onClick={downloadAPL} size={14} />}
        variant={SectionVariant.TERTIARY}
        isDividerNested
        customContentStyling={{ paddingBottom: '20px' }}
      >
        <AnyJsonUpload customOnDropAccept={customOnDropAccept} file={jsonFileName} onRemove={removeFile} />
        <Link href={APL_TOOL_LINK}>Authoring Tool</Link>
      </EditorSection>

      {jsonFileName && (
        <>
          <EditorSection header="Datasource" namespace={['datasource']} isDividerNested headerToggle collapseVariant={SectionToggleVariant.ARROW}>
            <FormControl>
              <AceEditor
                name="datasourceEditor"
                mode="json"
                value={localDatasource}
                onChange={(value) => setLocalDatasource(value)}
                onBlur={() => onChange({ datasource: localDatasource })}
                fontSize={14}
                showGutter
                setOptions={{ tabSize: 2 }}
                showPrintMargin={false}
                highlightActiveLine
              />
            </FormControl>
          </EditorSection>

          <EditorSection header="APL Commands" namespace={['aplCommand']} isDividerNested headerToggle collapseVariant={SectionToggleVariant.ARROW}>
            <FormControl>
              <AceEditor
                name="aplCommandEditor"
                mode="json"
                value={localAPL}
                onChange={(value) => setLocalAPL(value)}
                onBlur={() => onChange({ aplCommands: localAPL })}
                fontSize={14}
                showGutter
                setOptions={{ tabSize: 2 }}
                showPrintMargin={false}
                highlightActiveLine
              />
            </FormControl>
          </EditorSection>
        </>
      )}
    </>
  );
};

export default JSONEditor;
