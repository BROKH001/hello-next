"use client"

import { use } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { SearchHeader } from "@/components/search-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { floors, rooms, inventoryItems } from "@/lib/inventory-data"
import { QRCodeGenerator } from "@/components/qr-code-generator"
import { ArrowLeft, DoorOpen, Package, Users, Building, QrCode } from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

const COLORS = [
    "hsl(145, 70%, 45%)",
    "hsl(220, 60%, 50%)",
    "hsl(50, 70%, 55%)",
    "hsl(25, 80%, 50%)",
    "hsl(280, 60%, 50%)",
]

export function RoomDetailContent({ params }: { params: Promise<{ roomId: string }> }) {
    const { roomId } = use(params)
    const router = useRouter()
    const room = rooms.find((r) => r.id === roomId)
    const floor = floors.find((f) => f.id === room?.floorId)
    const roomItems = inventoryItems.filter((i) => i.roomId === roomId)

    if (!room) {
        return (
            <div className="min-h-screen bg-background">
                <Sidebar />
                <div className="lg:ml-64 flex items-center justify-center h-screen">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold mb-2">Room Not Found</h1>
                        <Button onClick={() => router.push("/rooms")}>Back to Rooms</Button>
                    </div>
                </div>
            </div>
        )
    }

    const totalValue = roomItems.reduce((sum, item) => sum + item.value, 0)
    const totalQuantity = roomItems.reduce((sum, item) => sum + item.quantity, 0)

    const categoryData = roomItems.reduce(
        (acc, item) => {
            const existing = acc.find((c) => c.name === item.category)
            if (existing) {
                existing.value += item.quantity
                existing.itemCount += 1
            } else {
                acc.push({ name: item.category, value: item.quantity, itemCount: 1 })
            }
            return acc
        },
        [] as { name: string; value: number; itemCount: number }[],
    )

    const statusCounts = roomItems.reduce(
        (acc, item) => {
            acc[item.status] = (acc[item.status] || 0) + 1
            return acc
        },
        {} as Record<string, number>,
    )

    return (
        <div className="min-h-screen bg-background">
            <Sidebar />
            <div className="lg:ml-64">
                <SearchHeader title={room.name} />

                <main className="p-4 md:p-6">
                    <div className="mb-6">
                        <Button variant="ghost" size="sm" onClick={() => router.back()} className="mb-4">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                        </Button>
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div className="flex items-center gap-3 sm:gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary sm:h-14 sm:w-14">
                                    <DoorOpen className="h-6 w-6 sm:h-7 sm:w-7" />
                                </div>
                                <div className="min-w-0">
                                    <h1 className="text-xl font-bold text-foreground sm:text-2xl">{room.name}</h1>
                                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <Building className="h-4 w-4" />
                                            {floor?.name}
                                        </span>
                                        <span className="hidden sm:inline">•</span>
                                        <span>{room.type}</span>
                                        {room.capacity > 0 && (
                                            <>
                                                <span className="hidden sm:inline">•</span>
                                                <span className="flex items-center gap-1">
                                                    <Users className="h-4 w-4" />
                                                    Capacity: {room.capacity}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <QRCodeGenerator
                                item={null}
                                open={false}
                                onOpenChange={function (open: boolean): void {
                                    throw new Error("Function not implemented.")
                                } }
                            />
                        </div>
                    </div>

                    <div className="grid gap-3 grid-cols-2 md:grid-cols-4 md:gap-4 mb-6">
                        <Card>
                            <CardContent className="pt-4 sm:pt-6">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 sm:h-10 sm:w-10">
                                        <Package className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
                                    </div>
                                    <div>
                                        <p className="text-xl font-bold sm:text-2xl">{roomItems.length}</p>
                                        <p className="text-xs text-muted-foreground sm:text-sm">Item Types</p>
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
                        <Card>
                            <CardContent className="pt-4 sm:pt-6">
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
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-4 md:gap-6 mb-6 lg:grid-cols-3">
                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <CardTitle className="text-base sm:text-lg">Items in Room</CardTitle>
                                <CardDescription>All inventory items stored in this room</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {roomItems.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="min-w-[120px]">Item Name</TableHead>
                                                    <TableHead className="hidden sm:table-cell">Category</TableHead>
                                                    <TableHead className="text-right">Qty</TableHead>
                                                    <TableHead>Status</TableHead>
                                                    <TableHead className="text-right hidden md:table-cell">Value</TableHead>
                                                    <TableHead className="w-10"></TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {roomItems.map((item) => (
                                                    <TableRow key={item.id}>
                                                        <TableCell className="font-medium">{item.name}</TableCell>
                                                        <TableCell className="hidden sm:table-cell">{item.category}</TableCell>
                                                        <TableCell className="text-right">{item.quantity}</TableCell>
                                                        <TableCell>
                                                            <Badge
                                                                variant="secondary"
                                                                className={
                                                                    item.status === "available"
                                                                        ? "bg-emerald-500/10 text-emerald-600"
                                                                        : item.status === "low-stock"
                                                                            ? "bg-amber-500/10 text-amber-600"
                                                                            : "bg-red-500/10 text-red-600"
                                                                }
                                                            >
                                                                {item.status === "available" ? "OK" : item.status === "low-stock" ? "Low" : "Out"}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-right hidden md:table-cell">
                                                            ${item.value.toLocaleString()}
                                                        </TableCell>
                                                        <TableCell>
                                                            <QRCodeGenerator item={item} open={false} onOpenChange={function (open: boolean): void {
                                                                throw new Error("Function not implemented.")
                                                            } } />
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <Package className="mx-auto h-10 w-10 mb-2 opacity-50" />
                                        <p>No items in this room</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base sm:text-lg">Category Distribution</CardTitle>
                                <CardDescription>Items by category</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {categoryData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={200}>
                                        <PieChart>
                                            <Pie
                                                data={categoryData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={40}
                                                outerRadius={70}
                                                paddingAngle={2}
                                                dataKey="value"
                                            >
                                                {categoryData.map((_, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend wrapperStyle={{ fontSize: 12 }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="text-center py-8 text-muted-foreground">No data</div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        </div>
    )
}
