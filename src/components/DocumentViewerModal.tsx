import React from 'react';
import { 
  X, 
  Printer, 
  Mail, 
  CloudUpload, 
  Tag, 
  FolderSync, 
  Barcode, 
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  FileText
} from 'lucide-react';
import { DocumentCategory, ScannedDocument } from '../types';

interface DocumentViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: ScannedDocument | null;
  onOpenEmailModal: (doc: ScannedDocument) => void;
  onChangeCategory: (docId: string, newCategory: DocumentCategory) => void;
  onSyncToDrive: (docId: string) => void;
}

const CATEGORY_LABELS: Record<DocumentCategory, string> = {
  badges_lan: 'Badge LAN & Attestation',
  recus_mecenat: 'Reçu de Don & Mécénat',
  inscriptions_tournois: 'Inscription Tournoi',
  justificatifs_paiement: 'Justificatif de Paiement',
  archives: 'Archives Générales'
};

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  isOpen,
  onClose,
  document,
  onOpenEmailModal,
  onChangeCategory,
  onSyncToDrive
}) => {
  if (!isOpen || !document) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in no-print">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-5xl w-full h-[90vh] flex flex-col relative overflow-hidden">
        
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 bg-slate-50/80 dark:bg-slate-800/80">
          <div className="flex items-center gap-3 truncate">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div className="truncate">
              <h3 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg truncate">
                {document.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                Code-barres : {document.barcode} · Scan : {document.dateProcessed}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Quick 1-Page Print Button */}
            <button
              onClick={handlePrint}
              title="Imprimer directement le document sur 1 seule page A4"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Imprimer (1 Page)</span>
            </button>

            {/* Fast Email Button */}
            <button
              onClick={() => onOpenEmailModal(document)}
              title="Envoyer le document par e-mail au participant"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
            >
              <Mail className="w-4 h-4" />
              <span className="hidden sm:inline">Envoyer E-Mail</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Split: Sidebar details + PDF Preview */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          
          {/* Left Column: Metadata & Controls (4 cols) */}
          <div className="lg:col-span-4 p-5 overflow-y-auto border-r border-slate-200 dark:border-slate-800 space-y-4 bg-white dark:bg-slate-900">
            
            {/* Folder Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Dossier de Classement
              </label>
              <select
                value={document.category}
                onChange={(e) => onChangeCategory(document.id, e.target.value as DocumentCategory)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            {/* Participant Details Card */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 dark:text-slate-400">Nom / Pseudo:</span>
                <span className="font-bold text-slate-900 dark:text-white">{document.participantName || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 dark:text-slate-400">E-mail:</span>
                <span className="font-mono text-slate-800 dark:text-slate-200">{document.email || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 dark:text-slate-400">Réf. Transaction:</span>
                <span className="font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  {document.transactionRef || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 dark:text-slate-400">Montant / Statut:</span>
                <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold rounded text-[10px]">
                  {document.amount || 'PAYÉ'}
                </span>
              </div>
            </div>

            {/* Google Drive Status */}
            <div className="p-3.5 bg-amber-50/50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <CloudUpload className={`w-4 h-4 ${document.driveSynced ? 'text-emerald-500' : 'text-amber-500'}`} />
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Google Drive Cloud</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {document.driveSynced ? 'Sauvegardé sur le Cloud' : 'En attente de transfert'}
                  </p>
                </div>
              </div>

              {!document.driveSynced && (
                <button
                  onClick={() => onSyncToDrive(document.id)}
                  className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-white text-[11px] font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Sauvegarder
                </button>
              )}
            </div>

            {/* Notes & Tags */}
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Notes d'automatisation
              </label>
              <p className="p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-300">
                {document.notes || 'Aucune remarque.'}
              </p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              {document.tags.map((tag, idx) => (
                <span key={idx} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[11px] rounded font-medium flex items-center gap-1">
                  <Tag className="w-3 h-3 text-slate-400" />
                  <span>{tag}</span>
                </span>
              ))}
            </div>

            <a 
              href={document.fileUrl} 
              target="_blank" 
              rel="noreferrer"
              className="w-full mt-2 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Ouvrir dans un nouvel onglet</span>
            </a>

          </div>

          {/* Right Column: Embedded Printable 1-Page PDF Viewer (8 cols) */}
          <div className="lg:col-span-8 bg-slate-100 dark:bg-slate-950 p-4 flex flex-col justify-center items-center overflow-auto relative">
            
            {/* Printable Area Wrapper for 1-Page PDF render */}
            <div className="print-area-container w-full max-w-2xl bg-white text-slate-900 rounded-xl shadow-lg border border-slate-200 p-6 flex flex-col justify-between aspect-[1/1.414] overflow-hidden">
              
              {/* PDF Document Mock/Embedded Visualizer */}
              <div className="space-y-4">
                
                {/* Header of PDF Document */}
                <div className="flex items-center justify-between border-b pb-3 border-slate-200">
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">UG UNIVERS GAMING</span>
                    <h2 className="text-lg font-extrabold text-slate-900">
                      {document.category === 'recus_mecenat' ? 'REÇU DE DON ET MÉCÉNAT' : 'BADGE D\'ACCÈS OFFICIEL LAN'}
                    </h2>
                    <p className="text-xs text-slate-600">Pôle E-Sport Association Move&Swim Loi 1901</p>
                  </div>
                  
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-slate-500">IDENTIFIANT UNIQUE</span>
                    <p className="text-xs font-bold font-mono text-emerald-700">{document.barcode}</p>
                  </div>
                </div>

                {/* Main Content Box */}
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                  <p className="text-xs text-slate-500 uppercase font-bold">Détails du Titulaire</p>
                  <p className="text-base font-extrabold text-slate-900">{document.participantName}</p>
                  <p className="text-xs font-mono text-slate-600">{document.email}</p>
                  <p className="text-xs text-slate-600">Statut de Règlement : <strong className="text-emerald-700">{document.amount} - PAIEMENT VALIDÉ STRIPE</strong></p>
                  <p className="text-xs text-slate-500">Référence Transaction : <span className="font-mono">{document.transactionRef}</span></p>
                </div>

                {/* Key Information & Rules */}
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
                  <p className="font-bold text-slate-800">ATTESTATION D'ENREGISTREMENT OFFICIELLE</p>
                  <p className="text-[11px] text-slate-600">
                    Ce document certifie le classement et la conformité administrative des pièces justificatives enregistrées le {document.dateProcessed}.
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Généré automatiquement via la plateforme Univers Gaming / Intermec SG20T Vault.
                  </p>
                </div>

                {/* Embedded PDF iframe fallback */}
                <div className="w-full h-48 border border-slate-200 rounded-lg overflow-hidden no-print">
                  <iframe 
                    src={`${document.fileUrl}#toolbar=0&navpanes=0`} 
                    className="w-full h-full border-none"
                    title="Aperçu PDF"
                  />
                </div>

              </div>

              {/* PDF Footer Barcode */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <div className="text-[10px] text-slate-500">
                  <p>Sise 14 HLM Le Vauban, 13230 Port-Saint-Louis-du-Rhône</p>
                  <p>Siret/RNA: W621004561 · contact@univers-gaming.com</p>
                </div>
                
                <div className="text-center font-mono">
                  <Barcode className="w-12 h-6 text-slate-800 mx-auto" />
                  <span className="text-[10px] font-bold text-slate-700">{document.barcode}</span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
