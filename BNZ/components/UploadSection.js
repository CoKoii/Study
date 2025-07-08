/**
 * 图像上传组件
 * 负责处理图像上传、验证和预览功能
 */
class UploadSection {
  constructor() {
    this.container = document.getElementById("upload-section");
    this.maxFileSize = 5 * 1024 * 1024; // 5MB
    this.acceptedFormats = ["image/jpeg", "image/png"];
    this.minResolution = 1024; // 最小分辨率 1024x1024
    this.file = null;
    this.render();
    this.initEventListeners();
  }

  render() {
    this.container.innerHTML = `
            <div class="flex flex-col items-center">
                <div class="text-accent-blue mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                </div>
                <h2 class="text-xl font-medium mb-2">图像上传</h2>
                <p id="upload-status" class="text-gray-400 mb-6 text-center">请上传高清晰度的皮肤图像，我们将通过 AI 模型辅助诊断白癜风</p>
                
                <div id="upload-zone" class="upload-zone w-full max-w-2xl h-64 border-2 border-dashed border-gray-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-accent-blue transition-colors mb-6">
                    <div class="text-center p-6">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p class="mb-2">拖拽图像到此或点击上传</p>
                        <p class="text-sm text-gray-500">支持 JPG/PNG，建议 ≥1024x1024</p>
                    </div>
                </div>
                
                <input type="file" id="file-input" class="hidden" accept="image/jpeg, image/png">
                
                <div id="preview-container" class="hidden w-full max-w-2xl preview-fade-in">
                    <div class="bg-dark-100 rounded-lg p-4 mb-4 shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <div class="flex items-center justify-between mb-3">
                            <h3 class="font-medium text-accent-blue">预览图像</h3>
                            <div class="flex space-x-2">
                                <button id="zoom-image" class="text-gray-400 hover:text-accent-blue focus:outline-none transition-colors duration-200" title="缩放预览">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                    </svg>
                                </button>
                                <button id="remove-image" class="text-gray-400 hover:text-red-400 focus:outline-none transition-colors duration-200" title="移除图像">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div id="preview-wrapper" class="relative rounded-lg overflow-hidden bg-dark-300 shadow-inner">
                            <div class="preview-image-container overflow-hidden" style="max-height: 400px;">
                                <img id="preview-image" class="w-full h-auto preview-image-zoom transition-all duration-300" src="#" alt="预览图像">
                            </div>
                            <div id="image-quality-indicator" class="absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium bg-opacity-80 shadow-md"></div>
                            <div id="image-info" class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent text-xs text-white p-3 backdrop-blur-sm">
                                <div class="flex justify-between items-center">
                                    <div class="truncate" style="max-width: 70%;">
                                        <span class="font-medium">文件名:</span> <span id="file-name" class="opacity-90"></span>
                                    </div>
                                    <div>
                                        <span class="font-medium">尺寸:</span> <span id="image-dimensions" class="opacity-90"></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <button id="start-diagnosis" class="w-full gradient-bg text-white py-3 px-6 rounded-lg font-medium transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed">
                        开始诊断
                    </button>
                </div>
            </div>
        `;
  }

  initEventListeners() {
    const uploadZone = document.getElementById("upload-zone");
    const fileInput = document.getElementById("file-input");
    const removeButton = document.getElementById("remove-image");
    const zoomButton = document.getElementById("zoom-image");
    const startButton = document.getElementById("start-diagnosis");
    const uploadStatus = document.getElementById("upload-status");
    const previewWrapper = document.getElementById("preview-wrapper");

    // 点击上传区域触发文件选择
    uploadZone.addEventListener("click", () => {
      fileInput.click();
    });

    // 拖拽事件
    uploadZone.addEventListener("dragover", (e) => {
      e.preventDefault();
      uploadZone.classList.add(
        "border-accent-blue",
        "bg-dark-100",
        "bg-opacity-50"
      );
    });

    uploadZone.addEventListener("dragleave", () => {
      uploadZone.classList.remove(
        "border-accent-blue",
        "bg-dark-100",
        "bg-opacity-50"
      );
    });

    uploadZone.addEventListener("drop", (e) => {
      e.preventDefault();
      uploadZone.classList.remove(
        "border-accent-blue",
        "bg-dark-100",
        "bg-opacity-50"
      );

      if (e.dataTransfer.files.length) {
        this.handleFileSelection(e.dataTransfer.files[0]);
      }
    });

    // 文件选择
    fileInput.addEventListener("change", (e) => {
      if (e.target.files.length) {
        this.handleFileSelection(e.target.files[0]);
      }
    });

    // 移除图像
    removeButton.addEventListener("click", () => {
      this.resetUpload();
    });

    // 缩放图像
    zoomButton.addEventListener("click", () => {
      const previewImage = document.getElementById("preview-image");
      previewImage.classList.toggle("preview-image-fullsize");

      // 切换预览容器的高度限制
      const previewContainer = previewImage.parentElement;
      if (previewImage.classList.contains("preview-image-fullsize")) {
        previewContainer.style.maxHeight = "none";
        zoomButton.querySelector("svg").innerHTML = `
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
        `;
      } else {
        previewContainer.style.maxHeight = "400px";
        zoomButton.querySelector("svg").innerHTML = `
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 13v-3m0 0V7m0 3h3m-3 0H7" />
        `;
      }
    });

    // 图像悬停效果
    previewWrapper.addEventListener("mouseenter", () => {
      const previewImage = document.getElementById("preview-image");
      if (!previewImage.classList.contains("preview-image-fullsize")) {
        previewImage.classList.add("preview-image-hover");
      }
    });

    previewWrapper.addEventListener("mouseleave", () => {
      const previewImage = document.getElementById("preview-image");
      previewImage.classList.remove("preview-image-hover");
    });

    // 开始诊断
    startButton.addEventListener("click", () => {
      if (this.file) {
        uploadStatus.textContent = "图像上传成功，请点击开始诊断";
        uploadStatus.classList.add("text-green-400");

        // 隐藏上传区域，显示处理区域
        const processingSection = document.getElementById("processing-section");
        processingSection.classList.remove("hidden");
        processingSection.scrollIntoView({ behavior: "smooth" });

        // 触发处理事件
        const event = new CustomEvent("startProcessing", {
          detail: { file: this.file },
        });
        document.dispatchEvent(event);
      }
    });
  }

