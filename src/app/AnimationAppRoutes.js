import { useLocation } from 'react-router-dom';
import RouteTransition from './RouteTransition';
import AppRoutes from './AppRoutes';

const AnimationAppRoutes = () => {
  const location = useLocation();
  return (
    <RouteTransition location={location}>
      <AppRoutes />
    </RouteTransition>
  );
};

export default AnimationAppRoutes;
