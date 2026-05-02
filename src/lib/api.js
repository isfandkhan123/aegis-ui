const BASE=import.meta.env.VITE_AEGIS_URL||'http://localhost:8000'
const get=async p=>{const r=await fetch(`${BASE}${p}`);if(!r.ok)throw new Error(`${p} ${r.status}`);return r.json()}
export const fetchStatus=()=>get('/mission/control/status')
export const fetchRecentSignals=()=>get('/signal/intake/recent')
export const fetchConsciousness=()=>get('/aegis/consciousness')
export const fetchLedger=()=>get('/aegis/ledger/recent')
export const fetchAnomalies=()=>get('/mission/control/anomalies')
