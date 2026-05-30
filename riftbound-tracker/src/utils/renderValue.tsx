import React from 'react';

const LINE_STYLE: React.CSSProperties = {
  textDecoration: 'underline',
  textUnderlineOffset: '0.2em',
  textDecorationThickness: '0.08em',
};

export function renderValue(value: number): React.ReactNode {
  return String(value).split('').map((digit, i) => {
    if (digit === '6') return <span key={`${i}-6`} style={LINE_STYLE}>{digit}</span>;
    if (digit === '9') return <span key={`${i}-9`} style={LINE_STYLE}>{digit}</span>;
    return <React.Fragment key={i}>{digit}</React.Fragment>;
  });
}
