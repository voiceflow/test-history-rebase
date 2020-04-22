import { BlockType, PlatformType } from '@/constants';
import { Port } from '@/models';

const PortLabels: Partial<Record<BlockType, (port: Port, index: number, platform: PlatformType) => string | number | null>> = {
  [BlockType.RANDOM]: (_port, index) => index + 1,
  [BlockType.CHOICE]: (_port, index) => (index === 0 ? 'else' : index),
  [BlockType.IF]: (_port, index) => (index === 0 ? 'else' : index),
  [BlockType.CHOICE_OLD]: (_port, index) => (index === 0 ? 'else' : index),
  [BlockType.STREAM]: (_port, index, platform) => {
    if (platform !== PlatformType.ALEXA) {
      return null;
    }

    switch (index) {
      case 0:
        return 'next';
      case 1:
        return 'previous';
      case 2:
        return 'pause';
      default:
        return null;
    }
  },
};

export default PortLabels;
