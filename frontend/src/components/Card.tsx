import ouvrirImg from '../assets/navigateur-ouvert.png'
import { useTheme } from '../hooks/Theme'
import { type websiteData } from '../data/WebsiteData'

export default function Card({ data }: { data: websiteData }) {
    const { theme } = useTheme()

    return (
        <article className={`rounded-[18px] border p-3.5 w-full max-w-300 ${theme === "dark" ? "border-slate-600 bg-[#18191C]" : "border-slate-400 bg-white"}`}>
            <div className="mb-3 flex items-start justify-between gap-3">
                <div className={`flex justify-center gap-3`}>
                    <img className="w-5 h-5" src={data?.image ? data.image : `https://icon.horse/icon/${data.link.split("www.")[1]}`} alt="" />
                    <h2 className={theme === "dark" ? "text-[16px] font-semibold text-slate-100" : "text-[14px] font-semibold text-slate-800"}>{data.name}</h2>
                </div>
                <span className={`inline-flex items-center rounded-md ${data.state === "uptime" ? "bg-emerald-500" : "bg-red-500"} px-2.5 py-1 text-[11px] font-bold uppercase text-white`}>{data.state}</span>
            </div>

            {/*<div className="flex flex-col gap-1 justify-start pb-1">
                <a href={data.link} target="_blank">
                    <button
                        className="rounded-xl bg-blue-600 px-4 py-1 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-blue-500">
                        <img className={`w-4 h-4`} src={ouvrirImg} alt="" />
                    </button>
                </a>
            </div>*/}

            <div className="mt-4">
                <div className="mb-2 flex items-center justify-between">
                    <p className={theme === "dark" ? "text-[13px] font-medium text-slate-300" : "text-[13px] font-medium text-slate-600"}>Historique</p>
                </div>
                <div className="flex items-center gap-1.5">
                    {
                        data.lastdays.map(day => (
                            <span className={`h-1.5 flex-1 rounded-full ${day.state === "uptime" ? "bg-emerald-500" : "bg-red-500"}`} />
                        ))
                    }
                </div>
                <div className={`flex flex-row justify-between gap-1 my-6`}>
                    <div>
                        {data.lastdays.length} days ago
                    </div>
                    <div className={`w-full h-1 ${theme === "dark" ? "bg-slate-300" : "bg-slate-400"} px-3 max-w-[35%] flex place-self-center items-center justify-center`}></div>
                    <div>
                        <p className={theme === "dark" ? "mt-1 text-[13px] font-bold text-slate-100" : "mt-1 text-[12px] font-bold text-slate-800"}>{data.disponibilityRate}% Uptime</p>
                    </div>
                    <div className={`w-full h-1 ${theme === "dark" ? "bg-slate-300" : "bg-slate-400"} max-w-[35%] px-3 flex place-self-center justify-center`}></div>
                    <div>
                        Today
                    </div>
                </div>
            </div>

            {/*
                <div className="mt-3 flex justify-center gap-2">
                    <div className={`rounded-xl max-w-40 justify-center flex gap-2 flex-row border p-2 ${theme === "dark" ? "border-slate-600 bg-slate-900" : "border-slate-400 bg-white"}`}>
                        <p className={theme === "dark" ? "text-[11px] text-slate-300" : "text-[11px] text-slate-600"}>Temps de réponse</p>
                        <p className={theme === "dark" ? "text-[12px] font-bold text-slate-100" : "mt-1 text-[12px] font-bold text-slate-800"}>{data.responseTime} ms</p>
                    </div>
                </div>*/
            }
        </article>
    )
}