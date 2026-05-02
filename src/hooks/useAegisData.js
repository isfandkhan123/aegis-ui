import{useEffect}from'react'
import{create}from'zustand'
import{INIT_DECISION,INIT_HISTORY,INIT_AGENTS,MODULES,makeDecision}from'../lib/mockData'
export const useAegisStore=create((set,get)=>({
  decision:INIT_DECISION,history:INIT_HISTORY,agents:INIT_AGENTS,
  ticks:0,flashModId:null,confDisplay:82,latency:42,
  time:new Date().toLocaleTimeString('en-GB',{hour12:false}),
  liveSignals:[],
  liveConnected:false,
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
