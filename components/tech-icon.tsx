import {
  siDocker,
  siExpress,
  siFlutter,
  siGit,
  siGithub,
  siGithubactions,
  siLinux,
  siMongodb,
  siMysql,
  siNextdotjs,
  siNginx,
  siNodedotjs,
  siPostgresql,
  siPrisma,
  siReact,
  siTailwindcss,
  siTypescript,
  type SimpleIcon,
} from "simple-icons";
import { cn } from "@/lib/utils";
import { ApiIcon, AwsIcon } from "@/components/icons";

const brandIcons = {
  react: siReact,
  nextjs: siNextdotjs,
  typescript: siTypescript,
  tailwind: siTailwindcss,
  node: siNodedotjs,
  express: siExpress,
  postgresql: siPostgresql,
  mysql: siMysql,
  mongodb: siMongodb,
  flutter: siFlutter,
  docker: siDocker,
  githubactions: siGithubactions,
  linux: siLinux,
  nginx: siNginx,
  git: siGit,
  github: siGithub,
  prisma: siPrisma,
} satisfies Record<string, SimpleIcon>;

export type TechIconName = keyof typeof brandIcons | "aws" | "api";

/** Very dark brand colours vanish on the dark theme; use the theme foreground instead. */
function displayColor(hex: string) {
  const n = parseInt(hex, 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return luminance < 0.28 ? "var(--foreground)" : `#${hex}`;
}

export function techColor(name: TechIconName) {
  if (name === "aws") return "#FF9900";
  if (name === "api") return "#7c93ff";
  return displayColor(brandIcons[name].hex);
}

export function TechIcon({
  name,
  className,
  colored = true,
}: {
  name: TechIconName;
  className?: string;
  colored?: boolean;
}) {
  const color = colored ? techColor(name) : "currentColor";

  if (name === "aws") return <AwsIcon className={cn("size-6", className)} style={{ color: colored ? "var(--foreground)" : undefined }} />;
  if (name === "api") return <ApiIcon className={cn("size-6", className)} style={{ color }} />;

  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn("size-6", className)}
      // `style`, not the `fill` attribute: var() does not resolve in SVG presentation attributes.
      style={{ fill: color }}
    >
      <path d={brandIcons[name].path} />
    </svg>
  );
}
