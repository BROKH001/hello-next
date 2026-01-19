import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface StatCardProps {
    title: string
    value: string | number
    change?: string
    changeType?: "positive" | "negative" | "neutral"
    icon: LucideIcon
}

export function StatCard({ title, value, change, changeType = "neutral", icon: Icon }: StatCardProps) {
    return (
        <Card className="bg-card">
            <CardContent className="p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-sm text-muted-foreground">{title}</p>
                        <p className="mt-2 text-3xl font-semibold text-foreground">{value}</p>
                        {change && (
                            <p
                                className={cn(
                                    "mt-1 text-sm",
                                    changeType === "positive" && "text-success",
                                    changeType === "negative" && "text-destructive",
                                    changeType === "neutral" && "text-muted-foreground",
                                )}
                            >
                                {change}
                            </p>
                        )}
                    </div>
                    <div className="rounded-lg bg-secondary p-3">
                        <Icon className="h-5 w-5 text-primary" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
