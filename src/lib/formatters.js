export const dColor=v=>v==='APPROVE'?'#00ff88':v==='BLOCK'?'#ff2d78':v==='HOLD'?'#ffaa00':'#cc44ff'
export const dGlowAnim=v=>v==='APPROVE'?'glowGreen 2.5s ease-in-out infinite':v==='BLOCK'?'glowPink 2s ease-in-out infinite':'glowAmber 2.5s ease-in-out infinite'
export const agentColor=v=>v==='APPROVE'?[0,255,136]:v==='BLOCK'?[255,45,120]:v==='HOLD'?[255,170,0]:[204,68,255]
export const orbAnim=v=>v==='APPROVE'?'orbG 3.5s ease-in-out infinite':v==='BLOCK'?'orbR 2.8s ease-in-out infinite':v==='HOLD'?'orbA 3.5s ease-in-out infinite':'orbP 3s ease-in-out infinite'
export const riskColor=r=>r==='LOW'?'#00ff88':r==='HIGH'?'#ff2d78':'#ffaa00'
