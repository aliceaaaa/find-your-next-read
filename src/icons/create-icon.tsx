import { CSSProperties, ReactNode } from 'react';

export type IconProps = {
  className?: string;
  color?: string;
  size?: number;
  strokeWidth?: number;
  style?: CSSProperties;
};

export function createIcon(content: ReactNode, displayName: string) {
  const Icon = ({
    size = 18,
    color = 'currentColor',
    strokeWidth = 1.7,
    className,
    style,
  }: IconProps) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden="true"
    >
      {content}
    </svg>
  );

  Icon.displayName = displayName;
  return Icon;
}
