import React from 'react'
import ReactDOM from 'react-dom'
import HammerJS from './events'
const Hammer = typeof window !== 'undefined' ? HammerJS : undefined

const handlerToEvent = {
  onTap: 'tap',
  onDoubleTap: 'doubletap',
  onPress: 'longpress',
  onPressUp: 'pressup',
  onSwipe: 'swipe',
  onSwipeRight: 'swiperight',
  onSwipeLeft: 'swipeleft',
  onSwipeUp: 'swipeup',
  onSwipeDown: 'swipedown',
  onPressDown: 'pressdown'
}
const updateHammer = (hammer, props) => {
  Object.keys(props).forEach(function(p) {
    let ev = handlerToEvent[p]
    if (ev) {
      hammer.on(ev, props[p])
    }
  })
}

export default class HammerComponent extends React.Component {
  componentDidMount() {
    this.hammer = new Hammer(ReactDOM.findDOMNode(this))
    updateHammer(this.hammer, this.props)
  }
  componentWillUnmount() {
    this.hammer.off()
  }
  render() {
    return React.cloneElement(React.Children.only(this.props.children), {})
  }
}
export class ViewHammer extends HammerComponent {}
ViewHammer._typeName = 'View'
HammerComponent.displayName = 'Hammer'
