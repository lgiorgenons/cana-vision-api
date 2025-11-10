declare module 'dotenv-flow' {
  export interface DotenvFlowOptions {
    node_env?: string;
    default_node_env?: string;
    path?: string;
    encoding?: string;
    purge_dotenv?: boolean;
    silent?: boolean;
  }

  export function config(options?: DotenvFlowOptions): void;
}
