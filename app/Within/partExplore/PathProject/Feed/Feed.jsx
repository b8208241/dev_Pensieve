import React from 'react';
import {
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import stylesNail from "../../../stylesNail.module.css";
import FeedEmpty from './FeedEmpty.jsx';
import NailFeed from '../../../../Components/Nails/NailFeed/NailFeed.jsx';
import NailFeedWide from '../../../../Components/Nails/NailFeedWide/NailFeedWide.jsx';
import NailFeedMobile from '../../../../Components/Nails/NailFeedMobile/NailFeedMobile.jsx';
import SignBlock from '../../../partSign/components/SignBlock/SignBlock.jsx';
import {_axios_get_accumulatedList} from '../axios.js';
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
      scrolled: true
    };
    this.refScroll = React.createRef();
    this.axiosSource = axios.CancelToken.source();
    this._set_feedUnits = this._set_feedUnits.bind(this);
    this._check_Position = this._check_Position.bind(this);
    this._render_FeedNails = this._render_FeedNails.bind(this);
    this._render_FooterHint = this._render_FooterHint.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    // if change the node by modifying the nodeid in search, the page would only update
    let lastUrlParams = new URLSearchParams(prevProps.location.search); //we need value in URL query
    let lastSubcate = lastUrlParams.has('subCate') ? lastUrlParams.get('subCate'): null;
    if( this.currentSubCate != lastSubcate ){
      this.setState((prevState, props)=>{
        return {
          feedList: [],
          unitsBasic: {},
          marksBasic: {},
          scrolled: true
        }
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
            className={classnames("fontTitleSmall", "colorLightGrey")}
            style={{margin: "8px 0", display: 'inline-block' }}>
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
                  frameType={'wide'}
                  linkPath={this.props.location.pathname + ((this.props.location.pathname == '/') ? 'unit' : '/unit')}
                  unitBasic={this.state.unitsBasic[unitId]}
                  marksBasic={this.state.marksBasic} />
              </div>
            </div>
          );
          return;
        };
        // for laptop / desktop, change nail by cycles
        let remainder5 = (index+1) % 5, // make the '0' appear first st 5th nail
        remainder2 = index % 2; // cycle, but every 3 units has a wide, left, right in turn.

        nailsDOM.push (remainder5 ? ( // 0 would be false, which means index % 5 =0
          <div
            key={"key_NodeFeed_new_" + index}
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
            key={"key_NodeFeed_new_" + index}
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
      });

      return nailsDOM;
    };

    this.state.feedList.forEach((unitGroup, index)=>{
      groupsDOM.push(
        <div
          key={"key_PathProject_FeedGroup"+index}
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
    if(urlParams.has('subCate')){
      this.currentSubCate = urlParams.get('subCate');
    } else this.currentSubCate = null;

    return (
      <div className={styles.comPathProjectFeed}>
        <div>
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
                {...this.props}/>
            </div>
          }

          <div ref={this.refScroll}/>
          <div
            className={classnames(styles.boxRow, styles.boxFooter)}>
            {this._render_FooterHint()}
          </div>
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
    if(!lastUnitTime && this.state.feedList.length > 0){
      //set the lastUnitTime if no assigned, after the list had already had something
      let group, groupLength;
      let list = this.state.feedList;
      group = list[list.length-1];
      groupLength = group.length;
      lastUnitTime = this.state.unitsBasic[group[groupLength-1]].createdAt;
    };
    const self = this;
    this.setState({axios: true});

    _axios_get_accumulatedList(this.axiosSource.token, {
      pathProject: this.props.match.params['pathName'],
      listUnitBase: lastUnitTime,
      filterNodes: [],
      subCate: this.currentSubCate ? this.currentSubCate : null
    })
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

}

const mapStateToProps = (state)=>{
  return {
    tokenStatus: state.token,
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
