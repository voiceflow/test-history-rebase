/* eslint-disable sonarjs/no-duplicate-string */
import { Utils } from '@voiceflow/common';

import AtomicEntity from '@/legacy/models/utils/atomicEntity';

// eslint-disable-next-line sonarjs/no-nested-template-literals
const pathGetter = (entityID: string, path?: string) => `entities.${entityID}${path ? `.${path}` : ''}`;
const createEntity = () => new AtomicEntity(pathGetter);

const ENTITY_ID = 'id-1';
const ENTITY_SECOND_ID = 'id-2';

describe('Models | Utils | AtomicEntity', () => {
  describe('pull', () => {
    it('creates pull operation', () => {
      const entity = createEntity();

      expect(
        entity.pull(ENTITY_ID, [
          { path: 'path-1', match: 'value' },
          { path: 'path.nested', match: { 'child.id': '10' } },
        ])
      ).to.eql({
        query: {
          [pathGetter(ENTITY_ID, 'path-1')]: 'value',
          [pathGetter(ENTITY_ID, 'path.nested')]: { 'child.id': '10' },
        },
        operation: '$pull',
        arrayFilters: [],
      });
    });
  });

  describe('pullMany', () => {
    it('creates pull operation', () => {
      const entity = createEntity();

      expect(
        entity.pullMany([
          {
            entityID: ENTITY_ID,
            pulls: [
              { path: 'path-1', match: 'value' },
              { path: 'path.nested', match: { 'child.id': '10' } },
            ],
          },
          {
            entityID: ENTITY_SECOND_ID,
            pulls: [
              { path: 'path-1', match: 'value' },
              { path: 'path.nested', match: { 'child.id': '10' } },
            ],
          },
        ])
      ).to.eql({
        query: {
          [pathGetter(ENTITY_ID, 'path-1')]: 'value',
          [pathGetter(ENTITY_ID, 'path.nested')]: { 'child.id': '10' },
          [pathGetter(ENTITY_SECOND_ID, 'path-1')]: 'value',
          [pathGetter(ENTITY_SECOND_ID, 'path.nested')]: { 'child.id': '10' },
        },
        operation: '$pull',
        arrayFilters: [],
      });
    });
  });

  describe('push', () => {
    it('creates push operation for single value', () => {
      const entity = createEntity();

      expect(
        entity.push(ENTITY_ID, [
          { path: 'path-1', value: 'value' },
          { path: 'path-3', value: 3, index: 0 },
          { path: 'path.nested', value: { 'child.id': '10' }, index: 10 },
        ])
      ).to.eql({
        query: {
          [pathGetter(ENTITY_ID, 'path-1')]: { $each: ['value'] },
          [pathGetter(ENTITY_ID, 'path-3')]: { $each: [3], $position: 0 },
          [pathGetter(ENTITY_ID, 'path.nested')]: { $each: [{ 'child.id': '10' }], $position: 10 },
        },
        operation: '$push',
        arrayFilters: [],
      });
    });

    it('creates push operation for multiple values', () => {
      const entity = createEntity();

      expect(
        entity.push(ENTITY_ID, [
          { path: 'path-1', value: ['value-1', 'value-2'] },
          { path: 'path-3', value: [3], index: 0 },
          { path: 'path.nested', value: [], index: 10 },
        ])
      ).to.eql({
        query: {
          [pathGetter(ENTITY_ID, 'path-1')]: { $each: ['value-1', 'value-2'] },
          [pathGetter(ENTITY_ID, 'path-3')]: { $each: [3], $position: 0 },
        },
        operation: '$push',
        arrayFilters: [],
      });
    });
  });

  describe('pushMany', () => {
    it('creates push operation for single value', () => {
      const entity = createEntity();

      expect(
        entity.pushMany([
          {
            entityID: ENTITY_ID,
            pushes: [
              { path: 'path-1', value: 'value' },
              { path: 'path-3', value: 3, index: 0 },
              { path: 'path.nested', value: { 'child.id': '10' }, index: 10 },
            ],
          },
          {
            entityID: ENTITY_SECOND_ID,
            pushes: [
              { path: 'path-1', value: 'value' },
              { path: 'path-3', value: 3, index: 0 },
              { path: 'path.nested', value: { 'child.id': '10' }, index: 10 },
            ],
          },
        ])
      ).to.eql({
        query: {
          [pathGetter(ENTITY_ID, 'path-1')]: { $each: ['value'] },
          [pathGetter(ENTITY_ID, 'path-3')]: { $each: [3], $position: 0 },
          [pathGetter(ENTITY_ID, 'path.nested')]: { $each: [{ 'child.id': '10' }], $position: 10 },
          [pathGetter(ENTITY_SECOND_ID, 'path-1')]: { $each: ['value'] },
          [pathGetter(ENTITY_SECOND_ID, 'path-3')]: { $each: [3], $position: 0 },
          [pathGetter(ENTITY_SECOND_ID, 'path.nested')]: { $each: [{ 'child.id': '10' }], $position: 10 },
        },
        operation: '$push',
        arrayFilters: [],
      });
    });

    it('creates push operation for multiple values', () => {
      const entity = createEntity();

      expect(
        entity.pushMany([
          {
            entityID: ENTITY_ID,
            pushes: [
              { path: 'path-1', value: ['value-1', 'value-2'] },
              { path: 'path-3', value: [3], index: 0 },
              { path: 'path.nested', value: [], index: 10 },
            ],
          },
          {
            entityID: ENTITY_SECOND_ID,
            pushes: [
              { path: 'path-1', value: ['value-1', 'value-2'] },
              { path: 'path-3', value: [3], index: 0 },
              { path: 'path.nested', value: [], index: 10 },
            ],
          },
        ])
      ).to.eql({
        query: {
          [pathGetter(ENTITY_ID, 'path-1')]: { $each: ['value-1', 'value-2'] },
          [pathGetter(ENTITY_ID, 'path-3')]: { $each: [3], $position: 0 },
          [pathGetter(ENTITY_SECOND_ID, 'path-1')]: { $each: ['value-1', 'value-2'] },
          [pathGetter(ENTITY_SECOND_ID, 'path-3')]: { $each: [3], $position: 0 },
        },
        operation: '$push',
        arrayFilters: [],
      });
    });
  });

  describe('set', () => {
    it('creates set operation for simple path', () => {
      vi.spyOn(Utils.id.cuid, 'slug').mockReturnValue('id');

      const entity = createEntity();

      expect(
        entity.set(ENTITY_ID, [
          { path: 'path-1', value: 'value' },
          { path: 'path.nested', value: { 'child.id': '10' } },
        ])
      ).to.eql({
        query: {
          [pathGetter(ENTITY_ID, 'path-1')]: 'value',
          [pathGetter(ENTITY_ID, 'path.nested')]: { 'child.id': '10' },
        },
        operation: '$set',
        arrayFilters: [],
      });
    });

    it('creates set operation for array path', () => {
      vi.spyOn(Utils.id.cuid, 'slug').mockReturnValue('id');

      const entity = createEntity();

      expect(
        entity.set(ENTITY_ID, [
          { path: ['path', 'nested', 'value'], value: 'value' },
          { path: ['path', { 'parent.child': { id: 20 } }, '3'], value: 3 },
        ])
      ).to.eql({
        query: {
          [pathGetter(ENTITY_ID, 'path.nested.value')]: 'value',
          [pathGetter(ENTITY_ID, 'path.$[setid12id].3')]: 3,
        },
        operation: '$set',
        arrayFilters: [{ 'setid12id.parent.child': { id: 20 } }],
      });
    });
  });

  describe('setMany', () => {
    it('creates set operation for simple path', () => {
      vi.spyOn(Utils.id.cuid, 'slug').mockReturnValue('id');

      const entity = createEntity();

      expect(
        entity.setMany([
          {
            entityID: ENTITY_ID,
            sets: [
              { path: 'path-1', value: 'value' },
              { path: 'path.nested', value: { 'child.id': '10' } },
            ],
          },
          {
            entityID: ENTITY_SECOND_ID,
            sets: [
              { path: 'path-1', value: 'value' },
              { path: 'path.nested', value: { 'child.id': '10' } },
            ],
          },
        ])
      ).to.eql({
        query: {
          [pathGetter(ENTITY_ID, 'path-1')]: 'value',
          [pathGetter(ENTITY_ID, 'path.nested')]: { 'child.id': '10' },
          [pathGetter(ENTITY_SECOND_ID, 'path-1')]: 'value',
          [pathGetter(ENTITY_SECOND_ID, 'path.nested')]: { 'child.id': '10' },
        },
        operation: '$set',
        arrayFilters: [],
      });
    });

    it('creates set operation for array path', () => {
      vi.spyOn(Utils.id.cuid, 'slug').mockReturnValueOnce('id1').mockReturnValueOnce('id').mockReturnValueOnce('id2').mockReturnValueOnce('id');

      const entity = createEntity();

      expect(
        entity.setMany([
          {
            entityID: ENTITY_ID,
            sets: [
              { path: ['path', 'nested', 'value'], value: 'value' },
              { path: ['path', { 'parent.child': { id: 20 } }, '3'], value: 3 },
            ],
          },
          {
            entityID: ENTITY_SECOND_ID,
            sets: [
              { path: ['path', 'nested', 'value'], value: 'value' },
              { path: ['path', { 'parent.child': { id: 20 } }, '3'], value: 3 },
            ],
          },
        ])
      ).to.eql({
        query: {
          [pathGetter(ENTITY_ID, 'path.nested.value')]: 'value',
          [pathGetter(ENTITY_ID, 'path.$[setid112id].3')]: 3,
          [pathGetter(ENTITY_SECOND_ID, 'path.nested.value')]: 'value',
          [pathGetter(ENTITY_SECOND_ID, 'path.$[setid212id].3')]: 3,
        },
        operation: '$set',
        arrayFilters: [{ 'setid112id.parent.child': { id: 20 } }, { 'setid212id.parent.child': { id: 20 } }],
      });
    });
  });

  describe('unset', () => {
    it('creates unset operation for simple path', () => {
      vi.spyOn(Utils.id.cuid, 'slug').mockReturnValueOnce('id');

      const entity = createEntity();

      expect(entity.unset(ENTITY_ID, [{ path: 'path-1' }, { path: 'path-2' }])).to.eql({
        query: {
          [pathGetter(ENTITY_ID, 'path-1')]: 1,
          [pathGetter(ENTITY_ID, 'path-2')]: 1,
        },
        operation: '$unset',
        arrayFilters: [],
      });
    });

    it('creates unset operation for array path', () => {
      vi.spyOn(Utils.id.cuid, 'slug').mockReturnValue('id');

      const entity = createEntity();

      expect(entity.unset(ENTITY_ID, [{ path: ['path', 'nested', 'value'] }, { path: ['path', { 'parent.child': { id: 20 } }, '3'] }])).to.eql({
        query: {
          [pathGetter(ENTITY_ID, 'path.nested.value')]: 1,
          [pathGetter(ENTITY_ID, 'path.$[unsetid12id].3')]: 1,
        },
        operation: '$unset',
        arrayFilters: [{ 'unsetid12id.parent.child': { id: 20 } }],
      });
    });
  });

  describe('unsetMany', () => {
    it('creates unset operation for simple path', () => {
      vi.spyOn(Utils.id.cuid, 'slug').mockReturnValue('id');

      const entity = createEntity();

      expect(
        entity.unsetMany([
          { entityID: ENTITY_ID, unsets: [{ path: 'path-1' }, { path: 'path-2' }] },
          { entityID: ENTITY_SECOND_ID, unsets: [{ path: 'path-1' }, { path: 'path-2' }] },
        ])
      ).to.eql({
        query: {
          [pathGetter(ENTITY_ID, 'path-1')]: 1,
          [pathGetter(ENTITY_ID, 'path-2')]: 1,
          [pathGetter(ENTITY_SECOND_ID, 'path-1')]: 1,
          [pathGetter(ENTITY_SECOND_ID, 'path-2')]: 1,
        },
        operation: '$unset',
        arrayFilters: [],
      });
    });

    it('creates unset operation for array path', () => {
      vi.spyOn(Utils.id.cuid, 'slug').mockReturnValueOnce('id1').mockReturnValueOnce('id').mockReturnValueOnce('id2').mockReturnValueOnce('id');

      const entity = createEntity();

      expect(
        entity.unsetMany([
          {
            entityID: ENTITY_ID,
            unsets: [{ path: ['path', 'nested', 'value'] }, { path: ['path', { 'parent.child': { id: 20 } }, '3'] }],
          },
          {
            entityID: ENTITY_SECOND_ID,
            unsets: [{ path: ['path', 'nested', 'value'] }, { path: ['path', { 'parent.child': { id: 20 } }, '3'] }],
          },
        ])
      ).to.eql({
        query: {
          [pathGetter(ENTITY_ID, 'path.nested.value')]: 1,
          [pathGetter(ENTITY_ID, 'path.$[unsetid112id].3')]: 1,
          [pathGetter(ENTITY_SECOND_ID, 'path.nested.value')]: 1,
          [pathGetter(ENTITY_SECOND_ID, 'path.$[unsetid212id].3')]: 1,
        },
        operation: '$unset',
        arrayFilters: [{ 'unsetid112id.parent.child': { id: 20 } }, { 'unsetid212id.parent.child': { id: 20 } }],
      });
    });
  });
});
