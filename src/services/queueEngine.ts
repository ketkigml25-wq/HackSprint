import type {
  MenuItem,
  TimeSlot,
  Order,
  RushHourPoint,
  ClassScheduleItem,
  WasteRecord,
  BulkOrderRequest
} from '../types';

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  {
    id: 'item-1',
    name: 'Peri-Peri Paneer Smash Burger',
    category: 'Hot Meals',
    price: 120,
    originalPrice: 150,
    isFlashDiscount: true,
    flashDiscountEndsAt: '15 mins',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
    prepTimeMinutes: 7,
    station: 'GRILL',
    isAvailable: true,
    stock: 14,
    maxDailyStock: 50,
    isVeg: true,
    isSpicy: true,
    calories: 460,
    description: 'Crispy seasoned paneer patty tossed in fiery peri-peri glaze with mint coleslaw in toasted brioche.',
    popularityScore: 98
  },
  {
    id: 'item-2',
    name: 'Schezwan Crispy Chicken Wrap',
    category: 'Hot Meals',
    price: 140,
    image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600&auto=format&fit=crop&q=80',
    prepTimeMinutes: 6,
    station: 'FRYER',
    isAvailable: true,
    stock: 9,
    maxDailyStock: 40,
    isVeg: false,
    isSpicy: true,
    calories: 520,
    description: 'Golden chicken tenders drenched in hot schezwan sauce wrapped with crunchy iceberg lettuce.',
    popularityScore: 94
  },
  {
    id: 'item-3',
    name: 'Truffle & Herb Grilled Sandwich',
    category: 'Quick Bites',
    price: 95,
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80',
    prepTimeMinutes: 5,
    station: 'GRILL',
    isAvailable: true,
    stock: 18,
    maxDailyStock: 60,
    isVeg: true,
    calories: 380,
    description: 'Triple-cheese sourdough melt infused with aromatic Italian truffle butter and fresh basil.',
    popularityScore: 91
  },
  {
    id: 'item-4',
    name: 'Kolkata Style Egg-Cheese Roll',
    category: 'Quick Bites',
    price: 85,
    image: 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?w=600&auto=format&fit=crop&q=80',
    prepTimeMinutes: 5,
    station: 'GRILL',
    isAvailable: true,
    stock: 6,
    maxDailyStock: 35,
    isVeg: false,
    calories: 410,
    description: 'Flaky layered paratha lined with double farm eggs, melted cheddar, spiced onions and lime juice.',
    popularityScore: 89
  },
  {
    id: 'item-5',
    name: 'Cold Brew Hazelnut Frappé',
    category: 'Beverages',
    price: 75,
    image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=600&auto=format&fit=crop&q=80',
    prepTimeMinutes: 2,
    station: 'BEVERAGE',
    isAvailable: true,
    stock: 25,
    maxDailyStock: 80,
    isVeg: true,
    calories: 210,
    description: '18-hour steeped Arabica cold brew blended with roasted hazelnut cream and dark cacao nibs.',
    popularityScore: 96
  },
  {
    id: 'item-6',
    name: 'Fresh Dragonfruit Basil Lemonade',
    category: 'Beverages',
    price: 60,
    originalPrice: 75,
    isFlashDiscount: true,
    flashDiscountEndsAt: '25 mins',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80',
    prepTimeMinutes: 2,
    station: 'BEVERAGE',
    isAvailable: true,
    stock: 8,
    maxDailyStock: 30,
    isVeg: true,
    calories: 110,
    description: 'Electrifying pink dragonfruit crushed with organic sweet basil, fresh lemon, and sparkling soda.',
    popularityScore: 88
  },
  {
    id: 'item-7',
    name: 'Mediterranean Falafel Hummus Bowl',
    category: 'Healthy & Salads',
    price: 135,
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80',
    prepTimeMinutes: 4,
    station: 'ASSEMBLY',
    isAvailable: true,
    stock: 12,
    maxDailyStock: 30,
    isVeg: true,
    calories: 340,
    description: 'Herb falafel crisps on garlic hummus, quinoa, pickled sumac onions, cherry tomatoes, and tahini drizzle.',
    popularityScore: 85
  },
  {
    id: 'item-8',
    name: 'Belgian Dark Chocolate Lava Tart',
    category: 'Desserts',
    price: 80,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80',
    prepTimeMinutes: 3,
    station: 'BAKERY',
    isAvailable: true,
    stock: 5,
    maxDailyStock: 25,
    isVeg: true,
    calories: 390,
    description: 'Warm shortcrust pastry bursting with molten 70% Belgian dark chocolate ganache.',
    popularityScore: 92
  }
];

