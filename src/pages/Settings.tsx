import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CogIcon, 
  KeyIcon, 
  PrinterIcon, 
  CameraIcon, 
  UserIcon,
  ShieldCheckIcon,
  BellIcon,
  GlobeAltIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import Button from '../components/Button';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [passwordForm, setPasswordForm] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sound: true
  });
  const [testResult, setTestResult] = useState<string | null>(null);

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    // Simuler le changement de mot de passe
    setTimeout(() => {
      setTestResult('Mot de passe modifié avec succès');
      setPasswordForm({ current: '', new: '', confirm: '' });
      setTimeout(() => setTestResult(null), 3000);
    }, 1000);
  };

  const handleTestPrinter = () => {
    setTestResult('Test d\'impression en cours...');
    setTimeout(() => {
      setTestResult('Imprimante testée avec succès');
      setTimeout(() => setTestResult(null), 3000);
    }, 2000);
  };

  const handleTestCamera = () => {
    setTestResult('Calibration caméra en cours...');
    setTimeout(() => {
      setTestResult('Caméra calibrée avec succès');
      setTimeout(() => setTestResult(null), 3000);
    }, 2000);
  };

  const tabs = [
    { id: 'profile', name: 'Profil', icon: UserIcon },
    { id: 'security', name: 'Sécurité', icon: ShieldCheckIcon },
    { id: 'hardware', name: 'Matériel', icon: CogIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'system', name: 'Système', icon: GlobeAltIcon }
  ];

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
        <p className="text-gray-600 mt-1">Configuration du système et préférences utilisateur</p>
      </div>

      {/* Message de résultat */}
      {testResult && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card bg-green-50 border-green-200"
        >
          <div className="flex items-center space-x-3">
            <CheckCircleIcon className="w-5 h-5 text-green-500" />
            <span className="text-green-800 font-medium">{testResult}</span>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation */}
        <div className="lg:col-span-1">
          <nav className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-primary-50 text-primary-600 border-r-2 border-primary-500'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-medium">{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Contenu */}
        <div className="lg:col-span-3">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="glass-card"
          >
            {/* Profil */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900">Profil utilisateur</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nom d'utilisateur</label>
                    <input
                      type="text"
                      defaultValue="opérateur"
                      className="input-field"
                      readOnly
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rôle</label>
                    <input
                      type="text"
                      defaultValue="Agent d'enrôlement"
                      className="input-field"
                      readOnly
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Station</label>
                    <input
                      type="text"
                      defaultValue="STATION-001"
                      className="input-field"
                      readOnly
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Dernière connexion</label>
                    <input
                      type="text"
                      defaultValue="2025-12-17 22:06:00"
                      className="input-field"
                      readOnly
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Sécurité */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900">Sécurité et accès</h3>
                
                {/* Changement de mot de passe */}
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-gray-900">Changer le mot de passe</h4>
                  
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe actuel</label>
                      <input
                        type="password"
                        value={passwordForm.current}
                        onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                        className="input-field"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nouveau mot de passe</label>
                      <input
                        type="password"
                        value={passwordForm.new}
                        onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                        className="input-field"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Confirmer le nouveau mot de passe</label>
                      <input
                        type="password"
                        value={passwordForm.confirm}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                        className="input-field"
                        required
                      />
                    </div>
                    
                    <Button type="submit" variant="primary">
                      <KeyIcon className="w-5 h-5 mr-2" />
                      Modifier le mot de passe
                    </Button>
                  </form>
                </div>
                
                {/* Session */}
                <div className="pt-6 border-t border-gray-200">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Session</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Durée de session</span>
                      <select className="input-field w-32">
                        <option>8 heures</option>
                        <option>4 heures</option>
                        <option>2 heures</option>
                      </select>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Verrouillage automatique</span>
                      <label className="flex items-center">
                        <input type="checkbox" defaultChecked className="mr-2" />
                        <span className="text-sm">Après 15 minutes d'inactivité</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Matériel */}
            {activeTab === 'hardware' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900">Configuration du matériel</h3>
                
                {/* Scanner iris */}
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-gray-900">Scanner d'iris</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button
                      onClick={handleTestCamera}
                      variant="secondary"
                    >
                      <CameraIcon className="w-5 h-5 mr-2" />
                      <span>Calibrer la caméra</span>
                    </Button>
                    <Button variant="secondary">
                      <CogIcon className="w-5 h-5 mr-2" />
                      <span>Paramètres avancés</span>
                    </Button>
                  </div>
                </div>
                
                {/* Imprimante */}
                <div className="space-y-4 pt-6 border-t border-gray-200">
                  <h4 className="text-lg font-medium text-gray-900">Imprimante</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button
                      onClick={handleTestPrinter}
                      variant="secondary"
                    >
                      <PrinterIcon className="w-5 h-5 mr-2" />
                      <span>Tester l'imprimante</span>
                    </Button>
                    <Button variant="secondary">
                      <CogIcon className="w-5 h-5 mr-2" />
                      <span>Configuration papier</span>
                    </Button>
                  </div>
                  
                  <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                    <h5 className="font-medium text-gray-900 mb-2">État de l'imprimante</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Statut</span>
                        <span className="text-green-600 font-medium">Prête</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Niveau d'encre</span>
                        <span className="text-gray-900">85%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Papier</span>
                        <span className="text-gray-900">150 feuilles</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900">Préférences de notification</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Notifications par email</h4>
                      <p className="text-sm text-gray-600">Recevoir des alertes par email</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications.email}
                        onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Notifications push</h4>
                      <p className="text-sm text-gray-600">Recevoir des notifications dans le navigateur</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications.push}
                        onChange={(e) => setNotifications({ ...notifications, push: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Sons de notification</h4>
                      <p className="text-sm text-gray-600">Émettre un son lors des notifications</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications.sound}
                        onChange={(e) => setNotifications({ ...notifications, sound: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Système */}
            {activeTab === 'system' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900">Informations système</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Version</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Application</span>
                        <span className="font-medium">v1.0.0</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Base de données</span>
                        <span className="font-medium">PostgreSQL 16</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Interface</span>
                        <span className="font-medium">React 18</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Performance</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Mémoire utilisée</span>
                        <span className="font-medium">245 MB</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">CPU</span>
                        <span className="font-medium">12%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Uptime</span>
                        <span className="font-medium">2j 14h 32m</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-6 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-4">Actions système</h4>
                  <div className="flex flex-wrap gap-4">
                    <Button variant="secondary">Sauvegarder</Button>
                    <Button variant="secondary">Restaurer</Button>
                    <Button variant="secondary">Mettre à jour</Button>
                    <Button variant="secondary" className="text-red-600 hover:bg-red-50">Redémarrer</Button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}