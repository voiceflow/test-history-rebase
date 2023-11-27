import { Tokens, useCreateConst } from '@voiceflow/ui-next';
import sample from 'lodash/sample';

import { Project } from '@/ducks';
import { useSelector } from '@/hooks/store.hook';

export const useRandomCustomThemeColor = () => {
  const customThemes = useSelector(Project.active.customThemesSelector);

  return useCreateConst(
    () =>
      sample([
        ...customThemes.map(({ standardColor }) => standardColor),
        Tokens.colors.neutralDark.neutralsDark200,
        Tokens.colors.havelock.havelock500,
        Tokens.colors.hibiscus.hibiscus500,
        Tokens.colors.fern.fern500,
        Tokens.colors.copper.copper500,
      ]) ?? Tokens.colors.neutralDark.neutralsDark200
  );
};
