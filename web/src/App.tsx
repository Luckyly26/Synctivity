import { useState } from 'react';
import './styles.css';
import Dumbbell from './components/Dumbbell.tsx';
import Sidebar from './components/Sidebar.tsx';
import Topbar from './components/Topbar.tsx';
import { useOnlineStatus } from './hooks/useOnlineStatus.ts';
import { useWorkoutDraft } from './hooks/useWorkoutDraft.ts';
import { useExercises } from './hooks/useExercises.ts';
import type { Page } from './navigation.ts';
import HistoryPage from './pages/HistoryPage.tsx';
import WorkoutPage from './pages/WorkoutPage.tsx';
import ExercisesPage from './pages/ExercisesPage.tsx';

export default function App() {
  const [page, setPage] = useState<Page>('workout');
  const [active, setActive] = useState(false);
  const [search, setSearch] = useState('');
  const online = useOnlineStatus();
  const { exercises, isLoading } = useExercises();
  const { draft, selected, totalSets, toggle, addSet, removeSet, updateSet } =
    useWorkoutDraft(exercises);

  const filtered = exercises.filter((exercise) =>
    `${exercise.name} ${exercise.muscle_group ?? ''}`
      .toLocaleLowerCase('de')
      .includes(search.toLocaleLowerCase('de')),
  );

  return (
    <div className="app-shell">
      <Sidebar page={page} online={online} onNavigate={setPage} />

      <main>
        <Topbar online={online} />

        <div className="content">
          <div className="page-heading">
            <div>
              <p className="eyebrow">LET’S MOVE</p>
              <h1>
                {page === 'workout'
                  ? 'Your Workout.'
                  : page === 'history'
                    ? 'Previous Sets.'
                    : 'Available Exercises.'}
              </h1>
            </div>
            <span className="heading-symbol" aria-hidden="true">
              <Dumbbell />
            </span>
          </div>

          {page === 'workout' && (
            <WorkoutPage
              active={active}
              draft={draft}
              totalSets={totalSets}
              onPrepare={() => {
                setActive(true);
                setPage('exercises');
              }}
              onBrowseExercises={() => setPage('exercises')}
              onAddSet={addSet}
              onRemoveSet={removeSet}
              onUpdateSet={updateSet}
              onRemoveExercise={toggle}
            />
          )}

          {page === 'exercises' && (
            <ExercisesPage
              active={active}
              exercises={exercises}
              search={search}
              onSetSearch={setSearch}
              isLoading={isLoading}
              filtered={filtered}
              selected={selected}
              onSetActive={setActive}
              onRemoveExercise={toggle}
              onGoToWorkout={() => setPage('workout')}
              draft={draft}
            />
          )}

          {page === 'history' && (
            <HistoryPage onGoToWorkout={() => setPage('workout')} />
          )}

          <footer className="page-footer">
            <span>SYNCTIVITY</span>
            <span>No more excuses.</span>
          </footer>
        </div>
      </main>
    </div>
  );
}