export const INITIAL_TIME_SLOTS: TimeSlot[] = [
  {
    id: 'slot-1',
    label: '12:00 PM - 12:15 PM',
    startTime: '12:00 PM',
    endTime: '12:15 PM',
    maxCapacity: 20,
    currentLoad: 6,
    isPeak: false,
    isAvailable: true,
    lectureBreakTag: 'Early Bird Slot'
  },
  {
    id: 'slot-2',
    label: '12:15 PM - 12:30 PM',
    startTime: '12:15 PM',
    endTime: '12:30 PM',
    maxCapacity: 25,
    currentLoad: 18,
    isPeak: true,
    isAvailable: true,
    lectureBreakTag: 'EE-201 Class Ends'
  },
  {
    id: 'slot-3',
    label: '12:30 PM - 12:45 PM',
    startTime: '12:30 PM',
    endTime: '12:45 PM',
    maxCapacity: 30,
    currentLoad: 28,
    isPeak: true,
    isAvailable: true,
    lectureBreakTag: '⚡ CS-101 Major Break (Surge)'
  },
  {
    id: 'slot-4',
    label: '12:45 PM - 01:00 PM',
    startTime: '12:45 PM',
    endTime: '01:00 PM',
    maxCapacity: 30,
    currentLoad: 30,
    isPeak: true,
    isAvailable: false, // FULL
    lectureBreakTag: '⚡ Mech Core Break (FULL)'
  },
  {
    id: 'slot-5',
    label: '01:00 PM - 01:15 PM',
    startTime: '01:00 PM',
    endTime: '01:15 PM',
    maxCapacity: 25,
    currentLoad: 12,
    isPeak: false,
    isAvailable: true,
    lectureBreakTag: 'Post-Lunch Window'
  },
  {
    id: 'slot-6',
    label: '01:15 PM - 01:30 PM',
    startTime: '01:15 PM',
    endTime: '01:30 PM',
    maxCapacity: 20,
    currentLoad: 5,
    isPeak: false,
    isAvailable: true,
    lectureBreakTag: 'Free Slot'
  }
];

export const CAMPUS_RUSH_DATA: RushHourPoint[] = [
  { time: '11:30 AM', hourFraction: 11.5, crowdLevel: 15, status: 'OPTIMAL', eventNote: 'Quiet campus prep' },
  { time: '12:00 PM', hourFraction: 12.0, crowdLevel: 42, status: 'MODERATE', eventNote: 'First lunch batches arrive' },
  { time: '12:30 PM', hourFraction: 12.5, crowdLevel: 92, status: 'CRITICAL_PEAK', eventNote: '⚡ CS-101 & EE-201 combined bell' },
  { time: '01:00 PM', hourFraction: 13.0, crowdLevel: 85, status: 'HEAVY_RUSH', eventNote: 'Mechanical Dept break' },
  { time: '01:30 PM', hourFraction: 13.5, crowdLevel: 35, status: 'MODERATE', eventNote: 'Afternoon classes resume' },
  { time: '02:00 PM', hourFraction: 14.0, crowdLevel: 18, status: 'OPTIMAL', eventNote: 'Smooth pickup speed' }
];

