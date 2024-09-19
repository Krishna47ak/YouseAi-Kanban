"use client"
import { Provider as DataProvider } from "./dataContext"

export default function ContextProvider({ children }) {
    return (
        <DataProvider>
            {children}
        </DataProvider>
    )
}