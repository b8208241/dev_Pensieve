import React from 'react';
import {
  Route,
  Switch,
  Link,
  withRouter
} from 'react-router-dom';
import { connect } from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import {SvgArrowToRight} from '../Svg/SvgArrow.jsx';

class NavWihtinCosmic extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          onbtn: false,
        };
        this._handleEnter_Link = this._handleEnter_Link.bind(this);
        this._handleLeave_Link = this._handleLeave_Link.bind(this);
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    render() {
        return (
            <div
              className={classnames(styles.comNavWithinCosmic)}>
                <Link
                  to={"/"}
                  className={classnames(
                    'plainLinkButton',
                    styles.boxNavLink,
                    {[styles.boxNavLinkMouseon]: this.state.onbtn}
                  )}
                  onMouseEnter={this._handleEnter_Link}
                  onMouseLeave={this._handleLeave_Link}>
                  <div
                    className={classnames(styles.boxSvgArrow)}>
                    <div
                      style={{width: "10px", height: "12px"}}>
                      <SvgArrowToRight
                        mouseOn={this.state.onbtn}
                        customStyles={{fillColorMouseOn: '#444444', fillColor: '#a3a3a3'}}/>
                    </div>
                  </div>
                  <span
                    className={classnames(
                      styles.spanNavLink,
                      "fontSubtitle_h5",
                      {["colorGrey"]: !this.state.onbtn},
                      {["colorDescripBlack"]: this.state.onbtn}
                    )}>
                      {this.props.i18nUIString.catalog["title_home"]}
                    </span>
                  </Link>
            </div>
        )
    }

  _handleEnter_Link(e) {
    this.setState({ onbtn: true })
  }

  _handleLeave_Link(e) {
    this.setState({ onbtn: false })
  }

}


const mapStateToProps = (state) => {
    return {
        i18nUIString: state.i18nUIString,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {

    }
}

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(NavWihtinCosmic));
