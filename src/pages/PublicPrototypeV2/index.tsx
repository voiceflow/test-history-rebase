import _ from 'lodash';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import client from '@/client';
import { RemoveIntercom } from '@/components/IntercomChat';
import MadeInVoiceflow from '@/components/MadeInVoiceflow';
import { FullSpinner } from '@/components/Spinner';
import { toast } from '@/components/Toast';
import * as Prototype from '@/ducks/prototype';
import * as Skill from '@/ducks/skill';
import { connect } from '@/hocs';
import { useSetup, useToggle } from '@/hooks';
import PrototypePage from '@/pages/Prototype';
import { ConnectedProps } from '@/types';

import { Container, Header } from './components';

const PublicPrototype: React.FC<ConnectedPublicPrototypeProps & RouteComponentProps<{ versionID: string }>> = ({
  name,
  match: {
    params: { versionID = '' },
  },
  setActiveSkill,
  updateVariables,
  initializePrototype,
}) => {
  const [loaded, toggleLoaded] = useToggle(false);

  useSetup(async () => {
    // TODO: when removing V2 FF, redirect old public prototype to this page
    const isLegacyVersion = versionID.length !== 24; // check if object ID

    const prototype = await (isLegacyVersion
      ? client.prototype.getLegacyInfo(versionID).catch(_.constant(null))
      : client.api.version.getPrototype(versionID).catch(_.constant(null)));

    if (!prototype) {
      toast.error("Prototype hasn't been shared or doesn't exist");
      return;
    }

    const { slots, intents } = prototype.model;

    setActiveSkill(
      {
        name: prototype.data.name,
        locales: prototype.data.locales,
        rootDiagramID: prototype.context.stack?.[0].programID,
      } as any,
      prototype.context.stack?.[0].programID as string
    );

    updateVariables(prototype.context.variables || {});
    initializePrototype({ intents, slots });
    toggleLoaded(true);
  });

  return !loaded ? (
    <FullSpinner name="Prototype" />
  ) : (
    <>
      <MadeInVoiceflow />
      <Header name={name} />
      <RemoveIntercom />

      <Container>
        <PrototypePage isPublic debug={false} />
      </Container>
    </>
  );
};

const mapStateToProps = {
  name: Skill.activeNameSelector,
  diagramID: Skill.activeDiagramIDSelector,
};

const mapDispatchToProps = {
  setActiveSkill: Skill.setActiveSkill,
  updateVariables: Prototype.updateVariables,
  initializePrototype: Prototype.initializePrototypeV2,
};

type ConnectedPublicPrototypeProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(PublicPrototype);
