"""Suno AI music prompt translator, ready for Flask or Vercel."""

from flask import Flask, jsonify, render_template, request
from urllib.parse import urlencode
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError
import json

app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = 32 * 1024


@app.get("/")
def home():
    return render_template("index.html")


@app.post("/api/translate")
def translate():
    data = request.get_json(silent=True) or {}
    text = str(data.get("text", "")).strip()
    if not text:
        return jsonify(error="請先輸入想翻譯的音樂描述。"), 400
    if len(text) > 5000:
        return jsonify(error="文字太長，請控制在 5,000 字元以內。"), 400

    query = urlencode({"client": "gtx", "sl": "zh-TW", "tl": "en", "dt": "t", "q": text})
    req = Request(
        f"https://translate.googleapis.com/translate_a/single?{query}",
        headers={"User-Agent": "Mozilla/5.0 SunoPromptStudio/1.0"},
    )
    try:
        with urlopen(req, timeout=15) as response:
            payload = json.loads(response.read().decode("utf-8"))
        translated = "".join(part[0] for part in payload[0] if part and part[0])
        if not translated:
            return jsonify(error="目前無法取得翻譯，請稍後再試。"), 502
        return jsonify(translation=translated)
    except (HTTPError, URLError, TimeoutError, ValueError, IndexError) as exc:
        app.logger.warning("Translation request failed: %s", exc)
        return jsonify(error="翻譯服務暫時無法連線，請稍後再試。"), 502


if __name__ == "__main__":
    app.run(debug=True)
