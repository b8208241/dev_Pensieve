import React from 'react';
import {
  Route,
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import Threads from './Threads.jsx';
import TitleShared from './Titles/TitleShared.jsx';
import Unit from '../../../Component/Unit.jsx';
import NailShared from '../../../Component/Nails/NailShared.jsx';
//ModalBox used some unstable method, considering updating some day.
import ModalBox from '../../../Component/ModalBox.jsx';
import {handleNounsList} from '../../../redux/actions/general.js';
import {
  cancelErr,
  uncertainErr
} from '../../../utils/errHandlers.js';

const commonStyle = {
  frameNail: {
    display: 'inline-block',
    width: '32%',
    height: '36vh',
    position: 'relative',
    boxSizing: 'border-box',
    margin: '2vh 0.7% 0 0'
  },
  titleReserved: {
    display: 'inline-block',
    height: '36vh',
    position: 'relative',
    float: 'right',
    boxSizing: 'border-box',
    backgroundColor: 'transparent'
  }
}

class Shared extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      unitsList: [],
      unitsBasic: {},
      marksBasic: {}
    };
    this.axiosSource = axios.CancelToken.source();
    this._render_Shareds = this._render_Shareds.bind(this);
    this._construct_UnitInit = this._construct_UnitInit.bind(this);
    this._axios_nails_shareds = this._axios_nails_shareds.bind(this);
    this.style={
      selfCom_Shared_: {
        width: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box'
      },
      selfCom_Shared_nails_: {
        width: '100%',
        position: 'absolute',
        top: '2%',
        left: '0',
        boxSizing: 'border-box'
      }
    }
  }

  _construct_UnitInit(match, location){
    let unitInit= Object.assign(this.state.unitsBasic[match.params.id], {marksify: true, initMark: "all", layer: 0});
    return unitInit;
  }

  _render_Shareds(){
    const self = this;
    let shareds = self.state.unitsList.map(function(dataKey, index){
      let dataValue = self.state.unitsBasic[dataKey];
      return(
        <div
          key={'key_Shared_nails_'+index}
          style={commonStyle.frameNail}>
          <NailShared
            {...self.props}
            sharedId={dataKey}
            unitBasic={dataValue}
            marksBasic={self.state.marksBasic}/>
        </div>
      )
    }), reserved = (
      <div
        key={'key_Shared_nails_titleReserved'}
        style={Object.assign({}, {width: '34%'}, commonStyle.titleReserved)}>
      </div>
    );
    shareds.unshift(reserved);
    return shareds;
  }

  _axios_nails_shareds(){
    const self = this;
    this.setState({axios: true});
    axios.get('/router/actions/shareds', {
      headers: {
        'charset': 'utf-8',
        'token': window.localStorage['token']
      },
      cancelToken: self.axiosSource.token
    }).then(function(res){
      let resObj = JSON.parse(res.data);
      self.setState({
        axios: false,
        unitsList: resObj.main.unitsList,
        unitsBasic: resObj.main.unitsBasic,
        marksBasic: resObj.main.marksBasic
      })
      //send the nouns used by all shareds to the redux reducer
      self.props._submit_NounsList_new(resObj.main.nounsListMix);
    }).catch(function (thrown) {
      if (axios.isCancel(thrown)) {
        cancelErr(thrown);
      } else {
        this.setState((prevState, props)=>{
          return {axios:false}
        }, ()=>{
          let message = uncertainErr(thrown);
          if(message) alert(message);
        });
      }
    });
  }

  componentDidMount(){
    this._axios_nails_shareds();
  }

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={this.style.selfCom_Shared_}>
        <div
          style={this.style.selfCom_Shared_nails_}>
          {this._render_Shareds()}
        </div>
        <div
          style={Object.assign({}, {width: '35%',right: '-2%'}, commonStyle.titleReserved)}>
          <TitleShared
            {...this.props}
            _axios_nails_shareds={this._axios_nails_shareds}
            _refer_von_Create={this.props._refer_leaveSelf}/>
        </div>
        <ModalBox containerId="root">
          <Route path={this.props.match.path+"/:sharedId/threads"} render={(props)=> <Threads {...props} unitBasic={this.state.unitsBasic[props.match.params.sharedId]} _refer_leaveSelf={this.props._refer_leaveSelf}/>}/>
        </ModalBox>
        <Route path={this.props.match.path+"/units/:id"} render={(props)=> <Unit {...props} _construct_UnitInit={this._construct_UnitInit} _refer_von_unit={this.props._refer_leaveSelf}/>}/>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    unitCurrent: state.unitCurrent
  }
}

const mapDispatchToProps = (dispatch)=>{
  return {
    _submit_NounsList_new: (arr)=>{dispatch(handleNounsList(arr));}
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Shared));