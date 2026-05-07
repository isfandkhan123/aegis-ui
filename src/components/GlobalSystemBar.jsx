import{useState,useEffect}from'react'
import{useAegisStore}from'../hooks/useAegisData'
import{SYSTEM_INFO}from'../lib/mockData'
import{normalizeVerificationDepth,verificationDepthColor,proofStatusColor}from'../utils/ledgerUtils'
export function GlobalSystemBar(){
  const{time,latency,missionStatus,latestCheckpoint,proofStatus,checkpointFetchedAt}=useAegisStore()
  const status  = missionStatus?.status   || SYSTEM_INFO.status
  const risk    = missionStatus?.risk     || SYSTEM_INFO.risk
  const svc_on  = missionStatus?.svc_on   ?? SYSTEM_INFO.svc_on
  const svc_tot = missionStatus?.svc_tot  ?? SYSTEM_INFO.svc_tot
  const phase   = missionStatus?.phase    || SYSTEM_INFO.phase
  const [ledgerOk, setLedgerOk] = useState(false)
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const check = async () => {
      try {
        const base = import.meta.env.VITE_AEGIS_URL || ''
        const res = await fetch(`${base}/ledger/health`)
        if (res.ok) {
          const d = await res.json()
          setLedgerOk(d.ok === true)
        } else {
          setLedgerOk(false)
        }
      } catch { setLedgerOk(false) }
    }
    check()
    const t = setInterval(check, 15000)
    return () => clearInterval(t)
  }, [])
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 5000)
    return () => clearInterval(t)
  }, [])
  const integrityRaw='presence_only'
  const integrityLabel=normalizeVerificationDepth(integrityRaw)
  const integrityColor=verificationDepthColor(integrityRaw)
  const stale=checkpointFetchedAt && (now-checkpointFetchedAt)>90000
  const cpLabel=!latestCheckpoint?'NONE':stale?'STALE':(latestCheckpoint.date||'—')
  const cpColor=!latestCheckpoint||stale?'#f59e0b':'#00d4ff'
  const fields=[
    ['STATUS',     status,                            status==='ACTIVE'?'#00ff88':'#ffaa00'],
    ['AUTONOMY',   `TIER ${SYSTEM_INFO.autonomy}`,    '#00e5ff'],
    ['RISK',       risk,                              risk==='NORMAL'?'#00ff88':risk==='ELEVATED'?'#ffaa00':'#ff2d78'],
    ['SERVICES',   `${svc_on}/${svc_tot} ONLINE`,     svc_on===svc_tot?'#00ff88':'#ffaa00'],
    ['LEDGER',     ledgerOk?'CHAIN VALID':'OFFLINE',  ledgerOk?'#00ff88':'#ef4444'],
    ['INTEGRITY',  integrityLabel,                    integrityColor],
    ['CHECKPOINT', cpLabel,                           cpColor],
    ['PROOF STATE',proofStatus,                       proofStatusColor(proofStatus)],
    ['LATENCY',    `${latency}ms`,                    '#6ea8c8'],
    ['PHASE',      phase,                             '#cc44ff'],
  ]
  return(
    <div style={{background:'rgba(0,3,7,0.97)',border:'1px solid rgba(0,160,90,0.22)',borderRadius:3,display:'flex',alignItems:'center',padding:'0 14px',position:'relative',overflow:'hidden'}}>
      <div style={{position:'absolute',top:0,left:0,right:0,height:1,background:'linear-gradient(90deg,transparent,rgba(0,255,136,.65),rgba(0,229,255,.3),transparent)'}}/>
      <span style={{fontFamily:'var(--fd)',color:'#0a2535',fontSize:7,letterSpacing:4,marginRight:10}}>AEGIS</span>
      <span style={{fontFamily:'var(--fd)',color:'#00ff88',fontWeight:900,fontSize:11,letterSpacing:6,marginRight:26,textShadow:'0 0 15px rgba(0,255,136,.6),0 0 50px rgba(0,255,136,.2)'}}>MISSION CONTROL</span>
      <div style={{display:'flex',gap:0,flex:1,alignItems:'center'}}>
        {fields.map(([l,v,c],i)=>(
          <div key={l} style={{display:'flex',alignItems:'center',gap:0}}>
            {i>0&&<div style={{width:1,height:22,background:'rgba(0,160,90,.1)',margin:'0 10px'}}/>}
            <div style={{display:'flex',flexDirection:'column',gap:1}}>
              <span style={{fontFamily:'var(--fd)',color:'#0a2535',fontSize:6,letterSpacing:2}}>{l}</span>
              <span style={{fontFamily:'var(--fd)',color:c,fontSize:8.5,letterSpacing:1,textShadow:`0 0 8px ${c}55`}}>{v}</span>
            </div>
          </div>
        ))}
      </div>
      <div style={{fontFamily:'var(--fm)',fontSize:12,color:'#00ff88',letterSpacing:2,textShadow:'0 0 10px rgba(0,255,136,.5)'}}>
        {time}<span style={{animation:'blink 1s step-end infinite'}}>_</span>
      </div>
    </div>
  )
}
