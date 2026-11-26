import { PGlite } from '@electric-sql/pglite';
import { electricSync } from '@electric-sql/pglite-sync';
import { live } from '@electric-sql/pglite/live';

// One single Instance, stored in IndexedDB
export const dbReady = PGlite.create({
  dataDir: 'idb://synctivity',
  extensions: { electric: electricSync(), live },
});

async function initLocalSchema() {
  const db = await dbReady;
  await db.exec(`
    create table if not exists exercises (
      id uuid primary key,
      user_id uuid not null,
      name text not null,
      muscle_group text,
      created_at timestamptz not null,
      updated_at timestamptz not null
    );
    create table if not exists workouts (
      id uuid primary key,
      user_id uuid not null,
      title text,
      started_at timestamptz not null,
      ended_at timestamptz,
      notes text,
      created_at timestamptz not null,
      updated_at timestamptz not null
    );
    create table if not exists workout_sets (
      id uuid primary key,
      user_id uuid not null,
      workout_id uuid not null,
      exercise_id uuid not null,
      set_order integer not null,
      weight_kg numeric(6,2),
      reps integer,
      created_at timestamptz not null,
      updated_at timestamptz not null
    );
  `);
}

export async function startSync() {
  const db = await dbReady;
  await initLocalSchema();

  const url = new URL('/api/shape', window.location.origin).href;

  return db.electric.syncShapesToTables({
    key: 'synctivity-v1',
    shapes: {
      exercises: {
        shape: { url, params: { table: 'exercises' } },
        table: 'exercises',
        primaryKey: ['id'],
      },
      workouts: {
        shape: { url, params: { table: 'workouts' } },
        table: 'workouts',
        primaryKey: ['id'],
      },
      workout_sets: {
        shape: { url, params: { table: 'workout_sets' } },
        table: 'workout_sets',
        primaryKey: ['id'],
      },
    },
    onInitialSync: async () => {
      const result = await db.query('select * from exercises');
      console.log('Initial sync fertig, Übungen lokal:', result.rows);
    },
    onError: (error) => console.error('Sync-Fehler:', error),
  });
}
