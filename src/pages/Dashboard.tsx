import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  UserGroupIcon,
  IdentificationIcon,
  DocumentPlusIcon,
  EyeIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  ArrowTrendingUpIcon,
  UsersIcon,
  FingerPrintIcon,
  ShieldCheckIcon,
  DevicePhoneMobileIcon
} from '@heroicons/react/24/outline';
import Button from '../components/Button';
import { citizensService } from '../services/citizensService';
import { auditService } from '../services/auditService';

interface StatItem {
  name: string;
  value: string;
  icon: any;
  color: string;
  trend: string;
  trendUp: boolean;
  description: string;
  bgPattern: boolean;
}

const quickActions = [
  {
    name: 'Identifier un citoyen',
    description: 'Recherche par scan d\'iris 1:N',
    href: '/identifier',
    icon: EyeIcon,
    color: 'bg-gradient-primary',
    features: ['Scan rapide', 'Base de données', 'Résultats instantanés'],
    stats: '2.3s avg'
  },
  {
    name: 'Enrôler un citoyen',
    description: 'Création nouveau profil',
    href: '/enroler',
    icon: DocumentPlusIcon,
    color: 'bg-gradient-senegal',
    features: ['Données personnelles', 'Photo CNI', 'Capture iris'],
    stats: '4 étapes'
  }
];

const recentActivities = [
  { 
    time: '10:30', 
    action: 'Enrôlement terminé', 
    citizen: 'Amadou Diallo', 
    status: 'success',
    type: 'enrollment',
    cni: 'SN-2025-123456'
  },
  { 
    time: '09:15', 
    action: 'Identification réussie', 
    citizen: 'Fatou Ndiaye', 
    status: 'success',
    type: 'identification',
    cni: 'SN-2025-789012'
  },
  { 
    time: '08:45', 
    action: 'Scan iris en cours', 
    citizen: 'Recherche...', 
    status: 'pending',
    type: 'scan'
  },
  {
    time: '08:20',
    action: 'Nouvelle session',
    citizen: 'Opérateur système',
    status: 'info',
    type: 'system'
  }
];

