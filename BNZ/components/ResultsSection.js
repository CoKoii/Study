/**
 * 诊断结果组件
 * 展示AI诊断结果和图像分析
 */
class ResultsSection {
  constructor() {
    this.container = document.getElementById("results-section");
    this.diagnosisResult = null;
    this.render();
    this.setupEventListeners();
  }

  render() {
    this.container.innerHTML = `
            <div class="section-transition">
                <div class="text-center mb-6">
                    <div class="inline-block mb-4 p-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 class="text-2xl font-bold text-accent-blue">AI白癜风辅助诊断结果</h2>
                    <p class="text-gray-400">分析完成时间: <span id="diagnosis-time">--</span></p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <!-- 原始图像 -->
                    <div class="bg-dark-100 rounded-lg p-4">
                        <h3 class="font-medium mb-3">原始皮肤图像</h3>
                        <div class="rounded-lg overflow-hidden bg-dark-300">
                            <img id="original-image" class="w-full h-auto" src="#" alt="原始皮肤图像">
                        </div>
                    </div>

                    <!-- 处理后图像 -->
                    <div class="bg-dark-100 rounded-lg p-4">
                        <h3 class="font-medium mb-3">AI处理图像<span class="text-xs text-accent-blue ml-2">(标注疑似白癜风区域)</span></h3>
                        <div id="processed-image-container" class="rounded-lg overflow-hidden bg-dark-300 relative">
                            <img id="processed-image" class="w-full h-auto" src="#" alt="AI处理图像">
                            <!-- 标注点将在JS中动态添加 -->
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <!-- 诊断结论 -->
                    <div class="bg-dark-100 rounded-lg p-5 flex flex-col">
                        <h3 class="font-medium mb-4">诊断结论</h3>
                        <div class="flex-1 flex items-center">
                            <div>
                                <p id="diagnosis-conclusion" class="text-xl font-bold text-white mb-2">--</p>
                                <p class="text-gray-400">AI置信度 <span id="confidence-value" class="text-accent-blue font-bold">--</span></p>
                            </div>
                        </div>
                    </div>

                    <!-- 风险等级 -->
                    <div class="bg-dark-100 rounded-lg p-5 flex flex-col">
                        <h3 class="font-medium mb-4">风险等级</h3>
                        <div class="flex-1 flex items-center">
                            <div>
                                <div class="flex items-center mb-2">
                                    <span id="risk-level-badge" class="inline-block w-3 h-3 rounded-full mr-2"></span>
                                    <p id="risk-level" class="text-xl font-bold">--</p>
                                </div>
                                <p id="risk-recommendation" class="text-gray-400">--</p>
                            </div>
                        </div>
                    </div>

                    <!-- AI模型信息 -->
                    <div class="bg-dark-100 rounded-lg p-5 flex flex-col">
                        <h3 class="font-medium mb-4">AI模型信息</h3>
                        <div class="flex-1">
                            <div class="mb-3">
                                <p class="text-sm text-gray-400">模型版本</p>
                                <p class="font-medium">WhiteVitiligo-v2.5.3</p>
                            </div>
                            <div>
                                <p class="text-sm text-gray-400">数据集</p>
                                <p class="font-medium">GlobalSkinDB-2024</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-dark-100 rounded-lg p-5 mb-8">
                    <h3 class="font-medium mb-4">诊断详情</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <h4 class="text-sm text-gray-400 mb-1">皮肤色素脱失特征</h4>
                            <div class="h-2 bg-dark-300 rounded-full overflow-hidden">
                                <div id="opacity-indicator" class="h-full bg-gradient-to-r from-green-500 to-red-500" style="width: 65%"></div>
                            </div>
                            <div class="flex justify-between text-xs mt-1">
                                <span>正常</span>
                                <span>严重</span>
                            </div>
                        </div>
                        <div>
                            <h4 class="text-sm text-gray-400 mb-1">皮肤影响评估</h4>
                            <div class="h-2 bg-dark-300 rounded-full overflow-hidden">
                                <div id="vision-indicator" class="h-full bg-gradient-to-r from-green-500 to-red-500" style="width: 45%"></div>
                            </div>
                            <div class="flex justify-between text-xs mt-1">
                                <span>轻微</span>
                                <span>显著</span>
                            </div>
                        </div>
                    </div>
                    <div id="ai-comments" class="text-gray-300 text-sm border-l-2 border-accent-blue pl-4 py-2 mt-4">
                        AI分析显示图像中有潜在的白癜风特征，主要表现为皮肤色素脱失。建议进行专业皮肤科检查以确认诊断。
                    </div>
                </div>

                <div class="bg-dark-200 border border-gray-700 rounded-lg p-4 text-sm text-gray-400 mb-8">
                    <p class="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 flex-shrink-0 text-accent-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>本结果为辅助诊断，不构成医疗建议，最终诊断请以医生判断为准</span>
                    </p>
                </div>

                <div class="flex flex-wrap gap-4 justify-center">
                    <button id="download-image-btn" class="bg-dark-100 hover:bg-dark-200 text-white py-3 px-6 rounded-lg flex items-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-300 focus:ring-blue-500">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        下载 AI 标注结果图
                    </button>
                    <button id="download-report-btn" class="gradient-bg text-white py-3 px-6 rounded-lg flex items-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-300 focus:ring-blue-500">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        导出诊断报告
                    </button>
                    <button id="new-diagnosis-btn" class="bg-dark-100 hover:bg-dark-200 text-white py-3 px-6 rounded-lg flex items-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-300 focus:ring-blue-500">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        进行新的诊断
                    </button>
                </div>
            </div>
        `;
  }

