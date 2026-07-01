import { useEffect, useRef, useState } from "react";

interface UseWebGLShaderProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  vertexShaderSource: string;
  fragmentShaderSource: string;
  onRender: (
    gl: WebGL2RenderingContext,
    program: WebGLProgram,
    uniformLocations: Record<string, WebGLUniformLocation>,
    time: number
  ) => void;
  paused?: boolean;
}

export function useWebGLShader({
  canvasRef,
  vertexShaderSource,
  fragmentShaderSource,
  onRender,
  paused = false,
}: UseWebGLShaderProps) {
  const [glSupported, setGlSupported] = useState<boolean | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const uniformLocationsRef = useRef<Record<string, WebGLUniformLocation>>({});
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const glRef = useRef<WebGL2RenderingContext | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Check WebGL2 availability
    const gl = canvas.getContext("webgl2", {
      alpha: false,
      depth: false,
      stencil: false,
      antialias: false,
      powerPreference: "high-performance",
    });

    if (!gl) {
      console.warn("WebGL2 is not supported on this device.");
      setGlSupported(false);
      return;
    }

    glRef.current = gl;
    setGlSupported(true);

    // Compile shader helper
    const compileShader = (source: string, type: number): WebGLShader | null => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    // Compile Vertex and Fragment Shaders
    const vs = compileShader(vertexShaderSource, gl.VERTEX_SHADER);
    const fs = compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER);
    if (!vs || !fs) {
      setGlSupported(false);
      return;
    }

    // Link WebGL program
    const program = gl.createProgram();
    if (!program) {
      setGlSupported(false);
      return;
    }
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      setGlSupported(false);
      return;
    }

    programRef.current = program;
    gl.useProgram(program);

    // Cache Uniform Locations
    const uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
    const locations: Record<string, WebGLUniformLocation> = {};
    for (let i = 0; i < uniformCount; i++) {
      const info = gl.getActiveUniform(program, i);
      if (info) {
        const loc = gl.getUniformLocation(program, info.name);
        if (loc) {
          locations[info.name] = loc;
        }
      }
    }
    uniformLocationsRef.current = locations;

    // Set up a simple full-screen VAO (not strictly needed for single-triangle, but good WebGL2 practice)
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    // Handle resizing (with device pixel ratio clamped to 1.5)
    const resizeCanvas = () => {
      const displayWidth = canvas.clientWidth;
      const displayHeight = canvas.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = Math.floor(displayWidth * dpr);
      const height = Math.floor(displayHeight * dpr);

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    startTimeRef.current = performance.now();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (vao) gl.deleteVertexArray(vao);
      if (vs) gl.deleteShader(vs);
      if (fs) gl.deleteShader(fs);
      if (program) gl.deleteProgram(program);
      programRef.current = null;
      glRef.current = null;
    };
  }, [vertexShaderSource, fragmentShaderSource, canvasRef]);

  // Handle active animation loop
  useEffect(() => {
    const gl = glRef.current;
    const program = programRef.current;
    if (!glSupported || !gl || !program || paused) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      return;
    }

    const renderLoop = () => {
      if (paused) return;

      const elapsedSeconds = (performance.now() - startTimeRef.current) / 1000;
      gl.useProgram(program);
      onRender(gl, program, uniformLocationsRef.current, elapsedSeconds);

      // Draw the single full-screen triangle
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      animationFrameRef.current = requestAnimationFrame(renderLoop);
    };

    animationFrameRef.current = requestAnimationFrame(renderLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [glSupported, onRender, paused]);

  return glSupported;
}
