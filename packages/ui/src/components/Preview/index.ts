import PreviewButtonIcon from './components/ButtonIcon';
import PreviewCode from './components/Code';
import PreviewContainer from './components/Container';
import PreviewContent from './components/Content';
import PreviewContentItem from './components/ContentItem';
import PreviewFooter from './components/Footer';
import PreviewHeader from './components/Header';
import PreviewPopover from './components/Popover';
import PreviewText from './components/Text';
import PreviewTitle from './components/Title';

export default Object.assign(PreviewContainer, {
  ButtonIcon: PreviewButtonIcon,
  Title: PreviewTitle,
  Text: PreviewText,
  Footer: PreviewFooter,
  Header: PreviewHeader,
  Content: PreviewContent,
  ContentItem: PreviewContentItem,
  Code: PreviewCode,
  Popover: PreviewPopover,
});