export const CLASS_SCHEDULE_PRESETS: ClassScheduleItem[] = [
  { id: 'c1', courseCode: 'CS-101', courseName: 'Data Structures & Algorithms', room: 'LHC-104', endTime: '12:30 PM', suggestedSlotId: 'slot-3' },
  { id: 'c2', courseCode: 'EE-201', courseName: 'Signals & Systems', room: 'EEE-202', endTime: '12:15 PM', suggestedSlotId: 'slot-2' },
  { id: 'c3', courseCode: 'ME-304', courseName: 'Thermodynamics & Heat Transfer', room: 'MECH-301', endTime: '12:45 PM', suggestedSlotId: 'slot-5' },
  { id: 'c4', courseCode: 'HS-105', courseName: 'Design Thinking & Innovation', room: 'AUD-2', endTime: '01:00 PM', suggestedSlotId: 'slot-6' }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-101',
    token: 'B-14',
    studentName: 'Aarav Sharma',
    studentId: '2023CS042',
    studentPhone: '+91 98765 43210',
    timeSlotId: 'slot-2',
    slotLabel: '12:15 PM - 12:30 PM',
    items: [
      { menuItemId: 'item-1', name: 'Peri-Peri Paneer Smash Burger', quantity: 1, price: 120, station: 'GRILL', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80' },
      { menuItemId: 'item-5', name: 'Cold Brew Hazelnut Frappé', quantity: 1, price: 75, station: 'BEVERAGE', image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=600&auto=format&fit=crop&q=80' }
    ],
    totalAmount: 195,
    status: 'READY_FOR_PICKUP',
    currentStation: 'READY_LOCKER',
    placedAt: '12:10 PM',
    estimatedReadyTime: '12:20 PM',
    readyAt: '12:18 PM',
    qrCodeHash: 'BB-B14-SECURE-9842',
    lockerNumber: 'Shelf 03'
  },
  {
    id: 'ord-102',
    token: 'B-15',
    studentName: 'Priya Patel',
    studentId: '2023EE118',
    studentPhone: '+91 98111 22334',
    timeSlotId: 'slot-3',
    slotLabel: '12:30 PM - 12:45 PM',
    items: [
      { menuItemId: 'item-2', name: 'Schezwan Crispy Chicken Wrap', quantity: 2, price: 140, station: 'FRYER', image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600&auto=format&fit=crop&q=80' }
    ],
    totalAmount: 280,
    status: 'PREPARING',
    currentStation: 'GRILL_WOK',
    placedAt: '12:16 PM',
    estimatedReadyTime: '12:32 PM',
    qrCodeHash: 'BB-B15-SECURE-7103',
    lockerNumber: 'Shelf 01'
  },
  {
    id: 'ord-103',
    token: 'B-16',
    studentName: 'Rohan Gupta',
    studentId: '2024ME089',
    studentPhone: '+91 99887 66554',
    timeSlotId: 'slot-3',
    slotLabel: '12:30 PM - 12:45 PM',
    items: [
      { menuItemId: 'item-3', name: 'Truffle & Herb Grilled Sandwich', quantity: 1, price: 95, station: 'GRILL', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80' },
      { menuItemId: 'item-6', name: 'Fresh Dragonfruit Basil Lemonade', quantity: 1, price: 60, station: 'BEVERAGE', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80' }
    ],
    totalAmount: 155,
    status: 'QUEUED',
    currentStation: 'PREP',
    placedAt: '12:22 PM',
    estimatedReadyTime: '12:38 PM',
    qrCodeHash: 'BB-B16-SECURE-3312',
    lockerNumber: 'Counter B'
  }
];

export const INITIAL_BULK_REQUESTS: BulkOrderRequest[] = [
  {
    id: 'bulk-01',
    requesterName: 'Prof. S. Sengupta (ACM Chapter)',
    department: 'Computer Science',
    eventName: 'Hackathon Midnight Recharge',
    eventDate: 'Today, 29 Aug',
    pickupTime: '06:00 PM',
    items: [
      { name: 'Peri-Peri Paneer Smash Burger', quantity: 25, price: 120 },
      { name: 'Cold Brew Hazelnut Frappé', quantity: 25, price: 75 }
    ],
    totalAmount: 4875,
    status: 'PENDING',
    depositPaid: true,
    requestedAt: '10:30 AM',
    notes: 'Require insulated packaging for lab delivery.'
  }
];

export const INITIAL_WASTE_RECORDS: WasteRecord[] = [
  {
    id: 'w-01',
    orderId: 'ord-094',
    token: 'A-89',
    itemsSummary: '1x Truffle Grilled Sandwich',
    totalLostValue: 95,
    reason: 'UNCOLLECTED_TIMEOUT',
    timestamp: '11:45 AM',
    studentName: 'Kavita Roy (Timeout >20m)'
  }
];

// Calculation Engines
export function calculateDynamicETA(
  cartItems: { item: MenuItem; quantity: number }[],
  activeQueueItemCount: number
): { prepMinutes: number; estimatedTimeStr: string } {
  if (cartItems.length === 0) {
    return { prepMinutes: 5, estimatedTimeStr: '5 mins' };
  }

  const maxItemBasePrep = Math.max(...cartItems.map(c => c.item.prepTimeMinutes));
  const totalItemCount = cartItems.reduce((acc, c) => acc + c.quantity, 0);

  // Queue workload penalty: 0.4 mins per active kitchen item in queue
  const queueDelay = Math.round(activeQueueItemCount * 0.4);
  const totalMinutes = maxItemBasePrep + Math.min(queueDelay, 15) + (totalItemCount > 3 ? 3 : 0);

  return {
    prepMinutes: totalMinutes,
    estimatedTimeStr: `${totalMinutes} mins`
  };
}

export function reverseCalculateKitchenDispatch(_targetPickupTimeStr: string, prepMinutes: number): string {
  return `Dispatch in kitchen at T - ${prepMinutes + 2} mins`;
}
