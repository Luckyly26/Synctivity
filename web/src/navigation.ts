export type Page = 'workout' | 'history' | 'exercises';

export const pages: { id: Page; label: string; icon: string }[] = [
  { id: 'workout', label: 'Workout', icon: '↗' },
  { id: 'history', label: 'History', icon: '◷' },
  { id: 'exercises', label: 'Exercises', icon: '▦' },
];
