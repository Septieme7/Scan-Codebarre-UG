import React, { useState } from 'react';
import { 
  Folder, 
  FolderOpen, 
  Search, 
  Grid, 
  List as ListIcon, 
  FileText, 
  Printer, 
  Mail, 
  CloudUpload, 
  Barcode, 
  Tag, 
  CheckCircle2, 
  ChevronRight,
  Filter,
  Trash2
} from 'lucide-react';
import { DocumentCategory, ScannedDocument } from '../types';

interface FolderViewProps {
  documents: ScannedDocument[];
  onSelectDocument: (doc: ScannedDocument) => void;
  onOpenEmailModal: (doc: ScannedDocument) => void;
  onSyncToDrive: (docId: string) => void;
  onDeleteDocument: (docId: string) => void;
}

const CATEGORIES: { key: DocumentCategory | 'all'; label: string; icon: string; desc: string }[] = [
  { key: 'all', label: 'Tous les Documents', icon: '📁', desc: 'Vue d\'ensemble du coffre PDF' },
  { key: 'badges_lan', label: 'Badges LAN & Accès', icon: '🎟️', desc: 'Attestations d\'inscription e-sport' },
  { key: 'recus_mecenat', label: 'Reçus de Don & Mécénat', icon: '📜', desc: 'Justificatifs fiscaux Art. 238 bis' },
  { key: 'inscriptions_tournois', label: 'Inscriptions Tournois', icon: '🎮', desc: 'Fiches participants Univers Gaming' },
  { key: 'justificatifs_paiement', label: 'Paiements Stripe', icon: '💳', desc: 'Reçus de paiements sécurisés' },
  { key: 'archives', label: 'Archives Générales', icon: '📦', desc: 'Documents classés conservés' },
];

