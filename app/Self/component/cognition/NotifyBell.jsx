import React from 'react';
import NotifyBox from './NotifyBox.jsx';
import SvgBell from '../../../Component/Svg/SvgBell.jsx';
import SvgBellSpot from '../../../Component/Svg/SvgBellSpot.jsx';

const generalStyle = { //could included in a global style sheet
  boxRelativeFull: {
    width: '100%',
    height: '100%',
    position: 'relative',
    boxSizing: 'border-box'
  }
};

const styleMiddle = {
  boxBell: {
    width: '6%',
    position: "absolute",
    boxSizing: 'border-box',
    right: '6.4%',
    top:'50%',
    transform: 'translate(0,-39%)',
    cursor: 'pointer'
  }
};

export default class NotifyBell extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      bellNotify: false,
      notifyBox: false
    };
    this.axiosSource = axios.CancelToken.source();
    this._axios_bell_Count = this._axios_bell_Count.bind(this);
    this._handleClick_bell = this._handleClick_bell.bind(this);
    this.style={

    }
  }

  _axios_bell_Count(){
    const self = this;
    this.setState({axios: true});

    //collect from notifications which createdAt is later than lastvisit and status = "untouched"
    axios.get('', {
      headers: {
        'charset': 'utf-8',
        'token': window.localStorage['token']
      },
      cancelToken: self.axiosSource.token
    }).then(function(res){
      let resObj = JSON.parse(res.data);
      self.setState({
        axios: false,
      })

      //send the nouns used by all shareds to the redux reducer
      self.props._submit_NounsList_new(resObj.main.nounsListMix);

    }).catch(function (thrown) {
      if (axios.isCancel(thrown)) {
        cancelErr(thrown);
      } else {
        self.setState((prevState, props)=>{
          return {axios:false}
        }, ()=>{
          let message = uncertainErr(thrown);
          if(message) alert(message);
        });
      }
    });
  }

  _handleClick_bell(event){
    event.stopPropagation();
    event.preventDefault();
    //open Notify box: swith bellnotify state
    //delete notify count : switch bellNotify to default

  }

  componentDidMount(){
    this._axios_bell_Count();
  }

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  render(){
    return(
      <div
        style={generalStyle.boxRelativeFull}>
        <div
          style={styleMiddle.boxBell}
          onClick={this._handleClick_bell}>
          <SvgBell/>
          {
            this.state.bellNotify &&
            <div>
              <SvgBellSpot/>
              <span>{this.state.bellNotify}</span>
            </div>
          }
        </div>
        {
          //the Notifications box if click
          this.state.notifyBox &&
          <NotifyBox/>
        }
      </div>
    )
  }
}
