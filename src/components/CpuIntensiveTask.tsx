import { useState, useEffect, type FC } from "react";

const CpuIntensiveTask: FC = () => {
  const [counter, setCounter] = useState<number>(0);
  const [primes, setPrimes] = useState<number[]>([]);

  // 컴포넌트가 마운트되면 소수 찾기 시작
  useEffect(() => {
    // 명시적인 조건 추가
    if (!document.hidden) {
      const interval = setInterval(() => {
        findNextPrimes();
      }, 100); // 100ms마다 실행

      return () => {
        clearInterval(interval);
      };
    }
  }, [counter]);

  // 소수 판별 함수
  const isPrime = (num: number): boolean => {
    if (num <= 1) return false;
    if (num <= 3) return true;

    if (num % 2 === 0 || num % 3 === 0) return false;

    let i: number = 5;
    while (i * i <= num) {
      if (num % i === 0 || num % (i + 2) === 0) return false;
      i += 6;
    }

    return true;
  };

  // CPU 부하를 주는 함수
  const findNextPrimes = (): void => {
    let count: number = 0;
    let currentNum: number = counter;
    const newPrimes: number[] = [];

    // 다음 10개의 소수 찾기
    while (count < 10) {
      currentNum++;

      // 소수 판별에 인위적인 지연 추가
      const startTime: number = performance.now();
      while (performance.now() - startTime < 50) {
        // 인위적인 CPU 부하 (각 숫자당 약 50ms 지연)
      }

      if (isPrime(currentNum)) {
        newPrimes.push(currentNum);
        count++;
      }
    }

    setCounter(currentNum);
    setPrimes((prev) => [...prev, ...newPrimes].slice(-50)); // 최근 50개만 유지
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-700 flex items-center">
        <svg
          className="w-5 h-5 mr-2 text-red-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        CPU 부하 작업: 소수 계산
      </h3>

      <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
        <p className="text-sm font-medium text-gray-700 mb-2">
          최근 발견된 소수:
        </p>
        <div className="flex flex-wrap gap-2">
          {primes.map((prime, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
            >
              {prime}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2 text-sm text-gray-600">
        <div className="bg-gray-100 rounded-lg overflow-hidden">
          <div
            className="bg-red-500 h-2"
            style={{ width: `${Math.min(100, (counter / 10000) * 100)}%` }}
          ></div>
        </div>
        <div className="flex justify-between">
          <p className="font-medium">
            현재까지 확인한 숫자:{" "}
            <span className="text-red-600">{counter.toLocaleString()}</span>
          </p>
          <p className="font-medium">
            찾은 소수 개수:{" "}
            <span className="text-blue-600">{primes.length}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CpuIntensiveTask;
