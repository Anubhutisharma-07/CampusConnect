import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Star,
  Clock,
  MapPin,
  Users,
  Heart,
  Leaf,
  Flame,
  Droplets,
  Wheat,
  Apple,
  Beef,
  Fish,
  Egg,
  Milk,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Plus,
  Minus,
  Check,
  X,
  ShoppingCart,
  Calculator,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Calendar,
  Bell,
  Bookmark,
  BookmarkCheck,
  ArrowUpRight,
  Zap,
  Target,
  Award,
  Sparkles,
  AlertCircle,
  Info,
  Utensils,
  Coffee,
  Pizza,
  Sandwich,
  Salad,
  Cookie,
  IceCreamCone,
  CupSoda,
  Salad as SaladIcon,
  Beef as BeefIcon,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────

interface MenuItem {
  id: string;
  name: string;
  vendor: string;
  category: "breakfast" | "lunch" | "dinner" | "snacks" | "beverages" | "desserts";
  price: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  dietary: string[];
  rating: number;
  reviews: number;
  image: string;
  available: boolean;
  popular: boolean;
  new: boolean;
}

interface Vendor {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  reviews: number;
  openTime: string;
  closeTime: string;
  isOpen: boolean;
  waitTime: string;
  image: string;
  color: string;
}

interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

interface NutritionGoal {
  label: string;
  current: number;
  target: number;
  unit: string;
  color: string;
  icon: React.ReactNode;
}

// ── Mock Data ──────────────────────────────────────────────────────────────

const VENDORS: Vendor[] = [
  { id: "v1", name: "Green Bowl", cuisine: "Healthy & Salads", rating: 4.7, reviews: 234, openTime: "7:00 AM", closeTime: "8:00 PM", isOpen: true, waitTime: "~5 min", image: "🥗", color: "bg-green-500" },
  { id: "v2", name: "Spice Route", cuisine: "Indian & Asian", rating: 4.5, reviews: 312, openTime: "11:00 AM", closeTime: "9:00 PM", isOpen: true, waitTime: "~12 min", image: "🍛", color: "bg-orange-500" },
  { id: "v3", name: "Slice & Dice", cuisine: "Pizza & Italian", rating: 4.3, reviews: 189, openTime: "10:00 AM", closeTime: "10:00 PM", isOpen: true, waitTime: "~8 min", image: "🍕", color: "bg-red-500" },
  { id: "v4", name: "Burger Barn", cuisine: "Burgers & Fries", rating: 4.2, reviews: 276, openTime: "11:00 AM", closeTime: "9:00 PM", isOpen: true, waitTime: "~10 min", image: "🍔", color: "bg-yellow-500" },
  { id: "v5", name: "Brew & Bean", cuisine: "Coffee & Bakery", rating: 4.8, reviews: 456, openTime: "6:00 AM", closeTime: "7:00 PM", isOpen: true, waitTime: "~3 min", image: "☕", color: "bg-amber-700" },
  { id: "v6", name: "Noodle House", cuisine: "Noodles & Ramen", rating: 4.6, reviews: 198, openTime: "11:00 AM", closeTime: "8:00 PM", isOpen: true, waitTime: "~7 min", image: "🍜", color: "bg-purple-500" },
];

