import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// ==========================================
// 全局配置与状态
// ==========================================
const CONFIG = {
  particleCount: 8000,
  particleSize: 0.15,
  defaultColor: "#ff0055",
  lerpSpeed: 0.08,
  spreadFactor: 0, // 手势控制的扩散因子
  scaleFactor: 1, // 手势控制的缩放因子
};

const STATE = {
  currentModel: "heart",
  targetPositions: [], // 目标位置数组
  handsDetected: false,
    handDistance: 0,
    handCenter: new THREE.Vector3(0, 0, 0),
    targetRotation: { x: 0, y: 0 }, // 目标旋转角度
};// ==========================================
// Three.js 初始化
// ==========================================
const container = document.getElementById("canvas-container");
const scene = new THREE.Scene();
// 添加一点雾效增加深度感
scene.fog = new THREE.FogExp2(0x050505, 0.02);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 30;

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// ==========================================
// 粒子系统核心
// ==========================================
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(CONFIG.particleCount * 3);
const initialPositions = new Float32Array(CONFIG.particleCount * 3);

// 初始化粒子位置（随机分布）
for (let i = 0; i < CONFIG.particleCount; i++) {
  const x = (Math.random() - 0.5) * 50;
  const y = (Math.random() - 0.5) * 50;
  const z = (Math.random() - 0.5) * 50;

  positions[i * 3] = x;
  positions[i * 3 + 1] = y;
  positions[i * 3 + 2] = z;

  initialPositions[i * 3] = x;
  initialPositions[i * 3 + 1] = y;
  initialPositions[i * 3 + 2] = z;
}

geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

const material = new THREE.PointsMaterial({
  color: CONFIG.defaultColor,
  size: CONFIG.particleSize,
  sizeAttenuation: true,
  transparent: true,
  opacity: 0.8,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
});

const particleSystem = new THREE.Points(geometry, material);
scene.add(particleSystem);

// ==========================================
// 形状生成算法
// ==========================================

// 1. 爱心形状
function getHeartPoints(count) {
  const points = [];
  for (let i = 0; i < count; i++) {
    // 使用参数方程生成爱心
    // x = 16sin^3(t)
    // y = 13cos(t) - 5cos(2t) - 2cos(3t) - cos(4t)
    // 增加一些随机性填充内部

    const t = Math.random() * Math.PI * 2;
    const r = Math.sqrt(Math.random()); // 均匀分布在圆内

    // 基础形状
    let x = 16 * Math.pow(Math.sin(t), 3);
    let y =
      13 * Math.cos(t) -
      5 * Math.cos(2 * t) -
      2 * Math.cos(3 * t) -
      Math.cos(4 * t);
    let z = (Math.random() - 0.5) * 5; // 给一点厚度

    // 缩放
    const scale = 0.5;
    x *= scale;
    y *= scale;

    // 填充内部 (简单的向心收缩)
    const fill = Math.random();
    if (fill > 0.2) {
      x *= r;
      y *= r;
      z *= r;
    }

    points.push(x, y, z);
  }
  return points;
}

// 2. 花朵形状
function getFlowerPoints(count) {
  const points = [];
  for (let i = 0; i < count; i++) {
    // 极坐标玫瑰线 r = cos(k * theta)
    const k = 4; // 4瓣花
    const theta = Math.random() * Math.PI * 2;
    const maxR = Math.cos(k * theta) + 2; // +2 保证花瓣饱满
    const r = Math.random() * maxR * 3;

    let x = r * Math.cos(theta);
    let y = r * Math.sin(theta);
    let z = (Math.random() - 0.5) * (r * 0.5); // 越靠外越厚

    // 螺旋上升效果，像一朵立体的花
    z += Math.sin(r) * 2;

    points.push(x, y, z);
  }
  return points;
}

// 3. 文字形状 (使用 Canvas)
function getTextPoints(text, count) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = 200;
  canvas.height = 100;

  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 60px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  const validPixels = [];
  for (let i = 0; i < canvas.height; i += 2) {
    // 步长2，减少计算量
    for (let j = 0; j < canvas.width; j += 2) {
      const index = (i * canvas.width + j) * 4;
      if (data[index] > 128) {
        // 亮度大于128的像素
        validPixels.push({
          x: (j - canvas.width / 2) * 0.2, // 缩放并居中
          y: (canvas.height / 2 - i) * 0.2, // 翻转Y轴
        });
      }
    }
  }

  const points = [];
  if (validPixels.length === 0) return getHeartPoints(count); // fallback

  for (let i = 0; i < count; i++) {
    const pixel = validPixels[Math.floor(Math.random() * validPixels.length)];
    points.push(
      pixel.x + (Math.random() - 0.5) * 0.5,
      pixel.y + (Math.random() - 0.5) * 0.5,
      (Math.random() - 0.5) * 2 // 厚度
    );
  }
  return points;
}

