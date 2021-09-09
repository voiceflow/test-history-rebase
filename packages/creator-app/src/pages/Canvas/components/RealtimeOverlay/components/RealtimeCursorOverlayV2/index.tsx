import { Subscribe } from '@react-rxjs/core';
import React from 'react';

import * as Account from '@/ducks/account';
import * as DiagramV2 from '@/ducks/diagramV2';
import * as Session from '@/ducks/session';
import { useSelector } from '@/hooks';
import { cursorCoords$ } from '@/store/observables';

import { RealtimeCursor } from './components';

const RealtimeCursorOverlay: React.FC = () => {
  const userID = useSelector(Account.userIDSelector);
  const diagramID = useSelector(Session.activeDiagramIDSelector)!;
  const viewers = useSelector((state) => DiagramV2.diagramViewersByIDSelector(state, { id: diagramID }));

  return (
    <>
      {viewers.map((viewer) => {
        if (userID === viewer.creatorID) return null;

        const source$ = cursorCoords$({ diagramID, creatorID: viewer.creatorID });

        return (
          <Subscribe key={viewer.creatorID} source$={source$}>
            <RealtimeCursor source$={source$} diagramID={diagramID} creatorID={viewer.creatorID} name={viewer.name} color={viewer.color} />
          </Subscribe>
        );
      })}
    </>
  );
};

export default RealtimeCursorOverlay;
