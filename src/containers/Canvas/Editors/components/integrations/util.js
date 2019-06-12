const draftIsEmpty = (rawDraft) => {
  return !rawDraft || (rawDraft.blocks && rawDraft.blocks.length === 1 && !rawDraft.blocks[0].text.trim());
};

module.exports = {
  draftIsEmpty,
};
