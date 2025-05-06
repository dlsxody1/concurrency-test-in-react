import { useState, useTransition, Suspense, type FC } from "react";
import "./App.css";

import { generateUsers, type User } from "./data";
import SearchBox from "./components/SearchBox";
import UserList from "./components/UserList";
import CpuIntensiveTask from "./components/CpuIntensiveTask";

// 사용자 데이터 생성
const users: User[] = generateUsers(10000); // 10,000명의 사용자 데이터 생성

const App: FC = () => {
  const [query, setQuery] = useState<string>("");
  //useTransition은 어떠한 매개변수도 받지 않음!
  //isPending 플래그는 대기중인 Transition이 있는지 알려줌
  //startTransition 함수는 상태 업데이트를 Transition으로 표시할 수 있음.
  const [isPending, startTransition] = useTransition();
  const [concurrencyEnabled, setConcurrencyEnabled] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // 검색 처리 함수
  const handleSearch = (searchQuery: string): void => {
    if (concurrencyEnabled) {
      // 동시성 모드: useTransition 사용
      // startTransition에 전달된 함수를 Action이라고 함.
      startTransition(() => {
        setQuery(searchQuery);
      });
    } else {
      // 일반 모드: 직접 상태 업데이트
      setQuery(searchQuery);
    }
  };

  // 동시성 모드 전환 함수
  const toggleConcurrencyMode = (): void => {
    setConcurrencyEnabled(!concurrencyEnabled);
  };

  // CPU 부하 시작 함수
  const startCpuIntensiveTask = (): void => {
    setIsProcessing(true);
  };

  // CPU 부하 중지 함수
  const stopCpuIntensiveTask = (): void => {
    setIsProcessing(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 font-sans">
      <h1 className="text-center mb-8">React 동시성 데모</h1>

      <div className="flex flex-col items-center mb-8">
        <button
          onClick={toggleConcurrencyMode}
          className={`${
            concurrencyEnabled
              ? "bg-green-500 hover:bg-green-600"
              : "bg-blue-500 hover:bg-blue-600"
          } text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all duration-200 mb-4 text-lg`}
        >
          {concurrencyEnabled ? "동시성 모드 ON" : "동시성 모드 OFF"}
        </button>

        <div className="flex items-center gap-3 bg-gray-100 p-3 rounded-lg">
          <div
            className={`h-3 w-3 rounded-full ${
              concurrencyEnabled ? "bg-green-500" : "bg-blue-500"
            }`}
          ></div>
          <p className="font-medium">
            현재 모드: {concurrencyEnabled ? "동시성 모드" : "일반 모드"}
          </p>
        </div>

        {isPending && (
          <div className="mt-4 flex items-center gap-2 text-amber-600 font-bold pending-indicator">
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>처리 중...</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <h2 className="mb-4">사용자 검색</h2>
          <SearchBox onSearch={handleSearch} />
        </div>

        <div className="card">
          <h2 className="mb-4">CPU 부하 생성</h2>
          <div className="flex gap-3">
            <button
              onClick={startCpuIntensiveTask}
              disabled={isProcessing}
              className={`${isProcessing ? "btn-disabled" : "btn btn-danger"}`}
            >
              무거운 계산 시작
            </button>
            <button
              onClick={stopCpuIntensiveTask}
              disabled={!isProcessing}
              className={`${
                !isProcessing ? "btn-disabled" : "btn btn-success"
              }`}
            >
              무거운 계산 중지
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3>검색 결과</h3>
            <div className="bg-gray-100 px-3 py-1 rounded-full text-sm font-medium text-gray-600">
              {query ? "검색어: " + query : "전체 사용자"}
            </div>
          </div>

          <Suspense
            fallback={
              <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            }
          >
            <UserList users={users} query={query} />
          </Suspense>
        </div>

        {isProcessing && (
          <div className="card">
            <CpuIntensiveTask />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
