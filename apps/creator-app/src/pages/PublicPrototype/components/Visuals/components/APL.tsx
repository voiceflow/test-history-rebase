import { datadogRum } from '@datadog/browser-rum';
import { BaseNode } from '@voiceflow/base-types';
import React from 'react';

import BaseRenderer from '@/components/DisplayRenderer/components/BaseRenderer';
import * as APLDuck from '@/ducks/apl';
import { useDispatch } from '@/hooks/realtime';
import { ALL_DEVICES } from '@/pages/Prototype/constants';

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
        const context = await resolveAPL(data);

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
      onFail={datadogRum.addError}
      commands={aplContext!.commands}
      viewport={viewport}
    />
  );
};

export default APL;
