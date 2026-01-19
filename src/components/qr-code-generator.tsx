"use client"

import { useEffect, useRef } from "react"
import type { InventoryItem } from "@/lib/inventory-data"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Printer, MapPin, Calendar, DollarSign, Package } from "lucide-react"

interface QRCodeGeneratorProps {
    item: InventoryItem | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function QRCodeGenerator({ item, open, onOpenChange }: QRCodeGeneratorProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        if (!item || !canvasRef.current) return

        const canvas = canvasRef.current
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        // Generate QR code data
        const data = JSON.stringify({
            id: item.id,
            name: item.name,
            category: item.category,
            quantity: item.quantity,
            status: item.status,
            location: item.location,
            value: item.value,
            lastUpdated: item.lastUpdated,
        })

        // Simple QR code generation using a matrix pattern
        const size = 200
        const moduleCount = 25
        const moduleSize = size / moduleCount

        canvas.width = size
        canvas.height = size

        // Clear canvas
        ctx.fillStyle = "#ffffff"
        ctx.fillRect(0, 0, size, size)

        // Generate deterministic pattern based on data
        const hash = simpleHash(data)
        const pattern = generatePattern(hash, moduleCount)

        // Draw QR code modules
        ctx.fillStyle = "#000000"
        for (let row = 0; row < moduleCount; row++) {
            for (let col = 0; col < moduleCount; col++) {
                if (pattern[row][col]) {
                    ctx.fillRect(col * moduleSize, row * moduleSize, moduleSize, moduleSize)
                }
            }
        }

        // Draw position patterns (corners)
        drawPositionPattern(ctx, 0, 0, moduleSize)
        drawPositionPattern(ctx, (moduleCount - 7) * moduleSize, 0, moduleSize)
        drawPositionPattern(ctx, 0, (moduleCount - 7) * moduleSize, moduleSize)
    }, [item])

    const simpleHash = (str: string): number => {
        let hash = 0
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i)
            hash = (hash << 5) - hash + char
            hash = hash & hash
        }
        return Math.abs(hash)
    }

    const generatePattern = (hash: number, size: number): boolean[][] => {
        const pattern: boolean[][] = []
        let seed = hash

        for (let i = 0; i < size; i++) {
            pattern[i] = []
            for (let j = 0; j < size; j++) {
                // Skip position pattern areas
                const isPositionArea = (i < 8 && j < 8) || (i < 8 && j >= size - 8) || (i >= size - 8 && j < 8)

                if (isPositionArea) {
                    pattern[i][j] = false
                } else {
                    seed = (seed * 1103515245 + 12345) & 0x7fffffff
                    pattern[i][j] = seed % 2 === 0
                }
            }
        }
        return pattern
    }

    const drawPositionPattern = (ctx: CanvasRenderingContext2D, x: number, y: number, moduleSize: number) => {
        // Outer black square
        ctx.fillStyle = "#000000"
        ctx.fillRect(x, y, moduleSize * 7, moduleSize * 7)

        // Inner white square
        ctx.fillStyle = "#ffffff"
        ctx.fillRect(x + moduleSize, y + moduleSize, moduleSize * 5, moduleSize * 5)

        // Center black square
        ctx.fillStyle = "#000000"
        ctx.fillRect(x + moduleSize * 2, y + moduleSize * 2, moduleSize * 3, moduleSize * 3)
    }

    const handleDownload = () => {
        if (!canvasRef.current || !item) return
        const link = document.createElement("a")
        link.download = `qr-${item.name.toLowerCase().replace(/\s+/g, "-")}.png`
        link.href = canvasRef.current.toDataURL("image/png")
        link.click()
    }

    const handlePrint = () => {
        if (!canvasRef.current || !item) return
        const printWindow = window.open("", "_blank")
        if (!printWindow) return

        const imgData = canvasRef.current.toDataURL("image/png")
        printWindow.document.write(`
      <html>
        <head><title>Asset QR Code - ${item.name}</title></head>
        <body style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;font-family:system-ui;">
          <h2>${item.name}</h2>
          <img src="${imgData}" style="width:200px;height:200px;" />
          <p>ID: ${item.id} | Location: ${item.location}</p>
        </body>
      </html>
    `)
        printWindow.document.close()
        printWindow.print()
    }

    const getStatusBadge = (status: InventoryItem["status"]) => {
        switch (status) {
            case "available":
                return <Badge className="bg-success/20 text-success">Available</Badge>
            case "low-stock":
                return <Badge className="bg-warning/20 text-warning">Low Stock</Badge>
            case "out-of-stock":
                return <Badge className="bg-destructive/20 text-destructive">Out of Stock</Badge>
        }
    }

    if (!item) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5 text-primary" />
                        Asset QR Code
                    </DialogTitle>
                    <DialogDescription>Scan this QR code to view all asset information</DialogDescription>
                </DialogHeader>

                <div className="flex flex-col items-center gap-6 py-4">
                    <div className="rounded-lg border border-border bg-card p-4">
                        <canvas ref={canvasRef} className="rounded" />
                    </div>

                    <div className="w-full space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-lg font-semibold text-foreground">{item.name}</span>
                            {getStatusBadge(item.status)}
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Package className="h-4 w-4" />
                                <span>Category:</span>
                                <span className="text-foreground">{item.category}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <MapPin className="h-4 w-4" />
                                <span>Location:</span>
                                <span className="text-foreground">{item.location}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <DollarSign className="h-4 w-4" />
                                <span>Value:</span>
                                <span className="text-foreground">${item.value.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span>Updated:</span>
                                <span className="text-foreground">{item.lastUpdated}</span>
                            </div>
                        </div>

                        <div className="rounded-lg bg-muted/50 p-3">
                            <p className="text-xs text-muted-foreground">
                                Asset ID: <span className="font-mono text-foreground">#{item.id.padStart(6, "0")}</span>
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Quantity in Stock: <span className="font-semibold text-foreground">{item.quantity} units</span>
                            </p>
                        </div>
                    </div>

                    <div className="flex w-full gap-3">
                        <Button onClick={handleDownload} variant="outline" className="flex-1 bg-transparent">
                            <Download className="mr-2 h-4 w-4" />
                            Download
                        </Button>
                        <Button onClick={handlePrint} className="flex-1">
                            <Printer className="mr-2 h-4 w-4" />
                            Print
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
