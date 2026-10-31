import fs from 'node:fs';
import { Color } from 'three';

// Preserve the reference rig/animations and split skin from the shared white material.
const source = process.argv[2] ?? '.research/reference-repo/public/models/character.glb';
const input = fs.readFileSync(source);
const jsonLength = input.readUInt32LE(12);
const model = JSON.parse(input.toString('utf8', 20, 20 + jsonLength));
const skin = structuredClone(model.materials[0]);
skin.name = 'Ammar_Warm_Brown_Skin';
skin.pbrMetallicRoughness.baseColorFactor = [...new Color('#915735').toArray(), 1];
skin.pbrMetallicRoughness.roughnessFactor = .58;
const skinIndex = model.materials.push(skin) - 1;
for (const meshIndex of [2, 5, 6, 8]) {
  for (const primitive of model.meshes[meshIndex].primitives) primitive.material = skinIndex;
}
const json = Buffer.from(JSON.stringify(model));
const padded = Buffer.alloc(Math.ceil(json.length / 4) * 4, 0x20);
json.copy(padded);
const rest = input.subarray(20 + jsonLength);
const header = Buffer.alloc(20);
header.write('glTF'); header.writeUInt32LE(2, 4);
header.writeUInt32LE(20 + padded.length + rest.length, 8);
header.writeUInt32LE(padded.length, 12); header.writeUInt32LE(0x4e4f534a, 16);
fs.writeFileSync('public/models/character-brown.glb', Buffer.concat([header, padded, rest]));
console.log('Prepared character with brown face, ears, neck and hands.');
