/**
 * Logo component – renders the Chips logo image.
 */
interface LogoProps {
  size?: number;
  className?: string;
}

export function Logo({ size = 40, className = '' }: LogoProps) {
  return (
    <img
      src="/logo.png"
      alt="Chips Logo"
      width={size}
      height={size}
      className={`object-contain ${className}`}
    />
  );
}
