import {useEffect,useRef,useState} from 'react';
import './project-visual.css';

export default function ProjectVisual({kind,index}:{kind:string;index:number}){
 const host=useRef<HTMLDivElement>(null);
 const [visible,setVisible]=useState(false);
 useEffect(()=>{const observer=new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting));if(host.current)observer.observe(host.current);return()=>observer.disconnect();},[]);
 return <div ref={host} className={'project-visual '+kind+(visible?' in-view':'')} aria-hidden="true">
  <div className="visual-grid"/><div className="visual-hud"><span>0{index+1} / {index===0?'SPATIAL QC':index===1?'MAP ENGINE':'DATA HEALTH'}</span><span className="visual-dot"/></div>
  {index===0?<svg className="visual-diagram scan-diagram" viewBox="0 0 360 220">
    <g className="map-buildings"><path d="M65 60h65v48H65zM153 40h42v60h-42zM224 55h65v40h-65zM75 135h48v45H75zM180 128h65v54h-65zM260 120h42v64h-42z"/>
    <path className="overlap-shape" d="M108 88h60v60h-60z"/><path className="conflict-zone" d="M108 88h22v20h-22z"/></g>
    <path className="map-road" d="M40 120h280M140 25v175"/>
    <g className="scan-beam"><path d="M45 20v185"/><path className="beam-tail" d="M28 20h17v185H28z"/></g>
    <circle className="signal-ring" cx="119" cy="98" r="18"/><circle className="signal-core" cx="119" cy="98" r="4"/>
   </svg>:index===1?<div className="layer-scene">{[0,1,2].map(layer=><div className={'map-layer layer-'+layer} key={layer}><svg viewBox="0 0 200 140"><path d="M0 40Q50 0 100 65T200 75M0 85Q65 40 110 110T200 115"/><path d="M40 0v140M95 0v140M150 0v140"/><rect x="55" y="48" width="25" height="30"/><rect x="111" y="75" width="28" height="20"/></svg></div>)}<div className="layer-pin"><span/></div></div>:<div className="quality-scene"><svg className="quality-orbit" viewBox="0 0 220 220"><circle className="orbit-track" cx="110" cy="110" r="81"/><circle className="orbit-progress" cx="110" cy="110" r="81"/><path className="quality-shield" d="M110 66 145 80v32q-2 27-35 43-33-16-35-43V80z"/><path className="quality-check" d="m94 110 12 12 23-25"/></svg><div className="quality-bars">{[52,82,65,95,72,88].map((height,i)=><span key={i} style={{height:height+'%','--bar-delay':i*.13+'s'} as React.CSSProperties}/>)}</div></div>}
  <div className="visual-caption"><span>{index===0?'Detect. Validate. Resolve.':index===1?'Layers working together.':'Clarity in every dataset.'}</span><span className="visual-arrow">↗</span></div>
 </div>
}

