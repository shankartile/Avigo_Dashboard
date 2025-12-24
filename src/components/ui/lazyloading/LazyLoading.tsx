import { Suspense, ComponentType, FC } from 'react';

// project imports
import Loader from './Loader';

// ==============================|| LOADABLE - LAZY LOADING ||============================== //

interface LoadableProps {
  [key: string]: any; // Allow for any props to be passed to the component
}

const LazyLoading = <P extends LoadableProps>(Component: ComponentType<P>) => {
  const LoadableComponent: FC<P> = (props) => (
    <Suspense fallback={<Loader />}>
      <Component {...props} />
    </Suspense>
  );

  return LoadableComponent;
};

export default LazyLoading;
