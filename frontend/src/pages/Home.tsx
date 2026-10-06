import searchImg from '../assets/rechercher.png'
import sunImg from '../assets/soleil.png'
import moonImg from '../assets/lune.png'

import Card from '../components/Card'
import { useTheme } from '../hooks/Theme'

export default function Home() {

    // Hook Theme
    const { theme, toggleTheme } = useTheme()

    return (
        <div className={`min-h-screen min-w-full antialiased ${theme === "dark" ? "bg-slate-950 text-slate-100" : "bg-slate-100 text-slate-800"}`}>
            <div className="min-h-screen max-w-full p-4 sm:p-6 lg:p-8">
                <div className="mx-auto min-h-[calc(100vh-2rem)] w-full max-w-[1600px]">
                    <div className={`flex min-h-[calc(100vh-2rem)] flex-col rounded-3xl border p-5 shadow-xl sm:p-7 lg:p-8 ${theme === "dark" ? "border-slate-800 bg-slate-900 text-slate-100 shadow-black" : "border-slate-200 bg-white text-slate-800 shadow-slate-300/40"}`}>
                        <header className="mb-8 flex flex-col items-stretch justify-between gap-5 sm:flex-row sm:items-center">
                            <div className="flex items-center gap-4 sm:gap-5">
                                <h1 className={`text-sm font-black uppercase tracking-[0.16em] ${theme === "dark" ? "text-slate-100" : "text-slate-800"}`}>Uptime Monitor</h1>
                            </div>
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                <div className={`flex h-11 w-full items-center gap-3 rounded-xl border px-3.5 transition focus-within:ring-2 sm:w-70 lg:w-[320px] ${theme === "light" ? "border-slate-600 bg-slate-50 focus-within:border-blue-400 focus-within:ring-blue-500/15" : "border-slate-700 bg-slate-800 focus-within:border-blue-400 focus-within:ring-blue-400/15"}`}>
                                    <img src={searchImg} className="h-5 w-5" alt="Rechercher" />
                                    <input type="text" placeholder="Rechercher"
                                        className={`w-full border-0 bg-transparent text-sm ${theme === "light" ? "text-slate-700 placeholder:text-slate-400" : "text-slate-100 placeholder:text-slate-400"} focus:outline-none`} />
                                </div>
                                <button onClick={toggleTheme} className={`flex h-11 w-11 shrink-0 items-center justify-center self-end rounded-xl border shadow-sm transition hover:-translate-y-0.5 sm:self-auto ${theme === "dark" ? "border-slate-600 bg-slate-200 hover:bg-slate-50" : "border-slate-200 bg-slate-100 hover:bg-slate-200"}`}>
                                    <img className="h-6 w-6" src={theme === "dark" ? sunImg : moonImg} alt="Changer de thème" />
                                </button>
                                <button
                                    className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-500">
                                    ＋ Ajouter un site
                                </button>
                            </div>
                        </header>

                        <main className="flex-1">
                            <div className={`mb-6 flex flex-col items-start justify-between gap-4 px-4 py-4 sm:flex-row sm:items-center sm:px-5 ${theme === "dark" ? "text-slate-200" : "text-slate-600"}`}>
                                <div className="flex flex-row flex-wrap gap-4">
                                    <Card />
                                    <Card />
                                    <Card />
                                    <Card />
                                    <Card />
                                </div>
                            </div>
                        </main>

                        <footer className={`mt-8 flex items-center justify-between border-t pt-5 text-xs ${theme === "dark" ? "border-slate-800 text-slate-400" : "border-slate-200 text-slate-500"}`}>
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