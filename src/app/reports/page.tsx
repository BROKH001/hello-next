"use client"

import { useState, Suspense } from "react"
import { Sidebar } from "@/components/sidebar"
import { SearchHeader } from "@/components/search-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { inventoryItems, categories, monthlyData } from "@/lib/inventory-data"
import { Download, FileText, Calendar, Printer, TrendingUp, TrendingDown, Package, AlertTriangle } from "lucide-react"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    Legend,
    LineChart,
    Line,
} from "recharts"

const reports = [
    { id: 1, name: "Monthly Inventory Summary", type: "Summary", date: "2026-01-08", status: "Ready" },
    { id: 2, name: "Low Stock Alert Report", type: "Alert", date: "2026-01-07", status: "Ready" },
    { id: 3, name: "Category Distribution", type: "Analysis", date: "2026-01-06", status: "Ready" },
    { id: 4, name: "Asset Valuation Report", type: "Financial", date: "2026-01-05", status: "Ready" },
    { id: 5, name: "Usage Trends Q4 2025", type: "Trends", date: "2025-12-31", status: "Archived" },
]

export default function ReportsPage() {
    const [reportPeriod, setReportPeriod] = useState("monthly")

    const totalItems = inventoryItems.reduce((sum, item) => sum + item.quantity, 0)
    const totalValue = inventoryItems.reduce((sum, item) => sum + item.value, 0)
    const lowStockCount = inventoryItems.filter((i) => i.status === "low-stock").length
    const outOfStockCount = inventoryItems.filter((i) => i.status === "out-of-stock").length

    const valueByCategory = categories.map((cat) => ({
        name: cat.name,
        value: cat.value,
        count: cat.count,
    }))

    return (
        <div className="min-h-screen bg-background">
            <Sidebar />
            <main className="lg:ml-64">
                <Suspense fallback={<div className="h-16 border-b border-border bg-background" />}>
                    <SearchHeader title="Reports" />
                </Suspense>

                <div className="p-4 md:p-6">
                    <div className="mb-6 flex flex-col gap-4">
                        <div>
                            <h2 className="text-lg font-medium text-foreground">Generate Reports</h2>
                            <p className="text-sm text-muted-foreground">View and export inventory reports</p>
                        </div>
                        <div className="flex flex-col gap-2 sm:flex-row">
                            <Select value={reportPeriod} onValueChange={setReportPeriod}>
                                <SelectTrigger className="w-full sm:w-40 bg-secondary">
                                    <Calendar className="mr-2 h-4 w-4" />
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="weekly">Weekly</SelectItem>
                                    <SelectItem value="monthly">Monthly</SelectItem>
                                    <SelectItem value="quarterly">Quarterly</SelectItem>
                                    <SelectItem value="yearly">Yearly</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button className="gap-2 bg-primary text-primary-foreground w-full sm:w-auto">
                                <Download className="h-4 w-4" />
                                Export All
                            </Button>
                        </div>
                    </div>

                    <div className="grid gap-3 grid-cols-2 md:gap-4 lg:grid-cols-4">
                        <Card className="bg-card">
                            <CardContent className="p-3 sm:p-4">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-lg bg-primary/20 p-2 shrink-0">
                                        <Package className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs text-muted-foreground sm:text-sm">Total Items</p>
                                        <p className="text-xl font-semibold text-foreground sm:text-2xl">{totalItems.toLocaleString()}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-card">
                            <CardContent className="p-3 sm:p-4">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-lg bg-chart-2/20 p-2 shrink-0">
                                        <TrendingUp className="h-4 w-4 text-chart-2 sm:h-5 sm:w-5" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs text-muted-foreground sm:text-sm">Total Value</p>
                                        <p className="text-xl font-semibold text-foreground sm:text-2xl">
                                            ${(totalValue / 1000).toFixed(0)}K
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-card">
                            <CardContent className="p-3 sm:p-4">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-lg bg-warning/20 p-2 shrink-0">
                                        <AlertTriangle className="h-4 w-4 text-warning sm:h-5 sm:w-5" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs text-muted-foreground sm:text-sm">Low Stock</p>
                                        <p className="text-xl font-semibold text-foreground sm:text-2xl">{lowStockCount}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-card">
                            <CardContent className="p-3 sm:p-4">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-lg bg-destructive/20 p-2 shrink-0">
                                        <TrendingDown className="h-4 w-4 text-destructive sm:h-5 sm:w-5" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs text-muted-foreground sm:text-sm">Out of Stock</p>
                                        <p className="text-xl font-semibold text-foreground sm:text-2xl">{outOfStockCount}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="mt-4 md:mt-6 grid gap-4 md:gap-6 lg:grid-cols-2">
                        <Card className="bg-card">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-foreground sm:text-base">Value by Category</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[240px] sm:h-[280px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            data={valueByCategory}
                                            layout="vertical"
                                            margin={{ top: 10, right: 20, left: 60, bottom: 0 }}
                                        >
                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                                stroke="hsl(260, 5%, 25%)"
                                                horizontal={true}
                                                vertical={false}
                                            />
                                            <XAxis
                                                type="number"
                                                tick={{ fill: "hsl(260, 5%, 60%)", fontSize: 11 }}
                                                axisLine={false}
                                                tickLine={false}
                                                tickFormatter={(val) => `$${(val / 1000).toFixed(0)}K`}
                                            />
                                            <YAxis
                                                type="category"
                                                dataKey="name"
                                                tick={{ fill: "hsl(260, 5%, 60%)", fontSize: 11 }}
                                                axisLine={false}
                                                tickLine={false}
                                                width={55}
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: "hsl(260, 5%, 17%)",
                                                    border: "1px solid hsl(260, 5%, 28%)",
                                                    borderRadius: "8px",
                                                }}
                                                formatter={(value: number | undefined) => [`$${(value ?? 0).toLocaleString()}`, "Value"]}
                                            />
                                            <Bar dataKey="value" fill="hsl(145, 70%, 45%)" radius={[0, 4, 4, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-card">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-foreground sm:text-base">Inventory Trends</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[240px] sm:h-[280px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={monthlyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
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
                                            <Line
                                                type="monotone"
                                                dataKey="incoming"
                                                name="Incoming"
                                                stroke="hsl(145, 70%, 45%)"
                                                strokeWidth={2}
                                                dot={{ fill: "hsl(145, 70%, 45%)", r: 3 }}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="outgoing"
                                                name="Outgoing"
                                                stroke="hsl(220, 60%, 50%)"
                                                strokeWidth={2}
                                                dot={{ fill: "hsl(220, 60%, 50%)", r: 3 }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="mt-4 md:mt-6">
                        <Card className="bg-card">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-foreground sm:text-base">Saved Reports</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="divide-y divide-border">
                                    {reports.map((report) => (
                                        <div
                                            key={report.id}
                                            className="flex flex-col gap-2 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="rounded-lg bg-secondary p-2 shrink-0">
                                                    <FileText className="h-4 w-4 text-primary" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-medium text-foreground text-sm truncate">{report.name}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {report.type} • {report.date}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 ml-11 sm:ml-0">
                                                <Badge
                                                    variant={report.status === "Ready" ? "default" : "secondary"}
                                                    className={report.status === "Ready" ? "bg-primary/20 text-primary" : ""}
                                                >
                                                    {report.status}
                                                </Badge>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <Download className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <Printer className="h-4 w-4" />
                                                </Button>
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
