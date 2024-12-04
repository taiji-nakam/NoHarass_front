// 基礎情報入力ページ
// /pages/city-picker/infoEntry.js
import * as React from 'react';
import { useState, useContext, useEffect} from 'react';
import { MyContext } from '/context/MyContext';
import { useRouter } from 'next/router';
import styles from '../styles/common.module.css';  // 共通CSS
// import mstyles from '../app/style/infoEntry.module.css';   //カスタムCSS

export default function Home() {
 
  //基礎情報の作成とおすすめエリア表示ページへ遷移
  // const [input, setInput] = useState('');   // 基礎情報それぞれ
  const { assesmentId, setAssesmentId } = useContext(MyContext);  // useContextでassesmentIdとsetAssesmentIdを取得
  const router = useRouter();  // useRouterのインスタンスを作成
 
  //おすすめエリアの生成と結果ページへ遷移
  const doResult = async (e) => {
    e.preventDefault();　// javascriptイベントの制御
    // 入力データ送信・診断結果生成・診断ID取得
    const res = await fetch(process.env.API_ENDPOINT + '/doResult', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "input":"dummy" }),
  
      });
    const data = await res.json();
    //setAssesmentId(data.assessmentId);            // 診断IDをコンテキストに保存
    router.push('/city-picker/result');      // 診断結果ページへ遷移
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
      <h1>基本情報の入力</h1>
      <form onSubmit={doResult}>

        {/* この中で基礎情報入力する */}
        <textarea
            //className={style.inputarea}
            className={`
              backdrop-blur-sm bg-white/70
              font-bold 
              text-black
            `}
            value={assesmentId}
            onChange={(e) => setSharedMsg(e.target.value)}
            rows={8} 
            cols={30}
        />
        <br />
        <button className="btn btn-outline btn-primary" type="submit">上記条件で、おすすめのエリアを見る→</button>
      </form>
      <button className="btn btn-outline btn-primary"  onClick={toAssessment}>←もう一度診断する</button>
      <button className="btn btn-outline btn-primary"  onClick={toIndex}>←最初の画面に戻る</button>
    </div>
  );
}
