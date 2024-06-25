import { Utils } from '@voiceflow/common';
import { stopPropagation, System } from '@voiceflow/ui';
import React from 'react';

import { useSessionStorageState } from '@/hooks/storage.hook';
import { EngineContext } from '@/pages/Canvas/contexts';

export interface EmptyViewportSnackbarRef {
  show: VoidFunction;
  hide: VoidFunction;
}

const EmptyViewportSnackbar: React.FC = () => {
  const engine = React.useContext(EngineContext)!;

  const snackbarAPI = System.Snackbar.useAPI();
  const [shown, setShown] = useSessionStorageState('empty-viewport-snackbar', false);

  React.useEffect(
    () =>
      engine.intersection.register('emptyViewportSnackbar', {
        show: () => !shown && snackbarAPI.open(),
        hide: () => snackbarAPI.close(),
      }),
    [shown]
  );

  if (!snackbarAPI.isOpen) return null;

  return (
    <System.Snackbar.Base>
      <System.Snackbar.Icon icon="info" />

      <System.Snackbar.Text>Can't find your blocks? Press 'S' to return</System.Snackbar.Text>

      <System.Snackbar.CloseButton
        onClick={stopPropagation(Utils.functional.chain(snackbarAPI.close, () => setShown(true)))}
      />
    </System.Snackbar.Base>
  );
};

export default React.memo(EmptyViewportSnackbar);
