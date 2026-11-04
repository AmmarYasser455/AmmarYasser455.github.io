import { useEffect, useRef, useState, type CSSProperties } from 'react';
import './interactions.css';

// Delegated pointer effects: [data-magnetic] elements lean toward the cursor,
// [data-tilt] cards rotate in 3D and expose --mx/--my for a cursor spotlight.
export function usePointerFX(active: boolean) {
  useEffect(() => {
    if (!active || matchMedia('(pointer: coarse)').matches) return;
    let magnet: HTMLElement | null = null;
    let card: HTMLElement | null = null;
    const releaseMagnet = () => { if (magnet) magnet.style.translate = ''; magnet = null; };
    const releaseCard = () => { if (card) { card.style.removeProperty('--rx'); card.style.removeProperty('--ry'); } card = null; };
    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      const target = event.target instanceof Element ? event.target : null;
      const nextMagnet = target?.closest<HTMLElement>('[data-magnetic]') ?? null;
      if (nextMagnet !== magnet) releaseMagnet();
      if (nextMagnet) {
        magnet = nextMagnet;
        const r = magnet.getBoundingClientRect();
        const x = event.clientX - r.left, y = event.clientY - r.top;
        magnet.style.translate = `${((x - r.width / 2) * .28).toFixed(1)}px ${((y - r.height / 2) * .38).toFixed(1)}px`;
        magnet.style.setProperty('--bx', `${x}px`);
        magnet.style.setProperty('--by', `${y}px`);
      }
      const nextCard = target?.closest<HTMLElement>('[data-tilt]') ?? null;
      if (nextCard !== card) releaseCard();
      if (nextCard) {
        card = nextCard;
        const r = card.getBoundingClientRect();
        const px = (event.clientX - r.left) / r.width, py = (event.clientY - r.top) / r.height;
        card.style.setProperty('--rx', `${((.5 - py) * 9).toFixed(2)}deg`);
        card.style.setProperty('--ry', `${((px - .5) * 11).toFixed(2)}deg`);
        card.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`);
        card.style.setProperty('--my', `${(py * 100).toFixed(1)}%`);
      }
    };
    const leave = () => { releaseMagnet(); releaseCard(); };
    window.addEventListener('pointermove', move, { passive: true });
    document.documentElement.addEventListener('pointerleave', leave);
    window.addEventListener('blur', leave);
    return () => {
      leave();
      window.removeEventListener('pointermove', move);
      document.documentElement.removeEventListener('pointerleave', leave);
      window.removeEventListener('blur', leave);
    };
  }, [active]);
}

// Highlights the nav item for whichever section crosses the middle of the viewport.
const sectionToNav: Record<string, string> = { home: '', about: 'about', experience: 'about', projects: 'projects', 'tech-stack': 'projects', contact: 'contact' };
export function useActiveSection(enabled: boolean) {
  const [current, setCurrent] = useState('');
  useEffect(() => {
    if (!enabled) return;
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) setCurrent(sectionToNav[entry.target.id] ?? '');
    }, { rootMargin: '-50% 0px -50% 0px' });
    for (const id of Object.keys(sectionToNav)) { const el = document.getElementById(id); if (el) observer.observe(el); }
    return () => observer.disconnect();
  }, [enabled]);
  return current;
}

const RING = 2 * Math.PI * 20;
// A thin reading-progress bar plus a back-to-top button whose ring fills as you scroll.
export function ScrollMeter() {
  const bar = useRef<HTMLDivElement>(null);
  const ring = useRef<SVGCircleElement>(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
      if (bar.current) bar.current.style.transform = `scaleX(${progress})`;
      if (ring.current) ring.current.style.strokeDashoffset = String(RING * (1 - progress));
      setShow(scrollY > innerHeight * .8);
    };
    const request = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', request); window.removeEventListener('resize', request); };
  }, []);
  return <>
    <div className="scroll-progress" aria-hidden="true"><div ref={bar}/></div>
    <a href="#home" className={'to-top' + (show ? ' show' : '')} aria-label="Back to top" tabIndex={show ? 0 : -1} aria-hidden={!show} data-magnetic>
      <svg viewBox="0 0 48 48" aria-hidden="true"><circle className="to-top-track" cx="24" cy="24" r="20"/><circle ref={ring} className="to-top-ring" cx="24" cy="24" r="20" strokeDasharray={RING} strokeDashoffset={RING}/></svg>
      <span className="to-top-arrow" aria-hidden="true">↑</span>
    </a>
  </>;
}

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&/<>_=+';
const noise = (text: string, from = 0) => Array.from(text, (c, i) => i < from || c === ' ' ? c : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]).join('');
// Decodes the label from random glyphs, left to right, the first time it scrolls into view.
// A scroll check (not IntersectionObserver) so labels jumped past by a hash link still decode.
export function Scramble({ text, active }: { text: string; active: boolean }) {
  const host = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = host.current, node = el?.firstChild;
    if (!el || !node) return;
    if (!active) { node.nodeValue = text; return; }
    node.nodeValue = noise(text);
    let frame = 0, last = 0, started = false;
    const tick = (start: number) => (now: number) => {
      const t = Math.min(1, (now - start) / (650 + text.length * 22));
      if (now - last > 45 || t === 1) { last = now; node.nodeValue = t === 1 ? text : noise(text, Math.floor(t * text.length)); }
      if (t < 1) frame = requestAnimationFrame(tick(start));
    };
    const check = () => {
      frame = 0;
      if (started || el.getBoundingClientRect().top > innerHeight * .88) return;
      started = true;
      window.removeEventListener('scroll', request);
      frame = requestAnimationFrame(tick(performance.now()));
    };
    const request = () => { if (!frame) frame = requestAnimationFrame(check); };
    window.addEventListener('scroll', request, { passive: true });
    request();
    return () => { window.removeEventListener('scroll', request); cancelAnimationFrame(frame); node.nodeValue = text; };
  }, [text, active]);
  return <><span className="sr-only">{text}</span><span ref={host} className="scramble" aria-hidden="true">{text}</span></>;
}

// Copies the address with a rolling label swap and a small particle burst.
export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  useEffect(() => { if (!copied) return; const timer = setTimeout(() => setCopied(false), 2200); return () => clearTimeout(timer); }, [copied]);
  const copy = async () => {
    let ok = false;
    try { await navigator.clipboard.writeText(email); ok = true; } catch {
      const field = document.createElement('textarea');
      field.value = email; field.style.position = 'fixed'; field.style.opacity = '0';
      document.body.append(field); field.select();
      try { ok = document.execCommand('copy'); } catch { ok = false; }
      field.remove();
    }
    setCopied(ok);
  };
  return <>
    <button type="button" className={'copy-email' + (copied ? ' copied' : '')} onClick={copy} data-magnetic>
      <span className="copy-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24"><rect x="8" y="8" width="12" height="12" rx="2.5"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg>
        <svg viewBox="0 0 24 24"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>
      </span>
      <span className="copy-label"><span>Copy email</span><span aria-hidden="true">Copied!</span></span>
      <span className="copy-burst" aria-hidden="true">{Array.from({ length: 10 }, (_, i) => <i key={i} style={{ '--i': i } as CSSProperties}/>)}</span>
    </button>
    <span className="sr-only" role="status">{copied ? 'Email address copied to clipboard' : ''}</span>
  </>;
}
