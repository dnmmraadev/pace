import {emptyProgress,type Progress} from './learning';
export const STORAGE_KEY='revenue-desk.progress.v1';
export function loadProgress():Progress{try{const raw=JSON.parse(localStorage.getItem(STORAGE_KEY)||'null');if(raw?.version===1&&Array.isArray(raw.completed)&&Array.isArray(raw.attempts)&&Array.isArray(raw.reviews)&&typeof raw.lastLesson==='string')return {...emptyProgress(),...raw};}catch{}return emptyProgress();}
export function saveProgress(p:Progress){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(p));return true;}catch{return false;}}
