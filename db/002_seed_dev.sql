-- Development data only. Re-running this script does not duplicate or overwrite rows.
begin;

insert into users (id, email)
values ('00000000-0000-4000-8000-000000000001', 'dev@synctivity.local')
on conflict (email) do nothing;

insert into exercises (id, user_id, name, muscle_group)
select seed.id::uuid, users.id, seed.name, seed.muscle_group
from (values
  ('10000000-0000-4000-8000-000000000001', 'Squat', 'Legs'),
  ('10000000-0000-4000-8000-000000000002', 'Bench Press', 'Chest'),
  ('10000000-0000-4000-8000-000000000003', 'Deadlift', 'Back / Legs'),
  ('10000000-0000-4000-8000-000000000004', 'Overhead Press', 'Shoulders'),
  ('10000000-0000-4000-8000-000000000005', 'Barbell Row', 'Back'),
  ('10000000-0000-4000-8000-000000000006', 'Pull-up', 'Back'),
  ('10000000-0000-4000-8000-000000000007', 'Biceps Curl', 'Arms'),
  ('10000000-0000-4000-8000-000000000008', 'Lunge', 'Legs')
) as seed(id, name, muscle_group)
join users on users.email = 'dev@synctivity.local'
on conflict (id) do nothing;

commit;
