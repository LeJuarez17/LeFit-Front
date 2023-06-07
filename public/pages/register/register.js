
const registerForm = document.querySelector('form');
const errorContainer = document.getElementById('errorContainer');

registerForm.addEventListener('submit', handleRegister);

async function handleRegister(e) {
  e.preventDefault();

  const userNameInput = document.getElementById('userName');
  const passwordInput = document.getElementById('password');

  const userName = userNameInput.value;
  const password = passwordInput.value;

  try {
    const response = await fetch('http://localhost:3001/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userName, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // Registro exitoso, redirigir a la página de inicio de sesión
      window.location.href = '../login/login.html';
    } else {
      // Error en el registro, mostrar mensaje de error en tu interfaz
      showError(data.message);
    }
  } catch (error) {
    // Manejar errores de la solicitud, mostrar mensaje de error en tu interfaz
    showError('Error en la solicitud');
  }
}

function showError(errorMessage) {
  errorContainer.textContent = errorMessage;
}
