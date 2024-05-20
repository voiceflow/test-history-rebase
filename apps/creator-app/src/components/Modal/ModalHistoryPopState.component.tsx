import { usePersistFunction } from '@voiceflow/ui-next';
import { useEffect } from 'react';

interface IModalHistoryPopState {
  onClose: VoidFunction;
}

export const ModalHistoryPopState: React.FC<IModalHistoryPopState> = ({ onClose }) => {
  const persistedOnClose = usePersistFunction(onClose);

  useEffect(() => {
    window.addEventListener('popstate', persistedOnClose);

    return () => {
      window.removeEventListener('popstate', persistedOnClose);
    };
  }, []);

  return null;
};
