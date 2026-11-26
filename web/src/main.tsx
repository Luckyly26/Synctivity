import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { PGliteProvider } from '@electric-sql/pglite-react';
import { dbReady, startSync } from './db/pglite.ts';
import App from './App';

dbReady.then((db) => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <PGliteProvider db={db}>
        <App />
      </PGliteProvider>
    </StrictMode>,
  );
});
//Start sync between pglite and electric and catch any errors
startSync().catch(console.error);
