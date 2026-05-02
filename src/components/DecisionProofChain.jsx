import{useState,useEffect}from'react'
import{useAegisStore}from'../hooks/useAegisData'
import{CHAIN_STEPS}from'../lib/mockData'
export function DecisionProofChain(){
  const{decision}=useAegisStore()
  const[anim,setAnim]=useState(false)
  const[verified,setVerified]=useState(false)
  useEffect(()=>{
    setAnim(false);setVerified(false)
    const t1=setTimeout(()=>setAnim(true),160)
    const t2=setTimeout(()=>setVerified(true),900)
    return()=>{clearTimeout(t1);clearTimeout(t2)}
  },[decision.id])
  return(
    <div className="panel" style={{overflow:'hidden'}}>
      <div className="panel-header">
        DECISION PROOF CHAIN
        <div style={{display:'flex',gap:10,alignItems:'center',fontFamily:'var(--fm)',fontSize:7.5}}>
          <span style={{color:'var(--dm)'}}>ID: <span style={{color:'#00ff88'}}>{decision.id}</span></span>
          <span style={{color:'var(--dm)'}}>POLICY: <span style={{color:'#ffaa00'}}>NORMAL</span></span>
          {verified&&<span style={{color:'#00ff88',fontFamily:'var(--fd)',fontSize:6.5,letterSpacing:1.5,textShadow:'0 0 10px rgba(0,255,136,.7)',animation:'verifiedFade .5s ease-out'}}>✓ CHAIN VALID</span>}
        </div>
      </div>
      <div style={{padding:'8px 12px 6px 14px',position:'relative'}}>
        {verified&&<div style={{position:'absolute',inset:'2px 8px',background:'radial-gradient(ellipse at 50% 50%,rgba(0,255,136,.02),transparent)',pointerEvents:'none',borderRadius:2}}/>}
        <div style={{display:'flex',alignItems:'center'}}>
          {CHAIN_STEPS.map((s,i)=>(
            <div key={s.l} style={{display:'contents'}}>
              <div style={{display:'flex',flexDirection:'column',alignItems:'center',flex:1}}>
                <div style={{width:32,height:32,borderRadius:'50%',border:`2px solid ${s.done?'#00ff88':'rgba(14,42,62,.45)'}`,background:s.done?'rgba(0,255,136,.07)':'rgba(0,8,18,.6)',display:'flex',alignItems:'center',justifyContent:'center',transition:`all ${i*.07+.25}s ease`,boxShadow:anim&&s.done?'0 0 18px rgba(0,255,136,.6),0 0 40px rgba(0,255,136,.2)':s.done?'0 0 8px rgba(0,255,136,.25)':'none',animation:anim&&s.done?'chainLock .45s ease-out':'none',animationDelay:`${i*.07}s`}}>
                  {s.done?<svg width="14" height="14" viewBox="0 0 14 14"><polyline points="2,7 6,11 12,3" fill="none" stroke="#00ff88" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>:<svg width="12" height="12" viewBox="0 0 12 12"><rect x="2.5" y="5.5" width="7" height="5" rx="1" fill="none" stroke="rgba(14,42,62,.6)" strokeWidth="1.2"/><path d="M4 5.5V4a2 2 0 0 1 4 0v1.5" fill="none" stroke="rgba(14,42,62,.6)" strokeWidth="1.2"/></svg>}
                </div>
                <span style={{fontFamily:'var(--fd)',fontSize:5.5,letterSpacing:1,marginTop:4,color:s.done?'#00ff88':'rgba(14,42,62,.45)',transition:'all .3s',textShadow:s.done&&anim?'0 0 6px rgba(0,255,136,.5)':'none'}}>{s.l}</span>
                {!s.done&&<span style={{fontFamily:'var(--fd)',fontSize:4.5,letterSpacing:1,color:'rgba(14,42,62,.4)',marginTop:1}}>LOCKED</span>}
              </div>
              {i<CHAIN_STEPS.length-1&&<div style={{flex:.5,height:3,marginBottom:22,transition:`all .35s ease`,transitionDelay:`${i*.07}s`,background:s.done?'rgba(0,255,136,.35)':'rgba(14,42,62,.18)',boxShadow:anim&&s.done?'0 0 8px rgba(0,255,136,.3)':'none',borderRadius:2,position:'relative',overflow:'hidden'}}>
                {anim&&s.done&&<div style={{position:'absolute',inset:0,background:'linear-gradient(90deg,transparent,rgba(0,255,136,.65),transparent)',animation:`chainFlow ${1.8+i*.08}s ease-in-out infinite`,animationDelay:`${i*.07}s`}}/>}
              </div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
