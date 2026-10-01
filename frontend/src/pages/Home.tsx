import searchImg from '../assets/rechercher.png'
import Card from '../components/Card'

export default function Home() {
    return (
        <div className="min-w-full h-screen bg-white text-slate-800 antialiased">
            <div className="max-w-full h-screen px-6 pt-7">
                <div className="w-full h-full overflow-hidden">
                    <div className="flex h-full flex-col rounded-[28px] border border-slate-200 bg-white p-5">
                        <header className="mb-5 flex items-center justify-between gap-4">
                            <h1 className="text-[15px] font-black uppercase text-slate-700">Uptime Monitor</h1>
                            <div className="flex items-center gap-3">
                                <div className="flex h-12 w-[320px] items-center gap-3 rounded-xl border border-slate-300 bg-white px-3">
                                    <img src={searchImg} className="h-5 w-5" alt="Rechercher" />
                                    <input type="text" placeholder="Rechercher"
                                        className="w-full border-0 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none" />
                                </div>
                                <button
                                    className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700">
                                    ＋ Add Website
                                </button>
                            </div>
                        </header>

                        <main className="flex-1">
                            <div className="mb-5 flex items-center justify-between gap-4 pl-1 pr-2">
                                <button
                                    className="gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200">
                                    + Ajouter un site
                                </button>
                                <div className="flex items-center gap-3 text-sm text-slate-600">
                                    <span className="font-semibold text-slate-700">Global Status:</span>
                                    <span
                                        className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold uppercase text-emerald-700">
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

                        <footer className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4 text-sm text-slate-500">
                            <div className="w-full justify-center flex items-center gap-2">
                                <span className="font-semibold text-slate-700">Uptime Monitor</span>
                                <span className="text-slate-600">•</span>
                                <span>Matthieu et Pierre</span>
                            </div>
                        </footer>
                    </div>
                </div>
            </div>
        </div>
    )
}