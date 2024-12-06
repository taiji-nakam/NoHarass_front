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
  const [mapUrl, setMapUrl] = useState('');
  const { assessmentId, setAssessmentId } = useContext(MyContext); // Contextの使用

  useEffect(() => {
    if (area) {
      const fetchMap = async () => {
        try {
          const response = await fetch('/api/getStaticMap', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ location: area }),
          });

          if (!response.ok) {
            throw new Error('地図の取得に失敗しました');
          }

          const data = await response.json();
          setMapUrl(data.mapUrl);
        } catch (error) {
          console.error(error.message);
        }
      };

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
    // APIリクエストが必要なら追加可能
    router.push('/city-picker/resultDtl');
  };

  return (
    <div className={styles.body}>
      <h1>おすすめエリア: {area}</h1>
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