  setupEventListeners() {
    document.addEventListener("showResults", (e) => {
      this.diagnosisResult = e.detail.diagnosisResult;
      this.updateResultsView();
    });

    // 下载图像按钮
    const downloadImageBtn = document.getElementById("download-image-btn");
    if (downloadImageBtn) {
      downloadImageBtn.addEventListener("click", () => {
        this.downloadProcessedImage();
      });
    }

    // 下载报告按钮
    const downloadReportBtn = document.getElementById("download-report-btn");
    if (downloadReportBtn) {
      downloadReportBtn.addEventListener("click", () => {
        this.downloadReport();
      });
    }

    // 新诊断按钮
    const newDiagnosisBtn = document.getElementById("new-diagnosis-btn");
    if (newDiagnosisBtn) {
      newDiagnosisBtn.addEventListener("click", () => {
        // 重置界面到上传状态
        document.getElementById("results-section").classList.add("hidden");
        document.getElementById("processing-section").classList.add("hidden");

        const uploadSection = document.getElementById("upload-section");
        window.uploadSection.resetUpload();
        uploadSection.scrollIntoView({ behavior: "smooth" });
      });
    }
  }

  updateResultsView() {
    // 显示动画
    this.container
      .querySelector(".section-transition")
      .classList.add("section-visible");

    // 获取上传的图像
    const uploadedImage = document.getElementById("preview-image").src;

    // 更新原始图像
    document.getElementById("original-image").src = uploadedImage;

    // 更新处理后图像 (在实际应用中，这应该是来自后端的处理后图像)
    // 这里我们使用相同图像但添加标注
    document.getElementById("processed-image").src = uploadedImage;

    // 添加图像标注
    this.addImageAnnotations();

    // 更新诊断时间
    const options = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    };
    const diagnosisTime = new Date().toLocaleDateString("zh-CN", options);
    document.getElementById("diagnosis-time").textContent = diagnosisTime;

    // 更新结论
    document.getElementById("diagnosis-conclusion").textContent = `疑似白癜风`;
    document.getElementById(
      "confidence-value"
    ).textContent = `${this.diagnosisResult.confidence}%`;

    // 更新风险等级
    const riskLevel = document.getElementById("risk-level");
    const riskBadge = document.getElementById("risk-level-badge");
    const riskRecommendation = document.getElementById("risk-recommendation");

