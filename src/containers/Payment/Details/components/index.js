import Tab from '@/componentsV2/Tabs/components/Tab';
import { styled } from '@/hocs';

export const Container = styled.div``;
export const ContentContainer = styled.div`
  min-height: 560px;
  overflow: hidden;
`;
export const TabContainer = styled.div`
  display: inline-block;
  padding-top: 4px;
`;

export const PlanTab = styled(Tab)`
  padding: 0 16px;
`;

export const TabPriceContainer = styled.div`
  display: inline-block;
  border: 1px solid #dfe3ed;
  border-radius: 5px;
  color: black;
  padding: 2px 6px;
  margin-left: 10px;
  font-weight: 400;
  color: #62778c;
  font-size: 13px;
`;

export const DollarText = styled.span`
  color: black;
`;

export const TabsContainer = styled.div`
  padding: 0 16px;
  border-bottom: 1px solid #ecf1f5;
  button {
    padding: 10px 0;
    flex: 1;
  }
`;

export const ImagesContainer = styled.div`
  margin-bottom: 12px;
  min-height: 225px;
  padding-top: 5px;
`;

export const DetailsSection = styled.div`
  display: flex;
  padding: 12px 32px;
`;

export const LeftSection = styled.div`
  flex: 2;
  padding-right: 30px;
`;

export const RightSection = styled.div`
  flex: 1;
`;

export const Headline = styled.h2`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 12px;
`;

export const PlanDescription = styled.p`
  color: #62778c;
  font-size: 15px;
`;

export const HighlightsText = styled.div`
  color: #62778c;
  margin-bottom: 10px;
  font-weight: 600;
`;

export const Highlight = styled.div`
  color: #62778c;
  margin-bottom: 4px;
  font-size: 13px;
`;

export const PlanTypeBubbleContainer = styled.div`
  padding: 0 32px;
`;
