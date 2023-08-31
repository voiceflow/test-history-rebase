import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Menu, Portal, SvgIcon, toast, usePopper } from '@voiceflow/ui';
import React from 'react';

import * as Diagram from '@/ducks/diagramV2';
import * as Session from '@/ducks/session';
import { useDispatch, useHover, useSelector } from '@/hooks';

import * as S from './styles';

interface TopicDomainPopperProps {
  domains: Realtime.Domain[];
  topicID?: string | null;
  rootTopicID?: string;
}

const TopicDomainPopper: React.ForwardRefRenderFunction<HTMLDivElement, TopicDomainPopperProps> = ({ topicID, domains, rootTopicID }, ref) => {
  const moveTopicDomain = useDispatch(Diagram.moveTopicDomain);

  const domainID = useSelector(Session.activeDomainIDSelector);

  const options = React.useMemo(() => {
    return domains.map((domain) => ({ label: domain.name, value: domain.id }));
  }, [domains]);

  const optionsMap = React.useMemo(() => Utils.array.createMap(options, Utils.object.selectValue), [options]);

  const popper = usePopper({
    modifiers: [{ name: 'offset', options: { offset: [-12, 24] } }],
    strategy: 'fixed',
    placement: 'right-start',
  });
  const [isHovered, , popperHoverHandlers] = useHover();

  const onMoveTopicDomain = async (newDomainID: string) => {
    if (!topicID || !domainID) return;
    try {
      await moveTopicDomain(topicID, newDomainID, rootTopicID);
      toast.success(`Topic moved to ${optionsMap[newDomainID].label}.`);
    } catch {
      toast.genericError();
    }
  };

  return (
    <Box ref={ref} {...popperHoverHandlers} mr={-24} ml={-24}>
      <Box pr={24} pl={24}>
        <S.ContextMenuOption ref={popper.setReferenceElement} isActive={isHovered}>
          <Box>Move to domain</Box>
          <SvgIcon icon="arrowRight" size={10} color="#6E849A" />
        </S.ContextMenuOption>
      </Box>
      {isHovered && (
        <div>
          <Portal portalNode={document.body}>
            <div ref={popper.setPopperElement} style={popper.styles.popper} {...popper.attributes.popper}>
              <Menu options={options} onSelect={onMoveTopicDomain} />
            </div>
          </Portal>
        </div>
      )}
    </Box>
  );
};

export default React.forwardRef<HTMLDivElement, TopicDomainPopperProps>(TopicDomainPopper);
