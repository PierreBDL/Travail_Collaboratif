import settingImg from '../assets/parametres.png'

export default function Card() {
    return (
        <article className="rounded-[18px] border border-slate-300 bg-white p-3.5 max-w-130">
            <div className="mb-3 flex items-start justify-between gap-3">
                <span
                    className="inline-flex items-center rounded-md bg-emerald-500 px-2.5 py-1 text-[11px] font-bold uppercase text-white">Uptime</span>
                <button
                    className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-slate-500">
                    <img className="h-5 w-5" src={settingImg} alt="Editer"/>
                </button>
            </div>

            <div className="space-y-1.5 pb-2">
                <h2 className="text-[14px] font-semibold text-slate-800">Broken Link Checker</h2>
                <p className="text-[12px] text-slate-500">https://brokenlinkchecker.com</p>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="rounded-xl border border-slate-300 bg-white p-2">
                    <p className="text-[11px] text-slate-500">Temps de réponse</p>
                    <p className="mt-1 text-[12px] font-bold text-slate-800">120 ms</p>
                </div>
                <div className="rounded-xl border border-slate-300 bg-white p-2">
                    <p className="text-[11px] text-slate-500">Taux de disponibilité</p>
                    <p className="mt-1 text-[12px] font-bold text-slate-800">99.9%</p>
                </div>
            </div>

            <div className="mt-3 flex justify-end">
                <button
                    className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[11px] font-medium text-slate-600">Détails</button>
            </div>
        </article>
    )
}