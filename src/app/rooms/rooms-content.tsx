"use client"

import { useState } from "react"
import Link from "next/link"
import { Sidebar } from "@/components/sidebar"
import { SearchHeader } from "@/components/search-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { floors, rooms, inventoryItems } from "@/lib/inventory-data"
import { DoorOpen, Package, Users, ChevronRight, Search, Building } from "lucide-react"

function RoomCard({ room }: { room: (typeof rooms)[0] }) {
    const floor = floors.find((f) => f.id === room.floorId)
    const roomItems = inventoryItems.filter((i) => i.roomId === room.id)
    const totalValue = roomItems.reduce((sum, item) => sum + item.value, 0)
    const totalQuantity = roomItems.reduce((sum, item) => sum + item.quantity, 0)

    const categories = [...new Set(roomItems.map((item) => item.category))]

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
                            <CardDescription className="flex items-center gap-1 text-xs">
                                <Building className="h-3 w-3" />
                                {floor?.name}
                            </CardDescription>
                        </div>
                    </div>
                    <Badge variant="secondary" className="text-xs shrink-0">
                        {room.type}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                <p className="text-xs text-muted-foreground line-clamp-2 sm:text-sm">{room.description}</p>

                <div className="grid grid-cols-3 gap-2">
                    <div className="rounded-lg bg-muted/50 p-2 text-center">
                        <Package className="mx-auto h-3 w-3 text-muted-foreground mb-1" />
                        <p className="text-sm font-semibold">{roomItems.length}</p>
                        <p className="text-xs text-muted-foreground">Types</p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-2 text-center">
                        <p className="text-sm font-semibold">{totalQuantity}</p>
                        <p className="text-xs text-muted-foreground">Qty</p>
                    </div>
                    {room.capacity > 0 && (
                        <div className="rounded-lg bg-muted/50 p-2 text-center">
                            <Users className="mx-auto h-3 w-3 text-muted-foreground mb-1" />
                            <p className="text-sm font-semibold">{room.capacity}</p>
                            <p className="text-xs text-muted-foreground">Cap</p>
                        </div>
                    )}
                </div>

                {categories.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {categories.slice(0, 2).map((cat) => (
                            <Badge key={cat} variant="outline" className="text-xs">
                                {cat}
                            </Badge>
                        ))}
                        {categories.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                                +{categories.length - 2}
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
                            View
                            <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    )
}

export function RoomsContent() {
    const [search, setSearch] = useState("")
    const [floorFilter, setFloorFilter] = useState<string>("all")
    const [typeFilter, setTypeFilter] = useState<string>("all")

    const roomTypes = [...new Set(rooms.map((r) => r.type))]

    const filteredRooms = rooms.filter((room) => {
        const matchesSearch =
            room.name.toLowerCase().includes(search.toLowerCase()) ||
            room.description.toLowerCase().includes(search.toLowerCase())
        const matchesFloor = floorFilter === "all" || room.floorId === floorFilter
        const matchesType = typeFilter === "all" || room.type === typeFilter
        return matchesSearch && matchesFloor && matchesType
    })

    return (
        <div className="min-h-screen bg-background">
            <Sidebar />
            <div className="lg:ml-64">
                <SearchHeader title="Room Management" />

                <main className="p-4 md:p-6">
                    <div className="mb-6">
                        <h1 className="text-xl font-bold text-foreground sm:text-2xl">Room Management</h1>
                        <p className="text-sm text-muted-foreground">View and manage all rooms across floors</p>
                    </div>

                    <div className="flex flex-col gap-3 mb-6 sm:flex-row sm:flex-wrap sm:gap-4">
                        <div className="relative flex-1 min-w-0 sm:min-w-[200px]">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search rooms..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <div className="flex gap-2">
                            <Select value={floorFilter} onValueChange={setFloorFilter}>
                                <SelectTrigger className="flex-1 sm:w-[150px]">
                                    <SelectValue placeholder="Floor" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Floors</SelectItem>
                                    {floors.map((floor) => (
                                        <SelectItem key={floor.id} value={floor.id}>
                                            {floor.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={typeFilter} onValueChange={setTypeFilter}>
                                <SelectTrigger className="flex-1 sm:w-[150px]">
                                    <SelectValue placeholder="Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    {roomTypes.map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {type}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="mb-4 text-sm text-muted-foreground">
                        Showing {filteredRooms.length} of {rooms.length} rooms
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredRooms.map((room) => (
                            <RoomCard key={room.id} room={room} />
                        ))}
                    </div>

                    {filteredRooms.length === 0 && (
                        <div className="text-center py-12">
                            <DoorOpen className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                            <h3 className="text-lg font-medium mb-2">No rooms found</h3>
                            <p className="text-muted-foreground">Try adjusting your search or filters</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}