  handleFileSelection(file) {
    const uploadStatus = document.getElementById("upload-status");
    const previewContainer = document.getElementById("preview-container");
    const uploadZone = document.getElementById("upload-zone");
    const previewImage = document.getElementById("preview-image");
    const fileName = document.getElementById("file-name");
    const imageDimensions = document.getElementById("image-dimensions");
    const imageQualityIndicator = document.getElementById(
      "image-quality-indicator"
    );
    const startButton = document.getElementById("start-diagnosis");

    // 检查文件类型
    if (!this.acceptedFormats.includes(file.type)) {
      uploadStatus.textContent = "不支持的文件格式，请上传 JPG 或 PNG 图像";
      uploadStatus.classList.add("text-red-400", "error-shake");
      setTimeout(() => uploadStatus.classList.remove("error-shake"), 1000);
      return;
    }

    // 检查文件大小
    if (file.size > this.maxFileSize) {
      uploadStatus.textContent = "上传失败，请检查文件格式和大小限制（≤5MB）";
      uploadStatus.classList.add("text-red-400", "error-shake");
      setTimeout(() => uploadStatus.classList.remove("error-shake"), 1000);
      return;
    }

    // 预览图像并检查分辨率
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // 检查图像尺寸
        if (img.width < this.minResolution || img.height < this.minResolution) {
          uploadStatus.textContent =
            "图像分辨率过低，可能影响诊断准确性，请更换更清晰图像";
          uploadStatus.classList.add("text-yellow-400");
          startButton.disabled = false; // 仍然允许继续，但给出警告

          // 设置低质量标记
          imageQualityIndicator.textContent = "低质量";
          imageQualityIndicator.classList.add("bg-yellow-500");
          imageQualityIndicator.classList.remove("bg-green-500");
        } else {
          uploadStatus.textContent = "图像检查通过，点击'开始诊断'继续";
          uploadStatus.classList.remove("text-red-400", "text-yellow-400");
          uploadStatus.classList.add("text-green-400");
          startButton.disabled = false;

          // 设置高质量标记
          imageQualityIndicator.textContent = "高质量";
          imageQualityIndicator.classList.add("bg-green-500");
          imageQualityIndicator.classList.remove("bg-yellow-500");
        }

        // 显示图像尺寸
        imageDimensions.textContent = `${img.width}x${img.height}px`;

        // 应用图像加载效果
        setTimeout(() => {
          previewImage.classList.add("loaded");
        }, 100);
      };
      img.src = e.target.result;
      previewImage.src = e.target.result;
    };
    reader.readAsDataURL(file);

    // 显示文件名
    fileName.textContent = file.name;

    // 显示预览区域，隐藏上传区域
    previewContainer.classList.remove("hidden");
    uploadZone.classList.add("hidden");

    // 应用进入动画
    setTimeout(() => {
      previewContainer.classList.add("active");
    }, 50);

    // 存储文件
    this.file = file;
  }

  resetUpload() {
    const uploadStatus = document.getElementById("upload-status");
    const previewContainer = document.getElementById("preview-container");
    const uploadZone = document.getElementById("upload-zone");
    const fileInput = document.getElementById("file-input");
    const previewImage = document.getElementById("preview-image");

    uploadStatus.textContent =
      "请上传高清晰度的皮肤图像，我们将通过 AI 模型辅助诊断白癜风";
    uploadStatus.classList.remove(
      "text-red-400",
      "text-yellow-400",
      "text-green-400"
    );

    // 先添加隐藏动画
    previewContainer.classList.remove("active");

    // 重置图像缩放状态
    previewImage.classList.remove(
      "preview-image-fullsize",
      "preview-image-hover",
      "loaded"
    );

    // 稍微延迟后再隐藏预览区域，显示上传区域
    setTimeout(() => {
      previewContainer.classList.add("hidden");
      uploadZone.classList.remove("hidden");
    }, 300);

    fileInput.value = "";
    this.file = null;
  }
}

// 初始化上传组件
document.addEventListener("DOMContentLoaded", () => {
  window.uploadSection = new UploadSection();
});
