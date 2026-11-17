import { useEffect, useState } from 'react';
import { useShape } from '@electric-sql/react';
import './styles.css';

type Exercise = { id: string; name: string; muscle_group: string | null };
type Page = 'workout' | 'history' | 'exercises';
const SHAPE_URL = new URL('/api/shape', window.location.origin).href;
const pages: { id: Page; label: string; icon: string }[] = [
  { id: 'workout', label: 'Workout', icon: '↗' },
  { id: 'history', label: 'History', icon: '◷' },
  { id: 'exercises', label: 'Exercises', icon: '▦' },
];

function Dumbbell() {
  return (
    <svg viewBox="0 0 240 240" aria-hidden="true" focusable="false">
      <g transform="rotate(-35 120 120)" fill="currentColor">
        <rect x="55" y="102" width="130" height="36" rx="8" />
        <rect x="43" y="65" width="24" height="110" rx="8" />
        <rect x="21" y="83" width="18" height="74" rx="6" />
        <rect x="173" y="65" width="24" height="110" rx="8" />
        <rect x="201" y="83" width="18" height="74" rx="6" />
      </g>
    </svg>
  );
}

export default function App() {
  const [page, setPage] = useState<Page>('workout');
  const [active, setActive] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [online, setOnline] = useState(navigator.onLine);
  const {
    data: exercises,
    isLoading,
    error,
  } = useShape<Exercise>({
    url: SHAPE_URL,
    params: { table: 'exercises' },
  });

  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, []);

  const filtered = exercises.filter((exercise) =>
    `${exercise.name} ${exercise.muscle_group ?? ''}`
      .toLocaleLowerCase('de')
      .includes(search.toLocaleLowerCase('de')),
  );
  const chosen = exercises.filter((exercise) => selected.includes(exercise.id));
  const toggle = (id: string) =>
    setSelected((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a
          className="brand"
          href="#"
          onClick={(event) => {
            event.preventDefault();
            setPage('workout');
          }}
        >
          <img
            className="brand-mark"
            src="/synctivity-icon.svg"
            alt=""
            width="36"
            height="36"
          />{' '}
          synctivity<span className="brand-dot">.</span>
        </a>
        <p className="nav-caption">Your Training Space</p>
        <nav aria-label="Main navigation" className="nav">
          {pages.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${page === item.id ? 'selected' : ''}`}
              aria-current={page === item.id ? 'page' : undefined}
              onClick={() => setPage(item.id)}
            >
              <span aria-hidden="true">{item.icon}</span>
              {item.label}
              <span className="nav-arrow" aria-hidden="true">
                ↗
              </span>
            </button>
          ))}
        </nav>
        <div className="sidebar-note">
          <span className="small-mark" aria-hidden="true">
            ↗
          </span>
          <strong>
            Step by Step.
            <br />
            Rep by Rep.
          </strong>
        </div>
        <div className="connection">
          <span className={`status-dot ${online ? '' : 'offline'}`} />
          {online ? 'Connected' : 'Offline'}
        </div>
      </aside>

      <main>
        <header className="topbar">
          <span>Room to Improve</span>
          <span className="mobile-connection" role="status">
            <span
              className={`status-dot ${online ? '' : 'offline'}`}
              aria-hidden="true"
            />
            {online ? 'Connected' : 'Offline'}
          </span>
          <span className="date">
            {new Intl.DateTimeFormat('de-DE', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            }).format(new Date())}
          </span>
        </header>
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
            <>
              <section className="hero" aria-labelledby="workout-heading">
                <div className="hero-copy">
                  <span className="pill">
                    <span className="status-dot" />
                    {active ? 'BUILD YOUR WORKOUT' : 'GET ACTIVE'}
                  </span>
                  <h2 id="training-heading">
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
                      ? 'Choose exercises from the catalog for your workout.'
                      : 'Get started. Build your workout from your favorite exercises.'}
                  </p>
                  <button
                    className="primary-button"
                    onClick={() => {
                      setActive(true);
                      setPage('exercises');
                    }}
                  >
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
                <h2>
                  {active ? 'Your Exercise Selection' : 'Ready When You Are'}
                </h2>
                <span className="tag">
                  {active ? `${chosen.length} Exercises` : 'YOUR START'}
                </span>
              </div>
              {active ? (
                <section className="panel">
                  <p className="notice">
                    Entwurf nur für diese Sitzung. Speichern und Satzerfassung
                    folgen; beim Neuladen geht die Auswahl verloren.
                  </p>
                  {chosen.length ? (
                    <ul className="exercise-list">
                      {chosen.map((exercise, index) => (
                        <li key={exercise.id}>
                          <span className="exercise-number">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <div>
                            <strong>{exercise.name}</strong>
                            <p>{exercise.muscle_group ?? 'No Muscle Group'}</p>
                          </div>
                          <button
                            className="text-button"
                            onClick={() => toggle(exercise.id)}
                            aria-label={`${exercise.name} remove`}
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="empty-state">
                      <h3>Weak Selection so far.</h3>
                      <p>Select your first exercise.</p>
                      <button
                        className="text-button"
                        onClick={() => setPage('exercises')}
                      >
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
                    <p>Select your execises and assemble your next Workout.</p>
                  </section>
                  <button
                    className="intro-card link-card"
                    onClick={() => setPage('exercises')}
                  >
                    <span className="card-icon" aria-hidden="true">
                      02
                    </span>
                    <h3>
                      Find your excercises. <span aria-hidden="true">↗</span>
                    </h3>
                    <p>Explore your exercises in your backlog.</p>
                  </button>
                </div>
              )}
            </>
          )}

          {page === 'exercises' && (
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
                onChange={(event) => setSearch(event.target.value)}
              />
              <div aria-live="polite">
                {error ? (
                  <div className="empty-state">
                    <h3>Exercises currently not available.</h3>
                    <p>
                      Check if the API and ElectricSQL are running and a
                      connection is established.
                    </p>
                  </div>
                ) : isLoading ? (
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
                            setActive(true);
                            toggle(exercise.id);
                          }}
                        >
                          {selected.includes(exercise.id) ? '✓' : '+'}
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="empty-state">
                    <h3>
                      {search
                        ? 'No matching exercises.'
                        : 'Check your Backlog.'}
                    </h3>
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
                  onClick={() => setPage('workout')}
                >
                  To the Workouts ({chosen.length}){' '}
                  <span aria-hidden="true">↗</span>
                </button>
              )}
            </section>
          )}

          {page === 'history' && (
            <section className="panel empty-state history-empty">
              <span className="empty-icon" aria-hidden="true">
                ◷
              </span>
              <h2>Previous sessions.</h2>
              <p>
                Workout history will be available once they can be recorded and
                saved.
              </p>
              <button
                className="primary-button"
                onClick={() => setPage('workout')}
              >
                To my Workout <span aria-hidden="true">↗</span>
              </button>
            </section>
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
