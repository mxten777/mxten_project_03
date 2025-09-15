import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDNDOL6z2hj7l8vXfsACRXWhE0FXqyh0O8",
  authDomain: "mxten-project-01.firebaseapp.com",
  projectId: "mxten-project-01",
  storageBucket: "mxten-project-01.appspot.com",
  messagingSenderId: "913603732067",
  appId: "1:913603732067:web:1c65310d0ac0dd0ad90e56"
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

// FCM 서비스워커 등록 및 토큰 발급 함수
export async function requestFcmToken() {
  // 서비스워커 등록
  const swReg = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
  // VAPID 키는 Firebase 콘솔 > 프로젝트 설정 > 클라우드 메시징 > 웹 푸시 인증서에서 확인
  const vapidKey = "BOCutDA4oH5LWQ9v-IrfwrbDj9Edp2mQKHIbrL8doQgoU6n073DZrcZBVMxOlDG_ud9_ZdYSTeamyanIKHwXbSI";
  // 토큰 요청
  return getToken(messaging, {
    vapidKey,
    serviceWorkerRegistration: swReg,
  });
}