'use client'

import * as React from 'react'
import { useState, useContext, useEffect } from 'react'
import { MyContext } from '/context/MyContext'
import { useRouter } from 'next/router'
import styles from '../styles/common.module.css'
import Image from 'next/image';


export default function AssessmentResult() {
  const { assessmentId } = useContext(MyContext)
  const [results, setResults] = useState([])
  const router = useRouter()

  const toInfoEntry = (e) => {
    e.preventDefault()
    router.push('/city-picker/infoEntry')
  }

  const toAssessment = (e) => {
    e.preventDefault()
    router.push('/city-picker/assessment')
  }

  const toIndex = (e) => {
    e.preventDefault()
    router.push('/city-picker')
  }

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch(`${process.env.API_ENDPOINT}/assessmentResult?assessmentId=${assessmentId}`)
        if (!res.ok) throw new Error(`診断結果の取得に失敗しました: ${res.statusText}`)
        const data = await res.json()

        const categoryMap = {
          "convenience": "利便性",
          "safety": "治安",
          "cost": "安さ",
          "accessibility": "アクセスの良さ"
        }

        const categoryDescriptions = {
          "利便性": "近くにスーパーやドラッグストアー、コンビニなど、生活に必要なものが徒歩5分圏内にあるかどうかを重要視していますね。",
          "治安": "夜に一人で帰ったり、遅い時間に外出する可能性、近隣住民のマナー等を気にしていますね。また、防犯の為、2階以上のお部屋がよさそうです。",
          "安さ": "安さは平均程度か、それ以上でも、上記の利便性と治安が良ければ気にしないようですね。",
          "アクセスの良さ": "駅やバス停などが近くにあり、移動がしやすいことを重視していますね。",
        }

        const sortedResults = data
          .map(result => ({
            ...result,
            category: categoryMap[result.category] || result.category,
            description: categoryDescriptions[categoryMap[result.category]] || '',
            priority: parseFloat(result.priority.toFixed(2))  // 優先度を小数点以下2桁に制限
          }))
          .sort((a, b) => b.priority - a.priority)

        setResults(sortedResults)
      } catch (error) {
        console.error('診断結果の取得中にエラーが発生しました:', error)
      }
    }

    if (assessmentId) {
      fetchResults()
    } else {
      console.warn('診断IDがありません。')
    }
  }, [assessmentId])

  return (
    <div className={`${styles.body} bg-white min-h-screen`}>
      <div className="flex justify-center items-center mb-2">
        <span className="text-xl font-bold">40%</span>
        <div className="relative w-[400px] max-w-lg h-2 ml-2 bg-gray-300 rounded-full">
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
        {/* 結果の表示 */}
        {results.length > 0 ? (
          <div className="space-y-6">
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
        ) : (
          <p className="text-gray-500 text-center">診断結果を取得中...</p>
        )}

        {/* 下段のボタン */}
        <div className="mt-8 space-y-4">
          <button
            onClick={toInfoEntry}
            className="w-full bg-yellow-400 text-black py-3 px-4 rounded-lg font-medium hover:bg-yellow-500 transition-colors"
          >
            さらに基本情報を追加して、おすすめエリア診断に進む→
          </button>
          <button
            onClick={toAssessment}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-md transition duration-300 ease-in-out shadow-md mb-4"
          >
            ←もう一度診断する
          </button>
          <button
            onClick={toIndex}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-md transition duration-300 ease-in-out shadow-md mb-4"
          >
            ←ホームに戻る
          </button>
        </div>
      </div>
  )
}

