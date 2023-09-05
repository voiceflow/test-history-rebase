const MEMBER_COLORS = ['base', 'fern', 'hibiscus', 'copper', 'havelock', 'dark', 'darkFern', 'darkHibiscus', 'darkCopper', 'darkHavelock'] as const;

export const isMemberColorImage = (image?: string | null): image is string => image?.length === 13 && image.includes('|');

export const getMemberColorByCreatorID = (creatorID: number) => MEMBER_COLORS[creatorID % MEMBER_COLORS.length];

export const getMemberColorByLoguxNodeID = (loguxNodeID: string) => {
  const index =
    loguxNodeID
      .split('')
      .map((c) => c.charCodeAt(0))
      .reduce((acc, code) => acc + code) % MEMBER_COLORS.length;

  return MEMBER_COLORS[index];
};
