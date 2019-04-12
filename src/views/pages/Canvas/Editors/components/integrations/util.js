
const draftIsEmpty = (rawDraft) => {
  const blankText = (!rawDraft || ( rawDraft.blocks && rawDraft.blocks.length === 1 && !rawDraft.blocks[0].text.trim() ))
  return blankText
}


module.exports = {
  draftIsEmpty
}