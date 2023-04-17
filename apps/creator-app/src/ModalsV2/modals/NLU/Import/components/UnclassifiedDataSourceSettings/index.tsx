import { BlockText, Box, Button, FlexCenter, Input, Modal, System, Text } from '@voiceflow/ui';
import React from 'react';

import { useNLUManager } from '@/pages/NLUManager/context';

import DataSourceOptions from '../DataSourceOptions';
import * as S from './styles';

interface DataSetProps {
  onBack: VoidFunction;
  onClose: VoidFunction;
  closePrevented: boolean;
}

const UnclassifedDataSourceSettings: React.FC<DataSetProps> = ({ closePrevented, onBack, onClose }) => {
  const { unclassifiedUtterances } = useNLUManager();

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

  const allDatasources = Object.values(dataSource);

  React.useEffect(() => {
    if (allDatasources.length === 0) {
      onClose();
    }
  }, [allDatasources]);

  return (
    <>
      <Modal.Header actions={<Modal.Header.CloseButtonAction onClick={onClose} hoverBackground={false} activeBackground={false} />}>
        <FlexCenter>
          <System.IconButtonsGroup.Base>
            <System.IconButton.Base icon="largeArrowLeft" onClick={onBack} hoverBackground={false} activeBackground={false} />
          </System.IconButtonsGroup.Base>
          <Text ml={23}>Manage Unclassified</Text>
        </FlexCenter>
      </Modal.Header>

      <Modal.Body>
        <Box mt={4}>
          {unclassifiedUtterances.length ? (
            allDatasources.map(({ dataSourceID, dataSourceName, utterances }) => (
              <S.UtteranceItem key={dataSourceID}>
                <Input value={dataSourceName} readOnly />
                <DataSourceOptions items={utterances} dataSourceID={dataSourceID} dataSourceName={dataSourceName} />
              </S.UtteranceItem>
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

        <Button onClick={onBack} disabled={closePrevented} squareRadius style={{ width: '91px' }}>
          Import
        </Button>
      </Modal.Footer>
    </>
  );
};

export default UnclassifedDataSourceSettings;
