import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircleIcon, DocumentTextIcon, PrinterIcon, HomeIcon, EyeIcon } from '@heroicons/react/24/outline';
import { generateCni, generateSenegalCoordinates } from '../../utils/senegalUtils';
import { supabase } from '../../utils/supabase';
import { citizensService } from '../../services/citizensService';
import { auditService } from '../../services/auditService';
import { useAuthStore } from '../../store/authStore';
import type { IdCardForm } from '../../types/idCard';
import Button from '../../components/Button';

export default function EnrollmentSuccess() {
  const [generatedCni, setGeneratedCni] = useState('');
  const [isSaving, setIsSaving] = useState(true);
  const [saveError, setSaveError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuthStore();

  useEffect(() => {
    // Guard: only run if enrollment data exists
    const raw = sessionStorage.getItem('enrollmentData');
    if (!raw) {
      console.warn('⏳ enrollmentData not found – wizard probably not finished');
      return; // Do nothing, wait for redirect
    }

    const saveEnrollment = async () => {
      try {
        // Data is already validated to exist above - parse it here
        const enrollmentData = JSON.parse(raw);

        // Generate atomic CNI (no duplicates - always picks next free number)
        const cni = await citizensService.generateCNI();
        console.log('Generated atomic CNI:', cni);

        const today = new Date().toISOString().split('T')[0];
        const expirationDate = new Date();
        expirationDate.setFullYear(expirationDate.getFullYear() + 10);
        const expirationStr = expirationDate.toISOString().split('T')[0];

        // Generate coordinates
        const coordinates = generateSenegalCoordinates();

        // Debug: Log the auth user ID
        console.log('🔐 auth.uid():', user?.id);

        // Look up the operator record to get the correct user_id for FK constraint
        const { data: operator, error: opError } = await supabase
          .from('operateurs')
          .select('user_id')
          .eq('user_id', user?.id)
          .single();

        if (opError || !operator) {
          console.error('Operator lookup failed:', opError);
          throw new Error('Aucun opérateur trouvé pour cet utilisateur. Veuillez contacter l\'administrateur.');
        }

        console.log('📤 operateur_id (from operateurs.user_id):', operator.user_id);

        // Prepare citizen data using IdCardForm structure
        const citizenData: IdCardForm = {
          cedeaonumber: cni,
          prenoms: enrollmentData.firstName,
          nom: enrollmentData.lastName,
          date_naissance: enrollmentData.birthDate,
          lieu_naissance: enrollmentData.birthPlace,
          sexe: enrollmentData.gender,
          taille_cm: parseInt(enrollmentData.height),
          profession: enrollmentData.profession,
          adresse: enrollmentData.address,
          telephone: enrollmentData.phone,
          email: enrollmentData.email,
          date_delivrance: today,
          date_expiration: expirationStr,
          autorite: 'SIP / DAKAR-PLATEAU',
          serie_carte: Math.random().toString(36).substring(2, 9).toUpperCase(),
        };

        // Final debug check
        console.log('➡️ auth.uid():', user?.id);
        console.log('➡️ payload.operateur_id:', JSON.stringify(operator.user_id));
        console.log('➡️ are they === ?:', user?.id === operator.user_id);

        // Get photo URL from sessionStorage
        const photoUrl = sessionStorage.getItem('enrollmentPhotoUrl') || undefined;

        // Use the operator's user_id for FK constraint and RLS policy
        await citizensService.createCitizen(
          citizenData,
          operator.user_id, // FK to operateurs.user_id and satisfies RLS
          photoUrl, // Now includes the actual uploaded photo URL
          coordinates
        );

        // Log the enrollment operation
        await auditService.logOperation({
          type: 'Enrôlement',
          agent: 'Opérateur système',
          result: 'succès',
          citizenCni: cni,
          duration: 45
        });

        setGeneratedCni(cni);

        // Store for display
        const displayData = {
          cni,
          timestamp: new Date().toISOString(),
          data: enrollmentData,
          photo: sessionStorage.getItem('enrollmentPhoto'),
          iris: sessionStorage.getItem('enrollmentIris')
        };

        sessionStorage.setItem('completedEnrollment', JSON.stringify(displayData));

        // Clean up sessionStorage and redirect after successful save
        setTimeout(() => {
          sessionStorage.removeItem('enrollmentData');
          sessionStorage.removeItem('enrollmentPhoto');
          sessionStorage.removeItem('enrollmentIris');
          navigate(`/citoyens/${cni}`);
        }, 2000);

      } catch (error) {
        console.error('Erreur lors de la sauvegarde:', error);
        setSaveError(error instanceof Error ? error.message : 'Erreur inconnue');
      } finally {
        setIsSaving(false);
      }

    };

    saveEnrollment();
  }, [user]);

  const handlePrint = () => {
    // Simple print function - opens print dialog
    window.print();
  };

  const handleNewEnrollment = () => {
    navigate('/enroler');
  };

  const handleBackToDashboard = () => {
    navigate('/tableau-de-bord');
  };

  const handleViewCitizen = () => {
    if (generatedCni) {
      navigate(`/citoyens/${generatedCni}`);
    } else {
      // Fallback: try to find the most recently created citizen
      navigate('/citoyens');
    }
  };

  if (isSaving) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <div className="animate-spin-slow w-12 h-12 border-4 border-white border-t-transparent rounded-full"></div>
          </motion.div>

          <h1 className="text-3xl font-bold text-gray-900">Sauvegarde en cours...</h1>
          <p className="text-gray-600 mt-2">Veuillez patienter pendant que nous enregistrons les données</p>
        </div>
      </div>
    );
  }

  if (saveError) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <div className="w-12 h-12 text-white">⚠️</div>
          </motion.div>

          <h1 className="text-3xl font-bold text-gray-900">Erreur de sauvegarde</h1>
          <p className="text-gray-600 mt-2">{saveError}</p>

          <div className="mt-8">
            <Button
              onClick={() => navigate('/enroler')}
              variant="primary"
            >
              Retour à l'enrôlement
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* En-tête */}
      <div className="mb-8 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <CheckCircleIcon className="w-12 h-12 text-white" />
        </motion.div>

        <h1 className="text-3xl font-bold text-gray-900">Enrôlement réussi !</h1>
        <p className="text-gray-600 mt-2">Étape 4 sur 4 - Le citoyen a été enrôlé avec succès</p>
        
        {/* Progress bar */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-primary">Progression</span>
            <span className="text-sm text-gray-500">100%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-primary h-2 rounded-full transition-all duration-500" style={{ width: '100%' }}></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Récapitulatif */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Récapitulatif</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Numéro CNI généré</span>
              <span className="font-mono text-lg font-bold text-primary">{generatedCni}</span>
            </div>
            
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Statut</span>
              <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                <CheckCircleIcon className="w-4 h-4 mr-1" />
                Enrôlé
              </span>
            </div>
            
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Date d'enrôlement</span>
              <span className="text-gray-900">{new Date().toLocaleDateString('fr-FR')}</span>
            </div>
            
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Heure</span>
              <span className="text-gray-900">{new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            
            <div className="flex justify-between items-center py-3">
              <span className="text-gray-600">Agent</span>
              <span className="text-gray-900">Opérateur système</span>
            </div>
          </div>
        </motion.div>

        {/* Données du citoyen */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Informations du citoyen</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Prénom</span>
              <span className="text-gray-900 font-medium">
                {JSON.parse(sessionStorage.getItem('completedEnrollment') || '{}')?.data?.firstName || 'N/A'}
              </span>
            </div>
            
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Nom</span>
              <span className="text-gray-900 font-medium">
                {JSON.parse(sessionStorage.getItem('completedEnrollment') || '{}')?.data?.lastName || 'N/A'}
              </span>
            </div>
            
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Date de naissance</span>
              <span className="text-gray-900">
                {JSON.parse(sessionStorage.getItem('completedEnrollment') || '{}')?.data?.birthDate || 'N/A'}
              </span>
            </div>
            
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Lieu de naissance</span>
              <span className="text-gray-900">
                {JSON.parse(sessionStorage.getItem('completedEnrollment') || '{}')?.data?.birthPlace || 'N/A'}
              </span>
            </div>
            
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Téléphone</span>
              <span className="text-gray-900">
                {JSON.parse(sessionStorage.getItem('completedEnrollment') || '{}')?.data?.phone || 'N/A'}
              </span>
            </div>

            {JSON.parse(sessionStorage.getItem('completedEnrollment') || '{}')?.data?.height && (
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Taille</span>
                <span className="text-gray-900">
                  {JSON.parse(sessionStorage.getItem('completedEnrollment') || '{}')?.data?.height} cm
                </span>
              </div>
            )}

            {JSON.parse(sessionStorage.getItem('completedEnrollment') || '{}')?.data?.profession && (
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Profession</span>
                <span className="text-gray-900">
                  {JSON.parse(sessionStorage.getItem('completedEnrollment') || '{}')?.data?.profession}
                </span>
              </div>
            )}
          </div>

          {/* Badges de validation */}
          <div className="mt-6 flex flex-wrap gap-2">
            <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
              ✓ Photo capturée
            </span>
            <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
              ✓ Iris scanné
            </span>
            <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
              ✓ Données validées
            </span>
          </div>
        </motion.div>
      </div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <Button
          onClick={handlePrint}
          variant="primary"
        >
          <PrinterIcon className="w-5 h-5 mr-2" />
          <span>Imprimer le récapitulatif</span>
        </Button>
        
        <Button
          onClick={handleViewCitizen}
          variant="secondary"
        >
          <EyeIcon className="w-5 h-5 mr-2" />
          <span>Voir le citoyen</span>
        </Button>
        
        <Button
          onClick={handleNewEnrollment}
          variant="secondary"
        >
          <DocumentTextIcon className="w-5 h-5 mr-2" />
          <span>Nouvel enrôlement</span>
        </Button>
        
        <Link
          to="/tableau-de-bord"
          className="btn-secondary flex items-center justify-center space-x-2"
        >
          <HomeIcon className="w-5 h-5 mr-2" />
          <span>Retour au tableau de bord</span>
        </Link>
      </motion.div>

      {/* Message de confirmation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-8 text-center"
      >
        <div className="glass-card bg-green-50 border-green-200 max-w-md mx-auto">
          <CheckCircleIcon className="w-12 h-12 text-primary mx-auto mb-3" />
          <h4 className="text-lg font-semibold text-green-800 mb-2">Citoyen enrôlé avec succès</h4>
          <p className="text-green-600 text-sm">
            Le citoyen peut maintenant être identifié par scan d'iris dans le système.
          </p>
        </div>
      </motion.div>
    </div>
  );
}