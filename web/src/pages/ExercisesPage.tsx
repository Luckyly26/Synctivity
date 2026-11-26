import type { Exercise, WorkoutExerciseDraft } from '../workout-draft.ts';

type ExercisesProps = {
  active: boolean;
  exercises: Exercise[];
  search: string;
  onSetSearch: (search: string) => void;
  isLoading: boolean;
  filtered: Exercise[];
  selected: string[];
  onSetActive: (active: boolean) => void;
  onRemoveExercise: (exerciseId: string) => void;
  onGoToWorkout: () => void;
  draft: WorkoutExerciseDraft[];
};

export default function ExercisesPage({
  active,
  exercises,
  search,
  onSetSearch,
  isLoading,
  filtered,
  selected,
  onSetActive,
  onRemoveExercise,
  onGoToWorkout,
  draft,
}: ExercisesProps) {
  return (
    <section className="panel catalog">
      <div className="section-heading">
        <h2>Exercise Backlog</h2>
        <span className="tag">{exercises.length} Exercises</span>
      </div>
      <label className="search-label" htmlFor="exercise-search">
        Search Exercises
      </label>
      <input
        id="exercise-search"
        type="search"
        placeholder="Name or Muscle Group …"
        value={search}
        onChange={(event) => onSetSearch(event.target.value)}
      />
      <div aria-live="polite">
        {isLoading ? (
          <p className="loading">Exercises are loading …</p>
        ) : filtered.length ? (
          <ul className="exercise-list">
            {filtered.map((exercise, index) => (
              <li key={exercise.id}>
                <span className="exercise-number">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  <strong>{exercise.name}</strong>
                  <p>{exercise.muscle_group ?? 'No Muscle Group'}</p>
                </div>
                <button
                  className={`select-button ${selected.includes(exercise.id) ? 'is-selected' : ''}`}
                  aria-pressed={selected.includes(exercise.id)}
                  aria-label={`${exercise.name} ${selected.includes(exercise.id) ? 'remove' : 'select'}`}
                  onClick={() => {
                    onSetActive(true);
                    onRemoveExercise(exercise.id);
                  }}
                >
                  {selected.includes(exercise.id) ? '✓' : '+'}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="empty-state">
            <h3>{search ? 'No matching exercises.' : 'Check your Backlog.'}</h3>
            <p>
              {search
                ? 'Try a different name or muscle group.'
                : 'Available Exercises will be shown here once the db is filled.'}
            </p>
          </div>
        )}
      </div>
      {active && (
        <button
          className="primary-button catalog-action"
          onClick={() => onGoToWorkout()}
        >
          To the Workouts ({draft.length}) <span aria-hidden="true">↗</span>
        </button>
      )}
    </section>
  );
}
