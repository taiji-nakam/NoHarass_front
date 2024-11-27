// Topページ
// /pages/city-picker/index.js

import * as React from 'react';
import { useState, useContext, useEffect} from 'react';
import { MyContext } from '/context/MyContext';
import { useRouter } from 'next/router';
import styles from '../styles/common.module.css';  // 共通CSS
// import mstyles from '../styles/index.module.css'; // カスタムCSS

export default function Home() {

  //画面遷移とデータシェア
  const { sharedMsg, setSharedMsg } = useContext(MyContext);  // useContextでsharedMsgとsetSharedMsgを取得
  const router = useRouter();  // useRouterのインスタンスを作成

  // 診断ページへ遷移
  const toAssessment = async (e) => {
    e.preventDefault();　             // javascriptイベントの制御
    router.push('/city-picker/assessment');       // 診断ページへ遷移
  };

  // 手入力ページへ遷移
  const toCustomInput = async (e) => {
    e.preventDefault();　             // javascriptイベントの制御
    router.push('/city-picker/customInput');       // 診断ページへ遷移
  };

  return (
    <div className={styles.body}>

      <h1>賃貸診断を</h1>
      <form onSubmit={toAssessment}>
        <button className="btn btn-outline btn-primary" type="submit">する</button>
      </form>
      <form onSubmit={toCustomInput}>
        <button className="btn btn-outline btn-primary" type="submit">しない</button>
      </form>

    </div>
  );
}
