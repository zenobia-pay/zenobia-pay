(function(){"use strict";const It={equals:(n,s)=>n===s};let Qt=Jt;const bt=1,Pt=2,Gt={owned:null,cleanups:null,context:null,owner:null};var K=null;let Ut=null,re=null,J=null,rt=null,gt=null,Bt=0;function se(n,s){const d=J,w=K,m=n.length===0,y=s===void 0?w:s,S=m?Gt:{owned:null,cleanups:null,context:y?y.context:null,owner:y},x=m?n:()=>n(()=>yt(()=>Mt(S)));K=S,J=null;try{return zt(x,!0)}finally{J=d,K=w}}function At(n,s){s=s?Object.assign({},It,s):It;const d={value:n,observers:null,observerSlots:null,comparator:s.equals||void 0},w=m=>(typeof m=="function"&&(m=m(d.value)),Vt(d,m));return[Zt.bind(d),w]}function $t(n,s,d){const w=Wt(n,s,!1,bt);kt(w)}function Yt(n,s,d){Qt=ce;const w=Wt(n,s,!1,bt);w.user=!0,gt?gt.push(w):kt(w)}function Ht(n,s,d){d=d?Object.assign({},It,d):It;const w=Wt(n,s,!0,0);return w.observers=null,w.observerSlots=null,w.comparator=d.equals||void 0,kt(w),Zt.bind(w)}function yt(n){if(J===null)return n();const s=J;J=null;try{return n()}finally{J=s}}function ae(n){return K===null||(K.cleanups===null?K.cleanups=[n]:K.cleanups.push(n)),n}function Zt(){if(this.sources&&this.state)if(this.state===bt)kt(this);else{const n=rt;rt=null,zt(()=>jt(this),!1),rt=n}if(J){const n=this.observers?this.observers.length:0;J.sources?(J.sources.push(this),J.sourceSlots.push(n)):(J.sources=[this],J.sourceSlots=[n]),this.observers?(this.observers.push(J),this.observerSlots.push(J.sources.length-1)):(this.observers=[J],this.observerSlots=[J.sources.length-1])}return this.value}function Vt(n,s,d){let w=n.value;return(!n.comparator||!n.comparator(w,s))&&(n.value=s,n.observers&&n.observers.length&&zt(()=>{for(let m=0;m<n.observers.length;m+=1){const y=n.observers[m],S=Ut&&Ut.running;S&&Ut.disposed.has(y),(S?!y.tState:!y.state)&&(y.pure?rt.push(y):gt.push(y),y.observers&&Kt(y)),S||(y.state=bt)}if(rt.length>1e6)throw rt=[],new Error},!1)),s}function kt(n){if(!n.fn)return;Mt(n);const s=Bt;le(n,n.value,s)}function le(n,s,d){let w;const m=K,y=J;J=K=n;try{w=n.fn(s)}catch(S){return n.pure&&(n.state=bt,n.owned&&n.owned.forEach(Mt),n.owned=null),n.updatedAt=d+1,te(S)}finally{J=y,K=m}(!n.updatedAt||n.updatedAt<=d)&&(n.updatedAt!=null&&"observers"in n?Vt(n,w):n.value=w,n.updatedAt=d)}function Wt(n,s,d,w=bt,m){const y={fn:n,state:w,updatedAt:null,owned:null,sources:null,sourceSlots:null,cleanups:null,value:s,owner:K,context:K?K.context:null,pure:d};return K===null||K!==Gt&&(K.owned?K.owned.push(y):K.owned=[y]),y}function Lt(n){if(n.state===0)return;if(n.state===Pt)return jt(n);if(n.suspense&&yt(n.suspense.inFallback))return n.suspense.effects.push(n);const s=[n];for(;(n=n.owner)&&(!n.updatedAt||n.updatedAt<Bt);)n.state&&s.push(n);for(let d=s.length-1;d>=0;d--)if(n=s[d],n.state===bt)kt(n);else if(n.state===Pt){const w=rt;rt=null,zt(()=>jt(n,s[0]),!1),rt=w}}function zt(n,s){if(rt)return n();let d=!1;s||(rt=[]),gt?d=!0:gt=[],Bt++;try{const w=n();return de(d),w}catch(w){d||(gt=null),rt=null,te(w)}}function de(n){if(rt&&(Jt(rt),rt=null),n)return;const s=gt;gt=null,s.length&&zt(()=>Qt(s),!1)}function Jt(n){for(let s=0;s<n.length;s++)Lt(n[s])}function ce(n){let s,d=0;for(s=0;s<n.length;s++){const w=n[s];w.user?n[d++]=w:Lt(w)}for(s=0;s<d;s++)Lt(n[s])}function jt(n,s){n.state=0;for(let d=0;d<n.sources.length;d+=1){const w=n.sources[d];if(w.sources){const m=w.state;m===bt?w!==s&&(!w.updatedAt||w.updatedAt<Bt)&&Lt(w):m===Pt&&jt(w,s)}}}function Kt(n){for(let s=0;s<n.observers.length;s+=1){const d=n.observers[s];d.state||(d.state=Pt,d.pure?rt.push(d):gt.push(d),d.observers&&Kt(d))}}function Mt(n){let s;if(n.sources)for(;n.sources.length;){const d=n.sources.pop(),w=n.sourceSlots.pop(),m=d.observers;if(m&&m.length){const y=m.pop(),S=d.observerSlots.pop();w<m.length&&(y.sourceSlots[S]=w,m[w]=y,d.observerSlots[w]=S)}}if(n.tOwned){for(s=n.tOwned.length-1;s>=0;s--)Mt(n.tOwned[s]);delete n.tOwned}if(n.owned){for(s=n.owned.length-1;s>=0;s--)Mt(n.owned[s]);n.owned=null}if(n.cleanups){for(s=n.cleanups.length-1;s>=0;s--)n.cleanups[s]();n.cleanups=null}n.state=0}function ue(n){return n instanceof Error?n:new Error(typeof n=="string"?n:"Unknown error",{cause:n})}function te(n,s=K){throw ue(n)}function Ot(n,s){return yt(()=>n(s||{}))}const he=n=>`Stale read from <${n}>.`;function Nt(n){const s=n.keyed,d=Ht(()=>n.when,void 0,void 0),w=s?d:Ht(d,void 0,{equals:(m,y)=>!m==!y});return Ht(()=>{const m=w();if(m){const y=n.children;return typeof y=="function"&&y.length>0?yt(()=>y(s?m:()=>{if(!yt(w))throw he("Show");return d()})):y}return n.fallback},void 0,void 0)}function fe(n,s,d){let w=d.length,m=s.length,y=w,S=0,x=0,E=s[m-1].nextSibling,G=null;for(;S<m||x<y;){if(s[S]===d[x]){S++,x++;continue}for(;s[m-1]===d[y-1];)m--,y--;if(m===S){const X=y<w?x?d[x-1].nextSibling:d[y-x]:E;for(;x<y;)n.insertBefore(d[x++],X)}else if(y===x)for(;S<m;)(!G||!G.has(s[S]))&&s[S].remove(),S++;else if(s[S]===d[y-1]&&d[x]===s[m-1]){const X=s[--m].nextSibling;n.insertBefore(d[x++],s[S++].nextSibling),n.insertBefore(d[--y],X),s[m]=d[y]}else{if(!G){G=new Map;let Q=x;for(;Q<y;)G.set(d[Q],Q++)}const X=G.get(s[S]);if(X!=null)if(x<X&&X<y){let Q=S,lt=1,et;for(;++Q<m&&Q<y&&!((et=G.get(s[Q]))==null||et!==X+lt);)lt++;if(lt>X-x){const nt=s[S];for(;x<X;)n.insertBefore(d[x++],nt)}else n.replaceChild(d[x++],s[S++])}else S++;else s[S++].remove()}}}const ee="_$DX_DELEGATE";function ge(n,s,d,w={}){let m;return se(y=>{m=y,s===document?n():mt(s,n(),s.firstChild?null:void 0,d)},w.owner),()=>{m(),s.textContent=""}}function qt(n,s,d,w){let m;const y=()=>{const x=document.createElement("template");return x.innerHTML=n,x.content.firstChild},S=()=>(m||(m=y())).cloneNode(!0);return S.cloneNode=S,S}function ne(n,s=window.document){const d=s[ee]||(s[ee]=new Set);for(let w=0,m=n.length;w<m;w++){const y=n[w];d.has(y)||(d.add(y),s.addEventListener(y,be))}}function pe(n,s,d,w){Array.isArray(d)?(n[`$$${s}`]=d[0],n[`$$${s}Data`]=d[1]):n[`$$${s}`]=d}function we(n,s,d){return yt(()=>n(s,d))}function mt(n,s,d,w){if(d!==void 0&&!w&&(w=[]),typeof s!="function")return Tt(n,s,w,d);$t(m=>Tt(n,s(),m,d),w)}function be(n){let s=n.target;const d=`$$${n.type}`,w=n.target,m=n.currentTarget,y=E=>Object.defineProperty(n,"target",{configurable:!0,value:E}),S=()=>{const E=s[d];if(E&&!s.disabled){const G=s[`${d}Data`];if(G!==void 0?E.call(s,G,n):E.call(s,n),n.cancelBubble)return}return s.host&&typeof s.host!="string"&&!s.host._$host&&s.contains(n.target)&&y(s.host),!0},x=()=>{for(;S()&&(s=s._$host||s.parentNode||s.host););};if(Object.defineProperty(n,"currentTarget",{configurable:!0,get(){return s||document}}),n.composedPath){const E=n.composedPath();y(E[0]);for(let G=0;G<E.length-2&&(s=E[G],!!S());G++){if(s._$host){s=s._$host,x();break}if(s.parentNode===m)break}}else x();y(w)}function Tt(n,s,d,w,m){for(;typeof d=="function";)d=d();if(s===d)return d;const y=typeof s,S=w!==void 0;if(n=S&&d[0]&&d[0].parentNode||n,y==="string"||y==="number"){if(y==="number"&&(s=s.toString(),s===d))return d;if(S){let x=d[0];x&&x.nodeType===3?x.data!==s&&(x.data=s):x=document.createTextNode(s),d=xt(n,d,w,x)}else d!==""&&typeof d=="string"?d=n.firstChild.data=s:d=n.textContent=s}else if(s==null||y==="boolean")d=xt(n,d,w);else{if(y==="function")return $t(()=>{let x=s();for(;typeof x=="function";)x=x();d=Tt(n,x,d,w)}),()=>d;if(Array.isArray(s)){const x=[],E=d&&Array.isArray(d);if(Xt(x,s,d,m))return $t(()=>d=Tt(n,x,d,w,!0)),()=>d;if(x.length===0){if(d=xt(n,d,w),S)return d}else E?d.length===0?ie(n,x,w):fe(n,d,x):(d&&xt(n),ie(n,x));d=x}else if(s.nodeType){if(Array.isArray(d)){if(S)return d=xt(n,d,w,s);xt(n,d,null,s)}else d==null||d===""||!n.firstChild?n.appendChild(s):n.replaceChild(s,n.firstChild);d=s}}return d}function Xt(n,s,d,w){let m=!1;for(let y=0,S=s.length;y<S;y++){let x=s[y],E=d&&d[n.length],G;if(!(x==null||x===!0||x===!1))if((G=typeof x)=="object"&&x.nodeType)n.push(x);else if(Array.isArray(x))m=Xt(n,x,E)||m;else if(G==="function")if(w){for(;typeof x=="function";)x=x();m=Xt(n,Array.isArray(x)?x:[x],Array.isArray(E)?E:[E])||m}else n.push(x),m=!0;else{const X=String(x);E&&E.nodeType===3&&E.data===X?n.push(E):n.push(document.createTextNode(X))}}return m}function ie(n,s,d=null){for(let w=0,m=s.length;w<m;w++)n.insertBefore(s[w],d)}function xt(n,s,d,w){if(d===void 0)return n.textContent="";const m=w||document.createTextNode("");if(s.length){let y=!1;for(let S=s.length-1;S>=0;S--){const x=s[S];if(m!==x){const E=x.parentNode===n;!y&&!S?E?n.replaceChild(m,x):n.insertBefore(m,d):E&&x.remove()}else y=!0}}else n.insertBefore(m,d);return[m]}class me{constructor(){this.socket=null,this.reconnectTimeout=null,this.reconnectAttempts=0,this.maxReconnectAttempts=5,this.transferId=null,this.signature=null,this.wsBaseUrl="transfer-status.zenobiapay.com",this.onStatusCallback=null,this.onErrorCallback=null,this.onConnectionCallback=null}getSignature(){return this.signature}getTransferId(){return this.transferId}async createTransfer(s,d){try{const w=await fetch(s,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(d)});if(!w.ok){const y=await w.json();throw new Error(y.message||"Failed to create transfer request")}const m=await w.json();return this.transferId=m.transferRequestId,this.signature=m.signature,m}catch(w){throw console.error("Error creating transfer request:",w),w instanceof Error?w:new Error("Failed to create transfer request")}}listenToTransfer(s,d,w,m,y){this.transferId=s,this.signature=d,w&&(this.onStatusCallback=w),m&&(this.onErrorCallback=m),y&&(this.onConnectionCallback=y),this.connectWebSocket()}async createTransferAndListen(s,d,w,m,y){const S=await this.createTransfer(s,d);return this.listenToTransfer(S.transferRequestId,S.signature,w,m,y),S}connectWebSocket(){if(this.socket&&(this.socket.close(),this.socket=null,this.notifyConnectionStatus(!1)),!this.transferId||!this.signature){console.error("Cannot connect to WebSocket: Missing transfer ID or signature");return}try{const d=`${window.location.protocol==="https:"?"wss:":"ws:"}//${this.wsBaseUrl}/transfers/${this.transferId}/ws?token=${this.signature}`,w=new WebSocket(d);this.socket=w,w.onopen=()=>{this.notifyConnectionStatus(!0),this.reconnectAttempts=0},w.onclose=m=>{this.notifyConnectionStatus(!1),this.socket=null,m.code!==1e3&&this.reconnectAttempts<this.maxReconnectAttempts&&this.attemptReconnect()},w.onerror=m=>{console.error(`WebSocket error for transfer: ${this.transferId}`,m),this.notifyError("WebSocket error occurred")},w.onmessage=m=>{console.log(`WebSocket message received for transfer: ${this.transferId}`,m.data);try{const y=JSON.parse(m.data);y.type==="status"&&y.transfer?this.notifyStatus(y.transfer):y.type==="error"&&y.message?this.notifyError(y.message):y.type==="ping"&&w.readyState===WebSocket.OPEN&&w.send(JSON.stringify({type:"pong"}))}catch{this.notifyError("Failed to parse message")}}}catch{this.notifyError("Failed to establish WebSocket connection")}}attemptReconnect(){this.reconnectAttempts++;const s=Math.min(1e3*Math.pow(2,this.reconnectAttempts-1),3e4);console.log(`Attempting to reconnect in ${s}ms (attempt ${this.reconnectAttempts})`),this.reconnectTimeout&&window.clearTimeout(this.reconnectTimeout),this.reconnectTimeout=window.setTimeout(()=>{console.log(`Reconnecting to WebSocket (attempt ${this.reconnectAttempts})...`),this.connectWebSocket()},s)}disconnect(){this.reconnectTimeout&&(window.clearTimeout(this.reconnectTimeout),this.reconnectTimeout=null),this.socket&&this.socket.readyState<2&&(console.log(`Closing WebSocket for transfer: ${this.transferId}`),this.socket.close(),this.socket=null,this.notifyConnectionStatus(!1)),this.transferId=null,this.signature=null}notifyConnectionStatus(s){this.onConnectionCallback&&this.onConnectionCallback(s)}notifyStatus(s){this.onStatusCallback&&this.onStatusCallback(s)}notifyError(s){this.onErrorCallback&&this.onErrorCallback(s)}}function ve(n){return n&&n.__esModule&&Object.prototype.hasOwnProperty.call(n,"default")?n.default:n}var Rt={exports:{}},ye=Rt.exports,oe;function xe(){return oe||(oe=1,function(n,s){(function(d,w){n.exports=w()})(ye,()=>(()=>{var d={873:(S,x)=>{var E,G,X=function(){var Q=function(p,g){var u=p,e=L[g],t=null,o=0,r=null,i=[],c={},_=function(a,h){t=function(l){for(var f=new Array(l),b=0;b<l;b+=1){f[b]=new Array(l);for(var z=0;z<l;z+=1)f[b][z]=null}return f}(o=4*u+17),v(0,0),v(o-7,0),v(0,o-7),C(),$(),A(a,h),u>=7&&k(a),r==null&&(r=B(u,e,i)),M(r,h)},v=function(a,h){for(var l=-1;l<=7;l+=1)if(!(a+l<=-1||o<=a+l))for(var f=-1;f<=7;f+=1)h+f<=-1||o<=h+f||(t[a+l][h+f]=0<=l&&l<=6&&(f==0||f==6)||0<=f&&f<=6&&(l==0||l==6)||2<=l&&l<=4&&2<=f&&f<=4)},$=function(){for(var a=8;a<o-8;a+=1)t[a][6]==null&&(t[a][6]=a%2==0);for(var h=8;h<o-8;h+=1)t[6][h]==null&&(t[6][h]=h%2==0)},C=function(){for(var a=U.getPatternPosition(u),h=0;h<a.length;h+=1)for(var l=0;l<a.length;l+=1){var f=a[h],b=a[l];if(t[f][b]==null)for(var z=-2;z<=2;z+=1)for(var D=-2;D<=2;D+=1)t[f+z][b+D]=z==-2||z==2||D==-2||D==2||z==0&&D==0}},k=function(a){for(var h=U.getBCHTypeNumber(u),l=0;l<18;l+=1){var f=!a&&(h>>l&1)==1;t[Math.floor(l/3)][l%3+o-8-3]=f}for(l=0;l<18;l+=1)f=!a&&(h>>l&1)==1,t[l%3+o-8-3][Math.floor(l/3)]=f},A=function(a,h){for(var l=e<<3|h,f=U.getBCHTypeInfo(l),b=0;b<15;b+=1){var z=!a&&(f>>b&1)==1;b<6?t[b][8]=z:b<8?t[b+1][8]=z:t[o-15+b][8]=z}for(b=0;b<15;b+=1)z=!a&&(f>>b&1)==1,b<8?t[8][o-b-1]=z:b<9?t[8][15-b-1+1]=z:t[8][15-b-1]=z;t[o-8][8]=!a},M=function(a,h){for(var l=-1,f=o-1,b=7,z=0,D=U.getMaskFunction(h),P=o-1;P>0;P-=2)for(P==6&&(P-=1);;){for(var j=0;j<2;j+=1)if(t[f][P-j]==null){var N=!1;z<a.length&&(N=(a[z]>>>b&1)==1),D(f,P-j)&&(N=!N),t[f][P-j]=N,(b-=1)==-1&&(z+=1,b=7)}if((f+=l)<0||o<=f){f-=l,l=-l;break}}},B=function(a,h,l){for(var f=ut.getRSBlocks(a,h),b=ht(),z=0;z<l.length;z+=1){var D=l[z];b.put(D.getMode(),4),b.put(D.getLength(),U.getLengthInBits(D.getMode(),a)),D.write(b)}var P=0;for(z=0;z<f.length;z+=1)P+=f[z].dataCount;if(b.getLengthInBits()>8*P)throw"code length overflow. ("+b.getLengthInBits()+">"+8*P+")";for(b.getLengthInBits()+4<=8*P&&b.put(0,4);b.getLengthInBits()%8!=0;)b.putBit(!1);for(;!(b.getLengthInBits()>=8*P||(b.put(236,8),b.getLengthInBits()>=8*P));)b.put(17,8);return function(j,N){for(var H=0,ot=0,V=0,W=new Array(N.length),T=new Array(N.length),O=0;O<N.length;O+=1){var Z=N[O].dataCount,tt=N[O].totalCount-Z;ot=Math.max(ot,Z),V=Math.max(V,tt),W[O]=new Array(Z);for(var I=0;I<W[O].length;I+=1)W[O][I]=255&j.getBuffer()[I+H];H+=Z;var dt=U.getErrorCorrectPolynomial(tt),at=it(W[O],dt.getLength()-1).mod(dt);for(T[O]=new Array(dt.getLength()-1),I=0;I<T[O].length;I+=1){var st=I+at.getLength()-T[O].length;T[O][I]=st>=0?at.getAt(st):0}}var Ft=0;for(I=0;I<N.length;I+=1)Ft+=N[I].totalCount;var Dt=new Array(Ft),ft=0;for(I=0;I<ot;I+=1)for(O=0;O<N.length;O+=1)I<W[O].length&&(Dt[ft]=W[O][I],ft+=1);for(I=0;I<V;I+=1)for(O=0;O<N.length;O+=1)I<T[O].length&&(Dt[ft]=T[O][I],ft+=1);return Dt}(b,f)};c.addData=function(a,h){var l=null;switch(h=h||"Byte"){case"Numeric":l=vt(a);break;case"Alphanumeric":l=pt(a);break;case"Byte":l=wt(a);break;case"Kanji":l=St(a);break;default:throw"mode:"+h}i.push(l),r=null},c.isDark=function(a,h){if(a<0||o<=a||h<0||o<=h)throw a+","+h;return t[a][h]},c.getModuleCount=function(){return o},c.make=function(){if(u<1){for(var a=1;a<40;a++){for(var h=ut.getRSBlocks(a,e),l=ht(),f=0;f<i.length;f++){var b=i[f];l.put(b.getMode(),4),l.put(b.getLength(),U.getLengthInBits(b.getMode(),a)),b.write(l)}var z=0;for(f=0;f<h.length;f++)z+=h[f].dataCount;if(l.getLengthInBits()<=8*z)break}u=a}_(!1,function(){for(var D=0,P=0,j=0;j<8;j+=1){_(!0,j);var N=U.getLostPoint(c);(j==0||D>N)&&(D=N,P=j)}return P}())},c.createTableTag=function(a,h){a=a||2;var l="";l+='<table style="',l+=" border-width: 0px; border-style: none;",l+=" border-collapse: collapse;",l+=" padding: 0px; margin: "+(h=h===void 0?4*a:h)+"px;",l+='">',l+="<tbody>";for(var f=0;f<c.getModuleCount();f+=1){l+="<tr>";for(var b=0;b<c.getModuleCount();b+=1)l+='<td style="',l+=" border-width: 0px; border-style: none;",l+=" border-collapse: collapse;",l+=" padding: 0px; margin: 0px;",l+=" width: "+a+"px;",l+=" height: "+a+"px;",l+=" background-color: ",l+=c.isDark(f,b)?"#000000":"#ffffff",l+=";",l+='"/>';l+="</tr>"}return(l+="</tbody>")+"</table>"},c.createSvgTag=function(a,h,l,f){var b={};typeof arguments[0]=="object"&&(a=(b=arguments[0]).cellSize,h=b.margin,l=b.alt,f=b.title),a=a||2,h=h===void 0?4*a:h,(l=typeof l=="string"?{text:l}:l||{}).text=l.text||null,l.id=l.text?l.id||"qrcode-description":null,(f=typeof f=="string"?{text:f}:f||{}).text=f.text||null,f.id=f.text?f.id||"qrcode-title":null;var z,D,P,j,N=c.getModuleCount()*a+2*h,H="";for(j="l"+a+",0 0,"+a+" -"+a+",0 0,-"+a+"z ",H+='<svg version="1.1" xmlns="http://www.w3.org/2000/svg"',H+=b.scalable?"":' width="'+N+'px" height="'+N+'px"',H+=' viewBox="0 0 '+N+" "+N+'" ',H+=' preserveAspectRatio="xMinYMin meet"',H+=f.text||l.text?' role="img" aria-labelledby="'+q([f.id,l.id].join(" ").trim())+'"':"",H+=">",H+=f.text?'<title id="'+q(f.id)+'">'+q(f.text)+"</title>":"",H+=l.text?'<description id="'+q(l.id)+'">'+q(l.text)+"</description>":"",H+='<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>',H+='<path d="',D=0;D<c.getModuleCount();D+=1)for(P=D*a+h,z=0;z<c.getModuleCount();z+=1)c.isDark(D,z)&&(H+="M"+(z*a+h)+","+P+j);return(H+='" stroke="transparent" fill="black"/>')+"</svg>"},c.createDataURL=function(a,h){a=a||2,h=h===void 0?4*a:h;var l=c.getModuleCount()*a+2*h,f=h,b=l-h;return F(l,l,function(z,D){if(f<=z&&z<b&&f<=D&&D<b){var P=Math.floor((z-f)/a),j=Math.floor((D-f)/a);return c.isDark(j,P)?0:1}return 1})},c.createImgTag=function(a,h,l){a=a||2,h=h===void 0?4*a:h;var f=c.getModuleCount()*a+2*h,b="";return b+="<img",b+=' src="',b+=c.createDataURL(a,h),b+='"',b+=' width="',b+=f,b+='"',b+=' height="',b+=f,b+='"',l&&(b+=' alt="',b+=q(l),b+='"'),b+"/>"};var q=function(a){for(var h="",l=0;l<a.length;l+=1){var f=a.charAt(l);switch(f){case"<":h+="&lt;";break;case">":h+="&gt;";break;case"&":h+="&amp;";break;case'"':h+="&quot;";break;default:h+=f}}return h};return c.createASCII=function(a,h){if((a=a||1)<2)return function(W){W=W===void 0?2:W;var T,O,Z,tt,I,dt=1*c.getModuleCount()+2*W,at=W,st=dt-W,Ft={"██":"█","█ ":"▀"," █":"▄","  ":" "},Dt={"██":"▀","█ ":"▀"," █":" ","  ":" "},ft="";for(T=0;T<dt;T+=2){for(Z=Math.floor((T-at)/1),tt=Math.floor((T+1-at)/1),O=0;O<dt;O+=1)I="█",at<=O&&O<st&&at<=T&&T<st&&c.isDark(Z,Math.floor((O-at)/1))&&(I=" "),at<=O&&O<st&&at<=T+1&&T+1<st&&c.isDark(tt,Math.floor((O-at)/1))?I+=" ":I+="█",ft+=W<1&&T+1>=st?Dt[I]:Ft[I];ft+=`
`}return dt%2&&W>0?ft.substring(0,ft.length-dt-1)+Array(dt+1).join("▀"):ft.substring(0,ft.length-1)}(h);a-=1,h=h===void 0?2*a:h;var l,f,b,z,D=c.getModuleCount()*a+2*h,P=h,j=D-h,N=Array(a+1).join("██"),H=Array(a+1).join("  "),ot="",V="";for(l=0;l<D;l+=1){for(b=Math.floor((l-P)/a),V="",f=0;f<D;f+=1)z=1,P<=f&&f<j&&P<=l&&l<j&&c.isDark(b,Math.floor((f-P)/a))&&(z=0),V+=z?N:H;for(b=0;b<a;b+=1)ot+=V+`
`}return ot.substring(0,ot.length-1)},c.renderTo2dContext=function(a,h){h=h||2;for(var l=c.getModuleCount(),f=0;f<l;f++)for(var b=0;b<l;b++)a.fillStyle=c.isDark(f,b)?"black":"white",a.fillRect(f*h,b*h,h,h)},c};Q.stringToBytes=(Q.stringToBytesFuncs={default:function(p){for(var g=[],u=0;u<p.length;u+=1){var e=p.charCodeAt(u);g.push(255&e)}return g}}).default,Q.createStringToBytes=function(p,g){var u=function(){for(var t=Et(p),o=function(){var $=t.read();if($==-1)throw"eof";return $},r=0,i={};;){var c=t.read();if(c==-1)break;var _=o(),v=o()<<8|o();i[String.fromCharCode(c<<8|_)]=v,r+=1}if(r!=g)throw r+" != "+g;return i}(),e=63;return function(t){for(var o=[],r=0;r<t.length;r+=1){var i=t.charCodeAt(r);if(i<128)o.push(i);else{var c=u[t.charAt(r)];typeof c=="number"?(255&c)==c?o.push(c):(o.push(c>>>8),o.push(255&c)):o.push(e)}}return o}};var lt,et,nt,R,ct,L={L:1,M:0,Q:3,H:2},U=(lt=[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],et=1335,nt=7973,ct=function(p){for(var g=0;p!=0;)g+=1,p>>>=1;return g},(R={}).getBCHTypeInfo=function(p){for(var g=p<<10;ct(g)-ct(et)>=0;)g^=et<<ct(g)-ct(et);return 21522^(p<<10|g)},R.getBCHTypeNumber=function(p){for(var g=p<<12;ct(g)-ct(nt)>=0;)g^=nt<<ct(g)-ct(nt);return p<<12|g},R.getPatternPosition=function(p){return lt[p-1]},R.getMaskFunction=function(p){switch(p){case 0:return function(g,u){return(g+u)%2==0};case 1:return function(g,u){return g%2==0};case 2:return function(g,u){return u%3==0};case 3:return function(g,u){return(g+u)%3==0};case 4:return function(g,u){return(Math.floor(g/2)+Math.floor(u/3))%2==0};case 5:return function(g,u){return g*u%2+g*u%3==0};case 6:return function(g,u){return(g*u%2+g*u%3)%2==0};case 7:return function(g,u){return(g*u%3+(g+u)%2)%2==0};default:throw"bad maskPattern:"+p}},R.getErrorCorrectPolynomial=function(p){for(var g=it([1],0),u=0;u<p;u+=1)g=g.multiply(it([1,Y.gexp(u)],0));return g},R.getLengthInBits=function(p,g){if(1<=g&&g<10)switch(p){case 1:return 10;case 2:return 9;case 4:case 8:return 8;default:throw"mode:"+p}else if(g<27)switch(p){case 1:return 12;case 2:return 11;case 4:return 16;case 8:return 10;default:throw"mode:"+p}else{if(!(g<41))throw"type:"+g;switch(p){case 1:return 14;case 2:return 13;case 4:return 16;case 8:return 12;default:throw"mode:"+p}}},R.getLostPoint=function(p){for(var g=p.getModuleCount(),u=0,e=0;e<g;e+=1)for(var t=0;t<g;t+=1){for(var o=0,r=p.isDark(e,t),i=-1;i<=1;i+=1)if(!(e+i<0||g<=e+i))for(var c=-1;c<=1;c+=1)t+c<0||g<=t+c||i==0&&c==0||r==p.isDark(e+i,t+c)&&(o+=1);o>5&&(u+=3+o-5)}for(e=0;e<g-1;e+=1)for(t=0;t<g-1;t+=1){var _=0;p.isDark(e,t)&&(_+=1),p.isDark(e+1,t)&&(_+=1),p.isDark(e,t+1)&&(_+=1),p.isDark(e+1,t+1)&&(_+=1),_!=0&&_!=4||(u+=3)}for(e=0;e<g;e+=1)for(t=0;t<g-6;t+=1)p.isDark(e,t)&&!p.isDark(e,t+1)&&p.isDark(e,t+2)&&p.isDark(e,t+3)&&p.isDark(e,t+4)&&!p.isDark(e,t+5)&&p.isDark(e,t+6)&&(u+=40);for(t=0;t<g;t+=1)for(e=0;e<g-6;e+=1)p.isDark(e,t)&&!p.isDark(e+1,t)&&p.isDark(e+2,t)&&p.isDark(e+3,t)&&p.isDark(e+4,t)&&!p.isDark(e+5,t)&&p.isDark(e+6,t)&&(u+=40);var v=0;for(t=0;t<g;t+=1)for(e=0;e<g;e+=1)p.isDark(e,t)&&(v+=1);return u+Math.abs(100*v/g/g-50)/5*10},R),Y=function(){for(var p=new Array(256),g=new Array(256),u=0;u<8;u+=1)p[u]=1<<u;for(u=8;u<256;u+=1)p[u]=p[u-4]^p[u-5]^p[u-6]^p[u-8];for(u=0;u<255;u+=1)g[p[u]]=u;return{glog:function(e){if(e<1)throw"glog("+e+")";return g[e]},gexp:function(e){for(;e<0;)e+=255;for(;e>=256;)e-=255;return p[e]}}}();function it(p,g){if(p.length===void 0)throw p.length+"/"+g;var u=function(){for(var t=0;t<p.length&&p[t]==0;)t+=1;for(var o=new Array(p.length-t+g),r=0;r<p.length-t;r+=1)o[r]=p[r+t];return o}(),e={getAt:function(t){return u[t]},getLength:function(){return u.length},multiply:function(t){for(var o=new Array(e.getLength()+t.getLength()-1),r=0;r<e.getLength();r+=1)for(var i=0;i<t.getLength();i+=1)o[r+i]^=Y.gexp(Y.glog(e.getAt(r))+Y.glog(t.getAt(i)));return it(o,0)},mod:function(t){if(e.getLength()-t.getLength()<0)return e;for(var o=Y.glog(e.getAt(0))-Y.glog(t.getAt(0)),r=new Array(e.getLength()),i=0;i<e.getLength();i+=1)r[i]=e.getAt(i);for(i=0;i<t.getLength();i+=1)r[i]^=Y.gexp(Y.glog(t.getAt(i))+o);return it(r,0).mod(t)}};return e}var ut=function(){var p=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12,7,37,13],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]],g=function(e,t){var o={};return o.totalCount=e,o.dataCount=t,o},u={getRSBlocks:function(e,t){var o=function(k,A){switch(A){case L.L:return p[4*(k-1)+0];case L.M:return p[4*(k-1)+1];case L.Q:return p[4*(k-1)+2];case L.H:return p[4*(k-1)+3];default:return}}(e,t);if(o===void 0)throw"bad rs block @ typeNumber:"+e+"/errorCorrectionLevel:"+t;for(var r=o.length/3,i=[],c=0;c<r;c+=1)for(var _=o[3*c+0],v=o[3*c+1],$=o[3*c+2],C=0;C<_;C+=1)i.push(g(v,$));return i}};return u}(),ht=function(){var p=[],g=0,u={getBuffer:function(){return p},getAt:function(e){var t=Math.floor(e/8);return(p[t]>>>7-e%8&1)==1},put:function(e,t){for(var o=0;o<t;o+=1)u.putBit((e>>>t-o-1&1)==1)},getLengthInBits:function(){return g},putBit:function(e){var t=Math.floor(g/8);p.length<=t&&p.push(0),e&&(p[t]|=128>>>g%8),g+=1}};return u},vt=function(p){var g=p,u={getMode:function(){return 1},getLength:function(o){return g.length},write:function(o){for(var r=g,i=0;i+2<r.length;)o.put(e(r.substring(i,i+3)),10),i+=3;i<r.length&&(r.length-i==1?o.put(e(r.substring(i,i+1)),4):r.length-i==2&&o.put(e(r.substring(i,i+2)),7))}},e=function(o){for(var r=0,i=0;i<o.length;i+=1)r=10*r+t(o.charAt(i));return r},t=function(o){if("0"<=o&&o<="9")return o.charCodeAt(0)-48;throw"illegal char :"+o};return u},pt=function(p){var g=p,u={getMode:function(){return 2},getLength:function(t){return g.length},write:function(t){for(var o=g,r=0;r+1<o.length;)t.put(45*e(o.charAt(r))+e(o.charAt(r+1)),11),r+=2;r<o.length&&t.put(e(o.charAt(r)),6)}},e=function(t){if("0"<=t&&t<="9")return t.charCodeAt(0)-48;if("A"<=t&&t<="Z")return t.charCodeAt(0)-65+10;switch(t){case" ":return 36;case"$":return 37;case"%":return 38;case"*":return 39;case"+":return 40;case"-":return 41;case".":return 42;case"/":return 43;case":":return 44;default:throw"illegal char :"+t}};return u},wt=function(p){var g=Q.stringToBytes(p);return{getMode:function(){return 4},getLength:function(u){return g.length},write:function(u){for(var e=0;e<g.length;e+=1)u.put(g[e],8)}}},St=function(p){var g=Q.stringToBytesFuncs.SJIS;if(!g)throw"sjis not supported.";(function(){var t=g("友");if(t.length!=2||(t[0]<<8|t[1])!=38726)throw"sjis not supported."})();var u=g(p),e={getMode:function(){return 8},getLength:function(t){return~~(u.length/2)},write:function(t){for(var o=u,r=0;r+1<o.length;){var i=(255&o[r])<<8|255&o[r+1];if(33088<=i&&i<=40956)i-=33088;else{if(!(57408<=i&&i<=60351))throw"illegal char at "+(r+1)+"/"+i;i-=49472}i=192*(i>>>8&255)+(255&i),t.put(i,13),r+=2}if(r<o.length)throw"illegal char at "+(r+1)}};return e},Ct=function(){var p=[],g={writeByte:function(u){p.push(255&u)},writeShort:function(u){g.writeByte(u),g.writeByte(u>>>8)},writeBytes:function(u,e,t){e=e||0,t=t||u.length;for(var o=0;o<t;o+=1)g.writeByte(u[o+e])},writeString:function(u){for(var e=0;e<u.length;e+=1)g.writeByte(u.charCodeAt(e))},toByteArray:function(){return p},toString:function(){var u="";u+="[";for(var e=0;e<p.length;e+=1)e>0&&(u+=","),u+=p[e];return u+"]"}};return g},Et=function(p){var g=p,u=0,e=0,t=0,o={read:function(){for(;t<8;){if(u>=g.length){if(t==0)return-1;throw"unexpected end of file./"+t}var i=g.charAt(u);if(u+=1,i=="=")return t=0,-1;i.match(/^\s$/)||(e=e<<6|r(i.charCodeAt(0)),t+=6)}var c=e>>>t-8&255;return t-=8,c}},r=function(i){if(65<=i&&i<=90)return i-65;if(97<=i&&i<=122)return i-97+26;if(48<=i&&i<=57)return i-48+52;if(i==43)return 62;if(i==47)return 63;throw"c:"+i};return o},F=function(p,g,u){for(var e=function(v,$){var C=v,k=$,A=new Array(v*$),M={setPixel:function(a,h,l){A[h*C+a]=l},write:function(a){a.writeString("GIF87a"),a.writeShort(C),a.writeShort(k),a.writeByte(128),a.writeByte(0),a.writeByte(0),a.writeByte(0),a.writeByte(0),a.writeByte(0),a.writeByte(255),a.writeByte(255),a.writeByte(255),a.writeString(","),a.writeShort(0),a.writeShort(0),a.writeShort(C),a.writeShort(k),a.writeByte(0);var h=B(2);a.writeByte(2);for(var l=0;h.length-l>255;)a.writeByte(255),a.writeBytes(h,l,255),l+=255;a.writeByte(h.length-l),a.writeBytes(h,l,h.length-l),a.writeByte(0),a.writeString(";")}},B=function(a){for(var h=1<<a,l=1+(1<<a),f=a+1,b=q(),z=0;z<h;z+=1)b.add(String.fromCharCode(z));b.add(String.fromCharCode(h)),b.add(String.fromCharCode(l));var D,P,j,N=Ct(),H=(D=N,P=0,j=0,{write:function(T,O){if(T>>>O)throw"length over";for(;P+O>=8;)D.writeByte(255&(T<<P|j)),O-=8-P,T>>>=8-P,j=0,P=0;j|=T<<P,P+=O},flush:function(){P>0&&D.writeByte(j)}});H.write(h,f);var ot=0,V=String.fromCharCode(A[ot]);for(ot+=1;ot<A.length;){var W=String.fromCharCode(A[ot]);ot+=1,b.contains(V+W)?V+=W:(H.write(b.indexOf(V),f),b.size()<4095&&(b.size()==1<<f&&(f+=1),b.add(V+W)),V=W)}return H.write(b.indexOf(V),f),H.write(l,f),H.flush(),N.toByteArray()},q=function(){var a={},h=0,l={add:function(f){if(l.contains(f))throw"dup key:"+f;a[f]=h,h+=1},size:function(){return h},indexOf:function(f){return a[f]},contains:function(f){return a[f]!==void 0}};return l};return M}(p,g),t=0;t<g;t+=1)for(var o=0;o<p;o+=1)e.setPixel(o,t,u(o,t));var r=Ct();e.write(r);for(var i=function(){var v=0,$=0,C=0,k="",A={},M=function(q){k+=String.fromCharCode(B(63&q))},B=function(q){if(!(q<0)){if(q<26)return 65+q;if(q<52)return q-26+97;if(q<62)return q-52+48;if(q==62)return 43;if(q==63)return 47}throw"n:"+q};return A.writeByte=function(q){for(v=v<<8|255&q,$+=8,C+=1;$>=6;)M(v>>>$-6),$-=6},A.flush=function(){if($>0&&(M(v<<6-$),v=0,$=0),C%3!=0)for(var q=3-C%3,a=0;a<q;a+=1)k+="="},A.toString=function(){return k},A}(),c=r.toByteArray(),_=0;_<c.length;_+=1)i.writeByte(c[_]);return i.flush(),"data:image/gif;base64,"+i};return Q}();X.stringToBytesFuncs["UTF-8"]=function(Q){return function(lt){for(var et=[],nt=0;nt<lt.length;nt++){var R=lt.charCodeAt(nt);R<128?et.push(R):R<2048?et.push(192|R>>6,128|63&R):R<55296||R>=57344?et.push(224|R>>12,128|R>>6&63,128|63&R):(nt++,R=65536+((1023&R)<<10|1023&lt.charCodeAt(nt)),et.push(240|R>>18,128|R>>12&63,128|R>>6&63,128|63&R))}return et}(Q)},(G=typeof(E=function(){return X})=="function"?E.apply(x,[]):E)===void 0||(S.exports=G)}},w={};function m(S){var x=w[S];if(x!==void 0)return x.exports;var E=w[S]={exports:{}};return d[S](E,E.exports,m),E.exports}m.n=S=>{var x=S&&S.__esModule?()=>S.default:()=>S;return m.d(x,{a:x}),x},m.d=(S,x)=>{for(var E in x)m.o(x,E)&&!m.o(S,E)&&Object.defineProperty(S,E,{enumerable:!0,get:x[E]})},m.o=(S,x)=>Object.prototype.hasOwnProperty.call(S,x);var y={};return(()=>{m.d(y,{default:()=>g});const S=u=>!!u&&typeof u=="object"&&!Array.isArray(u);function x(u,...e){if(!e.length)return u;const t=e.shift();return t!==void 0&&S(u)&&S(t)?(u=Object.assign({},u),Object.keys(t).forEach(o=>{const r=u[o],i=t[o];Array.isArray(r)&&Array.isArray(i)?u[o]=i:S(r)&&S(i)?u[o]=x(Object.assign({},r),i):u[o]=i}),x(u,...e)):u}function E(u,e){const t=document.createElement("a");t.download=e,t.href=u,document.body.appendChild(t),t.click(),document.body.removeChild(t)}const G={L:.07,M:.15,Q:.25,H:.3};class X{constructor({svg:e,type:t,window:o}){this._svg=e,this._type=t,this._window=o}draw(e,t,o,r){let i;switch(this._type){case"dots":i=this._drawDot;break;case"classy":i=this._drawClassy;break;case"classy-rounded":i=this._drawClassyRounded;break;case"rounded":i=this._drawRounded;break;case"extra-rounded":i=this._drawExtraRounded;break;default:i=this._drawSquare}i.call(this,{x:e,y:t,size:o,getNeighbor:r})}_rotateFigure({x:e,y:t,size:o,rotation:r=0,draw:i}){var c;const _=e+o/2,v=t+o/2;i(),(c=this._element)===null||c===void 0||c.setAttribute("transform",`rotate(${180*r/Math.PI},${_},${v})`)}_basicDot(e){const{size:t,x:o,y:r}=e;this._rotateFigure(Object.assign(Object.assign({},e),{draw:()=>{this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","circle"),this._element.setAttribute("cx",String(o+t/2)),this._element.setAttribute("cy",String(r+t/2)),this._element.setAttribute("r",String(t/2))}}))}_basicSquare(e){const{size:t,x:o,y:r}=e;this._rotateFigure(Object.assign(Object.assign({},e),{draw:()=>{this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","rect"),this._element.setAttribute("x",String(o)),this._element.setAttribute("y",String(r)),this._element.setAttribute("width",String(t)),this._element.setAttribute("height",String(t))}}))}_basicSideRounded(e){const{size:t,x:o,y:r}=e;this._rotateFigure(Object.assign(Object.assign({},e),{draw:()=>{this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","path"),this._element.setAttribute("d",`M ${o} ${r}v ${t}h `+t/2+`a ${t/2} ${t/2}, 0, 0, 0, 0 ${-t}`)}}))}_basicCornerRounded(e){const{size:t,x:o,y:r}=e;this._rotateFigure(Object.assign(Object.assign({},e),{draw:()=>{this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","path"),this._element.setAttribute("d",`M ${o} ${r}v ${t}h ${t}v `+-t/2+`a ${t/2} ${t/2}, 0, 0, 0, ${-t/2} ${-t/2}`)}}))}_basicCornerExtraRounded(e){const{size:t,x:o,y:r}=e;this._rotateFigure(Object.assign(Object.assign({},e),{draw:()=>{this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","path"),this._element.setAttribute("d",`M ${o} ${r}v ${t}h ${t}a ${t} ${t}, 0, 0, 0, ${-t} ${-t}`)}}))}_basicCornersRounded(e){const{size:t,x:o,y:r}=e;this._rotateFigure(Object.assign(Object.assign({},e),{draw:()=>{this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","path"),this._element.setAttribute("d",`M ${o} ${r}v `+t/2+`a ${t/2} ${t/2}, 0, 0, 0, ${t/2} ${t/2}h `+t/2+"v "+-t/2+`a ${t/2} ${t/2}, 0, 0, 0, ${-t/2} ${-t/2}`)}}))}_drawDot({x:e,y:t,size:o}){this._basicDot({x:e,y:t,size:o,rotation:0})}_drawSquare({x:e,y:t,size:o}){this._basicSquare({x:e,y:t,size:o,rotation:0})}_drawRounded({x:e,y:t,size:o,getNeighbor:r}){const i=r?+r(-1,0):0,c=r?+r(1,0):0,_=r?+r(0,-1):0,v=r?+r(0,1):0,$=i+c+_+v;if($!==0)if($>2||i&&c||_&&v)this._basicSquare({x:e,y:t,size:o,rotation:0});else{if($===2){let C=0;return i&&_?C=Math.PI/2:_&&c?C=Math.PI:c&&v&&(C=-Math.PI/2),void this._basicCornerRounded({x:e,y:t,size:o,rotation:C})}if($===1){let C=0;return _?C=Math.PI/2:c?C=Math.PI:v&&(C=-Math.PI/2),void this._basicSideRounded({x:e,y:t,size:o,rotation:C})}}else this._basicDot({x:e,y:t,size:o,rotation:0})}_drawExtraRounded({x:e,y:t,size:o,getNeighbor:r}){const i=r?+r(-1,0):0,c=r?+r(1,0):0,_=r?+r(0,-1):0,v=r?+r(0,1):0,$=i+c+_+v;if($!==0)if($>2||i&&c||_&&v)this._basicSquare({x:e,y:t,size:o,rotation:0});else{if($===2){let C=0;return i&&_?C=Math.PI/2:_&&c?C=Math.PI:c&&v&&(C=-Math.PI/2),void this._basicCornerExtraRounded({x:e,y:t,size:o,rotation:C})}if($===1){let C=0;return _?C=Math.PI/2:c?C=Math.PI:v&&(C=-Math.PI/2),void this._basicSideRounded({x:e,y:t,size:o,rotation:C})}}else this._basicDot({x:e,y:t,size:o,rotation:0})}_drawClassy({x:e,y:t,size:o,getNeighbor:r}){const i=r?+r(-1,0):0,c=r?+r(1,0):0,_=r?+r(0,-1):0,v=r?+r(0,1):0;i+c+_+v!==0?i||_?c||v?this._basicSquare({x:e,y:t,size:o,rotation:0}):this._basicCornerRounded({x:e,y:t,size:o,rotation:Math.PI/2}):this._basicCornerRounded({x:e,y:t,size:o,rotation:-Math.PI/2}):this._basicCornersRounded({x:e,y:t,size:o,rotation:Math.PI/2})}_drawClassyRounded({x:e,y:t,size:o,getNeighbor:r}){const i=r?+r(-1,0):0,c=r?+r(1,0):0,_=r?+r(0,-1):0,v=r?+r(0,1):0;i+c+_+v!==0?i||_?c||v?this._basicSquare({x:e,y:t,size:o,rotation:0}):this._basicCornerExtraRounded({x:e,y:t,size:o,rotation:Math.PI/2}):this._basicCornerExtraRounded({x:e,y:t,size:o,rotation:-Math.PI/2}):this._basicCornersRounded({x:e,y:t,size:o,rotation:Math.PI/2})}}const Q={dot:"dot",square:"square",extraRounded:"extra-rounded"},lt=Object.values(Q);class et{constructor({svg:e,type:t,window:o}){this._svg=e,this._type=t,this._window=o}draw(e,t,o,r){let i;switch(this._type){case Q.square:i=this._drawSquare;break;case Q.extraRounded:i=this._drawExtraRounded;break;default:i=this._drawDot}i.call(this,{x:e,y:t,size:o,rotation:r})}_rotateFigure({x:e,y:t,size:o,rotation:r=0,draw:i}){var c;const _=e+o/2,v=t+o/2;i(),(c=this._element)===null||c===void 0||c.setAttribute("transform",`rotate(${180*r/Math.PI},${_},${v})`)}_basicDot(e){const{size:t,x:o,y:r}=e,i=t/7;this._rotateFigure(Object.assign(Object.assign({},e),{draw:()=>{this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","path"),this._element.setAttribute("clip-rule","evenodd"),this._element.setAttribute("d",`M ${o+t/2} ${r}a ${t/2} ${t/2} 0 1 0 0.1 0zm 0 ${i}a ${t/2-i} ${t/2-i} 0 1 1 -0.1 0Z`)}}))}_basicSquare(e){const{size:t,x:o,y:r}=e,i=t/7;this._rotateFigure(Object.assign(Object.assign({},e),{draw:()=>{this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","path"),this._element.setAttribute("clip-rule","evenodd"),this._element.setAttribute("d",`M ${o} ${r}v ${t}h ${t}v `+-t+`zM ${o+i} ${r+i}h `+(t-2*i)+"v "+(t-2*i)+"h "+(2*i-t)+"z")}}))}_basicExtraRounded(e){const{size:t,x:o,y:r}=e,i=t/7;this._rotateFigure(Object.assign(Object.assign({},e),{draw:()=>{this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","path"),this._element.setAttribute("clip-rule","evenodd"),this._element.setAttribute("d",`M ${o} ${r+2.5*i}v `+2*i+`a ${2.5*i} ${2.5*i}, 0, 0, 0, ${2.5*i} ${2.5*i}h `+2*i+`a ${2.5*i} ${2.5*i}, 0, 0, 0, ${2.5*i} ${2.5*-i}v `+-2*i+`a ${2.5*i} ${2.5*i}, 0, 0, 0, ${2.5*-i} ${2.5*-i}h `+-2*i+`a ${2.5*i} ${2.5*i}, 0, 0, 0, ${2.5*-i} ${2.5*i}M ${o+2.5*i} ${r+i}h `+2*i+`a ${1.5*i} ${1.5*i}, 0, 0, 1, ${1.5*i} ${1.5*i}v `+2*i+`a ${1.5*i} ${1.5*i}, 0, 0, 1, ${1.5*-i} ${1.5*i}h `+-2*i+`a ${1.5*i} ${1.5*i}, 0, 0, 1, ${1.5*-i} ${1.5*-i}v `+-2*i+`a ${1.5*i} ${1.5*i}, 0, 0, 1, ${1.5*i} ${1.5*-i}`)}}))}_drawDot({x:e,y:t,size:o,rotation:r}){this._basicDot({x:e,y:t,size:o,rotation:r})}_drawSquare({x:e,y:t,size:o,rotation:r}){this._basicSquare({x:e,y:t,size:o,rotation:r})}_drawExtraRounded({x:e,y:t,size:o,rotation:r}){this._basicExtraRounded({x:e,y:t,size:o,rotation:r})}}const nt={dot:"dot",square:"square"},R=Object.values(nt);class ct{constructor({svg:e,type:t,window:o}){this._svg=e,this._type=t,this._window=o}draw(e,t,o,r){let i;i=this._type===nt.square?this._drawSquare:this._drawDot,i.call(this,{x:e,y:t,size:o,rotation:r})}_rotateFigure({x:e,y:t,size:o,rotation:r=0,draw:i}){var c;const _=e+o/2,v=t+o/2;i(),(c=this._element)===null||c===void 0||c.setAttribute("transform",`rotate(${180*r/Math.PI},${_},${v})`)}_basicDot(e){const{size:t,x:o,y:r}=e;this._rotateFigure(Object.assign(Object.assign({},e),{draw:()=>{this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","circle"),this._element.setAttribute("cx",String(o+t/2)),this._element.setAttribute("cy",String(r+t/2)),this._element.setAttribute("r",String(t/2))}}))}_basicSquare(e){const{size:t,x:o,y:r}=e;this._rotateFigure(Object.assign(Object.assign({},e),{draw:()=>{this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","rect"),this._element.setAttribute("x",String(o)),this._element.setAttribute("y",String(r)),this._element.setAttribute("width",String(t)),this._element.setAttribute("height",String(t))}}))}_drawDot({x:e,y:t,size:o,rotation:r}){this._basicDot({x:e,y:t,size:o,rotation:r})}_drawSquare({x:e,y:t,size:o,rotation:r}){this._basicSquare({x:e,y:t,size:o,rotation:r})}}const L="circle",U=[[1,1,1,1,1,1,1],[1,0,0,0,0,0,1],[1,0,0,0,0,0,1],[1,0,0,0,0,0,1],[1,0,0,0,0,0,1],[1,0,0,0,0,0,1],[1,1,1,1,1,1,1]],Y=[[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,1,1,1,0,0],[0,0,1,1,1,0,0],[0,0,1,1,1,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0]];class it{constructor(e,t){this._roundSize=o=>this._options.dotsOptions.roundSize?Math.floor(o):o,this._window=t,this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","svg"),this._element.setAttribute("width",String(e.width)),this._element.setAttribute("height",String(e.height)),this._element.setAttribute("xmlns:xlink","http://www.w3.org/1999/xlink"),e.dotsOptions.roundSize||this._element.setAttribute("shape-rendering","crispEdges"),this._element.setAttribute("viewBox",`0 0 ${e.width} ${e.height}`),this._defs=this._window.document.createElementNS("http://www.w3.org/2000/svg","defs"),this._element.appendChild(this._defs),this._imageUri=e.image,this._instanceId=it.instanceCount++,this._options=e}get width(){return this._options.width}get height(){return this._options.height}getElement(){return this._element}async drawQR(e){const t=e.getModuleCount(),o=Math.min(this._options.width,this._options.height)-2*this._options.margin,r=this._options.shape===L?o/Math.sqrt(2):o,i=this._roundSize(r/t);let c={hideXDots:0,hideYDots:0,width:0,height:0};if(this._qr=e,this._options.image){if(await this.loadImage(),!this._image)return;const{imageOptions:_,qrOptions:v}=this._options,$=_.imageSize*G[v.errorCorrectionLevel],C=Math.floor($*t*t);c=function({originalHeight:k,originalWidth:A,maxHiddenDots:M,maxHiddenAxisDots:B,dotSize:q}){const a={x:0,y:0},h={x:0,y:0};if(k<=0||A<=0||M<=0||q<=0)return{height:0,width:0,hideYDots:0,hideXDots:0};const l=k/A;return a.x=Math.floor(Math.sqrt(M/l)),a.x<=0&&(a.x=1),B&&B<a.x&&(a.x=B),a.x%2==0&&a.x--,h.x=a.x*q,a.y=1+2*Math.ceil((a.x*l-1)/2),h.y=Math.round(h.x*l),(a.y*a.x>M||B&&B<a.y)&&(B&&B<a.y?(a.y=B,a.y%2==0&&a.x--):a.y-=2,h.y=a.y*q,a.x=1+2*Math.ceil((a.y/l-1)/2),h.x=Math.round(h.y/l)),{height:h.y,width:h.x,hideYDots:a.y,hideXDots:a.x}}({originalWidth:this._image.width,originalHeight:this._image.height,maxHiddenDots:C,maxHiddenAxisDots:t-14,dotSize:i})}this.drawBackground(),this.drawDots((_,v)=>{var $,C,k,A,M,B;return!(this._options.imageOptions.hideBackgroundDots&&_>=(t-c.hideYDots)/2&&_<(t+c.hideYDots)/2&&v>=(t-c.hideXDots)/2&&v<(t+c.hideXDots)/2||!(($=U[_])===null||$===void 0)&&$[v]||!((C=U[_-t+7])===null||C===void 0)&&C[v]||!((k=U[_])===null||k===void 0)&&k[v-t+7]||!((A=Y[_])===null||A===void 0)&&A[v]||!((M=Y[_-t+7])===null||M===void 0)&&M[v]||!((B=Y[_])===null||B===void 0)&&B[v-t+7])}),this.drawCorners(),this._options.image&&await this.drawImage({width:c.width,height:c.height,count:t,dotSize:i})}drawBackground(){var e,t,o;const r=this._element,i=this._options;if(r){const c=(e=i.backgroundOptions)===null||e===void 0?void 0:e.gradient,_=(t=i.backgroundOptions)===null||t===void 0?void 0:t.color;let v=i.height,$=i.width;if(c||_){const C=this._window.document.createElementNS("http://www.w3.org/2000/svg","rect");this._backgroundClipPath=this._window.document.createElementNS("http://www.w3.org/2000/svg","clipPath"),this._backgroundClipPath.setAttribute("id",`clip-path-background-color-${this._instanceId}`),this._defs.appendChild(this._backgroundClipPath),!((o=i.backgroundOptions)===null||o===void 0)&&o.round&&(v=$=Math.min(i.width,i.height),C.setAttribute("rx",String(v/2*i.backgroundOptions.round))),C.setAttribute("x",String(this._roundSize((i.width-$)/2))),C.setAttribute("y",String(this._roundSize((i.height-v)/2))),C.setAttribute("width",String($)),C.setAttribute("height",String(v)),this._backgroundClipPath.appendChild(C),this._createColor({options:c,color:_,additionalRotation:0,x:0,y:0,height:i.height,width:i.width,name:`background-color-${this._instanceId}`})}}}drawDots(e){var t,o;if(!this._qr)throw"QR code is not defined";const r=this._options,i=this._qr.getModuleCount();if(i>r.width||i>r.height)throw"The canvas is too small.";const c=Math.min(r.width,r.height)-2*r.margin,_=r.shape===L?c/Math.sqrt(2):c,v=this._roundSize(_/i),$=this._roundSize((r.width-i*v)/2),C=this._roundSize((r.height-i*v)/2),k=new X({svg:this._element,type:r.dotsOptions.type,window:this._window});this._dotsClipPath=this._window.document.createElementNS("http://www.w3.org/2000/svg","clipPath"),this._dotsClipPath.setAttribute("id",`clip-path-dot-color-${this._instanceId}`),this._defs.appendChild(this._dotsClipPath),this._createColor({options:(t=r.dotsOptions)===null||t===void 0?void 0:t.gradient,color:r.dotsOptions.color,additionalRotation:0,x:0,y:0,height:r.height,width:r.width,name:`dot-color-${this._instanceId}`});for(let A=0;A<i;A++)for(let M=0;M<i;M++)e&&!e(A,M)||!((o=this._qr)===null||o===void 0)&&o.isDark(A,M)&&(k.draw($+M*v,C+A*v,v,(B,q)=>!(M+B<0||A+q<0||M+B>=i||A+q>=i)&&!(e&&!e(A+q,M+B))&&!!this._qr&&this._qr.isDark(A+q,M+B)),k._element&&this._dotsClipPath&&this._dotsClipPath.appendChild(k._element));if(r.shape===L){const A=this._roundSize((c/v-i)/2),M=i+2*A,B=$-A*v,q=C-A*v,a=[],h=this._roundSize(M/2);for(let l=0;l<M;l++){a[l]=[];for(let f=0;f<M;f++)l>=A-1&&l<=M-A&&f>=A-1&&f<=M-A||Math.sqrt((l-h)*(l-h)+(f-h)*(f-h))>h?a[l][f]=0:a[l][f]=this._qr.isDark(f-2*A<0?f:f>=i?f-2*A:f-A,l-2*A<0?l:l>=i?l-2*A:l-A)?1:0}for(let l=0;l<M;l++)for(let f=0;f<M;f++)a[l][f]&&(k.draw(B+f*v,q+l*v,v,(b,z)=>{var D;return!!(!((D=a[l+z])===null||D===void 0)&&D[f+b])}),k._element&&this._dotsClipPath&&this._dotsClipPath.appendChild(k._element))}}drawCorners(){if(!this._qr)throw"QR code is not defined";const e=this._element,t=this._options;if(!e)throw"Element code is not defined";const o=this._qr.getModuleCount(),r=Math.min(t.width,t.height)-2*t.margin,i=t.shape===L?r/Math.sqrt(2):r,c=this._roundSize(i/o),_=7*c,v=3*c,$=this._roundSize((t.width-o*c)/2),C=this._roundSize((t.height-o*c)/2);[[0,0,0],[1,0,Math.PI/2],[0,1,-Math.PI/2]].forEach(([k,A,M])=>{var B,q,a,h,l,f,b,z,D,P,j,N,H,ot;const V=$+k*c*(o-7),W=C+A*c*(o-7);let T=this._dotsClipPath,O=this._dotsClipPath;if((!((B=t.cornersSquareOptions)===null||B===void 0)&&B.gradient||!((q=t.cornersSquareOptions)===null||q===void 0)&&q.color)&&(T=this._window.document.createElementNS("http://www.w3.org/2000/svg","clipPath"),T.setAttribute("id",`clip-path-corners-square-color-${k}-${A}-${this._instanceId}`),this._defs.appendChild(T),this._cornersSquareClipPath=this._cornersDotClipPath=O=T,this._createColor({options:(a=t.cornersSquareOptions)===null||a===void 0?void 0:a.gradient,color:(h=t.cornersSquareOptions)===null||h===void 0?void 0:h.color,additionalRotation:M,x:V,y:W,height:_,width:_,name:`corners-square-color-${k}-${A}-${this._instanceId}`})),((l=t.cornersSquareOptions)===null||l===void 0?void 0:l.type)&&lt.includes(t.cornersSquareOptions.type)){const Z=new et({svg:this._element,type:t.cornersSquareOptions.type,window:this._window});Z.draw(V,W,_,M),Z._element&&T&&T.appendChild(Z._element)}else{const Z=new X({svg:this._element,type:((f=t.cornersSquareOptions)===null||f===void 0?void 0:f.type)||t.dotsOptions.type,window:this._window});for(let tt=0;tt<U.length;tt++)for(let I=0;I<U[tt].length;I++)!((b=U[tt])===null||b===void 0)&&b[I]&&(Z.draw(V+I*c,W+tt*c,c,(dt,at)=>{var st;return!!(!((st=U[tt+at])===null||st===void 0)&&st[I+dt])}),Z._element&&T&&T.appendChild(Z._element))}if((!((z=t.cornersDotOptions)===null||z===void 0)&&z.gradient||!((D=t.cornersDotOptions)===null||D===void 0)&&D.color)&&(O=this._window.document.createElementNS("http://www.w3.org/2000/svg","clipPath"),O.setAttribute("id",`clip-path-corners-dot-color-${k}-${A}-${this._instanceId}`),this._defs.appendChild(O),this._cornersDotClipPath=O,this._createColor({options:(P=t.cornersDotOptions)===null||P===void 0?void 0:P.gradient,color:(j=t.cornersDotOptions)===null||j===void 0?void 0:j.color,additionalRotation:M,x:V+2*c,y:W+2*c,height:v,width:v,name:`corners-dot-color-${k}-${A}-${this._instanceId}`})),((N=t.cornersDotOptions)===null||N===void 0?void 0:N.type)&&R.includes(t.cornersDotOptions.type)){const Z=new ct({svg:this._element,type:t.cornersDotOptions.type,window:this._window});Z.draw(V+2*c,W+2*c,v,M),Z._element&&O&&O.appendChild(Z._element)}else{const Z=new X({svg:this._element,type:((H=t.cornersDotOptions)===null||H===void 0?void 0:H.type)||t.dotsOptions.type,window:this._window});for(let tt=0;tt<Y.length;tt++)for(let I=0;I<Y[tt].length;I++)!((ot=Y[tt])===null||ot===void 0)&&ot[I]&&(Z.draw(V+I*c,W+tt*c,c,(dt,at)=>{var st;return!!(!((st=Y[tt+at])===null||st===void 0)&&st[I+dt])}),Z._element&&O&&O.appendChild(Z._element))}})}loadImage(){return new Promise((e,t)=>{var o;const r=this._options;if(!r.image)return t("Image is not defined");if(!((o=r.nodeCanvas)===null||o===void 0)&&o.loadImage)r.nodeCanvas.loadImage(r.image).then(i=>{var c,_;if(this._image=i,this._options.imageOptions.saveAsBlob){const v=(c=r.nodeCanvas)===null||c===void 0?void 0:c.createCanvas(this._image.width,this._image.height);(_=v==null?void 0:v.getContext("2d"))===null||_===void 0||_.drawImage(i,0,0),this._imageUri=v==null?void 0:v.toDataURL()}e()}).catch(t);else{const i=new this._window.Image;typeof r.imageOptions.crossOrigin=="string"&&(i.crossOrigin=r.imageOptions.crossOrigin),this._image=i,i.onload=async()=>{this._options.imageOptions.saveAsBlob&&(this._imageUri=await async function(c,_){return new Promise(v=>{const $=new _.XMLHttpRequest;$.onload=function(){const C=new _.FileReader;C.onloadend=function(){v(C.result)},C.readAsDataURL($.response)},$.open("GET",c),$.responseType="blob",$.send()})}(r.image||"",this._window)),e()},i.src=r.image}})}async drawImage({width:e,height:t,count:o,dotSize:r}){const i=this._options,c=this._roundSize((i.width-o*r)/2),_=this._roundSize((i.height-o*r)/2),v=c+this._roundSize(i.imageOptions.margin+(o*r-e)/2),$=_+this._roundSize(i.imageOptions.margin+(o*r-t)/2),C=e-2*i.imageOptions.margin,k=t-2*i.imageOptions.margin,A=this._window.document.createElementNS("http://www.w3.org/2000/svg","image");A.setAttribute("href",this._imageUri||""),A.setAttribute("xlink:href",this._imageUri||""),A.setAttribute("x",String(v)),A.setAttribute("y",String($)),A.setAttribute("width",`${C}px`),A.setAttribute("height",`${k}px`),this._element.appendChild(A)}_createColor({options:e,color:t,additionalRotation:o,x:r,y:i,height:c,width:_,name:v}){const $=_>c?_:c,C=this._window.document.createElementNS("http://www.w3.org/2000/svg","rect");if(C.setAttribute("x",String(r)),C.setAttribute("y",String(i)),C.setAttribute("height",String(c)),C.setAttribute("width",String(_)),C.setAttribute("clip-path",`url('#clip-path-${v}')`),e){let k;if(e.type==="radial")k=this._window.document.createElementNS("http://www.w3.org/2000/svg","radialGradient"),k.setAttribute("id",v),k.setAttribute("gradientUnits","userSpaceOnUse"),k.setAttribute("fx",String(r+_/2)),k.setAttribute("fy",String(i+c/2)),k.setAttribute("cx",String(r+_/2)),k.setAttribute("cy",String(i+c/2)),k.setAttribute("r",String($/2));else{const A=((e.rotation||0)+o)%(2*Math.PI),M=(A+2*Math.PI)%(2*Math.PI);let B=r+_/2,q=i+c/2,a=r+_/2,h=i+c/2;M>=0&&M<=.25*Math.PI||M>1.75*Math.PI&&M<=2*Math.PI?(B-=_/2,q-=c/2*Math.tan(A),a+=_/2,h+=c/2*Math.tan(A)):M>.25*Math.PI&&M<=.75*Math.PI?(q-=c/2,B-=_/2/Math.tan(A),h+=c/2,a+=_/2/Math.tan(A)):M>.75*Math.PI&&M<=1.25*Math.PI?(B+=_/2,q+=c/2*Math.tan(A),a-=_/2,h-=c/2*Math.tan(A)):M>1.25*Math.PI&&M<=1.75*Math.PI&&(q+=c/2,B+=_/2/Math.tan(A),h-=c/2,a-=_/2/Math.tan(A)),k=this._window.document.createElementNS("http://www.w3.org/2000/svg","linearGradient"),k.setAttribute("id",v),k.setAttribute("gradientUnits","userSpaceOnUse"),k.setAttribute("x1",String(Math.round(B))),k.setAttribute("y1",String(Math.round(q))),k.setAttribute("x2",String(Math.round(a))),k.setAttribute("y2",String(Math.round(h)))}e.colorStops.forEach(({offset:A,color:M})=>{const B=this._window.document.createElementNS("http://www.w3.org/2000/svg","stop");B.setAttribute("offset",100*A+"%"),B.setAttribute("stop-color",M),k.appendChild(B)}),C.setAttribute("fill",`url('#${v}')`),this._defs.appendChild(k)}else t&&C.setAttribute("fill",t);this._element.appendChild(C)}}it.instanceCount=0;const ut=it,ht="canvas",vt={};for(let u=0;u<=40;u++)vt[u]=u;const pt={type:ht,shape:"square",width:300,height:300,data:"",margin:0,qrOptions:{typeNumber:vt[0],mode:void 0,errorCorrectionLevel:"Q"},imageOptions:{saveAsBlob:!0,hideBackgroundDots:!0,imageSize:.4,crossOrigin:void 0,margin:0},dotsOptions:{type:"square",color:"#000",roundSize:!0},backgroundOptions:{round:0,color:"#fff"}};function wt(u){const e=Object.assign({},u);if(!e.colorStops||!e.colorStops.length)throw"Field 'colorStops' is required in gradient";return e.rotation?e.rotation=Number(e.rotation):e.rotation=0,e.colorStops=e.colorStops.map(t=>Object.assign(Object.assign({},t),{offset:Number(t.offset)})),e}function St(u){const e=Object.assign({},u);return e.width=Number(e.width),e.height=Number(e.height),e.margin=Number(e.margin),e.imageOptions=Object.assign(Object.assign({},e.imageOptions),{hideBackgroundDots:!!e.imageOptions.hideBackgroundDots,imageSize:Number(e.imageOptions.imageSize),margin:Number(e.imageOptions.margin)}),e.margin>Math.min(e.width,e.height)&&(e.margin=Math.min(e.width,e.height)),e.dotsOptions=Object.assign({},e.dotsOptions),e.dotsOptions.gradient&&(e.dotsOptions.gradient=wt(e.dotsOptions.gradient)),e.cornersSquareOptions&&(e.cornersSquareOptions=Object.assign({},e.cornersSquareOptions),e.cornersSquareOptions.gradient&&(e.cornersSquareOptions.gradient=wt(e.cornersSquareOptions.gradient))),e.cornersDotOptions&&(e.cornersDotOptions=Object.assign({},e.cornersDotOptions),e.cornersDotOptions.gradient&&(e.cornersDotOptions.gradient=wt(e.cornersDotOptions.gradient))),e.backgroundOptions&&(e.backgroundOptions=Object.assign({},e.backgroundOptions),e.backgroundOptions.gradient&&(e.backgroundOptions.gradient=wt(e.backgroundOptions.gradient))),e}var Ct=m(873),Et=m.n(Ct);function F(u){if(!u)throw new Error("Extension must be defined");u[0]==="."&&(u=u.substring(1));const e={bmp:"image/bmp",gif:"image/gif",ico:"image/vnd.microsoft.icon",jpeg:"image/jpeg",jpg:"image/jpeg",png:"image/png",svg:"image/svg+xml",tif:"image/tiff",tiff:"image/tiff",webp:"image/webp",pdf:"application/pdf"}[u.toLowerCase()];if(!e)throw new Error(`Extension "${u}" is not supported`);return e}class p{constructor(e){e!=null&&e.jsdom?this._window=new e.jsdom("",{resources:"usable"}).window:this._window=window,this._options=e?St(x(pt,e)):pt,this.update()}static _clearContainer(e){e&&(e.innerHTML="")}_setupSvg(){if(!this._qr)return;const e=new ut(this._options,this._window);this._svg=e.getElement(),this._svgDrawingPromise=e.drawQR(this._qr).then(()=>{var t;this._svg&&((t=this._extension)===null||t===void 0||t.call(this,e.getElement(),this._options))})}_setupCanvas(){var e,t;this._qr&&(!((e=this._options.nodeCanvas)===null||e===void 0)&&e.createCanvas?(this._nodeCanvas=this._options.nodeCanvas.createCanvas(this._options.width,this._options.height),this._nodeCanvas.width=this._options.width,this._nodeCanvas.height=this._options.height):(this._domCanvas=document.createElement("canvas"),this._domCanvas.width=this._options.width,this._domCanvas.height=this._options.height),this._setupSvg(),this._canvasDrawingPromise=(t=this._svgDrawingPromise)===null||t===void 0?void 0:t.then(()=>{var o;if(!this._svg)return;const r=this._svg,i=new this._window.XMLSerializer().serializeToString(r),c=btoa(i),_=`data:${F("svg")};base64,${c}`;if(!((o=this._options.nodeCanvas)===null||o===void 0)&&o.loadImage)return this._options.nodeCanvas.loadImage(_).then(v=>{var $,C;v.width=this._options.width,v.height=this._options.height,(C=($=this._nodeCanvas)===null||$===void 0?void 0:$.getContext("2d"))===null||C===void 0||C.drawImage(v,0,0)});{const v=new this._window.Image;return new Promise($=>{v.onload=()=>{var C,k;(k=(C=this._domCanvas)===null||C===void 0?void 0:C.getContext("2d"))===null||k===void 0||k.drawImage(v,0,0),$()},v.src=_})}}))}async _getElement(e="png"){if(!this._qr)throw"QR code is empty";return e.toLowerCase()==="svg"?(this._svg&&this._svgDrawingPromise||this._setupSvg(),await this._svgDrawingPromise,this._svg):((this._domCanvas||this._nodeCanvas)&&this._canvasDrawingPromise||this._setupCanvas(),await this._canvasDrawingPromise,this._domCanvas||this._nodeCanvas)}update(e){p._clearContainer(this._container),this._options=e?St(x(this._options,e)):this._options,this._options.data&&(this._qr=Et()(this._options.qrOptions.typeNumber,this._options.qrOptions.errorCorrectionLevel),this._qr.addData(this._options.data,this._options.qrOptions.mode||function(t){switch(!0){case/^[0-9]*$/.test(t):return"Numeric";case/^[0-9A-Z $%*+\-./:]*$/.test(t):return"Alphanumeric";default:return"Byte"}}(this._options.data)),this._qr.make(),this._options.type===ht?this._setupCanvas():this._setupSvg(),this.append(this._container))}append(e){if(e){if(typeof e.appendChild!="function")throw"Container should be a single DOM node";this._options.type===ht?this._domCanvas&&e.appendChild(this._domCanvas):this._svg&&e.appendChild(this._svg),this._container=e}}applyExtension(e){if(!e)throw"Extension function should be defined.";this._extension=e,this.update()}deleteExtension(){this._extension=void 0,this.update()}async getRawData(e="png"){if(!this._qr)throw"QR code is empty";const t=await this._getElement(e),o=F(e);if(!t)return null;if(e.toLowerCase()==="svg"){const r=`<?xml version="1.0" standalone="no"?>\r
${new this._window.XMLSerializer().serializeToString(t)}`;return typeof Blob>"u"||this._options.jsdom?Buffer.from(r):new Blob([r],{type:o})}return new Promise(r=>{const i=t;if("toBuffer"in i)if(o==="image/png")r(i.toBuffer(o));else if(o==="image/jpeg")r(i.toBuffer(o));else{if(o!=="application/pdf")throw Error("Unsupported extension");r(i.toBuffer(o))}else"toBlob"in i&&i.toBlob(r,o,1)})}async download(e){if(!this._qr)throw"QR code is empty";if(typeof Blob>"u")throw"Cannot download in Node.js, call getRawData instead.";let t="png",o="qr";typeof e=="string"?(t=e,console.warn("Extension is deprecated as argument for 'download' method, please pass object { name: '...', extension: '...' } as argument")):typeof e=="object"&&e!==null&&(e.name&&(o=e.name),e.extension&&(t=e.extension));const r=await this._getElement(t);if(r)if(t.toLowerCase()==="svg"){let i=new XMLSerializer().serializeToString(r);i=`<?xml version="1.0" standalone="no"?>\r
`+i,E(`data:${F(t)};charset=utf-8,${encodeURIComponent(i)}`,`${o}.svg`)}else E(r.toDataURL(F(t)),`${o}.${t}`)}}const g=p})(),y.default})())}(Rt)),Rt.exports}var _e=xe();const Se=ve(_e),Ce=`
  .zenobia-payment-container {
    position: relative;
    width: 240px;
    z-index: 1;
  }

  .zenobia-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .zenobia-modal-overlay.visible {
    opacity: 1;
  }

  .zenobia-payment-button {
    width: 100%;
    height: 48px;
    border-radius: 24px;
    padding: 0 24px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 16px;
    font-weight: 500;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    position: relative;
    z-index: 2;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .zenobia-payment-button {
    position: relative;
    overflow: hidden;
    z-index: 1;
  }

  .zenobia-payment-button::before {
    content: '';
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to right, coral, orange);
    z-index: -1;
    transition: left 0.3s ease;
  }

  .zenobia-payment-button:not(.modal-open)::before {
    left: -100%;
  }

  .zenobia-payment-button.modal-open::before {
    left: 0;
  }

  .zenobia-payment-button:disabled:not(.modal-open) {
    cursor: not-allowed;
    background-color: #e5e7eb;
    color: #9ca3af;
    box-shadow: none;
    transform: none;
  }

  .zenobia-payment-button:disabled.modal-open {
    cursor: not-allowed;
    color: white;
    box-shadow: none;
    transform: none;
  }

  .zenobia-payment-button:not(:disabled) {
    background-color: black;
    color: white;
  }

  .zenobia-payment-button:not(:disabled):hover:not(.modal-open)::before {
    left: 0;
  }

  /* Button text animation styles */
  .button-text-container {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .initial-text,
  .hover-text {
    position: absolute;
    width: 100%;
    transition: transform 0.3s ease, opacity 0.3s ease;
    white-space: nowrap;
  }

  .initial-text {
    opacity: 1;
    transform: translateX(0);
  }

  .hover-text {
    opacity: 0;
    transform: translateX(-20px);
  }

  /* Hover animation - left to right */
  .zenobia-payment-button:not(:disabled):hover .initial-text {
    opacity: 0;
    transform: translateX(20px);
  }

  .zenobia-payment-button:not(:disabled):hover .hover-text {
    opacity: 1;
    transform: translateX(0);
  }

  /* Modal closing animation - right to left */
  .zenobia-payment-button.closing .initial-text {
    opacity: 1;
    transform: translateX(0);
  }

  .zenobia-payment-button.closing .hover-text {
    opacity: 0;
    transform: translateX(-20px);
  }

  .zenobia-payment-button:not(:disabled):hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .zenobia-payment-button:not(:disabled):active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .zenobia-qr-tooltip {
    position: absolute;
    left: 0;
    right: 0;
    transform: translateY(0);
    opacity: 1;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 1001;
  }

  .zenobia-qr-tooltip.visible {
    transform: scale(1);
    opacity: 1;
  }

  .zenobia-qr-tooltip.below {
    margin-top: 8px;
  }
  .zenobia-qr-tooltip.above {
    bottom: 100%;
    margin-bottom: 8px;
  }

  .zenobia-qr-tooltip.expanding {
    opacity: 0;
    transform: translateY(8px);
  }
  .zenobia-qr-tooltip.above.expanding {
    transform: translateY(-8px);
  }

  .zenobia-qr-caret {
    position: absolute;
    left: 50%;
    transform: translateX(-50%) rotate(45deg);
    width: 16px;
    height: 16px;
    background-color: white;
    border-top: 1px solid #e5e7eb;
    border-left: 1px solid #e5e7eb;
    z-index: 4;
  }

  .zenobia-qr-tooltip.below .zenobia-qr-caret {
    top: -8px;
    border-top: 1px solid #e5e7eb;
    border-left: 1px solid #e5e7eb;
    border-bottom: none;
    border-right: none;
  }

  .zenobia-qr-tooltip.above .zenobia-qr-caret {
    bottom: -8px;
    border-bottom: 1px solid #e5e7eb;
    border-right: 1px solid #e5e7eb;
    border-top: none;
    border-left: none;
  }

  .zenobia-qr-content {
    position: relative;
    background-color: white;
    border-radius: 16px;
    border: 1px solid #e5e7eb;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    padding: 24px;
    z-index: 3;
  }

  /* Styles for Popup */
  .zenobia-qr-popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  .zenobia-qr-popup-overlay.visible {
    opacity: 1;
  }
  .zenobia-qr-popup-content {
    background-color: #ffffff;
    border-radius: 24px;
    padding: 32px;
    box-shadow: 0 20px 25px rgba(0, 0, 0, 0.15);
    position: relative;
    width: 400px;
    max-width: 90%;
  }

  .modal-header {
    display: block;
    position: relative;
    padding: 0 0 24px;
    background: #ffffff;
    border-bottom: 1px solid #f0f0f0;
  }

  .header-title-row {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .modal-header h3 {
    margin: 0;
    font-size: 24px;
    font-weight: 600;
    color: #333;
  }

  .subtitle {
    margin: 8px 0 0;
    font-size: 14px;
    color: #666;
  }

  .loading-spinner {
    display: flex;
    align-items: center;
  }

  .spinner {
    width: 20px;
    height: 20px;
    border: 2px solid rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    border-top-color: #333;
    animation: spin 0.8s linear infinite;
    flex-shrink: 0;
    display: inline-block;
    margin-right: 12px;
    position: relative;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .modal-body {
    text-align: center;
    padding: 24px 0 0;
  }

  .qr-code-container {
    margin: 0 auto;
    padding: 4px;
    background: white;
    border-radius: 12px;
    display: inline-block;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  }

  .payment-amount {
    font-size: 40px;
    font-weight: 600;
    margin: 16px 0 8px;
    color: #333;
  }

  .payment-status {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 16px auto 0;
    width: 100%;
  }

  .savings-badge {
    display: block;
    background-color: #f0fdf4;
    color: #065f46;
    font-size: 14px;
    font-weight: 500;
    padding: 6px 16px;
    border-radius: 16px;
    margin: 8px auto 16px;
    border: 1px solid #bbf7d0;
    width: fit-content;
  }

  .payment-instructions {
    font-size: 16px;
    color: #666;
    margin-bottom: auto;
    margin-top: auto;
  }

  .zenobia-qr-close {
    position: absolute;
    right: 16px;
    top: 16px;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background-color: #f0f0f0;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    transition: all 0.2s ease;
    z-index: 10;
  }

  .zenobia-qr-close:hover {
    background-color: #e0e0e0;
  }

  .zenobia-qr-close svg {
    width: 14px;
    height: 14px;
    stroke: #4b5563;
  }

  .zenobia-qr-placeholder {
    background-color: #e0e0e0;
    border-radius: 12px;
    position: relative;
    overflow: hidden;
  }

  .zenobia-qr-placeholder::after {
    content: "";
    position: absolute;
    top: -100%;
    left: -100%;
    width: 200%;
    height: 200%;
    background: linear-gradient(135deg,
      rgba(255,255,255,0) 0%,
      rgba(255,255,255,1) 50%,
      rgba(255,255,255,0) 100%);
    animation: shimmer 0.8s infinite linear;
    box-shadow: 0 0 30px 30px rgba(255,255,255,0.5);
  }

  @keyframes shimmer {
    0% {
      transform: translate(0%, 0%);
    }
    100% {
      transform: translate(50%, 50%);
    }
  }
  .zenobia-qr-image {
    width: 220px;
    height: 220px;
    object-fit: contain;
    background-color: white;
  }

  .zenobia-qr-instructions {
    font-size: 16px;
    color: #4b5563;
    margin-bottom: 16px;
    text-align: center;
  }

  .zenobia-error {
    color: #ef4444;
    font-size: 14px;
    margin-top: 16px;
    text-align: center;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .test-mode-indicator {
    display: flex;
    align-items: center;
    gap: 6px;
    background-color: #fef3c7;
    color: #92400e;
    padding: 4px 12px;
    border-radius: 16px;
    font-size: 12px;
    font-weight: 500;
    margin-top: 8px;
    width: fit-content;
    border: 1px solid #fbbf24;
  }

  .test-mode-indicator svg {
    color: #92400e;
  }

  .test-mode-indicator:hover {
    background-color: #fde68a;
  }

  .test-mode-badge-wrapper {
    position: static;
    top: unset;
    right: unset;
    z-index: unset;
    display: flex;
    align-items: center;
  }
  .test-mode-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #fef3c7;
    color: #b45309;
    border: 1px solid #fde68a;
    border-radius: 999px;
    padding: 2px 12px 2px 6px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    position: relative;
    outline: none;
    transition: box-shadow 0.2s;
    margin-top: 10px;
  }
  .test-mode-badge:focus {
    box-shadow: 0 0 0 2px #fde68a;
  }
  .test-mode-badge svg {
    flex-shrink: 0;
    display: block;
  }
  .test-mode-badge-text {
    margin-left: 2px;
    margin-right: 2px;
  }
  .test-mode-tooltip {
    display: none;
    position: absolute;
    top: 120%;
    left: 50%;
    transform: translateX(-50%);
    background: #fffbe9;
    color: #b45309;
    border: 1px solid #fde68a;
    border-radius: 8px;
    padding: 8px 14px;
    font-size: 13px;
    font-weight: 500;
    white-space: nowrap;
    box-shadow: 0 4px 16px rgba(0,0,0,0.08);
    z-index: 10;
    pointer-events: none;
  }
  .test-mode-badge:hover .test-mode-tooltip,
  .test-mode-badge:focus .test-mode-tooltip {
    display: block;
  }
`;var _t=(n=>(n.PENDING="PENDING",n.IN_FLIGHT="IN_FLIGHT",n.COMPLETED="COMPLETED",n.FAILED="FAILED",n.CANCELLED="CANCELLED",n))(_t||{});ne(["click"]);var Ae=qt('<div class=test-mode-badge tabindex=0><svg width=16 height=16 viewBox="0 0 20 20"fill=none xmlns=http://www.w3.org/2000/svg><circle cx=10 cy=10 r=9 stroke=#b45309 stroke-width=2 fill=#fef3c7></circle><text x=10 y=15 text-anchor=middle font-size=12 fill=#b45309 font-family=Arial font-weight=bold>i</text></svg><span class=test-mode-badge-text>Test Mode</span><div class=test-mode-tooltip>Test Mode: No real money will be moved.'),$e=qt("<div class=qr-code-container id=qrcode-container>"),ke=qt("<div class=zenobia-error>"),ze=qt('<div class="zenobia-qr-popup-overlay visible"><div class=zenobia-qr-popup-content><button class=zenobia-qr-close><svg viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2><path d="M18 6L6 18M6 6l12 12"></path></svg></button><div class=modal-header><div class=header-content><h3>Pay by bank with Zenobia</h3><p class=subtitle>Scan to complete your purchase</p></div></div><div class=modal-body><div class=payment-amount>$</div><div class=savings-badge></div><div class=payment-status><div class=spinner></div><div class=payment-instructions>'),Me=qt("<div class=qr-code-container><div class=zenobia-qr-placeholder>");const Oe=n=>{const[s,d]=At(null),w={current:null},[m,y]=At(_t.PENDING),[S,x]=At(null),[E,G]=At(!1),[X,Q]=At(null);Yt(()=>{if(n.transferRequestId&&!X()){const L=new me;Q(L),L.listenToTransfer(n.transferRequestId,n.signature||"",lt,et,nt)}}),Yt(()=>{if(n.transferRequestId){const L=n.transferRequestId.replace(/-/g,""),Y=`https://zenobiapay.com/clip?id=${btoa(L).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}`,ut=n.qrCodeSize||220,ht=new Se({width:ut,height:ut,type:"svg",data:Y,image:void 0,dotsOptions:{color:"#000000",type:"dots"},backgroundOptions:{color:"#ffffff"},cornersSquareOptions:{type:"extra-rounded"},cornersDotOptions:{type:"dot"},qrOptions:{errorCorrectionLevel:"M"}});d(ht),w.current&&(w.current.innerHTML="",ht.append(w.current))}});const lt=L=>{console.log("Received status update:",L);let U;switch(L.status){case"COMPLETED":case"IN_FLIGHT":U=_t.COMPLETED,n.onSuccess&&n.onSuccess(L);const Y=X();Y&&(Y.disconnect(),Q(null));break;case"FAILED":U=_t.FAILED;const it=X();it&&(it.disconnect(),Q(null));break;case"CANCELLED":U=_t.CANCELLED;const ut=X();ut&&(ut.disconnect(),Q(null));break;default:U=_t.PENDING}y(U),n.onStatusChange&&n.onStatusChange(U)},et=L=>{console.error("WebSocket error:",L),x(L)},nt=L=>{console.log("WebSocket connection status:",L?"Connected":"Disconnected"),G(L)};ae(()=>{const L=X();L&&L.disconnect()});const R=()=>n.discountAmount!==void 0?n.discountAmount:Math.round(n.amount/100),ct=()=>{const L=R();return L<1e3?`✨ ${(L/n.amount*100).toFixed(0)}% cashback applied!`:`✨ Applied $${(L/100).toFixed(2)} cashback!`};return Ot(Nt,{get when(){return n.isOpen},get children(){var L=ze(),U=L.firstChild,Y=U.firstChild,it=Y.nextSibling,ut=it.firstChild,ht=ut.firstChild;ht.nextSibling;var vt=it.nextSibling,pt=vt.firstChild;pt.firstChild;var wt=pt.nextSibling,St=wt.nextSibling,Ct=St.firstChild,Et=Ct.nextSibling;return pe(Y,"click",n.onClose),mt(ut,Ot(Nt,{get when(){return n.isTest},get children(){return Ae()}}),null),mt(vt,Ot(Nt,{get when(){return s()&&n.transferRequestId},get fallback(){return(()=>{var F=Me(),p=F.firstChild;return F.style.setProperty("display","flex"),F.style.setProperty("justify-content","center"),F.style.setProperty("align-items","center"),$t(g=>{var u=n.qrCodeSize?`${n.qrCodeSize}px`:"220px",e=n.qrCodeSize?`${n.qrCodeSize}px`:"220px",t=n.qrCodeSize?`${n.qrCodeSize}px`:"220px",o=n.qrCodeSize?`${n.qrCodeSize}px`:"220px";return u!==g.e&&((g.e=u)!=null?F.style.setProperty("width",u):F.style.removeProperty("width")),e!==g.t&&((g.t=e)!=null?F.style.setProperty("height",e):F.style.removeProperty("height")),t!==g.a&&((g.a=t)!=null?p.style.setProperty("width",t):p.style.removeProperty("width")),o!==g.o&&((g.o=o)!=null?p.style.setProperty("height",o):p.style.removeProperty("height")),g},{e:void 0,t:void 0,a:void 0,o:void 0}),F})()},get children(){var F=$e();return we(p=>{w.current=p;const g=s();g&&p&&(p.innerHTML="",g.append(p))},F),F.style.setProperty("display","flex"),F.style.setProperty("justify-content","center"),F.style.setProperty("align-items","center"),$t(p=>{var g=n.qrCodeSize?`${n.qrCodeSize}px`:"220px",u=n.qrCodeSize?`${n.qrCodeSize}px`:"220px";return g!==p.e&&((p.e=g)!=null?F.style.setProperty("width",g):F.style.removeProperty("width")),u!==p.t&&((p.t=u)!=null?F.style.setProperty("height",u):F.style.removeProperty("height")),p},{e:void 0,t:void 0}),F}}),pt),mt(pt,()=>(n.amount/100).toFixed(2),null),mt(wt,ct),mt(Et,()=>n.transferRequestId?"Waiting for payment":"Preparing payment..."),mt(vt,Ot(Nt,{get when(){return S()},get children(){var F=ke();return mt(F,S),F}}),null),L}})};ne(["click"]);function qe(){if(!document.getElementById("zenobia-payment-styles")){const n=document.createElement("style");n.id="zenobia-payment-styles",n.textContent=Ce,document.head.appendChild(n)}}function Ee(n){const s=typeof n.target=="string"?document.querySelector(n.target):n.target;if(!s){console.error("[zenobia-pay-modal] target element not found:",n.target);return}qe(),ge(()=>Ot(Oe,{get isOpen(){return n.isOpen},get onClose(){return n.onClose},get transferRequestId(){return n.transferRequestId},get signature(){return n.signature},get amount(){return n.amount},get discountAmount(){return n.discountAmount},get qrCodeSize(){return n.qrCodeSize},get isTest(){return n.isTest},get onSuccess(){return n.onSuccess},get onError(){return n.onError},get onStatusChange(){return n.onStatusChange}}),s)}window.ZenobiaPayModal={init:Ee}})();
