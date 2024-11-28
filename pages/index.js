// frontend/pages/index.js
import * as React from 'react';
import { useState, useContext, useEffect} from 'react';
import { MyContext } from '../context/MyContext';
import { useRouter } from 'next/router';
import styles from '../app/style/index.module.css';

export default function Home() {

  //画面遷移とデータシェア
  const { sharedMsg, setSharedMsg } = useContext(MyContext);  // useContextでsharedMsgとsetSharedMsgを取得
  const router = useRouter();  // useRouterのインスタンスを作成

  const shareNextpage = async (e) => {
    e.preventDefault();　// javascriptイベントの制御
    console.log('to Next Page!!');
    console.log(sharedMsg);
    // setSharedMsg(data.message);　// textboxのデータを使うため不要
    router.push('/shareTest');      // テストページへ遷移
  };

  //OpenAI連携テスト
  //動的なGETリクエストの送信
  const [prompt, setPrompt] = useState('');
  const [gptResult, setGptResult] = useState('');

  // プロンプトを送信し結果を出力
  const handleGptRequest = async (e) => {
    e.preventDefault();

    const res = await fetch(process.env.API_ENDPOINT + '/requestGpt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ "message":prompt }),

    });
    console.log(JSON.stringify({ "message":prompt }));
    const data = await res.json();

    //バックエンドからのレスポンスをコンソールに表示
    console.log("Backendからのお返事:", data.message);

    setGptResult(data.message);
  };

  //GETリクエストを送信
  const [getResponse, setGetResponse] = useState('');

  const handleGetRequest = async () => {
    console.log(process.env.API_ENDPOINT);
    const res = await fetch(process.env.API_ENDPOINT + '/subHello', {
      method: 'GET',
    });
    const data = await res.json();

    console.log(sharedMsg);

    // GETリクエストの結果をコンソールに表示
    console.log("GETリクエストの結果:", data.message);

    setGetResponse(data.message);
  };

  //動的なGETリクエストの送信
  const [id, setId] = useState('');
  const [idResponse, setIdResponse] = useState('');

  // IDを指定してGETリクエストを送信
  const handleIdRequest = async (e) => {
    e.preventDefault();
    const res = await fetch(process.env.API_ENDPOINT + `/multiply/${id}`, {
      method: 'GET',
    });
    const data = await res.json();

    // IDリクエストの結果をコンソールに表示
    console.log("IDリクエストの結果:", data.doubled_value);

    setIdResponse(data.doubled_value);
  };

  //POSTリクエストを送信
  const [input, setInput] = useState('');
  const [postResponse, setPostResponse] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    //入力されたデータをコンソールに表示
    console.log("入力情報:", input);

    const res = await fetch(process.env.API_ENDPOINT + '/echo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ "message":input }),

    });
    console.log(JSON.stringify({ "message":input }));
    const data = await res.json();

    //バックエンドからのレスポンスをコンソールに表示
    console.log("Backendからのお返事:", data.message);

    setPostResponse(data.message);
  };


  return (
    <div className={styles.body}>
      <h1 className={`
        my-4
        font-bold text-5xl tracking-tight
        bg-gradient-to-r from-pink-500 via-blue-500 to-green-500
        bg-clip-text text-transparent 
        `}>Tailwind適用OK</h1>
      <div className="chat chat-start">
        <div className="chat-image avatar">
          <div className="w-10 rounded-full">
            <img
              alt="Tailwind CSS chat bubble component"
              src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
          </div>
        </div>
        <div className="chat-bubble">Daisyui適用OK</div>
      </div>
      <br />
      <h1>ページ遷移とデータ共有</h1>
      <form onSubmit={shareNextpage}>
        <textarea
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
        />
        <br />
        <button className="btn btn-outline btn-primary" type="submit">次ページへ</button>
      </form>
      <br />  
      <h1>OpenAI連携テスト：プロンプト</h1>
      <form onSubmit={handleGptRequest}>
        <textarea
            //className={style.inputarea}
            className={`
              backdrop-blur-sm bg-white/70
              font-bold 
              text-black
            `}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={8} 
            cols={30}
        />
        <br />
        <button className="btn btn-outline btn-primary" type="submit">GPTへ聞く</button>
        {gptResult && <p>GPTからの返答: {gptResult}</p>}
      </form>
      <br />  
      <h1>Next.jsとFlaskの連携アプリ</h1>
      <button onClick={handleGetRequest}>GETリクエストを送信</button>
      {getResponse && <p>サーバーからのGET応答: {getResponse}</p>}

      <h2>IDを指定してGETリクエストを送信</h2>
      <form onSubmit={handleIdRequest}>
        <input
          type="number"
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="IDを入力してください"
        />
        <button type="submit">送信</button>
      </form>
      {idResponse && <p>Flaskからの応答: {idResponse}</p>}

      <h2>POSTリクエストを送信</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}

          onChange={(e) => setInput(e.target.value)}
          placeholder="テキストを入力してください"
        />

        <button type="submit">送信</button>
      </form>
      {postResponse && <p>FlaskからのPOST応答: {postResponse}</p>}

    </div>
  );
}
