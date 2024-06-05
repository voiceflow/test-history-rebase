import suite from '@/../test/_suite';
import { mapSort } from '@/utils/array.util';

suite('utils/array', () => {

  const arr = [
    {id: '111', name: 'Tupac'},
    {id: '222', name: 'Biggie'},
    {id: '333', name: 'Dr. Dre'}
  ];

  describe('mapSort', () => {
    it('should sort array by id', () => {
      const order = ['222', '111', '333'];

      mapSort(arr, order, 'id');
    });

    it('should ignore objects that arent in the order array', () => {
      // const order = ['333', '111'];
    });
  });
});
