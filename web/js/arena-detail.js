// Detalhamento visual reversível. Não altera colisões, spawns, física ou rede.
import * as THREE from './vendor/three.module.min.js';

export function addArenaDetail(group, mapId, quality) {
  if (quality !== 'high') return;
  const palette = {
    galpao: [0xf8bf49, 0x596e83],
    arena: [0xffc300, 0x00d4ff],
    favela: [0xff6a00, 0x00d4ff],
    ferro: [0xe58b32, 0x667c86],
    cidade: [0xd7b66d, 0x6b8999],
    apocalipse: [0xff6a00, 0x778b91],
    porto: [0xffc300, 0x00d4ff],
    floresta: [0xa6c95c, 0x725c3b],
    castelo: [0xd3bb85, 0x6e8391],
    baseaerea: [0xffc300, 0x6e8fa1],
    oeste: [0xd5aa61, 0x855f3f],
  };
  const colors = palette[mapId] || palette.arena;
  const root = new THREE.Group();
  root.name = 'visual-detail-2';
  group.add(root);
  const geo = new THREE.PlaneGeometry(1, 1);
  const mat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.24, depthWrite: false, side: THREE.DoubleSide });
  const decals = new THREE.InstancedMesh(geo, mat, 44);
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), pos = new THREE.Vector3(), scale = new THREE.Vector3();
  const col = new THREE.Color();
  // Marcações no piso: sem volumes físicos, baixo custo de GPU.
  for (let i = 0; i < 44; i++) {
    const lane = i % 4;
    const x = (lane - 1.5) * 12 + (i % 3) * 0.25;
    const z = -39 + Math.floor(i / 4) * 7;
    q.setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2);
    m4.compose(pos.set(x, 0.026, z), q, scale.set(i % 7 === 0 ? 2.6 : 1.3, 0.055, 1));
    decals.setMatrixAt(i, m4);
    decals.setColorAt(i, col.setHex(colors[i % 2]));
  }
  decals.instanceMatrix.needsUpdate = true;
  if (decals.instanceColor) decals.instanceColor.needsUpdate = true;
  decals.frustumCulled = false;
  root.add(decals);
  // Placas luminosas de referência, sem obstrução da visão ou física.
  const signMat = new THREE.MeshBasicMaterial({ color: colors[0], transparent: true, opacity: 0.65, depthWrite: false });
  const signGeo = new THREE.BoxGeometry(2.5, 0.08, 0.08);
  for (const z of [-31, -17, 17, 31]) {
    for (const x of [-27.8, 27.8]) {
      const mesh = new THREE.Mesh(signGeo, signMat);
      mesh.position.set(x, 3.4, z);
      mesh.rotation.y = Math.PI / 2;
      root.add(mesh);
    }
  }
}
