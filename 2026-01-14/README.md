# Interactive Rotational Dynamics

2026/01/14

An interactive exploration of SO(3), Euler angles, quaternions, and interpolation using TresJS.

## Features

- **Slide 1**: Introduction to $SO(3)$ with interactive 3D basis visualization
- **Slide 2**: Gimbal Lock demonstration with Euler angles and real-time Jacobian matrix
- **Slide 3**: Quaternion Space visualization with double cover animation
- **Slide 4**: Sandwich Product step-by-step breakdown with frame transformations
- **Slide 5**: SLERP vs LERP comparison with real-time velocity graphing
- **Slide 6**: Computational cost and drift simulation comparing matrices vs quaternions

## Tech Stack

- **Slidev** - Presentation framework
- **Vue 3** - Component framework
- **TresJS** - Declarative Three.js for Vue
- **GSAP** - Animation library
- **D3.js** - Data visualization for velocity graphs
- **TypeScript** - Type safety

## Development

```bash
# Install dependencies
pnpm install

# Start development server
cd 2026-01-14/src
pnpm dev

# Build for production
pnpm build

# Export to PDF
pnpm export
```

## Usage

Navigate between slides using arrow keys or click. Interact with 3D visualizations by:
- **Drag** to rotate view
- **Scroll** to zoom
- **Click** buttons to trigger animations

## Credits

Based on design principles from 3Blue1Brown and modern web animation techniques.
