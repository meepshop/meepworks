import Component from './component';

export default class PureRenderComponent extends Component {
  shouldComponentUpdate: shouldComponentUpdate
}

export  function shouldComponentUpdate(nextProps, nextState) {
  for(let key in nextProps) {
    if(nextProps[key] !== this.props[key]) {
      return true;
    }
  }
  if(nextState) {
    for(let key in nextState) {
      if(nextState[key] !== this.state[key]) {
        return true;
      }
    }
  }
  return false;
};
