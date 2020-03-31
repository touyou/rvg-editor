!function(t){var e={};function n(r){if(e[r])return e[r].exports;var i=e[r]={i:r,l:!1,exports:{}};return t[r].call(i.exports,i,i.exports,n),i.l=!0,i.exports}n.m=t,n.c=e,n.d=function(t,e,r){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var i in t)n.d(r,i,function(e){return t[e]}.bind(null,i));return r},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=1)}([function(t,e){!function(t){"use strict";var e="File format is not recognized.",n="CRC failed.",r="File contains encrypted entry.",i="File is using Zip64 (4gb+ file size).",a="Error while reading zip file.",o="Error while writing zip file.",s="Error while writing file data.",c="Error while reading file data.",u="File already exists.",f=524288,l="text/plain";try{T=0===new Blob([new DataView(new ArrayBuffer(0))]).size}catch(t){}function h(){this.crc=-1}function p(){}function g(t,e){var n,r;return n=new ArrayBuffer(t),r=new Uint8Array(n),e&&r.set(e,0),{buffer:n,array:r,view:new DataView(n)}}function d(){}function y(t){var e,n=this;n.size=0,n.init=function(r,i){var a=new Blob([t],{type:l});(e=new m(a)).init(function(){n.size=e.size,r()},i)},n.readUint8Array=function(t,n,r,i){e.readUint8Array(t,n,r,i)}}function v(e){var n,r=this;r.size=0,r.init=function(t){for(var i=e.length;"="==e.charAt(i-1);)i--;n=e.indexOf(",")+1,r.size=Math.floor(.75*(i-n)),t()},r.readUint8Array=function(r,i,a){var o,s=g(i),c=4*Math.floor(r/3),u=4*Math.ceil((r+i)/3),f=t.atob(e.substring(c+n,u+n)),l=r-3*Math.floor(c/4);for(o=l;o<l+i;o++)s.array[o-l]=f.charCodeAt(o);a(s.array)}}function m(t){var e=this;e.size=0,e.init=function(n){e.size=t.size,n()},e.readUint8Array=function(e,n,r,i){var a=new FileReader;a.onload=function(t){r(new Uint8Array(t.target.result))},a.onerror=i;try{a.readAsArrayBuffer(function(t,e,n){if(e<0||n<0||e+n>t.size)throw new RangeError("offset:"+e+", length:"+n+", size:"+t.size);return t.slice?t.slice(e,e+n):t.webkitSlice?t.webkitSlice(e,e+n):t.mozSlice?t.mozSlice(e,e+n):t.msSlice?t.msSlice(e,e+n):void 0}(t,e,n))}catch(t){i(t)}}}function w(){}function _(t){var e;this.init=function(t){e=new Blob([],{type:l}),t()},this.writeUint8Array=function(t,n){e=new Blob([e,T?t:t.buffer],{type:l}),n()},this.getData=function(n,r){var i=new FileReader;i.onload=function(t){n(t.target.result)},i.onerror=r,i.readAsText(e,t)}}function b(e){var n="",r="";this.init=function(t){n+="data:"+(e||"")+";base64,",t()},this.writeUint8Array=function(e,i){var a,o=r.length,s=r;for(r="",a=0;a<3*Math.floor((o+e.length)/3)-o;a++)s+=String.fromCharCode(e[a]);for(;a<e.length;a++)r+=String.fromCharCode(e[a]);s.length>2?n+=t.btoa(s):r=s,i()},this.getData=function(e){e(n+t.btoa(r))}}function z(t){var e;this.init=function(n){e=new Blob([],{type:t}),n()},this.writeUint8Array=function(n,r){e=new Blob([e,T?n:n.buffer],{type:t}),r()},this.getData=function(t){t(e)}}function S(t,e,n,r,i,a,o,s,c,u){var l,h,p,g=0,d=e.sn;function y(){t.removeEventListener("message",v,!1),s(h,p)}function v(e){var n=e.data,i=n.data,s=n.error;if(s)return s.toString=function(){return"Error: "+this.message},void c(s);if(n.sn===d)switch("number"==typeof n.codecTime&&(t.codecTime+=n.codecTime),"number"==typeof n.crcTime&&(t.crcTime+=n.crcTime),n.type){case"append":i?(h+=i.length,r.writeUint8Array(i,function(){m()},u)):m();break;case"flush":p=n.crc,i?(h+=i.length,r.writeUint8Array(i,function(){y()},u)):y();break;case"progress":o&&o(l+n.loaded,a);break;case"importScripts":case"newTask":case"echo":break;default:console.warn("zip.js:launchWorkerProcess: unknown message: ",n)}}function m(){(l=g*f)<=a?n.readUint8Array(i+l,Math.min(f,a-l),function(n){o&&o(l,a);var r=0===l?e:{sn:d};r.type="append",r.data=n;try{t.postMessage(r,[n.buffer])}catch(e){t.postMessage(r)}g++},c):t.postMessage({sn:d,type:"flush"})}h=0,t.addEventListener("message",v,!1),m()}function A(t,e,n,r,i,a,o,s,c,u){var l,p=0,g=0,d="input"===a,y="output"===a,v=new h;!function a(){var h;if((l=p*f)<i)e.readUint8Array(r+l,Math.min(f,i-l),function(e){var r;try{r=t.append(e,function(t){o&&o(l+t,i)})}catch(t){return void c(t)}r?(g+=r.length,n.writeUint8Array(r,function(){p++,setTimeout(a,1)},u),y&&v.append(r)):(p++,setTimeout(a,1)),d&&v.append(e),o&&o(l,i)},c);else{try{h=t.flush()}catch(t){return void c(t)}h?(y&&v.append(h),g+=h.length,n.writeUint8Array(h,function(){s(g,v.get())},u)):s(g,v.get())}}()}function U(e,n,r,i,a,o,s,c,u,f,l){t.zip.useWebWorkers&&s?S(e,{sn:n,codecClass:"NOOP",crcType:"input"},r,i,a,o,u,c,f,l):A(new p,r,i,a,o,"input",u,c,f,l)}function k(t){var e,n,r="",i=["Ç","ü","é","â","ä","à","å","ç","ê","ë","è","ï","î","ì","Ä","Å","É","æ","Æ","ô","ö","ò","û","ù","ÿ","Ö","Ü","ø","£","Ø","×","ƒ","á","í","ó","ú","ñ","Ñ","ª","º","¿","®","¬","½","¼","¡","«","»","_","_","_","¦","¦","Á","Â","À","©","¦","¦","+","+","¢","¥","+","+","-","-","+","-","+","ã","Ã","+","+","-","-","¦","-","+","¤","ð","Ð","Ê","Ë","È","i","Í","Î","Ï","+","+","_","_","¦","Ì","_","Ó","ß","Ô","Ò","õ","Õ","µ","þ","Þ","Ú","Û","Ù","ý","Ý","¯","´","­","±","_","¾","¶","§","÷","¸","°","¨","·","¹","³","²","_"," "];for(e=0;e<t.length;e++)r+=(n=255&t.charCodeAt(e))>127?i[n-128]:String.fromCharCode(n);return r}function C(t){return decodeURIComponent(escape(t))}function M(t){var e,n="";for(e=0;e<t.length;e++)n+=String.fromCharCode(t[e]);return n}function E(t,e,n,a,o){t.version=e.view.getUint16(n,!0),t.bitFlag=e.view.getUint16(n+2,!0),t.compressionMethod=e.view.getUint16(n+4,!0),t.lastModDateRaw=e.view.getUint32(n+6,!0),t.lastModDate=function(t){var e=(4294901760&t)>>16,n=65535&t;try{return new Date(1980+((65024&e)>>9),((480&e)>>5)-1,31&e,(63488&n)>>11,(2016&n)>>5,2*(31&n),0)}catch(t){}}(t.lastModDateRaw),1!=(1&t.bitFlag)?((a||8!=(8&t.bitFlag))&&(t.crc32=e.view.getUint32(n+10,!0),t.compressedSize=e.view.getUint32(n+14,!0),t.uncompressedSize=e.view.getUint32(n+18,!0)),4294967295!==t.compressedSize&&4294967295!==t.uncompressedSize?(t.filenameLength=e.view.getUint16(n+22,!0),t.extraFieldLength=e.view.getUint16(n+24,!0)):o(i)):o(r)}function x(r,i,o){var u=0;function f(){}f.prototype.getData=function(i,a,f,l){var h=this;function p(t,e){l&&!function(t){var e=g(4);return e.view.setUint32(0,t),h.crc32==e.view.getUint32(0)}(e)?o(n):i.getData(function(t){a(t)})}function d(t){o(t||c)}function y(t){o(t||s)}r.readUint8Array(h.offset,30,function(n){var a,s=g(n.length,n);1347093252==s.view.getUint32(0)?(E(h,s,4,!1,o),a=h.offset+30+h.filenameLength+h.extraFieldLength,i.init(function(){0===h.compressionMethod?U(h._worker,u++,r,i,a,h.compressedSize,l,p,f,d,y):function(e,n,r,i,a,o,s,c,u,f,l){var h=s?"output":"none";t.zip.useWebWorkers?S(e,{sn:n,codecClass:"Inflater",crcType:h},r,i,a,o,u,c,f,l):A(new t.zip.Inflater,r,i,a,o,h,u,c,f,l)}(h._worker,u++,r,i,a,h.compressedSize,l,p,f,d,y)},y)):o(e)},d)};var l={getEntries:function(t){var n=this._worker;!function(t){var n=22;if(r.size<n)o(e);else{var i=n+65536;s(n,function(){s(Math.min(i,r.size),function(){o(e)})})}function s(e,i){r.readUint8Array(r.size-e,e,function(e){for(var r=e.length-n;r>=0;r--)if(80===e[r]&&75===e[r+1]&&5===e[r+2]&&6===e[r+3])return void t(new DataView(e.buffer,r,n));i()},function(){o(a)})}}(function(i){var s,c;s=i.getUint32(16,!0),c=i.getUint16(8,!0),s<0||s>=r.size?o(e):r.readUint8Array(s,r.size-s,function(r){var i,a,s,u,l=0,h=[],p=g(r.length,r);for(i=0;i<c;i++){if((a=new f)._worker=n,1347092738!=p.view.getUint32(l))return void o(e);E(a,p,l+6,!0,o),a.commentLength=p.view.getUint16(l+32,!0),a.directory=16==(16&p.view.getUint8(l+38)),a.offset=p.view.getUint32(l+42,!0),s=M(p.array.subarray(l+46,l+46+a.filenameLength)),a.filename=2048==(2048&a.bitFlag)?C(s):k(s),a.directory||"/"!=a.filename.charAt(a.filename.length-1)||(a.directory=!0),u=M(p.array.subarray(l+46+a.filenameLength+a.extraFieldLength,l+46+a.filenameLength+a.extraFieldLength+a.commentLength)),a.comment=2048==(2048&a.bitFlag)?C(u):k(u),h.push(a),l+=46+a.filenameLength+a.extraFieldLength+a.commentLength}t(h)},function(){o(a)})})},close:function(t){this._worker&&(this._worker.terminate(),this._worker=null),t&&t()},_worker:null};t.zip.useWebWorkers?D("inflater",function(t){l._worker=t,i(l)},function(t){o(t)}):i(l)}function R(t){return unescape(encodeURIComponent(t))}function W(t){var e,n=[];for(e=0;e<t.length;e++)n.push(t.charCodeAt(e));return n}function O(e,n,r,i){var a={},s=[],f=0,l=0;function h(t){r(t||o)}function p(t){r(t||c)}var d={add:function(n,o,c,d,y){var v,m,w,_=this._worker;function b(t,n){var r=g(16);f+=t||0,r.view.setUint32(0,1347094280),void 0!==n&&(v.view.setUint32(10,n,!0),r.view.setUint32(4,n,!0)),o&&(r.view.setUint32(8,t,!0),v.view.setUint32(14,t,!0),r.view.setUint32(12,o.size,!0),v.view.setUint32(18,o.size,!0)),e.writeUint8Array(r.array,function(){f+=16,c()},h)}function z(){y=y||{},n=n.trim(),y.directory&&"/"!=n.charAt(n.length-1)&&(n+="/"),a.hasOwnProperty(n)?r(u):(m=W(R(n)),s.push(n),function(t){var r;w=y.lastModDate||new Date,v=g(26),a[n]={headerArray:v.array,directory:y.directory,filename:m,offset:f,comment:W(R(y.comment||""))},v.view.setUint32(0,335546376),y.version&&v.view.setUint8(0,y.version),i||0===y.level||y.directory||v.view.setUint16(4,2048),v.view.setUint16(6,(w.getHours()<<6|w.getMinutes())<<5|w.getSeconds()/2,!0),v.view.setUint16(8,(w.getFullYear()-1980<<4|w.getMonth()+1)<<5|w.getDate(),!0),v.view.setUint16(22,m.length,!0),(r=g(30+m.length)).view.setUint32(0,1347093252),r.array.set(v.array,4),r.array.set(m,30),f+=r.array.length,e.writeUint8Array(r.array,t,h)}(function(){o?i||0===y.level?U(_,l++,o,e,0,o.size,!0,b,d,p,h):function(e,n,r,i,a,o,s,c,u){t.zip.useWebWorkers?S(e,{sn:n,options:{level:a},codecClass:"Deflater",crcType:"input"},r,i,0,r.size,s,o,c,u):A(new t.zip.Deflater,r,i,0,r.size,"input",s,o,c,u)}(_,l++,o,e,y.level,b,d,p,h):b()}))}o?o.init(z,p):z()},close:function(t){this._worker&&(this._worker.terminate(),this._worker=null);var n,r,i,o=0,c=0;for(r=0;r<s.length;r++)o+=46+(i=a[s[r]]).filename.length+i.comment.length;for(n=g(o+22),r=0;r<s.length;r++)i=a[s[r]],n.view.setUint32(c,1347092738),n.view.setUint16(c+4,5120),n.array.set(i.headerArray,c+6),n.view.setUint16(c+32,i.comment.length,!0),i.directory&&n.view.setUint8(c+38,16),n.view.setUint32(c+42,i.offset,!0),n.array.set(i.filename,c+46),n.array.set(i.comment,c+46+i.filename.length),c+=46+i.filename.length+i.comment.length;n.view.setUint32(c,1347093766),n.view.setUint16(c+8,s.length,!0),n.view.setUint16(c+10,s.length,!0),n.view.setUint32(c+12,o,!0),n.view.setUint32(c+16,f,!0),e.writeUint8Array(n.array,function(){e.getData(t)},h)},_worker:null};t.zip.useWebWorkers?D("deflater",function(t){d._worker=t,n(d)},function(t){r(t)}):n(d)}h.prototype.append=function(t){for(var e=0|this.crc,n=this.table,r=0,i=0|t.length;r<i;r++)e=e>>>8^n[255&(e^t[r])];this.crc=e},h.prototype.get=function(){return~this.crc},h.prototype.table=function(){var t,e,n,r=[];for(t=0;t<256;t++){for(n=t,e=0;e<8;e++)1&n?n=n>>>1^3988292384:n>>>=1;r[t]=n}return r}(),p.prototype.append=function(t,e){return t},p.prototype.flush=function(){},y.prototype=new d,y.prototype.constructor=y,v.prototype=new d,v.prototype.constructor=v,m.prototype=new d,m.prototype.constructor=m,w.prototype.getData=function(t){t(this.data)},_.prototype=new w,_.prototype.constructor=_,b.prototype=new w,b.prototype.constructor=b,z.prototype=new w,z.prototype.constructor=z;var H={deflater:["z-worker.js","deflate.js"],inflater:["z-worker.js","inflate.js"]};function D(e,n,r){if(null===t.zip.workerScripts||null===t.zip.workerScriptsPath){var i,a,o;if(t.zip.workerScripts){if(i=t.zip.workerScripts[e],!Array.isArray(i))return void r(new Error("zip.workerScripts."+e+" is not an array!"));a=i,o=document.createElement("a"),i=a.map(function(t){return o.href=t,o.href})}else(i=H[e].slice(0))[0]=(t.zip.workerScriptsPath||"")+i[0];var s=new Worker(i[0]);s.codecTime=s.crcTime=0,s.postMessage({type:"importScripts",scripts:i.slice(1)}),s.addEventListener("message",function t(e){var i=e.data;if(i.error)return s.terminate(),void r(i.error);"importScripts"===i.type&&(s.removeEventListener("message",t),s.removeEventListener("error",c),n(s))}),s.addEventListener("error",c)}else r(new Error("Either zip.workerScripts or zip.workerScriptsPath may be set, not both."));function c(t){s.terminate(),r(t)}}function L(t){console.error(t)}t.zip={Reader:d,Writer:w,BlobReader:m,Data64URIReader:v,TextReader:y,BlobWriter:z,Data64URIWriter:b,TextWriter:_,createReader:function(t,e,n){n=n||L,t.init(function(){x(t,e,n)},n)},createWriter:function(t,e,n,r){n=n||L,r=!!r,t.init(function(){O(t,e,n,r)},n)},useWebWorkers:!0,workerScriptsPath:null,workerScripts:null};var j,T,P="HTTP Range not supported.",d=t.zip.Reader,w=t.zip.Writer;try{T=0===new Blob([new DataView(new ArrayBuffer(0))]).size}catch(t){}function I(t){var e=this;function n(n,r){var i;e.data?n():((i=new XMLHttpRequest).addEventListener("load",function(){e.size||(e.size=Number(i.getResponseHeader("Content-Length"))||Number(i.response.byteLength)),e.data=new Uint8Array(i.response),n()},!1),i.addEventListener("error",r,!1),i.open("GET",t),i.responseType="arraybuffer",i.send())}e.size=0,e.init=function(r,i){if(function(t){var e=document.createElement("a");return e.href=t,"http:"===e.protocol||"https:"===e.protocol}(t)){var a=new XMLHttpRequest;a.addEventListener("load",function(){e.size=Number(a.getResponseHeader("Content-Length")),e.size?r():n(r,i)},!1),a.addEventListener("error",i,!1),a.open("HEAD",t),a.send()}else n(r,i)},e.readUint8Array=function(t,r,i,a){n(function(){i(new Uint8Array(e.data.subarray(t,t+r)))},a)}}function F(t){var e=this;e.size=0,e.init=function(n,r){var i=new XMLHttpRequest;i.addEventListener("load",function(){e.size=Number(i.getResponseHeader("Content-Length")),"bytes"==i.getResponseHeader("Accept-Ranges")?n():r(P)},!1),i.addEventListener("error",r,!1),i.open("HEAD",t),i.send()},e.readUint8Array=function(e,n,r,i){!function(e,n,r,i){var a=new XMLHttpRequest;a.open("GET",t),a.responseType="arraybuffer",a.setRequestHeader("Range","bytes="+e+"-"+(e+n-1)),a.addEventListener("load",function(){r(a.response)},!1),a.addEventListener("error",i,!1),a.send()}(e,n,function(t){r(new Uint8Array(t))},i)}}function X(t){var e=this;e.size=0,e.init=function(n,r){e.size=t.byteLength,n()},e.readUint8Array=function(e,n,r,i){r(new Uint8Array(t.slice(e,e+n)))}}function B(){var t;this.init=function(e,n){t=new Uint8Array,e()},this.writeUint8Array=function(e,n,r){var i=new Uint8Array(t.length+e.length);i.set(t),i.set(e,t.length),t=i,n()},this.getData=function(e){e(t.buffer)}}function K(t,e){var n;this.init=function(e,r){t.createWriter(function(t){n=t,e()},r)},this.writeUint8Array=function(t,r,i){var a=new Blob([T?t:t.buffer],{type:e});n.onwrite=function(){n.onwrite=null,r()},n.onerror=i,n.write(a)},this.getData=function(e){t.file(e)}}I.prototype=new d,I.prototype.constructor=I,F.prototype=new d,F.prototype.constructor=F,X.prototype=new d,X.prototype.constructor=X,B.prototype=new w,B.prototype.constructor=B,K.prototype=new w,K.prototype.constructor=K,t.zip.FileWriter=K,t.zip.HttpReader=I,t.zip.HttpRangeReader=F,t.zip.ArrayBufferReader=X,t.zip.ArrayBufferWriter=B,t.zip.fs&&((j=t.zip.fs.ZipDirectoryEntry).prototype.addHttpContent=function(e,n,r){return function(e,n,r,i){if(e.directory)return i?new j(e.fs,n,r,e):new t.zip.fs.ZipFileEntry(e.fs,n,r,e);throw"Parent entry is not a directory."}(this,e,{data:n,Reader:r?F:I})},j.prototype.importHttpContent=function(t,e,n,r){this.importZip(e?new F(t):new I(t),n,r)},t.zip.fs.FS.prototype.importHttpContent=function(t,e,n,r){this.entries=[],this.root=new j(this),this.root.importHttpContent(t,e,n,r)})}(this)},function(t,e,n){"use strict";function r(t){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function i(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function a(t,e){return!e||"object"!==r(e)&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function o(t){return(o=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function s(t,e){return(s=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function c(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}n.r(e);var u=function t(){c(this,t)},f=function(t){function e(t,n){var r;return c(this,e),(r=a(this,o(e).call(this))).image=t,r.metainfo=n,r.consistentHorizontalMap=n.horizontalSeamMap,r.consistentVerticalMap=n.verticalSeamMap,r}var n,r,f;return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&s(t,e)}(e,u),n=e,(r=[{key:"seamImageData",value:function(t,e){var n=Math.floor(this.binarySearch(t,this.metainfo.widthKeys)),r=Math.floor(this.binarySearch(e,this.metainfo.heightKeys)),i=this.image;console.log(n+", "+r),(n<=0||isNaN(n))&&(n=i.width),(r<=0||isNaN(r))&&(r=i.height);var a=[],o=new Uint8ClampedArray(n*i.height*4),s=new Uint8ClampedArray(n*r*4);if(i.width>=n)for(var c=i.width-n,u=0;u<i.height;u++){a[u]=[];for(var f=0,l=0;l<i.width;l++){a[u][f]=this.consistentHorizontalMap[u][l];var h=4*(u*n+f),p=4*(u*i.width+l);o[h]=i.data[p],o[h+1]=i.data[p+1],o[h+2]=i.data[p+2],o[h+3]=i.data[p+3],this.consistentVerticalMap[u][l]>c&&(f+=1)}}else for(var g=n-i.width,d=0;d<i.height;d++){a[d]=[];for(var y=0,v=0;v<i.width;v++){var m=4*(d*i.width+v);if(this.consistentVerticalMap[d][v]<=g){a[d][y]=this.consistentHorizontalMap[d][v];var w=4*(d*n+y);o[w]=i.data[m],o[w+1]=i.data[m+1],o[w+2]=i.data[m+2],o[w+3]=i.data[m+3],y+=1}a[d][y]=this.consistentHorizontalMap[d][v];var _=4*(d*n+y);o[_]=i.data[m],o[_+1]=i.data[m+1],o[_+2]=i.data[m+2],o[_+3]=i.data[m+3],y+=1}}if(i.height>=r)for(var b=i.height-r,z=0;z<n;z++)for(var S=0,A=0;A<i.height;A++){var U=4*(S*n+z),k=4*(A*n+z);s[U]=o[k],s[U+1]=o[k+1],s[U+2]=o[k+2],s[U+3]=o[k+3],a[A][z]>b&&(S+=1)}else for(var C=r-i.height,M=0;M<n;M++)for(var E=0,x=0;x<i.height;x++){var R=4*(x*n+M);if(a[x][M]<=C){var W=4*(E*n+M);s[W]=o[R],s[W+1]=o[R+1],s[W+2]=o[R+2],s[W+3]=o[R+3],E+=1}var O=4*(E*n+M);s[O]=o[R],s[O+1]=o[R+1],s[O+2]=o[R+2],s[O+3]=o[R+3],E+=1}return new ImageData(s,n,r)}},{key:"originX",value:function(t){return this.binarySearch(t,this.metainfo.originXKeys)}},{key:"originY",value:function(t){return this.binarySearch(t,this.metainfo.originYKeys)}},{key:"scaleX",value:function(t){return this.binarySearch(t,this.metainfo.scaleXKeys)}},{key:"scaleY",value:function(t){return this.binarySearch(t,this.metainfo.scaleYKeys)}},{key:"binarySearch",value:function(t,e){for(var n=-1,r=e.length;r-n>1;){var i=Math.floor((n+r)/2);e[i][0]>=t?r=i:n=i}if(1===e.length)return e[0][1];if(r===e.length){var a=e[r-2][1],o=e[r-1][1];return o+(o-a)/(e[r-1][0]-e[r-2][0])*(t-e[r-1][0])}if(e[r][0]===t)return e[r][1];if(0===r){var s=e[r+1][1],c=e[r][1];return c+(c-s)/(e[r][0]-e[r+1][0])*(t-e[r][0])}var u=e[r-1][1];return u+(e[r][1]-u)/(e[r][0]-e[r-1][0])*(t-e[r-1][0])}}])&&i(n.prototype,r),f&&i(n,f),e}();function l(t){return(l="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function h(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function p(t,e){return!e||"object"!==l(e)&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function g(t){return(g=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function d(t,e){return(d=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}var y=function(t){function e(t,n){var r;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,e),(r=p(this,g(e).call(this))).image=t,r.consistentHorizontalMap=n.horizontalSeamMap,r.consistentVerticalMap=n.verticalSeamMap,r.A=[],r.originXArr=[],r.originYArr=[],r.hScaleArr=[],r.vScaleArr=[],r.contentWidthArr=[],r.contentHeightArr=[];var i=!0,a=!1,o=void 0;try{for(var s,c=n.keys[Symbol.iterator]();!(i=(s=c.next()).done);i=!0){var u=s.value;r.A.push([u.width,u.height]),r.originXArr.push([u.originX]),r.originYArr.push([u.originY]),r.hScaleArr.push([u.hScale]),r.vScaleArr.push([u.vScale]),r.contentWidthArr.push([u.contentWidth]),r.contentHeightArr.push([u.contentHeight])}}catch(t){a=!0,o=t}finally{try{i||null==c.return||c.return()}finally{if(a)throw o}}return r.xWeight=n.weights.originX,r.yWeight=n.weights.originY,r.hScaleWeight=n.weights.hScale,r.vScaleWeight=n.weights.vScale,r.widthWeight=n.weights.contentWidth,r.heightWeight=n.weights.contentHeight,r}var n,r,i;return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&d(t,e)}(e,u),n=e,(r=[{key:"seamImageData",value:function(t,e){var n=[t,e],r=Math.floor(this.interpolate(n,this.A,this.widthWeight)),i=Math.floor(this.interpolate(n,this.A,this.heightWeight));if(1==this.A.length&&(r=this.contentWidthArr[0],i=this.contentHeightArr[0]),r<=0||i<=0)return console.log("failed interpolate: "+r+", "+i),this.image;r>1e4&&(r=1e4),i>1e4&&(i=1e4);var a=[],o=this.image,s=new Uint8ClampedArray(r*o.height*4),c=new Uint8ClampedArray(r*i*4);if(o.width>=r)for(var u=o.width-r,f=0;f<o.height;f++){a[f]=[];for(var l=0,h=0;h<o.width;h++){a[f][l]=this.consistentHorizontalMap[f][h];var p=4*(f*r+l),g=4*(f*o.width+h);s[p]=o.data[g],s[p+1]=o.data[g+1],s[p+2]=o.data[g+2],s[p+3]=o.data[g+3],this.consistentVerticalMap[f][h]>u&&(l+=1)}}else for(var d=r-o.width,y=0;y<o.height;y++){a[y]=[];for(var v=0,m=0;m<o.width;m++){var w=4*(y*o.width+m);if(this.consistentVerticalMap[y][m]<=d){a[y][v]=this.consistentHorizontalMap[y][m];var _=4*(y*r+v);s[_]=o.data[w],s[_+1]=o.data[w+1],s[_+2]=o.data[w+2],s[_+3]=o.data[w+3],v+=1}a[y][v]=this.consistentHorizontalMap[y][m];var b=4*(y*r+v);s[b]=o.data[w],s[b+1]=o.data[w+1],s[b+2]=o.data[w+2],s[b+3]=o.data[w+3],v+=1}}if(o.height>=i)for(var z=o.height-i,S=0;S<r;S++)for(var A=0,U=0;U<o.height;U++){var k=4*(A*r+S),C=4*(U*r+S);c[k]=s[C],c[k+1]=s[C+1],c[k+2]=s[C+2],c[k+3]=s[C+3],a[U][S]>z&&(A+=1)}else for(var M=i-o.height,E=0;E<r;E++)for(var x=0,R=0;R<o.height;R++){var W=4*(R*r+E);if(a[R][E]<=M){var O=4*(x*r+E);c[O]=s[W],c[O+1]=s[W+1],c[O+2]=s[W+2],c[O+3]=s[W+3],x+=1}var H=4*(x*r+E);c[H]=s[W],c[H+1]=s[W+1],c[H+2]=s[W+2],c[H+3]=s[W+3],x+=1}return new ImageData(c,r,i)}},{key:"originX",value:function(t,e){return 1==this.A.length?this.originXArr[0]:this.interpolate([t,e],this.A,this.xWeight)}},{key:"originY",value:function(t,e){return 1==this.A.length?this.originYArr[0]:this.interpolate([t,e],this.A,this.yWeight)}},{key:"hScale",value:function(t,e){return 1==this.A.length?this.hScaleArr[0]:this.interpolate([t,e],this.A,this.hScaleWeight)}},{key:"vScale",value:function(t,e){return 1==this.A.length?this.vScaleArr[0]:this.interpolate([t,e],this.A,this.vScaleWeight)}},{key:"phi",value:function(t,e){var n=t[0]-e[0],r=t[1]-e[1];return Math.sqrt(n*n+r*r)}},{key:"interpolate",value:function(t,e,n){for(var r=e.length,i=0,a=0;a<r;a++)i+=n[a]*this.phi(t,e[a]);return i}}])&&h(n.prototype,r),i&&h(n,i),e}(),v=n(0);function m(t){return(m="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function w(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function _(t,e){return!e||"object"!==m(e)&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function b(t){var e="function"==typeof Map?new Map:void 0;return(b=function(t){if(null===t||(n=t,-1===Function.toString.call(n).indexOf("[native code]")))return t;var n;if("function"!=typeof t)throw new TypeError("Super expression must either be null or a function");if(void 0!==e){if(e.has(t))return e.get(t);e.set(t,r)}function r(){return z(t,arguments,A(this).constructor)}return r.prototype=Object.create(t.prototype,{constructor:{value:r,enumerable:!1,writable:!0,configurable:!0}}),S(r,t)})(t)}function z(t,e,n){return(z=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(t){return!1}}()?Reflect.construct:function(t,e,n){var r=[null];r.push.apply(r,e);var i=new(Function.bind.apply(t,r));return n&&S(i,n.prototype),i}).apply(null,arguments)}function S(t,e){return(S=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function A(t){return(A=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var U=function(t){function e(){var t;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,e),(t=_(this,A(e).call(this)))._rvgSrc=null,t._timer=0,t._resizer=null,t._metainfo=null,t._fileUrl=null,t._linear=!0;t._scriptPath=function(){if(document.currentScript)return document.currentScript;var t=document.getElementsByTagName("script");return script=t[t.length-1],script.src?script.src:void 0}().src.split("/").slice(0,-1).join("/");var n=t.attachShadow({mode:"open"}),r=document.createElement("div");r.setAttribute("class","wrapper"),t._canvas=document.createElement("canvas"),t._canvas.setAttribute("class","main_canvas"),t._mainCtx=t._canvas.getContext("2d"),t._imageCanvas=document.createElement("canvas"),t._imageCanvas.setAttribute("class","hidden_canvas"),t._imageCtx=t._imageCanvas.getContext("2d");var i=document.createElement("style");return i.textContent="\n      .wrapper {\n        display: block;\n        width: 100%;\n        height: 100%;\n        padding: 0;\n        margin: 0;\n        overflow: hidden;\n      }\n\n      .main_canvas {\n        display: block;\n        margin: 0;\n        padding: 0;\n      }\n\n      .hidden_canvas {\n        display: none;\n      }\n    ",n.appendChild(i),n.appendChild(r),r.appendChild(t._canvas),r.appendChild(t._imageCanvas),t}var n,r,i;return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&S(t,e)}(e,b(HTMLElement)),n=e,i=[{key:"observedAttributes",get:function(){return["src"]}}],(r=[{key:"attributeChangedCallback",value:function(t,e,n){this._rvgSrc=n,e!==n&&this._updateSrc()}},{key:"connectedCallback",value:function(){this._updateSrc()}},{key:"_onresize",value:function(){this._timer>0&&clearTimeout(this._timer);var t=this;this._timer=setTimeout(function(){t._drawImage(t._linear)},200)}},{key:"_drawImage",value:function(t){if(t){var e=this.clientWidth,n=this.clientHeight,r=this._resizer.seamImageData(e,n),i=this._resizer.originX(e),a=this._resizer.originY(n),o=this._resizer.scaleX(e),s=this._resizer.scaleY(n);this._canvas.width=e,this._canvas.height=n,this._imageCanvas.width=r.width,this._imageCanvas.height=r.height,this._imageCtx.clearRect(0,0,this._imageCanvas.width,this._imageCanvas.height),this._imageCtx.putImageData(r,0,0),this._mainCtx.clearRect(0,0,e,n),this._mainCtx.scale(o,s),this._mainCtx.drawImage(this._imageCanvas,i,a),this._mainCtx.scale(1/o,1/s)}else{var c=this.clientWidth,u=this.clientHeight,f=this._resizer.seamImageData(c,u),l=this._resizer.originX(c,u),h=this._resizer.originY(c,u),p=this._resizer.hScale(c,u),g=this._resizer.vScale(c,u);this._canvas.width=c,this._canvas.height=u,this._imageCanvas.width=f.width,this._imageCanvas.height=f.height,this._imageCtx.clearRect(0,0,this._imageCanvas.width,this._imageCanvas.height),this._imageCtx.putImageData(f,0,0),this._mainCtx.clearRect(0,0,c,u),this._mainCtx.scale(p,g),this._mainCtx.drawImage(this._imageCanvas,l,h),this._mainCtx.scale(1/p,1/g)}}},{key:"_updateSrc",value:function(){if(!this._rvgSrc)return this._mainCtx.clearRect(0,0,this._mainCtx.width,this._mainCtx.height),this._imageCtx.clearRect(0,0,this._imageCtx.width,this._imageCtx.height),this._rvgSrc=null,this._timer=0,this._resizer=null,this._unzipTimer=0,this._metainfo=null,void(this._fileUrl=null);var t=this;v.zip.workerScripts={deflater:[this._scriptPath+"/worker_pako.js"],inflater:[this._scriptPath+"/worker_pako.js"]},v.zip.createReader(new v.zip.HttpReader(this._rvgSrc),function(e){e.getEntries(function(e){var n=!0,r=!1,i=void 0;try{for(var a,o=e[Symbol.iterator]();!(n=(a=o.next()).done);n=!0){var s=a.value;"metainfo.json"===s.filename?s.getData(new v.zip.TextWriter,function(e){t._metainfo=JSON.parse(e)}):"image.png"===s.filename&&s.getData(new v.zip.BlobWriter,function(e){t._fileUrl=URL.createObjectURL(e)})}}catch(t){r=!0,i=t}finally{try{n||null==o.return||o.return()}finally{if(r)throw i}}var c=setInterval(function(){t._metainfo&&t._fileUrl&&(t._image=new Image,t._image.src=t._fileUrl,t._linear=t._metainfo.linear,t._linear?t._image.onload=function(){var e=document.createElement("canvas"),n=e.getContext("2d");e.width=t._image.naturalWidth,e.height=t._image.naturalHeight,n.drawImage(t._image,0,0,t._image.naturalWidth,t._image.naturalHeight),t._resizer=new f(n.getImageData(0,0,t._image.naturalWidth,t._image.naturalHeight),{originXKeys:t._metainfo.keys.originXKeys,originYKeys:t._metainfo.keys.originYKeys,widthKeys:t._metainfo.keys.widthKeys,heightKeys:t._metainfo.keys.heightKeys,scaleXKeys:t._metainfo.keys.scaleXKeys,scaleYKeys:t._metainfo.keys.scaleYKeys,verticalSeamMap:t._metainfo.verticalSeamMap,horizontalSeamMap:t._metainfo.horizontalSeamMap}),t._drawImage(t._linear)}:t._image.onload=function(){var e=document.createElement("canvas"),n=e.getContext("2d");e.width=t._image.naturalWidth,e.height=t._image.naturalHeight,n.drawImage(t._image,0,0,t._image.naturalWidth,t._image.naturalHeight),t._resizer=new y(n.getImageData(0,0,t._image.naturalWidth,t._image.naturalHeight),t._metainfo),t._drawImage(t._linear)},clearInterval(c))},100)})})}},{key:"src",get:function(){return this._rvgSrc},set:function(t){this.setAttribute("src",t)}}])&&w(n.prototype,r),i&&w(n,i),e}();customElements.define("r-img",U),window.addEventListener("resize",function(){var t=document.getElementsByTagName("r-img"),e=!0,n=!1,r=void 0;try{for(var i,a=t[Symbol.iterator]();!(e=(i=a.next()).done);e=!0){i.value._onresize()}}catch(t){n=!0,r=t}finally{try{e||null==a.return||a.return()}finally{if(n)throw r}}})}]);