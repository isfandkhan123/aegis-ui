import{useEffect,useRef}from'react'
export function usePolling(fn,ms=3000,enabled=true){
  const ref=useRef(fn)
  useEffect(()=>{ref.current=fn},[fn])
  useEffect(()=>{
    if(!enabled)return
    ref.current().catch(console.warn)
    const id=setInterval(()=>ref.current().catch(console.warn),ms)
    return()=>clearInterval(id)
  },[ms,enabled])
}
