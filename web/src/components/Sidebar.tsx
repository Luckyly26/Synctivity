import type { Page } from '../navigation.ts';
import { pages } from '../navigation.ts';

type SidebarProps = {
  page: Page;
  online: boolean;
  onNavigate: (page: Page) => void;
};

export default function Sidebar({ page, online, onNavigate }: SidebarProps) {
  return (
    <aside className="sidebar">
      <a
        className="brand"
        href="#"
        onClick={(event) => {
          event.preventDefault();
          onNavigate('workout');
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
            onClick={() => onNavigate(item.id)}
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
  );
}
