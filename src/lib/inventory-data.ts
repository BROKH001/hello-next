export interface InventoryItem {
    id: string
    name: string
    category: string
    quantity: number
    status: "available" | "low-stock" | "out-of-stock"
    location: string
    lastUpdated: string
    value: number
    floorId: string
    roomId: string
}

export interface Category {
    name: string
    count: number
    value: number
}

export interface Floor {
    id: string
    name: string
    level: number
    description: string
    roomCount: number
}

export interface Room {
    id: string
    name: string
    floorId: string
    type: string
    capacity: number
    description: string
}

export const floors: Floor[] = [
    {
        id: "floor-1",
        name: "Ground Floor",
        level: 0,
        description: "Main entrance, admin offices, and gymnasium",
        roomCount: 8,
    },
    { id: "floor-2", name: "First Floor", level: 1, description: "Classrooms and library", roomCount: 12 },
    { id: "floor-3", name: "Second Floor", level: 2, description: "Science and computer labs", roomCount: 10 },
    { id: "floor-4", name: "Third Floor", level: 3, description: "Art rooms and music studios", roomCount: 6 },
]

export const rooms: Room[] = [
    // Ground Floor
    {
        id: "room-1",
        name: "Admin Office",
        floorId: "floor-1",
        type: "Office",
        capacity: 10,
        description: "Main administrative office",
    },
    {
        id: "room-2",
        name: "Gymnasium",
        floorId: "floor-1",
        type: "Sports",
        capacity: 200,
        description: "Main sports hall",
    },
    {
        id: "room-3",
        name: "Storage A",
        floorId: "floor-1",
        type: "Storage",
        capacity: 0,
        description: "General supplies storage",
    },
    {
        id: "room-4",
        name: "AV Room",
        floorId: "floor-1",
        type: "Media",
        capacity: 30,
        description: "Audio-visual equipment room",
    },
    // First Floor
    {
        id: "room-5",
        name: "Classroom 101",
        floorId: "floor-2",
        type: "Classroom",
        capacity: 35,
        description: "General classroom",
    },
    {
        id: "room-6",
        name: "Classroom 102",
        floorId: "floor-2",
        type: "Classroom",
        capacity: 35,
        description: "General classroom",
    },
    {
        id: "room-7",
        name: "Library",
        floorId: "floor-2",
        type: "Library",
        capacity: 100,
        description: "Main school library",
    },
    {
        id: "room-8",
        name: "IT Lab",
        floorId: "floor-2",
        type: "Lab",
        capacity: 30,
        description: "Computer and IT laboratory",
    },
    // Second Floor
    {
        id: "room-9",
        name: "Science Lab",
        floorId: "floor-3",
        type: "Lab",
        capacity: 30,
        description: "General science laboratory",
    },
    {
        id: "room-10",
        name: "Biology Lab",
        floorId: "floor-3",
        type: "Lab",
        capacity: 30,
        description: "Biology laboratory",
    },
    {
        id: "room-11",
        name: "Chemistry Lab",
        floorId: "floor-3",
        type: "Lab",
        capacity: 30,
        description: "Chemistry laboratory",
    },
    {
        id: "room-12",
        name: "Physics Lab",
        floorId: "floor-3",
        type: "Lab",
        capacity: 30,
        description: "Physics laboratory",
    },
    // Third Floor
    {
        id: "room-13",
        name: "Art Room",
        floorId: "floor-4",
        type: "Art",
        capacity: 25,
        description: "Art and crafts studio",
    },
    {
        id: "room-14",
        name: "Music Studio",
        floorId: "floor-4",
        type: "Music",
        capacity: 20,
        description: "Music practice room",
    },
]

