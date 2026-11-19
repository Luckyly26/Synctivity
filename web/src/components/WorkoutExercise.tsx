import { useRef } from 'react';
import NumberWheel from './NumberWheel';
import type { WorkoutExerciseDraft, WorkoutSetDraft } from '../workout-draft';

type Props = {
  draft: WorkoutExerciseDraft;
  index: number;
  onAddSet: () => void;
  onRemoveSet: (setId: string) => void;
  onUpdateSet: (
    setId: string,
    field: 'weightKg' | 'reps',
    value: string,
  ) => void;
  onRemoveExercise: () => void;
};

export default function WorkoutExercise({
  draft,
  index,
  onAddSet,
  onRemoveSet,
  onUpdateSet,
  onRemoveExercise,
}: Props) {
  const { exercise, sets } = draft;
  const addButton = useRef<HTMLButtonElement>(null);

  function field(
    set: WorkoutSetDraft,
    name: 'weightKg' | 'reps',
    position: number,
  ) {
    const label = `${exercise.name}, set ${position + 1}`;
    const [whole, fraction = '00'] = (set.weightKg || '0.000')
      .replace(',', '.')
      .split('.');
    const decimal = Number(fraction.padEnd(3, '0').slice(0, 3));
    return (
      <div className="set-field">
        <span className="wheel-label">
          {name === 'weightKg' ? 'Weight (kg)' : 'Reps'}
        </span>
        {name === 'weightKg' ? (
          <div className="weight-wheels">
            <NumberWheel
              label={`Whole kilograms for ${label}`}
              min={0}
              max={999}
              value={Number(whole)}
              onChange={(value) =>
                onUpdateSet(
                  set.id,
                  name,
                  `${value}.${String(decimal).padStart(2, '0')}`,
                )
              }
            />
            <span className="decimal-separator" aria-hidden="true">
              ,
            </span>
            <NumberWheel
              label={`Hundredths of a kilogram for ${label}`}
              min={0}
              max={999}
              value={decimal}
              pad
              onChange={(value) =>
                onUpdateSet(
                  set.id,
                  name,
                  `${whole}.${String(value).padStart(3, '0')}`,
                )
              }
            />
          </div>
        ) : (
          <NumberWheel
            label={`Reps for ${label}`}
            min={1}
            max={100}
            value={Number(set.reps) || 8}
            onChange={(value) => onUpdateSet(set.id, name, String(value))}
          />
        )}
      </div>
    );
  }

  return (
    <section
      className="workout-exercise"
      aria-labelledby={`exercise-${exercise.id}`}
    >
      <header className="workout-exercise-heading">
        <span className="exercise-number">
          {String(index + 1).padStart(2, '0')}
        </span>
        <div>
          <h3 id={`exercise-${exercise.id}`}>{exercise.name}</h3>
          <p>{exercise.muscle_group ?? 'No Muscle Group'}</p>
        </div>
        <button
          className="text-button"
          onClick={onRemoveExercise}
          aria-label={`Remove ${exercise.name} and its sets`}
        >
          Remove
        </button>
      </header>
      {sets.length ? (
        <ol className="set-list">
          {sets.map((set, position) => (
            <li className="set-row" key={set.id}>
              <span className="set-number">Set {position + 1}</span>
              {field(set, 'weightKg', position)}
              {field(set, 'reps', position)}
              <button
                className="remove-set"
                aria-label={`Remove set ${position + 1} from ${exercise.name}`}
                onClick={() => {
                  onRemoveSet(set.id);
                  addButton.current?.focus();
                }}
              >
                ×
              </button>
            </li>
          ))}
        </ol>
      ) : (
        <p className="no-sets">No sets yet. Add your first set below.</p>
      )}
      <button
        className="text-button add-set"
        ref={addButton}
        onClick={onAddSet}
      >
        + Add set<span className="sr-only"> to {exercise.name}</span>
      </button>
    </section>
  );
}
