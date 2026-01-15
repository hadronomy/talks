---
layout: cover
highlighter: shiki
css: unocss
colorSchema: dark
transition: fade-out
mdc: true
glowSeed: 4
title: Interactive Rotational Dynamics
lang: en
remoteAssets: true
addons:
  - slidev-addon-graph
---

<div text-6xl font-600 my-5 flex="~ gap-4 col">
  <div i-ph-atom-duotone text-7xl text-teal-400 />
  <div flex="~ col">
    <span>Interactive Rotational</span>
    <span text-4xl op-80>Dynamics</span>
  </div>
</div>

<div text-2xl mt-5 op50>
  From Euler Angles to Quaternions: A Visual Journey
</div>

<div abs-br mx-10 my-12 flex="~ col" text-sm text-right>
  <div px-6 text-sm opacity-50>14.01.2026</div>
</div>

<!--
PRESENTER NOTES:
Welcome everyone. Today we are going to stop thinking about rotation as numbers, and start thinking about it as topology.
We will cover why your 3D game camera glitches (Gimbal Lock), how to fix it with 4D math (Quaternions), and why math operations matter for performance.
-->

---
layout: intro
class: pl-30
glowSeed: 14
---

# Pablo Hernández

<div class="[&>*]:important-leading-10 opacity-80">

<div>
Programando todo tipo de cosas desde
<div inline-flex="~ gap-1" gap-1 items-center align-middle text-blue bg-blue:15 px1.5 rounded>
  <div i-ph-calendar-dots-duotone />
  <span>2010</span>
</div>
<br/>

Mi stack
<div class="flex flex-wrap justify-start gap-1 w-3/4">
  <MagicLink href="https://git-scm.com" iconClass="i-devicon-git" />
  <MagicLink href="https://reactjs.org" iconClass="i-devicon-react" />
  <MagicLink href="https://typescriptlang.org" iconClass="i-devicon-typescript" />
  <MagicLink href="https://rust-lang.org" iconClass="i-simple-icons-rust" />
  <MagicLink href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" iconClass="i-devicon-javascript" />
  <MagicLink href="https://isocpp.org" iconClass="i-devicon-cplusplus" />
  <MagicLink href="https://python.org" iconClass="i-devicon-python" />
  <MagicLink href="https://developer.mozilla.org/en-US/docs/Web/HTML" iconClass="i-devicon-html5" />
  <MagicLink href="https://developer.mozilla.org/en-US/docs/Web/CSS" iconClass="i-devicon-css3" />
  <MagicLink href="https://webassembly.org" iconClass="i-simple-icons-webassembly" />
  <MagicLink href="https://docker.com" iconClass="i-devicon-docker" />
  <MagicLink href="https://prisma.io" iconClass="i-simple-icons-prisma" />
  <MagicLink href="https://nodejs.org" iconClass="i-devicon-nodejs" />
  <MagicLink href="https://tailwindcss.com" iconClass="i-devicon-tailwindcss" />
  <MagicLink href="https://linux.org" iconClass="i-devicon-linux" />
  <MagicLink href="https://nixos.org" iconClass="i-devicon-nixos" />
  <MagicLink href="https://kubernetes.io" iconClass="i-devicon-kubernetes" />
  <MagicLink href="https://nextjs.org" iconClass="i-devicon-nextjs" />
  <MagicLink href="https://astro.build" iconClass="i-devicon-astro" />
  <MagicLink href="https://www.postgresql.org" iconClass="i-devicon-postgresql" />
  <MagicLink href="https://ziglang.org" iconClass="i-devicon-zig" />
  <MagicLink href="https://golang.org" iconClass="i-devicon-go" />
  <MagicLink href="https://code.visualstudio.com" iconClass="i-devicon-vscode" />
  <MagicLink href="https://vitejs.dev" iconClass="i-devicon-vitejs" />
  <MagicLink href="https://vitest.dev" iconClass="i-devicon-vitest" />
  <MagicLink href="https://tauri.app" iconClass="i-devicon-tauri" />
  <MagicLink href="https://neovim.io" iconClass="i-devicon-neovim" />
  <MagicLink href="https://threejs.org" iconClass="i-simple-icons-threejs" />
</div>

<br/>
Actualmente estudiando en <MagicLink src="ull-icon.jpg" href="https://ull.es">ULL</MagicLink><br/>
</div>

</div>