export const inventoryItems: InventoryItem[] = [
    {
        id: "1",
        name: "Dell Laptops",
        category: "Electronics",
        quantity: 45,
        status: "available",
        location: "IT Lab",
        lastUpdated: "2026-01-05",
        value: 15000,
        floorId: "floor-2",
        roomId: "room-8",
    },
    {
        id: "2",
        name: "Projectors",
        category: "Electronics",
        quantity: 12,
        status: "available",
        location: "AV Room",
        lastUpdated: "2026-01-04",
        value: 9600,
        floorId: "floor-1",
        roomId: "room-4",
    },
    {
        id: "3",
        name: "Whiteboard Markers",
        category: "Supplies",
        quantity: 8,
        status: "low-stock",
        location: "Storage A",
        lastUpdated: "2026-01-06",
        value: 120,
        floorId: "floor-1",
        roomId: "room-3",
    },
    {
        id: "4",
        name: "Science Lab Kits",
        category: "Lab Equipment",
        quantity: 0,
        status: "out-of-stock",
        location: "Science Lab",
        lastUpdated: "2026-01-03",
        value: 0,
        floorId: "floor-3",
        roomId: "room-9",
    },
    {
        id: "5",
        name: "Student Desks",
        category: "Furniture",
        quantity: 200,
        status: "available",
        location: "Classrooms",
        lastUpdated: "2026-01-02",
        value: 5000,
        floorId: "floor-2",
        roomId: "room-5",
    },
    {
        id: "6",
        name: "Library Books",
        category: "Books",
        quantity: 1500,
        status: "available",
        location: "Library",
        lastUpdated: "2026-01-01",
        value: 10000,
        floorId: "floor-2",
        roomId: "room-7",
    },
    {
        id: "7",
        name: "Printer Paper (Reams)",
        category: "Supplies",
        quantity: 15,
        status: "low-stock",
        location: "Admin Office",
        lastUpdated: "2026-01-06",
        value: 225,
        floorId: "floor-1",
        roomId: "room-1",
    },
    {
        id: "8",
        name: "Basketball Equipment",
        category: "Sports",
        quantity: 25,
        status: "available",
        location: "Gym",
        lastUpdated: "2026-01-04",
        value: 1500,
        floorId: "floor-1",
        roomId: "room-2",
    },
    {
        id: "9",
        name: "Microscopes",
        category: "Lab Equipment",
        quantity: 3,
        status: "low-stock",
        location: "Biology Lab",
        lastUpdated: "2026-01-05",
        value: 4000,
        floorId: "floor-3",
        roomId: "room-10",
    },
    {
        id: "10",
        name: "Art Supplies Kit",
        category: "Supplies",
        quantity: 30,
        status: "available",
        location: "Art Room",
        lastUpdated: "2026-01-03",
        value: 1000,
        floorId: "floor-4",
        roomId: "room-13",
    },
    {
        id: "11",
        name: "Smartboards",
        category: "Electronics",
        quantity: 8,
        status: "available",
        location: "Classrooms",
        lastUpdated: "2026-01-02",
        value: 20000,
        floorId: "floor-2",
        roomId: "room-6",
    },
    {
        id: "12",
        name: "Chemistry Chemicals",
        category: "Lab Equipment",
        quantity: 2,
        status: "low-stock",
        location: "Chemistry Lab",
        lastUpdated: "2026-01-06",
        value: 800,
        floorId: "floor-3",
        roomId: "room-11",
    },
    {
        id: "13",
        name: "Musical Instruments",
        category: "Music",
        quantity: 15,
        status: "available",
        location: "Music Studio",
        lastUpdated: "2026-01-05",
        value: 8000,
        floorId: "floor-4",
        roomId: "room-14",
    },
    {
        id: "14",
        name: "Physics Lab Equipment",
        category: "Lab Equipment",
        quantity: 10,
        status: "available",
        location: "Physics Lab",
        lastUpdated: "2026-01-04",
        value: 8000,
        floorId: "floor-3",
        roomId: "room-12",
    },
]

export const categories: Category[] = [
    { name: "Electronics", count: 65, value: 78600 },
    { name: "Furniture", count: 200, value: 30000 },
    { name: "Supplies", count: 53, value: 1845 },
    { name: "Lab Equipment", count: 5, value: 5300 },
    { name: "Books", count: 1500, value: 22500 },
    { name: "Sports", count: 25, value: 2500 },
    { name: "Music", count: 15, value: 8500 },
]

export const monthlyData = [
    { month: "Aug", incoming: 45, outgoing: 12 },
    { month: "Sep", incoming: 32, outgoing: 28 },
    { month: "Oct", incoming: 18, outgoing: 35 },
    { month: "Nov", incoming: 52, outgoing: 22 },
    { month: "Dec", incoming: 28, outgoing: 15 },
    { month: "Jan", incoming: 38, outgoing: 20 },
]

export const categoryDistribution = [
    { name: "Electronics", value: 35, fill: "hsl(145, 70%, 45%)" },
    { name: "Furniture", value: 25, fill: "hsl(220, 60%, 50%)" },
    { name: "Supplies", value: 15, fill: "hsl(50, 70%, 55%)" },
    { name: "Lab Equipment", value: 10, fill: "hsl(25, 80%, 50%)" },
    { name: "Books", value: 10, fill: "hsl(280, 60%, 50%)" },
    { name: "Sports", value: 5, fill: "hsl(180, 60%, 45%)" },
    { name: "Music", value: 5, fill: "hsl(300, 60%, 50%)" },
]
