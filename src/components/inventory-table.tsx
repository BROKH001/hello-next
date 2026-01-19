"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { InventoryItem } from "@/lib/inventory-data"
import { MoreHorizontal, ArrowUpDown, QrCode } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { QRCodeGenerator } from "@/components/qr-code-generator"

interface InventoryTableProps {
    items: InventoryItem[]
    showActions?: boolean
}

export function InventoryTable({ items, showActions = true }: InventoryTableProps) {
    const [sortField, setSortField] = useState<keyof InventoryItem>("name")
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
    const [qrItem, setQrItem] = useState<InventoryItem | null>(null)
    const [qrOpen, setQrOpen] = useState(false)

    const sortedItems = [...items].sort((a, b) => {
        const aVal = a[sortField]
        const bVal = b[sortField]
        if (typeof aVal === "string" && typeof bVal === "string") {
            return sortDirection === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
        }
        if (typeof aVal === "number" && typeof bVal === "number") {
            return sortDirection === "asc" ? aVal - bVal : bVal - aVal
        }
        return 0
    })

    const handleSort = (field: keyof InventoryItem) => {
        if (sortField === field) {
            setSortDirection((d) => (d === "asc" ? "desc" : "asc"))
        } else {
            setSortField(field)
            setSortDirection("asc")
        }
    }

    const handleGenerateQR = (item: InventoryItem) => {
        setQrItem(item)
        setQrOpen(true)
    }

    const getStatusBadge = (status: InventoryItem["status"]) => {
        switch (status) {
            case "available":
                return <Badge className="bg-success/20 text-success hover:bg-success/30">Available</Badge>
            case "low-stock":
                return <Badge className="bg-warning/20 text-warning hover:bg-warning/30">Low Stock</Badge>
            case "out-of-stock":
                return <Badge className="bg-destructive/20 text-destructive hover:bg-destructive/30">Out of Stock</Badge>
        }
    }

    return (
        <>
            <div className="rounded-lg border border-border overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="border-border hover:bg-transparent">
                            <TableHead className="text-muted-foreground min-w-37.5">
                                <button onClick={() => handleSort("name")} className="flex items-center gap-1 hover:text-foreground">
                                    Item Name <ArrowUpDown className="h-3 w-3" />
                                </button>
                            </TableHead>
                            <TableHead className="text-muted-foreground hidden sm:table-cell">Category</TableHead>
                            <TableHead className="text-muted-foreground">
                                <button
                                    onClick={() => handleSort("quantity")}
                                    className="flex items-center gap-1 hover:text-foreground"
                                >
                                    Qty <ArrowUpDown className="h-3 w-3" />
                                </button>
                            </TableHead>
                            <TableHead className="text-muted-foreground">Status</TableHead>
                            <TableHead className="text-muted-foreground hidden md:table-cell">Location</TableHead>
                            <TableHead className="text-muted-foreground hidden lg:table-cell">Last Updated</TableHead>
                            <TableHead className="text-muted-foreground w-10">QR</TableHead>
                            {showActions && <TableHead className="text-muted-foreground w-10"></TableHead>}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedItems.map((item) => (
                            <TableRow key={item.id} className="border-border hover:bg-secondary/50">
                                <TableCell className="font-medium text-foreground">{item.name}</TableCell>
                                <TableCell className="text-muted-foreground hidden sm:table-cell">{item.category}</TableCell>
                                <TableCell className="text-foreground">{item.quantity}</TableCell>
                                <TableCell>{getStatusBadge(item.status)}</TableCell>
                                <TableCell className="text-muted-foreground hidden md:table-cell">{item.location}</TableCell>
                                <TableCell className="text-muted-foreground hidden lg:table-cell">{item.lastUpdated}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => handleGenerateQR(item)}
                                        title="Generate QR Code"
                                    >
                                        <QrCode className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                                {showActions && (
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-40">
                                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                                <DropdownMenuItem>Edit Item</DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <QRCodeGenerator item={qrItem} open={qrOpen} onOpenChange={setQrOpen} />
        </>
    )
}
