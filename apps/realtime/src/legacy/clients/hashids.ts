import BaseHashids from 'hashids/esm/hashids';

class Hashids extends BaseHashids {
  decode(hash: string): number[] {
    return super.decode(hash) as number[];
  }
}

export default Hashids;
