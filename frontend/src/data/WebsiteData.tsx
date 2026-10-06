interface daysDisponibility {
    date: string
    state: "uptime" | "down"
}

const historyDates = [
    "2026-09-07", "2026-09-08", "2026-09-09", "2026-09-10", "2026-09-11",
    "2026-09-12", "2026-09-13", "2026-09-14", "2026-09-15", "2026-09-16",
    "2026-09-17", "2026-09-18", "2026-09-19", "2026-09-20", "2026-09-21",
    "2026-09-22", "2026-09-23", "2026-09-24", "2026-09-25", "2026-09-26",
    "2026-09-27", "2026-09-28", "2026-09-29", "2026-09-30", "2026-10-01",
    "2026-10-02", "2026-10-03", "2026-10-04", "2026-10-05", "2026-10-06"
]

const createHistory = (downDays: number[]): daysDisponibility[] =>
    historyDates.map((date, index) => ({
        date,
        state: downDays.includes(index) ? "down" : "uptime"
    }))

export interface websiteData {
    state: "uptime" | "down"
    image?: string
    name: string
    link: string
    responseTime: number
    disponibilityRate: number
    lastdays: daysDisponibility[]
}


export const data: websiteData[] = [
    {
        state: "uptime",
        name: "Google",
        link: "https://www.google.com",
        responseTime: 120,
        disponibilityRate: 100,
        lastdays: createHistory([])
    },
    {
        state: "uptime",
        name: "YouTube",
        link: "https://www.youtube.com",
        responseTime: 180,
        disponibilityRate: 96.7,
        lastdays: createHistory([23])
    },
    {
        state: "uptime",
        name: "Wikipedia",
        link: "https://www.wikipedia.org",
        responseTime: 240,
        disponibilityRate: 96.7,
        lastdays: createHistory([25])
    },
    {
        state: "down",
        name: "GitHub",
        image: "https://icon.horse/icon/github.com",
        link: "https://github.com",
        responseTime: 1850,
        disponibilityRate: 83.3,
        lastdays: createHistory([5, 14, 26, 28, 29])
    },
    {
        state: "uptime",
        name: "Amazon",
        link: "https://www.amazon.com",
        responseTime: 290,
        disponibilityRate: 96.7,
        lastdays: createHistory([24])
    },
    {
        state: "uptime",
        name: "Microsoft",
        link: "https://www.microsoft.com",
        responseTime: 230,
        disponibilityRate: 100,
        lastdays: createHistory([])
    },
    {
        name: "Le Monde",
        link: "https://www.lemonde.fr",
        state: "down",
        responseTime: 2400,
        disponibilityRate: 80,
        lastdays: createHistory([8, 18, 24, 26, 28, 29])
    },
    {
        state: "uptime",
        name: "Service-Public.fr",
        link: "https://www.service-public.fr",
        responseTime: 270,
        disponibilityRate: 90,
        lastdays: createHistory([2, 24, 25])
    },
    {
        state: "uptime",
        name: "La Poste",
        link: "https://www.laposte.fr",
        responseTime: 350,
        disponibilityRate: 80,
        lastdays: createHistory([3, 12, 20, 23, 25, 26])
    },
    {
        state: "uptime",
        name: "OpenClassrooms",
        link: "https://www.openclassrooms.com",
        responseTime: 320,
        disponibilityRate: 96.7,
        lastdays: createHistory([27])
    }
]