'use client'

import React, { useState, useEffect, useContext } from 'react';
import { MyContext } from '/context/MyContext';
import { useRouter } from 'next/router';
import Image from 'next/image';
import styles from '../styles/common.module.css';

const CustomInput = () => {
  const { assessmentId } = useContext(MyContext);
  const [rankings, setRankings] = useState([
    { id: 'safety', label: '治安（安全性）重視', rank: 0 },
    { id: 'cost', label: '家賃重視', rank: 0 },
    { id: 'convenience', label: '利便性が良い(買い物等)', rank: 0 },
    { id: 'accessibility', label: 'アクセスが良い', rank: 0 },
  ]);
  const [results, setResults] = useState([]);
  const router = useRouter();

  const handleRankChange = (id, rank) => {
    setRankings(rankings.map(item => {
      if (item.id === id) {
        return { ...item, rank };
      }
      if (item.rank === rank) {
        return { ...item, rank: 0 };  // Reset rank if the same rank is clicked
      }
      return item;
    }));
  };

  useEffect(() => {
    const fetchResults = async () => {
      if (!assessmentId) {
        console.warn('診断IDがありません。');
        return;
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/assessmentResult?assessmentId=${assessmentId}`);
        if (!res.ok) throw new Error(`診断結果の取得に失敗しました: ${res.statusText}`);
        const data = await res.json();

        // Simple category name mapping
        const categoryMap = {
          "convenience": "利便性",
          "safety": "治安",
          "cost": "安さ",
          "accessibility": "アクセスの良さ"
        };

        const sortedResults = data
          .map(result => ({
            ...result,
            category: categoryMap[result.category] || result.category,  // Simplified
            priority: parseFloat(result.priority.toFixed(2)),
          }))
          .sort((a, b) => b.priority - a.priority);

        setResults(sortedResults);
      } catch (error) {
        console.error('診断結果の取得中にエラーが発生しました:', error);
      }
    };

    fetchResults();
  }, [assessmentId]);

  const toInfoEntry = () => {
    if (rankings.every(item => item.rank !== 0)) {  // Check if all ranks are assigned
      router.push('/city-picker/infoEntry');
    } else {
      alert('全ての項目に順位をつけてください。');
    }
  };

  const toIndex = () => {
    router.push('/city-picker');
  };

  return (
    <div className={`${styles.body} flex justify-center items-center bg-white min-h-screen p-4`}>
      <div className="flex justify-center items-center mb-2">
        <span className="text-xl font-bold">40%</span>
        <div className="relative w-[300px] max-w-lg h-2 ml-2 bg-gray-300 rounded-full">
          <div className="absolute top-0 left-0 h-full bg-orange-500" style={{ width: '40%' }}></div>
        </div>
      </div>
      <div className="bg-orange-100 rounded-lg p-6 mb-6 max-w-3xl mx-auto w-full">
        <h1 className="text-xl font-bold text-center mb-4">診断結果</h1>
        <p className="text-center mb-4">あなたの家選びで優先すべき事項は：</p>
        <div className="flex justify-center">
          <div className="relative w-full max-w-md">
            <Image
              src="/images/chintai_owner_nyuukyosya.png"
              alt="Chintai Logo"
              width={200}
              height={200}
              className="mx-auto w-auto h-auto"
              priority
            />
          </div>
        </div>
      </div>
      <div className="max-w-md mx-auto mt-10 p-5 bg-white rounded shadow">
        <h1 className="text-xl font-bold mb-4 text-center">家選びで重視したい項目に、1位から4位まで順位をつけてください</h1>
        <div className="space-y-3">
          {rankings.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded hover:bg-gray-100">
              <span className="text-gray-700">{item.label}</span>
              <div className="flex space-x-2">
                {[1, 2, 3, 4].map((rank) => (
                  <button
                    key={rank}
                    onClick={() => handleRankChange(item.id, rank)}
                    className={`w-8 h-8 rounded-full ${item.rank === rank ? 'bg-yellow-400 text-white' : 'bg-gray-200 text-gray-700'} font-bold`}
                  >
                    {rank}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {results.length > 0 && (
        <div className="space-y-6 mt-8">
          {results.map((result, index) => (
            <div key={index} className="mb-6">
              <h2 className="text-lg font-bold mb-2 flex justify-between items-center">
                <span>{index + 1}. {result.category}</span>
                <span className="text-sm font-normal bg-gray-100 px-2 py-1 rounded">
                  優先度: {result.priority.toFixed(2)}
                </span>
              </h2>
              <p className="text-gray-700 text-sm leading-relaxed">
                {result.description}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 space-y-4">
        <button
          onClick={toInfoEntry}
          className="w-full bg-yellow-400 text-black py-3 px-4 rounded-lg font-medium hover:bg-yellow-500 transition-colors"
        >
          さらに基本情報を追加して、おすすめエリア診断に進む→
        </button>
        <button
          onClick={toIndex}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-md transition duration-300 ease-in-out shadow-md mb-4"
        >
          ←ホームに戻る
        </button>
      </div>
    </div>
  );
};

export default CustomInput;
