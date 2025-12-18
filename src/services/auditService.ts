import { supabase } from '../utils/supabase';

export interface AuditOperation {
  id: string;
  date: string;
  type: 'Enrôlement' | 'Identification';
  agent: string;
  result: 'succès' | 'non trouvé' | 'erreur';
  citizenCni?: string;
  duration?: number; // in seconds
  details?: any;
}

// Simple audit service using localStorage for now
// In production, this would use a proper audit table in Supabase
export const auditService = {
  // Log an operation
  async logOperation(operation: Omit<AuditOperation, 'id' | 'date'>): Promise<void> {
    try {
      const auditEntry: AuditOperation = {
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        ...operation
      };

      // Store in localStorage for now
      const existingAudits = this.getStoredAudits();
      existingAudits.push(auditEntry);

      // Keep only last 1000 entries
      if (existingAudits.length > 1000) {
        existingAudits.splice(0, existingAudits.length - 1000);
      }

      localStorage.setItem('eyedentify_audits', JSON.stringify(existingAudits));
      console.log('Audit logged:', auditEntry);
    } catch (error) {
      console.error('Failed to log audit:', error);
    }
  },

  // Get stored audits from localStorage
  getStoredAudits(): AuditOperation[] {
    try {
      const stored = localStorage.getItem('eyedentify_audits');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to get stored audits:', error);
      return [];
    }
  },

  // Get operations with filtering
  getOperations(filters?: {
    period?: 'today' | '7days' | '30days' | 'all';
    type?: 'all' | 'Enrôlement' | 'Identification';
    result?: 'all' | 'succès' | 'non trouvé' | 'erreur';
    search?: string;
  }): AuditOperation[] {
    let operations = this.getStoredAudits();

    if (!filters) return operations;

    // Filter by period
    if (filters.period && filters.period !== 'all') {
      const now = new Date();
      const operationDate = new Date();
      let daysBack = 0;

      switch (filters.period) {
        case 'today':
          daysBack = 0;
          break;
        case '7days':
          daysBack = 7;
          break;
        case '30days':
          daysBack = 30;
          break;
      }

      operationDate.setDate(now.getDate() - daysBack);
      operations = operations.filter(op => new Date(op.date) >= operationDate);
    }

    // Filter by type
    if (filters.type && filters.type !== 'all') {
      operations = operations.filter(op => op.type === filters.type);
    }

    // Filter by result
    if (filters.result && filters.result !== 'all') {
      operations = operations.filter(op => op.result === filters.result);
    }

    // Filter by search
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      operations = operations.filter(op =>
        op.citizenCni?.includes(searchLower) ||
        op.agent.toLowerCase().includes(searchLower)
      );
    }

    // Sort by date descending
    return operations.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  // Get recent operations for dashboard
  getRecentOperations(limit: number = 5): AuditOperation[] {
    return this.getStoredAudits()
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  },

  // Get operation statistics
  getOperationStats(): {
    total: number;
    success: number;
    failed: number;
    errors: number;
    todayCount: number;
  } {
    const operations = this.getStoredAudits();
    const today = new Date().toDateString();

    return {
      total: operations.length,
      success: operations.filter(op => op.result === 'succès').length,
      failed: operations.filter(op => op.result === 'non trouvé').length,
      errors: operations.filter(op => op.result === 'erreur').length,
      todayCount: operations.filter(op => new Date(op.date).toDateString() === today).length
    };
  }
};