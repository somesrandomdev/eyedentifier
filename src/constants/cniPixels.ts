/**
 * Positions constantes pour l'affichage pixel-parfait de la CNI sénégalaise
 * Basé sur l'image 300dpi de 856x540 pixels
 */
import { CNIPositions } from '../types/idCard';

// Positions pour la face avant
export const CNI_FRONT_POSITIONS: CNIPositions = {
  prenoms: { top: 182, left: 224, fontSize: '18px', fontWeight: 'bold' },
  nom: { top: 212, left: 224, fontSize: '18px', fontWeight: 'bold' },
  date_naissance: { top: 242, left: 224 },
  lieu_naissance: { top: 272, left: 224 },
  sexe: { top: 302, left: 224 },
  taille: { top: 332, left: 224 },
  cedeaonumber: { top: 380, left: 224, fontFamily: 'monospace' },
  date_delivrance: { top: 410, left: 224 },
  date_expiration: { top: 440, left: 224 },
  autorite: { top: 470, left: 224, fontSize: '12px' },
  serie_carte: { bottom: 38, left: 40, fontSize: '12px', opacity: '0.75' },
  photo: { top: 142, right: 62, width: '120px', height: '150px' },
  signature: { bottom: 90, right: 80, height: '30px', width: 'auto' },
  barcode: { bottom: 42, right: 62, width: '200px', height: '40px' }
};

// Dimensions de la CNI (300dpi)
export const CNI_DIMENSIONS = {
  width: 856,
  height: 540
};