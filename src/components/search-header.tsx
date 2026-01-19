"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Search, X, Package, FileText, BarChart3, LayoutDashboard, Building, DoorOpen } from "lucide-react"
import { Input } from "@/components/ui/input"
import { inventoryItems, floors, rooms } from "@/lib/inventory-data"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { MobileSidebar } from "@/components/sidebar"

interface SearchResult {
    type: "item" | "page" | "floor" | "room"
    title: string
    subtitle?: string
    href: string
    icon: React.ReactNode
}

const pages = [
    { title: "Dashboard", href: "/", icon: <LayoutDashboard className="h-4 w-4" /> },
    { title: "Items", href: "/items", icon: <Package className="h-4 w-4" /> },
    { title: "Floors", href: "/floors", icon: <Building className="h-4 w-4" /> },
    { title: "Rooms", href: "/rooms", icon: <DoorOpen className="h-4 w-4" /> },
    { title: "Reports", href: "/reports", icon: <FileText className="h-4 w-4" /> },
    { title: "Analytics", href: "/analytics", icon: <BarChart3 className="h-4 w-4" /> },
]

export function SearchHeader({ title = "School Inventory" }: { title?: string }) {
    const [query, setQuery] = useState("")
    const [isOpen, setIsOpen] = useState(false)
    const [results, setResults] = useState<SearchResult[]>([])
    const [selectedIndex, setSelectedIndex] = useState(0)
    const inputRef = useRef<HTMLInputElement>(null)
    const router = useRouter()

    useEffect(() => {
        if (query.length === 0) {
            setResults([])
            setIsOpen(false)
            return
        }

        const lowerQuery = query.toLowerCase()

        const itemResults: SearchResult[] = inventoryItems
            .filter(
                (item) =>
                    item.name.toLowerCase().includes(lowerQuery) ||
                    item.category.toLowerCase().includes(lowerQuery) ||
                    item.location.toLowerCase().includes(lowerQuery),
            )
            .slice(0, 5)
            .map((item) => ({
                type: "item",
                title: item.name,
                subtitle: `${item.category} • ${item.location}`,
                href: `/items?search=${encodeURIComponent(item.name)}`,
                icon: <Package className="h-4 w-4" />,
            }))

        const pageResults: SearchResult[] = pages
            .filter((page) => page.title.toLowerCase().includes(lowerQuery))
            .map((page) => ({
                type: "page",
                title: page.title,
                subtitle: "Page",
                href: page.href,
                icon: page.icon,
            }))

        const floorResults: SearchResult[] = floors
            .filter(
                (floor) =>
                    floor.name.toLowerCase().includes(lowerQuery) || floor.description.toLowerCase().includes(lowerQuery),
            )
            .slice(0, 3)
            .map((floor) => ({
                type: "floor",
                title: floor.name,
                subtitle: floor.description,
                href: `/floors/${floor.id}`,
                icon: <Building className="h-4 w-4" />,
            }))

        const roomResults: SearchResult[] = rooms
            .filter(
                (room) =>
                    room.name.toLowerCase().includes(lowerQuery) ||
                    room.type.toLowerCase().includes(lowerQuery) ||
                    room.description.toLowerCase().includes(lowerQuery),
            )
            .slice(0, 3)
            .map((room) => ({
                type: "room",
                title: room.name,
                subtitle: `${room.type} • ${floors.find((f) => f.id === room.floorId)?.name}`,
                href: `/rooms/${room.id}`,
                icon: <DoorOpen className="h-4 w-4" />,
            }))

        setResults([...pageResults, ...floorResults, ...roomResults, ...itemResults])
        setIsOpen(true)
        setSelectedIndex(0)
    }, [query])

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault()
                inputRef.current?.focus()
            }
        }
        document.addEventListener("keydown", handleKeyDown)
        return () => document.removeEventListener("keydown", handleKeyDown)
    }, [])

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowDown") {
            e.preventDefault()
            setSelectedIndex((i) => Math.min(i + 1, results.length - 1))
        } else if (e.key === "ArrowUp") {
            e.preventDefault()
            setSelectedIndex((i) => Math.max(i - 1, 0))
        } else if (e.key === "Enter" && results[selectedIndex]) {
            router.push(results[selectedIndex].href)
            setQuery("")
            setIsOpen(false)
        } else if (e.key === "Escape") {
            setIsOpen(false)
            setQuery("")
        }
    }

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-border bg-background/95 px-4 backdrop-blur supports-backdrop-filter:bg-background/60 md:px-6">
            <div className="flex items-center gap-3">
                <MobileSidebar />
                <h1 className="text-lg font-semibold text-foreground md:text-xl">{title}</h1>
            </div>

            <div className="relative w-full max-w-xs sm:max-w-sm md:w-80">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    ref={inputRef}
                    type="text"
                    placeholder="Search... (⌘K)"
                    value={query}
                    onChange={(e: { target: { value: React.SetStateAction<string> } }) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => query.length > 0 && setIsOpen(true)}
                    onBlur={() => setTimeout(() => setIsOpen(false), 200)}
                    className="h-9 bg-secondary pl-10 pr-10 text-sm md:h-10"
                />
                {query && (
                    <button
                        onClick={() => {
                            setQuery("")
                            setIsOpen(false)
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}

                {isOpen && results.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 w-full rounded-lg border border-border bg-popover p-2 shadow-lg md:left-auto md:right-0">
                        {results.map((result, index) => (
                            <Link
                                key={`${result.type}-${result.title}`}
                                href={result.href}
                                onClick={() => {
                                    setQuery("")
                                    setIsOpen(false)
                                }}
                                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${index === selectedIndex ? "bg-accent text-accent-foreground" : "text-foreground hover:bg-accent"
                                    }`}
                            >
                                <span className="text-muted-foreground">{result.icon}</span>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate font-medium">{result.title}</p>
                                    {result.subtitle && <p className="truncate text-xs text-muted-foreground">{result.subtitle}</p>}
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {isOpen && results.length === 0 && query.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 w-full rounded-lg border border-border bg-popover p-4 text-center text-sm text-muted-foreground shadow-lg">
                        No results found for "{query}"
                    </div>
                )}
            </div>
        </header>
    )
}
