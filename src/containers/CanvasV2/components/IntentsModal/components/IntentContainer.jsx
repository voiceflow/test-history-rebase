import React from 'react';

import IntentForm from '@/components/IntentForm';
import { StandaloneIntentSlotForm } from '@/components/IntentSlotForm';
import Dropdown from '@/componentsV2/Dropdown';
import { FlexApart } from '@/componentsV2/Flex';
import IconButton from '@/componentsV2/IconButton';
import Input from '@/componentsV2/Input';
import Section from '@/componentsV2/Section';
import * as Intent from '@/ducks/intent';
import { connect } from '@/hocs';
import { FadeLeftContainer } from '@/styles/animations/FadeLeft';
import { formatIntentName } from '@/utils/intent';

const IntentManager = ({ intentID, intentsMap, removeIntent, updateIntent }) => {
  const intent = intentsMap[intentID];

  const [path, setPath] = React.useState({});
  const resetPath = () => setPath({});

  React.useEffect(resetPath, [intentID]);

  if (!intent) return null;

  const slotEdit = path.type === 'slot';

  return (
    <FadeLeftContainer key={intentID}>
      <Section>
        <FlexApart onClick={resetPath}>
          <Input
            style={{ flex: 1, marginRight: '10px' }}
            placeholder="Intent Name"
            value={intent.name}
            onChange={(e) => updateIntent(intentID, { name: formatIntentName(e.target.value) }, true)}
          />
          <Dropdown
            options={[
              {
                label: 'Delete',
                onClick: () => removeIntent(intentID),
              },
            ]}
          >
            {(ref, onToggle, isOpen) => <IconButton icon="elipsis" variant="flat" active={isOpen} onClick={onToggle} ref={ref} />}
          </Dropdown>{' '}
        </FlexApart>
      </Section>
      {slotEdit ? <StandaloneIntentSlotForm activePath={path} /> : <IntentForm intent={intent} pushToPath={setPath} />}
    </FadeLeftContainer>
  );
};

const mapStateToProps = {
  intentsMap: Intent.mapIntentsSelector,
};

const mapDispatchToProps = {
  removeIntent: Intent.removeIntent,
  updateIntent: Intent.updateIntent,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IntentManager);
