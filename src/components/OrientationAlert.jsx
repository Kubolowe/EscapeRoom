import React, { useState } from 'react';
import { Smartphone, X } from 'lucide-react';

export default function OrientationAlert() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="orientation-banner" role="alert">
      <Smartphone size={16} />
      <span>Obróć urządzenie poziomo dla optymalnego widoku (16:9). Gra pozostaje w pełni grywalna w pionie.</span>
      <button 
        onClick={() => setDismissed(true)} 
        style={{ background: 'none', border: 'none', color: '#000', cursor: 'pointer', display: 'flex', padding: 2 }}
        title="Zamknij powiadomienie"
        aria-label="Zamknij powiadomienie"
      >
        <X size={14} />
      </button>
    </div>
  );
}
