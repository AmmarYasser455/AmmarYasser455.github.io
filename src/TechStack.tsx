import {lazy,Suspense,useEffect,useRef,useState,type CSSProperties} from 'react';
import {SiPython,SiQgis,SiPostgresql,SiGit,SiGithub,SiLinux,SiJupyter,SiDocker,SiGnubash,SiNumpy,SiPandas,SiLeaflet,SiGoogleearth,SiArcgis} from 'react-icons/si';
import {FiLayers,FiMap,FiDatabase,FiCode} from 'react-icons/fi';
import type {IconType} from 'react-icons';
import {Scramble} from './Interactions';
const Moon=lazy(()=>import('./Moon'));
const colors:Record<string,string>={'Python':'#ffcf3f','ArcPy':'#56b6ed','GeoPandas':'#68bd83','Shapely':'#62cca0','Rasterio':'#58c3de','GDAL / OGR':'#71bd59','OSMnx':'#65bba8','SQL':'#64b5ed','ArcGIS Pro':'#36a6ec','QGIS':'#a5c947','ArcGIS Online':'#52b4ec','PostGIS':'#70a9d0','Leaflet':'#9bd354','GeoJSON':'#efae52','Git':'#f56a54','GitHub':'#ffffff','Linux':'#f4ce45','Jupyter':'#f78e45','Bash':'#76c68b','NumPy':'#56a9dd','Pandas':'#b494ff','Earth Engine':'#6eacfa','Docker':'#35b1f1'};
const rows: [string,IconType,string?][][]=[
 [['Python',SiPython,'Advanced'],['ArcPy',FiCode],['GeoPandas',SiPandas],['Shapely',FiLayers],['Rasterio',FiMap],['GDAL / OGR',FiLayers],['OSMnx',FiMap],['SQL',FiDatabase]],
 [['ArcGIS Pro',SiArcgis],['QGIS',SiQgis],['ArcGIS Online',SiArcgis],['PostGIS',SiPostgresql,'Basic'],['Leaflet',SiLeaflet,'Basic'],['GeoJSON',FiCode]],
 [['Git',SiGit],['GitHub',SiGithub],['Linux',SiLinux],['Jupyter',SiJupyter],['Bash',SiGnubash]],
 [['NumPy',SiNumpy],['Pandas',SiPandas],['Earth Engine',SiGoogleearth,'Basic'],['Docker',SiDocker,'Familiar']],
];
export default function TechStack({active=true}:{active?:boolean}){
 const section=useRef<HTMLElement>(null);
 const [showMoon,setShowMoon]=useState(false);
 useEffect(()=>{const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){setShowMoon(true);observer.disconnect();}},{rootMargin:'300px'});if(section.current)observer.observe(section.current);return()=>observer.disconnect();},[]);
 return <section ref={section} id="tech-stack" className="tech-stack" aria-labelledby="tech-title"><div className="tech-moon" aria-hidden="true">{showMoon&&<Suspense fallback={null}><Moon active={active}/></Suspense>}</div><div className="tech-stars" aria-hidden="true"/><p className="eyebrow"><Scramble text="THE TOOLS BEHIND THE WORK" active={active}/></p><h2 id="tech-title">TECH STACK</h2><p className="tech-description">Python, spatial analysis, and the tools that connect them.</p><div className="tech-pyramid">{rows.map((row,i)=><div className="tech-row" key={i}>{row.map(([name,Icon,level])=><div className="tech-tile" key={name} tabIndex={0} style={{'--tech-color':colors[name]} as CSSProperties}><Icon aria-hidden="true"/><span>{name}</span>{level&&<small>{level}</small>}</div>)}</div>)}</div></section>}
