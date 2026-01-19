import { Suspense } from "react"
import { FloorDetailContent } from "./floor-detail-content"

export default function FloorDetailPage({ params }: { params: Promise<{ floorId: string }> }) {
    return (
        <Suspense fallback={null}>
            <FloorDetailContent params={params} />
        </Suspense>
    )
}
