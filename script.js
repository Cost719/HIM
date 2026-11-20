/* ==========================================================
   MOBILE MENU  (single handler, works on every page)
   ========================================================== */
document.addEventListener('click', function (e) {
    var nav = document.querySelector('.navbar');
    if (!nav) return;

    var icon = document.querySelector('#menu-icon i');

    function setMenu(open) {
        nav.classList.toggle('active', open);
        if (icon) {
            icon.classList.toggle('bx-menu', !open);
            icon.classList.toggle('bx-x', open);
        }
    }

    if (e.target.closest('#menu-icon')) {
        // tapped the three lines: open or close
        setMenu(!nav.classList.contains('active'));
    } else if (e.target.closest('.navbar a') || !e.target.closest('.navbar')) {
        // tapped a link, or tapped outside the menu: close
        setMenu(false);
    }
});

window.addEventListener('resize', function () {
    if (window.innerWidth > 991) {
        var nav = document.querySelector('.navbar');
        var icon = document.querySelector('#menu-icon i');
        if (nav) nav.classList.remove('active');
        if (icon) { icon.classList.add('bx-menu'); icon.classList.remove('bx-x'); }
    }
});

/* ==========================================================
   BROWN SPIDER-WEB BACKGROUND
   ========================================================== */
try {
    (function () {
        var canvas = document.getElementById('web-bg');
        if (!canvas) return;
        var ctx = canvas.getContext('2d');

        var COLORS = ['#8b5a2b', '#a0693a', '#6b4423', '#c28850'];
        var LINK_DIST = 150;
        var MOUSE_DIST = 200;
        var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        var w, h, nodes = [];
        var mouse = { x: null, y: null };

        function resize() {
            var dpr = window.devicePixelRatio || 1;
            w = window.innerWidth;
            h = window.innerHeight;
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            var count = Math.min(110, Math.floor((w * h) / 14000));
            nodes = [];
            for (var i = 0; i < count; i++) {
                nodes.push({
                    x: Math.random() * w,
                    y: Math.random() * h,
                    vx: (Math.random() - 0.5) * 0.4,
                    vy: (Math.random() - 0.5) * 0.4,
                    r: Math.random() * 1.8 + 0.8,
                    color: COLORS[Math.floor(Math.random() * COLORS.length)]
                });
            }
            if (reduceMotion) draw();
        }

        function draw() {
            ctx.clearRect(0, 0, w, h);

            for (var i = 0; i < nodes.length; i++) {
                var a = nodes[i];

                if (!reduceMotion) {
                    a.x += a.vx;
                    a.y += a.vy;
                    if (a.x < 0 || a.x > w) a.vx *= -1;
                    if (a.y < 0 || a.y > h) a.vy *= -1;
                }

                ctx.beginPath();
                ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
                ctx.fillStyle = a.color;
                ctx.shadowColor = a.color;
                ctx.shadowBlur = 8;
                ctx.fill();
                ctx.shadowBlur = 0;

                for (var j = i + 1; j < nodes.length; j++) {
                    var b = nodes[j];
                    var d = Math.hypot(a.x - b.x, a.y - b.y);
                    if (d < LINK_DIST) {
                        ctx.strokeStyle = 'rgba(160, 105, 58, ' + ((1 - d / LINK_DIST) * 0.45) + ')';
                        ctx.lineWidth = 0.8;
                        ctx.beginPath();
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(b.x, b.y);
                        ctx.stroke();
                    }
                }

                if (mouse.x !== null) {
                    var dm = Math.hypot(a.x - mouse.x, a.y - mouse.y);
                    if (dm < MOUSE_DIST) {
                        ctx.strokeStyle = 'rgba(194, 136, 80, ' + ((1 - dm / MOUSE_DIST) * 0.8) + ')';
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.stroke();
                    }
                }
            }

            if (!reduceMotion) requestAnimationFrame(draw);
        }

        window.addEventListener('resize', resize);
        window.addEventListener('mousemove', function (e) { mouse.x = e.clientX; mouse.y = e.clientY; });
        window.addEventListener('mouseleave', function () { mouse.x = mouse.y = null; });
        window.addEventListener('touchmove', function (e) {
            mouse.x = e.touches[0].clientX;
            mouse.y = e.touches[0].clientY;
        }, { passive: true });
        window.addEventListener('touchend', function () { mouse.x = mouse.y = null; });

        resize();
        if (!reduceMotion) draw();
    })();
} catch (err) {
    console.error('Background animation error:', err);
}