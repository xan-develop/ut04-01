document.addEventListener('DOMContentLoaded', () => {
    const DOM = {
        form: document.getElementById('formulario'),
        mostrarContrasenaCheckbox: document.getElementById('mostrarContrasena'),
        contrasenaInput: document.getElementById('Contrasena'),
        dniNieInput: document.getElementById('DniNie'),
        tipoDocumentoSelect: document.getElementById('TipoDocumento'),
        mensajesDiv: document.getElementById('mensajes'),
        tituloInput: document.getElementById('PublicacionTitulo'),
        descripcionInput: document.getElementById('PublicacionDescripcion'),
        tituloCaracteres: document.getElementById('tituloCaracteres'),
        descripcionCaracteres: document.getElementById('descripcionCaracteres'),
        aficionesCheckboxes: document.querySelectorAll('input[name="Aficiones"]'),
    };

    const letrasDNI = 'TRWAGMYFPDXBNJZSQVHLCKE';

    // Función para alternar visibilidad de contraseña
    DOM.mostrarContrasenaCheckbox.addEventListener('change', () => {
        DOM.contrasenaInput.type = DOM.mostrarContrasenaCheckbox.checked ? 'text' : 'password';
    });

    // Contadores de caracteres
    DOM.tituloInput.addEventListener('input', () => {
        DOM.tituloCaracteres.textContent = `${DOM.tituloInput.value.length} / 15`;
    });

    DOM.descripcionInput.addEventListener('input', () => {
        DOM.descripcionCaracteres.textContent = `${DOM.descripcionInput.value.length} / 120`;
    });

    // Validar DNI/NIE
    DOM.dniNieInput.addEventListener('input', () => {
        const tipoDocumento = DOM.tipoDocumentoSelect.value;
        const dniNie = DOM.dniNieInput.value.toUpperCase().trim();
        let mensaje = '';

        if (tipoDocumento === 'DNI') {
            mensaje = validarDNI(dniNie) ? '' : 'DNI no válido. Debe ser 8 números y una letra correcta.';
        } else if (tipoDocumento === 'NIE') {
            mensaje = validarNIE(dniNie) ? '' : 'NIE no válido. Formato incorrecto o letra no válida.';
        }

        DOM.dniNieInput.setCustomValidity(mensaje);
    });

    // Validar formulario y mostrar mensajes
    DOM.form.addEventListener('input', () => actualizarMensajes());
    DOM.form.addEventListener('submit', (e) => {
        if (!DOM.form.checkValidity()) {
            e.preventDefault();
            actualizarMensajes();
        }
    });

    // Validar aficiones seleccionadas
    DOM.form.addEventListener('submit', (e) => {
        const aficionesSeleccionadas = Array.from(DOM.aficionesCheckboxes)
            .filter((checkbox) => checkbox.checked)
            .map((checkbox) => checkbox.value);

        if (aficionesSeleccionadas.length < 2) {
            e.preventDefault();
            alert('Debes seleccionar al menos dos aficiones.');
            return;
        }

        const prevHiddenInput = document.querySelector('input[type="hidden"][name="Aficiones"]');
        if (prevHiddenInput) prevHiddenInput.remove();

        const aficionesInputHidden = document.createElement('input');
        aficionesInputHidden.type = 'hidden';
        aficionesInputHidden.name = 'Aficiones';
        aficionesInputHidden.value = aficionesSeleccionadas.join(', ');
        DOM.form.appendChild(aficionesInputHidden);
    });

    // Algoristo para validar DNI y NIE
    const validarDNI = (dni) => {
        const regexDNI = /^[0-9]{8}[A-Z]$/;
        if (!regexDNI.test(dni)) return false;
        const numero = parseInt(dni.slice(0, 8), 10);
        const letra = dni.charAt(8);
        return letrasDNI[numero % 23] === letra;
    };

    const validarNIE = (nie) => {
        const regexNIE = /^[XYZ][0-9]{7}[A-Z]$/;
        if (!regexNIE.test(nie)) return false;
        const nieConvertido = nie.replace('X', '0').replace('Y', '1').replace('Z', '2');
        const numero = parseInt(nieConvertido.slice(0, 8), 10);
        const letra = nie.charAt(8);
        return letrasDNI[numero % 23] === letra;
    };

    // Actualizar mensajes en la parte derecha
    const actualizarMensajes = () => {
        DOM.mensajesDiv.innerHTML = '';

        Array.from(DOM.form.elements).forEach((elemento) => {
            if (elemento.tagName !== 'BUTTON') {
                const mensaje = elemento.validationMessage;
                actualizarMensajeCampo(elemento, mensaje);
                if (mensaje) {
                    const mensajeDiv = document.createElement('div');
                    mensajeDiv.textContent = `${elemento.name}: ${mensaje}`;
                    DOM.mensajesDiv.appendChild(mensajeDiv);
                }
            }
        });
    };

    // Actualizar mensaje de error de elemento
    const actualizarMensajeCampo = (elemento, mensaje) => {
        let mensajeElemento = document.querySelector(`#error-${elemento.id}`);

        if (!mensajeElemento) {
            mensajeElemento = document.createElement('p');
            mensajeElemento.id = `error-${elemento.id}`;
            mensajeElemento.classList.add('error');
            elemento.insertAdjacentElement('afterend', mensajeElemento);
        }

        mensajeElemento.textContent = mensaje;
        if (!mensaje) mensajeElemento.remove();
    };
});