const MENU_ITEMS: MenuItem[] = [
  // Breakfast
  { id: "1", name: "Avocado Toast", vendor: "Green Bowl", category: "breakfast", price: 120, calories: 320, protein: 12, carbs: 28, fat: 18, fiber: 8, dietary: ["vegetarian", "vegan"], rating: 4.8, reviews: 89, image: "🥑", available: true, popular: true, new: false },
  { id: "2", name: "Protein Pancakes", vendor: "Brew & Bean", category: "breakfast", price: 150, calories: 450, protein: 28, carbs: 52, fat: 14, fiber: 4, dietary: ["vegetarian"], rating: 4.6, reviews: 67, image: "🥞", available: true, popular: true, new: false },
  { id: "3", name: "Overnight Oats", vendor: "Green Bowl", category: "breakfast", price: 90, calories: 280, protein: 10, carbs: 42, fat: 8, fiber: 6, dietary: ["vegetarian", "vegan", "gluten-free"], rating: 4.5, reviews: 54, image: "🥣", available: true, popular: false, new: true },
  { id: "4", name: "Egg Burrito", vendor: "Slice & Dice", category: "breakfast", price: 130, calories: 380, protein: 22, carbs: 32, fat: 16, fiber: 3, dietary: [], rating: 4.4, reviews: 45, image: "🌯", available: true, popular: false, new: false },
  // Lunch
  { id: "5", name: "Grilled Chicken Salad", vendor: "Green Bowl", category: "lunch", price: 180, calories: 350, protein: 35, carbs: 15, fat: 18, fiber: 6, dietary: ["gluten-free"], rating: 4.7, reviews: 134, image: "🥗", available: true, popular: true, new: false },
  { id: "6", name: "Butter Chicken", vendor: "Spice Route", category: "lunch", price: 220, calories: 520, protein: 32, carbs: 45, fat: 22, fiber: 4, dietary: [], rating: 4.8, reviews: 189, image: "🍛", available: true, popular: true, new: false },
  { id: "7", name: "Veggie Buddha Bowl", vendor: "Green Bowl", category: "lunch", price: 160, calories: 380, protein: 15, carbs: 52, fat: 12, fiber: 10, dietary: ["vegetarian", "vegan"], rating: 4.6, reviews: 98, image: "🥙", available: true, popular: false, new: true },
  { id: "8", name: "Margherita Pizza", vendor: "Slice & Dice", category: "lunch", price: 200, calories: 580, protein: 24, carbs: 62, fat: 24, fiber: 3, dietary: ["vegetarian"], rating: 4.5, reviews: 156, image: "🍕", available: true, popular: true, new: false },
  { id: "9", name: "Chicken Burger", vendor: "Burger Barn", category: "lunch", price: 170, calories: 620, protein: 38, carbs: 48, fat: 30, fiber: 2, dietary: [], rating: 4.3, reviews: 145, image: "🍔", available: true, popular: true, new: false },
  { id: "10", name: "Pad Thai", vendor: "Noodle House", category: "lunch", price: 150, calories: 480, protein: 22, carbs: 58, fat: 16, fiber: 4, dietary: ["gluten-free"], rating: 4.6, reviews: 112, image: "🍜", available: true, popular: false, new: false },
  { id: "11", name: "Paneer Tikka", vendor: "Spice Route", category: "lunch", price: 190, calories: 420, protein: 25, carbs: 18, fat: 28, fiber: 3, dietary: ["vegetarian", "gluten-free"], rating: 4.7, reviews: 134, image: "🧀", available: true, popular: false, new: false },
  { id: "12", name: "Fish & Chips", vendor: "Burger Barn", category: "lunch", price: 240, calories: 580, protein: 32, carbs: 52, fat: 26, fiber: 2, dietary: [], rating: 4.4, reviews: 78, image: "🐟", available: true, popular: false, new: false },
  // Dinner
  { id: "13", name: "Grilled Salmon", vendor: "Green Bowl", category: "dinner", price: 280, calories: 420, protein: 42, carbs: 8, fat: 24, fiber: 4, dietary: ["gluten-free"], rating: 4.9, reviews: 67, image: "🐟", available: true, popular: true, new: false },
  { id: "14", name: "Biryani", vendor: "Spice Route", category: "dinner", price: 200, calories: 550, protein: 28, carbs: 68, fat: 18, fiber: 4, dietary: [], rating: 4.8, reviews: 198, image: "🍚", available: true, popular: true, new: false },
  { id: "15", name: "Pasta Primavera", vendor: "Slice & Dice", category: "dinner", price: 180, calories: 480, protein: 18, carbs: 62, fat: 16, fiber: 6, dietary: ["vegetarian"], rating: 4.5, reviews: 89, image: "🍝", available: true, popular: false, new: true },
  { id: "16", name: "Ramen Bowl", vendor: "Noodle House", category: "dinner", price: 170, calories: 520, protein: 24, carbs: 64, fat: 18, fiber: 4, dietary: [], rating: 4.7, reviews: 123, image: "🍜", available: true, popular: true, new: false },
  // Snacks
  { id: "17", name: "Protein Bar", vendor: "Green Bowl", category: "snacks", price: 80, calories: 220, protein: 20, carbs: 22, fat: 8, fiber: 3, dietary: ["vegetarian", "gluten-free"], rating: 4.3, reviews: 56, image: "🍫", available: true, popular: false, new: false },
  { id: "18", name: "Samosa (2 pcs)", vendor: "Spice Route", category: "snacks", price: 40, calories: 280, protein: 6, carbs: 32, fat: 14, fiber: 2, dietary: ["vegetarian", "vegan"], rating: 4.6, reviews: 178, image: "🥟", available: true, popular: true, new: false },
  { id: "19", name: "Garlic Bread", vendor: "Slice & Dice", category: "snacks", price: 60, calories: 180, protein: 5, carbs: 24, fat: 8, fiber: 1, dietary: ["vegetarian"], rating: 4.4, reviews: 89, image: "🍞", available: true, popular: false, new: false },
  { id: "20", name: "French Fries", vendor: "Burger Barn", category: "snacks", price: 70, calories: 320, protein: 4, carbs: 42, fat: 16, fiber: 3, dietary: ["vegetarian", "vegan"], rating: 4.2, reviews: 156, image: "🍟", available: true, popular: true, new: false },
  // Beverages
  { id: "21", name: "Matcha Latte", vendor: "Brew & Bean", category: "beverages", price: 120, calories: 180, protein: 6, carbs: 24, fat: 6, fiber: 0, dietary: ["vegetarian"], rating: 4.7, reviews: 134, image: "🍵", available: true, popular: true, new: false },
  { id: "22", name: "Cold Brew Coffee", vendor: "Brew & Bean", category: "beverages", price: 100, calories: 5, protein: 0, carbs: 1, fat: 0, fiber: 0, dietary: ["vegetarian", "vegan", "gluten-free"], rating: 4.8, reviews: 198, image: "☕", available: true, popular: true, new: false },
  { id: "23", name: "Fresh Lime Soda", vendor: "Spice Route", category: "beverages", price: 50, calories: 80, protein: 0, carbs: 20, fat: 0, fiber: 0, dietary: ["vegetarian", "vegan", "gluten-free"], rating: 4.3, reviews: 67, image: "🍋", available: true, popular: false, new: false },
  { id: "24", name: "Berry Smoothie", vendor: "Green Bowl", category: "beverages", price: 130, calories: 220, protein: 8, carbs: 38, fat: 4, fiber: 4, dietary: ["vegetarian", "vegan", "gluten-free"], rating: 4.6, reviews: 89, image: "🫐", available: true, popular: false, new: true },
  // Desserts
  { id: "25", name: "Chocolate Brownie", vendor: "Brew & Bean", category: "desserts", price: 90, calories: 380, protein: 6, carbs: 48, fat: 20, fiber: 2, dietary: ["vegetarian"], rating: 4.7, reviews: 145, image: "🍫", available: true, popular: true, new: false },
  { id: "26", name: "Gulab Jamun", vendor: "Spice Route", category: "desserts", price: 60, calories: 280, protein: 4, carbs: 42, fat: 12, fiber: 0, dietary: ["vegetarian"], rating: 4.5, reviews: 112, image: "🟤", available: true, popular: true, new: false },
  { id: "27", name: "Tiramisu", vendor: "Slice & Dice", category: "desserts", price: 120, calories: 350, protein: 6, carbs: 38, fat: 20, fiber: 0, dietary: ["vegetarian"], rating: 4.8, reviews: 78, image: "🍰", available: true, popular: false, new: false },
  { id: "28", name: "Ice Cream Sundae", vendor: "Burger Barn", category: "desserts", price: 100, calories: 320, protein: 6, carbs: 42, fat: 16, fiber: 1, dietary: ["vegetarian"], rating: 4.4, reviews: 98, image: "🍦", available: true, popular: false, new: false },
];

