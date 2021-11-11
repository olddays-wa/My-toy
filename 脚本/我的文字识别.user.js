// ==UserScript==
// @name         我的文字识别
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  验证码识别
// @author       white_shark@yeah.net
// @match        https://www1.nm.zsks.cn/kscx/
// @icon         https://www.google.com/s2/favicons?domain=flower
// @grant        GM_xmlhttpRequest
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @connect      *
// ==/UserScript==

(function() {
    var access_token;
    'use strict';
    function getBase64Image(img) {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, img.width, img.height);
        var dataURL = canvas.toDataURL("image/png");
        // dataURL = dataURL.replace("data:image/png;base64,", "");
        // return dataURL;
        // return dataURL.replace("data:image/png;base64,", "");
        // return encodeURI(dataURL);
        return encodeURIComponent(dataURL);
    }
    var imgget = document.getElementsByClassName('randomImg')[0];
    imgget = getBase64Image(imgget);
    // console.log(imgget);
    var _data=new FormData();
    _data.append("image",imgget);
    _data.append("language_type","ENG");
    GM_xmlhttpRequest(
        {
            method: 'POST',
            url:'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=gDUpGNQMIlx7hy5ozV8Nt6sk&client_secret=VzUSSGDoeTMkdCha10FPEPNEqGWHg1xY',
            headers:{
                'Content-Type':'application/x-www-form-urlencoded'
            },
            onload:function(res){
                var n;
                n = res.response.indexOf('access_token')+15;
                access_token = res.response.slice(n,n+70);
                console.log(access_token);
                GM_xmlhttpRequest(
                    {
                        method: 'POST',
                        url:'https://aip.baidubce.com/rest/2.0/ocr/v1/accurate_basic?access_token=' + access_token,
                        data:'image='+imgget+'&language_type=ENG',
                        headers:{
                            'Content-Type':'application/x-www-form-urlencoded'
                        },
                        onload:function(res){
                            var obj = eval('(' + res.response + ')');
                            // console.log(res.response);
                            console.log(obj.words_result[0].words);
                            var words = document.getElementById('addcode');
                            words.value = obj.words_result[0].words.replace(/\s*/g,"");
                        }
                    }
                );
            }
        }
    );
/*     GM_xmlhttpRequest(
        {
            method: 'POST',
            url:'https://aip.baidubce.com/rest/2.0/ocr/v1/accurate_basic?access_token=' + access_token,
            headers:{
                'Content-Type':'application/x-www-form-urlencoded'
            },
            data:{
                'image':imgget,
                'language_type':'ENG'
            },
            onload:function(res){
                console.log(res);
            }
        }
    ); */
})();