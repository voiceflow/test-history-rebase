import { ButtonVariant, FlexCenter, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import { ALL_PERSONA_ID } from '@/constants';
import * as Prototype from '@/ducks/prototype';
import { useDispatch, useQuery, useSelector } from '@/hooks';
import { Identifier } from '@/styles/constants';

import PersonaSelectMenu from './PersonaSelectMenu';
import SelectedPersonaText from './SelectedPersonaText';
import * as S from './styles';

export interface PrototypeStartProps {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  color: string;
}

const PrototypeStart: React.FC<PrototypeStartProps> = ({ onClick, color }) => {
  const query = useQuery();
  const personaID = query.get('persona');
  const selectedPersonaID = useSelector(Prototype.prototypeSelectedPersonaID);
  const updatePrototype = useDispatch(Prototype.updatePrototype);

  React.useEffect(() => {
    if (personaID !== ALL_PERSONA_ID) {
      updatePrototype({
        selectedPersonaID: personaID,
      });
    }
  }, [personaID]);

  const onClickIconButton = (toggleSelectMenuOpen: VoidFunction) => () => {
    if (selectedPersonaID) {
      updatePrototype({
        selectedPersonaID: null,
      });
    } else {
      toggleSelectMenuOpen();
    }
  };

  const allowPersonaSelection = personaID === ALL_PERSONA_ID;

  if (!allowPersonaSelection) {
    return (
      <FlexCenter fullWidth style={{ marginBottom: '8px' }}>
        <S.RunTestButton withIconButton variant={ButtonVariant.PRIMARY} onClick={onClick} id={Identifier.PROTOTYPE_START} color={color}>
          Start Conversation
        </S.RunTestButton>
      </FlexCenter>
    );
  }

  return (
    <FlexCenter column>
      <PersonaSelectMenu
        render={({ ref, isOpen, toggleSelectMenuOpen }) => (
          <FlexCenter fullWidth style={{ marginBottom: '8px' }}>
            <S.RunTestButton withIconButton variant={ButtonVariant.PRIMARY} onClick={onClick} id={Identifier.PROTOTYPE_START} color={color}>
              Start Conversation
            </S.RunTestButton>

            <TippyTooltip content={selectedPersonaID ? 'Reset state' : 'Select test persona'}>
              <S.IconedButton
                ref={ref as React.RefObject<HTMLButtonElement>}
                icon={selectedPersonaID ? 'removeData' : 'caretDown'}
                isActive={isOpen}
                variant={ButtonVariant.PRIMARY}
                onClick={onClickIconButton(toggleSelectMenuOpen)}
                iconProps={selectedPersonaID ? { size: 20, color: '#fff', marginTop: '1px', marginLeft: '1px' } : { size: 10, color: '#fff' }}
                color={color}
              />
            </TippyTooltip>
          </FlexCenter>
        )}
      />
      <SelectedPersonaText />
    </FlexCenter>
  );
};

export default PrototypeStart;
