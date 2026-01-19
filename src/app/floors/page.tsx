import { Suspense } from "react"
import { FloorsContent } from "./floors-content"

export default function FloorsPage() {
    return (
        <Suspense fallback={null}>
            <FloorsContent />
        </Suspense>
    )
}