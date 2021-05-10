import { DeviceType } from '@voiceflow/general-types';
import { APLStepData } from '@voiceflow/general-types/build/nodes/visual';
import React from 'react';

import displayAdapter from '@/client/adapters/creator/block/alexa/display';
import BaseRenderer from '@/components/DisplayRenderer/components/BaseRenderer';
import { connect } from '@/hocs';
import { DEVICE_LIST } from '@/pages/Prototype/constants';
import * as SideEffects from '@/store/sideEffects';
import { ConnectedProps } from '@/types';
import * as Sentry from '@/vendors/sentry';

const MemoizedBaseRenderer = React.memo(BaseRenderer);

type APLProps = {
  data: APLStepData;
  device: DeviceType | null;
  dimension: { width: number; height: number };
};

const APL: React.FC<APLProps & ConnectedAPLProps> = ({ data, device, resolveAPL, dimension }) => {
  const [aplContext, setAPLContext] = React.useState<{ apl: string; data: string; commands: string } | null>(null);

  const isRound = device === DeviceType.ECHO_SPOT;
  const renderAPL = !!aplContext;

  const deviceInfo = React.useMemo(
    () =>
      Object.values(DEVICE_LIST)
        .flat()
        .find(({ type }) => type === device),
    [device]
  );
  const viewport = React.useMemo(() => ({ dpi: deviceInfo?.dimension.density ?? 160, width: dimension.width, height: dimension.height, isRound }), [
    isRound,
    deviceInfo,
    dimension.width,
    dimension.height,
  ]);

  React.useEffect(() => {
    if (data) {
      (async () => {
        const context = await resolveAPL(
          displayAdapter.fromDB({
            type: data.aplType,
            title: data.title,
            imageURL: data.imageURL,
            document: data.document,
            datasource: data.datasource,
            aplCommands: data.aplCommands,
            jsonFileName: data.jsonFileName,
          })
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
      onFail={Sentry.error}
      commands={aplContext!.commands}
      viewport={viewport}
    />
  );
};

const mapDispatchToProps = {
  resolveAPL: SideEffects.resolveAPL,
};

type ConnectedAPLProps = ConnectedProps<{}, typeof mapDispatchToProps>;

export default connect(null, mapDispatchToProps)(APL) as React.FC<APLProps>;