// 切换模型函数
function switchModel(modelName, customText = "") {
  STATE.currentModel = modelName;
  let newPoints = [];

  if (modelName === "heart") {
    newPoints = getHeartPoints(CONFIG.particleCount);
  } else if (modelName === "flower") {
    newPoints = getFlowerPoints(CONFIG.particleCount);
  } else if (modelName === "text") {
    newPoints = getTextPoints(customText || "Hi", CONFIG.particleCount);
  }

  STATE.targetPositions = newPoints;
}

// 初始化默认模型
switchModel("heart");

// ==========================================
// MediaPipe Hands 集成
// ==========================================
const videoElement = document.getElementById("input-video");
const canvasElement = document.getElementById("output-canvas");
const canvasCtx = canvasElement.getContext("2d");
const statusText = document.getElementById("status-text");
const statusDot = document.querySelector(".status-indicator .dot");

function onResults(results) {
  // 绘制预览图
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(
    results.image,
    0,
    0,
    canvasElement.width,
    canvasElement.height
  );

  if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
    STATE.handsDetected = true;
    statusText.innerText = "手势已识别";
    statusDot.classList.add("active");

    // 绘制骨架
    for (const landmarks of results.multiHandLandmarks) {
      drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {
        color: "#00FF00",
        lineWidth: 2,
      });
      drawLandmarks(canvasCtx, landmarks, { color: "#FF0000", lineWidth: 1 });
    }

    // 交互逻辑
    if (results.multiHandLandmarks.length === 2) {
      // 双手控制
      const hand1 = results.multiHandLandmarks[0][9]; // 中指根部
      const hand2 = results.multiHandLandmarks[1][9];

      // 计算距离 (简单欧氏距离)
      const dx = hand1.x - hand2.x;
      const dy = hand1.y - hand2.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // 映射距离到缩放/扩散
      // 正常距离大概在 0.2 - 0.8 之间
      STATE.handDistance = distance;

      // 计算双手中心点 (0~1)
      const centerX = (hand1.x + hand2.x) / 2;
      const centerY = (hand1.y + hand2.y) / 2;
      
      // 映射中心点到旋转角度
      // X轴移动控制Y轴旋转 (左右转)
      // Y轴移动控制X轴旋转 (上下转)
      // 范围: -PI ~ PI
      STATE.targetRotation.y = (centerX - 0.5) * Math.PI * 3; // 增加灵敏度
      STATE.targetRotation.x = (centerY - 0.5) * Math.PI;

      // 扩散因子：距离越大，扩散越大
      // 0.2 -> 0, 0.6 -> 10
      CONFIG.spreadFactor = THREE.MathUtils.mapLinear(
        distance,
        0.1,
        0.6,
        0,
        15
      );
      CONFIG.spreadFactor = Math.max(0, CONFIG.spreadFactor); // 不小于0

      // 缩放因子
      CONFIG.scaleFactor = THREE.MathUtils.mapLinear(
        distance,
        0.1,
        0.6,
        0.5,
        2.0
      );
    } else {
      // 单手控制 (可选：控制旋转或位置)
      // 这里简单处理：单手时慢慢恢复默认
      CONFIG.spreadFactor = THREE.MathUtils.lerp(CONFIG.spreadFactor, 0, 0.05);
      CONFIG.scaleFactor = THREE.MathUtils.lerp(CONFIG.scaleFactor, 1, 0.05);
    }
  } else {
    STATE.handsDetected = false;
    statusText.innerText = "未检测到手势";
    statusDot.classList.remove("active");

    // 无手势时恢复默认
    CONFIG.spreadFactor = THREE.MathUtils.lerp(CONFIG.spreadFactor, 0, 0.05);
    CONFIG.scaleFactor = THREE.MathUtils.lerp(CONFIG.scaleFactor, 1, 0.05);
  }
  canvasCtx.restore();
}

