import {useState, useMemo} from 'react'
import {truncateHash, normalizeVerificationDepth, proofStatusColor, verificationDepthColor} from '../utils/ledgerUtils'
import {useAegisStore} from '../hooks/useAegisData'

const C = {green:'#00ff88', cyan:'#00d4ff', yellow:'#f59e0b', red:'#ef4444', dim:'#4a5568'}
const CARD_BG = 'rgba(10,15,26,0.7)'
const CARD_BORDER = '1px solid rgba(0,212,255,0.15)'
const SUB_BG = 'rgba(13,20,33,0.55)'
const LABEL_STYLE = {fontFamily:'var(--fd)', fontSize:6, letterSpacing:2, color:'var(--dm)'}
const SECTION_TITLE_STYLE = {fontFamily:'var(--fd)', fontSize:6.5, letterSpacing:3, color:'var(--dm)', marginBottom:5}

function StatCard({label, value, color, subtitle}){
  return (
    <div style={{background:CARD_BG, border:CARD_BORDER, borderRadius:2, padding:'8px 10px', flex:1, minWidth:0, position:'relative', overflow:'hidden'}}>
      <div style={{position:'absolute', top:0, left:0, right:0, height:1, background:`linear-gradient(90deg,transparent,${color}40,transparent)`}}/>
      <div style={{...LABEL_STYLE, marginBottom:4}}>{label}</div>
      <div style={{fontFamily:'var(--fd)', fontSize:11, color, letterSpacing:1, textShadow:`0 0 8px ${color}40`, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{value}</div>
      {subtitle ? <div style={{fontFamily:'var(--fm)', fontSize:7, color:C.dim, marginTop:3, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{subtitle}</div> : null}
    </div>
  )
}

function Badge({text, color}){
  return (
    <span style={{fontFamily:'var(--fd)', fontSize:7, letterSpacing:1.5, color, border:`1px solid ${color}55`, padding:'2px 7px', borderRadius:2, background:`${color}10`, textShadow:`0 0 6px ${color}40`, display:'inline-block'}}>
      {text}
    </span>
  )
}

function KV({label, value, color = C.cyan, mono = true}){
  return (
    <div style={{display:'flex', alignItems:'baseline', gap:8, padding:'3px 0'}}>
      <span style={{...LABEL_STYLE, minWidth:96}}>{label}</span>
      <span style={{fontFamily: mono ? 'var(--fm)' : 'var(--fd)', fontSize:8.5, color, letterSpacing: mono ? 0 : 1}}>{value}</span>
    </div>
  )
}

function VerifyResultCard({result}){
  if (!result) return null
  if (result.error) {
    return (
      <div style={{marginTop:8, background:CARD_BG, border:`1px solid ${C.red}40`, borderRadius:2, padding:'8px 10px'}}>
        <div style={{fontFamily:'var(--fm)', fontSize:9, color:C.red}}>{result.error}</div>
      </div>
    )
  }
  const status = result.proof_status || 'LEDGER_ONLY'
  const depth = normalizeVerificationDepth(result.verification_depth)
  const chainHash = result?.chain_context?.event_hash
  return (
    <div style={{marginTop:8, background:CARD_BG, border:CARD_BORDER, borderRadius:2, padding:'10px 12px', display:'flex', flexDirection:'column', gap:2}}>
      <div style={{display:'flex', gap:8, alignItems:'center', marginBottom:6}}>
        <Badge text={status} color={proofStatusColor(status)}/>
        <Badge text={depth} color={verificationDepthColor(depth)}/>
      </div>
      <KV label="CHAIN CONTEXT" value={chainHash ? `✓ ${truncateHash(chainHash)}` : '✗ absent'} color={chainHash ? C.green : C.yellow}/>
      <KV label="SIGNATURE"     value={result.signature ? '✓ Present' : '✗ Absent'} color={result.signature ? C.green : C.yellow}/>
      <KV label="POLICY HASH"   value={result.policy_hash ? '✓ Present' : '✗ Absent'} color={result.policy_hash ? C.green : C.yellow}/>
      <KV label="EXPORTED AT"   value={result.exported_at || '—'}/>
      <KV label="PROOF ID"      value={truncateHash(result.proof_id)}/>
    </div>
  )
}

function DecisionIdVerify({onResult}){
  const [id, setId] = useState('')
  const [loading, setLoading] = useState(false)
  const submit = async () => {
    if (!id || loading) return
    setLoading(true)
    try {
      const base = import.meta.env.VITE_AEGIS_URL || ''
      const res = await fetch(`${base}/ledger/proof/${encodeURIComponent(id)}`)
      if (res.ok) onResult(await res.json())
      else onResult({error:`Request failed (${res.status})`})
    } catch {
      onResult({error:'Network error'})
    } finally {
      setLoading(false)
    }
  }
  const disabled = loading || !id
  return (
    <div style={{display:'flex', gap:6, alignItems:'center'}}>
      <input
        value={id}
        onChange={e => setId(e.target.value)}
        placeholder="Enter decision_id"
        style={{flex:1, fontFamily:'var(--fm)', fontSize:9, color:C.cyan, background:SUB_BG, border:'1px solid rgba(0,212,255,0.2)', borderRadius:2, padding:'7px 10px', outline:'none'}}
      />
      <button
        onClick={submit}
        disabled={disabled}
        style={{fontFamily:'var(--fd)', fontSize:7.5, letterSpacing:2, padding:'7px 14px', background: disabled ? 'rgba(0,212,255,0.04)' : `${C.cyan}14`, color: disabled ? C.dim : C.cyan, border:`1px solid ${disabled ? 'rgba(74,85,104,0.3)' : C.cyan + '55'}`, borderRadius:2, cursor: disabled ? 'not-allowed' : 'pointer', textShadow: disabled ? 'none' : `0 0 6px ${C.cyan}55`}}>
        {loading ? '...' : 'VERIFY'}
      </button>
    </div>
  )
}

function ProofBundleVerify({onResult}){
  const [text, setText] = useState('')
  const [parseErr, setParseErr] = useState('')
  const [loading, setLoading] = useState(false)
  const submit = async () => {
    if (!text || loading) return
    let parsed
    try { parsed = JSON.parse(text) }
    catch { setParseErr('Invalid JSON — check format'); return }
    setParseErr('')
    setLoading(true)
    try {
      const base = import.meta.env.VITE_AEGIS_URL || ''
      const res = await fetch(`${base}/ledger/verify/proof`, {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({proof_bundle: parsed})
      })
      if (res.ok) onResult(await res.json())
      else onResult({error:`Request failed (${res.status})`})
    } catch {
      onResult({error:'Network error'})
    } finally {
      setLoading(false)
    }
  }
  const disabled = loading || !text
  return (
    <div style={{display:'flex', flexDirection:'column', gap:6}}>
      <textarea
        value={text}
        onChange={e => setText(e.target.value.slice(0, 50000))}
        placeholder="Paste proof bundle JSON here"
        rows={6}
        style={{fontFamily:'var(--fm)', fontSize:9, color:C.cyan, background:SUB_BG, border:'1px solid rgba(0,212,255,0.2)', borderRadius:2, padding:'7px 10px', outline:'none', resize:'vertical'}}
      />
      {parseErr ? <div style={{fontFamily:'var(--fm)', fontSize:8.5, color:C.red}}>{parseErr}</div> : null}
      <div style={{display:'flex', justifyContent:'flex-end'}}>
        <button
          onClick={submit}
          disabled={disabled}
          style={{fontFamily:'var(--fd)', fontSize:7.5, letterSpacing:2, padding:'7px 14px', background: disabled ? 'rgba(0,212,255,0.04)' : `${C.cyan}14`, color: disabled ? C.dim : C.cyan, border:`1px solid ${disabled ? 'rgba(74,85,104,0.3)' : C.cyan + '55'}`, borderRadius:2, cursor: disabled ? 'not-allowed' : 'pointer', textShadow: disabled ? 'none' : `0 0 6px ${C.cyan}55`}}>
          {loading ? '...' : 'VERIFY'}
        </button>
      </div>
    </div>
  )
}

function DepthLegend(){
  const rows = useMemo(() => [
    ['PRESENCE_ONLY',      C.yellow, 'Format and field presence verified',  'CURRENT'],
    ['CHAIN_VERIFIED',     C.cyan,   'Hash chain integrity verified',       'Phase G'],
    ['SIGNATURE_VERIFIED', C.cyan,   'Cryptographic signature verified',    'Phase G'],
    ['ANCHOR_VERIFIED',    C.green,  'External witness verified',           'Phase G'],
  ], [])
  return (
    <div>
      <div style={SECTION_TITLE_STYLE}>VERIFICATION DEPTH REFERENCE</div>
      <div style={{background:CARD_BG, border:CARD_BORDER, borderRadius:2, padding:'8px 10px', display:'flex', flexDirection:'column', gap:5}}>
        {rows.map(([name, color, desc, tag]) => (
          <div key={name} style={{display:'flex', alignItems:'center', gap:10, padding:'3px 0', borderLeft:`2px solid ${color}`, paddingLeft:8}}>
            <span style={{fontFamily:'var(--fd)', fontSize:7.5, color, letterSpacing:1.5, minWidth:140}}>{name}</span>
            <span style={{fontFamily:'var(--fm)', fontSize:8.5, color:'rgba(110,168,200,0.7)', flex:1}}>{desc}</span>
            <span style={{fontFamily:'var(--fd)', fontSize:6, color: tag === 'CURRENT' ? C.yellow : C.dim, letterSpacing:1, padding:'1px 5px', border:`1px solid ${tag === 'CURRENT' ? C.yellow + '55' : 'rgba(74,85,104,0.4)'}`, borderRadius:2}}>{tag}</span>
          </div>
        ))}
      </div>
      <div style={{fontFamily:'var(--fm)', fontSize:8, color:C.dim, marginTop:5, lineHeight:1.5}}>
        Current verification depth: PRESENCE_ONLY. Cryptographic verification ships in Phase G.
      </div>
    </div>
  )
}

function TrustGuide(){
  const rows = useMemo(() => [
    ['LEDGER_ONLY',  C.yellow, 'Action governed and recorded. Not yet checkpointed.'],
    ['CHECKPOINTED', C.cyan,   'Merkle root computed. Batch integrity verifiable.'],
    ['ANCHORED',     C.green,  'External witness recorded. Tamper-evident audit trail complete.'],
  ], [])
  return (
    <div>
      <div style={SECTION_TITLE_STYLE}>TRUST STATE GUIDE</div>
      <div style={{background:CARD_BG, border:CARD_BORDER, borderRadius:2, padding:'8px 10px', display:'flex', flexDirection:'column', gap:5}}>
        {rows.map(([name, color, desc]) => (
          <div key={name} style={{display:'flex', alignItems:'center', gap:10, padding:'4px 0', borderLeft:`2px solid ${color}`, paddingLeft:8}}>
            <span style={{fontFamily:'var(--fd)', fontSize:7.5, color, letterSpacing:1.5, minWidth:120}}>{name}</span>
            <span style={{fontFamily:'var(--fm)', fontSize:8.5, color:'rgba(110,168,200,0.7)', flex:1}}>{desc}</span>
          </div>
        ))}
      </div>
      <div style={{fontFamily:'var(--fm)', fontSize:8, color:C.dim, marginTop:5, lineHeight:1.5}}>
        Aegis provides tamper-evident governance infrastructure. Tamper-evidence ≠ tamper-proof.
      </div>
    </div>
  )
}

function FuturePlaceholders(){
  const items = ['Merkle Root Explorer','Anchor Explorer','Policy Diff Viewer','Decision Lineage Graph','Replay Verification','Multi-Agent Causal Chain']
  return (
    <div style={{opacity:0.4}}>
      <div style={SECTION_TITLE_STYLE}>COMING IN PHASE G+</div>
      <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:6, padding:8, border:'1px dashed rgba(74,85,104,0.45)', borderRadius:2, background:'rgba(10,15,26,0.3)'}}>
        {items.map(i => (
          <div key={i} style={{fontFamily:'var(--fm)', fontSize:8.5, color:C.dim, padding:'5px 7px', border:'1px dashed rgba(74,85,104,0.35)', borderRadius:2, textAlign:'center'}}>{i}</div>
        ))}
      </div>
    </div>
  )
}

function LatestCheckpointCard({cp, proofStatus}){
  return (
    <div style={{background:CARD_BG, border:CARD_BORDER, borderRadius:2, padding:'10px 12px', display:'flex', flexDirection:'column', gap:2, position:'relative', overflow:'hidden'}}>
      <div style={{position:'absolute', top:0, left:0, right:0, height:1, background:'linear-gradient(90deg,transparent,rgba(0,212,255,0.5),transparent)'}}/>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4}}>
        <span style={{fontFamily:'var(--fd)', fontSize:9, color:C.cyan, letterSpacing:1.5, textShadow:`0 0 6px ${C.cyan}40`}}>{cp.date || '—'}</span>
        <Badge text={proofStatus} color={proofStatusColor(proofStatus)}/>
      </div>
      <KV label="ROOT HASH" value={truncateHash(cp.root_hash)}/>
      <KV label="ACTIONS"   value={cp.total_actions ?? '—'} mono={false}/>
      <KV label="RUNS"      value={cp.total_runs ?? '—'}    mono={false}/>
      <KV label="ANCHOR ID" value={cp.anchor_id ? truncateHash(cp.anchor_id) : 'NOT ANCHORED'} color={cp.anchor_id ? C.green : C.yellow}/>
    </div>
  )
}

