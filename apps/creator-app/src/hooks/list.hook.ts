import { useLinkedState } from './state.hook';

export const useIsListEmpty = <Item>(items: Item[], isItemEmpty: (item: Item) => boolean) => {
  const [value, setValue] = useLinkedState(items, () => !items.length || items.every(isItemEmpty));

  const container = (index: number) => (isEmpty: boolean) => {
    setValue(!items.length || (isEmpty && items.every((item, i) => (i === index ? isEmpty : isItemEmpty(item)))));
  };

  return {
    value,
    container,
  };
};
