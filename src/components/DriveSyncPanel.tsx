import React from 'react';
import { 
  HardDrive, 
  CheckCircle2, 
  RefreshCw, 
  X, 
  FolderCheck, 
  Mail,
  CloudUpload
} from 'lucide-react';
import { ScannedDocument } from '../types';

interface DriveSyncPanelProps {
  isOpen: boolean;
  onClose: () => void;
  driveConnected: boolean;
  userEmail: string;
  onToggleConnect: () => void;
  documents: ScannedDocument[];
  onSyncAllDocuments: () => void;
}

export const DriveSyncPanel: React.FC<DriveSyncPanelProps> = ({
  isOpen,
  onClose,
  driveConnected,
  userEmail,
  onToggleConnect,
  documents,
  onSyncAllDocuments
}) => {
  if (!isOpen) return null;

  const syncedCount = documents.filter(d => d.driveSynced).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in no-print">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-xl w-full p-6 relative">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <HardDrive className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-lg">Google Drive Storage & Vault</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Sauvegarde sécurisée dans le Cloud Google Workspace</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Account Config Banner */}
        <div className="my-4 p-4 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Comptes Administrateurs Autorisés :</p>
              <p className="text-xs font-bold text-slate-900 dark:text-white font-mono">{userEmail} (Google Drive)</p>
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 font-mono">Univers-Gaming@hotmail.com (Secrétariat)</p>
            </div>
          </div>

          <button
            onClick={onToggleConnect}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              driveConnected 
                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800' 
                : 'bg-amber-500 hover:bg-amber-400 text-white shadow-sm'
            }`}
          >
            {driveConnected ? 'Actif & Synchronisé' : 'Connecter Google Drive'}
          </button>
        </div>

        {/* Folder Structure Preview */}
        <div className="mb-4 p-3 bg-amber-50/50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-xl text-xs text-amber-900 dark:text-amber-200">
          <p className="font-bold mb-1 flex items-center gap-1.5">
            <FolderCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>Arborescence des Dossiers Google Drive :</span>
          </p>
          <ul className="pl-6 list-disc space-y-0.5 text-[11px] font-mono text-slate-700 dark:text-slate-300">
            <li>My Drive / Univers Gaming Vault / Badges LAN 2026 /</li>
            <li>My Drive / Univers Gaming Vault / Reçus Mécénat 2026 /</li>
            <li>My Drive / Univers Gaming Vault / Archives PDF /</li>
          </ul>
        </div>

        {/* Sync Summary Controls */}
        <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between bg-white dark:bg-slate-900">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Statut du Coffre Cloud</p>
            <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
              {syncedCount} sur {documents.length} document(s) sauvegardés
            </p>
          </div>

          <button
            onClick={onSyncAllDocuments}
            disabled={!driveConnected}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-amber-600 hover:bg-slate-800 dark:hover:bg-amber-500 text-white text-xs font-bold rounded-xl disabled:opacity-50 transition-all cursor-pointer shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Synchroniser Tout</span>
          </button>
        </div>

        {/* Synced Documents Checklist */}
        <div className="mt-4">
          <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            Fichiers en file de synchronisation Drive
          </h4>
          <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
            {documents.map((doc) => (
              <div 
                key={doc.id}
                className="p-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2 truncate pr-2">
                  <CloudUpload className={`w-4 h-4 shrink-0 ${doc.driveSynced ? 'text-emerald-500' : 'text-slate-400'}`} />
                  <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">{doc.title}</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono whitespace-nowrap ${
                  doc.driveSynced 
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' 
                    : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                }`}>
                  {doc.driveSynced ? 'Drive OK' : 'En attente'}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
