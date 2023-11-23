import { datadogRum } from '@datadog/browser-rum';
import { LOGROCKET_ENABLED } from '@ui/config';
import { BaseNode } from '@voiceflow/base-types';
import { Adapters } from '@voiceflow/realtime-sdk';
import React from 'react';

import BaseRenderer from '@/components/DisplayRenderer/components/BaseRenderer';
import * as APLDuck from '@/ducks/apl';
import { useDispatch } from '@/hooks/realtime';
import { ALL_DEVICES } from '@/pages/Prototype/constants';
import * as LogRocket from '@/vendors/logrocket';

const MemoizedBaseRenderer = React.memo(BaseRenderer);

interface APLProps {
  id?: string;
  data: BaseNode.Visual.APLStepData;
  device: BaseNode.Visual.DeviceType | null;
  dimension: { width: number; height: number };
}

const APL: React.FC<APLProps> = ({ data, device, dimension }) => {
  const resolveAPL = useDispatch(APLDuck.resolveAPL);

  const [aplContext, setAPLContext] = React.useState<{ apl: string; data: string; commands: string } | null>(null);

  const isRound = device === BaseNode.Visual.DeviceType.ECHO_SPOT;
  const renderAPL = !!aplContext;

  const deviceInfo = React.useMemo(() => ALL_DEVICES.find(({ type }) => type === device), [device]);
  const viewport = React.useMemo(
    () => ({ dpi: deviceInfo?.dimension.density ?? 160, width: dimension.width, height: dimension.height, isRound }),
    [isRound, deviceInfo, dimension.width, dimension.height]
  );

  React.useEffect(() => {
    if (data) {
      (async () => {
        const context = await resolveAPL(
          Adapters.alexaDisplayAdapter.fromDB(
            {
              type: data.aplType,
              title: data.title,
              imageURL: data.imageURL,
              document: data.document,
              datasource: data.datasource,
              aplCommands: data.aplCommands,
              jsonFileName: data.jsonFileName,
            },
            { context: {} }
          )
        );

        setAPLContext(context);
      })();
    } else {
      setAPLContext(null);
    }
  }, [data]);

  return !renderAPL ? null : (
    <MemoizedBaseRenderer
      apl={aplContext!.apl}
      data={aplContext!.data}
      scale={1}
      onFail={(error) => {
        if (LOGROCKET_ENABLED) {
          LogRocket.error(error);
        } else {
          datadogRum.addError(error);
        }
      }}
      commands={aplContext!.commands}
      viewport={viewport}
    />
  );
};

export default APL;