export default function Dashboard() {
  const [stats, setStats] = useState<StatItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [totalCitizens, todayEnrollments] = await Promise.all([
          citizensService.getTotalCitizensCount(),
          citizensService.getCitizensEnrolledToday()
        ]);

        const statsData: StatItem[] = [
          {
            name: 'Citoyens enregistrés',
            value: totalCitizens.toLocaleString(),
            icon: UserGroupIcon,
            color: 'primary',
            trend: '+12%',
            trendUp: true,
            description: 'Total dans la base de données',
            bgPattern: true
          },
          {
            name: 'ID du jour',
            value: '0', // TODO: Implement identification tracking
            icon: IdentificationIcon,
            color: 'success',
            trend: '+5%',
            trendUp: true,
            description: 'Identifications effectuées',
            bgPattern: true
          },
          {
            name: 'Enrôlements du jour',
            value: todayEnrollments.length.toString(),
            icon: DocumentPlusIcon,
            color: 'secondary',
            trend: '+8%',
            trendUp: true,
            description: 'Nouveaux citoyens',
            bgPattern: true
          }
        ];

        setStats(statsData);

        // Load recent activities
        const recentOps = auditService.getRecentOperations(5);
        const activities = recentOps.map(op => ({
          time: new Date(op.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
          action: op.type === 'Enrôlement' ? 'Enrôlement terminé' : 'Identification réussie',
          citizen: op.citizenCni || 'Citoyen inconnu',
          status: op.result === 'succès' ? 'success' : op.result === 'non trouvé' ? 'error' : 'warning',
          type: op.type === 'Enrôlement' ? 'enrollment' : 'identification',
          cni: op.citizenCni
        }));
        setRecentActivities(activities);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        // Show empty stats instead of mock data
        const emptyStats: StatItem[] = [
          {
            name: 'Citoyens enregistrés',
            value: '0',
            icon: UserGroupIcon,
            color: 'primary',
            trend: '+0%',
            trendUp: true,
            description: 'Total dans la base de données',
            bgPattern: true
          },
          {
            name: 'ID du jour',
            value: '0',
            icon: IdentificationIcon,
            color: 'success',
            trend: '+0%',
            trendUp: true,
            description: 'Identifications effectuées',
            bgPattern: true
          },
          {
            name: 'Enrôlements du jour',
            value: '0',
            icon: DocumentPlusIcon,
            color: 'secondary',
            trend: '+0%',
            trendUp: true,
            description: 'Nouveaux citoyens',
            bgPattern: true
          }
        ];
        setStats(emptyStats);
        setRecentActivities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Refresh data every 10 seconds
    const interval = setInterval(fetchData, 10000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin-slow w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-responsive">
      {/* Enhanced Modern Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <div className="modern-card bg-gradient-card overflow-hidden">
          <div className="relative z-10 p-6 md:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex-1">
                <h1 className="heading-responsive font-bold text-gray-900 mb-3">
                  Tableau de bord Eyedentify
                </h1>
                <p className="text-responsive text-gray-600 mb-4">
                  Système d'identification par iris - République du Sénégal
                </p>
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center space-x-2 text-primary">
                    <ShieldCheckIcon className="w-4 h-4" />
                    <span className="font-medium">Sécurisé</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <DevicePhoneMobileIcon className="w-4 h-4" />
                    <span>PWA Activée</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <ClockIcon className="w-4 h-4" />
                    <span>{new Date().toLocaleDateString('fr-FR', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-2xl flex items-center justify-center shadow-colored overflow-hidden">
                  <img
                    src="/assets/eyedentify-logo.png"
                    alt="EyeDentify Logo"
                    className="w-16 h-16 md:w-20 md:h-20 object-contain"
                    onError={(e) => {
                      // Fallback to icon if logo fails
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement!.innerHTML = '<svg class="w-10 h-10 md:w-12 md:h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>';
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          {/* Decorative background pattern */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-mesh opacity-30 transform rotate-12 translate-x-8 -translate-y-8"></div>
        </div>
      </motion.div>
{/* Dashboard "wow" tiles */}
<div className="grid md:grid-cols-3 gap-6 animate-slide-up">
  {stats.map((stat, index) => (
    <motion.div
      key={stat.name}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`rounded-2xl p-6 shadow-lg border border-white/20 ${
        index === 0 ? 'bg-gradient-to-br from-green-800 to-green-900 text-white' :
        index === 1 ? 'bg-gradient-to-br from-yellow-600 to-yellow-700 text-white' :
        'bg-gradient-to-br from-red-700 to-red-800 text-white'
      }`}
    >
      <div className="text-3xl font-bold mb-2">{stat.value}</div>
      <div className="text-sm opacity-90">{stat.name}</div>
    </motion.div>
  ))}
</div>


      {/* Enhanced Quick Actions */}
      <div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Actions principales</h2>
              <p className="text-gray-600">Accès rapide aux fonctions essentielles</p>
            </div>
            <div className="text-sm text-gray-500">
              Dernière mise à jour: {new Date().toLocaleTimeString('fr-FR')}
            </div>
          </div>
        </motion.div>
        
        <div className="responsive-grid-lg">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <Link
                to={action.href}
                className="block modern-card group hover:shadow-large transition-all duration-500 overflow-hidden"
              >
                <div className="modern-card-content">
                  <div className="flex items-start space-x-6">
                    <div className={`w-20 h-20 ${action.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg flex-shrink-0`}>
                      <action.icon className="w-10 h-10 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">{action.name}</h3>
                      <p className="text-gray-600 mb-4 leading-relaxed">{action.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {action.features.map((feature) => (
                          <span key={feature} className="status-badge bg-gray-100 text-gray-700 text-xs">
                            {feature}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                          <span className="font-medium">{action.stats}</span>
                        </div>
                        <div className="text-primary group-hover:translate-x-2 transition-transform duration-300">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Enhanced Activity and Performance Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Enhanced Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="modern-card"
        >
          <div className="modern-card-header">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                <ClockIcon className="w-6 h-6 mr-3 text-primary" />
                Activité récente
              </h3>
              <Button variant="secondary" size="sm">Voir tout</Button>
            </div>
          </div>
          <div className="modern-card-body">
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <motion.div 
                  key={index} 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="flex items-center space-x-4 py-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 rounded-lg transition-colors duration-200 -mx-2 px-2"
                >
                  <div className="relative flex-shrink-0">
                    <div className={`status-dot ${
                      activity.status === 'success' ? 'success' : 
                      activity.status === 'pending' ? 'warning' : 'info'
                    }`}></div>
                    {activity.status === 'pending' && (
                      <div className="absolute inset-0 w-2 h-2 rounded-full bg-yellow-500 animate-ping opacity-75"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{activity.action}</p>
                    <p className="text-sm text-gray-600 truncate">{activity.citizen}</p>
                    {activity.cni && (
                      <p className="text-xs text-gray-400 font-mono">{activity.cni}</p>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm text-gray-500">{activity.time}</p>
                    <div className={`inline-flex px-2 py-1 text-xs font-medium rounded-full mt-1 ${
                      activity.status === 'success' ? 'status-success' : 
                      activity.status === 'pending' ? 'status-warning' : 'status-info'
                    }`}>
                      {activity.status === 'success' ? 'Succès' : 
                       activity.status === 'pending' ? 'En cours' : 'Info'}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Enhanced System Performance */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="modern-card"
        >
          <div className="modern-card-header">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center">
              <CheckCircleIcon className="w-6 h-6 mr-3 text-primary" />
              État du système
            </h3>
          </div>
          <div className="modern-card-body">
            <div className="space-y-8">
              {/* Today's Operations */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-4">Opérations aujourd'hui</h4>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm text-gray-600">Enrôlements</span>
                      <span className="text-sm font-semibold text-gray-900">15/20</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: '75%' }}></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">75% complété</p>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm text-gray-600">Identifications</span>
                      <span className="text-sm font-semibold text-gray-900">23/25</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill bg-gradient-success" style={{ width: '92%' }}></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">92% complété</p>
                  </div>
                </div>
              </div>

              {/* System Status */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-4">Statut des services</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2">
                    <div className="flex items-center space-x-3">
                      <FingerPrintIcon className="w-5 h-5 text-primary" />
                      <span className="text-sm text-gray-600">Scanner iris</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-green-600 font-medium">En ligne</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <div className="flex items-center space-x-3">
                      <UsersIcon className="w-5 h-5 text-primary" />
                      <span className="text-sm text-gray-600">Base de données</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-green-600 font-medium">Connectée</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <div className="flex items-center space-x-3">
                      <ChartBarIcon className="w-5 h-5 text-primary" />
                      <span className="text-sm text-gray-600">Temps de réponse</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">1.2s</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <div className="flex items-center space-x-3">
                      <DevicePhoneMobileIcon className="w-5 h-5 text-primary" />
                      <span className="text-sm text-gray-600">Mode PWA</span>
                    </div>
                    <span className="text-sm font-medium text-green-600">Actif</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}