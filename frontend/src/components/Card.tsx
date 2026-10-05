import settingImg from '../assets/parametres.png'
import { useTheme } from '../hooks/Theme'

export default function Card() {
    const { theme } = useTheme()

    return (
        <article className={`rounded-[18px] border p-3.5 max-w-130 ${theme === "dark" ? "border-slate-700 bg-slate-800" : "border-slate-300 bg-white"}`}>
            <div className="mb-3 flex items-start justify-between gap-3">
                <span
                    className="inline-flex items-center rounded-md bg-emerald-500 px-2.5 py-1 text-[11px] font-bold uppercase text-white">Uptime</span>
                <button
                    className={`flex h-7 w-7 items-center justify-center rounded-md ${theme === "dark" ? "bg-slate-700 text-slate-200" : "bg-white text-slate-500"}`}>
                    <img className="h-5 w-5" src={settingImg} alt="Editer"/>
                </button>
            </div>

            <div className="space-y-1.5 pb-2">
                <h2 className={theme === "dark" ? "text-[14px] font-semibold text-slate-100" : "text-[14px] font-semibold text-slate-800"}>Broken Link Checker</h2>
                <p className={theme === "dark" ? "text-[12px] text-slate-300" : "text-[12px] text-slate-500"}>https://brokenlinkchecker.com</p>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
                <div className={`rounded-xl border p-2 ${theme === "dark" ? "border-slate-700 bg-slate-900" : "border-slate-300 bg-white"}`}>
                    <p className={theme === "dark" ? "text-[11px] text-slate-300" : "text-[11px] text-slate-500"}>Temps de réponse</p>
                    <p className={theme === "dark" ? "mt-1 text-[12px] font-bold text-slate-100" : "mt-1 text-[12px] font-bold text-slate-800"}>120 ms</p>
                </div>
                <div className={`rounded-xl border p-2 ${theme === "dark" ? "border-slate-700 bg-slate-900" : "border-slate-300 bg-white"}`}>
                    <p className={theme === "dark" ? "text-[11px] text-slate-300" : "text-[11px] text-slate-500"}>Taux de disponibilité</p>
                    <p className={theme === "dark" ? "mt-1 text-[12px] font-bold text-slate-100" : "mt-1 text-[12px] font-bold text-slate-800"}>99.9%</p>
                </div>
            </div>

            <div className="mt-3 flex justify-end">
                <button
                    className={`rounded-lg border px-3 py-1.5 text-[11px] font-medium ${theme === "dark" ? "border-slate-700 bg-slate-900 text-slate-200" : "border-slate-300 bg-white text-slate-600"}`}>Détails</button>
            </div>
        </article>
    )
}