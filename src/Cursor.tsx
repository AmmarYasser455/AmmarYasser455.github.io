import {useEffect,useRef} from 'react';
export default function Cursor(){
 const cursor=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const move=(e:PointerEvent)=>{if(e.pointerType!=='mouse')return;const dot=cursor.current;if(!dot)return;dot.style.left=`${e.clientX}px`;dot.style.top=`${e.clientY}px`;dot.style.opacity='1';dot.classList.toggle('over-link',Boolean((e.target as Element).closest('a,button,input,select')));};
  const hide=()=>{if(cursor.current)cursor.current.style.opacity='0';};
  window.addEventListener('pointermove',move);document.documentElement.addEventListener('pointerleave',hide);window.addEventListener('blur',hide);
  return()=>{window.removeEventListener('pointermove',move);document.documentElement.removeEventListener('pointerleave',hide);window.removeEventListener('blur',hide);};
 },[]);
 return <div ref={cursor} className="pointer-orb" aria-hidden="true"/>;
}
