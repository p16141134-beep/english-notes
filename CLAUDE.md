# CLAUDE.md — 我的英文筆記本（English Notes）

> 這份文件寫給「之後要幫這個專案新增或修改筆記的 AI（以及我自己）」。
> 開始任何修改前，請先完整讀完本文件，並遵守第 9 節「AI 工作規則」與第 8 節「新增筆記流程」。

---

## 1. 專案目的

- 這是一個**純靜態網站**，用來整理我（成大系統系 廖嘉哲）學英文時遇到的文法、單字、片語、常見錯誤與情境會話。
- 每一篇筆記只講**一個主題**，格式固定：先給重點，再說明觀念、列例句、整理常見錯誤，最後附小練習自我檢查。
- 目標讀者：我自己（複習用），以及程度約多益 600–750、想改掉「台式英文」的同學。
- 核心精神：**一個主題一頁、格式固定、隨時可以新增**。新增筆記時只要複製模板、填內容、在 `data/notes.js` 登記一筆，首頁卡片、分類篩選、搜尋、上一篇／下一篇、同分類推薦都會自動更新。
- 網站部署在 GitHub Pages：`https://p16141134-beep.github.io/english-notes/`

## 2. 技術限制（不可違反）

| 項目 | 規定 |
|---|---|
| 技術 | 只用 HTML + CSS + 原生 JavaScript。**不使用** 任何框架、建置工具、npm 套件或 CDN。 |
| 部署 | repo 根目錄就是網站根目錄（GitHub Pages：branch `main`、資料夾 `/ (root)`）。 |
| 路徑 | 一律使用**相對路徑**（例如 `../assets/style.css`），不可用 `/` 開頭，否則在 GitHub Pages 的子路徑下會壞掉。 |
| 離線預覽 | 直接雙擊 HTML 也要能看，所以筆記清單用 `data/notes.js`（`window.NOTES = [...]`），不用 `fetch` 讀 JSON。 |
| 外部資源 | 不載入外部字型、圖片、音檔或腳本。 |

## 3. 檔案結構

```
english-notes/
├── CLAUDE.md                  ← 本文件：專案規則（AI 必讀）
├── README.md                  ← 給人看的簡介
├── index.html                 ← 首頁：搜尋 + 分類篩選 + 筆記卡片（全部由 data/notes.js 產生）
├── about.html                 ← 關於本站與這套規則
├── .nojekyll                  ← 讓 GitHub Pages 不經過 Jekyll
├── assets/
│   ├── style.css              ← 全站唯一樣式表（顏色、元件都在這）
│   └── site.js                ← 全站唯一腳本：導覽、卡片、篩選、搜尋、上一篇/下一篇、同分類推薦
├── data/
│   └── notes.js               ← ★ 所有筆記的清單（新增筆記一定要改這裡）
├── notes/
│   ├── grammar-present-perfect.html
│   ├── mistake-chinglish.html
│   └── …                      ← 每篇筆記一個檔案
└── templates/
    └── note-template.html     ← ★ 新增筆記時複製這個檔案
```

## 4. 分類與命名規則

### 4.1 分類（固定五種，不可自行新增）

| category | 顯示名稱 | 放什麼 | 檔名前綴 |
|---|---|---|---|
| `grammar` | 文法 | 時態、句型、詞性用法 | `grammar-` |
| `vocab` | 單字 | 依主題整理的一組單字（6–10 個） | `vocab-` |
| `phrase` | 片語搭配 | 片語動詞、搭配詞、慣用語 | `phrase-` |
| `mistake` | 常見錯誤 | 台式英文、中翻英直譯的錯誤 | `mistake-` |
| `talk` | 情境會話 | 某個情境的對話與實用句 | `talk-` |

需要新分類時，必須先更新本表、`assets/site.js` 的 `CATEGORY`、`assets/style.css` 的顏色變數，再使用。

### 4.2 難度（`level`）

| level | 顯示 | 判斷方式 |
|---|---|---|
| `1` | 基礎 | 國中、高中就學過，但很常用錯 |
| `2` | 中級 | 多益 600–750 會遇到，日常與職場常用 |
| `3` | 進階 | 較正式或細微的用法差異 |

### 4.3 命名

- 筆記檔案：`notes/{category}-{slug}.html`，`slug` 為英文小寫加連字號，描述主題，例如 `grammar-present-perfect.html`、`phrase-make-vs-do.html`。
- 筆記 id：檔名去掉 `.html`（例如 `grammar-present-perfect`），用在 `<body data-note="…">` 與 `data/notes.js`。
- 檔名、資料夾**不可使用中文或空白**；頁面說明文字一律使用**繁體中文**，英文例句使用美式英文。
- CSS class：英文小寫 + 連字號（`.mistake`、`.vocab-table`）。

