import{useEffect,useRef}from'react'
function ParticleCanvas(){
  const ref=useRef(null)
  useEffect(()=>{
    const cv=ref.current;if(!cv)return
    const ctx=cv.getContext('2d');let raf;const pts=[]
    const init=()=>{
      cv.width=window.innerWidth;cv.height=window.innerHeight;pts.length=0
      for(let i=0;i<50;i++)pts.push({x:Math.random()*cv.width,y:Math.random()*cv.height,vx:(Math.random()-.5)*.22,vy:(Math.random()-.5)*.22,r:.35+Math.random()*.8,a:.06+Math.random()*.2,c:Math.random()>.65?[0,229,255]:Math.random()>.45?[0,255,136]:[255,45,120]})
    }
    const draw=()=>{
      ctx.clearRect(0,0,cv.width,cv.height)
      pts.forEach(p=>{p.x+=p.vx;p.y+=p.vy;if(p.x<0)p.x=cv.width;if(p.x>cv.width)p.x=0;if(p.y<0)p.y=cv.height;if(p.y>cv.height)p.y=0;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=`rgba(${p.c[0]},${p.c[1]},${p.c[2]},${p.a})`;ctx.fill()})
      for(let i=0;i<pts.length;i++)for(let j=i+1;j<pts.length;j++){const dx=pts[i].x-pts[j].x,dy=pts[i].y-pts[j].y,d=Math.sqrt(dx*dx+dy*dy);if(d<100){ctx.beginPath();ctx.moveTo(pts[i].x,pts[i].y);ctx.lineTo(pts[j].x,pts[j].y);ctx.strokeStyle=`rgba(0,255,136,${.014*(1-d/100)})`;ctx.lineWidth=.4;ctx.stroke()}}
      raf=requestAnimationFrame(draw)
    }
    window.addEventListener('resize',init);init();draw()
    return()=>{cancelAnimationFrame(raf);window.removeEventListener('resize',init)}
  },[])
  return <canvas ref={ref} style={{position:'fixed',inset:0,zIndex:0,pointerEvents:'none'}}/>
}
export function BackgroundLayers(){
  return(<><ParticleCanvas/><div className="hex-grid"/><div className="vignette"/><div className="glow-ambient glow-center"/><div className="glow-ambient glow-bottom"/><div className="glow-ambient glow-left"/><div className="haze"/><div className="scan-line scan-1"/><div className="scan-line scan-2"/><div className="scan-line scan-3"/></>)
}
