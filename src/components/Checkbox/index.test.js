import React from 'react';
import test from 'ava';
import { create } from 'react-test-renderer';
import { shallow } from 'enzyme';

import Checkbox from './index';

test('Checkbox without props', t => {
  const elm = <Checkbox />;

  const tree = create(elm).toJSON();
  const wrapper = shallow(elm);

  t.deepEqual(wrapper.find('.form-checkbox__input').prop('type'), 'checkbox');
  t.snapshot(tree);
});

test('Checkbox with id', t => {
  const elm = <Checkbox id="some-id" />;

  const tree = create(elm).toJSON();
  const wrapper = shallow(elm);

  t.deepEqual(wrapper.find('.form-checkbox__input').prop('id'), 'some-id');
  t.snapshot(tree);
});

test('Checkbox with label', t => {
  const elm = <Checkbox label="some label" />;

  const tree = create(elm).toJSON();
  const wrapper = shallow(elm);

  t.true(wrapper.find('.form-checkbox__value').contains('some label'));
  t.snapshot(tree);
});

test('Checkbox with error', t => {
  const elm = <Checkbox error="some error" />;

  const tree = create(elm).toJSON();
  const wrapper = shallow(elm);

  t.true(wrapper.contains(<small className="form-hint text-danger">some error</small>));
  t.snapshot(tree);
});

test('Checkbox with disabled', t => {
  const elm = <Checkbox disabled />;

  const tree = create(elm).toJSON();
  const wrapper = shallow(elm);

  t.deepEqual(wrapper.find('.form-checkbox.__is-disabled').length, 1);
  t.deepEqual(wrapper.find('.form-checkbox__input').prop('type'), 'checkbox');
  t.deepEqual(wrapper.find('.form-checkbox__input').prop('disabled'), true);

  t.snapshot(tree);
});

test('Checkbox with isRadio', t => {
  const elm = <Checkbox isRadio />;

  const tree = create(elm).toJSON();
  const wrapper = shallow(elm);

  t.deepEqual(wrapper.find('.form-checkbox__input').prop('type'), 'radio');
  t.snapshot(tree);
});

test('Checkbox with isRadio and disabled', t => {
  const elm = <Checkbox isRadio disabled />;

  const tree = create(elm).toJSON();
  const wrapper = shallow(elm);

  t.deepEqual(wrapper.find('.form-checkbox__input').prop('type'), 'radio');
  t.deepEqual(wrapper.find('.form-checkbox.__is-disabled').length, 1);
  t.deepEqual(wrapper.find('.form-checkbox__input').prop('disabled'), true);

  t.snapshot(tree);
});

test('Checkbox with wrapValue', t => {
  const elm = <Checkbox label="some label" wrapValue />;

  const tree = create(elm).toJSON();
  const wrapper = shallow(elm);

  t.true(
    wrapper.find('.form-checkbox__value').contains(<div className="text-wrap">some label</div>)
  );

  t.snapshot(tree);
});

test('Checkbox with noWrapValue', t => {
  const elm = <Checkbox label="some label" noWrapValue />;

  const tree = create(elm).toJSON();
  const wrapper = shallow(elm);

  t.true(
    wrapper.find('.form-checkbox__value').contains(<div className="text-nowrap">some label</div>)
  );

  t.snapshot(tree);
});

test('Checkbox with checked', t => {
  const elm = <Checkbox checked />;

  const tree = create(elm).toJSON();
  const wrapper = shallow(elm);

  t.deepEqual(wrapper.find('.form-checkbox__input').prop('checked'), true);

  t.snapshot(tree);
});

test('Checkbox with className', t => {
  const elm = <Checkbox className="new-class" />;

  const tree = create(elm).toJSON();
  const wrapper = shallow(elm);

  t.deepEqual(wrapper.find('.form-checkbox.new-class').length, 1);

  t.snapshot(tree);
});
