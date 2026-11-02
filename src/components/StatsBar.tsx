import React from 'react';
import { ScannedDocument } from '../types';
import { Scan, FolderCheck, HardDrive, Globe } from 'lucide-react';

interface StatsBarProps {
  documents: ScannedDocument[];
  onOpenScanner: () => void;
  onOpenNetlify: () => void;
  onOpenDrive: () => void;
  driveConnected: boolean;
}

export const StatsBar: React.FC<StatsBarProps> = ({
  documents,
  onOpenScanner,
  onOpenNetlify,
  onOpenDrive,
  driveConnected
}) => {
  const total = documents.length;
  const badgesCount = documents.filter(d => d.category === 'badges_lan').length;
  const mecenatCount = documents.filter(d => d.category === 'recus_mecenat').length;
  const driveSyncedCount = documents.filter(d => d.driveSynced).length;

  return (
    <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-4 px-4 sm:px-6 lg:px-8 transition-colors no-print">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        
        {/* Unboxed Metadata Stats */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
          <span className="text-slate-900 dark:text-white font-extrabold">{total} Documents Traités</span>
          <span className="text-slate-300 dark:text-slate-700">·</span>
          <span>{badgesCount} Badges LAN</span>
          <span className="text-slate-300 dark:text-slate-700">·</span>
          <span>{mecenatCount} Reçus Mécénat</span>
          <span className="text-slate-300 dark:text-slate-700">·</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{driveSyncedCount} Sauvegardés Drive</span>
        </div>

        {/* Quick Shortcut Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenScanner}
            className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Scan className="w-3.5 h-3.5" />
            <span>Scanner SG20T</span>
          </button>

          <button
            onClick={onOpenNetlify}
            className="px-3 py-1.5 bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 dark:hover:bg-sky-900/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Base Netlify</span>
          </button>

          <button
            onClick={onOpenDrive}
            className="px-3 py-1.5 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <HardDrive className="w-3.5 h-3.5" />
            <span>{driveConnected ? 'Drive Prêt' : 'Connecter Drive'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
