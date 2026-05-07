import{useMockTimers,useLiveSignals,useMissionStatus,useLedgerStatus}from'./hooks/useAegisData'
import{BackgroundLayers}from'./components/BackgroundLayers'
import{GlobalSystemBar}from'./components/GlobalSystemBar'
import{ModuleNodes}from'./components/ModuleNodes'
import{CoreDecisionPanel}from'./components/CoreDecisionPanel'
import{AgentSwarm}from'./components/AgentSwarm'
import{AdapterTabs}from'./components/AdapterTabs'
import{SystemConsciousness}from'./components/SystemConsciousness'
import{DecisionProofChain}from'./components/DecisionProofChain'
import{OperatorCommandBar}from'./components/OperatorCommandBar'
export default function App(){
  useMockTimers()
  useLiveSignals()
  useMissionStatus()
  useLedgerStatus()
  return(
    <>
      <BackgroundLayers/>
      <GlobalSystemBar/>
      <div style={{display:'grid',gridTemplateColumns:'192px 1fr 216px',gap:3,overflow:'hidden'}}>
        <ModuleNodes/><CoreDecisionPanel/><AgentSwarm/>
      </div>
      <AdapterTabs/>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1.4fr',gap:3,overflow:'hidden'}}>
        <SystemConsciousness/><DecisionProofChain/>
      </div>
      <OperatorCommandBar/>
    </>
  )
}
