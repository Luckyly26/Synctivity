export type Exercise = {
  id: string;
  name: string;
  muscle_group: string | null;
};

// Decimal strings avoid floating-point rounding in the draft.
export type WorkoutSetDraft = { id: string; weightKg: string; reps: string };
export type WorkoutExerciseDraft = {
  exercise: Exercise;
  sets: WorkoutSetDraft[];
};

export function createSet(): WorkoutSetDraft {
  return { id: crypto.randomUUID(), weightKg: '0.00', reps: '8' };
}

export function weightError(value: string): string | undefined {
  if (value === '') return;
  const normalized = value.replace(',', '.');
  if (!/^\d+(\.\d{1,2})?$/.test(normalized) || Number(normalized) > 999.99) {
    return 'Enter 0–999.99 kg, with up to 2 decimal places.';
  }
}

export function repsError(value: string): string | undefined {
  if (value === '') return;
  if (!/^\d+$/.test(value) || Number(value) < 1 || Number(value) > 1000) {
    return 'Enter a whole number from 1 to 1000.';
  }
}
