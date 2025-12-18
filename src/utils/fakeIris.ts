/**
 * Utilitaire pour simuler l'analyse biométrique d'iris
 * Simule un processus d'analyse réaliste avec étapes techniques
 */
export async function fakeAnalyseIris(): Promise<void> {
  return new Promise(resolve => {
    // Simulation d'un délai réaliste pour l'analyse biométrique
    const totalDuration = 4500; // 4.5 secondes
    let elapsed = 0;

    const interval = setInterval(() => {
      elapsed += 100;
      if (elapsed >= totalDuration) {
        clearInterval(interval);
        resolve();
      }
    }, 100);
  });
}

/**
 * Génère un pourcentage de progression pour la barre de progression
 * @param currentStep Étape actuelle (0-8)
 * @returns Pourcentage de progression
 */
export function getProgressPercentage(currentStep: number): number {
  return Math.min((currentStep / 8) * 100, 100);
}

/**
 * Messages techniques hautement réalistes pendant l'analyse biométrique de l'iris
 * Inspirés des systèmes professionnels de reconnaissance d'iris (IrisGuard, IrisAccess, etc.)
 */
export const ANALYSE_MESSAGES = [
  "Initialisation du système biométrique...",
  "Calibration des caméras infrarouges 850nm...",
  "Activation de l'éclairage NIR optimisé...",
  "Test de la qualité de l'image en temps réel...",
  "Positionnement du sujet détecté - Distance optimale",
  "Acquisition de l'iris gauche - Focus automatique...",
  "Stabilisation de l'image - Réduction du bruit...",
  "Acquisition de l'iris droit - Synchronisation binoculaire...",
  "Validation de la symétrie inter-oculaire...",
  "Segmentation pupille/iris - Algorithme de Daugman...",
  "Normalisation des images polaires (0°-360°)...",
  "Extraction des 2048 bits de caractéristiques uniques...",
  "Génération du template biométrique (ISO/IEC 19794-6)...",
  "Compression et optimisation du template...",
  "Recherche dans la base de données (1:N matching)...",
  "Calcul du score de similarité (Hamming distance)...",
  "Vérification des seuils de sécurité (FAR/FRR)...",
  "Authentification biométrique validée avec succès!"
];

/**
 * Simule les métriques de qualité d'une analyse d'iris
 */
export interface IrisQualityMetrics {
  focus: number;        // Qualité de mise au point (0-100)
  illumination: number; // Éclairage uniforme (0-100)
  occlusion: number;    // Absence d'occlusion (0-100)
  pupilDilation: number; // Dilatation pupillaire normale (0-100)
  overall: number;      // Score global (0-100)
}

export function generateRealisticIrisMetrics(): IrisQualityMetrics {
  // Génère des métriques réalistes avec un peu de variation
  return {
    focus: Math.floor(Math.random() * 20) + 80,        // 80-100
    illumination: Math.floor(Math.random() * 15) + 85,  // 85-100
    occlusion: Math.floor(Math.random() * 10) + 90,     // 90-100
    pupilDilation: Math.floor(Math.random() * 25) + 75, // 75-100
    overall: 0 // Calculé après
  };
}

/**
 * Calcule le score global basé sur les métriques individuelles
 */
export function calculateOverallScore(metrics: IrisQualityMetrics): number {
  const weights = {
    focus: 0.3,
    illumination: 0.25,
    occlusion: 0.25,
    pupilDilation: 0.2
  };

  return Math.round(
    metrics.focus * weights.focus +
    metrics.illumination * weights.illumination +
    metrics.occlusion * weights.occlusion +
    metrics.pupilDilation * weights.pupilDilation
  );
}

/**
 * Simule un délai réaliste entre les étapes d'analyse
 */
export function getStepDuration(step: number): number {
  const durations = [800, 600, 1200, 1200, 1000, 1500, 800, 600, 400];
  return durations[step] || 800;
}

/**
 * Génère un identifiant de session d'analyse unique
 */
export function generateAnalysisSessionId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `iris-${timestamp}-${random}`.toUpperCase();
}