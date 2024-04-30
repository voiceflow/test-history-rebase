import { screen } from '@testing-library/react';
import { Utils } from '@voiceflow/common';
import { describe, expect, it } from 'vitest';

import { renderThemed } from '@/test/theme';

import { BlockText, ClickableText, Description, Label, Link, Text, Title } from '.';

describe('Text', () => {
  it('renders Text content', () => {
    const text = Utils.generate.string();
    renderThemed(<Text>{text}</Text>);

    expect(screen.getByText(text)).toBeInTheDocument();
  });

  it('renders BlockText content', () => {
    const text = Utils.generate.string();
    renderThemed(<BlockText>{text}</BlockText>);

    expect(screen.getByText(text)).toBeInTheDocument();
  });

  it('renders Title content', () => {
    const text = Utils.generate.string();
    renderThemed(<Title>{text}</Title>);

    expect(screen.getByText(text)).toBeInTheDocument();
  });

  it('renders Label content', () => {
    const text = Utils.generate.string();
    renderThemed(<Label>{text}</Label>);

    expect(screen.getByText(text)).toBeInTheDocument();
  });

  it('renders Description content', () => {
    const text = Utils.generate.string();
    renderThemed(<Description>{text}</Description>);

    expect(screen.getByText(text)).toBeInTheDocument();
  });

  it('renders ClickableText', () => {
    const text = Utils.generate.string();
    renderThemed(<ClickableText>{text}</ClickableText>);

    const clickableText = screen.getByText(text);

    expect(clickableText).toHaveStyle({ color: '#3d82e2', cursor: 'pointer' });
  });

  it('renders ClickableText with custom color', () => {
    const text = Utils.generate.string();
    const color = '#ff69b4';
    renderThemed(<ClickableText color={color}>{text}</ClickableText>);

    expect(screen.getByText(text)).toHaveStyle({ color });
  });

  it('renders Link', () => {
    const text = Utils.generate.string();
    renderThemed(<Link>{text}</Link>);

    expect(screen.getByText(text)).toHaveStyle({ color: '#3d82e2' });
  });

  it('renders Link with custom color', () => {
    const text = Utils.generate.string();
    const color = '#ff69b4';
    renderThemed(<Link color={color}>{text}</Link>);

    expect(screen.getByText(text)).toHaveStyle({ color });
  });

  it('renders Link with no schema', () => {
    const text = Utils.generate.string();
    const url = Utils.generate.id();
    renderThemed(<Link href={url}>{text}</Link>);

    expect(screen.getByText(text).getAttribute('href')).toEqual(`//${url}`);
  });

  it('renders Link with schema', () => {
    const text = Utils.generate.string();
    const url = `https://${Utils.generate.id()}/`;
    renderThemed(<Link href={url}>{text}</Link>);

    expect(screen.getByText(text).getAttribute('href')).toEqual(url);
  });
});
