import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  MenuItem,
  CartItem,
  TimeSlot,
  Order,
  UserRole,
  KitchenStationType,
  BulkOrderRequest,
  WasteRecord,
  AccountRole,
  UserProfile
} from '../types';
import {
  INITIAL_MENU_ITEMS,
  INITIAL_TIME_SLOTS,
  INITIAL_ORDERS,
  INITIAL_BULK_REQUESTS,
  INITIAL_WASTE_RECORDS,
  calculateDynamicETA
} from '../services/queueEngine';
import { soundFx } from '../services/audioService';
import confetti from 'canvas-confetti';

export const DEMO_USERS: Record<AccountRole, UserProfile> = {
  STUDENT: {
    id: 'usr-student-01',
    name: 'Khushi S.',
    role: 'STUDENT',
    email: 'khushi.cs24@campus.edu',
    rollOrEmpId: '2024CS082'
  },
  STAFF: {
    id: 'usr-staff-01',
    name: 'Chef Vikram',
    role: 'STAFF',
    email: 'vikram.kitchen@canteen.edu',
    rollOrEmpId: 'EMP-CHEF-04'
  },
  MANAGER: {
    id: 'usr-mgr-01',
    name: 'Dr. Sengupta',
    role: 'MANAGER',
    email: 'sengupta.admin@campus.edu',
    rollOrEmpId: 'ADMIN-MGR-01'
  }
};

interface CanteenContextType {
  // State
  role: UserRole;
  setRole: (role: UserRole) => void;
  currentUser: UserProfile;
  switchUserAccount: (role: AccountRole) => void;
  isKitchenAuthorized: boolean;
  menuItems: MenuItem[];
  timeSlots: TimeSlot[];
  orders: Order[];
  cart: CartItem[];
  selectedSlotId: string;
  activeOrder: Order | null;
  bulkRequests: BulkOrderRequest[];
  wasteRecords: WasteRecord[];
  isMuted: boolean;
  activeWorkload: number;
  currentClock: string;

  // Actions
  addToCart: (item: MenuItem) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, delta: number) => void;
  clearCart: () => void;
  setSelectedSlotId: (slotId: string) => void;
  placeOrder: (studentName: string, studentId: string, notes?: string) => Order | null;
  advanceOrderStatus: (orderId: string, targetStation: KitchenStationType) => void;
  cancelOrder: (orderId: string, reason?: string) => void;
  toggleItemStockKillSwitch: (itemId: string) => void;
  updateStockDirectly: (itemId: string, newStock: number) => void;
  approveBulkOrder: (id: string) => void;
  rejectBulkOrder: (id: string) => void;
  addBulkOrderRequest: (req: Omit<BulkOrderRequest, 'id' | 'requestedAt' | 'status' | 'depositPaid'>) => void;
  simulateRushSurge: () => void;
  simulateTimeoutWaste: (orderId: string) => void;
  toggleMute: () => void;
  setActiveOrder: (order: Order | null) => void;
  resetAllData: () => void;
}

const CanteenContext = createContext<CanteenContextType | undefined>(undefined);

const STORAGE_KEYS = {
  MENU: 'bytebite_menu_v2',
  SLOTS: 'bytebite_slots_v2',
  ORDERS: 'bytebite_orders_v2',
  BULK: 'bytebite_bulk_v2',
  WASTE: 'bytebite_waste_v2',
  ACTIVE_ORDER_ID: 'bytebite_active_order_id',
  CURRENT_USER_ROLE: 'bytebite_user_role_v2'
};

