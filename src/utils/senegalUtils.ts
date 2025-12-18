/**
 * Utilitaires spécifiques au Sénégal
 */

/**
 * Génère un numéro CNI au format officiel sénégalais
 * Format: SN-YYYY-###### (Année + numéro séquentiel sur 6 chiffres)
 */
export const generateCni = async (supabase: any): Promise<string> => {
  const year = new Date().getFullYear();

  // Get current count for sequential numbering
  const { count } = await supabase
    .from('citoyens')
    .select('*', { count: 'exact', head: true });

  const seq = (count ?? 0) + 1;
  const paddedSeq = String(seq).padStart(6, '0');

  return `SN-${year}-${paddedSeq}`;
};

/**
 * Coordonnées géographiques du Sénégal (vraies limites)
 */
export const SENEGAL_BOUNDS = {
  north: 16.7,    // Point le plus au nord
  south: 12.2,    // Point le plus au sud  
  west: -17.1,    // Point le plus à l'Ouest
  east: -11.3     // Point le plus à l'Est
};

/**
 * Génère des coordonnées aléatoires dans les vraies limites du Sénégal
 */
export const generateSenegalCoordinates = (): [number, number] => {
  const latitude = Math.random() * (SENEGAL_BOUNDS.north - SENEGAL_BOUNDS.south) + SENEGAL_BOUNDS.south;
  const longitude = Math.random() * (SENEGAL_BOUNDS.east - SENEGAL_BOUNDS.west) + SENEGAL_BOUNDS.west;
  return [latitude, longitude];
};

/**
 * Régions du Sénégal avec leurs coordonnées principales
 */
export const SENEGAL_REGIONS = [
  {
    name: 'Dakar',
    capital: 'Dakar',
    coordinates: [14.7167, -17.4677] as [number, number],
    departments: ['Dakar', 'Guédiawaye', 'Keur Massar', 'Rufisque']
  },
  {
    name: 'Thiès',
    capital: 'Thiès', 
    coordinates: [14.7833, -16.9333] as [number, number],
    departments: ['Thiès', 'Mbour', 'Tivaouane', 'Kébémer']
  },
  {
    name: 'Saint-Louis',
    capital: 'Saint-Louis',
    coordinates: [16.0179, -16.4896] as [number, number],
    departments: ['Saint-Louis', 'Dagana', 'Podor']
  },
  {
    name: 'Ziguinchor',
    capital: 'Ziguinchor',
    coordinates: [12.5667, -16.2719] as [number, number],
    departments: ['Ziguinchor', 'Oussouye', 'Bignona', 'Sédhiou']
  },
  {
    name: 'Kaolack',
    capital: 'Kaolack',
    coordinates: [14.1500, -16.0667] as [number, number],
    departments: ['Kaolack', 'Nioro du Rip', 'Guinguinéo']
  },
  {
    name: 'Fatick',
    capital: 'Fatick',
    coordinates: [14.3333, -16.4000] as [number, number],
    departments: ['Fatick', 'Foundiougne', 'Gossas']
  },
  {
    name: 'Kaffrine',
    capital: 'Kaffrine',
    coordinates: [14.1000, -15.5500] as [number, number],
    departments: ['Kaffrine', 'Bambey', 'Malem Hoddar', 'Koungheul']
  },
  {
    name: 'Diourbel',
    capital: 'Diourbel',
    coordinates: [14.6500, -16.2333] as [number, number],
    departments: ['Diourbel', 'Bambey', 'Mbacké', 'Dakar-2']
  },
  {
    name: 'Tambacounda',
    capital: 'Tambacounda',
    coordinates: [13.7667, -13.6667] as [number, number],
    departments: ['Tambacounda', 'Bakel', 'Goudiry', 'Kédougou']
  },
  {
    name: 'Kédougou',
    capital: 'Kédougou',
    coordinates: [12.5500, -12.1833] as [number, number],
    departments: ['Kédougou', 'Saraya', 'Salémata']
  },
  {
    name: 'Matam',
    capital: 'Matam',
    coordinates: [15.6500, -13.3167] as [number, number],
    departments: ['Matam', 'Kanel', 'Ranérou']
  },
  {
    name: 'Louga',
    capital: 'Louga',
    coordinates: [15.6167, -16.2167] as [number, number],
    departments: ['Louga', 'Kébémer', 'Linguère']
  },
  {
    name: 'Sédhiou',
    capital: 'Sédhiou',
    coordinates: [12.7000, -15.5500] as [number, number],
    departments: ['Sédhiou', 'Goudomp', 'Bounkiling']
  }
];

