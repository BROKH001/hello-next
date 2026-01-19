"use client"

import { use } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { SearchHeader } from "@/components/search-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { floors, rooms, inventoryItems } from "@/lib/inventory-data"
import { ArrowLeft, DoorOpen, Package, Users, ChevronRight } from "lucide-react"

function RoomCard({ room }: { room: (typeof rooms)[0] }) {
    const roomItems = inventoryItems.filter((i) => i.roomId === room.id)
    const totalValue = roomItems.reduce((sum, item) => sum + item.value, 0)
    const totalQuantity = roomItems.reduce((sum, item) => sum + item.quantity, 0)

    const statusCounts = roomItems.reduce(
        (acc, item) => {
            acc[item.status] = (acc[item.status] || 0) + 1
            return acc
        },
        {} as Record<string, number>,
    )

    return (
        <Card className="group transition-all hover:shadow-lg hover:border-primary/50">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary sm:h-10 sm:w-10">
                            <DoorOpen className="h-4 w-4 sm:h-5 sm:w-5" />
                        </div>
                        <div className="min-w-0">
                            <CardTitle className="text-sm sm:text-base truncate">{room.name}</CardTitle>
                            <CardDescription className="text-xs">{room.type}</CardDescription>
                        </div>
                    </div>
                    {room.capacity > 0 && (
                        <Badge variant="outline" className="text-xs shrink-0">
                            <Users className="mr-1 h-3 w-3" />
                            {room.capacity}
                        </Badge>
                    )}
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                <p className="text-xs text-muted-foreground line-clamp-2 sm:text-sm">{room.description}</p>

                <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-lg bg-muted/50 p-2 text-center">
                        <p className="text-base font-semibold sm:text-lg">{roomItems.length}</p>
                        <p className="text-xs text-muted-foreground">Item Types</p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-2 text-center">
                        <p className="text-base font-semibold sm:text-lg">{totalQuantity}</p>
                        <p className="text-xs text-muted-foreground">Total Qty</p>
                    </div>
                </div>

                {Object.keys(statusCounts).length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {statusCounts["available"] && (
                            <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 text-xs">
                                {statusCounts["available"]} OK
                            </Badge>
                        )}
                        {statusCounts["low-stock"] && (
                            <Badge className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 text-xs">
                                {statusCounts["low-stock"]} Low
                            </Badge>
                        )}
                        {statusCounts["out-of-stock"] && (
                            <Badge className="bg-red-500/10 text-red-600 hover:bg-red-500/20 text-xs">
                                {statusCounts["out-of-stock"]} Out
                            </Badge>
                        )}
                    </div>
                )}

                <div className="flex flex-col gap-2 pt-2 border-t sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-sm">
                        <span className="text-muted-foreground">Value: </span>
                        <span className="font-semibold">${totalValue.toLocaleString()}</span>
                    </div>
                    <Link href={`/rooms/${room.id}`}>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="w-full sm:w-auto group-hover:bg-primary group-hover:text-primary-foreground"
                        >
                            Details
                            <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    )
}

export function FloorDetailContent({ params }: { params: Promise<{ floorId: string }> }) {
    const { floorId } = use(params)
    const router = useRouter()
    const floor = floors.find((f) => f.id === floorId)
    const floorRooms = rooms.filter((r) => r.floorId === floorId)
    const floorItems = inventoryItems.filter((i) => i.floorId === floorId)

    if (!floor) {
        return (
            <div className="min-h-screen bg-background">
                <Sidebar />
                <div className="lg:ml-64 flex items-center justify-center h-screen">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold mb-2">Floor Not Found</h1>
                        <Button onClick={() => router.push("/floors")}>Back to Floors</Button>
                    </div>
                </div>
            </div>
        )
    }

    const totalValue = floorItems.reduce((sum, item) => sum + item.value, 0)
    const totalQuantity = floorItems.reduce((sum, item) => sum + item.quantity, 0)

    const roomTypes = floorRooms.reduce(
        (acc, room) => {
            acc[room.type] = (acc[room.type] || 0) + 1
            return acc
        },
        {} as Record<string, number>,
    )

    return (
        <div className="min-h-screen bg-background">
            <Sidebar />
            <div className="lg:ml-64">
                <SearchHeader title={floor.name} />

                <main className="p-4 md:p-6">
                    <div className="mb-6">
                        <Button variant="ghost" size="sm" onClick={() => router.push("/floors")} className="mb-4">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Floors
                        </Button>
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h1 className="text-xl font-bold text-foreground sm:text-2xl">{floor.name}</h1>
                                <p className="text-sm text-muted-foreground">{floor.description}</p>
                            </div>
                            <Badge variant="secondary" className="w-fit text-sm">
                                Level {floor.level}
                            </Badge>
                        </div>
                    </div>

                    <div className="grid gap-3 grid-cols-2 md:grid-cols-4 md:gap-4 mb-6">
                        <Card>
                            <CardContent className="pt-4 sm:pt-6">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 sm:h-10 sm:w-10">
                                        <DoorOpen className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
                                    </div>
                                    <div>
                                        <p className="text-xl font-bold sm:text-2xl">{floorRooms.length}</p>
                                        <p className="text-xs text-muted-foreground sm:text-sm">Rooms</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-4 sm:pt-6">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 sm:h-10 sm:w-10">
                                        <Package className="h-4 w-4 text-blue-500 sm:h-5 sm:w-5" />
                                    </div>
                                    <div>
                                        <p className="text-xl font-bold sm:text-2xl">{floorItems.length}</p>
                                        <p className="text-xs text-muted-foreground sm:text-sm">Item Types</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-4 sm:pt-6">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 sm:h-10 sm:w-10">
                                        <Package className="h-4 w-4 text-amber-500 sm:h-5 sm:w-5" />
                                    </div>
                                    <div>
                                        <p className="text-xl font-bold sm:text-2xl">{totalQuantity}</p>
                                        <p className="text-xs text-muted-foreground sm:text-sm">Total Items</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-4 sm:pt-6">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 sm:h-10 sm:w-10">
                                        <span className="text-emerald-500 font-bold text-sm">$</span>
                                    </div>
                                    <div>
                                        <p className="text-xl font-bold sm:text-2xl">${totalValue.toLocaleString()}</p>
                                        <p className="text-xs text-muted-foreground sm:text-sm">Total Value</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="mb-4 flex flex-wrap gap-2">
                        {Object.entries(roomTypes).map(([type, count]) => (
                            <Badge key={type} variant="outline">
                                {type}: {count}
                            </Badge>
                        ))}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {floorRooms.map((room) => (
                            <RoomCard key={room.id} room={room} />
                        ))}
                    </div>
                </main>
            </div>
        </div>
    )
}
