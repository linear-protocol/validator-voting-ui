import React from 'react';

const EMPTY: unique symbol = Symbol();

interface ContainerProviderProps<State = void> {
  initialState?: State;
  children: React.ReactNode;
}

interface Container<Value, State = void> {
  Provider: React.ComponentType<ContainerProviderProps<State>>;
  useContainer: () => Value;
}

export function createContainer<Value, State = void>(
  useHook: (initialState?: State) => Value,
): Container<Value, State> {
  const Context = React.createContext<Value | typeof EMPTY>(EMPTY);

  const Provider = (props: ContainerProviderProps<State>) => {
    const value = useHook(props.initialState);
    return <Context.Provider value={value}>{props.children}</Context.Provider>;
  };

  function useContainer(): Value {
    const value = React.useContext(Context);
    if (value === EMPTY) throw new Error('Component must be wrapped with <Container.Provider>');
    return value;
  }

  return { Provider, useContainer };
}
