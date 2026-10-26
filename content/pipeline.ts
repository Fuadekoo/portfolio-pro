/**
 * The delivery pipeline shown in the "From commit to production" section.
 * Describe your real workflow here; the animation is driven entirely by this data.
 */

export type PipelineStage = {
  id: string;
  label: string;
  detail: string;
  icon: "git" | "githubactions" | "docker" | "registry" | "deploy";
  /** Seconds the stage runs in the animation (not a real build time). */
  duration: number;
  /** Terminal output streamed while the stage runs. */
  logs: string[];
};

export const pipeline: PipelineStage[] = [
  {
    id: "commit",
    label: "Code Commit",
    detail: "Push to main",
    icon: "git",
    duration: 1.4,
    logs: ["$ git push origin main", "→ workflow triggered: deploy.yml"],
  },
  {
    id: "ci",
    label: "CI Checks",
    detail: "Lint · Types · Tests",
    icon: "githubactions",
    duration: 2.6,
    logs: ["$ npm ci", "$ npm run lint        ✓ no problems", "$ tsc --noEmit        ✓ types ok", "$ npm test            ✓ all passed"],
  },
  {
    id: "build",
    label: "Docker Build",
    detail: "Multi-stage image",
    icon: "docker",
    duration: 3,
    logs: [
      "$ docker build -t app:${GITHUB_SHA::7} .",
      "#1 [deps]    npm ci --omit=dev",
      "#2 [build]   npm run build",
      "#3 [runtime] node:20-alpine, non-root user",
      "✓ image built",
    ],
  },
  {
    id: "push",
    label: "Registry Push",
    detail: "Tagged by commit SHA",
    icon: "registry",
    duration: 1.8,
    logs: ["$ docker push ghcr.io/<user>/app:<sha>", "✓ pushed to registry"],
  },
  {
    id: "deploy",
    label: "Production Deploy",
    detail: "VPS · Nginx · zero downtime",
    icon: "deploy",
    duration: 2.4,
    logs: [
      "$ ssh deploy@prod 'docker compose pull && docker compose up -d'",
      "→ waiting for health check…",
      "✓ healthy, nginx reloaded",
      "✓ live in production",
    ],
  },
];

/**
 * Fault-injection modes visitors can pick. A failing mode stops the run part-way
 * through `stage` and prints `logs` in red. Nothing here claims real build history.
 */
export type FailureMode = {
  id: string;
  label: string;
  stage?: PipelineStage["id"];
  logs?: string[];
};

export const failureModes: FailureMode[] = [
  { id: "healthy", label: "Healthy" },
  {
    id: "fail-tests",
    label: "Fail tests",
    stage: "ci",
    logs: ["$ npm test", "✗ 2 failed: checkout.test.ts › applies discount", "✗ pipeline stopped. Nothing was deployed."],
  },
  {
    id: "fail-build",
    label: "Fail build",
    stage: "build",
    logs: ["✗ Type error: Property 'price' does not exist on type 'Plan'", "✗ docker build exited with code 1", "✗ pipeline stopped. Production is untouched."],
  },
];

/** Facts shown under the pipeline. Keep them true to how you actually work. */
export const pipelineFacts = [
  { label: "Trigger", value: "Push to main" },
  { label: "Runner", value: "GitHub Actions" },
  { label: "Artifact", value: "Docker image" },
  { label: "Release", value: "Zero-downtime" },
];
