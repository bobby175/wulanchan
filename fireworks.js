(function(){
    const canvas = document.getElementById("rocketCanvas");
    if(!canvas) return;
    const ctx = canvas.getContext("2d");

    let w, h;
    const DPR = Math.min(window.devicePixelRatio || 1, 1.5); 

    function resize(){
        w = canvas.width = window.innerWidth * DPR;
        h = canvas.height = window.innerHeight * DPR;
        canvas.style.width = window.innerWidth + "px";
        canvas.style.height = window.innerHeight + "px";
        ctx.scale(DPR, DPR);
    }
    resize();
    window.addEventListener("resize", resize);

    const colors = [
        "#ff6b6b", "#ff9ff3", "#feca57", "#48dbfb", "#ff9f43", "#54a0ff", "#5f27cd", "#00d2d3"
    ];

    class Particle {
        constructor(x, y, color, velocity) {
            this.x = x;
            this.y = y;
            this.vx = velocity.x;
            this.vy = velocity.y;
            this.alpha = 1;
            this.color = color;
            this.decay = Math.random() * 0.01 + 0.008; 
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            const size = Math.random() * 1.2 + 0.8; 
            ctx.arc(this.x, this.y, size, 0, Math.PI * 2); 
            ctx.fill();
            ctx.restore();
        }

        update() {
            this.vx *= 0.96; 
            this.vy *= 0.96; 
            this.vy += 0.12;
            this.x += this.vx;
            this.y += this.vy;
            this.alpha -= this.decay;
            return this.alpha <= 0;
        }
    }

    class Firework {
        constructor() {
            this.x = Math.random() * (window.innerWidth * 0.6) + (window.innerWidth * 0.2);
            this.y = window.innerHeight;
            this.targetY = Math.random() * (window.innerHeight * 0.4) + (window.innerHeight * 0.1);
            this.speed = Math.random() * 3 + 13; 
            this.angle = -Math.PI / 2 + (Math.random() * 0.2 - 0.1);
            
            this.vx = Math.cos(this.angle) * this.speed;
            this.vy = Math.sin(this.angle) * this.speed;
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }

        draw() {
            ctx.save();
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 3;
            ctx.lineCap = "round";
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x - this.vx * 1.5, this.y - this.vy * 1.5);
            ctx.stroke();
            ctx.restore();
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.vy += 0.05;

            if (this.y <= this.targetY || this.vy >= -1) {
                createExplosion(this.x, this.y, this.color);
                return true;
            }
            return false;
        }
    }

    function getHeartVelocity(t) {
        const x = 16 * Math.pow(Math.sin(t), 3);
        const y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
        return {x, y};
    }

    function createExplosion(x, y, color) {
        const particleCount = 80;
        const chance = Math.random();

        if (chance < 0.5) {
            
            for (let i = 0; i < particleCount; i++) {
                const t = (Math.PI * 2 * i) / particleCount;
                const velocity = getHeartVelocity(t);
                
                const speed = 1.0 + Math.random() * 1.2; 
                
                particles.push(new Particle(x, y, color, {
                    x: (velocity.x / 5) * speed, 
                    y: (velocity.y / 5) * speed
                }));
            }
        } else {
            for (let i = 0; i < particleCount; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 10 + 3; 
                
                particles.push(new Particle(x, y, color, {
                    x: Math.cos(angle) * speed,
                    y: Math.sin(angle) * speed
                }));
            }
        }
    }

    let fireworks = [];
    let particles = [];
    
    function animate() {
        ctx.fillStyle = "rgba(0, 0, 0, 0.15)"; 
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

        // Spawn rate
        if (Math.random() < 0.035) {
            fireworks.push(new Firework());
        }

        fireworks = fireworks.filter(f => {
            f.draw();
            return !f.update();
        });

        particles = particles.filter(p => {
            p.draw();
            return !p.update();
        });

        requestAnimationFrame(animate);
    }
    
    animate();
})();
