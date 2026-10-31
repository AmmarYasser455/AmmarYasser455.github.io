import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

// Markup and visual treatment adapted from reference Loading.tsx (MIT).
// Progress uses the actual character request, with a short timeout and skip control.
export function IntroLoader({ onDone }: { onDone: () => void }) {
  const reduced = useReducedMotion();
  const [percent, setPercent] = useState(0);
  const [complete, setComplete] = useState(false);
  const [exiting, setExiting] = useState(false);
  useEffect(() => {
    const start = performance.now();
    let done = false;
    let timer = 0;
    const finish = () => {
      if (done) return;
      done = true;
      setPercent(100);
      timer = window.setTimeout(() => setComplete(true), reduced ? 0 : Math.max(0, 700 - (performance.now() - start)));
    };
    const update = (e: Event) => setPercent(Math.min(99, Math.round((e as CustomEvent<number>).detail)));
    window.addEventListener('character-ready', finish);
    window.addEventListener('character-error', finish);
    window.addEventListener('character-progress', update);
    if (document.querySelector('.character-canvas[data-loaded="true"]')) finish();
    const timeout = window.setTimeout(() => setExiting(true), 4000);
    return () => { clearTimeout(timer); clearTimeout(timeout); window.removeEventListener('character-ready', finish); window.removeEventListener('character-error', finish); window.removeEventListener('character-progress', update); };
  }, [reduced]);
  useEffect(() => { if (!complete) return; const timer = setTimeout(() => setExiting(true), reduced ? 0 : 400); return () => clearTimeout(timer); }, [complete, reduced]);
  useEffect(() => { if (!exiting) return; const timer = setTimeout(onDone, reduced ? 0 : 700); return () => clearTimeout(timer); }, [exiting, reduced, onDone]);
  return <div className={'intro-loader' + (exiting ? ' exiting' : '')} role="dialog" aria-modal="true" aria-label="Loading portfolio">
    <div className="loading-header"><span className="loader-title">AmmarYasser</span><div className={'loaderGame ' + (exiting ? 'loader-out' : '')}><div className="loaderGame-container" aria-hidden="true"><div className="loaderGame-in">{Array.from({ length: 27 }, (_, index) => <div className="loaderGame-line" key={index}/>)}</div><div className="loaderGame-ball"/></div></div></div>
    <div className="loading-screen">
      <div className="loading-marquee" aria-hidden="true"><div className="loading-marquee-track">{[0,1,2,3].map(i => <span key={i}>{i % 2 ? 'Spatial Analyst' : 'GIS Developer'}</span>)}</div></div>
      <div className={'loading-wrap ' + (exiting ? 'loading-clicked' : '')} onPointerMove={e => { const rect = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`); e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`); }}>
        <div className="loading-hover"/><div className={'loading-button ' + (complete ? 'loading-complete' : '')}>
          <div className="loading-container"><div className="loading-content" role="progressbar" aria-label="Loading character" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}><div className="loading-content-in">Loading <span>{percent}%</span></div></div><div className="loading-box"/></div><div className="loading-content2"><span>Welcome</span></div>
        </div>
      </div>
    </div>
    {!exiting && <button className="loader-skip" onClick={() => setExiting(true)} autoFocus>Skip intro ↗</button>}
  </div>;
}
