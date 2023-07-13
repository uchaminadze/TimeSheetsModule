import { create } from 'zustand';
import zukeeper from 'zukeeper';
import {devtools} from 'zustand/middleware'

const useStore = create(devtools(set => ({
  timeSheetData: null,
  weekStartDate: null,
  weekId: null,
  selectedWeek: null,
  projectId: null,
  selectedProjectId: "",
  projectDescription: "",
  projects: null,
  apiCalled: false,
  uniqueId: null,
  modifiedTimeSheetData: null,
  staticTimeSheetData: null,
  isTimeSheetEdited: false,
  areTimeSheetsSubmitted: false,
  globalAccessToken: null,
  globalContactId: null,
  setTimeSheetData: (timeSheetData) => set(() => ({timeSheetData: timeSheetData})),
  setModifiedTimeSheetData: (modifiedTimeSheetData) => set(() => ({modifiedTimeSheetData: modifiedTimeSheetData})),
  setStaticTimeSheetData: (staticTimeSheetData) => set(() => ({staticTimeSheetData: staticTimeSheetData})),
  setIsTimeSheetEdited: (isTimeSheetEdited) => set(() => ({isTimeSheetEdited: isTimeSheetEdited})),
  setAreTimeSheetsSubmitted: (areTimeSheetsSubmitted) => set(() => ({areTimeSheetsSubmitted: areTimeSheetsSubmitted})),
  setGlobalAccessToken: (globalAccessToken) => set(() => ({globalAccessToken: globalAccessToken})),
  setGlobalContactId: (globalContactId) => set(() => ({globalContactId: globalContactId})),
  setWeekStartDate: (weekStartDate) => set(() => ({weekStartDate: weekStartDate})),
  setWeekId: (weekId) => set(() => ({weekId: weekId})),
  setSelectedWeek: (selectedWeek) => set(() => ({selectedWeek: selectedWeek})),
  setProjectId: (projectId) => set(() => ({projectId: projectId})),
  setSelectedProjectId: (selectedProjectId) => set(() => ({selectedProjectId: selectedProjectId})),
  setProjectDescription: (projectDescription) => set(() => ({projectDescription: projectDescription})),
  setProjects: (projects) => set(() => ({projects: projects})),
  setUniqueId: (uniqueId) => set(() => ({uniqueId: uniqueId})),
  setApiCalled: (apiCalled) => set(() => ({apiCalled: apiCalled}))
})))


// window.store = useStore


export default useStore;

