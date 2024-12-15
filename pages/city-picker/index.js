import * as React from 'react';
import { useState, useContext } from 'react';
import { MyContext } from '/context/MyContext';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  const { sharedMsg, setSharedMsg } = useContext(MyContext);
  const router = useRouter();

  const [language, setLanguage] = useState('日本語');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLanguageChange = (selectedLanguage) => {
    setLanguage(selectedLanguage);
    setIsDropdownOpen(false);
  };

  //https://zenn.dev/steelydylan/articles/nextjs-with-i18n言語ドロップダウンの参考
  return (
    <div className="min-h-screen bg-white p-4 flex flex-col items-center relative">
      {/* Language ドロップダウン */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="inline-flex justify-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow ring-1 ring-gray-300 hover:bg-gray-50"
        >
          Language: {language}
          <svg className="-mr-1 h-5 w-5 ml-2 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 011.06 0L10 11.94l3.72-3.72a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.22 9.28a.75.75 0 010-1.06z" clipRule="evenodd" />
          </svg>
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-40 rounded-md bg-white shadow-lg ring-1 ring-black/5">
            <div className="py-1">
              <button 
                onClick={() => handleLanguageChange('日本語')}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                日本語
              </button>
              <button 
                onClick={() => handleLanguageChange('English')}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                English
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="w-full max-w-md bg-[#FF9800] rounded-lg p-6 mb-8 shadow-md mt-16">
        <h1 className="text-2xl font-bold text-black text-center">
          Apartment Hunting
          <br />
          For Foreigners
        </h1>
      </div>

      <div className="relative w-full max-w-md mb-8">
        <Image
          src="/images/apartment-hunting-logo.png"
          alt="Apartment Hunting Logo"
          width={180}
          height={180}
          className="w-full h-auto"
          priority
        />
      </div>

      <div className="w-full max-w-md space-y-6">
        <h2 className="text-2xl font-bold text-center">賃貸診断を</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <Link href="/city-picker/assessment" className="w-full">
            <button 
              className="w-full h-14 text-xl bg-[#FFC107] hover:bg-[#FFD54F] text-black rounded-md transition duration-300 ease-in-out shadow-md"
            >
              する
            </button>
          </Link>
          
          <Link href="/city-picker/customInput" className="w-full">
            <button 
              className="w-full h-14 text-xl bg-[#FFC107] hover:bg-[#FFD54F] text-black rounded-md transition duration-300 ease-in-out shadow-md"
            >
              しない
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

