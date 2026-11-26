import { useLiveQuery } from '@electric-sql/pglite-react';
import type { Exercise } from '../workout-draft';

export function useExercises() {
  const result = useLiveQuery<Exercise>(
    'select id, name, muscle_group from exercises order by name',
    [],
  );

  return {
    exercises: result?.rows ?? [],
    isLoading: result === undefined,
  };
}
