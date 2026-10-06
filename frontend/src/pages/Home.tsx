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