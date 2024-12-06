import * as React from 'react';
import { useState, useContext, useEffect } from 'react';
import { MyContext } from '/context/MyContext';
import { useRouter } from 'next/router';
import styles from '../styles/common.module.css';  // 共通CSS

export default function Home() {
  const { assessmentId } = useContext(MyContext);  // ContextからassessmentIdを取得
  const router = useRouter();  // useRouterのインスタンスを作成

  // 基礎情報入力ページへ遷移
  const toInfoEntry = async (e) => {
    e.preventDefault();
    router.push('/city-picker/infoEntry');
  };

  // 診断ページへ遷移
  const toAssessment = async (e) => {
    e.preventDefault();
    router.push('/city-picker/assessment');
  };

  // Indexページへ遷移
  const toIndex = async (e) => {
    e.preventDefault();
    router.push('/city-picker');
  };

  // 診断結果を取得
  useEffect(() => {
    // ページが読み込まれたときに実行されるコード
    console.log("Page loaded on the client");

    const fetchAndSetAssessmentResult = async () => {
      if (!assessmentId) return; // assessmentId がない場合は処理をしない
      const res = await fetch(`${process.env.API_ENDPOINT}/assessmentResult?assessmentId=${assessmentId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();
      console.log(data);
    };

    fetchAndSetAssessmentResult();

  }, [assessmentId]); // assessmentIdが変更されたときにも実行されるようにする

  return (
    <div className={styles.body}>
      <h1>診断結果</h1>
      <button className="btn btn-outline btn-primary" onClick={toInfoEntry}>
        さらに基本情報を追加して、おすすめエリア診断に進む→
      </button>
      <button className="btn btn-outline btn-primary" onClick={toAssessment}>
        ←もう一度診断する
      </button>
      <button className="btn btn-outline btn-primary" onClick={toIndex}>
        ←最初の画面に戻る
      </button>
    </div>
  );
}
