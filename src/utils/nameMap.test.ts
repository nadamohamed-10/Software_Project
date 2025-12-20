import { describe, it, expect } from 'vitest';
import { translateName, replaceNamesInText } from './nameMap';

describe('nameMap utilities', () => {
  it('translateName returns mapped name', () => {
    expect(translateName('John Doe')).toBe('Ahmed Nabil');
  });

  it('translateName returns original if not mapped', () => {
    expect(translateName('Unmapped Person')).toBe('Unmapped Person');
  });

  it('replaceNamesInText replaces occurrences in text', () => {
    const input = 'Hello John Doe, meet Alice Smith.';
    const output = replaceNamesInText(input);
    expect(output).toBe('Hello Ahmed Nabil, meet Amina Hassan.');
  });

  it('replaceNamesInText does not partially replace other words', () => {
    const input = 'Johnathon is not John Doe';
    const output = replaceNamesInText(input);
    expect(output).toBe('Johnathon is not Ahmed Nabil');
  });
});
