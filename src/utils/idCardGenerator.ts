/**
 * Utilitaires pour générer les données complètes de la CNI sénégalaise
 */
import { IdCardForm, MRZData } from '../types/idCard';
import { generateCni } from './senegalUtils';

/**
 * Génère un numéro CEDEAO au format sénégalais
 * Format: 14 chiffres (ex: 10419930717000024)
 */
export function generateCedeaonumber(): string {
  // Format: 1 + code pays (04) + date naissance (YYMMDD) + seq (7) + checksum
  const today = new Date();
  const year = String(today.getFullYear()).slice(-2);
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const seq = String(Math.floor(Math.random() * 10000000)).padStart(7, '0');
  
  // Calcul checksum simple pour la démo
  const base = `104${year}${month}${day}${seq}`;
  const checksum = String(Math.floor(Math.random() * 10));
  
  return base + checksum;
}

/**
 * Génère un numéro de série de carte aléatoire
 * Format: 7 caractères alphanumériques (ex: 2275HLM5)
 */
export function generateCardSeries(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 7; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result.toUpperCase();
}

/**
 * Calcule la date d'expiration (10 ans après la date de délivrance)
 */
export function calculateExpiryDate(dateDelivrance: string): string {
  const date = new Date(dateDelivrance);
  date.setFullYear(date.getFullYear() + 10);
  return date.toISOString().split('T')[0]; // YYYY-MM-DD format
}

/**
 * Génère les données MRZ (Machine Readable Zone) pour la CNI
 */
export function generateMRZData(formData: IdCardForm): MRZData {
  const { nom, prenoms, date_naissance, sexe, cedeaonumber } = formData;
  
  // Format MRZ TD-3 (Passport format)
  const documentType = 'I';
  const countryCode = 'SEN';
  const documentNumber = cedeaonumber.replace(/-/g, '').slice(-9); // 9 chars max
  const birthDate = date_naissance.slice(2).replace(/-/g, ''); // YYMMDD
  const expiryDate = formData.date_expiration.slice(2).replace(/-/g, ''); // YYMMDD
  
  // Calcul des check digits (simplifiés pour la démo)
  const checkDigit1 = calculateMRZCheckDigit(documentNumber);
  const checkDigit2 = calculateMRZCheckDigit(birthDate + sexe);
  const checkDigit3 = calculateMRZCheckDigit(expiryDate);
  const checkDigit4 = calculateMRZCheckDigit(documentNumber + checkDigit1 + birthDate + checkDigit2 + expiryDate + checkDigit3);
  
  const optionalData = prenoms.slice(0, 6).toUpperCase();
  
  const line1 = `${documentType}<${countryCode}${documentNumber}${checkDigit1}${birthDate}${checkDigit2}${sexe}${expiryDate}${checkDigit3}${optionalData}${checkDigit4}`;
  const line2 = `${documentNumber}${checkDigit1}${birthDate}${checkDigit2}${sexe}${expiryDate}${checkDigit3}${optionalData}`.padEnd(44, '<');
  
  return {
    line1,
    line2,
    documentType,
    countryCode,
    documentNumber,
    checkDigit1,
    birthDate,
    checkDigit2,
    sex: sexe,
    expiryDate,
    checkDigit3,
    optionalData,
    checkDigit4
  };
}

/**
 * Calcul simplifié d'un chiffre de contrôle MRZ
 */
function calculateMRZCheckDigit(data: string): string {
  let sum = 0;
  const weights = [7, 3, 1];
  
  for (let i = 0; i < data.length; i++) {
    let value: number;
    const char = data[i];
    
    if (char === '<') {
      value = 0;
    } else if (char >= 'A' && char <= 'Z') {
      value = char.charCodeAt(0) - 55; // A=10, B=11, etc.
    } else if (char >= '0' && char <= '9') {
      value = parseInt(char);
    } else {
      value = 0;
    }
    
    sum += value * weights[i % 3];
  }
  
  return String(sum % 10);
}

/**
 * Complète les données de la CNI avec les champs auto-générés
 */
export function completeIdCardData(formData: Partial<IdCardForm>): IdCardForm {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  
  const cedeaonumber = generateCedeaonumber();
  const serie_carte = generateCardSeries();
  const date_expiration = calculateExpiryDate(todayStr);
  
  return {
    nom: formData.nom || '',
    prenoms: formData.prenoms || '',
    date_naissance: formData.date_naissance || '',
    lieu_naissance: formData.lieu_naissance || '',
    sexe: formData.sexe || 'M',
    taille_cm: formData.taille_cm || 170,
    profession: formData.profession || '',
    adresse: formData.adresse || '',
    telephone: formData.telephone || '',
    email: formData.email || '',
    cedeaonumber,
    date_delivrance: todayStr,
    date_expiration,
    autorite: 'SIP / DAKAR-PLATEAU',
    serie_carte,
    photo_file: formData.photo_file,
    photo_url: formData.photo_url,
    signature_base64: formData.signature_base64
  };
}

/**
 * Formate une date au format français DD/MM/YYYY
 */
export function formatDateFrench(dateStr: string): string {
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Formate le numéro CEDEAO sans tirets pour l'affichage
 */
export function formatCedeaonumberForDisplay(cedeaonumber: string): string {
  return cedeaonumber.replace(/-/g, '');
}