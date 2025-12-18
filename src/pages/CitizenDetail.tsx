import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeftIcon,
  PrinterIcon,
  CalendarIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  HomeIcon,
  EyeIcon,
  UserIcon,
  IdentificationIcon,
  FingerPrintIcon
} from '@heroicons/react/24/outline';
import Button from '../components/Button';
import { citizensService, type CitizenRow } from '../services/citizensService';

export default function CitizenDetail() {
  const { cni } = useParams<{ cni: string }>();
  const navigate = useNavigate();
  const [citizen, setCitizen] = useState<CitizenRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCitizen = async () => {
      if (!cni) {
        setError('Numéro CNI manquant');
        setLoading(false);
        return;
      }

      try {
        const data = await citizensService.getCitizenByCni(cni);
        setCitizen(data);
      } catch (error) {
        console.error('Erreur lors du chargement du citoyen:', error);
        setError('Citoyen non trouvé ou erreur de chargement');
      } finally {
        setLoading(false);
      }
    };

    fetchCitizen();
  }, [cni]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin-slow w-12 h-12 border-4 border-senegal-green border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error || !citizen) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl"
          >
            <UserIcon className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Citoyen non trouvé</h1>
          <p className="text-gray-600 mb-8">{error || 'Le citoyen demandé n\'existe pas dans la base de données.'}</p>
          <div className="flex justify-center space-x-4">
            <Button
              onClick={() => navigate('/citoyens')}
              variant="secondary"
            >
              Retour à la liste
            </Button>
            <Button
              onClick={() => navigate('/tableau-de-bord')}
              variant="primary"
            >
              Tableau de bord
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/citoyens')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span>Retour à la liste</span>
        </button>

        <Button
          onClick={handlePrint}
          variant="secondary"
        >
          <PrinterIcon className="w-5 h-5 mr-2" />
          <span>Imprimer</span>
        </Button>
      </div>

      {/* Beautiful Header */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="w-20 h-20 bg-gradient-to-br from-senegal-green to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl"
        >
          <UserIcon className="w-10 h-10 text-white" />
        </motion.div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {citizen.prenoms} {citizen.nom}
        </h1>
        <p className="text-gray-600">
          CNI: <span className="font-mono font-bold text-senegal-green">{citizen.cedeaonumber}</span>
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Photo and Biometrics */}
        <div className="space-y-6">
          {/* Photo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <EyeIcon className="w-5 h-5 mr-2 text-senegal-green" />
              Photo d'identité
            </h3>
            <div className="aspect-[3/4] bg-gray-100 rounded-xl overflow-hidden">
              {citizen.photo_url ? (
                <img
                  src={citizen.photo_url}
                  alt={`Photo de ${citizen.prenoms} ${citizen.nom}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <UserIcon className="w-16 h-16 text-gray-400" />
                </div>
              )}
            </div>
          </motion.div>

          {/* Iris Scans */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FingerPrintIcon className="w-5 h-5 mr-2 text-senegal-green" />
              Scans iris
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 bg-gray-400 rounded-full"></div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Iris gauche</p>
                  <p className="text-xs text-gray-500">Qualité: 95%</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 bg-gray-400 rounded-full"></div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Iris droit</p>
                  <p className="text-xs text-gray-500">Qualité: 92%</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Personal Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Identity Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <IdentificationIcon className="w-5 h-5 mr-2 text-senegal-green" />
              Informations d'identité
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Prénom(s)</label>
                  <p className="text-gray-900 font-medium">{citizen.prenoms}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Nom</label>
                  <p className="text-gray-900 font-medium">{citizen.nom}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Date de naissance</label>
                  <p className="text-gray-900">{formatDate(citizen.date_naissance || new Date().toISOString())}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Lieu de naissance</label>
                  <p className="text-gray-900">{citizen.lieu_naissance || 'N/A'}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Genre</label>
                  <p className="text-gray-900">{citizen.sexe === 'M' ? 'Masculin' : 'Féminin'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Taille</label>
                  <p className="text-gray-900">{citizen.taille_cm} cm</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Profession</label>
                  <p className="text-gray-900">{citizen.profession || 'Non spécifiée'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">CNI</label>
                  <p className="text-gray-900 font-mono">{citizen.cedeaonumber}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <PhoneIcon className="w-5 h-5 mr-2 text-senegal-green" />
              Informations de contact
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <PhoneIcon className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Téléphone</p>
                  <p className="text-gray-900">{citizen.telephone}</p>
                </div>
              </div>
              {citizen.email && (
                <div className="flex items-center space-x-3">
                  <EnvelopeIcon className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-900">{citizen.email}</p>
                  </div>
                </div>
              )}
              <div className="flex items-start space-x-3">
                <HomeIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Adresse</p>
                  <p className="text-gray-900">{citizen.adresse}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Enrollment Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <CalendarIcon className="w-5 h-5 mr-2 text-senegal-green" />
              Informations d'enrôlement
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Date d'enrôlement</label>
                  <p className="text-gray-900">{formatDateTime(citizen.enrolled_at || citizen.created_at || new Date().toISOString())}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Date de délivrance CNI</label>
                  <p className="text-gray-900">{formatDate(citizen.date_delivrance ? citizen.date_delivrance : new Date().toISOString())}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Date d'expiration CNI</label>
                  <p className="text-gray-900">{formatDate(citizen.date_expiration ? citizen.date_expiration : new Date().toISOString())}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Autorité</label>
                  <p className="text-gray-900">{citizen.autorite || 'N/A'}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex justify-center space-x-4"
      >
        <Button
          onClick={() => navigate('/citoyens')}
          variant="secondary"
        >
          Retour à la liste
        </Button>
        <Button
          onClick={() => navigate('/tableau-de-bord')}
          variant="primary"
        >
          Tableau de bord
        </Button>
      </motion.div>
    </div>
  );
}