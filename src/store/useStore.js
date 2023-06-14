import { create } from 'zustand';
import zukeeper from 'zukeeper';
import {devtools} from 'zustand/middleware'

const useStore = create(devtools(set => ({
  timeSheetData: null,
  weekStartDate: null,
  weekId: null,
  setTimeSheetData: (timeSheetData) => set(() => ({timeSheetData: timeSheetData})),
  setWeekStartDate: (weekStartDate) => set(() => ({weekStartDate: weekStartDate})),
  setWeekId: (weekId) => set(() => ({weekId: weekId}))
})))


// window.store = useStore


export default useStore;

