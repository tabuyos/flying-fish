import * as vscode from 'vscode';

type ContextKey = string | symbol;
type ContextValue = boolean | string;

const ContextFactory = () => {
  const cache: Map<ContextKey, ContextValue> = new Map();
  
  const set = async (key: ContextKey, value: ContextValue) => {
    const prev = get(key);
    if (prev !== value) {
      cache.set(key, value);
      await vscode.commands.executeCommand('setContext', key, value);
    }
  };
  
  const get = (key: ContextKey): ContextValue | undefined => {
    return cache.get(key);
  };

  return { set, get };
};

export default ContextFactory();
