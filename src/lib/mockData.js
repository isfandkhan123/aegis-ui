export const VERDICTS=['APPROVE','APPROVE','APPROVE','HOLD','HOLD','BLOCK']
export const SYMBOLS=['BTC/USDT','SOL/USDT','XRP/USDT','ETH/USDT','SKYAI/USDT']
export const REGIMES=['TRENDING','VOLATILE']
export const INIT_DECISION={id:'a8f3b2c1',symbol:'BTC/USDT',dir:'LONG',conf:.82,regime:'TRENDING',risk:'LOW',verdict:'APPROVE',ts:'11:30:24'}
export const MODULES=[
  {id:'sig',n:'Signal Engine',st:'active',v:82},{id:'risk',n:'Risk Engine',st:'active',v:91},
  {id:'poly',n:'Polymarket',st:'idle',v:0},{id:'play',n:'Playbook Router',st:'idle',v:0},
  {id:'conf',n:'Conflict Detect',st:'active',v:98},{id:'eval',n:'Evaluator',st:'idle',v:84},
  {id:'ctx',n:'Context Builder',st:'active',v:95},{id:'comms',n:'Comms Layer',st:'active',v:100},
]
export const INIT_HISTORY=[
  {t:'11:30',s:'BTC/USDT',v:'APPROVE',c:.82},{t:'11:28',s:'XRP/USDT',v:'HOLD',c:.58},
  {t:'11:20',s:'SKYAI',v:'HOLD',c:.60},{t:'10:55',s:'SKYAI',v:'HOLD',c:.55},
  {t:'09:18',s:'SKYAI',v:'BLOCK',c:.69},{t:'08:35',s:'SKYAI',v:'HOLD',c:.60},
  {t:'07:12',s:'BTC/USDT',v:'APPROVE',c:.77},{t:'06:48',s:'SOL/USDT',v:'APPROVE',c:.81},
]
export const COGNITIVE_MSGS=['Monitoring governed trading signals · TradingAdapter online','Volatile regime edge remains strong · 80.2% accuracy','Crisis signals suppressed · hard block enforced','Risk pressure stable · position FLAT · no exposure','Decision proof chain valid · CHAIN INTACT','Awaiting operator only on Tier C actions','Calibration state NORMAL · no drift detected','263 signals governed · 0 unresolved conflicts']
export const CHAIN_STEPS=[{l:'SIG',done:true},{l:'POL',done:true},{l:'RSK',done:true},{l:'PLY',done:true},{l:'CNF',done:true},{l:'DEC',done:true},{l:'LED',done:false},{l:'HSH',done:false}]
export const SYSTEM_INFO={status:'ACTIVE',autonomy:'B',risk:'NORMAL',svc_on:3,svc_tot:3,phase:'E · LAYER 10'}
export const TRADING_STATS={acc_trend:84.2,acc_vol:80.2,acc_ovr:71.8,total:263,approvals:12,blocks:15,holds:38}
export const INIT_AGENTS=[
  {id:'A-4821',task:'Analyzing signal quality',worker:'SignalAnalysis',prog:68},
  {id:'A-4822',task:'Assessing risk exposure',worker:'RiskAssessment',prog:47},
  {id:'A-4823',task:'Scanning playbook registry',worker:'PlaybookAnalysis',prog:31},
]
export const makeDecision=()=>{
  const v=VERDICTS[Math.floor(Math.random()*VERDICTS.length)]
  const s=SYMBOLS[Math.floor(Math.random()*SYMBOLS.length)]
  const c=parseFloat((.55+Math.random()*.37).toFixed(3))
  return{id:Math.random().toString(16).slice(2,10),symbol:s,dir:'LONG',conf:c,regime:Math.random()>.5?'TRENDING':'VOLATILE',risk:v==='APPROVE'?'LOW':v==='BLOCK'?'HIGH':'MEDIUM',verdict:v,ts:new Date().toLocaleTimeString('en-GB',{hour12:false})}
}
