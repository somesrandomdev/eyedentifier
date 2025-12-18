import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { motion } from 'framer-motion';
import { EyeIcon, ShieldCheckIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import Button from '../components/Button';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const result = await login(email, password);
    if (result.success) {
      navigate('/tableau-de-bord');
    } else {
      setError(result.error || 'Erreur d\'authentification');
      setPassword('');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Beautiful Background with Animated Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary/5 to-transparent rounded-full blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="modern-card w-full max-w-lg relative z-10 shadow-2xl"
      >
        {/* Beautiful Header with Logo */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
            className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl relative overflow-hidden"
          >
            <img
              src="/assets/eyedentify-logo.png"
              alt="EyeDentify Logo"
              className="w-20 h-20 object-contain relative z-10"
              onError={(e) => {
                // Fallback to icon if logo fails
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.innerHTML = '<svg class="w-12 h-12 text-primary-600 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>';
              }}
            />
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-secondary rounded-full animate-pulse"></div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-3"
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-primary to-gray-800 bg-clip-text text-transparent">
              EyeDentify
            </h1>
            <p className="text-lg text-gray-600 font-medium">Système d'identification biométrique</p>
            <div className="inline-flex items-center justify-center space-x-2 text-sm text-primary font-semibold bg-primary/10 rounded-full px-4 py-2">
              <ShieldCheckIcon className="w-5 h-5" />
              <span>République du Sénégal 🇸🇳</span>
            </div>
          </motion.div>
        </div>

        {/* Beautiful Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          onSubmit={handleSubmit}
          className="space-y-8"
        >
          <div className="space-y-3">
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
              Email opérateur
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field w-full"
                placeholder="votre.email@eyedentify.sn"
                required
                disabled={isLoading}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
              Mot de passe
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <LockClosedIcon className="h-5 w-5 text-primary" />
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pl-12 w-full"
                placeholder="Entrez votre mot de passe"
                required
                disabled={isLoading}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse opacity-60"></div>
              </div>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="status-badge status-error"
            >
              {error}
            </motion.div>
          )}

          <Button
            type="submit"
            disabled={isLoading || !password}
            variant="primary"
            className="w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            loading={isLoading}
          >
            {!isLoading && (
              <>
                <ShieldCheckIcon className="w-5 h-5 mr-2" />
                <span>Se connecter</span>
              </>
            )}
          </Button>
        </motion.form>

        {/* Security Notice */}
        <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-100">
          <div className="text-center space-y-2">
            <p className="text-sm font-medium text-gray-900">Sécurisé par encryption</p>
            <p className="text-xs text-gray-600">
              Accès autorisé uniquement aux opérateurs habilités
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 pt-6 border-t border-gray-100">
          <p className="text-sm text-gray-500 font-medium">
            "La sécurité en un regard"
          </p>
          <p className="text-xs text-gray-400 mt-1">
            CNI Sénégal • Version 2025.1
          </p>
        </div>
      </motion.div>
    </div>
  );
}