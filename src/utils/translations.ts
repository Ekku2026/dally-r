export interface TranslationDict {
  appName: string;
  tagline: string;
  nav: {
    home: string;
    tasks: string;
    routine: string;
    calendar: string;
    analytics: string;
    profile: string;
    addTask: string;
  };
  greetings: {
    morning: string;
    afternoon: string;
    evening: string;
    night: string;
    defaultUser: string;
  };
  dashboard: {
    todayProgress: string;
    completedCount: (done: number, total: number) => string;
    totalTasks: string;
    completed: string;
    pending: string;
    streak: string;
    dayStreak: (days: number) => string;
    todaysRoutine: string;
    upcomingTasks: string;
    noUpcoming: string;
    viewAllRoutine: string;
    viewAllTasks: string;
    quickAddTask: string;
    overdueWarning: (count: number) => string;
    rescheduleToToday: string;
    motivationQuotes: string[];
  };
  tasks: {
    title: string;
    all: string;
    pending: string;
    completed: string;
    highPriority: string;
    today: string;
    tomorrow: string;
    thisWeek: string;
    overdue: string;
    searchPlaceholder: string;
    sortBy: string;
    timeEarliest: string;
    priorityHigh: string;
    nameAZ: string;
    emptyTitle: string;
    emptySub: string;
    createFirstTask: string;
    markDone: string;
    markPending: string;
    edit: string;
    delete: string;
    reschedule: string;
    setReminder: string;
    deleteConfirm: string;
    deleteConfirmSub: string;
    cancel: string;
    confirmDelete: string;
  };
  routine: {
    title: string;
    subtitle: string;
    addRoutineItem: string;
    loadPreset: string;
    studentPreset: string;
    workPreset: string;
    fitnessPreset: string;
    emptyRoutine: string;
    resetToday: string;
    resetConfirm: string;
    progress: string;
    morningToNight: string;
  };
  calendar: {
    title: string;
    today: string;
    tasksOn: (dateStr: string) => string;
    noTasksForDay: string;
    addTaskForDay: string;
    month: string;
    week: string;
  };
  analytics: {
    title: string;
    subtitle: string;
    todayCompletion: string;
    weekCompletion: string;
    monthCompletion: string;
    totalCompleted: string;
    totalPending: string;
    productivityScore: string;
    chartTitle: string;
    mostProductiveDay: string;
    streakTitle: string;
    streakBreakdown: string;
    currentStreak: string;
    longestStreak: string;
    streakKeepGoing: string;
    streakBrokenMessage: string;
  };
  modal: {
    addTaskTitle: string;
    editTaskTitle: string;
    taskName: string;
    taskNamePlaceholder: string;
    description: string;
    descriptionPlaceholder: string;
    date: string;
    startTime: string;
    endTime: string;
    priority: string;
    priorityLow: string;
    priorityMedium: string;
    priorityHigh: string;
    category: string;
    reminder: string;
    reminderNone: string;
    reminder10m: string;
    reminder30m: string;
    reminder1h: string;
    reminderExact: string;
    repeat: string;
    repeatNone: string;
    repeatDaily: string;
    repeatWeekly: string;
    repeatMonthly: string;
    saveTask: string;
    updateTask: string;
    newCategory: string;
    addRoutineSlot: string;
    editRoutineSlot: string;
    time: string;
    titleLabel: string;
    titlePlaceholder: string;
    iconEmoji: string;
  };
  categories: {
    study: string;
    work: string;
    personal: string;
    business: string;
    health: string;
    finance: string;
    other: string;
    addCategory: string;
    categoryName: string;
    chooseColor: string;
  };
  settings: {
    title: string;
    account: string;
    guestMode: string;
    signedInAs: string;
    switchAccount: string;
    editProfile: string;
    preferences: string;
    theme: string;
    light: string;
    dark: string;
    system: string;
    language: string;
    notifications: string;
    enableBrowserNotifs: string;
    soundChime: string;
    startOfWeek: string;
    monday: string;
    sunday: string;
    dataManagement: string;
    exportBackup: string;
    importBackup: string;
    clearAllData: string;
    clearConfirm: string;
    exportedSuccess: string;
    importedSuccess: string;
    logout: string;
  };
}

