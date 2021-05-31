import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import FeedNodes from './FeedNodes.jsx';
import Feed from '../Feed/Feed.jsx';
import {SvgArrowToLeft} from '../../../../Components/Svg/SvgArrow.jsx';

class TabNodes extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onNodeLink: false,
      onArrow: false
    };
    this._render_resetLink = this._render_resetLink.bind(this);
    this._render_filterTitle = this._render_filterTitle.bind(this);
    this._handleClick_resetLink = this._handleClick_resetLink.bind(this);
    this._handleEnter_CloseArrow = this._handleEnter_CloseArrow.bind(this);
    this._handleLeave_CloseArrow = this._handleLeave_CloseArrow.bind(this);
    this._handleEnter_NodeLink = this._handleEnter_NodeLink.bind(this);
    this._handleLeave_NodeLink = this._handleLeave_NodeLink.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount(){

  }

  componentWillUnmount(){

  }

  _render_resetLink(){
    let toSearch = new URLSearchParams(this.props.location.search); //we need value in URL query
    toSearch.delete("filterNode");
    let linkObj = {
      pathname: this.props.location.pathname,
      search: toSearch.toString(),
      state: {from: this.props.location}
    };

    return (
      <Link
        to={linkObj}
        className={classnames(
          'plainLinkButton', styles.linkBlock,
           styles.boxSvgArrow)}
        onClick={this._handleClick_resetLink}
        onTouchStart={this._handleEnter_CloseArrow}
        onTouchEnd={this._handleLeave_CloseArrow}
        onMouseEnter={this._handleEnter_CloseArrow}
        onMouseLeave={this._handleLeave_CloseArrow}>
        <SvgArrowToLeft
          mouseOn={this.state.onArrow}
          customStyles={{fillColorMouseOn: '#ff8168', fillColor: '#a3a3a3'}}/>
      </Link>
    );
  }

  _render_filterTitle(){
    return (
      <div
        className={classnames(styles.boxFilterNode)}>
        <div>
          <span
            className={classnames(
              styles.spanFilterCross,
              "fontContent", "weightBold", "lineHeight15", "colorAssistGold")}>
              {"X "}
            </span>
            <Link
              nodeid={this.filterNode}
              to={"/cosmic/explore/node?nodeid=" + this.filterNode}
              className={classnames('plainLinkButton')}
              style={{
                display: 'inline-block',
                cursor: "pointer"
              }}
              onTouchStart={this._handleEnter_NodeLink}
              onTouchEnd={this._handleLeave_NodeLink}
              onMouseEnter={this._handleEnter_NodeLink}
              onMouseLeave={this._handleLeave_NodeLink}>
              {(this.filterNode in this.props.nounsBasic) &&
                <span
                  className={classnames(
                    "fontNodesEqual", "weightBold", "colorEditBlack",
                    styles.spanLinkNode,
                    { [styles.spanLinkNodeMouse]: (this.state.onNodeLink == this.filterNode) && userLogin }
                  )}>
                  {this.props.nounsBasic[this.filterNode].name}</span>
              }
            </Link>
        </div>
        {this._render_resetLink()}
      </div>
    )
  }

  render(){
    let urlParams = new URLSearchParams(this.props.location.search); //we need value in URL query
    if(urlParams.has('filterNode')){
      this.filterNode = urlParams.get('filterNode');
    } else this.filterNode = null;

    return (
      <div className={styles.comFocusBoardFeed}>
        {
          !this.filterNode ? (
            <div>
              <FeedNodes
                {...this.props}/>
            </div>
          ) : (
            <div>
              <div
                className={classnames(
                  styles.boxTitle, styles.rowFilterTitle)}>
                {this._render_filterTitle()}
              </div>
              <Feed
                {...this.props}/>
            </div>
          )
        }
      </div>
    )
  }

  _handleClick_resetLink(event){
    // a <Link> comp, keep it act as default
    event.stopPropagation();
    // we are here to reset mouse state
    this.setState({
      onArrow: false
    })
  }

  _handleEnter_CloseArrow(e){
    this.setState((prevState, props)=>{
      return {
        onArrow: true
      }
    })
  }

  _handleLeave_CloseArrow(e){
    this.setState((prevState, props)=>{
      return {
        onArrow: false
      }
    })
  }

  _handleEnter_NodeLink(e) {
    let targetNode = e.currentTarget.getAttribute('nodeid');
    this.setState({ onNodeLink: targetNode })
  }

  _handleLeave_NodeLink(e) {
    this.setState({ onNodeLink: false })
  }
}

const mapStateToProps = (state)=>{
  return {
    i18nUIString: state.i18nUIString,
    nounsBasic: state.nounsBasic,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(TabNodes));
