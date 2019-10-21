import React from 'react';

export const BlockTitleContext = React.createContext(null);
export const { Consumer: BlockTitleConsumer } = BlockTitleContext;

export const BlockTitleProvider = ({ value, children }) => {
  const [title, setTitle] = React.useState(value);

  const updateTitle = (newTitle) => setTitle(newTitle || value);

  return <BlockTitleContext.Provider value={{ title, update: updateTitle }}>{children}</BlockTitleContext.Provider>;
};

export const BlockTitle = ({ children }) => {
  const blockTitle = React.useContext(BlockTitleContext);

  React.useEffect(() => {
    blockTitle.update(children);

    return () => blockTitle.update(null);
  }, [children]);

  return null;
};
