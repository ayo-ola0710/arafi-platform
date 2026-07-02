import { useEffect, useRef } from "react";
import StepCard from "./components/ui/StepCard";
import Footer from "./components/shared/Footer";
import Navbar from "./components/shared/Navbar";
import Architecture from "./components/ui/Achitecture";

const App = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Intersection Observer for fade-up animation
    const elements = document.querySelectorAll(".fade-up");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.1 },
    );

    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    // Shader Background Implementation
    const canvas = canvasRef.current;
    if (!canvas) return;

    function syncSize() {
      if (!canvas) return;
      const w = canvas.clientWidth || window.innerWidth;
      const h = canvas.clientHeight || window.innerHeight;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    }

    if (typeof ResizeObserver !== "undefined") {
      const resizeObserver = new ResizeObserver(syncSize);
      resizeObserver.observe(canvas);
      // Clean up resize observer
      return () => resizeObserver.disconnect();
    } else {
      window.addEventListener("resize", syncSize);
    }
    syncSize();

    const gl =
      canvas.getContext("webgl") ||
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);
    if (!gl) return;

    const vs = `attribute vec2 a_position;
      varying vec2 v_texCoord;
      void main() {
        v_texCoord = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }`;

    const fs = `precision highp float;
      uniform float u_time;
      uniform vec2 u_resolution;

      void main() {
          vec2 uv = gl_FragCoord.xy / u_resolution.xy;
          
          // Create a very subtle, flowing dark gradient noise
          vec2 p = uv * 3.0;
          float t = u_time * 0.15;
          
          float noise = sin(p.x + t) * cos(p.y - t) * 0.1;
          noise += sin(p.y * 1.5 + t * 1.2) * 0.05;
          
          // Deep slate base #0d0d15
          vec3 baseColor = vec3(0.051, 0.051, 0.082);
          // Subtle indigo glow #6366F1
          vec3 accentColor = vec3(0.388, 0.4, 0.945);
          
          vec3 finalColor = mix(baseColor, baseColor * 1.2 + accentColor * 0.05, noise + 0.1);
          
          // Vignette
          float dist = distance(uv, vec2(0.5));
          finalColor *= 1.0 - dist * 0.5;

          gl_FragColor = vec4(finalColor, 1.0);
      }`;

    function cs(type: number, src: string) {
      const s = gl!.createShader(type);
      if (!s) return null;
      gl!.shaderSource(s, src);
      gl!.compileShader(s);
      return s;
    }

    const prog = gl.createProgram();
    if (!prog) return;

    const vertexShader = cs(gl.VERTEX_SHADER, vs);
    const fragmentShader = cs(gl.FRAGMENT_SHADER, fs);

    if (vertexShader) gl.attachShader(prog, vertexShader);
    if (fragmentShader) gl.attachShader(prog, fragmentShader);

    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );

    const pos = gl.getAttribLocation(prog, "a_position");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, "u_time");
    const uRes = gl.getUniformLocation(prog, "u_resolution");

    let animationFrameId: number;

    function render(t: number) {
      if (!gl || !canvas) return;
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (uTime) gl.uniform1f(uTime, t * 0.001);
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationFrameId = requestAnimationFrame(render);
    }

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", syncSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="text-on-surface antialiased min-h-screen flex flex-col font-body-md selection:bg-primary/30 selection:text-primary-fixed">
      {/* Background Shader */}
      <div className="fixed inset-0 w-full h-full -z-20">
        <canvas
          ref={canvasRef}
          className="block w-full h-full opacity-80 pointer-events-none fixed top-0 left-0 z-[-2]"
        />
      </div>

      <Navbar />

      <main className="grow pt-40 pb-20">
        {/* Hero Section */}
        <section className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 lg:grid-cols-12 gap-16 items-center mb-24 relative">
          <div className="absolute top-0 left-1/4 w-125 h-125 bg-primary/10 blur-[120px] -z-10 rounded-full"></div>
          <div className="absolute bottom-0 right-1/4 w-100 h-100 bg-tertiary/5 blur-[100px] -z-10 rounded-full"></div>
          <div className="lg:col-span-6 flex flex-col items-start gap-8 z-10">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full backdrop-blur-xl bg-white/5 border border-white/10 fade-up">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
              <span className="font-label-mono text-label-mono text-on-surface/60 text-[11px] uppercase tracking-wider">
                API v2.4 Now Live
              </span>
            </div>
            <h1
              className="font-headline-xl text-[56px] leading-[1.1] text-on-surface fade-up tracking-tight"
              style={{ transitionDelay: "100ms" }}
            >
              The Payment Logic Layer for{" "}
              <span className="text-primary">Modern Apps</span>.
            </h1>
            <p
              className="font-body-lg text-body-lg text-on-surface/60 max-w-lg fade-up leading-relaxed"
              style={{ transitionDelay: "200ms" }}
            >
              Abstract your subscription, escrow, and complex payment flows into
              a single API. Built for developers who move fast.
            </p>
            <div
              className="flex items-center gap-5 mt-4 fade-up"
              style={{ transitionDelay: "300ms" }}
            >
              <button className="glow-button font-label-mono text-label-mono bg-inverse-primary text-on-primary px-8 py-4 rounded-DEFAULT transition-all duration-300 hover:scale-[1.02] border-t border-white/20 flex items-center gap-2 shadow-2xl shadow-indigo-500/30">
                Start Building Free{" "}
                <span className="material-symbols-outlined text-[18px]">
                  arrow_forward
                </span>
              </button>
              <button className="font-label-mono text-label-mono text-on-surface backdrop-blur-xl bg-white/5 px-8 py-4 rounded-DEFAULT border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">
                  menu_book
                </span>{" "}
                Documentation
              </button>
            </div>
          </div>
          <div
            className="lg:col-span-6 relative fade-up"
            style={{ transitionDelay: "400ms" }}
          >
            <div className="relative group">
              <div className="absolute -inset-4 bg-linear-to-tr from-primary/30 to-transparent blur-3xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
              <div className="relative rounded-2xl overflow-hidden border border-white/10 backdrop-blur-3xl bg-white/5 shadow-2xl p-2">
                <img
                  alt="Payment Logic Visual"
                  className="w-full h-auto rounded-xl opacity-90 group-hover:opacity-100 transition-opacity duration-700"
                  src="hero.jpg"
                />
                <div className="absolute bottom-6 left-6 right-6 backdrop-blur-2xl bg-surface/90 border border-white/10 rounded-xl overflow-hidden shadow-2xl transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="flex items-center px-4 py-2.5 bg-white/5 border-b border-white/10 gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-white/10"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-white/10"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-white/10"></div>
                    </div>
                    <span className="ml-2 font-code-sm text-[11px] text-on-surface/40 uppercase tracking-widest">
                      create_payment_intent.sh
                    </span>
                  </div>
                  <div className="p-5 font-code-sm text-[13px] leading-relaxed text-secondary-fixed/80 overflow-x-auto">
                    <pre>
                      <code>
                        {`curl https://api.arafi.com/v1/intents \\
  -H `}
                        <span className="text-tertiary">
                          "Authorization: Bearer sk_test_..."
                        </span>
                        {` \\
  -d `}
                        <span className="text-tertiary">{`'{ "flow": "escrow", "amount": 2000 }'`}</span>
                        <span className="inline-block w-1.5 h-4 bg-primary ml-1 align-middle cursor-blink"></span>
                      </code>
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section - Integrated Flow */}
        <section className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop mb-40">
          <div className="text-center mb-24 fade-up">
            <h2 className="font-headline-lg text-headline-xl text-on-surface tracking-tight">
              Integration in minutes, not months.
            </h2>
            <p className="font-body-md text-body-lg text-on-surface/50 mt-4 max-w-2xl mx-auto">
              A deterministic API designed to stay out of your way, with
              state-of-the-art logic orchestration.
            </p>
          </div>
          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/10 to-transparent -translate-y-1/2 -z-10"></div>
            <StepCard
              icon="app_registration"
              stepNumber="Step 01"
              title="Sign Up & Configure"
              description="Create your workspace and define your default webhook endpoints and routing rules in the dashboard."
            />
            <StepCard
              icon="vpn_key"
              stepNumber="Step 02"
              title="Get API Keys"
              description="Generate environment-specific keys. We support granular scoping for high-security environments."
              delay="100ms"
            />
            <StepCard
              icon="terminal"
              stepNumber="Step 03"
              title="Call the API"
              description="Initialize complex logic flows with a single POST request. We handle the edge cases and state management."
              delay="200ms"
            />
          </div>
        </section>

        {/* Architecture Deep Dive */}
        <Architecture />
      </main>

      <Footer />
    </div>
  );
};

export default App;
