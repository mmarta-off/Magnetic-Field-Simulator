document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById('magnetCanvas');
    const ctx = canvas.getContext('2d');
    const magnets = [];
    const magnetRadius = 20;

    canvas.addEventListener('mousedown', function(e) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const magnet = findMagnet(x, y);
        if (magnet) {
            const offsetX = x - magnet.x;
            const offsetY = y - magnet.y;

            function moveMagnet(e) {
                magnet.x = e.clientX - rect.left - offsetX;
                magnet.y = e.clientY - rect.top - offsetY;
                draw();
            }

            canvas.addEventListener('mousemove', moveMagnet);

            canvas.addEventListener('mouseup', function() {
                canvas.removeEventListener('mousemove', moveMagnet);
            }, { once: true });
        }
    });

    function findMagnet(x, y) {
        return magnets.find(m => Math.hypot(m.x - x, m.y - y) <= magnetRadius);
    }

    function addMagnet(polarity) {
        magnets.push({ x: canvas.width / 2, y: canvas.height / 2, polarity });
        draw();
    }

    function drawMagnet(magnet) {
        ctx.fillStyle = magnet.polarity > 0 ? 'red' : 'blue';
        ctx.beginPath();
        ctx.arc(magnet.x, magnet.y, magnetRadius, 0, Math.PI * 2);
        ctx.fill();
    }

    function drawFieldLines() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        magnets.forEach(m1 => {
            magnets.forEach(m2 => {
                if (m1 !== m2) {
                    const dist = Math.hypot(m2.x - m1.x, m2.y - m1.y);
                    const segments = dist / 20;
                    const angleIncrement = Math.PI / 2 * (m1.polarity === m2.polarity ? 1 : -1);

                    ctx.beginPath();
                    ctx.strokeStyle = 'yellow';
                    ctx.lineWidth = 2;
                    for (let i = 0; i <= segments; i++) {
                        const t = i / segments;
                        const curX = m1.x + (m2.x - m1.x) * t;
                        const curY = m1.y + (m2.y - m1.y) * t;
                        const angle = Math.atan2(m2.y - m1.y, m2.x - m1.x) + angleIncrement * t;
                        const len = 10 * Math.sin(Math.PI * t); // sinusoidal variation in length
                        ctx.moveTo(curX, curY);
                        ctx.lineTo(curX + len * Math.cos(angle), curY + len * Math.sin(angle));
                    }
                    ctx.stroke();
                }
            });
        });
        magnets.forEach(drawMagnet);
    }

    function draw() {
        drawFieldLines();
    }

    window.addMagnet = addMagnet; // Expose function to global window object for HTML button access
});
