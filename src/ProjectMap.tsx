import {useEffect,useState} from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { projects } from './data/projects';
import { site } from './data/site';
import {projectCovers,projectGalleries} from './data/projectMedia';

const locations = [{x:270,y:250},{x:590,y:210},{x:450,y:460},{x:720,y:540},{x:230,y:650}];
const shortNames = ['OVC', 'ArcGIS Pro', 'GeoQA', 'Cairo Hex', 'GeoNest'];
export function ProjectMap({ selectedId, animate }: { selectedId?: string; animate: boolean }) {
  const [focusId,setFocusId]=useState<string|undefined>(animate?undefined:selectedId);
  const [arrived,setArrived]=useState(!animate);
  useEffect(()=>{
    if(!animate){setFocusId(selectedId);setArrived(true);return;}
    setArrived(false);
    const start=setTimeout(()=>setFocusId(selectedId),250);
    const finish=setTimeout(()=>setArrived(true),2050);
    return()=>{clearTimeout(start);clearTimeout(finish);};
  },[selectedId,animate]);
  const index = projects.findIndex(p=>p.id===focusId);
  const selected = projects[index];
  const point = locations[index] ?? {x:450,y:450};
  return <div className="atlas">
    <div className="atlas-heading"><div><p className="eyebrow">SELECTED WORK / 01—05</p><h2>Spatial problems.<br/><span>Practical solutions.</span></h2></div><p className="atlas-intro">Tools for cleaner data and clearer maps.<br/>Choose a project to explore what it does.</p></div>
    <nav aria-label="Project destinations" className="atlas-destinations">{projects.map((p,i)=><a key={p.id} href={'#myworks/'+p.id} aria-current={p.id===selectedId?'true':undefined}><span>0{i+1}</span><strong>{shortNames[i]}</strong><span aria-hidden="true">↗</span></a>)}</nav>
    <div className="atlas-layout">
      <div className="atlas-map" role="region" aria-label="Interactive illustrative project map">
        <div className="atlas-hud"><span><i/> PROJECT MAP</span><a href="#myworks">Reset view ↺</a></div>
        <div className="atlas-camera">
          <motion.div className="atlas-plane" initial={animate?{rotateX:62,rotateZ:-30,scale:.62}:false}
            animate={{rotateX:selected?38:53,rotateZ:selected?-8:-18,scale:selected?1.55:.82}}
            transition={{duration:animate?1.7:0,ease:[.22,1,.36,1]}}>
            <motion.div className="atlas-world" initial={animate?{x:0,y:0}:false} animate={{x:450-point.x,y:450-point.y}} transition={{duration:animate?1.7:0,ease:[.22,1,.36,1]}}>
              <svg className="atlas-terrain" viewBox="0 0 900 900" aria-hidden="true">
                <defs><pattern id="atlas-grid" width="45" height="45" patternUnits="userSpaceOnUse"><path d="M45 0H0V45" fill="none" stroke="#b59ae6" strokeOpacity=".08"/></pattern><radialGradient id="land"><stop stopColor="#30223d"/><stop offset="1" stopColor="#15101c"/></radialGradient></defs>
                <rect width="900" height="900" rx="20" fill="url(#land)"/><rect width="900" height="900" fill="url(#atlas-grid)"/>
                <path d="M-30 540C180 550 180 250 390 320S610 730 930 630" stroke="#0a1320" strokeWidth="72" fill="none"/><path d="M-30 540C180 550 180 250 390 320S610 730 930 630" stroke="#68c5d7" strokeOpacity=".35" strokeWidth="2" fill="none"/>
                {Array.from({length:14},(_,i)=><ellipse key={i} cx="645" cy="280" rx={70+i*18} ry={35+i*12} transform="rotate(-28 645 280)" fill="none" stroke="#b69ad4" strokeOpacity={.35-i*.015}/>) }
                {Array.from({length:10},(_,i)=><ellipse key={i} cx="240" cy="680" rx={45+i*19} ry={25+i*13} transform="rotate(22 240 680)" fill="none" stroke="#b69ad4" strokeOpacity=".22"/>)}
                <path d="M270 250L590 210 450 460 720 540 230 650" fill="none" stroke="#d7b4ff" strokeWidth="2" strokeDasharray="7 9" opacity=".5"/>
              </svg>
              {locations.map((p,i)=><a key={projects[i].id} href={'#myworks/'+projects[i].id} className={'atlas-pin '+(i===index?'selected':'')} style={{left:p.x,top:p.y}} aria-label={'Explore '+projects[i].title} aria-current={i===index?'true':undefined}><span className="pin-label">0{i+1} <strong>{shortNames[i]}</strong></span><span className="pin-stem"/><span className="pin-ground"/></a>)}
            </motion.div>
          </motion.div>
        </div>
        <div className="atlas-compass" aria-hidden="true">N<span>↑</span></div>
        <div className="atlas-caption"><span>Concept map · illustrative locations</span><span>{selected?'PROJECT 0'+(index+1):'05 PROJECTS'}</span></div>
      </div>
      <aside className="atlas-sidebar">
        <AnimatePresence mode="wait">
          <motion.div key={selectedId??'overview'} initial={{opacity:0,y:animate?12:0}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:animate?.3:0}} className="atlas-info" aria-live="polite">
            {selected&&!arrived?<div className="atlas-travel" role="status"><span className="travel-orbit"/><p>Flying to</p><h3>{selected.title}</h3></div>:selected?<>{projectCovers[selected.id]&&<img className={"project-detail-cover "+selected.id} src={projectCovers[selected.id].src} alt={projectCovers[selected.id].alt} loading="lazy"/>}<p className="eyebrow">PROJECT / 0{index+1}</p><h3>{selected.title}</h3><p>{selected.description}</p><div className="project-tags">{selected.tags.map(tag=><span key={tag}>{tag}</span>)}</div><h4>What it does</h4><ul>{selected.features.map(f=><li key={f}>{f}</li>)}</ul><a className="button button-primary" href={site.github+'/'+selected.id} target="_blank" rel="noreferrer">View repository ↗</a><a className="atlas-reset" href="#myworks">All projects</a></>:<><p className="eyebrow">BUILT FOR THE REAL WORLD</p><h3>Less manual work.<br/>More reliable data.</h3><p>From checking building overlaps to exploring Cairo’s amenities, these projects make spatial analysis more useful.</p><div className="atlas-topics"><span>01 / Data quality</span><span>02 / Python automation</span><span>03 / Interactive mapping</span></div><a className="button button-primary" href="#myworks/ovc">Explore OVC <span aria-hidden="true">↗</span></a><p className="atlas-help">Select a project above or a marker on the map.</p></>}
          </motion.div>
        </AnimatePresence>
      </aside>
    </div>
    {selected&&arrived&&projectGalleries[selected.id]&&<section className="project-gallery" aria-label="Project screenshots"><p className="eyebrow">IN ACTION</p><h3>From the project</h3><div>{projectGalleries[selected.id].map(media=><figure key={media.src}><a href={media.src} target="_blank" rel="noreferrer" aria-label={'Open full-size image: '+media.caption}><img src={media.src} alt={media.alt} loading="lazy" decoding="async"/></a><figcaption>{media.caption}</figcaption></figure>)}</div></section>}
  </div>;
}
