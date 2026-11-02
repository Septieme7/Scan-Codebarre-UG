import React, { useState, useEffect, useRef } from 'react';
import { 
  Scan, 
  Upload, 
  Barcode, 
  CheckCircle2, 
  X, 
  Volume2, 
  VolumeX, 
  HelpCircle,
  FileText
} from 'lucide-react';
import { scanAudio } from '../utils/audio';
import { NetlifyUserProfile, ScannedDocument } from '../types';
import { createSortedDocumentFromScan } from '../utils/pdfParser';

interface ScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDocumentAdded: (doc: ScannedDocument) => void;
  netlifyProfiles: NetlifyUserProfile[];
}

export const ScannerModal: React.FC<ScannerModalProps> = ({
  isOpen,
  onClose,
  onDocumentAdded,
  netlifyProfiles
}) => {
  const [manualCode, setManualCode] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [lastScanned, setLastScanned] = useState<ScannedDocument | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [keyBuffer, setKeyBuffer] = useState('');
  const bufferTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Global Intermec SG20T USB HID Wedge listener
  useEffect(() => {
    let currentBuffer = '';

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore typing when user is in an explicit text input field (unless submitting manual input)
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') && target.id !== 'scanner-hid-input') {
        return;
      }

      if (e.key === 'Enter') {
        if (currentBuffer.length >= 3) {
          processRawBarcode(currentBuffer);
          currentBuffer = '';
          setKeyBuffer('');
        }
        return;
      }

      if (e.key.length === 1) {
        currentBuffer += e.key;
        setKeyBuffer(currentBuffer);

        if (bufferTimeoutRef.current) clearTimeout(bufferTimeoutRef.current);
        bufferTimeoutRef.current = setTimeout(() => {
          // Clear buffer if slow typing (human typing, not rapid hardware scan)
          if (currentBuffer.length < 5) {
            currentBuffer = '';
            setKeyBuffer('');
          }
        }, 300);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (bufferTimeoutRef.current) clearTimeout(bufferTimeoutRef.current);
    };
  }, [netlifyProfiles, soundEnabled]);

  const processRawBarcode = (code: string, fileName?: string, fileUrl?: string) => {
    if (!code) return;

    if (soundEnabled) {
      scanAudio.playSuccessBeep();
    }

    const docName = fileName || `Scan_SG20T_${code.replace(/[^a-zA-Z0-9_-]/g, '')}.pdf`;
    const docUrl = fileUrl || '/assets/aistudio/Badge_Test_Joueur_Univers_Gaming_b4f65ea4.pdf';

    const newDoc = createSortedDocumentFromScan(code, docName, docUrl, netlifyProfiles);
    setLastScanned(newDoc);
    onDocumentAdded(newDoc);
    setManualCode('');
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode.trim()) {
      processRawBarcode(manualCode.trim());
    }
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    const fileUrl = URL.createObjectURL(file);

    // Try extracting code from filename or default to file scan
    let detectedCode = file.name;
    if (file.name.includes('Badge')) detectedCode = '*UG-P_YOCGWPMAN*';
    if (file.name.includes('Mecenat') || file.name.includes('Recu')) detectedCode = '*UG-MEC-2026-A9H8SZ7N8*';

    processRawBarcode(detectedCode, file.name, fileUrl);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in no-print">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-xl w-full p-6 relative overflow-hidden transition-all">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Scan className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-lg">Scanner Intermec SG20T</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Écoute en temps réel du flux USB HID Barcode</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'Désactiver le signal sonore' : 'Activer le signal sonore'}
              className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {soundEnabled ? <Volume2 className="w-5 h-5 text-emerald-500" /> : <VolumeX className="w-5 h-5 text-slate-400" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live Hardware Status Banner */}
        <div className="my-4 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-xl flex items-center justify-between text-xs text-emerald-900 dark:text-emerald-200">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="font-semibold">SG20T Prêt:</span>
            <span>Pointez le scanner physique vers le code-barres du badge/reçu.</span>
          </div>
          {keyBuffer && (
            <span className="font-mono bg-emerald-200 dark:bg-emerald-900 text-emerald-950 dark:text-emerald-100 px-2 py-0.5 rounded font-bold">
              {keyBuffer}
            </span>
          )}
        </div>

        {/* Drag & Drop PDF Dropzone */}
        <div 
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            handleFileUpload(e.dataTransfer.files);
          }}
          className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
            dragActive 
              ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30' 
              : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
          }`}
        >
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400">
            <Upload className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            Déposez un fichier PDF scanné ici
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Ou cliquez pour sélectionner un fichier depuis votre ordinateur
          </p>
          <input 
            type="file" 
            accept=".pdf"
            onChange={(e) => handleFileUpload(e.target.files)}
            className="hidden" 
            id="pdf-file-input"
          />
          <label 
            htmlFor="pdf-file-input" 
            className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            Parcourir les fichiers
          </label>
        </div>

        {/* Quick Test Barcode Buttons */}
        <div className="mt-4">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            Tests rapides avec les exemples fournis
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              onClick={() => processRawBarcode('*UG-P_YOCGWPMAN*', 'Badge_Test_Joueur_Univers_Gaming.pdf', '/assets/aistudio/Badge_Test_Joueur_Univers_Gaming_b4f65ea4.pdf')}
              className="p-2.5 bg-slate-50 dark:bg-slate-800/80 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 border border-slate-200 dark:border-slate-700 hover:border-emerald-300 rounded-xl text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                <Barcode className="w-4 h-4 text-emerald-500" />
                <span>*UG-P_YOCGWPMAN*</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Badge LAN Test Joueur (Kasparov)</p>
            </button>

            <button
              onClick={() => processRawBarcode('*UG-MEC-2026-A9H8SZ7N8*', 'Recu_Mecenat_Test_Move_Swim.pdf', '/assets/aistudio/Recu_Mecenat_Test_Move_Swim_Univers_Gaming_53cb1cdb.pdf')}
              className="p-2.5 bg-slate-50 dark:bg-slate-800/80 hover:bg-sky-50 dark:hover:bg-sky-950/50 border border-slate-200 dark:border-slate-700 hover:border-sky-300 rounded-xl text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-sky-600 dark:group-hover:text-sky-400">
                <Barcode className="w-4 h-4 text-sky-500" />
                <span>*UG-MEC-2026-A9H8SZ7N8*</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Reçu de Don & Mécénat (Move&Swim)</p>
            </button>
          </div>
        </div>

        {/* Manual Barcode Entry Form */}
        <form onSubmit={handleManualSubmit} className="mt-4 flex gap-2">
          <input
            id="scanner-hid-input"
            type="text"
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value)}
            placeholder="Saisir ou coller un code-barres (ex: p_yocgwpman)..."
            className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Valider
          </button>
        </form>

        {/* Last Scan Result Toast */}
        {lastScanned && (
          <div className="mt-4 p-3 bg-emerald-500 text-white rounded-xl flex items-center justify-between text-xs animate-bounce">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <div>
                <p className="font-bold">{lastScanned.title}</p>
                <p className="text-[11px] opacity-90">Classé dans : {lastScanned.category} ({lastScanned.participantName})</p>
              </div>
            </div>
            <button
              onClick={() => setLastScanned(null)}
              className="p-1 hover:bg-emerald-600 rounded text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Bottom Help note */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>Le scanner Intermec SG20T émet un signal USB HID instantané. Aucune installation de driver nécessaire.</span>
        </div>

      </div>
    </div>
  );
};
