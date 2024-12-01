export default function handler(req, res) {
    // リクエストがPOST以外の場合エラーを返す
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }
  
    const { location } = req.body;
  
    // locationが指定されていない場合、エラーを返す
    if (!location) {
      return res.status(400).json({ error: 'Location is required' });
    }
  
    // Google Static Maps APIキー（環境変数に保存する）
    const API_KEY = process.env.GOOGLE_STATIC_MAPS_API_KEY;
    if (!API_KEY) {
      return res.status(500).json({ error: 'API key is missing' });
    }
  
    // Google Static Maps APIのURLを生成
    const baseUrl = "https://maps.googleapis.com/maps/api/staticmap";
    const params = new URLSearchParams({
      center: location, // locationはクライアントから送信された値
      zoom: "14", // ズームレベル
      size: "600x300", // 画像サイズ
      key: API_KEY, // APIキー
    });
  
    const mapUrl = `${baseUrl}?${params.toString()}`;
  
    // mapUrlを返す
    res.status(200).json({ mapUrl });
  }
  