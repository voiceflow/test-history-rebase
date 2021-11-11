import { Node as BaseNode } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { CheckboxType } from '@/components/Checkbox';
import Divider from '@/components/Divider';
import RadioGroup, { RadioOption } from '@/components/RadioGroup';
import Section from '@/components/Section';
import * as Creator from '@/ducks/creator';
import { useDidUpdateEffect, useLinkedState, useSelector } from '@/hooks';
import { FormControl } from '@/pages/Canvas/components/Editor';
import { FollowPathEditor } from '@/pages/Canvas/components/FollowPath';
import { EngineContext } from '@/pages/Canvas/contexts';
import { NodeEditorPropsType } from '@/pages/Canvas/managers/types';

const ELSE_OPTIONS: RadioOption<BaseNode.IfV2.IfNoMatchType>[] = [
  {
    id: BaseNode.IfV2.IfNoMatchType.PATH,
    label: 'Path',
  },
  {
    id: BaseNode.IfV2.IfNoMatchType.NONE,
    label: 'None',
  },
];

const NoMatchPathName: React.FC<NodeEditorPropsType<Realtime.NodeData.IfV2>> = ({ data, onChange }) => {
  const engine = React.useContext(EngineContext)!;

  const noMatchLinkID = useSelector(Creator.focusedNoMatchLinkIDSelector);

  const [localNoMatch, setLocalNoMatch] = useLinkedState(data.noMatch);

  const handleChangeType = (newType: BaseNode.IfV2.IfNoMatchType) => {
    if (noMatchLinkID && newType === BaseNode.IfV2.IfNoMatchType.NONE) {
      engine.link.remove(noMatchLinkID);
    }

    setLocalNoMatch({ ...localNoMatch, type: newType });
  };

  useDidUpdateEffect(() => {
    if (localNoMatch !== data.noMatch) {
      onChange({ noMatch: localNoMatch });
    }
  }, [localNoMatch]);

  return (
    <>
      <Section>
        <FormControl label="No Match Type" contentBottomUnits={0}>
          <RadioGroup type={CheckboxType.RADIO} isFlat options={ELSE_OPTIONS} checked={localNoMatch.type} onChange={handleChangeType} />
        </FormControl>
      </Section>

      {localNoMatch.type === null ? (
        <>
          <Section customContentStyling={{ color: '#62778c' }}>The project will end if no condition is matched.</Section>
          <Divider offset={0} />
        </>
      ) : (
        <FollowPathEditor name={data.noMatch.pathName ?? ''} onChange={(pathName) => setLocalNoMatch({ ...localNoMatch, pathName })} />
      )}
    </>
  );
};

export default NoMatchPathName;
