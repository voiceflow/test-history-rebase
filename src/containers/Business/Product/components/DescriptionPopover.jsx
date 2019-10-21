import React from 'react';
import { Card, Collapse, Popover, PopoverBody } from 'reactstrap';

import SvgIcon from '@/components/SvgIcon';
import { useToggle } from '@/hooks/toggle';

import { CardBody, CollapseWrapper, DescriptionSection, InnerWrapper, PopoverLink, TextHeader } from '.';

function PurchasePromptPopover() {
  const [open, onToggle] = useToggle();
  const [isExampleOpen, onExampleToggle] = useToggle();

  return (
    <DescriptionSection>
      <PopoverLink id="instructions" onClick={onToggle}>
        How to write a Purchase Prompt
      </PopoverLink>
      <Popover className="updates-popover-container popover-container" placement="top-start" isOpen={open} target="instructions" toggle={onToggle}>
        <PopoverBody>
          <DescriptionSection color="true">
            The purchase Prompt description should meet the following requirements:
            <ul>
              <li>Include the product name</li>
              <li>Include what is unique about the product</li>
              <li>Be as brief as possible</li>
              <li>Not include the product price, as Amazon automatically appends the price in the purchase flow</li>
              <li>Avoid repeating the same phrases customers may have heard in the previous steps</li>
            </ul>
            <CollapseWrapper onClick={onExampleToggle}>
              <InnerWrapper>
                <strong>Example</strong> <SvgIcon size={14} icon={isExampleOpen ? 'caretDown' : 'play'} />
              </InnerWrapper>
              <Collapse isOpen={isExampleOpen}>
                <Card>
                  <CardBody>
                    <TextHeader color="#279745">DO:</TextHeader>
                    <DescriptionSection>The Cave Quest expansion pack includes 5 new adventures with Emerald and her friends.</DescriptionSection>
                    <TextHeader color="#E91E63">DON'T:</TextHeader>
                    <DescriptionSection>
                      This expansion pack includes 5 new adventures. The Lost Elf, The Fall, The Mysterio Echo, Emreald's New Friend, and The Long
                      Walk Home. Play these stories anytime you'd like. It's $0.99 plus tax. Would you like you buy it?
                    </DescriptionSection>
                  </CardBody>
                </Card>
              </Collapse>
            </CollapseWrapper>
          </DescriptionSection>
        </PopoverBody>
      </Popover>
    </DescriptionSection>
  );
}

export default PurchasePromptPopover;
