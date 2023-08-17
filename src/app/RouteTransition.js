import React from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import './RoueTransition.css';

const RouteTransition = ({ location, children }) => {
  const pathname = location.pathname;

  return (
    <TransitionGroup
      className={'transition-wrapper'}
      childFactory={(child) => {
        return React.cloneElement(child, {
          classNames: location.state?.direction || 'navigate-push',
        });
      }}
    >
      <CSSTransition exact key={pathname} timeout={300}>
        {children}
      </CSSTransition>
    </TransitionGroup>
  );
};

export default RouteTransition;
