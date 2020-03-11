import { PlatformType } from '@/constants';
import { NewBlockProps } from '@/pages/Canvas/components/Block/NewBlock';
import { Command } from '@/pages/Canvas/managers/Command/CommandStep';

export type BaseStartBlockProps = Omit<NewBlockProps, 'name'> & {
  platform?: PlatformType;
  invocationName?: string;
} & ({ commands?: never; onCommandClick?: never } | { commands: Command[]; onCommandClick: (id: string) => void });