<div my-10 w-min flex="~ gap-1" items-center justify-center>
  <div i-ri-user-3-line op50 ma text-xl />
  <div>
    <a href="https://hadronomy.com" target="_blank" class="border-none! font-300">
      hadronomy.com
    </a>
  </div>
  <div i-ri-github-line op50 ma text-xl ml4/>
  <div>
    <a href="https://github.com/hadronomy" target="_blank" class="border-none! font-300">
      hadronomy
    </a>
  </div>
  <div i-ri-twitter-x-line op50 ma text-xl ml4/>
  <div>
    <a href="https://twitter.com/hadronomy" target="_blank" class="border-none! font-300">
      hadronomy
    </a>
  </div>
</div>

<img src="/me.jpg" rounded-full absolute top-38 right-15 w-40 />

---
class: 'h-full'
glowSeed: 3
---

<SO3Intro />

<!--
PRESENTER NOTES:
Here we see SO(3).
Most people see a Rotation Matrix as a wall of 9 numbers.
I want you to see it as 3 vectors.
Column 1 is where X lands. Column 2 is Y. Column 3 is Z.
It preserves volume (Determinant 1) and angles (Orthogonal).
-->

---
class: 'h-full'
glowSeed: 5
---

<GimbalLockDemo />

<!--
PRESENTER NOTES:
But Euler angles (Pitch, Yaw, Roll) have a fatal flaw.
Watch what happens when the Green ring (Yaw) rotates 90 degrees.
The Red axis and Blue axis become parallel.
We lose a degree of freedom. The Jacobian determinant hits 0.
This is Gimbal Lock.
-->

---
class: 'h-full'
glowSeed: 6
---

<QuaternionAnatomy />

<!--
PRESENTER NOTES:
So, how do we solve Gimbal Lock? We need a representation that doesn't rely on 3 nested rings.
Enter the Quaternion.
It has 4 numbers. $w, x, y, z$.
Think of it not as a scary hyper-complex number, but as an Axis and an Amount.
The "Vector Part" $(x,y,z)$ points along the axis of rotation.
The "Scalar Part" $w$ stores the cosine of half the angle.
Why half? Because of the double-cover topology we will see next.
-->

---
class: 'h-full'
glowSeed: 7
---

<QuaternionSpace />

<!--
PRESENTER NOTES:
To solve this, we move to 4 dimensions. Quaternions.
It's a hypersphere.
The cool part? It's a "Double Cover".
Q and -Q are the same rotation physically.
But to get back to the start smoothly, you have to rotate 720 degrees, not 360.
-->

---
class: 'h-full'
glowSeed: 9
---

<SandwichProduct />

<!--
PRESENTER NOTES:
How do we actually USE them? The Sandwich Product.
q * p * q_inverse.
1. Rotate the frame.
2. Inject the vector.
3. Un-rotate the frame.
It's elegant and avoids all singularities.
-->

---
class: 'h-full'
glowSeed: 10
clicks: 3
---

<SandwichMath />

<!--
PRESENTER NOTES:
[CLICK]
First, we encode the vector into 4D. We just set the scalar part W to zero.
[CLICK]
Then we multiply. This creates a mess—a "Spinor". It's mixed up.
[CLICK]
Finally, the inverse. This is where the algebra cleans itself up, returning a pure rotated vector.
-->

---
class: 'h-full'
glowSeed: 11
---

<SlerpVsLerp />

<!--
PRESENTER NOTES:
Animation requires interpolation.
LERP (Linear) cuts corners through the sphere. It speeds up in the middle.
SLERP (Spherical) follows the arc. Constant speed.
Look at the velocity graph at the bottom.
-->

---
class: 'h-full'
glowSeed: 13
---

<ComputationalCost />

<!--
PRESENTER NOTES:
Finally, Engineering.
Matrices drift. Floating point errors make them skew/shear. Fixing that is expensive (Gram-Schmidt).
Quaternions drift too, but fixing it is just normalizing a 4D vector. Cheap.
And they are 50% smaller in memory.
-->

---
layout: two-cols
class: 'flex flex-col text-center pb-5 items-center justify-center'
glowSeed: 8
---

# Thank You

Slides and references at:
[hadronomy.com](https://talks.hadronomy.com/2026/rotational-dynamics),\
video at [youtube](https://youtu.be/UlZyjvjg8K4)

::right::

<QRCode text="https://talks.hadronomy.com/2026/rotational-dynamics" w-40 rounded-md overflow-hidden />
<QRCode text="https://youtu.be/UlZyjvjg8K4" gradient="rgba(222, 83, 83, 1)" w-40 mt-4 rounded-md overflow-hidden />