export const FolderView: React.FC<FolderViewProps> = ({
  documents,
  onSelectDocument,
  onOpenEmailModal,
  onSyncToDrive,
  onDeleteDocument
}) => {
  const [activeCategory, setActiveCategory] = useState<DocumentCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Filter documents
  const filteredDocuments = documents.filter((doc) => {
    const matchesCategory = activeCategory === 'all' || doc.category === activeCategory;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = 
      !query ||
      doc.title.toLowerCase().includes(query) ||
      (doc.participantName && doc.participantName.toLowerCase().includes(query)) ||
      (doc.email && doc.email.toLowerCase().includes(query)) ||
      doc.barcode.toLowerCase().includes(query) ||
      (doc.transactionRef && doc.transactionRef.toLowerCase().includes(query));

    return matchesCategory && matchesSearch;
  });

  const getCategoryCount = (catKey: DocumentCategory | 'all') => {
    if (catKey === 'all') return documents.length;
    return documents.filter(d => d.category === catKey).length;
  };

  return (
    <div id="vault" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Category Folders Toolbar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>Arborescence des Dossiers</span>
          </h2>
          
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            {filteredDocuments.length} document(s) affiché(s)
          </span>
        </div>

        {/* Folder Cards Selector */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {CATEGORIES.map((cat) => {
            const count = getCategoryCount(cat.key);
            const isSelected = activeCategory === cat.key;

            return (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between h-28 relative overflow-hidden ${
                  isSelected
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-600/20 dark:bg-emerald-600'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{cat.icon}</span>
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
                    isSelected 
                      ? 'bg-emerald-700 text-white' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}>
                    {count}
                  </span>
                </div>

                <div>
                  <p className={`text-xs font-bold leading-tight line-clamp-1 ${
                    isSelected ? 'text-white' : 'text-slate-900 dark:text-white'
                  }`}>
                    {cat.label}
                  </p>
                  <p className={`text-[10px] mt-0.5 line-clamp-1 ${
                    isSelected ? 'text-emerald-100' : 'text-slate-500 dark:text-slate-400'
                  }`}>
                    {cat.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search & Layout Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
        
        {/* Search Input */}
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par nom, email, barcode, réf..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Grid vs Table View Mode */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setViewMode('grid')}
            title="Vue Grille de Cartes"
            className={`p-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              viewMode === 'grid' 
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' 
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            title="Vue Tableau Liste"
            className={`p-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              viewMode === 'table' 
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' 
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ListIcon className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Empty State */}
      {filteredDocuments.length === 0 && (
        <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
          <FileText className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">Aucun document ne correspond à vos critères</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Scannez un code-barres avec l'Intermec SG20T ou modifiez votre recherche.
          </p>
        </div>
      )}

      {/* GRID VIEW */}
      {viewMode === 'grid' && filteredDocuments.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDocuments.map((doc) => (
            <div
              key={doc.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 transition-all shadow-sm hover:shadow-md flex flex-col justify-between group"
            >
              <div>
                
                {/* Top Badge Row (Clean Unboxed Text Metadata) */}
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {doc.barcode}
                  </span>
                  <span>{doc.dateProcessed}</span>
                </div>

                {/* Title */}
                <h3 
                  onClick={() => onSelectDocument(doc)}
                  className="font-bold text-slate-900 dark:text-white text-base hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer line-clamp-2 transition-colors"
                >
                  {doc.title}
                </h3>

                {/* Participant Details */}
                <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Participant:</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">{doc.participantName || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">E-mail:</span>
                    <span className="font-mono text-slate-700 dark:text-slate-300 truncate max-w-[180px]">{doc.email || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Montant / Transaction:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{doc.amount || '0€'}</span>
                  </div>
                </div>

              </div>

              {/* Card Footer Actions */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${doc.driveSynced ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    {doc.driveSynced ? 'Drive Synced' : 'Drive local'}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  
                  {/* Quick Email */}
                  <button
                    onClick={() => onOpenEmailModal(doc)}
                    title="Envoyer par email"
                    className="p-1.5 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Mail className="w-4 h-4" />
                  </button>

                  {/* Drive Sync */}
                  {!doc.driveSynced && (
                    <button
                      onClick={() => onSyncToDrive(doc.id)}
                      title="Sauvegarder sur Google Drive"
                      className="p-1.5 text-slate-500 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/50 rounded-lg transition-colors cursor-pointer"
                    >
                      <CloudUpload className="w-4 h-4" />
                    </button>
                  )}

                  {/* Direct 1-Page Print View */}
                  <button
                    onClick={() => onSelectDocument(doc)}
                    title="Aperçu & Impression 1-Page"
                    className="px-2.5 py-1 bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>Consulter</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                </div>

              </div>

            </div>
          ))}
        </div>
      )}

      {/* TABLE VIEW */}
      {viewMode === 'table' && filteredDocuments.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider">
                <tr>
                  <th className="p-3.5">Document / Code-barres</th>
                  <th className="p-3.5">Participant</th>
                  <th className="p-3.5">E-mail</th>
                  <th className="p-3.5">Dossier</th>
                  <th className="p-3.5">Statut Drive</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200 font-medium">
                {filteredDocuments.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-3.5">
                      <p 
                        onClick={() => onSelectDocument(doc)}
                        className="font-bold text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer"
                      >
                        {doc.title}
                      </p>
                      <p className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">{doc.barcode}</p>
                    </td>
                    <td className="p-3.5 font-semibold">{doc.participantName || '—'}</td>
                    <td className="p-3.5 font-mono text-slate-500 dark:text-slate-400">{doc.email || '—'}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                        {doc.category}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        doc.driveSynced 
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' 
                          : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                      }`}>
                        {doc.driveSynced ? 'Drive OK' : 'Local'}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onOpenEmailModal(doc)}
                          className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-300"
                        >
                          <Mail className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onSelectDocument(doc)}
                          className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-semibold text-[11px]"
                        >
                          Aperçu / Imprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
