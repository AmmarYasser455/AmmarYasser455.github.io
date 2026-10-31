import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import Landing from './reference/Landing';
import About from './reference/About';
import HoverLinks from './reference/HoverLinks';
import { IntroLoader } from './IntroLoader';
import { SocialRail } from './SocialRail';
import { ProjectMap } from './ProjectMap';
import { site } from './data/site';
import './reference/styles/Navbar.css';
import Cursor from './Cursor';
import TechStack from './TechStack';
import {projects} from './data/projects';
import ProjectVisual from './ProjectVisual';
import ExperienceContours from './ExperienceContours';
const ChessPage=lazy(()=>import('./ChessPage'));

const Character = lazy(() => import('./Character'));
gsap.registerPlugin(ScrollTrigger);

function Portfolio() {
  const reduced = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const root = useRef<HTMLDivElement>(null);
  const smooth = useRef<Lenis | null>(null);
  const active = !reduced && !paused;
  const finish = useCallback(() => setLoading(false), []);

  useEffect(() => {
    if (loading) return;
    const navigate = () => {
      const hash = location.hash.slice(1) || 'home';
      const id = hash.split('/')[0] === 'work' ? 'projects' : hash.split('/')[0];

      const target = document.getElementById(id);
      if (!target || (hash.includes('/') && target.getBoundingClientRect().top < 150 && target.getBoundingClientRect().bottom > 200)) return;
      if (smooth.current) smooth.current.scrollTo(target.getBoundingClientRect().top + window.scrollY - 80, { duration: 1.5 });
      else target.scrollIntoView({ behavior: 'instant' });
    };
    window.addEventListener('hashchange', navigate);
    const timer = window.setTimeout(navigate, 100);
    return () => { clearTimeout(timer); window.removeEventListener('hashchange', navigate); };
  }, [loading]);

  useEffect(() => {
    if (loading || !active) return;
    const lenis = new Lenis({ duration: 1.7, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    smooth.current = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    return () => { gsap.ticker.remove(tick); lenis.destroy(); smooth.current = null; };
  }, [loading, active]);

  useEffect(() => {
    if (loading || !active) return;
    const media = gsap.matchMedia();
    const ctx = gsap.context(() => {
      // Adapted from the reference initialFX entrance and looping role treatment.
      gsap.from('.landing-intro > *, .landing-info > *', { opacity: 0, y: 60, filter: 'blur(5px)', stagger: .13, duration: 1.2, ease: 'power3.inOut' });
      gsap.from('.header, .social-rail', { opacity: 0, duration: 1.2 });

      media.add('(min-width: 1025px)', () => {
        // Adapted from setCharTimeline: one persistent model across sections.
        gsap.timeline({ scrollTrigger: { trigger: '.landing-section', start: 'top top', end: 'bottom top', scrub: true, invalidateOnRefresh: true } })
          .to('.avatar-stage', { x: '-25vw', duration: 1 }, 0)
          .to('.landing-container', { opacity: 0, y: '40%', duration: .8 }, 0)
          .fromTo('.about-me', { y: '-25%' }, { y: '0%', duration: 1 }, 0);
        gsap.timeline({ scrollTrigger: { trigger: '.about-section', start: 'center 55%', end: 'bottom top', scrub: true } })
          .to('.avatar-stage', { x: '-12vw', duration: 1 }, 0);
        gsap.timeline({ scrollTrigger: { trigger: '#experience', start: 'bottom bottom', end: 'bottom top', scrub: true } })
          .to('.avatar-stage', { y: '-100vh', opacity: 0, duration: 1 });
      });
      gsap.from('.about-me .para', { opacity: .25, scrollTrigger: { trigger: '.about-section', start: 'top 80%', end: 'center center', scrub: true } });
      gsap.from('.work-preview > *', { opacity: 0, y: 35, duration: .8, scrollTrigger: { trigger: '#projects', start: 'top 85%' } });
    }, root);
    ScrollTrigger.refresh();
    return () => { media.revert(); ctx.revert(); };
  }, [loading, active]);

  useEffect(() => {
    if (!active) return;
    const move = (event: PointerEvent) => { root.current?.style.setProperty('--cursor-x', `${event.clientX}px`); root.current?.style.setProperty('--cursor-y', `${event.clientY}px`); };
    window.addEventListener('pointermove', move);
    return () => window.removeEventListener('pointermove', move);
  }, [active]);

  return <div ref={root} className={active ? 'portfolio' : 'portfolio motion-off'} onClick={event => {
    const anchor = (event.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
    if (!anchor || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    if (location.hash !== anchor.hash) history.pushState(null, '', anchor.hash);
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  }}>
    {loading && <IntroLoader onDone={finish} />}
    <div inert={loading}>
      <a className="skip-link" href="#about">Skip to content</a>
      <header className="header">
        <a href="#home" className="navbar-title" aria-label="Ammar Yasser home">AY</a>
        <a href={'mailto:' + site.email} className="navbar-connect">{site.email}</a>
        <nav aria-label="Main navigation"><ul>{[['ABOUT','about'],['WORK','projects'],['CONTACT','contact']].map(([text,id]) => <li key={id}><a href={'#'+id}><HoverLinks text={text}/></a></li>)}</ul></nav>
      </header>
      <div className="landing-circle1" aria-hidden="true"/><div className="landing-circle2" aria-hidden="true"/><div className="nav-fade"/>
      <div className="cursor-glow" aria-hidden="true"/>
      <SocialRail/>
      <main>
        <section id="home" aria-label="Introduction">
          <Landing><div className="avatar-stage"><Suspense fallback={<div className="character-placeholder">Loading the Character…</div>}><Character active={active} introReady={!loading}/></Suspense></div><a className="scroll-hint" href="#about">SCROLL TO EXPLORE ↓</a></Landing>
        </section>
        <About/>
        <section id="experience" className="experience-section" aria-labelledby="experience-title">
          <div className="experience-heading"><p className="eyebrow">EXPERIENCE</p><h2 id="experience-title">Putting spatial<br/><span>data to work.</span></h2></div>
          <div className="experience-mobile-scene"><Suspense fallback={null}><Character active={active} variant="desk"/></Suspense></div>
          <div className="experience-content">
            <article className="experience-card"><ExperienceContours/><p className="experience-date">2023 — Present</p><h3>Freelance GIS Developer</h3><p className="experience-company">Self-Employed</p><ul><li>Developed custom Python automation scripts for geospatial data processing, reducing manual QA time by 60%.</li><li>Built and published OVC (Overlap Violation Checker), an open-source library with an active GitHub community.</li><li>Performed spatial analysis and cartographic design for academic research projects using ArcGIS Pro and QGIS.</li></ul></article>
            <article className="experience-card project-leadership"><ExperienceContours/><p className="experience-date">PROJECT LEADERSHIP</p><h3>Documentation of Archaeological Sites in Egypt</h3><p className="experience-company">Team Lead</p><p>Led spatial documentation of 50+ prehistoric sites and designed a comprehensive geodatabase schema. Conducted buffer analysis and protection-zone modeling to assess environmental threats to heritage sites.</p></article>
          </div>
        </section>
        <section id="projects" className="work-preview" aria-label="Selected work"><p className="eyebrow work-source-label"><span className="source-path" aria-hidden="true">~/projects/</span> SELECTED WORK</p><div className="work-preview-heading"><h2>Spatial problems.<br/><span>Practical solutions.</span></h2><a href="#myworks">Explore all projects ↗</a></div><div className="work-preview-grid">{projects.slice(0,3).map((project,i)=><a className="work-preview-card" href={'#myworks/'+project.id} key={project.id}><ProjectVisual kind={project.id} index={i}/><small>{project.tags.slice(0,2).join(' / ')}</small><h3>{project.title} <span>↗</span></h3><p>{project.description}</p></a>)}</div></section>
        <TechStack active={active}/>
        <section className="play-cta"><p className="eyebrow">A DIFFERENT KIND OF CHALLENGE</p><h2>Maps by day.<br/><span>Moves in between.</span></h2><div><a className="button" href="#play">Play with me →</a><a className="button button-primary" href={site.linkedin} target="_blank" rel="noreferrer">Hire me →</a></div></section>
        <section id="contact" aria-label="Contact"><div className="contact-inner"><p className="eyebrow">HAVE A SPATIAL CHALLENGE?</p><h2>Let’s make<br/><span>something useful.</span></h2><a className="contact-email" href={'mailto:'+site.email}>{site.email} ↗</a><p>{site.location} · GIS Development & Spatial Analysis</p><a href={site.github} target="_blank" rel="noreferrer">GitHub ↗</a><span> / </span><a href={site.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a></div></section>
      </main>
      <button className="motion-toggle" onClick={() => setPaused(!paused)} aria-pressed={paused}>{paused ? 'Resume motion' : 'Pause motion'}</button>
      <footer>© {new Date().getFullYear()} {site.name}</footer>
    </div>
  </div>;
}


export default function App(){
 const [hash,setHash]=useState(location.hash);
 const reduced=useReducedMotion();
 useEffect(()=>{const change=()=>setHash(location.hash);window.addEventListener('hashchange',change);return()=>window.removeEventListener('hashchange',change);},[]);
 const page=hash.startsWith('#play')?'play':hash.startsWith('#myworks')?'work':'home';
 useEffect(()=>{if(page!=='home')window.scrollTo({top:0,behavior:'instant'});document.title=page==='play'?'Play Chess — Ammar Yasser':page==='work'?'Projects — Ammar Yasser':'Ammar Yasser — GIS Developer';},[page]);
 return <><Cursor/>{page==='play'?<Suspense fallback={<p className="page-loading">Opening the chessboard…</p>}><ChessPage/></Suspense>:page==='work'?<main className="work-page"><a className="chess-back" href="#projects">← Back to portfolio</a><ProjectMap selectedId={hash.split('/')[1]} animate={!reduced}/></main>:<Portfolio/>}</>;
}
