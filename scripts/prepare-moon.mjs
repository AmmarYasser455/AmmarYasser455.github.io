import {NodeIO} from '@gltf-transform/core';
import {prune,textureCompress} from '@gltf-transform/functions';
import sharp from 'sharp';
import {mkdir} from 'node:fs/promises';
const io=new NodeIO();
const doc=await io.read('C:/Users/PC/Downloads/The_Moon.glb');
await doc.transform(prune(),textureCompress({encoder:sharp,targetFormat:'webp',resize:[2048,2048],quality:85}));
await mkdir('public/models',{recursive:true});
await io.write('public/models/moon.glb',doc);
