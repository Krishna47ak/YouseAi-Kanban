import Navbar from "@/components/Navbar"

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <div className="bg-gradient-to-bl from-[#1e0f50] via-[#9e1dacb2] to-[#1e0f50]" >
            <Navbar />
            {children}
        </div>
    )
}
