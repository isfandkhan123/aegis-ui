import{useAegisStore}from'../hooks/useAegisData'
import{orbAnim}from'../lib/formatters'
import{COGNITIVE_MSGS}from'../lib/mockData'
export function SystemConsciousness(){
  const{ticks,decision}=useAegisStore()
  const v=decision.verdict
  const oc=v==='APPROVE'?'#00ff88':v==='BLOCK'?'#ff2d78':v==='HOLD'?'#ffaa00':'#cc44ff'
  const r=Math.round(22+Math.sin(ticks*.04)*2.2)
  const l=Math.round(67+Math.sin(ticks*.05+1)*3)
  const p=Math.round(42+Math.sin(ticks*.06)*9)
  const pC=2*Math.PI*18*p/100
  const msgI=Math.floor(ticks/5)%COGNITIVE_MSGS.length
  return(
    <div className="panel" style={{display:'flex',alignItems:'stretch',overflow:'hidden',position:'relative'}}>
      <div style={{position:'absolute',top:0,left:0,width:100,height:'100%',background:`radial-gradient(ellipse at 50% 50%,${oc}06,transparent)`,pointerEvents:'none',transition:'background .8s ease'}}/>
      <div style={{width:100,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',borderRight:'1px solid rgba(0,160,90,.12)',padding:4,position:'relative',flexShrink:0}}>
        <div style={{position:'absolute',width:90,height:90,background:`radial-gradient(circle,${oc}0a,transparent)`,filter:'blur(18px)',borderRadius:'50%',pointerEvents:'none'}}/>
        <div style={{position:'relative',width:80,height:80}}>
          <svg width="80" height="80" style={{position:'absolute',top:0,left:0,overflow:'visible'}}>
            <circle cx="40" cy="40" r="37" fill="none" stroke={`${oc}0c`} strokeWidth="1" strokeDasharray="2 9" style={{animation:'spinCW 14s linear infinite'}}/>
            <circle cx="40" cy="40" r="30" fill="none" stroke={`${oc}10`} strokeWidth="1" style={{animation:'spinCCW 9s linear infinite'}}/>
            <circle cx="40" cy="40" r="24" fill="none" stroke={`${oc}18`} strokeWidth="1.5" strokeDasharray="5 5" style={{animation:'spinCW 6s linear infinite'}}/>
            <circle cx="40" cy="40" r="18" fill="none" stroke={oc} strokeWidth="2" strokeDasharray={`${pC} ${2*Math.PI*18-pC}`} strokeLinecap="round" transform="rotate(-90 40 40)" style={{filter:`drop-shadow(0 0 5px ${oc})`,transition:'stroke-dasharray .9s ease'}}/>
          </svg>
          <div style={{position:'absolute',top:'50%',left:'50%',width:32,height:32,borderRadius:'50%',background:`radial-gradient(circle at 40% 35%,${oc}30,${oc}08)`,border:`1.5px solid ${oc}`,animation:`${orbAnim(v)}, orbScale 3.5s ease-in-out infinite`,transition:'border-color .8s,background .8s'}}/>
          <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',fontFamily:'var(--fd)',fontSize:5.5,color:oc,textAlign:'center',textShadow:`0 0 8px ${oc}90`,letterSpacing:.5,lineHeight:1.3,pointerEvents:'none',zIndex:1}}>STB</div>
        </div>
        <span style={{fontFamily:'var(--fd)',fontSize:5.5,letterSpacing:2,color:`${oc}60`,marginTop:4,transition:'color .8s'}}>CONSCIOUS</span>
      </div>
      <div style={{padding:'6px 10px',flex:1,display:'flex',flexDirection:'column',gap:4,borderRight:'1px solid rgba(0,160,90,.1)'}}>
        <div style={{fontFamily:'var(--fd)',fontSize:6,letterSpacing:3,color:'var(--dm)'}}>SYSTEM CONSCIOUSNESS</div>
        <div style={{display:'flex',gap:5}}>
          {[['STATE','MONITORING',oc],['MOOD','STABLE',oc],['FOCUS','TradingAdapter','#00e5ff']].map(([lb,vl,c])=>(
            <div key={lb} style={{background:'rgba(0,8,18,.5)',border:'1px solid rgba(0,160,90,.08)',borderRadius:2,padding:'2px 6px',flex:1}}>
              <div style={{fontFamily:'var(--fd)',fontSize:5,letterSpacing:1,color:'var(--dm)'}}>{lb}</div>
              <div style={{fontFamily:'var(--fm)',fontSize:8,color:c,textShadow:`0 0 6px ${c}60`,transition:'color .8s'}}>{vl}</div>
            </div>
          ))}
        </div>
        <div style={{display:'flex',gap:5,flex:1,alignItems:'flex-end'}}>
          {[['RISK',r,'#ff2d78'],['LEARN',l,'#8844ff'],['PULSE',p,oc]].map(([lb,val,c])=>(
            <div key={lb} style={{flex:1}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:2}}>
                <span style={{fontFamily:'var(--fd)',fontSize:5,letterSpacing:1,color:'var(--dm)'}}>{lb}</span>
                <span style={{fontFamily:'var(--fm)',fontSize:8,color:c,textShadow:`0 0 5px ${c}70`}}>{val}%</span>
              </div>
              <div style={{height:2,background:'rgba(255,255,255,.03)',borderRadius:1}}><div style={{height:'100%',width:`${val}%`,background:c,borderRadius:1,opacity:.65,transition:'width .9s ease',boxShadow:`0 0 5px ${c}60`}}/></div>
            </div>
          ))}
        </div>
      </div>
      <div style={{padding:'6px 10px',flex:1.2,display:'flex',flexDirection:'column',gap:4,overflow:'hidden'}}>
        <div style={{fontFamily:'var(--fd)',fontSize:6,letterSpacing:2,color:'var(--dm)'}}>COGNITIVE STREAM</div>
        <div style={{fontFamily:'var(--fm)',fontSize:9.5,color:'rgba(110,168,200,.65)',lineHeight:1.65,flex:1,display:'flex',alignItems:'center'}}>{COGNITIVE_MSGS[msgI]}</div>
        <div style={{overflow:'hidden',height:16,position:'relative'}}>
          <div style={{position:'absolute',top:0,left:0,whiteSpace:'nowrap',fontFamily:'var(--fm)',fontSize:8,color:'rgba(14,65,95,.6)',animation:'ticker 30s linear infinite',display:'inline-block'}}>
            {[...COGNITIVE_MSGS,...COGNITIVE_MSGS].map((m,i)=><span key={i} style={{marginRight:55}}>▸ {m}</span>)}
          </div>
        </div>
      </div>
    </div>
  )
}
