import { useEffect, useRef } from 'react';

// Advance only after the current page has been fully scrolled. A cooldown absorbs
// trackpad momentum, so a single gesture cannot skip the About page.
export function usePageScroll(page: string, menuOpen: boolean) {
  const lock = useRef(0);
  const total = useRef(0);
  const last = useRef(0);
  const direction = useRef(1);
  useEffect(() => {
    lock.current = performance.now() + 1100;
    total.current = 0;
  }, [page]);
  useEffect(() => {
    const pages = ['home', 'about', 'projects'];
    const index = pages.indexOf(page);
    const atEdge = (delta: number) => delta > 0
      ? window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 3
      : window.scrollY <= 3;
    const navigate = (delta: number) => {
      const next = pages[index + (delta > 0 ? 1 : -1)];
      if (!next) return false;
      direction.current = delta > 0 ? 1 : -1;
      lock.current = performance.now() + 1400;
      total.current = 0;
      location.hash = next;
      return true;
    };
    const editable = (target: EventTarget | null) => target instanceof Element && !!target.closest('input,textarea,select,[contenteditable="true"],.atlas-map');
    const wheel = (event: WheelEvent) => {
      if (menuOpen || event.ctrlKey || editable(event.target) || Math.abs(event.deltaX)>Math.abs(event.deltaY)) return;
      const now = performance.now();
      if (now < lock.current) { event.preventDefault(); return; }
      if (!atEdge(event.deltaY)) { total.current = 0; return; }
      if (now-last.current>220 || Math.sign(total.current)!==Math.sign(event.deltaY)) total.current=0;
      last.current=now;
      total.current+=event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?innerHeight:1);
      if (Math.abs(total.current)>=90 && navigate(total.current)) event.preventDefault();
    };
    let startY=0, edge=false;
    const touchStart=(event: TouchEvent)=>{if(event.touches.length!==1)return;startY=event.touches[0].clientY;edge=atEdge(1)||atEdge(-1);};
    const touchEnd=(event: TouchEvent)=>{
      if(menuOpen||editable(event.target)||!edge||performance.now()<lock.current||!event.changedTouches.length)return;
      const delta=startY-event.changedTouches[0].clientY;
      if(Math.abs(delta)>85 && atEdge(delta))navigate(delta);
    };
    const key=(event: KeyboardEvent)=>{
      if(menuOpen||editable(event.target)||event.altKey||event.ctrlKey||event.metaKey||performance.now()<lock.current)return;
      const delta=event.key==='PageDown'?1:event.key==='PageUp'?-1:0;
      if(delta&&atEdge(delta)&&navigate(delta))event.preventDefault();
    };
    window.addEventListener('wheel',wheel,{passive:false});
    window.addEventListener('touchstart',touchStart,{passive:true});
    window.addEventListener('touchend',touchEnd,{passive:true});
    window.addEventListener('keydown',key);
    return ()=>{window.removeEventListener('wheel',wheel);window.removeEventListener('touchstart',touchStart);window.removeEventListener('touchend',touchEnd);window.removeEventListener('keydown',key);};
  },[page,menuOpen]);
  return direction;
}
