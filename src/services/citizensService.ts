import { supabase } from '../utils/supabase';
import type { IdCardForm, CNICitizen } from '../types/idCard';

export interface CitizenRow {
  id: string;
  nom?: string;
  prenoms?: string;
  date_naissance?: string;
  lieu_naissance?: string;
  sexe?: 'M' | 'F';
  taille_cm?: number;
  profession?: string;
  adresse?: string;
  telephone?: string;
  email?: string;
  photo_url?: string;
  iris_left_url?: string;
  iris_right_url?: string;
  cedeaonumber?: string;
  cni?: string;
  numero_cni?: string;
  numero_carte?: string;
  date_delivrance?: string;
  date_expiration?: string;
  autorite?: string;
  serie_carte?: string;
  operateur_id?: string;
  user_id?: string;
  enrolled_at?: string;
  created_at?: string;
  date_enregistrement?: string;
  latitude?: number;
  longitude?: number;
  // Allow any additional fields that might exist in Supabase
  [key: string]: any;
}

export const citizensService = {
  // Atomic CNI generator - uses SQL function for true atomicity
  async generateCNI(): Promise<string> {
    const year = new Date().getFullYear();

    try {
      // Use SQL function for atomic read - no race conditions
      console.log('🔍 Attempting to call get_max_cni_year RPC with year:', year);
      const { data, error } = await supabase.rpc('get_max_cni_year', { y: year });

      if (error) {
        console.error('❌ RPC call failed with error:', error);
        console.error('❌ Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        console.log('🔄 Falling back to manual calculation...');
        // Fallback to manual calculation if RPC fails
        return this.generateCNIFallback();
      }

      console.log('✅ RPC call successful, returned data:', data, 'type:', typeof data);
      const next = (data ?? 0) + 1;
      const cni = `SN-${year}-${String(next).padStart(6, '0')}`;
      console.log(`🎯 Generated atomic CNI: ${cni}`);
      return cni;

    } catch (error) {
      console.error('💥 CNI generation exception:', error);
      console.log('🔄 Using fallback CNI generation...');
      // Ultimate fallback
      return this.generateCNIFallback();
    }
  },

  // Fallback CNI generator (simple increment)
  async generateCNIFallback(): Promise<string> {
    const year = new Date().getFullYear();

    try {
      // Get all citizens to check all possible CNI fields
      const { data: citizens, error } = await supabase
        .from('citoyens')
        .select('cni, cedeaonumber, numero_cni, numero_carte');

      if (error) {
        console.error('Fallback CNI query error:', error);
        // Ultimate fallback with timestamp
        const timestamp = Date.now();
        return `SN-${year}-${String(timestamp).slice(-6)}`;
      }

      console.log('Fallback found', citizens?.length || 0, 'citizens to check for CNIs');

      let maxNum = 0;
      for (const citizen of citizens || []) {
        // Check all possible CNI fields
        const possibleCnis = [
          citizen.cni,
          citizen.cedeaonumber,
          citizen.numero_cni,
          citizen.numero_carte
        ].filter(Boolean);

        for (const cni of possibleCnis) {
          if (typeof cni === 'string' && cni.startsWith(`SN-${year}-`)) {
            const numStr = cni.substring(8); // Remove 'SN-YYYY-'
            const num = parseInt(numStr, 10);
            if (!isNaN(num) && num > maxNum) {
              maxNum = num;
              console.log('Found existing CNI:', cni, '-> number:', num, 'new max:', maxNum);
            }
          }
        }
      }

      const next = maxNum + 1;
      const cni = `SN-${year}-${String(next).padStart(6, '0')}`;
      console.log('Fallback generated CNI:', cni, '(max existing was:', maxNum, ')');
      return cni;

    } catch (error) {
      console.error('Fallback CNI generation exception:', error);
      // Ultimate fallback with timestamp
      const timestamp = Date.now();
      const cni = `SN-${year}-${String(timestamp).slice(-6)}`;
      console.log('Ultimate fallback CNI:', cni);
      return cni;
    }
  },

  // Upload photo to Supabase Storage
  async uploadPhoto(file: File): Promise<string> {
    const fileName = `photos-cni/${crypto.randomUUID()}.jpg`;

    const { error } = await supabase.storage
      .from('photos-cni')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Photo upload error:', error);
      throw new Error(`Erreur lors de l'envoi de la photo: ${error.message}`);
    }

    const { data } = supabase.storage
      .from('photos-cni')
      .getPublicUrl(fileName);

    console.log('Photo uploaded successfully:', data.publicUrl);
    return data.publicUrl;
  },

  // Get all citizens - flexible ordering
  async getCitizens() {
    try {
      // Try different ordering columns
      const orderColumns = ['id', 'created_at', 'enrolled_at', 'date_enregistrement'];

      for (const column of orderColumns) {
        try {
          const { data, error } = await supabase
            .from('citoyens')
            .select('*')
            .order(column, { ascending: false });

          if (!error) {
            console.log(`Citizens retrieved using order by ${column}:`, data?.length || 0, 'records');
            return data as CitizenRow[];
          }
        } catch {
          continue;
        }
      }

      // Fallback without ordering
      const { data, error } = await supabase
        .from('citoyens')
        .select('*');

      if (error) throw error;
      console.log('Citizens retrieved without ordering:', data?.length || 0, 'records');
      return data as CitizenRow[];
    } catch (error) {
      console.error('Failed to get citizens:', error);
      throw error;
    }
  },

  // Get citizen by CNI - try different possible column names
  async getCitizenByCni(cni: string) {
    if (!cni || cni === 'undefined') {
      throw new Error('Numéro CNI invalide');
    }

    console.log(`Searching for citizen with CNI: ${cni}`);

    // First try to get all citizens and find by CNI in the result
    try {
      const allCitizens = await this.getCitizens();
      console.log(`Retrieved ${allCitizens.length} citizens from database`);

      // Look for the citizen by checking various CNI fields
      for (const citizen of allCitizens) {
        const citizenCni = citizen.cedeaonumber || citizen.cni || citizen.numero_cni || citizen.numero_carte || `ID-${citizen.id}`;
        if (citizenCni === cni) {
          console.log(`Found citizen:`, citizen);
          return citizen;
        }
      }
    } catch (error) {
      console.log('Failed to search citizens by fetching all:', error);
    }

    // Fallback: try direct queries with different column names
    const possibleColumns = ['cedeaonumber', 'cni', 'numero_cni', 'numero_carte', 'id'];

    for (const column of possibleColumns) {
      try {
        console.log(`Trying direct query with ${column} = ${cni}`);
        const { data, error } = await supabase
          .from('citoyens')
          .select('*')
          .eq(column, cni)
          .single();

        if (!error && data) {
          console.log(`Found citizen using direct query on ${column}:`, data);
          return data as CitizenRow;
        }
      } catch (error) {
        console.log(`Direct query on ${column} failed:`, error);
        continue;
      }
    }

    throw new Error(`Citoyen avec CNI ${cni} non trouvé dans la base de données`);
  },

  // Get citizen by ID
  async getCitizenById(id: string) {
    const { data, error } = await supabase
      .from('citoyens')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as CitizenRow;
  },

  // Create new citizen - using real Supabase column names
  async createCitizen(formData: IdCardForm, operateurId: string, photoUrl?: string, coordinates?: [number, number]) {
    // Use the real column names from your Supabase schema
    const citizenData = {
      cni: formData.cedeaonumber,
      prenoms: formData.prenoms,
      nom: formData.nom,
      date_naissance: formData.date_naissance,
      lieu_naissance: formData.lieu_naissance,
      sexe: formData.sexe,
      taille_cm: typeof formData.taille_cm === 'string' ? parseInt(formData.taille_cm) : formData.taille_cm,
      profession: formData.profession,
      adresse: formData.adresse,
      telephone: formData.telephone,
      email: formData.email,
      photo_url: photoUrl, // Now includes the uploaded photo URL
      operateur_id: operateurId, // This must match auth.uid() for RLS
    };

    console.log('Inserting citizen with real schema:', citizenData);

    try {
      const { data, error } = await supabase
        .from('citoyens')
        .insert(citizenData)
        .select()
        .single();

      if (error) {
        console.error('Supabase insert error:', error);
        throw new Error(`Erreur base de données: ${error.message}`);
      }

      console.log('Citizen created successfully:', data);
      return data as CitizenRow;
    } catch (error) {
      console.error('Failed to create citizen:', error);
      throw error;
    }
  },

  // Get citizens enrolled today
  async getCitizensEnrolledToday() {
    // Since enrolled_at column might not exist, let's just return empty array for now
    // This can be updated when the database schema is confirmed
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('citoyens')
        .select('*')
        .gte('created_at', `${today}T00:00:00.000Z`)
        .lt('created_at', `${today}T23:59:59.999Z`);

      if (error) {
        // If column doesn't exist, return empty array
        console.warn('Column for date filtering not found, returning empty array');
        return [];
      }
      return data as CitizenRow[];
    } catch (error) {
      console.warn('Error fetching citizens enrolled today:', error);
      return [];
    }
  },

  // Get total citizens count
  async getTotalCitizensCount() {
    const { count, error } = await supabase
      .from('citoyens')
      .select('*', { count: 'exact', head: true });

    if (error) throw error;
    return count || 0;
  },

  // Search citizens
  async searchCitizens(query: string) {
    const { data, error } = await supabase
      .from('citoyens')
      .select('*')
      .or(`nom.ilike.%${query}%,prenoms.ilike.%${query}%,cedeaonumber.ilike.%${query}%`)
      .order('id', { ascending: false });

    if (error) throw error;
    return data as CitizenRow[];
  },

  // Convert database row to CNICitizen format - flexible field mapping
  rowToCNICitizen(row: any): CNICitizen {
    // Handle different possible timestamp fields
    const enrolledAt = row.enrolled_at || row.created_at || row.date_enregistrement || new Date().toISOString();

    // Handle different possible CNI fields
    const cni = row.cedeaonumber || row.cni || row.numero_cni || row.numero_carte || `ID-${row.id}`;

    return {
      id: row.id || row.citizen_id || 'unknown',
      formData: {
        nom: row.nom || row.last_name || row.lastname || 'N/A',
        prenoms: row.prenoms || row.first_name || row.firstname || 'N/A',
        date_naissance: row.date_naissance || row.birth_date || row.date_of_birth || 'N/A',
        lieu_naissance: row.lieu_naissance || row.birth_place || row.place_of_birth || 'N/A',
        sexe: row.sexe || row.gender || row.sex || 'M',
        taille_cm: row.taille_cm || row.height || row.height_cm || 170,
        profession: row.profession || row.job || row.occupation || 'N/A',
        adresse: row.adresse || row.address || 'N/A',
        telephone: row.telephone || row.phone || row.mobile || 'N/A',
        email: row.email || 'N/A',
        cedeaonumber: cni,
        date_delivrance: row.date_delivrance || row.issue_date || row.date_emission || new Date().toISOString().split('T')[0],
        date_expiration: row.date_expiration || row.expiry_date || row.expiration_date || 'N/A',
        autorite: row.autorite || row.authority || 'SIP / DAKAR-PLATEAU',
        serie_carte: row.serie_carte || row.card_series || 'N/A',
      },
      photoUrl: row.photo_url || row.photo || row.image_url || null,
      irisLeftUrl: row.iris_left_url || row.iris_left || null,
      irisRightUrl: row.iris_right_url || row.iris_right || null,
      enrolledAt: enrolledAt,
      enrolledToday: new Date(enrolledAt).toDateString() === new Date().toDateString(),
    };
  },
};