// 診断結果ページ
// /pages/city-picker/assessmentResult.js

import * as React from 'react';
import { useState, useContext, useEffect} from 'react';
import { MyContext } from '/context/MyContext';
import { useRouter } from 'next/router';
import styles from '../styles/common.module.css';  // 共通CSS
// import mstyles from '../app/style/assessmentResult.module.css';   //カスタムCSS

export default function Home() {

  //基礎情報入力ページへ遷移
  const router = useRouter();  // useRouterのインスタンスを作成
 
  //基礎情報入力ページへ遷移
  const toInfoEntry = async (e) => {
    e.preventDefault();　// javascriptイベントの制御
    //Actionなしで良いよね？
    router.push('/city-picker/infoEntry');      // 診断結果ページへ遷移
  };

  // 診断ページへ遷移
  const toAssessment = async (e) => {
    e.preventDefault();　// javascriptイベントの制御
    router.push('/city-picker/assessment');      // 診断ページへ遷移
  };

  //Indexページへ遷移
  const toIndex = async (e) => {
    e.preventDefault();　// javascriptイベントの制御
    router.push('/city-picker');      // 診断結果ページへ遷移
  };

  return (
    <div className={styles.body}>
      <h1>診断結果</h1>
      <button className="btn btn-outline btn-primary"  onClick={toInfoEntry}>さらに基本情報を追加して、おすすめエリア診断に進む→</button>
      <button className="btn btn-outline btn-primary"  onClick={toAssessment}>←もう一度診断する</button>
      <button className="btn btn-outline btn-primary"  onClick={toIndex}>←最初の画面に戻る</button>
    </div>
  );
}
