import{useState,useEffect}from'react'
import{motion,AnimatePresence}from'framer-motion'
import{useAegisStore}from'../hooks/useAegisData'
import{dColor,dGlowAnim,riskColor}from'../lib/formatters'
import{ProcessingPipeline}from'./ProcessingPipeline'
function CircGauge({val,color,size=88,label}){
  const r=size/2-7,circ=2*Math.PI*r,dash=circ*val/100,gap=circ*(1-val/100)
  return(
    <div style={{position:'relative',width:size,height:size,flexShrink:0}}>
      <svg width={size} height={size} style={{position:'absolute',top:0,left:0,overflow:'visible'}}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="4"/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="4.5" strokeDasharray={`${dash} ${gap}`} strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`} style={{filter:`drop-shadow(0 0 5px ${color}) drop-shadow(0 0 10px ${color}50)`,transition:'stroke-dasharray 1s ease'}}/>
        <circle cx={size/2} cy={size/2} r={r+7} fill="none" stroke={`${color}15`} strokeWidth="1" strokeDasharray="3 7" style={{animation:'spinCW 10s linear infinite'}}/>
        <circle cx={size/2} cy={size/2} r={r-7} fill="none" stroke={`${color}0a`} strokeWidth="1" style={{animation:'spinCCW 7s linear infinite'}}/>
      </svg>
      <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
        <span style={{fontFamily:'var(--fd)',fontSize:15,fontWeight:700,color,textShadow:`0 0 12px ${color}80`,transition:'all .8s ease'}}>{Math.round(val)}</span>
        {label&&<span style={{fontFamily:'var(--fd)',fontSize:5.5,color:`${color}55`,letterSpacing:1}}>{label}</span>}
      </div>
    </div>
  )
}
export function CoreDecisionPanel(){
  const{decision,confDisplay}=useAegisStore()
  const[burst,setBurst]=useState(false)
  useEffect(()=>{setBurst(true);const t=setTimeout(()=>setBurst(false),1300);return()=>clearTimeout(t)},[decision.id])
  const c=dColor(decision.verdict)
  return(
    <div className="panel" style={{display:'flex',flexDirection:'column',overflow:'hidden'}}>
      <div className="panel-header">CORE DECISION<span style={{color:'var(--dm)',fontSize:6}}>GOVERNED OUTPUT</span></div>
      <div style={{flex:1,display:'flex',flexDirection:'column',padding:'8px 14px',gap:6,position:'relative'}}>
        <div style={{position:'absolute',inset:0,background:`radial-gradient(ellipse at 50% 45%,${c}05,transparent 65%)`,transition:'background .8s ease',pointerEvents:'none'}}/>
        {burst&&<div style={{position:'absolute',top:'42%',left:'50%',width:220,height:130,background:`radial-gradient(ellipse,${c}38,transparent 70%)`,filter:'blur(22px)',borderRadius:'50%',animation:'burstAnim 1s ease-out forwards',pointerEvents:'none',zIndex:0}}/>}
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',position:'relative',zIndex:1}}>
          <span style={{fontFamily:'var(--fd)',fontSize:14,color:'var(--hi)',letterSpacing:2,fontWeight:700,textShadow:`0 0 12px ${c}40`}}>{decision.symbol}</span>
          <div style={{display:'flex',gap:5}}>
            <span style={{fontFamily:'var(--fd)',fontSize:7.5,color:c,border:`1px solid ${c}50`,padding:'2px 7px',borderRadius:2,textShadow:`0 0 8px ${c}60`,background:`${c}08`}}>{decision.regime}</span>
            <span style={{fontFamily:'var(--fd)',fontSize:7.5,color:riskColor(decision.risk)}}>{decision.risk}</span>
          </div>
        </div>
        <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:18,position:'relative',zIndex:1}}>
          <div style={{position:'absolute',width:300,height:130,background:`radial-gradient(ellipse,${c}09,transparent)`,filter:'blur(28px)',borderRadius:'50%',pointerEvents:'none'}}/>
          <CircGauge val={confDisplay} color={c} size={88} label="CONF%"/>
          <div style={{display:'flex',flexDirection:'column',gap:5}}>
            <AnimatePresence mode="wait">
              <motion.div key={decision.id} initial={{opacity:0,scale:.76,y:14}} animate={{opacity:1,scale:1,y:0}} transition={{type:'spring',stiffness:300,damping:20}} style={{fontFamily:'var(--fd)',fontWeight:900,fontSize:58,color:c,letterSpacing:4,lineHeight:1,animation:dGlowAnim(decision.verdict)}}>
                {decision.verdict}
              </motion.div>
            </AnimatePresence>
            <div style={{fontFamily:'var(--fm)',fontSize:8.5,color:'rgba(110,168,200,.38)'}}>ID:{decision.id} · {decision.ts}</div>
            <div style={{display:'flex',gap:7,alignItems:'center'}}>
              <span style={{fontFamily:'var(--fd)',fontSize:10,color:'#00e5ff',letterSpacing:1}}>LONG</span>
              <div style={{width:1,height:12,background:'rgba(0,160,90,.2)'}}/>
              <span style={{fontFamily:'var(--fd)',fontSize:10,color:c,letterSpacing:1}}>{(decision.conf*100).toFixed(1)}%</span>
              <div style={{width:1,height:12,background:'rgba(0,160,90,.2)'}}/>
              <span style={{fontFamily:'var(--fd)',fontSize:8,color:'rgba(110,168,200,.45)'}}>{decision.regime}</span>
            </div>
          </div>
        </div>
        <div style={{position:'relative',zIndex:1}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:3}}>
            <span style={{fontFamily:'var(--fd)',fontSize:6,letterSpacing:2,color:'var(--dm)'}}>CONFIDENCE</span>
            <span style={{fontFamily:'var(--fm)',fontSize:9,color:'#00e5ff'}}>{(decision.conf*100).toFixed(1)}%</span>
          </div>
          <div style={{height:3,background:'rgba(0,229,255,.06)',borderRadius:2,overflow:'hidden'}}>
            <div style={{height:'100%',width:`${decision.conf*100}%`,borderRadius:2,transition:'width .9s ease',background:'linear-gradient(90deg,rgba(0,229,255,.3),rgba(0,229,255,.8))',backgroundImage:'repeating-linear-gradient(90deg,transparent,transparent 8px,rgba(0,0,0,.15) 8px,rgba(0,0,0,.15) 10px)',backgroundSize:'20px 100%',animation:'barMove 1.2s linear infinite',boxShadow:'0 0 6px rgba(0,229,255,.4)'}}/>
          </div>
        </div>
        <ProcessingPipeline dId={decision.id} verdict={decision.verdict}/>
      </div>
    </div>
  )
}
