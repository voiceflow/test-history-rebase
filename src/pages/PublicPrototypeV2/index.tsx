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
  match,
  setActiveSkill,
  initializePrototype,
}) => {
  const [loaded, toggleLoaded] = useToggle(false);
  const [name, setName] = React.useState('');

  useSetup(async () => {
    const prototype = await client.api.version.getPrototype(match.params.versionID);

    if (!prototype) {
      toast.error('Prototype is not Shared!');

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

    initializePrototype({ intents, slots });

    setName(prototype.settings.name as string);
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
