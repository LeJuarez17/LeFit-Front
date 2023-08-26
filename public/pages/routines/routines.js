const toggleFormBtn = document.getElementById('toggleFormBtn');
const addRoutineForm = document.getElementById('addRoutineForm');
const addRoutineContainer = document.querySelector('.addRoutineContainer');

toggleFormBtn.addEventListener('click', () => {
  addRoutineContainer.classList.toggle('active');
});



const listaRutinas = document.querySelector('.lista-rutinas');

const authToken = sessionStorage.getItem('token') || '';
let selectedExercises = [];

const obtenerRutinas = async () => {
  try {
    // const response = await fetch('http://localhost:3001/api/routines');
    // const data = await response.json();

    if (!authToken) {
      
      console.log('Usuario no autenticado. Redirigiendo...');

      window.location.href = '../login/login.html';
      return;
    }

    const response = await fetch('http://localhost:3001/api/routines', {
      headers: {
        Authorization: `Bearer ${authToken}`, 
      },
    });

    const data = await response.json();



    if (response.ok) {
      const rutinas = data.data;

      rutinas.forEach((rutina) => {
        const rutinaItem = document.createElement('div');
        rutinaItem.classList.add('rutina-item');

        const nombre = document.createElement('h3');
        nombre.textContent = rutina.name;

        const descripcion = document.createElement('p');
        descripcion.textContent = rutina.description;

        const ejercicios = document.createElement('div');
        ejercicios.classList.add('ejercicios');

        rutina.exercises.forEach((ejercicio) => {
          const ejercicioItem = document.createElement('div');
          ejercicioItem.classList.add('ejercicio-card');

          const ejercicioNombre = document.createElement('h3');
          ejercicioNombre.textContent = ejercicio.name;

          const ejercicioDescripcion = document.createElement('p');
          ejercicioDescripcion.textContent = ejercicio.description;

          const ejercicioRepsSets = document.createElement('p');
          ejercicioRepsSets.textContent = `Reps: ${ejercicio.reps}, Sets: ${ejercicio.sets}`;

          const ejercicioPeso = document.createElement('p');
          ejercicioPeso.textContent = `Peso utilizado: ${ejercicio.weight}`;
          


          ejercicioItem.appendChild(ejercicioNombre);
          ejercicioItem.appendChild(ejercicioDescripcion);
          ejercicioItem.appendChild(ejercicioRepsSets);
          ejercicioItem.appendChild(ejercicioPeso);

          ejercicios.appendChild(ejercicioItem);
        });

        rutinaItem.appendChild(nombre);
        rutinaItem.appendChild(ejercicios);

        listaRutinas.appendChild(rutinaItem);
      });
    } else {
      console.log('Error al obtener las rutinas');
    }
  } catch (error) {
    console.log('Error al realizar la solicitud', error);
  }
};

obtenerRutinas();



const obtenerEjerciciosDisponibles = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/exercises', {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('No se pudo obtener la lista de ejercicios');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.log('Error al obtener la lista de ejercicios', error);
    return [];
  }
};


const llenarSelectEjercicios = (ejercicios) => {
  const exerciseSelect = document.getElementById('exerciseSelect');
  exerciseSelect.innerHTML = '<option value="" selected disabled>Seleccione un ejercicio</option>';

  ejercicios.forEach((ejercicio) => {
    const option = document.createElement('option');
    option.value = ejercicio._id; 
    option.textContent = ejercicio.name; 
    exerciseSelect.appendChild(option);
  });
};


document.addEventListener('DOMContentLoaded', () => {
  obtenerEjerciciosDisponibles()
    .then((ejercicios) => {
      llenarSelectEjercicios(ejercicios);
    })
    .catch((error) => {
      console.log('Error al obtener la lista de ejercicios', error);
    });
});


const agregarEjercicioSeleccionado = () => {
  const exerciseSelect = document.getElementById('exerciseSelect');
  const selectedExerciseId = exerciseSelect.value;

  if (!selectedExerciseId) {
    alert('Seleccione un ejercicio válido');
    return;
  }

  const selectedExerciseName = exerciseSelect.options[exerciseSelect.selectedIndex].text;
  const exerciseReps = document.getElementById('exerciseReps').value;
  const exerciseSets = document.getElementById('exerciseSets').value;
  const exerciseWeight = document.getElementById('exerciseWeight').value;
  const comments = document.getElementById('comments').value;
  const exerciseInput = document.createElement('div');
  exerciseInput.classList.add('exercise-input');
  exerciseInput.innerHTML = `
    <input type="text" name="exerciseName" value="${selectedExerciseName}" readonly>
    <input type="number" name="exerciseReps" value="${exerciseReps}" readonly>
    <input type="number" name="exerciseSets" value="${exerciseSets}" readonly>
    <input type="number" name="exerciseWeight" value="${exerciseWeight}" readonly>
    <input type="text" name="comments" value="${comments}" readonly>
  `;
  const exerciseInputsContainer = document.getElementById('exerciseInputsContainer');


  exerciseSelect.classList.add('exercise-select');
  exerciseSelect.selectedIndex = 0;

  selectedExercises.push({
    _id: selectedExerciseId,
    name: selectedExerciseName,
  });


  const exerciseContainer = document.createElement('div');
  exerciseContainer.classList.add('exercise-container');
  exerciseContainer.appendChild(exerciseInput);

  exerciseInputsContainer.appendChild(exerciseContainer);
};




const addExerciseBtn = document.getElementById('addExerciseBtn');

toggleFormBtn.addEventListener('click', () => {
  addRoutineForm.classList.toggle('hidden');
});

// addExerciseBtn.addEventListener('click', () => {
//   const exerciseInput = document.createElement('div');
//   exerciseInput.classList.add('exercise-input');
//   exerciseInput.innerHTML = `
//     <input type="text" name="exerciseName" placeholder="Nombre del ejercicio" required>
//     <input type="number" name="exerciseReps" placeholder="Reps" required>
//     <input type="number" name="exerciseSets" placeholder="Sets" required>
//   `;
//   exerciseInputsContainer.appendChild(exerciseInput);
// });

addExerciseBtn.addEventListener('click', () => {
  agregarEjercicioSeleccionado(); 
  addRoutineForm.reset();
});



addRoutineForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const exerciseContainers = document.querySelectorAll('.exercise-container');

  selectedExercises = selectedExercises.map((exercise) => {
    const selectedExerciseName = exercise.name;
    const container = [...exerciseContainers].find((elem) =>
      elem.querySelector('input[name="exerciseName"]').value === selectedExerciseName
    );

    if (!container) return exercise;

    const exerciseReps = container.querySelector('input[name="exerciseReps"]').value;
    console.log(exerciseReps); 
    // debugger
    const exerciseSets = container.querySelector('input[name="exerciseSets"]').value;
    const exerciseWeight = container.querySelector('input[name="exerciseWeight"]').value;
    const comments = container.querySelector('input[name="comments"]').value;

    return {
      ...exercise,
      reps: exerciseReps,
      sets: exerciseSets,
      weight: exerciseWeight,
      comments: comments,
    };
  });

  const routineData = {
    name,
    selectedExercises,
  };

  fetch('http://localhost:3001/api/routines', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(routineData),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data); 
      addRoutineForm.reset(); 
      location.reload();
    })
    .catch((error) => {
      console.log(error); 
    });
});
