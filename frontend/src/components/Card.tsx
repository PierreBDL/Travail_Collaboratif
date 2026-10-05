import settingImg from '../assets/parametres.png'
import { useTheme } from '../hooks/Theme'

export default function Card() {
    const { theme } = useTheme()

    return (
        <article className={`rounded-[18px] border p-3.5 max-w-130 ${theme === "dark" ? "border-slate-600 bg-slate-900" : "border-slate-400 bg-white"}`}>
            <div className="mb-3 flex items-start justify-around gap-3">
                <span className="inline-flex items-center rounded-md bg-emerald-500 px-2.5 py-1 text-[11px] font-bold uppercase text-white">Uptime</span>
                <h2 className={theme === "dark" ? "text-[14px] font-semibold text-slate-100" : "text-[14px] font-semibold text-slate-800"}>Broken Link Checker</h2>
            </div>

            <div className="space-y-1.5 pb-2">
                <p className={theme === "dark" ? "text-[12px] text-slate-300" : "text-[12px] text-slate-600"}>https://brokenlinkchecker.com</p>
            </div>

            <div className="mt-4">
                <div className="mb-2 flex items-center justify-between">
                    <p className={theme === "dark" ? "text-[11px] font-medium text-slate-300" : "text-[11px] font-medium text-slate-600"}>Historique</p>
                </div>
                <div className="flex items-center gap-1.5" aria-label="Disponibilité des 7 derniers jours">
                    <span className="h-2 flex-1 rounded-full bg-emerald-500" />
                    <span className="h-2 flex-1 rounded-full bg-emerald-500" />
                    <span className="h-2 flex-1 rounded-full bg-orange-400" />
                    <span className="h-2 flex-1 rounded-full bg-emerald-500" />
                    <span className="h-2 flex-1 rounded-full bg-red-500" />
                    <span className="h-2 flex-1 rounded-full bg-emerald-500" />
                    <span className="h-2 flex-1 rounded-full bg-emerald-500" />
                </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
                <div className={`rounded-xl border p-2 ${theme === "dark" ? "border-slate-600 bg-slate-900" : "border-slate-400 bg-white"}`}>
                    <p className={theme === "dark" ? "text-[11px] text-slate-300" : "text-[11px] text-slate-600"}>Temps de réponse</p>
                    <p className={theme === "dark" ? "mt-1 text-[12px] font-bold text-slate-100" : "mt-1 text-[12px] font-bold text-slate-800"}>120 ms</p>
                </div>
                <div className={`rounded-xl border p-2 ${theme === "dark" ? "border-slate-600 bg-slate-900" : "border-slate-400 bg-white"}`}>
                    <p className={theme === "dark" ? "text-[11px] text-slate-300" : "text-[11px] text-slate-600"}>Taux de disponibilité</p>
                    <p className={theme === "dark" ? "mt-1 text-[12px] font-bold text-slate-100" : "mt-1 text-[12px] font-bold text-slate-800"}>99.9%</p>
                </div>
            </div>
        </article>
    )
}