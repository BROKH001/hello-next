"use client"

import { useState, useMemo, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { SearchHeader } from "@/components/search-header"
import { InventoryTable } from "@/components/inventory-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { inventoryItems, categories } from "@/lib/inventory-data"
import { Plus, Search, Filter, Download } from "lucide-react"

function ItemsContent() {
    const searchParams = useSearchParams()
    const initialSearch = searchParams.get("search") || ""

    const [searchQuery, setSearchQuery] = useState(initialSearch)
    const [categoryFilter, setCategoryFilter] = useState<string>("all")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

    const filteredItems = useMemo(() => {
        return inventoryItems.filter((item) => {
            const matchesSearch =
                item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.location.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesCategory = categoryFilter === "all" || item.category === categoryFilter
            const matchesStatus = statusFilter === "all" || item.status === statusFilter
            return matchesSearch && matchesCategory && matchesStatus
        })
    }, [searchQuery, categoryFilter, statusFilter])

    return (
        <Card className="bg-card">
            <CardHeader className="pb-4">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <CardTitle className="text-lg font-medium text-foreground">Inventory Items</CardTitle>
                            <p className="text-sm text-muted-foreground">{filteredItems.length} items found</p>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="gap-2 bg-transparent flex-1 sm:flex-none">
                                <Download className="h-4 w-4" />
                                <span className="hidden xs:inline">Export</span>
                            </Button>
                            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button
                                        size="sm"
                                        className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 flex-1 sm:flex-none"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Add Item
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="bg-card max-w-[95vw] sm:max-w-lg">
                                    <DialogHeader>
                                        <DialogTitle>Add New Item</DialogTitle>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="name">Item Name</Label>
                                            <Input id="name" placeholder="Enter item name" className="bg-secondary" />
                                        </div>
                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                            <div className="grid gap-2">
                                                <Label htmlFor="category">Category</Label>
                                                <Select>
                                                    <SelectTrigger className="bg-secondary">
                                                        <SelectValue placeholder="Select category" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {categories.map((cat) => (
                                                            <SelectItem key={cat.name} value={cat.name}>
                                                                {cat.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="quantity">Quantity</Label>
                                                <Input id="quantity" type="number" placeholder="0" className="bg-secondary" />
                                            </div>
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="location">Location</Label>
                                            <Input id="location" placeholder="Enter location" className="bg-secondary" />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="value">Value ($)</Label>
                                            <Input id="value" type="number" placeholder="0.00" className="bg-secondary" />
                                        </div>
                                    </div>
                                    <DialogFooter className="flex-col gap-2 sm:flex-row">
                                        <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="w-full sm:w-auto">
                                            Cancel
                                        </Button>
                                        <Button className="bg-primary text-primary-foreground w-full sm:w-auto">Add Item</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="mb-6 flex flex-col gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search items..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-secondary pl-10"
                        />
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row">
                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger className="w-full bg-secondary sm:w-40">
                                <Filter className="mr-2 h-4 w-4" />
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                {categories.map((cat) => (
                                    <SelectItem key={cat.name} value={cat.name}>
                                        {cat.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full bg-secondary sm:w-36">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="available">Available</SelectItem>
                                <SelectItem value="low-stock">Low Stock</SelectItem>
                                <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <InventoryTable items={filteredItems} />
            </CardContent>
        </Card>
    )
}

export default function ItemsPage() {
    return (
        <div className="min-h-screen bg-background">
            <Sidebar />
            <main className="lg:ml-64">
                <Suspense fallback={<div className="h-16 border-b border-border bg-background" />}>
                    <SearchHeader title="Items" />
                </Suspense>

                <div className="p-4 md:p-6">
                    <Suspense fallback={<div className="h-96 animate-pulse rounded-lg bg-card" />}>
                        <ItemsContent />
                    </Suspense>
                </div>
            </main>
        </div>
    )
}
