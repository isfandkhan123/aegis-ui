import{useEffect,useRef}from'react'
import{agentColor}from'../lib/formatters'
export function useAgentTravel(agents,verdict){
  const cvRef=useRef(null)
  const agRef=useRef(agents)
  const vRef=useRef(verdict)
  useEffect(()=>{agRef.current=agents},[agents])
  useEffect(()=>{vRef.current=verdict},[verdict])
  useEffect(()=>{
    const cv=cvRef.current;if(!cv)return
    const ctx=cv.getContext('2d')
    let raf,t=0
    const trails=agents.map(()=>[])
    const resize=()=>{cv.width=cv.offsetWidth;cv.height=cv.offsetHeight||80}
    resize()
    const N=5
    const draw=()=>{
      t++;const W=cv.width,H=cv.height
      ctx.clearRect(0,0,W,H)
      const ag=agRef.current,c=agentColor(vRef.current)
      for(let i=0;i<N-1;i++){
        const x1=16+i*(W-32)/(N-1),x2=16+(i+1)*(W-32)/(N-1),y=H*.5
        ctx.beginPath();ctx.moveTo(x1,y);ctx.lineTo(x2,y)
        ctx.strokeStyle='rgba(0,255,136,0.07)';ctx.lineWidth=1;ctx.stroke()
      }
      for(let i=0;i<N;i++){
        const x=16+i*(W-32)/(N-1),y=H*.5
        ctx.beginPath();ctx.arc(x,y,4,0,Math.PI*2);ctx.fillStyle='rgba(0,255,136,0.12)';ctx.fill()
        ctx.beginPath();ctx.arc(x,y,7,0,Math.PI*2);ctx.strokeStyle='rgba(0,255,136,0.08)';ctx.lineWidth=1;ctx.stroke()
      }
      ag.forEach((a,ai)=>{
        const pct=a.prog/100,x=16+pct*(W-32),yo=Math.sin(t*.06+ai*1.4)*7
        const y=H*(ai===1?.38:ai===2?.62:.5)+yo
        if(!trails[ai])trails[ai]=[]
        trails[ai].push({x,y});if(trails[ai].length>28)trails[ai].shift()
        if(trails[ai].length>1){
          ctx.beginPath()
          trails[ai].forEach((p,pi)=>pi===0?ctx.moveTo(p.x,p.y):ctx.lineTo(p.x,p.y))
          ctx.strokeStyle=`rgba(${c[0]},${c[1]},${c[2]},0.22)`;ctx.lineWidth=1.5;ctx.stroke()
        }
        const g=ctx.createRadialGradient(x,y,0,x,y,10)
        g.addColorStop(0,`rgba(${c[0]},${c[1]},${c[2]},0.9)`)
        g.addColorStop(.5,`rgba(${c[0]},${c[1]},${c[2]},0.25)`)
        g.addColorStop(1,'rgba(0,0,0,0)')
        ctx.beginPath();ctx.arc(x,y,10,0,Math.PI*2);ctx.fillStyle=g;ctx.fill()
        ctx.beginPath();ctx.arc(x,y,3.5,0,Math.PI*2);ctx.fillStyle=`rgb(${c[0]},${c[1]},${c[2]})`;ctx.fill()
        const rr=6+Math.sin(t*.1+ai)*2
        ctx.beginPath();ctx.arc(x,y,rr,0,Math.PI*2)
        ctx.strokeStyle=`rgba(${c[0]},${c[1]},${c[2]},${.15+Math.sin(t*.1+ai)*.08})`;ctx.lineWidth=1;ctx.stroke()
      })
      raf=requestAnimationFrame(draw)
    }
    draw();window.addEventListener('resize',resize)
    return()=>{cancelAnimationFrame(raf);window.removeEventListener('resize',resize)}
  },[])
  return cvRef
}
