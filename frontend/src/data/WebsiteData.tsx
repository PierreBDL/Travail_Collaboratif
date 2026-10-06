interface daysDisponibility {
    date: string
    state: "uptime" | "down"
}

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
        disponibilityRate: 99.9,
        lastdays: [
            { date: "2026-09-30", state: "uptime" },
            { date: "2026-10-01", state: "uptime" },
            { date: "2026-10-02", state: "uptime" },
            { date: "2026-10-03", state: "uptime" },
            { date: "2026-10-04", state: "uptime" },
            { date: "2026-10-05", state: "uptime" },
            { date: "2026-10-06", state: "uptime" }
        ]
    },
    {
        state: "uptime",
        name: "YouTube",
        link: "https://www.youtube.com",
        responseTime: 180,
        disponibilityRate: 99.2,
        lastdays: [
            { date: "2026-09-30", state: "down" },
            { date: "2026-10-01", state: "uptime" },
            { date: "2026-10-02", state: "uptime" },
            { date: "2026-10-03", state: "uptime" },
            { date: "2026-10-04", state: "uptime" },
            { date: "2026-10-05", state: "uptime" },
            { date: "2026-10-06", state: "uptime" }
        ]
    },
    {
        state: "uptime",
        name: "Wikipedia",
        link: "https://www.wikipedia.org",
        responseTime: 240,
        disponibilityRate: 99.9,
        lastdays: [
            { date: "2026-09-30", state: "uptime" },
            { date: "2026-10-01", state: "uptime" },
            { date: "2026-10-02", state: "down" },
            { date: "2026-10-03", state: "uptime" },
            { date: "2026-10-04", state: "uptime" },
            { date: "2026-10-05", state: "uptime" },
            { date: "2026-10-06", state: "uptime" }
        ]
    },
    {
        state: "down",
        name: "GitHub",
        image: "https://icon.horse/icon/github.com",
        link: "https://github.com",
        responseTime: 1850,
        disponibilityRate: 97.2,
        lastdays: [
            { date: "2026-09-30", state: "uptime" },
            { date: "2026-10-01", state: "uptime" },
            { date: "2026-10-02", state: "uptime" },
            { date: "2026-10-03", state: "down" },
            { date: "2026-10-04", state: "uptime" },
            { date: "2026-10-05", state: "down" },
            { date: "2026-10-06", state: "down" }
        ]
    },
    {
        state: "uptime",
        name: "Amazon",
        link: "https://www.amazon.com",
        responseTime: 290,
        disponibilityRate: 98.9,
        lastdays: [
            { date: "2026-09-30", state: "uptime" },
            { date: "2026-10-01", state: "down" },
            { date: "2026-10-02", state: "uptime" },
            { date: "2026-10-03", state: "uptime" },
            { date: "2026-10-04", state: "uptime" },
            { date: "2026-10-05", state: "uptime" },
            { date: "2026-10-06", state: "uptime" }
        ]
    },
    {
        state: "uptime",
        name: "Microsoft",
        link: "https://www.microsoft.com",
        responseTime: 230,
        disponibilityRate: 99.9,
        lastdays: [
            { date: "2026-09-30", state: "uptime" },
            { date: "2026-10-01", state: "uptime" },
            { date: "2026-10-02", state: "uptime" },
            { date: "2026-10-03", state: "uptime" },
            { date: "2026-10-04", state: "uptime" },
            { date: "2026-10-05", state: "uptime" },
            { date: "2026-10-06", state: "uptime" }
        ]
    },
    {
        name: "Le Monde",
        link: "https://www.lemonde.fr",
        state: "down",
        responseTime: 2400,
        disponibilityRate: 96.4,
        lastdays: [
            { date: "2026-09-30", state: "uptime" },
            { date: "2026-10-01", state: "down" },
            { date: "2026-10-02", state: "uptime" },
            { date: "2026-10-03", state: "down" },
            { date: "2026-10-04", state: "uptime" },
            { date: "2026-10-05", state: "down" },
            { date: "2026-10-06", state: "down" }
        ]
    },
    {
        state: "uptime",
        name: "Service-Public.fr",
        link: "https://www.service-public.fr",
        responseTime: 270,
        disponibilityRate: 98.1,
        lastdays: [
            { date: "2026-09-30", state: "uptime" },
            { date: "2026-10-01", state: "down" },
            { date: "2026-10-02", state: "down" },
            { date: "2026-10-03", state: "uptime" },
            { date: "2026-10-04", state: "uptime" },
            { date: "2026-10-05", state: "down" },
            { date: "2026-10-06", state: "uptime" }
        ]
    },
    {
        state: "uptime",
        name: "La Poste",
        link: "https://www.laposte.fr",
        responseTime: 350,
        disponibilityRate: 94.7,
        lastdays: [
            { date: "2026-09-30", state: "down" },
            { date: "2026-10-01", state: "uptime" },
            { date: "2026-10-02", state: "down" },
            { date: "2026-10-03", state: "down" },
            { date: "2026-10-04", state: "uptime" },
            { date: "2026-10-05", state: "down" },
            { date: "2026-10-06", state: "uptime" }
        ]
    },
    {
        state: "uptime",
        name: "OpenClassrooms",
        link: "https://www.openclassrooms.com",
        responseTime: 320,
        disponibilityRate: 99.4,
        lastdays: [
            { date: "2026-09-30", state: "uptime" },
            { date: "2026-10-01", state: "uptime" },
            { date: "2026-10-02", state: "uptime" },
            { date: "2026-10-03", state: "uptime" },
            { date: "2026-10-04", state: "down" },
            { date: "2026-10-05", state: "uptime" },
            { date: "2026-10-06", state: "uptime" }
        ]
    }
]