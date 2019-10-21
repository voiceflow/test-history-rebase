import React from 'react';
import { Mention, MentionsInput } from 'react-mentions';

import { inputMinHeight, inputStyle } from '@/componentsV2/Input';
import { allSlotsSelector } from '@/ducks/slot';
import { connect, styled } from '@/hocs';

const UtteranceContainer = styled.div`
  ${inputMinHeight}

  .mentions-input__input {
    ${inputStyle}
    outline: 0 !important;
  }

  .mentions-input__highlighter {
    ${inputStyle}
    letter-spacing: normal;
    word-spacing: normal;
  }

  .mentions-input__suggestions__list {
    padding-top: 8px !important;
    padding-bottom: 8px !important;
    font-size: 12pt;
    background-color: white;
    border: none;
    border-radius: 5px;
    box-shadow: 0 0 0 1px rgba(17, 49, 96, 0.06), 0 8px 16px 0 rgba(17, 49, 96, 0.16);
  }

  .mentions-input__suggestions__item {
    padding: 10px 25px;
  }

  .mentions-input__suggestions__item--focused {
    color: #2b3950;
    background-color: #f3f7f8;
  }
`;

const Utterance = ({ slots, onChange, ...props }) => (
  <UtteranceContainer>
    <MentionsInput
      className="mentions-input"
      markup="{{[__display__].__id__}}"
      displayTransform={(id, display) => `[${display}]`}
      allowSpaceInQuery
      onChange={(e) => onChange(e.target.value)}
      {...props}
    >
      <Mention
        trigger="["
        data={slots.map((slot) => ({ display: slot.name, id: slot.id }))}
        style={{
          backgroundColor: '#DCEEFF',
          outline: '1px solid #DCEEFF',
        }}
      />
    </MentionsInput>
  </UtteranceContainer>
);

const mapStateToProps = {
  slots: allSlotsSelector,
};

export default connect(mapStateToProps)(Utterance);
