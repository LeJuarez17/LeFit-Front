
const toggleFormBtn = document.getElementById('toggleFormBtn');
const addExContainer = document.querySelector('.addExContainer');

toggleFormBtn.addEventListener('click', () => {
  addExContainer.classList.toggle('active');
});






const listaEjercicios = document.querySelector('.lista-ejercicios');

const authToken = sessionStorage.getItem('token') || '';

const obtenerEjercicios = async () => {
  try {

    if (!authToken) {
      // Si no hay token, redirigir a la página de inicio de sesión o mostrar mensaje de error.
      console.log('Usuario no autenticado. Redirigiendo...');
      // Puedes usar window.location.href = '/login'; para redirigir a la página de inicio de sesión.
      window.location.href = '../login/login.html';
      return;
    }

    const response = await fetch('http://localhost:3001/api/exercises', {
      headers: {
        Authorization: `Bearer ${authToken}`, // Agregar el token en la cabecera de la solicitud
      },
    });

    const data = await response.json();

    if (response.ok) {
      const ejercicios = data.data;

      ejercicios.forEach((ejercicio) => {
        const ejercicioItem = document.createElement('div');
        ejercicioItem.classList.add('ejercicio-item');

        const nombre = document.createElement('h3');
        nombre.textContent = ejercicio.name;

        const descripcion = document.createElement('p');
        descripcion.textContent = ejercicio.description;

        const grupoMuscular = document.createElement('p');
        grupoMuscular.textContent = ejercicio.muscleGroup;

        ejercicioItem.appendChild(nombre);
        ejercicioItem.appendChild(descripcion);
        ejercicioItem.appendChild(grupoMuscular);

        listaEjercicios.appendChild(ejercicioItem);
      });
    } else {
      console.log('Error al obtener los ejercicios');
    }
  } catch (error) {
    console.log('Error al realizar la solicitud');
  }
};

obtenerEjercicios();





const addExerciseForm = document.getElementById('addExerciseForm');

toggleFormBtn.addEventListener('click', () => {
  addExerciseForm.classList.toggle('hidden');
});

addExerciseForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const description = document.getElementById('description').value;
  const muscleGroup = document.getElementById('muscleGroup').value;

  const exerciseData = {
    name,
    description,
    muscleGroup,
  };

  fetch('http://localhost:3001/api/exercises', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(exerciseData),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data); // Puedes hacer algo con la respuesta, como mostrar un mensaje de éxito o actualizar la lista de ejercicios.
      addExerciseForm.reset(); // Reiniciar el formulario después de enviarlo correctamente.
      location.reload();
    })
    .catch((error) => {
      console.log(error); // Manejar errores de la solicitud.
    });
});
