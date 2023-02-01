import * as Realtime from '@voiceflow/realtime-sdk';
import { Button, Modal } from '@voiceflow/ui';
import React from 'react';

import manager from '@/ModalsV2/manager';
import * as T from '@/ModalsV2/types';
import { NLUManagerProvider, useNLUManager } from '@/pages/NLUManager/context';

import UtteranceInput from './components/UtteranceInput';
import * as S from './styles';

export interface ManageClusterProps {
  utteranceIDs: string[];
}

const ModalComponent: React.FC<ManageClusterProps & T.VoidInternalProps> = ({ utteranceIDs, opened, type, hidden, animated, api }) => {
  const nluManager = useNLUManager();

  const utterances = React.useMemo(
    () =>
      utteranceIDs.reduce<Realtime.NLUUnclassifiedUtterances[]>((acc, id) => {
        const utterance = nluManager.unclassifiedUtterances.find((u) => u.id === id);
        if (!utterance) return acc;
        return [...acc, utterance];
      }, []),
    [nluManager.unclassifiedUtterances]
  );

  const handleUtteranceRename = (utterance: Realtime.NLUUnclassifiedUtterances, newName: string) => {
    nluManager.updateUnclassifiedUtterances([{ ...utterance, utterance: newName }]);
  };

  const handleUtteranceDelete = (utterance: Realtime.NLUUnclassifiedUtterances) => {
    nluManager.deleteUnclassifiedUtterances([utterance]);
  };

  const handleSubmit = () => api.close();

  React.useEffect(() => {
    if (utterances.length === 0) {
      api.close();
    }
  }, [utterances]);

  return (
    <Modal type={type} maxWidth={450} opened={opened} hidden={hidden} animated={animated} onExited={api.remove} hideScrollbar>
      <Modal.Header border actions={<Modal.Header.CloseButton onClick={api.close} />}>
        Cluster Data ({utteranceIDs.length})
      </Modal.Header>

      <Modal.Body>
        <S.UtterancesList>
          {utterances.map((u) => (
            <UtteranceInput
              key={u.id}
              value={u.utterance}
              onRename={(value) => handleUtteranceRename(u, value)}
              onDelete={() => handleUtteranceDelete(u)}
            />
          ))}
        </S.UtterancesList>
      </Modal.Body>

      <Modal.Footer gap={12} sticky>
        <Button variant={Button.Variant.TERTIARY} onClick={() => api.close()} squareRadius>
          Cancel
        </Button>

        <Button onClick={handleSubmit} squareRadius>
          Done
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const ManageClusterData = manager.create<{
  utteranceIDs: string[];
}>('NLUUnclassifiedManageClusterData', () => (props) => (
  <NLUManagerProvider>
    <ModalComponent {...props} />
  </NLUManagerProvider>
));

export default ManageClusterData;
