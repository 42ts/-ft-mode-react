# `mode-react` - Theme mode manager wrapper for React

React wrapper of dark/light theme mode manager for web

## Usage

```jsx
import { ModeContextProvider, ModeContext } from '@-ft/mode';

const load = () => getCookie('mode') ?? 'system';
const save = (mode) => setCookie('mode', mode);
const apply = (theme) => {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};
const cleanup = () => document.documentElement.classList.remove('dark');

function Provider({ children }) {
  return (
    <ModeContextProvider
      load={load}
      save={save}
      apply={apply}
      cleanup={cleanup}
    >
      {children}
    </ModeContextProvider>
  );
}

function ModeBar() {
  const { mode, setMode } = useContext(ModeContext);

  return (
    <Bar>
      Current theme mode is {mode}.
      <Select
        onChange={useCallback((mode) => setMode(mode), [setMode])}
      >
        {['system', 'light', 'dark']}
      </Select>
    </Bar>
  )
}

```
