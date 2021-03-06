import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import {convertFromRaw} from 'draft-js';
import classnames from 'classnames';
import styles from "./styles.module.css";
import NailMarksPreview from '../components/NailMarksPreview.jsx';
import ImgPreview from '../../ImgPreview.jsx';
import AccountPalette from '../../AccountPalette.jsx';
import SvgPin from '../../Svg/SvgPin.jsx';
import {SvgBulbInspired} from '../../Svg/SvgBulb.jsx';
import {
  renderNodesRows,
  renderNodesRowsCustom
} from '../generators.js';
import {
  domain
} from '../../../../config/services.js';

class NailFeedMobile extends React.Component {
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
    this._render_ContentBox = this._render_ContentBox.bind(this);
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
    let customNodesTitle = !!this.props.customNodesTitle ? this.props.customNodesTitle : null;
    let nodesDOM = [];
    if(!!customNodesTitle){ nodesDOM = renderNodesRowsCustom(this.props, customNodesTitle)} // currently only GuideNails using, so render without check
    else nodesDOM = renderNodesRows(this.props, styles);

    return nodesDOM;
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render(){
    let urlParams = new URLSearchParams(this.props.location.search); //we need value in URL query
    urlParams.delete('unitId'); // make sure only 1 unitId remain
    urlParams.append('unitId', this.props.unitId);
    urlParams.append('unitView', "theater");

    return(
      <Link
        ref={this.nailUnitLink}
        to={{
          pathname: this.props.linkPath,
          search: urlParams.toString(),
          state: {from: this.props.location}
        }}
        className={classnames(
          'plainLinkButton',
          styles.frame,
          {
            [styles.frameNarrow]: (this.props.frameType == 'narrow'),
            [styles.frameWide]: (this.props.frameType == 'wide'),
            [styles.frameOnMouse]: this.state.onFrame}
        )}
        onClick={(e)=>{if( !this.props.linkPath ){e.preventDefault();};/*a optional control, mean the parent want to take the refer control*/ }}
        onTouchStart={this._handleEnter_nailFrame}
        onTouchEnd={this._handleLeave_nailFrame}
        onMouseEnter={this._handleEnter_nailFrame}
        onMouseLeave={this._handleLeave_nailFrame}>
        {this._render_ContentBox()}
      </Link>
    )
  }

  _render_ContentBox(){
    let contentBoxDOM = [];
    contentBoxDOM.push(contentBoxImg(this));
    contentBoxDOM.unshift(contentBoxMarks(this));
    return contentBoxDOM;
  }

}

const contentBoxImg = (self)=>{
  let imgSrcCover = domain.protocol+ '://'+domain.name+'/router/img/'+self.props.unitBasic.pic_layer0+'?type=thumb';
  let altText = '', loopCount = 0;
  while (altText.length < 250 && loopCount < self.props.unitBasic.marksList.length) {
    let markId = self.props.unitBasic.marksList[loopCount];
    let markText = convertFromRaw(self.props.marksBasic[markId].editorContent).getPlainText(' ');
    altText += markText;
    loopCount ++;
  };

  return (
    <div
      key={"key_NailBoxImg_"+self.props.unitId}
      className={classnames(styles.boxContent)}>
      <div
        ref={self.nailImgBox}
        className={styles.boxImg}>
        <ImgPreview
          altText={altText}
          blockName={''}
          previewSrc={ imgSrcCover }
          _handleClick_ImgPreview_preview={()=>{self.nailImgBox.current.click()}}/>
        {
          self.props.inspiredBulb &&
          <div
            className={classnames(styles.boxImgIconandBack)}>
            <div
              className={classnames(styles.boxImgIcon)}>
              <SvgBulbInspired
                colorClass={"smallLight"}
                mouseReact={false}/>
            </div>
          </div>
        }
      </div>
    </div>
  )
};
const contentBoxMarks = (self)=>{
  return (
    <div
      key={"key_NailBoxMarks_"+self.props.unitId}
      className={classnames(styles.boxContentMobile)}>
      <div
        className={classnames(styles.boxTitle)}>
        <div
          className={classnames(styles.boxTitlePin)}>
          <div
            style={{width: "11px", height: "16px"}}>
            <SvgPin
              mouseOn={self.state.onFrame}/>
          </div>
        </div>
        <div
          className={classnames(styles.boxNodes)}>
          {self._render_nails_nouns()}
        </div>
      </div>
      <div
        className={classnames(styles.boxPreview)}>
        <div
          style={{ width: '100%', maxHeight: "179px", marginBottom: '16px', overflow: 'hidden' }}>
          <NailMarksPreview
            unitId={self.props.unitId}
            unitBasic={self.props.unitBasic}
            marksBasic={self.props.marksBasic}
            spotCount={false} />
        </div>
        {
          (!!self.props.nodisplay &&
          (self.props.nodisplay.indexOf('author') != (-1))) ? null :
        <div className={classnames(styles.boxAuthor, "colorStandard")}>
          <AccountPalette
            size={"regularBold"}
            userId={self.props.unitBasic.authorId}
            authorIdentity={self.props.unitBasic.authorIdentity}/>
        </div>
        }
      </div>

    </div>
  )
};

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
)(NailFeedMobile));
