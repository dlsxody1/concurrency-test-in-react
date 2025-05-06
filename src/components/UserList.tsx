import { useMemo, type FC } from "react";
import type { User } from "../data";

interface UserListProps {
  users: User[];
  query: string;
}

const UserList: FC<UserListProps> = ({ users, query }) => {
  // 검색어에 맞는 사용자 필터링 (고부하 연산 시뮬레이션)
  const filteredUsers: User[] = useMemo(() => {
    if (!query) return users.slice(0, 100); // 검색어 없으면 처음 100명만

    console.log("필터링 시작:", new Date().toISOString());

    // 인위적으로 처리 속도를 느리게 만들기 위한 코드
    const startTime: number = performance.now();
    while (performance.now() - startTime < 200) {
      // 인위적인 CPU 부하 생성 (약 200ms 지연)
    }

    // 실제 필터링 로직
    const filtered: User[] = users.filter((user: User) => {
      const lowerQuery: string = query.toLowerCase();
      return (
        user.name.toLowerCase().includes(lowerQuery) ||
        user.email.toLowerCase().includes(lowerQuery) ||
        user.job.toLowerCase().includes(lowerQuery) ||
        user.department.toLowerCase().includes(lowerQuery)
      );
    });

    console.log(
      "필터링 완료:",
      new Date().toISOString(),
      `(${filtered.length}명 찾음)`
    );
    return filtered;
  }, [users, query]);

  if (filteredUsers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 bg-gray-50 rounded-lg border border-gray-200">
        <svg
          className="h-16 w-16 text-gray-400 mb-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-gray-500 text-lg font-medium">
          검색 결과가 없습니다.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-auto">
      <div className="shadow overflow-hidden border-b border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                ID
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                이름
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                이메일
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                직무
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                부서
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {user.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.job}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {user.department}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-end">
        <span className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md bg-white text-gray-700">
          총 {filteredUsers.length}명의 사용자가 검색되었습니다.
        </span>
      </div>
    </div>
  );
};

export default UserList;
