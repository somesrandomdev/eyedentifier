import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { EyeIcon } from '@heroicons/react/24/outline';
import IrisScanner from '../../components/IrisScanner';
import Button from '../../components/Button';

export default function EnrollmentIris() {
  const [isScanning, setIsScanning] = useState(false);
  const navigate = useNavigate();

  const startScan = () => {
    setIsScanning(true);
  };

  const handleScanComplete = () => {
    // Stocker les informations d'analyse
    const irisData = {
      completedAt: new Date().toISOString(),
      quality: 'excellent'
    };

    sessionStorage.setItem('enrollmentIris', JSON.stringify(irisData));

    // Rediriger vers la page de succès
    navigate('/enroler/succes');
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Scan de l'iris</h1>
        <p className="text-gray-600 mt-2">Étape 3 sur 4 - Capture et analyse des iris</p>
        
        {/* Progress bar */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-primary-600">Progression</span>
            <span className="text-sm text-gray-500">75%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-primary-500 h-2 rounded-full transition-all duration-500" style={{ width: '75%' }}></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Scanner iris */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card"
          >
            {isScanning ? (
              <IrisScanner onComplete={handleScanComplete} />
            ) : (
              <div className="aspect-square bg-black rounded-xl overflow-hidden relative flex items-center justify-center">
                <div className="text-center">
                  <EyeIcon className="w-16 h-16 text-primary-400 mx-auto mb-4 iris-pulse" />
                  <p className="text-white text-lg font-medium">Scanner prêt</p>
                  <p className="text-gray-300 text-sm">Cliquez pour lancer le scan</p>
                </div>
              </div>
            )}

            {/* Message d'état */}
            <div className="mt-4 text-center">
              <p className="text-lg font-medium text-gray-800">
                {isScanning ? 'Scan en cours...' : 'Prêt pour le scan'}
              </p>
              {isScanning && (
                <p className="text-sm text-gray-600 mt-1">
                  Ne pas bouger pendant l'analyse
                </p>
              )}
            </div>
          </motion.div>

          {/* Contrôles */}
          <div className="text-center">
            {!isScanning && (
              <Button
                onClick={startScan}
                variant="primary"
                size="lg"
              >
                <EyeIcon className="w-6 h-6 mr-2" />
                Lancer le scan
              </Button>
            )}
          </div>
        </div>

        {/* Instructions et statistiques */}
        <div className="space-y-6">
          <div className="glass-card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Instructions</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
                <span>Placez le citoyen face au scanner</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
                <span>Demandez-lui de regarder fixement le centre</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
                <span>Restez immobile pendant l'analyse</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
                <span>L'analyse dure environ 3 secondes</span>
              </li>
            </ul>
          </div>


        </div>
      </div>
    </div>
  );
}