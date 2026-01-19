"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    Package,
    FileText,
    BarChart3,
    GraduationCap,
    Settings,
    LogOut,
    Building,
    DoorOpen,
    Menu,
} from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import vst_logo from "../../public/assets/vst_logo/Logo VST -03 no ba.png"

const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Items", href: "/items", icon: Package },
    { name: "Floors", href: "/floors", icon: Building },
    { name: "Rooms", href: "/rooms", icon: DoorOpen },
    { name: "Reports", href: "/reports", icon: FileText },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
]

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
    const pathname = usePathname()

    return (
        <div className="flex h-full flex-col">
            <div className="flex h-16 items-center gap-3 border-b border-border px-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg">
                    <Image src={vst_logo} alt="VST Logo" />
                </div>
                <div>
                    <h1 className="text-md font-semibold text-foreground">VST Inventory</h1>
                    <p className="text-sm text-muted-foreground">Management System</p>
                </div>
            </div>

            <nav className="flex-1 space-y-1 px-3 py-4">
                {navigation.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            onClick={onNavigate}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-sidebar-accent text-primary"
                                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
                            )}
                        >
                            <item.icon className="h-5 w-5" />
                            {item.name}
                        </Link>
                    )
                })}
            </nav>

            <div className="border-t border-border p-3">
                <div className="mb-2 flex items-center justify-between px-3 py-2">
                    <span className="text-sm text-muted-foreground">Theme</span>
                    <ThemeToggle />
                </div>
                <Link
                    href="#"
                    onClick={onNavigate}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground"
                >
                    <Settings className="h-5 w-5" />
                    Settings
                </Link>
                <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground">
                    <LogOut className="h-5 w-5" />
                    Log out
                </button>
            </div>
        </div>
    )
}

export function MobileSidebar() {
    const [open, setOpen] = useState(false)
    const pathname = usePathname()

    // Close sidebar when route changes
    useEffect(() => {
        setOpen(false)
    }, [pathname])

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0 bg-sidebar">
                <SidebarContent onNavigate={() => setOpen(false)} />
            </SheetContent>
        </Sheet>
    )
}

export function Sidebar() {
    return (
        <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-border bg-sidebar lg:block">
            <SidebarContent />
        </aside>
    )
}
