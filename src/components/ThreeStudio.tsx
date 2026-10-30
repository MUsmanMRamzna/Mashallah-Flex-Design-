import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { Layers, Sparkles, RotateCw, Eye, EyeOff, Check, Maximize2 } from 'lucide-react';
import { BUSINESS_INFO } from '../data/businessData';

type ModelKey = 'standee' | 'card' | 'stamp' | 'brochure';
type FinishKey = 'matte' | 'gloss' | 'foil' | 'cotton';

export const ThreeStudio: React.FC<{
  onSelectService?: (serviceId: string) => void;
}> = ({ onSelectService }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeModel, setActiveModel] = useState<ModelKey>('standee');
  const [activeFinish, setActiveFinish] = useState<FinishKey>('matte');
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

  // References to communicate with Three.js loop without re-instantiating WebGL
  const stateRef = useRef({
    activeModel,
    activeFinish,
    autoRotate,
    targetModelGroup: null as THREE.Group | null,
    models: {} as Record<ModelKey, THREE.Group>,
    materials: {} as Record<string, THREE.Material>,
  });

  stateRef.current.activeModel = activeModel;
  stateRef.current.activeFinish = activeFinish;
  stateRef.current.autoRotate = autoRotate;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Software WebGL Guard (Directive 2.1)
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // 2. Setup WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: true,
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 520;
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    // 3. Scene, Camera, Studio Environment
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfcfbfa);
    scene.fog = new THREE.Fog(0xfcfbfa, 12, 35);

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 2.2, 5.8);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.02; // Don't go under floor
    controls.minDistance = 2.5;
    controls.maxDistance = 10;
    controls.target.set(0, 1.2, 0);

    // Procedural Studio Environment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 4. Studio PBR Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xfff8ee, 0xdfe7f2, 0.7);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfffaed, 2.0);
    keyLight.position.set(4, 8, 5);
    keyLight.castShadow = !isSoftwareGl;
    if (keyLight.castShadow) {
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.camera.near = 0.5;
      keyLight.shadow.camera.far = 25;
      const d = 3.5;
      keyLight.shadow.camera.left = -d;
      keyLight.shadow.camera.right = d;
      keyLight.shadow.camera.top = d;
      keyLight.shadow.camera.bottom = -d;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xe0f2fe, 0.9);
    fillLight.position.set(-5, 4, -2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffeedd, 0.8);
    rimLight.position.set(0, 5, -5);
    scene.add(rimLight);

    // 5. Studio Floor Grid & Contact Shadow
    const floorGeo = new THREE.PlaneGeometry(30, 30);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0xfcfbfa,
      roughness: 0.95,
      metalness: 0.0,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = !isSoftwareGl;
    scene.add(floor);

    // Helper: Procedural Shadow Plane
    function createContactShadow(radius = 1.6, opacity = 0.3) {
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext('2d')!;
      const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      grad.addColorStop(0, `rgba(20, 24, 33, ${opacity})`);
      grad.addColorStop(0.5, `rgba(20, 24, 33, ${opacity * 0.4})`);
      grad.addColorStop(1, 'rgba(20, 24, 33, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 128, 128);

      const shadowTex = new THREE.CanvasTexture(canvas);
      shadowTex.colorSpace = THREE.SRGBColorSpace;
      const shadowMat = new THREE.MeshBasicMaterial({
        map: shadowTex,
        transparent: true,
        depthWrite: false,
      });
      const shadowMesh = new THREE.Mesh(new THREE.PlaneGeometry(radius * 2, radius * 2), shadowMat);
      shadowMesh.rotation.x = -Math.PI / 2;
      shadowMesh.position.y = 0.005; // avoid Z-fight
      return shadowMesh;
    }

    // Helper: Procedural Textures
    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();

    // Banner Graphic Texture
    const bannerCanvas = document.createElement('canvas');
    bannerCanvas.width = 1024;
    bannerCanvas.height = 2048;
    const bCtx = bannerCanvas.getContext('2d')!;
    bCtx.fillStyle = '#0f172a'; // Deep slate background
    bCtx.fillRect(0, 0, 1024, 2048);

    // Decorative grid & dynamic lines
    bCtx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    bCtx.lineWidth = 2;
    for (let x = 0; x <= 1024; x += 64) {
      bCtx.beginPath();
      bCtx.moveTo(x, 0);
      bCtx.lineTo(x, 2048);
      bCtx.stroke();
    }
    for (let y = 0; y <= 2048; y += 64) {
      bCtx.beginPath();
      bCtx.moveTo(0, y);
      bCtx.lineTo(1024, y);
      bCtx.stroke();
    }

    // Gradient accent wave
    const bGrad = bCtx.createLinearGradient(0, 400, 1024, 1200);
    bGrad.addColorStop(0, '#f97316');
    bGrad.addColorStop(0.5, '#ea580c');
    bGrad.addColorStop(1, '#0284c7');
    bCtx.fillStyle = bGrad;
    bCtx.beginPath();
    bCtx.arc(512, 900, 380, 0, Math.PI * 2);
    bCtx.fill();

    // Monogram Circle
    bCtx.fillStyle = '#ffffff';
    bCtx.beginPath();
    bCtx.arc(512, 480, 90, 0, Math.PI * 2);
    bCtx.fill();
    bCtx.fillStyle = '#0f172a';
    bCtx.font = 'bold 72px Outfit, sans-serif';
    bCtx.textAlign = 'center';
    bCtx.textBaseline = 'middle';
    bCtx.fillText('AB', 512, 480);

    // Main Header
    bCtx.fillStyle = '#ffffff';
    bCtx.font = 'bold 64px Outfit, sans-serif';
    bCtx.fillText('MASHALLAH', 512, 640);
    bCtx.font = '600 36px Outfit, sans-serif';
    bCtx.fillStyle = '#f8fafc';
    bCtx.fillText('FLEX PRINTING & ADVERTISING', 512, 700);

    // Tagline & Highlights
    bCtx.fillStyle = '#fef08a';
    bCtx.font = '500 28px Plus Jakarta Sans, sans-serif';
    bCtx.fillText('DESIGNING IDEAS · PRINTING IMPACT', 512, 760);

    // Middle Service List
    bCtx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    bCtx.font = '500 30px Plus Jakarta Sans, sans-serif';
    const items = [
      '★ HIGH-RESOLUTION FLEX BANNERS',
      '★ LOGO & BRAND IDENTITY CRAFT',
      '★ LUXURY BUSINESS CARDS & STAMPS',
      '★ WEDDING INVITATIONS & FLYERS',
      '★ COMMERCIAL SIGNAGE & ADVERTISING',
    ];
    items.forEach((txt, i) => {
      bCtx.fillText(txt, 512, 1050 + i * 80);
    });

    // Owner Contact Footer Box
    bCtx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    bCtx.fillRect(100, 1600, 824, 300);
    bCtx.strokeStyle = 'rgba(249, 115, 22, 0.8)';
    bCtx.lineWidth = 4;
    bCtx.strokeRect(100, 1600, 824, 300);

    bCtx.fillStyle = '#ffffff';
    bCtx.font = 'bold 38px Outfit, sans-serif';
    bCtx.fillText('ATTIQUE BHATTI', 512, 1680);
    bCtx.font = '500 32px Plus Jakarta Sans, sans-serif';
    bCtx.fillStyle = '#38bdf8';
    bCtx.fillText('WHATSAPP: +92 343 4758685', 512, 1750);
    bCtx.fillStyle = '#94a3b8';
    bCtx.font = '400 26px Plus Jakarta Sans, sans-serif';
    bCtx.fillText('aliattique685@gmail.com', 512, 1820);

    const bannerTexture = new THREE.CanvasTexture(bannerCanvas);
    bannerTexture.colorSpace = THREE.SRGBColorSpace;
    bannerTexture.anisotropy = maxAnisotropy;

    // Card Front Texture
    const cardCanvas = document.createElement('canvas');
    cardCanvas.width = 1050;
    cardCanvas.height = 600;
    const cCtx = cardCanvas.getContext('2d')!;
    cCtx.fillStyle = '#0f172a';
    cCtx.fillRect(0, 0, 1050, 600);

    // Subtle hairline gold border
    cCtx.strokeStyle = '#d4af37';
    cCtx.lineWidth = 3;
    cCtx.strokeRect(40, 40, 970, 520);

    // Monogram emblem
    cCtx.beginPath();
    cCtx.arc(180, 240, 65, 0, Math.PI * 2);
    cCtx.strokeStyle = '#d4af37';
    cCtx.lineWidth = 2.5;
    cCtx.stroke();
    cCtx.fillStyle = '#d4af37';
    cCtx.font = 'bold 54px Outfit, sans-serif';
    cCtx.textAlign = 'center';
    cCtx.textBaseline = 'middle';
    cCtx.fillText('AB', 180, 240);

    // Typography
    cCtx.textAlign = 'left';
    cCtx.fillStyle = '#ffffff';
    cCtx.font = 'bold 52px Outfit, sans-serif';
    cCtx.fillText('ATTIQUE BHATTI', 280, 220);

    cCtx.fillStyle = '#d4af37';
    cCtx.font = '500 26px Plus Jakarta Sans, sans-serif';
    cCtx.fillText('CREATIVE DIRECTOR & MASTER PRINTER', 280, 270);

    cCtx.fillStyle = '#cbd5e1';
    cCtx.font = '400 24px Plus Jakarta Sans, sans-serif';
    cCtx.fillText('Mashallah Flex Printing & Advertising', 280, 315);

    // Contact bottom strip
    cCtx.fillStyle = '#94a3b8';
    cCtx.font = '400 22px Plus Jakarta Sans, sans-serif';
    cCtx.fillText('WhatsApp: +92 343 4758685  ·  aliattique685@gmail.com', 80, 500);

    const cardTexture = new THREE.CanvasTexture(cardCanvas);
    cardTexture.colorSpace = THREE.SRGBColorSpace;
    cardTexture.anisotropy = maxAnisotropy;

    // Stamp Rubber Face Texture
    const stampCanvas = document.createElement('canvas');
    stampCanvas.width = 512;
    stampCanvas.height = 512;
    const sCtx = stampCanvas.getContext('2d')!;
    sCtx.fillStyle = '#1e293b';
    sCtx.fillRect(0, 0, 512, 512);

    sCtx.strokeStyle = '#ef4444';
    sCtx.lineWidth = 8;
    sCtx.beginPath();
    sCtx.arc(256, 256, 220, 0, Math.PI * 2);
    sCtx.stroke();

    sCtx.beginPath();
    sCtx.arc(256, 256, 190, 0, Math.PI * 2);
    sCtx.stroke();

    sCtx.fillStyle = '#ef4444';
    sCtx.textAlign = 'center';
    sCtx.font = 'bold 30px Outfit, sans-serif';
    sCtx.fillText('MASHALLAH PRINTING', 256, 120);
    sCtx.font = 'bold 44px Outfit, sans-serif';
    sCtx.fillText('VERIFIED', 256, 260);
    sCtx.font = 'bold 24px Plus Jakarta Sans, sans-serif';
    sCtx.fillText('ATTIQUE BHATTI', 256, 320);
    sCtx.font = 'bold 20px Plus Jakarta Sans, sans-serif';
    sCtx.fillText('0343-4758685', 256, 400);

    const stampTexture = new THREE.CanvasTexture(stampCanvas);
    stampTexture.colorSpace = THREE.SRGBColorSpace;
    stampTexture.anisotropy = maxAnisotropy;

    // 6. BUILD PROCEDURAL 3-12 PART MODELS (Directive 1.3)

    // --- MODEL 1: Roll-up Flex Banner Stand (6 distinct parts) ---
    const standeeGroup = new THREE.Group();
    standeeGroup.position.set(0, 0, 0);

    // Aluminum Stand Material
    const metalMat = new THREE.MeshStandardMaterial({
      color: 0xd4d4d8,
      metalness: 0.85,
      roughness: 0.22,
    });
    const darkMetalMat = new THREE.MeshStandardMaterial({
      color: 0x3f3f46,
      metalness: 0.9,
      roughness: 0.35,
    });

    // Part 1: Base Aluminum Cassette
    const baseGeo = new THREE.CylinderGeometry(0.12, 0.12, 1.4, 24);
    baseGeo.rotateZ(Math.PI / 2);
    const baseMesh = new THREE.Mesh(baseGeo, metalMat);
    baseMesh.position.set(0, 0.12, 0);
    baseMesh.castShadow = !isSoftwareGl;
    baseMesh.receiveShadow = !isSoftwareGl;
    standeeGroup.add(baseMesh);

    // Part 2: Dual Rotating Stabilizer Feet
    const footGeo = new THREE.BoxGeometry(0.04, 0.02, 0.6);
    const footLeft = new THREE.Mesh(footGeo, darkMetalMat);
    footLeft.position.set(-0.45, 0.015, 0.05);
    footLeft.castShadow = !isSoftwareGl;
    const footRight = new THREE.Mesh(footGeo, darkMetalMat);
    footRight.position.set(0.45, 0.015, 0.05);
    footRight.castShadow = !isSoftwareGl;
    standeeGroup.add(footLeft, footRight);

    // Part 3: Telescoping Vertical Mast
    const mastGeo = new THREE.CylinderGeometry(0.025, 0.025, 2.4, 16);
    const mastMesh = new THREE.Mesh(mastGeo, metalMat);
    mastMesh.position.set(0, 1.3, -0.06);
    mastMesh.castShadow = !isSoftwareGl;
    standeeGroup.add(mastMesh);

    // Part 4: Top Snap Bar Clamping Rail
    const topBarGeo = new THREE.BoxGeometry(1.3, 0.05, 0.04);
    const topBar = new THREE.Mesh(topBarGeo, darkMetalMat);
    topBar.position.set(0, 2.42, 0);
    topBar.castShadow = !isSoftwareGl;
    standeeGroup.add(topBar);

    // Part 5: Vinyl Banner Sheet
    const bannerGeo = new THREE.PlaneGeometry(1.24, 2.3);
    const bannerMat = new THREE.MeshStandardMaterial({
      map: bannerTexture,
      roughness: 0.5,
      metalness: 0.05,
      side: THREE.DoubleSide,
    });
    stateRef.current.materials['banner'] = bannerMat;
    const bannerMesh = new THREE.Mesh(bannerGeo, bannerMat);
    bannerMesh.position.set(0, 1.28, 0);
    bannerMesh.castShadow = !isSoftwareGl;
    standeeGroup.add(bannerMesh);

    // Part 6: Corner Brass Grommets
    const grommetGeo = new THREE.TorusGeometry(0.02, 0.007, 8, 16);
    const grommetMat = new THREE.MeshStandardMaterial({
      color: 0xca8a04,
      metalness: 0.95,
      roughness: 0.15,
    });
    const gCoords = [
      [-0.56, 2.35],
      [0.56, 2.35],
      [-0.56, 0.22],
      [0.56, 0.22],
    ];
    gCoords.forEach(([gx, gy]) => {
      const gMesh = new THREE.Mesh(grommetGeo, grommetMat);
      gMesh.position.set(gx, gy, 0.004);
      standeeGroup.add(gMesh);
    });

    // Contact shadow
    standeeGroup.add(createContactShadow(1.2, 0.35));
    scene.add(standeeGroup);
    stateRef.current.models['standee'] = standeeGroup;

    // --- MODEL 2: Luxury Business Card Stack (5 parts) ---
    const cardGroup = new THREE.Group();
    cardGroup.position.set(0, 0, 0);

    // Part 1: Main Stack Body
    const stackGeo = new THREE.BoxGeometry(1.8, 0.25, 1.05);
    const stackMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.8,
      metalness: 0.1,
    });
    const stackMesh = new THREE.Mesh(stackGeo, stackMat);
    stackMesh.position.set(0, 0.125, 0);
    stackMesh.castShadow = !isSoftwareGl;
    stackMesh.receiveShadow = !isSoftwareGl;
    cardGroup.add(stackMesh);

    // Part 2: Gilded Edges on Stack (layered gold foil edge simulation)
    const edgeGeo = new THREE.BoxGeometry(1.802, 0.248, 1.052);
    const edgeMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.9,
      roughness: 0.2,
    });
    const edgeMesh = new THREE.Mesh(edgeGeo, edgeMat);
    edgeMesh.position.set(0, 0.125, 0);
    cardGroup.add(edgeMesh);

    // Part 3: Floating Top Hero Card
    const topCardGeo = new THREE.BoxGeometry(1.8, 0.012, 1.05);
    const topCardMat = new THREE.MeshStandardMaterial({
      map: cardTexture,
      roughness: 0.35,
      metalness: 0.1,
    });
    stateRef.current.materials['card'] = topCardMat;
    const topCardMesh = new THREE.Mesh(topCardGeo, topCardMat);
    topCardMesh.position.set(0.1, 0.45, 0.05);
    topCardMesh.rotation.set(-0.25, 0.2, 0.08);
    topCardMesh.castShadow = !isSoftwareGl;
    cardGroup.add(topCardMesh);

    // Part 4: Second Fanned Accent Card
    const fanCardMesh = new THREE.Mesh(topCardGeo, stackMat);
    fanCardMesh.position.set(-0.15, 0.32, -0.05);
    fanCardMesh.rotation.set(-0.12, -0.3, 0.02);
    fanCardMesh.castShadow = !isSoftwareGl;
    cardGroup.add(fanCardMesh);

    cardGroup.add(createContactShadow(1.4, 0.4));
    cardGroup.visible = false;
    scene.add(cardGroup);
    stateRef.current.models['card'] = cardGroup;

    // --- MODEL 3: Laser Stamp Device (6 parts) ---
    const stampGroup = new THREE.Group();
    stampGroup.position.set(0, 0, 0);

    // Part 1: Top Ergonomic Acrylic Handle
    const handleGeo = new THREE.SphereGeometry(0.24, 24, 16);
    handleGeo.scale(1, 1.3, 0.8);
    const handleMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.2,
      metalness: 0.1,
    });
    const handleMesh = new THREE.Mesh(handleGeo, handleMat);
    handleMesh.position.set(0, 1.25, 0);
    handleMesh.castShadow = !isSoftwareGl;
    stampGroup.add(handleMesh);

    // Part 2: Chrome Plunger Shaft
    const shaftGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.45, 20);
    const shaftMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      metalness: 0.95,
      roughness: 0.12,
    });
    const shaftMesh = new THREE.Mesh(shaftGeo, shaftMat);
    shaftMesh.position.set(0, 0.85, 0);
    shaftMesh.castShadow = !isSoftwareGl;
    stampGroup.add(shaftMesh);

    // Part 3: Main Trapezoid Stamp Casing
    const casingGeo = new THREE.BoxGeometry(0.95, 0.5, 0.65);
    const casingMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.4,
      metalness: 0.2,
    });
    const casingMesh = new THREE.Mesh(casingGeo, casingMat);
    casingMesh.position.set(0, 0.45, 0);
    casingMesh.castShadow = !isSoftwareGl;
    stampGroup.add(casingMesh);

    // Part 4: Clear Acrylic Base Framing
    const baseFrameGeo = new THREE.BoxGeometry(1.05, 0.2, 0.75);
    const clearMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.75,
      roughness: 0.1,
      metalness: 0.1,
    });
    const baseFrameMesh = new THREE.Mesh(baseFrameGeo, clearMat);
    baseFrameMesh.position.set(0, 0.1, 0);
    baseFrameMesh.castShadow = !isSoftwareGl;
    stampGroup.add(baseFrameMesh);

    // Part 5: Red Rubber Die Bottom Surface
    const rubberGeo = new THREE.PlaneGeometry(0.85, 0.55);
    const rubberMat = new THREE.MeshStandardMaterial({
      map: stampTexture,
      roughness: 0.85,
      metalness: 0.0,
      side: THREE.DoubleSide,
    });
    stateRef.current.materials['stamp'] = rubberMat;
    const rubberMesh = new THREE.Mesh(rubberGeo, rubberMat);
    rubberMesh.position.set(0, 0.02, 0);
    rubberMesh.rotation.x = -Math.PI / 2;
    stampGroup.add(rubberMesh);

    // Part 6: Index Label Window
    const indexGeo = new THREE.PlaneGeometry(0.65, 0.2);
    const indexMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
    });
    const indexMesh = new THREE.Mesh(indexGeo, indexMat);
    indexMesh.position.set(0, 0.45, 0.33);
    stampGroup.add(indexMesh);

    stampGroup.add(createContactShadow(1.1, 0.4));
    stampGroup.visible = false;
    scene.add(stampGroup);
    stateRef.current.models['stamp'] = stampGroup;

    // --- MODEL 4: Tri-Fold Brochure / Wedding Card (5 parts) ---
    const brochureGroup = new THREE.Group();
    brochureGroup.position.set(0, 0, 0);

    const paperMat = new THREE.MeshStandardMaterial({
      color: 0xfffaf0,
      roughness: 0.65,
      metalness: 0.05,
      side: THREE.DoubleSide,
    });
    stateRef.current.materials['brochure'] = paperMat;

    // Center Panel
    const centerGeo = new THREE.PlaneGeometry(0.85, 1.4);
    const centerPanel = new THREE.Mesh(centerGeo, paperMat);
    centerPanel.position.set(0, 0.7, 0);
    centerPanel.castShadow = !isSoftwareGl;
    brochureGroup.add(centerPanel);

    // Left Wing (hinged at -0.425)
    const leftWing = new THREE.Mesh(centerGeo, paperMat);
    leftWing.position.set(-0.42, 0.7, 0.12);
    leftWing.rotation.y = 0.55;
    leftWing.castShadow = !isSoftwareGl;
    brochureGroup.add(leftWing);

    // Right Wing (hinged at +0.425)
    const rightWing = new THREE.Mesh(centerGeo, paperMat);
    rightWing.position.set(0.42, 0.7, 0.12);
    rightWing.rotation.y = -0.55;
    rightWing.castShadow = !isSoftwareGl;
    brochureGroup.add(rightWing);

    // Wax / Gold Seal Medallion
    const sealGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.015, 24);
    const sealMat = new THREE.MeshStandardMaterial({
      color: 0x991b1b, // Royal carmine wax seal
      roughness: 0.35,
      metalness: 0.2,
    });
    const sealMesh = new THREE.Mesh(sealGeo, sealMat);
    sealMesh.rotation.x = Math.PI / 2;
    sealMesh.position.set(0, 0.7, 0.02);
    brochureGroup.add(sealMesh);

    brochureGroup.add(createContactShadow(1.3, 0.35));
    brochureGroup.visible = false;
    scene.add(brochureGroup);
    stateRef.current.models['brochure'] = brochureGroup;

    // 7. Render Loop with Software WebGL pacing (Directive 2.3)
    let frameId = 0;
    const clock = new THREE.Clock();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function tick() {
      const delta = clock.getDelta();

      // Model visibility switch & smooth rotation
      const curModelKey = stateRef.current.activeModel;
      Object.entries(stateRef.current.models).forEach(([key, group]) => {
        if (key === curModelKey) {
          group.visible = true;
          if (stateRef.current.autoRotate) {
            group.rotation.y += delta * 0.45;
          }
        } else {
          group.visible = false;
        }
      });

      // Update finish materials
      const finish = stateRef.current.activeFinish;
      const bMat = stateRef.current.materials['banner'] as THREE.MeshStandardMaterial;
      const cMat = stateRef.current.materials['card'] as THREE.MeshStandardMaterial;

      if (bMat && cMat) {
        if (finish === 'gloss') {
          bMat.roughness = 0.15;
          bMat.metalness = 0.1;
          cMat.roughness = 0.12;
        } else if (finish === 'foil') {
          bMat.roughness = 0.25;
          bMat.metalness = 0.65;
          cMat.roughness = 0.2;
          cMat.metalness = 0.75;
        } else if (finish === 'cotton') {
          bMat.roughness = 0.85;
          bMat.metalness = 0.0;
          cMat.roughness = 0.9;
          cMat.metalness = 0.0;
        } else {
          // matte default
          bMat.roughness = 0.5;
          bMat.metalness = 0.05;
          cMat.roughness = 0.4;
          cMat.metalness = 0.1;
        }
      }

      controls.update();
      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    // Pre-warm shader pipeline once
    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    tick();

    // Resize Observer
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className={`relative w-full overflow-hidden rounded-2xl border border-stone-200 bg-[#fcfbfa] shadow-sm transition-all duration-300 ${isFullScreen ? 'fixed inset-4 z-50 h-[calc(100vh-2rem)]' : 'h-[540px]'}`}>
      {/* 3D Canvas Mount Point */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Spec Bar (Directive 5: Minimal Spec Badge) */}
      <div className="absolute top-4 left-4 z-10 pointer-events-auto flex items-center gap-3">
        <div className="bg-white/95 px-3 py-1.5 rounded-lg border border-stone-200 text-xs font-medium text-stone-700 shadow-sm flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Interactive 3D Craft Studio</span>
          <span className="text-stone-300">|</span>
          <span className="text-stone-500 capitalize">{activeModel} View</span>
        </div>
      </div>

      {/* Top Right Quick Toggles */}
      <div className="absolute top-4 right-4 z-10 pointer-events-auto flex items-center gap-2">
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className={`p-2 rounded-lg border text-xs font-medium transition-colors shadow-sm ${autoRotate ? 'bg-stone-900 text-white border-stone-900' : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'}`}
          title="Toggle Auto Rotation"
        >
          <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
        </button>
        <button
          onClick={() => setIsFullScreen(!isFullScreen)}
          className="p-2 rounded-lg border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 shadow-sm transition-colors text-xs"
          title="Toggle Full Preview"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Directive 5.1 & 5.2: Unified Collapsible Bottom Dock (Zero Viewport Occlusion) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 pointer-events-auto w-[94%] max-w-[820px] transition-transform duration-300">
        {/* Toggle Collapse Pill */}
        <div className="flex justify-center -mb-2">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="bg-white/95 text-stone-600 hover:text-stone-900 text-[11px] font-medium px-3 py-1 rounded-t-md border-t border-x border-stone-200 shadow-sm flex items-center gap-1.5 cursor-pointer backdrop-blur-none"
          >
            {isCollapsed ? <Eye className="w-3 h-3 text-stone-500" /> : <EyeOff className="w-3 h-3 text-stone-500" />}
            <span>{isCollapsed ? 'Show Studio Controls' : 'Hide Controls (Zen Mode)'}</span>
          </button>
        </div>

        {/* Dock Container */}
        {!isCollapsed && (
          <div className="bg-white/95 rounded-xl border border-stone-200 p-3 shadow-lg flex flex-col md:flex-row items-center justify-between gap-3">
            {/* Model Selector Tabs */}
            <div className="flex items-center gap-1 bg-stone-100/90 p-1 rounded-lg w-full md:w-auto">
              <button
                onClick={() => setActiveModel('standee')}
                className={`flex-1 md:flex-initial px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${activeModel === 'standee' ? 'bg-white text-stone-900 shadow-sm font-semibold' : 'text-stone-600 hover:text-stone-900'}`}
              >
                Flex Standee
              </button>
              <button
                onClick={() => setActiveModel('card')}
                className={`flex-1 md:flex-initial px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${activeModel === 'card' ? 'bg-white text-stone-900 shadow-sm font-semibold' : 'text-stone-600 hover:text-stone-900'}`}
              >
                Luxury Card
              </button>
              <button
                onClick={() => setActiveModel('stamp')}
                className={`flex-1 md:flex-initial px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${activeModel === 'stamp' ? 'bg-white text-stone-900 shadow-sm font-semibold' : 'text-stone-600 hover:text-stone-900'}`}
              >
                Laser Stamp
              </button>
              <button
                onClick={() => setActiveModel('brochure')}
                className={`flex-1 md:flex-initial px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${activeModel === 'brochure' ? 'bg-white text-stone-900 shadow-sm font-semibold' : 'text-stone-600 hover:text-stone-900'}`}
              >
                Tri-fold
              </button>
            </div>

            {/* Finish Switcher Swatches */}
            <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
              <span className="text-[11px] font-medium text-stone-500 uppercase tracking-wider">Finish:</span>
              <div className="flex items-center gap-1.5">
                {[
                  { key: 'matte', label: 'Matte Vinyl' },
                  { key: 'gloss', label: 'High Gloss' },
                  { key: 'foil', label: 'Gold Foil' },
                  { key: 'cotton', label: 'Cotton Stock' },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setActiveFinish(item.key as FinishKey)}
                    className={`px-2.5 py-1 text-xs rounded-md border transition-all ${activeFinish === item.key ? 'bg-stone-900 text-white border-stone-900 font-medium' : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'}`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {onSelectService && (
                <button
                  onClick={() => {
                    const map: Record<ModelKey, string> = {
                      standee: 'flex-banner',
                      card: 'business-cards',
                      stamp: 'stamp-printing',
                      brochure: 'wedding-invitations',
                    };
                    onSelectService(map[activeModel]);
                  }}
                  className="hidden lg:inline-flex px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-md transition-colors whitespace-nowrap ml-2 cursor-pointer"
                >
                  Order This Material
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
