export type FoodCategory = 'All' | 'Quick Bites' | 'Hot Meals' | 'Beverages' | 'Healthy & Salads' | 'Desserts';

export type KitchenStationType = 'PREP' | 'GRILL_WOK' | 'ASSEMBLY_PACK' | 'READY_LOCKER' | 'COLLECTED' | 'EXPIRED';

export type OrderStatus = 'QUEUED' | 'PREPARING' | 'READY_FOR_PICKUP' | 'COLLECTED' | 'EXPIRED' | 'CANCELLED';

export type UserRole = 'STUDENT' | 'KITCHEN' | 'ADMIN';

export type AccountRole = 'STUDENT' | 'STAFF' | 'MANAGER';

export interface UserProfile {
  id: string;
  name: string;
  role: AccountRole;
  email: string;
  rollOrEmpId: string;
}

export interface MenuItem {
  id: string;
  name: string;
  category: FoodCategory;
  price: number;
  originalPrice?: number;
  isFlashDiscount?: boolean;
  flashDiscountEndsAt?: string;
  image: string;
  prepTimeMinutes: number;
  station: 'GRILL' | 'WOK' | 'FRYER' | 'BEVERAGE' | 'ASSEMBLY' | 'BAKERY';
  isAvailable: boolean;
  stock: number;
  maxDailyStock: number;
  isVeg: boolean;
  isSpicy?: boolean;
  calories: number;
  description: string;
  popularityScore: number;
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
}

export interface TimeSlot {
  id: string;
  label: string;
  startTime: string; // e.g. "12:30 PM"
  endTime: string;   // e.g. "12:45 PM"
  maxCapacity: number; // Max items kitchen can cook in this bucket
  currentLoad: number; // Current items already booked
  isPeak: boolean;
  isAvailable: boolean;
  lectureBreakTag?: string; // e.g. "CS-101 Break"
}

export interface OrderItem {
  menuItemId: string;
  name: string;
  quantity: number;
  price: number;
  station: string;
  image: string;
}

export interface Order {
  id: string;
  token: string;           // E.g., "B-42"
  studentName: string;
  studentId: string;
  studentPhone?: string;
  timeSlotId: string;
  slotLabel: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  currentStation: KitchenStationType;
  placedAt: string;        // ISO string or formatted
  estimatedReadyTime: string;
  readyAt?: string;
  collectedAt?: string;
  qrCodeHash: string;
  lockerNumber: string;    // e.g. "Shelf 04" or "Counter B"
  isBulk?: boolean;
  specialInstructions?: string;
  expiryWarningSent?: boolean;
}

export interface BulkOrderRequest {
  id: string;
  requesterName: string;
  department: string;
  eventName: string;
  eventDate: string;
  pickupTime: string;
  items: { name: string; quantity: number; price: number }[];
  totalAmount: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  depositPaid: boolean;
  requestedAt: string;
  notes?: string;
}

export interface WasteRecord {
  id: string;
  orderId: string;
  token: string;
  itemsSummary: string;
  totalLostValue: number;
  reason: 'UNCOLLECTED_TIMEOUT' | 'SPOILED_IN_KITCHEN' | 'STUDENT_CANCELLED';
  timestamp: string;
  studentName: string;
}

export interface RushHourPoint {
  time: string;
  hourFraction: number; // 12.0, 12.5 etc
  crowdLevel: number;   // 0 to 100
  status: 'OPTIMAL' | 'MODERATE' | 'HEAVY_RUSH' | 'CRITICAL_PEAK';
  eventNote?: string;
}

export interface ClassScheduleItem {
  id: string;
  courseCode: string;
  courseName: string;
  room: string;
  endTime: string;
  suggestedSlotId: string;
}
