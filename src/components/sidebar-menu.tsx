"use client"

import { useEffect } from "react"
import { X } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { signOut } from "next-auth/react"
import Image from "next/image"

interface SidebarMenuProps {
    isOpen: boolean
    onClose: () => void
}

export function SidebarMenu({ isOpen, onClose }: SidebarMenuProps) {
    const router = useRouter()
    const pathname = usePathname()

    // Close sidebar when clicking outside on mobile
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768 && isOpen) {
                document.body.style.overflow = "hidden"
            } else {
                document.body.style.overflow = "auto"
            }
        }

        handleResize()
        window.addEventListener("resize", handleResize)

        return () => {
            document.body.style.overflow = "auto"
            window.removeEventListener("resize", handleResize)
        }
    }, [isOpen])

    const menuItems = [
        { name: "T.belajar", path: "/tujuan-belajar" },
        { name: "Materi", path: "/materi" },
        { name: "Game", path: "/game" },
        { name: "Kuis", path: "/kuis" },
        { name: "simulator", path: "/simulator" },
        { name: "Home", path: "/dashboard" },
        { name: "About", path: "/about" },
        { name: "Penilaian", path: "/penilaian" },
    ]

    const handleNavigation = (path: string) => {
        router.push(path)
        onClose()
    }

    const handleLogout = () => {
        signOut({ callbackUrl: "/login" })
        onClose()
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black z-40"
                        onClick={onClose}
                    />

                    {/* Sidebar */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "tween", duration: 0.3 }}
                        className="fixed top-0 right-0 h-full w-[280px] bg-blue-gradient z-50 flex flex-col text-white rounded-l-xl"
                    >
                        {/* Close button */}
                        <button onClick={onClose} className="absolute top-4 left-4 text-white">
                            <X size={28} />
                        </button>

                        {/* Logo and illustration */}
                        <div className="pt-10 pb-6 flex flex-col items-center">
                            <h1 className="text-4xl font-bold mb-4">LogiFun</h1>
                            <div className="rounded-xl w-40 h-full flex items-center justify-center">
                                <Image
                                    src="/images/decoration.svg"
                                    alt="LogiFun illustration"
                                    width={120}
                                    height={80}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="w-full h-px bg-white/20 my-2 mx-auto max-w-[90%]" />

                        {/* Navigation links */}
                        <div className="flex-1 flex flex-col items-center gap-2 px-4">
                            {menuItems.map((item, index) => (
                                <button
                                    key={`${item.name}-${index}`}
                                    onClick={() => handleNavigation(item.path)}
                                    className={`w-full py-2 px-4 rounded-lg text-center text-lg font-medium
                    ${pathname === item.path ? "bg-white text-[#0077a2]" : "text-white hover:bg-white/10"}`}
                                >
                                    {item.name}
                                </button>
                            ))}
                        </div>

                        {/* Divider */}
                        <div className="w-full h-px bg-white/20 my-4 mx-auto max-w-[90%]" />

                        {/* Logout button */}
                        <div className="p-4">
                            <button onClick={handleLogout} className="w-full py-3 bg-red-500 rounded-lg text-white font-medium">
                                Keluar
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
