import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Upload, 
  X, 
  CheckCircle2, 
  Users, 
  Globe, 
  FileCode,
  Download
} from 'lucide-react';
import { NetlifyUserProfile } from '../types';

interface NetlifyImporterModalProps {
  isOpen: boolean;
  onClose: () => void;
  profiles: NetlifyUserProfile[];
  onImportProfiles: (newProfiles: NetlifyUserProfile[]) => void;
}

export const NetlifyImporterModal: React.FC<NetlifyImporterModalProps> = ({
  isOpen,
  onClose,
  profiles,
  onImportProfiles
}) => {
  const [jsonInput, setJsonInput] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleJsonUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        const arrayData = Array.isArray(parsed) ? parsed : [parsed];
        onImportProfiles(arrayData);
        setImportStatus(`${arrayData.length} profil(s) importé(s) avec succès !`);
      } catch {
        setImportStatus("Erreur : Fichier JSON invalide.");
      }
    };
    reader.readAsText(file);
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jsonInput.trim()) return;

    try {
      const parsed = JSON.parse(jsonInput);
      const arrayData = Array.isArray(parsed) ? parsed : [parsed];
      onImportProfiles(arrayData);
      setImportStatus(`${arrayData.length} profil(s) ajouté(s) à la base !`);
      setJsonInput('');
    } catch {
      setImportStatus("Erreur : Le format JSON saisi est incorrect.");
    }
  };

  const handleExportSample = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(profiles, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "univers_gaming_netlify_export.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in no-print">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-lg">Intégration Univers Gaming (Netlify)</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Source: https://univers-gaming.com/ — Données d'inscription *.json</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Database Counter */}
        <div className="my-4 p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-sky-500" />
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Profils Utilisateurs Synchronisés</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">{profiles.length} Inscription(s) Netlify Active(s)</p>
            </div>
          </div>

          <button
            onClick={handleExportSample}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Exporter JSON</span>
          </button>
        </div>

        {/* Import Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          
          {/* File Upload Box */}
          <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 text-center flex flex-col items-center justify-center">
            <Upload className="w-8 h-8 text-sky-500 mb-2" />
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Importer Fichier .JSON</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 mb-3">
              Fichier généré lors des inscriptions sur Univers Gaming
            </p>
            <input 
              type="file" 
              accept=".json"
              onChange={handleJsonUpload}
              className="hidden" 
              id="netlify-json-input" 
            />
            <label 
              htmlFor="netlify-json-input"
              className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Choisir Fichier JSON
            </label>
          </div>

          {/* Paste JSON Textarea */}
          <form onSubmit={handleTextSubmit} className="flex flex-col">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
              <FileCode className="w-3.5 h-3.5 text-sky-500" />
              <span>Coller du code JSON Netlify</span>
            </label>
            <textarea
              rows={3}
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder='[{"id": "p_yocgwpman", "pseudo": "TEST JOUEUR", "email": "..."}]'
              className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <button
              type="submit"
              className="mt-2 w-full py-1.5 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Charger les données
            </button>
          </form>

        </div>

        {/* Import Status Alert */}
        {importStatus && (
          <div className="p-3 bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-sky-900 dark:text-sky-200 text-xs rounded-xl flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-sky-500" />
            <span>{importStatus}</span>
          </div>
        )}

        {/* Existing Profiles List */}
        <div>
          <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            Base de profils synchronisée (Aperçu)
          </h4>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {profiles.map((p) => (
              <div 
                key={p.id}
                className="p-3 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white">{p.pseudo}</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300">
                      ID: {p.id}
                    </span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                    {p.email} · {p.evenement} ({p.montant})
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  {p.statutPaiement}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
