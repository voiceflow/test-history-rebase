import type { SvgIconTypes } from '@voiceflow/ui';
import { SvgIcon, useLinkedState } from '@voiceflow/ui';
import cn from 'classnames';
import React from 'react';

import type { EditableTextAPI } from '@/components/EditableText';
import { PortEntityProvider } from '@/pages/Canvas/contexts';
import type { ChipAPI } from '@/pages/Canvas/types';
import { ClassName } from '@/styles/constants';

import PlayButton from '../PlayButton';
import Port from '../Port';
import { ChipAPIContext } from './contexts';
import * as S from './styles';

export { ChipAPIProvider } from './contexts';

export interface ChipApiRef {
  rename: VoidFunction;
}

export interface ChipProps extends React.PropsWithChildren {
  icon: SvgIconTypes.Icon;
  name?: string | null;
  portID?: string | null;
  className?: string;
  placeholder?: string;
}

const Chip: React.FC<ChipProps> = ({ icon, name, portID, children, className, placeholder }) => {
  const api = React.useContext(ChipAPIContext)! as ChipAPI<HTMLDivElement>;

  const [label, setLabel] = useLinkedState(api.name || name || '');

  const labelRef = React.useRef<EditableTextAPI | null>(null);

  React.useImperativeHandle(api.apiRef, () => ({ rename: () => labelRef.current?.startEditing() }), []);

  return (
    <S.Container ref={api.ref} palette={api.palette} className={cn(ClassName.CANVAS_CHIP, className)} {...api.handlers}>
      <S.Header>
        <S.IconsContainer palette={api.palette}>
          <S.IconContainer>
            <SvgIcon icon={icon} size={16} />
          </S.IconContainer>

          <S.PlayContainer>
            <PlayButton nodeID={api.nodeID} color="currentColor" />
          </S.PlayContainer>
        </S.IconsContainer>

        <S.Label
          ref={labelRef}
          value={label}
          onBlur={() => api.onRename(label)}
          palette={api.palette}
          onChange={setLabel}
          placeholder={placeholder}
          isPlaceholder={!label}
          startEditingOnFocus={false}
        />

        {api.withPort && !!portID && (
          <S.PortContainer>
            <PortEntityProvider id={portID}>
              <Port isChip palette={api.palette} withoutLink />
            </PortEntityProvider>
          </S.PortContainer>
        )}
      </S.Header>

      {children}
    </S.Container>
  );
};

export default Chip;
