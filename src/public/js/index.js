var canvas = document.getElementById('canvasWindow')
var button = document.getElementById('btnPlay')

button.addEventListener('click', () => {
    canvas.requestFullscreen()
})
