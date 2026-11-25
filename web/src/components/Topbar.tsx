type topbarProps = {
  online: boolean;
};

export default function Topbar({ online }: topbarProps) {
  return (
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
  );
}
