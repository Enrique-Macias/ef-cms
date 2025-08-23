import { prisma } from './prisma';

export interface AuditLogData {
  userId?: number;
  resource: string;
  action: string;
  changes: any;
}

export const createAuditLog = async (data: AuditLogData) => {
  try {
    await prisma.auditLog.create({
      data: {
        userId: data.userId,
        resource: data.resource,
        action: data.action,
        changes: data.changes,
      },
    });
  } catch (error) {
    console.error('Failed to create audit log:', error);
    // Don't throw error as audit logging shouldn't break main functionality
  }
};

// Helper functions for common audit actions
export const auditActions = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  PASSWORD_CHANGE: 'PASSWORD_CHANGE',
  PASSWORD_RESET: 'PASSWORD_RESET',
  ACCOUNT_DEACTIVATED: 'ACCOUNT_DEACTIVATED',
  ROLE_CHANGED: 'ROLE_CHANGED',
};

export const auditResources = {
  USERS: 'users',
  EVENTS: 'events',
  EVENT_IMAGES: 'event_images',
  NEWS: 'news',
  NEWS_IMAGES: 'news_images',
  TESTIMONIALS: 'testimonials',
};

// Convenience functions for common operations
export const logUserAction = async (
  userId: number,
  action: string,
  resource: string,
  changes: any,
  req?: any
) => {
  await createAuditLog({
    userId,
    action,
    resource,
    changes,
  });
};

export const logUserLogin = async (userId: number, req?: any) => {
  await createAuditLog({
    userId,
    action: auditActions.LOGIN,
    resource: 'auth',
    changes: { timestamp: new Date().toISOString() },
  });
};

export const logUserLogout = async (userId: number, req?: any) => {
  await createAuditLog({
    userId,
    action: auditActions.LOGOUT,
    resource: 'auth',
    changes: { timestamp: new Date().toISOString() },
  });
};
