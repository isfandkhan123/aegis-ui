import{useState,useEffect}from'react'
import{dColor}from'../lib/formatters'
const STEPS=['SIGNAL','RISK','PLAYBOOK','CONFLICT','DECISION']
export function ProcessingPipeline({dId,verdict}){
  const[step,setStep]=useState(STEPS.length)
  const c=dColor(verdict)
  useEffect(()=>{
    setStep(-1);let i=0
    const t=setInterval(()=>{setStep(i);i++;if(i>=STEPS.length){clearInterval(t);setTimeout(()=>setStep(STEPS.length),220)}},215)
    return()=>clearInterval(t)
  },[dId])
  return(
    <div style={{paddingTop:2}}>
      <div style={{fontFamily:'var(--fd)',fontSize:6,letterSpacing:2,color:'var(--dm)',marginBottom:5}}>PROCESSING PIPELINE</div>
      <div style={{display:'flex',alignItems:'center'}}>
        {STEPS.map((s,i)=>{
          const done=step>=STEPS.length||step>i,cur=step===i
          const nc=done?c:cur?'#00e5ff':'rgba(14,42,62,.55)'
          return(
            <div key={s} style={{display:'contents'}}>
              <div style={{display:'flex',flexDirection:'column',alignItems:'center',flex:1}}>
                <div style={{width:12,height:12,borderRadius:'50%',border:`1.5px solid ${nc}`,background:done?`${nc}22`:cur?`${nc}18`:'transparent',marginBottom:4,transition:'all .22s',boxShadow:done?`0 0 10px ${nc}70,0 0 22px ${nc}25`:cur?`0 0 14px ${nc}90`:'none',animation:cur?'pipePulse .55s ease-in-out infinite':done&&step===STEPS.length?'lockBounce .4s ease-out':'none'}}/>
                <span style={{fontFamily:'var(--fd)',fontSize:5.5,letterSpacing:.5,color:nc,transition:'all .22s',textShadow:done?`0 0 6px ${nc}70`:'none'}}>{s}</span>
              </div>
              {i<STEPS.length-1&&<div style={{flex:.4,height:2,background:done?`${nc}55`:cur?`${nc}35`:'rgba(14,42,62,.2)',marginBottom:14,transition:'all .3s',boxShadow:done?`0 0 6px ${nc}45`:'none',position:'relative',overflow:'hidden'}}>
                {cur&&<div style={{position:'absolute',inset:0,background:`linear-gradient(90deg,transparent,${nc},transparent)`,animation:'nodeScan .5s ease-in-out infinite'}}/>}
                {done&&<div style={{position:'absolute',inset:0,background:`linear-gradient(90deg,transparent,${nc}75,transparent)`,animation:'chainFlow 2s ease-in-out infinite'}}/>}
              </div>}
            </div>
          )
        })}
      </div>
    </div>
  )
}
