import{useAegisStore}from'../hooks/useAegisData'
import{MODULES}from'../lib/mockData'
export function ModuleNodes(){
  const{ticks,flashModId}=useAegisStore()
  return(
    <div className="panel" style={{display:'flex',flexDirection:'column',overflow:'hidden'}}>
      <div className="panel-header">MODULE NODES<span style={{color:'var(--dm)',fontSize:6}}>LAYER STATUS</span></div>
      <div style={{padding:'5px 8px 5px 14px',flex:1,overflow:'auto',display:'flex',flexDirection:'column',gap:3}}>
        {MODULES.map((m,i)=>{
          const act=m.st==='active',fl=flashModId===m.id
          const tv=act?Math.round(m.v+Math.sin(ticks*.08+i)*1.5):0
          return(
            <div key={m.id} style={{border:`1px solid ${act?'rgba(0,255,136,.28)':'rgba(14,42,62,.4)'}`,borderRadius:2,padding:'5px 7px',position:'relative',overflow:'hidden',background:fl?'rgba(0,255,136,.05)':act?'rgba(0,255,136,.012)':'transparent',animation:fl?'nodeFlash .5s ease-out':act?`nodeGlow ${2.8+i*.2}s ease-in-out infinite`:'none',transition:'border-color .3s'}}>
              {act&&!fl&&<div style={{position:'absolute',top:0,bottom:0,width:'40%',background:'linear-gradient(90deg,transparent,rgba(0,255,136,.05),transparent)',animation:`nodeScan ${2.3+i*.25}s ease-in-out infinite`,animationDelay:`${i*.28}s`}}/>}
              <div style={{display:'flex',alignItems:'center',gap:5,marginBottom:1,position:'relative'}}>
                <span className={`dot ${act?'dot-g':'dot-d'}`}/><span style={{fontFamily:'var(--fd)',fontSize:7,letterSpacing:1.5,color:act?'rgba(0,255,136,.65)':'rgba(14,42,62,.55)',flex:1}}>{m.n}</span>
                {act&&<span style={{fontFamily:'var(--fm)',fontSize:9,color:'#00ff88',textShadow:'0 0 6px rgba(0,255,136,.5)',minWidth:22,textAlign:'right'}}>{tv}</span>}
              </div>
              {act&&<div style={{height:2,background:'rgba(0,255,136,.06)',borderRadius:1,marginLeft:10,marginTop:2,overflow:'hidden'}}><div style={{height:'100%',width:`${Math.min(99,m.v+Math.sin(ticks*.04+i)*2.5)}%`,background:'rgba(0,255,136,.5)',borderRadius:1,transition:'width .7s ease',backgroundImage:'repeating-linear-gradient(90deg,transparent,transparent 6px,rgba(0,0,0,.18) 6px,rgba(0,0,0,.18) 8px)',backgroundSize:'20px 100%',animation:'barMove 1.2s linear infinite'}}/></div>}
            </div>
          )
        })}
      </div>
    </div>
  )
}
