create table users (
                       id          uuid primary key default gen_random_uuid(),
                       email       text not null unique,
                       created_at  timestamptz not null default now()
);

create table exercises (
                           id           uuid primary key default gen_random_uuid(),
                           user_id      uuid not null references users(id) on delete cascade,
                           name         text not null,
                           muscle_group text,
                           created_at   timestamptz not null default now(),
                           updated_at   timestamptz not null default now()
);

create table workouts (
                          id          uuid primary key default gen_random_uuid(),
                          user_id     uuid not null references users(id) on delete cascade,
                          title       text,
                          started_at  timestamptz not null,
                          ended_at    timestamptz,
                          notes       text,
                          created_at  timestamptz not null default now(),
                          updated_at  timestamptz not null default now()
);

create table workout_sets (
                              id          uuid primary key default gen_random_uuid(),
                              user_id     uuid not null references users(id) on delete cascade,
                              workout_id  uuid not null references workouts(id) on delete cascade,
                              exercise_id uuid not null references exercises(id),
                              set_order   integer not null,
                              weight_kg   numeric(6,2),
                              reps        integer,
                              created_at  timestamptz not null default now(),
                              updated_at  timestamptz not null default now()
);

create index on exercises (user_id);
create index on workouts (user_id, started_at desc);
create index on workout_sets (workout_id, set_order);
create index on workout_sets (user_id);