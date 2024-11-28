// エリア結果表示ページ
// /pages/city-picker/result.js

import * as React from 'react';
import { useState, useContext, useEffect} from 'react';
import { MyContext } from '/context/MyContext';
import { useRouter } from 'next/router';
import styles from '../styles/common.module.css';  // 共通CSS
// import mstyles from '../app/style/customInput.module.css';   //カスタムCSS

export default function Home() {
 
  //基礎情報の作成とおすすめエリア表示ページへ遷移
  // const [input, setInput] = useState('');   // 基礎情報それぞれ
  const { assesmentId, setAssesmentId } = useContext(MyContext);  // useContextでassesmentIdとsetAssesmentIdを取得
  const router = useRouter();  // useRouterのインスタンスを作成
 
  //おすすめエリアの生成と結果ページへ遷移
  const doResultDtl = async (e) => {
    e.preventDefault();　// javascriptイベントの制御
    // 入力データ送信・診断結果生成・診断ID取得
    // const res = await fetch(process.env.API_ENDPOINT + '/doResultDtl', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ "input":input }),
  
    //   });
    // const data = await res.json();
    //setAssesmentId(data.assessmentId);            // 診断IDをコンテキストに保存
    router.push('/city-picker/resultDtl');      // 診断結果ページへ遷移
  };

  // 診断ページへ遷移
  const toAssessment = async (e) => {
    e.preventDefault();  // javascriptイベントの制御
    router.push('/city-picker/assessment');      // 診断ページへ遷移
  };
    
  //Indexページへ遷移
  const toIndex = async (e) => {
    e.preventDefault();  // javascriptイベントの制御
    router.push('/city-picker');      // 診断結果ページへ遷移
  };

  return (
    <div className={styles.body}>
      <h1>おすすめエリア</h1>
      <form onSubmit={doResultDtl}>
        <br />
        <button className="btn btn-outline btn-primary" type="submit">このエリアの周辺情報を見る→</button>
      </form>
      <button className="btn btn-outline btn-primary"  onClick={toAssessment}>←もう一度診断する</button>
      <button className="btn btn-outline btn-primary"  onClick={toIndex}>←最初の画面に戻る</button>
    </div>
  );
}