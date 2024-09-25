// Importar Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBV-uF9QRdjQWDcSdVDY4H4N2IHaRk9sP0",
  authDomain: "viajes-blog.firebaseapp.com",
  projectId: "viajes-blog",
  storageBucket: "viajes-blog.appspot.com",
  messagingSenderId: "76235920794",
  appId: "1:76235920794:web:9cfacb175910f38bba5623"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Manejar el estado de autenticación
onAuthStateChanged(auth, user => {
  if (user) {
    // Usuario autenticado
    document.getElementById('loginBtn').style.display = 'none';
    document.getElementById('logoutBtn').style.display = 'block';
    console.log('Usuario autenticado:', user.email);
  } else {
    // No hay usuario autenticado
    document.getElementById('loginBtn').style.display = 'block';
    document.getElementById('logoutBtn').style.display = 'none';
    console.log('Ningún usuario autenticado');
  }
});

// Iniciar sesión
document.getElementById('signInBtn').addEventListener('click', () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  signInWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
      console.log('Sesión iniciada:', userCredential.user);
      document.getElementById('authModal').style.display = 'none'; // Cerrar modal
      alert('Sesión iniciada correctamente');
    })
    .catch(error => {
      console.error('Error al iniciar sesión:', error.message);
      alert('Error al iniciar sesión: ' + error.message);
    });
});

// Registrarse
document.getElementById('signUpBtn').addEventListener('click', () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  createUserWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
      console.log('Usuario registrado:', userCredential.user);
      document.getElementById('authModal').style.display = 'none'; // Cerrar modal
      alert('Usuario registrado correctamente');
    })
    .catch(error => {
      console.error('Error al registrarse:', error.message);
      alert('Error al registrarse: ' + error.message);
    });
});

// Cerrar sesión
document.getElementById('logoutBtn').addEventListener('click', () => {
  signOut(auth)
    .then(() => {
      console.log('Sesión cerrada');
      alert('Sesión cerrada correctamente');
    })
    .catch(error => {
      console.error('Error al cerrar sesión:', error.message);
      alert('Error al cerrar sesión: ' + error.message);
    });
});