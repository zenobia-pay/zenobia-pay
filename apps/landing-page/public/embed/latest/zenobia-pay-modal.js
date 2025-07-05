(function(){"use strict";const Bt={equals:(n,s)=>n===s};let Qt=Jt;const mt=1,Lt=2,Gt={owned:null,cleanups:null,context:null,owner:null};var V=null;let Ht=null,re=null,Z=null,st=null,bt=null,Tt=0;function se(n,s){const d=Z,g=V,v=n.length===0,_=s===void 0?g:s,S=v?Gt:{owned:null,cleanups:null,context:_?_.context:null,owner:_},y=v?n:()=>n(()=>Ct(()=>Pt(S)));V=S,Z=null;try{return Et(y,!0)}finally{Z=d,V=g}}function vt(n,s){s=s?Object.assign({},Bt,s):Bt;const d={value:n,observers:null,observerSlots:null,comparator:s.equals||void 0},g=v=>(typeof v=="function"&&(v=v(d.value)),Vt(d,v));return[Zt.bind(d),g]}function Ot(n,s,d){const g=Wt(n,s,!1,mt);qt(g)}function Yt(n,s,d){Qt=de;const g=Wt(n,s,!1,mt);g.user=!0,bt?bt.push(g):qt(g)}function St(n,s,d){d=d?Object.assign({},Bt,d):Bt;const g=Wt(n,s,!0,0);return g.observers=null,g.observerSlots=null,g.comparator=d.equals||void 0,qt(g),Zt.bind(g)}function Ct(n){if(Z===null)return n();const s=Z;Z=null;try{return n()}finally{Z=s}}function ae(n){return V===null||(V.cleanups===null?V.cleanups=[n]:V.cleanups.push(n)),n}function Zt(){if(this.sources&&this.state)if(this.state===mt)qt(this);else{const n=st;st=null,Et(()=>Rt(this),!1),st=n}if(Z){const n=this.observers?this.observers.length:0;Z.sources?(Z.sources.push(this),Z.sourceSlots.push(n)):(Z.sources=[this],Z.sourceSlots=[n]),this.observers?(this.observers.push(Z),this.observerSlots.push(Z.sources.length-1)):(this.observers=[Z],this.observerSlots=[Z.sources.length-1])}return this.value}function Vt(n,s,d){let g=n.value;return(!n.comparator||!n.comparator(g,s))&&(n.value=s,n.observers&&n.observers.length&&Et(()=>{for(let v=0;v<n.observers.length;v+=1){const _=n.observers[v],S=Ht&&Ht.running;S&&Ht.disposed.has(_),(S?!_.tState:!_.state)&&(_.pure?st.push(_):bt.push(_),_.observers&&Kt(_)),S||(_.state=mt)}if(st.length>1e6)throw st=[],new Error},!1)),s}function qt(n){if(!n.fn)return;Pt(n);const s=Tt;le(n,n.value,s)}function le(n,s,d){let g;const v=V,_=Z;Z=V=n;try{g=n.fn(s)}catch(S){return n.pure&&(n.state=mt,n.owned&&n.owned.forEach(Pt),n.owned=null),n.updatedAt=d+1,te(S)}finally{Z=_,V=v}(!n.updatedAt||n.updatedAt<=d)&&(n.updatedAt!=null&&"observers"in n?Vt(n,g):n.value=g,n.updatedAt=d)}function Wt(n,s,d,g=mt,v){const _={fn:n,state:g,updatedAt:null,owned:null,sources:null,sourceSlots:null,cleanups:null,value:s,owner:V,context:V?V.context:null,pure:d};return V===null||V!==Gt&&(V.owned?V.owned.push(_):V.owned=[_]),_}function jt(n){if(n.state===0)return;if(n.state===Lt)return Rt(n);if(n.suspense&&Ct(n.suspense.inFallback))return n.suspense.effects.push(n);const s=[n];for(;(n=n.owner)&&(!n.updatedAt||n.updatedAt<Tt);)n.state&&s.push(n);for(let d=s.length-1;d>=0;d--)if(n=s[d],n.state===mt)qt(n);else if(n.state===Lt){const g=st;st=null,Et(()=>Rt(n,s[0]),!1),st=g}}function Et(n,s){if(st)return n();let d=!1;s||(st=[]),bt?d=!0:bt=[],Tt++;try{const g=n();return ce(d),g}catch(g){d||(bt=null),st=null,te(g)}}function ce(n){if(st&&(Jt(st),st=null),n)return;const s=bt;bt=null,s.length&&Et(()=>Qt(s),!1)}function Jt(n){for(let s=0;s<n.length;s++)jt(n[s])}function de(n){let s,d=0;for(s=0;s<n.length;s++){const g=n[s];g.user?n[d++]=g:jt(g)}for(s=0;s<d;s++)jt(n[s])}function Rt(n,s){n.state=0;for(let d=0;d<n.sources.length;d+=1){const g=n.sources[d];if(g.sources){const v=g.state;v===mt?g!==s&&(!g.updatedAt||g.updatedAt<Tt)&&jt(g):v===Lt&&Rt(g,s)}}}function Kt(n){for(let s=0;s<n.observers.length;s+=1){const d=n.observers[s];d.state||(d.state=Lt,d.pure?st.push(d):bt.push(d),d.observers&&Kt(d))}}function Pt(n){let s;if(n.sources)for(;n.sources.length;){const d=n.sources.pop(),g=n.sourceSlots.pop(),v=d.observers;if(v&&v.length){const _=v.pop(),S=d.observerSlots.pop();g<v.length&&(_.sourceSlots[S]=g,v[g]=_,d.observerSlots[g]=S)}}if(n.tOwned){for(s=n.tOwned.length-1;s>=0;s--)Pt(n.tOwned[s]);delete n.tOwned}if(n.owned){for(s=n.owned.length-1;s>=0;s--)Pt(n.owned[s]);n.owned=null}if(n.cleanups){for(s=n.cleanups.length-1;s>=0;s--)n.cleanups[s]();n.cleanups=null}n.state=0}function ue(n){return n instanceof Error?n:new Error(typeof n=="string"?n:"Unknown error",{cause:n})}function te(n,s=V){throw ue(n)}function kt(n,s){return Ct(()=>n(s||{}))}const he=n=>`Stale read from <${n}>.`;function Dt(n){const s=n.keyed,d=St(()=>n.when,void 0,void 0),g=s?d:St(d,void 0,{equals:(v,_)=>!v==!_});return St(()=>{const v=g();if(v){const _=n.children;return typeof _=="function"&&_.length>0?Ct(()=>_(s?v:()=>{if(!Ct(g))throw he("Show");return d()})):_}return n.fallback},void 0,void 0)}function fe(n,s,d){let g=d.length,v=s.length,_=g,S=0,y=0,E=s[v-1].nextSibling,Q=null;for(;S<v||y<_;){if(s[S]===d[y]){S++,y++;continue}for(;s[v-1]===d[_-1];)v--,_--;if(v===S){const H=_<g?y?d[y-1].nextSibling:d[_-y]:E;for(;y<_;)n.insertBefore(d[y++],H)}else if(_===y)for(;S<v;)(!Q||!Q.has(s[S]))&&s[S].remove(),S++;else if(s[S]===d[_-1]&&d[y]===s[v-1]){const H=s[--v].nextSibling;n.insertBefore(d[y++],s[S++].nextSibling),n.insertBefore(d[--_],H),s[v]=d[_]}else{if(!Q){Q=new Map;let W=y;for(;W<_;)Q.set(d[W],W++)}const H=Q.get(s[S]);if(H!=null)if(y<H&&H<_){let W=S,J=1,nt;for(;++W<v&&W<_&&!((nt=Q.get(s[W]))==null||nt!==H+J);)J++;if(J>H-y){const ot=s[S];for(;y<H;)n.insertBefore(d[y++],ot)}else n.replaceChild(d[y++],s[S++])}else S++;else s[S++].remove()}}}const ee="_$DX_DELEGATE";function ge(n,s,d,g={}){let v;return se(_=>{v=_,s===document?n():yt(s,n(),s.firstChild?null:void 0,d)},g.owner),()=>{v(),s.textContent=""}}function At(n,s,d,g){let v;const _=()=>{const y=document.createElement("template");return y.innerHTML=n,y.content.firstChild},S=()=>(v||(v=_())).cloneNode(!0);return S.cloneNode=S,S}function ne(n,s=window.document){const d=s[ee]||(s[ee]=new Set);for(let g=0,v=n.length;g<v;g++){const _=n[g];d.has(_)||(d.add(_),s.addEventListener(_,be))}}function pe(n,s,d,g){Array.isArray(d)?(n[`$$${s}`]=d[0],n[`$$${s}Data`]=d[1]):n[`$$${s}`]=d}function we(n,s,d){return Ct(()=>n(s,d))}function yt(n,s,d,g){if(d!==void 0&&!g&&(g=[]),typeof s!="function")return Nt(n,s,g,d);Ot(v=>Nt(n,s(),v,d),g)}function be(n){let s=n.target;const d=`$$${n.type}`,g=n.target,v=n.currentTarget,_=E=>Object.defineProperty(n,"target",{configurable:!0,value:E}),S=()=>{const E=s[d];if(E&&!s.disabled){const Q=s[`${d}Data`];if(Q!==void 0?E.call(s,Q,n):E.call(s,n),n.cancelBubble)return}return s.host&&typeof s.host!="string"&&!s.host._$host&&s.contains(n.target)&&_(s.host),!0},y=()=>{for(;S()&&(s=s._$host||s.parentNode||s.host););};if(Object.defineProperty(n,"currentTarget",{configurable:!0,get(){return s||document}}),n.composedPath){const E=n.composedPath();_(E[0]);for(let Q=0;Q<E.length-2&&(s=E[Q],!!S());Q++){if(s._$host){s=s._$host,y();break}if(s.parentNode===v)break}}else y();_(g)}function Nt(n,s,d,g,v){for(;typeof d=="function";)d=d();if(s===d)return d;const _=typeof s,S=g!==void 0;if(n=S&&d[0]&&d[0].parentNode||n,_==="string"||_==="number"){if(_==="number"&&(s=s.toString(),s===d))return d;if(S){let y=d[0];y&&y.nodeType===3?y.data!==s&&(y.data=s):y=document.createTextNode(s),d=$t(n,d,g,y)}else d!==""&&typeof d=="string"?d=n.firstChild.data=s:d=n.textContent=s}else if(s==null||_==="boolean")d=$t(n,d,g);else{if(_==="function")return Ot(()=>{let y=s();for(;typeof y=="function";)y=y();d=Nt(n,y,d,g)}),()=>d;if(Array.isArray(s)){const y=[],E=d&&Array.isArray(d);if(Xt(y,s,d,v))return Ot(()=>d=Nt(n,y,d,g,!0)),()=>d;if(y.length===0){if(d=$t(n,d,g),S)return d}else E?d.length===0?ie(n,y,g):fe(n,d,y):(d&&$t(n),ie(n,y));d=y}else if(s.nodeType){if(Array.isArray(d)){if(S)return d=$t(n,d,g,s);$t(n,d,null,s)}else d==null||d===""||!n.firstChild?n.appendChild(s):n.replaceChild(s,n.firstChild);d=s}}return d}function Xt(n,s,d,g){let v=!1;for(let _=0,S=s.length;_<S;_++){let y=s[_],E=d&&d[n.length],Q;if(!(y==null||y===!0||y===!1))if((Q=typeof y)=="object"&&y.nodeType)n.push(y);else if(Array.isArray(y))v=Xt(n,y,E)||v;else if(Q==="function")if(g){for(;typeof y=="function";)y=y();v=Xt(n,Array.isArray(y)?y:[y],Array.isArray(E)?E:[E])||v}else n.push(y),v=!0;else{const H=String(y);E&&E.nodeType===3&&E.data===H?n.push(E):n.push(document.createTextNode(H))}}return v}function ie(n,s,d=null){for(let g=0,v=s.length;g<v;g++)n.insertBefore(s[g],d)}function $t(n,s,d,g){if(d===void 0)return n.textContent="";const v=g||document.createTextNode("");if(s.length){let _=!1;for(let S=s.length-1;S>=0;S--){const y=s[S];if(v!==y){const E=y.parentNode===n;!_&&!S?E?n.replaceChild(v,y):n.insertBefore(v,d):E&&y.remove()}else _=!0}}else n.insertBefore(v,d);return[v]}class me{constructor(s=!1){this.socket=null,this.reconnectTimeout=null,this.reconnectAttempts=0,this.maxReconnectAttempts=6,this.transferId=null,this.signature=null,this.onStatusCallback=null,this.onErrorCallback=null,this.onConnectionCallback=null,this.onScanCallback=null,this.wsBaseUrl=s?"transfer-status-test.zenobiapay.com":"transfer-status.zenobiapay.com"}getSignature(){return this.signature}getTransferId(){return this.transferId}async createTransfer(s,d){try{const g=await fetch(s,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(d)});if(!g.ok){const _=await g.json();throw new Error(_.message||"Failed to create transfer request")}const v=await g.json();return this.transferId=v.transferRequestId,this.signature=v.signature,v}catch(g){throw console.error("Error creating transfer request:",g),g instanceof Error?g:new Error("Failed to create transfer request")}}listenToTransfer(s,d,g,v,_,S){this.transferId=s,this.signature=d,g&&(this.onStatusCallback=g),v&&(this.onErrorCallback=v),_&&(this.onConnectionCallback=_),S&&(this.onScanCallback=S),this.connectWebSocket()}async createTransferAndListen(s,d,g,v,_,S){const y=await this.createTransfer(s,d);return this.listenToTransfer(y.transferRequestId,y.signature,g,v,_,S),y}connectWebSocket(){if(this.socket&&(this.socket.close(),this.socket=null,this.notifyConnectionStatus(!1)),!this.transferId||!this.signature){console.error("Cannot connect to WebSocket: Missing transfer ID or signature");return}try{const d=`${window.location.protocol==="https:"?"wss:":"ws:"}//${this.wsBaseUrl}/transfers/${this.transferId}/ws?token=${this.signature}`,g=new WebSocket(d);this.socket=g,g.onopen=()=>{this.notifyConnectionStatus(!0),this.reconnectAttempts=0},g.onclose=v=>{this.notifyConnectionStatus(!1),this.socket=null,v.code!==1e3&&this.reconnectAttempts<this.maxReconnectAttempts&&this.attemptReconnect()},g.onerror=v=>{console.error(`WebSocket error for transfer: ${this.transferId}`,v),this.notifyError("WebSocket error occurred")},g.onmessage=v=>{console.log(`WebSocket message received for transfer: ${this.transferId}`,v.data);try{const _=JSON.parse(v.data);_.type==="status"&&_.transfer?this.notifyStatus(_.transfer):_.type==="error"&&_.message?this.notifyError(_.message):_.type==="scan"?this.notifyScan(_):_.type==="ping"&&g.readyState===WebSocket.OPEN&&g.send(JSON.stringify({type:"pong"}))}catch{this.notifyError("Failed to parse message")}}}catch{this.notifyError("Failed to establish WebSocket connection")}}attemptReconnect(){this.reconnectAttempts++;const s=Math.min(1e3*Math.pow(2,this.reconnectAttempts-1),3e4);console.log(`Attempting to reconnect in ${s}ms (attempt ${this.reconnectAttempts})`),this.reconnectTimeout&&window.clearTimeout(this.reconnectTimeout),this.reconnectTimeout=window.setTimeout(()=>{console.log(`Reconnecting to WebSocket (attempt ${this.reconnectAttempts})...`),this.connectWebSocket()},s)}disconnect(){this.reconnectTimeout&&(window.clearTimeout(this.reconnectTimeout),this.reconnectTimeout=null),this.socket&&this.socket.readyState<2&&(console.log(`Closing WebSocket for transfer: ${this.transferId}`),this.socket.close(),this.socket=null,this.notifyConnectionStatus(!1)),this.transferId=null,this.signature=null}notifyConnectionStatus(s){this.onConnectionCallback&&this.onConnectionCallback(s)}notifyStatus(s){this.onStatusCallback&&this.onStatusCallback(s)}notifyError(s){this.onErrorCallback&&this.onErrorCallback(s)}notifyScan(s){this.onScanCallback&&this.onScanCallback(s)}}function ve(n){return n&&n.__esModule&&Object.prototype.hasOwnProperty.call(n,"default")?n.default:n}var Ft={exports:{}},ye=Ft.exports,oe;function xe(){return oe||(oe=1,function(n,s){(function(d,g){n.exports=g()})(ye,()=>(()=>{var d={873:(S,y)=>{var E,Q,H=function(){var W=function(p,w){var u=p,e=gt[w],t=null,o=0,r=null,i=[],c={},x=function(a,h){t=function(l){for(var f=new Array(l),b=0;b<l;b+=1){f[b]=new Array(l);for(var z=0;z<l;z+=1)f[b][z]=null}return f}(o=4*u+17),m(0,0),m(o-7,0),m(0,o-7),C(),A(),k(a,h),u>=7&&$(a),r==null&&(r=B(u,e,i)),M(r,h)},m=function(a,h){for(var l=-1;l<=7;l+=1)if(!(a+l<=-1||o<=a+l))for(var f=-1;f<=7;f+=1)h+f<=-1||o<=h+f||(t[a+l][h+f]=0<=l&&l<=6&&(f==0||f==6)||0<=f&&f<=6&&(l==0||l==6)||2<=l&&l<=4&&2<=f&&f<=4)},A=function(){for(var a=8;a<o-8;a+=1)t[a][6]==null&&(t[a][6]=a%2==0);for(var h=8;h<o-8;h+=1)t[6][h]==null&&(t[6][h]=h%2==0)},C=function(){for(var a=K.getPatternPosition(u),h=0;h<a.length;h+=1)for(var l=0;l<a.length;l+=1){var f=a[h],b=a[l];if(t[f][b]==null)for(var z=-2;z<=2;z+=1)for(var P=-2;P<=2;P+=1)t[f+z][b+P]=z==-2||z==2||P==-2||P==2||z==0&&P==0}},$=function(a){for(var h=K.getBCHTypeNumber(u),l=0;l<18;l+=1){var f=!a&&(h>>l&1)==1;t[Math.floor(l/3)][l%3+o-8-3]=f}for(l=0;l<18;l+=1)f=!a&&(h>>l&1)==1,t[l%3+o-8-3][Math.floor(l/3)]=f},k=function(a,h){for(var l=e<<3|h,f=K.getBCHTypeInfo(l),b=0;b<15;b+=1){var z=!a&&(f>>b&1)==1;b<6?t[b][8]=z:b<8?t[b+1][8]=z:t[o-15+b][8]=z}for(b=0;b<15;b+=1)z=!a&&(f>>b&1)==1,b<8?t[8][o-b-1]=z:b<9?t[8][15-b-1+1]=z:t[8][15-b-1]=z;t[o-8][8]=!a},M=function(a,h){for(var l=-1,f=o-1,b=7,z=0,P=K.getMaskFunction(h),I=o-1;I>0;I-=2)for(I==6&&(I-=1);;){for(var T=0;T<2;T+=1)if(t[f][I-T]==null){var j=!1;z<a.length&&(j=(a[z]>>>b&1)==1),P(f,I-T)&&(j=!j),t[f][I-T]=j,(b-=1)==-1&&(z+=1,b=7)}if((f+=l)<0||o<=f){f-=l,l=-l;break}}},B=function(a,h,l){for(var f=Mt.getRSBlocks(a,h),b=xt(),z=0;z<l.length;z+=1){var P=l[z];b.put(P.getMode(),4),b.put(P.getLength(),K.getLengthInBits(P.getMode(),a)),P.write(b)}var I=0;for(z=0;z<f.length;z+=1)I+=f[z].dataCount;if(b.getLengthInBits()>8*I)throw"code length overflow. ("+b.getLengthInBits()+">"+8*I+")";for(b.getLengthInBits()+4<=8*I&&b.put(0,4);b.getLengthInBits()%8!=0;)b.putBit(!1);for(;!(b.getLengthInBits()>=8*I||(b.put(236,8),b.getLengthInBits()>=8*I));)b.put(17,8);return function(T,j){for(var F=0,rt=0,Y=0,U=new Array(j.length),R=new Array(j.length),O=0;O<j.length;O+=1){var G=j[O].dataCount,et=j[O].totalCount-G;rt=Math.max(rt,G),Y=Math.max(Y,et),U[O]=new Array(G);for(var D=0;D<U[O].length;D+=1)U[O][D]=255&T.getBuffer()[D+F];F+=G;var ut=K.getErrorCorrectPolynomial(et),lt=ht(U[O],ut.getLength()-1).mod(ut);for(R[O]=new Array(ut.getLength()-1),D=0;D<R[O].length;D+=1){var at=D+lt.getLength()-R[O].length;R[O][D]=at>=0?lt.getAt(at):0}}var Ut=0;for(D=0;D<j.length;D+=1)Ut+=j[D].totalCount;var It=new Array(Ut),wt=0;for(D=0;D<rt;D+=1)for(O=0;O<j.length;O+=1)D<U[O].length&&(It[wt]=U[O][D],wt+=1);for(D=0;D<Y;D+=1)for(O=0;O<j.length;O+=1)D<R[O].length&&(It[wt]=R[O][D],wt+=1);return It}(b,f)};c.addData=function(a,h){var l=null;switch(h=h||"Byte"){case"Numeric":l=L(a);break;case"Alphanumeric":l=it(a);break;case"Byte":l=X(a);break;case"Kanji":l=dt(a);break;default:throw"mode:"+h}i.push(l),r=null},c.isDark=function(a,h){if(a<0||o<=a||h<0||o<=h)throw a+","+h;return t[a][h]},c.getModuleCount=function(){return o},c.make=function(){if(u<1){for(var a=1;a<40;a++){for(var h=Mt.getRSBlocks(a,e),l=xt(),f=0;f<i.length;f++){var b=i[f];l.put(b.getMode(),4),l.put(b.getLength(),K.getLengthInBits(b.getMode(),a)),b.write(l)}var z=0;for(f=0;f<h.length;f++)z+=h[f].dataCount;if(l.getLengthInBits()<=8*z)break}u=a}x(!1,function(){for(var P=0,I=0,T=0;T<8;T+=1){x(!0,T);var j=K.getLostPoint(c);(T==0||P>j)&&(P=j,I=T)}return I}())},c.createTableTag=function(a,h){a=a||2;var l="";l+='<table style="',l+=" border-width: 0px; border-style: none;",l+=" border-collapse: collapse;",l+=" padding: 0px; margin: "+(h=h===void 0?4*a:h)+"px;",l+='">',l+="<tbody>";for(var f=0;f<c.getModuleCount();f+=1){l+="<tr>";for(var b=0;b<c.getModuleCount();b+=1)l+='<td style="',l+=" border-width: 0px; border-style: none;",l+=" border-collapse: collapse;",l+=" padding: 0px; margin: 0px;",l+=" width: "+a+"px;",l+=" height: "+a+"px;",l+=" background-color: ",l+=c.isDark(f,b)?"#000000":"#ffffff",l+=";",l+='"/>';l+="</tr>"}return(l+="</tbody>")+"</table>"},c.createSvgTag=function(a,h,l,f){var b={};typeof arguments[0]=="object"&&(a=(b=arguments[0]).cellSize,h=b.margin,l=b.alt,f=b.title),a=a||2,h=h===void 0?4*a:h,(l=typeof l=="string"?{text:l}:l||{}).text=l.text||null,l.id=l.text?l.id||"qrcode-description":null,(f=typeof f=="string"?{text:f}:f||{}).text=f.text||null,f.id=f.text?f.id||"qrcode-title":null;var z,P,I,T,j=c.getModuleCount()*a+2*h,F="";for(T="l"+a+",0 0,"+a+" -"+a+",0 0,-"+a+"z ",F+='<svg version="1.1" xmlns="http://www.w3.org/2000/svg"',F+=b.scalable?"":' width="'+j+'px" height="'+j+'px"',F+=' viewBox="0 0 '+j+" "+j+'" ',F+=' preserveAspectRatio="xMinYMin meet"',F+=f.text||l.text?' role="img" aria-labelledby="'+q([f.id,l.id].join(" ").trim())+'"':"",F+=">",F+=f.text?'<title id="'+q(f.id)+'">'+q(f.text)+"</title>":"",F+=l.text?'<description id="'+q(l.id)+'">'+q(l.text)+"</description>":"",F+='<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>',F+='<path d="',P=0;P<c.getModuleCount();P+=1)for(I=P*a+h,z=0;z<c.getModuleCount();z+=1)c.isDark(P,z)&&(F+="M"+(z*a+h)+","+I+T);return(F+='" stroke="transparent" fill="black"/>')+"</svg>"},c.createDataURL=function(a,h){a=a||2,h=h===void 0?4*a:h;var l=c.getModuleCount()*a+2*h,f=h,b=l-h;return ft(l,l,function(z,P){if(f<=z&&z<b&&f<=P&&P<b){var I=Math.floor((z-f)/a),T=Math.floor((P-f)/a);return c.isDark(T,I)?0:1}return 1})},c.createImgTag=function(a,h,l){a=a||2,h=h===void 0?4*a:h;var f=c.getModuleCount()*a+2*h,b="";return b+="<img",b+=' src="',b+=c.createDataURL(a,h),b+='"',b+=' width="',b+=f,b+='"',b+=' height="',b+=f,b+='"',l&&(b+=' alt="',b+=q(l),b+='"'),b+"/>"};var q=function(a){for(var h="",l=0;l<a.length;l+=1){var f=a.charAt(l);switch(f){case"<":h+="&lt;";break;case">":h+="&gt;";break;case"&":h+="&amp;";break;case'"':h+="&quot;";break;default:h+=f}}return h};return c.createASCII=function(a,h){if((a=a||1)<2)return function(U){U=U===void 0?2:U;var R,O,G,et,D,ut=1*c.getModuleCount()+2*U,lt=U,at=ut-U,Ut={"██":"█","█ ":"▀"," █":"▄","  ":" "},It={"██":"▀","█ ":"▀"," █":" ","  ":" "},wt="";for(R=0;R<ut;R+=2){for(G=Math.floor((R-lt)/1),et=Math.floor((R+1-lt)/1),O=0;O<ut;O+=1)D="█",lt<=O&&O<at&&lt<=R&&R<at&&c.isDark(G,Math.floor((O-lt)/1))&&(D=" "),lt<=O&&O<at&&lt<=R+1&&R+1<at&&c.isDark(et,Math.floor((O-lt)/1))?D+=" ":D+="█",wt+=U<1&&R+1>=at?It[D]:Ut[D];wt+=`
`}return ut%2&&U>0?wt.substring(0,wt.length-ut-1)+Array(ut+1).join("▀"):wt.substring(0,wt.length-1)}(h);a-=1,h=h===void 0?2*a:h;var l,f,b,z,P=c.getModuleCount()*a+2*h,I=h,T=P-h,j=Array(a+1).join("██"),F=Array(a+1).join("  "),rt="",Y="";for(l=0;l<P;l+=1){for(b=Math.floor((l-I)/a),Y="",f=0;f<P;f+=1)z=1,I<=f&&f<T&&I<=l&&l<T&&c.isDark(b,Math.floor((f-I)/a))&&(z=0),Y+=z?j:F;for(b=0;b<a;b+=1)rt+=Y+`
`}return rt.substring(0,rt.length-1)},c.renderTo2dContext=function(a,h){h=h||2;for(var l=c.getModuleCount(),f=0;f<l;f++)for(var b=0;b<l;b++)a.fillStyle=c.isDark(f,b)?"black":"white",a.fillRect(f*h,b*h,h,h)},c};W.stringToBytes=(W.stringToBytesFuncs={default:function(p){for(var w=[],u=0;u<p.length;u+=1){var e=p.charCodeAt(u);w.push(255&e)}return w}}).default,W.createStringToBytes=function(p,w){var u=function(){for(var t=_t(p),o=function(){var A=t.read();if(A==-1)throw"eof";return A},r=0,i={};;){var c=t.read();if(c==-1)break;var x=o(),m=o()<<8|o();i[String.fromCharCode(c<<8|x)]=m,r+=1}if(r!=w)throw r+" != "+w;return i}(),e=63;return function(t){for(var o=[],r=0;r<t.length;r+=1){var i=t.charCodeAt(r);if(i<128)o.push(i);else{var c=u[t.charAt(r)];typeof c=="number"?(255&c)==c?o.push(c):(o.push(c>>>8),o.push(255&c)):o.push(e)}}return o}};var J,nt,ot,N,ct,gt={L:1,M:0,Q:3,H:2},K=(J=[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],nt=1335,ot=7973,ct=function(p){for(var w=0;p!=0;)w+=1,p>>>=1;return w},(N={}).getBCHTypeInfo=function(p){for(var w=p<<10;ct(w)-ct(nt)>=0;)w^=nt<<ct(w)-ct(nt);return 21522^(p<<10|w)},N.getBCHTypeNumber=function(p){for(var w=p<<12;ct(w)-ct(ot)>=0;)w^=ot<<ct(w)-ct(ot);return p<<12|w},N.getPatternPosition=function(p){return J[p-1]},N.getMaskFunction=function(p){switch(p){case 0:return function(w,u){return(w+u)%2==0};case 1:return function(w,u){return w%2==0};case 2:return function(w,u){return u%3==0};case 3:return function(w,u){return(w+u)%3==0};case 4:return function(w,u){return(Math.floor(w/2)+Math.floor(u/3))%2==0};case 5:return function(w,u){return w*u%2+w*u%3==0};case 6:return function(w,u){return(w*u%2+w*u%3)%2==0};case 7:return function(w,u){return(w*u%3+(w+u)%2)%2==0};default:throw"bad maskPattern:"+p}},N.getErrorCorrectPolynomial=function(p){for(var w=ht([1],0),u=0;u<p;u+=1)w=w.multiply(ht([1,tt.gexp(u)],0));return w},N.getLengthInBits=function(p,w){if(1<=w&&w<10)switch(p){case 1:return 10;case 2:return 9;case 4:case 8:return 8;default:throw"mode:"+p}else if(w<27)switch(p){case 1:return 12;case 2:return 11;case 4:return 16;case 8:return 10;default:throw"mode:"+p}else{if(!(w<41))throw"type:"+w;switch(p){case 1:return 14;case 2:return 13;case 4:return 16;case 8:return 12;default:throw"mode:"+p}}},N.getLostPoint=function(p){for(var w=p.getModuleCount(),u=0,e=0;e<w;e+=1)for(var t=0;t<w;t+=1){for(var o=0,r=p.isDark(e,t),i=-1;i<=1;i+=1)if(!(e+i<0||w<=e+i))for(var c=-1;c<=1;c+=1)t+c<0||w<=t+c||i==0&&c==0||r==p.isDark(e+i,t+c)&&(o+=1);o>5&&(u+=3+o-5)}for(e=0;e<w-1;e+=1)for(t=0;t<w-1;t+=1){var x=0;p.isDark(e,t)&&(x+=1),p.isDark(e+1,t)&&(x+=1),p.isDark(e,t+1)&&(x+=1),p.isDark(e+1,t+1)&&(x+=1),x!=0&&x!=4||(u+=3)}for(e=0;e<w;e+=1)for(t=0;t<w-6;t+=1)p.isDark(e,t)&&!p.isDark(e,t+1)&&p.isDark(e,t+2)&&p.isDark(e,t+3)&&p.isDark(e,t+4)&&!p.isDark(e,t+5)&&p.isDark(e,t+6)&&(u+=40);for(t=0;t<w;t+=1)for(e=0;e<w-6;e+=1)p.isDark(e,t)&&!p.isDark(e+1,t)&&p.isDark(e+2,t)&&p.isDark(e+3,t)&&p.isDark(e+4,t)&&!p.isDark(e+5,t)&&p.isDark(e+6,t)&&(u+=40);var m=0;for(t=0;t<w;t+=1)for(e=0;e<w;e+=1)p.isDark(e,t)&&(m+=1);return u+Math.abs(100*m/w/w-50)/5*10},N),tt=function(){for(var p=new Array(256),w=new Array(256),u=0;u<8;u+=1)p[u]=1<<u;for(u=8;u<256;u+=1)p[u]=p[u-4]^p[u-5]^p[u-6]^p[u-8];for(u=0;u<255;u+=1)w[p[u]]=u;return{glog:function(e){if(e<1)throw"glog("+e+")";return w[e]},gexp:function(e){for(;e<0;)e+=255;for(;e>=256;)e-=255;return p[e]}}}();function ht(p,w){if(p.length===void 0)throw p.length+"/"+w;var u=function(){for(var t=0;t<p.length&&p[t]==0;)t+=1;for(var o=new Array(p.length-t+w),r=0;r<p.length-t;r+=1)o[r]=p[r+t];return o}(),e={getAt:function(t){return u[t]},getLength:function(){return u.length},multiply:function(t){for(var o=new Array(e.getLength()+t.getLength()-1),r=0;r<e.getLength();r+=1)for(var i=0;i<t.getLength();i+=1)o[r+i]^=tt.gexp(tt.glog(e.getAt(r))+tt.glog(t.getAt(i)));return ht(o,0)},mod:function(t){if(e.getLength()-t.getLength()<0)return e;for(var o=tt.glog(e.getAt(0))-tt.glog(t.getAt(0)),r=new Array(e.getLength()),i=0;i<e.getLength();i+=1)r[i]=e.getAt(i);for(i=0;i<t.getLength();i+=1)r[i]^=tt.gexp(tt.glog(t.getAt(i))+o);return ht(r,0).mod(t)}};return e}var Mt=function(){var p=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12,7,37,13],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]],w=function(e,t){var o={};return o.totalCount=e,o.dataCount=t,o},u={getRSBlocks:function(e,t){var o=function($,k){switch(k){case gt.L:return p[4*($-1)+0];case gt.M:return p[4*($-1)+1];case gt.Q:return p[4*($-1)+2];case gt.H:return p[4*($-1)+3];default:return}}(e,t);if(o===void 0)throw"bad rs block @ typeNumber:"+e+"/errorCorrectionLevel:"+t;for(var r=o.length/3,i=[],c=0;c<r;c+=1)for(var x=o[3*c+0],m=o[3*c+1],A=o[3*c+2],C=0;C<x;C+=1)i.push(w(m,A));return i}};return u}(),xt=function(){var p=[],w=0,u={getBuffer:function(){return p},getAt:function(e){var t=Math.floor(e/8);return(p[t]>>>7-e%8&1)==1},put:function(e,t){for(var o=0;o<t;o+=1)u.putBit((e>>>t-o-1&1)==1)},getLengthInBits:function(){return w},putBit:function(e){var t=Math.floor(w/8);p.length<=t&&p.push(0),e&&(p[t]|=128>>>w%8),w+=1}};return u},L=function(p){var w=p,u={getMode:function(){return 1},getLength:function(o){return w.length},write:function(o){for(var r=w,i=0;i+2<r.length;)o.put(e(r.substring(i,i+3)),10),i+=3;i<r.length&&(r.length-i==1?o.put(e(r.substring(i,i+1)),4):r.length-i==2&&o.put(e(r.substring(i,i+2)),7))}},e=function(o){for(var r=0,i=0;i<o.length;i+=1)r=10*r+t(o.charAt(i));return r},t=function(o){if("0"<=o&&o<="9")return o.charCodeAt(0)-48;throw"illegal char :"+o};return u},it=function(p){var w=p,u={getMode:function(){return 2},getLength:function(t){return w.length},write:function(t){for(var o=w,r=0;r+1<o.length;)t.put(45*e(o.charAt(r))+e(o.charAt(r+1)),11),r+=2;r<o.length&&t.put(e(o.charAt(r)),6)}},e=function(t){if("0"<=t&&t<="9")return t.charCodeAt(0)-48;if("A"<=t&&t<="Z")return t.charCodeAt(0)-65+10;switch(t){case" ":return 36;case"$":return 37;case"%":return 38;case"*":return 39;case"+":return 40;case"-":return 41;case".":return 42;case"/":return 43;case":":return 44;default:throw"illegal char :"+t}};return u},X=function(p){var w=W.stringToBytes(p);return{getMode:function(){return 4},getLength:function(u){return w.length},write:function(u){for(var e=0;e<w.length;e+=1)u.put(w[e],8)}}},dt=function(p){var w=W.stringToBytesFuncs.SJIS;if(!w)throw"sjis not supported.";(function(){var t=w("友");if(t.length!=2||(t[0]<<8|t[1])!=38726)throw"sjis not supported."})();var u=w(p),e={getMode:function(){return 8},getLength:function(t){return~~(u.length/2)},write:function(t){for(var o=u,r=0;r+1<o.length;){var i=(255&o[r])<<8|255&o[r+1];if(33088<=i&&i<=40956)i-=33088;else{if(!(57408<=i&&i<=60351))throw"illegal char at "+(r+1)+"/"+i;i-=49472}i=192*(i>>>8&255)+(255&i),t.put(i,13),r+=2}if(r<o.length)throw"illegal char at "+(r+1)}};return e},pt=function(){var p=[],w={writeByte:function(u){p.push(255&u)},writeShort:function(u){w.writeByte(u),w.writeByte(u>>>8)},writeBytes:function(u,e,t){e=e||0,t=t||u.length;for(var o=0;o<t;o+=1)w.writeByte(u[o+e])},writeString:function(u){for(var e=0;e<u.length;e+=1)w.writeByte(u.charCodeAt(e))},toByteArray:function(){return p},toString:function(){var u="";u+="[";for(var e=0;e<p.length;e+=1)e>0&&(u+=","),u+=p[e];return u+"]"}};return w},_t=function(p){var w=p,u=0,e=0,t=0,o={read:function(){for(;t<8;){if(u>=w.length){if(t==0)return-1;throw"unexpected end of file./"+t}var i=w.charAt(u);if(u+=1,i=="=")return t=0,-1;i.match(/^\s$/)||(e=e<<6|r(i.charCodeAt(0)),t+=6)}var c=e>>>t-8&255;return t-=8,c}},r=function(i){if(65<=i&&i<=90)return i-65;if(97<=i&&i<=122)return i-97+26;if(48<=i&&i<=57)return i-48+52;if(i==43)return 62;if(i==47)return 63;throw"c:"+i};return o},ft=function(p,w,u){for(var e=function(m,A){var C=m,$=A,k=new Array(m*A),M={setPixel:function(a,h,l){k[h*C+a]=l},write:function(a){a.writeString("GIF87a"),a.writeShort(C),a.writeShort($),a.writeByte(128),a.writeByte(0),a.writeByte(0),a.writeByte(0),a.writeByte(0),a.writeByte(0),a.writeByte(255),a.writeByte(255),a.writeByte(255),a.writeString(","),a.writeShort(0),a.writeShort(0),a.writeShort(C),a.writeShort($),a.writeByte(0);var h=B(2);a.writeByte(2);for(var l=0;h.length-l>255;)a.writeByte(255),a.writeBytes(h,l,255),l+=255;a.writeByte(h.length-l),a.writeBytes(h,l,h.length-l),a.writeByte(0),a.writeString(";")}},B=function(a){for(var h=1<<a,l=1+(1<<a),f=a+1,b=q(),z=0;z<h;z+=1)b.add(String.fromCharCode(z));b.add(String.fromCharCode(h)),b.add(String.fromCharCode(l));var P,I,T,j=pt(),F=(P=j,I=0,T=0,{write:function(R,O){if(R>>>O)throw"length over";for(;I+O>=8;)P.writeByte(255&(R<<I|T)),O-=8-I,R>>>=8-I,T=0,I=0;T|=R<<I,I+=O},flush:function(){I>0&&P.writeByte(T)}});F.write(h,f);var rt=0,Y=String.fromCharCode(k[rt]);for(rt+=1;rt<k.length;){var U=String.fromCharCode(k[rt]);rt+=1,b.contains(Y+U)?Y+=U:(F.write(b.indexOf(Y),f),b.size()<4095&&(b.size()==1<<f&&(f+=1),b.add(Y+U)),Y=U)}return F.write(b.indexOf(Y),f),F.write(l,f),F.flush(),j.toByteArray()},q=function(){var a={},h=0,l={add:function(f){if(l.contains(f))throw"dup key:"+f;a[f]=h,h+=1},size:function(){return h},indexOf:function(f){return a[f]},contains:function(f){return a[f]!==void 0}};return l};return M}(p,w),t=0;t<w;t+=1)for(var o=0;o<p;o+=1)e.setPixel(o,t,u(o,t));var r=pt();e.write(r);for(var i=function(){var m=0,A=0,C=0,$="",k={},M=function(q){$+=String.fromCharCode(B(63&q))},B=function(q){if(!(q<0)){if(q<26)return 65+q;if(q<52)return q-26+97;if(q<62)return q-52+48;if(q==62)return 43;if(q==63)return 47}throw"n:"+q};return k.writeByte=function(q){for(m=m<<8|255&q,A+=8,C+=1;A>=6;)M(m>>>A-6),A-=6},k.flush=function(){if(A>0&&(M(m<<6-A),m=0,A=0),C%3!=0)for(var q=3-C%3,a=0;a<q;a+=1)$+="="},k.toString=function(){return $},k}(),c=r.toByteArray(),x=0;x<c.length;x+=1)i.writeByte(c[x]);return i.flush(),"data:image/gif;base64,"+i};return W}();H.stringToBytesFuncs["UTF-8"]=function(W){return function(J){for(var nt=[],ot=0;ot<J.length;ot++){var N=J.charCodeAt(ot);N<128?nt.push(N):N<2048?nt.push(192|N>>6,128|63&N):N<55296||N>=57344?nt.push(224|N>>12,128|N>>6&63,128|63&N):(ot++,N=65536+((1023&N)<<10|1023&J.charCodeAt(ot)),nt.push(240|N>>18,128|N>>12&63,128|N>>6&63,128|63&N))}return nt}(W)},(Q=typeof(E=function(){return H})=="function"?E.apply(y,[]):E)===void 0||(S.exports=Q)}},g={};function v(S){var y=g[S];if(y!==void 0)return y.exports;var E=g[S]={exports:{}};return d[S](E,E.exports,v),E.exports}v.n=S=>{var y=S&&S.__esModule?()=>S.default:()=>S;return v.d(y,{a:y}),y},v.d=(S,y)=>{for(var E in y)v.o(y,E)&&!v.o(S,E)&&Object.defineProperty(S,E,{enumerable:!0,get:y[E]})},v.o=(S,y)=>Object.prototype.hasOwnProperty.call(S,y);var _={};return(()=>{v.d(_,{default:()=>w});const S=u=>!!u&&typeof u=="object"&&!Array.isArray(u);function y(u,...e){if(!e.length)return u;const t=e.shift();return t!==void 0&&S(u)&&S(t)?(u=Object.assign({},u),Object.keys(t).forEach(o=>{const r=u[o],i=t[o];Array.isArray(r)&&Array.isArray(i)?u[o]=i:S(r)&&S(i)?u[o]=y(Object.assign({},r),i):u[o]=i}),y(u,...e)):u}function E(u,e){const t=document.createElement("a");t.download=e,t.href=u,document.body.appendChild(t),t.click(),document.body.removeChild(t)}const Q={L:.07,M:.15,Q:.25,H:.3};class H{constructor({svg:e,type:t,window:o}){this._svg=e,this._type=t,this._window=o}draw(e,t,o,r){let i;switch(this._type){case"dots":i=this._drawDot;break;case"classy":i=this._drawClassy;break;case"classy-rounded":i=this._drawClassyRounded;break;case"rounded":i=this._drawRounded;break;case"extra-rounded":i=this._drawExtraRounded;break;default:i=this._drawSquare}i.call(this,{x:e,y:t,size:o,getNeighbor:r})}_rotateFigure({x:e,y:t,size:o,rotation:r=0,draw:i}){var c;const x=e+o/2,m=t+o/2;i(),(c=this._element)===null||c===void 0||c.setAttribute("transform",`rotate(${180*r/Math.PI},${x},${m})`)}_basicDot(e){const{size:t,x:o,y:r}=e;this._rotateFigure(Object.assign(Object.assign({},e),{draw:()=>{this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","circle"),this._element.setAttribute("cx",String(o+t/2)),this._element.setAttribute("cy",String(r+t/2)),this._element.setAttribute("r",String(t/2))}}))}_basicSquare(e){const{size:t,x:o,y:r}=e;this._rotateFigure(Object.assign(Object.assign({},e),{draw:()=>{this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","rect"),this._element.setAttribute("x",String(o)),this._element.setAttribute("y",String(r)),this._element.setAttribute("width",String(t)),this._element.setAttribute("height",String(t))}}))}_basicSideRounded(e){const{size:t,x:o,y:r}=e;this._rotateFigure(Object.assign(Object.assign({},e),{draw:()=>{this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","path"),this._element.setAttribute("d",`M ${o} ${r}v ${t}h `+t/2+`a ${t/2} ${t/2}, 0, 0, 0, 0 ${-t}`)}}))}_basicCornerRounded(e){const{size:t,x:o,y:r}=e;this._rotateFigure(Object.assign(Object.assign({},e),{draw:()=>{this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","path"),this._element.setAttribute("d",`M ${o} ${r}v ${t}h ${t}v `+-t/2+`a ${t/2} ${t/2}, 0, 0, 0, ${-t/2} ${-t/2}`)}}))}_basicCornerExtraRounded(e){const{size:t,x:o,y:r}=e;this._rotateFigure(Object.assign(Object.assign({},e),{draw:()=>{this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","path"),this._element.setAttribute("d",`M ${o} ${r}v ${t}h ${t}a ${t} ${t}, 0, 0, 0, ${-t} ${-t}`)}}))}_basicCornersRounded(e){const{size:t,x:o,y:r}=e;this._rotateFigure(Object.assign(Object.assign({},e),{draw:()=>{this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","path"),this._element.setAttribute("d",`M ${o} ${r}v `+t/2+`a ${t/2} ${t/2}, 0, 0, 0, ${t/2} ${t/2}h `+t/2+"v "+-t/2+`a ${t/2} ${t/2}, 0, 0, 0, ${-t/2} ${-t/2}`)}}))}_drawDot({x:e,y:t,size:o}){this._basicDot({x:e,y:t,size:o,rotation:0})}_drawSquare({x:e,y:t,size:o}){this._basicSquare({x:e,y:t,size:o,rotation:0})}_drawRounded({x:e,y:t,size:o,getNeighbor:r}){const i=r?+r(-1,0):0,c=r?+r(1,0):0,x=r?+r(0,-1):0,m=r?+r(0,1):0,A=i+c+x+m;if(A!==0)if(A>2||i&&c||x&&m)this._basicSquare({x:e,y:t,size:o,rotation:0});else{if(A===2){let C=0;return i&&x?C=Math.PI/2:x&&c?C=Math.PI:c&&m&&(C=-Math.PI/2),void this._basicCornerRounded({x:e,y:t,size:o,rotation:C})}if(A===1){let C=0;return x?C=Math.PI/2:c?C=Math.PI:m&&(C=-Math.PI/2),void this._basicSideRounded({x:e,y:t,size:o,rotation:C})}}else this._basicDot({x:e,y:t,size:o,rotation:0})}_drawExtraRounded({x:e,y:t,size:o,getNeighbor:r}){const i=r?+r(-1,0):0,c=r?+r(1,0):0,x=r?+r(0,-1):0,m=r?+r(0,1):0,A=i+c+x+m;if(A!==0)if(A>2||i&&c||x&&m)this._basicSquare({x:e,y:t,size:o,rotation:0});else{if(A===2){let C=0;return i&&x?C=Math.PI/2:x&&c?C=Math.PI:c&&m&&(C=-Math.PI/2),void this._basicCornerExtraRounded({x:e,y:t,size:o,rotation:C})}if(A===1){let C=0;return x?C=Math.PI/2:c?C=Math.PI:m&&(C=-Math.PI/2),void this._basicSideRounded({x:e,y:t,size:o,rotation:C})}}else this._basicDot({x:e,y:t,size:o,rotation:0})}_drawClassy({x:e,y:t,size:o,getNeighbor:r}){const i=r?+r(-1,0):0,c=r?+r(1,0):0,x=r?+r(0,-1):0,m=r?+r(0,1):0;i+c+x+m!==0?i||x?c||m?this._basicSquare({x:e,y:t,size:o,rotation:0}):this._basicCornerRounded({x:e,y:t,size:o,rotation:Math.PI/2}):this._basicCornerRounded({x:e,y:t,size:o,rotation:-Math.PI/2}):this._basicCornersRounded({x:e,y:t,size:o,rotation:Math.PI/2})}_drawClassyRounded({x:e,y:t,size:o,getNeighbor:r}){const i=r?+r(-1,0):0,c=r?+r(1,0):0,x=r?+r(0,-1):0,m=r?+r(0,1):0;i+c+x+m!==0?i||x?c||m?this._basicSquare({x:e,y:t,size:o,rotation:0}):this._basicCornerExtraRounded({x:e,y:t,size:o,rotation:Math.PI/2}):this._basicCornerExtraRounded({x:e,y:t,size:o,rotation:-Math.PI/2}):this._basicCornersRounded({x:e,y:t,size:o,rotation:Math.PI/2})}}const W={dot:"dot",square:"square",extraRounded:"extra-rounded"},J=Object.values(W);class nt{constructor({svg:e,type:t,window:o}){this._svg=e,this._type=t,this._window=o}draw(e,t,o,r){let i;switch(this._type){case W.square:i=this._drawSquare;break;case W.extraRounded:i=this._drawExtraRounded;break;default:i=this._drawDot}i.call(this,{x:e,y:t,size:o,rotation:r})}_rotateFigure({x:e,y:t,size:o,rotation:r=0,draw:i}){var c;const x=e+o/2,m=t+o/2;i(),(c=this._element)===null||c===void 0||c.setAttribute("transform",`rotate(${180*r/Math.PI},${x},${m})`)}_basicDot(e){const{size:t,x:o,y:r}=e,i=t/7;this._rotateFigure(Object.assign(Object.assign({},e),{draw:()=>{this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","path"),this._element.setAttribute("clip-rule","evenodd"),this._element.setAttribute("d",`M ${o+t/2} ${r}a ${t/2} ${t/2} 0 1 0 0.1 0zm 0 ${i}a ${t/2-i} ${t/2-i} 0 1 1 -0.1 0Z`)}}))}_basicSquare(e){const{size:t,x:o,y:r}=e,i=t/7;this._rotateFigure(Object.assign(Object.assign({},e),{draw:()=>{this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","path"),this._element.setAttribute("clip-rule","evenodd"),this._element.setAttribute("d",`M ${o} ${r}v ${t}h ${t}v `+-t+`zM ${o+i} ${r+i}h `+(t-2*i)+"v "+(t-2*i)+"h "+(2*i-t)+"z")}}))}_basicExtraRounded(e){const{size:t,x:o,y:r}=e,i=t/7;this._rotateFigure(Object.assign(Object.assign({},e),{draw:()=>{this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","path"),this._element.setAttribute("clip-rule","evenodd"),this._element.setAttribute("d",`M ${o} ${r+2.5*i}v `+2*i+`a ${2.5*i} ${2.5*i}, 0, 0, 0, ${2.5*i} ${2.5*i}h `+2*i+`a ${2.5*i} ${2.5*i}, 0, 0, 0, ${2.5*i} ${2.5*-i}v `+-2*i+`a ${2.5*i} ${2.5*i}, 0, 0, 0, ${2.5*-i} ${2.5*-i}h `+-2*i+`a ${2.5*i} ${2.5*i}, 0, 0, 0, ${2.5*-i} ${2.5*i}M ${o+2.5*i} ${r+i}h `+2*i+`a ${1.5*i} ${1.5*i}, 0, 0, 1, ${1.5*i} ${1.5*i}v `+2*i+`a ${1.5*i} ${1.5*i}, 0, 0, 1, ${1.5*-i} ${1.5*i}h `+-2*i+`a ${1.5*i} ${1.5*i}, 0, 0, 1, ${1.5*-i} ${1.5*-i}v `+-2*i+`a ${1.5*i} ${1.5*i}, 0, 0, 1, ${1.5*i} ${1.5*-i}`)}}))}_drawDot({x:e,y:t,size:o,rotation:r}){this._basicDot({x:e,y:t,size:o,rotation:r})}_drawSquare({x:e,y:t,size:o,rotation:r}){this._basicSquare({x:e,y:t,size:o,rotation:r})}_drawExtraRounded({x:e,y:t,size:o,rotation:r}){this._basicExtraRounded({x:e,y:t,size:o,rotation:r})}}const ot={dot:"dot",square:"square"},N=Object.values(ot);class ct{constructor({svg:e,type:t,window:o}){this._svg=e,this._type=t,this._window=o}draw(e,t,o,r){let i;i=this._type===ot.square?this._drawSquare:this._drawDot,i.call(this,{x:e,y:t,size:o,rotation:r})}_rotateFigure({x:e,y:t,size:o,rotation:r=0,draw:i}){var c;const x=e+o/2,m=t+o/2;i(),(c=this._element)===null||c===void 0||c.setAttribute("transform",`rotate(${180*r/Math.PI},${x},${m})`)}_basicDot(e){const{size:t,x:o,y:r}=e;this._rotateFigure(Object.assign(Object.assign({},e),{draw:()=>{this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","circle"),this._element.setAttribute("cx",String(o+t/2)),this._element.setAttribute("cy",String(r+t/2)),this._element.setAttribute("r",String(t/2))}}))}_basicSquare(e){const{size:t,x:o,y:r}=e;this._rotateFigure(Object.assign(Object.assign({},e),{draw:()=>{this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","rect"),this._element.setAttribute("x",String(o)),this._element.setAttribute("y",String(r)),this._element.setAttribute("width",String(t)),this._element.setAttribute("height",String(t))}}))}_drawDot({x:e,y:t,size:o,rotation:r}){this._basicDot({x:e,y:t,size:o,rotation:r})}_drawSquare({x:e,y:t,size:o,rotation:r}){this._basicSquare({x:e,y:t,size:o,rotation:r})}}const gt="circle",K=[[1,1,1,1,1,1,1],[1,0,0,0,0,0,1],[1,0,0,0,0,0,1],[1,0,0,0,0,0,1],[1,0,0,0,0,0,1],[1,0,0,0,0,0,1],[1,1,1,1,1,1,1]],tt=[[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,1,1,1,0,0],[0,0,1,1,1,0,0],[0,0,1,1,1,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0]];class ht{constructor(e,t){this._roundSize=o=>this._options.dotsOptions.roundSize?Math.floor(o):o,this._window=t,this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","svg"),this._element.setAttribute("width",String(e.width)),this._element.setAttribute("height",String(e.height)),this._element.setAttribute("xmlns:xlink","http://www.w3.org/1999/xlink"),e.dotsOptions.roundSize||this._element.setAttribute("shape-rendering","crispEdges"),this._element.setAttribute("viewBox",`0 0 ${e.width} ${e.height}`),this._defs=this._window.document.createElementNS("http://www.w3.org/2000/svg","defs"),this._element.appendChild(this._defs),this._imageUri=e.image,this._instanceId=ht.instanceCount++,this._options=e}get width(){return this._options.width}get height(){return this._options.height}getElement(){return this._element}async drawQR(e){const t=e.getModuleCount(),o=Math.min(this._options.width,this._options.height)-2*this._options.margin,r=this._options.shape===gt?o/Math.sqrt(2):o,i=this._roundSize(r/t);let c={hideXDots:0,hideYDots:0,width:0,height:0};if(this._qr=e,this._options.image){if(await this.loadImage(),!this._image)return;const{imageOptions:x,qrOptions:m}=this._options,A=x.imageSize*Q[m.errorCorrectionLevel],C=Math.floor(A*t*t);c=function({originalHeight:$,originalWidth:k,maxHiddenDots:M,maxHiddenAxisDots:B,dotSize:q}){const a={x:0,y:0},h={x:0,y:0};if($<=0||k<=0||M<=0||q<=0)return{height:0,width:0,hideYDots:0,hideXDots:0};const l=$/k;return a.x=Math.floor(Math.sqrt(M/l)),a.x<=0&&(a.x=1),B&&B<a.x&&(a.x=B),a.x%2==0&&a.x--,h.x=a.x*q,a.y=1+2*Math.ceil((a.x*l-1)/2),h.y=Math.round(h.x*l),(a.y*a.x>M||B&&B<a.y)&&(B&&B<a.y?(a.y=B,a.y%2==0&&a.x--):a.y-=2,h.y=a.y*q,a.x=1+2*Math.ceil((a.y/l-1)/2),h.x=Math.round(h.y/l)),{height:h.y,width:h.x,hideYDots:a.y,hideXDots:a.x}}({originalWidth:this._image.width,originalHeight:this._image.height,maxHiddenDots:C,maxHiddenAxisDots:t-14,dotSize:i})}this.drawBackground(),this.drawDots((x,m)=>{var A,C,$,k,M,B;return!(this._options.imageOptions.hideBackgroundDots&&x>=(t-c.hideYDots)/2&&x<(t+c.hideYDots)/2&&m>=(t-c.hideXDots)/2&&m<(t+c.hideXDots)/2||!((A=K[x])===null||A===void 0)&&A[m]||!((C=K[x-t+7])===null||C===void 0)&&C[m]||!(($=K[x])===null||$===void 0)&&$[m-t+7]||!((k=tt[x])===null||k===void 0)&&k[m]||!((M=tt[x-t+7])===null||M===void 0)&&M[m]||!((B=tt[x])===null||B===void 0)&&B[m-t+7])}),this.drawCorners(),this._options.image&&await this.drawImage({width:c.width,height:c.height,count:t,dotSize:i})}drawBackground(){var e,t,o;const r=this._element,i=this._options;if(r){const c=(e=i.backgroundOptions)===null||e===void 0?void 0:e.gradient,x=(t=i.backgroundOptions)===null||t===void 0?void 0:t.color;let m=i.height,A=i.width;if(c||x){const C=this._window.document.createElementNS("http://www.w3.org/2000/svg","rect");this._backgroundClipPath=this._window.document.createElementNS("http://www.w3.org/2000/svg","clipPath"),this._backgroundClipPath.setAttribute("id",`clip-path-background-color-${this._instanceId}`),this._defs.appendChild(this._backgroundClipPath),!((o=i.backgroundOptions)===null||o===void 0)&&o.round&&(m=A=Math.min(i.width,i.height),C.setAttribute("rx",String(m/2*i.backgroundOptions.round))),C.setAttribute("x",String(this._roundSize((i.width-A)/2))),C.setAttribute("y",String(this._roundSize((i.height-m)/2))),C.setAttribute("width",String(A)),C.setAttribute("height",String(m)),this._backgroundClipPath.appendChild(C),this._createColor({options:c,color:x,additionalRotation:0,x:0,y:0,height:i.height,width:i.width,name:`background-color-${this._instanceId}`})}}}drawDots(e){var t,o;if(!this._qr)throw"QR code is not defined";const r=this._options,i=this._qr.getModuleCount();if(i>r.width||i>r.height)throw"The canvas is too small.";const c=Math.min(r.width,r.height)-2*r.margin,x=r.shape===gt?c/Math.sqrt(2):c,m=this._roundSize(x/i),A=this._roundSize((r.width-i*m)/2),C=this._roundSize((r.height-i*m)/2),$=new H({svg:this._element,type:r.dotsOptions.type,window:this._window});this._dotsClipPath=this._window.document.createElementNS("http://www.w3.org/2000/svg","clipPath"),this._dotsClipPath.setAttribute("id",`clip-path-dot-color-${this._instanceId}`),this._defs.appendChild(this._dotsClipPath),this._createColor({options:(t=r.dotsOptions)===null||t===void 0?void 0:t.gradient,color:r.dotsOptions.color,additionalRotation:0,x:0,y:0,height:r.height,width:r.width,name:`dot-color-${this._instanceId}`});for(let k=0;k<i;k++)for(let M=0;M<i;M++)e&&!e(k,M)||!((o=this._qr)===null||o===void 0)&&o.isDark(k,M)&&($.draw(A+M*m,C+k*m,m,(B,q)=>!(M+B<0||k+q<0||M+B>=i||k+q>=i)&&!(e&&!e(k+q,M+B))&&!!this._qr&&this._qr.isDark(k+q,M+B)),$._element&&this._dotsClipPath&&this._dotsClipPath.appendChild($._element));if(r.shape===gt){const k=this._roundSize((c/m-i)/2),M=i+2*k,B=A-k*m,q=C-k*m,a=[],h=this._roundSize(M/2);for(let l=0;l<M;l++){a[l]=[];for(let f=0;f<M;f++)l>=k-1&&l<=M-k&&f>=k-1&&f<=M-k||Math.sqrt((l-h)*(l-h)+(f-h)*(f-h))>h?a[l][f]=0:a[l][f]=this._qr.isDark(f-2*k<0?f:f>=i?f-2*k:f-k,l-2*k<0?l:l>=i?l-2*k:l-k)?1:0}for(let l=0;l<M;l++)for(let f=0;f<M;f++)a[l][f]&&($.draw(B+f*m,q+l*m,m,(b,z)=>{var P;return!!(!((P=a[l+z])===null||P===void 0)&&P[f+b])}),$._element&&this._dotsClipPath&&this._dotsClipPath.appendChild($._element))}}drawCorners(){if(!this._qr)throw"QR code is not defined";const e=this._element,t=this._options;if(!e)throw"Element code is not defined";const o=this._qr.getModuleCount(),r=Math.min(t.width,t.height)-2*t.margin,i=t.shape===gt?r/Math.sqrt(2):r,c=this._roundSize(i/o),x=7*c,m=3*c,A=this._roundSize((t.width-o*c)/2),C=this._roundSize((t.height-o*c)/2);[[0,0,0],[1,0,Math.PI/2],[0,1,-Math.PI/2]].forEach(([$,k,M])=>{var B,q,a,h,l,f,b,z,P,I,T,j,F,rt;const Y=A+$*c*(o-7),U=C+k*c*(o-7);let R=this._dotsClipPath,O=this._dotsClipPath;if((!((B=t.cornersSquareOptions)===null||B===void 0)&&B.gradient||!((q=t.cornersSquareOptions)===null||q===void 0)&&q.color)&&(R=this._window.document.createElementNS("http://www.w3.org/2000/svg","clipPath"),R.setAttribute("id",`clip-path-corners-square-color-${$}-${k}-${this._instanceId}`),this._defs.appendChild(R),this._cornersSquareClipPath=this._cornersDotClipPath=O=R,this._createColor({options:(a=t.cornersSquareOptions)===null||a===void 0?void 0:a.gradient,color:(h=t.cornersSquareOptions)===null||h===void 0?void 0:h.color,additionalRotation:M,x:Y,y:U,height:x,width:x,name:`corners-square-color-${$}-${k}-${this._instanceId}`})),((l=t.cornersSquareOptions)===null||l===void 0?void 0:l.type)&&J.includes(t.cornersSquareOptions.type)){const G=new nt({svg:this._element,type:t.cornersSquareOptions.type,window:this._window});G.draw(Y,U,x,M),G._element&&R&&R.appendChild(G._element)}else{const G=new H({svg:this._element,type:((f=t.cornersSquareOptions)===null||f===void 0?void 0:f.type)||t.dotsOptions.type,window:this._window});for(let et=0;et<K.length;et++)for(let D=0;D<K[et].length;D++)!((b=K[et])===null||b===void 0)&&b[D]&&(G.draw(Y+D*c,U+et*c,c,(ut,lt)=>{var at;return!!(!((at=K[et+lt])===null||at===void 0)&&at[D+ut])}),G._element&&R&&R.appendChild(G._element))}if((!((z=t.cornersDotOptions)===null||z===void 0)&&z.gradient||!((P=t.cornersDotOptions)===null||P===void 0)&&P.color)&&(O=this._window.document.createElementNS("http://www.w3.org/2000/svg","clipPath"),O.setAttribute("id",`clip-path-corners-dot-color-${$}-${k}-${this._instanceId}`),this._defs.appendChild(O),this._cornersDotClipPath=O,this._createColor({options:(I=t.cornersDotOptions)===null||I===void 0?void 0:I.gradient,color:(T=t.cornersDotOptions)===null||T===void 0?void 0:T.color,additionalRotation:M,x:Y+2*c,y:U+2*c,height:m,width:m,name:`corners-dot-color-${$}-${k}-${this._instanceId}`})),((j=t.cornersDotOptions)===null||j===void 0?void 0:j.type)&&N.includes(t.cornersDotOptions.type)){const G=new ct({svg:this._element,type:t.cornersDotOptions.type,window:this._window});G.draw(Y+2*c,U+2*c,m,M),G._element&&O&&O.appendChild(G._element)}else{const G=new H({svg:this._element,type:((F=t.cornersDotOptions)===null||F===void 0?void 0:F.type)||t.dotsOptions.type,window:this._window});for(let et=0;et<tt.length;et++)for(let D=0;D<tt[et].length;D++)!((rt=tt[et])===null||rt===void 0)&&rt[D]&&(G.draw(Y+D*c,U+et*c,c,(ut,lt)=>{var at;return!!(!((at=tt[et+lt])===null||at===void 0)&&at[D+ut])}),G._element&&O&&O.appendChild(G._element))}})}loadImage(){return new Promise((e,t)=>{var o;const r=this._options;if(!r.image)return t("Image is not defined");if(!((o=r.nodeCanvas)===null||o===void 0)&&o.loadImage)r.nodeCanvas.loadImage(r.image).then(i=>{var c,x;if(this._image=i,this._options.imageOptions.saveAsBlob){const m=(c=r.nodeCanvas)===null||c===void 0?void 0:c.createCanvas(this._image.width,this._image.height);(x=m==null?void 0:m.getContext("2d"))===null||x===void 0||x.drawImage(i,0,0),this._imageUri=m==null?void 0:m.toDataURL()}e()}).catch(t);else{const i=new this._window.Image;typeof r.imageOptions.crossOrigin=="string"&&(i.crossOrigin=r.imageOptions.crossOrigin),this._image=i,i.onload=async()=>{this._options.imageOptions.saveAsBlob&&(this._imageUri=await async function(c,x){return new Promise(m=>{const A=new x.XMLHttpRequest;A.onload=function(){const C=new x.FileReader;C.onloadend=function(){m(C.result)},C.readAsDataURL(A.response)},A.open("GET",c),A.responseType="blob",A.send()})}(r.image||"",this._window)),e()},i.src=r.image}})}async drawImage({width:e,height:t,count:o,dotSize:r}){const i=this._options,c=this._roundSize((i.width-o*r)/2),x=this._roundSize((i.height-o*r)/2),m=c+this._roundSize(i.imageOptions.margin+(o*r-e)/2),A=x+this._roundSize(i.imageOptions.margin+(o*r-t)/2),C=e-2*i.imageOptions.margin,$=t-2*i.imageOptions.margin,k=this._window.document.createElementNS("http://www.w3.org/2000/svg","image");k.setAttribute("href",this._imageUri||""),k.setAttribute("xlink:href",this._imageUri||""),k.setAttribute("x",String(m)),k.setAttribute("y",String(A)),k.setAttribute("width",`${C}px`),k.setAttribute("height",`${$}px`),this._element.appendChild(k)}_createColor({options:e,color:t,additionalRotation:o,x:r,y:i,height:c,width:x,name:m}){const A=x>c?x:c,C=this._window.document.createElementNS("http://www.w3.org/2000/svg","rect");if(C.setAttribute("x",String(r)),C.setAttribute("y",String(i)),C.setAttribute("height",String(c)),C.setAttribute("width",String(x)),C.setAttribute("clip-path",`url('#clip-path-${m}')`),e){let $;if(e.type==="radial")$=this._window.document.createElementNS("http://www.w3.org/2000/svg","radialGradient"),$.setAttribute("id",m),$.setAttribute("gradientUnits","userSpaceOnUse"),$.setAttribute("fx",String(r+x/2)),$.setAttribute("fy",String(i+c/2)),$.setAttribute("cx",String(r+x/2)),$.setAttribute("cy",String(i+c/2)),$.setAttribute("r",String(A/2));else{const k=((e.rotation||0)+o)%(2*Math.PI),M=(k+2*Math.PI)%(2*Math.PI);let B=r+x/2,q=i+c/2,a=r+x/2,h=i+c/2;M>=0&&M<=.25*Math.PI||M>1.75*Math.PI&&M<=2*Math.PI?(B-=x/2,q-=c/2*Math.tan(k),a+=x/2,h+=c/2*Math.tan(k)):M>.25*Math.PI&&M<=.75*Math.PI?(q-=c/2,B-=x/2/Math.tan(k),h+=c/2,a+=x/2/Math.tan(k)):M>.75*Math.PI&&M<=1.25*Math.PI?(B+=x/2,q+=c/2*Math.tan(k),a-=x/2,h-=c/2*Math.tan(k)):M>1.25*Math.PI&&M<=1.75*Math.PI&&(q+=c/2,B+=x/2/Math.tan(k),h-=c/2,a-=x/2/Math.tan(k)),$=this._window.document.createElementNS("http://www.w3.org/2000/svg","linearGradient"),$.setAttribute("id",m),$.setAttribute("gradientUnits","userSpaceOnUse"),$.setAttribute("x1",String(Math.round(B))),$.setAttribute("y1",String(Math.round(q))),$.setAttribute("x2",String(Math.round(a))),$.setAttribute("y2",String(Math.round(h)))}e.colorStops.forEach(({offset:k,color:M})=>{const B=this._window.document.createElementNS("http://www.w3.org/2000/svg","stop");B.setAttribute("offset",100*k+"%"),B.setAttribute("stop-color",M),$.appendChild(B)}),C.setAttribute("fill",`url('#${m}')`),this._defs.appendChild($)}else t&&C.setAttribute("fill",t);this._element.appendChild(C)}}ht.instanceCount=0;const Mt=ht,xt="canvas",L={};for(let u=0;u<=40;u++)L[u]=u;const it={type:xt,shape:"square",width:300,height:300,data:"",margin:0,qrOptions:{typeNumber:L[0],mode:void 0,errorCorrectionLevel:"Q"},imageOptions:{saveAsBlob:!0,hideBackgroundDots:!0,imageSize:.4,crossOrigin:void 0,margin:0},dotsOptions:{type:"square",color:"#000",roundSize:!0},backgroundOptions:{round:0,color:"#fff"}};function X(u){const e=Object.assign({},u);if(!e.colorStops||!e.colorStops.length)throw"Field 'colorStops' is required in gradient";return e.rotation?e.rotation=Number(e.rotation):e.rotation=0,e.colorStops=e.colorStops.map(t=>Object.assign(Object.assign({},t),{offset:Number(t.offset)})),e}function dt(u){const e=Object.assign({},u);return e.width=Number(e.width),e.height=Number(e.height),e.margin=Number(e.margin),e.imageOptions=Object.assign(Object.assign({},e.imageOptions),{hideBackgroundDots:!!e.imageOptions.hideBackgroundDots,imageSize:Number(e.imageOptions.imageSize),margin:Number(e.imageOptions.margin)}),e.margin>Math.min(e.width,e.height)&&(e.margin=Math.min(e.width,e.height)),e.dotsOptions=Object.assign({},e.dotsOptions),e.dotsOptions.gradient&&(e.dotsOptions.gradient=X(e.dotsOptions.gradient)),e.cornersSquareOptions&&(e.cornersSquareOptions=Object.assign({},e.cornersSquareOptions),e.cornersSquareOptions.gradient&&(e.cornersSquareOptions.gradient=X(e.cornersSquareOptions.gradient))),e.cornersDotOptions&&(e.cornersDotOptions=Object.assign({},e.cornersDotOptions),e.cornersDotOptions.gradient&&(e.cornersDotOptions.gradient=X(e.cornersDotOptions.gradient))),e.backgroundOptions&&(e.backgroundOptions=Object.assign({},e.backgroundOptions),e.backgroundOptions.gradient&&(e.backgroundOptions.gradient=X(e.backgroundOptions.gradient))),e}var pt=v(873),_t=v.n(pt);function ft(u){if(!u)throw new Error("Extension must be defined");u[0]==="."&&(u=u.substring(1));const e={bmp:"image/bmp",gif:"image/gif",ico:"image/vnd.microsoft.icon",jpeg:"image/jpeg",jpg:"image/jpeg",png:"image/png",svg:"image/svg+xml",tif:"image/tiff",tiff:"image/tiff",webp:"image/webp",pdf:"application/pdf"}[u.toLowerCase()];if(!e)throw new Error(`Extension "${u}" is not supported`);return e}class p{constructor(e){e!=null&&e.jsdom?this._window=new e.jsdom("",{resources:"usable"}).window:this._window=window,this._options=e?dt(y(it,e)):it,this.update()}static _clearContainer(e){e&&(e.innerHTML="")}_setupSvg(){if(!this._qr)return;const e=new Mt(this._options,this._window);this._svg=e.getElement(),this._svgDrawingPromise=e.drawQR(this._qr).then(()=>{var t;this._svg&&((t=this._extension)===null||t===void 0||t.call(this,e.getElement(),this._options))})}_setupCanvas(){var e,t;this._qr&&(!((e=this._options.nodeCanvas)===null||e===void 0)&&e.createCanvas?(this._nodeCanvas=this._options.nodeCanvas.createCanvas(this._options.width,this._options.height),this._nodeCanvas.width=this._options.width,this._nodeCanvas.height=this._options.height):(this._domCanvas=document.createElement("canvas"),this._domCanvas.width=this._options.width,this._domCanvas.height=this._options.height),this._setupSvg(),this._canvasDrawingPromise=(t=this._svgDrawingPromise)===null||t===void 0?void 0:t.then(()=>{var o;if(!this._svg)return;const r=this._svg,i=new this._window.XMLSerializer().serializeToString(r),c=btoa(i),x=`data:${ft("svg")};base64,${c}`;if(!((o=this._options.nodeCanvas)===null||o===void 0)&&o.loadImage)return this._options.nodeCanvas.loadImage(x).then(m=>{var A,C;m.width=this._options.width,m.height=this._options.height,(C=(A=this._nodeCanvas)===null||A===void 0?void 0:A.getContext("2d"))===null||C===void 0||C.drawImage(m,0,0)});{const m=new this._window.Image;return new Promise(A=>{m.onload=()=>{var C,$;($=(C=this._domCanvas)===null||C===void 0?void 0:C.getContext("2d"))===null||$===void 0||$.drawImage(m,0,0),A()},m.src=x})}}))}async _getElement(e="png"){if(!this._qr)throw"QR code is empty";return e.toLowerCase()==="svg"?(this._svg&&this._svgDrawingPromise||this._setupSvg(),await this._svgDrawingPromise,this._svg):((this._domCanvas||this._nodeCanvas)&&this._canvasDrawingPromise||this._setupCanvas(),await this._canvasDrawingPromise,this._domCanvas||this._nodeCanvas)}update(e){p._clearContainer(this._container),this._options=e?dt(y(this._options,e)):this._options,this._options.data&&(this._qr=_t()(this._options.qrOptions.typeNumber,this._options.qrOptions.errorCorrectionLevel),this._qr.addData(this._options.data,this._options.qrOptions.mode||function(t){switch(!0){case/^[0-9]*$/.test(t):return"Numeric";case/^[0-9A-Z $%*+\-./:]*$/.test(t):return"Alphanumeric";default:return"Byte"}}(this._options.data)),this._qr.make(),this._options.type===xt?this._setupCanvas():this._setupSvg(),this.append(this._container))}append(e){if(e){if(typeof e.appendChild!="function")throw"Container should be a single DOM node";this._options.type===xt?this._domCanvas&&e.appendChild(this._domCanvas):this._svg&&e.appendChild(this._svg),this._container=e}}applyExtension(e){if(!e)throw"Extension function should be defined.";this._extension=e,this.update()}deleteExtension(){this._extension=void 0,this.update()}async getRawData(e="png"){if(!this._qr)throw"QR code is empty";const t=await this._getElement(e),o=ft(e);if(!t)return null;if(e.toLowerCase()==="svg"){const r=`<?xml version="1.0" standalone="no"?>\r
${new this._window.XMLSerializer().serializeToString(t)}`;return typeof Blob>"u"||this._options.jsdom?Buffer.from(r):new Blob([r],{type:o})}return new Promise(r=>{const i=t;if("toBuffer"in i)if(o==="image/png")r(i.toBuffer(o));else if(o==="image/jpeg")r(i.toBuffer(o));else{if(o!=="application/pdf")throw Error("Unsupported extension");r(i.toBuffer(o))}else"toBlob"in i&&i.toBlob(r,o,1)})}async download(e){if(!this._qr)throw"QR code is empty";if(typeof Blob>"u")throw"Cannot download in Node.js, call getRawData instead.";let t="png",o="qr";typeof e=="string"?(t=e,console.warn("Extension is deprecated as argument for 'download' method, please pass object { name: '...', extension: '...' } as argument")):typeof e=="object"&&e!==null&&(e.name&&(o=e.name),e.extension&&(t=e.extension));const r=await this._getElement(t);if(r)if(t.toLowerCase()==="svg"){let i=new XMLSerializer().serializeToString(r);i=`<?xml version="1.0" standalone="no"?>\r
`+i,E(`data:${ft(t)};charset=utf-8,${encodeURIComponent(i)}`,`${o}.svg`)}else E(r.toDataURL(ft(t)),`${o}.${t}`)}}const w=p})(),_.default})())}(Ft)),Ft.exports}var _e=xe();const Se=ve(_e),Ce=`
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

  .zenobia-qr-placeholder::before {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(135deg,
      rgba(255,255,255,0) 0%,
      rgba(255,255,255,0) 35%,
      rgba(255,255,255,0.5) 50%,
      rgba(255,255,255,0) 65%,
      rgba(255,255,255,0) 100%);
    animation: shimmer 1.5s infinite ease-out;
  }

  @keyframes shimmer {
    0% {
      transform: translateX(-100%) translateY(-100%);
    }
    100% {
      transform: translateX(100%) translateY(100%);
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

  /* Mobile button styles */
  .mobile-button-container {
    display: flex;
    justify-content: center;
    margin-top: 16px;
  }

  .mobile-button {
    display: flex;
    align-items: center;
    gap: 5px;
    background: transparent;
    border: none;
    color: #9ca3af;
    font-size: 12px;
    padding: 5px 10px;
    cursor: pointer;
    opacity: 0.7;
    transition: opacity 0.2s ease;
    border-radius: 4px;
  }

  .mobile-button:hover {
    opacity: 1;
    background-color: #f9fafb;
  }

  .mobile-button svg {
    width: 14px;
    height: 14px;
    stroke: #9ca3af;
  }
`;var zt=(n=>(n.PENDING="PENDING",n.IN_FLIGHT="IN_FLIGHT",n.COMPLETED="COMPLETED",n.FAILED="FAILED",n.CANCELLED="CANCELLED",n))(zt||{});ne(["click"]);var ke=At('<div class=test-mode-badge tabindex=0><svg width=16 height=16 viewBox="0 0 20 20"fill=none xmlns=http://www.w3.org/2000/svg><circle cx=10 cy=10 r=9 stroke=#b45309 stroke-width=2 fill=#fef3c7></circle><text x=10 y=15 text-anchor=middle font-size=12 fill=#b45309 font-family=Arial font-weight=bold>i</text></svg><span class=test-mode-badge-text>Test Mode</span><div class=test-mode-tooltip>Test Mode: No real money will be moved.'),Ae=At('<div class=mobile-button-container><button class=mobile-button title="Open on mobile device"><svg width=20 height=20 viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round><rect x=5 y=2 width=14 height=20 rx=2 ry=2></rect><line x1=12 y1=18 x2=12 y2=18></line></svg><span>Open app to continue'),$e=At("<div class=zenobia-error>"),ze=At('<div class="zenobia-qr-popup-overlay visible"><div class=zenobia-qr-popup-content><button class=zenobia-qr-close><svg viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2><path d="M18 6L6 18M6 6l12 12"></path></svg></button><div class=modal-header><div class=header-content><h3>Pay by bank with Zenobia</h3><p class=subtitle>Scan to complete your purchase</p></div></div><div class=modal-body><div class=payment-amount>$</div><div class=savings-badge></div><div class=payment-status><div class=spinner></div><div class=payment-instructions>'),Me=At("<div class=qr-code-container id=qrcode-container>"),Oe=At("<div class=qr-code-container><div class=zenobia-qr-placeholder>");const qe=()=>{if(typeof window>"u")return!1;const n=window.navigator.userAgent.toLowerCase(),s=/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(n),d="ontouchstart"in window||navigator.maxTouchPoints>0,g=window.innerWidth<=768;return s||d&&g},Ee=n=>{const[s,d]=vt(null),g={current:null},[v,_]=vt(zt.PENDING),[S,y]=vt(null),[E,Q]=vt(!1),[H,W]=vt(null),[J,nt]=vt(null),[ot,N]=vt(!1),[ct,gt]=vt("");Yt(()=>{if(n.isOpen&&!H()){const L=new me(n.isTest);if(W(L),n.transferRequest)nt(n.transferRequest),L.listenToTransfer(n.transferRequest.transferRequestId,n.transferRequest.signature||"",K,tt,ht);else if(n.url){N(!0),y(null);const it=n.metadata||{amount:n.amount,statementItems:{name:"Payment",amount:n.amount}};L.createTransfer(n.url,it).then(X=>{nt({transferRequestId:X.transferRequestId,merchantId:X.merchantId,expiry:X.expiry,signature:X.signature}),L.listenToTransfer(X.transferRequestId,X.signature||"",K,tt,ht)}).catch(X=>{y(X instanceof Error?X.message:"An error occurred"),n.onError&&X instanceof Error&&n.onError(X)}).finally(()=>{N(!1)})}else y("No URL provided for creating a new transfer")}}),Yt(()=>{var L;if((L=J())!=null&&L.transferRequestId){const it=J().transferRequestId.replace(/-/g,"");let dt=`https://zenobiapay.com/clip?id=${btoa(it).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}`;n.isTest&&(dt+="&type=test"),gt(dt);const _t=n.qrCodeSize||220,ft=new Se({width:_t,height:_t,type:"svg",data:dt,image:void 0,dotsOptions:{color:"#000000",type:"dots"},backgroundOptions:{color:"#ffffff"},cornersSquareOptions:{type:"extra-rounded"},cornersDotOptions:{type:"dot"},qrOptions:{errorCorrectionLevel:"M"}});d(ft),g.current&&(g.current.innerHTML="",ft.append(g.current))}});const K=L=>{console.log("Received status update:",L);let it;switch(L.status){case"COMPLETED":case"IN_FLIGHT":it=zt.COMPLETED,n.onSuccess&&J()&&n.onSuccess(J(),L);const X=H();X&&(X.disconnect(),W(null));break;case"FAILED":it=zt.FAILED;const dt=H();dt&&(dt.disconnect(),W(null));break;case"CANCELLED":it=zt.CANCELLED;const pt=H();pt&&(pt.disconnect(),W(null));break;default:it=zt.PENDING}_(it),n.onStatusChange&&n.onStatusChange(it)},tt=L=>{console.error("WebSocket error:",L),y(L)},ht=L=>{console.log("WebSocket connection status:",L?"Connected":"Disconnected"),Q(L)};ae(()=>{const L=H();L&&L.disconnect()});const Mt=()=>n.discountAmount!==void 0?n.discountAmount:Math.round(n.amount/100),xt=()=>{const L=Mt();return L<1e3?`✨ ${(L/n.amount*100).toFixed(0)}% cashback applied!`:`✨ Applied $${(L/100).toFixed(2)} cashback!`};return kt(Dt,{get when(){return n.isOpen},get children(){var L=ze(),it=L.firstChild,X=it.firstChild,dt=X.nextSibling,pt=dt.firstChild,_t=pt.firstChild;_t.nextSibling;var ft=dt.nextSibling,p=ft.firstChild;p.firstChild;var w=p.nextSibling,u=w.nextSibling,e=u.firstChild,t=e.nextSibling;return pe(X,"click",n.onClose),yt(pt,kt(Dt,{get when(){return n.isTest},get children(){return ke()}}),null),yt(ft,kt(Dt,{get when(){return St(()=>!!qe())()&&ct()!==""},get fallback(){return kt(Dt,{get when(){return St(()=>!!s())()&&J()},get fallback(){return(()=>{var o=Oe(),r=o.firstChild;return o.style.setProperty("display","flex"),o.style.setProperty("justify-content","center"),o.style.setProperty("align-items","center"),Ot(i=>{var c=n.qrCodeSize?`${n.qrCodeSize}px`:"220px",x=n.qrCodeSize?`${n.qrCodeSize}px`:"220px",m=n.qrCodeSize?`${n.qrCodeSize}px`:"220px",A=n.qrCodeSize?`${n.qrCodeSize}px`:"220px";return c!==i.e&&((i.e=c)!=null?o.style.setProperty("width",c):o.style.removeProperty("width")),x!==i.t&&((i.t=x)!=null?o.style.setProperty("height",x):o.style.removeProperty("height")),m!==i.a&&((i.a=m)!=null?r.style.setProperty("width",m):r.style.removeProperty("width")),A!==i.o&&((i.o=A)!=null?r.style.setProperty("height",A):r.style.removeProperty("height")),i},{e:void 0,t:void 0,a:void 0,o:void 0}),o})()},get children(){var o=Me();return we(r=>{g.current=r;const i=s();i&&r&&(r.innerHTML="",i.append(r))},o),o.style.setProperty("display","flex"),o.style.setProperty("justify-content","center"),o.style.setProperty("align-items","center"),Ot(r=>{var i=n.qrCodeSize?`${n.qrCodeSize}px`:"220px",c=n.qrCodeSize?`${n.qrCodeSize}px`:"220px";return i!==r.e&&((r.e=i)!=null?o.style.setProperty("width",i):o.style.removeProperty("width")),c!==r.t&&((r.t=c)!=null?o.style.setProperty("height",c):o.style.removeProperty("height")),r},{e:void 0,t:void 0}),o}})},get children(){var o=Ae(),r=o.firstChild;return o.style.setProperty("text-align","center"),o.style.setProperty("margin","20px 0"),r.$$click=()=>window.open(ct(),"_blank"),r.style.setProperty("background-color","#000"),r.style.setProperty("color","#fff"),r.style.setProperty("border","none"),r.style.setProperty("padding","16px 24px"),r.style.setProperty("border-radius","8px"),r.style.setProperty("font-size","16px"),r.style.setProperty("font-weight","500"),r.style.setProperty("cursor","pointer"),r.style.setProperty("display","flex"),r.style.setProperty("align-items","center"),r.style.setProperty("gap","8px"),r.style.setProperty("margin","0 auto"),r.style.setProperty("transition","background-color 0.2s ease"),o}}),p),yt(p,()=>(n.amount/100).toFixed(2),null),yt(w,xt),yt(t,(()=>{var o=St(()=>!!ot());return()=>o()?"Preparing payment...":J()?"Waiting for payment":"Creating payment..."})()),yt(ft,kt(Dt,{get when(){return S()},get children(){var o=$e();return yt(o,S),o}}),null),L}})};ne(["click"]);function Pe(){if(!document.getElementById("zenobia-payment-styles")){const n=document.createElement("style");n.id="zenobia-payment-styles",n.textContent=Ce,document.head.appendChild(n)}}function De(n){const s=typeof n.target=="string"?document.querySelector(n.target):n.target;if(!s){console.error("[zenobia-pay-modal] target element not found:",n.target);return}Pe(),ge(()=>kt(Ee,{get isOpen(){return n.isOpen},get onClose(){return n.onClose},get amount(){return n.amount},get discountAmount(){return n.discountAmount},get qrCodeSize(){return n.qrCodeSize},get isTest(){return n.isTest},get url(){return n.url},get metadata(){return n.metadata},get transferRequest(){return n.transferRequest},get onSuccess(){return n.onSuccess},get onError(){return n.onError},get onStatusChange(){return n.onStatusChange}}),s)}window.ZenobiaPayModal={init:De}})();
