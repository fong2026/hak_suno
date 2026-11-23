# Suno AI 音樂提示詞

中文構思、英文輸出，快速整理出適合 Suno AI 的音樂提示詞。網站使用 Flask，支援本機執行與 Vercel Python Functions。

## 本機啟動

```bash
python -m venv .venv
# Windows: .venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
python app.py
```

開啟 http://127.0.0.1:5000 。翻譯透過 Google Translate 公開端點提供；需要網路連線，服務可用性與速率由上游決定。

## 發布到 GitHub

在此資料夾初始化 Git，將遠端設為 `https://github.com/fong2026/SunoAI.git`，提交後推送至 `main`。請確認 GitHub 專案已建立且目前帳號有寫入權限。

## 發布到 Vercel

1. 將 GitHub 專案匯入 Vercel。
2. Framework Preset 選 **Other**，Root Directory 保持專案根目錄。
3. 按 **Deploy**。`vercel.json` 會將請求交給 `api/index.py`。

不需要設定環境變數。若之後改用具備 API key 的翻譯供應商，請在 Vercel 專案設定中加入環境變數，勿將金鑰提交至 Git。
