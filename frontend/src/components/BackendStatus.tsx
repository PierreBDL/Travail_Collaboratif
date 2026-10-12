import { useEffect, useState } from 'react'

type Connection =
    | { state: 'loading' }
    | { state: 'success'; status: string }
    | { state: 'error'; message: string }

export default function BackendStatus() {
    const [connection, setConnection] = useState<Connection>({ state: 'loading' })
    const [attempt, setAttempt] = useState(0)

    useEffect(() => {
        const controller = new AbortController()
        const timeout = window.setTimeout(() => controller.abort(), 10000)
        let active = true
        async function checkConnection() {
            try {
                const response = await fetch('/api/health', { signal: controller.signal })
                if (!response.ok) throw new Error(`Le serveur a répondu avec le code HTTP ${response.status}.`)
                const result: unknown = await response.json()
                if (typeof result !== 'object' || result === null || !('status' in result) || typeof result.status !== 'string') {
                    throw new Error('La réponse du serveur est invalide.')
                }
                if (active) setConnection({ state: 'success', status: result.status })
            } catch (error) {
                if (active) setConnection({ state: 'error', message: controller.signal.aborted
                    ? 'Le serveur ne répond pas dans le délai prévu.'
                    : error instanceof Error ? error.message : 'Connexion impossible.' })
            } finally { window.clearTimeout(timeout) }
        }
        void checkConnection()
        return () => { active = false; controller.abort(); window.clearTimeout(timeout) }
    }, [attempt])

    return (
        <section className="mb-6 w-full max-w-3xl rounded-xl border border-slate-400 p-4" aria-label="Connexion au serveur">
            <div role="status" aria-live="polite">
                {connection.state === 'loading' && <p>Connexion au serveur en cours…</p>}
                {connection.state === 'success' && <p>Réponse du serveur : <strong>{connection.status}</strong></p>}
                {connection.state === 'error' && <p>Impossible de joindre le serveur. {connection.message} Vérifiez que le back est démarré.</p>}
            </div>
            <button type="button" disabled={connection.state === 'loading'}
                onClick={() => { setConnection({ state: 'loading' }); setAttempt(value => value + 1) }}
                className="mt-3 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
                {connection.state === 'error' ? 'Réessayer' : 'Actualiser'}
            </button>
        </section>
    )
}
