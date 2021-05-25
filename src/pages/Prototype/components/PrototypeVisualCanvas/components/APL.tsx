import { DeviceType } from '@voiceflow/general-types';
import { APLStepData } from '@voiceflow/general-types/build/nodes/visual';
import React from 'react';

import displayAdapter from '@/client/adapters/creator/block/alexa/display';
import BaseRenderer from '@/components/DisplayRenderer/components/BaseRenderer';
import * as APLDuck from '@/ducks/apl';
import { connect } from '@/hocs';
import { getDeviceList } from '@/pages/Prototype/constants';
import { ClassName } from '@/styles/constants';
import { ConnectedProps } from '@/types';
import * as Sentry from '@/vendors/sentry';

import Frame from './Frame';
import { VisualRenderProps } from './types';

const MemoizedBaseRenderer = React.memo(BaseRenderer);

type APLProps = VisualRenderProps<APLStepData>;

const APL: React.FC<APLProps & ConnectedAPLProps> = ({ zoom, data, device, platform, resolveAPL, dimensions }) => {
  const [aplContext, setAPLContext] = React.useState<{ apl: string; data: string; commands: string } | null>(null);

  const isRound = device === DeviceType.ECHO_SPOT;
  const renderAPL = !!aplContext;
  const deviceInfo = React.useMemo(() => getDeviceList(platform).find(({ type }) => type === device), [platform, device]);
  const viewport = React.useMemo(() => ({ dpi: deviceInfo?.dimension.density ?? 0, width: dimensions[0], height: dimensions[1], isRound }), [
    deviceInfo,
    dimensions,
    isRound,
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

  return (
    <Frame
      className={ClassName.VISUAL_APL}
      zoom={zoom}
      title={renderAPL ? deviceInfo?.name : null}
      isRound={isRound}
      width={dimensions[0]}
      height={dimensions[1]}
    >
      {!renderAPL ? null : (
        <MemoizedBaseRenderer
          apl={aplContext!.apl}
          data={aplContext!.data}
          scale={1}
          onFail={Sentry.error}
          commands={aplContext!.commands}
          viewport={viewport}
        />
      )}
    </Frame>
  );
};

const mapDispatchToProps = {
  resolveAPL: APLDuck.resolveAPL,
};

type ConnectedAPLProps = ConnectedProps<{}, typeof mapDispatchToProps>;

export default connect(null, mapDispatchToProps)(APL) as React.FC<APLProps>;
