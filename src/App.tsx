// App.tsx
import { useState, useTransition, Suspense, type FC, useCallback } from "react";
import "./App.css";

import { generateUsers, type User } from "./data";
import SearchBox from "./components/SearchBox";
import UserList from "./components/UserList";
import CpuIntensiveTask from "./components/CpuIntensiveTask";

// 사용자 데이터 생성
const users: User[] = generateUsers(1000); // 1000명의 사용자 데이터 생성

// 모드 타입 정의
type AppMode = "normal" | "debounce" | "concurrency";

const App: FC = () => {
  const [query, setQuery] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const [mode, setMode] = useState<AppMode>("concurrency"); // 기본값은 동시성 모드
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // 현재 모드가 디바운스인지 확인
  const isDebounceMode = mode === "debounce";

  // 현재 모드가 동시성인지 확인
  const isConcurrencyMode = mode === "concurrency";

  // 검색 처리 함수
  const handleSearch = useCallback(
    (searchQuery: string): void => {
      // 이전 쿼리와 같다면 상태 업데이트 방지
      if (query === searchQuery) return;

      if (isConcurrencyMode) {
        // 동시성 모드: useTransition 사용
        startTransition(() => {
          setQuery(searchQuery);
        });
      } else {
        // 일반 모드 또는 디바운스 모드: 직접 상태 업데이트
        setQuery(searchQuery);
      }
    },
    [isConcurrencyMode, query]
  );

  // 모드 전환 함수
  const toggleMode = (): void => {
    setMode((prevMode) => {
      if (prevMode === "normal") return "debounce";
      if (prevMode === "debounce") return "concurrency";
      return "normal";
    });
  };

  // 모드에 따른 버튼 스타일과 텍스트 설정
  const getModeButtonStyle = (): string => {
    if (mode === "normal") return "bg-blue-500 hover:bg-blue-600";
    if (mode === "debounce") return "bg-purple-500 hover:bg-purple-600";
    return "bg-green-500 hover:bg-green-600";
  };

  const getModeButtonText = (): string => {
    if (mode === "normal") return "일반 모드";
    if (mode === "debounce") return "디바운스 모드";
    return "동시성 모드";
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
          onClick={toggleMode}
          className={`${getModeButtonStyle()} text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all duration-200 mb-4 text-lg`}
        >
          {getModeButtonText()}
        </button>

        <div className="flex items-center gap-3 bg-gray-100 p-3 rounded-lg">
          <div
            className={`h-3 w-3 rounded-full ${
              mode === "normal"
                ? "bg-blue-500"
                : mode === "debounce"
                ? "bg-purple-500"
                : "bg-green-500"
            }`}
          ></div>
          <p className="font-medium">현재 모드: {getModeButtonText()}</p>
        </div>
        <div className="h-[50px]">
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <h2 className="mb-4">사용자 검색</h2>
          <SearchBox onSearch={handleSearch} useDebounce={isDebounceMode} />
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

      <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="font-medium text-lg mb-2">모드 설명</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <span className="font-medium text-blue-600">일반 모드:</span> 최적화
            없이 모든 입력이 즉시 검색 결과에 반영됩니다.
          </li>
          <li>
            <span className="font-medium text-purple-600">디바운스 모드:</span>{" "}
            타이핑이 멈춘 후 300ms가 지난 후에만 검색이 실행됩니다.
          </li>
          <li>
            <span className="font-medium text-green-600">동시성 모드:</span>{" "}
            React 18의 useTransition을 사용하여 검색 작업의 우선순위를 낮춰 UI
            응답성을 유지합니다.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default App;
