// 診断ページ
// /pages/city-picker/assessment.js
import * as React from 'react';
import { useState, useContext, useEffect } from 'react';
import { MyContext } from '/context/MyContext';
import { useRouter } from 'next/router';
import styles from '../styles/common.module.css';  // 共通CSS

export default function Home() {
  
  // 設問一覧の取得
  const [questions, setQuestions] = useState([
    { id: 1, text: '安全性は何よりも重要です。', category: 'safety' },
    { id: 2, text: '家賃は安いことが一番重要です。', category: 'cost' },
    { id: 3, text: 'スーパーは徒歩5分以内に欲しいです。', category: 'convenience' },
    { id: 4, text: '駅からは徒歩5分以内が良いです。', category: 'accessibility' },
    { id: 5, text: '隣の家の音は正直気になりません。', category: 'cost' },
    { id: 6, text: '深夜に一人で帰るので、安全が心配です。', category: 'safety' },
    { id: 7, text: '家賃と利便性を取るなら、少々交通等に不便であっても<br />家賃が抑えられることの方が重要です。', category: 'cost' },
    { id: 8, text: 'スーパーが近くにないと困ります。', category: 'convenience' },
    { id: 9, text: '駅までは自転車で10分ほどになると、少々不便だと感じます。', category: 'accessibility' },
    { id: 10, text: '貯金をしたいので、多少条件が悪くても安い方が良いです。', category: 'cost' },
    { id: 11, text: 'バス停が近くにあると便利なので重要です。', category: 'accessibility' },
    { id: 12, text: '突然の来訪（セールスや勧誘）はできるだけ避けたいです。', category: 'safety' },
    { id: 13, text: '住宅街よりは、いろいろなお店が近くにある方が良いです', category: 'convenience' },
  ]);

  const [answers, setAnswers] = useState({});
  const { assessmentId,setAssessmentId } = useContext(MyContext);  // useContextでassessmentIdとsetAssessmentIdを取得
  const router = useRouter();  // useRouterのインスタンスを作成

  // 回答変更時にステートを更新
  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  // 診断結果の生成と診断結果ページへ遷移
  const doAssessment = async (e) => {
    e.preventDefault();

    // カテゴリごとのスコアを計算
    const categoryScores = Object.entries(answers).reduce((acc, [questionId, value]) => {
      const question = questions.find(q => q.id === parseInt(questionId));
      if (!acc[question.category]) {
        acc[question.category] = [];
      }
      acc[question.category].push(parseInt(value));
      return acc;
    }, {});

    // 各カテゴリの平均スコアを計算
    const categoryAverages = {};
    for (const category in categoryScores) {
      const scores = categoryScores[category];
      categoryAverages[category] = scores.reduce((a, b) => a + b, 0) / scores.length;
    }

    // 質問と回答のペアを生成
    const questionValues = Object.entries(answers).map(([questionId, value]) => ({
      questionId: parseInt(questionId), 
      value: parseInt(value)
    }));

    console.log("===categoryScores:==="); // デバッグ用
    console.log(categoryScores); // デバッグ用
    console.log("===categoryAverages:==="); // デバッグ用
    console.log(categoryAverages); // デバッグ用
    console.log("===questionValues===");
    console.log(questionValues);

    e.preventDefault();　// javascriptイベントの制御
    // 入力データ送信・診断結果生成・診断ID取得
    const res = await fetch(process.env.API_ENDPOINT + '/doAssessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          categoryScores: categoryScores,
          categoryAverages: categoryAverages,
          questionValues: questionValues,
        }),

      });
    const data = await res.json();

    // 診断IDをコンテキストに保存する（次の画面で使えるようにする）
    setAssessmentId(data.assessment_id)
    console.log(data.assessment_id)

    router.push('/city-picker/assessmentResult');
  };

  // Indexページへ遷移
  const toIndex = (e) => {
    e.preventDefault();
    router.push('/city-picker');  // 最初の画面へ遷移
  };


  return (
    <div className={`${styles.body} bg-white`}>
      <div className="text-center my-4">
        <div className="flex justify-center items-center mb-2">
          <span className="text-xl font-bold">20%</span>
          <div className="relative w-full max-w-lg h-2 ml-2 bg-gray-300 rounded-full">
            <div className="absolute top-0 left-0 h-full bg-orange-500" style={{ width: '20%' }}></div>
          </div>
        </div>
        <h1 className="text-4xl font-bold text-center my-4">あなたにぴったりの<br />賃貸条件を探します</h1>
      </div>
      <form onSubmit={doAssessment}>
        {questions.map((question) => (
          <div key={question.id} className="space-y-2">
            <p className="text-xl text-center font-bold mt-4" dangerouslySetInnerHTML={{ __html: question.text }} />
            <div className="flex justify-between items-center gap-2">
              <span className="text-xl text-orange-500">賛成</span>
              <div className="flex-1 flex justify-between items-center gap-1">
                {[5, 4, 3, 2, 1].map((value, index) => (
                  <label
                    key={value}
                    className={`relative ${index === 0 || index === 4 ? 'w-11 h-11' : 'w-8 h-8'}`} // 左右のボタンは大きく、中の3つはそのまま
                  >
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={value}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      className="sr-only peer absolute inset-0" // ラジオボタン自体を非表示にし、配置を調整
                    />
                    <div
                      className={`
                        rounded-full border-2 cursor-pointer
                        peer-checked:bg-orange-500 peer-checked:border-orange-500
                        // 右端のボタンが選択されると青色
                        ${index === 4 ? 'peer-checked:bg-blue-500 peer-checked:border-blue-500 hover:border-blue-300' : ''}
                        // 右から2番目のボタンが選択されると青色
                        ${index === 3 ? 'peer-checked:bg-blue-500 peer-checked:border-blue-500 hover:border-blue-300' : ''}
                        // 中央のボタンが選択されると灰色
                        ${index === 2 ? 'peer-checked:bg-gray-400 peer-checked:border-gray-400 hover:border-gray-500' : ''}
                        border-gray-300 hover:border-orange-300
                        transition-colors duration-200
                        w-full h-full
                      `}
                    />
                  </label>
                ))}
              </div>
              <span className="text-xl text-blue-500">反対</span>
            </div>
            <div className="h-px bg-black" />
          </div>
        ))}
        <button type="submit" className="w-full bg-[#FFC107] hover:bg-[#FFD54F] text-black py-3 rounded-md transition duration-300 ease-in-out shadow-md font-bold my-4 text-2xl" >
          診断結果を見る →
        </button>
        <button
          type="button" onClick={toIndex}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-md transition duration-300 ease-in-out shadow-md mb-4"
        >
          ← 最初の画面に戻る
        </button>
      </form>
    </div>
  );
}
