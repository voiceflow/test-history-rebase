import { DeviceType } from '@voiceflow/general-types';
import { APLStepData } from '@voiceflow/general-types/build/nodes/visual';
import React from 'react';

import displayAdapter from '@/client/adapters/creator/block/alexa/display';
import BaseRenderer from '@/components/DisplayRenderer/components/BaseRenderer';
import { connect } from '@/hocs';
import { DEVICE_LIST } from '@/pages/Prototype/constants';
import * as SideEffects from '@/store/sideEffects';
import { ConnectedProps } from '@/types';

import Frame from './Frame';
import { VisualRenderProps } from './types';

type APLProps = VisualRenderProps<APLStepData>;

const APL: React.FC<APLProps & ConnectedAPLProps> = ({ zoom, data, device, platform, resolveAPL, dimensions }) => {
  const [aplContext, setAPLContext] = React.useState<{ apl: string; data: string; commands: string } | null>(null);
  const deviceInfo = React.useMemo(() => DEVICE_LIST[platform].find(({ type }) => type === device), [platform, device]);

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

  const isRound = device === DeviceType.ECHO_SPOT;
  const renderAPL = !!aplContext;

  return (
    <Frame zoom={zoom} title={renderAPL ? deviceInfo?.name : null} isRound={isRound} width={dimensions[0]} height={dimensions[1]}>
      {!renderAPL ? null : (
        <BaseRenderer
          apl={aplContext!.apl}
          data={aplContext!.data}
          scale={1}
          onFail={console.error}
          commands={aplContext!.commands}
          viewport={{
            width: dimensions[0],
            height: dimensions[1],
            dpi: deviceInfo!.dimension.density,
            isRound,
          }}
        />
      )}
    </Frame>
  );
};

const mapDispatchToProps = {
  resolveAPL: SideEffects.resolveAPL,
};

type ConnectedAPLProps = ConnectedProps<{}, typeof mapDispatchToProps>;

export default connect(null, mapDispatchToProps)(APL) as React.FC<APLProps>;
