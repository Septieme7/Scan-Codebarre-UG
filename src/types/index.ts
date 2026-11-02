export type DocumentCategory = 
  | 'badges_lan'
  | 'recus_mecenat'
  | 'inscriptions_tournois'
  | 'justificatifs_paiement'
  | 'archives';

export interface ScannedDocument {
  id: string;
  title: string;
  originalFileName: string;
  fileUrl: string;
  category: DocumentCategory;
  barcode: string; // e.g. *UG-P_YOCGWPMAN* or UG-MEC-2026-A9H8SZ7N8
  participantName?: string;
  email?: string;
  amount?: string;
  dateProcessed: string;
  transactionRef?: string;
  status: 'sorted' | 'pending' | 'archived';
  driveSynced?: boolean;
  driveFileId?: string;
  notes?: string;
  tags: string[];
}

export interface NetlifyUserProfile {
  id: string; // p_yocgwpman, etc.
  pseudo: string;
  nomComplet?: string;
  email: string;
  typeInscription: 'joueur' | 'mecenat' | 'visiteur' | 'sponsor';
  evenement: string;
  statutPaiement: 'PAYÉ' | 'EN_ATTENTE' | 'OFFERT';
  montant: string;
  referenceTransaction: string;
  dateRegistration: string;
  telephone?: string;
  association?: string;
}

export interface DriveAccountInfo {
  email: string;
  isConnected: boolean;
  quotaUsed?: string;
  quotaTotal?: string;
  lastSyncTime?: string;
}

export interface EmailPayload {
  to: string;
  subject: string;
  body: string;
  documentId: string;
  attachmentName: string;
  includePdfAttachment: boolean;
}
