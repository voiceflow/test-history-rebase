import { Utils } from '@voiceflow/common';
import { Snackbar, stopPropagation, useSessionStorageState } from '@voiceflow/ui';
import React from 'react';

import { EngineContext } from '@/pages/Canvas/contexts';

export interface EmptyViewportSnackbarRef {
  show: VoidFunction;
  hide: VoidFunction;
}

const EmptyViewportSnackbar: React.FC = () => {
  const engine = React.useContext(EngineContext)!;

  const snackbar = Snackbar.useSnackbar();
  const [shown, setShown] = useSessionStorageState('empty-viewport-snackbar', false);

  React.useEffect(
    () =>
      engine.intersection.register('emptyViewportSnackbar', {
        show: () => !shown && snackbar.open(),
        hide: () => snackbar.close(),
      }),
    [shown]
  );

  if (!snackbar.isOpen) return null;

  return (
    <Snackbar>
      <Snackbar.ClickableBody onClick={() => engine.focusHome()}>
        <Snackbar.Icon icon="info" />

        <Snackbar.Text>Can't find your blocks? Press 'S' to return</Snackbar.Text>
      </Snackbar.ClickableBody>

      <Snackbar.DarkButton
        icon="close"
        onClick={stopPropagation(Utils.functional.chain(snackbar.close, () => setShown(false)))}
        iconProps={{ size: 14 }}
      />
    </Snackbar>
  );
};

export default EmptyViewportSnackbar;
