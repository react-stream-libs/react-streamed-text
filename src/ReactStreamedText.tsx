import * as React from 'react';
import { findDOMNode } from 'react-dom';
import {
  Observable,
  Subscription,
} from 'rxjs';

export type PropsType = {
  tagName: string,
  textStream: Observable<string>,
};
export type StateType = {
  text?: string,
};

export default class ReactStreamedText
    extends React.Component<PropsType, StateType> {
  textStream: Observable<string>;
  textSubscription: Subscription;
  refs: {
    [key: string]: HTMLElement;
    targetDOM: HTMLHeadingElement;
  };
  constructor(props: PropsType) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    const targetDOM = findDOMNode<HTMLElement>(this.refs.targetDOM);
    this.textStream = this.props.textStream
      .distinctUntilChanged();
    this.textSubscription = this.textStream
      .subscribe((newText) => {
        this.state.text = newText;
        targetDOM.textContent = newText;
      });
  }
  componentWillUnmount() {
    this.textSubscription.unsubscribe();
  }
  render() {
    const {
      tagName,
    } = this.props;
    const {
      text,
    } = this.state;
    return React.createElement(
      tagName, Object.assign({}, this.props, {
        ref: 'targetDOM',
      }), text
    );
  }
}