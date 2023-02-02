import { BlockText, Box, Button, FlexCenter, Input, Modal, SvgIcon, Text } from '@voiceflow/ui';
import React from 'react';

import { useNLUManager } from '@/pages/NLUManager/context';

import DataSourceOptions from './DataSourceOptions';

interface DataSetProps {
  onBack: VoidFunction;
  onClose: VoidFunction;
  closePrevented: boolean;
}

const UnclassifedDataSourceSettings: React.FC<DataSetProps> = ({ closePrevented, onBack, onClose }) => {
  const { unclassifiedUtterances } = useNLUManager();
  const isUploading = false;

  const dataSource = React.useMemo(
    () =>
      unclassifiedUtterances.reduce<Record<string, { utterances: string[]; dataSourceID: string; dataSourceName: string }>>(
        (acc, { datasourceID, utterance, datasourceName }) => {
          if (!datasourceID) return acc;
          acc[datasourceID] ??= { dataSourceID: datasourceID, utterances: [], dataSourceName: datasourceName };
          acc[datasourceID].utterances.push(utterance);
          return acc;
        },
        {}
      ),
    [unclassifiedUtterances]
  );

  React.useEffect(() => {
    if (unclassifiedUtterances.length === 0) {
      onClose();
    }
  }, [unclassifiedUtterances]);

  return (
    <Box mt={10}>
      <Modal.Header
        actions={<SvgIcon icon="close" size={16} clickable color="#6E849A" onClick={onClose} />}
        style={{ paddingTop: '12px', paddingBottom: '12px' }}
      >
        <FlexCenter>
          <SvgIcon icon="largeArrowLeft" size={16} clickable color="#6E849A" onClick={onBack} />
          <Text ml={23}>Manage Unclassified</Text>
        </FlexCenter>
      </Modal.Header>

      <Modal.Body>
        <Box mt={25}>
          {unclassifiedUtterances.length ? (
            Object.values(dataSource).map(({ dataSourceID, dataSourceName, utterances }) => (
              <Box.FlexCenter key={dataSourceID} gap={20} mb={16}>
                <Input value={dataSourceName} readOnly />
                <DataSourceOptions items={utterances} dataSourceID={dataSourceID} dataSourceName={dataSourceName} />
              </Box.FlexCenter>
            ))
          ) : (
            <BlockText
              fontSize={13}
              color="#62778c"
              lineHeight="normal"
              marginTop={12}
              style={{ position: 'absolute', top: '50%', left: '50%', margin: '-50px 0 0 -73px' }}
            >
              No Data Source found
            </BlockText>
          )}
        </Box>
      </Modal.Body>
      <Modal.Footer gap={12}>
        <Button onClick={onClose} variant={Button.Variant.TERTIARY} disabled={closePrevented} squareRadius>
          Cancel
        </Button>

        <Button onClick={onBack} disabled={closePrevented || isUploading} squareRadius isLoading={isUploading} style={{ width: '91px' }}>
          Upload
        </Button>
      </Modal.Footer>
    </Box>
  );
};

export default UnclassifedDataSourceSettings;
