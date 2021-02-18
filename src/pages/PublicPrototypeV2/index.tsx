import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { RemoveIntercom } from '@/components/IntercomChat';
import { FullSpinner } from '@/components/Spinner';
import { toast } from '@/components/Toast';
import * as PrototypeDuck from '@/ducks/prototype';
import { connect } from '@/hocs';
import { useSetup, useToggle } from '@/hooks';
import { ConnectedProps } from '@/types';

import { Prototype } from './components';

const PublicPrototype: React.FC<ConnectedPublicPrototypeProps & RouteComponentProps<{ versionID: string }>> = ({ match, setupPublicPrototype }) => {
  const [isLoaded, toggleLoaded] = useToggle(false);
  const [settings, setSettings] = React.useState<PrototypeDuck.PrototypeSettings>({ layout: PrototypeDuck.PrototypeLayout.TEXT_DIALOG });

  useSetup(async () => {
    const { versionID } = match.params;

    try {
      const prototypeLayout = await setupPublicPrototype(versionID);

      setSettings(prototypeLayout);
    } catch {
      toast.error("Prototype hasn't been shared or doesn't exist");
    }

    toggleLoaded(true);
  });

  return isLoaded ? (
    <>
      <RemoveIntercom />

      <Prototype settings={settings} />
    </>
  ) : (
    <FullSpinner name="Prototype" />
  );
};

const mapDispatchToProps = {
  setupPublicPrototype: PrototypeDuck.setupPublicPrototype,
};

type ConnectedPublicPrototypeProps = ConnectedProps<{}, typeof mapDispatchToProps>;

export default connect(null, mapDispatchToProps)(PublicPrototype);