    riskLevel.textContent = `${this.diagnosisResult.riskLevel}`;

    // 根据风险等级设置颜色和建议
    switch (this.diagnosisResult.riskLevel) {
      case "重度":
        riskBadge.classList.add("bg-red-500");
        riskRecommendation.textContent = "建议立即就医进行专业检查和治疗";
        break;
      case "中度":
        riskBadge.classList.add("bg-yellow-500");
        riskRecommendation.textContent = "建议尽快前往医院进行专业检查";
        break;
      case "轻度":
        riskBadge.classList.add("bg-green-500");
        riskRecommendation.textContent = "建议定期复查，留意症状变化";
        break;
      default:
        riskBadge.classList.add("bg-blue-500");
        riskRecommendation.textContent = "建议进行专业眼科检查以确认诊断";
    }

    // 更新评估指标
    const opacityValue = 40 + Math.random() * 30; // 40-70%
    const visionValue = 30 + Math.random() * 30; // 30-60%

    document.getElementById(
      "opacity-indicator"
    ).style.width = `${opacityValue}%`;
    document.getElementById("vision-indicator").style.width = `${visionValue}%`;

    // 更新AI评论
    const comments = [
      "AI分析显示图像中有潜在的白癜风特征，主要表现为皮肤色素脱失。建议进行专业皮肤科检查以确认诊断。",
      "检测到皮肤区域存在特征性白斑，符合白癜风典型特征。建议前往专业医院进行进一步检查。",
      "图像分析显示皮肤色素分布不均，可能处于白癜风发展初期阶段，建议密切关注皮肤变化并咨询专业医生。",
    ];

    document.getElementById("ai-comments").textContent =
      comments[Math.floor(Math.random() * comments.length)];
  }

  addImageAnnotations() {
    // 在处理后的图像上添加标注点
    const container = document.getElementById("processed-image-container");
    const img = document.getElementById("processed-image");

    // 确保图像加载完毕再添加标注
    img.onload = () => {
      // 清除现有标注
      const existingMarkers = container.querySelectorAll(".marker");
      existingMarkers.forEach((marker) => marker.remove());

      // 添加新标注
      if (this.diagnosisResult && this.diagnosisResult.imageAreaMap) {
        this.diagnosisResult.imageAreaMap.forEach((area) => {
          const marker = document.createElement("div");
          marker.className = "marker absolute rounded-full highlight-area";

          // 设置位置和尺寸 (相对于图像的百分比位置)
          marker.style.left = `${area.x}%`;
          marker.style.top = `${area.y}%`;
          marker.style.width = `${area.radius}%`;
          marker.style.height = `${area.radius}%`;
          marker.style.transform = "translate(-50%, -50%)";

          // 根据严重程度设置颜色
          switch (area.severity) {
            case "high":
              marker.style.backgroundColor = "rgba(239, 68, 68, 0.5)"; // red
              marker.style.border = "2px solid rgba(239, 68, 68, 0.8)";
              break;
            case "medium":
              marker.style.backgroundColor = "rgba(245, 158, 11, 0.5)"; // amber
              marker.style.border = "2px solid rgba(245, 158, 11, 0.8)";
              break;
            case "low":
              marker.style.backgroundColor = "rgba(59, 130, 246, 0.5)"; // blue
              marker.style.border = "2px solid rgba(59, 130, 246, 0.8)";
              break;
          }

          container.appendChild(marker);
        });
      }
    };
  }

  downloadProcessedImage() {
    // 在实际应用中，这里应该下载实际处理过的图像
    // 模拟下载行为
    alert("图像下载功能已模拟，实际应用中将下载标注后的图像");
  }

  downloadReport() {
    // 模拟报告下载
    alert("报告下载功能已模拟，实际应用中将生成并下载PDF诊断报告");
  }
}

// 初始化结果组件
document.addEventListener("DOMContentLoaded", () => {
  window.resultsSection = new ResultsSection();
});
