const configuredBase = import.meta.env.VITE_API_BASE_URL || '/api'

export const API_BASE_URL = configuredBase.replace(/\/$/, '')
