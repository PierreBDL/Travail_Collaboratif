import { useEffect, useState } from 'react'
import BackendStatus from '../components/BackendStatus'
import { checkWebsite } from '../services/api'
import sunImg from '../assets/soleil.png'
import moonImg from '../assets/lune.png'

import Card from '../components/Card'
import { useTheme } from '../hooks/Theme'
import { data, type websiteData } from '../data/WebsiteData'

export default function Home() {

    const [results, setResults] = useState<Record<string, { data?: websiteData; error?: string }>>({})
    const [loading, setLoading] = useState(true)
    const [attempt, setAttempt] = useState(0)

    useEffect(() => {
        let active = true
        const controllers = data.map(() => new AbortController())
        async function loadSites() {
            await Promise.all(data.map(async (site, index) => {
                const controller = controllers[index]
                const timeout = window.setTimeout(() => controller.abort(), 60000)
                try {
                    const result = await checkWebsite(site.link, controller.signal)
                    if (active) setResults(previous => ({ ...previous, [site.link]: { data: result } }))
                } catch (error) {
                    if (active) setResults(previous => ({ ...previous, [site.link]: { error: controller.signal.aborted
                        ? 'Le contrôle a dépassé le délai prévu.'
                        : error instanceof Error ? error.message : 'Connexion impossible.' } }))
                } finally { window.clearTimeout(timeout) }
            }))
            if (active) setLoading(false)
        }
        void loadSites()
        return () => { active = false; controllers.forEach(controller => controller.abort()) }
    }, [attempt])
    // Hook Theme
    const { theme, toggleTheme } = useTheme()

    return (
        <div className={`min-h-screen min-w-full antialiased ${theme === "dark" ? "bg-gray-800 text-slate-100" : "bg-[#F6F7FB] text-slate-800"}`}>
            <div className="min-h-screen max-w-full">
                <div className="mx-auto min-h-[calc(100vh-2rem)] w-full">
                    <div className={`flex min-h-[calc(100vh-2rem)] flex-col ${theme === "dark" ? "bg-[#080708] text-slate-100" : "bg-white text-slate-800"}`}>
                        <header className="mb-8 flex min-h-30 items-center justify-between bg-[#5865F2] px-6 py-4 shadow-sm sm:px-8">
                            <h1 className="flex justify-self-center place-self-center text-xl font-bold tracking-tight text-white sm:text-2xl">Uptime Monitor</h1>
                            <button onClick={toggleTheme} className="flex h-11 w-11 items-center justify-center right-5 rounded-xl border border-white/30 bg-white/10 transition hover:bg-white/20">
                                <img className="h-6 w-6" src={theme === "dark" ? sunImg : moonImg} alt="Changer de thème" />
                            </button>
                        </header>

                        <main className="flex-1 flex justify-center items-center flex-col p-7">
                            <div className={`mb-6 flex flex-col items-center justify-between gap-4 px-4 py-4 sm:flex-row sm:items-center sm:px-5 ${theme === "dark" ? "text-slate-200" : "text-slate-600"}`}>
                                <div className="flex flex-row justify-center flex-wrap gap-4">
                                    {
                                        data.map(website => (
                                            <div key={website.link} className="w-full max-w-300">
                                                {results[website.link]?.data ? (
                                                    <Card data={results[website.link].data!} />
                                                ) : (
                                                    <div className="rounded-[18px] border border-slate-400 p-4" role="status">
                                                        <h2 className="font-semibold">{website.name}</h2>
                                                        <p>{results[website.link]?.error || 'Vérification du site en cours…'}</p>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                            <button type="button" disabled={loading}
                                onClick={() => { setLoading(true); setResults({}); setAttempt(value => value + 1) }}
                                className="my-4 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
                                {loading ? 'Vérification en cours…' : 'Actualiser les sites'}
                            </button>
                        </main>

                        <footer className={`mt-8 flex items-center justify-between pt-5 text-xs ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>
                            <div className="w-full justify-center flex items-center gap-2">
                                <span className={theme === "dark" ? "font-semibold text-slate-200" : "font-semibold text-slate-700"}>Uptime Monitor</span>
                                <span className={theme === "dark" ? "text-slate-600" : "text-slate-400"}>•</span>
                                <span>Matthieu et Pierre</span>
                            </div>
                        </footer>
                    </div>
                </div>
            </div>
        </div>
    )
}
