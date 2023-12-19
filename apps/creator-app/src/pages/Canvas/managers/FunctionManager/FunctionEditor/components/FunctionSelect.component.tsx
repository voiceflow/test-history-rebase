import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { SectionV2 } from '@voiceflow/ui';
import { Dropdown, Menu } from '@voiceflow/ui-next';
import React from 'react';

import { FunctionMapContext } from '@/pages/Canvas/contexts';
import { getItemFromMap } from '@/pages/Canvas/utils';

interface FunctionSelectProps {
  onChange: (value: Partial<Realtime.NodeData.Function>) => void;
  functionID?: string;
}

export const FunctionSelect = ({ onChange, functionID }: FunctionSelectProps) => {
  const functionMap = React.useContext(FunctionMapContext)!;
  const functionData = getItemFromMap(functionMap, functionID!);

  return (
    <SectionV2.SimpleSection isAccent>
      <Dropdown value={functionData.name || null} placeholder="Select a function" prefixIcon prefixIconName="Edit">
        {({ onClose, referenceRef }) => (
          <Menu width={referenceRef.current?.clientWidth}>
            {Object.values(functionMap).map((functionItem) => (
              <Menu.Item
                key={functionItem.id}
                label={functionItem.name}
                onClick={Utils.functional.chain(onClose, () => onChange({ functionID: functionItem.id }))}
              />
            ))}
          </Menu>
        )}
      </Dropdown>
    </SectionV2.SimpleSection>
  );
};
