import React, {createContext, useContext, useState} from 'react'

type themeValuesPossible = "light" | "dark"

interface themeValues {
    theme: themeValuesPossible
    toggleTheme: () => void
}

const themeContext = createContext<themeValues | undefined>(undefined)

export function ThemeProvider ({children}: {children: React.ReactNode}) {
    const [theme, setTheme] = useState<themeValuesPossible>("dark")

    function toggleTheme () {
        setTheme(theme === "dark" ? "light" : "dark")
    }

    return (
        <themeContext.Provider value={{theme, toggleTheme}}>
            {children}
        </themeContext.Provider>
    )
}

export function useTheme () {
    const ctx = useContext(themeContext)

    if (!ctx) {
        throw new Error ("Pas de provider theme")
    }

    return ctx
}