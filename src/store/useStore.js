import { create } from 'zustand';
import zukeeper from 'zukeeper';
import {devtools} from 'zustand/middleware'

const useStore = create(devtools(set => ({
  timeSheetData: null,
  weekDayDates: [],
  hours: [],
  weekDayNames: [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
  ],
  setTimeSheetData: (timeSheetData) => set(() => ({timeSheetData: timeSheetData})),
  setWeekDayDates: (weekDayDates) => set(() => ({weekDayDates: weekDayDates})),
  setWeekDayNames: (weekDayNames) => set(() => ({weekDayNames: weekDayNames}))
})))


// window.store = useStore


export default useStore;

