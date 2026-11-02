import { NetlifyUserProfile } from '../types';

export const initialNetlifyProfiles: NetlifyUserProfile[] = [
  {
    id: 'p_yocgwpman',
    pseudo: 'TEST JOUEUR',
    nomComplet: 'Test Joueur',
    email: 'Lordstiko7@gmail.com',
    typeInscription: 'joueur',
    evenement: 'Turtle Kid\'s "Kasparov"',
    statutPaiement: 'PAYÉ',
    montant: '27€',
    referenceTransaction: 'cs_sim_h6mykt7cb9b',
    dateRegistration: '2026-11-02',
    telephone: '07 50 92 40 60',
    association: 'Move&Swim / Univers Gaming'
  },
  {
    id: 'UG-MEC-2026-A9H8SZ7N8',
    pseudo: 'Test Move&Swim',
    nomComplet: 'Test Move&Swim (Donateur Mécène)',
    email: 'contact@entreprise.fr',
    typeInscription: 'mecenat',
    evenement: 'Soutien Compétitions E-Sport 2026',
    statutPaiement: 'PAYÉ',
    montant: '10€',
    referenceTransaction: 'UG-MEC-2026-A9H8SZ7N8',
    dateRegistration: '2026-11-01',
    telephone: '06 12 34 56 78',
    association: 'Move&Swim (Pôle Univers Gaming)'
  },
  {
    id: 'p_lan2026_alex',
    pseudo: 'Alex_ProGamer',
    nomComplet: 'Alexandre Dupont',
    email: 'alex.gamer@example.com',
    typeInscription: 'joueur',
    evenement: 'LAN Univers Gaming Championship 2026',
    statutPaiement: 'PAYÉ',
    montant: '35€',
    referenceTransaction: 'cs_sim_99812a3d',
    dateRegistration: '2026-10-28',
    telephone: '06 98 76 54 32',
    association: 'Univers Gaming'
  }
];
