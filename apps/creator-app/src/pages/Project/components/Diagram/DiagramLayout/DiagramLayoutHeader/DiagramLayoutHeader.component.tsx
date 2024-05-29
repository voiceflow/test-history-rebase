import { Header } from '@voiceflow/ui-next';
import React from 'react';
import { useRouteMatch } from 'react-router-dom';

import { Path } from '@/config/routes';
import { Permission } from '@/constants/permissions';
import { Creator, UI } from '@/ducks';
import { useHotkey } from '@/hooks/hotkeys';
import { usePermission } from '@/hooks/permission';
import { useSelector } from '@/hooks/store.hook';
import { Hotkey } from '@/keymap';
import StartPrototypeButton from '@/pages/Project/components/Header/components/CanvasHeader/components/Run';
import PublishButton from '@/pages/Project/components/Header/components/CanvasHeader/components/Upload';
import SharePrototypeButton from '@/pages/Project/components/Header/components/PrototypeHeader/components/Share';
import { SelectionTargetsContext } from '@/pages/Project/contexts';
import { useDisableModes } from '@/pages/Project/hooks';

import { headerStyle } from './DiagramLayoutHeader.css';
import { DiagramLayoutHeaderActions } from './DiagramLayoutHeaderActions.component';
import { DiagramLayoutHeaderBack } from './DiagramLayoutHeaderBack.component';
import { DiagramLayoutHeaderMembers } from './DiagramLayoutHeaderMembers.component';
import { DiagramLayoutHeaderPrototypeSettings } from './DiagramLayoutHeaderPrototypeSettings.component copy';
import { DiagramLayoutHeaderTitle } from './DiagramLayoutHeaderTitle.component';

export const DiagramLayoutHeader: React.FC = () => {
  const isPrototype = !!useRouteMatch(Path.PROJECT_PROTOTYPE);

  const [canEditCanvas] = usePermission(Permission.CANVAS_EDIT);
  const selectedTargets = React.useContext(SelectionTargetsContext);

  const canvasOnly = useSelector(UI.selectors.isCanvasOnly);
  const startNodeID = useSelector(Creator.startNodeIDSelector);

  const onDisableModes = useDisableModes();

  useHotkey(Hotkey.CLOSE_CANVAS_MODE, onDisableModes, { disable: !isPrototype, preventDefault: true });

  const showActions =
    canEditCanvas &&
    (selectedTargets.length > 1 || (selectedTargets.length === 1 && selectedTargets[0] !== startNodeID));

  return (
    <Header className={headerStyle({ canvasOnly })}>
      <Header.Section.Left minWidth={262}>
        <DiagramLayoutHeaderBack isPrototype={isPrototype} />
      </Header.Section.Left>

      <Header.Section.Center>
        {showActions ? <DiagramLayoutHeaderActions /> : <DiagramLayoutHeaderTitle />}
      </Header.Section.Center>

      <Header.Section.Right>
        <DiagramLayoutHeaderMembers />

        <Header.Section.RightActions>
          {isPrototype ? (
            <>
              <DiagramLayoutHeaderPrototypeSettings />

              <SharePrototypeButton />
            </>
          ) : (
            <>
              {canEditCanvas && <PublishButton />}

              <StartPrototypeButton />
            </>
          )}
        </Header.Section.RightActions>
      </Header.Section.Right>
    </Header>
  );
};
