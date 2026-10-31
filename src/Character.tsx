import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js';
import { typingBoneNames } from './data/characterBones';

export default function Character({active, introReady=true, variant="journey"}: {active:boolean; introReady?:boolean; variant?:"journey"|"desk"}) {
  const host=useRef<HTMLDivElement>(null);
  const enabled=useRef(active);
  const ready=useRef(introReady);
  useEffect(()=>{ready.current=introReady;},[introReady]);
  const [status,setStatus]=useState('Loading the character…');
  useEffect(()=>{enabled.current=active;},[active]);
  useEffect(()=>{
    const element=host.current!;
    let renderer:THREE.WebGLRenderer;
    try {renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});}
    catch {setStatus('3D preview unavailable on this device.');window.dispatchEvent(new Event('character-error'));return;}
    renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));
    renderer.setClearColor(0,0);
    renderer.outputColorSpace=THREE.SRGBColorSpace;
    renderer.toneMapping=THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure=1.2;
    element.appendChild(renderer.domElement);
    const scene=new THREE.Scene();
    const camera=new THREE.PerspectiveCamera(14.5,1,.1,1000);
    camera.position.set(0,13.1,24.7);camera.zoom=1.1;camera.updateProjectionMatrix();
    const rig=new THREE.Group();scene.add(rig);
    const sun=new THREE.DirectionalLight(0xfff4e7,2.3);sun.position.set(-3,16,8);scene.add(sun);
    const rim=new THREE.DirectionalLight(0x9b6de3,.65);rim.position.set(3,15,-3);scene.add(rim);
    scene.add(new THREE.AmbientLight(0xffe8d7,.65));
    let dead=false,visible=true,frame=0,last=0,portrait=0,desk=0;
    const pointer=new THREE.Vector2();
    const dispose=(object:THREE.Object3D)=>object.traverse(node=>{
      if(node instanceof THREE.Mesh){node.geometry.dispose();const materials=Array.isArray(node.material)?node.material:[node.material];materials.forEach(material=>{Object.values(material).forEach(value=>{if(value instanceof THREE.Texture)value.dispose();});material.dispose();});}
    });
    let mixer:THREE.AnimationMixer | undefined;
    let introAction:THREE.AnimationAction|undefined,introDuration=0,introElapsed=0,introStarted=false;
    let head:THREE.Object3D | undefined;
    let neck:THREE.Object3D | undefined,monitor:THREE.Object3D | undefined,screen:THREE.Object3D | undefined;
    let environment:THREE.Texture | undefined;
    const draco=new DRACOLoader();
    new HDRLoader().load('/models/char_enviorment.hdr',texture=>{
      if(dead){texture.dispose();return;}
      texture.mapping=THREE.EquirectangularReflectionMapping;
      environment=texture;scene.environment=texture;scene.environmentIntensity=.4;
    });
    new GLTFLoader().setDRACOLoader(draco).load('/models/character-brown.glb',gltf=>{
      if(dead){dispose(gltf.scene);return;}
      const model=gltf.scene;rig.add(model);
      // Recolor only the violet iris texels, preserving pupils, sclera and highlights.
      model.traverse(node=>{
        if(!(node instanceof THREE.Mesh))return;
        const materials=Array.isArray(node.material)?node.material:[node.material];
        for(const material of materials){
          if(!material.name.startsWith('EyesMaterial'))continue;
          material.onBeforeCompile=(shader: THREE.WebGLProgramParametersWithUniforms)=>{
            shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>',`#include <map_fragment>
              float eyeMax=max(diffuseColor.r,max(diffuseColor.g,diffuseColor.b));
              float eyeMin=min(diffuseColor.r,min(diffuseColor.g,diffuseColor.b));
              float eyeSaturation=(eyeMax-eyeMin)/max(eyeMax,0.0001);
              float violetHue=smoothstep(0.0,0.025,diffuseColor.b-max(diffuseColor.r,diffuseColor.g));
              float irisMask=violetHue*smoothstep(0.30,0.65,eyeSaturation);
              float irisLight=dot(diffuseColor.rgb,vec3(0.2126,0.7152,0.0722));
              vec3 brownIris=vec3(1.25,0.52,0.19)*irisLight;
              diffuseColor.rgb=mix(diffuseColor.rgb,brownIris,irisMask);
            `);
          };
          material.customProgramCacheKey=()=> 'ammar-dark-brown-iris-v2';
          material.needsUpdate=true;
        }
      });
      head=model.getObjectByName('spine006');
      monitor=model.getObjectByName('Plane004');
      screen=model.getObjectByName('screenlight');
      neck=model.getObjectByName('spine005');
      for(const name of ['footR','footL']){const foot=model.getObjectByName(name);if(foot)foot.position.y=3.36;}
      mixer=new THREE.AnimationMixer(model);
      const intro=gltf.animations.find(clip=>clip.name==='introAnimation');
      if(intro){
        const action=mixer.clipAction(intro);action.setLoop(THREE.LoopOnce,1);action.clampWhenFinished=true;action.play();
        introAction=action;introDuration=intro.duration;
        // Start at the completed pose so reduced motion never leaves a T-pose.
        mixer.update(intro.duration);
      }
      const typing=gltf.animations.find(clip=>clip.name==='typing');
      if(typing){const clip=new THREE.AnimationClip('typing_filtered',typing.duration,typing.tracks.filter(track=>typingBoneNames.some(name=>track.name.includes(name))));mixer.clipAction(clip).play();}
      const blink=gltf.animations.find(clip=>clip.name==='Blink');if(blink)mixer.clipAction(blink).play();
      mixer.update(0);

      element.dataset.loaded='true';setStatus('');if(variant==='journey')window.dispatchEvent(new Event('character-ready'));
    },event=>{if(!dead&&event.total)window.dispatchEvent(new CustomEvent('character-progress',{detail:event.loaded/event.total*100}));},()=>{if(!dead){setStatus('The character could not load. Refresh to try again.');window.dispatchEvent(new Event('character-error'));}});
    const resize=()=>{const {width,height}=element.getBoundingClientRect();renderer.setSize(width,height,false);camera.aspect=width/Math.max(height,1);camera.updateProjectionMatrix();};
    const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(element);resize();
    const move=(e:PointerEvent)=>{if(e.pointerType==='touch')return;pointer.set(e.clientX/innerWidth-.5,e.clientY/innerHeight-.5);};
    const reset=()=>pointer.set(0,0);
    const scroll=()=>{
      const about=document.getElementById('about'), experience=document.getElementById('experience');
      const aboutTop=about ? about.getBoundingClientRect().top+scrollY : innerHeight;
      const experienceTop=experience ? experience.getBoundingClientRect().top+scrollY : innerHeight*2;
      portrait=THREE.MathUtils.clamp(scrollY/Math.max(1,aboutTop),0,1);
      desk=THREE.MathUtils.clamp((scrollY-(aboutTop+innerHeight*.25))/Math.max(1,experienceTop-aboutTop-innerHeight*.25),0,1);
    };
    window.addEventListener('pointermove',move);document.documentElement.addEventListener('pointerleave',reset);window.addEventListener('scroll',scroll,{passive:true});scroll();
    function render(time:number){
      if(dead||!visible||document.hidden){frame=0;last=0;return;}
      const dt=last?Math.min((time-last)/1000,.05):0;last=time;
      const smoothing=1-Math.exp(-dt*4);
      const desktop=innerWidth>1024;
      if(!introStarted&&ready.current&&mixer){introStarted=true;if(enabled.current&&variant==='journey'&&scrollY<200){introAction?.reset().play();}else introElapsed=introDuration;}
      if(introStarted&&enabled.current)introElapsed+=dt;
      const introducing=introStarted&&introElapsed<introDuration&&variant==='journey';
      element.dataset.intro=introducing?'playing':introStarted?'complete':'waiting';
      const d=variant==='desk'?1:(desktop&&enabled.current?desk:0);
      const p=variant==='desk'?1:(desktop&&enabled.current?portrait:0);
      if(enabled.current) mixer?.update(dt);
      const blend=enabled.current?smoothing:1;
      const headBlend=enabled.current?1-Math.exp(-dt*8):1;
      if(head&&!introducing){
        head.rotation.y=THREE.MathUtils.lerp(head.rotation.y,d>0.6?-.3:(enabled.current?pointer.x*.8:0),headBlend);
        head.rotation.x=THREE.MathUtils.lerp(head.rotation.x,d>0.6?-.4:(enabled.current?-.15+pointer.y*.35:-.15),headBlend);
      }
      if(neck&&!introducing)neck.rotation.x=THREE.MathUtils.lerp(neck.rotation.x,d*.6,blend);
      rig.rotation.y=THREE.MathUtils.lerp(rig.rotation.y,p*.7+d*.22,blend);
      rig.rotation.x=THREE.MathUtils.lerp(rig.rotation.x,d*.12,blend);
      camera.position.z=THREE.MathUtils.lerp(camera.position.z,24.7-p*2.7+d*53,blend);
      camera.position.y=THREE.MathUtils.lerp(camera.position.y,13.1-d*4.7,blend);
      if(monitor)monitor.visible=d>.2;
      if(screen)screen.visible=d>.5;
      element.dataset.view=d>.8?'desk':p>.6?'about':'hero';

      renderer.render(scene,camera);frame=requestAnimationFrame(render);
    }
    const restart=()=>{if(!frame&&!dead&&visible&&!document.hidden)frame=requestAnimationFrame(render);};
    const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;restart();});observer.observe(element);
    document.addEventListener('visibilitychange',restart);restart();
    return ()=>{dead=true;cancelAnimationFrame(frame);observer.disconnect();resizeObserver.disconnect();window.removeEventListener('pointermove',move);document.documentElement.removeEventListener('pointerleave',reset);window.removeEventListener('scroll',scroll);document.removeEventListener('visibilitychange',restart);mixer?.stopAllAction();mixer?.uncacheRoot(rig.children[0] ?? rig);dispose(rig);environment?.dispose();draco.dispose();renderer.dispose();renderer.domElement.remove();};
  },[variant]);
  return <div className="character-scene"><div className="character-halo" aria-hidden="true"/><div ref={host} className="character-canvas" role="img" aria-label="Interactive cartoon character with warm brown skin and the original hairstyle"/>{status&&<p className="character-status" role="status">{status}</p>}</div>;
}

