import * as React from 'react';
import { useState, useContext } from 'react';
import { MyContext } from '/context/MyContext';
import { useRouter } from 'next/router';
import styles from '../styles/common.module.css';

export default function Home() {
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

  const { assessmentId, setAssessmentId } = useContext(MyContext);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const doResult = async (e) => {
    e.preventDefault();
    if (!formData.age_group || !formData.country_origin || !formData.nearest_station || !formData.budget_lower_limit || !formData.budget_upper_limit) {
      alert('すべての必須項目を入力してください');
      return;
    }
    try {
      const response = await fetch(process.env.API_ENDPOINT + "/doResult", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ assessmentId, formData }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, details: ${errorText}`);
      }
      const data = await response.json();
      // setAssessmentId(data.assessmentId);
      router.push('/city-picker/result');
    } catch (error) {
      console.error('Error in doResult:', error);
    }
  };

  const toAssessment = (e) => {
    e.preventDefault();
    router.push('/city-picker/assessment');
  };

  const toIndex = (e) => {
    e.preventDefault();
    router.push('/city-picker');
  };

  const progressPercentage = 60;  // プログレスバーの進行度
  return (
    <div className={`${styles.body} bg-white`}>
      {/* プログレスバー */}
      <div className="text-center my-4">
        <div className="flex justify-center items-center mb-2">
          <span className="text-xl font-bold">60%</span>
          <div className="relative w-[400px] max-w-lg h-2 ml-2 bg-gray-300 rounded-full">
            <div className="absolute top-0 left-0 h-full bg-orange-500" style={{ width: '60%' }}></div>
          </div>
        </div>
      </div>

      {/* フォーム */}
      <form onSubmit={doResult} className="max-w-md mx-auto px-4">
        {/* Basic Information Section */}
        <div className="text-xl font-bold mb-4">基本情報の入力</div>

        {/* Country and Age Group */}
        <div className="bg-[#FFF5E6] p-4 rounded-lg mb-4">
          <div className="mb-3 flex items-center">
            <label className="text-sm mr-3 w-16">出身国</label>
            <input
              type="text"
              name="country_origin"
              value={formData.country_origin}
              onChange={handleChange}
              required
              className="w-30 p-2 border rounded-md"
              placeholder="アメリカ"
            />
          </div>
          <div>
            <label className="text-sm mr-12 w-16">年齢</label>
            <input
              type="number"
              name="age_group"
              value={formData.age_group}
              onChange={handleChange}
              required
              className="w-24 p-2 border rounded-md"
              placeholder="23"
              inputMode="numeric" // プルダウンで設定できるように
            />
            <span className="text-sm ml-2">歳</span>
          </div>
        </div>
        {/* Location Section */}
        <div className="bg-[#FFF5E6] p-4 rounded-lg mb-4">
          <div className="font-medium mb-2">住む場所を決める</div>
          <div className="mb-3">
            <label className="block text-sm mb-1">通学・通勤先の最寄り駅</label>
            <input
              type="text"
              name="nearest_station"
              value={formData.nearest_station}
              onChange={handleChange}
              required
              className="w-30 p-2 border rounded-md ml-20"
              placeholder="駅名を入力してください"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm mr-4">所要時間</label>
            <select
              name="station_to_home"
              value={formData.station_to_home || 15}  // 初期値15を設定
              onChange={handleChange}
              required
              className="p-2 border rounded-md"
            >
              {[...Array(60)].map((_, i) => (
                <option key={i} value={i + 1}>{i + 1}</option>
              ))}
            </select>
            <span className="text-sm">分</span>
          </div>
        </div>

        {/* Budget Section */}
        <div className="bg-[#FFF5E6] p-4 rounded-lg mb-4">
          <div className="font-medium mb-2">予算を決める</div>
          <div className="flex items-center gap-2 mb-2">
            <label className="text-sm">下限</label>
            <input
              type="number"
              name="budget_lower_limit"
              value={formData.budget_lower_limit}
              onChange={handleChange}
              required
              className="w-24 p-2 border rounded-md"
              placeholder="50,000"
            />
            <span className="text-sm">〜上限</span>
            <input
              type="number"
              name="budget_upper_limit"
              value={formData.budget_upper_limit}
              onChange={handleChange}
              required
              className="w-24 p-2 border rounded-md"
              placeholder="100,000"
            />
            <span className="text-sm">円まで</span>
          </div>
        </div>

        {/* Area Preferences */}
        <div className="bg-[#FFF5E6] p-4 rounded-lg mb-6">
          <div className="font-medium mb-2">その他こだわり条件</div>
          <div className="text-sm mb-2">面積</div>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="area_fg_smaller"
                checked={formData.area_fg_smaller}
                onChange={handleChange}
                className="mr-2"
              />
              一人暮らし狭め（〜19㎡）
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="area_fg_average"
                checked={formData.area_fg_average}
                onChange={handleChange}
                className="mr-2"
              />
              一人暮らし平均（20〜29㎡）
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="area_fg_larger"
                checked={formData.area_fg_larger}
                onChange={handleChange}
                className="mr-2"
              />
              一人暮らし広め（30〜45㎡）
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            type="submit"
            className="w-full bg-[#FFC107] hover:bg-[#FFD54F] text-black py-3 px-4 rounded-md font-bold text-center"
          >
            上記条件で、おすすめエリアを見る→
          </button>
          <button
            type="button"
            onClick={toAssessment}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 px-4 rounded-md text-center"
          >
            ←もう一度診断する
          </button>
          <button
            type="button"
            onClick={toIndex}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 px-4 rounded-md text-center"
          >
            ←ホームに戻る
          </button>
        </div>
      </form>
    </div>
  );
}

