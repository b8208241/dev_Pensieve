import { combineReducers } from 'redux';
import {
  MOUNT_USERINFO,
  SET_UNITCURRENT,
  SET_UNITINSPIRED,
  UPDATE_NOUNSBASIC
} from '../constants/typesGeneral.js';
import {
  initGlobal,
  initNouns
} from '../constants/states.js';

//this is a temp management, in case one day we will seperate the reducer like the initstate
const initialGeneral = Object.assign({}, initGlobal, initNouns);

function pageTerrace(state = initialGeneral, action){
  switch (action.type) {
    case MOUNT_USERINFO:
      return Object.assign({}, state, {
        userInfo: action.userInfo
      })
      break;
    case SET_UNITCURRENT:
      return Object.assign({}, state, {
        unitCurrent: action.unitCurrent
      })
      break;
    case SET_UNITINSPIRED:
      return Object.assign({}, state, {
        unitCurrent: {...state.unitCurrent, ...action.nextInpired}
      })
      break;
    case UPDATE_NOUNSBASIC:
      return Object.assign({}, state, {
        nounsBasic: {...state.nousBasic, ...action.newFetch}
      })
      break;
    default:
      return state
  }
}

export default pageTerrace
