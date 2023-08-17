import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import nativeApp from '@common/utils/nativeApp';

const HybridLink = React.forwardRef(function HybridLink(props, ref) {
  return nativeApp.isIOS() ? (
    <span
      {...props}
      onClick={() => {
        nativeApp.pushView(props.to, props.state);
      }}
    />
  ) : (
    <RouterLink {...props} />
  );
});

export default HybridLink;
