import {
  Mode,
  ModeManager,
  Theme,
  getCurrentTheme,
  mode as modeManager,
  sanitizeMode,
} from '@-ft/mode';
import { usePersist } from '@-ft/use-persist';
import {
  PropsWithChildren,
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

export interface ModeContextType {
  mode: Mode;
  theme: Theme;
  setMode(mode: Mode): void;
}
export const ModeContext = createContext<ModeContextType>(
  {} as unknown as ModeContextType
);

export interface ModeContextProviderProps extends PropsWithChildren {
  apply?(theme: Theme): void;
  cleanup?(): void;
  load?(): string;
  save?(mode: Mode): void;
}

export function ModeContextProvider({
  children,
  apply,
  save,
  load,
  cleanup,
}: ModeContextProviderProps) {
  const modeManagerPersist = usePersist<ModeManager | undefined>(undefined);
  const [mode, setMode] = useState(() => sanitizeMode(load?.() ?? 'system'));
  const [theme, setTheme] = useState(() => getCurrentTheme(mode));

  useEffect(() => {
    const disposables: (() => void)[] = [];

    modeManagerPersist.current = modeManager(load?.() ?? 'system');

    disposables.push(
      modeManagerPersist.current.watchTheme((theme) => {
        apply?.(theme);
      }),
      modeManagerPersist.current.watchMode((mode) => {
        save?.(mode);
      }),
      modeManagerPersist.current.watchMode((mode) => setMode(mode)),
      modeManagerPersist.current.watchTheme((theme) => setTheme(theme)),
      () => {
        modeManagerPersist.current = undefined;
        cleanup?.();
      }
    );

    return () => disposables.forEach((disposable) => disposable());
  });

  const setModeExternal = useCallback(
    (mode: Mode) => {
      if (modeManagerPersist.current) modeManagerPersist.current.mode = mode;
    },
    [modeManagerPersist]
  );

  return (
    <ModeContext.Provider
      value={useMemo(
        () => ({ mode, theme, setMode: setModeExternal }),
        [mode, theme, setModeExternal]
      )}
    >
      {children}
    </ModeContext.Provider>
  );
}
