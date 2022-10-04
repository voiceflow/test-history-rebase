import { Box, Button, Input, Modal, SvgIcon, Text, toast, UploadV2 } from '@voiceflow/ui';
import React from 'react';

import * as NLUDuck from '@/ducks/nlu';
import { useDispatch, useHotKeys, useSelector } from '@/hooks';
import { Hotkey } from '@/keymap';

import manager from '../../manager';

interface CSVFile {
  data: string[];
  fileName: string;
}

const Import = manager.create('NLUImport', () => ({ api, type, opened, hidden, animated, closePrevented }) => {
  const [name, setName] = React.useState('');
  const [importedFile, setImportedFile] = React.useState<CSVFile | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const importUnclassifiedData = useDispatch(NLUDuck.importUnclassifiedData);
  const datasourceNames = useSelector(NLUDuck.datasourceNames);

  const importedUtterances = React.useMemo(() => {
    if (!importedFile) return [];
    return importedFile.data;
  }, [importedFile]);

  const onFileUpload = (file: CSVFile) => {
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
      setErrorMessage('Data source requires a name');
      return;
    }

    if (datasourceNames.includes(name)) {
      toast.error('Data source name already in use, use a different name');
      return;
    }

    try {
      api.preventClose();

      await importUnclassifiedData(name, importedUtterances);

      toast.success('Data source successfully added.');

      api.enableClose();
      api.close();
    } catch {
      toast.error('Something went wrong, please contact support if this issue persists.');
      api.enableClose();
    }
  };

  useHotKeys(Hotkey.SUBMIT, onImport, { preventDefault: true });
  useHotKeys(Hotkey.NLU_TABLE_ESC, api.close);

  return (
    <Modal type={type} maxWidth={450} opened={opened} hidden={hidden} animated={animated} onExited={api.remove}>
      <Modal.Header actions={<SvgIcon icon="systemSettings" size={16} clickable color="#6E849A" />}>Data sources</Modal.Header>

      <Modal.Body>
        <Input
          error={!!errorMessage}
          value={name}
          readOnly={closePrevented}
          placeholder="Name data source"
          onChangeText={changeDataSourceName}
          onEnterPress={onImport}
        />

        {errorMessage && (
          <Text color="#BD425F" fontSize={13}>
            {errorMessage}
          </Text>
        )}

        <Box mt={20} mb={12}>
          <UploadV2.CSV value={importedFile?.fileName} onChange={onFileUpload} onClose={() => setImportedFile(null)} />
        </Box>

        {importedUtterances.length === 0 ? (
          <Text color="#62778C" fontSize={13}>
            CSV should contain one utterance per row.
          </Text>
        ) : (
          <Text color="#62778C" fontSize={13}>
            {importedUtterances.length} unclassified utterances recognized.
          </Text>
        )}
      </Modal.Body>

      <Modal.Footer gap={12}>
        <Button onClick={() => api.close()} variant={Button.Variant.TERTIARY} disabled={closePrevented} squareRadius>
          Cancel
        </Button>

        <Button onClick={onImport} disabled={importedUtterances.length === 0 || closePrevented} squareRadius>
          Upload
        </Button>
      </Modal.Footer>
    </Modal>
  );
});

export default Import;
