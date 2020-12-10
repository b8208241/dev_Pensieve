import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import { connect } from "react-redux";
import classnames from 'classnames';
import styles from './styles.module.css';
import ImgsFrame from './ImgsFrame.jsx';
import SidePanel from './SidePanel.jsx';
import Inspired from '../components/Inspired/Inspired.jsx';
import {NodesExtensible} from '../../NodesDisplay/NodesExtensible.jsx';
import LinkFetch from '../../../Components/LinkFetch/LinkFetch.jsx';
import LinkCopy from '../../../Components/LinkCopy/LinkCopy.jsx';
import BtnOpenMap from '../../../Components/BtnOpenMap/BtnOpenMap.jsx';
import AccountPalette from '../../../Components/AccountPalette.jsx';
import DateConverter from '../../../Components/DateConverter.jsx';
import {
  setMessageBoolean,
} from "../../../redux/actions/general.js";
import {messageDialogInit} from "../../../redux/states/constants.js";
import {
  domain
} from '../../../../config/services.js';

class Wrapper extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onSpanOutbound: false
    };
    this._set_inviteDialog = this._set_inviteDialog.bind(this);
    this._handleClick_Account = this._handleClick_Account.bind(this);
    this._handleEnter_spanOutbound = this._handleEnter_spanOutbound.bind(this);
    this._handleLeave_spanOutbound = this._handleLeave_spanOutbound.bind(this);
    this._handleClick_LinkSign = this._handleClick_LinkSign.bind(this);
  }

  _handleClick_Account(event){
    event.preventDefault();
    event.stopPropagation();
    // rm this action temporary
    //this.props._refer_toandclose('user', this.props.unitCurrent.authorBasic.authorId);
  }


  render(){
    let nodesTitleObj = this.props.unitCurrent.nouns;
    if(this.props.guidingNailsId.indexOf(this.props.unitCurrent.unitId) != (-1) ){ // guidingNails has its special title
      nodesTitleObj = {
        list: [4692], // an empty position in DB, to prevent a conflict between real node
        basic: {
          4692: {name: this.props.i18nUIString.catalog['title_onBoard_GuideNailTitle'][this.props.guidingNailsId.indexOf(this.props.unitCurrent.unitId)]}
        }
      }
    };

    return(
      <div
        className={classnames( styles.comWrapper)}>
        <div
          className={classnames(styles.boxContentWidth, styles.boxTitle)}>
          <NodesExtensible
            nouns={nodesTitleObj}
            _referNode={this.props._refer_toandclose}/>
          <SidePanel
            {...this.props}
            _set_noTokenDialog={this._set_inviteDialog}/>
        </div>
        <div
          className={classnames(styles.boxContentWidth, styles.boxFrame)}>
          <ImgsFrame
            moveCount={this.props.moveCount}
            lockify={this.props.lockify}
            marksStatus={this.props.marksStatus}
            _set_markOpened={this.props._set_markOpened}
            _set_layerstatus={this.props._set_layerstatus}/>
        </div>
        <div
          className={classnames(styles.boxContentWidth, styles.boxBottom)}>
          <div
            className={classnames(styles.boxBottomRight)}>
            {
              !!this.props.unitCurrent.imgLocation.longitude &&
              <div
                className={classnames(styles.btnBottomIcon)}
                style={{ marginTop: '2px' }}>
                <BtnOpenMap
                  longitude={this.props.unitCurrent.imgLocation.longitude}
                  latitude={this.props.unitCurrent.imgLocation.latitude} />
              </div>
            }
            <div
              className={classnames(styles.btnBottomIcon)}
              style={{marginTop: '2px'}}>
              <LinkCopy {...this.props}/>
            </div>
            {
              (this.props.unitCurrent.identity != "author") &&
              <div
                className={classnames(styles.btnBottomIcon)}
                style={{ marginTop: '2px' }}>
                <Inspired
                  _set_noTokenDialog={this._set_inviteDialog}/>
              </div>
            }
          </div>
          <div
            className={classnames(styles.boxBottomLeft)}>
            <div>
              <div
                className={classnames(styles.boxBottomUpper)}
                style={{color: '#757575'}}
                onClick={this._handleClick_Account}>
                <AccountPalette
                  size={'layer'}
                  referLink={
                    (this.props.unitCurrent.authorBasic['authorIdentity'] == 'user') ?
                      false : (domain.protocol + "://" + domain.name+ '/cosmic/explore/path/' + this.props.unitCurrent.authorBasic['pageLink'])
                  }
                  accountFirstName={
                    (this.props.unitCurrent.authorBasic['authorIdentity'] == 'user') ?
                    this.props.unitCurrent.authorBasic.firstName: null}
                  accountLastName={
                    (this.props.unitCurrent.authorBasic['authorIdentity'] == 'user') ?
                      this.props.unitCurrent.authorBasic.lastName : this.props.unitCurrent.authorBasic.account}/>
              </div>
              <div
                className={classnames(styles.boxBottomLower)}>
                <div>
                  <DateConverter
                    styles={{color: '#a3a3a3'}}
                    datetime={this.props.unitCurrent.createdAt}/>
                </div>
              </div>
            </div>
            {
              (("main" in this.props.unitCurrent.outBoundLink) &&
                !!this.props.unitCurrent.outBoundLink.main) &&
              <div
                style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ borderRight: 'solid 0.75px #a3a3a3', margin: '0 1.5rem', height: '3.6rem' }} />
                <LinkFetch
                  tagA={true}
                  quotationify={true}
                  outboundLink={this.props.unitCurrent.outBoundLink.main} />
              </div>
            }
          </div>
        </div>

      </div>
    )
  }

  _set_inviteDialog(source){
    let message, messsageTail = this.props.i18nUIString.catalog['message_UnitUnsign_SigninRemind'];
    switch (source) {
      case "respond":
        message = this.props.i18nUIString.catalog['message_UnitUnsign_SigninRemind_respond'];
        break;
      case "inspired":
        message = this.props.i18nUIString.catalog['message_UnitUnsign_SigninRemind_inspired'];
        break;
      default:
        message=""
    }
    message = message + messsageTail;

    this.props._submit_BooleanDialog({
      render: true,
      customButton: "sign",
      message: [{
        text: message,
        style:{}}], //Original:'current input would not be saved after leaving, are you sure going to leave?'
      handlerPositive: ()=>{
        this.props._submit_BooleanDialog(messageDialogInit.boolean);
        this.props._refer_toandclose("/"); // basically all the condition are the same result
      },
      handlerNegative: ()=>{this.props._submit_BooleanDialog(messageDialogInit.boolean);return;}
    });
  }

  _handleClick_LinkSign(event) {
    event.preventDefault();
    event.stopPropagation();
    this.props._refer_toandclose("/");
  }

  _handleEnter_spanOutbound(e){
    this.setState({onSpanOutbound: true})
  }

  _handleLeave_spanOutbound(e){
    this.setState({onSpanOutbound: false})
  }

}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    guidingNailsId: state.guidingNailsId,
    unitCurrent: state.unitCurrent,
    i18nUIString: state.i18nUIString
  }
}

const mapDispatchToProps = (dispatch)=>{
  return {
    _set_state_UnitView: (expression)=>{dispatch(setUnitView(expression));},
    _submit_BooleanDialog: (obj)=>{dispatch(setMessageBoolean(obj));},
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Wrapper));
