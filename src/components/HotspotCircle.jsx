import React from 'react';
import { 
  Search, 
  Hand, 
  Box, 
  FileText, 
  CheckCircle, 
  HelpCircle, 
  Tv, 
  Phone, 
  Lock, 
  Calendar, 
  Folder, 
  Wrench, 
  Map, 
  Calculator, 
  ShoppingCart, 
  ShieldAlert, 
  Cpu, 
  ClipboardCheck, 
  Briefcase,
  Sparkles
} from 'lucide-react';
import { playClick } from '../audio/soundEngine';

const ICON_MAP = {
  search: Search,
  hand: Hand,
  box: Box,
  'file-text': FileText,
  monitor: Tv,
  tv: Tv,
  phone: Phone,
  lock: Lock,
  calendar: Calendar,
  folder: Folder,
  tool: Wrench,
  map: Map,
  calculator: Calculator,
  'shopping-cart': ShoppingCart,
  'shield-alert': ShieldAlert,
  cpu: Cpu,
  'clipboard-check': ClipboardCheck,
  briefcase: Briefcase,
  sparkles: Sparkles,
  'easter-egg': Sparkles
};

export default function HotspotCircle({ 
  x, 
  y, 
  label, 
  icon = 'search', 
  isCompleted = false, 
  isSecret = false,
  onClick 
}) {
  const IconComponent = isCompleted ? CheckCircle : (ICON_MAP[icon] || Search);

  const handleClick = (e) => {
    e.stopPropagation();
    playClick();
    if (onClick) onClick();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick(e);
    }
  };

  if (isSecret) {
    return (
      <div 
        className="hotspot-wrapper is-secret"
        style={{ left: `${x}%`, top: `${y}%` }}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-label="Tajemniczy element"
      >
        <div className="hotspot-secret-glow" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div 
      className={`hotspot-wrapper ${isCompleted ? 'is-completed' : ''}`}
      style={{ left: `${x}%`, top: `${y}%` }}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={label}
      title={label}
    >
      <div className="hotspot-ring" aria-hidden="true" />
      <div className="hotspot-ring-delay" aria-hidden="true" />
      
      <div className="hotspot-button">
        <IconComponent size={20} strokeWidth={2.2} />
      </div>

      <div className="hotspot-tooltip" role="tooltip">
        {label}
        {isCompleted && ' (Zbadane)'}
      </div>
    </div>
  );
}
