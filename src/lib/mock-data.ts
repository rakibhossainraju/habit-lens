import { LogEntry, RuleInsight } from "./types";

export const INITIAL_LOG_ENTRIES: LogEntry[] = [
  {
    id: "log-1",
    date: "2026-08-13",
    sleepTime: "22:45",
    wakeTime: "07:00",
    sleepDuration: 8.25,
    morningEnergy: 8,
    afternoonEnergy: 7,
    eveningEnergy: 6,
    notes: "Rested well. Morning walk in cool air before starting focus work.",
    customFields: [
      { key: "Exercise", value: "30 min Walk" },
      { key: "Water Intake", value: "2.5 L" },
      { key: "Breakfast", value: "Oatmeal & Berries" }
    ],
    createdAt: "2026-08-13T07:15:00.000Z"
  },
  {
    id: "log-2",
    date: "2026-08-12",
    sleepTime: "23:15",
    wakeTime: "07:15",
    sleepDuration: 8.0,
    morningEnergy: 7,
    afternoonEnergy: 8,
    eveningEnergy: 7,
    notes: "Steady pace throughout the day. Took a short afternoon pause.",
    customFields: [
      { key: "Exercise", value: "Light Yoga" },
      { key: "Water Intake", value: "2.0 L" },
      { key: "Sugar Intake", value: "Low" }
    ],
    createdAt: "2026-08-12T07:30:00.000Z"
  },
  {
    id: "log-3",
    date: "2026-08-11",
    sleepTime: "00:30",
    wakeTime: "06:45",
    sleepDuration: 6.25,
    morningEnergy: 5,
    afternoonEnergy: 4,
    eveningEnergy: 5,
    notes: "Stayed up late reading. Afternoon felt noticeably quieter in focus.",
    customFields: [
      { key: "Exercise", value: "None" },
      { key: "Water Intake", value: "1.5 L" },
      { key: "Sugar Intake", value: "Moderate" }
    ],
    createdAt: "2026-08-11T07:00:00.000Z"
  },
  {
    id: "log-4",
    date: "2026-08-10",
    sleepTime: "22:30",
    wakeTime: "06:30",
    sleepDuration: 8.0,
    morningEnergy: 8,
    afternoonEnergy: 7,
    eveningEnergy: 6,
    notes: "Early sleep schedule feeling natural. Energy remained balanced.",
    customFields: [
      { key: "Exercise", value: "40 min Cycling" },
      { key: "Water Intake", value: "3.0 L" },
      { key: "Breakfast", value: "Eggs & Whole Grain" }
    ],
    createdAt: "2026-08-10T06:45:00.000Z"
  },
  {
    id: "log-5",
    date: "2026-08-09",
    sleepTime: "23:00",
    wakeTime: "07:30",
    sleepDuration: 8.5,
    morningEnergy: 9,
    afternoonEnergy: 7,
    eveningEnergy: 7,
    notes: "Quiet Sunday morning. Unhurried start allowed gentle reflection.",
    customFields: [
      { key: "Exercise", value: "Stretching" },
      { key: "Water Intake", value: "2.2 L" }
    ],
    createdAt: "2026-08-09T07:45:00.000Z"
  },
  {
    id: "log-6",
    date: "2026-08-08",
    sleepTime: "01:00",
    wakeTime: "08:00",
    sleepDuration: 7.0,
    morningEnergy: 6,
    afternoonEnergy: 5,
    eveningEnergy: 8,
    notes: "Late night social gathering. Evening second wind for creative work.",
    customFields: [
      { key: "Exercise", value: "Evening Walk" },
      { key: "Water Intake", value: "1.8 L" },
      { key: "Sugar Intake", value: "High" }
    ],
    createdAt: "2026-08-08T08:15:00.000Z"
  },
  {
    id: "log-7",
    date: "2026-08-07",
    sleepTime: "22:50",
    wakeTime: "06:50",
    sleepDuration: 8.0,
    morningEnergy: 7,
    afternoonEnergy: 8,
    eveningEnergy: 6,
    notes: "Consistent bedtime. High afternoon clarity after light lunch.",
    customFields: [
      { key: "Exercise", value: "35 min Jog" },
      { key: "Water Intake", value: "2.8 L" },
      { key: "Lunch", value: "Salad & Grilled Chicken" }
    ],
    createdAt: "2026-08-07T07:05:00.000Z"
  },
  {
    id: "log-8",
    date: "2026-08-06",
    sleepTime: "23:20",
    wakeTime: "07:20",
    sleepDuration: 8.0,
    morningEnergy: 7,
    afternoonEnergy: 6,
    eveningEnergy: 7,
    notes: "Smooth day overall. Hydration was kept consistent.",
    customFields: [
      { key: "Exercise", value: "20 min Walk" },
      { key: "Water Intake", value: "2.4 L" }
    ],
    createdAt: "2026-08-06T07:35:00.000Z"
  },
  {
    id: "log-9",
    date: "2026-08-05",
    sleepTime: "00:15",
    wakeTime: "06:30",
    sleepDuration: 6.25,
    morningEnergy: 5,
    afternoonEnergy: 5,
    eveningEnergy: 4,
    notes: "Shorter sleep window. Noticeable softness in afternoon stamina.",
    customFields: [
      { key: "Exercise", value: "None" },
      { key: "Water Intake", value: "1.6 L" },
      { key: "Sugar Intake", value: "Moderate" }
    ],
    createdAt: "2026-08-05T06:50:00.000Z"
  },
  {
    id: "log-10",
    date: "2026-08-04",
    sleepTime: "22:40",
    wakeTime: "06:40",
    sleepDuration: 8.0,
    morningEnergy: 8,
    afternoonEnergy: 7,
    eveningEnergy: 6,
    notes: "Bedtime regularity maintained. Steady mental energy throughout.",
    customFields: [
      { key: "Exercise", value: "45 min Gym" },
      { key: "Water Intake", value: "3.0 L" }
    ],
    createdAt: "2026-08-04T06:55:00.000Z"
  },
  {
    id: "log-11",
    date: "2026-08-03",
    sleepTime: "22:45",
    wakeTime: "07:15",
    sleepDuration: 8.5,
    morningEnergy: 8,
    afternoonEnergy: 8,
    eveningEnergy: 7,
    notes: "Deep sleep. Strong morning motivation and sustained afternoon energy.",
    customFields: [
      { key: "Exercise", value: "Yoga" },
      { key: "Water Intake", value: "2.5 L" }
    ],
    createdAt: "2026-08-03T07:25:00.000Z"
  },
  {
    id: "log-12",
    date: "2026-08-02",
    sleepTime: "23:00",
    wakeTime: "07:00",
    sleepDuration: 8.0,
    morningEnergy: 7,
    afternoonEnergy: 6,
    eveningEnergy: 6,
    notes: "Balanced day. Restful weekend transition.",
    customFields: [
      { key: "Exercise", value: "30 min Walk" },
      { key: "Water Intake", value: "2.0 L" }
    ],
    createdAt: "2026-08-02T07:10:00.000Z"
  },
  {
    id: "log-13",
    date: "2026-08-01",
    sleepTime: "00:45",
    wakeTime: "07:15",
    sleepDuration: 6.5,
    morningEnergy: 6,
    afternoonEnergy: 4,
    eveningEnergy: 5,
    notes: "Late night movie. Afternoon slump observed after lunch.",
    customFields: [
      { key: "Exercise", value: "None" },
      { key: "Water Intake", value: "1.4 L" }
    ],
    createdAt: "2026-08-01T07:30:00.000Z"
  },
  {
    id: "log-14",
    date: "2026-07-31",
    sleepTime: "22:30",
    wakeTime: "06:45",
    sleepDuration: 8.25,
    morningEnergy: 9,
    afternoonEnergy: 8,
    eveningEnergy: 7,
    notes: "Excellent sleep continuity. Morning energy reached high clarity.",
    customFields: [
      { key: "Exercise", value: "Running" },
      { key: "Water Intake", value: "2.8 L" }
    ],
    createdAt: "2026-07-31T07:00:00.000Z"
  }
];

