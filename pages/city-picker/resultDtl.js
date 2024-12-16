// エリア詳細結果表示ページ
// /pages/city-picker/resultDtl.js

import * as React from 'react';
import { useState, useContext, useEffect} from 'react';
import { MyContext } from '/context/MyContext';
import { useRouter } from 'next/router';
import styles from '../styles/common.module.css';  // 共通CSS
import Image from 'next/image';
// import mstyles from '../app/style/customInput.module.css';   //カスタムCSS

export default function Home() {
 
  const router = useRouter();  // useRouterのインスタンスを作成
   
  //Indexページへ遷移
  const toIndex = async (e) => {
    e.preventDefault();  // javascriptイベントの制御
    router.push('/city-picker');      // 診断結果ページへ遷移
  };

  return (
    <div className={`${styles.body} flex items-center bg-white min-h-screen p-4`}>
      <div className="flex justify-center items-center mb-2">
        <span className="text-xl font-bold">100%</span>
        <div className="relative w-[300px] max-w-full h-2 ml-2 bg-gray-300 rounded-full">
          <div className="absolute top-0 left-0 h-full bg-orange-500" style={{ width: '100%' }}></div>
        </div>
      </div>
      <h1 className="text-4xl font-bold text-center my-4">エリア詳細情報</h1>
      <div className="relative w-[200px] sm:w-[250px] md:w-[300px] lg:w-[350px]">
        <Image
          src="/images/ready.png"
          alt="Ready Logo"
          width={200}
          height={200}
          className="mx-auto w-auto h-auto"
          priority
        />
      </div>
      <button className="btn btn-outline btn-primary" >物件14件の詳細を見る→</button>
      <button className="btn btn-outline btn-primary"  onClick={toIndex}>←最初の画面に戻る</button>
    </div>
  );
}
