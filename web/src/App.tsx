import {useShape} from '@electric-sql/react';

type Exercise = {
  id: string;
  name: string;
  muscle_groud: string | null;
}

const SHAPE_URL = new URL("/api/shape", window.location.origin).href;

export default function App() {
  const {data: exercises, isLoading} = useShape<Exercise>({
    url: SHAPE_URL,
    params: {table: "exercises"}
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Synctivity</h1>
      <ul>
        {exercises.map((exercise) => (
          <li key={exercise.id}>
            {exercise.name} ({exercise.muscle_groud ?? "No musclegroup specified" })
          </li>
        ))}
      </ul>
    </div>
  )
}