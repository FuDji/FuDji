export const GUIDE_SECTION_PRESETS = [
  { key: "welcome", title: "Dobrodošlica", icon: "PartyPopper" },
  { key: "wifi", title: "WiFi", icon: "Wifi" },
  { key: "house_rules", title: "Kućna pravila", icon: "ScrollText" },
  { key: "parking", title: "Parking", icon: "SquareParking" },
  { key: "check_in", title: "Prijava", icon: "LogIn" },
  { key: "check_out", title: "Odjava", icon: "LogOut" },
  { key: "restaurants", title: "Restorani", icon: "UtensilsCrossed" },
  { key: "coffee_shops", title: "Kafići", icon: "Coffee" },
  { key: "nightlife", title: "Noćni život", icon: "Martini" },
  { key: "supermarkets", title: "Marketi", icon: "ShoppingCart" },
  { key: "pharmacy", title: "Apoteka", icon: "Pill" },
  { key: "taxi", title: "Taksi", icon: "Car" },
  { key: "airport_transfer", title: "Prevoz do aerodroma", icon: "Plane" },
  { key: "emergency_numbers", title: "Hitni brojevi", icon: "Siren" },
  { key: "things_to_do", title: "Šta raditi u okolini", icon: "Compass" },
  { key: "faq", title: "Česta pitanja", icon: "CircleHelp" },
] as const;

export const ROOM_PRESETS = [
  { name: "Kuhinja", icon: "ChefHat" },
  { name: "Kupatilo", icon: "Bath" },
  { name: "Dnevna soba", icon: "Sofa" },
  { name: "Spavaća soba", icon: "BedDouble" },
  { name: "Balkon", icon: "Trees" },
  { name: "Đakuzi", icon: "Waves" },
  { name: "Sauna", icon: "Flame" },
  { name: "Bazen", icon: "Waves" },
  { name: "Garaža", icon: "Warehouse" },
] as const;

export const INVENTORY_CATEGORIES = [
  { value: "kitchen", label: "Kuhinja", icon: "ChefHat" },
  { value: "bathroom", label: "Kupatilo", icon: "Bath" },
  { value: "bedroom", label: "Spavaća soba", icon: "BedDouble" },
  { value: "living_room", label: "Dnevna soba", icon: "Sofa" },
  { value: "outdoor", label: "Spolja", icon: "Trees" },
  { value: "cleaning_supplies", label: "Sredstva za čišćenje", icon: "SprayCan" },
] as const;

export const MAINTENANCE_CATEGORIES = [
  { value: "electrical", label: "Struja", icon: "Zap" },
  { value: "water", label: "Voda", icon: "Droplets" },
  { value: "furniture", label: "Nameštaj", icon: "Sofa" },
  { value: "appliances", label: "Uređaji", icon: "Refrigerator" },
  { value: "cleaning", label: "Čišćenje", icon: "SprayCan" },
  { value: "safety", label: "Bezbednost", icon: "ShieldAlert" },
  { value: "other", label: "Ostalo", icon: "Wrench" },
] as const;

export const MAINTENANCE_PRIORITIES = [
  { value: "low", label: "Nizak", color: "secondary" },
  { value: "medium", label: "Srednji", color: "warning" },
  { value: "high", label: "Visok", color: "destructive" },
  { value: "urgent", label: "Hitno", color: "destructive" },
] as const;

export const MAINTENANCE_STATUSES = [
  { value: "open", label: "Otvoreno", color: "warning" },
  { value: "in_progress", label: "U toku", color: "default" },
  { value: "resolved", label: "Rešeno", color: "success" },
  { value: "closed", label: "Zatvoreno", color: "secondary" },
] as const;

export const PRINT_TEMPLATES = [
  { key: "welcome_book", label: "Knjiga dobrodošlice", description: "Ceo vodič kao knjižica za štampu", icon: "BookOpen" },
  { key: "house_rules", label: "Kućna pravila", description: "List sa pravilima na jednoj strani", icon: "ScrollText" },
  { key: "wifi_card", label: "WiFi kartica", description: "Kartica za WiFi džepnog formata", icon: "Wifi" },
  { key: "emergency_contacts", label: "Hitni kontakti", description: "List sa kontaktima za štampu", icon: "Siren" },
  { key: "parking_instructions", label: "Uputstvo za parking", description: "Kako i gde parkirati", icon: "SquareParking" },
  { key: "room_labels", label: "Oznake soba", description: "Oznake za vrata svake sobe", icon: "Tag" },
  { key: "qr_posters", label: "QR posteri", description: "A4 posteri sa QR kodovima soba", icon: "QrCode" },
  { key: "cleaning_checklist", label: "Lista za čišćenje", description: "Za tvoj tim za čišćenje", icon: "SprayCan" },
  { key: "inventory_checklist", label: "Lista inventara", description: "Provera inventara pri smeni gostiju", icon: "ClipboardList" },
] as const;

export const CURRENCY_LOCALE = "sr-RS";
