import{useEffect}from'react'
import{create}from'zustand'
import{INIT_DECISION,INIT_HISTORY,INIT_AGENTS,MODULES,makeDecision}from'../lib/mockData'
import{computeProofStatus}from'../utils/ledgerUtils'
export const useAegisStore=create((set,get)=>({
  decision:INIT_DECISION,history:INIT_HISTORY,agents:INIT_AGENTS,
  ticks:0,flashModId:null,confDisplay:82,latency:42,missionStatus:null,
  time:new Date().toLocaleTimeString('en-GB',{hour12:false}),
  liveSignals:[],
  liveConnected:false,
  latestCheckpoint:null,
  proofStatus:'LEDGER_ONLY',
  checkpointFetchedAt:null,
  tick(){set(s=>({ticks:s.ticks+1,time:new Date().toLocaleTimeString('en-GB',{hour12:false})}))},
  randomizeLatency(){set({latency:36+Math.floor(Math.random()*14)})},
  stepConf(){set(s=>{const target=s.decision.conf*100,diff=target-s.confDisplay;return{confDisplay:Math.abs(diff)<.1?target:s.confDisplay+diff*.09}})},
  flashMod(id){set({flashModId:id});setTimeout(()=>set({flashModId:null}),500)},
  newDecision(){
    const acts=MODULES.filter(m=>m.st==='active').map(m=>m.id)
    const d=makeDecision()
    set(s=>({decision:d,history:[{t:d.ts,s:d.symbol,v:d.verdict,c:d.conf},...s.history].slice(0,10)}))
    get().flashMod(acts[Math.floor(Math.random()*acts.length)])
    set({agents:INIT_AGENTS.map(a=>({...a,prog:4+Math.random()*8}))})
  },
  stepAgents(){set(s=>({agents:s.agents.map(a=>{const n=a.prog+(1.2+Math.random()*1.8);return{...a,prog:n>99?4:n}})}))},
  randomFlash(){const acts=MODULES.filter(m=>m.st==='active').map(m=>m.id);get().flashMod(acts[Math.floor(Math.random()*acts.length)])},
  setLiveSignals(signals){set({liveSignals:signals,liveConnected:true})},
  setMissionStatus(data){set({missionStatus:data,latency:data.latency_ms||42})},
  setLedgerStatus(checkpoint){
    if(checkpoint){
      set({latestCheckpoint:checkpoint,proofStatus:computeProofStatus(checkpoint),checkpointFetchedAt:Date.now()})
    }else{
      set({latestCheckpoint:null,proofStatus:'LEDGER_ONLY'})
    }
  },
}))
export function useMockTimers(){
  const s=useAegisStore()
  useEffect(()=>{const t=setInterval(s.tick,1000);return()=>clearInterval(t)},[])
  useEffect(()=>{const t=setInterval(s.randomizeLatency,3200);return()=>clearInterval(t)},[])
  useEffect(()=>{const t=setInterval(s.stepConf,50);return()=>clearInterval(t)},[])
  useEffect(()=>{const t=setInterval(s.newDecision,18000);return()=>clearInterval(t)},[])
  useEffect(()=>{const t=setInterval(s.randomFlash,4000);return()=>clearInterval(t)},[])
  useEffect(()=>{const t=setInterval(s.stepAgents,1100);return()=>clearInterval(t)},[])
}
export function useLiveSignals(){
  const setLiveSignals=useAegisStore(s=>s.setLiveSignals)
  useEffect(()=>{
    const poll=async()=>{
      try{
        const base=import.meta.env.VITE_AEGIS_URL||''
        const res=await fetch(`${base}/signal/intake/recent?limit=15`)
        if(res.ok){const data=await res.json();if(data.ok&&data.signals){setLiveSignals(data.signals)}}
      }catch(e){}
    }
    poll()
    const t=setInterval(poll,5000)
    return()=>clearInterval(t)
  },[])
}
export function useMissionStatus(){
  const setMissionStatus=useAegisStore(s=>s.setMissionStatus)
  useEffect(()=>{
    const poll=async()=>{
      try{
        const base=import.meta.env.VITE_AEGIS_URL||''
        const res=await fetch(`${base}/mission/control/status`)
        if(res.ok){const data=await res.json();if(data.ok)setMissionStatus(data)}
      }catch(e){}
    }
    poll()
    const t=setInterval(poll,10000)
    return()=>clearInterval(t)
  },[])
}
export function useLedgerStatus(){
  const setLedgerStatus=useAegisStore(s=>s.setLedgerStatus)
  useEffect(()=>{
    const poll=async()=>{
      try{
        const base=import.meta.env.VITE_AEGIS_URL||''
        const res=await fetch(`${base}/ledger/checkpoints/latest`)
        if(res.ok){
          const data=await res.json()
          if(data&&data.root_hash){setLedgerStatus(data)}
          else if(data&&data.checkpoint&&data.checkpoint.root_hash){setLedgerStatus(data.checkpoint)}
          else{setLedgerStatus(null)}
        }else{
          setLedgerStatus(null)
        }
      }catch{setLedgerStatus(null)}
    }
    poll()
    const t=setInterval(poll,30000)
    return()=>clearInterval(t)
  },[setLedgerStatus])
}
