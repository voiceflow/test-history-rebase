import { Box, SectionV2, UploadV2 } from '@voiceflow/ui';
import React from 'react';

import AceEditor from '@/components/AceEditor';
import { FormControl } from '@/pages/Canvas/components/Editor';
import EditorV2 from '@/pages/Canvas/components/EditorV2';

import * as S from './styles';

interface JSONEditorProps {
  onChange: (data: { datasource?: string; aplCommands?: string; jsonFileName?: string; document?: string }) => void;
  document?: string;
  datasource?: string;
  aplCommands?: string;
  jsonFileName: string;
}

interface JSONFile {
  data: {
    document?: object | undefined;
    datasources?: object | undefined;
  };
  fileName: string;
}

const stringify = (property: object | undefined): string => JSON.stringify(property, null, '\t');

const JSONEditor: React.FC<JSONEditorProps> = ({ onChange, datasource = '', aplCommands = '', jsonFileName }) => {
  const [localDatasource, setLocalDatasource] = React.useState(datasource);
  const [localAPL, setLocalAPL] = React.useState(aplCommands);

  const onUploadJSON = (file: JSONFile) => {
    onChange({
      jsonFileName: file.fileName,
      datasource: stringify(file.data.datasources),
      document: stringify(file.data.document),
    });
    setLocalDatasource(stringify(file.data.datasources));
  };

  const removeFile = () => onChange({ document: '', datasource: '', jsonFileName: '' });

  return (
    <>
      <Box bg="#fdfdfd">
        <SectionV2.Content>
          <FormControl>
            <UploadV2.JSON onlyUpload onChange={onUploadJSON} onClose={removeFile} value={jsonFileName} />
          </FormControl>
        </SectionV2.Content>
      </Box>

      {jsonFileName && (
        <>
          <SectionV2.Divider />
          <EditorV2.PersistCollapse>
            {({ collapsed, onToggle }) => (
              <S.CollapseSection
                header={
                  <SectionV2.Header>
                    <SectionV2.Title bold={!collapsed}>Datasource</SectionV2.Title>
                    <SectionV2.CollapseArrowIcon collapsed={collapsed} />
                  </SectionV2.Header>
                }
                onToggle={onToggle}
                collapsed={collapsed}
                containerToggle
              >
                <S.EditorWrapper height={246}>
                  <AceEditor
                    onBlur={() => onChange({ datasource: localDatasource })}
                    onChange={(value) => setLocalDatasource(value)}
                    value={localDatasource}
                    placeholder="Enter JSON"
                    name="datasourceEditor"
                    mode="json"
                    scrollMargin={[12, 0, 0, 0]}
                    setOptions={{ tabSize: 2 }}
                    showPrintMargin={false}
                    maxLines={13}
                    fontSize={14}
                    highlightActiveLine
                    hideIndentGuide
                    hideFoldWidgets
                    editorSpacing
                    fullHeight
                  />
                </S.EditorWrapper>
              </S.CollapseSection>
            )}
          </EditorV2.PersistCollapse>
          <SectionV2.Divider />
          <EditorV2.PersistCollapse>
            {({ collapsed, onToggle }) => (
              <S.CollapseSection
                header={
                  <SectionV2.Header>
                    <SectionV2.Title bold={!collapsed}>APL Commands</SectionV2.Title>
                    <SectionV2.CollapseArrowIcon collapsed={collapsed} />
                  </SectionV2.Header>
                }
                onToggle={onToggle}
                collapsed={collapsed}
                containerToggle
              >
                <S.EditorWrapper height={156}>
                  <AceEditor
                    onChange={(value) => setLocalAPL(value)}
                    onBlur={() => onChange({ aplCommands: localAPL })}
                    placeholder="Enter JSON"
                    name="aplCommandEditor"
                    mode="json"
                    setOptions={{ tabSize: 2 }}
                    scrollMargin={[12, 0, 0, 0]}
                    showPrintMargin={false}
                    value={localAPL}
                    fontSize={14}
                    maxLines={8}
                    highlightActiveLine
                    hideIndentGuide
                    hideFoldWidgets
                    editorSpacing
                    fullHeight
                  />
                </S.EditorWrapper>
              </S.CollapseSection>
            )}
          </EditorV2.PersistCollapse>
        </>
      )}
    </>
  );
};

export default JSONEditor;