/**
 * Noms de famille sénégalais courants
 */
export const SENEGAL_LAST_NAMES = [
  'Diallo', 'Ba', 'Sow', 'Sy', 'Cissé', 'Ndiaye', 'Fall', 'Camara',
  'Diop', 'Diarra', 'Faye', 'Touré', 'Barry', 'Kane', 'Lo', 'Coly',
  'Jagne', 'Sonko', 'Gueye', 'Senghor', 'Badji', 'Njie',
  'Mendy', 'Jallow', 'Gomez', 'Baldé', 'Loum', 'Mané', 'Dramé',
  'Kébé', 'Niane', 'Thiam', 'Sall', 'Wane', 'Kebe'
];

/**
 * Prénoms sénégalais courants
 */
export const SENEGAL_FIRST_NAMES = [
  // Masculins
  'Amadou', 'Ibrahima', 'Modou', 'Moussa', 'Oumar', 'Babacar', 'Cheikh',
  'Mamadou', 'Abdoulaye', 'Issa', 'Ali', 'Boubacar', 'Doudou',
  'Lamine', 'Abdou', 'Serigne', 'Bakary', 'El Hadji', 'Moustapha',
  // Féminins  
  'Aïssatou', 'Fatou', 'Aïda', 'Marième', 'Adja', 'Rokhaya', 'Astou',
  'Khady', 'Mame', 'Awa', 'Anta', 'Ndéye', 'Yacine', 'Seynabou',
  'Bassirou', 'Mame Diarra', 'Coumba', 'Dieynaba', 'Khadija'
];

/**
 * Professions sénégalaises courantes
 */
export const SENEGAL_PROFESSIONS = [
  'Cultivateur', 'Commerçant', 'Enseignant', 'Chauffeur', 'Mécanicien',
  'Couturier', 'Vendeur', 'Secrétaire', 'Comptable', 'Infirmier',
  'Vendeur ambulant', 'Maraîcher', 'Pêcheur', 'Éleveur', 'Artisan',
  'Boulanger', 'Maçon', 'Électricien', 'Plombier',
  'Coiffeur', 'Cuisinier', 'Taximan', 'Livreur', 'Garçon de café',
  'Vendeur de fruits', 'Marchand de tissus', 'Tailleur', 'Chaudronnier',
  'Menuisier', 'Peintre', 'Vitrier', 'Sellier', 'Charpentier'
];

/**
 * Langues officielles du Sénégal
 */
export const SENEGAL_LANGUAGES = [
  'Français', 'Wolof', 'Pulaar', 'Serer', 'Mandinka', 'Soninke', 'Maure'
];

/**
 * Religions au Sénégal
 */
export const SENEGAL_RELIGIONS = [
  'Islam', 'Christianisme', 'Animisme', 'Autres'
];

/**
 * Formate une date au format sénégalais
 */
export const formatSenegalDate = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit', 
    year: 'numeric'
  });
};

/**
 * Génère un citoyen sénégalais aléatoire
 */
export const generateRandomSenegalese = () => {
  const firstName = SENEGAL_FIRST_NAMES[Math.floor(Math.random() * SENEGAL_FIRST_NAMES.length)];
  const lastName = SENEGAL_LAST_NAMES[Math.floor(Math.random() * SENEGAL_LAST_NAMES.length)];
  const profession = SENEGAL_PROFESSIONS[Math.floor(Math.random() * SENEGAL_PROFESSIONS.length)];
  const region = SENEGAL_REGIONS[Math.floor(Math.random() * SENEGAL_REGIONS.length)];
  
  return {
    firstName,
    lastName,
    profession,
    birthPlace: region.capital,
    region: region.name
  };
};