import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import DraftDisplayforNailMark from '../../Draft/DraftDisplayforNailMark.jsx';
import styles from "./styles.module.css";

class NailWideDisplay extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.nailUnitLink = React.createRef();
    this._render_nails_Marks = this._render_nails_Marks.bind(this);
    this._render_nails_nouns = this._render_nails_nouns.bind(this);
    this.style={

    }
  }

  _render_nails_Marks(){
    let list = this.props.unitBasic.marksList;
    let marksDOM = [];
    const self = this;

    for(let i=0 ; i< list.length && i< 3; i++){
      let key = list[i]
      marksDOM.push(
        <div
          key={"key_nailcosmic_"+self.props.unitId+"_marks_"+i}
          className={classnames(styles.boxMark, styles.fontMark)}>
          <DraftDisplayforNailMark
            rawContent={self.props.marksBasic[key].editorContent}/>
        </div>
      )
    }
    return marksDOM;
  }

  _render_nails_nouns(){
    let list = this.props.unitBasic.nounsList;
    let nounsDOM = [];

    list.forEach((id, index)=>{
      nounsDOM.push(
        <div
          key={"key_nailcosmic_"+this.props.unitId+"_nouns_"+index}
          className={classnames(styles.boxNodesItem, styles.fontNode)}>
          {id in this.props.nounsBasic ? (
            this.props.nounsBasic[id].name) : (
              null
            )}
        </div>
      )
    })
    return nounsDOM;
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render(){
    return(
      <div
        className={styles.frame}>
        <Link
          ref={this.nailUnitLink}
          to={{
            pathname: this.props.match.url+"/units/"+this.props.unitId,
            state: {from: this.props.location}
          }}
          className={classnames('plainLinkButton', styles.frame)}>
          <div className={styles.boxMarkArea}></div>
          <div
            className={classnames(styles.boxMarkPreview)}>
            {this._render_nails_Marks()}
          </div>
          <div
            className={styles.boxImg}>
            <ImgPreview
              blockName={''}
              previewSrc={'/router/img/'+this.props.unitBasic.pic_layer0+'?type=thumb'}
              _handleClick_ImgPreview_preview={()=>{this.nailUnitLink.current.click()}}/>
          </div>
          <div
            className={styles.boxNodes}>
            {this._render_nails_nouns()}
          </div>
          <div className={styles.boxAuthor}>
            <span
              className={styles.fontAuthor}>
              {this.props.unitBasic.authorId in this.props.usersBasic ? this.props.usersBasic[this.props.unitBasic.authorId].account:null}
            </span>
          </div>
        </Link>
      </div>
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
)(NailWideDisplay));
