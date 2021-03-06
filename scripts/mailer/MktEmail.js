const {
  domain
} = require('../../config/services.js');

const _render_HtmlBody = (mailUnitArr)=>{
  const _getYearAbbr = (dateObj)=>{
    switch (dateObj.getMonth()) {
      case 0:
        return "Jan. "
        break;
      case 1:
        return "Feb. "
        break;
      case 2:
        return "Mar. "
        break;
      case 3:
        return "Apr. "
        break;
      case 4:
        return "May. "
        break;
      case 5:
        return "Jun. "
        break;
      case 6:
        return "Jul. "
        break;
      case 7:
        return "Aug. "
        break;
      case 8:
        return "Sep. "
        break;
      case 9:
        return "Oct. "
        break;
      case 10:
        return "Nov. "
        break;
      case 11:
        return "Dec. "
        break;
      default:
        return (dateObj.getMonth()+1)
    }
  };
  const d = new Date();
  const date = d.getDate();
  const year = d.getFullYear();
  const month = _getYearAbbr(d);
  const unitsPreview = () => {
    let domString ='';
    mailUnitArr.forEach((unitObj, index) => {
      let domSubtitle = '';
      unitObj.nodes.forEach((nodeName, indexNodes) => {
        if(indexNodes != 0) domSubtitle = domSubtitle + '<span>, &nbsp;</span>';
        domSubtitle = domSubtitle +　'<span>' + nodeName +' </span>';
      });
      domSubtitle = '<span>at </span>' + domSubtitle;

      domString = domString + '<div class="setBox"> <a href="https://' +
      domain.name +
      '/cosmic/explore/unit?unitId=' +
      unitObj.unitExposed +
      '&unitView=theater" target="_blank" class="plainLinkButton imgThumb" style="background-image: url(https://' +
      domain.name+
      '/router/img/' +
      unitObj.imgUrl +
      '?type=thumb);"></a>  <div class="boxTitleThumb fontNodesEqual_L5 colorDescripBlack"> <strong>' +
      ((unitObj.type == 'responds') ? 'Responds to your contribution' : 'New to your corners') +
      '</strong> </div> <div class="boxThumbNodes fontNodesEqual_L5 colorEditBlack"> ' +
      domSubtitle +
      ' </div> </div>';
    });

    return domString;
  };

  return(
    '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"><html xmlns="http://www.w3.org/1999/xhtml"> <head> <meta http-equiv="Content-Type" content="text/html; charset=utf-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0001, minimum-scale=1.0001, maximum-scale=1.0001, user-scalable=no"> <!--[if !mso]><!--> <meta http-equiv="X-UA-Compatible" content="IE=Edge"> <!--<![endif]--> <style type="text/css">html { font-family: "Lato", "Noto Sans TC", "微軟正黑體", "Helvetica Neue", Helvetica, Futura, sans-serif, Arial; } body { margin: 0; width: 100%; } .mailMain { width: 100%; box-sizing: border-box; padding: 12.5px 2.5%; } .mailBoxContent { width: 100%; box-sizing: border-box; padding: 15px 4.5%; text-align: center; overflow: hidden; } .mailBoxContentGreet { padding: 2px 0 16px; margin: 0; } .mailBanner{ max-width: 400px; box-sizing: border-box; margin:0 auto; } .imgThumb { display: inline-block; width: 90%; height: 278px; box-sizing: border-box; background-size: cover; background-position: 50% 50%; background-repeat: no-repeat; overflow: hidden; } .setBox{ display: inline-block; width:42%; min-width: 260px; max-width: 90vw; padding:0 10px; margin:36px 0 20px; text-align: center; } .boxTitleThumb { padding: 15px 5% 8px; text-align: left; white-space: nowrap; } .boxThumbNodes { padding: 8px 5% 15px; text-align: left; } .plainLinkButton { text-decoration: none; color: inherit; } .boxFooter { width: 100%; box-sizing: border-box; text-align: center; background-color: rgb(117,117,117); margin-bottom: 16px; clear: both; } .boxServiceLink { padding: 10px; white-space: nowrap; } .boxLogo { display: inline-block; width: 100px; min-width: 12vw; box-sizing: border-box; cursor: pointer; float: left; } .boxLogoReverse { display: inline-block; width: 160px; max-width: 63vw; min-width: 130.6px; box-sizing: border-box; margin: 40px 0% 10px; cursor: pointer; } .spanTitleDate { display: inline-block; float: right; } .tagServiceLink { display: inline-block; box-sizing: border-box; margin-bottom: 1px; } .fontContent { font-size: 14px; line-height: 1.5; } .fontContentPlain { font-size: 14px; } .fontTitle { font-size: 24px; } .fontSubtitle { font-size: 16px; } .fontNodesEqual_L5 { font-size: 20px; line-height: 1.5; } .fontSubmit { font-size: 24px; } .fontTitleSmall { font-size: 12px; line-height: 1.5; } .fontServiceLink { font-size: 12px; font-weight: bold; } .weightBold { font-weight: bold; } .colorWhite { color: #ffffff } .colorStandard { color: #ff8168; } .colorDescripBlack { color: #444444; } .colorEditBlack { color: #545454; } .colorEditLightBlack { color: #757575; } .colorLightStandard { color: #fff8f7; } .colorLightGrey { color: #b8b8b8; } .colorGrey { color: #a3a3a3; } .signInButton { display: inline-block; padding: 15px 32px; margin: 10px; border-radius:4px; background-color: #ff8168; text-align: center; cursor: pointer; } </style> </head><body><div class="mailMain"> <div style="border:solid 1px #d8d8d8; width: 91%; margin: 31.25px 4.5% 12.5px;"></div> <div class="mailBoxContent"> <a href="https://www.' +
    domain.name +
    '/" target="_blank" class="boxLogo plainLinkButton"> <!-- <SvgLogo/> --> <img src="http://www.' +
    domain.name +
    '/png/Logo.png" style= "height:auto; width: 100%; position:relative; box-sizing: border-box; "> </a> <span class="spanTitleDate fontContentPlain colorLightGrey weightBold">' +
    month +date + ', '+year +
    '</span> </div> <div class="mailBoxContent" style="text-align: center; min-height: 60vh; padding-bottom: 35px;"> <div> <div class="mailBoxContentGreet fontTitle colorStandard" style="font-weight: 700;"> Update About Your Corners! </div> </div> <div class="mailBanner colorEditBlack fontContent" > <p> We are glad to see more and more people enjoying their advanture on <strong>Cornerth. </strong>There are new posts around you.<br/> Your <strong>Fellows</strong> will be happy to meet you there. </p> </div> <div>' +
    unitsPreview() +
    `</div> <div style="padding:15px 0 35px;"> <div class="colorEditBlack fontContent" style="margin-bottom: 20px"> And more on Cornerth, <br/> don't miss the thing! </div> <a href="https://www.` +
    domain.name +
    `/" target="_blank" style="font-weight: bold;color: white;" class="signInButton plainLinkButton fontSubtitle colorWhite"> Go to Cornerth. </a> </div> </div> <div class="boxFooter"> <a href="https://www.` +
    domain.name +
    `/" target="_blank" class="boxLogoReverse plainLinkButton" style="margin-top: 40px; text-align: center;"> <!-- <SvgLogo/> --> <img src="http://www.` +
    domain.name +
    `/png/Logo_reverse.png" style= "height:auto; width: 100%; position:relative; box-sizing: border-box; "> </a> <div class="boxServiceLink"> <a href="https://` +
    domain.name +
    `/s/unsubscribe" target="_blank" style="color:#a3a3a3;" class="tagServiceLink fontServiceLink colorGrey"> Unsubscribe from List</a> </div> <div class="boxServiceLink"> <a href="https://www.facebook.com/pg/cornerth.center/about/" target="_blank" method="about" style="color:#fff8f7;" class="plainLinkButton tagServiceLink fontServiceLink colorLightStandard"> About</a> <span class="tagServiceLink fontServiceLink colorGrey" style="cursor:default;">．</span> <a href="https://www.` +
    domain.name +
    `/a/privacy" method="privacy" style="color:#fff8f7;" class="plainLinkButton tagServiceLink fontServiceLink colorLightStandard"> Privacy</a> <span class="tagServiceLink fontServiceLink colorGrey" style="cursor:default;">．</span> <a href="https://www.` +
    domain.name +
    `/a/terms" method="terms" style="color:#fff8f7;" class="plainLinkButton tagServiceLink fontServiceLink colorLightStandard"> Terms</a> <span class="tagServiceLink fontServiceLink colorGrey" style="cursor:default;">．</span> <a href="https://www.facebook.com/cornerth.center/" target="_blank" method="contact" style="color:#fff8f7;" class="plainLinkButton tagServiceLink fontServiceLink colorLightStandard"> Contact</a> </div> <div class="boxServiceLink fontTitleSmall colorGrey" style="padding-bottom: 20px;"> <span>Cornerth., Inc.</span> <span>All Rights Reserved.</span> </div> </div> </body></html>`
  )
}

module.exports = {
  _render_HtmlBody
};
