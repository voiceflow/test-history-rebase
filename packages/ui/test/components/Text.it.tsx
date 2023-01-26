import { render, screen } from '@testing-library/react';
import { BlockText, ClickableText, Description, Label, Link, Text, Title } from '@ui/components/Text';
import THEME from '@ui/styles/theme';
import { Utils } from '@voiceflow/common';
import React from 'react';

import suite from '../_suite';
import { ThemeProvider } from '../_utils';

suite('Text', () => {
  it('renders Text content', () => {
    const text = Utils.generate.string();
    render(<Text>{text}</Text>, { wrapper: ThemeProvider });

    expect(screen.getByText(text)).toBeInTheDocument();
  });

  it('renders BlockText content', () => {
    const text = Utils.generate.string();
    render(<BlockText>{text}</BlockText>, { wrapper: ThemeProvider });

    expect(screen.getByText(text)).toBeInTheDocument();
  });

  it('renders Title content', () => {
    const text = Utils.generate.string();
    render(<Title>{text}</Title>, { wrapper: ThemeProvider });

    expect(screen.getByText(text)).toBeInTheDocument();
  });

  it('renders Label content', () => {
    const text = Utils.generate.string();
    render(<Label>{text}</Label>, { wrapper: ThemeProvider });

    expect(screen.getByText(text)).toBeInTheDocument();
  });

  it('renders Description content', () => {
    const text = Utils.generate.string();
    render(<Description>{text}</Description>, { wrapper: ThemeProvider });

    expect(screen.getByText(text)).toBeInTheDocument();
  });

  it('renders ClickableText', () => {
    const text = Utils.generate.string();
    render(<ClickableText>{text}</ClickableText>, { wrapper: ThemeProvider });

    const clickableText = screen.getByText(text);

    expect(clickableText).toHaveStyleRule('color', '#3d82e2');
    expect(clickableText).toHaveStyleRule('cursor', 'pointer');
  });

  it('renders ClickableText with custom color', () => {
    const text = Utils.generate.string();
    const color = '#ff69b4';
    render(<ClickableText color={color}>{text}</ClickableText>, { wrapper: ThemeProvider });

    expect(screen.getByText(text)).toHaveStyleRule('color', color);
  });

  it('renders Link', () => {
    const text = Utils.generate.string();
    render(<Link>{text}</Link>, { wrapper: ThemeProvider });

    expect(screen.getByText(text)).toHaveStyleRule('color', '#3d82e2');
  });

  it('renders Link with custom color', () => {
    const text = Utils.generate.string();
    const color = '#ff69b4';
    render(<Link color={color}>{text}</Link>, { wrapper: ThemeProvider });

    expect(screen.getByText(text)).toHaveStyleRule('color', color);
  });

  it('renders Link with no schema', () => {
    const text = Utils.generate.string();
    const url = Utils.generate.id();
    render(<Link href={url}>{text}</Link>, { wrapper: ThemeProvider });

    expect(screen.getByText(text).getAttribute('href')).toEqual(`//${url}`);
  });

  it('renders Link with schema', () => {
    const text = Utils.generate.string();
    const url = `https://${Utils.generate.id()}/`;
    render(<Link href={url}>{text}</Link>, { wrapper: ThemeProvider });

    expect(screen.getByText(text).getAttribute('href')).toEqual(url);
  });
});
