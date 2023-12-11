import * as Realtime from '@voiceflow/realtime-sdk';
import { Button, Modal } from '@voiceflow/ui';
import React from 'react';

import { useHotkey } from '@/hooks/hotkeys';
import { Hotkey } from '@/keymap';
import manager from '@/ModalsV2/manager';
import * as T from '@/ModalsV2/types';
import { NLUManagerProvider, useNLUManager } from '@/pages/NLUManager/context';

import UtteranceInput from './components/UtteranceInput';
import * as S from './styles';

export interface ManageClusterProps {
  title?: string;
  utteranceIDs: string[];
}

const ModalComponent: React.FC<T.VoidInternalProps<ManageClusterProps>> = ({ title, utteranceIDs, opened, type, hidden, animated, api }) => {
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

  useHotkey(Hotkey.MODAL_CLOSE, api.onClose);

  React.useEffect(() => {
    if (utterances.length === 0) {
      api.close();
    }
  }, [utterances]);

  return (
    <Modal type={type} maxWidth={450} opened={opened} hidden={hidden} animated={animated} onExited={api.remove} hideScrollbar>
      <Modal.Header border actions={<Modal.Header.CloseButtonAction onClick={api.onClose} hoverBackground={false} activeBackground={false} />}>
        {title || 'Cluster Data'} ({utteranceIDs.length})
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

      <Modal.Footer sticky>
        <Button onClick={api.close} squareRadius>
          Done
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const ManageClusterData = manager.create<ManageClusterProps>('NLUUnclassifiedManageClusterData', () => (props) => (
  <NLUManagerProvider>
    <ModalComponent {...props} />
  </NLUManagerProvider>
));

export default ManageClusterData;
