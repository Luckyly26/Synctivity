type HistoryProps = {
  onGoToWorkout: () => void;
};

export default function HistoryPage({ onGoToWorkout }: HistoryProps) {
  return (
    <section className="panel empty-state history-empty">
      <span className="empty-icon" aria-hidden="true">
        ◷
      </span>
      <h2>Previous sessions.</h2>
      <p>
        Workout history will be available once they can be recorded and saved.
      </p>
      <button className="primary-button" onClick={onGoToWorkout}>
        To my Workout <span aria-hidden="true">↗</span>
      </button>
    </section>
  );
}
