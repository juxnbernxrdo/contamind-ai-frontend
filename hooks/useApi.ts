'use client'
import { useTenantStore } from '@/store/tenantStore'
import { fetchFromBackendClient } from '@/lib/api-client'

export function useApi() {
  const activeCompanyId = useTenantStore((state) => state.activeCompanyId)

  const get = async (endpoint: string) => {
    if (!activeCompanyId) throw new Error('No active company selected')
    return fetchFromBackendClient(endpoint, activeCompanyId)
  }

  const post = async (endpoint: string, body: unknown) => {
    if (!activeCompanyId) throw new Error('No active company selected')
    return fetchFromBackendClient(endpoint, activeCompanyId, {
      method: 'POST',
      body: JSON.stringify(body),
    })
  }

  const put = async (endpoint: string, body: unknown) => {
    if (!activeCompanyId) throw new Error('No active company selected')
    return fetchFromBackendClient(endpoint, activeCompanyId, {
      method: 'PUT',
      body: JSON.stringify(body),
    })
  }

  const del = async (endpoint: string) => {
    if (!activeCompanyId) throw new Error('No active company selected')
    return fetchFromBackendClient(endpoint, activeCompanyId, {
      method: 'DELETE',
    })
  }

  return { get, post, put, del, activeCompanyId }
}
