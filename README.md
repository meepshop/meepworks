Meepworks Framework
===
### MeepShop Internal Framewok

#### 這是一個 meepshop 的框架開發專案, 每個版本維護時會從此專案開始進行測試, 最後納入 production 中。
#### This is meepshop framework next experimental version, we will maintain it.

#### 改進 -> 測試 -> 發布合併請求 -> 檢視 -> 測試 -> 簽名（簽章）-> 版本 -> 上線
#### IMPROVEMENT -> TEST -> PULLREQUEST -> REVIEW CODE -> TEST -> SIGNATURE -> VERSION -> PRODUCTION

# 主要專案結構 (改善中)

```
source -
       | - internal (內部檔案)
         | - core (核心檔案)
         | - component（額外用輔助元件）
         | - utils（工具包）
         | - warning (計畫納入 utils)
       - application-context.js (全域使用的參數與方法)
       - application.js (設定router相關的類別)
       - component (子元件類別)
       - instance.js (產生實體類別)
       - dispatcher.js （flux 的 dispatcher）
       - action.js (產生 flux 的 action 類別)
       - store.js （產生 flux 的 store 類別）
       - styles.js (js-css 類別)
       - tmpl (format 類別)
       --- 等待移動 ---
       - error.js (等待移動至 utils)
       - extend.js (等待移動至 utils)
       - locale.js (等待移動至 utils)
       - merge.js (等待移動至 utils)
```

# 如何開始 (TEST MEEPSHOP WORKFLOW)

1. 首先 fork 專案到自己的 github repo 下
2. 到 terminal 中輸入 git clone [剛剛 fork 的專案位置(自己的)]
3. npm i (安裝 node_module 依賴檔案)
4. npm i webpack-dev-server --g
5. npm start 啟動 webpack-dev-server
6. 網址輸入 http://localhost:18881

# 如何幫助改進 (PULL REQUEST)

### How can I help this repo ?

1. 首先 fork 專案到自己的 github repo 下
2. 閱讀 docs 查看最近的更改項目與 todo list 認養或自行增加 (必須先到 repo 的 issue 中開票)
3. 修改完的每個項目 commit 都必須要有詳細內容
4. 修改完的項目都必須通過測試與語法檢驗(test, eslint)
5. 所有 push 的 commit 都只能到自己的 dev-branch 中，不可直接到 meepshop/meepworks/master
6. 發 pull request 合併請求到 meepshop/meepworks/meepworks-dev 中
7. reivecode 等待檢視代碼
8. 檢視與討論完後會選擇版本號碼
9. 納入下次的 production 版本中
10. Thanks a lot !
