"use client"

import { useAuth } from "@/providers/auth-provider"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Settings, User, Bell, Shield, Key } from "lucide-react"
import { AnimatePresence } from "motion/react"
import { PageLoadingScreen } from "@/components/page-loading-screen"
import { FeaturePageLayout } from "@/components/feature-page-layout"

export default function PengaturanPage() {
    const [showLoading, setShowLoading] = useState(true)
    const { user, loading, isTeacher } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login")
        }

        if (!loading && !isTeacher) {
            router.push('/dashboard')
        }
    }, [user, loading, isTeacher, router])

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 bg-orange-600 border-t-transparent"></div>
            </div>
        )
    }

    if (!user || !isTeacher) {
        return null
    }

    return (
        <>
            <AnimatePresence mode="wait">
                {showLoading && (
                    <PageLoadingScreen
                        bgColor="bg-orange-600"
                        text="Memuat pengaturan"
                        icon={<Settings className="w-16 h-16" />}
                        onComplete={() => setShowLoading(false)}
                    />
                )}
            </AnimatePresence>

            <div className={showLoading ? "hidden" : ""}>
                <FeaturePageLayout title="Pengaturan" icon={<Settings size={50} />} backHref="/guru" bgColor="bg-orange-600">

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="space-y-6">

                            {/* Profile Settings */}
                            <div className="border border-gray-200 rounded-lg p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <User size={24} className="text-orange-600" />
                                    <h3 className="text-lg font-semibold">Profil Pengguna</h3>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            value={user.email || ''}
                                            disabled
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Nama Lengkap
                                        </label>
                                        <input
                                            type="text"
                                            value={user.user_metadata?.name || ''}
                                            disabled
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Role
                                        </label>
                                        <input
                                            type="text"
                                            value="Guru"
                                            disabled
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Notification Settings */}
                            <div className="border border-gray-200 rounded-lg p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <Bell size={24} className="text-blue-600" />
                                    <h3 className="text-lg font-semibold">Notifikasi</h3>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">Notifikasi Email</p>
                                            <p className="text-sm text-gray-600">Terima email saat ada aktivitas siswa baru</p>
                                        </div>
                                        <input
                                            type="checkbox"
                                            defaultChecked
                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">Laporan Mingguan</p>
                                            <p className="text-sm text-gray-600">Terima ringkasan aktivitas siswa setiap minggu</p>
                                        </div>
                                        <input
                                            type="checkbox"
                                            defaultChecked
                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Security Settings */}
                            <div className="border border-gray-200 rounded-lg p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <Shield size={24} className="text-green-600" />
                                    <h3 className="text-lg font-semibold">Keamanan</h3>
                                </div>
                                <div className="space-y-4">
                                    <button className="flex items-center gap-3 w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                                        <Key size={20} className="text-gray-600" />
                                        <div>
                                            <p className="font-medium">Ubah Kata Sandi</p>
                                            <p className="text-sm text-gray-600">Update kata sandi akun Anda</p>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            {/* System Settings */}
                            <div className="border border-gray-200 rounded-lg p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <Settings size={24} className="text-purple-600" />
                                    <h3 className="text-lg font-semibold">Sistem</h3>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">Mode Gelap</p>
                                            <p className="text-sm text-gray-600">Aktifkan tema gelap untuk antarmuka</p>
                                        </div>
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">Auto Refresh Data</p>
                                            <p className="text-sm text-gray-600">Perbarui data siswa secara otomatis</p>
                                        </div>
                                        <input
                                            type="checkbox"
                                            defaultChecked
                                            className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                                        />
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </FeaturePageLayout>
            </div>
        </>
    )
}