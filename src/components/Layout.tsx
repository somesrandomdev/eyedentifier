import { ReactNode, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { citizensService } from '../services/citizensService';
import {
  HomeIcon,
  UserGroupIcon,
  DocumentPlusIcon,
  MagnifyingGlassIcon,
  ClockIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
  EyeIcon,
  ShieldCheckIcon,
  Bars3Icon,
  XMarkIcon,
  BellIcon,
  UserIcon,
  WifiIcon,
  DevicePhoneMobileIcon
} from '@heroicons/react/24/outline';
import Button from './Button';
import { motion, AnimatePresence } from 'framer-motion';

interface LayoutProps {
  children: ReactNode;
}

const navigation = [
  {
    name: 'Tableau de bord',
    href: '/tableau-de-bord',
    icon: HomeIcon,
    description: 'Vue d\'ensemble des opérations',
    badge: null
  },
  {
    name: 'Registre citoyens',
    href: '/citoyens',
    icon: UserGroupIcon,
    description: 'Base de données des citoyens',
    badge: null // Will be set dynamically
  },
  {
    name: 'Enrôler',
    href: '/enroler',
    icon: DocumentPlusIcon,
    description: 'Nouveau citoyen',
    badge: null
  },
  {
    name: 'Identifier',
    href: '/identifier',
    icon: MagnifyingGlassIcon,
    description: 'Recherche par iris',
    badge: null
  },
  {
    name: 'Historique',
    href: '/historique',
    icon: ClockIcon,
    description: 'Journal des opérations',
    badge: null
  },
  {
    name: 'Paramètres',
    href: '/parametres',
    icon: CogIcon,
    description: 'Configuration système',
    badge: null
  },
];

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [citizenCount, setCitizenCount] = useState('...');

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const count = await citizensService.getTotalCitizensCount();
        setCitizenCount(count.toLocaleString());
      } catch (error) {
        console.error('Erreur lors du chargement du nombre de citoyens:', error);
        setCitizenCount('0');
      }
    };
    fetchCount();
  }, []);

  const handleLogout = () => {
    logout();
  };

  const isActiveRoute = (href: string) => {
    return location.pathname === href || 
      (href === '/enroler' && location.pathname.startsWith('/enroler'));
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Compact Senegal Header - Only on Desktop */}
      <div className="hidden lg:block sticky top-0 z-20 bg-neutral-0/80 backdrop-blur border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-neutral-0 border border-neutral-200 rounded-lg flex items-center justify-center shadow-md overflow-hidden">
              <img
                src="/assets/symbole-couleur.svg"
                alt="Emblème du Sénégal"
                className="w-6 h-6 object-contain"
                onError={(e) => {
                  // Fallback to flag emoji if SVG fails
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.innerHTML = '<span class="text-primary font-bold text-sm">🇸🇳</span>';
                }}
              />
            </div>
            <div>
              <h2 className="text-lg font-bold text-primary">République du Sénégal</h2>
              <p className="text-xs text-neutral-700">Ministère de l'Intérieur - Direction de l'État Civil</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-neutral-0 border border-neutral-200 rounded-lg flex items-center justify-center shadow-md overflow-hidden">
              <img
                src="/assets/eyedentify-logo.png"
                alt="EyeDentify Logo"
                className="w-6 h-6 object-contain"
                onError={(e) => {
                  // Fallback to icon if logo fails to load
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.innerHTML = '<svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>';
                }}
              />
            </div>
            <div className="text-right">
              <h3 className="text-lg font-bold text-primary">EyeDentify</h3>
              <p className="text-xs text-neutral-700">La sécurité en un regard</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout Container */}
      <div className="flex h-screen">
        {/* Enhanced Desktop Sidebar */}
        <div className="hidden lg:flex lg:flex-col lg:w-80 bg-white border-r border-gray-200 shadow-soft">
        {/* Header with Logo */}
        <div className="p-6 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-colored overflow-hidden">
              <img
                src="/assets/eyedentify-logo.png"
                alt="EyeDentify Logo"
                className="w-12 h-12 object-contain"
                onError={(e) => {
                  // Fallback to icon if logo fails
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.innerHTML = '<svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>';
                }}
              />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">Eyedentify</h1>
              <p className="text-sm text-gray-600 flex items-center mt-1">
                <ShieldCheckIcon className="w-4 h-4 mr-2 text-primary" />
                Système d'identification CNI Sénégal
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = isActiveRoute(item.href);
            const badgeValue = item.name === 'Registre citoyens' ? citizenCount : item.badge;

            return (
              <Link
                key={item.name}
                to={item.href}
                className={`nav-item group ${isActive ? 'active' : ''}`}
              >
                <div className="flex items-center space-x-4 w-full">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-primary text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200 group-hover:text-gray-900'
                  }`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`text-sm font-semibold truncate ${
                        isActive ? 'text-primary' : 'text-neutral-900'
                      }`}>
                        {item.name}
                      </p>
                      {badgeValue && (
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full ml-2">
                          {badgeValue}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{item.description}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* User Info and Logout */}
        <div className="p-4 border-t border-gray-100 flex-shrink-0">
          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-4 mb-4 border border-primary/10">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center shadow-sm">
                <UserIcon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">Opérateur Système</p>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <p className="text-xs text-gray-500">Session active</p>
                </div>
              </div>
            </div>
          </div>
          
          <Button
            onClick={handleLogout}
            variant="secondary"
            className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-red-100 text-red-600 group-hover:bg-red-200 transition-colors">
                <ArrowRightOnRectangleIcon className="w-6 h-6" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-semibold">Déconnexion</p>
                <p className="text-xs text-gray-500">Fermer la session sécurisée</p>
              </div>
            </div>
          </Button>
        </div>
      </div>

      {/* Enhanced Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="btn-icon"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center overflow-hidden">
                <img
                  src="/assets/eyedentify-logo.png"
                  alt="EyeDentify Logo"
                  className="w-6 h-6 object-contain"
                  onError={(e) => {
                    // Fallback to icon if logo fails
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.innerHTML = '<svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>';
                  }}
                />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Eyedentify</h1>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="btn-icon">
              <BellIcon className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <UserIcon className="w-5 h-5 text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "tween", duration: 0.3 }}
              className="lg:hidden fixed inset-y-0 left-0 w-80 bg-white shadow-large z-50 flex flex-col"
            >
              {/* Mobile Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center overflow-hidden">
                    <img
                      src="/assets/eyedentify-logo.png"
                      alt="EyeDentify Logo"
                      className="w-10 h-10 object-contain"
                      onError={(e) => {
                        // Fallback to icon if logo fails
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.innerHTML = '<svg class="w-7 h-7 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>';
                      }}
                    />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">Eyedentify</h1>
                    <p className="text-sm text-gray-600">CNI Sénégal</p>
                  </div>
                </div>
              </div>

              {/* Mobile Navigation */}
              <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {navigation.map((item) => {
                  const isActive = isActiveRoute(item.href);
                  
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`nav-item ${isActive ? 'active' : ''}`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          isActive 
                            ? 'bg-gradient-primary text-white' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          <item.icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${
                            isActive ? 'text-primary' : 'text-neutral-900'
                          }`}>
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-500">{item.description}</p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </nav>

              {/* Mobile Logout */}
              <div className="p-4 border-t border-gray-100">
                <Button
                  onClick={handleLogout}
                  variant="secondary"
                  className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-red-100 text-red-600">
                      <ArrowRightOnRectangleIcon className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium">Déconnexion</span>
                  </div>
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Enhanced Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Enhanced Top Bar */}
        <div className="bg-white border-b border-gray-200 shadow-sm flex-shrink-0">
          <div className="px-4 md:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-sm">
                  <ShieldCheckIcon className="w-6 h-6 text-white" />
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-semibold text-gray-900">Sécurisé - République du Sénégal</p>
                  <p className="text-xs text-gray-500">
                    {new Date().toLocaleDateString('fr-FR', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* System Status Indicators */}
                <div className="hidden sm:flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-2 text-green-600">
                    <WifiIcon className="w-4 h-4" />
                    <span className="hidden md:inline">Connecté</span>
                  </div>
                  <div className="flex items-center space-x-2 text-blue-600">
                    <DevicePhoneMobileIcon className="w-4 h-4" />
                    <span className="hidden md:inline">PWA</span>
                  </div>
                  <div className="flex items-center space-x-2 text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="hidden md:inline">Opérationnel</span>
                  </div>
                </div>

                {/* User Menu */}
                <div className="flex items-center space-x-2">
                  <button className="btn-icon">
                    <BellIcon className="w-5 h-5" />
                  </button>
                  <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-semibold">OP</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Main Content */}
        <main className="flex-1 overflow-auto bg-gradient-subtle">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <div className="container-responsive py-6 md:py-8">
              {children}
            </div>
          </motion.div>
        </main>
      </div>
      </div>
    </div>
  );
}