export function LedgerPanel(){
  const {latestCheckpoint, proofStatus} = useAegisStore()
  const [activeVerifyTab, setActiveVerifyTab] = useState('decision_id')
  const [verifyResult, setVerifyResult] = useState(null)

  const overview = useMemo(() => ({
    chainStatus: latestCheckpoint
      ? {value:'VALID',   color:C.green}
      : {value:'UNKNOWN', color:C.yellow},
    lastCp: latestCheckpoint?.date ?? '—',
    rootSub: latestCheckpoint ? truncateHash(latestCheckpoint.root_hash) : '',
  }), [latestCheckpoint])

  const switchTab = id => {
    setActiveVerifyTab(id)
    setVerifyResult(null)
  }

  return (
    <div style={{display:'flex', flexDirection:'column', gap:14, height:'100%', overflowY:'auto', paddingRight:6}}>
      {/* SECTION A — Integrity Overview */}
      <div>
        <div style={SECTION_TITLE_STYLE}>INTEGRITY OVERVIEW</div>
        <div style={{display:'flex', gap:8}}>
          <StatCard label="CHAIN STATUS"       value={overview.chainStatus.value} color={overview.chainStatus.color}/>
          <StatCard label="VERIFICATION DEPTH" value="PRESENCE_ONLY" color={C.yellow} subtitle="Phase G: cryptographic"/>
          <StatCard label="LAST CHECKPOINT"    value={overview.lastCp} color={latestCheckpoint ? C.cyan : C.dim} subtitle={overview.rootSub}/>
          <StatCard label="PROOF STATE"        value={proofStatus} color={proofStatusColor(proofStatus)}/>
        </div>
      </div>

      {/* SECTION B — Latest Checkpoint */}
      <div>
        <div style={SECTION_TITLE_STYLE}>LATEST CHECKPOINT</div>
        {latestCheckpoint
          ? <LatestCheckpointCard cp={latestCheckpoint} proofStatus={proofStatus}/>
          : <div style={{background:CARD_BG, border:CARD_BORDER, borderRadius:2, padding:'12px', fontFamily:'var(--fm)', fontSize:9, color:C.dim, textAlign:'center'}}>No checkpoints recorded</div>
        }
        <div style={{marginTop:6, padding:'8px 10px', background:'rgba(10,15,26,0.4)', border:'1px dashed rgba(74,85,104,0.3)', borderRadius:2, fontFamily:'var(--fm)', fontSize:8, color:C.dim, textAlign:'center', opacity:0.55}}>
          Checkpoint history list — Phase G
        </div>
      </div>

      {/* SECTION C — Proof Verification */}
      <div>
        <div style={SECTION_TITLE_STYLE}>PROOF VERIFICATION</div>
        <div style={{display:'flex', gap:0, marginBottom:8, borderBottom:'1px solid rgba(0,212,255,0.1)'}}>
          {[['decision_id','BY DECISION ID'],['proof_bundle','PASTE PROOF BUNDLE']].map(([id, label]) => (
            <button
              key={id}
              onClick={() => switchTab(id)}
              style={{fontFamily:'var(--fd)', fontSize:7, letterSpacing:2, padding:'6px 12px', border:'none', borderBottom: activeVerifyTab === id ? `2px solid ${C.cyan}` : '2px solid transparent', background:'transparent', color: activeVerifyTab === id ? C.cyan : 'var(--dm)', cursor:'pointer', textShadow: activeVerifyTab === id ? `0 0 8px ${C.cyan}55` : 'none', transition:'all .2s'}}>
              {label}
            </button>
          ))}
        </div>
        {activeVerifyTab === 'decision_id'
          ? <DecisionIdVerify onResult={setVerifyResult}/>
          : <ProofBundleVerify onResult={setVerifyResult}/>
        }
        <VerifyResultCard result={verifyResult}/>
      </div>

      {/* SECTION D — Verification Depth Reference */}
      <DepthLegend/>

      {/* SECTION E — Trust State Guide */}
      <TrustGuide/>

      {/* SECTION F — Future placeholders */}
      <FuturePlaceholders/>
    </div>
  )
}
