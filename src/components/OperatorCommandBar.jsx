import{useAegisStore}from'../hooks/useAegisData'
const BTNS=[['APPROVE','#00ff88','rgba(0,255,136,.14)'],['BLOCK','#ff2d78','rgba(255,45,120,.14)'],['HOLD','#ffaa00','rgba(255,170,0,.14)'],['REQUEST BRIEFING','#00e5ff','rgba(0,229,255,.1)']]
export function OperatorCommandBar(){
  const{decision}=useAegisStore()
  const op=decision.verdict==='OPERATOR_REQUIRED'
  return(
    <div style={{background:'rgba(0,2,5,.98)',border:'1px solid',borderRadius:3,borderColor:op?'rgba(204,68,255,.5)':'rgba(0,160,90,.15)',display:'flex',alignItems:'center',padding:'0 14px',gap:8,position:'relative',overflow:'hidden',transition:'all .5s ease',boxShadow:op?'0 0 35px rgba(204,68,255,.12)':'none'}}>
      <div style={{position:'absolute',top:0,left:0,right:0,height:1,background:op?'linear-gradient(90deg,transparent,rgba(204,68,255,.7),transparent)':'linear-gradient(90deg,transparent,rgba(0,255,136,.22),transparent)'}}/>
      <span style={{fontFamily:'var(--fd)',fontSize:7,letterSpacing:3,color:op?'#cc44ff':'var(--dm)',minWidth:72,textShadow:op?'0 0 12px rgba(204,68,255,.7)':'none',transition:'all .4s'}}>{op?'OPERATOR':'COMMAND'}</span>
      <div style={{width:1,height:28,background:'rgba(0,160,90,.1)'}}/>
      {BTNS.map(([l,c,bc])=>(
        <button key={l} style={{fontFamily:'var(--fd)',fontSize:7,letterSpacing:2,padding:'5px 14px',border:`1px solid ${op?bc:'rgba(14,42,62,.22)'}`,background:op?bc:'transparent',color:op?c:'rgba(14,42,62,.3)',cursor:op?'pointer':'not-allowed',borderRadius:2,transition:'all .3s',textShadow:op?`0 0 8px ${c}70`:'none'}}>{l}</button>
      ))}
      <div style={{flex:1}}/>
      <span style={{fontFamily:'var(--fm)',fontSize:8,color:'var(--dm)'}}>{op?'AWAITING OPERATOR INPUT':'AUTONOMOUS · TIER B ACTIVE'}</span>
      <div style={{width:5,height:5,borderRadius:'50%',background:op?'#cc44ff':'rgba(14,42,62,.4)',boxShadow:op?'0 0 8px #cc44ff':'none',animation:op?'pulse 1s infinite':'none'}}/>
    </div>
  )
}
