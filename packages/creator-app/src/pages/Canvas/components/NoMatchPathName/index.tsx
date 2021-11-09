import { Node as BaseNode } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { CheckboxType } from '@/components/Checkbox';
import RadioGroup, { RadioOption } from '@/components/RadioGroup';
import Section from '@/components/Section';
import * as Creator from '@/ducks/creator';
import { connect } from '@/hocs';
import { useDidUpdateEffect, useLinkedState } from '@/hooks';
import { FormControl } from '@/pages/Canvas/components/Editor';
import { EngineContext } from '@/pages/Canvas/contexts';
import { PushToPath } from '@/pages/Canvas/managers/types';
import { ConnectedProps, MergeArguments } from '@/types';

import NoMatchPathEditor from '../NoMatchPathEditor';
import RadioButtonText from '../RadioButtonText';

const ELSE_OPTIONS: RadioOption<BaseNode.Utils.NoMatchType | null>[] = [
  {
    id: BaseNode.Utils.NoMatchType.PATH,
    label: <RadioButtonText label="Path" />,
  },
  {
    id: null,
    label: <RadioButtonText label="None" />,
  },
];

interface NoMatchProps {
  onChange: (noMatch: Realtime.NodeData.BaseNoMatches) => void;
  noMatch: Realtime.NodeData.BaseNoMatches;
  pushToPath?: PushToPath;
}

const NoMatchPathName: React.FC<NoMatchProps & ConnectedNoMatchProps> = ({ onChange, noMatch, elseLinkID }) => {
  const engine = React.useContext(EngineContext)!;

  const [localNoMatch, setLocalNoMatch] = useLinkedState(noMatch);

  const handleChangeType = (newType: BaseNode.Utils.NoMatchType) => {
    if (newType === null) {
      engine.link.remove(elseLinkID);
    }

    setLocalNoMatch({ ...localNoMatch, type: newType });
  };

  useDidUpdateEffect(() => {
    if (localNoMatch !== noMatch) {
      onChange(localNoMatch);
    }
  }, [localNoMatch]);

  return (
    <>
      <Section>
        <FormControl label="No Match Type" contentBottomUnits={0}>
          <RadioGroup type={CheckboxType.RADIO} options={ELSE_OPTIONS as any} checked={localNoMatch.type!} onChange={handleChangeType} />
        </FormControl>
      </Section>

      {localNoMatch.type === null ? (
        <Section borderBottom customContentStyling={{ color: '#62778c' }}>
          The project will end if no condition is matched.
        </Section>
      ) : (
        <NoMatchPathEditor name={noMatch.pathName} onChange={(pathName) => onChange({ ...localNoMatch, pathName })} />
      )}
    </>
  );
};

const mapStateToProps = {
  focusedNode: Creator.focusedNodeSelector,
  getLinkIDsByPortID: Creator.linkIDsByPortIDSelector,
};

const getElseLinkID = (focusedNode: Realtime.Node, getLinkIDsByPortID: (portID: string) => string[]) => {
  const [elsePortID] = Utils.array.head(focusedNode.ports.out);
  return getLinkIDsByPortID(elsePortID)[0];
};

const mergeProps = (...[{ focusedNode, getLinkIDsByPortID }, , ownProps]: MergeArguments<typeof mapStateToProps, {}, NoMatchProps>) => ({
  ...ownProps,
  elseLinkID: getElseLinkID(focusedNode!, getLinkIDsByPortID),
});

type ConnectedNoMatchProps = ConnectedProps<typeof mapStateToProps, {}, typeof mergeProps>;

export default connect(mapStateToProps, null, mergeProps)(NoMatchPathName as React.FC) as React.FC<NoMatchProps>;
