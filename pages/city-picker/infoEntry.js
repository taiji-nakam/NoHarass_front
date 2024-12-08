// /pages/city-picker/infoEntry.js

import * as React from 'react';
import { useState, useContext, useEffect} from 'react';
import { MyContext } from '/context/MyContext';
import { useRouter } from 'next/router';
import styles from '../styles/common.module.css';  // 共通CSS
// import mstyles from '../app/style/infoEntry.module.css';   //カスタムCSS

export default function Home() {
  //基礎情報の作成とおすすめエリア表示ページへ遷移
  const [input, setInput] = useState('');   // 基礎情報それぞれ
  const { assessmentId, setAssessmentId } = useContext(MyContext);  // useContextでassessmentIdとsetAssessmentIdを取得
  const router = useRouter();  // useRouterのインスタンスを作成
  // フォームデータの状態管理
  const [formData, setFormData] = useState({
    age_group: '',
    country_origin: '',
    nearest_station: '',
    station_to_home: '',
    budget_lower_limit: '',
    budget_upper_limit: '',
    area_fg_smaller: false,
    area_fg_average: false,
    area_fg_larger: false,
  });
  // フォームデータの変更を処理
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  //おすすめエリアの生成と結果ページへ遷移
  const doResult = async (e) => {
    e.preventDefault(); // ページリロードを防止
    // 必須フィールドのチェック
    if (!formData.age_group || !formData.country_origin || !formData.nearest_station || !formData.budget_lower_limit || !formData.budget_upper_limit) {
      alert('すべての必須項目を入力してください');
      return;
    }
    console.log(formData);
    // 入力データ送信・診断結果生成・診断ID取得
    console.log(process.env.API_ENDPOINT + "/doResult")
    try {
      const response = await fetch(process.env.API_ENDPOINT + "/doResult", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ assessmentId, formData }), // 正しく formData を JSON に変換して送信
      });
      // レスポンスが正常であるかチェック
      if (!response.ok) {
        const errorText = await response.text(); // サーバーからのエラー詳細を取得
        throw new Error(`HTTP error! status: ${response.status}, details: ${errorText}`);
      }
      // レスポンスデータを JSON に変換
      const data = await response.json();
      // コンテキストに診断IDを保存
      setAssessmentId(data.assessmentId);
      // 結果ページに遷移
      router.push('/city-picker/result');
    } catch (error) {
      console.error('Error in doResult:', error);
    }
  };

  // 診断ページへ遷移
  const toAssessment = async (e) => {
    e.preventDefault();  // javascriptイベントの制御
    // router.push('/city-picker/assessment');      // 診断ページへ遷移
  };
  //Indexページへ遷移
  const toIndex = async (e) => {
    e.preventDefault();  // javascriptイベントの制御
  //  router.push('/city-picker');      // 診断結果ページへ遷移
  };
  return (
    <div className={styles.body}>
      <h1>基本情報の入力</h1>
      <form onSubmit={doResult}>
        {/* この中で基礎情報入力する */}
        <label>
          年齢層（例: 20代, 30代）:
          <input
            type="text"
            name="age_group"
            value={formData.age_group}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          出身国:
          <input
            type="text"
            name="country_origin"
            value={formData.country_origin}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          最寄り駅:
          <input
            type="text"
            name="nearest_station"
            value={formData.nearest_station}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          最寄り駅から家まで（分）:
          <input
            type="number"
            name="station_to_home"
            value={formData.station_to_home}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          予算下限（万円）:
          <input
            type="number"
            name="budget_lower_limit"
            value={formData.budget_lower_limit}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          予算上限（万円）:
          <input
            type="number"
            name="budget_upper_limit"
            value={formData.budget_upper_limit}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          エリア希望（小さめ）:
          <input
            type="checkbox"
            name="area_fg_smaller"
            checked={formData.area_fg_smaller}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          エリア希望（ふつう）:
          <input
            type="checkbox"
            name="area_fg_average"
            checked={formData.area_fg_average}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          エリア希望（大きめ）:
          <input
            type="checkbox"
            name="area_fg_larger"
            checked={formData.area_fg_larger}
            onChange={handleChange}
          />
        </label>
        <br />
        <button className="btn btn-outline btn-primary" type="submit">上記条件で、おすすめのエリアを見る→</button>
      </form>
      <button className="btn btn-outline btn-primary"  onClick={toAssessment}>←もう一度診断する</button>
      <button className="btn btn-outline btn-primary"  onClick={toIndex}>←最初の画面に戻る</button>
    </div>
  );
}