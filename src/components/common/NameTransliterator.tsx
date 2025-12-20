import React, { useState } from 'react';
import { translateName, replaceNamesInText } from '../../utils/nameMap';

export default function NameTransliterator() {
  const [input, setInput] = useState('John Doe');
  const [mode, setMode] = useState<'single' | 'text'>('single');

  const result = mode === 'single' ? translateName(input) : replaceNamesInText(input);

  return (
    <div style={{ border: '1px solid #ddd', padding: 12, borderRadius: 6, maxWidth: 600 }}>
      <h3 style={{ marginTop: 0 }}>Name Transliterator</h3>

      <div style={{ marginBottom: 8 }}>
        <label style={{ marginRight: 8 }}>
          <input
            type="radio"
            checked={mode === 'single'}
            onChange={() => setMode('single')}
            /> Single name
        </label>
        <label>
          <input
            type="radio"
            checked={mode === 'text'}
            onChange={() => setMode('text')}
            /> Text
        </label>
      </div>

      <textarea
        rows={mode === 'single' ? 1 : 3}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ width: '100%', marginBottom: 8 }}
      />

      <div>
        <strong>Result:</strong>
        <div style={{ marginTop: 6, padding: 8, background: '#f7f7f7', borderRadius: 4 }}>{result}</div>
      </div>

      <div style={{ marginTop: 10, fontSize: 12, color: '#666' }}>
        Tip: Type a name like <code>John Doe</code> or a sentence containing mapped names.
      </div>
    </div>
  );
}
