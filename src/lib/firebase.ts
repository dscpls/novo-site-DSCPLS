import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

export const login = async () => {
  try {
    await signInWithPopup(auth, provider);
  } catch (error: any) {
    console.error("Login Error", error);
    if (error.code === 'auth/unauthorized-domain') {
      alert("ERRO DE DOMÍNIO: Para fazer login, você precisa adicionar este URL atual lá no painel do Firebase Console em: Authentication > Settings > Authorized Domains.");
    } else {
      alert("Erro ao fazer login: " + error.message + " | Se estiver no celular/iframe, tente abrir o site em uma nova aba.");
    }
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout Error", error);
  }
};

async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if(error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}
testConnection();
