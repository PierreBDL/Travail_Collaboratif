import type { websiteData } from '../data/WebsiteData'

function isWebsite(value: unknown): value is websiteData {
    if (typeof value !== 'object' || value === null) return false
    const item = value as Record<string, unknown>
    return (item.state === 'uptime' || item.state === 'down') &&
        typeof item.name === 'string' && typeof item.link === 'string' &&
        typeof item.responseTime === 'number' && Number.isFinite(item.responseTime) &&
        typeof item.disponibilityRate === 'number' && Number.isFinite(item.disponibilityRate) &&
        Array.isArray(item.lastdays) && item.lastdays.every(day =>
            typeof day === 'object' && day !== null && typeof day.date === 'string' &&
            (day.state === 'uptime' || day.state === 'down'))
}

export async function checkWebsite(website: string, signal: AbortSignal): Promise<websiteData> {
    const response = await fetch('/api/health', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ website }), signal,
    })
    const result: unknown = await response.json()
    if (!response.ok) {
        const message = typeof result === 'object' && result !== null && 'error' in result && typeof result.error === 'string'
            ? result.error : `Erreur HTTP ${response.status}.`
        throw new Error(message)
    }
    if (!isWebsite(result) || result.link !== website) throw new Error('La réponse du serveur est invalide.')
    return result
}
