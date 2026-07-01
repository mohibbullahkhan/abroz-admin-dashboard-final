import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

// ── Typed hooks ───────────────────────────────────────────────────────────────
// Use these everywhere instead of the plain `useDispatch` / `useSelector`
// so TypeScript knows the full shape of your store automatically.

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = <T>(selector: (state: RootState) => T): T =>
  useSelector(selector);
