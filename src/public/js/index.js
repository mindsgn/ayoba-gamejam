const canvas = document.getElementById('canvasWindow')
const button = document.getElementById('btnPlay')
const ctx = canvas.getContext('2d')
const layer0 = new Image()

layer0.src = '../assets/layer.png'

layer0.onload = () => {
    ctx.drawImage(layer0, 0, 0)
}

button.addEventListener('click', () => {
    button.style.display = 'none'
})
