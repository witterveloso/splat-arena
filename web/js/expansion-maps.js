// Cinco arenas adicionais — geometria 3D real, colisões e coberturas para IA.
// Sem dependências externas: compatível com Three.js local e GitHub Pages.
import * as THREE from './vendor/three.module.min.js';

const THEMES = {
  porto: { floor: 0x777b80, sky: 0x95b9cf, horizon: 0xe5d8bc, fog: 0xb6c4c9, primary: 0x1f5b88, secondary: 0xb64b2d, accent: 0xe1b842 },
  floresta: { floor: 0x526b3b, sky: 0x7098ad, horizon: 0xc7d3b2, fog: 0xa8bba0, primary: 0x655039, secondary: 0x3c5432, accent: 0x9c9165 },
  castelo: { floor: 0x9d9687, sky: 0x82a8c8, horizon: 0xe5d6bc, fog: 0xb9b3a7, primary: 0x8b8579, secondary: 0x6d6c65, accent: 0x5c6572 },
  baseaerea: { floor: 0x777c79, sky: 0x87b2d4, horizon: 0xd8e2e2, fog: 0xa9b9c0, primary: 0x5d6970, secondary: 0x87939b, accent: 0xc1a34e },
  oeste: { floor: 0xa47a4e, sky: 0x75a9ce, horizon: 0xe8bd8d, fog: 0xd6b08a, primary: 0x865d3c, secondary: 0xb48b5e, accent: 0x60432e },
};
export function buildExpansion(id, ctx) {
  const T = THEMES[id];
  if (!T) throw new Error('Mapa desconhecido: ' + id);
  const { group, obstacles, quality } = ctx;
  const hi = quality === 'high';
  const mats = new Map();
  function mat(c, metal = 0, rough = 0.85) {
    const key = c + ':' + metal + ':' + rough;
    if (!mats.has(key)) mats.set(key, new THREE.MeshStandardMaterial({ color: c, metalness: metal, roughness: rough }));
    return mats.get(key);
  }
  const cube = new THREE.BoxGeometry(1, 1, 1);
  const cylinder = new THREE.CylinderGeometry(1, 1, 1, 10);
  function block(x, z, w, d, h, color, opts = {}) {
    const mesh = new THREE.Mesh(cube, mat(color, opts.metal || 0));
    mesh.scale.set(w, h, d); mesh.position.set(x, (opts.y || 0) + h / 2, z);
    mesh.castShadow = hi && opts.shadow !== false; mesh.receiveShadow = true; group.add(mesh);
    if (opts.collide !== false) obstacles.push({ type: 'box', x, z, w, d, h: (opts.y || 0) + h });
    return mesh;
  }
  function round(x, z, r, h, color, opts = {}) {
    const mesh = new THREE.Mesh(cylinder, mat(color));
    mesh.scale.set(r, h, r); mesh.position.set(x, h / 2, z);
    mesh.castShadow = hi; group.add(mesh);
    if (opts.collide !== false) obstacles.push({ type: 'cyl', x, z, r, h });
    return mesh;
  }
  function decorative(x, y, z, w, h, d, color) {
    return block(x, z, w, d, h, color, { y, collide: false, shadow: false });
  }
  function pair(fn) { fn(1); fn(-1); }
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(100, 130), mat(T.floor));
  ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; group.add(ground);
  // Faixa externa: visual sem colisão, deixa os limites físicos para ARENA.
  pair(s => {
    block(0, s * 46, 60, 1, 3.5, T.secondary, { collide: false });
    block(s * 31, 0, 1, 94, 3.5, T.secondary, { collide: false });
  });
  if (id === 'porto') {
    // Corredores de contêineres: corredores laterais, miolo aberto e proteção do objetivo.
    pair(s => {
      for (let k = 0; k < 4; k++) {
        const z = s * (10 + k * 8);
        block(s * 20, z, 4.7, 6.5, 3.1, k % 2 ? T.primary : T.secondary, { metal: 0.55 });
        block(s * 11, z + s * 3, 6.5, 3.1, 2.7, k % 2 ? T.accent : T.primary, { metal: 0.55 });
      }
      for (let k = 0; k < 5; k++) block(s * (4 + k % 2 * 4), s * (8 + k * 7), 1.6, 1.6, 1.35, 0x94795c);
      decorative(s * 27, 6, 0, 1.2, 11, 1.2, T.accent);
      decorative(s * 18, 15, 0, 20, 1.2, 1, T.accent);
    });
    pair(s => block(s * 6, s * 2.5, 4, 2.5, 1.6, T.secondary));
  } else if (id === 'floresta') {
    // Woodsball: troncos, paliçadas e árvores; centro livre para bandeira.
    pair(s => {
      for (let i = 0; i < 22; i++) {
        const x = s * (5 + (i * 13 % 23)), z = s * (8 + (i * 17 % 33));
        if (i % 4 === 0) block(x, z, 4, 1, 1.5, T.primary);
        else round(x, z, 0.42 + (i % 3) * 0.13, 5 + i % 3, 0x584332);
        if (i % 3 !== 0) {
          const canopy = new THREE.Mesh(new THREE.IcosahedronGeometry(2.3 + i % 3, 1), mat(i % 2 ? 0x47643a : 0x617a43));
          canopy.position.set(x, 5.2 + i % 3, z); canopy.castShadow = hi; group.add(canopy);
        }
      }
      block(s * 15, s * 18, 5, 1.1, 2.2, T.primary);
      block(s * 15, s * 25, 1.1, 5, 2.2, T.primary);
    });
    pair(s => block(s * 5, s * 3, 3, 1.1, 1.5, T.primary));
  } else if (id === 'castelo') {
    // Fortaleza cenográfica simétrica, muralhas laterais e pátio central.
    pair(s => {
      block(s * 25, s * 22, 3.5, 25, 5.2, T.primary);
      block(s * 25, s * 10, 5.5, 5.5, 8, T.secondary);
      block(s * 13, s * 29, 6, 2.5, 3.2, T.primary);
      block(s * 11, s * 18, 2.4, 6, 2.4, T.primary);
      block(s * 7, s * 7, 4.5, 2.1, 2.1, T.secondary);
      for (let i = 0; i < 5; i++) decorative(s * 25, 5.2, s * (11 + i * 5), 3.7, 0.8, 2.3, T.accent);
    });
    pair(s => block(s * 3, s * 2, 2.5, 2.5, 1.8, T.primary));
  } else if (id === 'baseaerea') {
    // Pátio de hangar e aeronaves estacionadas ao fundo, sem bloquear o spawn.
    pair(s => {
      block(s * 23, s * 21, 8, 13, 6, T.primary);
      decorative(s * 23, 6, s * 21, 10, 1.2, 15, T.secondary);
      for (let i = 0; i < 7; i++) {
        const x = s * (5 + i % 3 * 7), z = s * (7 + Math.floor(i / 3) * 10);
        block(x, z, 2.3, 2.3, 1.4 + i % 2 * 0.9, i % 2 ? T.secondary : T.accent);
      }
      // Silhueta de aeronave no estacionamento lateral, sem colisão.
      decorative(s * 20, 0.9, s * 36, 2.2, 1.7, 9, 0xc1c8c9);
      decorative(s * 20, 1.6, s * 36, 13, 0.35, 2, 0xa3adb0);
      decorative(s * 20, 1.8, s * 39, 4, 0.4, 2, 0x7b8a92);
    });
    pair(s => block(s * 4, s * 3, 3.5, 2, 1.5, T.primary));
  } else if (id === 'oeste') {
    // Vila cenográfica: saloon, celeiro, carroças e barricadas de feno.
    pair(s => {
      block(s * 23, s * 22, 8, 12, 5.5, T.primary);
      decorative(s * 23, 5.5, s * 22, 9.5, 1.2, 13, T.accent);
      for (let i = 0; i < 5; i++) {
        block(s * (9 + i % 2 * 5), s * (8 + i * 7), 3, 1.4, 1.4, 0xc5a46c);
        decorative(s * (9 + i % 2 * 5), 1.4, s * (8 + i * 7), 3, 0.14, 1.4, 0x7d5b34);
      }
      block(s * 18, s * 7, 5, 1.2, 1.8, T.secondary);
      block(s * 18, s * 35, 5, 1.2, 1.8, T.secondary);
    });
    pair(s => block(s * 4, s * 3, 3, 1.5, 1.6, T.primary));
  }
  return {
    sky: { top: T.sky, horizon: T.horizon, ground: T.floor, sunSize: 0.55, clouds: 0.3 },
    sun: { color: 0xffedce, intensity: 1.75, dir: [24, 58, 17] },
    hemi: { sky: 0xd8e8f4, ground: T.floor, intensity: 1.25 },
    fog: { color: T.fog, near: 55, far: 195 },
    exposure: 1.08, envIntensity: 0.65,
  };
}
