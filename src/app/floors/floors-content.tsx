"use client"

import Link from "next/link"
import { Sidebar } from "@/components/sidebar"
import { SearchHeader } from "@/components/search-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { floors, rooms, inventoryItems } from "@/lib/inventory-data"
import { Building, DoorOpen, Package, ChevronRight, Layers } from "lucide-react"

function FloorCard({ floor }: { floor: (typeof floors)[0] }) {
    const floorRooms = rooms.filter((r) => r.floorId === floor.id)
    const floorItems = inventoryItems.filter((i) => i.floorId === floor.id)
    const totalValue = floorItems.reduce((sum, item) => sum + item.value, 0)
    const totalQuantity = floorItems.reduce((sum, item) => sum + item.quantity, 0)

    const categories = floorItems.reduce(
        (acc, item) => {
            acc[item.category] = (acc[item.category] || 0) + 1
            return acc
        },
        {} as Record<string, number>,
    )

    return (
        <Card className="group transition-all hover:shadow-lg hover:border-primary/50">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary sm:h-12 sm:w-12">
                            <Building className="h-5 w-5 sm:h-6 sm:w-6" />
                        </div>
                        <div className="min-w-0">
                            <CardTitle className="text-base sm:text-lg truncate">{floor.name}</CardTitle>
                            <CardDescription>Level {floor.level}</CardDescription>
                        </div>
                    </div>
                    <Badge variant="secondary" className="text-xs shrink-0">
                        {floorRooms.length} Rooms
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">{floor.description}</p>

                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    <div className="rounded-lg bg-muted/50 p-2 text-center sm:p-3">
                        <DoorOpen className="mx-auto h-4 w-4 text-muted-foreground mb-1" />
                        <p className="text-base font-semibold sm:text-lg">{floorRooms.length}</p>
                        <p className="text-xs text-muted-foreground">Rooms</p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-2 text-center sm:p-3">
                        <Package className="mx-auto h-4 w-4 text-muted-foreground mb-1" />
                        <p className="text-base font-semibold sm:text-lg">{totalQuantity}</p>
                        <p className="text-xs text-muted-foreground">Items</p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-2 text-center sm:p-3">
                        <Layers className="mx-auto h-4 w-4 text-muted-foreground mb-1" />
                        <p className="text-base font-semibold sm:text-lg">{Object.keys(categories).length}</p>
                        <p className="text-xs text-muted-foreground">Categories</p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-1">
                    {Object.keys(categories)
                        .slice(0, 3)
                        .map((cat) => (
                            <Badge key={cat} variant="outline" className="text-xs">
                                {cat}
                            </Badge>
                        ))}
                    {Object.keys(categories).length > 3 && (
                        <Badge variant="outline" className="text-xs">
                            +{Object.keys(categories).length - 3} more
                        </Badge>
                    )}
                </div>

                <div className="flex flex-col gap-2 pt-2 border-t sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-sm">
                        <span className="text-muted-foreground">Total Value: </span>
                        <span className="font-semibold">${totalValue.toLocaleString()}</span>
                    </div>
                    <Link href={`/floors/${floor.id}`}>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="w-full sm:w-auto group-hover:bg-primary group-hover:text-primary-foreground"
                        >
                            View Rooms
                            <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    )
}

export function FloorsContent() {
    const totalRooms = rooms.length
    const totalItems = inventoryItems.length
    const totalValue = inventoryItems.reduce((sum, item) => sum + item.value, 0)

    return (
        <div className="min-h-screen bg-background">
            <Sidebar />
            <div className="lg:ml-64">
                <SearchHeader title="Floor Management" />

                <main className="p-4 md:p-6">
                    <div className="mb-6">
                        <h1 className="text-xl font-bold text-foreground sm:text-2xl">Floor Management</h1>
                        <p className="text-sm text-muted-foreground sm:text-base">View and manage inventory by building floors</p>
                    </div>

                    <div className="grid gap-3 grid-cols-2 md:grid-cols-4 md:gap-4 mb-6">
                        <Card>
                            <CardContent className="pt-4 sm:pt-6">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 sm:h-10 sm:w-10">
                                        <Building className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
                                    </div>
                                    <div>
                                        <p className="text-xl font-bold sm:text-2xl">{floors.length}</p>
                                        <p className="text-xs text-muted-foreground sm:text-sm">Total Floors</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-4 sm:pt-6">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 sm:h-10 sm:w-10">
                                        <DoorOpen className="h-4 w-4 text-blue-500 sm:h-5 sm:w-5" />
                                    </div>
                                    <div>
                                        <p className="text-xl font-bold sm:text-2xl">{totalRooms}</p>
                                        <p className="text-xs text-muted-foreground sm:text-sm">Total Rooms</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-4 sm:pt-6">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 sm:h-10 sm:w-10">
                                        <Package className="h-4 w-4 text-amber-500 sm:h-5 sm:w-5" />
                                    </div>
                                    <div>
                                        <p className="text-xl font-bold sm:text-2xl">{totalItems}</p>
                                        <p className="text-xs text-muted-foreground sm:text-sm">Total Items</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-4 sm:pt-6">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 sm:h-10 sm:w-10">
                                        <span className="text-emerald-500 font-bold text-sm sm:text-base">$</span>
                                    </div>
                                    <div>
                                        <p className="text-xl font-bold sm:text-2xl">${(totalValue / 1000).toFixed(0)}K</p>
                                        <p className="text-xs text-muted-foreground sm:text-sm">Total Value</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 md:gap-6">
                        {floors.map((floor) => (
                            <FloorCard key={floor.id} floor={floor} />
                        ))}
                    </div>
                </main>
            </div>
        </div>
    )
}
