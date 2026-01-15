export type Quat = [number, number, number, number]; // w, x, y, z

export function dot(q1: Quat, q2: Quat): number {
  return q1[0] * q2[0] + q1[1] * q2[1] + q1[2] * q2[2] + q1[3] * q2[3];
}

export function normalize(q: Quat): Quat {
  const len = Math.sqrt(dot(q, q));
  if (len === 0) return [1, 0, 0, 0];
  return [q[0] / len, q[1] / len, q[2] / len, q[3] / len];
}

export function nlerp(q1: Quat, q2: Quat, t: number): Quat {
  let d = dot(q1, q2);
  const target: Quat = d < 0 ? [-q2[0], -q2[1], -q2[2], -q2[3]] : [...q2];
  
  const res: Quat = [
    (1 - t) * q1[0] + t * target[0],
    (1 - t) * q1[1] + t * target[1],
    (1 - t) * q1[2] + t * target[2],
    (1 - t) * q1[3] + t * target[3]
  ];
  return normalize(res);
}

export function slerp(q1: Quat, q2: Quat, t: number): Quat {
  let d = dot(q1, q2);
  let v0 = [...q1] as Quat;
  let v1 = [...q2] as Quat;

  if (d < 0) {
    v1 = [-v1[0], -v1[1], -v1[2], -v1[3]];
    d = -d;
  }

  if (d > 0.9995) return nlerp(v0, v1, t);

  const theta_0 = Math.acos(d);
  const sin_theta_0 = Math.sin(theta_0);
  const theta = theta_0 * t;
  const sin_theta = Math.sin(theta);

  const s0 = Math.cos(theta) - d * sin_theta / sin_theta_0;
  const s1 = sin_theta / sin_theta_0;

  return [
    (s0 * v0[0]) + (s1 * v1[0]),
    (s0 * v0[1]) + (s1 * v1[1]),
    (s0 * v0[2]) + (s1 * v1[2]),
    (s0 * v0[3]) + (s1 * v1[3])
  ];
}