# 妙写

手写输入软件

使用 tauri+vite+ts，安装包只有几 MB 大小

使用了谷歌输入法 api，需要联网使用（使用了镜像，无需大陆正常联网）

# 安装

到[releases](https://github.com/xushengfeng/miaoxie/releases)下载适合你系统的版本安装

# 使用

使用鼠标、触控屏或数位笔在软件上书写，识别后将显示在上方候选栏上，默认选中第一项。

然后点击需要输入文字的位置，识别后的文字将自动输入。

目前还没做到像正常输入法一样自动输入，如果你有更好的解决方案（如 rust 库），欢迎提 issue 告诉我

# 编译

[官方文档](https://tauri.app/v1/guides/building/)

```
git clone https://github.com/xushengfeng/miaoxie.git
pnpm i
pnpm build
pnpm tauri build
```
