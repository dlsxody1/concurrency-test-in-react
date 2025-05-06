// src/data.ts

export interface User {
  id: number;
  name: string;
  email: string;
  job: string;
  department: string;
}

// 무작위 사용자 데이터 생성
export function generateUsers(count: number): User[] {
  const users: User[] = [];
  const departments = [
    "개발",
    "마케팅",
    "영업",
    "인사",
    "재무",
    "경영",
    "디자인",
    "서비스",
  ];
  const jobs = [
    "매니저",
    "책임자",
    "주니어",
    "시니어",
    "인턴",
    "VP",
    "CTO",
    "CEO",
  ];

  const firstNames = [
    "김",
    "이",
    "박",
    "최",
    "정",
    "강",
    "조",
    "윤",
    "장",
    "임",
    "한",
    "오",
    "서",
    "신",
    "권",
    "황",
    "안",
    "송",
    "전",
    "홍",
  ];
  const lastNames = [
    "민준",
    "서준",
    "예준",
    "도윤",
    "시우",
    "주원",
    "하준",
    "지호",
    "지후",
    "준서",
    "서연",
    "서윤",
    "지우",
    "서현",
    "민서",
    "하은",
    "하윤",
    "윤서",
    "지민",
    "지유",
  ];

  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = firstName + lastName;

    const job = jobs[Math.floor(Math.random() * jobs.length)];
    const department =
      departments[Math.floor(Math.random() * departments.length)];

    users.push({
      id: i + 1,
      name,
      email: `${name.toLowerCase()}${Math.floor(
        Math.random() * 1000
      )}@example.com`,
      job,
      department,
    });
  }

  return users;
}
