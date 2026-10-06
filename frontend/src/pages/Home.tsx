import searchImg from '../assets/rechercher.png'
import sunImg from '../assets/soleil.png'
import moonImg from '../assets/lune.png'

import Card from '../components/Card'
import { useTheme } from '../hooks/Theme'
import { data } from '../data/WebsiteData'

export default function Home() {

    // Hook Theme
    const { theme, toggleTheme } = useTheme()

    return (
        <div className={`min-h-screen min-w-full antialiased ${theme === "dark" ? "text-slate-100" : "text-slate-800"}`}>
            <div className="min-h-screen max-w-full">
                <div className="mx-auto min-h-[calc(100vh-2rem)] w-full">
                    <div className={`flex min-h-[calc(100vh-2rem)] flex-col rounded-3xl ${theme === "dark" ? "bg-slate-900 text-slate-100" : "bg-white text-slate-800"}`}>
                        <header className="relative mb-8 gap-5 bg-[#5865F2] h-[10%]">
                            <div className="absolute w-full h-50 flex items-center justify-center gap-4 sm:gap-5">
                                <h1 className={`text-sm font-black uppercase tracking-[0.16em] ${theme === "dark" ? "text-slate-100" : "text-slate-800"}`}>Uptime Monitor</h1>
                            </div>
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                <button onClick={toggleTheme} className={`flex h-11 w-11 shrink-0 items-center justify-center self-end rounded-xl border transition hover:-translate-y-0.5 sm:self-auto ${theme === "dark" ? "border-slate-600 bg-slate-200 hover:bg-slate-50" : "border-slate-200 bg-slate-100 hover:bg-slate-200"}`}>
                                    <img className="h-6 w-6" src={theme === "dark" ? sunImg : moonImg} alt="Changer de thème" />
                                </button>
                            </div>
                        </header>

                        <main className="flex-1 p-7">
                            <div className={`mb-6 flex flex-col items-start justify-between gap-4 px-4 py-4 sm:flex-row sm:items-center sm:px-5 ${theme === "dark" ? "text-slate-200" : "text-slate-600"}`}>
                                <div className="flex flex-row flex-wrap gap-4">
                                    {
                                        data.map(website => (
                                            <Card data={website}></Card>
                                        ))
                                    }
                                </div>
                            </div>
                            <button
                                className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-blue-500">
                                ＋ Ajouter un site
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