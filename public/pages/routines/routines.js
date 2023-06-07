const toggleFormBtn = document.getElementById('toggleFormBtn');
const addRoutineForm = document.getElementById('addRoutineForm');
const addRoutineContainer = document.querySelector('.addRoutineContainer');

toggleFormBtn.addEventListener('click', () => {
  addRoutineContainer.classList.toggle('active');
});



const listaRutinas = document.querySelector('.lista-rutinas');

const obtenerRutinas = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/routines');
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







const exerciseInputsContainer = document.getElementById('exerciseInputsContainer');
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
  const exerciseInput = document.createElement('div');
  exerciseInput.classList.add('exercise-input');
  exerciseInput.innerHTML = `
    <input type="text" name="exerciseName" placeholder="Nombre del ejercicio" required>
    <input type="number" name="exerciseReps" placeholder="Reps" >
    <input type="number" name="exerciseSets" placeholder="Sets" >
    <input type="text" name="exerciseWeight" placeholder="Peso utilizado (Libras)" >
    <input type="text" name="comments" placeholder="comentarios" >
  `;
  exerciseInputsContainer.appendChild(exerciseInput);
});


addRoutineForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const exerciseInputs = document.querySelectorAll('.exercise-input');

  // const exercises = Array.from(exerciseInputs).map((input) => {
  //   const exerciseName = input.querySelector('input[name="exerciseName"]').value;
  //   const exerciseReps = input.querySelector('input[name="exerciseReps"]').value;
  //   const exerciseSets = input.querySelector('input[name="exerciseSets"]').value;

  //   return {
  //     name: exerciseName,
  //     reps: exerciseReps,
  //     sets: exerciseSets,
  //   };
  // });

  const exercises = Array.from(exerciseInputs).map((input) => {
    const exerciseName = input.querySelector('input[name="exerciseName"]').value;
    const exerciseReps = input.querySelector('input[name="exerciseReps"]').value;
    const exerciseSets = input.querySelector('input[name="exerciseSets"]').value;
    const weight = input.querySelector('input[name="exerciseWeight"]').value;
  
    return {
      name: exerciseName,
      reps: exerciseReps,
      sets: exerciseSets,
      weight: weight,
    };
  });
  

  const routineData = {
    name,
    exercises,
  };

  fetch('http://localhost:3001/api/routines', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(routineData),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data); // Puedes hacer algo con la respuesta, como mostrar un mensaje de éxito o actualizar la lista de rutinas.
      addRoutineForm.reset(); // Reiniciar el formulario después de enviarlo correctamente.
      location.reload();
    })
    .catch((error) => {
      console.log(error); // Manejar errores de la solicitud.
    });
});
