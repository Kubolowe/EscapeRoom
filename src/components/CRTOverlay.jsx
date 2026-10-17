import React from 'react';

export default function CRTOverlay({ enabled = true }) {
  if (!enabled) return null;

  return (
    <>
      <div className="crt-overlay subtle-flicker" aria-hidden="true" />
      <div className="crt-vignette" aria-hidden="true" />
    </>
  );
}