export const CanteenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('STUDENT');
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const savedRole = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ROLE) as AccountRole | null;
    return savedRole && DEMO_USERS[savedRole] ? DEMO_USERS[savedRole] : DEMO_USERS.STUDENT;
  });

  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MENU);
    return saved ? JSON.parse(saved) : INITIAL_MENU_ITEMS;
  });

  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SLOTS);
    return saved ? JSON.parse(saved) : INITIAL_TIME_SLOTS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [bulkRequests, setBulkRequests] = useState<BulkOrderRequest[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BULK);
    return saved ? JSON.parse(saved) : INITIAL_BULK_REQUESTS;
  });

  const [wasteRecords, setWasteRecords] = useState<WasteRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WASTE);
    return saved ? JSON.parse(saved) : INITIAL_WASTE_RECORDS;
  });

  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState<string>('slot-2');
  const [activeOrderId, setActiveOrderId] = useState<string | null>(() => {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_ORDER_ID) || 'ord-101';
  });

  const [isMuted, setIsMuted] = useState(false);
  const [currentClock, setCurrentClock] = useState('12:24 PM');

  // Check if current user is authorized to view kitchen
  const isKitchenAuthorized = currentUser.role === 'STAFF' || currentUser.role === 'MANAGER';

  const switchUserAccount = (newRole: AccountRole) => {
    const nextUser = DEMO_USERS[newRole];
    setCurrentUser(nextUser);
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ROLE, newRole);
    soundFx.playTap();
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SLOTS, JSON.stringify(timeSlots));
  }, [timeSlots]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BULK, JSON.stringify(bulkRequests));
  }, [bulkRequests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WASTE, JSON.stringify(wasteRecords));
  }, [wasteRecords]);

  useEffect(() => {
    if (activeOrderId) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_ORDER_ID, activeOrderId);
    }
  }, [activeOrderId]);

  // Live Simulated Clock updates
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setCurrentClock(timeStr);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  // Multi-tab BroadcastChannel sync for real-time KDS <-> Student communication
  useEffect(() => {
    let bc: BroadcastChannel | null = null;
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        bc = new BroadcastChannel('bytebite_realtime_bus');
        bc.onmessage = (event) => {
          if (event.data?.type === 'SYNC_STATE') {
            const savedOrders = localStorage.getItem(STORAGE_KEYS.ORDERS);
            const savedMenu = localStorage.getItem(STORAGE_KEYS.MENU);
            if (savedOrders) setOrders(JSON.parse(savedOrders));
            if (savedMenu) setMenuItems(JSON.parse(savedMenu));
          }
        };
      }
    } catch {
      // Broadcast fallback
    }
    return () => {
      bc?.close();
    };
  }, []);

  const broadcastChange = () => {
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        const bc = new BroadcastChannel('bytebite_realtime_bus');
        bc.postMessage({ type: 'SYNC_STATE', timestamp: Date.now() });
        bc.close();
      }
    } catch {
      // ignore
    }
  };

  // Active items currently cooking in kitchen
  const activeWorkload = orders
    .filter(o => o.status === 'QUEUED' || o.status === 'PREPARING')
    .reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0), 0);

  const activeOrder = orders.find(o => o.id === activeOrderId) || orders[0] || null;

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundFx.isMuted = next;
  };

  // Cart Handlers
  const addToCart = (item: MenuItem) => {
    if (!item.isAvailable || item.stock <= 0) {
      soundFx.playWarning();
      return;
    }
    soundFx.playTap();
    setCart(prev => {
      const existing = prev.find(c => c.item.id === item.id);
      if (existing) {
        if (existing.quantity >= item.stock) {
          soundFx.playWarning();
          return prev;
        }
        return prev.map(c => c.item.id === item.id ? { ...c, quantity: c.quantity + 1 } : c);
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    soundFx.playTap();
    setCart(prev => prev.filter(c => c.item.id !== itemId));
  };

  const updateCartQuantity = (itemId: string, delta: number) => {
    soundFx.playTap();
    setCart(prev => {
      return prev.map(c => {
        if (c.item.id === itemId) {
          const newQty = c.quantity + delta;
          if (newQty <= 0) return null;
          if (newQty > c.item.stock) {
            soundFx.playWarning();
            return c;
          }
          return { ...c, quantity: newQty };
        }
        return c;
      }).filter(Boolean) as CartItem[];
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  // Place Order
  const placeOrder = (studentName: string, studentId: string, notes?: string): Order | null => {
    if (cart.length === 0) return null;

    const totalCartItems = cart.reduce((acc, c) => acc + c.quantity, 0);
    const targetSlot = timeSlots.find(s => s.id === selectedSlotId) || timeSlots[0];

    // Check slot availability
    if (targetSlot.currentLoad + totalCartItems > targetSlot.maxCapacity) {
      soundFx.playWarning();
      alert(`Selected slot (${targetSlot.label}) is full! Please choose another time slot.`);
      return null;
    }

    const { prepMinutes } = calculateDynamicETA(cart, activeWorkload);
    const orderTotal = cart.reduce((sum, c) => sum + (c.item.price * c.quantity), 0);
    const tokenNumber = `B-${Math.floor(10 + Math.random() * 90)}`;
    const randomShelf = `Shelf 0${Math.floor(1 + Math.random() * 6)}`;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      token: tokenNumber,
      studentName: studentName || currentUser.name,
      studentId: studentId || currentUser.rollOrEmpId,
      studentPhone: '+91 98765 00123',
      timeSlotId: targetSlot.id,
      slotLabel: targetSlot.label,
      items: cart.map(c => ({
        menuItemId: c.item.id,
        name: c.item.name,
        quantity: c.quantity,
        price: c.item.price,
        station: c.item.station,
        image: c.item.image
      })),
      totalAmount: orderTotal,
      status: 'QUEUED',
      currentStation: 'PREP',
      placedAt: currentClock,
      estimatedReadyTime: `${prepMinutes}m (${targetSlot.startTime})`,
      qrCodeHash: `BYTEBITE-${tokenNumber}-${Date.now().toString(36).toUpperCase()}`,
      lockerNumber: randomShelf,
      specialInstructions: notes
    };

    // Decrement stock atomically
    setMenuItems(prev => prev.map(m => {
      const inCart = cart.find(c => c.item.id === m.id);
      if (inCart) {
        const nextStock = Math.max(0, m.stock - inCart.quantity);
        return {
          ...m,
          stock: nextStock,
          isAvailable: nextStock > 0
        };
      }
      return m;
    }));

    // Update slot workload
    setTimeSlots(prev => prev.map(s => {
      if (s.id === targetSlot.id) {
        const newLoad = s.currentLoad + totalCartItems;
        return {
          ...s,
          currentLoad: newLoad,
          isAvailable: newLoad < s.maxCapacity
        };
      }
      return s;
    }));

    setOrders(prev => [newOrder, ...prev]);
    setActiveOrderId(newOrder.id);
    clearCart();

    soundFx.playOrderPlacedChime();
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.7 }
    });

    broadcastChange();
    return newOrder;
  };

  // KDS Workflow Transitions
  const advanceOrderStatus = (orderId: string, targetStation: KitchenStationType) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        let newStatus: Order['status'] = o.status;
        let readyAt = o.readyAt;
        let collectedAt = o.collectedAt;

        if (targetStation === 'PREP') {
          newStatus = 'QUEUED';
        } else if (targetStation === 'GRILL_WOK' || targetStation === 'ASSEMBLY_PACK') {
          newStatus = 'PREPARING';
        } else if (targetStation === 'READY_LOCKER') {
          newStatus = 'READY_FOR_PICKUP';
          readyAt = currentClock;
          soundFx.playOrderReady();
          confetti({
            particleCount: 50,
            spread: 50,
            origin: { y: 0.5 }
          });
        } else if (targetStation === 'COLLECTED') {
          newStatus = 'COLLECTED';
          collectedAt = currentClock;
          soundFx.playScannerSuccess();
        } else if (targetStation === 'EXPIRED') {
          newStatus = 'EXPIRED';
        }

        return {
          ...o,
          currentStation: targetStation,
          status: newStatus,
          readyAt,
          collectedAt
        };
      }
      return o;
    }));

    broadcastChange();
  };

  const cancelOrder = (orderId: string, reason?: string) => {
    const target = orders.find(o => o.id === orderId);
    if (!target) return;

    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'CANCELLED' } : o));

    if (reason) {
      setWasteRecords(prev => [
        {
          id: `w-${Date.now()}`,
          orderId: target.id,
          token: target.token,
          itemsSummary: target.items.map(i => `${i.quantity}x ${i.name}`).join(', '),
          totalLostValue: target.totalAmount,
          reason: 'STUDENT_CANCELLED',
          timestamp: currentClock,
          studentName: `${target.studentName} (${reason})`
        },
        ...prev
      ]);
    }
    broadcastChange();
  };

  // Stock Out Toggle (86-ing items from kitchen)
  const toggleItemStockKillSwitch = (itemId: string) => {
    setMenuItems(prev => prev.map(m => {
      if (m.id === itemId) {
        const nextAvail = !m.isAvailable;
        if (!nextAvail) soundFx.playWarning();
        else soundFx.playTap();
        return {
          ...m,
          isAvailable: nextAvail,
          stock: nextAvail ? (m.stock === 0 ? 10 : m.stock) : 0
        };
      }
      return m;
    }));
    broadcastChange();
  };

  const updateStockDirectly = (itemId: string, newStock: number) => {
    setMenuItems(prev => prev.map(m => {
      if (m.id === itemId) {
        return {
          ...m,
          stock: Math.max(0, newStock),
          isAvailable: newStock > 0
        };
      }
      return m;
    }));
    broadcastChange();
  };

  // Bulk Orders
  const approveBulkOrder = (id: string) => {
    setBulkRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'APPROVED' } : r));
    soundFx.playTap();
  };

  const rejectBulkOrder = (id: string) => {
    setBulkRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'REJECTED' } : r));
    soundFx.playTap();
  };

  const addBulkOrderRequest = (req: Omit<BulkOrderRequest, 'id' | 'requestedAt' | 'status' | 'depositPaid'>) => {
    const newReq: BulkOrderRequest = {
      ...req,
      id: `bulk-${Date.now()}`,
      status: 'PENDING',
      depositPaid: true,
      requestedAt: currentClock
    };
    setBulkRequests(prev => [newReq, ...prev]);
    soundFx.playChime();
  };

  // Simulation Triggers for Live Demos
  const simulateRushSurge = () => {
    setTimeSlots(prev => prev.map((s, idx) => {
      if (idx === 1 || idx === 2) {
        return { ...s, currentLoad: s.maxCapacity, isAvailable: false, isPeak: true };
      }
      return s;
    }));
    soundFx.playKitchenAlert();
  };

  const simulateTimeoutWaste = (orderId: string) => {
    const target = orders.find(o => o.id === orderId);
    if (!target) return;

    advanceOrderStatus(orderId, 'EXPIRED');
    setWasteRecords(prev => [
      {
        id: `w-${Date.now()}`,
        orderId: target.id,
        token: target.token,
        itemsSummary: target.items.map(i => `${i.quantity}x ${i.name}`).join(', '),
        totalLostValue: target.totalAmount,
        reason: 'UNCOLLECTED_TIMEOUT',
        timestamp: currentClock,
        studentName: `${target.studentName} (Timeout >20m)`
      },
      ...prev
    ]);
    soundFx.playWarning();
  };

  const resetAllData = () => {
    localStorage.clear();
    setMenuItems(INITIAL_MENU_ITEMS);
    setTimeSlots(INITIAL_TIME_SLOTS);
    setOrders(INITIAL_ORDERS);
    setBulkRequests(INITIAL_BULK_REQUESTS);
    setWasteRecords(INITIAL_WASTE_RECORDS);
    setCart([]);
    setActiveOrderId(INITIAL_ORDERS[0].id);
    setCurrentUser(DEMO_USERS.STUDENT);
    soundFx.playTap();
  };

  return (
    <CanteenContext.Provider
      value={{
        role,
        setRole,
        currentUser,
        switchUserAccount,
        isKitchenAuthorized,
        menuItems,
        timeSlots,
        orders,
        cart,
        selectedSlotId,
        activeOrder,
        bulkRequests,
        wasteRecords,
        isMuted,
        activeWorkload,
        currentClock,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        setSelectedSlotId,
        placeOrder,
        advanceOrderStatus,
        cancelOrder,
        toggleItemStockKillSwitch,
        updateStockDirectly,
        approveBulkOrder,
        rejectBulkOrder,
        addBulkOrderRequest,
        simulateRushSurge,
        simulateTimeoutWaste,
        toggleMute,
        setActiveOrder: (ord) => {
          if (ord) setActiveOrderId(ord.id);
        },
        resetAllData
      }}
    >
      {children}
    </CanteenContext.Provider>
  );
};

export const useCanteen = () => {
  const context = useContext(CanteenContext);
  if (!context) {
    throw new Error('useCanteen must be used within a CanteenProvider');
  }
  return context;
};
