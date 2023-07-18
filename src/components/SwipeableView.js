import React, { useEffect, useReducer } from 'react';
import { styled } from '@mui/material/styles';
import { useSwipeable } from 'react-swipeable';
import produce from 'immer';

const SwipeableViewContainer = styled('div', {
  shouldForwardProp: (prop) => prop !== 'sliding' && prop !== 'dir',
})(({ theme, sliding, dir }) => {
  return {
    display: 'flex',
    transition: sliding
      ? 'none'
      : theme.transitions.create(['transform'], {
          easing: theme.transitions.easing.easeInOUt,
          duration: theme.transitions.duration.standard,
        }),
    transform: !sliding
      ? `translateX(0%)`
      : dir === 'prev'
      ? `translateX(-100%)`
      : `translateX(100%)`,
  };
});

const SwipeableViewWrapper = styled('div')(() => {
  return { overflow: 'hidden', width: '100%' };
});

const SwipeableViewSlot = styled('div', {
  shouldForwardProp: (prop) => prop !== 'order',
})(({ order }) => {
  return {
    flex: '1 0 100%', // flex: 1, flex: 1 1, flex: 1 1 0
    order: order,
  };
});

const getInitialState = (index) => ({
  sliding: false,
  dir: 'next',
  index: index,
});

function reducer(state, action) {
  return produce(state, (draft) => {
    switch (action.type) {
      case 'PREV':
        draft.sliding = true;
        draft.dir = 'prev';
        draft.index -= 1;
        break;
      case 'NEXT':
        draft.sliding = true;
        draft.dir = 'next';
        draft.index += 1;
        break;
      case 'RANDOM':
        draft.sliding = action.payload.sliding;
        draft.dir = action.payload.dir;
        draft.index = action.payload.index;
        break;
      case 'STOP_SLIDING':
        draft.sliding = false;
        break;
      default:
        return draft;
    }
  });
}

const getOrder = (index, curIndex, numItems) => {
  return index - curIndex < 0 ? numItems - Math.abs(index - curIndex) : index - curIndex;
};

const SwipeableView = ({ index, children, onChangeIndex }) => {
  const numItems = React.Children.count(children);
  const [state, dispatch] = useReducer(reducer, getInitialState(index));
  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (state.index === numItems - 1) return; // 끝이면 skip
      dispatch({ type: 'NEXT' });
      onChangeIndex(state.index + 1);
      stopSliding();
    },
    onSwipedRight: () => {
      if (state.index === 0) return; // 처음이면 skip
      dispatch({ type: 'PREV' });
      onChangeIndex(state.index - 1);
      stopSliding();
    },
    swipeDuration: 500,
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  const stopSliding = () => {
    setTimeout(() => {
      dispatch({ type: 'STOP_SLIDING' });
    }, 50);
  };

  useEffect(() => {
    if (index !== state.index) {
      let dir = index > state.index ? 'next' : 'prev';
      const sliding = Math.abs(index - state.index) === 1;
      dispatch({
        type: 'RANDOM',
        payload: { sliding, dir, index },
      });
      if (sliding) {
        stopSliding();
      }
    }
  }, [index, state.index]);

  return (
    <div {...handlers}>
      <SwipeableViewWrapper>
        <SwipeableViewContainer sliding={state.sliding} dir={state.dir}>
          {React.Children.map(children, (child, index) => (
            <SwipeableViewSlot order={getOrder(index, state.index, numItems)}>
              {child}
            </SwipeableViewSlot>
          ))}
        </SwipeableViewContainer>
      </SwipeableViewWrapper>
    </div>
  );
};

export default SwipeableView;
