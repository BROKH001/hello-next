import { Suspense } from "react"
import { Sidebar } from "@/components/sidebar"
import { SearchHeader } from "@/components/search-header"
import { StatCard } from "@/components/stat-card"
import { InventoryTable } from "@/components/inventory-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, AlertTriangle, DollarSign, Layers } from "lucide-react"
import { inventoryItems, monthlyData, categories } from "@/lib/inventory-data"

export default function DashboardPage() {
    const totalItems = inventoryItems.reduce((sum, item) => sum + item.quantity, 0)
    const lowStockItems = inventoryItems.filter(
        (item) => item.status === "low-stock" || item.status === "out-of-stock",
    ).length
    const totalValue = inventoryItems.reduce((sum, item) => sum + item.value, 0)
    const recentItems = inventoryItems.slice(0, 5)

    // Calculate max value for scaling bars
    const maxValue = Math.max(...monthlyData.flatMap(d => [d.incoming, d.outgoing]))

    return (
        <div className="min-h-screen bg-background">
            <Sidebar />
            <main className="lg:ml-64">
                <Suspense fallback={<div className="h-16 border-b border-border bg-background" />}>
                    <SearchHeader title="Dashboard" />
                </Suspense>

                <div className="p-4 md:p-6">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
                        <StatCard
                            title="Total Items"
                            value={totalItems.toLocaleString()}
                            change="+12% from last month"
                            changeType="positive"
                            icon={Package}
                        />
                        <StatCard
                            title="Categories"
                            value={categories.length}
                            change="2 new this month"
                            changeType="positive"
                            icon={Layers}
                        />
                        <StatCard
                            title="Low Stock Alerts"
                            value={lowStockItems}
                            change="Requires attention"
                            changeType="negative"
                            icon={AlertTriangle}
                        />
                        <StatCard
                            title="Total Value"
                            value={`$${totalValue.toLocaleString()}`}
                            change="+5.2% from last month"
                            changeType="positive"
                            icon={DollarSign}
                        />
                    </div>

                    <div className="mt-4 grid gap-4 md:mt-6 md:gap-6 lg:grid-cols-2">
                        <Card className="bg-card">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base font-medium text-foreground">Inventory Movement</CardTitle>
                                <p className="text-sm text-muted-foreground">Items in/out over the past 6 months</p>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <div className="space-y-3">
                                    {/* Legend */}
                                    <div className="flex items-center justify-center gap-6 text-xs">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded" style={{ backgroundColor: 'hsl(145, 70%, 45%)' }}></div>
                                            <span className="text-muted-foreground">Incoming</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded" style={{ backgroundColor: 'hsl(220, 60%, 50%)' }}></div>
                                            <span className="text-muted-foreground">Outgoing</span>
                                        </div>
                                    </div>

                                    {/* Bar Chart */}
                                    <div className="space-y-4 pt-2">
                                        {monthlyData.map((data) => (
                                            <div key={data.month} className="space-y-1">
                                                <div className="text-xs text-muted-foreground">{data.month}</div>
                                                <div className="flex gap-2 items-end h-16">
                                                    {/* Incoming bar */}
                                                    <div className="flex-1 flex flex-col justify-end h-full">
                                                        <div
                                                            className="rounded-t transition-all hover:opacity-80 relative group"
                                                            style={{
                                                                backgroundColor: 'hsl(145, 70%, 45%)',
                                                                height: `${(data.incoming / maxValue) * 100}%`,
                                                                minHeight: '4px'
                                                            }}
                                                        >
                                                            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100 transition-opacity bg-card border border-border rounded px-1.5 py-0.5 whitespace-nowrap">
                                                                {data.incoming}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    {/* Outgoing bar */}
                                                    <div className="flex-1 flex flex-col justify-end h-full">
                                                        <div
                                                            className="rounded-t transition-all hover:opacity-80 relative group"
                                                            style={{
                                                                backgroundColor: 'hsl(220, 60%, 50%)',
                                                                height: `${(data.outgoing / maxValue) * 100}%`,
                                                                minHeight: '4px'
                                                            }}
                                                        >
                                                            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100 transition-opacity bg-card border border-border rounded px-1.5 py-0.5 whitespace-nowrap">
                                                                {data.outgoing}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-card">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base font-medium text-foreground">Category Overview</CardTitle>
                                <p className="text-sm text-muted-foreground">Distribution by category</p>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <div className="space-y-4">
                                    {categories.map((category, index) => {
                                        const colors = [
                                            "hsl(145, 70%, 45%)",
                                            "hsl(220, 60%, 50%)",
                                            "hsl(50, 70%, 55%)",
                                            "hsl(25, 80%, 50%)",
                                            "hsl(280, 60%, 50%)",
                                            "hsl(180, 60%, 45%)",
                                        ]
                                        const percentage = Math.round((category.count / totalItems) * 100)
                                        return (
                                            <div key={category.name} className="space-y-2">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-foreground truncate mr-2">{category.name}</span>
                                                    <span className="text-muted-foreground whitespace-nowrap">
                                                        {category.count} ({percentage}%)
                                                    </span>
                                                </div>
                                                <div className="h-2 overflow-hidden rounded-full bg-secondary">
                                                    <div
                                                        className="h-full rounded-full transition-all"
                                                        style={{ width: `${percentage}%`, backgroundColor: colors[index % colors.length] }}
                                                    />
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="mt-4 md:mt-6">
                        <Card className="bg-card">
                            <CardHeader className="pb-2">
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <CardTitle className="text-base font-medium text-foreground">Recent Items</CardTitle>
                                        <p className="text-sm text-muted-foreground">Latest inventory updates</p>
                                    </div>
                                    <a href="/items" className="text-sm text-primary hover:underline">
                                        View All
                                    </a>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <InventoryTable items={recentItems} showActions={false} />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    )
}