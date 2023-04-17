import { stopPropagation, System, useSessionStorageState } from '@voiceflow/ui';
import React from 'react';

import * as Documentation from '@/config/documentation';
import * as CreatorV2 from '@/ducks/creatorV2';
import { useSelector } from '@/hooks/redux';

const WARNING_LIMIT = 100;

const ToManyBlocksSnackbar: React.FC = () => {
  const [shown, setShown] = useSessionStorageState('too-many-blocks-snackbar', false);

  const blockIDs = useSelector(CreatorV2.blockIDsSelector);

  if (shown || blockIDs.length <= WARNING_LIMIT) return null;

  return (
    <System.Snackbar.Base>
      <System.Snackbar.Icon icon="info" />

      <System.Snackbar.Text>
        Diagram has over {WARNING_LIMIT} blocks, try{' '}
        <System.Link.Anchor href={Documentation.DOMAINS} color={System.Link.Color.DARK}>
          organizing with topics
        </System.Link.Anchor>
      </System.Snackbar.Text>

      <System.Snackbar.CloseButton onClick={stopPropagation(() => setShown(true))} />
    </System.Snackbar.Base>
  );
};

export default React.memo(ToManyBlocksSnackbar);
