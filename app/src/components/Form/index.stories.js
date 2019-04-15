/* eslint-disable import/no-extraneous-dependencies */

import React, { Fragment } from 'react';

import centered from '@storybook/addon-centered';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { object, withKnobs } from '@storybook/addon-knobs';

import withMinWidth from 'stories/decorators/withMinWidth';

import Input from '../Input';
import Button from '../Button';

import Form from './index';

storiesOf('components/Form', module)
  .addDecorator(withMinWidth(400))
  .addDecorator(centered)
  .addDecorator(withKnobs)
  .add('default', () => (
    <Form
      onBlur={action('onBlur')}
      onChange={action('onChange')}
      onSubmit={action('onSubmit')}
      initialValues={object('initialValues', { name: 'name', secondName: 'secondName' })}
    >
      {({ values, errors, isSubmitting, handleBlur, handleSubmit, handleChange }) => (
        <Fragment>
          <div className="form-group">
            <Input
              value={values.name}
              label="Name"
              error={errors.name}
              onBlur={() => handleBlur('name')}
              onChange={({ target }) => handleChange('name', target.value)}
              disabled={isSubmitting}
              placeholder="Enter name"
            />
          </div>
          <div className="form-group">
            <Input
              value={values.secondName}
              label="Second Name"
              error={errors.secondName}
              onBlur={() => handleBlur('secondName')}
              onChange={({ target }) => handleChange('secondName', target.value)}
              disabled={isSubmitting}
              placeholder="Enter Second Name"
            />
          </div>

          <Button isPrimary onClick={handleSubmit} disabled={isSubmitting}>
            Submit
          </Button>
        </Fragment>
      )}
    </Form>
  ));
