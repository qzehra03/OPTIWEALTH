export const fragmentShaderSource = `#version 300 es
precision highp float;

out vec4 fragColor;

uniform vec2 uResolution;
uniform float uTime;
uniform vec2 uMouse; // eased pointer offset (-1 to 1)

uniform vec3 uColorBase;
uniform vec3 uColorShadow;
uniform vec3 uColorMid;
uniform vec3 uColorGlow;
uniform float uCopperGlow; // driven by timelineProgress (0.0 to 1.0)

// Pseudorandom noise generator
vec2 hash(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);

  return mix(
    mix(dot(hash(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
        dot(hash(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
    mix(dot(hash(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
        dot(hash(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x),
    u.y
  );
}

#define OCTAVES 5
float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  float frequency = 1.0;
  // Rotate grid slightly at each octave to eliminate directional artifacts
  mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
  for (int i = 0; i < OCTAVES; i++) {
    value += amplitude * noise(p * frequency);
    p = rot * p;
    frequency *= 2.0;
    amplitude *= 0.5;
  }
  return value;
}

// Domain-warped FBM to create continuous organic folds
vec2 warp(vec2 p, float t) {
  vec2 q = vec2(
    fbm(p + vec2(0.0, 0.0)),
    fbm(p + vec2(5.2, 1.3))
  );
  
  // Warp input coordinates using the primary FBM sample
  vec2 r = vec2(
    fbm(p + 4.0 * q + vec2(1.7, 9.2) + t * 0.15),
    fbm(p + 4.0 * q + vec2(8.3, 2.8) + t * 0.12)
  );

  return r;
}

void main() {
  // Normalize fragment coordinates (aspect-ratio corrected)
  vec2 uv = gl_FragCoord.xy / uResolution.xy;
  vec2 p = uv * 3.0;
  
  // Continuous horizontal flow - unconditional
  p.x += uTime * 0.04;
  
  // Subtle cursor perturbation (lerped, limited to small magnitude)
  p += uMouse * 0.03;

  // Domain warp to compute fabric height field
  vec2 warpedUV = warp(p, uTime);
  float height = warpedUV.x;
  // Map height from [-0.5, 0.5] range to positive space for smooth mixing
  float normalizedHeight = clamp((height + 0.5), 0.0, 1.0);

  // Compute normals via finite differences
  float eps = 0.015;
  float hLeft  = warp(p - vec2(eps, 0.0), uTime).x;
  float hRight = warp(p + vec2(eps, 0.0), uTime).x;
  float hDown  = warp(p - vec2(0.0, eps), uTime).x;
  float hUp    = warp(p + vec2(0.0, eps), uTime).x;

  vec3 normal = normalize(vec3(
    hLeft - hRight,
    hDown - hUp,
    0.55
  ));

  // Blinn-Phong specular calculation for a silky, streaky sheen
  vec3 lightDir = normalize(vec3(0.3, 0.5, 0.8));
  vec3 viewDir = vec3(0.0, 0.0, 1.0);
  vec3 halfVector = normalize(lightDir + viewDir);
  float ndoth = dot(normal, halfVector);
  
  // High specular power creates tight satin-like highlights along fold ridges
  float specPower = 45.0;
  float spec = pow(max(ndoth, 0.0), specPower);
  float specSheen = smoothstep(0.1, 0.9, spec);

  // Smooth color transitions only - mix/smoothstep, no step cutoffs
  vec3 color = mix(uColorBase, uColorShadow, smoothstep(0.0, 0.5, normalizedHeight));
  color = mix(color, uColorMid, smoothstep(0.4, 0.85, normalizedHeight));
  
  // Add base satin specular highlights
  color += uColorGlow * specSheen * 0.5;

  // Energy strand: distinct glowing diagonal line moving with time and sine wobble
  float strandOffset = 0.5 + 0.12 * sin(p.x * 0.7 + uTime * 0.2) - p.x * 0.25;
  // Distance to strand
  float d = abs(uv.y - strandOffset);
  
  // Composite energy strand with a core and a wider halo
  float haloGlow = smoothstep(0.14, 0.0, d) * 0.45;
  float coreGlow = smoothstep(0.04, 0.0, d) * 0.85;

  color = mix(color, uColorGlow, haloGlow);
  color = mix(color, vec3(1.0), coreGlow);

  // Copper timeline overlay intensifier (adds warm glow under cursor/scrub)
  color += vec3(1.0, 0.5, 0.2) * uCopperGlow * 0.12 * (1.0 - uv.y);

  fragColor = vec4(color, 1.0);
}
`;
