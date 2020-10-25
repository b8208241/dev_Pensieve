export function _axios_getUnitData(cancelToken, unitId){
  let header = {
        'charset': 'utf-8'
      };
  // we set token to header if "there is a token",
  // because the boolean value always turn to string in http header, 'false' would be hard to use
  if(!!window.localStorage['token']){ // has token
    header['token'] = window.localStorage['token'];
  };

  return axios.get('/router/units/'+unitId, {
    headers: header,
    cancelToken: cancelToken
  }).catch(function (thrown) {
    throw thrown;
  });
};


export function _axios_getUnitImg_base64(cancelToken, src){
  let header = {};
  if(!!window.localStorage['token']){ // has token
    header['token'] = window.localStorage['token'];
  };

  return axios.get('/router/img/'+src+'?type=unitSingle', {
    headers: header,
    cancelToken: cancelToken
  }).catch(function (thrown) {
    throw thrown;
  });
};

export function _axios_getUnitImgs(cancelToken, unitId){ // currently used in any Unit...
  let header = {};
  if(!!window.localStorage['token']){ // has token
    header['token'] = window.localStorage['token'];
  };

  return axios.get('/router/units/'+unitId+'/src', {
    headers: header,
    cancelToken: cancelToken
  }).then((res)=>{
    let resObj = JSON.parse(res.data);
    let srcCover = resObj.main['pic_layer0'],
        srcBeneath = resObj.main['pic_layer1'];

    return axios.all([
      _axios_getUnitImg_base64(cancelToken, srcCover),
      srcBeneath? _axios_getUnitImg_base64(cancelToken, srcBeneath) : Promise.resolve({data: null})
    ]).then(
      axios.spread((resImgCover, resImgBeneath)=>{
        let imgObj = {
          base64Cover: resImgCover.data,
          base64Beneath: resImgBeneath.data,
          pathImgCover: srcCover, // because the 'src' was used to mean 'base64' in other files, the name here 'pass by' the word
          pathImgBeneath: srcBeneath
        }
        return imgObj;
      })
    )
  }).catch(function (thrown) {
    throw thrown;
  });
};

export function _axios_getUnitSrc(cancelToken, unitId){ // currently used in Primer
  return axios.get('/router/units/'+unitId+'/src', {
    headers: {
      'token': !!window.localStorage['token'] ? window.localStorage['token'] : false
    },
    cancelToken: cancelToken
  }).then(function (res) {
    let resObj = JSON.parse(res.data); //still parse the res data prepared to be used below
    return resObj;
  }).catch(function (thrown) {
    throw thrown;
  });
};

export function _axios_getUnitPrimer(cancelToken, unitId){
  return axios.get('/router/units/primer', {
    headers: {
      'charset': 'utf-8',
      'token': window.localStorage['token']
    },
    params: {exposedId: unitId},
    cancelToken: cancelToken
  }).then(function (res) {
    let resObj = JSON.parse(res.data); //still parse the res data prepared to be used below
    return resObj;
  }).catch(function (thrown) {
    throw thrown;
  });
};

export function _axios_get_responds(cancelToken, paramsObj){
  return axios.get('/router/units/responds', {
    headers: {
      'charset': 'utf-8',
      'token': window.localStorage['token']
    },
    params: paramsObj,
    cancelToken: cancelToken
  }).then(function (res) {
    let resObj = JSON.parse(res.data); //still parse the res data prepared to be used below
    return resObj;
  }).catch(function (thrown) {
    throw thrown;
  });
};

export function _axios_patch_ShareErase(cancelToken, exposedId){
  return axios.patch('/router/share/'+exposedId+'/erase', {}, {
    headers: {
      'Content-Type': 'application/json',
      'charset': 'utf-8',
      'token': window.localStorage['token']
    },
    cancelToken: cancelToken
  }).then(function (res) {
    let resObj = JSON.parse(res.data); //still parse the res data prepared to be used below
    return;
  }).catch(function (thrown) {
    throw thrown;
  });
}
