import React, { useState, useEffect } from 'react';
import { 
  Send, 
  X, 
  Paperclip, 
  CheckCircle2, 
  Mail, 
  FileText, 
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { ScannedDocument } from '../types';

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: ScannedDocument | null;
  onSendSuccess?: (recipient: string) => void;
}

export const EmailModal: React.FC<EmailModalProps> = ({
  isOpen,
  onClose,
  document,
  onSendSuccess
}) => {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [attachPdf, setAttachPdf] = useState(true);
  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  useEffect(() => {
    if (document) {
      setTo(document.email || 'scangt7@gmail.com');
      const docTypeLabel = document.category === 'recus_mecenat' ? 'Reçu de Mécénat / Don' : 'Badge Inscription LAN';
      setSubject(`[Univers Gaming] Document Officiel : ${docTypeLabel} - ${document.participantName || 'Participant'}`);
      
      setBody(
`Bonjour ${document.participantName || 'Participant'},\n\nVeuillez trouver ci-joint votre document officiel Univers Gaming / Move&Swim.\n\n` +
`• Document : ${document.title}\n` +
`• Référence Barcode : ${document.barcode}\n` +
`• Transaction : ${document.transactionRef || 'Validée'}\n` +
`• Montant : ${document.amount || 'PAYÉ'}\n` +
`• Date du scan : ${document.dateProcessed}\n\n` +
`Ce document fait foi de justificatif officiel. Conservez-le précieusement.\n\n` +
`Sportivement,\n` +
`L'Équipe Univers Gaming / Move&Swim\n` +
`Pôle E-Sport & Secrétariat Administratif`
      );
      setSentSuccess(false);
    }
  }, [document]);

  if (!isOpen || !document) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    setTimeout(() => {
      setSending(false);
      setSentSuccess(true);
      if (onSendSuccess) onSendSuccess(to);
      
      setTimeout(() => {
        setSentSuccess(false);
        onClose();
      }, 1500);
    }, 800);
  };

  const handleOpenMailto = () => {
    const mailtoUrl = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in no-print">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-xl w-full p-6 relative">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-lg">Envoi Rapide par E-Mail</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Expédition automatisée du document validé</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Email Form */}
        <form onSubmit={handleSend} className="space-y-4 my-4">
          
          {/* Recipient */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Destinataire (E-mail)
            </label>
            <input
              type="email"
              required
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="ex: Lordstiko7@gmail.com"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Subject */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Objet du Message
            </label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Body */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Contenu du Message
            </label>
            <textarea
              rows={5}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
            />
          </div>

          {/* Attachment Box */}
          <div className="p-3 bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/50 rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Paperclip className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <div>
                <p className="font-bold text-slate-900 dark:text-white">{document.originalFileName}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Document PDF scanné original</p>
              </div>
            </div>

            <label className="flex items-center gap-1.5 cursor-pointer">
              <input 
                type="checkbox" 
                checked={attachPdf}
                onChange={(e) => setAttachPdf(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">Joindre PDF</span>
            </label>
          </div>

          {/* Success Notification */}
          {sentSuccess && (
            <div className="p-3 bg-emerald-500 text-white rounded-xl flex items-center gap-2 text-xs font-bold animate-pulse">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>E-mail envoyé avec succès à {to} !</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleOpenMailto}
              className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Ouvrir dans client e-mail local</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Annuler
              </button>

              <button
                type="submit"
                disabled={sending}
                className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-sm transition-colors cursor-pointer disabled:opacity-50"
              >
                {sending ? (
                  <Sparkles className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span>{sending ? 'Envoi...' : 'Envoyer Maintenant'}</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
