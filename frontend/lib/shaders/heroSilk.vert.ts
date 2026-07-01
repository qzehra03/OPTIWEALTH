export const vertexShaderSource = `#version 300 es
precision highp float;

void main() {
  // Generate a full-screen triangle (-1 to 3)
  float x = -1.0 + float((gl_VertexID & 1) << 2);
  float y = -1.0 + float((gl_VertexID & 2) << 1);
  gl_Position = vec4(x, y, 0.0, 1.0);
}
`;
