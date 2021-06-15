import { $Shape } from "utility-types";
import * as React from "react";
import { connect } from "react-redux";
import type { IrcState } from "../flow";
type Props = {
  isDark: boolean;
  children: React.ReactNode;
};
const darkClass = 'theme-dark';

class BodyColor extends React.PureComponent<Props> {
  componentDidMount() {
    document.body && document.body.classList.toggle(darkClass, this.props.isDark);
  }

  componentWillReceiveProps(nextProps) {
    document.body && document.body.classList.toggle(darkClass, nextProps.isDark);
  }

  componentWillUnmount() {
    document.body && document.body.classList.remove(darkClass);
  }

  render() {
    return this.props.children;
  }

}

export default connect((state: IrcState, ownProps): $Shape<Props> => {
  return {
    isDark: state.settings.isDark
  };
})(BodyColor);