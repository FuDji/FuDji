export const GUIDE_SECTION_PRESETS = [
  { key: "welcome", title: "Welcome", icon: "PartyPopper" },
  { key: "wifi", title: "WiFi", icon: "Wifi" },
  { key: "house_rules", title: "House Rules", icon: "ScrollText" },
  { key: "parking", title: "Parking", icon: "SquareParking" },
  { key: "check_in", title: "Check In", icon: "LogIn" },
  { key: "check_out", title: "Check Out", icon: "LogOut" },
  { key: "restaurants", title: "Restaurants", icon: "UtensilsCrossed" },
  { key: "coffee_shops", title: "Coffee Shops", icon: "Coffee" },
  { key: "nightlife", title: "Nightlife", icon: "Martini" },
  { key: "supermarkets", title: "Supermarkets", icon: "ShoppingCart" },
  { key: "pharmacy", title: "Pharmacy", icon: "Pill" },
  { key: "taxi", title: "Taxi", icon: "Car" },
  { key: "airport_transfer", title: "Airport Transfer", icon: "Plane" },
  { key: "emergency_numbers", title: "Emergency Numbers", icon: "Siren" },
  { key: "things_to_do", title: "Things To Do", icon: "Compass" },
  { key: "faq", title: "FAQ", icon: "CircleHelp" },
] as const;

export const ROOM_PRESETS = [
  { name: "Kitchen", icon: "ChefHat" },
  { name: "Bathroom", icon: "Bath" },
  { name: "Living Room", icon: "Sofa" },
  { name: "Bedroom", icon: "BedDouble" },
  { name: "Balcony", icon: "Trees" },
  { name: "Jacuzzi", icon: "Waves" },
  { name: "Sauna", icon: "Flame" },
  { name: "Pool", icon: "Waves" },
  { name: "Garage", icon: "Warehouse" },
] as const;

export const INVENTORY_CATEGORIES = [
  { value: "kitchen", label: "Kitchen", icon: "ChefHat" },
  { value: "bathroom", label: "Bathroom", icon: "Bath" },
  { value: "bedroom", label: "Bedroom", icon: "BedDouble" },
  { value: "living_room", label: "Living Room", icon: "Sofa" },
  { value: "outdoor", label: "Outdoor", icon: "Trees" },
  { value: "cleaning_supplies", label: "Cleaning Supplies", icon: "SprayCan" },
] as const;

export const MAINTENANCE_CATEGORIES = [
  { value: "electrical", label: "Electrical", icon: "Zap" },
  { value: "water", label: "Water", icon: "Droplets" },
  { value: "furniture", label: "Furniture", icon: "Sofa" },
  { value: "appliances", label: "Appliances", icon: "Refrigerator" },
  { value: "cleaning", label: "Cleaning", icon: "SprayCan" },
  { value: "safety", label: "Safety", icon: "ShieldAlert" },
  { value: "other", label: "Other", icon: "Wrench" },
] as const;

export const MAINTENANCE_PRIORITIES = [
  { value: "low", label: "Low", color: "secondary" },
  { value: "medium", label: "Medium", color: "warning" },
  { value: "high", label: "High", color: "destructive" },
  { value: "urgent", label: "Urgent", color: "destructive" },
] as const;

export const MAINTENANCE_STATUSES = [
  { value: "open", label: "Open", color: "warning" },
  { value: "in_progress", label: "In Progress", color: "default" },
  { value: "resolved", label: "Resolved", color: "success" },
  { value: "closed", label: "Closed", color: "secondary" },
] as const;

export const PRINT_TEMPLATES = [
  { key: "welcome_book", label: "Welcome Book", description: "Full guide as a printable booklet", icon: "BookOpen" },
  { key: "house_rules", label: "House Rules", description: "One-page rules sheet", icon: "ScrollText" },
  { key: "wifi_card", label: "WiFi Card", description: "Pocket-size WiFi card", icon: "Wifi" },
  { key: "emergency_contacts", label: "Emergency Contacts", description: "Printable contact sheet", icon: "Siren" },
  { key: "parking_instructions", label: "Parking Instructions", description: "How & where to park", icon: "SquareParking" },
  { key: "room_labels", label: "Room Labels", description: "Door labels for every room", icon: "Tag" },
  { key: "qr_posters", label: "QR Posters", description: "A4 posters with room QR codes", icon: "QrCode" },
  { key: "cleaning_checklist", label: "Cleaning Checklist", description: "For your cleaning team", icon: "SprayCan" },
  { key: "inventory_checklist", label: "Inventory Checklist", description: "Turnover inventory check", icon: "ClipboardList" },
] as const;

export const CURRENCY_LOCALE = "en-US";
