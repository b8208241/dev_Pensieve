import React from 'react';
import {
  Route,
  Link
} from 'react-router-dom';
import Inspired from './component/Inspired/Inspired.jsx';
import Broads from './component/Broads/Broads.jsx';
import NavEmbed from './Navs/NavSubs/NavEmbed.jsx';

export default class CogEmbed extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={
      selfCom_CogEmbed_: {
        width: '100%',
        position: 'absolute',
        top: '0',
        left: '0'
      },
      selfCom_CogEmbed_Nav_: {
        width: '100%',
        boxSizing: 'border-box',
      },
      selfCom_CogEmbed_main_: {
        width: '100%'
      }
    }
  }

  render(){
    return(
      <div
        style={this.style.selfCom_CogEmbed_}>
        <div
          style={this.style.selfCom_CogEmbed_Nav_}>
          <NavEmbed
            {...this.props}/>
        </div>
        <div
          style={this.style.selfCom_CogEmbed_main_}>
          <Route path={this.props.match.path+"/inspireds"} render={(props)=> <Inspired {...props} _refer_leaveSelf={this.props._refer_leaveSelf}/>}/>
          <Route path={this.props.match.path+"/broads"} render={(props)=> <Broads {...props} _refer_leaveSelf={this.props._refer_leaveSelf}/>}/>
        </div>
      </div>
    )
  }
}