const DIETARY_FILTERS = [
  { id: "vegetarian", label: "Vegetarian", icon: <Leaf className="w-4 h-4" />, color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  { id: "vegan", label: "Vegan", icon: <Sprout className="w-4 h-4" />, color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
  { id: "gluten-free", label: "Gluten-Free", icon: <Wheat className="w-4 h-4" />, color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  { id: "high-protein", label: "High Protein", icon: <Beef className="w-4 h-4" />, color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  { id: "low-cal", label: "Low Calorie", icon: <Flame className="w-4 h-4" />, color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
];

function Sprout({ className }: { className?: string }) {
  return <Leaf className={className} />;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  breakfast: <Coffee className="w-4 h-4" />,
  lunch: <Utensils className="w-4 h-4" />,
  dinner: <Pizza className="w-4 h-4" />,
  snacks: <Cookie className="w-4 h-4" />,
  beverages: <CupSoda className="w-4 h-4" />,
  desserts: <IceCreamCone className="w-4 h-4" />,
};

function CupSoda({ className }: { className?: string }) {
  return <Coffee className={className} />;
}

function Pizza({ className }: { className?: string }) {
  return <Utensils className={className} />;
}

function Cookie({ className }: { className?: string }) {
  return <Sandwich className={className} />;
}

function IceCreamCone({ className }: { className?: string }) {
  return <IceCreamCone className={className} />;
}

// ── Main Component ─────────────────────────────────────────────────────────

export default function FoodCourtTracker() {
  const [activeTab, setActiveTab] = useState<"menu" | "vendors" | "tracker" | "favorites">("menu");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedVendor, setSelectedVendor] = useState<string>("all");
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("popular");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [bookmarkedItems, setBookmarkedItems] = useState<Set<string>>(new Set(["1", "6", "22"]));
  const [nutritionGoal, setNutritionGoal] = useState<number>(2000);

  const goals: NutritionGoal[] = [
    { label: "Calories", current: 1450, target: nutritionGoal, unit: "kcal", color: "bg-blue-500", icon: <Flame className="w-4 h-4" /> },
    { label: "Protein", current: 68, target: 120, unit: "g", color: "bg-red-500", icon: <Beef className="w-4 h-4" /> },
    { label: "Carbs", current: 185, target: 250, unit: "g", color: "bg-amber-500", icon: <Wheat className="w-4 h-4" /> },
    { label: "Fat", current: 52, target: 65, unit: "g", color: "bg-purple-500", icon: <Droplets className="w-4 h-4" /> },
    { label: "Fiber", current: 18, target: 30, unit: "g", color: "bg-green-500", icon: <Leaf className="w-4 h-4" /> },
  ];

  const filteredItems = useMemo(() => {
    let items = MENU_ITEMS.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.vendor.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
      const matchesVendor = selectedVendor === "all" || item.vendor === VENDORS.find((v) => v.id === selectedVendor)?.name;
      const matchesDietary = selectedDietary.length === 0 || selectedDietary.every((d) => {
        if (d === "high-protein") return item.protein >= 25;
        if (d === "low-cal") return item.calories <= 300;
        return item.dietary.includes(d);
      });
      return matchesSearch && matchesCategory && matchesVendor && matchesDietary;
    });

    switch (sortBy) {
      case "popular": items = [...items].sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0) || b.reviews - a.reviews); break;
      case "price-low": items = [...items].sort((a, b) => a.price - b.price); break;
      case "price-high": items = [...items].sort((a, b) => b.price - a.price); break;
      case "calories": items = [...items].sort((a, b) => a.calories - b.calories); break;
      case "protein": items = [...items].sort((a, b) => b.protein - a.protein); break;
      case "rating": items = [...items].sort((a, b) => b.rating - a.rating); break;
    }
    return items;
  }, [searchQuery, selectedCategory, selectedVendor, selectedDietary, sortBy]);

  const cartTotal = cart.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
  const cartCalories = cart.reduce((sum, item) => sum + item.menuItem.calories * item.quantity, 0);

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.menuItem.id === item.id);
      if (existing) return prev.map((c) => c.menuItem.id === item.id ? { ...c, quantity: c.quantity + 1 } : c);
      return [...prev, { menuItem: item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.menuItem.id === itemId);
      if (existing && existing.quantity > 1) return prev.map((c) => c.menuItem.id === itemId ? { ...c, quantity: c.quantity - 1 } : c);
      return prev.filter((c) => c.menuItem.id !== itemId);
    });
  };

  const toggleBookmark = (id: string) => {
    setBookmarkedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleDietary = (id: string) => {
    setSelectedDietary((prev) => prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]);
  };

  const tabs = [
    { id: "menu" as const, label: "Menu", icon: <Utensils className="w-4 h-4" /> },
    { id: "vendors" as const, label: "Vendors", icon: <Store className="w-4 h-4" /> },
    { id: "tracker" as const, label: "Nutrition", icon: <BarChart3 className="w-4 h-4" /> },
    { id: "favorites" as const, label: "Favorites", icon: <Heart className="w-4 h-4" /> },
  ];

  const categories = [
    { id: "all", label: "All", icon: <Utensils className="w-4 h-4" /> },
    { id: "breakfast", label: "Breakfast", icon: <Coffee className="w-4 h-4" /> },
    { id: "lunch", label: "Lunch", icon: <Salad className="w-4 h-4" /> },
    { id: "dinner", label: "Dinner", icon: <Pizza className="w-4 h-4" /> },
    { id: "snacks", label: "Snacks", icon: <Cookie className="w-4 h-4" /> },
    { id: "beverages", label: "Drinks", icon: <CupSoda className="w-4 h-4" /> },
    { id: "desserts", label: "Desserts", icon: <IceCreamCone className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                <Utensils className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">Food Court</h1>
                <p className="text-xs text-gray-500">Menu, nutrition & meal planning</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowCart(!showCart)} className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <ShoppingCart className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {cart.reduce((s, c) => s + c.quantity, 0)}
                  </span>
                )}
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm" : "text-gray-600 dark:text-gray-400"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* ── Menu Tab ──────────────────────────────────────────── */}
          {activeTab === "menu" && (
            <motion.div key="menu" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text" placeholder="Search menu items, vendors..."
                  value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Categories */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {categories.map((cat) => (
                  <button key={cat.id} onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                      selectedCategory === cat.id ? "bg-orange-500 text-white shadow-lg shadow-orange-500/25" : "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {cat.icon}
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Dietary Filters */}
              <div className="flex gap-2 flex-wrap">
                {DIETARY_FILTERS.map((f) => (
                  <button key={f.id} onClick={() => toggleDietary(f.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      selectedDietary.includes(f.id) ? f.color : "bg-gray-100 dark:bg-gray-800 text-gray-500"
                    }`}
                  >
                    {f.icon}
                    {f.label}
                    {selectedDietary.includes(f.id) && <X className="w-3 h-3" />}
                  </button>
                ))}
              </div>

              {/* Sort & Count */}
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  <span className="font-bold text-gray-900 dark:text-white">{filteredItems.length}</span> items found
                </p>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="popular">Most Popular</option>
                  <option value="price-low">Price: Low → High</option>
                  <option value="price-high">Price: High → Low</option>
                  <option value="calories">Lowest Calories</option>
                  <option value="protein">Highest Protein</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>

              {/* Menu Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredItems.map((item) => (
                  <motion.div key={item.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-all"
                  >
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-3xl">{item.image}</span>
                        <div className="flex gap-1">
                          {item.new && <span className="px-2 py-0.5 bg-blue-500 text-white text-xs font-bold rounded-full">NEW</span>}
                          {item.popular && <span className="px-2 py-0.5 bg-orange-500 text-white text-xs font-bold rounded-full">🔥</span>}
                          <button onClick={() => toggleBookmark(item.id)} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                            {bookmarkedItems.has(item.id) ? <BookmarkCheck className="w-4 h-4 text-orange-500 fill-orange-500" /> : <Bookmark className="w-4 h-4 text-gray-400" />}
                          </button>
                        </div>
                      </div>
                      <h3 className="font-bold text-gray-900 dark:text-white text-sm">{item.name}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">{item.vendor}</p>
                      {/* Dietary tags */}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {item.dietary.map((d, i) => (
                          <span key={i} className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs text-gray-500 capitalize">{d}</span>
                        ))}
                      </div>
                      {/* Nutrition mini */}
                      <div className="grid grid-cols-4 gap-1 mt-3">
                        {[
                          { label: "Cal", value: item.calories, color: "text-blue-600" },
                          { label: "P", value: `${item.protein}g`, color: "text-red-600" },
                          { label: "C", value: `${item.carbs}g`, color: "text-amber-600" },
                          { label: "F", value: `${item.fat}g`, color: "text-purple-600" },
                        ].map((n, i) => (
                          <div key={i} className="text-center">
                            <p className={`text-xs font-bold ${n.color}`}>{n.value}</p>
                            <p className="text-xs text-gray-400">{n.label}</p>
                          </div>
                        ))}
                      </div>
                      {/* Price & Add */}
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                        <div>
                          <span className="text-lg font-bold text-gray-900 dark:text-white">₹{item.price}</span>
                          <div className="flex items-center gap-1 mt-0.5">
                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                            <span className="text-xs text-gray-500">{item.rating} ({item.reviews})</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {cart.find((c) => c.menuItem.id === item.id) ? (
                            <div className="flex items-center gap-2 bg-orange-50 dark:bg-orange-950/30 rounded-lg px-2 py-1">
                              <button onClick={() => removeFromCart(item.id)} className="w-6 h-6 rounded bg-orange-500 text-white flex items-center justify-center text-sm">-</button>
                              <span className="text-sm font-bold text-orange-600">{cart.find((c) => c.menuItem.id === item.id)?.quantity}</span>
                              <button onClick={() => addToCart(item)} className="w-6 h-6 rounded bg-orange-500 text-white flex items-center justify-center text-sm">+</button>
                            </div>
                          ) : (
                            <button onClick={() => addToCart(item)}
                              className="px-3 py-1.5 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors flex items-center gap-1"
                            >
                              <Plus className="w-3.5 h-3.5" /> Add
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── Vendors Tab ───────────────────────────────────────── */}
          {activeTab === "vendors" && (
            <motion.div key="vendors" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Campus Vendors</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {VENDORS.map((vendor) => (
                  <motion.div key={vendor.id} whileHover={{ scale: 1.02 }}
                    className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <span className="text-4xl">{vendor.image}</span>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 dark:text-white">{vendor.name}</h3>
                        <p className="text-sm text-gray-500">{vendor.cuisine}</p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${vendor.isOpen ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}>
                        {vendor.isOpen ? "Open" : "Closed"}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-medium text-gray-700 dark:text-gray-300">{vendor.rating}</span>
                        <span>({vendor.reviews})</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>{vendor.openTime} - {vendor.closeTime}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Users className="w-4 h-4" />
                        <span>Wait: {vendor.waitTime}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <MapPin className="w-4 h-4" />
                        <span>Food Court</span>
                      </div>
                    </div>
                    <button className="w-full py-2.5 bg-gray-100 dark:bg-gray-800 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                      View Menu ({MENU_ITEMS.filter((i) => i.vendor === vendor.name).length} items)
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── Nutrition Tracker Tab ──────────────────────────────── */}
          {activeTab === "tracker" && (
            <motion.div key="tracker" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Nutrition Tracker</h2>

              {/* Daily Goals */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-orange-500" />
                  Today's Progress
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {goals.map((g, i) => {
                    const pct = Math.min((g.current / g.target) * 100, 100);
                    return (
                      <div key={i} className="text-center">
                        <div className="relative w-20 h-20 mx-auto mb-2">
                          <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                            <circle cx="40" cy="40" r="34" fill="none" stroke="#f0f0f0" strokeWidth="6" />
                            <circle cx="40" cy="40" r="34" fill="none" stroke={g.color.replace("bg-", "").includes("blue") ? "#3b82f6" : g.color.includes("red") ? "#ef4444" : g.color.includes("amber") ? "#f59e0b" : g.color.includes("purple") ? "#a855f7" : "#22c55e"} strokeWidth="6" strokeDasharray={`${pct * 2.136} 213.6`} strokeLinecap="round" />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-sm font-bold text-gray-900 dark:text-white">{Math.round(pct)}%</span>
                          </div>
                        </div>
                        <p className="text-xs font-medium text-gray-600 dark:text-gray-400">{g.label}</p>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">{g.current}/{g.target} {g.unit}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Today's Meals */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-orange-500" />
                  Today's Meals
                </h3>
                <div className="space-y-3">
                  {[
                    { meal: "Breakfast", items: ["Avocado Toast", "Matcha Latte"], calories: 500, time: "8:30 AM", icon: <Coffee className="w-4 h-4" /> },
                    { meal: "Lunch", items: ["Butter Chicken", "Garlic Bread"], calories: 700, time: "12:45 PM", icon: <Utensils className="w-4 h-4" /> },
                    { meal: "Snacks", items: ["Protein Bar"], calories: 220, time: "3:30 PM", icon: <Cookie className="w-4 h-4" /> },
                  ].map((m, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                      <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-500">{m.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-gray-900 dark:text-white">{m.meal}</p>
                          <span className="text-sm font-bold text-orange-600">{m.calories} kcal</span>
                        </div>
                        <p className="text-xs text-gray-500">{m.items.join(" · ")} · {m.time}</p>
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center gap-4 p-3 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400"><Plus className="w-5 h-5" /></div>
                    <p className="text-sm text-gray-400">Log a meal</p>
                  </div>
                </div>
              </div>

              {/* Weekly Chart */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4">Weekly Calorie Trend</h3>
                <div className="flex items-end gap-3 h-40">
                  {[1800, 2100, 1950, 2200, 1750, 2400, 1450].map((cal, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <motion.div initial={{ height: 0 }} animate={{ height: `${(cal / 2500) * 100}%` }}
                        transition={{ duration: 0.8, delay: i * 0.1 }}
                        className={`w-full rounded-t-lg ${cal > 2200 ? "bg-red-400" : cal > 1800 ? "bg-orange-400" : "bg-green-400"}`}
                      />
                      <span className="text-xs text-gray-500">{["M", "T", "W", "T", "F", "S", "S"][i]}</span>
                      <span className="text-xs text-gray-400">{(cal / 1000).toFixed(1)}k</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Favorites Tab ──────────────────────────────────────── */}
          {activeTab === "favorites" && (
            <motion.div key="favorites" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Favorite Items</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {MENU_ITEMS.filter((item) => bookmarkedItems.has(item.id)).map((item) => (
                  <div key={item.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 flex items-center gap-4">
                    <span className="text-3xl">{item.image}</span>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 dark:text-white text-sm">{item.name}</h3>
                      <p className="text-xs text-gray-500">{item.vendor} · ₹{item.price}</p>
                      <p className="text-xs text-gray-400 mt-1">{item.calories} kcal · {item.protein}g protein</p>
                    </div>
                    <button onClick={() => addToCart(item)}
                      className="px-3 py-1.5 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {bookmarkedItems.size === 0 && (
                  <div className="col-span-full text-center py-12">
                    <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No favorites yet. Tap the bookmark icon on any menu item!</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Cart Drawer ──────────────────────────────────────────── */}
      <AnimatePresence>
        {showCart && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-end"
            onClick={() => setShowCart(false)}
          >
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              className="w-full max-w-md bg-white dark:bg-gray-900 h-full overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your Order</h2>
                  <button onClick={() => setShowCart(false)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Your cart is empty</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4 mb-6">
                      {cart.map((item) => (
                        <div key={item.menuItem.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                          <span className="text-2xl">{item.menuItem.image}</span>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 dark:text-white text-sm">{item.menuItem.name}</p>
                            <p className="text-xs text-gray-500">₹{item.menuItem.price} × {item.quantity}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button onClick={() => removeFromCart(item.menuItem.id)} className="w-7 h-7 rounded bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm">-</button>
                            <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                            <button onClick={() => addToCart(item.menuItem)} className="w-7 h-7 rounded bg-orange-500 text-white flex items-center justify-center text-sm">+</button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-800 pt-4 space-y-2">
                      <div className="flex justify-between text-sm"><span className="text-gray-500">Total Calories</span><span className="font-medium">{cartCalories} kcal</span></div>
                      <div className="flex justify-between text-sm"><span className="text-gray-500">Items</span><span className="font-medium">{cart.reduce((s, c) => s + c.quantity, 0)}</span></div>
                      <div className="flex justify-between text-lg font-bold"><span>Total</span><span>₹{cartTotal}</span></div>
                    </div>
                    <button className="w-full mt-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity">
                      Place Order
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