## 5. 網頁整體風格

- 感覺：乾淨的「單字卡／筆記本」。米白底（深色模式為深灰底）、單欄閱讀，內容寬度最大 760px。
- 顏色只能使用 `assets/style.css` 開頭 `:root` 的變數，**不可直接寫色碼**、不可寫 inline style。
- 分類顏色：文法 藍、單字 綠、片語搭配 紫、常見錯誤 紅橙、情境會話 青。
- 字體：系統字型；英文例句用同一字型，但以 `lang="en"` 標記。
- 語氣：像學長姐在跟同學講解，口語但句子完整；解釋「為什麼」，不要只丟規則。
- 必須支援手機寬度（360px）與深色模式。

## 6. 筆記頁面結構（每一篇都必須遵守）

由上而下**固定**包含以下區塊，順序不可調換。標 *（選填）* 的可省略，其餘必填。

| 順序 | 區塊 | HTML | 內容要求 |
|---|---|---|---|
| — | `<body>` 屬性 | `<body data-note="{id}" data-root="../">` | `data-root` 在 `notes/` 內固定為 `../` |
| 0 | 頁首 | `<header id="site-header"></header>` | 留空，`site.js` 自動產生 |
| 1 | 標題區 | `<section class="note-hero">` | `<span id="note-badges">`（分類＋難度，自動填入）、`<h1>` 中文標題、`<p class="en-title" lang="en">` 英文標題、`<p class="summary">` 一句話摘要（25–50 字）、`<ul class="tags">` 2–4 個標籤 |
| 2 | 一句話重點 | `<section id="point">` | 一個 `.callout.key`，用一兩句話講完這篇最重要的觀念 |
| 3 | 觀念說明 | `<section id="explain">` | 1–3 段說明；文法可加 `.pattern` 句型公式與 `.simple-table`；`vocab` 分類用 `.vocab-table` 列 6–10 個單字；`talk` 分類用 `.dialog` 放一段完整對話 |
| 4 | 例句 | `<section id="examples">` | **至少 3 個** `.example`，每句都要有英文與中文翻譯，重點字用 `<b>` 標出 |
| 5 | 常見錯誤 | `<section id="mistakes">` | **至少 1 個** `.mistake`（錯誤句 → 正確句 → 原因）；`mistake` 分類至少 5 個 |
| 6 | 小練習 | `<section id="practice">` | **2–4 題** `<details class="quiz">`，答案藏在展開內容並附一句解釋 |
| 7 | 補充 *（選填）* | `<section id="extra">` | 延伸用法、易混淆字、記憶小技巧（`.callout.tip`） |
| 8 | 同分類筆記 | `<section id="related"></section>` | 留空，`site.js` 自動列出同分類的其他筆記 |
| 9 | 上一篇／下一篇 | `<nav id="pager"></nav>` | 留空，自動產生 |
| 10 | 頁尾 | `<footer id="site-footer"></footer>` | 留空，自動產生 |

### 可用元件（只能用這些；需要新元件時先加到 `style.css` 並更新本節）

```html
<!-- 一句話重點 / 小技巧 / 注意 -->
<div class="callout key"><strong>重點：</strong>……</div>
<div class="callout tip"><strong>記憶技巧：</strong>……</div>
<div class="callout warn"><strong>注意：</strong>……</div>

<!-- 句型公式 -->
<p class="pattern" lang="en">S + have / has + p.p.</p>

<!-- 例句：英文 + 中文，重點字用 <b> -->
<div class="example">
  <p class="en" lang="en">I <b>have lived</b> in Tainan for five years.</p>
  <p class="zh">我已經在台南住五年了（現在還住）。</p>
</div>

<!-- 常見錯誤：錯 → 對 → 原因 -->
<div class="mistake">
  <p class="wrong" lang="en">I have finished it yesterday.</p>
  <p class="right" lang="en">I finished it yesterday.</p>
  <p class="why">yesterday 是明確的過去時間，要用過去式。</p>
</div>

<!-- 單字表（vocab 分類用） -->
<table class="vocab-table">
  <thead><tr><th>單字</th><th>詞性</th><th>中文</th><th>例句</th></tr></thead>
  <tbody><tr><td lang="en"><b>confirm</b></td><td>v.</td><td>確認</td><td lang="en">Could you confirm the time?</td></tr></tbody>
</table>

<!-- 一般表格（比較、整理用） -->
<table class="simple-table">
  <thead><tr><th>欄位</th><th>欄位</th></tr></thead>
  <tbody><tr><td>內容</td><td lang="en">content</td></tr></tbody>
</table>

<!-- 對話（talk 分類的觀念說明用）：每句英文後面接一行中文 -->
<div class="dialog">
  <p lang="en"><span class="who">A</span>Could you tell me a little about yourself?</p>
  <p class="zh">可以簡單介紹一下你自己嗎？</p>
</div>

<!-- 小練習：題目在 summary，答案在展開內容 -->
<details class="quiz">
  <summary lang="en">1. I ___ (see) that movie twice.</summary>
  <p class="answer"><b lang="en">have seen</b>：說的是「到目前為止的經驗」，用現在完成式。</p>
</details>
```

