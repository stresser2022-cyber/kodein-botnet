import { useEffect } from 'react';

interface ShortcutConfig {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  action: () => void;
  description: string;
}

export function useKeyboardShortcuts(shortcuts: ShortcutConfig[], enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      shortcuts.forEach((shortcut) => {
        const ctrlMatch = shortcut.ctrl ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey;
        const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;
        const altMatch = shortcut.alt ? event.altKey : !event.altKey;
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();

        if (ctrlMatch && shiftMatch && altMatch && keyMatch) {
          event.preventDefault();
          shortcut.action();
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts, enabled]);
}

export const SHORTCUTS = {
  LAUNCH_ATTACK: { key: 'Enter', ctrl: true, description: 'Launch Attack' },
  REFRESH: { key: 'r', ctrl: true, description: 'Refresh Data' },
  STOP_ALL: { key: 'x', ctrl: true, shift: true, description: 'Stop All Attacks' },
  EXPORT_JSON: { key: 'e', ctrl: true, description: 'Export as JSON' },
  EXPORT_CSV: { key: 'e', ctrl: true, shift: true, description: 'Export as CSV' },
  TOGGLE_THEME: { key: 't', ctrl: true, description: 'Toggle Theme' },
};
