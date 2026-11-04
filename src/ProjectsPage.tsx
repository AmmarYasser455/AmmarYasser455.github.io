import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import { projects, type Project } from './data/projects';
import { projectGalleries, type ProjectMedia } from './data/projectMedia';
import { site } from './data/site';
import CodeSnippet from './CodeSnippet';
import { usePointerFX } from './Interactions';
import './projects-page.css';

const pad = (n: number) => String(n).padStart(2, '0');
const repo = (p: Project) => `${site.github}/${p.id}`;

export default function ProjectsPage({ selectedId, animate }: { selectedId?: string; animate: boolean }) {
  usePointerFX(animate);
  const index = projects.findIndex(p => p.id === selectedId);
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [selectedId]);
  return index < 0 ? <ProjectGrid/> : <CaseStudy key={projects[index].id} project={projects[index]} index={index}/>;
}

function ProjectGrid() {
  return <div className="pp">
    <nav className="pp-crumbs" aria-label="Breadcrumb"><a href="#projects">← Portfolio</a><span aria-hidden="true">/</span><span aria-current="page">Projects</span></nav>
    <header className="pp-head reveal">
      <p className="eyebrow">SELECTED WORK / {pad(projects.length)} PROJECTS</p>
      <h1>Spatial problems.<br/><span>Practical solutions.</span></h1>
      <p className="pp-intro">Python tools for cleaner spatial data and clearer maps. Open a project for the problem, the approach and the code.</p>
    </header>
    <div className="pp-grid">
      {projects.map((p, i) => <a key={p.id} href={'#myworks/' + p.id} className={'pp-card reveal' + (i === 0 ? ' featured' : '')} style={{ '--d': (.08 * i + .1) + 's' } as CSSProperties} data-tilt>
        <div className="pp-card-top"><span className="pp-num">{pad(i + 1)}</span><span className="pp-kind">{p.kind}</span></div>
        {i === 0 && <CodeSnippet project={p}/>}
        <h2>{p.title}</h2>
        <p>{p.description}</p>
        <div className="pp-tags">{p.tags.map(t => <span key={t}>{t}</span>)}</div>
        <span className="pp-more">Read case study <span aria-hidden="true">→</span></span>
      </a>)}
    </div>
  </div>;
}

function CaseStudy({ project: p, index }: { project: Project; index: number }) {
  const [zoomed, setZoomed] = useState<ProjectMedia | null>(null);
  const closeZoom = useCallback(() => setZoomed(null), []);
  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];
  const gallery = projectGalleries[p.id] ?? [];
  return <article className="pp cs">
    <nav className="pp-crumbs" aria-label="Breadcrumb"><a href="#projects">Portfolio</a><span aria-hidden="true">/</span><a href="#myworks">Projects</a><span aria-hidden="true">/</span><span aria-current="page">{p.title}</span></nav>
    <header className="cs-head">
      <p className="eyebrow reveal">PROJECT {pad(index + 1)} / {pad(projects.length)} · {p.kind.toUpperCase()}</p>
      <h1 className="reveal" style={{ '--d': '.08s' } as CSSProperties}>{p.title}</h1>
      <p className="cs-lead reveal" style={{ '--d': '.16s' } as CSSProperties}>{p.description}</p>
      <div className="cs-links reveal" style={{ '--d': '.24s' } as CSSProperties}>
        <a className="button button-primary" href={repo(p)} target="_blank" rel="noreferrer" data-magnetic>View on GitHub ↗</a>
        {p.links.docs && <a className="button" href={p.links.docs} target="_blank" rel="noreferrer" data-magnetic>Documentation ↗</a>}
        {p.links.demo && <a className="button" href={p.links.demo} target="_blank" rel="noreferrer" data-magnetic>Live demo ↗</a>}
      </div>
    </header>

    <div className="cs-body">
      <div className="cs-story">
        <section className="reveal" style={{ '--d': '.3s' } as CSSProperties}><h2><span>01</span> The problem</h2><p>{p.problem}</p></section>
        <section className="reveal" style={{ '--d': '.38s' } as CSSProperties}><h2><span>02</span> The approach</h2><p>{p.approach}</p></section>
        {p.steps && <section className="reveal" style={{ '--d': '.46s' } as CSSProperties}><h2><span>03</span> How it works</h2><ol className="cs-steps">{p.steps.map(s => <li key={s}>{s}</li>)}</ol></section>}
        <section className="reveal" style={{ '--d': '.5s' } as CSSProperties}><h2><span>{p.steps ? '04' : '03'}</span> What it does</h2><ul className="cs-features">{p.features.map(f => <li key={f}>{f}</li>)}</ul></section>
      </div>
      <aside className="cs-side reveal" style={{ '--d': '.34s' } as CSSProperties}>
        <p className="cs-label">IN USE</p>
        <CodeSnippet project={p} copyable compact/>
        <p className="cs-label">STACK</p>
        <div className="pp-tags">{p.tags.map(t => <span key={t}>{t}</span>)}</div>
      </aside>
    </div>

    {gallery.length > 0 && <section className="cs-gallery" aria-label="Screenshots">
      <p className="cs-label">FROM THE PROJECT</p>
      <div>{gallery.map(m => <figure key={m.src}><button type="button" onClick={() => setZoomed(m)} aria-label={'Enlarge screenshot: ' + m.caption}><img src={m.src} alt={m.alt} loading="lazy" decoding="async"/><span className="cs-zoom" aria-hidden="true">⤢</span></button><figcaption>{m.caption}</figcaption></figure>)}</div>
    </section>}

    <nav className="cs-next" aria-label="More projects">
      <a href={'#myworks/' + prev.id} className="cs-prev-link"><small>← Previous</small><span>{prev.title}</span></a>
      <a href={'#myworks/' + next.id} className="cs-next-link"><small>Next project →</small><span>{next.title}</span></a>
    </nav>
    {zoomed && <Lightbox media={zoomed} onClose={closeZoom}/>}
  </article>;
}

function Lightbox({ media, onClose }: { media: ProjectMedia; onClose: () => void }) {
  const close = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    close.current?.focus();
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); if (e.key === 'Tab') { e.preventDefault(); close.current?.focus(); } };
    document.addEventListener('keydown', key);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', key); document.body.style.overflow = ''; opener?.focus(); };
  }, [onClose]);
  return <div className="lightbox" role="dialog" aria-modal="true" aria-label={media.caption} onClick={onClose}>
    <figure onClick={e => e.stopPropagation()}><img src={media.src} alt={media.alt}/><figcaption>{media.caption}</figcaption></figure>
    <button ref={close} type="button" className="lightbox-close" onClick={onClose} aria-label="Close screenshot">×</button>
  </div>;
}
