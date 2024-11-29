// 診断ページ
// /pages/city-picker/assessment.js
import * as React from 'react';
import { useState, useContext, useEffect} from 'react';
import { MyContext } from '/context/MyContext';
import { useRouter } from 'next/router';
import styles from '../styles/common.module.css';  // 共通CSS
// import mstyles from '../app/style/assessment.module.css';   //カスタムCSS

import fetchQuestions from "../api/fetchQuestions"; //質問データの取得モジュール

export default function Home() {

  // 設問一覧の取得
  const [questions, setQuestions] = useState([]);
  useEffect(() => {
      const fetchAndSetQuestion = async () => {
          const questionsData = await fetchQuestions();
          setQuestions(questionsData);
      };
      fetchAndSetQuestion();
  }, []);
  
  //診断結果の作成と診断結果ページへ遷移
  const [input, setInput] = useState('');   // 選択パラメータ ※配列？
  const { assesmentId, setAssesmentId } = useContext(MyContext);  // useContextでassesmentIdとsetAssesmentIdを取得
  const router = useRouter();  // useRouterのインスタンスを作成
 
  //診断結果の生成と診断結果ページへ遷移
  const doAssessment = async (e) => {
    e.preventDefault();　// javascriptイベントの制御
    // 入力データ送信・診断結果生成・診断ID取得
    const res = await fetch(process.env.API_ENDPOINT + '/doAssessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "input":input }),
  
      });
    const data = await res.json();
    //setAssesmentId(data.assessmentId);            // 診断IDをコンテキストに保存
    router.push('/city-picker/assessmentResult');      // 診断結果ページへ遷移
  };

  //Indexページへ遷移
  const toIndex = async (e) => {
    e.preventDefault();　// javascriptイベントの制御
    router.push('/city-picker');      // 診断結果ページへ遷移
  };

  return (
    <div className={styles.body}>
      <h1>あなたにぴったりの賃貸条件を探します</h1>
      <form onSubmit={doAssessment}>
        {/* この中でQuestionsのデータを出力する */}
        {/* <textarea
            //className={style.inputarea}
            className={`
              backdrop-blur-sm bg-white/70
              font-bold 
              text-black
            `}
            value={sharedMsg}
            onChange={(e) => setSharedMsg(e.target.value)}
            rows={8} 
            cols={30}
        /> */}
        <br />
        <button className="btn btn-outline btn-primary" type="submit">診断結果を見る→</button>
      </form>
      <button className="btn btn-outline btn-primary"  onClick={toIndex}>←最初の画面に戻る</button>
    </div>
  );
}
