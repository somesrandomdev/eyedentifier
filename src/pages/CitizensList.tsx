import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MagnifyingGlassIcon,
  UserIcon,
  CalendarIcon,
  PhoneIcon,
  MapPinIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { citizensService, type CitizenRow } from '../services/citizensService';
import MapSenegal from '../components/MapSenegal';

export default function CitizensList() {
  const [citizens, setCitizens] = useState<CitizenRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'cni'>('date');
  const [filterToday, setFilterToday] = useState(false);

  useEffect(() => {
    const fetchCitizens = async () => {
      try {
        const data = await citizensService.getCitizens();
        setCitizens(data);
      } catch (error) {
        console.error('Erreur lors du chargement des citoyens:', error);
        setCitizens([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCitizens();
  }, []);

  const filteredAndSortedCitizens = useMemo(() => {
    let filtered = citizens.filter(citizen => {
      const prenoms = citizen.prenoms || '';
      const nom = citizen.nom || '';
      const cedeaonumber = citizen.cedeaonumber || '';
      const lieuNaissance = citizen.lieu_naissance || '';

      const matchesSearch =
        prenoms.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cedeaonumber.includes(searchTerm) ||
        lieuNaissance.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesToday = !filterToday || citizensService.rowToCNICitizen(citizen).enrolledToday;

      return matchesSearch && matchesToday;
    });

    // Tri
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          const nameA = `${a.nom || ''} ${a.prenoms || ''}`.trim();
          const nameB = `${b.nom || ''} ${b.prenoms || ''}`.trim();
          return nameA.localeCompare(nameB);
        case 'date':
          const dateA = a.enrolled_at || a.created_at || new Date().toISOString();
          const dateB = b.enrolled_at || b.created_at || new Date().toISOString();
          return new Date(dateB).getTime() - new Date(dateA).getTime();
        case 'cni':
          const cniA = a.cedeaonumber || '';
          const cniB = b.cedeaonumber || '';
          return cniA.localeCompare(cniB);
        default:
          return 0;
      }
    });

    return filtered;
  }, [citizens, searchTerm, sortBy, filterToday]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin-slow w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Registre des citoyens</h1>
          <p className="text-gray-600 mt-1">
            {filteredAndSortedCitizens.length} citoyen(s) trouvé(s)
          </p>
        </div>

        <div className="text-right">
          <div className="text-2xl font-bold text-primary-600">
            {citizens.length}
          </div>
          <div className="text-sm text-gray-600">Total en base</div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="glass-card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Recherche */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un citoyen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {/* Tri */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'name' | 'date' | 'cni')}
            className="input-field"
          >
            <option value="date">Trier par date d'enrôlement</option>
            <option value="name">Trier par nom</option>
            <option value="cni">Trier par CNI</option>
          </select>

          {/* Filtre du jour */}
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={filterToday}
              onChange={(e) => setFilterToday(e.target.checked)}
              className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700">Enrôté aujourd'hui uniquement</span>
          </label>
        </div>
      </div>

      {/* Liste des citoyens */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedCitizens.map((citizen, index) => {
          const cniCitizen = citizensService.rowToCNICitizen(citizen);
          return (
            <motion.div
              key={citizen.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card hover:shadow-xl transition-all duration-300 group"
            >
              {/* En-tête de la carte */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <UserIcon className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {citizen.prenoms} {citizen.nom}
                    </h3>
                    <p className="text-sm text-gray-600 font-mono">{cniCitizen.formData.cedeaonumber}</p>
                  </div>
                </div>

                {cniCitizen.enrolledToday && (
                  <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    Aujourd'hui
                  </span>
                )}
              </div>

              {/* Informations */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <CalendarIcon className="w-4 h-4" />
                  <span>Né(e) le {formatDate(citizen.date_naissance || new Date().toISOString())}</span>
                </div>

                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <MapPinIcon className="w-4 h-4" />
                  <span>{citizen.lieu_naissance || 'N/A'}</span>
                </div>

                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <PhoneIcon className="w-4 h-4" />
                  <span>{citizen.telephone || 'N/A'}</span>
                </div>

                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <span>Taille: {citizen.taille_cm || 'N/A'} cm</span>
                </div>

                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <span>Profession: {citizen.profession || 'Non spécifiée'}</span>
                </div>

                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <CalendarIcon className="w-4 h-4" />
                  <span>Enrôté le {formatDate(citizen.enrolled_at || citizen.created_at || new Date().toISOString())}</span>
                </div>
              </div>

              {/* Badge de statut */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    ✓ Enrôlé
                  </span>

                  <Link
                    to={`/citoyens/${cniCitizen.formData.cedeaonumber}`}
                    className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 text-sm font-medium group-hover:translate-x-1 transition-transform duration-200"
                  >
                    <EyeIcon className="w-4 h-4" />
                    <span>Voir détails</span>
                  </Link>
                </div>
              </div>

            {/* Vignettes iris (simulées) */}
            <div className="mt-4 flex space-x-2">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <div className="w-6 h-6 bg-gray-400 rounded-full"></div>
              </div>
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <div className="w-6 h-6 bg-gray-400 rounded-full"></div>
              </div>
            </div>
          </motion.div>
          );
        })}
      </div>

      {/* Message si aucun résultat */}
      {filteredAndSortedCitizens.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <UserIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun citoyen trouvé</h3>
          <p className="text-gray-600">
            {searchTerm || filterToday 
              ? 'Essayez de modifier vos critères de recherche.'
              : 'Aucun citoyen n\'a encore été enrôlé dans le système.'
            }
          </p>
        </motion.div>
      )}

      {/* Carte des enrôlements */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Carte des enrôlements</h3>
        <MapSenegal citizens={citizens} />
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-slide-up">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 * 0.1 }}
          className="rounded-2xl p-6 shadow-lg border border-white/20 bg-gradient-to-br from-green-800 to-green-900 text-white"
        >
          <div className="text-3xl font-bold mb-2">{citizens.length}</div>
          <div className="text-sm opacity-90">Total citoyens</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 * 0.1 }}
          className="rounded-2xl p-6 shadow-lg border border-white/20 bg-gradient-to-br from-yellow-600 to-yellow-700 text-white"
        >
          <div className="text-3xl font-bold mb-2">
            {citizens.filter(c => citizensService.rowToCNICitizen(c).enrolledToday).length}
          </div>
          <div className="text-sm opacity-90">Enrôtés aujourd'hui</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 * 0.1 }}
          className="rounded-2xl p-6 shadow-lg border border-white/20 bg-gradient-to-br from-red-700 to-red-800 text-white"
        >
          <div className="text-3xl font-bold mb-2">
            {citizens.filter(c => c.sexe === 'M').length}
          </div>
          <div className="text-sm opacity-90">Hommes</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3 * 0.1 }}
          className="rounded-2xl p-6 shadow-lg border border-white/20 bg-gradient-to-br from-blue-700 to-blue-800 text-white"
        >
          <div className="text-3xl font-bold mb-2">
            {citizens.filter(c => c.sexe === 'F').length}
          </div>
          <div className="text-sm opacity-90">Femmes</div>
        </motion.div>
      </div>
    </div>
  );
}