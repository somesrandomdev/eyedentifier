import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { EyeIcon, UserIcon } from '@heroicons/react/24/outline';
import { citizensService, type CitizenRow } from '../services/citizensService';
import { auditService } from '../services/auditService';
import { playSuccessBeepSimple } from '../utils/audioUtils';
import IrisScanner from '../components/IrisScanner';
import Button from '../components/Button';

export default function Identification() {
  const [isScanning, setIsScanning] = useState(false);
  const [foundCitizen, setFoundCitizen] = useState<CitizenRow | null>(null);
  const [totalCitizens, setTotalCitizens] = useState(0);
  const navigate = useNavigate();

  // Get total citizens count on mount
  useEffect(() => {
    const fetchTotal = async () => {
      try {
        const count = await citizensService.getTotalCitizensCount();
        setTotalCitizens(count);
      } catch (error) {
        console.error('Erreur lors du chargement du total:', error);
        setTotalCitizens(0);
      }
    };
    fetchTotal();
  }, []);

  const startScan = () => {
    setIsScanning(true);
    setFoundCitizen(null);
  };

  const handleScanComplete = async () => {
    setIsScanning(false);

    try {
      // Try to identify a citizen (80% success rate for demo)
      const isSuccess = Math.random() > 0.2;

      if (isSuccess) {
        // Get all citizens and pick one randomly
        const citizens = await citizensService.getCitizens();
        if (citizens.length > 0) {
          const randomCitizen = citizens[Math.floor(Math.random() * citizens.length)];
          setFoundCitizen(randomCitizen);

          // Play success beep sound
          playSuccessBeepSimple();

          // Log the identification operation
          await auditService.logOperation({
            type: 'Identification',
            agent: 'Opérateur système',
            result: 'succès',
            citizenCni: randomCitizen.cedeaonumber,
            duration: 3
          });

          // Redirect to citizen details after 2 seconds
          setTimeout(() => {
            const cniCitizen = citizensService.rowToCNICitizen(randomCitizen);
            navigate(`/citoyens/${cniCitizen.formData.cedeaonumber}`);
          }, 2000);
        } else {
          // No citizens in database
          setFoundCitizen(null);
        }
      } else {
        // Identification failed
        setFoundCitizen(null);
      }
    } catch (error) {
      console.error('Erreur lors de l\'identification:', error);
      setFoundCitizen(null);
    }
  };

  const handleRetry = () => {
    setIsScanning(false);
    setFoundCitizen(null);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Identification par iris</h1>
        <p className="text-gray-600 mt-2">Recherche 1:N dans la base de données</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Scanner iris */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card"
          >
            {isScanning ? (
              <IrisScanner onComplete={handleScanComplete} mode="identification" />
            ) : (
              <div className="aspect-square bg-black rounded-xl overflow-hidden relative flex items-center justify-center">
                <div className="text-center">
                  <EyeIcon className="w-20 h-20 text-primary-400 mx-auto mb-4 iris-pulse" />
                  <p className="text-white text-lg font-medium">Scanner prêt</p>
                  <p className="text-gray-300 text-sm">Cliquez pour lancer l'identification</p>
                </div>
              </div>
            )}

            {/* Message d'état */}
            <div className="mt-4 text-center">
              <p className="text-lg font-medium text-gray-800">
                {isScanning ? 'Scan en cours...' : foundCitizen ? 'Citoyen identifié !' : 'Prêt pour l\'identification'}
              </p>
              {isScanning && (
                <p className="text-sm text-gray-600 mt-1">
                  Ne pas bouger pendant l'analyse
                </p>
              )}
            </div>
          </motion.div>

          {/* Contrôles */}
          <div className="text-center space-y-4">
            {!isScanning && !foundCitizen && (
              <Button
                onClick={startScan}
                variant="primary"
                size="lg"
              >
                <EyeIcon className="w-6 h-6 mr-2" />
                Lancer l'identification
              </Button>
            )}

            {foundCitizen && (
              <div className="space-y-4">
                <div className="text-green-600 font-medium">
                  ✓ Citoyen identifié avec succès
                </div>
                <Button
                  onClick={handleRetry}
                  variant="secondary"
                >
                  Nouvelle identification
                </Button>
              </div>
            )}

            {!isScanning && !foundCitizen && totalCitizens === 0 && (
              <div className="space-y-4">
                <div className="text-yellow-600 font-medium">
                  ⚠️ Aucun citoyen en base de données
                </div>
                <p className="text-sm text-gray-600">
                  Enrôlez d'abord des citoyens avant de pouvoir les identifier.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Panneau latéral */}
        <div className="space-y-6">
          {/* Instructions */}
          <div className="glass-card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Instructions</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
                <span>Placez le citoyen devant le scanner</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
                <span>Demandez-lui de regarder fixement le centre</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
                <span>L'analyse dure environ 3 secondes</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
                <span>Restez immobile pendant l'analyse</span>
              </li>
            </ul>
          </div>

          {/* Résultat de l'identification */}
          {foundCitizen && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card bg-green-50 border-green-200"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <UserIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-green-800">Citoyen identifié</h4>
                  <p className="text-sm text-green-600">Correspondance trouvée</p>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                {(() => {
                  const cniCitizen = citizensService.rowToCNICitizen(foundCitizen);
                  return (
                    <>
                      <div className="flex justify-between">
                        <span className="text-green-700">CNI:</span>
                        <span className="font-mono font-medium text-green-800">{cniCitizen.formData.cedeaonumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">Nom:</span>
                        <span className="font-medium text-green-800">{cniCitizen.formData.prenoms} {cniCitizen.formData.nom}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">Lieu:</span>
                        <span className="text-green-800">{cniCitizen.formData.lieu_naissance}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">Confiance:</span>
                        <span className="font-medium text-green-800">98.5%</span>
                      </div>

                      <Button
                        onClick={() => navigate(`/citoyens/${cniCitizen.formData.cedeaonumber}`)}
                        variant="primary"
                        size="sm"
                        className="w-full mt-4"
                      >
                        Voir la fiche complète
                      </Button>
                    </>
                  );
                })()}
              </div>
            </motion.div>
          )}

          {/* Statistiques de la session */}
          <div className="glass-card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Session en cours</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Tentatives</span>
                <span className="font-medium">{isScanning || foundCitizen ? 1 : 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Réussites</span>
                <span className="font-medium text-green-600">{foundCitizen ? 1 : 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Temps moyen</span>
                <span className="font-medium">3.2s</span>
              </div>
            </div>
          </div>

          {/* État du système */}
          <div className="glass-card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">État du système</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Scanner iris</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-green-600 text-sm">En ligne</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Base de données</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-green-600 text-sm">Connectée</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Citoyens en base</span>
                <span className="font-medium">{totalCitizens.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}