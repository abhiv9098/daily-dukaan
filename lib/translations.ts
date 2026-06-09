export type Language = "en" | "hi";

export const translations = {
  en: {
    // Navbar
    dashboard: "Dashboard",
    reports: "Reports",
    profile: "Profile",
    newEntry: "New Entry",
    searchPlaceholder: "Search entries...",
    
    // Sidebar/Menu
    menu: "Menu",
    
    // Auth / Login
    login: "Login",
    welcomeBack: "Welcome Back",
    createAccount: "Create Account",
    email: "Email",
    password: "Password",
    signIn: "Sign In",
    signUp: "Sign Up",
    
    // Dashboard
    totalBalance: "Total Balance",
    totalIncome: "Total Income",
    totalExpenses: "Total Expenses",
    recentTransactions: "Recent Transactions",
    noTransactions: "No transactions found",
    aiInsights: "AI Insights",
    weeklyAnalytics: "Weekly Analytics",
    
    // Transaction Form
    addTransaction: "Add Transaction",
    editTransaction: "Edit Transaction",
    amount: "Amount",
    category: "Category",
    date: "Date",
    note: "Note (Optional)",
    type: "Type",
    income: "Income",
    expense: "Expense",
    save: "Save",
    cancel: "Cancel",
    
    // Categories
    Stock: "Stock",
    Transport: "Transport",
    Food: "Food",
    Electricity: "Electricity",
    Rent: "Rent",
    Salary: "Salary",
    Personal: "Personal",
    Other: "Other",
    Sales: "Sales",
    
    // Filters
    all: "All",
    last7Days: "Last 7 Days",
    last30Days: "Last 30 Days",
    thisMonth: "This Month",
    custom: "Custom",
    
    // Settings / Profile
    settings: "Settings",
    language: "Language",
    theme: "Theme",
    logout: "Logout",
    
    // Notifications
    success: "Success",
    error: "Error",
    transactionAdded: "Transaction added successfully",
    transactionUpdated: "Transaction updated successfully",
    transactionDeleted: "Transaction deleted successfully",
  },
  hi: {
    // Navbar
    dashboard: "डैशबोर्ड",
    reports: "रिपोर्ट्स",
    profile: "प्रोफ़ाइल",
    newEntry: "नई प्रविष्टि",
    searchPlaceholder: "प्रविष्टियाँ खोजें...",
    
    // Sidebar/Menu
    menu: "मेन्यू",
    
    // Auth / Login
    login: "लॉगिन",
    welcomeBack: "आपका स्वागत है",
    createAccount: "खाता बनाएं",
    email: "ईमेल",
    password: "पासवर्ड",
    signIn: "साइन इन करें",
    signUp: "साइन अप करें",
    
    // Dashboard
    totalBalance: "कुल शेष",
    totalIncome: "कुल आय",
    totalExpenses: "कुल खर्च",
    recentTransactions: "हाल के लेनदेन",
    noTransactions: "कोई लेनदेन नहीं मिला",
    aiInsights: "AI अंतर्दृष्टि",
    weeklyAnalytics: "साप्ताहिक विश्लेषण",
    
    // Transaction Form
    addTransaction: "लेनदेन जोड़ें",
    editTransaction: "लेनदेन संपादित करें",
    amount: "राशि",
    category: "श्रेणी",
    date: "तारीख",
    note: "नोट (वैकल्पिक)",
    type: "प्रकार",
    income: "आय",
    expense: "खर्च",
    save: "सहेजें",
    cancel: "रद्द करें",
    
    // Categories
    Stock: "स्टॉक",
    Transport: "परिवहन",
    Food: "भोजन",
    Electricity: "बिजली",
    Rent: "किराया",
    Salary: "वेतन",
    Personal: "व्यक्तिगत",
    Other: "अन्य",
    Sales: "बिक्री",
    
    // Filters
    all: "सभी",
    last7Days: "पिछले 7 दिन",
    last30Days: "पिछले 30 दिन",
    thisMonth: "इस महीने",
    custom: "कस्टम",
    
    // Settings / Profile
    settings: "सेटिंग्स",
    language: "भाषा",
    theme: "थीम",
    logout: "लॉगआउट",
    
    // Notifications
    success: "सफल",
    error: "त्रुटि",
    transactionAdded: "लेनदेन सफलतापूर्वक जोड़ा गया",
    transactionUpdated: "लेनदेन सफलतापूर्वक अपडेट किया गया",
    transactionDeleted: "लेनदेन सफलतापूर्वक हटा दिया गया",
  },
};

export type TranslationKeys = keyof typeof translations.en;
