import { Header } from '@voiceflow/ui-next';
import React from 'react';

import * as ProjectV2 from '@/ducks/projectV2';
import { useSelector } from '@/hooks/store.hook';
import { getMemberColorByCreatorID, isMemberColorImage } from '@/utils/member.util';

export const CMSHeaderMembers: React.FC = () => {
  const viewers = useSelector(ProjectV2.active.allAwarenessViewersSelector);

  return (
    <Header.AvatarList
      list={viewers.map((viewer) => ({
        src: !isMemberColorImage(viewer.image) ? viewer.image : undefined,
        name: viewer.name,
        variant: getMemberColorByCreatorID(viewer.creatorID),
      }))}
      onButtonClick={() => null}
    />
  );
};
