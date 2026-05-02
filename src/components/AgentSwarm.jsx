import{useAegisStore}from'../hooks/useAegisData'
import{useAgentTravel}from'../hooks/useAgentTravel'
import{dColor}from'../lib/formatters'
const STAGES=['SIGNAL','RISK','PLAYBOOK','CONFLICT','DECISION']
function SignalHistory({history,liveConn}){
  return(
    <div className="panel" style={{flex:1,overflow:'hidden'}}>
      <div className="panel-header">SIGNAL HISTORY {liveConn && <span style={{color:'#00ff88',fontSize:6,letterSpacing:1}}>● LIVE</span>}<span style={{color:'var(--dm)',fontSize:6}}>{history.length} ENTRIES</span></div>
      <div style={{padding:'4px 8px 4px 14px',overflow:'auto',height:'calc(100% - 30px)'}}>
        {history.map((h,i)=>(
          <div key={i} style={{display:'flex',alignItems:'center',gap:5,padding:'3px 0',borderBottom:'1px solid rgba(0,160,90,.04)',fontFamily:'var(--fm)',fontSize:9,opacity:1-i*.065}}>
            <span style={{color:'var(--dm)',width:34,fontSize:8}}>{h.t}</span>
            <span style={{color:'var(--hi)',flex:1,fontSize:8.5}}>{h.s}</span>
            <span style={{color:dColor(h.v),fontSize:7.5,fontFamily:'var(--fd)',width:46,textAlign:'right',letterSpacing:.5,textShadow:`0 0 6px ${dColor(h.v)}50`}}>{h.v}</span>
            <span style={{fontFamily:'var(--fm)',fontSize:8,color:'rgba(110,168,200,.35)',width:30,textAlign:'right'}}>{(h.c*100).toFixed(0)}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
function SwarmCanvas({agents,verdict}){
  const ref=useAgentTravel(agents,verdict)
  return <canvas ref={ref} style={{width:'100%',height:80,display:'block'}}/>
}
export function AgentSwarm(){
  const{agents,history,decision,liveSignals,liveConnected}=useAegisStore()
  return(
    <div style={{display:'flex',flexDirection:'column',gap:3,overflow:'hidden'}}>
      <div className="panel" style={{flex:'0 0 auto'}}>
        <div className="panel-header" style={{borderBottomColor:'rgba(0,229,255,.12)'}}>AGENT SWARM<span className="dot dot-c" style={{marginLeft:5}}/></div>
        <div style={{padding:'4px 8px 4px 14px'}}>
          <div style={{display:'flex',justifyContent:'space-between',padding:'0 6px',marginBottom:2}}>
            {STAGES.map(s=><span key={s} style={{fontFamily:'var(--fd)',fontSize:5,letterSpacing:.5,color:'rgba(14,50,75,.7)'}}>{s}</span>)}
          </div>
          <SwarmCanvas agents={agents} verdict={decision.verdict}/>
          <div style={{display:'flex',flexDirection:'column',gap:2,marginTop:4}}>
            {agents.map(a=>(
              <div key={a.id} style={{display:'flex',alignItems:'center',gap:6,padding:'3px 6px',background:'rgba(0,12,25,.55)',border:'1px solid rgba(0,229,255,.12)',borderRadius:2}}>
                <span style={{fontFamily:'var(--fd)',fontSize:7,color:'#00e5ff',letterSpacing:1,textShadow:'0 0 6px rgba(0,229,255,.5)',width:40}}>{a.id}</span>
                <span style={{fontFamily:'var(--fm)',fontSize:8.5,color:'var(--tx)',flex:1}}>{a.task}</span>
                <div style={{width:48,height:2,background:'rgba(0,229,255,.07)',borderRadius:1}}><div style={{height:'100%',width:`${a.prog}%`,background:'rgba(0,229,255,.6)',borderRadius:1,transition:'width 1s ease'}}/></div>
                <span style={{fontFamily:'var(--fd)',fontSize:6,color:'rgba(0,229,255,.4)',width:20,textAlign:'right'}}>{Math.round(a.prog)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <SignalHistory history={liveConnected && liveSignals.length > 0 ? liveSignals.map(s=>({t:s.logged_at?.slice(11,16)||'--:--',s:s.symbol,v:s.governed_decision,c:s.confidence})) : history} liveConn={liveConnected}/>
    </div>
  )
}
