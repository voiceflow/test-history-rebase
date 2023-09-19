import { Box, Button, FlexCenter, Input, Link, Modal, System, Text, UploadV2 } from '@voiceflow/ui';
import { toast } from '@voiceflow/ui-next';
import React from 'react';

import { CSV_UNCLASSIFIED_IMPORT } from '@/config/documentation';
import * as NLUDuck from '@/ducks/nlu';
import { useDispatch, useHotkeyList, useSelector } from '@/hooks';
import { Hotkey } from '@/keymap';
import * as T from '@/ModalsV2/types';
import { useNLUManager } from '@/pages/NLUManager/context';

import { ImportType } from '../constants';
import { CSVFile, IntentUnclassifiedData, ModalsState } from '../types';
import TabButton from './TabButton';
import UnclassifedDataSourceSettings from './UnclassifiedDataSourceSettings';

interface ImportUnclassifiedDataProps extends T.VoidInternalProps {
  onChangeModalTab: (tab: ImportType) => void;
  tabState: ModalsState;
  setTabState: (state: ModalsState) => void;
}

const ImportUnclassifiedData: React.FC<ImportUnclassifiedDataProps> = ({ api, tabState, setTabState, closePrevented, onChangeModalTab }) => {
  const unclassifiedTabState = tabState[ImportType.UNCLASSIFIED] as IntentUnclassifiedData;
  const [name, setName] = React.useState('');
  const [importedFile, setImportedFileState] = React.useState<CSVFile | null>(unclassifiedTabState.file || null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const importUnclassifiedData = useDispatch(NLUDuck.importUnclassifiedData);
  const dataSourceNames = useSelector(NLUDuck.dataSourceNamesSelector);
  const [isImporting, setIsImporting] = React.useState(false);
  const [openDataSource, setOpenDataSource] = React.useState(false);
  const nluManager = useNLUManager();

  const setImportedFile = (file: CSVFile | null) => {
    setTabState({ ...tabState, [ImportType.UNCLASSIFIED]: { ...tabState[ImportType.UNCLASSIFIED], file } });
    setImportedFileState(file);
  };

  const importedUtterances = React.useMemo(() => {
    if (!importedFile) return [];
    return importedFile.data;
  }, [importedFile]);

  const onFileUpload = (file: CSVFile) => {
    if (!file) {
      setImportedFile(file);
      return;
    }

    if (file.data.length === 0) {
      toast.error('Unable to recognize data. Please edit file format and try again.');
      return;
    }

    setImportedFile(file);
  };

  const changeDataSourceName = (name: string) => {
    if (name) {
      setErrorMessage(null);
    }

    setName(name);
  };

  const onImport = async () => {
    if (!name) {
      setErrorMessage('Name is required');
      return;
    }

    if (dataSourceNames.includes(name)) {
      toast.error('Data source name already in use, use a different name');
      return;
    }

    setIsImporting(true);

    try {
      api.preventClose();

      await importUnclassifiedData(name, importedUtterances);

      toast.success('Data source successfully added.');

      api.enableClose();
      api.close();
    } catch {
      toast.error('Something went wrong, please contact support if this issue persists.');
      api.enableClose();
    } finally {
      setIsImporting(false);
    }
  };

  const onSettingClick = () => {
    setOpenDataSource(true);
  };

  useHotkeyList([
    { hotkey: Hotkey.SUBMIT, callback: onImport, preventDefault: true },
    { hotkey: Hotkey.NLU_TABLE_ESC, callback: api.close, preventDefault: true },
  ]);

  return (
    <>
      {openDataSource ? (
        <UnclassifedDataSourceSettings onClose={() => api.close()} onBack={() => setOpenDataSource(false)} closePrevented={closePrevented} />
      ) : (
        <>
          <Modal.Header
            border
            actions={
              <System.IconButtonsGroup.Base>
                <System.IconButton.Base icon="systemSettings" onClick={onSettingClick} disabled={!nluManager.unclassifiedUtterances.length} />
              </System.IconButtonsGroup.Base>
            }
            style={{ padding: '12px 32px 12px 16px' }}
          >
            <FlexCenter>
              <Box mr={2}>
                <TabButton onClick={() => onChangeModalTab(ImportType.INTENT)} active>
                  Intents
                </TabButton>
              </Box>

              <TabButton>Unclassified</TabButton>
            </FlexCenter>
          </Modal.Header>

          <Modal.Body>
            <Box mt={25}>
              <Input
                error={!!errorMessage}
                value={name}
                readOnly={closePrevented}
                placeholder="Name data source"
                onChangeText={changeDataSourceName}
                onEnterPress={onImport}
              />

              {errorMessage && <div style={{ color: '#BD425F', fontSize: 13, marginTop: '11px' }}>{errorMessage}</div>}

              <Box mt={20} mb={12}>
                <UploadV2.CSV value={importedFile?.fileName} onReadFile={onFileUpload} onRemove={() => setImportedFile(null)} />
              </Box>

              {importedUtterances.length === 0 ? (
                <Text color="#62778C" fontSize={13}>
                  CSV should contain one utterance per row. <Link href={CSV_UNCLASSIFIED_IMPORT}>Learn more</Link>
                </Text>
              ) : (
                <Text color="#62778C" fontSize={13}>
                  {importedUtterances.length} unclassified utterances recognized.
                </Text>
              )}
            </Box>
          </Modal.Body>

          <Modal.Footer gap={12}>
            <Button onClick={() => api.close()} variant={Button.Variant.TERTIARY} disabled={closePrevented} squareRadius>
              Cancel
            </Button>

            <Button
              onClick={onImport}
              disabled={isImporting || importedUtterances.length === 0 || closePrevented}
              squareRadius
              isLoading={isImporting}
              style={isImporting ? { width: '92px' } : {}}
            >
              Import
            </Button>
          </Modal.Footer>
        </>
      )}
    </>
  );
};

export default ImportUnclassifiedData;
