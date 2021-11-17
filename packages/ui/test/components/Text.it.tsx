import { render, screen } from '@testing-library/react';
import { BlockText, ClickableText, Description, Label, Link, Text, Title } from '@ui/components/Text';
import THEME from '@ui/styles/theme';
import { generate } from '@ui/utils';
import React from 'react';

import { ThemeProvider } from '../_utils';

it('renders Text content', () => {
  const text = generate.string();
  render(<Text>{text}</Text>, { wrapper: ThemeProvider });

  expect(screen.getByText(text)).toBeInTheDocument();
});

it('renders BlockText content', () => {
  const text = generate.string();
  render(<BlockText>{text}</BlockText>, { wrapper: ThemeProvider });

  expect(screen.getByText(text)).toBeInTheDocument();
});

it('renders Title content', () => {
  const text = generate.string();
  render(<Title>{text}</Title>, { wrapper: ThemeProvider });

  expect(screen.getByText(text)).toBeInTheDocument();
});

it('renders Label content', () => {
  const text = generate.string();
  render(<Label>{text}</Label>, { wrapper: ThemeProvider });

  expect(screen.getByText(text)).toBeInTheDocument();
});

it('renders Description content', () => {
  const text = generate.string();
  render(<Description>{text}</Description>, { wrapper: ThemeProvider });

  expect(screen.getByText(text)).toBeInTheDocument();
});

it('renders ClickableText', () => {
  const text = generate.string();
  render(<ClickableText>{text}</ClickableText>, { wrapper: ThemeProvider });

  const clickableText = screen.getByText(text);

  expect(clickableText).toHaveStyleRule('color', THEME.colors.blue);
  expect(clickableText).toHaveStyleRule('cursor', 'pointer');
});

it('renders ClickableText with custom color', () => {
  const text = generate.string();
  const color = '#ff69b4';
  render(<ClickableText color={color}>{text}</ClickableText>, { wrapper: ThemeProvider });

  expect(screen.getByText(text)).toHaveStyleRule('color', color);
});

it('renders Link', () => {
  const text = generate.string();
  render(<Link>{text}</Link>, { wrapper: ThemeProvider });

  expect(screen.getByText(text)).toHaveStyleRule('color', THEME.colors.blue);
});

it('renders Link with custom color', () => {
  const text = generate.string();
  const color = '#ff69b4';
  render(<Link color={color}>{text}</Link>, { wrapper: ThemeProvider });

  expect(screen.getByText(text)).toHaveStyleRule('color', color);
});

it('renders Link with no schema', () => {
  const text = generate.string();
  const url = generate.id();
  render(<Link href={url}>{text}</Link>, { wrapper: ThemeProvider });

  expect(screen.getByText(text)).toHaveProperty('href', `http://${url}/`);
});

it('renders Link with schema', () => {
  const text = generate.string();
  const url = `https://${generate.id()}/`;
  render(<Link href={url}>{text}</Link>, { wrapper: ThemeProvider });

  expect(screen.getByText(text)).toHaveProperty('href', url);
});
