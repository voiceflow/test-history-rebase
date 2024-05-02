import { Utils } from '@voiceflow/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import * as Atomic from '@/legacy/models/utils/atomic';

describe('Models | Utils | Atomic', () => {
  beforeEach(() => {
    vi.spyOn(Utils.id.cuid, 'slug').mockReturnValue('id');
  });

  describe('pull', () => {
    it('creates pull operation', () => {
      expect(
        Atomic.pull([
          { path: 'path-1', match: 'value' },
          { path: 'path-2', match: { id: 10 } },
          { path: 'path.nested', match: { 'child.id': '10' } },
        ])
      ).toEqual({
        query: {
          'path-1': 'value',
          'path-2': { id: 10 },
          'path.nested': { 'child.id': '10' },
        },
        operation: '$pull',
        arrayFilters: [],
      });
    });
  });

  describe('push', () => {
    it('creates push operation for single value', () => {
      expect(
        Atomic.push([
          { path: 'path-1', value: 'value' },
          { path: 'path-2', value: { id: 10 }, index: null },
          { path: 'path-3', value: 3, index: 0 },
          { path: 'path.nested', value: { 'child.id': '10' }, index: 10 },
        ])
      ).toEqual({
        query: {
          'path-1': { $each: ['value'] },
          'path-2': { $each: [{ id: 10 }] },
          'path-3': { $each: [3], $position: 0 },
          'path.nested': { $each: [{ 'child.id': '10' }], $position: 10 },
        },
        operation: '$push',
        arrayFilters: [],
      });
    });

    it('creates push operation for multiple values', () => {
      expect(
        Atomic.push([
          { path: 'path-1', value: ['value-1', 'value-2'] },
          { path: 'path-2', value: [{ id: 10 }, { id: 0 }], index: null },
          { path: 'path-3', value: [3], index: 0 },
          { path: 'path.nested', value: [], index: 10 },
        ])
      ).toEqual({
        query: {
          'path-1': { $each: ['value-1', 'value-2'] },
          'path-2': { $each: [{ id: 10 }, { id: 0 }] },
          'path-3': { $each: [3], $position: 0 },
        },
        operation: '$push',
        arrayFilters: [],
      });
    });
  });

  describe('set', () => {
    it('creates set operation for simple path', () => {
      expect(
        Atomic.set([
          { path: 'path-1', value: 'value' },
          { path: 'path-2', value: { id: 10 } },
          { path: 'path-3', value: 3 },
          { path: 'path.nested', value: { 'child.id': '10' } },
        ])
      ).toEqual({
        query: {
          'path-1': 'value',
          'path-2': { id: 10 },
          'path-3': 3,
          'path.nested': { 'child.id': '10' },
        },
        operation: '$set',
        arrayFilters: [],
      });
    });

    it('creates set operation for array path', () => {
      expect(
        Atomic.set([
          { path: ['path', 'nested', 'value'], value: 'value' },
          { path: ['path', { id: 0 }], value: 'value' },
          { path: ['path', { value: 2 }, 'child'], value: { id: 10 } },
          { path: ['path', { 'parent.child': { id: 20 } }, '3'], value: 3 },
        ])
      ).toEqual({
        query: {
          'path.nested.value': 'value',
          'path.$[setid11id]': 'value',
          'path.$[setid31id].3': 3,
          'path.$[setid21id].child': { id: 10 },
        },
        operation: '$set',
        arrayFilters: [{ 'setid11id.id': 0 }, { 'setid21id.value': 2 }, { 'setid31id.parent.child': { id: 20 } }],
      });
    });

    it('creates set operation for array path with operation id', () => {
      expect(
        Atomic.set(
          [
            { path: ['path', 'nested', 'value'], value: 'value' },
            { path: ['path', { id: 0 }], value: 'value' },
            { path: ['path', { value: 2 }, 'child'], value: { id: 10 } },
            { path: ['path', { 'parent.child': { id: 20 } }, '3'], value: 3 },
          ],
          'operation-id'
        )
      ).toEqual({
        query: {
          'path.nested.value': 'value',
          'path.$[setoperationid11id]': 'value',
          'path.$[setoperationid31id].3': 3,
          'path.$[setoperationid21id].child': { id: 10 },
        },
        operation: '$set',
        arrayFilters: [
          { 'setoperationid11id.id': 0 },
          { 'setoperationid21id.value': 2 },
          { 'setoperationid31id.parent.child': { id: 20 } },
        ],
      });
    });
  });

  describe('unset', () => {
    it('creates unset operation for simple path', () => {
      expect(
        Atomic.unset([{ path: 'path-1' }, { path: 'path-2' }, { path: 'path-3' }, { path: 'path.nested' }])
      ).toEqual({
        query: {
          'path-1': 1,
          'path-2': 1,
          'path-3': 1,
          'path.nested': 1,
        },
        operation: '$unset',
        arrayFilters: [],
      });
    });

    it('creates unset operation for array path', () => {
      expect(
        Atomic.unset([
          { path: ['path', 'nested', 'value'] },
          { path: ['path', { id: 0 }] },
          { path: ['path', { value: 2 }, 'child'] },
          { path: ['path', { 'parent.child': { id: 20 } }, '3'] },
        ])
      ).toEqual({
        query: {
          'path.nested.value': 1,
          'path.$[unsetid11id]': 1,
          'path.$[unsetid31id].3': 1,
          'path.$[unsetid21id].child': 1,
        },
        operation: '$unset',
        arrayFilters: [{ 'unsetid11id.id': 0 }, { 'unsetid21id.value': 2 }, { 'unsetid31id.parent.child': { id: 20 } }],
      });
    });

    it('creates unset operation for array path with operation id', () => {
      expect(
        Atomic.unset(
          [
            { path: ['path', 'nested', 'value'] },
            { path: ['path', { id: 0 }] },
            { path: ['path', { value: 2 }, 'child'] },
            { path: ['path', { 'parent.child': { id: 20 } }, '3'] },
          ],
          'operation-id'
        )
      ).toEqual({
        query: {
          'path.nested.value': 1,
          'path.$[unsetoperationid11id]': 1,
          'path.$[unsetoperationid31id].3': 1,
          'path.$[unsetoperationid21id].child': 1,
        },
        operation: '$unset',
        arrayFilters: [
          { 'unsetoperationid11id.id': 0 },
          { 'unsetoperationid21id.value': 2 },
          { 'unsetoperationid31id.parent.child': { id: 20 } },
        ],
      });
    });
  });
});
