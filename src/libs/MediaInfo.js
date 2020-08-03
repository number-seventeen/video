!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define("MediaInfo",[],t):"object"==typeof exports?exports.MediaInfo=t():e.MediaInfo=t()}("undefined"!=typeof self?self:this,function(){return function(e){function t(i){if(n[i])return n[i].exports;var r=n[i]={i:i,l:!1,exports:{}};return e[i].call(r.exports,r,r.exports,t),r.l=!0,r.exports}var n={};return t.m=e,t.c=n,t.d=function(e,n,i){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:i})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=0)}([function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}(),o=n(1),s=i(o),u=n(2),f=i(u),c=n(3),l=i(c),g=n(4),d=i(g),v=n(5),h=i(v),p=n(6),y=i(p),b=n(7),_=i(b),m=n(8),U=i(m),I=function(){function e(){r(this,e),this.fileType=new s.default,this.mp4Analysis=new f.default,this.jpgAnalysis=new l.default,this.pngAnalysis=new d.default,this.gifAnalysis=new h.default,this.bmpAnalysis=new y.default,this.mp3Analysis=new _.default,this.wavAnalysis=new U.default}return a(e,[{key:"getInfo",value:function(e,t){var n=new DataView(e),i=t||this.fileType.getFileType(n),r={type:i,info:null};return"mp4"==i?r.info=this.mp4Analysis.getInfo(n):"jpg"==i?r.info=this.jpgAnalysis.getInfo(n):"png"==i?r.info=this.pngAnalysis.getInfo(n):"gif"==i?r.info=this.gifAnalysis.getInfo(n):"bmp"==i?r.info=this.bmpAnalysis.getInfo(n):"wav"==i?r.info=this.wavAnalysis.getInfo(n):0==i.indexOf("mp3")&&(r.info=this.mp3Analysis.getInfo(n,i),r.type="mp3"),r}}]),e}();t.default=I},function(e,t,n){"use strict";function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}(),a=function(){function e(){i(this,e)}return r(e,[{key:"getFileType",value:function(e){for(var t="",n="",i=4;i<8;i++)t+=String.fromCharCode(e.getInt8(i));for(var r=8;r<12;r++)n+=String.fromCharCode(e.getInt8(r));var a=new Uint8Array(e.buffer.slice(0,8)),o="other";if("ftyp"==t)o="mp4";else if(137==a[0]&&80==a[1]&&78==a[2]&&71==a[3]&&13==a[4]&&10==a[5]&&26==a[6]&&10==a[7])o="png";else if(255==a[0]&&216==a[1])o="jpg";else if(71!=a[0]||73!=a[1]||70!=a[2]||56!=a[3]||57!=a[4]&&55!=a[4]||97!=a[5])if(66==a[0]&&77==a[1])o="bmp";else if(82==a[0]&&73==a[1]&&70==a[2]&&70==a[3])o="wav";else if(73==a[0]&&68==a[1]&&51==a[2])o="mp3_id3v2";else{var s=e.byteLength-128,u=84==e.getUint8(s)&&65==e.getUint8(s+1)&&71==e.getUint8(s+2),f=255==a[0]&&251==a[1];(u||f)&&(o="mp3_id3v1")}else o="gif";return o}},{key:"getASCII",value:function(e){for(var t=new Uint8Array(e),n="",i=0;i<t.length;i++)n+=String.fromCharCode(t[i]);return n}}]),e}();t.default=a},function(e,t,n){"use strict";function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}(),a=function(){function e(){i(this,e)}return r(e,[{key:"getInfo",value:function(e){var t={},n=e.getInt32(12),i=[];this.getMp4Struct(i,e,0,e.byteLength,n);for(var r=void 0,a=0;a<i.length;a++)if("moov"==i[a].boxType){r=i[a];break}var o=new Date;o.setFullYear(1904,0,1),o.setHours(0,0,0,0);for(var s=o.getTime(),u=this.getMoovData(r,e,n),f=0;f<u.length;f++){var c=u[f];if("mvhd"==c.boxType)t.creation_time=Math.max(0,1e3*c.info.creation_time+s),t.modification_time=Math.max(0,1e3*c.info.modification_time+s),t.duration=c.info.duration/c.info.time_scale;else if("trak"==c.boxType)if("vide"==c.track_type){var l=c.stsz.sample_count;t.width=c.stsd.width,t.height=c.stsd.height,t.video_format=c.stsd.format,t.video_frames=l,t.video_duration=c.mdhd.duration/c.mdhd.time_scale,t.fps=l/t.video_duration,t.bit_rate=8*c.stsz.file_size/t.video_duration/1e3,t.bit_depth=c.stsd.bit_depth}else if("soun"==c.track_type){var g=c.stsz.sample_count;t.audio_format=c.stsd.format,t.audio_frames=g,t.audio_duration=c.mdhd.duration/c.mdhd.time_scale,t.audio_smplrate=c.stsd.smplrate,t.audio_channel=c.stsd.channel,t.audio_bit_rate=8*c.stsz.file_size/t.audio_duration/1e3}}return t}},{key:"getMp4Struct",value:function(e,t,n,i){var r=t.getInt32(n),a=this.getASCII(t.buffer.slice(n+4,n+8));e.push({boxType:a,boxPosStart:n,boxPosEnd:n+r}),n+r<i&&this.getMp4Struct(e,t,n+r,i)}},{key:"getASCII",value:function(e){for(var t=new Uint8Array(e),n="",i=0;i<t.length;i++)n+=String.fromCharCode(t[i]);return n}},{key:"getMoovData",value:function(e,t,n){if(!e)return null;var i=[];this.getMp4Struct(i,t,e.boxPosStart+8,e.boxPosEnd);for(var r=0;r<i.length;r++){var a=i[r];if("mvhd"==a.boxType)a.info=this.decode_mvhd(a,t,n);else{var o=[];this.getMp4Struct(o,t,a.boxPosStart+8,a.boxPosEnd),a.children=o;for(var s=0;s<o.length;s++){var u=o[s];if("tkhd"==u.boxType)u.info=this.decode_tkhd(u,t,u.boxPosStart+8,u.boxPosEnd);else if("mdia"==u.boxType){var f=[];this.getMp4Struct(f,t,u.boxPosStart+8,u.boxPosEnd),u.children=f;for(var c=0;c<f.length;c++){var l=f[c];if("mdhd"==l.boxType)l.info=this.decode_mdhd(l,t,n),a.mdhd=l.info;else if("hdlr"==l.boxType)l.info=this.decode_hdlr(l,t,n),u.track_type=l.info.handler_type,a.track_type=l.info.handler_type;else if("minf"==l.boxType){var g=[];this.getMp4Struct(g,t,l.boxPosStart+8,l.boxPosEnd),l.children=g;for(var d=0;d<g.length;d++){var v=g[d];if("vmhd"==v.boxType)v.info=this.decode_vmhd(v,t,n);else if("smhd"==v.boxType)v.info=this.decode_smhd(v,t,n);else if("stbl"==v.boxType){var h=[];this.getMp4Struct(h,t,v.boxPosStart+8,v.boxPosEnd),v.children=h;for(var p=0;p<h.length;p++){var y=h[p];"stsd"==y.boxType?("vide"==u.track_type?y.info=this.decode_stsd_video(y,t,n):"soun"==u.track_type&&(y.info=this.decode_stsd_audio(y,t,n)),a.stsd=y.info):"stts"==y.boxType?("vide"==u.track_type?y.info=this.decode_stts_video(y,t,n):"soun"==u.track_type&&(y.info=this.decode_stts_audio(y,t,n)),a.stts=y.info):"stsz"==y.boxType&&("vide"==u.track_type?y.info=this.decode_stsz_video(y,t,n):"soun"==u.track_type&&(y.info=this.decode_stsz_audio(y,t,n)),a.stsz=y.info)}}}}}}}}}return i}},{key:"decode_mvhd",value:function(e,t,n){var i={},r=e.boxPosStart+8;return 1==n?(r+=4,i.creation_time=t.getBigUint64(r),r+=8,i.modification_time=t.getBigUint64(r),r+=8,i.time_scale=t.getUint32(r),r+=4,i.duration=t.getBigUint64(r),r+=4):(r+=4,i.creation_time=t.getUint32(r),r+=4,i.modification_time=t.getUint32(r),r+=4,i.time_scale=t.getUint32(r),r+=4,i.duration=t.getUint32(r),r+=4),i.rate=t.getUint32(r),r+=4,i.volume=t.getUint16(r),i}},{key:"decode_tkhd",value:function(e,t,n){var i={},r=e.boxPosStart+8;return i.version=t.getUint8(r),i.flags=t.getUint8(r+3),r+=4,i.creation_time=t.getUint32(r),r+=4,i.modification_time=t.getUint32(r),r+=4,i.track_id=t.getUint32(r),r+=4,r+=4,i.duration=t.getUint32(r),r+=8,r+=4,i.layer=t.getUint16(r),r+=2,i.alternate_group=t.getUint16(r),r+=2,i.volume=t.getUint8(r)+t.getUint8(r+1)/100,r+=2,r+=2,r+=36,i.width=t.getUint16(r),r+=4,i.height=t.getUint16(r),i}},{key:"decode_mdhd",value:function(e,t,n){var i={},r=e.boxPosStart+8;return i.version=t.getUint8(r),i.flags=t.getUint8(r+3),r+=4,i.creation_time=t.getUint32(r),r+=4,i.modification_time=t.getUint32(r),r+=4,i.time_scale=t.getUint32(r),r+=4,i.duration=t.getUint32(r),i}},{key:"decode_hdlr",value:function(e,t,n){var i={},r=e.boxPosStart+8;return i.version=t.getUint8(r),i.flags=t.getUint8(r+3),r+=8,i.handler_type=this.getASCII(t.buffer.slice(r,r+4)),i}},{key:"decode_vmhd",value:function(e,t,n){var i={},r=e.boxPosStart+8;return i.version=t.getUint8(r),i.flags=t.getUint8(r+3),r+=4,i.graphics_mode=t.getUint32(r),i}},{key:"decode_smhd",value:function(e,t,n){var i={},r=e.boxPosStart+8;return i.version=t.getUint8(r),i.flags=t.getUint8(r+3),r+=4,i.balance=t.getInt8(r),i}},{key:"decode_stsd_video",value:function(e,t,n){var i={},r=e.boxPosStart+8;return i.version=t.getUint8(r),i.flags=t.getUint8(r+3),r+=4,i.sample_descriptions=t.getUint32(r),r+=4,i.size=t.getUint32(r),r+=4,i.format=this.getASCII(t.buffer.slice(r,r+4)),r+=28,i.width=t.getUint16(r),i.height=t.getUint16(r+2),r+=4,i.horizresolution=t.getUint32(r),i.vertresolution=t.getUint32(r+4),r+=8,i.reserved=t.getUint32(r),r+=4,i.frames_count=t.getUint16(r),r+=2,r+=32,i.bit_depth=t.getUint16(r),r+=2,i}},{key:"decode_stsd_audio",value:function(e,t,n){var i={},r=e.boxPosStart+8;return i.version=t.getUint8(r),i.flags=t.getUint8(r+3),r+=4,i.sample_descriptions=t.getUint32(r),r+=4,i.size=t.getUint32(r),r+=4,i.format=this.getASCII(t.buffer.slice(r,r+4)),r+=20,i.channel=t.getUint16(r),r+=8,i.smplrate=t.getUint16(r),i}},{key:"decode_stts_video",value:function(e,t,n){var i={},r=e.boxPosStart+8;return i.version=t.getUint8(r),i.flags=t.getUint8(r+3),r+=4,i.time_to_sample=t.getUint32(r),r+=4,i.sample_count=t.getUint32(r),r+=4,i.sample_duration=t.getUint32(r),i}},{key:"decode_stts_audio",value:function(e,t,n){var i={},r=e.boxPosStart+8;return i.version=t.getUint8(r),i.flags=t.getUint8(r+3),r+=4,i.time_to_sample=t.getUint32(r),r+=4,i.sample_count=t.getUint32(r),r+=4,i.sample_duration=t.getUint32(r),i}},{key:"decode_stsz_video",value:function(e,t,n){var i={},r=e.boxPosStart,a=t.getInt32(r+16);r+=20;for(var o=0,s=0;s<a;s++)o+=t.getInt32(r),r+=4;return i.file_size=o,i.sample_count=a,i}},{key:"decode_stsz_audio",value:function(e,t,n){var i={},r=e.boxPosStart,a=t.getInt32(r+16);r+=20;for(var o=0,s=0;s<a;s++)o+=t.getInt32(r),r+=4;return i.file_size=o,i.sample_count=a,i}}]),e}();t.default=a},function(e,t,n){"use strict";function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}(),a=function(){function e(){i(this,e)}return r(e,[{key:"getInfo",value:function(e){function t(n){var r=e.getUint8(n).toString(16),a=e.getUint8(n+1).toString(16),o=e.getUint16(n+2);o+=2,i.push({mark:e.getUint8(n),type:e.getUint8(n+1),mark_string:r,type_string:a,startPos:n,endPos:n+o}),n+o<e.byteLength&&t(n+o)}var n={},i=[];t(2);for(var r=0;r<i.length;r++){var a=i[r];if(255==a.mark&&(192==a.type||194==a.type)){var o=a.startPos+5;n.height=e.getUint16(o),n.width=e.getUint16(o+2)}}return n}}]),e}();t.default=a},function(e,t,n){"use strict";function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}(),a=function(){function e(){i(this,e)}return r(e,[{key:"getInfo",value:function(e){return{width:e.getUint32(16),height:e.getUint32(20)}}}]),e}();t.default=a},function(e,t,n){"use strict";function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}(),a=function(){function e(){i(this,e)}return r(e,[{key:"getInfo",value:function(e){return{width:e.getUint16(6,!0),height:e.getUint16(8,!0)}}}]),e}();t.default=a},function(e,t,n){"use strict";function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}(),a=function(){function e(){i(this,e)}return r(e,[{key:"getInfo",value:function(e){return{width:e.getUint32(18,!0),height:e.getUint32(22,!0)}}}]),e}();t.default=a},function(e,t,n){"use strict";function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}(),a={"0000":[-1,-1,-1,-1,-1],"0001":[32,32,32,32,8],"0010":[64,48,40,48,16],"0011":[96,56,48,56,24],"0100":[128,64,56,64,32],"0101":[160,80,64,80,40],"0110":[192,96,80,96,48],"0111":[224,112,96,112,56],1000:[256,128,112,128,64],1001:[288,160,128,144,80],1010:[320,192,160,160,96],1011:[352,224,192,176,112],1100:[384,256,224,192,128],1101:[416,320,256,224,144],1110:[448,384,320,256,160],1111:[-2,-2,-2,-2,-2]},o={"00":[44100,22050,11025],"01":[48e3,24e3,12e3],10:[32e3,16e3,8e3],11:[0,0,0,0]},s={LayerI_MPEG1:384,LayerI_MPEG2:384,LayerI_MPEG3:384,LayerII_MPEG1:1152,LayerII_MPEG2:1152,LayerII_MPEG3:1152,LayerIII_MPEG1:1152,LayerIII_MPEG2:576,LayerIII_MPEG3:576},u=function(){function e(){i(this,e)}return r(e,[{key:"getInfo",value:function(e,t){return"mp3_id3v2"==t?this.getInfo_id3v2(e):this.getInfo_id3v1(e)}},{key:"getInfo_id3v1",value:function(e){var t=0,n=this.getFrameHeaderMsg(e.getUint32(t)),i=s[n.layer+"_"+n.coding_version],r=this.getFrameLength(n,i),a=this.getASCII(e.buffer.slice(t,t+r));a=a.toLocaleLowerCase(),(a.indexOf("xing")>-1||a.indexOf("info")>-1||a.indexOf("vbri")>-1)&&(t+=r,n=this.getFrameHeaderMsg(e.getUint32(t)),i=s[n.layer+"_"+n.coding_version],r=this.getFrameLength(n,i));var o=i/n.samplingrate,u=Math.floor((e.byteLength-128)/r)*o;return{channel:n.channel,bitrate:n.kbps,samplingrate:n.samplingrate,duration:u}}},{key:"getInfo_id3v2",value:function(e){var t=6;t=2097152*(127&e.getUint8(t))+1024*(127&e.getUint8(t+1))+128*(127&e.getUint8(t+2))+(127&e.getUint8(t+3))+10;var n=this.getFrameHeaderMsg(e.getUint32(t)),i=s[n.layer+"_"+n.coding_version],r=this.getFrameLength(n,i),a=this.getASCII(e.buffer.slice(t,t+r));a=a.toLocaleLowerCase(),(a.indexOf("xing")>-1||a.indexOf("info")>-1||a.indexOf("vbri")>-1)&&(t+=r,n=this.getFrameHeaderMsg(e.getUint32(t)),i=s[n.layer+"_"+n.coding_version],r=this.getFrameLength(n,i));var o=i/n.samplingrate,u=Math.floor((e.byteLength-t)/r)*o;return{channel:n.channel,kbps:n.kbps,samplingrate:n.samplingrate,duration:u}}},{key:"getFrameHeaderMsg",value:function(e){var t={},n=e.toString(2),i=(n.substring(0,11),n.substring(11,13)),r=n.substring(13,15),a=n.substring(15,16),s=n.substring(16,20),u=n.substring(20,22),f=n.substring(22,23),c=n.substring(23,24),l=n.substring(24,26);n.substring(26,28),n.substring(28,29),n.substring(29,30),n.substring(30,32);switch(i){case"00":t.coding_version="MPEG2.5";break;case"01":t.coding_version="Retain";break;case"10":t.coding_version="MPEG2";break;case"11":t.coding_version="MPEG1"}switch(r){case"00":t.layer="Retain";break;case"01":t.layer="LayerIII";break;case"10":t.layer="LayerII";break;case"11":t.layer="LayerI"}t.hasCRC_check="0"==a,t.kbps=this.getKbps(s,t.coding_version,t.layer);var g=0;switch("MPEG1"==t.coding_version?g=o[u][0]:"MPEG2"==t.coding_version?g=o[u][1]:"MPEG2.5"==t.coding_version&&(g=o[u][2]),t.samplingrate=g,t.isFill="1"==f,t.private=c,l){case"00":case"01":case"10":t.channel=2;break;case"11":t.channel=1}return t}},{key:"getKbps",value:function(e,t,n){var i=a[e],r=0;return"MPEG1"==t?"LayerI"==n?r=i[0]:"LayerII"==n?r=i[1]:"LayerIII"==n&&(r=i[2]):"MPEG2"!=t&&"MPEG2.5"!=t||("LayerI"==n?r=i[3]:"LayerII"!=n&&"LayerIIi"!=n||(r=i[4])),r}},{key:"getFrameBox",value:function(e,t,n,i){var r=this.getASCII(t.buffer.slice(n,n+4));n+=4;var a=this.getFrameLen(t,n);n+=6,e.push({box_mark:r,contentStart:n,contentEnd:n+a}),n+a<i&&this.getFrameBox(e,t,n+a,i)}},{key:"getFrameLen",value:function(e,t){return 4294967296*e.getUint8(t)+65536*e.getUint8(t+1)+256*e.getUint8(t+2)+e.getUint8(t+3)}},{key:"getFrameLength",value:function(e,t){var n=void 0;return"LayerI"==e.layer?(n=t/8*e.kbps/(e.samplingrate/1e3),n=Math.floor(n),e.isFill&&(n+=4)):(n=t/8*e.kbps/(e.samplingrate/1e3),n=Math.floor(n),e.isFill&&(n+=1)),n}},{key:"getASCII",value:function(e){for(var t=new Uint8Array(e),n="",i=0;i<t.length;i++)n+=String.fromCharCode(t[i]);return n}}]),e}();t.default=u},function(e,t,n){"use strict";function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}(),a=function(){function e(){i(this,e)}return r(e,[{key:"getInfo",value:function(e){var t={},n=4,i=e.getUint32(n,!0);n+=12;e.getUint32(n,!0);n+=4;var r=this.getWaveFormat(e.getUint16(n,!0));n+=2;var a=e.getUint16(n,!0);n+=2;var o=e.getUint32(n,!0);n+=4;var s=e.getUint32(n,!0);n+=4;e.getUint16(n,!0);n+=2;var u=e.getUint16(n,!0);if("children"==r){n+=2;e.getUint16(n,!0);n+=2;e.getUint16(n,!0);n+=2;e.getUint32(n,!0);n+=4;e.getUint16(n,!0);r=this.getWaveFormat(e.getUint16(n,!0))}return t.format=r,t.channel=a,t.sampling_rate=o,t.bit_depth=u,t.duration=i/s,t.bitrate=8*s/1e3,t}},{key:"getWaveFormat",value:function(e){var t="PCM";switch(e){case 1:t="PCM";break;case 2:t="Microsoft ADPCM";break;case 3:t="IEEE float";break;case 6:t="ITU G.711 a-law";break;case 7:t="ITU G.711 μ-law";break;case 49:t="GSM 6.10";break;case 64:t="ITU G.721 ADPCM";break;case 65534:t="children"}return t}}]),e}();t.default=a}]).default});