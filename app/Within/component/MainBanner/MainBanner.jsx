import React from 'react';
import {
  Route,
  Switch,
  Link,
  withRouter,
  Redirect
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import {
  axios_Main_Banner,
} from './utils.js';
import DateConverter from '../../../Component/DateConverter.jsx';
import CreateShare from '../../../Component/CreateShare.jsx';
import SvgCreate from '../../../Component/Svg/SvgCreate.jsx';
import {
  cancelErr,
  uncertainErr
} from '../../../utils/errHandlers.js';

class MainBanner extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      greet: false //temp use, before the real customized render constructed
    };
    this.axiosSource = axios.CancelToken.source();
    this.style={
      withinCom_MainIndex_scroll_col_Create: {
        display: 'inline-block',
        width: '99px',
        height: '47%',
        position: 'relative',
        transform: "translate(0,-24%)",
        boxSizing: 'border-box',
        margin: '0 2%',
        float: 'right',
      },
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    if(prevProps.lastVisit!==this.props.lastVisit && this.props.lastVisit){
      const self = this;
      this.setState({axios: true});

      axios_Main_Banner( , this.axiosSource.token)
      //also send lastvisit time from props
      //and do not check the lastVisit at the backend

        .then((bannerObj)=>{
          self.setState({
            axios: false,
            greet: true //temp method, before the real customized data constructed
          });
        }).catch(function (thrown) {
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

  componentDidMount() {

  }

  componentWillUnmount() {
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  render(){
    let date = new Date();

    return(
      <div
        className={'boxRelativeFull'}>
        <div
          className={classnames(styles.boxDate, 'boxInlineRelative fontGillSN')}>
          <DateConverter
            place={'title'}
            datetime={date.getTime()}/>
        </div>
        {
          this.state.greet &&
          <div>
            <span>{"Welcome back"}</span>
          </div>
        }
        <div
          style={this.style.withinCom_MainIndex_scroll_col_Create}>
          <SvgCreate
            place={false}/>
          <CreateShare
            _submit_Share_New={this._submit_Share_New}
            _refer_von_Create={this.props._refer_von_cosmic}/>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    unitCurrent: state.unitCurrent,
    mainTitle: state.mainTitle
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(MainBanner));