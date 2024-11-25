// frontend/pages/shareTest.js
import * as React from 'react';
import { useState, useContext, useEffect} from 'react';
import { MyContext } from '../context/MyContext';
import { useRouter } from 'next/router';
import styles from '../app/style/shareTest.module.css';

export default function shareTest() {

    // msg連携:useContextでsharedMsgとsetSharedMsgを取得
    const { sharedMsg, setSharedMsg } = useContext(MyContext);
    const router = useRouter();  // useRouterのインスタンスを作成
    const shareBackpage = async (e) => {
      e.preventDefault();　// javascriptイベントの制御
      // setSharedMsg(data.message);　// textboxのデータを使うため不要
      router.push('/');      // テストページへ遷移
    };

    return (
        <div>
          <h1 className={`
            my-4
            font-bold text-5xl tracking-tight
            bg-gradient-to-r from-pink-500 via-blue-500 to-green-500
            bg-clip-text text-transparent 
            `}>元ページからのメッセージ</h1>
          <form onSubmit={shareBackpage}>
            <textarea
                className={`
                backdrop-blur-sm bg-white/70
                font-bold 
                text-black
                `}
                value={sharedMsg}
                onChange={(e) => setSharedMsg(e.target.value)}
                rows={8} 
                cols={30}
            />
            <br />
            <button class="btn btn-outline btn-primary" type="submit">元ページへ</button>
          </form>
        </div>
      );
};


