// Site-wide Easter egg: type "vroom" on any page (or click the About page's hero AMR) and a robot drives into a
// full-window overlay above everything (fixed, pointer-events: none, so nothing on the page moves or stops working). There it's a CSS 3D
// box (side / front / back / top faces) driving on a floor seen in perspective: far away = higher up and smaller.
// The motion is a little vehicle model, not random wobble: momentum, a yaw-rate limit and tyre grip that sheds
// sideways speed. Low grip + fast yaw is a drift; the "driver" strings together runs, drifts, handbrake turns,
// donuts and jumps (now and then a flip), and in about every other session drives deep, spins round to face you
// and charges the camera.
// Skid marks and dust on a canvas under it. "vroom" brings it in from off-screen; a click on the About hero makes
// it hop out of the hero. After ~half a minute it docks back into the About hero (hopping up into it) if that's on
// screen, else drives off an edge. Esc ends it early. Idle cost is one keydown listener; nothing runs until it's
// triggered. Off with reduced motion. Styles: custom.css "AMR Easter egg".
(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const art = document.querySelector('#lnj-about .lnj-amr');   // the About hero robot (only on that page)

    // ---- the robot's faces (viewBox units; side 160x80, front/back 100x80, top 160x100, all at the same scale) --
    const wheel = (cx) => `<g class="lnj-amr3d__wheel" style="transform-origin: ${cx}px 62px">`
        + `<circle class="lnj-amr3d__tyre" cx="${cx}" cy="62" r="15"/>`
        + `<path class="lnj-amr3d__spokes" d="M${cx} 51v22M${cx - 11} 62h22"/>`
        + `<circle class="lnj-amr3d__hub" cx="${cx}" cy="62" r="5"/></g>`;
    // an anime eye: one accent shape per mood, all but "open" hidden (expression() switches them); `dir` is +1 for
    // the left eye, -1 for the right, so "> <" points inward
    const spiral = (cx, cy) => {
        let d = '';
        for (let a = 0; a <= 3 * Math.PI; a += 0.35) d += `${d ? 'L' : 'M'}${(cx + Math.cos(a) * (1 + a)).toFixed(1)} ${(cy + Math.sin(a) * (1 + a)).toFixed(1)}`;
        return d;
    };
    const eye = (cx, cy, dir) => {
        const shapes = {
            open: `<ellipse class="lnj-amr3d__ink" cx="${cx}" cy="${cy}" rx="6" ry="9"/>`,
            blink: `<path class="lnj-amr3d__line" d="M${cx - 7} ${cy + 1}h14"/>`,
            happy: `<path class="lnj-amr3d__line" d="M${cx - 7} ${cy + 4}q7-12 14 0"/>`,
            fierce: `<path class="lnj-amr3d__line" d="M${cx - 5 * dir} ${cy - 6}l${10 * dir} 6l${-10 * dir} 6"/>`,
            stars: `<path class="lnj-amr3d__ink lnj-amr3d__spin" d="M${cx} ${cy - 11}Q${cx + 1.5} ${cy - 1.5} ${cx + 11} ${cy}`
                + `Q${cx + 1.5} ${cy + 1.5} ${cx} ${cy + 11}Q${cx - 1.5} ${cy + 1.5} ${cx - 11} ${cy}Q${cx - 1.5} ${cy - 1.5} ${cx} ${cy - 11}Z"/>`,
            dizzy: `<path class="lnj-amr3d__line lnj-amr3d__spin" d="${spiral(cx, cy)}"/>`,
            love: `<path class="lnj-amr3d__ink" d="M${cx} ${cy + 8}C${cx - 14} ${cy - 2} ${cx - 6} ${cy - 12} ${cx} ${cy - 4}`
                + `C${cx + 6} ${cy - 12} ${cx + 14} ${cy - 2} ${cx} ${cy + 8}Z"/>`,
        };
        return '<g class="lnj-amr3d__eye">' + Object.entries(shapes).map(([mood, svg]) =>
            svg.replace('/>', ` data-mood="${mood}"${mood === 'open' ? '' : ' style="display: none"'}/>`)).join('') + '</g>';
    };
    const end = (extra) => '<rect class="lnj-amr3d__tyre" x="3" y="47" width="17" height="30" rx="5"/>'
        + '<rect class="lnj-amr3d__tyre" x="80" y="47" width="17" height="30" rx="5"/>'
        + '<rect class="lnj-amr3d__lidar" x="39" y="3" width="22" height="13" rx="3"/>'
        + '<rect class="lnj-amr3d__body" x="4" y="14" width="92" height="44" rx="12"/>' + extra;
    const SVG = {
        side: ['0 0 160 80', '<rect class="lnj-amr3d__lidar" x="124" y="3" width="22" height="13" rx="3"/>'
            + '<rect class="lnj-amr3d__body" x="4" y="14" width="152" height="44" rx="12"/>'
            + '<path class="lnj-amr3d__led" d="M22 36h40"/>'
            + wheel(38) + wheel(122)],
        front: ['0 0 100 80', end(eye(32, 34, 1) + eye(68, 34, -1))],
        back: ['0 0 100 80', end('<path class="lnj-amr3d__led" d="M28 36h44"/>')],
        top: ['0 0 160 100', '<rect class="lnj-amr3d__body" x="4" y="4" width="152" height="92" rx="12"/>'
            + '<rect class="lnj-amr3d__deck" x="28" y="24" width="72" height="52" rx="4"/>'
            + '<circle class="lnj-amr3d__lidar" cx="135" cy="50" r="11"/>'],
    };

    const rand = (a, b) => a + Math.random() * (b - a);
    const chance = (p) => Math.random() < p;
    const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
    const wrapPi = (a) => Math.atan2(Math.sin(a), Math.cos(a));
    const ease = (rate, dt) => 1 - Math.exp(-rate * dt);   // frame-rate independent "approach"

    let run = null;   // the running session, if any

    function start(fromHero) {
        if (run) return;
        run = session(fromHero);
    }

    function session(fromHero) {
        // ---- overlay: canvas (marks, dust), floor shadow, robot ----
        const stage = document.createElement('div');
        stage.className = 'lnj-amr3d-stage';
        stage.setAttribute('aria-hidden', 'true');
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const shadow = document.createElement('div');
        shadow.className = 'lnj-amr3d-shadow';
        const bot = document.createElement('div');
        bot.className = 'lnj-amr3d';
        stage.append(canvas, shadow, bot);

        // robot size in world px (= screen px at depth 0): length, width, height
        const L = clamp(window.innerWidth * 0.1, 90, 170), D = L * 0.625, Ht = L * 0.5;
        const face = (kind, w, h, transform, mirrored) => {
            const el = document.createElement('div');
            el.className = 'lnj-amr3d__face';
            Object.assign(el.style, {
                width: `${w}px`, height: `${h}px`, left: `${-w / 2}px`, top: `${-h}px`, transform,
            });
            el.innerHTML = `<svg viewBox="${SVG[kind][0]}"${mirrored ? ' class="is-mirrored"' : ''}>${SVG[kind][1]}</svg>`;
            bot.append(el);
            return el;
        };
        // faces hang from the robot's origin (floor, centre); see the transform in render() for the pivot
        face('side', L, Ht, `translateZ(${D / 2}px)`);
        face('side', L, Ht, `rotateY(180deg) translateZ(${D / 2}px)`, true);
        face('front', D, Ht, `rotateY(90deg) translateZ(${L / 2}px)`);
        face('back', D, Ht, `rotateY(-90deg) translateZ(${L / 2}px)`);
        const top = face('top', L, D, `translateY(${-Ht * 66 / 80 + D / 2}px) rotateX(90deg)`);
        top.style.transformOrigin = '50% 50%';
        Object.assign(shadow.style, { width: `${L * 1.2}px`, height: `${D * 1.3}px`, left: `${-L * 0.6}px`, top: `${-D * 0.65}px` });
        const wheels = [...bot.querySelectorAll('.lnj-amr3d__wheel')];
        const eyes = [...bot.querySelectorAll('.lnj-amr3d__eye')];
        const moodShapes = [...bot.querySelectorAll('[data-mood]')];
        document.body.append(stage);

        // ---- camera: CSS perspective P from (ox, oy), eye a little above the window; floor at floorY at depth 0 ----
        let W, H, ox, oy, floorY, P, dpr;
        function geometry() {
            W = window.innerWidth;
            H = window.innerHeight;
            ox = W / 2;
            oy = -0.12 * H;
            floorY = 0.55 * H;
            P = 1.1 * Math.max(W, H);
            dpr = window.devicePixelRatio || 1;
            stage.style.perspective = `${P}px`;
            stage.style.perspectiveOrigin = `${ox}px ${oy}px`;
            canvas.width = Math.round(W * dpr);
            canvas.height = Math.round(H * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }
        geometry();
        window.addEventListener('resize', geometry);

        // world (x right, y down, z toward the viewer) -> screen; and the floor point under a screen point
        const proj = (x, y, z) => {
            const s = P / (P - z);
            return [ox + (x - ox) * s, oy + (y - oy) * s, s];
        };
        const floorAt = (sx, sy) => {
            const s = Math.max(0.25, (sy - oy) / (floorY - oy));
            return [ox + (sx - ox) / s, P * (1 - 1 / s)];
        };
        // somewhere on screen to drive to: anywhere from far (top) to near (bottom)
        const spot = () => floorAt(rand(0.08, 0.92) * W, rand(oy + (floorY - oy) * 0.4, Math.min(0.92 * H, oy + (floorY - oy) * 1.6)));

        // ---- state (world px, s, rad) ----
        const G = 20 * L;                // gravity
        const s = {
            x: 0, z: 0, y: 0, vx: 0, vz: 0, vy: 0, yaw: 0, pitch: 0, flip: 0, flipRate: 0, roll: 0, grip: 10, wheel: 0,
        };
        let ctl = { yaw: 0, yawRate: null, maxYaw: 3, throttle: 0, grip: 10 };
        let move = null, moveT = 0, charged = false, opacity = 1, ending = false, docked = false;
        const t0 = performance.now(), length = rand(24000, 34000);
        let skids = [], puffs = [], lastContacts = null;

        // where the About hero robot is, in world terms: the depth at which the 3D robot matches its size, and how
        // high above the floor it sits there; null when it's not on screen (or not on this page)
        function heroSpot() {
            if (!art) return null;
            const b = art.getBoundingClientRect();
            if (!b.width || b.bottom < 0 || b.top > H || b.right < 0 || b.left > W) return null;
            const sx = b.left + b.width * 0.55, sy = b.top + b.height * 0.85;
            const sc = clamp((b.width * 0.56) / L, 0.35, 1.4);
            return { x: ox + (sx - ox) / sc, z: P * (1 - 1 / sc), y: clamp(floorY - oy - (sy - oy) / sc, 0, 8 * L) };
        }

        // from off a side edge, mid-distance, already moving (also used after it drives into the camera)
        const tooClose = () => s.z + L / 2 > P - 1.2 * L;
        function respawn() {
            const left = chance(0.5);
            s.z = -P / 3;
            s.x = ox + ((left ? -0.25 : 1.25) * W - ox) / 0.75;
            s.y = s.vy = s.flip = s.flipRate = 0;
            s.yaw = left ? 0 : Math.PI;
            s.vx = (left ? 1 : -1) * 7 * L;
            s.vz = 0;
            lastContacts = null;
        }

        // start: hopping out of the hero (in the air above its floor spot, so it drops out of the page), or from
        // off-screen; either way the hero robot is hidden until it comes back
        const hero = fromHero && heroSpot();
        if (hero) {
            Object.assign(s, { x: hero.x, z: hero.z, y: hero.y, vy: -6 * L, vx: 3 * L });
        } else {
            respawn();
        }
        if (art) art.classList.add('is-out');

        const aim = (tx, tz) => Math.atan2(-(tz - s.z), tx - s.x);
        const onGround = () => s.y <= 0 && s.vy >= 0;

        // ---- the driver: one move at a time ----
        const moves = {
            run() {
                const [tx, tz] = spot();
                return { grip: 10, maxYaw: 3, dur: 3.5, tick() { ctl.yaw = aim(tx, tz); ctl.throttle = 1; return Math.hypot(tx - s.x, tz - s.z) < 1.5 * L; } };
            },
            drift() {
                // a spot well off the current heading: the turn is sharp enough to break traction
                let tx, tz;
                for (let i = 0; i < 12; i++) {
                    [tx, tz] = spot();
                    if (Math.abs(wrapPi(aim(tx, tz) - s.yaw)) > 1.6) break;
                }
                return { grip: 1.6, maxYaw: 5.5, dur: rand(0.9, 1.6), tick() { ctl.yaw = aim(tx, tz); ctl.throttle = 0.85; } };
            },
            handbrake() {
                // somewhere behind it: lock up, swing the tail round, power away
                let tx, tz;
                for (let i = 0; i < 16; i++) {
                    [tx, tz] = spot();
                    if (Math.abs(wrapPi(aim(tx, tz) - s.yaw)) > 2.4) break;
                }
                return { grip: 0.7, maxYaw: 7, dur: 1.4, tick(t) { ctl.yaw = aim(tx, tz); ctl.throttle = t < 0.4 ? -0.3 : 1; } };
            },
            donut() {
                const dir = chance(0.5) ? 1 : -1;
                return { grip: 1.1, dur: rand(1.4, 2.4), tick() { ctl.yawRate = 6.5 * dir; ctl.throttle = 0.9; } };
            },
            jump() {
                // straight run-up, then off an invisible ramp; sometimes a backflip
                const yaw = s.yaw;
                let launched = false;
                return {
                    grip: 10, maxYaw: 3, dur: 4, tick() {
                        ctl.yaw = yaw;
                        ctl.throttle = 1;
                        const vF = s.vx * Math.cos(s.yaw) - s.vz * Math.sin(s.yaw);
                        if (!launched && onGround() && vF > 5 * L) {
                            launched = true;
                            s.vy = -rand(7, 10) * L;
                            if (chance(0.35)) s.flipRate = (-360 * G) / (2 * -s.vy);   // one turn in the air time
                        }
                        return launched && onGround();
                    },
                };
            },
            charge() {
                // drive deep, spin round to face the camera, and come straight at it, jumping on the way
                const [fx, fz] = floorAt(ox, oy + (floorY - oy) * 0.45);
                let phase = 0, wait = 0, jumped = false;
                return {
                    grip: 10, maxYaw: 3.2, dur: 14, tick(t, dt) {
                        if (phase === 0) {
                            ctl.yaw = aim(fx, fz);
                            ctl.throttle = 1;
                            if (Math.hypot(fx - s.x, fz - s.z) < 2 * L || t > 5) phase = 1;
                        } else if (phase === 1) {
                            ctl.grip = 1.4;
                            ctl.maxYaw = 6;
                            ctl.yaw = -Math.PI / 2;
                            ctl.throttle = -0.6;
                            const speed = Math.hypot(s.vx, s.vz);
                            if (Math.abs(wrapPi(-Math.PI / 2 - s.yaw)) < 0.08 && speed < 1.5 * L && (wait += dt) > 0.35) phase = 2;
                        } else if (phase === 2) {
                            ctl.grip = 10;
                            ctl.yaw = -Math.PI / 2;
                            ctl.throttle = 1.5;
                            s.thrill = true;
                            if (!jumped && s.z > -1.5 * L && onGround()) {
                                jumped = true;
                                s.vy = -9 * L;
                            }
                            if (tooClose()) {
                                respawn();
                                return true;
                            }
                        }
                        return false;
                    },
                };
            },
            dock() {
                // back into the About hero: come round to approach from its left (so it arrives facing right, like
                // the hero), ease in under it, hop up into its spot and fade into it at the top of the hop
                let phase = 0;
                return {
                    grip: 10, maxYaw: 3.5, dur: 12, tick() {
                        const h = heroSpot();
                        if (!h) return true;            // scrolled away: the next move drives off instead
                        const dist = Math.hypot(h.x - s.x, h.z - s.z);
                        const vF = s.vx * Math.cos(s.yaw) - s.vz * Math.sin(s.yaw);
                        // ease off near each point, so it can't end up circling it
                        const speedFor = (d, top) => clamp((Math.min(top, 2.5 * d + L) - vF) / (3 * L), -1, 1);
                        if (phase === 0) {
                            const d = Math.hypot(h.x - 3 * L - s.x, h.z - s.z);
                            ctl.yaw = aim(h.x - 3 * L, h.z);
                            ctl.throttle = speedFor(d, 9 * L);
                            if (d < 1.5 * L) phase = 1;
                        } else if (phase === 1) {
                            ctl.yaw = aim(h.x, h.z);
                            ctl.throttle = speedFor(dist, 6 * L);
                            if (dist < 0.4 * L) {
                                // hop so the top of the arc lands exactly on the hero's spot
                                phase = 2;
                                const up = h.y > 0.2 * L ? Math.sqrt(2 * G * h.y) : 0;
                                const tUp = Math.max(up / G, 0.15);
                                s.vy = -up;
                                s.vx = (h.x - s.x) / tUp;
                                s.vz = (h.z - s.z) / tUp;
                                if (!up) s.y = 0.01;   // airborne for a moment even with no height to climb
                            }
                        } else {
                            s.yaw += wrapPi(-s.yaw) * 0.2;   // square up in the air
                            if (s.vy >= 0 || Math.hypot(h.x - s.x, h.z - s.z) < 0.05 * L) docked = true;
                        }
                        return false;
                    },
                };
            },
            exit() {
                // off whichever side is nearer, then the session ends
                const [sx, sy] = proj(s.x, floorY, s.z);
                const [tx, tz] = floorAt(sx < W / 2 ? -0.6 * W : 1.6 * W, clamp(sy, 0.3 * H, 0.9 * H));
                return { grip: 10, maxYaw: 3, dur: 8, tick() { ctl.yaw = aim(tx, tz); ctl.throttle = 1; } };
            },
        };

        function nextMove(now) {
            let kind;
            if (ending || now - t0 > length) {
                kind = heroSpot() ? 'dock' : 'exit';
                ending = true;
            } else if (!charged && now - t0 > 7000 && chance(0.06)) {   // about every other session
                kind = 'charge';
                charged = true;
            } else {
                const r = Math.random();
                kind = r < 0.36 ? 'run' : r < 0.62 ? 'drift' : r < 0.74 ? 'handbrake' : r < 0.83 ? 'donut' : 'jump';
            }
            move = moves[kind]();
            move.kind = kind;
            s.thrill = false;
            moveT = 0;
        }

        // ---- physics ----
        function step(dt, now) {
            if (!move || moveT > move.dur) nextMove(now);
            ctl = { yaw: s.yaw, yawRate: null, maxYaw: move.maxYaw || 3, throttle: 0, grip: move.grip };
            if (move.tick(moveT, dt)) nextMove(now);
            moveT += dt;

            const air = (s.air = !onGround() || s.y > 0);
            const f = [Math.cos(s.yaw), -Math.sin(s.yaw)], l = [Math.sin(s.yaw), Math.cos(s.yaw)];
            let vF = s.vx * f[0] + s.vz * f[1], vL = s.vx * l[0] + s.vz * l[1];
            let aF = 0;
            if (!air) {
                s.grip += (ctl.grip - s.grip) * ease(3, dt);
                const yawRate = ctl.yawRate ?? clamp(wrapPi(ctl.yaw - s.yaw) * 6, -ctl.maxYaw, ctl.maxYaw);
                s.yaw += yawRate * dt;
                s.yawRate = yawRate;
                aF = ctl.throttle * 13 * L - 1.4 * vF;            // engine (or brake) minus drag: tops out ~9 L/s
                if (ctl.throttle < 0 && vF < 0.3 * L) aF = -1.4 * vF;   // brakes stop it, they don't reverse it
                vF += aF * dt;
                vL *= Math.exp(-s.grip * dt);                     // tyres shed sideways speed; less grip, longer slide
            }
            const nf = [Math.cos(s.yaw), -Math.sin(s.yaw)], nl = [Math.sin(s.yaw), Math.cos(s.yaw)];
            s.vx = vF * nf[0] + vL * nl[0];
            s.vz = vF * nf[1] + vL * nl[1];
            s.x += s.vx * dt;
            s.z += s.vz * dt;

            // vertical: gravity, landing with a small bounce and a puff of dust
            if (air) {
                s.vy += G * dt;
                s.y -= s.vy * dt;
                s.flip += s.flipRate * dt;
                if (s.y <= 0) {
                    s.y = 0;
                    if (s.vy > 5 * L) dust(8, 1.4);
                    s.vy = s.vy > 4 * L ? -s.vy * 0.22 : 0;
                    s.flip = s.flipRate = 0;
                }
            }

            // body attitude: nose up on the throttle / down on the brakes, nose follows the arc in the air; lean in slides
            const leanTo = air ? clamp(s.vy / L, -14, 14) * 1.2 : clamp(-aF / L, -12, 10);
            s.pitch += (leanTo - s.pitch) * ease(8, dt);
            s.roll += (clamp((vL / L) * 3, -14, 14) - s.roll) * ease(8, dt);
            s.wheel += ((vF * dt) / (0.094 * L)) * (180 / Math.PI);

            // skid marks and dust where the tyres slide
            const slip = (s.slip = Math.abs(vL) / L);
            const contacts = [[0.26, 0.5], [0.26, -0.5], [-0.26, 0.5], [-0.26, -0.5]].map(([a, b]) => {
                const lx = a * L, lz = b * D;
                return proj(s.x + lx * Math.cos(s.yaw) + lz * Math.sin(s.yaw), floorY, s.z - lx * Math.sin(s.yaw) + lz * Math.cos(s.yaw));
            });
            const braking = !air && ctl.throttle < 0 && vF > 2 * L;
            if (!air && (slip > 1.2 || braking)) {
                const weight = clamp(slip / 5 + (braking ? 0.4 : 0), 0.15, 1);
                if (lastContacts) contacts.forEach((p, i) => skids.push({ from: lastContacts[i], to: p, weight, t: now }));
                lastContacts = contacts;
                if (chance(clamp(slip / 12, 0, 0.5))) dust(1, 0.8, contacts[2 + (Math.random() * 2) | 0]);
            } else {
                lastContacts = null;
            }

            if (tooClose()) {
                respawn();
                if (!ending) nextMove(now);
            }

            // fade out (and stop drawing) just before it reaches the camera
            const near = s.z + L / 2;
            opacity = clamp((P - 1.2 * L - near) / (3 * L), 0, 1);
        }

        function dust(n, size, at) {
            const [sx, sy, sc] = at || proj(s.x, floorY, s.z);
            for (let i = 0; i < n; i++) {
                puffs.push({
                    x: sx + rand(-0.4, 0.4) * L * sc, y: sy, r: rand(0.04, 0.09) * L * sc * size,
                    vx: rand(-1.2, 1.2) * L * sc, vy: -rand(0.1, 0.5) * L * sc, life: rand(0.5, 0.9), age: 0,
                });
            }
        }

        // ---- drawing ----
        const css = getComputedStyle(document.body);
        const ink = css.getPropertyValue('--fg').trim() || '#1b1b1b';
        const haze = css.getPropertyValue('--mid').trim() || '#777777';
        const SKID_LIFE = 3200;

        // the face, a kid on a ride: "open" ovals that blink every few seconds (sometimes twice) and look into turns
        // and glance about; ^ ^ in the air, > < sliding and spinning, @ @ dizzy after a donut, spinning stars charging
        // the camera, hearts on the way home into the About hero
        let blinkAt = performance.now() + rand(800, 2500), blinkEnd = 0, dizzyUntil = 0, lastKind = '';
        let glance = [0, 0], glanceAt = blinkAt + 1500, glanceEnd = 0, mood = 'open', moodSince = 0;
        const look = [0, 0];
        function expression(dt, now) {
            if (now > blinkAt) {
                blinkEnd = now + 110;
                blinkAt = now + (chance(0.25) ? 260 : rand(1800, 4800));
            }
            if (now > glanceAt) {
                glance = [rand(-3, 3), rand(-2.5, 1.5)];
                glanceEnd = now + rand(400, 900);
                glanceAt = now + rand(1800, 4500);
            }
            if (lastKind === 'donut' && move.kind !== 'donut') dizzyUntil = now + 1400;
            lastKind = move.kind;

            const want = s.thrill ? 'stars'
                : move.kind === 'dock' ? 'love'
                : now < dizzyUntil ? 'dizzy'
                : s.air ? 'happy'
                : s.slip > 2 || move.kind === 'donut' ? 'fierce'
                : now < blinkEnd ? 'blink' : 'open';
            // hold a mood a moment so a wobbly slide doesn't flicker it; blinks are instant
            if (want !== mood && (now - moodSince > 300 || want === 'blink' || mood === 'blink')) {
                mood = want;
                moodSince = now;
                for (const el of moodShapes) el.style.display = el.dataset.mood === mood ? '' : 'none';
            }

            const still = mood === 'stars' || mood === 'dizzy';
            const turning = Math.abs(s.yawRate || 0) > 0.8;
            const lx = still ? 0 : turning ? clamp(-s.yawRate, -3, 3) : now < glanceEnd ? glance[0] : 0;
            const ly = still ? 0 : s.air ? clamp((s.vy / L) * 0.3, -2.5, 2.5) : now < glanceEnd && !turning ? glance[1] : 0;
            look[0] += (lx - look[0]) * ease(12, dt);
            look[1] += (ly - look[1]) * ease(12, dt);
            for (const e of eyes) e.style.transform = `translate(${look[0].toFixed(2)}px, ${look[1].toFixed(2)}px)`;
        }

        function render(dt, now) {
            expression(dt, now);
            bot.style.opacity = shadow.style.opacity = opacity;
            bot.style.display = shadow.style.display = opacity > 0 ? '' : 'none';
            // pivot about the middle of the body, so flips and leans turn round its centre
            bot.style.transform = `translate3d(${s.x}px, ${floorY - s.y - Ht / 2}px, ${s.z}px) rotateY(${s.yaw}rad) `
                + `rotateZ(${s.pitch + s.flip}deg) rotateX(${s.roll}deg) translateY(${Ht / 2}px)`;
            shadow.style.transform = `translate3d(${s.x}px, ${floorY}px, ${s.z}px) rotateY(${s.yaw}rad) rotateX(90deg)`;
            shadow.style.opacity = opacity * clamp(1 - s.y / (4 * L), 0.15, 1);
            for (const w of wheels) w.style.transform = `rotate(${s.wheel}deg)`;

            ctx.clearRect(0, 0, W, H);
            skids = skids.filter((k) => now - k.t < SKID_LIFE);
            ctx.lineCap = 'round';
            ctx.strokeStyle = ink;
            for (const k of skids) {
                ctx.globalAlpha = 0.28 * k.weight * (1 - (now - k.t) / SKID_LIFE);
                ctx.lineWidth = Math.max(1, 0.08 * L * k.from[2]);
                ctx.beginPath();
                ctx.moveTo(k.from[0], k.from[1]);
                ctx.lineTo(k.to[0], k.to[1]);
                ctx.stroke();
            }
            puffs = puffs.filter((p) => (p.age += dt) < p.life);
            ctx.strokeStyle = haze;
            ctx.lineWidth = 2;
            for (const p of puffs) {
                const k = p.age / p.life;
                ctx.globalAlpha = 0.7 * (1 - k);
                ctx.beginPath();
                ctx.arc(p.x + p.vx * p.age, p.y + p.vy * p.age, p.r * (1 + 2.5 * k), 0, 2 * Math.PI);
                ctx.stroke();
            }
            ctx.globalAlpha = 1;
        }

        // ---- loop ----
        let prev = performance.now(), alive = true;
        function frame(now) {
            if (!alive) return;
            const dt = Math.min(0.05, (now - prev) / 1000);
            prev = now;
            step(dt, now);
            render(dt, now);
            // done once it has driven out of the window, or is back in the hero
            const [sx, , sc] = proj(s.x, floorY, s.z);
            const out = move.kind === 'exit' && moveT > 0.3 && (sx < -L * sc || sx > W + L * sc);
            if (out || docked || now - t0 > length + 15000) stop();
            else requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);

        function stop() {
            if (!alive) return;
            alive = false;
            window.removeEventListener('resize', geometry);
            stage.classList.add('is-leaving');
            if (art) art.classList.remove('is-out');
            setTimeout(() => stage.remove(), 400);
            run = null;
        }
        return { stop };
    }

    // ---- triggers: type "vroom" anywhere, or click the About hero robot; Esc stops it ----
    if (art) art.addEventListener('click', () => start(true));
    let typed = '';
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && run) return run.stop();
        if (e.target.closest('input, textarea, select, [contenteditable]') || e.key.length !== 1) return;
        typed = (typed + e.key.toLowerCase()).slice(-5);
        if (typed === 'vroom') start(false);
    });
})();
