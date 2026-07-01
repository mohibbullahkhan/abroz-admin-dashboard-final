'use client';

import React from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store/store';

// ── Redux Provider ─────────────────────────────────────────────────────────────
// Wrap the entire Next.js app with this so every page & component can access
// the Redux store (and all RTK Query hooks) without any extra wiring.
// ─────────────────────────────────────────────────────────────────────────────

interface Props {
  children: React.ReactNode;
}

export function ReduxProvider({ children }: Props) {
  return <Provider store={store}>{children}</Provider>;
}
