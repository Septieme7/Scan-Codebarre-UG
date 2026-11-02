import React from 'react';
import { 
  Scan, 
  FolderSync, 
  CloudCheck, 
  CloudOff, 
  Sun, 
  Moon, 
  FileSpreadsheet,
  HardDrive
} from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  scannerActive: boolean;
  onOpenScannerModal: () => void;
  onOpenNetlifyModal: () => void;
  onOpenDriveModal: () => void;
  driveConnected: boolean;
  driveEmail?: string;
  totalDocs: number;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  onToggleDarkMode,
  scannerActive,
  onOpenScannerModal,
  onOpenNetlifyModal,
  onOpenDriveModal,
  driveConnected,
  driveEmail,
  totalDocs
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Wordmark Brand */}
        <a href="/" className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-lg tracking-tight whitespace-nowrap shrink-0 group">
          <div className="w-9 h-9 rounded-lg bg-emerald-600 dark:bg-emerald-500 flex items-center justify-center text-white shadow-sm group-hover:bg-emerald-500 transition-colors">
            <Scan className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-slate-900 dark:text-white">UNIVERS GAMING</span>
          <span className="hidden sm:inline-block text-xs px-2 py-0.5 rounded font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-normal">
            SG20T Vault
          </span>
        </a>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <a href="#vault" className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5">
            <FolderSync className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Coffre PDF ({totalDocs})</span>
          </a>
          
          <button 
            onClick={onOpenNetlifyModal}
            className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer text-left"
          >
            <FileSpreadsheet className="w-4 h-4 text-sky-500" />
            <span>Netlify Data</span>
          </button>

          <button 
            onClick={onOpenDriveModal}
            className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer text-left"
          >
            <HardDrive className="w-4 h-4 text-amber-500" />
            <span>Google Drive</span>
          </button>
        </nav>

        {/* Zone 3: Status Badges & Primary Actions */}
        <div className="flex items-center gap-3 shrink-0">
          
          {/* Intermec Hardware Status */}
          <button
            onClick={onOpenScannerModal}
            title="Statut Scanner Intermec SG20T USB HID"
            className={`hidden sm:flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
              scannerActive 
                ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' 
                : 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${scannerActive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            <span className="font-semibold">SG20T {scannerActive ? 'PRÊT' : 'PAUSE'}</span>
          </button>

          {/* Drive Status Badge */}
          <button
            onClick={onOpenDriveModal}
            title={driveConnected ? `Connecté: ${driveEmail || 'scangt7@gmail.com'}` : 'Google Drive non connecté'}
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            {driveConnected ? (
              <CloudCheck className="w-5 h-5 text-emerald-500" />
            ) : (
              <CloudOff className="w-5 h-5 text-slate-400" />
            )}
          </button>

          {/* Light / Dark Theme Switcher */}
          <button
            onClick={onToggleDarkMode}
            title={darkMode ? 'Passer en mode clair' : 'Passer en mode sombre'}
            aria-label="Toggle theme"
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
          </button>

          {/* Primary Action Button */}
          <button
            onClick={onOpenScannerModal}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition-all whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Scan className="w-4 h-4" />
            <span>Scanner un PDF</span>
          </button>

        </div>

      </div>
    </header>
  );
};
