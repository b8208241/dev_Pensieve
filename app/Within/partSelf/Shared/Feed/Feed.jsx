import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import stylesNail from "../../../stylesNail.module.css";
import FeedEmpty from './FeedEmpty.jsx';
import BtnUpload from '../../../../Unit/Editing/BtnUpload/BtnUpload.jsx';
import NailFeed from '../../../../Components/Nails/NailFeed/NailFeed.jsx';
import NailFeedWide from '../../../../Components/Nails/NailFeedWide/NailFeedWide.jsx';
import NailFeedMobile from '../../../../Components/Nails/NailFeedMobile/NailFeedMobile.jsx';
import {_axios_get_accumulatedList} from '../utils.js';
import {axios_get_UnitsBasic} from '../../../../utils/fetchHandlers.js';
import {
  handleNounsList,
  handleUsersList,
  handlePathProjectsList
} from "../../../../redux/actions/general.js";
import {
  cancelErr,
  uncertainErr
} from "../../../../utils/errHandlers.js";

class Feed extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      feedList: [],
      unitsBasic: {},
      marksBasic: {},
      scrolled: true,
      onNavLink: false
    };
    this.refScroll = React.createRef();
    this.axiosSource = axios.CancelToken.source();
    this._set_feedUnits = this._set_feedUnits.bind(this);
    this._check_Position = this._check_Position.bind(this);
    this._render_FeedNails = this._render_FeedNails.bind(this);
    this._render_FooterHint = this._render_FooterHint.bind(this);
    this._submit_Share_New = this._submit_Share_New.bind(this);
    this._handleEnter_link = this._handleEnter_link.bind(this);
    this._handleLeave_link = this._handleLeave_link.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    // if change the node bymodifying the nodeid in search, the page would only update
    let lastUrlParams = new URLSearchParams(prevProps.location.search); //we need value in URL query
    let lastNodeAtId = lastUrlParams.has('filterNode') ? lastUrlParams.get('filterNode'): null; // used in 'TabNodes'
    let currentPathProjectify = this.props.location.pathname.includes('/pathProject');
    let lastPathProjectify = prevProps.location.pathname.includes('/pathProject');
    if(
      (this.filterNode != lastNodeAtId) ||
      (currentPathProjectify != lastPathProjectify) // or left pathProject
    ){
      this.setState((prevState, props)=>{
        return {
          feedList: [],
          unitsBasic: {},
          marksBasic: {},
          scrolled: true
        };
      }, ()=>{
        this._set_feedUnits();
      });
    }
  }

  componentDidMount(){
    this._set_feedUnits();
    window.addEventListener("scroll", this._check_Position);
  }

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
    window.removeEventListener("scroll", this._check_Position);
  }

  _render_FooterHint(){
    // by feed length, we gave users some message about the thing they could do
    if (this.state.feedList.length> 0){
      return (
        <div>
          <span
            className={classnames(styles.spanFooterHint, "fontTitleSmall", "colorLightGrey")}>
            {this.props.i18nUIString.catalog['descript_AroundIndex_footer']}
          </span>
        </div>
      );
    }
    else{ // most reason to:no feed at all
      return null;
    }
  }

  _render_FeedNails(){
    let groupsDOM = [];
    const _nailsGroup = (unitGroup, groupIndex)=>{
      let nailsDOM = [];
      unitGroup.forEach((unitId, index) => {
        //render if there are something in the data
        if( !(unitId in this.state.unitsBasic)) return; //skip if the info of the unit not yet fetch
        // for mobile device, use one special Nail
        let cssVW = window.innerWidth;
        if(cssVW < 860) {
          nailsDOM.push(
            <div
              key={"key_NodeFeed_new_" + index}
              className={classnames(styles.boxModuleItem)}>
              <div
                className={classnames(stylesNail.boxNail)}>
                <NailFeedMobile
                  {...this.props}
                  unitId={unitId}
                  nodisplay={['author']}
                  frameType={'narrow'}
                  linkPath={this.props.location.pathname + ((this.props.location.pathname == '/') ? 'unit' : '/unit')}
                  unitBasic={this.state.unitsBasic[unitId]}
                  marksBasic={this.state.marksBasic} />
              </div>
            </div>
          );
          // and insert a upload btn if now after the first one rendered
          if((groupIndex == 0) && (index == 0)){
            nailsDOM.push(
              <div
                key={"key_NodeFeed_new_BtnUpload"}
                className={classnames(styles.boxUpload)}>
                <span
                  className={classnames(styles.spanMessageUpload, "fontTitleSmall", "colorLightGrey")}>
                  {this.props.i18nUIString.catalog['message_SelfShareds_uploadBtn']}
                </span>
                <BtnUpload
                  {...this.props}
                  _submit_Share_New={this._submit_Share_New}
                  _refer_von_Create={this.props._refer_von_cosmic}/>
                <div
                  className={classnames(styles.boxLinksToPublic)}>
                  <Link
                    to={"/cosmic/explore/user?userId=" + this.props.userInfo.id}
                    topath={"public"}
                    className={classnames('plainLinkButton')}
                    onTouchStart={this._handleEnter_link}
                    onTouchEnd={this._handleLeave_link}
                    onMouseEnter={this._handleEnter_link}
                    onMouseLeave={this._handleLeave_link}>
                    <span
                      className={classnames(
                        "fontTitleSmallPlain",
                        {
                          [styles.spanLinkMouse]: (this.state.onNavLink == 'public'),
                          ["colorEditLightBlack"]: (this.state.onNavLink != 'public'),
                          ["colorEditBlack"]: (this.state.onNavLink == 'public'),
                        }
                      )}>
                      {this.props.i18nUIString.catalog["link_PublicExpand"]}
                    </span>
                  </Link>
                </div>
              </div>
            )
          };
          return;
        };
        // for laptop / desktop, change nail by cycles
        let remainder3 = (nailsDOM.length+1) % 3,
        remainder2 = (nailsDOM.length+1) % 2; // cycle, but every 3 units has a wide, left, right in turn.

        nailsDOM.push (remainder3 ? ( // 0 would be false, which means index % 3 =0
          <div
            key={"key_NodeFeed_new_"+index}
            className={classnames(styles.boxModuleItem)}>
            <div
              className={classnames(stylesNail.boxNail)}>
              <NailFeed
                {...this.props}
                unitId={unitId}
                linkPath={this.props.location.pathname + ((this.props.location.pathname == '/') ? 'unit' : '/unit')}
                unitBasic={this.state.unitsBasic[unitId]}
                marksBasic={this.state.marksBasic}/>
            </div>
          </div>
        ): (
          <div
            key={"key_NodeFeed_new_"+index}
            className={classnames(styles.boxModuleItem, stylesNail.custNailWide)}>
            <div
              className={classnames(stylesNail.boxNail)}>
              <NailFeedWide
                {...this.props}
                leftimg={ remainder2 ? true : false}
                unitId={unitId}
                linkPath={this.props.location.pathname + ((this.props.location.pathname == '/') ? 'unit' : '/unit')}
                unitBasic={this.state.unitsBasic[unitId]}
                marksBasic={this.state.marksBasic}/>
            </div>
          </div>
        ));
        // and insert a upload btn if now after the first one rendered
        if((groupIndex == 0) && (index == 0)){
          nailsDOM.push(
            <div
              key={"key_NodeFeed_new_BtnUpload"}
              className={classnames(styles.boxModuleItem)}
              style={{justifyContent: "center", width: '48%', height: '289px', minHeight: '36.675vh'}}>
              <span
                className={classnames(styles.spanMessageUpload, "fontTitleSmall", "colorLightGrey")}>
                {this.props.i18nUIString.catalog['message_SelfShareds_uploadBtn']}
              </span>
              <BtnUpload
                {...this.props}
                _submit_Share_New={this._submit_Share_New}
                _refer_von_Create={this.props._refer_von_cosmic}/>
              <div
                className={classnames(styles.boxLinksToPublic)}
                style={{margin: '20px 0'}}>
                <Link
                  to={"/cosmic/explore/user?userId=" + this.props.userInfo.id}
                  topath={"public"}
                  className={classnames('plainLinkButton')}
                  onTouchStart={this._handleEnter_link}
                  onTouchEnd={this._handleLeave_link}
                  onMouseEnter={this._handleEnter_link}
                  onMouseLeave={this._handleLeave_link}>
                  <span
                    className={classnames(
                      "fontTitleSmallPlain",
                      {
                        [styles.spanLinkMouse]: (this.state.onNavLink == 'public'),
                        ["colorEditLightBlack"]: (this.state.onNavLink != 'public'),
                        ["colorEditBlack"]: (this.state.onNavLink == 'public'),
                      }
                    )}>
                    {this.props.i18nUIString.catalog["link_PublicExpand"]}
                  </span>
                </Link>
              </div>
            </div>
          )
        };
      });

      return nailsDOM;
    };

    this.state.feedList.forEach((unitGroup, index)=>{
      groupsDOM.push(
        <div
          key={"key_Shareds_FeedGroup"+index}
          className={classnames(
            styles.boxModule,
            styles.boxModuleSmall,
          )}>
          {_nailsGroup(unitGroup, index)}
        </div>
      );
    });

    return groupsDOM;
  }

  render(){
    let urlParams = new URLSearchParams(this.props.location.search); //we need value in URL query
    this.pathProjectify = urlParams.has('pathProject');
    if(urlParams.has('filterNode')){
      this.filterNode = urlParams.get('filterNode');
    } else this.filterNode = null;

    return (
      <div className={styles.comSharedsFeed}>
        {
          (this.state.feedList.length > 0) &&
          <div
            className={classnames(
              styles.boxRow,
              styles.boxRowModules
            )}>
            {this._render_FeedNails()}
          </div>
        }
        {
          ((this.state.feedList.length == 0) &&
            !this.state.scrolled &&
            !this.state.axios
          ) &&
          <div
            className={classnames(
              styles.boxModule,
              styles.boxModuleSmall,
              styles.boxRow
            )}>
            <FeedEmpty
              {...this.props}
              _submit_Share_New={this._submit_Share_New}
              _refer_von_Create={this.props._refer_von_cosmic}/>
          </div>
        }

        <div ref={this.refScroll}/>
        <div
          className={classnames(styles.boxRow, styles.boxFooter)}>
          {this._render_FooterHint()}
        </div>
      </div>
    )
  }

  _check_Position(){
    let boxScrollBottom = this.refScroll.current.getBoundingClientRect().bottom, //bottom related top of viewport of box Scroll
        windowHeightInner = window.innerHeight; //height of viewport
    //now, the bottom would change base on scroll, and calculate from the top of viewport
    //we set the threshould of fetch to the 2.5 times of height of viewport.
    //But! we only fetch if we are 'not' fetching--- check the axios status.
    if(!this.state.axios &&
      boxScrollBottom < (2.5*windowHeightInner) &&
      boxScrollBottom > windowHeightInner && // safety check, especially for the very beginning, or nothing in the list
      this.state.scrolled // checkpoint from the backend, no items could be res if !scrolled
    ){
      //base on the concept that bottom of boxScroll should always lower than top of viewport,
      //and do not need to fetch if you have see the 'real' bottom.
      this._set_feedUnits();
    }
  }

  _set_feedUnits(lastUnitTime){
    // feeds was selected by the last unit get last round
    if(!lastUnitTime && this.state.feedList.length > 0){ //only set the lastUnitTime again after the list had alreadyhad something
      let group, groupLength;
      let list = this.state.feedList;
      group = list[list.length-1];
      groupLength = group.length;
      lastUnitTime = this.state.unitsBasic[group[groupLength-1]].createdAt;
    };
    // in ths /self, always need to know if we are under different identity
    let pathProjectify = this.props.location.pathname.includes('/pathProject');
    const self = this;
    this.setState({axios: true});
    let paramsObj = {
      listUnitBase: lastUnitTime,
      filterNodes: !!this.filterNode ? [this.filterNode] : [],
    };
    if(pathProjectify){
      Object.assign(paramsObj, { pathProject: this.props.userInfo.pathName});
    };

    _axios_get_accumulatedList(this.axiosSource.token, paramsObj)
    .then((resObj)=>{
      if(resObj.main.unitsList.length > 0){
        self.setState((prevState, props)=>{
          let copyList = prevState.feedList.slice();
          copyList.push(resObj.main.unitsList);
          return {
            feedList: copyList,
            scrolled: resObj.main.scrolled
          }
        });

        return axios_get_UnitsBasic(self.axiosSource.token, resObj.main.unitsList);
      }
      else{
        self.setState({scrolled: resObj.main.scrolled}) // don't forget set scrolled to false to indicate the list was end
        return { //just a way to deal with the next step, stop further request
          main: {
            nounsListMix: [],
            usersList: [],
            pathsList: [],
            unitsBasic: {},
            marksBasic: {}
          }}};
    })
    .then((resObj)=>{
      //after res of axios_Units: call get nouns & users
      self.props._submit_NounsList_new(resObj.main.nounsListMix);
      self.props._submit_UsersList_new(resObj.main.usersList);
      self.props._submit_PathsList_new(resObj.main.pathsList);
      //and final, update the data of units to state
      self.setState((prevState, props)=>{
        return ({
          axios: false,
          unitsBasic: {...prevState.unitsBasic, ...resObj.main.unitsBasic},
          marksBasic: {...prevState.marksBasic, ...resObj.main.marksBasic}
        });
      });
    })
    .catch(function (thrown) {
      self.setState({axios: false});
      if (axios.isCancel(thrown)) {
        cancelErr(thrown);
      } else {
        let message = uncertainErr(thrown);
        if(message) alert(message);
      }
    });
  }

  _submit_Share_New(){
    // and remember the editing modal was opened by URL change
    let lastState = this.props.location.state.from ; // because we are pretty sure there is a "from" obj when opened EditingModal
    this.props.history.replace({
      pathname: lastState.pathname,
      search: lastState.search,
      state: lastState.state
    });
    window.location.reload();
  }

  _handleEnter_link(e) {
    let linkTo = e.currentTarget.getAttribute('topath');
    this.setState({ onNavLink: linkTo });
  }

  _handleLeave_link(e) {
    this.setState({ onNavLink: false })
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    i18nUIString: state.i18nUIString,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    _submit_NounsList_new: (arr) => { dispatch(handleNounsList(arr)); },
    _submit_UsersList_new: (arr) => { dispatch(handleUsersList(arr)); },
    _submit_PathsList_new: (arr) => { dispatch(handlePathProjectsList(arr)); },
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Feed));
