// エリア結果表示ページ
// /pages/city-picker/result.js

import * as React from 'react';
import { useState, useContext, useEffect} from 'react';
import { MyContext } from '/context/MyContext';
import { useRouter } from 'next/router';
import styles from '../styles/common.module.css';  // 共通CSS
// import mstyles from '../app/style/customInput.module.css';   //カスタムCSS

export default function Result() {
  const router = useRouter();
  const { area } = router.query; // クエリからおすすめエリアを取得
  const [mapUrl, setMapUrl] = useState(''); // 地図の URL
  const [areaResult, setAreaResult] = useState(null); // API レスポンスのエリア情報
  const [gptMessage, setGptMessage] = useState(''); // ChatGPT 生成メッセージ
  const [loading, setLoading] = useState(false); // ローディング状態
  const [error, setError] = useState(null); // エラーメッセージ
  const { assessmentId } = useContext(MyContext); // Contextの使用
  const [recommended, setRecommended] = useState('');
  const [note, setNote] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  

  // おすすめエリア情報を取得する関数
  const fetchResults = async () => {
    require('dotenv').config();
    console.log(process.env.API_ENDPOINT);
    console.log(process.env.GOOGLE_STATIC_MAPS_API_KEY);
    try {
      setLoading(true);
      console.log("Fetching area result...");
  
      // API エンドポイントにリクエストを送信
      const res = await fetch(`${process.env.API_ENDPOINT}/areaResult?assessmentId=117`);
      if (!res.ok) {
        throw new Error(`おすすめエリア情報の取得に失敗しました: ${res.statusText}`);
      }
  
      const data = await res.json();
      console.log("Received data:", data);
      setRecommended(data.recommended);
      setNote(data.note);
      setLatitude(data.latitude);
      setLongitude(data.longitude);
      console.log(recommended);
      console.log(note);

      // 状態に取得したデータを保存
      setAreaResult({
        area: data.area || "エリア情報がありません",
        message: data.message || "メッセージがありません",
      });
      setGptMessage(data.chatGptMessage || "おすすめ情報が取得できませんでした");
  
      // デバッグ出力（オプション）
      console.log("Recommended:", data.recommended);
      console.log("Note:", data.note);
      console.log("Latitude:", data.latitude);
      console.log("Longitude:", data.longitude);
  
    } catch (err) {
      console.error("Error fetching area result:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  


  // 地図データを取得する関数
  const fetchMap = async () => {
    try {
      setLoading(true);
      console.log("Fetching map data for area:", area);

      const response = await fetch('/api/getStaticMap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location: area }),
      });

      if (!response.ok) throw new Error('地図の取得に失敗しました');

      const data = await response.json();
      console.log("Map data received:", data);

      setMapUrl(data.mapUrl);
    } catch (error) {
      console.error("Error fetching map data:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // 初期ロード時のデータフェッチ
  useEffect(() => {
    fetchResults();
  }, [assessmentId]);

  // 地図の取得
  useEffect(() => {
    if (area) {
      fetchMap();
    }
  }, [area]);

  const toAssessment = () => {
    router.push('/city-picker/assessment');
  };

  const toIndex = () => {
    router.push('/city-picker');
  };

  const doResultDtl = (e) => {
    e.preventDefault();
    router.push('/city-picker/resultDtl');
  };

  if (loading) return <p>読み込み中...</p>;
  if (error) return <p>エラーが発生しました: {error}</p>;

  return (
    <div className={styles.body}>
      <h1>おすすめエリア結果</h1>
      {areaResult ? (
        <>
          <p>エリア: {recommended}</p>
          <p>メッセージ: {note}</p>
          <p>API:{process.env.GOOGLE_STATIC_MAPS_API_KEY}</p>
          <div>
            <h2>ChatGPT からのおすすめ情報:</h2>
            <p>{gptMessage}</p>
          </div>
          <div style={{ width: "100%", height: "400px", marginTop: "10px" }}>
            <iframe 
              title={`Google Map for ${recommended}`} width="100%" height="100%" style={{ border: "0" }} loading="lazy" allowFullScreen 
              src={`https://www.google.com/maps/embed/v1/place?key=${process.env.GOOGLE_STATIC_MAPS_API_KEY}&q=${latitude},${longitude}`} >
            </iframe>
          </div>
        </>
      ) : (
        <p>結果が見つかりません。</p>
      )}
      {mapUrl ? (
        <img src={mapUrl} alt={`${area}の地図`} />
      ) : (
        <p>地図を読み込んでいます...</p>
      )}
      <form onSubmit={doResultDtl}>
        <button className="btn btn-outline btn-primary" type="submit">
          このエリアの周辺情報を見る →
        </button>
      </form>
      <button className="btn btn-outline btn-primary" onClick={toAssessment}>
        ←もう一度診断する
      </button>
      <button className="btn btn-outline btn-primary" onClick={toIndex}>
        ←最初の画面に戻る
      </button>
    </div>
  );
}
