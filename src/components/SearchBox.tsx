// src/components/SearchBox.tsx
import React, {
  useState,
  useEffect,
  useRef,
  type ChangeEvent,
  type FormEvent,
} from "react";

interface SearchBoxProps {
  onSearch: (query: string) => void;
  useDebounce: boolean;
}

const SearchBox: React.FC<SearchBoxProps> = ({ onSearch, useDebounce }) => {
  const [inputValue, setInputValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");
  const initialRender = useRef(true);

  // 입력값 변경 처리
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const newValue = e.target.value;
    setInputValue(newValue);

    // 디바운스를 사용하지 않는 경우에만 즉시 검색
    if (!useDebounce) {
      onSearch(newValue);
    }
    // useDebounce가 true이면 이 함수에서는 onSearch를 호출하지 않고
    // 디바운스 효과를 통해서만 호출되게 함
  };

  // 폼 제출 처리
  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    onSearch(inputValue);
  };

  // 디바운스 효과 (useDebounce가 true일 때만 적용)
  useEffect(() => {
    if (!useDebounce) return; // 디바운스 모드가 꺼져 있으면 실행하지 않음

    const timer = setTimeout(() => {
      setDebouncedValue(inputValue);
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [inputValue, useDebounce]);

  // 디바운스된 값으로 검색 실행 (useDebounce가 true일 때만)
  useEffect(() => {
    if (!useDebounce) return; // 디바운스 모드가 꺼져 있으면 실행하지 않음

    // 첫 렌더링에서는 검색 함수 호출하지 않도록 처리
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }

    onSearch(debouncedValue);
  }, [debouncedValue, onSearch, useDebounce]);

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="이름, 이메일, 직무 등으로 검색..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
        />
      </div>
      <button type="submit" className="btn btn-primary flex items-center">
        <svg
          className="h-5 w-5 mr-1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            clipRule="evenodd"
          />
        </svg>
        검색
      </button>
    </form>
  );
};

export default SearchBox;
