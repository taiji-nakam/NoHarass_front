// エリア詳細結果表示ページ
// /pages/city-picker/resultDtl.js

import * as React from 'react';
import { useState, useContext, useEffect} from 'react';
import { MyContext } from '/context/MyContext';
import { useRouter } from 'next/router';
import styles from '../styles/common.module.css';  // 共通CSS
// import mstyles from '../app/style/customInput.module.css';   //カスタムCSS

export default function Home() {
 
  const router = useRouter();  // useRouterのインスタンスを作成
   
  //Indexページへ遷移
  const toIndex = async (e) => {
    e.preventDefault();  // javascriptイベントの制御
    router.push('/city-picker');      // 診断結果ページへ遷移
  };

  return (
    <div className={styles.body}>
      <h1>エリア詳細情報</h1>
      <button className="btn btn-outline btn-primary" >物件14件の詳細を見る→</button>
      <button className="btn btn-outline btn-primary"  onClick={toIndex}>←最初の画面に戻る</button>
    </div>
  );
}