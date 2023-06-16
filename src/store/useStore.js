import { create } from 'zustand';
import zukeeper from 'zukeeper';
import {devtools} from 'zustand/middleware'

const useStore = create(devtools(set => ({
  timeSheetData: null,
  weekStartDate: null,
  weekId: null,
  selectedWeek: null,
  projectId: null,
  projectDescription: "",
  apiCalled: false,
  setTimeSheetData: (timeSheetData) => set(() => ({timeSheetData: timeSheetData})),
  setWeekStartDate: (weekStartDate) => set(() => ({weekStartDate: weekStartDate})),
  setWeekId: (weekId) => set(() => ({weekId: weekId})),
  setSelectedWeek: (selectedWeek) => set(() => ({selectedWeek: selectedWeek})),
  setProjectId: (projectId) => set(() => ({projectId: projectId})),
  setProjectDescription: (projectDescription) => set(() => ({projectDescription: projectDescription})),
  setApiCalled: (apiCalled) => set(() => ({apiCalled: apiCalled}))
})))


// window.store = useStore


export default useStore;

