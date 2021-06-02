import React from 'react';
import { Popper } from 'react-popper';

import Box from '@/components/Box';
import Flex from '@/components/Flex';
import Portal from '@/components/Portal';
import Text from '@/components/Text';
import { useThrottledCallback } from '@/hooks';
import { Point } from '@/types';
import { buildVirtualElement } from '@/utils/dom';

import { ChartContainer, LegendItem, Piece, PieceContainer, TooltipContainer, TooltipContent } from './components';

export type DonutDataItem = {
  key: string;
  color: string;
  value: number;
};

export type DonutChartProps<T extends DonutDataItem> = {
  data: T[];
  size?: number;
  legend?: Record<string, { label: string; gradient: string }>;
  renderTooltip?: (data: T) => React.ReactNode;
};

const DonutChart = <T extends DonutDataItem>({ size = 150, data, legend, renderTooltip }: DonutChartProps<T>) => {
  const [hoveredKey, setHoveredKey] = React.useState<null | string>(null);
  const [virtualElement, setVirtualElement] = React.useState<ReturnType<typeof buildVirtualElement>>(() => buildVirtualElement([0, 0] as Point));

  const debounsedSetVirtualElement = useThrottledCallback(50, (clientX: number, clientY: number) =>
    setVirtualElement(buildVirtualElement([clientX, clientY] as Point))
  );

  const maxValue = React.useMemo(() => data.reduce((acc, { value }) => acc + value, 0), [data]);
  const hoveredData = React.useMemo(() => data.find(({ key }) => key === hoveredKey)!, [hoveredKey]);

  const percents = React.useMemo(() => {
    let percentsLeft = 100;
    const arr: number[] = [];

    // filling percents array only integer values
    data.forEach(({ value }, index) => {
      const percent = Math.floor((value / maxValue) * 100);

      if (index !== data.length - 1) {
        percentsLeft -= percent;
        arr.push(percent);
      } else {
        arr.push(percentsLeft);
      }
    });

    return arr;
  }, [data]);

  const onMouseMove = (event: React.MouseEvent) => {
    if (hoveredKey) {
      event?.preventDefault();
      event?.stopPropagation();

      debounsedSetVirtualElement(event.clientX, event.clientY);
    }
  };

  let renderedPercents = 0;

  return (
    <Flex fullWidth>
      <ChartContainer size={size} onMouseMove={onMouseMove} onMouseLeave={() => setHoveredKey(null)}>
        {data.map(({ key, color }, index) => {
          const percent = percents[index];
          const initialRotate = 3.6 * renderedPercents;

          renderedPercents += percent;

          const piceSharedProps = {
            isHovered: key === hoveredKey,
            onMouseEnter: () => setHoveredKey(key),
          };

          return !percent ? null : (
            <React.Fragment key={key}>
              {percent > 50 ? (
                <>
                  <PieceContainer rotate={initialRotate}>
                    <Piece {...piceSharedProps} border={false} rotate={0} color={color} />
                  </PieceContainer>

                  <PieceContainer rotate={180 + initialRotate}>
                    <Piece {...piceSharedProps} border={percent !== 100} rotate={3.6 * percent} color={color} />
                  </PieceContainer>
                </>
              ) : (
                <PieceContainer rotate={initialRotate}>
                  <Piece {...piceSharedProps} border={!!percent} rotate={180 + 3.6 * percent} color={color} />
                </PieceContainer>
              )}
            </React.Fragment>
          );
        })}
      </ChartContainer>

      {!!legend && (
        <Box flex={1} ml={20}>
          {data.map(({ key, color }, index) => (
            <LegendItem key={index} color={color} gradient={legend[key].gradient}>
              <Text>{legend[key].label}</Text>
              <Text color="#62778c" textAlign="right">
                {percents[index]}%
              </Text>
            </LegendItem>
          ))}
        </Box>
      )}

      {!!hoveredKey && !!renderTooltip && (
        <Portal portalNode={document.body}>
          <Popper
            modifiers={{ offset: { offset: '-5,15' }, preventOverflow: { boundariesElement: document.body } }}
            placement="bottom-start"
            referenceElement={virtualElement}
          >
            {({ ref, style, placement }) => (
              <TooltipContainer ref={ref} style={style} data-placement={placement}>
                <TooltipContent>{renderTooltip(hoveredData)}</TooltipContent>
              </TooltipContainer>
            )}
          </Popper>
        </Portal>
      )}
    </Flex>
  );
};

export default DonutChart;
