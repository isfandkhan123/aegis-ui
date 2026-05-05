import{useState,useEffect}from'react'
import{useAegisStore}from'../hooks/useAegisData'
import{TRADING_STATS}from'../lib/mockData'
function CircGaugeSm({val,color,size=76,label}){
  const r=size/2-7,circ=2*Math.PI*r,dash=circ*val/100,gap=circ*(1-val/100)
  return(
    <div style={{position:'relative',width:size,height:size,flexShrink:0}}>
      <svg width={size} height={size} style={{position:'absolute',top:0,left:0,overflow:'visible'}}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="4"/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="4.5" strokeDasharray={`${dash} ${gap}`} strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`} style={{filter:`drop-shadow(0 0 5px ${color}) drop-shadow(0 0 10px ${color}50)`,transition:'stroke-dasharray 1s ease'}}/>
        <circle cx={size/2} cy={size/2} r={r+7} fill="none" stroke={`${color}15`} strokeWidth="1" strokeDasharray="3 7" style={{animation:'spinCW 10s linear infinite'}}/>
      </svg>
      <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
        <span style={{fontFamily:'var(--fd)',fontSize:15,fontWeight:700,color,textShadow:`0 0 12px ${color}80`,transition:'all .8s ease'}}>{Math.round(val)}</span>
        {label&&<span style={{fontFamily:'var(--fd)',fontSize:5.5,color:`${color}55`,letterSpacing:1}}>{label}</span>}
      </div>
    </div>
  )
}
function TradingContent(){
  const{ticks}=useAegisStore()
  const at=parseFloat((TRADING_STATS.acc_trend+Math.sin(ticks*.04)*.35).toFixed(1))
  const av=parseFloat((TRADING_STATS.acc_vol+Math.sin(ticks*.05+1)*.4).toFixed(1))
  return(
    <div style={{display:'flex',gap:14,height:'100%',alignItems:'center'}}>
      <div style={{display:'flex',gap:8,flexShrink:0}}>
        <CircGaugeSm val={at} color="#00ff88" label="TREND"/>
        <CircGaugeSm val={av} color="#00e5ff" label="VOLT"/>
        <CircGaugeSm val={TRADING_STATS.acc_ovr} color="#ffaa00" label="OVRL"/>
      </div>
      <div style={{width:1,height:68,background:'rgba(0,160,90,.12)'}}/>
      <div style={{display:'flex',gap:6,flex:1}}>
        {[['TOTAL',TRADING_STATS.total,'#d0ecff'],['APPROVE',TRADING_STATS.approvals,'#00ff88'],['BLOCK',TRADING_STATS.blocks,'#ff2d78'],['HOLD',TRADING_STATS.holds,'#ffaa00']].map(([l,v,c])=>(
          <div key={l} style={{background:'rgba(0,8,18,.7)',border:`1px solid ${c}18`,borderRadius:2,padding:'6px 8px',flex:1,textAlign:'center',position:'relative',overflow:'hidden'}}>
            <div style={{position:'absolute',top:0,left:0,right:0,height:1,background:`linear-gradient(90deg,transparent,${c}50,transparent)`}}/>
            <div style={{fontFamily:'var(--fd)',fontSize:5.5,letterSpacing:2,color:'var(--dm)',marginBottom:2}}>{l}</div>
            <div style={{fontFamily:'var(--fd)',fontSize:20,fontWeight:700,color:c,textShadow:`0 0 14px ${c}60`}}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{width:1,height:68,background:'rgba(0,160,90,.12)'}}/>
      <div style={{minWidth:108,display:'flex',flexDirection:'column',gap:5}}>
        <div style={{fontFamily:'var(--fd)',fontSize:6,letterSpacing:2,color:'var(--dm)'}}>AEGIS EFFECT</div>
        <div style={{background:'rgba(0,255,136,.03)',border:'1px solid rgba(0,255,136,.15)',borderRadius:2,padding:'5px 8px',textAlign:'center',position:'relative',overflow:'hidden',animation:'nodeGlow 3s ease-in-out infinite'}}>
          <div style={{position:'absolute',top:0,left:0,right:0,height:1,background:'linear-gradient(90deg,transparent,rgba(0,255,136,.4),transparent)'}}/>
          <div style={{fontFamily:'var(--fm)',fontSize:10,color:'#00ff88',textShadow:'0 0 10px rgba(0,255,136,.5)'}}>MEASURING</div>
          <div style={{fontFamily:'var(--fd)',fontSize:5.5,color:'var(--dm)',letterSpacing:1,marginTop:2}}>ACCUMULATING</div>
        </div>
        <div style={{fontFamily:'var(--fm)',fontSize:8,color:'var(--dm)',textAlign:'center'}}>61 matched</div>
      </div>
    </div>
  )
}
function DormantContent({name}){
  return(
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100%',flexDirection:'column',gap:6}}>
      <div style={{display:'flex',alignItems:'center',gap:8}}>
        <div style={{width:7,height:7,borderRadius:'50%',background:'rgba(14,42,62,.4)',border:'1px solid rgba(14,42,62,.6)',animation:'pulseSoft 2s ease-in-out infinite'}}/>
        <div style={{fontFamily:'var(--fd)',fontSize:9,letterSpacing:5,color:'rgba(14,42,62,.4)'}}>{name} ADAPTER</div>
      </div>
      <div style={{fontFamily:'var(--fm)',fontSize:8,color:'rgba(14,42,62,.3)'}}>DORMANT · QUEUED FOR LAYER 10 EXPANSION</div>
    </div>
  )
}
function DevContent() {
  const [actions, setActions] = useState([])
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const poll = async () => {
      try {
        const base = import.meta.env.VITE_AEGIS_URL || ''
        const res = await fetch(`${base}/dev/govern/health`)
        if (res.ok) setConnected(true)
      } catch(e) {}
    }
    poll()
    const t = setInterval(poll, 10000)
    return () => clearInterval(t)
  }, [])

  const MOCK_ACTIONS = [
    { action: 'create new file', target: 'app/adapters/ops_adapter.py', decision: 'HOLD', risk: 'LOW', ts: '17:06' },
    { action: 'create new file', target: 'app/adapters/dev_adapter.py', decision: 'APPROVE', risk: 'LOW', ts: '10:09' },
    { action: 'modify function', target: 'app/main.py', decision: 'APPROVE', risk: 'LOW', ts: '09:44' },
    { action: 'delete endpoint', target: 'app/signal_intake.py', decision: 'BLOCK', risk: 'HIGH', ts: '08:30' },
  ]

  const dC = v => v === 'APPROVE' ? '#00ff88' : v === 'BLOCK' ? '#ff2d78' : v === 'HOLD' ? '#ffaa00' : '#cc44ff'

  return (
    <div style={{ display: 'flex', gap: 14, height: '100%', alignItems: 'flex-start', paddingTop: 4 }}>
      <div style={{ minWidth: 120, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ fontFamily: 'var(--fd)', fontSize: 6, letterSpacing: 2, color: 'var(--dm)' }}>ADAPTER STATUS</div>
        <div style={{ background: connected ? 'rgba(0,255,136,0.04)' : 'rgba(20,48,64,0.3)', border: `1px solid ${connected ? 'rgba(0,255,136,0.2)' : 'rgba(20,48,64,0.4)'}`, borderRadius: 2, padding: '6px 8px', textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--fm)', fontSize: 9, color: connected ? '#00ff88' : 'var(--dm)' }}>{connected ? 'ONLINE' : 'CONNECTING'}</div>
          <div style={{ fontFamily: 'var(--fd)', fontSize: 5.5, color: 'var(--dm)', marginTop: 2 }}>da1_v1 · dp1_v1</div>
        </div>
        <div style={{ background: 'rgba(0,10,20,0.6)', border: '1px solid rgba(0,180,100,0.09)', borderRadius: 2, padding: '5px 8px' }}>
          <div style={{ fontFamily: 'var(--fd)', fontSize: 5.5, color: 'var(--dm)', marginBottom: 3 }}>ENDPOINTS</div>
          {['POST /dev/govern', 'POST /dev/pipeline', 'POST /dev/govern/batch'].map(e => (
            <div key={e} style={{ fontFamily: 'var(--fm)', fontSize: 7.5, color: 'rgba(0,255,136,0.5)', marginBottom: 2 }}>{e}</div>
          ))}
        </div>
      </div>

      <div style={{ width: 1, height: 100, background: 'rgba(0,160,90,0.12)', marginTop: 4 }} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ fontFamily: 'var(--fd)', fontSize: 6, letterSpacing: 2, color: 'var(--dm)' }}>RECENT GOVERNED ACTIONS</div>
        {MOCK_ACTIONS.map((a, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 8px', background: 'rgba(0,8,18,0.7)', border: `1px solid ${dC(a.decision)}18`, borderRadius: 2, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${dC(a.decision)}30,transparent)` }} />
            <span style={{ fontFamily: 'var(--fm)', fontSize: 7.5, color: 'var(--dm)', width: 32 }}>{a.ts}</span>
            <span style={{ fontFamily: 'var(--fm)', fontSize: 8.5, color: 'var(--tx)', flex: 1 }}>{a.action}</span>
            <span style={{ fontFamily: 'var(--fm)', fontSize: 8, color: 'rgba(110,168,200,0.5)', flex: 1.2 }}>{a.target}</span>
            <span style={{ fontFamily: 'var(--fd)', fontSize: 6, color: a.risk === 'HIGH' ? '#ff2d78' : a.risk === 'MEDIUM' ? '#ffaa00' : '#00ff88', width: 40 }}>{a.risk}</span>
            <span style={{ fontFamily: 'var(--fd)', fontSize: 7.5, color: dC(a.decision), textShadow: `0 0 6px ${dC(a.decision)}50`, width: 50, textAlign: 'right' }}>{a.decision}</span>
          </div>
        ))}
      </div>

      <div style={{ width: 1, height: 100, background: 'rgba(0,160,90,0.12)', marginTop: 4 }} />

      <div style={{ minWidth: 100, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ fontFamily: 'var(--fd)', fontSize: 6, letterSpacing: 2, color: 'var(--dm)' }}>GOVERNANCE</div>
        {[['APPROVE', 2, '#00ff88'], ['HOLD', 1, '#ffaa00'], ['BLOCK', 1, '#ff2d78']].map(([l, v, c]) => (
          <div key={l} style={{ background: 'rgba(0,8,18,0.7)', border: `1px solid ${c}18`, borderRadius: 2, padding: '5px 8px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--fd)', fontSize: 5.5, color: 'var(--dm)', marginBottom: 2 }}>{l}</div>
            <div style={{ fontFamily: 'var(--fd)', fontSize: 18, fontWeight: 700, color: c, textShadow: `0 0 10px ${c}50` }}>{v}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
function OpsContent() {
  const [health, setHealth] = useState(false)
  const [services, setServices] = useState([
    { name: 'aegis', active: true, status: 'active' },
    { name: 'alpha-bot', active: true, status: 'active' },
    { name: 'signal-bridge', active: true, status: 'active' },
  ])

  useEffect(() => {
    const poll = async () => {
      try {
        const base = import.meta.env.VITE_AEGIS_URL || ''
        const res = await fetch(`${base}/mission/control/status`)
        if (res.ok) {
          const data = await res.json()
          if (data.ok) {
            setHealth(true)
            if (data.services) setServices(data.services)
          }
        }
      } catch(e) {}
    }
    poll()
    const t = setInterval(poll, 10000)
    return () => clearInterval(t)
  }, [])

  const MOCK_OPS = [
    { action: 'check status', target: 'aegis', decision: 'APPROVE', risk: 'LOW', ts: '11:30' },
    { action: 'restart service', target: 'alpha-bot', decision: 'APPROVE', risk: 'MEDIUM', ts: '09:15' },
    { action: 'restart service', target: 'aegis', decision: 'HOLD', risk: 'MEDIUM', ts: '08:40' },
    { action: 'kill process', target: 'signal-bridge', decision: 'BLOCK', risk: 'HIGH', ts: '07:22' },
  ]

  const dC = v => v === 'APPROVE' ? '#00ff88' : v === 'BLOCK' ? '#ff2d78' : v === 'HOLD' ? '#ffaa00' : '#cc44ff'

  return (
    <div style={{ display: 'flex', gap: 14, height: '100%', alignItems: 'flex-start', paddingTop: 4 }}>
      {/* Service health */}
      <div style={{ minWidth: 130, display: 'flex', flexDirection: 'column', gap: 5 }}>
        <div style={{ fontFamily: 'var(--fd)', fontSize: 6, letterSpacing: 2, color: 'var(--dm)' }}>SERVICE HEALTH</div>
        {services.map(s => (
          <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '5px 8px', background: 'rgba(0,8,18,0.7)', border: `1px solid ${s.active ? 'rgba(0,255,136,0.2)' : 'rgba(255,45,120,0.2)'}`, borderRadius: 2 }}>
            <span className={`dot ${s.active ? 'dot-g' : 'dot-r'}`} />
            <span style={{ fontFamily: 'var(--fd)', fontSize: 7, color: s.active ? 'rgba(0,255,136,0.7)' : '#ff2d78', flex: 1 }}>{s.name}</span>
            <span style={{ fontFamily: 'var(--fm)', fontSize: 7.5, color: s.active ? 'rgba(0,255,136,0.5)' : '#ff2d78' }}>{s.status}</span>
          </div>
        ))}
        <div style={{ fontFamily: 'var(--fd)', fontSize: 5.5, color: 'var(--dm)', marginTop: 2, letterSpacing: 1 }}>
          oa1_v1 · oe1_v1
        </div>
      </div>

      <div style={{ width: 1, height: 100, background: 'rgba(0,160,90,0.12)', marginTop: 4 }} />

      {/* Recent governed ops */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ fontFamily: 'var(--fd)', fontSize: 6, letterSpacing: 2, color: 'var(--dm)' }}>RECENT GOVERNED OPS</div>
        {MOCK_OPS.map((a, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 8px', background: 'rgba(0,8,18,0.7)', border: `1px solid ${dC(a.decision)}18`, borderRadius: 2, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${dC(a.decision)}30,transparent)` }} />
            <span style={{ fontFamily: 'var(--fm)', fontSize: 7.5, color: 'var(--dm)', width: 32 }}>{a.ts}</span>
            <span style={{ fontFamily: 'var(--fm)', fontSize: 8.5, color: 'var(--tx)', flex: 1 }}>{a.action}</span>
            <span style={{ fontFamily: 'var(--fm)', fontSize: 8, color: 'rgba(110,168,200,0.5)', flex: 1 }}>{a.target}</span>
            <span style={{ fontFamily: 'var(--fd)', fontSize: 6, color: a.risk === 'HIGH' ? '#ff2d78' : a.risk === 'MEDIUM' ? '#ffaa00' : '#00ff88', width: 44 }}>{a.risk}</span>
            <span style={{ fontFamily: 'var(--fd)', fontSize: 7.5, color: dC(a.decision), textShadow: `0 0 6px ${dC(a.decision)}50`, width: 50, textAlign: 'right' }}>{a.decision}</span>
          </div>
        ))}
      </div>

      <div style={{ width: 1, height: 100, background: 'rgba(0,160,90,0.12)', marginTop: 4 }} />

      {/* Stats */}
      <div style={{ minWidth: 90, display: 'flex', flexDirection: 'column', gap: 5 }}>
        <div style={{ fontFamily: 'var(--fd)', fontSize: 6, letterSpacing: 2, color: 'var(--dm)' }}>GOVERNANCE</div>
        {[['APPROVE', 2, '#00ff88'], ['HOLD', 1, '#ffaa00'], ['BLOCK', 1, '#ff2d78']].map(([l, v, c]) => (
          <div key={l} style={{ background: 'rgba(0,8,18,0.7)', border: `1px solid ${c}18`, borderRadius: 2, padding: '4px 8px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--fd)', fontSize: 5.5, color: 'var(--dm)', marginBottom: 2 }}>{l}</div>
            <div style={{ fontFamily: 'var(--fd)', fontSize: 18, fontWeight: 700, color: c, textShadow: `0 0 10px ${c}50` }}>{v}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
function FinContent() {
  const MOCK_FIN = [
    { action: 'approve expense', target: 'vendor:AWS', amount: 4500, decision: 'APPROVE', risk: 'MEDIUM', ts: '13:30' },
    { action: 'release payment', target: 'vendor:Stripe', amount: 12000, decision: 'HOLD', risk: 'MEDIUM', ts: '11:15' },
    { action: 'wire transfer', target: 'bank:HSBC', amount: 85000, decision: 'OPERATOR_REQUIRED', risk: 'HIGH', ts: '10:00' },
    { action: 'freeze account', target: 'account:ops', amount: 0, decision: 'OPERATOR_REQUIRED', risk: 'HIGH', ts: '09:22' },
    { action: 'view balance', target: 'account:main', amount: 0, decision: 'APPROVE', risk: 'LOW', ts: '08:45' },
  ]

  const dC = v => v === 'APPROVE' ? '#00ff88' : v === 'BLOCK' ? '#ff2d78' : v === 'HOLD' ? '#ffaa00' : '#cc44ff'
  const fmt = n => n >= 1000 ? `$${(n/1000).toFixed(0)}k` : n > 0 ? `$${n}` : '—'

  return (
    <div style={{ display: 'flex', gap: 14, height: '100%', alignItems: 'flex-start', paddingTop: 4 }}>
      {/* Policy info */}
      <div style={{ minWidth: 120, display: 'flex', flexDirection: 'column', gap: 5 }}>
        <div style={{ fontFamily: 'var(--fd)', fontSize: 6, letterSpacing: 2, color: 'var(--dm)' }}>POLICY</div>
        <div style={{ background: 'rgba(0,8,18,0.7)', border: '1px solid rgba(0,255,136,0.15)', borderRadius: 2, padding: '6px 8px' }}>
          <div style={{ fontFamily: 'var(--fd)', fontSize: 5.5, color: 'var(--dm)', marginBottom: 6, letterSpacing: 1 }}>THRESHOLDS</div>
          {[['LOW', '<$1k', '#00ff88'], ['MEDIUM', '$1k-$50k', '#ffaa00'], ['HIGH', '>$50k', '#ff2d78']].map(([l, v, c]) => (
            <div key={l} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
              <span style={{ fontFamily: 'var(--fd)', fontSize: 6, color: c }}>{l}</span>
              <span style={{ fontFamily: 'var(--fm)', fontSize: 7.5, color: 'rgba(110,168,200,0.5)' }}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{ fontFamily: 'var(--fd)', fontSize: 5.5, color: 'var(--dm)', letterSpacing: 1 }}>fa1_v1 · fin_policy_v1</div>
      </div>

      <div style={{ width: 1, height: 100, background: 'rgba(0,160,90,0.12)', marginTop: 4 }} />

      {/* Recent governed fin actions */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ fontFamily: 'var(--fd)', fontSize: 6, letterSpacing: 2, color: 'var(--dm)' }}>RECENT GOVERNED ACTIONS</div>
        {MOCK_FIN.map((a, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 8px', background: 'rgba(0,8,18,0.7)', border: `1px solid ${dC(a.decision)}18`, borderRadius: 2, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${dC(a.decision)}30,transparent)` }} />
            <span style={{ fontFamily: 'var(--fm)', fontSize: 7.5, color: 'var(--dm)', width: 32 }}>{a.ts}</span>
            <span style={{ fontFamily: 'var(--fm)', fontSize: 8.5, color: 'var(--tx)', flex: 1 }}>{a.action}</span>
            <span style={{ fontFamily: 'var(--fm)', fontSize: 8, color: 'rgba(110,168,200,0.5)', flex: 1 }}>{a.target}</span>
            <span style={{ fontFamily: 'var(--fm)', fontSize: 8, color: '#ffaa00', width: 36, textAlign: 'right' }}>{fmt(a.amount)}</span>
            <span style={{ fontFamily: 'var(--fd)', fontSize: 6, color: a.risk === 'HIGH' ? '#ff2d78' : a.risk === 'MEDIUM' ? '#ffaa00' : '#00ff88', width: 44 }}>{a.risk}</span>
            <span style={{ fontFamily: 'var(--fd)', fontSize: 7.5, color: dC(a.decision), textShadow: `0 0 6px ${dC(a.decision)}50`, width: 66, textAlign: 'right' }}>{a.decision}</span>
          </div>
        ))}
      </div>

      <div style={{ width: 1, height: 100, background: 'rgba(0,160,90,0.12)', marginTop: 4 }} />

      {/* Stats */}
      <div style={{ minWidth: 90, display: 'flex', flexDirection: 'column', gap: 5 }}>
        <div style={{ fontFamily: 'var(--fd)', fontSize: 6, letterSpacing: 2, color: 'var(--dm)' }}>GOVERNANCE</div>
        {[['APPROVE', 2, '#00ff88'], ['HOLD', 1, '#ffaa00'], ['OP REQ', 2, '#cc44ff']].map(([l, v, c]) => (
          <div key={l} style={{ background: 'rgba(0,8,18,0.7)', border: `1px solid ${c}18`, borderRadius: 2, padding: '4px 8px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--fd)', fontSize: 5.5, color: 'var(--dm)', marginBottom: 2 }}>{l}</div>
            <div style={{ fontFamily: 'var(--fd)', fontSize: 18, fontWeight: 700, color: c, textShadow: `0 0 10px ${c}50` }}>{v}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
export function AdapterTabs(){
  const[tab,setTab]=useState('trading')
  return(
    <div className="panel" style={{display:'flex',flexDirection:'column',overflow:'hidden'}}>
      <div style={{display:'flex',alignItems:'stretch',borderBottom:'1px solid rgba(0,160,90,.1)',background:'rgba(0,0,0,.2)'}}>
        <span style={{fontFamily:'var(--fd)',fontSize:7,letterSpacing:3,color:'var(--dm)',padding:'0 12px',display:'flex',alignItems:'center'}}>ADAPTERS</span>
        {[['trading','TRADING',true],['dev','DEV',true],['ops','OPS',true],['fin','FIN',true],['support','SUPPORT',false]].map(([id,l,live])=>(
          <button key={id} onClick={()=>live&&setTab(id)} style={{fontFamily:'var(--fd)',fontSize:7,letterSpacing:2,padding:'8px 12px',border:'none',borderBottom:tab===id?'2px solid #00ff88':'2px solid transparent',background:'transparent',color:tab===id?'#00ff88':live?'var(--dm)':'rgba(14,42,62,.4)',cursor:live?'pointer':'not-allowed',transition:'all .2s',display:'flex',alignItems:'center',gap:5,textShadow:tab===id?'0 0 8px rgba(0,255,136,.5)':'none'}}>
            {l}
            {live&&<span style={{width:4,height:4,borderRadius:'50%',background:'#00ff88',boxShadow:'0 0 5px #00ff88',display:'inline-block'}}/>}
            {!live&&<span style={{fontFamily:'var(--fm)',fontSize:6,color:'rgba(14,42,62,.35)'}}>DORMANT</span>}
          </button>
        ))}
      </div>
      <div style={{flex:1,padding:'8px 12px 8px 14px',overflow:'hidden'}}>
        {tab==='trading'?<TradingContent/>:tab==='dev'?<DevContent/>:tab==='ops'?<OpsContent/>:tab==='fin'?<FinContent/>:<DormantContent name={tab.toUpperCase()}/>}
      </div>
    </div>
  )
}
