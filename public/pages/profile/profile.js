const authToken = sessionStorage.getItem('token') || '';

const obtenerProfile = async () => {
  try {

    if (!authToken) {
      console.log('Usuario no autenticado. Redirigiendo...');
      window.location.href = '../login/login.html';
      return;
    }

    const response = await fetch('http://localhost:3001/api/profile', {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    const data = await response.json();

  } catch (error) {
    console.log('Error al realizar la solicitud', error);
  }
};

obtenerProfile();

const signoutBtn = document.getElementById('signoutBtn');
signoutBtn.addEventListener('click', () => {
  sessionStorage.removeItem('token');
  window.location.href = '../login/login.html'; 
});

// ...

async function cargarEjercicios() {
  try {
    const response = await fetch('http://localhost:3001/api/exercises', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener los ejercicios');
    }

    const data = await response.json();
    const exerciseSelect = document.getElementById('exerciseSelect');

    data.data.forEach(exercise => {
      const option = document.createElement('option');
      option.text = exercise.name;
      option.value = exercise._id;
      exerciseSelect.add(option);
    });


    exerciseSelect.addEventListener('change', () => {
      mostrarPerfilUsuario();
    });

  } catch (error) {
    console.log('Error al cargar los ejercicios', error);
  }
}

async function init() {
  try {
    await obtenerProfile();
    await cargarEjercicios();
    mostrarPerfilUsuario();
  } catch (error) {
    console.log('Error al inicializar el perfil del usuario', error);
  }
}

init();

// ...

async function obtenerRutinasUsuario() {
  try {
    const response = await fetch('http://localhost:3001/api/routines', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener las rutinas del usuario');
    }

    const data = await response.json();

    return data.data;
  } catch (error) {
    console.log('Error al obtener las rutinas del usuario', error);
    return [];
  }
}

function obtenerDatosGrafico(rutinas, selectedExerciseId) {

  const labels = rutinas.map(rutina => rutina.name);
  const pesos = rutinas.map(rutina => obtenerPesoEjercicio(rutina.exercises, selectedExerciseId));

  return {
    labels,
    pesos,
  };
}

function obtenerPesoEjercicio(exercises, selectedExerciseId) {
  const ejercicioSeleccionado = exercises.find(exercise => exercise._id === selectedExerciseId);

  return ejercicioSeleccionado ? ejercicioSeleccionado.weight : 0;
}


let myChart; 

function dibujarGrafico(datosGrafico) {
  const ctx = document.getElementById('pesosGrafico').getContext('2d');


  if (myChart) {
    myChart.destroy();
  }


  myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: datosGrafico.labels,
      datasets: [{
        label: 'Pesos utilizados (kg)',
        data: datosGrafico.pesos,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 5,
            max: 100,
            callback: function (value) {
              return value + ' Lbs'; 
            }
          }
        },
        x: {
          position: 'bottom',
        }
      },
      aspectRatio: 3,
      maintainAspectRatio: true,
      responsive: true,
    }
  });
}


// ...

async function mostrarPerfilUsuario() {
  try {
    const rutinasUsuario = await obtenerRutinasUsuario();
    const exerciseSelect = document.getElementById('exerciseSelect');
    const selectedExerciseId = exerciseSelect.value;

    const datosGrafico = obtenerDatosGrafico(rutinasUsuario, selectedExerciseId);

    dibujarGrafico(datosGrafico);
    mostrarDatosTabla(rutinasUsuario, selectedExerciseId); 

  } catch (error) {
    console.log('Error al mostrar el perfil del usuario', error);
  }
}

async function mostrarPerfilUsuario() {
  try {
    const rutinasUsuario = await obtenerRutinasUsuario();
    const exerciseSelect = document.getElementById('exerciseSelect');
    const selectedExerciseId = exerciseSelect.value;

    const datosGrafico = obtenerDatosGrafico(rutinasUsuario, selectedExerciseId);

    dibujarGrafico(datosGrafico);
    mostrarDatosTabla(rutinasUsuario, selectedExerciseId); 

  } catch (error) {
    console.log('Error al mostrar el perfil del usuario', error);
  }
}

function obtenerPesoEjercicio(exercises, selectedExerciseId) {

  const filteredExercises = exercises.filter(exercise => exercise._id === selectedExerciseId);

  if (filteredExercises.length === 0) {
    return 0; 
  }
  
   const pesos = filteredExercises.map(exercise => exercise.weight);
   const sum = pesos.reduce((total, peso) => total + peso, 0);
 
   return sum;
 }

function mostrarDatosTabla(rutinas, selectedExerciseId) {
  const tableBody = document.getElementById('tablaDatosBody');


  tableBody.innerHTML = '';

  rutinas.forEach(rutina => {
    const row = document.createElement('tr');

    const rutinaNameCell = document.createElement('td');
    rutinaNameCell.textContent = rutina.name;
    row.appendChild(rutinaNameCell);

    const pesoEjercicio = obtenerPesoEjercicio(rutina.exercises, selectedExerciseId);
    const pesoCell = document.createElement('td');
    pesoCell.textContent = pesoEjercicio.toFixed(2) + ' lbs';
    row.appendChild(pesoCell);

    tableBody.appendChild(row);
  });
}