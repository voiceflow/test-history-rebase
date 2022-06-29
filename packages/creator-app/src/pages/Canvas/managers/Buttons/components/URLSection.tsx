import { Utils } from '@voiceflow/common';
import { preventDefault, SectionV2, SvgIcon, TippyTooltip, toast } from '@voiceflow/ui';
import React from 'react';

import VariablesInput from '@/components/VariablesInput';
import { useEnableDisable, useScrollNodeIntoView } from '@/hooks';
import { containsSlotOtVariable, getValidHref, isAnyLink } from '@/utils/string';

export interface URLSectionProps {
  url: string;
  onAdd: VoidFunction;
  isActive: boolean;
  onChange: (url: string) => void;
  onRemove: VoidFunction;
}

const URLSection: React.FC<URLSectionProps> = ({ url, onAdd, isActive, onChange, onRemove }) => {
  const [ref, scrollIntoView] = useScrollNodeIntoView<HTMLDivElement>();
  const [autofocus, enableAutofocus, disableAutofocus] = useEnableDisable(false);

  const onBlur = ({ text }: { text: string }) => {
    if (!text || containsSlotOtVariable(text) || isAnyLink(text)) {
      onChange(text);
    } else {
      toast.error('URL is not valid, please enter valid link');
    }
  };

  return (
    <SectionV2.ActionCollapseSection
      ref={ref}
      title={<SectionV2.Title bold={isActive}>Attach URL</SectionV2.Title>}
      action={
        isActive ? (
          <SectionV2.RemoveButton onClick={Utils.functional.chain(onRemove, disableAutofocus)} />
        ) : (
          <SectionV2.AddButton onClick={Utils.functional.chain(onAdd, enableAutofocus)} />
        )
      }
      collapsed={!isActive}
      onEntered={() => scrollIntoView({ block: 'end' })}
      contentProps={{ bottomOffset: 2.5 }}
    >
      <VariablesInput
        value={url}
        onBlur={onBlur}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={autofocus}
        placeholder="Enter URL or Variable using '{'"
        rightAction={
          url && isAnyLink(url) ? (
            <TippyTooltip title="Open link in new tab">
              <SvgIcon icon="editorURL" color="#6e849a" onClick={preventDefault(() => window.open(getValidHref(url), '_blank'))} clickable />
            </TippyTooltip>
          ) : (
            <></> // needs this to do not rerender nested input
          )
        }
      />
    </SectionV2.ActionCollapseSection>
  );
};

export default URLSection;
