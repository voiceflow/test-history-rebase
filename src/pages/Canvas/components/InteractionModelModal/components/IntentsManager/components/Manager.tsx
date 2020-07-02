import React from 'react';

import { FlexApart } from '@/components/Flex';
import Input from '@/components/Input';
import IntentForm from '@/components/IntentForm';
import { StandaloneIntentSlotForm } from '@/components/IntentSlotForm';
import RemoveDropdown from '@/components/RemoveDropdown';
import Section from '@/components/Section';
import { ClickableText } from '@/components/Text';
import * as Intents from '@/ducks/intent';
import { compose, connect } from '@/hocs';
import { FadeLeftContainer } from '@/styles/animations';
import { ConnectedProps, MergeArguments } from '@/types';
import { formatIntentName } from '@/utils/intent';

export type ManagerProps = {
  id: string;
  removeIntent: (id: string) => void;
};

const Manager: React.ForwardRefRenderFunction<{ resetPath: () => void }, ManagerProps & ConnectedManagerProps> = (
  { id, intent, removeIntent, updateIntent },
  ref
) => {
  const [name, setName] = React.useState(intent?.name ?? '');
  const [path, setPath] = React.useState<{ type: string | null }>({ type: null });
  const resetPath = React.useCallback(() => setPath({ type: null }), []);

  React.useImperativeHandle(
    ref,
    () => ({
      resetPath,
    }),
    []
  );

  React.useEffect(() => {
    resetPath();
    setName(intent?.name || '');
  }, [id]);

  const slotEdit = path.type === 'slot';

  return !intent ? null : (
    <>
      <Section>
        <FlexApart onClick={resetPath}>
          <Input
            value={name}
            onBlur={() => updateIntent(id, { id, name }, true)}
            onChange={({ currentTarget }) => setName(formatIntentName(currentTarget.value))}
            placeholder="Intent Name"
          />

          <RemoveDropdown onRemove={() => removeIntent(id)} />
        </FlexApart>
      </Section>

      <FadeLeftContainer key={(!slotEdit).toString()}>
        {slotEdit ? <StandaloneIntentSlotForm key={id} activePath={path} /> : <IntentForm key={id} intent={intent} pushToPath={setPath} />}
      </FadeLeftContainer>
      {slotEdit && (
        <Section>
          <ClickableText onClick={resetPath}>Back to Intent</ClickableText>
        </Section>
      )}
    </>
  );
};

const mapStateToProps = {
  intent: Intents.intentByIDSelector,
};

const mapDispatchToProps = {
  updateIntent: Intents.updateIntent,
};

const mergeProps = (
  ...[{ intent: intentByIDSelector }, , { id }]: MergeArguments<typeof mapStateToProps, typeof mapDispatchToProps, ManagerProps>
) => ({
  intent: intentByIDSelector(id),
});

type ConnectedManagerProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps, typeof mergeProps>;

export default compose(connect(mapStateToProps, mapDispatchToProps, mergeProps, { forwardRef: true }), React.forwardRef)(Manager);
