!function(e){var t={};function n(i){if(t[i])return t[i].exports;var r=t[i]={i:i,l:!1,exports:{}};return e[i].call(r.exports,r,r.exports,n),r.l=!0,r.exports}n.m=e,n.c=t,n.d=function(e,t,i){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:i})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var i=Object.create(null);if(n.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(i,r,function(t){return e[t]}.bind(null,r));return i},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=1)}([function(e,t){!function(e){"use strict";var t="File format is not recognized.",n="CRC failed.",i="File contains encrypted entry.",r="File is using Zip64 (4gb+ file size).",a="Error while reading zip file.",o="Error while writing zip file.",s="Error while writing file data.",c="Error while reading file data.",u="File already exists.",f=524288,l="text/plain";try{I=0===new Blob([new DataView(new ArrayBuffer(0))]).size}catch(e){}function h(){this.crc=-1}function d(){}function p(e,t){var n,i;return n=new ArrayBuffer(e),i=new Uint8Array(n),t&&i.set(t,0),{buffer:n,array:i,view:new DataView(n)}}function g(){}function m(e){var t,n=this;n.size=0,n.init=function(i,r){var a=new Blob([e],{type:l});(t=new y(a)).init(function(){n.size=t.size,i()},r)},n.readUint8Array=function(e,n,i,r){t.readUint8Array(e,n,i,r)}}function w(t){var n,i=this;i.size=0,i.init=function(e){for(var r=t.length;"="==t.charAt(r-1);)r--;n=t.indexOf(",")+1,i.size=Math.floor(.75*(r-n)),e()},i.readUint8Array=function(i,r,a){var o,s=p(r),c=4*Math.floor(i/3),u=4*Math.ceil((i+r)/3),f=e.atob(t.substring(c+n,u+n)),l=i-3*Math.floor(c/4);for(o=l;o<l+r;o++)s.array[o-l]=f.charCodeAt(o);a(s.array)}}function y(e){var t=this;t.size=0,t.init=function(n){t.size=e.size,n()},t.readUint8Array=function(t,n,i,r){var a=new FileReader;a.onload=function(e){i(new Uint8Array(e.target.result))},a.onerror=r;try{a.readAsArrayBuffer(function(e,t,n){if(t<0||n<0||t+n>e.size)throw new RangeError("offset:"+t+", length:"+n+", size:"+e.size);return e.slice?e.slice(t,t+n):e.webkitSlice?e.webkitSlice(t,t+n):e.mozSlice?e.mozSlice(t,t+n):e.msSlice?e.msSlice(t,t+n):void 0}(e,t,n))}catch(e){r(e)}}}function v(){}function _(e){var t;this.init=function(e){t=new Blob([],{type:l}),e()},this.writeUint8Array=function(e,n){t=new Blob([t,I?e:e.buffer],{type:l}),n()},this.getData=function(n,i){var r=new FileReader;r.onload=function(e){n(e.target.result)},r.onerror=i,r.readAsText(t,e)}}function b(t){var n="",i="";this.init=function(e){n+="data:"+(t||"")+";base64,",e()},this.writeUint8Array=function(t,r){var a,o=i.length,s=i;for(i="",a=0;a<3*Math.floor((o+t.length)/3)-o;a++)s+=String.fromCharCode(t[a]);for(;a<t.length;a++)i+=String.fromCharCode(t[a]);s.length>2?n+=e.btoa(s):i=s,r()},this.getData=function(t){t(n+e.btoa(i))}}function z(e){var t;this.init=function(n){t=new Blob([],{type:e}),n()},this.writeUint8Array=function(n,i){t=new Blob([t,I?n:n.buffer],{type:e}),i()},this.getData=function(e){e(t)}}function U(e,t,n,i,r,a,o,s,c,u){var l,h,d,p=0,g=t.sn;function m(){e.removeEventListener("message",w,!1),s(h,d)}function w(t){var n=t.data,r=n.data,s=n.error;if(s)return s.toString=function(){return"Error: "+this.message},void c(s);if(n.sn===g)switch("number"==typeof n.codecTime&&(e.codecTime+=n.codecTime),"number"==typeof n.crcTime&&(e.crcTime+=n.crcTime),n.type){case"append":r?(h+=r.length,i.writeUint8Array(r,function(){y()},u)):y();break;case"flush":d=n.crc,r?(h+=r.length,i.writeUint8Array(r,function(){m()},u)):m();break;case"progress":o&&o(l+n.loaded,a);break;case"importScripts":case"newTask":case"echo":break;default:console.warn("zip.js:launchWorkerProcess: unknown message: ",n)}}function y(){(l=p*f)<=a?n.readUint8Array(r+l,Math.min(f,a-l),function(n){o&&o(l,a);var i=0===l?t:{sn:g};i.type="append",i.data=n;try{e.postMessage(i,[n.buffer])}catch(t){e.postMessage(i)}p++},c):e.postMessage({sn:g,type:"flush"})}h=0,e.addEventListener("message",w,!1),y()}function A(e,t,n,i,r,a,o,s,c,u){var l,d=0,p=0,g="input"===a,m="output"===a,w=new h;!function a(){var h;if((l=d*f)<r)t.readUint8Array(i+l,Math.min(f,r-l),function(t){var i;try{i=e.append(t,function(e){o&&o(l+e,r)})}catch(e){return void c(e)}i?(p+=i.length,n.writeUint8Array(i,function(){d++,setTimeout(a,1)},u),m&&w.append(i)):(d++,setTimeout(a,1)),g&&w.append(t),o&&o(l,r)},c);else{try{h=e.flush()}catch(e){return void c(e)}h?(m&&w.append(h),p+=h.length,n.writeUint8Array(h,function(){s(p,w.get())},u)):s(p,w.get())}}()}function C(t,n,i,r,a,o,s,c,u,f,l){e.zip.useWebWorkers&&s?U(t,{sn:n,codecClass:"NOOP",crcType:"input"},i,r,a,o,u,c,f,l):A(new d,i,r,a,o,"input",u,c,f,l)}function S(e){var t,n,i="",r=["Ç","ü","é","â","ä","à","å","ç","ê","ë","è","ï","î","ì","Ä","Å","É","æ","Æ","ô","ö","ò","û","ù","ÿ","Ö","Ü","ø","£","Ø","×","ƒ","á","í","ó","ú","ñ","Ñ","ª","º","¿","®","¬","½","¼","¡","«","»","_","_","_","¦","¦","Á","Â","À","©","¦","¦","+","+","¢","¥","+","+","-","-","+","-","+","ã","Ã","+","+","-","-","¦","-","+","¤","ð","Ð","Ê","Ë","È","i","Í","Î","Ï","+","+","_","_","¦","Ì","_","Ó","ß","Ô","Ò","õ","Õ","µ","þ","Þ","Ú","Û","Ù","ý","Ý","¯","´","­","±","_","¾","¶","§","÷","¸","°","¨","·","¹","³","²","_"," "];for(t=0;t<e.length;t++)i+=(n=255&e.charCodeAt(t))>127?r[n-128]:String.fromCharCode(n);return i}function k(e){return decodeURIComponent(escape(e))}function E(e){var t,n="";for(t=0;t<e.length;t++)n+=String.fromCharCode(e[t]);return n}function L(e,t,n,a,o){e.version=t.view.getUint16(n,!0),e.bitFlag=t.view.getUint16(n+2,!0),e.compressionMethod=t.view.getUint16(n+4,!0),e.lastModDateRaw=t.view.getUint32(n+6,!0),e.lastModDate=function(e){var t=(4294901760&e)>>16,n=65535&e;try{return new Date(1980+((65024&t)>>9),((480&t)>>5)-1,31&t,(63488&n)>>11,(2016&n)>>5,2*(31&n),0)}catch(e){}}(e.lastModDateRaw),1!=(1&e.bitFlag)?((a||8!=(8&e.bitFlag))&&(e.crc32=t.view.getUint32(n+10,!0),e.compressedSize=t.view.getUint32(n+14,!0),e.uncompressedSize=t.view.getUint32(n+18,!0)),4294967295!==e.compressedSize&&4294967295!==e.uncompressedSize?(e.filenameLength=t.view.getUint16(n+22,!0),e.extraFieldLength=t.view.getUint16(n+24,!0)):o(r)):o(i)}function R(i,r,o){var u=0;function f(){}f.prototype.getData=function(r,a,f,l){var h=this;function d(e,t){l&&!function(e){var t=p(4);return t.view.setUint32(0,e),h.crc32==t.view.getUint32(0)}(t)?o(n):r.getData(function(e){a(e)})}function g(e){o(e||c)}function m(e){o(e||s)}i.readUint8Array(h.offset,30,function(n){var a,s=p(n.length,n);1347093252==s.view.getUint32(0)?(L(h,s,4,!1,o),a=h.offset+30+h.filenameLength+h.extraFieldLength,r.init(function(){0===h.compressionMethod?C(h._worker,u++,i,r,a,h.compressedSize,l,d,f,g,m):function(t,n,i,r,a,o,s,c,u,f,l){var h=s?"output":"none";e.zip.useWebWorkers?U(t,{sn:n,codecClass:"Inflater",crcType:h},i,r,a,o,u,c,f,l):A(new e.zip.Inflater,i,r,a,o,h,u,c,f,l)}(h._worker,u++,i,r,a,h.compressedSize,l,d,f,g,m)},m)):o(t)},g)};var l={getEntries:function(e){var n=this._worker;!function(e){var n=22;if(i.size<n)o(t);else{var r=n+65536;s(n,function(){s(Math.min(r,i.size),function(){o(t)})})}function s(t,r){i.readUint8Array(i.size-t,t,function(t){for(var i=t.length-n;i>=0;i--)if(80===t[i]&&75===t[i+1]&&5===t[i+2]&&6===t[i+3])return void e(new DataView(t.buffer,i,n));r()},function(){o(a)})}}(function(r){var s,c;s=r.getUint32(16,!0),c=r.getUint16(8,!0),s<0||s>=i.size?o(t):i.readUint8Array(s,i.size-s,function(i){var r,a,s,u,l=0,h=[],d=p(i.length,i);for(r=0;r<c;r++){if((a=new f)._worker=n,1347092738!=d.view.getUint32(l))return void o(t);L(a,d,l+6,!0,o),a.commentLength=d.view.getUint16(l+32,!0),a.directory=16==(16&d.view.getUint8(l+38)),a.offset=d.view.getUint32(l+42,!0),s=E(d.array.subarray(l+46,l+46+a.filenameLength)),a.filename=2048==(2048&a.bitFlag)?k(s):S(s),a.directory||"/"!=a.filename.charAt(a.filename.length-1)||(a.directory=!0),u=E(d.array.subarray(l+46+a.filenameLength+a.extraFieldLength,l+46+a.filenameLength+a.extraFieldLength+a.commentLength)),a.comment=2048==(2048&a.bitFlag)?k(u):S(u),h.push(a),l+=46+a.filenameLength+a.extraFieldLength+a.commentLength}e(h)},function(){o(a)})})},close:function(e){this._worker&&(this._worker.terminate(),this._worker=null),e&&e()},_worker:null};e.zip.useWebWorkers?W("inflater",function(e){l._worker=e,r(l)},function(e){o(e)}):r(l)}function x(e){return unescape(encodeURIComponent(e))}function D(e){var t,n=[];for(t=0;t<e.length;t++)n.push(e.charCodeAt(t));return n}function M(t,n,i,r){var a={},s=[],f=0,l=0;function h(e){i(e||o)}function d(e){i(e||c)}var g={add:function(n,o,c,g,m){var w,y,v,_=this._worker;function b(e,n){var i=p(16);f+=e||0,i.view.setUint32(0,1347094280),void 0!==n&&(w.view.setUint32(10,n,!0),i.view.setUint32(4,n,!0)),o&&(i.view.setUint32(8,e,!0),w.view.setUint32(14,e,!0),i.view.setUint32(12,o.size,!0),w.view.setUint32(18,o.size,!0)),t.writeUint8Array(i.array,function(){f+=16,c()},h)}function z(){m=m||{},n=n.trim(),m.directory&&"/"!=n.charAt(n.length-1)&&(n+="/"),a.hasOwnProperty(n)?i(u):(y=D(x(n)),s.push(n),function(e){var i;v=m.lastModDate||new Date,w=p(26),a[n]={headerArray:w.array,directory:m.directory,filename:y,offset:f,comment:D(x(m.comment||""))},w.view.setUint32(0,335546376),m.version&&w.view.setUint8(0,m.version),r||0===m.level||m.directory||w.view.setUint16(4,2048),w.view.setUint16(6,(v.getHours()<<6|v.getMinutes())<<5|v.getSeconds()/2,!0),w.view.setUint16(8,(v.getFullYear()-1980<<4|v.getMonth()+1)<<5|v.getDate(),!0),w.view.setUint16(22,y.length,!0),(i=p(30+y.length)).view.setUint32(0,1347093252),i.array.set(w.array,4),i.array.set(y,30),f+=i.array.length,t.writeUint8Array(i.array,e,h)}(function(){o?r||0===m.level?C(_,l++,o,t,0,o.size,!0,b,g,d,h):function(t,n,i,r,a,o,s,c,u){e.zip.useWebWorkers?U(t,{sn:n,options:{level:a},codecClass:"Deflater",crcType:"input"},i,r,0,i.size,s,o,c,u):A(new e.zip.Deflater,i,r,0,i.size,"input",s,o,c,u)}(_,l++,o,t,m.level,b,g,d,h):b()}))}o?o.init(z,d):z()},close:function(e){this._worker&&(this._worker.terminate(),this._worker=null);var n,i,r,o=0,c=0;for(i=0;i<s.length;i++)o+=46+(r=a[s[i]]).filename.length+r.comment.length;for(n=p(o+22),i=0;i<s.length;i++)r=a[s[i]],n.view.setUint32(c,1347092738),n.view.setUint16(c+4,5120),n.array.set(r.headerArray,c+6),n.view.setUint16(c+32,r.comment.length,!0),r.directory&&n.view.setUint8(c+38,16),n.view.setUint32(c+42,r.offset,!0),n.array.set(r.filename,c+46),n.array.set(r.comment,c+46+r.filename.length),c+=46+r.filename.length+r.comment.length;n.view.setUint32(c,1347093766),n.view.setUint16(c+8,s.length,!0),n.view.setUint16(c+10,s.length,!0),n.view.setUint32(c+12,o,!0),n.view.setUint32(c+16,f,!0),t.writeUint8Array(n.array,function(){t.getData(e)},h)},_worker:null};e.zip.useWebWorkers?W("deflater",function(e){g._worker=e,n(g)},function(e){i(e)}):n(g)}h.prototype.append=function(e){for(var t=0|this.crc,n=this.table,i=0,r=0|e.length;i<r;i++)t=t>>>8^n[255&(t^e[i])];this.crc=t},h.prototype.get=function(){return~this.crc},h.prototype.table=function(){var e,t,n,i=[];for(e=0;e<256;e++){for(n=e,t=0;t<8;t++)1&n?n=n>>>1^3988292384:n>>>=1;i[e]=n}return i}(),d.prototype.append=function(e,t){return e},d.prototype.flush=function(){},m.prototype=new g,m.prototype.constructor=m,w.prototype=new g,w.prototype.constructor=w,y.prototype=new g,y.prototype.constructor=y,v.prototype.getData=function(e){e(this.data)},_.prototype=new v,_.prototype.constructor=_,b.prototype=new v,b.prototype.constructor=b,z.prototype=new v,z.prototype.constructor=z;var T={deflater:["z-worker.js","deflate.js"],inflater:["z-worker.js","inflate.js"]};function W(t,n,i){if(null===e.zip.workerScripts||null===e.zip.workerScriptsPath){var r;if(e.zip.workerScripts){if(r=e.zip.workerScripts[t],!Array.isArray(r))return void i(new Error("zip.workerScripts."+t+" is not an array!"));r=function(e){var t=document.createElement("a");return e.map(function(e){return t.href=e,t.href})}(r)}else(r=T[t].slice(0))[0]=(e.zip.workerScriptsPath||"")+r[0];var a=new Worker(r[0]);a.codecTime=a.crcTime=0,a.postMessage({type:"importScripts",scripts:r.slice(1)}),a.addEventListener("message",function e(t){var r=t.data;if(r.error)return a.terminate(),void i(r.error);"importScripts"===r.type&&(a.removeEventListener("message",e),a.removeEventListener("error",o),n(a))}),a.addEventListener("error",o)}else i(new Error("Either zip.workerScripts or zip.workerScriptsPath may be set, not both."));function o(e){a.terminate(),i(e)}}function H(e){console.error(e)}e.zip={Reader:g,Writer:v,BlobReader:y,Data64URIReader:w,TextReader:m,BlobWriter:z,Data64URIWriter:b,TextWriter:_,createReader:function(e,t,n){n=n||H,e.init(function(){R(e,t,n)},n)},createWriter:function(e,t,n,i){n=n||H,i=!!i,e.init(function(){M(e,t,n,i)},n)},useWebWorkers:!0,workerScriptsPath:null,workerScripts:null};var F,I,B="HTTP Range not supported.",g=e.zip.Reader,v=e.zip.Writer;try{I=0===new Blob([new DataView(new ArrayBuffer(0))]).size}catch(e){}function j(e){var t=this;function n(n,i){var r;t.data?n():((r=new XMLHttpRequest).addEventListener("load",function(){t.size||(t.size=Number(r.getResponseHeader("Content-Length"))||Number(r.response.byteLength)),t.data=new Uint8Array(r.response),n()},!1),r.addEventListener("error",i,!1),r.open("GET",e),r.responseType="arraybuffer",r.send())}t.size=0,t.init=function(i,r){if(function(e){var t=document.createElement("a");return t.href=e,"http:"===t.protocol||"https:"===t.protocol}(e)){var a=new XMLHttpRequest;a.addEventListener("load",function(){t.size=Number(a.getResponseHeader("Content-Length")),t.size?i():n(i,r)},!1),a.addEventListener("error",r,!1),a.open("HEAD",e),a.send()}else n(i,r)},t.readUint8Array=function(e,i,r,a){n(function(){r(new Uint8Array(t.data.subarray(e,e+i)))},a)}}function P(e){var t=this;t.size=0,t.init=function(n,i){var r=new XMLHttpRequest;r.addEventListener("load",function(){t.size=Number(r.getResponseHeader("Content-Length")),"bytes"==r.getResponseHeader("Accept-Ranges")?n():i(B)},!1),r.addEventListener("error",i,!1),r.open("HEAD",e),r.send()},t.readUint8Array=function(t,n,i,r){!function(t,n,i,r){var a=new XMLHttpRequest;a.open("GET",e),a.responseType="arraybuffer",a.setRequestHeader("Range","bytes="+t+"-"+(t+n-1)),a.addEventListener("load",function(){i(a.response)},!1),a.addEventListener("error",r,!1),a.send()}(t,n,function(e){i(new Uint8Array(e))},r)}}function O(e){var t=this;t.size=0,t.init=function(n,i){t.size=e.byteLength,n()},t.readUint8Array=function(t,n,i,r){i(new Uint8Array(e.slice(t,t+n)))}}function X(){var e;this.init=function(t,n){e=new Uint8Array,t()},this.writeUint8Array=function(t,n,i){var r=new Uint8Array(e.length+t.length);r.set(e),r.set(t,e.length),e=r,n()},this.getData=function(t){t(e.buffer)}}function N(e,t){var n;this.init=function(t,i){e.createWriter(function(e){n=e,t()},i)},this.writeUint8Array=function(e,i,r){var a=new Blob([I?e:e.buffer],{type:t});n.onwrite=function(){n.onwrite=null,i()},n.onerror=r,n.write(a)},this.getData=function(t){e.file(t)}}j.prototype=new g,j.prototype.constructor=j,P.prototype=new g,P.prototype.constructor=P,O.prototype=new g,O.prototype.constructor=O,X.prototype=new v,X.prototype.constructor=X,N.prototype=new v,N.prototype.constructor=N,e.zip.FileWriter=N,e.zip.HttpReader=j,e.zip.HttpRangeReader=P,e.zip.ArrayBufferReader=O,e.zip.ArrayBufferWriter=X,e.zip.fs&&((F=e.zip.fs.ZipDirectoryEntry).prototype.addHttpContent=function(t,n,i){return function(t,n,i,r){if(t.directory)return r?new F(t.fs,n,i,t):new e.zip.fs.ZipFileEntry(t.fs,n,i,t);throw"Parent entry is not a directory."}(this,t,{data:n,Reader:i?P:j})},F.prototype.importHttpContent=function(e,t,n,i){this.importZip(t?new P(e):new j(e),n,i)},e.zip.fs.FS.prototype.importHttpContent=function(e,t,n,i){this.entries=[],this.root=new F(this),this.root.importHttpContent(e,t,n,i)})}(this)},function(e,t,n){"use strict";n.r(t);class i{constructor(e,t){this.image=e,this.metainfo=t}seamImageData(e,t){const n=new ImageData(e,t),i=this.binarySearch(e,this.metainfo.widthKeys),r=(this.binarySearch(t,this.metainfo.heightKeys),this.image.width-i);if(r>=0)for(let t=0;t<this.image.height;t++){let i=0;for(let a=0;a<this.image.width;a++)if(this.metainfo.seamMap[t][a]>=r){const r=4*(t*e+i),o=4*(t*this.image.width+a);n.data[r]=this.image.data[o],n.data[r+1]=this.image.data[o+1],n.data[r+2]=this.image.data[o+2],n.data[r+3]=this.image.data[o+3],i++}}else for(let t=0;t<this.image.height;t++){let i=0;for(let a=0;a<this.image.width;a++){if(this.metainfo.seamMap[t][a]<=-r){const r=4*(t*e+i),o=4*(t*this.image.width+a);n.data[r]=this.image.data[o],n.data[r+1]=this.image.data[o+1],n.data[r+2]=this.image.data[o+2],n.data[r+3]=this.image.data[o+3],i++}const o=4*(t*e+i),s=4*(t*this.image.width+a);n.data[o]=this.image.data[s],n.data[o+1]=this.image.data[s+1],n.data[o+2]=this.image.data[s+2],n.data[o+3]=this.image.data[s+3],i++}}return console.log(n),n}originX(e){return this.binarySearch(e,this.metainfo.originXKeys)}originY(e){return this.binarySearch(e,this.metainfo.originYKeys)}scaleX(e){return this.binarySearch(e,this.metainfo.scaleXKeys)}scaleY(e){return this.binarySearch(e,this.metainfo.scaleYKeys)}binarySearch(e,t){let n=-1,i=t.length;for(;i-n>1;){const r=Math.floor((n+i)/2);t[r][0]>=e?i=r:n=r}if(1===t.length)return t[0][1];if(i===t.length){const n=t[i-2][1],r=t[i-1][1],a=t[i-1][0]-t[i-2][0],o=e-t[i-1][0];return 0===a?r:r+(r-n)/a*o}if(t[i][0]===e)return t[i][1];if(0===i){const n=t[i+1][1],r=t[i][1],a=t[i][0]-t[i+1][0],o=e-t[i][0];return 0===a?r:r+(r-n)/a*o}{const n=t[i-1][1],r=t[i][1],a=t[i][0]-t[i-1][0],o=t[i][0]-e;return 0===a?n:n+(r-n)/a*o}}}var r=n(0);customElements.define("m-img",class extends HTMLElement{constructor(){super(),this._msiSrc=null,this._timer=0,this._resizer=null,this._metainfo=null,this._fileUrl=null;const e=this.attachShadow({mode:"open"}),t=document.createElement("div");t.setAttribute("class","wrapper"),this._canvas=document.createElement("canvas"),this._canvas.setAttribute("class","main_canvas"),this._mainCtx=this._canvas.getContext("2d"),this._imageCanvas=document.createElement("canvas"),this._imageCanvas.setAttribute("class","hidden_canvas"),this._imageCtx=this._imageCanvas.getContext("2d");const n=document.createElement("style");n.textContent="\n      .wrapper {\n        display: block;\n        width: 100%;\n        height: 100%;\n        padding: 0;\n        margin: 0;\n        overflow: hidden;\n      }\n      \n      .main_canvas {\n        display: block;\n        margin: 0;\n        padding: 0;\n      }\n      \n      .hidden_canvas {\n        display: none;\n      }\n    ",e.appendChild(n),e.appendChild(t),t.appendChild(this._canvas),t.appendChild(this._imageCanvas)}static get observedAttributes(){return["src"]}attributeChangedCallback(e,t,n){this._msiSrc=n,t!==n&&(console.log("attribute"),this._updateSrc())}connectedCallback(){console.log("connect"),this._updateSrc()}get src(){return this._msiSrc}set src(e){this.setAttribute("src",e)}_onresize(){console.log("resize"),this._timer>0&&clearTimeout(this._timer);const e=this;this._timer=setTimeout(function(){e._drawImage()},200)}_drawImage(){const e=this.clientWidth,t=this.clientHeight,n=this._resizer.seamImageData(e,t),i=this._resizer.originX(e),r=this._resizer.originY(t),a=this._resizer.scaleX(e),o=this._resizer.scaleY(t);this._canvas.width=e,this._canvas.height=t,this._imageCtx.clearRect(0,0,this._imageCanvas.width,this._imageCanvas.height),this._imageCtx.putImageData(n,0,0),this._mainCtx.clearRect(0,0,e,t),this._mainCtx.scale(a,o),this._mainCtx.drawImage(this._imageCanvas,i,r),this._mainCtx.scale(1/a,1/o)}_updateSrc(){if(!this._msiSrc)return this._mainCtx.clearRect(0,0,this._mainCtx.width,this._mainCtx.height),this._imageCtx.clearRect(0,0,this._imageCtx.width,this._imageCtx.height),this._msiSrc=null,this._timer=0,this._resizer=null,this._unzipTimer=0,this._metainfo=null,void(this._fileUrl=null);const e=this;r.zip.workerScripts={deflater:["./worker_pako.js"],inflater:["./worker_pako.js"]},r.zip.createReader(new r.zip.HttpReader(this._msiSrc),function(t){t.getEntries(function(t){for(const n of t)"metainfo.json"===n.filename?n.getData(new r.zip.TextWriter,function(t){e._metainfo=JSON.parse(t)}):n.getData(new r.zip.BlobWriter,function(t){e._fileUrl=URL.createObjectURL(t)});let n=setInterval(function(){e._metainfo&&e._fileUrl&&(e._image=new Image,e._image.src=e._fileUrl,e._image.onload=(()=>{const t=document.createElement("canvas"),n=t.getContext("2d");t.width=e._image.naturalWidth,t.height=e._image.naturalHeight,n.drawImage(e._image,0,0,e._image.naturalWidth,e._image.naturalHeight),e._resizer=new i(n.getImageData(0,0,e._image.naturalWidth,e._image.naturalHeight),e._metainfo),e._drawImage()}),console.log("clear?"),clearInterval(n))},100)})})}}),window.addEventListener("resize",function(){const e=document.getElementsByTagName("m-img");for(const t of e)t._onresize()})}]);