# Jelly Untangle

Jelly Untangle（水母解結）是 012S Jelly 系列的空間邏輯遊戲：拖動 Jelly，讓所有連線不再交叉。

## 玩法

- 按住並拖曳任意 Jelly，連線會即時跟著移動。
- 紅橘色線段代表目前涉及交叉的連線。
- 畫面上的交叉數降到 0 即可過關；不需要回到唯一的原始座標。
- 「復原」只回復上一次完成的 Jelly Move；「重來」回到本題初始配置；「提示」會標示一個可以嘗試的 Solution Position。

## Difficulty

- Basic：6 Jelly、6 edges、初始 2–4 個交叉，約 30 秒–2 分鐘。
- Normal：8 Jelly、10 edges、初始 5–8 個交叉，約 2–4 分鐘。
- Challenge：10 Jelly、14 edges、初始 9–15 個交叉，約 4–8 分鐘。

## Generator 設計

每個難度先建立一組已知不交叉的平面配置與固定 Edge Graph，再將同一批 Solution Positions 做隨機排列，得到初始位置。Generator 不會隨機連線碰運氣；產生後由 validator 檢查 solution crossings、初始 crossing 範圍、自環、重複邊、節點 ID、邊界與圖形連通性，不符合就重新洗牌。

## Development

```bash
npm install
npm run dev
npm run test
npm run typecheck
npm run build
```

## Deployment

Vite 已設定 GitHub Pages base：`/012s-jelly-untangle/`。可使用任何將 `dist` 發布到 GitHub Pages 的靜態部署流程。
