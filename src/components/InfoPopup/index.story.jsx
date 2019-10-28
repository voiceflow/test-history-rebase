import { select, text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';

import { Variant, createTestableStory } from '@/../.storybook';
import SvgIcon from '@/components/SvgIcon';
import Button from '@/componentsV2/Button';
import { styled } from '@/hocs';

import InfoPopUp from '.';

const PLACEMENT_OPTIONS = [
  'auto',
  'top',
  'bottom',
  'right',
  'left',
  'bottom-start',
  'bottom-end',
  'top-start',
  'top-end',
  'right-start',
  'right-end',
  'left-start',
  'left-end',
  'auto-start',
  'auto-end',
];

const RefContainer = styled.div`
  top: 12px;
  position: relative;
  cursor: pointer;
  display: inline-block;
  color: #5d9df5;
`;

const InfoLabel = styled.div`
  position: relative;
  top: 10px;
  margin-left: 10px;
  margin-right: 10px;
  display: inline-block;
`;

const InfoBox = styled.div`
  border-radius: 8px;
  background-color: #fff;
  margin: 10px;
  padding: 20px;
  box-shadow: 0 0 5px #ccc;
`;

storiesOf('Info Popup', module).add(
  'variants',
  createTestableStory(() => {
    const placement = select('Placement', PLACEMENT_OPTIONS);
    const labelText = text('Information', 'Popup');

    return (
      <>
        <Variant label="Icon Popup">
          <InfoPopUp
            portal={false}
            placement={placement}
            reference={() => (
              <div>
                <Button>Info</Button>
              </div>
            )}
          >
            <InfoBox>{labelText}</InfoBox>
          </InfoPopUp>
        </Variant>

        <Variant label="Label Icon Popup">
          <InfoPopUp
            portal={false}
            placement={placement}
            reference={(isOpen) => (
              <div>
                <InfoLabel>Slots</InfoLabel>
                <RefContainer>
                  <SvgIcon color={isOpen ? '#6E849A' : '#8da2b5'} icon="info" />
                </RefContainer>
              </div>
            )}
          >
            <InfoBox>{labelText}</InfoBox>
          </InfoPopUp>
        </Variant>

        <Variant label="Label Popup">
          <InfoPopUp
            portal={false}
            placement={placement}
            reference={() => (
              <div>
                <RefContainer>How it Works</RefContainer>
              </div>
            )}
          >
            <InfoBox>{labelText}</InfoBox>
          </InfoPopUp>
        </Variant>
      </>
    );
  })
);
