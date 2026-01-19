import { Suspense } from "react"
import { RoomDetailContent } from "./room-detail-content"

export default function RoomDetailPage({ params }: { params: Promise<{ roomId: string }> }) {
    return (
        <Suspense fallback={null}>
            <RoomDetailContent params={params} />
        </Suspense>
    )
}
