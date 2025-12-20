import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import NameTransliterator from './NameTransliterator';

describe('NameTransliterator', () => {
  it('shows mapped name for default input', () => {
    render(<NameTransliterator />);
    expect(screen.getByText('Result:')).toBeInTheDocument();
    expect(screen.getByText('Ahmed Nabil')).toBeInTheDocument();
  });

  it('transliterates text mode', () => {
    render(<NameTransliterator />);
    // switch to text mode
    const textRadio = screen.getByLabelText(/Text/i);
    fireEvent.click(textRadio);

    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'Welcome John Doe and Alice Smith.' } });

    expect(screen.getByText('Welcome Ahmed Nabil and Amina Hassan.')).toBeInTheDocument();
  });
});
