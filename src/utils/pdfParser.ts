import { DocumentCategory, NetlifyUserProfile, ScannedDocument } from '../types';

/**
 * Normalizes barcode input strings scanned by physical Intermec SG20T
 * Example: "*UG-P_YOCGWPMAN*" -> "UG-P_YOCGWPMAN" or "p_yocgwpman"
 */
export function normalizeBarcode(rawInput: string): string {
  if (!rawInput) return '';
  return rawInput.trim().replace(/^\*+|\*+$/g, '').toUpperCase();
}

/**
 * Classifies document into category based on barcode prefix or text contents
 */
export function classifyDocumentCategory(textOrBarcode: string): DocumentCategory {
  const normalized = textOrBarcode.toUpperCase();
  if (normalized.includes('MEC') || normalized.includes('MÉCÉNAT') || normalized.includes('DON')) {
    return 'recus_mecenat';
  }
  if (normalized.includes('BADGE') || normalized.includes('UG-P_') || normalized.includes('YOCGWPMAN') || normalized.includes('LAN')) {
    return 'badges_lan';
  }
  if (normalized.includes('INS') || normalized.includes('INSCRIPTION') || normalized.includes('TOURNOI')) {
    return 'inscriptions_tournois';
  }
  if (normalized.includes('PAY') || normalized.includes('PAIEMENT') || normalized.includes('RECU')) {
    return 'justificatifs_paiement';
  }
  return 'archives';
}

/**
 * Matches a scanned barcode against Netlify user profiles from univers-gaming.com
 */
export function findMatchingNetlifyProfile(
  barcode: string,
  profiles: NetlifyUserProfile[]
): NetlifyUserProfile | undefined {
  const clean = normalizeBarcode(barcode).toLowerCase();
  
  return profiles.find((p) => {
    const idClean = p.id.toLowerCase().replace(/^\*+|\*+$/g, '');
    const refClean = p.referenceTransaction.toLowerCase();
    const pseudoClean = p.pseudo.toLowerCase();
    const emailClean = p.email.toLowerCase();

    return (
      clean.includes(idClean) ||
      idClean.includes(clean) ||
      clean.includes(refClean) ||
      clean.includes(pseudoClean) ||
      clean === emailClean
    );
  });
}

/**
 * Auto-creates a new ScannedDocument record from a barcode scan or uploaded PDF file
 */
export function createSortedDocumentFromScan(
  barcodeRaw: string,
  fileName: string,
  fileUrl: string,
  profiles: NetlifyUserProfile[]
): ScannedDocument {
  const cleanBarcode = normalizeBarcode(barcodeRaw);
  const matchedProfile = findMatchingNetlifyProfile(cleanBarcode, profiles);
  const category = classifyDocumentCategory(cleanBarcode + ' ' + fileName);

  const formattedDate = new Date().toISOString().replace('T', ' ').substring(0, 16);

  if (matchedProfile) {
    return {
      id: `doc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      title: matchedProfile.typeInscription === 'mecenat' 
        ? `Reçu Mécénat — ${matchedProfile.pseudo}` 
        : `Badge LAN — ${matchedProfile.pseudo} (${matchedProfile.evenement})`,
      originalFileName: fileName,
      fileUrl,
      category,
      barcode: `*${cleanBarcode}*`,
      participantName: matchedProfile.pseudo,
      email: matchedProfile.email,
      amount: matchedProfile.montant,
      dateProcessed: formattedDate,
      transactionRef: matchedProfile.referenceTransaction,
      status: 'sorted',
      driveSynced: false,
      notes: `Classé automatiquement via données Netlify Univers Gaming. Réf: ${matchedProfile.referenceTransaction}`,
      tags: [matchedProfile.evenement, matchedProfile.typeInscription.toUpperCase(), category]
    };
  }

  return {
    id: `doc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    title: `Document Scanné — ${cleanBarcode || 'Inconnu'}`,
    originalFileName: fileName,
    fileUrl,
    category,
    barcode: `*${cleanBarcode}*`,
    participantName: 'Non identifié',
    email: '',
    amount: 'N/A',
    dateProcessed: formattedDate,
    transactionRef: cleanBarcode,
    status: 'pending',
    driveSynced: false,
    notes: 'Scan direct Intermec SG20T — En attente de qualification',
    tags: ['Intermec SG20T', category]
  };
}
