# 我的英文筆記本（English Notes）

整理文法、單字、片語搭配、台式英文常見錯誤與情境會話的英文筆記網站，一個主題一頁。

- 網站：https://p16141134-beep.github.io/english-notes/
- 專案規則：[CLAUDE.md](CLAUDE.md)（新增或修改筆記前請先閱讀）

## 本機預覽

直接用瀏覽器打開 `index.html`，或在專案根目錄執行：

```bash
python -m http.server 8000
```

## 新增一篇筆記

1. 複製 `templates/note-template.html` 為 `notes/{category}-{slug}.html` 並填入內容
2. 在 `data/notes.js` 陣列最後新增一筆資料

分類、頁面區塊、元件與檢查清單請見 [CLAUDE.md](CLAUDE.md) 第 4～8 節。
