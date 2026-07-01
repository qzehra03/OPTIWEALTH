declare module 'flubber' {
  export interface InterpolateOptions {
    string?: boolean;
    maxSegmentLength?: number;
  }

  export function interpolate(
    fromPath: string,
    toPath: string,
    options?: InterpolateOptions
  ): (t: number) => string;

  export function separate(
    fromPath: string,
    toPaths: string[],
    options?: InterpolateOptions
  ): (t: number) => string[];

  export function combine(
    fromPaths: string[],
    toPath: string,
    options?: InterpolateOptions
  ): (t: number) => string;
}
