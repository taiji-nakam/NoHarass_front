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
  // const fetchMap = async () => {
  //   try {
  //     setLoading(true);
  //     console.log("Fetching map data for area:", area);

  //     const response = await fetch('/api/getStaticMap', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ location: area }),
  //     });

  //     if (!response.ok) throw new Error('地図の取得に失敗しました');

  //     const data = await response.json();
  //     console.log("Map data received:", data);

  //     setMapUrl(data.mapUrl);
  //   } catch (error) {
  //     console.error("Error fetching map data:", error);
  //     setError(error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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
    <div className={`${styles.body} flex items-center bg-white min-h-screen p-4`}>
      <div className="flex justify-center items-center mb-2">
        <span className="text-xl font-bold">80%</span>
        <div className="relative w-[300px] max-w-full h-2 ml-2 bg-gray-300 rounded-full">
          <div className="absolute top-0 left-0 h-full bg-orange-500" style={{ width: '80%' }}></div>
        </div>
      </div>
      <h1>おすすめエリアの診断結果</h1>
      <h1 className="text-3xl font-bold text-center my-4">あなたにオススメのエリアは</h1>
      {areaResult ? (
        <>
          <p className="text-4xl font-bold text-center"> {recommended} 
          <span className="text-3xl font-bold">です。</span>
          </p>
          {/* <p>API:{process.env.NEXT_PUBLIC_GOOGLE_STATIC_MAPS_API_KEY}</p> */}
          {/* <div>
            <h2>ChatGPT からのおすすめ情報:</h2>
            <p>{gptMessage}</p>
          </div> */}
          <div style={{ width: "100%", height: "400px", marginTop: "10px", marginBottom: "10px" }}>
            <iframe 
              title={`Google Map for ${recommended}`} width="100%" height="100%" style={{ border: "0" }} loading="lazy" allowFullScreen 
              src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_STATIC_MAPS_API_KEY}&q=${latitude},${longitude}`} >
            </iframe>
          </div>
          <p className="text-1xl font-nomal  text-center">{note}</p>
        </>
      ) : (
        <p>結果が見つかりません。</p>
      )}
      {/* {mapUrl ? (
        <img src={mapUrl} alt={`${area}の地図`} />
      ) : (
        <p>地図を読み込んでいます...</p>
      )} */}

      {/* 下段のボタン */}
      <div className="mt-8 space-y-4">
        <button
          onClick={doResultDtl}
            className="w-full bg-yellow-400 text-black py-3 px-4 rounded-lg font-medium hover:bg-yellow-500 transition-colors text-2xl"
          >
            このエリアの周辺情報を見る →
        </button>
        <button
          onClick={toAssessment}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-md transition duration-300 ease-in-out shadow-md mb-4"
        >
          ←もう一度診断する
        </button>
        <button
          onClick={toIndex}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-md transition duration-300 ease-in-out shadow-md mb-4"
        >
          ←最初の画面に戻る
        </button>
      </div>
    </div>
  );
}
