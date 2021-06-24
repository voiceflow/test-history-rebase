import { BoxFlexCenter } from '@voiceflow/ui';
import React from 'react';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';

export type PaginationSectionProps = {
  pageCount: number;
  currentPage: number;
  handleClick: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, page: number) => void;
};

const PaginationSection: React.FC<PaginationSectionProps> = ({ pageCount, currentPage, handleClick }) => (
  <BoxFlexCenter mr={60}>
    <Pagination>
      <PaginationItem disabled={currentPage <= 0}>
        <PaginationLink onClick={(e) => handleClick(e, currentPage - 1)} previous href="#" />
      </PaginationItem>
      {Array.from({ length: pageCount }).map((_, index) => (
        <PaginationItem active={index === currentPage} key={index}>
          <PaginationLink onClick={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => handleClick(e, index)} href="#">
            {index + 1}
          </PaginationLink>
        </PaginationItem>
      ))}
      <PaginationItem disabled={currentPage >= pageCount - 1}>
        <PaginationLink onClick={(e) => handleClick(e, currentPage + 1)} next href="#" />
      </PaginationItem>
    </Pagination>
  </BoxFlexCenter>
);

export default PaginationSection;
