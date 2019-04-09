import DragDropBackend from './DragDropBackend';
import getEmptyImage from './getEmptyImage';
import * as NativeTypes from './NativeTypes';

export { NativeTypes, getEmptyImage };

export default function createDragDropBackend(manager) {
    return new DragDropBackend(manager)
}