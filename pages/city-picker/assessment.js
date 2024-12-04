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
    { id: 5, text: '騒音が気になるので、木造は嫌です。', category: 'environment' },
    { id: 6, text: '深夜に一人で帰るので、安全が心配です。', category: 'safety' },
    { id: 7, text: '家賃と利便性を取るなら、利便性が悪くても家賃が抑えられることの方が重要です。', category: 'cost' },
    { id: 8, text: 'スーパーが近くにないと困ります。', category: 'convenience' },
    { id: 9, text: '駅までは自転車で10分ほどになると、少々不便だと感じます。', category: 'accessibility' },
  ]);

  const [answers, setAnswers] = useState({});
  const { setAssesmentId } = useContext(MyContext);  // useContextでassesmentIdとsetAssesmentIdを取得
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

    console.log(categoryAverages); // デバッグ用

    e.preventDefault();　// javascriptイベントの制御
    // 入力データ送信・診断結果生成・診断ID取得
    const res = await fetch(process.env.API_ENDPOINT + '/doAssessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // はらちゃん；ここでcategoryScoresとcategoryAveragesの内容をJSONにして渡したいです
        body: JSON.stringify({ "input":"dummy" }),
  
      });
    const data = await res.json();
    console.log(data)

    // 診断IDをコンテキストに保存する場合は以下を追加（必要に応じて）
    // setAssesmentId(categoryAverages);

    router.push('/city-picker/assessmentResult');
  };

  // Indexページへ遷移
  const toIndex = (e) => {
    e.preventDefault();
    router.push('/city-picker');  // 最初の画面へ遷移
  };

  return (
    <div className={styles.body}>
      <h1 className="text-2xl font-bold text-center mb-2">あなたにぴったりの賃貸条件を探します</h1>
      <form onSubmit={doAssessment}>
        {questions.map((question) => (
          <div key={question.id} className="space-y-4">
            <p className="text-lg">{question.text}</p>
            <div className="flex justify-between items-center gap-2">
              <span className="text-sm text-gray-500">賛成</span>
              <div className="flex-1 flex justify-between items-center">
                {[5, 4, 3, 2, 1].map((value) => (
                  <label key={value} className="relative">
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={value}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      className="sr-only peer"
                    />
                    <div className={`
                      w-8 h-8 rounded-full border-2 cursor-pointer
                      peer-checked:bg-orange-500 peer-checked:border-orange-500
                      border-gray-300 hover:border-orange-300
                      transition-colors duration-200
                    `} />
                  </label>
                ))}
              </div>
              <span className="text-sm text-gray-500">反対</span>
            </div>
            <div className="h-px bg-gray-200" />
          </div>
        ))}
        <button type="submit" className="w-full bg-[#FFC107] hover:bg-[#FFD54F] text-black py-3 rounded-md transition duration-300 ease-in-out shadow-md font-bold">
          診断結果を見る →
        </button>
        <button
          type="button" onClick={toIndex}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-md transition duration-300 ease-in-out shadow-md"
        >
          ← 最初の画面に戻る
        </button>
      </form>
    </div>
  );
}
