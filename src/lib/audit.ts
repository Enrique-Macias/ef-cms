/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from './prisma';

export interface AuditLogData {
  userId?: number | null;
  resource: string;
  action: string;
  changes: any;
}

export const createAuditLog = async (data: AuditLogData) => {
  try {
    await prisma.auditLog.create({
      data: {
        userId: data.userId || null, // Allow null userId for unauthenticated requests
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
  PASSWORD_CHANGE: 'Cambio de contraseña',
  PASSWORD_RESET: 'PASSWORD_RESET',
  ACCOUNT_DEACTIVATED: 'ACCOUNT_DEACTIVATED',
  ROLE_CHANGED: 'ROLE_CHANGED',
};

export const auditResources = {
  USERS: 'Usuarios',
  EVENTS: 'events',
  EVENT_IMAGES: 'event_images',
  NEWS: 'news',
  NEWS_IMAGES: 'news_images',
  TESTIMONIALS: 'testimonials',
  TEAM: 'team',
  FUNDADORES: 'fundadores',
  ARTICLES: 'articles',
  APOYO: 'apoyo',
  SPONSORS: 'sponsors',
};

// Convenience functions for common operations
export const logUserAction = async (
  userId: number,
  action: string,
  resource: string,
  changes: any
) => {
  await createAuditLog({
    userId,
    action,
    resource,
    changes,
  });
};

export const logUserLogin = async (userId: number) => {
  await createAuditLog({
    userId,
    action: auditActions.LOGIN,
    resource: 'auth',
    changes: { timestamp: new Date().toISOString() },
  });
};

export const logUserLogout = async (userId: number) => {
  await createAuditLog({
    userId,
    action: auditActions.LOGOUT,
    resource: 'auth',
    changes: { timestamp: new Date().toISOString() },
  });
};

// Helper function to get resource type in Spanish for actividad page
export const getResourceTypeInSpanish = (resource: string): string => {
  switch (resource) {
    case 'news':
      return 'Noticia';
    case 'events':
      return 'Evento';
    case 'testimonials':
      return 'Testimonio';
    case 'team':
      return 'Equipo';
    case 'fundadores':
      return 'Fundador';
    case 'articles':
      return 'Artículo';
    case 'apoyo':
      return 'Apoyo';
    case 'sponsors':
      return 'Patrocinador';
    default:
      return resource;
  }
};

// Helper function to convert Spanish resource type back to English database value
export const getResourceTypeFromSpanish = (spanishType: string): string => {
  switch (spanishType) {
    case 'Noticia':
      return 'news';
    case 'Evento':
      return 'events';
    case 'Testimonio':
      return 'testimonials';
    case 'Equipo':
      return 'team';
    case 'Fundador':
      return 'fundadores';
    case 'Artículo':
      return 'articles';
    case 'Apoyo':
      return 'apoyo';
    case 'Patrocinador':
      return 'sponsors';
    default:
      return spanishType.toLowerCase();
  }
};

// Helper function to get action in Spanish for actividad page
export const getActionInSpanish = (action: string): string => {
  switch (action) {
    case 'CREATE':
      return 'Creación';
    case 'UPDATE':
      return 'Actualización';
    case 'DELETE':
      return 'Eliminación';
    default:
      return action;
  }
};

// Function to get audit logs for actividad page
export const getAuditLogsForActividad = async (
  page: number = 1, 
  limit: number = 10, 
  search: string = '', 
  typeFilter: string = '', 
  dateFilter: string = ''
) => {
  try {
    const skip = (page - 1) * limit;
    
    // Build where clause for filtering
    const whereClause: any = {};
    
    // Add search filter (search in title or author)
    if (search) {
      whereClause.OR = [
        {
          user: {
            fullName: {
              contains: search,
              mode: 'insensitive'
            }
          }
        }
      ];
    }
    
    // Add type filter
    if (typeFilter) {
      whereClause.resource = getResourceTypeFromSpanish(typeFilter);
    }
    
    // Add date filter
    if (dateFilter) {
      const now = new Date();
      let startDate: Date;
      
      switch (dateFilter) {
        case 'today':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(0); // All time
      }
      
      whereClause.createdAt = {
        gte: startDate
      };
    }
    
    const auditLogs = await prisma.auditLog.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            fullName: true,
          },
        },
      },
    });

    const total = await prisma.auditLog.count({
      where: whereClause
    });

    return {
      auditLogs: auditLogs.map(log => {
        const changes = log.changes as any;
        // Get appropriate title based on resource type
        let title = 'Sin título';
        if (log.resource === 'team') {
          title = changes?.name || 'Sin título';
        } else if (log.resource === 'testimonials') {
          title = changes?.author || 'Sin título';
        } else if (log.resource === 'fundadores') {
          title = changes?.name || 'Sin título';
        } else if (log.resource === 'apoyo') {
          title = changes?.title || 'Sin título';
        } else if (log.resource === 'sponsors') {
          title = changes?.name || 'Sin título';
        } else {
          title = changes?.title || changes?.title_es || 'Sin título';
        }

        return {
          id: log.id,
          title,
          type: getResourceTypeInSpanish(log.resource),
          action: getActionInSpanish(log.action),
          author: log.user?.fullName || 'Sistema',
          date: log.createdAt.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            timeZone: 'America/Mexico_City'
          }),
          createdAt: log.createdAt,
        };
      }),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error('Failed to fetch audit logs:', error);
    throw error;
  }
};
