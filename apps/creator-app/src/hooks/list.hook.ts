import { useLinkedState } from './state.hook';

export const useIsListEmpty = <Item>(items: Item[], isItemEmpty: (item: Item) => boolean) => {
  const [isListEmpty, setIsListEmpty] = useLinkedState(items, () => !items.length || items.every(isItemEmpty));

  const onListItemEmpty = (index: number) => (isEmpty: boolean) => {
    setIsListEmpty(!items.length || (isEmpty && items.every((item, i) => (i === index ? isEmpty : isItemEmpty(item)))));
  };

  return [isListEmpty, onListItemEmpty] as const;
};