const hands = new Hands({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
  },
});

hands.setOptions({
  maxNumHands: 2,
  modelComplexity: 1,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
});

hands.onResults(onResults);

// 启动摄像头
const cameraUtils = new Camera(videoElement, {
  onFrame: async () => {
    await hands.send({ image: videoElement });
  },
  width: 320, // 降低分辨率提高性能
  height: 240,
});
cameraUtils.start();

// ==========================================
// 动画循环
// ==========================================
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const time = clock.getElapsedTime();
  const positionsAttribute = geometry.attributes.position;
  const currentPositions = positionsAttribute.array;

    // 旋转控制
    if (!STATE.handsDetected) {
        // 无手势：自动旋转
        particleSystem.rotation.y += 0.002;
        // 慢慢恢复 X 轴旋转到 0
        particleSystem.rotation.x = THREE.MathUtils.lerp(particleSystem.rotation.x, 0, 0.05);
    } else {
        // 有手势：跟随手势旋转
        // 使用 lerp 平滑过渡
        // 注意：MediaPipe 的坐标系 X 轴是反的（镜像），所以可能需要调整方向
        // 这里假设镜像已经处理，或者用户习惯镜像操作
        particleSystem.rotation.y = THREE.MathUtils.lerp(particleSystem.rotation.y, -STATE.targetRotation.y, 0.1); // 取反以符合直觉
        particleSystem.rotation.x = THREE.MathUtils.lerp(particleSystem.rotation.x, STATE.targetRotation.x, 0.1);
    }

  // 更新粒子位置
  for (let i = 0; i < CONFIG.particleCount; i++) {
    const idx = i * 3;

    // 目标位置
    let tx = STATE.targetPositions[idx] || 0;
    let ty = STATE.targetPositions[idx + 1] || 0;
    let tz = STATE.targetPositions[idx + 2] || 0;

    // 1. 应用缩放 (基于手势)
    tx *= CONFIG.scaleFactor;
    ty *= CONFIG.scaleFactor;
    tz *= CONFIG.scaleFactor;

    // 2. 应用扩散 (基于手势)
    // 简单的径向扩散：沿着从原点向外的方向移动
    const dist = Math.sqrt(tx * tx + ty * ty + tz * tz) + 0.001;
    const dirX = tx / dist;
    const dirY = ty / dist;
    const dirZ = tz / dist;

    tx += dirX * CONFIG.spreadFactor;
    ty += dirY * CONFIG.spreadFactor;
    tz += dirZ * CONFIG.spreadFactor;

    // 3. 添加一些自然的波动 (呼吸效果)
    const noise = Math.sin(time * 2 + i * 0.1) * 0.2;
    tx += noise;
    ty += noise;
    tz += noise;

    // 插值更新当前位置
    currentPositions[idx] += (tx - currentPositions[idx]) * CONFIG.lerpSpeed;
    currentPositions[idx + 1] +=
      (ty - currentPositions[idx + 1]) * CONFIG.lerpSpeed;
    currentPositions[idx + 2] +=
      (tz - currentPositions[idx + 2]) * CONFIG.lerpSpeed;
  }

  positionsAttribute.needsUpdate = true;
  controls.update();
  renderer.render(scene, camera);
}

animate();

// ==========================================
// UI 事件监听
// ==========================================
// 窗口大小调整
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// 模型切换按钮
document.querySelectorAll(".model-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    // 更新按钮状态
    document
      .querySelectorAll(".model-btn")
      .forEach((b) => b.classList.remove("active"));
    e.target.classList.add("active");

    const model = e.target.dataset.model;
    const textInputGroup = document.getElementById("text-input-group");

    if (model === "text") {
      textInputGroup.style.display = "block";
      const text = document.getElementById("custom-text").value;
      switchModel("text", text);
    } else {
      textInputGroup.style.display = "none";
      switchModel(model);
    }
  });
});

// 文字更新按钮
document.getElementById("update-text-btn").addEventListener("click", () => {
  const text = document.getElementById("custom-text").value;
  if (text) switchModel("text", text);
});

// 颜色选择器
document.getElementById("color-picker").addEventListener("input", (e) => {
  const color = e.target.value;
  document.getElementById("color-value").innerText = color;
  material.color.set(color);
});

// 全屏按钮
document.getElementById("fullscreen-btn").addEventListener("click", () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
});