## 7. `data/notes.js` 格式

所有筆記都登記在 `window.NOTES` 陣列中，**新筆記一律加在陣列最後面**（首頁會自動把最新的排在最前面）。

```js
{
  id: "grammar-present-perfect",          // 與檔名相同
  category: "grammar",                    // grammar / vocab / phrase / mistake / talk
  level: 2,                               // 1 基礎 / 2 中級 / 3 進階
  title: "現在完成式 vs. 過去式",          // 與頁面 <h1> 相同
  en: "Present Perfect vs. Past Simple",  // 與頁面 .en-title 相同
  summary: "一句話摘要（25–50 字）",        // 與頁面 .summary 相同
  tags: ["時態", "have + p.p."]            // 2–4 個，與頁面 .tags 相同
}
```

## 8. 新增一篇筆記的流程（AI 請照做）

1. 決定分類與 slug，複製 `templates/note-template.html` 為 `notes/{category}-{slug}.html`。
2. 把模板中所有雙大括號佔位文字換成實際內容；不需要的選填區塊整段刪除。
3. 修改 `<body data-note="…">` 與 `<title>`（格式：`中文標題｜英文筆記本`）。
4. 在 `data/notes.js` 陣列**最後面**加一筆（第 7 節），`title`、`en`、`summary`、`tags` 要與頁面一致。
5. 自我檢查（全部打勾才算完成）：
   - [ ] 第 6 節的必填區塊都有、順序正確，例句 ≥ 3、常見錯誤 ≥ 1、練習 2–4 題
   - [ ] 檔案中沒有殘留佔位文字，沒有 inline style、沒有寫死的色碼
   - [ ] 所有英文句子都有 `lang="en"`，例句都有中文翻譯
   - [ ] 英文例句文法正確、自然；錯誤句只出現在 `.wrong` 裡
   - [ ] 首頁出現新卡片，篩選該分類與搜尋關鍵字都找得到
   - [ ] 手機寬度與深色模式都正常
6. 不要修改其他筆記的內容，除非使用者明確要求。

## 9. AI 修改或新增內容時的規則

1. **內容要正確**：例句必須是正確、自然的英文；不確定的用法要在回覆中說明，不要硬寫。錯誤示範只能放在 `.wrong`，避免讀者記錯。
2. **一篇一個主題**：主題太大就拆成多篇（例如「時態」拆成現在完成式、過去進行式…），不要把很多觀念塞在同一頁。
3. **以我的需求為準**：使用者提供的錯誤句、對話紀錄（例如和英文家教 AI 練習時被糾正的句子）優先放進筆記；不要編造「我說過的話」或來源。
4. **不洩漏機密**：不可把 API key、密碼、私人雲端連結寫進任何檔案；個人資料只保留 GitHub 帳號網址與姓名。
5. **改規則要先改文件**：需要新元件、新分類時，先更新本文件與 `style.css` / `site.js`，再使用。
6. **共用部分只改一處**：導覽、頁尾、卡片、推薦都在 `site.js` / `style.css`，不可在單一頁面複製一份修改。
7. **一次只做一件事**：新增筆記時只動該頁與 `data/notes.js`，不要順手改寫其他筆記。
8. **提交訊息**：用繁體中文，格式 `新增: 冠詞 a/an/the 筆記`、`修正: make vs do 例句`、`樣式: 調整例句間距`、`規則: 更新 CLAUDE.md`。

## 10. 本機預覽

直接用瀏覽器開啟 `index.html`；或在專案根目錄執行 `python -m http.server 8000` 後開 `http://localhost:8000`。

## 11. 給 AI 的範例指令

> 「請依照 CLAUDE.md 新增一篇筆記：我常把 `bored` 和 `boring` 搞混。」
> 「請依照 CLAUDE.md 新增一篇單字筆記，主題是機場與出國。」
> 「這是我今天和英文家教的對話紀錄，請依照 CLAUDE.md 把我被糾正的句子整理進『台式英文常見錯誤』。」

AI 收到後應：讀本文件 → 判斷分類與難度 → 複製模板 → 填內容 → 更新 `data/notes.js` → 跑第 8 節檢查清單 → 回報新增／修改了哪些檔案。
