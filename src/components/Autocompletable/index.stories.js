/* eslint-disable import/no-extraneous-dependencies */

import React from 'react';

import centered from '@storybook/addon-centered';
import { storiesOf } from '@storybook/react';
import { text, boolean, withKnobs } from '@storybook/addon-knobs';

import Popover from '../Popover';

import Autocompletable from './index';

storiesOf('components/Autocompletable', module)
  .addDecorator(centered)
  .addDecorator(withKnobs)
  .add('default', () => (
    <Autocompletable
      icon={text('icon', 'arrow-forward')}
      value={text('value', '1')}
      disabled={boolean('disabled', false)}
      readOnly={boolean('readOnly', false)}
      isClearable={boolean('isClearable', true)}
      placeholder={text('placeholder', 'placeholder')}
      filteredLabel={text('filteredLabel', '')}
      filteredPrevLevelLabel={text('filteredPrevLevelLabel', '')}
      popoverRenderer={({ show, value, filteredLabel, target, onHide }) => (
        <Popover
          show={show}
          isList
          target={target}
          onHide={onHide}
          sameWidth
          renderBody={() => (
            <ul className="popover-list">
              <li className="popover-list__list-item">
                <div className="popover-list__item">
                  <div className="text-truncate">
                    show: {JSON.stringify(show)}
                    <br />
                    value: {value}
                    <br />
                    filteredLabel: {filteredLabel}
                  </div>
                </div>
              </li>
            </ul>
          )}
        />
      )}
    />
  ));
