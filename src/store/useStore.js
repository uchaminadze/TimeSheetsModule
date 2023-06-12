import { create } from 'zustand';
import zukeeper from 'zukeeper';
import {devtools} from 'zustand/middleware'

const useStore = create(devtools(set => ({
  timeSheetData: null,
  setTimeSheetData: (timeSheetData) => set(() => ({timeSheetData: timeSheetData}))
})))


// window.store = useStore


export default useStore;

