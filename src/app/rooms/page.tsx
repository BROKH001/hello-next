import { Suspense } from "react"
import { RoomsContent } from "./rooms-content"

export default function RoomsPage() {
    return (
        <Suspense fallback={null}>
            <RoomsContent />
        </Suspense>
    )
}
