# Auditoria inicial — Splat Arena Visual 2.0

Data: 2026-11-20. Branch de trabalho: `feature/visual-2-auditoria`. Nenhuma alteração no jogo nesta etapa.

## Arquitetura confirmada
- Aplicação estática HTML/CSS/JavaScript com Three.js local em `web/js/vendor`.
- Renderização WebGL em `web/js/main.js`; cenários procedurais em `web/js/maps.js`; materiais/texturas em `web/js/textures.js`.
- Personagens definidos em `web/js/characters.js`, seleção em `web/js/charselect.js`, modelo-base `web/assets/soldier.glb` e pipeline em `web/js/models.js`.
- Multiplayer P2P PeerJS/WebRTC em `web/js/net.js` e `web/js/online.js`; simulação e bots em `web/js/combatants.js`.
- Seis mapas existentes: arena, galpao, favela (Morro Vivo), ferro, apocalipse (Zona Zero), cidade. Não duplicar Arena Speedball ou equivalentes.

## Requisitos de preservação
- Modos Eliminação e Centerflag, 8x8/10x10/15x15, cinco marcas para eliminação, tiros, projéteis, pontuação e HUD.
- Câmera primeira/terceira pessoa, controles PC e touch, configurações, persistência e acessibilidade.
- Multiplayer anfitrião/convidado, sincronização de personagem e IA dos bots.
- Desempenho móvel: preservar carregamento progressivo de texturas, qualidade adaptativa e liberação de recursos.

## Lacunas e riscos
1. Oito personagens são variações de uma única malha/esqueleto GLB; não existem oito modelos humanos independentes.
2. Animações de disparo/acerto/eliminação são parcialmente procedurais.
3. Texturas PBR geradas por código, sem pipeline de texturas fotográficas comprimidas.
4. Testes descritos na documentação ocorreram em Chromium/emulação; validar aparelhos reais.
5. `soldier.glb` é recurso provisório; revisar direitos/licenciamento antes de distribuição comercial.
6. Multiplayer P2P depende de conectividade/STUN/TURN e não possui servidor autoritativo.

## Plano incremental
**Fase 0 — Baseline:** executar localmente e registrar capturas/FPS, erros do console, fluxos offline/online e desempenho.
**Fase 1 — Galpão:** melhoria visual por camadas opcionais, preservando obstáculos e dados de colisão; testes A/B em low/high.
**Fase 2 — Personagens:** interface de carregamento de GLB individual por personagem com fallback para o modelo atual; validar rig, animações, hitbox e rede.
**Fase 3 — UI:** logotipo vetorial, design tokens e menus, sem alterar contratos de estado.
**Fase 4 — Mapas:** aprimorar seis existentes; depois adicionar Porto de Contêineres, Floresta Tática, Castelo, Base Aérea e Vila do Oeste (cinco mapas novos).
**Fase 5 — QA:** desktop, Android e iPhone, bots, Centerflag, multiplayer entre dois dispositivos e performance.

## Critérios de aceite para cada fase
- Sem regressões em carregamento, movimentação, tiros, IA, HUD e online.
- Colisões visíveis coerentes com geometrias; rotas dos bots funcionais.
- Não anunciar fotorrealismo sem modelos, materiais e testes compatíveis.
- Não publicar em `main` antes de validação e revisão.

## Próxima ação
Inspecionar `world.js`, `models.js`, `screens.js`, `style.css` e fluxo de criação/remoção de mapas; preparar patch visual do Galpão com chave de ativação reversível.
