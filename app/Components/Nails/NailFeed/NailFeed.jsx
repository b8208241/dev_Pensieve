import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import stylesFont from '../stylesFont.module.css';
import NailMarksPreview from '../components/NailMarksPreview.jsx';
import ImgPreview from '../../ImgPreview.jsx';
import AccountPalette from '../../AccountPalette.jsx';
import SvgPin from '../../Svg/SvgPin.jsx';
import {
  renderNodesRows,
} from '../generators.js';
import {
  domain
} from '../../../../config/services.js';

class NailFeed extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onFrame: false,
    };
    this.nailImgBox = React.createRef();
    this.nailUnitLink = React.createRef();
    this._handleEnter_nailFrame = this._handleEnter_nailFrame.bind(this);
    this._handleLeave_nailFrame = this._handleLeave_nailFrame.bind(this);
    this._render_nails_nouns = this._render_nails_nouns.bind(this);
    this.style={

    }
  }

  _handleEnter_nailFrame(e){
    this.setState({onFrame: true})
  }

  _handleLeave_nailFrame(e){
    this.setState({onFrame: false})
  }

  _render_nails_nouns(){
    let nodesDOM = renderNodesRows(this.props, styles);

    return nodesDOM;
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render(){
    let imgSrcCover = domain.protocol+ '://'+domain.name+'/router/img/'+this.props.unitBasic.pic_layer0+'?type=thumb';
    let linkSearch = ((this.props.location.search.length > 0) ? this.props.location.search+'&' : '?') +'unitId='+this.props.unitId+'&unitView=theater';

    return(
      <Link
        ref={this.nailUnitLink}
        to={{
          pathname: this.props.linkPath,
          search: linkSearch,
          state: {from: this.props.location}
        }}
        className={classnames(
          'plainLinkButton',
          styles.frame,
          {[styles.frameOnMouse]: this.state.onFrame}
        )}
        onMouseEnter={this._handleEnter_nailFrame}
        onMouseLeave={this._handleLeave_nailFrame}>
        { // layer as a overlap when mouseon
          this.state.onFrame &&
          <div style={{
              position: 'absolute', width:'100%', height: '100%', top: '0', left: '0',
              backgroundColor:'rgba(217, 232, 255, 0.15)',
              backgroundImage: 'url('+ imgSrcCover +')',
              backgroundSize: 'cover',
              backgroundPosition: '50% 50%',
              backgroundRepeat: 'no-repeat',
              opacity: '0.3'
          }}/>
        }
        <div
          className={classnames(
            styles.boxContent,
            {[styles.boxContentNarrow]: this.props.narrowWidth}
          )}>
          <div
            className={classnames(styles.boxTitle)}>
            <div
              className={classnames(styles.boxTitlePin)}>
              <div
                style={{width: "11px", height: "16px"}}>
                <SvgPin
                  mouseOn={this.state.onFrame}/>
              </div>
            </div>
            <div
              className={classnames(styles.boxNodes)}>
              {this._render_nails_nouns()}
            </div>
          </div>

          {
            this.state.onFrame ? (
              <div
                className={classnames(styles.boxPreview)}>
                <NailMarksPreview
                  unitId={this.props.unitId}
                  unitBasic={this.props.unitBasic}
                  marksBasic={this.props.marksBasic}/>

                <div className={classnames(styles.boxAuthor, stylesFont.colorStandard)}>
                  <AccountPalette
                    size={"regularBold"}
                    userId={this.props.unitBasic.authorId}/>
                </div>
              </div>
            ): (
              <div
                ref={this.nailImgBox}
                className={styles.boxImg}>
                <ImgPreview
                  blockName={''}
                  previewSrc={ imgSrcCover }
                  _handleClick_ImgPreview_preview={()=>{this.nailImgBox.current.click()}}/>
              </div>
            )
          }
        </div>

      </Link>
    )
  }

}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    unitCurrent: state.unitCurrent,
    nounsBasic: state.nounsBasic,
    usersBasic: state.usersBasic
  }
}

export default withRouter(connect(
  mapStateToProps,
  null
)(NailFeed));
