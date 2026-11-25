import type { Exercise, WorkoutExerciseDraft } from '../workout-draft.ts';
import { createSet } from '../workout-draft';
import { useState } from 'react';

export type SetField = 'weightKg' | 'reps';

export function useWorkoutDraft(exercises: Exercise[]) {
  const [draft, setDraft] = useState<WorkoutExerciseDraft[]>([]);

  const selected = draft.map((entry) => entry.exercise.id);
  const totalSets = draft.reduce(
    (total, entry) => total + entry.sets.length,
    0,
  );

  const toggle = (id: string) => {
    if (selected.includes(id)) {
      setDraft((current) =>
        current.filter((entry) => entry.exercise.id !== id),
      );
      return;
    }
    const exercise = exercises.find((item) => item.id === id);
    if (exercise) {
      const entry = { exercise: { ...exercise }, sets: [createSet()] };
      setDraft((current) => [...current, entry]);
    }
  };

  const addSet = (exerciseId: string) => {
    const set = createSet();
    setDraft((current) =>
      current.map((entry) =>
        entry.exercise.id === exerciseId
          ? { ...entry, sets: [...entry.sets, set] }
          : entry,
      ),
    );
  };

  const removeSet = (exerciseId: string, setId: string) => {
    setDraft((current) =>
      current.map((entry) =>
        entry.exercise.id === exerciseId
          ? { ...entry, sets: entry.sets.filter((set) => set.id !== setId) }
          : entry,
      ),
    );
  };

  const updateSet = (
    exerciseId: string,
    setId: string,
    field: SetField,
    value: string,
  ) => {
    setDraft((current) =>
      current.map((entry) =>
        entry.exercise.id === exerciseId
          ? {
              ...entry,
              sets: entry.sets.map((set) =>
                set.id === setId ? { ...set, [field]: value } : set,
              ),
            }
          : entry,
      ),
    );
  };

  return { draft, selected, totalSets, toggle, addSet, removeSet, updateSet };
}
