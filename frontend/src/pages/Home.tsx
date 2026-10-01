import searchImg from '../assets/rechercher.png'
import sunImg from '../assets/soleil.png'
import moonImg from '../assets/lune.png'

import Card from '../components/Card'
import { useTheme } from '../hooks/Theme'

export default function Home() {

    // Hook Theme
    const {theme, toggleTheme} = useTheme()

    return (
        <div className={`min-w-full h-screen ${theme === "dark" ? "bg-slate-950 text-slate-100" : "bg-white text-slate-800"} antialiased`}>
            <div className="max-w-full h-screen px-6 p-7">
                <div className="w-full h-full overflow-hidden">
                    <div className={`flex h-full flex-col rounded-[28px] border ${theme === "dark" ? "border-slate-700 bg-slate-800 text-slate-100" : "border-slate-200 bg-white"} p-5`}>
                        <header className="mb-5 flex items-center justify-between gap-4">
                            <div className="flex flex-row gap-5">
                                <h1 className={`text-[15px] font-black uppercase ${theme === "dark" ? "text-slate-200" : "text-slate-700"}`}>Uptime Monitor</h1>
                                <button onClick={toggleTheme}>
                                    <img className="h-6 w-6" src={theme === "dark" ? sunImg : moonImg} alt="Changer de thème" />
                                </button>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className={`flex h-12 w-[320px] items-center gap-3 rounded-xl border ${theme === "light" ? "border-slate-300 bg-white" : "border-slate-700 bg-slate-700"} px-3`}>
                                    <img src={searchImg} className="h-5 w-5" alt="Rechercher" />
                                    <input type="text" placeholder="Rechercher"
                                        className={`w-full border-0 bg-transparent text-sm ${theme === "light" ? "text-slate-700 placeholder:text-slate-400" : "text-slate-100 placeholder:text-slate-300"} focus:outline-none`} />
                                </div>
                                <button
                                    className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700">
                                    ＋ Add Website
                                </button>
                            </div>
                        </header>

                        <main className="flex-1">
                            <div className={`mb-5 flex items-center justify-between gap-4 pl-1 pr-2 ${theme === "dark" ? "text-slate-200" : "text-slate-600"}`}>
                                <button
                                    className={`gap-2 rounded-xl border px-3.5 py-2 text-sm font-medium ${theme === "dark" ? "border-slate-700 bg-slate-700 text-slate-100 hover:bg-slate-600" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-200"}`}>
                                    + Ajouter un site
                                </button>
                                <div className={`flex items-center gap-3 text-sm ${theme === "dark" ? "text-slate-300" : "text-slate-600"}`}>
                                    <span className={theme === "dark" ? "font-semibold text-slate-100" : "font-semibold text-slate-700"}>Global Status:</span>
                                    <span
                                        className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase ${theme === "dark" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300" : "border-emerald-200 bg-emerald-100 text-emerald-700"}`}>
                                        <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                                        All systems operational
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-wrap flex-row gap-4">
                                <Card />
                                <Card />
                                <Card />
                                <Card />
                                <Card />
                            </div>
                        </main>

                        <footer className={`mt-6 flex items-center justify-between border-t pt-4 text-sm ${theme === "dark" ? "border-slate-700 text-slate-300" : "border-slate-200 text-slate-500"}`}>
                            <div className="w-full justify-center flex items-center gap-2">
                                <span className={theme === "dark" ? "font-semibold text-slate-100" : "font-semibold text-slate-700"}>Uptime Monitor</span>
                                <span className={theme === "dark" ? "text-slate-400" : "text-slate-600"}>•</span>
                                <span>Matthieu et Pierre</span>
                            </div>
                        </footer>
                    </div>
                </div>
            </div>
        </div>
    )
}