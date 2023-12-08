const DARK_MEMBER_COLORS = ['dark', 'darkFern', 'darkHibiscus', 'darkCopper', 'darkHavelock'] as const;
const LIGHT_MEMBER_COLORS = ['base', 'fern', 'hibiscus', 'copper', 'havelock'] as const;

type MemberColorVariant = 'dark' | 'light';

export const getMemberColorList = (variant: MemberColorVariant = 'dark') => (variant === 'dark' ? DARK_MEMBER_COLORS : LIGHT_MEMBER_COLORS);

export const isMemberColorImage = (image?: string | null): image is string => image?.length === 13 && image.includes('|');

export const getMemberColorByCreatorID = (creatorID: number, variant: MemberColorVariant = 'dark') => {
  const list = getMemberColorList(variant);

  return list[creatorID % list.length];
};

export const getMemberColorByLoguxNodeID = (loguxNodeID: string, variant: MemberColorVariant = 'dark') => {
  const list = getMemberColorList(variant);

  const index =
    loguxNodeID
      .split('')
      .map((c) => c.charCodeAt(0))
      .reduce((acc, code) => acc + code) % list.length;

  return list[index];
};
