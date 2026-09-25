'use client';

import React from 'react';
import styled, { keyframes } from 'styled-components';

const recordFlow = keyframes`
  0%, 18% {
    opacity: 1;
    translate: -50% -50%;
  }
  20%, 36% {
    opacity: 0;
    translate: -50% 1.6em;
  }
  100% {
    opacity: 0;
    translate: -50% 1.6em;
  }
`;

const laptopFlow = keyframes`
  0%, 24% {
    opacity: 0;
    translate: -50% -50%;
    transform: scale(0.9) rotateX(70deg);
  }
  28%, 46% {
    opacity: 1;
    translate: -50% -50%;
    transform: scale(1) rotateX(24deg);
  }
  50%, 100% {
    opacity: 0;
    translate: -50% -50%;
    transform: scale(0.94) rotateX(70deg);
  }
`;

const morphFlow = keyframes`
  0%, 24% {
    opacity: 0;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: var(--c);
    translate: -50% -50%;
    scale: 0;
  }
  28%, 48% {
    opacity: 1;
    width: 1.35em;
    height: 1.35em;
    border-radius: 50%;
    background: var(--c);
    translate: -50% -50%;
    scale: 1;
  }
  52%, 74% {
    opacity: 1;
    width: 1.55em;
    height: 1.55em;
    border-radius: 50%;
    background: transparent;
    border: 0.16em solid #000;
    translate: -50% -50%;
    scale: 1;
  }
  78%, 100% {
    opacity: 0;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: transparent;
    border: 0.16em solid transparent;
    translate: -50% -50%;
    scale: 0;
  }
`;

const recordBlink = keyframes`
  0% {
    opacity: 0.8;
    scale: 0.95;
  }
  100% {
    opacity: 1;
    scale: 1.05;
  }
`;

const ringFlow = keyframes`
  0%, 24% {
    opacity: 0;
    scale: 0.7;
  }
  52%, 74% {
    opacity: 1;
    scale: 1;
  }
  78%, 100% {
    opacity: 0;
    scale: 0.7;
  }
`;

const triangleFlow = keyframes`
  0%, 24% {
    opacity: 0;
    scale: 0;
  }
  52%, 74% {
    opacity: 1;
    scale: 1;
  }
  78%, 100% {
    opacity: 0;
    scale: 0;
  }
`;

const LoaderShell = styled.div`
  --c: #22c55e;
  position: relative;
  width: 8em;
  height: 8em;
  font-size: 1.4rem;
  color: var(--c);
  isolation: isolate;
`;

const RecordGroup = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  display: flex;
  align-items: center;
  gap: 0.65em;
  opacity: 1;
  translate: -50% -50%;
  animation: ${recordFlow} 3s ease-in-out infinite;
`;

const RecordDot = styled.span`
  position: relative;
  width: 1.05em;
  height: 1.05em;
  border-radius: 50%;
  background: var(--c);
  box-shadow: 0 0 0 0.14em var(--c);
  opacity: 0.9;
  animation: ${recordBlink} 0.8s ease-in-out infinite alternate;
`;

const RecordLabel = styled.span`
  font-size: 1.1em;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--c);
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
`;

const LaptopIcon = styled.svg`
  position: absolute;
  left: 50%;
  top: 50%;
  width: 2.3em;
  height: 2.1em;
  color: var(--c);
  translate: -50% -50%;
  opacity: 0;
  transform-style: preserve-3d;
  perspective: 12em;
  animation: ${laptopFlow} 3s ease-in-out infinite;
`;

const MorphStage = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: var(--c);
  translate: -50% -50%;
  opacity: 0;
  box-sizing: border-box;
  animation: ${morphFlow} 3s ease-in-out infinite;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border: 0.16em solid #000;
    border-radius: 50%;
    opacity: 0;
    transform: scale(0.7);
    animation: ${ringFlow} 3s ease-in-out infinite;
  }

  &::after {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    width: 0;
    height: 0;
    border-left: 0.28em solid transparent;
    border-right: 0.28em solid transparent;
    border-bottom: 0.5em solid #000;
    transform: translate(-50%, -50%) rotate(90deg);
    opacity: 0;
    animation: ${triangleFlow} 3s ease-in-out infinite;
  }
`;

export default function LoaderMusic() {
  return (
    <LoaderShell aria-label="Loading" role="status">
      <RecordGroup>
        <RecordDot />
        <RecordLabel>Rec</RecordLabel>
      </RecordGroup>

      <LaptopIcon viewBox="0 0 64 48" aria-hidden="true">
        <rect x="7" y="10" width="50" height="28" rx="7" fill="none" stroke="currentColor" strokeWidth="3" />
        <rect x="13" y="16" width="38" height="16" rx="4" fill="none" stroke="currentColor" strokeWidth="2.3" />
        <path d="M10 38h44" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
      </LaptopIcon>

      <MorphStage />
    </LoaderShell>
  );
}
