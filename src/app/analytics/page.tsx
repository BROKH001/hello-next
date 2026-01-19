"use client"

import { Suspense } from "react"
import { Sidebar } from "@/components/sidebar"
import { SearchHeader } from "@/components/search-header"
import { inventoryItems, categories, monthlyData } from "@/lib/inventory-data"
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    Legend,
    PieChart,
    Pie,
    Cell,
} from "recharts"

export default function AnalyticsPage() {
    const totalItems = inventoryItems.reduce((sum, item) => sum + item.quantity, 0)
    const totalValue = inventoryItems.reduce((sum, item) => sum + item.value, 0)

    const stockHealth = [
        {
            name: "Available",
            value: inventoryItems.filter((i) => i.status === "available").length,
            fill: "hsl(145, 70%, 45%)",
        },
        {
            name: "Low Stock",
            value: inventoryItems.filter((i) => i.status === "low-stock").length,
            fill: "hsl(50, 70%, 55%)",
        },
        {
            name: "Out of Stock",
            value: inventoryItems.filter((i) => i.status === "out-of-stock").length,
            fill: "hsl(25, 80%, 50%)",
        },
    ]

    const utilizationData = categories.map((cat, index) => ({
        name: cat.name,
        utilization: Math.round(60 + Math.random() * 35),
        fill: [
            "hsl(145, 70%, 45%)",
            "hsl(220, 60%, 50%)",
            "hsl(50, 70%, 55%)",
            "hsl(25, 80%, 50%)",
            "hsl(280, 60%, 50%)",
            "hsl(180, 60%, 45%)",
        ][index],
    }))

    const kpiData = [
        { label: "Stock Turnover", value: "4.2x", change: "+12%", trend: "up" },
        { label: "Avg. Restock Days", value: "3.5", change: "-18%", trend: "down" },
        { label: "Accuracy", value: "98.5%", change: "+2%", trend: "up" },
        { label: "Fill Rate", value: "94.2%", change: "+5%", trend: "up" },
    ]

    const topMovers = inventoryItems
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5)
        .map((item, index) => ({
            ...item,
            movement: index % 2 === 0 ? "up" : "down",
            changePercent: Math.round(5 + Math.random() * 20),
        }))

    return (
        <div className="min-h-screen bg-background">
            <Sidebar />
            <main className="lg:ml-64">
                <Suspense fallback={<div className="h-16 border-b border-border bg-background" />}>
                    <SearchHeader title="Analytics" />
                </Suspense>

                <div className="p-4 md:p-6">
                    <div className="mb-6">
                        <h2 className="text-lg font-medium text-foreground">Inventory Analytics</h2>
                        <p className="text-sm text-muted-foreground">Insights and performance metrics</p>
                    </div>

                    <div className="grid gap-3 grid-cols-2 md:gap-4 lg:grid-cols-4">
                        {kpiData.map((kpi) => (
                            <Card key={kpi.label} className="bg-card">
                                <CardContent className="p-3 sm:p-4">
                                    <p className="text-xs text-muted-foreground sm:text-sm truncate">{kpi.label}</p>
                                    <div className="mt-2 flex items-end justify-between gap-2">
                                        <p className="text-2xl font-semibold text-foreground sm:text-3xl">{kpi.value}</p>
                                        <div
                                            className={`flex items-center gap-1 text-xs sm:text-sm ${kpi.trend === "up" ? "text-success" : "text-destructive"}`}
                                        >
                                            {kpi.trend === "up" ? (
                                                <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4" />
                                            ) : (
                                                <ArrowDownRight className="h-3 w-3 sm:h-4 sm:w-4" />
                                            )}
                                            {kpi.change}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="mt-4 md:mt-6 grid gap-4 md:gap-6 lg:grid-cols-3">
                        <Card className="bg-card lg:col-span-2">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-foreground sm:text-base">Inventory Flow</CardTitle>
                                <p className="text-xs text-muted-foreground sm:text-sm">Incoming vs Outgoing items over time</p>
                            </CardHeader>
                            <CardContent>
                                <div className="h-60 sm:h-75">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="colorIncoming" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="hsl(145, 70%, 45%)" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="hsl(145, 70%, 45%)" stopOpacity={0} />
                                                </linearGradient>
                                                <linearGradient id="colorOutgoing" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="hsl(220, 60%, 50%)" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="hsl(220, 60%, 50%)" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(260, 5%, 25%)" vertical={false} />
                                            <XAxis
                                                dataKey="month"
                                                tick={{ fill: "hsl(260, 5%, 60%)", fontSize: 11 }}
                                                axisLine={false}
                                                tickLine={false}
                                            />
                                            <YAxis tick={{ fill: "hsl(260, 5%, 60%)", fontSize: 11 }} axisLine={false} tickLine={false} />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: "hsl(260, 5%, 17%)",
                                                    border: "1px solid hsl(260, 5%, 28%)",
                                                    borderRadius: "8px",
                                                }}
                                            />
                                            <Legend wrapperStyle={{ fontSize: 12 }} />
                                            <Area
                                                type="monotone"
                                                dataKey="incoming"
                                                name="Incoming"
                                                stroke="hsl(145, 70%, 45%)"
                                                fillOpacity={1}
                                                fill="url(#colorIncoming)"
                                                strokeWidth={2}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="outgoing"
                                                name="Outgoing"
                                                stroke="hsl(220, 60%, 50%)"
                                                fillOpacity={1}
                                                fill="url(#colorOutgoing)"
                                                strokeWidth={2}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-card">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-foreground sm:text-base">Stock Health</CardTitle>
                                <p className="text-xs text-muted-foreground sm:text-sm">Current inventory status</p>
                            </CardHeader>
                            <CardContent>
                                <div className="h-45 sm:h-50">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={stockHealth}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={40}
                                                outerRadius={65}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {stockHealth.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: "hsl(260, 5%, 17%)",
                                                    border: "1px solid hsl(260, 5%, 28%)",
                                                    borderRadius: "8px",
                                                }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="mt-4 flex flex-wrap justify-center gap-3 sm:gap-4">
                                    {stockHealth.map((item) => (
                                        <div key={item.name} className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full sm:h-3 sm:w-3" style={{ backgroundColor: item.fill }} />
                                            <span className="text-xs text-muted-foreground">
                                                {item.name} ({item.value})
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="mt-4 md:mt-6 grid gap-4 md:gap-6 lg:grid-cols-2">
                        <Card className="bg-card">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-foreground sm:text-base">Category Utilization</CardTitle>
                                <p className="text-xs text-muted-foreground sm:text-sm">Usage rate by category</p>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3 sm:space-y-4">
                                    {utilizationData.map((item) => (
                                        <div key={item.name} className="space-y-1.5 sm:space-y-2">
                                            <div className="flex items-center justify-between text-xs sm:text-sm">
                                                <span className="text-foreground truncate mr-2">{item.name}</span>
                                                <span className="font-medium text-foreground shrink-0">{item.utilization}%</span>
                                            </div>
                                            <div className="h-1.5 sm:h-2 overflow-hidden rounded-full bg-secondary">
                                                <div
                                                    className="h-full rounded-full transition-all"
                                                    style={{ width: `${item.utilization}%`, backgroundColor: item.fill }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-card">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-foreground sm:text-base">Top Moving Items</CardTitle>
                                <p className="text-xs text-muted-foreground sm:text-sm">Highest activity items</p>
                            </CardHeader>
                            <CardContent>
                                <div className="divide-y divide-border">
                                    {topMovers.map((item, index) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center justify-between py-2.5 sm:py-3 first:pt-0 last:pb-0"
                                        >
                                            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                                                <span className="flex h-5 w-5 sm:h-6 sm:w-6 shrink-0 items-center justify-center rounded bg-secondary text-xs font-medium text-foreground">
                                                    {index + 1}
                                                </span>
                                                <div className="min-w-0">
                                                    <p className="text-xs sm:text-sm font-medium text-foreground truncate">{item.name}</p>
                                                    <p className="text-xs text-muted-foreground">{item.category}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                                <span className="text-xs sm:text-sm text-foreground">{item.quantity}</span>
                                                <div
                                                    className={`flex items-center gap-1 text-xs ${item.movement === "up" ? "text-success" : "text-destructive"}`}
                                                >
                                                    {item.movement === "up" ? (
                                                        <TrendingUp className="h-3 w-3" />
                                                    ) : (
                                                        <TrendingDown className="h-3 w-3" />
                                                    )}
                                                    {item.changePercent}%
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    )
}
