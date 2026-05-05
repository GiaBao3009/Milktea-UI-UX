import React from 'react';

interface CanProps {
  action: string;
  screen: string;
  passThrough?: boolean;
  children: React.ReactNode | ((allowed: boolean) => React.ReactNode);
}

const Can: React.FC<CanProps> = ({ children, passThrough }) => {
  if (passThrough && typeof children === 'function') {
    return <>{(children as (allowed: boolean) => React.ReactNode)(true)}</>;
  }
  return <>{children}</>;
};

export default Can;
