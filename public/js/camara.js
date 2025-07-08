let stream;

function habilitar_Camara() {
    document.getElementById('camara_foto').style.display = 'inline-block';
    document.getElementById('btn_hc').style.display = 'none';

    navigator.mediaDevices.getUserMedia({ video: true })
        .then(s => {
            stream = s;
            document.getElementById('my_camara').srcObject = stream;
        })
        .catch(error => {
            console.log(error);
        });
}

function deshabilitar_Camara() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        document.getElementById('my_camara').srcObject = null;
        document.getElementById('camara_foto').style.display = 'none';
        document.getElementById('btn_hc').style.display = 'inline-block';
    }
}

function tomarFoto() {
    const video = document.getElementById('my_camara');
    const canvas = document.getElementById('foto');
    const ctx = canvas.getContext('2d');

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    GuardarImagen(canvas);
}

function GuardarImagen(canvas) {
    try {
        const dataUrl = canvas.toDataURL('image/png');
        document.getElementById('foto_estudiante').value = dataUrl;

        const estudianteLogueado = JSON.parse(localStorage.getItem('estudianteLogueado'));
        if (!estudianteLogueado) return;

        let estudiantes = JSON.parse(localStorage.getItem('estudiantes')) || [];
        const index = estudiantes.findIndex(e => e.email === estudianteLogueado.email);
        if (index !== -1) {
            estudiantes[index].foto = dataUrl;
            localStorage.setItem('estudiantes', JSON.stringify(estudiantes));

            estudianteLogueado.foto = dataUrl;
            localStorage.setItem('estudianteLogueado', JSON.stringify(estudianteLogueado));
        }
    } catch (e) {
        console.error('Error al convertir el canvas a Base64:', e);
    }
}
