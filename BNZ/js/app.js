/**
 * 主应用程序逻辑
 * 控制应用整体状态和组件间通信
 */
document.addEventListener("DOMContentLoaded", () => {
  // 检查浏览器兼容性
  checkBrowserCompatibility();

  // 添加暗黑模式
  document.documentElement.classList.add("dark");

  // 全局错误处理
  window.addEventListener("error", handleGlobalError);
});

/**
 * 检查浏览器兼容性
 */
function checkBrowserCompatibility() {
  // 检查是否支持FileReader API
  if (!window.FileReader) {
    showCompatibilityWarning("您的浏览器不支持文件上传功能，请更新浏览器版本");
  }

  // 检查是否支持Promise
  if (!window.Promise) {
    showCompatibilityWarning("您的浏览器版本过低，某些功能可能无法正常使用");
  }
}

/**
 * 显示兼容性警告
 */
function showCompatibilityWarning(message) {
  // 创建警告元素
  const warningElement = document.createElement("div");
  warningElement.className =
    "fixed top-0 left-0 right-0 bg-yellow-800 text-yellow-200 p-3 text-center";
  warningElement.textContent = message;
  document.body.prepend(warningElement);
}

/**
 * 全局错误处理
 */
function handleGlobalError(event) {
  console.error("应用发生错误:", event.error || event.message);
}

// 扩展功能：添加键盘快捷键支持
document.addEventListener("keydown", (e) => {
  // Alt + N: 重新开始新的诊断
  if (e.altKey && e.key === "n") {
    const newDiagnosisBtn = document.getElementById("new-diagnosis-btn");
    if (newDiagnosisBtn) {
      newDiagnosisBtn.click();
    }
  }

  // Alt + D: 下载报告
  if (e.altKey && e.key === "d") {
    const downloadReportBtn = document.getElementById("download-report-btn");
    if (
      downloadReportBtn &&
      getComputedStyle(downloadReportBtn).display !== "none"
    ) {
      downloadReportBtn.click();
    }
  }
});
