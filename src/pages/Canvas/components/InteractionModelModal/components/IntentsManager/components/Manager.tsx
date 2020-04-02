import React from 'react';

import { FlexApart } from '@/components/Flex';
import Input from '@/components/Input';
import IntentForm from '@/components/IntentForm';
import { StandaloneIntentSlotForm } from '@/components/IntentSlotForm';
import RemoveDropdown from '@/components/RemoveDropdown';
import Section from '@/components/Section';
import * as IntentDuck from '@/ducks/intent';
import { connect } from '@/hocs';
import { FadeLeftContainer } from '@/styles/animations/FadeHorizontal';
import { formatIntentName } from '@/utils/intent';

import { Intent } from '../types';

export type ManagerProps = {
  id: string;
  intentsMap: Record<string, Intent>;
  removeIntent: (id: string) => void;
  updateIntent: (id: string, data: Partial<Intent>, patch?: boolean) => void;
};

const Manager: React.FC<ManagerProps> = ({ id, intentsMap, removeIntent, updateIntent }) => {
  const intent = intentsMap[id];

  const [name, setName] = React.useState(intent?.name ?? '');
  const [path, setPath] = React.useState<{ type: string | null }>({ type: null });
  const resetPath = () => setPath({ type: null });

  React.useEffect(() => {
    resetPath();
    setName(intent?.name || '');
  }, [id]);

  const slotEdit = path.type === 'slot';

  return !intent ? null : (
    <FadeLeftContainer>
      <Section>
        <FlexApart onClick={resetPath}>
          <Input
            value={name}
            onBlur={() => updateIntent(id, { id, name }, true)}
            onChange={({ currentTarget }: React.KeyboardEvent<HTMLInputElement>) => setName(formatIntentName(currentTarget.value))}
            placeholder="Intent Name"
          />

          <RemoveDropdown onRemove={() => removeIntent(id)} />
        </FlexApart>
      </Section>

      {slotEdit ? <StandaloneIntentSlotForm key={id} activePath={path} /> : <IntentForm key={id} intent={intent} pushToPath={setPath} />}
    </FadeLeftContainer>
  );
};

const mapStateToProps = {
  intentsMap: IntentDuck.mapIntentsSelector,
};

const mapDispatchToProps = {
  updateIntent: IntentDuck.updateIntent,
};

export default connect(mapStateToProps, mapDispatchToProps)(Manager);
