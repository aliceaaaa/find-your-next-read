interface Window {
  dataLayer: unknown[];
  gtag: (...args: unknown[]) => void;
}

declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '@storybook/react-webpack5' {
  export type Meta<TComponent = unknown> = {
    title?: string;
    component?: TComponent;
    tags?: string[];
    args?: Record<string, unknown>;
    argTypes?: Record<string, unknown>;
    parameters?: Record<string, unknown>;
  };

  export type StoryObj<TMetaOrComponent = unknown> = {
    args?: Record<string, unknown>;
    parameters?: Record<string, unknown>;
    render?: (...args: unknown[]) => unknown;
    play?: (...args: unknown[]) => unknown;
  };
}
