document.addEventListener('DOMContentLoaded', function() {
    // Mostrar u ocultar la contraseña
    document.getElementById('mostrar-contraseña').addEventListener('change', function() {
        const passwordInput = document.getElementById('password');
        if (this.checked) {
            passwordInput.type = 'text';  
        } else {
            passwordInput.type = 'password'; 
        }
    });
       // Generar dinámicamente el año
       const anios = [];
       const currentYear = new Date().getFullYear();
       for (let i = 1980; i <= currentYear; i++) {
           anios.push(i);
       }

       const anioSelect = document.getElementById('anio');
       anios.forEach(anio => {
           const option = document.createElement('option');
           option.value = anio;
           option.textContent = anio;
           anioSelect.appendChild(option);
       });
});