import { useEffect, useRef, useState } from 'react';
import './moon.css';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export default function Moon({active}: {active:boolean}) {
  const host=useRef<HTMLDivElement>(null);
  const enabled=useRef(active);
  const [status,setStatus]=useState('Loading the Moon…');
  useEffect(()=>{enabled.current=active;},[active]);
  useEffect(()=>{
    const element=host.current!;
    let renderer:THREE.WebGLRenderer;
    try {renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});}
    catch {setStatus('3D preview unavailable on this device.');window.dispatchEvent(new Event('moon-error'));return;}
    renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));
    renderer.setClearColor(0,0);
    renderer.outputColorSpace=THREE.SRGBColorSpace;
    renderer.toneMapping=THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure=1.2;
    element.appendChild(renderer.domElement);
    const scene=new THREE.Scene();
    const camera=new THREE.PerspectiveCamera(35,1,.1,100);
    camera.position.set(0,0,4.7);
    const rig=new THREE.Group();scene.add(rig);
    const sun=new THREE.DirectionalLight(0xfff4e7,3.2);sun.position.set(-3,2,3);scene.add(sun);
    const rim=new THREE.DirectionalLight(0x9b6de3,.65);rim.position.set(3,0,-1);scene.add(rim);
    scene.add(new THREE.AmbientLight(0xaeb6ce,.35));
    let dead=false,visible=true,frame=0,last=0,spin=0,progress=0;
    const pointer=new THREE.Vector2();
    const dispose=(object:THREE.Object3D)=>object.traverse(node=>{
      if(node instanceof THREE.Mesh){node.geometry.dispose();const materials=Array.isArray(node.material)?node.material:[node.material];materials.forEach(material=>{Object.values(material).forEach(value=>{if(value instanceof THREE.Texture)value.dispose();});material.dispose();});}
    });
    new GLTFLoader().load('/models/moon.glb',gltf=>{
      if(dead){dispose(gltf.scene);return;}
      const model=gltf.scene;
      const bounds=new THREE.Box3().setFromObject(model),size=bounds.getSize(new THREE.Vector3());
      const center=bounds.getCenter(new THREE.Vector3());
      model.position.sub(center);
      const normalized=new THREE.Group();normalized.add(model);normalized.scale.setScalar(2/Math.max(size.x,size.y,size.z));rig.add(normalized);
      setStatus('');element.dataset.loaded='true';window.dispatchEvent(new Event('moon-ready'));
    },event=>{if(!dead&&event.total)window.dispatchEvent(new CustomEvent('moon-progress',{detail:event.loaded/event.total*100}));},()=>{if(!dead){setStatus('The Moon could not load. Refresh to try again.');window.dispatchEvent(new Event('moon-error'));}});
    const resize=()=>{const {width,height}=element.getBoundingClientRect();renderer.setSize(width,height,false);camera.aspect=width/Math.max(height,1);camera.updateProjectionMatrix();};
    const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(element);resize();
    const move=(e:PointerEvent)=>{if(e.pointerType==='touch')return;pointer.set(e.clientX/innerWidth-.5,e.clientY/innerHeight-.5);};
    const reset=()=>pointer.set(0,0);
    const scroll=()=>{const section=element.closest('section');if(!section)return;const rect=section.getBoundingClientRect();progress=THREE.MathUtils.clamp((innerHeight-rect.top)/(innerHeight+rect.height),0,1);};
    window.addEventListener('pointermove',move);document.documentElement.addEventListener('pointerleave',reset);window.addEventListener('scroll',scroll,{passive:true});scroll();
    function render(time:number){
      if(dead||!visible||document.hidden){frame=0;last=0;return;}
      const dt=last?Math.min((time-last)/1000,.05):0;last=time;
      const smoothing=1-Math.exp(-dt*4);
      if(enabled.current){
        spin+=dt*.045;
        rig.rotation.y=THREE.MathUtils.lerp(rig.rotation.y,spin+pointer.x*.28+progress*1.7,smoothing);
        rig.rotation.x=THREE.MathUtils.lerp(rig.rotation.x,.08+pointer.y*.15+progress*.18,smoothing);
        camera.position.z=THREE.MathUtils.lerp(camera.position.z,4.7-progress*.8,smoothing);
        rig.position.y=THREE.MathUtils.lerp(rig.position.y,(progress-.5)*.4,smoothing);
      }
      element.dataset.scrollProgress=progress.toFixed(3);
      renderer.render(scene,camera);frame=requestAnimationFrame(render);
    }
    const restart=()=>{if(!frame&&!dead&&visible&&!document.hidden)frame=requestAnimationFrame(render);};
    const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;restart();});observer.observe(element);
    document.addEventListener('visibilitychange',restart);restart();
    return ()=>{dead=true;cancelAnimationFrame(frame);observer.disconnect();resizeObserver.disconnect();window.removeEventListener('pointermove',move);document.documentElement.removeEventListener('pointerleave',reset);window.removeEventListener('scroll',scroll);document.removeEventListener('visibilitychange',restart);dispose(rig);renderer.dispose();renderer.domElement.remove();};
  },[]);
  return <div className="moon-scene"><div className="moon-halo" aria-hidden="true"/><div ref={host} className="moon-canvas" role="img" aria-label="Three-dimensional Moon with a detailed cratered surface"/>{status&&<p className="moon-status" role="status">{status}</p>}<div className="moon-caption" aria-hidden="true"><span>LUNA / A DIFFERENT PERSPECTIVE</span><span>01 — EXPLORATION</span></div></div>;
}
