// Utility function to make authenticated API calls
export const authenticatedFetch = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = localStorage.getItem('accessToken')
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  
  return fetch(url, {
    ...options,
    headers,
  })
}

// Convenience methods for common HTTP methods
export const apiClient = {
  get: (url: string, options?: RequestInit) => 
    authenticatedFetch(url, { ...options, method: 'GET' }),
  
  post: (url: string, data?: unknown, options?: RequestInit) =>
    authenticatedFetch(url, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),
  
  put: (url: string, data?: unknown, options?: RequestInit) =>
    authenticatedFetch(url, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),
  
  delete: (url: string, options?: RequestInit) =>
    authenticatedFetch(url, { ...options, method: 'DELETE' }),
}
