/**
 * Utility functions for triggering audit log refreshes across the application
 */

/**
 * Triggers a custom event to refresh audit logs on all pages that are listening
 * This is useful when creating, updating, or deleting items from management pages
 */
export const triggerAuditLogRefresh = () => {
  // Dispatch a custom event that the actividad page is listening for
  window.dispatchEvent(new CustomEvent('auditLogsUpdated'))
}

/**
 * Triggers audit log refresh after a successful operation
 * Call this after successful CREATE, UPDATE, or DELETE operations
 */
export const notifyAuditLogUpdate = () => {
  // Small delay to ensure the audit log has been created in the database
  setTimeout(() => {
    triggerAuditLogRefresh()
  }, 500)
}