export const INITIAL_RULE_INSIGHTS: RuleInsight[] = [
  {
    id: "insight-1",
    title: "Higher morning energy on post-exercise days",
    description: "Morning energy ratings average 8.1/10 following days with recorded movement (walk, yoga, cycling), compared to 5.6/10 on rest days.",
    confidence: "High",
    logsAnalyzed: 14,
    relatedMetric: "Exercise & Energy"
  },
  {
    id: "insight-2",
    title: "Slight afternoon energy dip after < 7h sleep",
    description: "When sleep duration drops below 7 hours, afternoon energy ratings average 4.3/10 versus 7.3/10 when sleeping 8+ hours.",
    confidence: "High",
    logsAnalyzed: 14,
    relatedMetric: "Sleep & Diurnal Energy"
  },
  {
    id: "insight-3",
    title: "Sleep window consistency supports morning alertness",
    description: "Going to bed between 22:30 and 23:00 yields the highest morning readiness consistency (average 8.0/10).",
    confidence: "High",
    logsAnalyzed: 12,
    relatedMetric: "Sleep Consistency"
  },
  {
    id: "insight-4",
    title: "Hydration levels correlate with evening stability",
    description: "Days with 2.5L+ water intake show more stable evening energy levels (6.5/10) compared to lower hydration days (4.8/10).",
    confidence: "Medium",
    logsAnalyzed: 9,
    relatedMetric: "Water Intake & Energy"
  },
  {
    id: "insight-5",
    title: "Moderate sugar intake shows neutral evening impact",
    description: "Recorded sugar intake levels show minimal variance in overall sleep duration, suggesting sleep timing is the primary driver.",
    confidence: "Low",
    logsAnalyzed: 5,
    relatedMetric: "Sugar Intake & Sleep"
  }
];
