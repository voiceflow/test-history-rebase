/* eslint-disable import/no-extraneous-dependencies */

import React from 'react';

import centered from '@storybook/addon-centered';
import storyRouter from 'storybook-react-router';
import { storiesOf } from '@storybook/react';
import { text, object, boolean, withKnobs } from '@storybook/addon-knobs';

import Button from './index';

storiesOf('components/Button', module)
  .addDecorator(centered)
  .addDecorator(withKnobs)
  .addDecorator(storyRouter())
  .add('default', () => (
    <Button
      to={text('to', '')}
      icon={text('icon', '')}
      isFlat={boolean('isFlat', false)}
      isText={boolean('isText', false)}
      isIcon={boolean('isIcon', false)}
      disabled={boolean('disabled', false)}
      isSimple={boolean('isSimple', false)}
      isAction={boolean('isAction', false)}
      withIcon={boolean('withIcon', false)}
      isActive={boolean('isActive', false)}
      isPrimary={boolean('isPrimary', true)}
      isIconFlat={boolean('isIconFlat', false)}
      vendorIcon={text('vendorIcon', '')}
      withLoader={boolean('withLoader', false)}
      isDropdown={boolean('isDropdown', false)}
      withCounter={boolean('withCounter', false)}
      isSecondary={boolean('isSecondary', false)}
      isHiddenIcon={boolean('isHiddenIcon', false)}
      withAnimation={boolean('withAnimation', false)}
      isDropdownMenu={boolean('isDropdownMenu', false)}
      isActionSuccess={boolean('isActionSuccess', false)}
      isPrimaryWithIcon={boolean('isPrimaryWithIcon', false)}
    >
      {text('children', 'Button')}
    </Button>
  ))
  .add('as link', () => (
    <Button
      to={text('to', '/link')}
      icon={text('icon', '')}
      isFlat={boolean('isFlat', false)}
      isText={boolean('isText', false)}
      isIcon={boolean('isIcon', false)}
      isSimple={boolean('isSimple', false)}
      isAction={boolean('isAction', false)}
      withIcon={boolean('withIcon', false)}
      isActive={boolean('isActive', false)}
      isPrimary={boolean('isPrimary', true)}
      isIconFlat={boolean('isIconFlat', false)}
      withLoader={boolean('withLoader', false)}
      isDropdown={boolean('isDropdown', false)}
      withCounter={boolean('withCounter', false)}
      isSecondary={boolean('isSecondary', false)}
      isHiddenIcon={boolean('isHiddenIcon', false)}
      withAnimation={boolean('withAnimation', false)}
      isDropdownMenu={boolean('isDropdownMenu', false)}
      isActionSuccess={boolean('isActionSuccess', false)}
      isPrimaryWithIcon={boolean('isPrimaryWithIcon', false)}
    >
      {text('children', 'Link')}
    </Button>
  ))
  .add('with tooltip', () => (
    <Button
      icon={text('icon', '')}
      isFlat={boolean('isFlat', false)}
      isText={boolean('isText', false)}
      isIcon={boolean('isIcon', false)}
      isSimple={boolean('isSimple', false)}
      isAction={boolean('isAction', false)}
      withIcon={boolean('withIcon', false)}
      isActive={boolean('isActive', false)}
      isPrimary={boolean('isPrimary', true)}
      isIconFlat={boolean('isIconFlat', false)}
      withLoader={boolean('withLoader', false)}
      isDropdown={boolean('isDropdown', false)}
      withCounter={boolean('withCounter', false)}
      isSecondary={boolean('isSecondary', false)}
      tooltipText={text('tooltipText', 'some text')}
      tooltipProps={object('tooltipProps', {})}
      isHiddenIcon={boolean('isHiddenIcon', false)}
      withAnimation={boolean('withAnimation', false)}
      isDropdownMenu={boolean('isDropdownMenu', false)}
      isActionSuccess={boolean('isActionSuccess', false)}
      isPrimaryWithIcon={boolean('isPrimaryWithIcon', false)}
    >
      {text('children', 'Button')}
    </Button>
  ));
