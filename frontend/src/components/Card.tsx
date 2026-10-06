import settingImg from '../assets/parametres.png'
import { useTheme } from '../hooks/Theme'
import { type websiteData } from '../data/WebsiteData'

export default function Card({data}: {data: websiteData}) {
    const { theme } = useTheme()

    return (
        <article className={`rounded-[18px] border p-3.5 max-w-130 ${theme === "dark" ? "border-slate-600 bg-slate-900" : "border-slate-400 bg-white"}`}>
            <div className="mb-3 flex items-start justify-around gap-3">
                <span className={`inline-flex items-center rounded-md ${data.state === "uptime" ? "bg-emerald-500" : "bg-red-500"} px-2.5 py-1 text-[11px] font-bold uppercase text-white`}>{data.state}</span>
                <div className={`flex justify-center gap-3`}>
                    <img className="w-5 h-5" src={data?.image ? data.image : `https://icon.horse/icon/${data.link.split("www.")[1]}`} alt="" />
                    <h2 className={theme === "dark" ? "text-[14px] font-semibold text-slate-100" : "text-[14px] font-semibold text-slate-800"}>{data.name}</h2>
                </div>
            </div>

            <div className="space-y-1.5 pb-2">
                <p className={theme === "dark" ? "text-[12px] text-slate-300" : "text-[12px] text-slate-600"}>{data.link}</p>
            </div>

            <div className="mt-4">
                <div className="mb-2 flex items-center justify-between">
                    <p className={theme === "dark" ? "text-[11px] font-medium text-slate-300" : "text-[11px] font-medium text-slate-600"}>Historique</p>
                </div>
                <div className="flex items-center gap-1.5">
                    {
                        data.lastdays.map(day => (
                            <span className={`h-1 flex-1 rounded-full ${day.state === "uptime" ? "bg-emerald-500" : "bg-red-500"}`} />
                        ))
                    }
                </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
                <div className={`rounded-xl border p-2 ${theme === "dark" ? "border-slate-600 bg-slate-900" : "border-slate-400 bg-white"}`}>
                    <p className={theme === "dark" ? "text-[11px] text-slate-300" : "text-[11px] text-slate-600"}>Temps de réponse</p>
                    <p className={theme === "dark" ? "mt-1 text-[12px] font-bold text-slate-100" : "mt-1 text-[12px] font-bold text-slate-800"}>{data.responseTime} ms</p>
                </div>
                <div className={`rounded-xl border p-2 ${theme === "dark" ? "border-slate-600 bg-slate-900" : "border-slate-400 bg-white"}`}>
                    <p className={theme === "dark" ? "text-[11px] text-slate-300" : "text-[11px] text-slate-600"}>Taux de disponibilité</p>
                    <p className={theme === "dark" ? "mt-1 text-[12px] font-bold text-slate-100" : "mt-1 text-[12px] font-bold text-slate-800"}>{data.disponibilityRate}%</p>
                </div>
            </div>
        </article>
    )
}