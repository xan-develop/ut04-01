document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formulario');
    const mostrarContrasenaCheckbox = document.getElementById('mostrarContrasena');
    const contrasenaInput = document.getElementById('Contrasena');
    const dniNieInput = document.getElementById('DniNie');
    const tipoDocumentoSelect = document.getElementById('TipoDocumento');
    const mensajesDiv = document.getElementById('mensajes');
    const tituloInput = document.getElementById('PublicacionTitulo');
    const descripcionInput = document.getElementById('PublicacionDescripcion');
    const tituloCaracteres = document.getElementById('tituloCaracteres');
    const descripcionCaracteres = document.getElementById('descripcionCaracteres');

    mostrarContrasenaCheckbox.addEventListener('change', () => {
        contrasenaInput.type = mostrarContrasenaCheckbox.checked ? 'text' : 'password';
    });

    tituloInput.addEventListener('input', () => {
        tituloCaracteres.textContent = `${tituloInput.value.length} / 15`;
    });

    descripcionInput.addEventListener('input', () => {
        descripcionCaracteres.textContent = `${descripcionInput.value.length} / 120`;
    });

    form.addEventListener('input', () => {
        actualizarMensajes();
    });

    form.addEventListener('submit', (e) => {
        if (!form.checkValidity()) {
            e.preventDefault();
            actualizarMensajes();
        }
    });

    dniNieInput.addEventListener('input', validarDniNie);

    function validarDniNie() {
        const tipoDocumento = tipoDocumentoSelect.value;
        const dniNie = dniNieInput.value.toUpperCase().trim();
        let mensaje = '';

        if (tipoDocumento === 'DNI') {
            mensaje = validarDNI(dniNie) ? '' : 'DNI no válido. Debe ser 8 números y una letra correcta.';
        } else if (tipoDocumento === 'NIE') {
            mensaje = validarNIE(dniNie) ? '' : 'NIE no válido. Formato incorrecto o letra no válida.';
        }

        dniNieInput.setCustomValidity(mensaje);
    }

    function validarDNI(dni) {
        const regexDNI = /^[0-9]{8}[A-Z]$/;
        if (!regexDNI.test(dni)) return false;

        const numero = parseInt(dni.slice(0, 8), 10);
        const letra = dni.charAt(8);
        return letrasDNI[numero % 23] === letra;
    }

    function validarNIE(nie) {
        const regexNIE = /^[XYZ][0-9]{7}[A-Z]$/;
        if (!regexNIE.test(nie)) return false;

        const nieConvertido = nie
            .replace('X', '0')
            .replace('Y', '1')
            .replace('Z', '2');
        const numero = parseInt(nieConvertido.slice(0, 8), 10);
        const letra = nie.charAt(8);
        return letrasDNI[numero % 23] === letra;
    }

    function actualizarMensajes() {
        mensajesDiv.innerHTML = '';

        Array.from(form.elements).forEach((elemento) => {
            if (elemento.tagName !== 'BUTTON') {
                const mensaje = elemento.validationMessage;
                actualizarMensajeCampo(elemento, mensaje);
                if (mensaje) {
                    const mensajeDiv = document.createElement('div');
                    mensajeDiv.textContent = `${elemento.name}: ${mensaje}`;
                    mensajesDiv.appendChild(mensajeDiv);
                }
            }
        });
    }

    function actualizarMensajeCampo(elemento, mensaje) {
        let mensajeElemento = document.querySelector(`#error-${elemento.id}`);

        if (!mensajeElemento) {
            mensajeElemento = document.createElement('p');
            mensajeElemento.id = `error-${elemento.id}`;
            mensajeElemento.classList.add('error');
            elemento.insertAdjacentElement('afterend', mensajeElemento);
        }

        mensajeElemento.textContent = mensaje;
        if (!mensaje) {
            mensajeElemento.remove();
        }
    }

    const letrasDNI = 'TRWAGMYFPDXBNJZSQVHLCKE';
});
document.getElementById('formulario').addEventListener('submit', function (e) {
    // Obtener todos los checkbox seleccionados
    const aficionesSeleccionadas = Array.from(document.querySelectorAll('input[name="Aficiones"]:checked'))
        .map(aficion => aficion.value);

    // Validar que se seleccionen al menos dos aficiones
    if (aficionesSeleccionadas.length < 2) {
        e.preventDefault();  // Evita el envío del formulario si no se seleccionan al menos dos aficiones
        alert('Debes seleccionar al menos dos aficiones.');
        return;
    }

    // Crear un campo oculto para enviar las aficiones seleccionadas como lista separada por comas
    const aficionesInputHidden = document.createElement('input');
    aficionesInputHidden.type = 'hidden';
    aficionesInputHidden.name = 'Aficiones';
    aficionesInputHidden.value = aficionesSeleccionadas.join(', ');  // Unir las aficiones con coma

    // Eliminar cualquier campo oculto previo para evitar duplicados
    const prevHiddenInput = document.querySelector('input[type="hidden"][name="Aficiones"]');
    if (prevHiddenInput) {
        prevHiddenInput.remove();
    }

    // Añadir el nuevo campo oculto al formulario
    this.appendChild(aficionesInputHidden);
});

