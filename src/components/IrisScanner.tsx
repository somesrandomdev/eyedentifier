import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ANALYSE_MESSAGES, getStepDuration, generateRealisticIrisMetrics, calculateOverallScore } from '../utils/fakeIris';

interface IrisScannerProps {
  onComplete: () => void;
  mode?: 'enrollment' | 'identification';
}

export default function IrisScanner({ onComplete, mode = 'enrollment' }: IrisScannerProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [qualityMetrics, setQualityMetrics] = useState<any>(null);

  useEffect(() => {
    let stepTimer: NodeJS.Timeout;
    let progressTimer: NodeJS.Timeout | undefined;

    const runAnalysis = async () => {
      for (let step = 0; step < ANALYSE_MESSAGES.length; step++) {
        setCurrentStep(step);

        // Update progress
        const stepProgress = ((step + 1) / ANALYSE_MESSAGES.length) * 100;
        setProgress(stepProgress);

        // Generate quality metrics on final step
        if (step === ANALYSE_MESSAGES.length - 1) {
          const metrics = generateRealisticIrisMetrics();
          const overall = calculateOverallScore(metrics);
          setQualityMetrics({ ...metrics, overall });
        }

        // Wait for step duration
        await new Promise(resolve => {
          stepTimer = setTimeout(resolve, getStepDuration(step));
        });
      }

      // Complete analysis
      setTimeout(onComplete, 500);
    };

    runAnalysis();

    return () => {
      if (stepTimer) clearTimeout(stepTimer);
      if (progressTimer) clearTimeout(progressTimer);
    };
  }, [onComplete]);

  const getProgressColor = () => {
    if (progress < 30) return 'bg-red-500';
    if (progress < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="aspect-square bg-black rounded-xl overflow-hidden relative flex flex-col">
      {/* Scanner visualization */}
      <div className="flex-1 relative">
        <div className="absolute inset-4 rounded-full bg-gradient-to-br from-blue-900 to-gray-900" />

        {/* Scanning line */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-senegal-green/60 to-transparent"
          animate={{ y: [320, -320] }}
          transition={{
            duration: 2,
            ease: 'linear',
            repeat: Infinity,
            repeatType: 'loop'
          }}
        />

        {/* Crosshair */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <div className="w-px h-8 bg-white/80" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-px bg-white/80" />
            <motion.div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 border-2 border-senegal-green rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </div>
        </div>

        {/* Quality indicators */}
        {qualityMetrics && (
          <div className="absolute top-4 left-4 right-4">
            <div className="bg-black/50 rounded-lg p-2">
              <div className="text-xs text-white space-y-1">
                <div className="flex justify-between">
                  <span>Qualité:</span>
                  <span className="font-mono">{qualityMetrics.overall}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Mise au point:</span>
                  <span className="font-mono">{qualityMetrics.focus}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Éclairage:</span>
                  <span className="font-mono">{qualityMetrics.illumination}%</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Progress and status */}
      <div className="p-4 bg-gray-900">
        {/* Progress bar */}
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-300 mb-1">
            <span>Progression</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <motion.div
              className={`h-2 rounded-full ${getProgressColor()}`}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Current step message */}
        <div className="text-center">
          <motion.p
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white text-sm font-medium mb-1"
          >
            {ANALYSE_MESSAGES[currentStep]}
          </motion.p>
          <p className="text-gray-400 text-xs">
            {mode === 'identification' ? 'Recherche en cours...' : 'Analyse biométrique en cours...'}
          </p>
        </div>
      </div>
    </div>
  );
}