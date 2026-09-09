import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api/v1';

function App() {
  const [apiStatus, setApiStatus] = useState<'checking' | 'ok' | 'error'>('checking');

  useEffect(() => {
    axios
      .get(`${API_URL}/health`)
      .then(() => setApiStatus('ok'))
      .catch(() => setApiStatus('error'));
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
      <h1 className="text-3xl font-semibold tracking-tight">AI Job Application Tracker</h1>
      <p className="text-gray-500">Foundation scaffold — Milestone 1</p>
      <p className="text-sm">
        API status:{' '}
        <span
          className={
            apiStatus === 'ok'
              ? 'text-green-600'
              : apiStatus === 'error'
                ? 'text-red-600'
                : 'text-gray-400'
          }
        >
          {apiStatus}
        </span>
      </p>
    </div>
  );
}

export default App;
