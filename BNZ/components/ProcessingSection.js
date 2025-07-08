/**
 * 模型推理组件
 * 显示 AI 模型处理进度和状态
 */
class ProcessingSection {
  constructor() {
    this.container = document.getElementById("processing-section");
    this.processingTime = 3000; // 模拟处理时间（毫秒）
    this.processingSteps = [
      "正在评估皮肤区域的色素脱失与对比度特征...",
      "分析皮肤表面纹理特征...",
      "识别皮肤图像中的色素分布结构...",
      "综合评估白癜风风险因素...",
    ];
    this.currentStep = 0;
    this.progressInterval = null;
    this.render();
    this.setupEventListeners();
  }

  render() {
    this.container.innerHTML = `
            <div class="section-transition">
                <div class="flex flex-col items-center">
                    <div class="mb-6 relative">
                        <svg class="w-24 h-24" viewBox="0 0 120 120">
                            <circle cx="60" cy="60" r="54" fill="none" stroke="#0F172A" stroke-width="8" />
                            <circle id="progress-circle" class="diagnostic-circle" cx="60" cy="60" r="54" fill="none" stroke="#3B82F6" stroke-width="8" stroke-linecap="round" />
                        </svg>
                        <div class="absolute inset-0 flex items-center justify-center">
                            <span id="progress-percent" class="text-xl font-bold text-accent-blue">0%</span>
                        </div>
                    </div>
                    
                    <h2 class="text-xl font-medium mb-2">AI 模型分析中</h2>
                    <p id="processing-status" class="text-gray-300 mb-6 text-center">正在调用 AI 模型对图像进行特征提取与病灶分析，请稍候...</p>
                    
                    <div class="w-full max-w-2xl bg-dark-100 rounded-lg p-4">
                        <div class="mb-4">
                            <h3 class="text-sm font-medium text-gray-400 mb-2">处理进度</h3>
                            <div class="h-2 bg-dark-300 rounded-full overflow-hidden">
                                <div id="progress-bar" class="h-full bg-gradient-to-r from-blue-500 to-cyan-400" style="width: 0%"></div>
                            </div>
                        </div>
                        
                        <div>
                            <h3 class="text-sm font-medium text-gray-400 mb-2">实时状态</h3>
                            <div id="processing-steps" class="text-sm text-gray-300 space-y-2">
                                <p class="flex items-center">
                                    <span class="inline-block w-4 h-4 bg-blue-500 rounded-full mr-2 pulse-animation"></span>
                                    正在初始化 AI 模型...
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div id="processing-error" class="hidden mt-6 w-full max-w-2xl bg-red-900 bg-opacity-20 border border-red-700 rounded-lg p-4 text-center">
                        <p class="text-red-400 mb-2">诊断过程中发生错误，请重新上传图像或联系技术支持</p>
                        <button id="retry-button" class="text-white bg-red-700 hover:bg-red-800 py-2 px-4 rounded-lg transition-colors">
                            重新尝试
                        </button>
                    </div>
                    
                    <div id="processing-timeout" class="hidden mt-6 w-full max-w-2xl bg-yellow-900 bg-opacity-20 border border-yellow-700 rounded-lg p-4 text-center">
                        <p class="text-yellow-400 mb-2">模型响应延迟，请耐心等待或稍后重试</p>
                        <div class="flex justify-center space-x-3">
                            <button id="continue-waiting" class="text-white bg-yellow-700 hover:bg-yellow-800 py-2 px-4 rounded-lg transition-colors">
                                继续等待
                            </button>
                            <button id="cancel-process" class="text-white bg-dark-100 hover:bg-dark-200 py-2 px-4 rounded-lg transition-colors">
                                取消
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
  }

  setupEventListeners() {
    document.addEventListener("startProcessing", () => {
      this.startProcessing();
    });

    // 重试按钮
    const retryButton = document.getElementById("retry-button");
    if (retryButton) {
      retryButton.addEventListener("click", () => {
        document.getElementById("processing-error").classList.add("hidden");
        this.reset();
        this.startProcessing();
      });
    }

    // 超时处理
    const continueWaitingButton = document.getElementById("continue-waiting");
    if (continueWaitingButton) {
      continueWaitingButton.addEventListener("click", () => {
        document.getElementById("processing-timeout").classList.add("hidden");
        this.extendProcessingTime();
      });
    }

    const cancelProcessButton = document.getElementById("cancel-process");
    if (cancelProcessButton) {
      cancelProcessButton.addEventListener("click", () => {
        this.reset();
        document.getElementById("processing-section").classList.add("hidden");
        document
          .getElementById("upload-section")
          .scrollIntoView({ behavior: "smooth" });
      });
    }
  }

  startProcessing() {
    // 显示动画
    this.container
      .querySelector(".section-transition")
      .classList.add("section-visible");

    // 随机决定是否模拟错误或超时（10%概率）
    const simulationOutcome = Math.random();

    if (simulationOutcome > 0.95) {
      // 模拟错误
      setTimeout(() => {
        this.showError();
      }, 1500);
      return;
    } else if (simulationOutcome > 0.9) {
      // 模拟超时
      setTimeout(() => {
        this.showTimeout();
      }, 2000);
      return;
    }

    // 正常处理流程
    let progress = 0;
    const progressBar = document.getElementById("progress-bar");
    const progressPercent = document.getElementById("progress-percent");
    const progressCircle = document.getElementById("progress-circle");
    const processingSteps = document.getElementById("processing-steps");

    // 设置圆形进度条初始状态
    progressCircle.style.strokeDasharray = "339.292";
    progressCircle.style.strokeDashoffset = "339.292";

    this.progressInterval = setInterval(() => {
      progress += 1;

      // 更新进度条
      progressBar.style.width = `${progress}%`;
      progressPercent.textContent = `${progress}%`;

      // 更新圆形进度条
      const offset = 339.292 - (339.292 * progress) / 100;
      progressCircle.style.strokeDashoffset = offset;

      // 添加处理步骤
      if (
        progress === 20 ||
        progress === 45 ||
        progress === 70 ||
        progress === 90
      ) {
        const stepIndex = Math.floor(progress / 25);
        const stepText = this.processingSteps[stepIndex];

        processingSteps.innerHTML += `
                    <p class="flex items-center animate-pulse">
                        <span class="inline-block w-4 h-4 bg-blue-500 rounded-full mr-2"></span>
                        ${stepText}
                    </p>
                `;
      }

      if (progress >= 100) {
        clearInterval(this.progressInterval);
        this.processingComplete();
      }
    }, this.processingTime / 100);
  }

  processingComplete() {
    setTimeout(() => {
      // 显示结果部分
      const resultsSection = document.getElementById("results-section");
      resultsSection.classList.remove("hidden");

      // 触发结果显示事件
      const event = new CustomEvent("showResults", {
        detail: {
          diagnosisResult: this.generateDiagnosisResult(),
        },
      });
      document.dispatchEvent(event);

      // 滚动到结果部分
      resultsSection.scrollIntoView({ behavior: "smooth" });
    }, 500);
  }

  generateDiagnosisResult() {
    // 生成模拟诊断结果
    const confidence = (75 + Math.random() * 20).toFixed(1); // 75-95% 置信度
    const riskLevel =
      confidence > 85 ? "中度" : confidence > 80 ? "轻度" : "疑似";

    return {
      confidence,
      riskLevel,
      timestamp: new Date().toISOString(),
      imageAreaMap: [
        { x: 45, y: 35, radius: 15, severity: "high" }, // 模拟高风险区域
        { x: 65, y: 55, radius: 10, severity: "medium" }, // 模拟中风险区域
      ],
    };
  }

  showError() {
    document.getElementById("processing-error").classList.remove("hidden");
    clearInterval(this.progressInterval);
  }

  showTimeout() {
    document.getElementById("processing-timeout").classList.remove("hidden");
    clearInterval(this.progressInterval);
  }

  extendProcessingTime() {
    // 延长处理时间并继续
    const processingStatus = document.getElementById("processing-status");
    processingStatus.textContent = "正在尝试重新连接 AI 模型服务...";

    setTimeout(() => {
      processingStatus.textContent = "连接恢复，继续处理中...";
      this.startProcessing();
    }, 1500);
  }

  reset() {
    clearInterval(this.progressInterval);
    document.getElementById("progress-bar").style.width = "0%";
    document.getElementById("progress-percent").textContent = "0%";
    document.getElementById("processing-steps").innerHTML = `
            <p class="flex items-center">
                <span class="inline-block w-4 h-4 bg-blue-500 rounded-full mr-2 pulse-animation"></span>
                正在初始化 AI 模型...
            </p>
        `;
    document.getElementById("processing-error").classList.add("hidden");
    document.getElementById("processing-timeout").classList.add("hidden");
  }
}

// 初始化处理组件
document.addEventListener("DOMContentLoaded", () => {
  window.processingSection = new ProcessingSection();
});
