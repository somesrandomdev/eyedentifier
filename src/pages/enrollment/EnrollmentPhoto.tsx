import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CameraIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { citizensService } from '../../services/citizensService';
import Button from '../../components/Button';

export default function EnrollmentPhoto() {
  const [hasPhoto, setHasPhoto] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Démarrer la caméra
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { 
            width: { ideal: 1280 },
            height: { ideal: 960 },
            aspectRatio: 4/3
          }
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (error) {
        console.error('Erreur accès caméra:', error);
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsCapturing(true);

    // Simuler un délai de capture
    setTimeout(() => {
      const video = videoRef.current!;
      const canvas = canvasRef.current!;
      const context = canvas.getContext('2d')!;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0);

      // Convertir en image (pour la démo, on simule juste)
      setHasPhoto(true);
      setIsCapturing(false);

      // Arrêter la caméra
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    }, 1000);
  };

  const handleContinue = async () => {
    if (!canvasRef.current) return;

    setIsUploading(true);

    try {
      // Convert canvas to blob
      const canvas = canvasRef.current;
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => resolve(blob!), 'image/jpeg', 0.9);
      });

      // Create file from blob
      const file = new File([blob], 'photo.jpg', { type: 'image/jpeg' });

      // Upload to Supabase Storage
      const photoUrl = await citizensService.uploadPhoto(file);

      // Store the URL in sessionStorage
      sessionStorage.setItem('enrollmentPhotoUrl', photoUrl);
      console.log('Photo uploaded and URL stored:', photoUrl);

      // Navigate to next step
      navigate('/enroler/iris');

    } catch (error) {
      console.error('Photo upload failed:', error);
      alert('Erreur lors de l\'envoi de la photo. Veuillez réessayer.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRetake = () => {
    setHasPhoto(false);
    // Redémarrer la caméra
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { 
            width: { ideal: 1280 },
            height: { ideal: 960 },
            aspectRatio: 4/3
          }
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (error) {
        console.error('Erreur accès caméra:', error);
      }
    };
    startCamera();
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Capture de la photo</h1>
        <p className="text-gray-600 mt-2">Étape 2 sur 4 - Photo d'identité de la CNI</p>
        
        {/* Progress bar */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-primary-600">Progression</span>
            <span className="text-sm text-gray-500">50%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-primary-500 h-2 rounded-full transition-all duration-500" style={{ width: '50%' }}></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Zone de capture */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card"
          >
            <div className="aspect-[4/3] bg-white rounded-xl overflow-hidden relative">
              {!hasPhoto ? (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Overlay guide */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-4 border-2 border-dashed border-primary-500 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <CameraIcon className="w-12 h-12 text-primary-500 mx-auto mb-2" />
                        <p className="text-primary-600 font-medium">Positionnez la CNI ici</p>
                      </div>
                    </div>
                  </div>

                  {/* Scan line effect */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-primary-500 scan-line"></div>
                </>
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <div className="text-center">
                    <CameraIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <p className="text-green-600 font-medium text-lg">Photo capturée !</p>
                    <p className="text-gray-500 text-sm mt-2">Qualité: Excellente</p>
                  </div>
                </div>
              )}
            </div>

            {/* Canvas caché pour la capture */}
            <canvas ref={canvasRef} className="hidden" />
          </motion.div>

          {/* Contrôles */}
          <div className="flex justify-center space-x-4">
            {!hasPhoto ? (
              <Button
                onClick={handleCapture}
                disabled={isCapturing}
                variant="primary"
                loading={isCapturing}
              >
                {!isCapturing && (
                  <>
                    <CameraIcon className="w-5 h-5 mr-2" />
                    <span>Prendre la photo</span>
                  </>
                )}
              </Button>
            ) : (
              <div className="flex space-x-4">
                <Button
                  onClick={handleRetake}
                  variant="secondary"
                >
                  Reprendre
                </Button>
                <Button
                  onClick={handleContinue}
                  disabled={isUploading}
                  variant="primary"
                  loading={isUploading}
                >
                  {!isUploading && (
                    <>
                      <span>Continuer vers l'iris</span>
                      <ChevronRightIcon className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Informations et instructions */}
        <div className="space-y-6">
          <div className="glass-card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Instructions</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
                <span>Placez la carte d'identité sur la surface plane</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
                <span>Assurez-vous que la carte est bien éclairée</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
                <span>La photo doit être nette et lisible</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
                <span>Évitez les reflets et les ombres</span>
              </li>
            </ul>
          </div>

          <div className="glass-card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Qualité de capture</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Netteté</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '95%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-green-600">95%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Éclairage</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '88%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-green-600">88%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Alignement</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-yellow-600">75%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card bg-green-50 border-green-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-green-800">Capture réussie</h4>
                <p className="text-sm text-green-600">La photo est de qualité suffisante</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}