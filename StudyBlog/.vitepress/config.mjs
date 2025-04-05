import { defineConfig } from "vitepress";
import {
  getVuejs,
  getJavaScript,
  getVitePress,
  getAntDesignPro,
} from "../.vitepress/NotesConfig/index";
// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "CaoKai",
  description: "学习与思考",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: "/book.svg",
    lastUpdated: true,
    search: {
      provider: "local",
    },
    outlineTitle: "目录",
    outline: "deep",
    docFooter: {
      prev: "上一页",
      next: "下一页",
    },
    nav: [
      { text: "首页", link: "/" },
      {
        text: "分类",
        items: [
          { text: "VitePress教程", link: "/Notes/VitePress/序.md" },
          {
            text: "VueJs设计与实现",
            link: "/Notes/VueJs/第一篇/权衡的艺术.md",
          },
          {
            text: "JavaScript高级程序设计",
            link: "/Notes/JavaScript/第一章/什么是JavaScript.md",
          },
        ],
      },
    ],
    sidebar: {
      "/Notes/VueJs/": getVuejs(),
      "/Notes/JavaScript/": getJavaScript(),
      "/Notes/VitePress/": getVitePress(),
      "/Notes/AntDesignPro/": getAntDesignPro(),
    },

    socialLinks: [
      { icon: "github", link: "https://github.com/vuejs/vitepress" },
    ],
  },
});
