import { ScannedDocument } from '../types';

export const initialDocuments: ScannedDocument[] = [
  {
    id: 'doc_badge_yocgwpman',
    title: 'Badge LAN — TEST JOUEUR (Turtle Kid\'s Kasparov)',
    originalFileName: 'Badge_Test_Joueur_Univers_Gaming_b4f65ea4.pdf',
    fileUrl: '/assets/aistudio/Badge_Test_Joueur_Univers_Gaming_b4f65ea4.pdf',
    category: 'badges_lan',
    barcode: '*UG-P_YOCGWPMAN*',
    participantName: 'TEST JOUEUR',
    email: 'Lordstiko7@gmail.com',
    amount: '27€',
    dateProcessed: '2026-11-02 14:32',
    transactionRef: 'cs_sim_h6mykt7cb9b',
    status: 'sorted',
    driveSynced: true,
    driveFileId: 'drive_file_991823712',
    notes: 'Inclus matériel prêt (Casque filaire jack 3.5mm), statut payé via Stripe.',
    tags: ['LAN', 'E-Sport', 'Badge', 'Solo Individual', 'Kasparov']
  },
  {
    id: 'doc_mecenat_a9h8sz7n8',
    title: 'Reçu de Don et Mécénat — Test Move&Swim (Bronze Partner)',
    originalFileName: 'Recu_Mecenat_Test_Move_Swim_Univers_Gaming_53cb1cdb.pdf',
    fileUrl: '/assets/aistudio/Recu_Mecenat_Test_Move_Swim_Univers_Gaming_53cb1cdb.pdf',
    category: 'recus_mecenat',
    barcode: '*UG-MEC-2026-A9H8SZ7N8*',
    participantName: 'Test Move&Swim',
    email: 'contact@entreprise.fr',
    amount: '10€',
    dateProcessed: '2026-11-01 10:15',
    transactionRef: 'UG-MEC-2026-A9H8SZ7N8',
    status: 'sorted',
    driveSynced: true,
    driveFileId: 'drive_file_882910293',
    notes: 'Palier Bronze Partner (<500€). Justificatif fiscal Art. 238 bis CGI.',
    tags: ['Mécénat', 'Don', 'Reçu', 'Bronze Partner', 'Move&Swim']
  }
];
