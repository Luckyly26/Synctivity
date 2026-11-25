import Dumbbell from '../components/Dumbbell.tsx';
import WorkoutExercise from '../components/WorkoutExercise.tsx';
import type { SetField } from '../hooks/useWorkoutDraft.ts';
import type { WorkoutExerciseDraft } from '../workout-draft.ts';

type WorkoutProps = {
  active: boolean;
  draft: WorkoutExerciseDraft[];
  totalSets: number;
  onPrepare: () => void;
  onBrowseExercises: () => void;
  onAddSet: (exerciseId: string) => void;
  onRemoveSet: (exerciseId: string, setId: string) => void;
  onUpdateSet: (
    exerciseId: string,
    setId: string,
    field: SetField,
    value: string,
  ) => void;
  onRemoveExercise: (exerciseId: string) => void;
};

export default function WorkoutPage({
  active,
  draft,
  totalSets,
  onPrepare,
  onBrowseExercises,
  onAddSet,
  onRemoveSet,
  onUpdateSet,
  onRemoveExercise,
}: WorkoutProps) {
  return (
    <>
      <section className="hero" aria-labelledby="workout-heading">
        <div className="hero-copy">
          <span className="pill">
            <span className="status-dot" />
            {active ? 'BUILD YOUR WORKOUT' : 'GET ACTIVE'}
          </span>
          <h2 id="workout-heading">
            {active ? (
              <>
                Your Workout.
                <br />
                Your Plan.
              </>
            ) : (
              <>
                Keep that consistency.
                <br />
                Stay active.
              </>
            )}
          </h2>
          <p>
            {active
              ? 'Add your sets, weight and reps. Build your workout at your own pace.'
              : 'Get started. Build your workout from your favorite exercises.'}
          </p>
          <button className="primary-button" onClick={onPrepare}>
            {active ? 'Choose Exercises' : 'Prepare Training'}
            <span aria-hidden="true">▦</span>
          </button>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <Dumbbell />
          <span>MAKE YOUR MOVE</span>
        </div>
      </section>
      <div className="section-heading">
        <h2>{active ? 'Your Workout Sets' : 'Ready When You Are'}</h2>
        <span className="tag">
          {active
            ? `${draft.length} Exercises · ${totalSets} Sets`
            : 'YOUR START'}
        </span>
      </div>
      {active ? (
        <section className="panel">
          <p className="notice">
            Session draft only. Your exercises and sets are not saved yet and
            will be lost on reload.
          </p>
          {draft.length ? (
            <div className="workout-exercises">
              {draft.map((entry, index) => (
                <WorkoutExercise
                  key={entry.exercise.id}
                  draft={entry}
                  index={index}
                  onAddSet={() => onAddSet(entry.exercise.id)}
                  onRemoveSet={(setId) => onRemoveSet(entry.exercise.id, setId)}
                  onUpdateSet={(setId, field, value) =>
                    onUpdateSet(entry.exercise.id, setId, field, value)
                  }
                  onRemoveExercise={() => onRemoveExercise(entry.exercise.id)}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h3>Weak Selection so far.</h3>
              <p>Select your first exercise.</p>
              <button className="text-button" onClick={onBrowseExercises}>
                To my exercises ↗
              </button>
            </div>
          )}
        </section>
      ) : (
        <div className="intro-grid">
          <section className="intro-card">
            <span className="card-icon" aria-hidden="true">
              01
            </span>
            <h3>Your Workout, Your Pace.</h3>
            <p>Select your exercises and assemble your next Workout.</p>
          </section>
          <button className="intro-card link-card" onClick={onBrowseExercises}>
            <span className="card-icon" aria-hidden="true">
              02
            </span>
            <h3>
              Find your exercises. <span aria-hidden="true">↗</span>
            </h3>
            <p>Explore your exercises in your backlog.</p>
          </button>
        </div>
      )}
    </>
  );
}
