
// import axios from 'axios';

// const userName = document.getElementById('userName');
// const password = document.getElementById('password');
// const loginBtn = document.getElementById('loginBtn');


// loginButton.addEventListener('click', () => {
//     // Obtener los valores de los campos de inicio de sesión
//     const userName = userNameInput.value;
//     const password = passwordInput.value;
// });

// const handleLogin = async (e) => {
//   e.preventDefault();

//   // Capturar valores del formulario
//   const { userName, password } = e.target.elements;

//   try {
//     // Realizar solicitud POST a tu endpoint de inicio de sesión
//     const response = await axios.post('http://localhost:3001/api/auth/login', {
//       userName: userName.value,
//       password: password.value,
//     });

//     // Verificar la respuesta y realizar acciones adecuadas en tu interfaz
//     if (response.data.success) {
//       // Usuario autenticado correctamente, redireccionar a la página de inicio
      
//       loginBtn.window.location.href = '/home/home.html';
      
//       window.location.href = '/home/home.html';
//     } else {
//       // Error en la autenticación, mostrar mensaje de error en tu interfaz
//       console.log(response.data.message);
//     }
//   } catch (error) {
//     // Manejar errores de la solicitud, mostrar mensaje de error en tu interfaz
//     console.log(error.message);
//   }
// };

const userNameInput = document.getElementById('userName');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('loginBtn');
const errorContainer = document.getElementById('errorContainer');


const showError = (errorMessage) => {
    errorContainer.textContent = errorMessage;
  };
const handleLogin = async (e) => {
  e.preventDefault();

  const userName = userNameInput.value;
  const password = passwordInput.value;

  try {
    const response = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userName, password }),
    });

    const data = await response.json();

    if (response.status === 200) {
      // Usuario autenticado correctamente, redireccionar a la página de inicio
      sessionStorage.setItem('token', data.token);
      console.log(data.token);
      window.location.href = '../home/home.html';
    } else {
        // Error en la autenticación, mostrar mensaje de error en tu interfaz
        showError(data.message);
        errorContainer.innerText = "Error de autenticación"
        console.log(response.status);
        return;
      }
    } catch (error) {
      // Manejar errores de la solicitud, mostrar mensaje de error en tu interfaz
      showError(error.message);
        errorContainer.innerText = "Error de autenticación"
        console.log(response.status);
      return;
    }
  };

  loginBtn.addEventListener('click', handleLogin);