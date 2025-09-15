
// 간단한 모달 컴포넌트 (FCM 권한 안내용)
function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-xs w-full relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl">&times;</button>
        {children}
      </div>
    </div>
  );
}


import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from './components/Button';
import { Input } from './components/Input';
import { Card } from './components/Card';
import { Table } from './components/Table';
import { messaging } from './firebase';
import { getToken } from 'firebase/messaging';

type Favorite = {
  id: string;
  stopName: string;
  routeName: string;
};

const MOCK_FAVORITES: Favorite[] = [
  { id: '1', stopName: '강남역', routeName: '360' },
  { id: '2', stopName: '서울역', routeName: '100' },
];


// Mock 도착정보 데이터
type Arrival = {
  id: string;
  stopName: string;
  routeName: string;
  predictMin: number;
  vehicleNo: string;
};

const MOCK_ARRIVALS: Arrival[] = [
  { id: 'a1', stopName: '강남역', routeName: '360', predictMin: 2, vehicleNo: '서울70사1234' },
  { id: 'a2', stopName: '강남역', routeName: '360', predictMin: 8, vehicleNo: '서울70사5678' },
  { id: 'a3', stopName: '서울역', routeName: '100', predictMin: 5, vehicleNo: '서울70사9999' },
];

const THEME_COLORS = [
  { name: '블루', value: '#2563eb' },
  { name: '오렌지', value: '#f59e42' },
  { name: '슬레이트', value: '#64748b' },
];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [primaryColor, setPrimaryColor] = useState(THEME_COLORS[0].value);
  const [dark, setDark] = useState(false);

  // Mount 시 prefers-color-scheme에 따라 dark 초기화
  useEffect(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDark(true);
    }
  }, []);

  const toggleDark = () => setDark(d => !d);

  // Tailwind primary 컬러를 동적으로 변경
  useEffect(() => {
    document.documentElement.style.setProperty('--tw-color-primary', primaryColor);
  }, [primaryColor]);

  // FCM 토큰 상태 및 함수들 반드시 함수 내부에 위치
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [fcmError, setFcmError] = useState<string | null>(null);
    const [showFcmModal, setShowFcmModal] = useState(false);

  const requestFcmToken = async () => {
    try {
      setFcmError(null);
  const currentToken = await getToken(messaging, { vapidKey: 'BOCutDA4oH5LWQ9v-lrfwrbDj9Edp2mQKHlbrL8doQgoU6n073DZrcZBVMxOl0IG_ud9_ZdYSTeamynlKHwXbSI' });
      if (currentToken) {
        setFcmToken(currentToken);
      } else {
        setFcmError('토큰을 가져올 수 없습니다. 브라우저 알림 권한을 허용해 주세요.');
      }
    } catch (err: any) {
      setFcmError(err?.message || 'FCM 토큰 발급 중 오류 발생');
    }
  };

  useEffect(() => {
    requestFcmToken();
    // eslint-disable-next-line
  }, []);

  const [favorites, setFavorites] = useState<Favorite[]>(MOCK_FAVORITES);
  const [stopName, setStopName] = useState('');
  const [routeName, setRouteName] = useState('');

  const addFavorite = () => {
    if (!stopName.trim() || !routeName.trim()) return;
    setFavorites((prev) => [
      ...prev,
      { id: Date.now().toString(), stopName: stopName.trim(), routeName: routeName.trim() }
    ]);
    setStopName('');
    setRouteName('');
  };

  const removeFavorite = (id: string) => {
    setFavorites((prev) => prev.filter(fav => fav.id !== id));
  };

  return (
    <div className={`min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-gray-100 text-[15px] sm:text-base${dark ? ' dark' : ''}`}>
      {/* Header */}
      <header className="bg-blue-600 text-white py-2 sm:py-4 shadow-md sticky top-0 z-10">
        <div className="max-w-md mx-auto px-1 sm:px-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 w-full">
          <div className="flex items-center w-full sm:w-auto justify-between">
            <h1 className="text-base sm:text-2xl font-bold tracking-tight" tabIndex={0} aria-label="출퇴근 정류장 알리미">출퇴근 정류장 알리미</h1>
            <select
              className="ml-2 rounded px-2 py-1 text-xs sm:text-sm text-blue-700 bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary min-w-[64px]"
              aria-label="테마 컬러 선택"
              value={primaryColor}
              onChange={e => setPrimaryColor(e.target.value)}
            >
              {THEME_COLORS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.name}</option>
              ))}
            </select>
            {/* 햄버거 버튼: 모바일에서만 보임 */}
            <button
              className="ml-2 sm:hidden flex items-center justify-center w-10 h-10 rounded border-2 border-white bg-blue-500/90 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-white text-white relative"
              aria-label="메뉴 열기"
              onClick={() => setMenuOpen(v => !v)}
              style={{ zIndex: 30 }}
            >
              <span className="sr-only">메뉴</span>
                  <span style={{position:'absolute', left:0, right:0, top:0, bottom:0, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:'2rem', pointerEvents:'none', fontWeight:'bold'}} aria-hidden="true">≡</span>
            </button>
          </div>
          {/* PC: 네비게이션 항상 보임, 모바일: 햄버거 클릭 시만 보임 */}
          <div className={`flex-col sm:flex-row flex w-full sm:w-auto gap-1 sm:gap-2 ${menuOpen ? 'flex' : 'hidden'} sm:flex bg-blue-600 sm:bg-transparent px-2 sm:px-0 py-2 sm:py-0 rounded-b-2xl sm:rounded-none shadow-lg sm:shadow-none sm:static`}>
            <nav className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-4 text-xs sm:text-base font-semibold" aria-label="메인 메뉴">
              <a href="#" className="px-2 py-2 sm:py-1 rounded transition bg-blue-500/80 hover:bg-white hover:text-blue-700 focus:bg-white focus:text-blue-700 text-white shadow-sm focus:outline-dashed focus:outline-2 focus:outline-blue-700 min-w-[64px] text-center" tabIndex={0} aria-label="즐겨찾기">즐겨찾기</a>
              <a href="#" className="px-2 py-2 sm:py-1 rounded transition bg-blue-500/80 hover:bg-white hover:text-blue-700 focus:bg-white focus:text-blue-700 text-white shadow-sm focus:outline-dashed focus:outline-2 focus:outline-blue-700 min-w-[64px] text-center" tabIndex={0} aria-label="도착정보">도착정보</a>
            </nav>
            <Button variant="secondary" className="px-2 py-2 sm:py-1 text-xs sm:text-sm min-w-[64px]" aria-label="다크모드 토글" onClick={toggleDark}>
              {dark ? '☀️ 밝게' : '🌙 어둡게'}
            </Button>
          </div>
        </div>
      </header>
      {/* Main */}
      <main className="flex-1 flex flex-col items-center px-1 sm:px-2 py-4 sm:py-10 mt-2 sm:mt-4">
        <div className="w-full max-w-md space-y-4 sm:space-y-6">
          {/* 즐겨찾기 리스트 */}
          <Card>
            <h2 className="text-base sm:text-lg font-bold text-blue-700 mb-4" tabIndex={0} aria-label="즐겨찾기 목록">즐겨찾기 목록</h2>
            {favorites.length === 0 ? (
              <p className="text-gray-500 text-center">등록된 즐겨찾기가 없습니다.</p>
            ) : (
              <ul className="divide-y divide-gray-100">
                <AnimatePresence initial={false}>
                  {favorites.map(fav => (
                    <motion.li
                      key={fav.id}
                      className="flex items-center justify-between py-2 gap-2 flex-wrap"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.25 }}
                      layout
                    >
                      <span className="font-medium text-gray-800">{fav.stopName} <span className="text-xs text-gray-400">({fav.routeName})</span></span>
                      <Button variant="danger" className="text-xs ml-2 px-2 py-1 min-w-[48px]" onClick={() => removeFavorite(fav.id)}>삭제</Button>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            )}
          </Card>
          {/* 실시간 도착정보 Mock UI */}
          <Card>
            <h2 className="text-base sm:text-lg font-bold text-blue-700 mb-4" tabIndex={0} aria-label="실시간 도착정보">실시간 도착정보 (Mock)</h2>
            <Table
              columns={[
                { key: 'stopName', label: '정류장' },
                { key: 'routeName', label: '노선' },
                { key: 'predictMin', label: '예정(분)', className: 'text-blue-600 font-bold' },
                { key: 'vehicleNo', label: '차량번호' },
              ]}
              data={favorites.flatMap(fav =>
                MOCK_ARRIVALS.filter(arr => arr.stopName === fav.stopName && arr.routeName === fav.routeName)
              )}
              rowKey={row => row.id}
              emptyText={favorites.length === 0 ? '즐겨찾기 등록 후 도착정보를 확인할 수 있습니다.' : '도착정보가 없습니다.'}
            />
          </Card>
          {/* FCM 토큰 발급 및 표시 UI */}
          <Card>
            <h2 className="text-base sm:text-lg font-bold text-blue-700 mb-4" tabIndex={0} aria-label="FCM 푸시 토큰">FCM 푸시 토큰</h2>
            <Button className="mb-2" onClick={requestFcmToken}>토큰 재발급/권한 요청</Button>
            {fcmToken && (
              <div className="break-all text-xs bg-gray-100 rounded p-2 border mt-2 text-gray-700">
                <span className="font-semibold text-blue-700">토큰:</span> {fcmToken}
              </div>
            )}
            {fcmError && (
              <div className="text-red-500 text-sm mt-2">{fcmError}</div>
            )}
            <div className="text-gray-400 text-xs mt-2">브라우저 알림 권한이 필요합니다.</div>
            {/* FCM 권한 안내 모달 */}
            <Modal open={showFcmModal} onClose={() => setShowFcmModal(false)}>
              <div className="text-center">
                <h3 className="text-lg font-bold text-blue-700 mb-2">알림 권한이 필요합니다</h3>
                <p className="text-gray-700 text-sm mb-4">브라우저 알림 권한을 허용해야 푸시 알림을 받을 수 있습니다.<br />설정에서 알림 권한을 허용해 주세요.</p>
                <Button onClick={() => setShowFcmModal(false)}>확인</Button>
              </div>
            </Modal>
          </Card>
        </div>
      </main>
      {/* Footer */}
      <footer className="bg-gray-100 text-gray-500 py-2 sm:py-3 text-center text-xs sm:text-sm border-t border-gray-200">
        &copy; {new Date().getFullYear()} 출퇴근 정류장 알리미
      </footer>
    </div>
  );
}

export default App;
