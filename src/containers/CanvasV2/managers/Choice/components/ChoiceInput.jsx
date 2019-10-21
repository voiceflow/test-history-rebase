import { constants } from '@voiceflow/common';
import cn from 'classnames';
import React from 'react';
import { Collapse } from 'reactstrap';

import Button from '@/components/Button';
import ListManager, { ListManagerForm } from '@/components/ListManager';
import { FlexApart } from '@/componentsV2/Flex';
import { isLiveSelector } from '@/ducks/skill';
import { connect } from '@/hocs';
import { useManager } from '@/hooks';

import ChoiceInputContainer from './ChoiceInputContainer';

const TOKEN_PATTERN = /({{\[)|(].[\dA-Za-z]+}})/g;
const { sampleUtteranceRegex } = constants.regex;

const validateFormValue = (value) => {
  const escapedValue = value.replace(TOKEN_PATTERN, '');
  if (escapedValue.match(sampleUtteranceRegex)) {
    return 'Sample choices can consist of only unicode characters, spaces, periods for abbreviations, underscores, possessive apostrophes, curly braces, and hyphens';
  }
};

const ChoiceInput = ({ choice, index: choiceIndex, onRemove, onChange, isLive }) => {
  const hasSynonyms = !!choice.synonyms.length;
  const toggleOpen = () => onChange({ open: !choice.open });
  const synonymManager = useManager(choice.synonyms, (synonyms) => onChange({ synonyms }));
  const updateValue = (value) => onChange({ value });
  const addUtterance = (value) => (choice.value ? synonymManager.onAdd : updateValue)(value);

  return (
    <ChoiceInputContainer>
      <FlexApart className="choice-title">
        <span className="number-bubble">{choiceIndex + 1}</span>
        <Button className="close" onClick={onRemove} disabled={isLive} />
      </FlexApart>
      {choice.value != null && (
        <>
          <ListManagerForm
            placeholder="Enter user reply"
            className="form-control user-input mb-2"
            value={choice.value}
            index={0}
            onChange={updateValue}
          />
          <div className="space-between pointer ml-1 mb-1" onClick={toggleOpen}>
            <div className="section-title">Synonyms ({choice.synonyms.length})</div>
            {hasSynonyms && (
              <i
                className={cn('text-muted', 'fas', 'fa-caret-down', 'rotate', {
                  'fa-rotate-90': !choice.open,
                })}
              />
            )}
          </div>
        </>
      )}
      <Collapse isOpen={!hasSynonyms || choice.open}>
        <ListManager
          placeholder={choice.synonyms.length ? 'Enter synonyms of the user reply' : 'Enter user reply'}
          validate={validateFormValue}
          {...synonymManager}
          onAdd={addUtterance}
          inputComponent={ListManagerForm}
          showHelpText={choice.value == null}
        />
      </Collapse>
    </ChoiceInputContainer>
  );
};

const mapStateToProps = {
  isLive: isLiveSelector,
};

export default connect(mapStateToProps)(ChoiceInput);
