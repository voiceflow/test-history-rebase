import _constant from 'lodash/constant';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import client from '@/client';
import { RemoveIntercom } from '@/components/IntercomChat';
import { FullSpinner } from '@/components/Spinner';
import { toast } from '@/components/Toast';
import * as PrototypeDuck from '@/ducks/prototype';
import * as Skill from '@/ducks/skill';
import { connect } from '@/hocs';
import { useSetup, useToggle } from '@/hooks';
import { ConnectedProps } from '@/types';

import { Prototype } from './components';

const PublicPrototype: React.FC<ConnectedPublicPrototypeProps & RouteComponentProps<{ versionID: string }>> = ({ match, setActiveSkill }) => {
  const [isLoaded, toggleLoaded] = useToggle(false);
  const [layout, setLayout] = React.useState(PrototypeDuck.PrototypeLayout.TEXT_DIALOG);

  useSetup(async () => {
    const { versionID } = match.params;
    const isLegacyVersion = versionID.length !== 24; // check if object ID

    try {
      const prototype = await (isLegacyVersion
        ? client.prototype.getLegacyInfo(versionID).catch(_constant(null))
        : client.api.version.getPrototype(versionID).catch(_constant(null)));

      if (!prototype) {
        throw new Error("Prototype doesn't exist");
      }

      setActiveSkill(
        {
          id: match.params.versionID,
          name: prototype.data.name,
          locales: prototype.data.locales,
          rootDiagramID: prototype.context.stack?.[0].programID,
        } as any,
        prototype.context.stack?.[0].programID as string
      );

      setLayout((prototype?.settings?.layout as PrototypeDuck.PrototypeLayout) ?? PrototypeDuck.PrototypeLayout.TEXT_DIALOG);
    } catch {
      toast.error("Prototype hasn't been shared or doesn't exist");
    }

    toggleLoaded(true);
  });

  return isLoaded ? (
    <>
      <RemoveIntercom />

      <Prototype layout={layout} />
    </>
  ) : (
    <FullSpinner name="Prototype" />
  );
};

const mapStateToProps = {
  name: Skill.activeNameSelector,
  diagramID: Skill.activeDiagramIDSelector,
};

const mapDispatchToProps = {
  setActiveSkill: Skill.setActiveSkill,
  updateVariables: PrototypeDuck.updateVariables,
};

type ConnectedPublicPrototypeProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(PublicPrototype);
