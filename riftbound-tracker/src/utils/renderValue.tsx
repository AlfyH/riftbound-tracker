import React from 'react';

const LINE_STYLE: React.CSSProperties = {
  display: 'inline-block',
  lineHeight: 'inherit',
  paddingBottom: '4px',
  paddingTop: '4px',
};

export function renderValue(value: number): React.ReactNode {
  return String(value).split('').map((digit, i) => {
    if (digit === '6') return <span key={`${i}-6`} style={{ ...LINE_STYLE, borderBottom: '2px solid currentColor' }}>{digit}</span>;
    if (digit === '9') return <span key={`${i}-9`} style={{ ...LINE_STYLE, borderBottom: '2px solid currentColor' }}>{digit}</span>;
    return <React.Fragment key={i}>{digit}</React.Fragment>;
  });
}