export const translations: Record<'hi' | 'en', TranslationDict> = {
  hi: {
    appName: 'Daily Routine',
    tagline: 'आपका दैनिक कार्य और दिनचर्या प्रबंधक',
    nav: {
      home: 'होम',
      tasks: 'टास्क',
      routine: 'दिनचर्या',
      calendar: 'कैलेंडर',
      analytics: 'प्रगति',
      profile: 'प्रोफ़ाइल',
      addTask: 'टास्क जोड़ें',
    },
    greetings: {
      morning: 'सुप्रभात',
      afternoon: 'शुभ दोपहर',
      evening: 'शुभ संध्या',
      night: 'शुभ रात्रि',
      defaultUser: 'साथी',
    },
    dashboard: {
      todayProgress: 'आज की प्रगति',
      completedCount: (done, total) => `${total} में से ${done} टास्क पूरे हुए`,
      totalTasks: 'कुल टास्क',
      completed: 'पूर्ण',
      pending: 'लंबित',
      streak: 'स्ट्राइक',
      dayStreak: (days) => `🔥 ${days} दिन की स्ट्राइक`,
      todaysRoutine: "आज की दिनचर्या",
      upcomingTasks: 'आगामी कार्य',
      noUpcoming: 'आज कोई आगामी कार्य नहीं है। आराम करें या नया टास्क जोड़ें!',
      viewAllRoutine: 'पूरी दिनचर्या देखें →',
      viewAllTasks: 'सारे टास्क देखें →',
      quickAddTask: '+ नया टास्क जोड़ें',
      overdueWarning: (count) => `⚠️ आपके ${count} पुराने टास्क अधूरे हैं`,
      rescheduleToToday: 'आज पर रीशेड्यूल करें',
      motivationQuotes: [
        'हर दिन एक नई शुरुआत है। आज अपना सर्वश्रेष्ठ दें!',
        'निरंतरता ही सफलता की कुंजी है। छोटे कदम बड़ा बदलाव लाते हैं।',
        'समय आपका सबसे कीमती धन है, इसका सही उपयोग करें।',
        'काम को शुरू करना ही आधा काम पूरा होने जैसा है।',
        'आज की मेहनत कल का सुकून बनेगी। जुटे रहें!',
      ],
    },
    tasks: {
      title: 'टास्क प्रबंधन',
      all: 'सभी',
      pending: 'बाकी (Pending)',
      completed: 'पूरे (Completed)',
      highPriority: 'उच्च प्राथमिकता',
      today: 'आज',
      tomorrow: 'कल',
      thisWeek: 'इस सप्ताह',
      overdue: 'अधूरे (Overdue)',
      searchPlaceholder: 'टास्क खोजें...',
      sortBy: 'क्रमबद्ध:',
      timeEarliest: 'समय (पहले)',
      priorityHigh: 'प्राथमिकता (उच्च)',
      nameAZ: 'नाम (A-Z)',
      emptyTitle: 'कोई टास्क नहीं मिला',
      emptySub: 'आपके दिन को व्यवस्थित करने के लिए नया टास्क जोड़ें!',
      createFirstTask: '+ पहला टास्क जोड़ें',
      markDone: 'पूरा करें',
      markPending: 'लंबित करें',
      edit: 'संपादित करें',
      delete: 'हटाएं',
      reschedule: 'तारीख बदलें',
      setReminder: 'रिमाइंडर लगाएं',
      deleteConfirm: 'क्या आप इस टास्क को हटाना चाहते हैं?',
      deleteConfirmSub: 'यह क्रिया वापस नहीं ली जा सकेगी।',
      cancel: 'रद्द करें',
      confirmDelete: 'हटाएं',
    },
    routine: {
      title: 'दैनिक दिनचर्या (Daily Routine)',
      subtitle: 'सुबह 06:00 AM से रात 10:00 PM तक का व्यवस्थित शेड्यूल',
      addRoutineItem: '+ रूटीन स्लॉट जोड़ें',
      loadPreset: 'प्रीसेट लोड करें',
      studentPreset: 'विद्यार्थी रूटीन 📚',
      workPreset: 'ऑफिस / वर्क रूटीन 💼',
      fitnessPreset: 'फिटनेस व स्वास्थ्य 🏃',
      emptyRoutine: 'अभी कोई रूटीन स्लॉट नहीं है',
      resetToday: 'आज का स्टेटस रीसेट करें',
      resetConfirm: 'क्या आप आज के सभी रूटीन टिक रीसेट करना चाहते हैं?',
      progress: 'रूटीन पूर्णता',
      morningToNight: 'सुबह से रात',
    },
    calendar: {
      title: 'कैलेंडर व्यू',
      today: 'आज',
      tasksOn: (dateStr) => `${dateStr} के टास्क`,
      noTasksForDay: 'इस तारीख पर कोई टास्क निर्धारित नहीं है।',
      addTaskForDay: '+ इस दिन के लिए टास्क जोड़ें',
      month: 'माह',
      week: 'सप्ताह',
    },
    analytics: {
      title: 'दैनिक प्रगति और आंकड़े',
      subtitle: 'अपनी उत्पादकता और आदत की प्रगति का विश्लेषण करें',
      todayCompletion: 'आज का प्रतिशत',
      weekCompletion: 'साप्ताहिक पूर्णता',
      monthCompletion: 'मासिक पूर्णता',
      totalCompleted: 'कुल पूरे कार्य',
      totalPending: 'कुल लंबित कार्य',
      productivityScore: 'उत्पादकता स्कोर',
      chartTitle: 'पिछले 7 दिनों का प्रदर्शन',
      mostProductiveDay: 'सबसे उत्पादक दिन',
      streakTitle: 'स्ट्राइक सिस्टम',
      streakBreakdown: 'लगातार कार्य पूरे करने का रिकॉर्ड',
      currentStreak: 'वर्तमान स्ट्राइक',
      longestStreak: 'सर्वश्रेष्ठ स्ट्राइक',
      streakKeepGoing: 'शानदार! इसी तरह रोज़ अपने काम पूरे करते रहें 🔥',
      streakBrokenMessage: 'स्ट्राइक टूट गई? कोई बात नहीं! आज से फिर एक नई शुरुआत करें 💪',
    },
    modal: {
      addTaskTitle: 'नया टास्क बनाएं',
      editTaskTitle: 'टास्क संपादित करें',
      taskName: 'टास्क का नाम *',
      taskNamePlaceholder: 'उदा. ऑफिस की रिपोर्ट पूरी करें',
      description: 'विवरण (वैकल्पिक)',
      descriptionPlaceholder: 'अतिरिक्त नोट्स या लिंक लिखें...',
      date: 'तारीख *',
      startTime: 'प्रारंभ समय',
      endTime: 'समाप्ति समय',
      priority: 'प्राथमिकता (Priority)',
      priorityLow: 'निम्न (Low)',
      priorityMedium: 'मध्यम (Medium)',
      priorityHigh: 'उच्च (High)',
      category: 'श्रेणी (Category)',
      reminder: 'रिमाइंडर (Reminder)',
      reminderNone: 'कोई नहीं',
      reminder10m: '10 मिनट पहले',
      reminder30m: '30 मिनट पहले',
      reminder1h: '1 घंटा पहले',
      reminderExact: 'निर्धारित समय पर',
      repeat: 'दोहराएं (Repeat)',
      repeatNone: 'नहीं दोहराएं',
      repeatDaily: 'प्रतिदिन (Daily)',
      repeatWeekly: 'साप्ताहिक (Weekly)',
      repeatMonthly: 'मासिक (Monthly)',
      saveTask: 'टास्क सहेजें',
      updateTask: 'अपडेट करें',
      newCategory: '+ नई श्रेणी',
      addRoutineSlot: 'नया रूटीन स्लॉट जोड़ें',
      editRoutineSlot: 'रूटीन स्लॉट संपादित करें',
      time: 'समय (उदा. 06:00 AM)',
      titleLabel: 'कार्य का नाम',
      titlePlaceholder: 'उदा. सुबह का व्यायाम',
      iconEmoji: 'चिह्न (Emoji)',
    },
    categories: {
      study: 'पढ़ाई (Study)',
      work: 'कार्य (Work)',
      personal: 'व्यक्तिगत (Personal)',
      business: 'व्यापार (Business)',
      health: 'स्वास्थ्य (Health)',
      finance: 'वित्त (Finance)',
      other: 'अन्य (Other)',
      addCategory: 'नई श्रेणी जोड़ें',
      categoryName: 'श्रेणी का नाम',
      chooseColor: 'रंग चुनें',
    },
    settings: {
      title: 'सेटिंग्स और प्रोफ़ाइल',
      account: 'यूज़र खाता',
      guestMode: 'गेस्ट मोड',
      signedInAs: 'लॉगिन स्थिति',
      switchAccount: 'अकाउंट बदलें / लॉगिन करें',
      editProfile: 'प्रोफ़ाइल संपादित करें',
      preferences: 'प्राथमिकताएं',
      theme: 'थीम (Theme)',
      light: 'लाइट (Light)',
      dark: 'डार्क (Dark)',
      system: 'सिस्टम डिफॉल्ट',
      language: 'भाषा (Language)',
      notifications: 'सूचनाएं (Notifications)',
      enableBrowserNotifs: 'ब्राउज़र रिमाइंडर सूचनाएं सक्षम करें',
      soundChime: 'टास्क पूर्ण होने पर ऑडियो चाइम बजाएं',
      startOfWeek: 'सप्ताह का पहला दिन',
      monday: 'सोमवार (Monday)',
      sunday: 'रविवार (Sunday)',
      dataManagement: 'डेटा प्रबंधन और बैकअप',
      exportBackup: 'डेटा डाउनलोड / बैकअप (JSON)',
      importBackup: 'बैकअप फाइल रिस्टोर करें',
      clearAllData: 'सारा डेटा साफ़ करें',
      clearConfirm: 'चेतावनी: आपका सारा डेटा स्थायी रूप से हट जाएगा। क्या आप जारी रखना चाहते हैं?',
      exportedSuccess: 'बैकअप सफलतापूर्वक डाउनलोड हो गया!',
      importedSuccess: 'डेटा सफलतापूर्वक रिस्टोर हो गया!',
      logout: 'लॉग आउट',
    },
  },
  en: {
    appName: 'Daily Routine',
    tagline: 'Your Daily Task & Routine Manager',
    nav: {
      home: 'Home',
      tasks: 'Tasks',
      routine: 'Routine',
      calendar: 'Calendar',
      analytics: 'Progress',
      profile: 'Profile',
      addTask: 'Add Task',
    },
    greetings: {
      morning: 'Good Morning',
      afternoon: 'Good Afternoon',
      evening: 'Good Evening',
      night: 'Good Night',
      defaultUser: 'Friend',
    },
    dashboard: {
      todayProgress: "Today's Progress",
      completedCount: (done, total) => `${done} of ${total} Tasks Completed`,
      totalTasks: 'Total Tasks',
      completed: 'Completed',
      pending: 'Pending',
      streak: 'Streak',
      dayStreak: (days) => `🔥 ${days} Day Streak`,
      todaysRoutine: "Today's Routine",
      upcomingTasks: 'Upcoming Tasks',
      noUpcoming: 'No upcoming tasks for today. Relax or add a new task!',
      viewAllRoutine: 'View Full Routine →',
      viewAllTasks: 'View All Tasks →',
      quickAddTask: '+ Add Task',
      overdueWarning: (count) => `⚠️ You have ${count} unfinished past tasks`,
      rescheduleToToday: 'Reschedule to Today',
      motivationQuotes: [
        'Every day is a fresh start. Make today count!',
        'Consistency is the mother of mastery. Small steps lead to big wins.',
        'Focus on being productive instead of busy.',
        'The secret of getting ahead is getting started.',
        'Today’s effort is tomorrow’s peace of mind.',
      ],
    },
    tasks: {
      title: 'Task Management',
      all: 'All',
      pending: 'Pending',
      completed: 'Completed',
      highPriority: 'High Priority',
      today: 'Today',
      tomorrow: 'Tomorrow',
      thisWeek: 'This Week',
      overdue: 'Overdue',
      searchPlaceholder: 'Search tasks...',
      sortBy: 'Sort by:',
      timeEarliest: 'Time (Earliest)',
      priorityHigh: 'Priority (High to Low)',
      nameAZ: 'Name (A-Z)',
      emptyTitle: 'No Tasks Found',
      emptySub: 'Plan your day by adding your first task!',
      createFirstTask: '+ Create First Task',
      markDone: 'Mark Complete',
      markPending: 'Mark Pending',
      edit: 'Edit',
      delete: 'Delete',
      reschedule: 'Reschedule',
      setReminder: 'Set Reminder',
      deleteConfirm: 'Are you sure you want to delete this task?',
      deleteConfirmSub: 'This action cannot be undone.',
      cancel: 'Cancel',
      confirmDelete: 'Delete',
    },
    routine: {
      title: 'Daily Routine',
      subtitle: 'Structured schedule from 06:00 AM to 10:00 PM',
      addRoutineItem: '+ Add Routine Slot',
      loadPreset: 'Load Preset',
      studentPreset: 'Student Routine 📚',
      workPreset: 'Office / Work Routine 💼',
      fitnessPreset: 'Fitness & Health 🏃',
      emptyRoutine: 'No routine items added yet',
      resetToday: 'Reset Today Status',
      resetConfirm: 'Do you want to reset all routine checkmarks for today?',
      progress: 'Routine Progress',
      morningToNight: 'Morning to Night',
    },
    calendar: {
      title: 'Calendar View',
      today: 'Today',
      tasksOn: (dateStr) => `Tasks for ${dateStr}`,
      noTasksForDay: 'No tasks scheduled for this day.',
      addTaskForDay: '+ Add Task For This Day',
      month: 'Month',
      week: 'Week',
    },
    analytics: {
      title: 'Daily Progress & Analytics',
      subtitle: 'Analyze your productivity trends and habit completion',
      todayCompletion: "Today's Completion",
      weekCompletion: 'Weekly Completion',
      monthCompletion: 'Monthly Completion',
      totalCompleted: 'Total Completed',
      totalPending: 'Total Pending',
      productivityScore: 'Productivity Score',
      chartTitle: 'Past 7 Days Performance',
      mostProductiveDay: 'Most Productive Day',
      streakTitle: 'Streak System',
      streakBreakdown: 'Consecutive Task Completion Record',
      currentStreak: 'Current Streak',
      longestStreak: 'Longest Streak',
      streakKeepGoing: 'Awesome work! Keep the momentum going strong 🔥',
      streakBrokenMessage: 'Streak paused? No problem! Start a brand new streak today 💪',
    },
    modal: {
      addTaskTitle: 'Create New Task',
      editTaskTitle: 'Edit Task',
      taskName: 'Task Name *',
      taskNamePlaceholder: 'e.g. Complete office presentation',
      description: 'Description (Optional)',
      descriptionPlaceholder: 'Add details, links, or sub-notes...',
      date: 'Date *',
      startTime: 'Start Time',
      endTime: 'End Time',
      priority: 'Priority',
      priorityLow: 'Low',
      priorityMedium: 'Medium',
      priorityHigh: 'High',
      category: 'Category',
      reminder: 'Reminder',
      reminderNone: 'None',
      reminder10m: '10 minutes before',
      reminder30m: '30 minutes before',
      reminder1h: '1 hour before',
      reminderExact: 'Exact time',
      repeat: 'Repeat',
      repeatNone: 'Does not repeat',
      repeatDaily: 'Daily',
      repeatWeekly: 'Weekly',
      repeatMonthly: 'Monthly',
      saveTask: 'Save Task',
      updateTask: 'Update Task',
      newCategory: '+ New Category',
      addRoutineSlot: 'Add Routine Slot',
      editRoutineSlot: 'Edit Routine Slot',
      time: 'Time (e.g. 06:00 AM)',
      titleLabel: 'Activity Name',
      titlePlaceholder: 'e.g. Morning Exercise',
      iconEmoji: 'Icon (Emoji)',
    },
    categories: {
      study: 'Study',
      work: 'Work',
      personal: 'Personal',
      business: 'Business',
      health: 'Health',
      finance: 'Finance',
      other: 'Other',
      addCategory: 'Add Category',
      categoryName: 'Category Name',
      chooseColor: 'Choose Color',
    },
    settings: {
      title: 'Settings & Profile',
      account: 'User Account',
      guestMode: 'Guest Mode',
      signedInAs: 'Signed in as',
      switchAccount: 'Switch / Sign In',
      editProfile: 'Edit Profile',
      preferences: 'Preferences',
      theme: 'Theme',
      light: 'Light',
      dark: 'Dark',
      system: 'System Default',
      language: 'Language',
      notifications: 'Notifications',
      enableBrowserNotifs: 'Enable browser task reminders',
      soundChime: 'Play audio chime on task completion',
      startOfWeek: 'Start of Week',
      monday: 'Monday',
      sunday: 'Sunday',
      dataManagement: 'Data Management & Backup',
      exportBackup: 'Download Backup (JSON)',
      importBackup: 'Restore Backup (JSON)',
      clearAllData: 'Clear All Data',
      clearConfirm: 'Warning: This will permanently erase all your tasks and routines. Proceed?',
      exportedSuccess: 'Backup file downloaded successfully!',
      importedSuccess: 'Data restored successfully!',
      logout: 'Log Out',
    },
  },
};
