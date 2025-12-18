import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ClockIcon,
  FunnelIcon,
  DocumentPlusIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { auditService, type AuditOperation } from '../services/auditService';

type FilterPeriod = 'today' | '7days' | '30days' | 'all';
type FilterType = 'all' | 'Enrôlement' | 'Identification';
type FilterResult = 'all' | 'succès' | 'non trouvé' | 'erreur';

export default function History() {
  const [searchTerm, setSearchTerm] = useState('');
  const [periodFilter, setPeriodFilter] = useState<FilterPeriod>('today');
  const [typeFilter, setTypeFilter] = useState<FilterType>('all');
  const [resultFilter, setResultFilter] = useState<FilterResult>('all');
  const [operations, setOperations] = useState<AuditOperation[]>([]);
  const [loading, setLoading] = useState(true);

  // Load operations from audit service
  useEffect(() => {
    const loadOperations = () => {
      const ops = auditService.getOperations({
        period: periodFilter,
        type: typeFilter,
        result: resultFilter,
        search: searchTerm
      });
      setOperations(ops);
      setLoading(false);
    };

    loadOperations();

    // Refresh every 5 seconds to catch new operations
    const interval = setInterval(loadOperations, 5000);

    return () => clearInterval(interval);
  }, [periodFilter, typeFilter, resultFilter, searchTerm]);

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getResultIcon = (result: string) => {
    switch (result) {
      case 'succès':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'non trouvé':
        return <XCircleIcon className="w-5 h-5 text-red-500" />;
      case 'erreur':
        return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-400" />;
    }
  };

  const getResultBadgeColor = (result: string) => {
    switch (result) {
      case 'succès':
        return 'bg-green-100 text-green-800';
      case 'non trouvé':
        return 'bg-red-100 text-red-800';
      case 'erreur':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    return type === 'Enrôlement' ? 
      <DocumentPlusIcon className="w-5 h-5 text-blue-500" /> :
      <MagnifyingGlassIcon className="w-5 h-5 text-purple-500" />;
  };

  // Statistiques
  const stats = {
    total: operations.length,
    success: operations.filter((op: AuditOperation) => op.result === 'succès').length,
    failed: operations.filter((op: AuditOperation) => op.result === 'non trouvé').length,
    errors: operations.filter((op: AuditOperation) => op.result === 'erreur').length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin-slow w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Historique des opérations</h1>
        <p className="text-gray-600 mt-1">Journal complet des enrôlements et identifications</p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card text-center">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-600">Total opérations</div>
        </div>
        
        <div className="glass-card text-center">
          <div className="text-2xl font-bold text-green-600">{stats.success}</div>
          <div className="text-sm text-gray-600">Succès</div>
        </div>
        
        <div className="glass-card text-center">
          <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
          <div className="text-sm text-gray-600">Non trouvé</div>
        </div>
        
        <div className="glass-card text-center">
          <div className="text-2xl font-bold text-yellow-600">{stats.errors}</div>
          <div className="text-sm text-gray-600">Erreurs</div>
        </div>
      </div>

      {/* Filtres */}
      <div className="glass-card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Recherche */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher (CNI ou agent)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {/* Période */}
          <select
            value={periodFilter}
            onChange={(e) => setPeriodFilter(e.target.value as FilterPeriod)}
            className="input-field"
          >
            <option value="today">Aujourd'hui</option>
            <option value="7days">7 derniers jours</option>
            <option value="30days">30 derniers jours</option>
            <option value="all">Toutes les dates</option>
          </select>

          {/* Type */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as FilterType)}
            className="input-field"
          >
            <option value="all">Tous les types</option>
            <option value="Enrôlement">Enrôlements</option>
            <option value="Identification">Identifications</option>
          </select>

          {/* Résultat */}
          <select
            value={resultFilter}
            onChange={(e) => setResultFilter(e.target.value as FilterResult)}
            className="input-field"
          >
            <option value="all">Tous les résultats</option>
            <option value="succès">Succès</option>
            <option value="non trouvé">Non trouvé</option>
            <option value="erreur">Erreur</option>
          </select>
        </div>
      </div>

      {/* Liste des opérations */}
      <div className="glass-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-4 font-semibold text-gray-900">Date/Heure</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-900">Type</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-900">Agent</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-900">Citoyen</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-900">Résultat</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-900">Durée</th>
              </tr>
            </thead>
            <tbody>
              {operations.map((operation, index) => (
                <motion.tr
                  key={operation.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div className="text-sm text-gray-900">{formatDateTime(operation.date)}</div>
                  </td>
                  
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(operation.type)}
                      <span className="text-sm font-medium text-gray-900">{operation.type}</span>
                    </div>
                  </td>
                  
                  <td className="py-4 px-4">
                    <div className="text-sm text-gray-900">{operation.agent}</div>
                  </td>
                  
                  <td className="py-4 px-4">
                    {operation.citizenCni ? (
                      <div className="text-sm font-mono text-gray-900">{operation.citizenCni}</div>
                    ) : (
                      <div className="text-sm text-gray-500">-</div>
                    )}
                  </td>
                  
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      {getResultIcon(operation.result)}
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getResultBadgeColor(operation.result)}`}>
                        {operation.result}
                      </span>
                    </div>
                  </td>
                  
                  <td className="py-4 px-4">
                    <div className="text-sm text-gray-600">
                      {operation.type === 'Enrôlement' ? '45s' : '3.2s'}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Message si aucun résultat */}
        {operations.length === 0 && (
          <div className="text-center py-12">
            <ClockIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune opération trouvée</h3>
            <p className="text-gray-600">
              Aucune opération ne correspond à vos critères de filtrage.
            </p>
          </div>
        )}
      </div>

      {/* Graphique des opérations (simulation) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Opérations par heure</h3>
          <div className="space-y-3">
            {['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00'].map((hour, index) => (
              <div key={hour} className="flex items-center space-x-4">
                <div className="w-12 text-sm text-gray-600">{hour}</div>
                <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                  <div 
                    className="bg-primary-500 h-6 rounded-full flex items-center justify-end pr-2"
                    style={{ width: `${Math.random() * 80 + 20}%` }}
                  >
                    <span className="text-xs text-white font-medium">
                      {Math.floor(Math.random() * 15 + 1)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition par type</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <DocumentPlusIcon className="w-5 h-5 text-blue-500" />
                <span className="text-gray-700">Enrôlements</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
                <span className="text-sm font-medium">60%</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MagnifyingGlassIcon className="w-5 h-5 text-purple-500" />
                <span className="text-gray-700">Identifications</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '40%' }}></div>
                </div>
                <span className="text-sm font-medium">40%</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {Math.round((stats.success / stats.total) * 100) || 0}%
              </div>
              <div className="text-sm text-gray-600">Taux de réussite</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}