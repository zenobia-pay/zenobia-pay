(function(){"use strict";const Bt={equals:(n,s)=>n===s};let Qt=Jt;const vt=1,Lt=2,Gt={owned:null,cleanups:null,context:null,owner:null};var V=null;let Ht=null,re=null,Z=null,st=null,bt=null,jt=0;function se(n,s){const d=Z,g=V,v=n.length===0,_=s===void 0?g:s,S=v?Gt:{owned:null,cleanups:null,context:_?_.context:null,owner:_},x=v?n:()=>n(()=>St(()=>Dt(S)));V=S,Z=null;try{return Et(x,!0)}finally{Z=d,V=g}}function yt(n,s){s=s?Object.assign({},Bt,s):Bt;const d={value:n,observers:null,observerSlots:null,comparator:s.equals||void 0},g=v=>(typeof v=="function"&&(v=v(d.value)),Vt(d,v));return[Zt.bind(d),g]}function Ot(n,s,d){const g=Xt(n,s,!1,vt);qt(g)}function Yt(n,s,d){Qt=de;const g=Xt(n,s,!1,vt);g.user=!0,bt?bt.push(g):qt(g)}function Mt(n,s,d){d=d?Object.assign({},Bt,d):Bt;const g=Xt(n,s,!0,0);return g.observers=null,g.observerSlots=null,g.comparator=d.equals||void 0,qt(g),Zt.bind(g)}function St(n){if(Z===null)return n();const s=Z;Z=null;try{return n()}finally{Z=s}}function ae(n){return V===null||(V.cleanups===null?V.cleanups=[n]:V.cleanups.push(n)),n}function Zt(){if(this.sources&&this.state)if(this.state===vt)qt(this);else{const n=st;st=null,Et(()=>Tt(this),!1),st=n}if(Z){const n=this.observers?this.observers.length:0;Z.sources?(Z.sources.push(this),Z.sourceSlots.push(n)):(Z.sources=[this],Z.sourceSlots=[n]),this.observers?(this.observers.push(Z),this.observerSlots.push(Z.sources.length-1)):(this.observers=[Z],this.observerSlots=[Z.sources.length-1])}return this.value}function Vt(n,s,d){let g=n.value;return(!n.comparator||!n.comparator(g,s))&&(n.value=s,n.observers&&n.observers.length&&Et(()=>{for(let v=0;v<n.observers.length;v+=1){const _=n.observers[v],S=Ht&&Ht.running;S&&Ht.disposed.has(_),(S?!_.tState:!_.state)&&(_.pure?st.push(_):bt.push(_),_.observers&&Kt(_)),S||(_.state=vt)}if(st.length>1e6)throw st=[],new Error},!1)),s}function qt(n){if(!n.fn)return;Dt(n);const s=jt;le(n,n.value,s)}function le(n,s,d){let g;const v=V,_=Z;Z=V=n;try{g=n.fn(s)}catch(S){return n.pure&&(n.state=vt,n.owned&&n.owned.forEach(Dt),n.owned=null),n.updatedAt=d+1,te(S)}finally{Z=_,V=v}(!n.updatedAt||n.updatedAt<=d)&&(n.updatedAt!=null&&"observers"in n?Vt(n,g):n.value=g,n.updatedAt=d)}function Xt(n,s,d,g=vt,v){const _={fn:n,state:g,updatedAt:null,owned:null,sources:null,sourceSlots:null,cleanups:null,value:s,owner:V,context:V?V.context:null,pure:d};return V===null||V!==Gt&&(V.owned?V.owned.push(_):V.owned=[_]),_}function Rt(n){if(n.state===0)return;if(n.state===Lt)return Tt(n);if(n.suspense&&St(n.suspense.inFallback))return n.suspense.effects.push(n);const s=[n];for(;(n=n.owner)&&(!n.updatedAt||n.updatedAt<jt);)n.state&&s.push(n);for(let d=s.length-1;d>=0;d--)if(n=s[d],n.state===vt)qt(n);else if(n.state===Lt){const g=st;st=null,Et(()=>Tt(n,s[0]),!1),st=g}}function Et(n,s){if(st)return n();let d=!1;s||(st=[]),bt?d=!0:bt=[],jt++;try{const g=n();return ce(d),g}catch(g){d||(bt=null),st=null,te(g)}}function ce(n){if(st&&(Jt(st),st=null),n)return;const s=bt;bt=null,s.length&&Et(()=>Qt(s),!1)}function Jt(n){for(let s=0;s<n.length;s++)Rt(n[s])}function de(n){let s,d=0;for(s=0;s<n.length;s++){const g=n[s];g.user?n[d++]=g:Rt(g)}for(s=0;s<d;s++)Rt(n[s])}function Tt(n,s){n.state=0;for(let d=0;d<n.sources.length;d+=1){const g=n.sources[d];if(g.sources){const v=g.state;v===vt?g!==s&&(!g.updatedAt||g.updatedAt<jt)&&Rt(g):v===Lt&&Tt(g,s)}}}function Kt(n){for(let s=0;s<n.observers.length;s+=1){const d=n.observers[s];d.state||(d.state=Lt,d.pure?st.push(d):bt.push(d),d.observers&&Kt(d))}}function Dt(n){let s;if(n.sources)for(;n.sources.length;){const d=n.sources.pop(),g=n.sourceSlots.pop(),v=d.observers;if(v&&v.length){const _=v.pop(),S=d.observerSlots.pop();g<v.length&&(_.sourceSlots[S]=g,v[g]=_,d.observerSlots[g]=S)}}if(n.tOwned){for(s=n.tOwned.length-1;s>=0;s--)Dt(n.tOwned[s]);delete n.tOwned}if(n.owned){for(s=n.owned.length-1;s>=0;s--)Dt(n.owned[s]);n.owned=null}if(n.cleanups){for(s=n.cleanups.length-1;s>=0;s--)n.cleanups[s]();n.cleanups=null}n.state=0}function ue(n){return n instanceof Error?n:new Error(typeof n=="string"?n:"Unknown error",{cause:n})}function te(n,s=V){throw ue(n)}function Ct(n,s){return St(()=>n(s||{}))}const he=n=>`Stale read from <${n}>.`;function It(n){const s=n.keyed,d=Mt(()=>n.when,void 0,void 0),g=s?d:Mt(d,void 0,{equals:(v,_)=>!v==!_});return Mt(()=>{const v=g();if(v){const _=n.children;return typeof _=="function"&&_.length>0?St(()=>_(s?v:()=>{if(!St(g))throw he("Show");return d()})):_}return n.fallback},void 0,void 0)}function fe(n,s,d){let g=d.length,v=s.length,_=g,S=0,x=0,E=s[v-1].nextSibling,Q=null;for(;S<v||x<_;){if(s[S]===d[x]){S++,x++;continue}for(;s[v-1]===d[_-1];)v--,_--;if(v===S){const H=_<g?x?d[x-1].nextSibling:d[_-x]:E;for(;x<_;)n.insertBefore(d[x++],H)}else if(_===x)for(;S<v;)(!Q||!Q.has(s[S]))&&s[S].remove(),S++;else if(s[S]===d[_-1]&&d[x]===s[v-1]){const H=s[--v].nextSibling;n.insertBefore(d[x++],s[S++].nextSibling),n.insertBefore(d[--_],H),s[v]=d[_]}else{if(!Q){Q=new Map;let X=x;for(;X<_;)Q.set(d[X],X++)}const H=Q.get(s[S]);if(H!=null)if(x<H&&H<_){let X=S,J=1,nt;for(;++X<v&&X<_&&!((nt=Q.get(s[X]))==null||nt!==H+J);)J++;if(J>H-x){const ot=s[S];for(;x<H;)n.insertBefore(d[x++],ot)}else n.replaceChild(d[x++],s[S++])}else S++;else s[S++].remove()}}}const ee="_$DX_DELEGATE";function ge(n,s,d,g={}){let v;return se(_=>{v=_,s===document?n():mt(s,n(),s.firstChild?null:void 0,d)},g.owner),()=>{v(),s.textContent=""}}function kt(n,s,d,g){let v;const _=()=>{const x=document.createElement("template");return x.innerHTML=n,x.content.firstChild},S=()=>(v||(v=_())).cloneNode(!0);return S.cloneNode=S,S}function ne(n,s=window.document){const d=s[ee]||(s[ee]=new Set);for(let g=0,v=n.length;g<v;g++){const _=n[g];d.has(_)||(d.add(_),s.addEventListener(_,be))}}function pe(n,s,d,g){Array.isArray(d)?(n[`$$${s}`]=d[0],n[`$$${s}Data`]=d[1]):n[`$$${s}`]=d}function we(n,s,d){return St(()=>n(s,d))}function mt(n,s,d,g){if(d!==void 0&&!g&&(g=[]),typeof s!="function")return Nt(n,s,g,d);Ot(v=>Nt(n,s(),v,d),g)}function be(n){let s=n.target;const d=`$$${n.type}`,g=n.target,v=n.currentTarget,_=E=>Object.defineProperty(n,"target",{configurable:!0,value:E}),S=()=>{const E=s[d];if(E&&!s.disabled){const Q=s[`${d}Data`];if(Q!==void 0?E.call(s,Q,n):E.call(s,n),n.cancelBubble)return}return s.host&&typeof s.host!="string"&&!s.host._$host&&s.contains(n.target)&&_(s.host),!0},x=()=>{for(;S()&&(s=s._$host||s.parentNode||s.host););};if(Object.defineProperty(n,"currentTarget",{configurable:!0,get(){return s||document}}),n.composedPath){const E=n.composedPath();_(E[0]);for(let Q=0;Q<E.length-2&&(s=E[Q],!!S());Q++){if(s._$host){s=s._$host,x();break}if(s.parentNode===v)break}}else x();_(g)}function Nt(n,s,d,g,v){for(;typeof d=="function";)d=d();if(s===d)return d;const _=typeof s,S=g!==void 0;if(n=S&&d[0]&&d[0].parentNode||n,_==="string"||_==="number"){if(_==="number"&&(s=s.toString(),s===d))return d;if(S){let x=d[0];x&&x.nodeType===3?x.data!==s&&(x.data=s):x=document.createTextNode(s),d=At(n,d,g,x)}else d!==""&&typeof d=="string"?d=n.firstChild.data=s:d=n.textContent=s}else if(s==null||_==="boolean")d=At(n,d,g);else{if(_==="function")return Ot(()=>{let x=s();for(;typeof x=="function";)x=x();d=Nt(n,x,d,g)}),()=>d;if(Array.isArray(s)){const x=[],E=d&&Array.isArray(d);if(Wt(x,s,d,v))return Ot(()=>d=Nt(n,x,d,g,!0)),()=>d;if(x.length===0){if(d=At(n,d,g),S)return d}else E?d.length===0?ie(n,x,g):fe(n,d,x):(d&&At(n),ie(n,x));d=x}else if(s.nodeType){if(Array.isArray(d)){if(S)return d=At(n,d,g,s);At(n,d,null,s)}else d==null||d===""||!n.firstChild?n.appendChild(s):n.replaceChild(s,n.firstChild);d=s}}return d}function Wt(n,s,d,g){let v=!1;for(let _=0,S=s.length;_<S;_++){let x=s[_],E=d&&d[n.length],Q;if(!(x==null||x===!0||x===!1))if((Q=typeof x)=="object"&&x.nodeType)n.push(x);else if(Array.isArray(x))v=Wt(n,x,E)||v;else if(Q==="function")if(g){for(;typeof x=="function";)x=x();v=Wt(n,Array.isArray(x)?x:[x],Array.isArray(E)?E:[E])||v}else n.push(x),v=!0;else{const H=String(x);E&&E.nodeType===3&&E.data===H?n.push(E):n.push(document.createTextNode(H))}}return v}function ie(n,s,d=null){for(let g=0,v=s.length;g<v;g++)n.insertBefore(s[g],d)}function At(n,s,d,g){if(d===void 0)return n.textContent="";const v=g||document.createTextNode("");if(s.length){let _=!1;for(let S=s.length-1;S>=0;S--){const x=s[S];if(v!==x){const E=x.parentNode===n;!_&&!S?E?n.replaceChild(v,x):n.insertBefore(v,d):E&&x.remove()}else _=!0}}else n.insertBefore(v,d);return[v]}class me{constructor(s=!1){this.socket=null,this.reconnectTimeout=null,this.reconnectAttempts=0,this.maxReconnectAttempts=6,this.transferId=null,this.signature=null,this.onStatusCallback=null,this.onErrorCallback=null,this.onConnectionCallback=null,this.wsBaseUrl=s?"transfer-status-test.zenobiapay.com":"transfer-status.zenobiapay.com"}getSignature(){return this.signature}getTransferId(){return this.transferId}async createTransfer(s,d){try{const g=await fetch(s,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(d)});if(!g.ok){const _=await g.json();throw new Error(_.message||"Failed to create transfer request")}const v=await g.json();return this.transferId=v.transferRequestId,this.signature=v.signature,v}catch(g){throw console.error("Error creating transfer request:",g),g instanceof Error?g:new Error("Failed to create transfer request")}}listenToTransfer(s,d,g,v,_){this.transferId=s,this.signature=d,g&&(this.onStatusCallback=g),v&&(this.onErrorCallback=v),_&&(this.onConnectionCallback=_),this.connectWebSocket()}async createTransferAndListen(s,d,g,v,_){const S=await this.createTransfer(s,d);return this.listenToTransfer(S.transferRequestId,S.signature,g,v,_),S}connectWebSocket(){if(this.socket&&(this.socket.close(),this.socket=null,this.notifyConnectionStatus(!1)),!this.transferId||!this.signature){console.error("Cannot connect to WebSocket: Missing transfer ID or signature");return}try{const d=`${window.location.protocol==="https:"?"wss:":"ws:"}//${this.wsBaseUrl}/transfers/${this.transferId}/ws?token=${this.signature}`,g=new WebSocket(d);this.socket=g,g.onopen=()=>{this.notifyConnectionStatus(!0),this.reconnectAttempts=0},g.onclose=v=>{this.notifyConnectionStatus(!1),this.socket=null,v.code!==1e3&&this.reconnectAttempts<this.maxReconnectAttempts&&this.attemptReconnect()},g.onerror=v=>{console.error(`WebSocket error for transfer: ${this.transferId}`,v),this.notifyError("WebSocket error occurred")},g.onmessage=v=>{console.log(`WebSocket message received for transfer: ${this.transferId}`,v.data);try{const _=JSON.parse(v.data);_.type==="status"&&_.transfer?this.notifyStatus(_.transfer):_.type==="error"&&_.message?this.notifyError(_.message):_.type==="ping"&&g.readyState===WebSocket.OPEN&&g.send(JSON.stringify({type:"pong"}))}catch{this.notifyError("Failed to parse message")}}}catch{this.notifyError("Failed to establish WebSocket connection")}}attemptReconnect(){this.reconnectAttempts++;const s=Math.min(1e3*Math.pow(2,this.reconnectAttempts-1),3e4);console.log(`Attempting to reconnect in ${s}ms (attempt ${this.reconnectAttempts})`),this.reconnectTimeout&&window.clearTimeout(this.reconnectTimeout),this.reconnectTimeout=window.setTimeout(()=>{console.log(`Reconnecting to WebSocket (attempt ${this.reconnectAttempts})...`),this.connectWebSocket()},s)}disconnect(){this.reconnectTimeout&&(window.clearTimeout(this.reconnectTimeout),this.reconnectTimeout=null),this.socket&&this.socket.readyState<2&&(console.log(`Closing WebSocket for transfer: ${this.transferId}`),this.socket.close(),this.socket=null,this.notifyConnectionStatus(!1)),this.transferId=null,this.signature=null}notifyConnectionStatus(s){this.onConnectionCallback&&this.onConnectionCallback(s)}notifyStatus(s){this.onStatusCallback&&this.onStatusCallback(s)}notifyError(s){this.onErrorCallback&&this.onErrorCallback(s)}}function ve(n){return n&&n.__esModule&&Object.prototype.hasOwnProperty.call(n,"default")?n.default:n}var Ft={exports:{}},ye=Ft.exports,oe;function xe(){return oe||(oe=1,function(n,s){(function(d,g){n.exports=g()})(ye,()=>(()=>{var d={873:(S,x)=>{var E,Q,H=function(){var X=function(p,w){var u=p,e=gt[w],t=null,o=0,r=null,i=[],c={},y=function(a,h){t=function(l){for(var f=new Array(l),b=0;b<l;b+=1){f[b]=new Array(l);for(var z=0;z<l;z+=1)f[b][z]=null}return f}(o=4*u+17),m(0,0),m(o-7,0),m(0,o-7),C(),A(),k(a,h),u>=7&&$(a),r==null&&(r=B(u,e,i)),O(r,h)},m=function(a,h){for(var l=-1;l<=7;l+=1)if(!(a+l<=-1||o<=a+l))for(var f=-1;f<=7;f+=1)h+f<=-1||o<=h+f||(t[a+l][h+f]=0<=l&&l<=6&&(f==0||f==6)||0<=f&&f<=6&&(l==0||l==6)||2<=l&&l<=4&&2<=f&&f<=4)},A=function(){for(var a=8;a<o-8;a+=1)t[a][6]==null&&(t[a][6]=a%2==0);for(var h=8;h<o-8;h+=1)t[6][h]==null&&(t[6][h]=h%2==0)},C=function(){for(var a=K.getPatternPosition(u),h=0;h<a.length;h+=1)for(var l=0;l<a.length;l+=1){var f=a[h],b=a[l];if(t[f][b]==null)for(var z=-2;z<=2;z+=1)for(var D=-2;D<=2;D+=1)t[f+z][b+D]=z==-2||z==2||D==-2||D==2||z==0&&D==0}},$=function(a){for(var h=K.getBCHTypeNumber(u),l=0;l<18;l+=1){var f=!a&&(h>>l&1)==1;t[Math.floor(l/3)][l%3+o-8-3]=f}for(l=0;l<18;l+=1)f=!a&&(h>>l&1)==1,t[l%3+o-8-3][Math.floor(l/3)]=f},k=function(a,h){for(var l=e<<3|h,f=K.getBCHTypeInfo(l),b=0;b<15;b+=1){var z=!a&&(f>>b&1)==1;b<6?t[b][8]=z:b<8?t[b+1][8]=z:t[o-15+b][8]=z}for(b=0;b<15;b+=1)z=!a&&(f>>b&1)==1,b<8?t[8][o-b-1]=z:b<9?t[8][15-b-1+1]=z:t[8][15-b-1]=z;t[o-8][8]=!a},O=function(a,h){for(var l=-1,f=o-1,b=7,z=0,D=K.getMaskFunction(h),P=o-1;P>0;P-=2)for(P==6&&(P-=1);;){for(var j=0;j<2;j+=1)if(t[f][P-j]==null){var R=!1;z<a.length&&(R=(a[z]>>>b&1)==1),D(f,P-j)&&(R=!R),t[f][P-j]=R,(b-=1)==-1&&(z+=1,b=7)}if((f+=l)<0||o<=f){f-=l,l=-l;break}}},B=function(a,h,l){for(var f=zt.getRSBlocks(a,h),b=xt(),z=0;z<l.length;z+=1){var D=l[z];b.put(D.getMode(),4),b.put(D.getLength(),K.getLengthInBits(D.getMode(),a)),D.write(b)}var P=0;for(z=0;z<f.length;z+=1)P+=f[z].dataCount;if(b.getLengthInBits()>8*P)throw"code length overflow. ("+b.getLengthInBits()+">"+8*P+")";for(b.getLengthInBits()+4<=8*P&&b.put(0,4);b.getLengthInBits()%8!=0;)b.putBit(!1);for(;!(b.getLengthInBits()>=8*P||(b.put(236,8),b.getLengthInBits()>=8*P));)b.put(17,8);return function(j,R){for(var F=0,rt=0,Y=0,U=new Array(R.length),T=new Array(R.length),M=0;M<R.length;M+=1){var G=R[M].dataCount,et=R[M].totalCount-G;rt=Math.max(rt,G),Y=Math.max(Y,et),U[M]=new Array(G);for(var I=0;I<U[M].length;I+=1)U[M][I]=255&j.getBuffer()[I+F];F+=G;var ht=K.getErrorCorrectPolynomial(et),lt=ft(U[M],ht.getLength()-1).mod(ht);for(T[M]=new Array(ht.getLength()-1),I=0;I<T[M].length;I+=1){var at=I+lt.getLength()-T[M].length;T[M][I]=at>=0?lt.getAt(at):0}}var Ut=0;for(I=0;I<R.length;I+=1)Ut+=R[I].totalCount;var Pt=new Array(Ut),wt=0;for(I=0;I<rt;I+=1)for(M=0;M<R.length;M+=1)I<U[M].length&&(Pt[wt]=U[M][I],wt+=1);for(I=0;I<Y;I+=1)for(M=0;M<R.length;M+=1)I<T[M].length&&(Pt[wt]=T[M][I],wt+=1);return Pt}(b,f)};c.addData=function(a,h){var l=null;switch(h=h||"Byte"){case"Numeric":l=L(a);break;case"Alphanumeric":l=it(a);break;case"Byte":l=W(a);break;case"Kanji":l=dt(a);break;default:throw"mode:"+h}i.push(l),r=null},c.isDark=function(a,h){if(a<0||o<=a||h<0||o<=h)throw a+","+h;return t[a][h]},c.getModuleCount=function(){return o},c.make=function(){if(u<1){for(var a=1;a<40;a++){for(var h=zt.getRSBlocks(a,e),l=xt(),f=0;f<i.length;f++){var b=i[f];l.put(b.getMode(),4),l.put(b.getLength(),K.getLengthInBits(b.getMode(),a)),b.write(l)}var z=0;for(f=0;f<h.length;f++)z+=h[f].dataCount;if(l.getLengthInBits()<=8*z)break}u=a}y(!1,function(){for(var D=0,P=0,j=0;j<8;j+=1){y(!0,j);var R=K.getLostPoint(c);(j==0||D>R)&&(D=R,P=j)}return P}())},c.createTableTag=function(a,h){a=a||2;var l="";l+='<table style="',l+=" border-width: 0px; border-style: none;",l+=" border-collapse: collapse;",l+=" padding: 0px; margin: "+(h=h===void 0?4*a:h)+"px;",l+='">',l+="<tbody>";for(var f=0;f<c.getModuleCount();f+=1){l+="<tr>";for(var b=0;b<c.getModuleCount();b+=1)l+='<td style="',l+=" border-width: 0px; border-style: none;",l+=" border-collapse: collapse;",l+=" padding: 0px; margin: 0px;",l+=" width: "+a+"px;",l+=" height: "+a+"px;",l+=" background-color: ",l+=c.isDark(f,b)?"#000000":"#ffffff",l+=";",l+='"/>';l+="</tr>"}return(l+="</tbody>")+"</table>"},c.createSvgTag=function(a,h,l,f){var b={};typeof arguments[0]=="object"&&(a=(b=arguments[0]).cellSize,h=b.margin,l=b.alt,f=b.title),a=a||2,h=h===void 0?4*a:h,(l=typeof l=="string"?{text:l}:l||{}).text=l.text||null,l.id=l.text?l.id||"qrcode-description":null,(f=typeof f=="string"?{text:f}:f||{}).text=f.text||null,f.id=f.text?f.id||"qrcode-title":null;var z,D,P,j,R=c.getModuleCount()*a+2*h,F="";for(j="l"+a+",0 0,"+a+" -"+a+",0 0,-"+a+"z ",F+='<svg version="1.1" xmlns="http://www.w3.org/2000/svg"',F+=b.scalable?"":' width="'+R+'px" height="'+R+'px"',F+=' viewBox="0 0 '+R+" "+R+'" ',F+=' preserveAspectRatio="xMinYMin meet"',F+=f.text||l.text?' role="img" aria-labelledby="'+q([f.id,l.id].join(" ").trim())+'"':"",F+=">",F+=f.text?'<title id="'+q(f.id)+'">'+q(f.text)+"</title>":"",F+=l.text?'<description id="'+q(l.id)+'">'+q(l.text)+"</description>":"",F+='<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>',F+='<path d="',D=0;D<c.getModuleCount();D+=1)for(P=D*a+h,z=0;z<c.getModuleCount();z+=1)c.isDark(D,z)&&(F+="M"+(z*a+h)+","+P+j);return(F+='" stroke="transparent" fill="black"/>')+"</svg>"},c.createDataURL=function(a,h){a=a||2,h=h===void 0?4*a:h;var l=c.getModuleCount()*a+2*h,f=h,b=l-h;return ut(l,l,function(z,D){if(f<=z&&z<b&&f<=D&&D<b){var P=Math.floor((z-f)/a),j=Math.floor((D-f)/a);return c.isDark(j,P)?0:1}return 1})},c.createImgTag=function(a,h,l){a=a||2,h=h===void 0?4*a:h;var f=c.getModuleCount()*a+2*h,b="";return b+="<img",b+=' src="',b+=c.createDataURL(a,h),b+='"',b+=' width="',b+=f,b+='"',b+=' height="',b+=f,b+='"',l&&(b+=' alt="',b+=q(l),b+='"'),b+"/>"};var q=function(a){for(var h="",l=0;l<a.length;l+=1){var f=a.charAt(l);switch(f){case"<":h+="&lt;";break;case">":h+="&gt;";break;case"&":h+="&amp;";break;case'"':h+="&quot;";break;default:h+=f}}return h};return c.createASCII=function(a,h){if((a=a||1)<2)return function(U){U=U===void 0?2:U;var T,M,G,et,I,ht=1*c.getModuleCount()+2*U,lt=U,at=ht-U,Ut={"██":"█","█ ":"▀"," █":"▄","  ":" "},Pt={"██":"▀","█ ":"▀"," █":" ","  ":" "},wt="";for(T=0;T<ht;T+=2){for(G=Math.floor((T-lt)/1),et=Math.floor((T+1-lt)/1),M=0;M<ht;M+=1)I="█",lt<=M&&M<at&&lt<=T&&T<at&&c.isDark(G,Math.floor((M-lt)/1))&&(I=" "),lt<=M&&M<at&&lt<=T+1&&T+1<at&&c.isDark(et,Math.floor((M-lt)/1))?I+=" ":I+="█",wt+=U<1&&T+1>=at?Pt[I]:Ut[I];wt+=`
`}return ht%2&&U>0?wt.substring(0,wt.length-ht-1)+Array(ht+1).join("▀"):wt.substring(0,wt.length-1)}(h);a-=1,h=h===void 0?2*a:h;var l,f,b,z,D=c.getModuleCount()*a+2*h,P=h,j=D-h,R=Array(a+1).join("██"),F=Array(a+1).join("  "),rt="",Y="";for(l=0;l<D;l+=1){for(b=Math.floor((l-P)/a),Y="",f=0;f<D;f+=1)z=1,P<=f&&f<j&&P<=l&&l<j&&c.isDark(b,Math.floor((f-P)/a))&&(z=0),Y+=z?R:F;for(b=0;b<a;b+=1)rt+=Y+`
`}return rt.substring(0,rt.length-1)},c.renderTo2dContext=function(a,h){h=h||2;for(var l=c.getModuleCount(),f=0;f<l;f++)for(var b=0;b<l;b++)a.fillStyle=c.isDark(f,b)?"black":"white",a.fillRect(f*h,b*h,h,h)},c};X.stringToBytes=(X.stringToBytesFuncs={default:function(p){for(var w=[],u=0;u<p.length;u+=1){var e=p.charCodeAt(u);w.push(255&e)}return w}}).default,X.createStringToBytes=function(p,w){var u=function(){for(var t=_t(p),o=function(){var A=t.read();if(A==-1)throw"eof";return A},r=0,i={};;){var c=t.read();if(c==-1)break;var y=o(),m=o()<<8|o();i[String.fromCharCode(c<<8|y)]=m,r+=1}if(r!=w)throw r+" != "+w;return i}(),e=63;return function(t){for(var o=[],r=0;r<t.length;r+=1){var i=t.charCodeAt(r);if(i<128)o.push(i);else{var c=u[t.charAt(r)];typeof c=="number"?(255&c)==c?o.push(c):(o.push(c>>>8),o.push(255&c)):o.push(e)}}return o}};var J,nt,ot,N,ct,gt={L:1,M:0,Q:3,H:2},K=(J=[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],nt=1335,ot=7973,ct=function(p){for(var w=0;p!=0;)w+=1,p>>>=1;return w},(N={}).getBCHTypeInfo=function(p){for(var w=p<<10;ct(w)-ct(nt)>=0;)w^=nt<<ct(w)-ct(nt);return 21522^(p<<10|w)},N.getBCHTypeNumber=function(p){for(var w=p<<12;ct(w)-ct(ot)>=0;)w^=ot<<ct(w)-ct(ot);return p<<12|w},N.getPatternPosition=function(p){return J[p-1]},N.getMaskFunction=function(p){switch(p){case 0:return function(w,u){return(w+u)%2==0};case 1:return function(w,u){return w%2==0};case 2:return function(w,u){return u%3==0};case 3:return function(w,u){return(w+u)%3==0};case 4:return function(w,u){return(Math.floor(w/2)+Math.floor(u/3))%2==0};case 5:return function(w,u){return w*u%2+w*u%3==0};case 6:return function(w,u){return(w*u%2+w*u%3)%2==0};case 7:return function(w,u){return(w*u%3+(w+u)%2)%2==0};default:throw"bad maskPattern:"+p}},N.getErrorCorrectPolynomial=function(p){for(var w=ft([1],0),u=0;u<p;u+=1)w=w.multiply(ft([1,tt.gexp(u)],0));return w},N.getLengthInBits=function(p,w){if(1<=w&&w<10)switch(p){case 1:return 10;case 2:return 9;case 4:case 8:return 8;default:throw"mode:"+p}else if(w<27)switch(p){case 1:return 12;case 2:return 11;case 4:return 16;case 8:return 10;default:throw"mode:"+p}else{if(!(w<41))throw"type:"+w;switch(p){case 1:return 14;case 2:return 13;case 4:return 16;case 8:return 12;default:throw"mode:"+p}}},N.getLostPoint=function(p){for(var w=p.getModuleCount(),u=0,e=0;e<w;e+=1)for(var t=0;t<w;t+=1){for(var o=0,r=p.isDark(e,t),i=-1;i<=1;i+=1)if(!(e+i<0||w<=e+i))for(var c=-1;c<=1;c+=1)t+c<0||w<=t+c||i==0&&c==0||r==p.isDark(e+i,t+c)&&(o+=1);o>5&&(u+=3+o-5)}for(e=0;e<w-1;e+=1)for(t=0;t<w-1;t+=1){var y=0;p.isDark(e,t)&&(y+=1),p.isDark(e+1,t)&&(y+=1),p.isDark(e,t+1)&&(y+=1),p.isDark(e+1,t+1)&&(y+=1),y!=0&&y!=4||(u+=3)}for(e=0;e<w;e+=1)for(t=0;t<w-6;t+=1)p.isDark(e,t)&&!p.isDark(e,t+1)&&p.isDark(e,t+2)&&p.isDark(e,t+3)&&p.isDark(e,t+4)&&!p.isDark(e,t+5)&&p.isDark(e,t+6)&&(u+=40);for(t=0;t<w;t+=1)for(e=0;e<w-6;e+=1)p.isDark(e,t)&&!p.isDark(e+1,t)&&p.isDark(e+2,t)&&p.isDark(e+3,t)&&p.isDark(e+4,t)&&!p.isDark(e+5,t)&&p.isDark(e+6,t)&&(u+=40);var m=0;for(t=0;t<w;t+=1)for(e=0;e<w;e+=1)p.isDark(e,t)&&(m+=1);return u+Math.abs(100*m/w/w-50)/5*10},N),tt=function(){for(var p=new Array(256),w=new Array(256),u=0;u<8;u+=1)p[u]=1<<u;for(u=8;u<256;u+=1)p[u]=p[u-4]^p[u-5]^p[u-6]^p[u-8];for(u=0;u<255;u+=1)w[p[u]]=u;return{glog:function(e){if(e<1)throw"glog("+e+")";return w[e]},gexp:function(e){for(;e<0;)e+=255;for(;e>=256;)e-=255;return p[e]}}}();function ft(p,w){if(p.length===void 0)throw p.length+"/"+w;var u=function(){for(var t=0;t<p.length&&p[t]==0;)t+=1;for(var o=new Array(p.length-t+w),r=0;r<p.length-t;r+=1)o[r]=p[r+t];return o}(),e={getAt:function(t){return u[t]},getLength:function(){return u.length},multiply:function(t){for(var o=new Array(e.getLength()+t.getLength()-1),r=0;r<e.getLength();r+=1)for(var i=0;i<t.getLength();i+=1)o[r+i]^=tt.gexp(tt.glog(e.getAt(r))+tt.glog(t.getAt(i)));return ft(o,0)},mod:function(t){if(e.getLength()-t.getLength()<0)return e;for(var o=tt.glog(e.getAt(0))-tt.glog(t.getAt(0)),r=new Array(e.getLength()),i=0;i<e.getLength();i+=1)r[i]=e.getAt(i);for(i=0;i<t.getLength();i+=1)r[i]^=tt.gexp(tt.glog(t.getAt(i))+o);return ft(r,0).mod(t)}};return e}var zt=function(){var p=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12,7,37,13],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]],w=function(e,t){var o={};return o.totalCount=e,o.dataCount=t,o},u={getRSBlocks:function(e,t){var o=function($,k){switch(k){case gt.L:return p[4*($-1)+0];case gt.M:return p[4*($-1)+1];case gt.Q:return p[4*($-1)+2];case gt.H:return p[4*($-1)+3];default:return}}(e,t);if(o===void 0)throw"bad rs block @ typeNumber:"+e+"/errorCorrectionLevel:"+t;for(var r=o.length/3,i=[],c=0;c<r;c+=1)for(var y=o[3*c+0],m=o[3*c+1],A=o[3*c+2],C=0;C<y;C+=1)i.push(w(m,A));return i}};return u}(),xt=function(){var p=[],w=0,u={getBuffer:function(){return p},getAt:function(e){var t=Math.floor(e/8);return(p[t]>>>7-e%8&1)==1},put:function(e,t){for(var o=0;o<t;o+=1)u.putBit((e>>>t-o-1&1)==1)},getLengthInBits:function(){return w},putBit:function(e){var t=Math.floor(w/8);p.length<=t&&p.push(0),e&&(p[t]|=128>>>w%8),w+=1}};return u},L=function(p){var w=p,u={getMode:function(){return 1},getLength:function(o){return w.length},write:function(o){for(var r=w,i=0;i+2<r.length;)o.put(e(r.substring(i,i+3)),10),i+=3;i<r.length&&(r.length-i==1?o.put(e(r.substring(i,i+1)),4):r.length-i==2&&o.put(e(r.substring(i,i+2)),7))}},e=function(o){for(var r=0,i=0;i<o.length;i+=1)r=10*r+t(o.charAt(i));return r},t=function(o){if("0"<=o&&o<="9")return o.charCodeAt(0)-48;throw"illegal char :"+o};return u},it=function(p){var w=p,u={getMode:function(){return 2},getLength:function(t){return w.length},write:function(t){for(var o=w,r=0;r+1<o.length;)t.put(45*e(o.charAt(r))+e(o.charAt(r+1)),11),r+=2;r<o.length&&t.put(e(o.charAt(r)),6)}},e=function(t){if("0"<=t&&t<="9")return t.charCodeAt(0)-48;if("A"<=t&&t<="Z")return t.charCodeAt(0)-65+10;switch(t){case" ":return 36;case"$":return 37;case"%":return 38;case"*":return 39;case"+":return 40;case"-":return 41;case".":return 42;case"/":return 43;case":":return 44;default:throw"illegal char :"+t}};return u},W=function(p){var w=X.stringToBytes(p);return{getMode:function(){return 4},getLength:function(u){return w.length},write:function(u){for(var e=0;e<w.length;e+=1)u.put(w[e],8)}}},dt=function(p){var w=X.stringToBytesFuncs.SJIS;if(!w)throw"sjis not supported.";(function(){var t=w("友");if(t.length!=2||(t[0]<<8|t[1])!=38726)throw"sjis not supported."})();var u=w(p),e={getMode:function(){return 8},getLength:function(t){return~~(u.length/2)},write:function(t){for(var o=u,r=0;r+1<o.length;){var i=(255&o[r])<<8|255&o[r+1];if(33088<=i&&i<=40956)i-=33088;else{if(!(57408<=i&&i<=60351))throw"illegal char at "+(r+1)+"/"+i;i-=49472}i=192*(i>>>8&255)+(255&i),t.put(i,13),r+=2}if(r<o.length)throw"illegal char at "+(r+1)}};return e},pt=function(){var p=[],w={writeByte:function(u){p.push(255&u)},writeShort:function(u){w.writeByte(u),w.writeByte(u>>>8)},writeBytes:function(u,e,t){e=e||0,t=t||u.length;for(var o=0;o<t;o+=1)w.writeByte(u[o+e])},writeString:function(u){for(var e=0;e<u.length;e+=1)w.writeByte(u.charCodeAt(e))},toByteArray:function(){return p},toString:function(){var u="";u+="[";for(var e=0;e<p.length;e+=1)e>0&&(u+=","),u+=p[e];return u+"]"}};return w},_t=function(p){var w=p,u=0,e=0,t=0,o={read:function(){for(;t<8;){if(u>=w.length){if(t==0)return-1;throw"unexpected end of file./"+t}var i=w.charAt(u);if(u+=1,i=="=")return t=0,-1;i.match(/^\s$/)||(e=e<<6|r(i.charCodeAt(0)),t+=6)}var c=e>>>t-8&255;return t-=8,c}},r=function(i){if(65<=i&&i<=90)return i-65;if(97<=i&&i<=122)return i-97+26;if(48<=i&&i<=57)return i-48+52;if(i==43)return 62;if(i==47)return 63;throw"c:"+i};return o},ut=function(p,w,u){for(var e=function(m,A){var C=m,$=A,k=new Array(m*A),O={setPixel:function(a,h,l){k[h*C+a]=l},write:function(a){a.writeString("GIF87a"),a.writeShort(C),a.writeShort($),a.writeByte(128),a.writeByte(0),a.writeByte(0),a.writeByte(0),a.writeByte(0),a.writeByte(0),a.writeByte(255),a.writeByte(255),a.writeByte(255),a.writeString(","),a.writeShort(0),a.writeShort(0),a.writeShort(C),a.writeShort($),a.writeByte(0);var h=B(2);a.writeByte(2);for(var l=0;h.length-l>255;)a.writeByte(255),a.writeBytes(h,l,255),l+=255;a.writeByte(h.length-l),a.writeBytes(h,l,h.length-l),a.writeByte(0),a.writeString(";")}},B=function(a){for(var h=1<<a,l=1+(1<<a),f=a+1,b=q(),z=0;z<h;z+=1)b.add(String.fromCharCode(z));b.add(String.fromCharCode(h)),b.add(String.fromCharCode(l));var D,P,j,R=pt(),F=(D=R,P=0,j=0,{write:function(T,M){if(T>>>M)throw"length over";for(;P+M>=8;)D.writeByte(255&(T<<P|j)),M-=8-P,T>>>=8-P,j=0,P=0;j|=T<<P,P+=M},flush:function(){P>0&&D.writeByte(j)}});F.write(h,f);var rt=0,Y=String.fromCharCode(k[rt]);for(rt+=1;rt<k.length;){var U=String.fromCharCode(k[rt]);rt+=1,b.contains(Y+U)?Y+=U:(F.write(b.indexOf(Y),f),b.size()<4095&&(b.size()==1<<f&&(f+=1),b.add(Y+U)),Y=U)}return F.write(b.indexOf(Y),f),F.write(l,f),F.flush(),R.toByteArray()},q=function(){var a={},h=0,l={add:function(f){if(l.contains(f))throw"dup key:"+f;a[f]=h,h+=1},size:function(){return h},indexOf:function(f){return a[f]},contains:function(f){return a[f]!==void 0}};return l};return O}(p,w),t=0;t<w;t+=1)for(var o=0;o<p;o+=1)e.setPixel(o,t,u(o,t));var r=pt();e.write(r);for(var i=function(){var m=0,A=0,C=0,$="",k={},O=function(q){$+=String.fromCharCode(B(63&q))},B=function(q){if(!(q<0)){if(q<26)return 65+q;if(q<52)return q-26+97;if(q<62)return q-52+48;if(q==62)return 43;if(q==63)return 47}throw"n:"+q};return k.writeByte=function(q){for(m=m<<8|255&q,A+=8,C+=1;A>=6;)O(m>>>A-6),A-=6},k.flush=function(){if(A>0&&(O(m<<6-A),m=0,A=0),C%3!=0)for(var q=3-C%3,a=0;a<q;a+=1)$+="="},k.toString=function(){return $},k}(),c=r.toByteArray(),y=0;y<c.length;y+=1)i.writeByte(c[y]);return i.flush(),"data:image/gif;base64,"+i};return X}();H.stringToBytesFuncs["UTF-8"]=function(X){return function(J){for(var nt=[],ot=0;ot<J.length;ot++){var N=J.charCodeAt(ot);N<128?nt.push(N):N<2048?nt.push(192|N>>6,128|63&N):N<55296||N>=57344?nt.push(224|N>>12,128|N>>6&63,128|63&N):(ot++,N=65536+((1023&N)<<10|1023&J.charCodeAt(ot)),nt.push(240|N>>18,128|N>>12&63,128|N>>6&63,128|63&N))}return nt}(X)},(Q=typeof(E=function(){return H})=="function"?E.apply(x,[]):E)===void 0||(S.exports=Q)}},g={};function v(S){var x=g[S];if(x!==void 0)return x.exports;var E=g[S]={exports:{}};return d[S](E,E.exports,v),E.exports}v.n=S=>{var x=S&&S.__esModule?()=>S.default:()=>S;return v.d(x,{a:x}),x},v.d=(S,x)=>{for(var E in x)v.o(x,E)&&!v.o(S,E)&&Object.defineProperty(S,E,{enumerable:!0,get:x[E]})},v.o=(S,x)=>Object.prototype.hasOwnProperty.call(S,x);var _={};return(()=>{v.d(_,{default:()=>w});const S=u=>!!u&&typeof u=="object"&&!Array.isArray(u);function x(u,...e){if(!e.length)return u;const t=e.shift();return t!==void 0&&S(u)&&S(t)?(u=Object.assign({},u),Object.keys(t).forEach(o=>{const r=u[o],i=t[o];Array.isArray(r)&&Array.isArray(i)?u[o]=i:S(r)&&S(i)?u[o]=x(Object.assign({},r),i):u[o]=i}),x(u,...e)):u}function E(u,e){const t=document.createElement("a");t.download=e,t.href=u,document.body.appendChild(t),t.click(),document.body.removeChild(t)}const Q={L:.07,M:.15,Q:.25,H:.3};class H{constructor({svg:e,type:t,window:o}){this._svg=e,this._type=t,this._window=o}draw(e,t,o,r){let i;switch(this._type){case"dots":i=this._drawDot;break;case"classy":i=this._drawClassy;break;case"classy-rounded":i=this._drawClassyRounded;break;case"rounded":i=this._drawRounded;break;case"extra-rounded":i=this._drawExtraRounded;break;default:i=this._drawSquare}i.call(this,{x:e,y:t,size:o,getNeighbor:r})}_rotateFigure({x:e,y:t,size:o,rotation:r=0,draw:i}){var c;const y=e+o/2,m=t+o/2;i(),(c=this._element)===null||c===void 0||c.setAttribute("transform",`rotate(${180*r/Math.PI},${y},${m})`)}_basicDot(e){const{size:t,x:o,y:r}=e;this._rotateFigure(Object.assign(Object.assign({},e),{draw:()=>{this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","circle"),this._element.setAttribute("cx",String(o+t/2)),this._element.setAttribute("cy",String(r+t/2)),this._element.setAttribute("r",String(t/2))}}))}_basicSquare(e){const{size:t,x:o,y:r}=e;this._rotateFigure(Object.assign(Object.assign({},e),{draw:()=>{this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","rect"),this._element.setAttribute("x",String(o)),this._element.setAttribute("y",String(r)),this._element.setAttribute("width",String(t)),this._element.setAttribute("height",String(t))}}))}_basicSideRounded(e){const{size:t,x:o,y:r}=e;this._rotateFigure(Object.assign(Object.assign({},e),{draw:()=>{this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","path"),this._element.setAttribute("d",`M ${o} ${r}v ${t}h `+t/2+`a ${t/2} ${t/2}, 0, 0, 0, 0 ${-t}`)}}))}_basicCornerRounded(e){const{size:t,x:o,y:r}=e;this._rotateFigure(Object.assign(Object.assign({},e),{draw:()=>{this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","path"),this._element.setAttribute("d",`M ${o} ${r}v ${t}h ${t}v `+-t/2+`a ${t/2} ${t/2}, 0, 0, 0, ${-t/2} ${-t/2}`)}}))}_basicCornerExtraRounded(e){const{size:t,x:o,y:r}=e;this._rotateFigure(Object.assign(Object.assign({},e),{draw:()=>{this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","path"),this._element.setAttribute("d",`M ${o} ${r}v ${t}h ${t}a ${t} ${t}, 0, 0, 0, ${-t} ${-t}`)}}))}_basicCornersRounded(e){const{size:t,x:o,y:r}=e;this._rotateFigure(Object.assign(Object.assign({},e),{draw:()=>{this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","path"),this._element.setAttribute("d",`M ${o} ${r}v `+t/2+`a ${t/2} ${t/2}, 0, 0, 0, ${t/2} ${t/2}h `+t/2+"v "+-t/2+`a ${t/2} ${t/2}, 0, 0, 0, ${-t/2} ${-t/2}`)}}))}_drawDot({x:e,y:t,size:o}){this._basicDot({x:e,y:t,size:o,rotation:0})}_drawSquare({x:e,y:t,size:o}){this._basicSquare({x:e,y:t,size:o,rotation:0})}_drawRounded({x:e,y:t,size:o,getNeighbor:r}){const i=r?+r(-1,0):0,c=r?+r(1,0):0,y=r?+r(0,-1):0,m=r?+r(0,1):0,A=i+c+y+m;if(A!==0)if(A>2||i&&c||y&&m)this._basicSquare({x:e,y:t,size:o,rotation:0});else{if(A===2){let C=0;return i&&y?C=Math.PI/2:y&&c?C=Math.PI:c&&m&&(C=-Math.PI/2),void this._basicCornerRounded({x:e,y:t,size:o,rotation:C})}if(A===1){let C=0;return y?C=Math.PI/2:c?C=Math.PI:m&&(C=-Math.PI/2),void this._basicSideRounded({x:e,y:t,size:o,rotation:C})}}else this._basicDot({x:e,y:t,size:o,rotation:0})}_drawExtraRounded({x:e,y:t,size:o,getNeighbor:r}){const i=r?+r(-1,0):0,c=r?+r(1,0):0,y=r?+r(0,-1):0,m=r?+r(0,1):0,A=i+c+y+m;if(A!==0)if(A>2||i&&c||y&&m)this._basicSquare({x:e,y:t,size:o,rotation:0});else{if(A===2){let C=0;return i&&y?C=Math.PI/2:y&&c?C=Math.PI:c&&m&&(C=-Math.PI/2),void this._basicCornerExtraRounded({x:e,y:t,size:o,rotation:C})}if(A===1){let C=0;return y?C=Math.PI/2:c?C=Math.PI:m&&(C=-Math.PI/2),void this._basicSideRounded({x:e,y:t,size:o,rotation:C})}}else this._basicDot({x:e,y:t,size:o,rotation:0})}_drawClassy({x:e,y:t,size:o,getNeighbor:r}){const i=r?+r(-1,0):0,c=r?+r(1,0):0,y=r?+r(0,-1):0,m=r?+r(0,1):0;i+c+y+m!==0?i||y?c||m?this._basicSquare({x:e,y:t,size:o,rotation:0}):this._basicCornerRounded({x:e,y:t,size:o,rotation:Math.PI/2}):this._basicCornerRounded({x:e,y:t,size:o,rotation:-Math.PI/2}):this._basicCornersRounded({x:e,y:t,size:o,rotation:Math.PI/2})}_drawClassyRounded({x:e,y:t,size:o,getNeighbor:r}){const i=r?+r(-1,0):0,c=r?+r(1,0):0,y=r?+r(0,-1):0,m=r?+r(0,1):0;i+c+y+m!==0?i||y?c||m?this._basicSquare({x:e,y:t,size:o,rotation:0}):this._basicCornerExtraRounded({x:e,y:t,size:o,rotation:Math.PI/2}):this._basicCornerExtraRounded({x:e,y:t,size:o,rotation:-Math.PI/2}):this._basicCornersRounded({x:e,y:t,size:o,rotation:Math.PI/2})}}const X={dot:"dot",square:"square",extraRounded:"extra-rounded"},J=Object.values(X);class nt{constructor({svg:e,type:t,window:o}){this._svg=e,this._type=t,this._window=o}draw(e,t,o,r){let i;switch(this._type){case X.square:i=this._drawSquare;break;case X.extraRounded:i=this._drawExtraRounded;break;default:i=this._drawDot}i.call(this,{x:e,y:t,size:o,rotation:r})}_rotateFigure({x:e,y:t,size:o,rotation:r=0,draw:i}){var c;const y=e+o/2,m=t+o/2;i(),(c=this._element)===null||c===void 0||c.setAttribute("transform",`rotate(${180*r/Math.PI},${y},${m})`)}_basicDot(e){const{size:t,x:o,y:r}=e,i=t/7;this._rotateFigure(Object.assign(Object.assign({},e),{draw:()=>{this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","path"),this._element.setAttribute("clip-rule","evenodd"),this._element.setAttribute("d",`M ${o+t/2} ${r}a ${t/2} ${t/2} 0 1 0 0.1 0zm 0 ${i}a ${t/2-i} ${t/2-i} 0 1 1 -0.1 0Z`)}}))}_basicSquare(e){const{size:t,x:o,y:r}=e,i=t/7;this._rotateFigure(Object.assign(Object.assign({},e),{draw:()=>{this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","path"),this._element.setAttribute("clip-rule","evenodd"),this._element.setAttribute("d",`M ${o} ${r}v ${t}h ${t}v `+-t+`zM ${o+i} ${r+i}h `+(t-2*i)+"v "+(t-2*i)+"h "+(2*i-t)+"z")}}))}_basicExtraRounded(e){const{size:t,x:o,y:r}=e,i=t/7;this._rotateFigure(Object.assign(Object.assign({},e),{draw:()=>{this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","path"),this._element.setAttribute("clip-rule","evenodd"),this._element.setAttribute("d",`M ${o} ${r+2.5*i}v `+2*i+`a ${2.5*i} ${2.5*i}, 0, 0, 0, ${2.5*i} ${2.5*i}h `+2*i+`a ${2.5*i} ${2.5*i}, 0, 0, 0, ${2.5*i} ${2.5*-i}v `+-2*i+`a ${2.5*i} ${2.5*i}, 0, 0, 0, ${2.5*-i} ${2.5*-i}h `+-2*i+`a ${2.5*i} ${2.5*i}, 0, 0, 0, ${2.5*-i} ${2.5*i}M ${o+2.5*i} ${r+i}h `+2*i+`a ${1.5*i} ${1.5*i}, 0, 0, 1, ${1.5*i} ${1.5*i}v `+2*i+`a ${1.5*i} ${1.5*i}, 0, 0, 1, ${1.5*-i} ${1.5*i}h `+-2*i+`a ${1.5*i} ${1.5*i}, 0, 0, 1, ${1.5*-i} ${1.5*-i}v `+-2*i+`a ${1.5*i} ${1.5*i}, 0, 0, 1, ${1.5*i} ${1.5*-i}`)}}))}_drawDot({x:e,y:t,size:o,rotation:r}){this._basicDot({x:e,y:t,size:o,rotation:r})}_drawSquare({x:e,y:t,size:o,rotation:r}){this._basicSquare({x:e,y:t,size:o,rotation:r})}_drawExtraRounded({x:e,y:t,size:o,rotation:r}){this._basicExtraRounded({x:e,y:t,size:o,rotation:r})}}const ot={dot:"dot",square:"square"},N=Object.values(ot);class ct{constructor({svg:e,type:t,window:o}){this._svg=e,this._type=t,this._window=o}draw(e,t,o,r){let i;i=this._type===ot.square?this._drawSquare:this._drawDot,i.call(this,{x:e,y:t,size:o,rotation:r})}_rotateFigure({x:e,y:t,size:o,rotation:r=0,draw:i}){var c;const y=e+o/2,m=t+o/2;i(),(c=this._element)===null||c===void 0||c.setAttribute("transform",`rotate(${180*r/Math.PI},${y},${m})`)}_basicDot(e){const{size:t,x:o,y:r}=e;this._rotateFigure(Object.assign(Object.assign({},e),{draw:()=>{this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","circle"),this._element.setAttribute("cx",String(o+t/2)),this._element.setAttribute("cy",String(r+t/2)),this._element.setAttribute("r",String(t/2))}}))}_basicSquare(e){const{size:t,x:o,y:r}=e;this._rotateFigure(Object.assign(Object.assign({},e),{draw:()=>{this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","rect"),this._element.setAttribute("x",String(o)),this._element.setAttribute("y",String(r)),this._element.setAttribute("width",String(t)),this._element.setAttribute("height",String(t))}}))}_drawDot({x:e,y:t,size:o,rotation:r}){this._basicDot({x:e,y:t,size:o,rotation:r})}_drawSquare({x:e,y:t,size:o,rotation:r}){this._basicSquare({x:e,y:t,size:o,rotation:r})}}const gt="circle",K=[[1,1,1,1,1,1,1],[1,0,0,0,0,0,1],[1,0,0,0,0,0,1],[1,0,0,0,0,0,1],[1,0,0,0,0,0,1],[1,0,0,0,0,0,1],[1,1,1,1,1,1,1]],tt=[[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,1,1,1,0,0],[0,0,1,1,1,0,0],[0,0,1,1,1,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0]];class ft{constructor(e,t){this._roundSize=o=>this._options.dotsOptions.roundSize?Math.floor(o):o,this._window=t,this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","svg"),this._element.setAttribute("width",String(e.width)),this._element.setAttribute("height",String(e.height)),this._element.setAttribute("xmlns:xlink","http://www.w3.org/1999/xlink"),e.dotsOptions.roundSize||this._element.setAttribute("shape-rendering","crispEdges"),this._element.setAttribute("viewBox",`0 0 ${e.width} ${e.height}`),this._defs=this._window.document.createElementNS("http://www.w3.org/2000/svg","defs"),this._element.appendChild(this._defs),this._imageUri=e.image,this._instanceId=ft.instanceCount++,this._options=e}get width(){return this._options.width}get height(){return this._options.height}getElement(){return this._element}async drawQR(e){const t=e.getModuleCount(),o=Math.min(this._options.width,this._options.height)-2*this._options.margin,r=this._options.shape===gt?o/Math.sqrt(2):o,i=this._roundSize(r/t);let c={hideXDots:0,hideYDots:0,width:0,height:0};if(this._qr=e,this._options.image){if(await this.loadImage(),!this._image)return;const{imageOptions:y,qrOptions:m}=this._options,A=y.imageSize*Q[m.errorCorrectionLevel],C=Math.floor(A*t*t);c=function({originalHeight:$,originalWidth:k,maxHiddenDots:O,maxHiddenAxisDots:B,dotSize:q}){const a={x:0,y:0},h={x:0,y:0};if($<=0||k<=0||O<=0||q<=0)return{height:0,width:0,hideYDots:0,hideXDots:0};const l=$/k;return a.x=Math.floor(Math.sqrt(O/l)),a.x<=0&&(a.x=1),B&&B<a.x&&(a.x=B),a.x%2==0&&a.x--,h.x=a.x*q,a.y=1+2*Math.ceil((a.x*l-1)/2),h.y=Math.round(h.x*l),(a.y*a.x>O||B&&B<a.y)&&(B&&B<a.y?(a.y=B,a.y%2==0&&a.x--):a.y-=2,h.y=a.y*q,a.x=1+2*Math.ceil((a.y/l-1)/2),h.x=Math.round(h.y/l)),{height:h.y,width:h.x,hideYDots:a.y,hideXDots:a.x}}({originalWidth:this._image.width,originalHeight:this._image.height,maxHiddenDots:C,maxHiddenAxisDots:t-14,dotSize:i})}this.drawBackground(),this.drawDots((y,m)=>{var A,C,$,k,O,B;return!(this._options.imageOptions.hideBackgroundDots&&y>=(t-c.hideYDots)/2&&y<(t+c.hideYDots)/2&&m>=(t-c.hideXDots)/2&&m<(t+c.hideXDots)/2||!((A=K[y])===null||A===void 0)&&A[m]||!((C=K[y-t+7])===null||C===void 0)&&C[m]||!(($=K[y])===null||$===void 0)&&$[m-t+7]||!((k=tt[y])===null||k===void 0)&&k[m]||!((O=tt[y-t+7])===null||O===void 0)&&O[m]||!((B=tt[y])===null||B===void 0)&&B[m-t+7])}),this.drawCorners(),this._options.image&&await this.drawImage({width:c.width,height:c.height,count:t,dotSize:i})}drawBackground(){var e,t,o;const r=this._element,i=this._options;if(r){const c=(e=i.backgroundOptions)===null||e===void 0?void 0:e.gradient,y=(t=i.backgroundOptions)===null||t===void 0?void 0:t.color;let m=i.height,A=i.width;if(c||y){const C=this._window.document.createElementNS("http://www.w3.org/2000/svg","rect");this._backgroundClipPath=this._window.document.createElementNS("http://www.w3.org/2000/svg","clipPath"),this._backgroundClipPath.setAttribute("id",`clip-path-background-color-${this._instanceId}`),this._defs.appendChild(this._backgroundClipPath),!((o=i.backgroundOptions)===null||o===void 0)&&o.round&&(m=A=Math.min(i.width,i.height),C.setAttribute("rx",String(m/2*i.backgroundOptions.round))),C.setAttribute("x",String(this._roundSize((i.width-A)/2))),C.setAttribute("y",String(this._roundSize((i.height-m)/2))),C.setAttribute("width",String(A)),C.setAttribute("height",String(m)),this._backgroundClipPath.appendChild(C),this._createColor({options:c,color:y,additionalRotation:0,x:0,y:0,height:i.height,width:i.width,name:`background-color-${this._instanceId}`})}}}drawDots(e){var t,o;if(!this._qr)throw"QR code is not defined";const r=this._options,i=this._qr.getModuleCount();if(i>r.width||i>r.height)throw"The canvas is too small.";const c=Math.min(r.width,r.height)-2*r.margin,y=r.shape===gt?c/Math.sqrt(2):c,m=this._roundSize(y/i),A=this._roundSize((r.width-i*m)/2),C=this._roundSize((r.height-i*m)/2),$=new H({svg:this._element,type:r.dotsOptions.type,window:this._window});this._dotsClipPath=this._window.document.createElementNS("http://www.w3.org/2000/svg","clipPath"),this._dotsClipPath.setAttribute("id",`clip-path-dot-color-${this._instanceId}`),this._defs.appendChild(this._dotsClipPath),this._createColor({options:(t=r.dotsOptions)===null||t===void 0?void 0:t.gradient,color:r.dotsOptions.color,additionalRotation:0,x:0,y:0,height:r.height,width:r.width,name:`dot-color-${this._instanceId}`});for(let k=0;k<i;k++)for(let O=0;O<i;O++)e&&!e(k,O)||!((o=this._qr)===null||o===void 0)&&o.isDark(k,O)&&($.draw(A+O*m,C+k*m,m,(B,q)=>!(O+B<0||k+q<0||O+B>=i||k+q>=i)&&!(e&&!e(k+q,O+B))&&!!this._qr&&this._qr.isDark(k+q,O+B)),$._element&&this._dotsClipPath&&this._dotsClipPath.appendChild($._element));if(r.shape===gt){const k=this._roundSize((c/m-i)/2),O=i+2*k,B=A-k*m,q=C-k*m,a=[],h=this._roundSize(O/2);for(let l=0;l<O;l++){a[l]=[];for(let f=0;f<O;f++)l>=k-1&&l<=O-k&&f>=k-1&&f<=O-k||Math.sqrt((l-h)*(l-h)+(f-h)*(f-h))>h?a[l][f]=0:a[l][f]=this._qr.isDark(f-2*k<0?f:f>=i?f-2*k:f-k,l-2*k<0?l:l>=i?l-2*k:l-k)?1:0}for(let l=0;l<O;l++)for(let f=0;f<O;f++)a[l][f]&&($.draw(B+f*m,q+l*m,m,(b,z)=>{var D;return!!(!((D=a[l+z])===null||D===void 0)&&D[f+b])}),$._element&&this._dotsClipPath&&this._dotsClipPath.appendChild($._element))}}drawCorners(){if(!this._qr)throw"QR code is not defined";const e=this._element,t=this._options;if(!e)throw"Element code is not defined";const o=this._qr.getModuleCount(),r=Math.min(t.width,t.height)-2*t.margin,i=t.shape===gt?r/Math.sqrt(2):r,c=this._roundSize(i/o),y=7*c,m=3*c,A=this._roundSize((t.width-o*c)/2),C=this._roundSize((t.height-o*c)/2);[[0,0,0],[1,0,Math.PI/2],[0,1,-Math.PI/2]].forEach(([$,k,O])=>{var B,q,a,h,l,f,b,z,D,P,j,R,F,rt;const Y=A+$*c*(o-7),U=C+k*c*(o-7);let T=this._dotsClipPath,M=this._dotsClipPath;if((!((B=t.cornersSquareOptions)===null||B===void 0)&&B.gradient||!((q=t.cornersSquareOptions)===null||q===void 0)&&q.color)&&(T=this._window.document.createElementNS("http://www.w3.org/2000/svg","clipPath"),T.setAttribute("id",`clip-path-corners-square-color-${$}-${k}-${this._instanceId}`),this._defs.appendChild(T),this._cornersSquareClipPath=this._cornersDotClipPath=M=T,this._createColor({options:(a=t.cornersSquareOptions)===null||a===void 0?void 0:a.gradient,color:(h=t.cornersSquareOptions)===null||h===void 0?void 0:h.color,additionalRotation:O,x:Y,y:U,height:y,width:y,name:`corners-square-color-${$}-${k}-${this._instanceId}`})),((l=t.cornersSquareOptions)===null||l===void 0?void 0:l.type)&&J.includes(t.cornersSquareOptions.type)){const G=new nt({svg:this._element,type:t.cornersSquareOptions.type,window:this._window});G.draw(Y,U,y,O),G._element&&T&&T.appendChild(G._element)}else{const G=new H({svg:this._element,type:((f=t.cornersSquareOptions)===null||f===void 0?void 0:f.type)||t.dotsOptions.type,window:this._window});for(let et=0;et<K.length;et++)for(let I=0;I<K[et].length;I++)!((b=K[et])===null||b===void 0)&&b[I]&&(G.draw(Y+I*c,U+et*c,c,(ht,lt)=>{var at;return!!(!((at=K[et+lt])===null||at===void 0)&&at[I+ht])}),G._element&&T&&T.appendChild(G._element))}if((!((z=t.cornersDotOptions)===null||z===void 0)&&z.gradient||!((D=t.cornersDotOptions)===null||D===void 0)&&D.color)&&(M=this._window.document.createElementNS("http://www.w3.org/2000/svg","clipPath"),M.setAttribute("id",`clip-path-corners-dot-color-${$}-${k}-${this._instanceId}`),this._defs.appendChild(M),this._cornersDotClipPath=M,this._createColor({options:(P=t.cornersDotOptions)===null||P===void 0?void 0:P.gradient,color:(j=t.cornersDotOptions)===null||j===void 0?void 0:j.color,additionalRotation:O,x:Y+2*c,y:U+2*c,height:m,width:m,name:`corners-dot-color-${$}-${k}-${this._instanceId}`})),((R=t.cornersDotOptions)===null||R===void 0?void 0:R.type)&&N.includes(t.cornersDotOptions.type)){const G=new ct({svg:this._element,type:t.cornersDotOptions.type,window:this._window});G.draw(Y+2*c,U+2*c,m,O),G._element&&M&&M.appendChild(G._element)}else{const G=new H({svg:this._element,type:((F=t.cornersDotOptions)===null||F===void 0?void 0:F.type)||t.dotsOptions.type,window:this._window});for(let et=0;et<tt.length;et++)for(let I=0;I<tt[et].length;I++)!((rt=tt[et])===null||rt===void 0)&&rt[I]&&(G.draw(Y+I*c,U+et*c,c,(ht,lt)=>{var at;return!!(!((at=tt[et+lt])===null||at===void 0)&&at[I+ht])}),G._element&&M&&M.appendChild(G._element))}})}loadImage(){return new Promise((e,t)=>{var o;const r=this._options;if(!r.image)return t("Image is not defined");if(!((o=r.nodeCanvas)===null||o===void 0)&&o.loadImage)r.nodeCanvas.loadImage(r.image).then(i=>{var c,y;if(this._image=i,this._options.imageOptions.saveAsBlob){const m=(c=r.nodeCanvas)===null||c===void 0?void 0:c.createCanvas(this._image.width,this._image.height);(y=m==null?void 0:m.getContext("2d"))===null||y===void 0||y.drawImage(i,0,0),this._imageUri=m==null?void 0:m.toDataURL()}e()}).catch(t);else{const i=new this._window.Image;typeof r.imageOptions.crossOrigin=="string"&&(i.crossOrigin=r.imageOptions.crossOrigin),this._image=i,i.onload=async()=>{this._options.imageOptions.saveAsBlob&&(this._imageUri=await async function(c,y){return new Promise(m=>{const A=new y.XMLHttpRequest;A.onload=function(){const C=new y.FileReader;C.onloadend=function(){m(C.result)},C.readAsDataURL(A.response)},A.open("GET",c),A.responseType="blob",A.send()})}(r.image||"",this._window)),e()},i.src=r.image}})}async drawImage({width:e,height:t,count:o,dotSize:r}){const i=this._options,c=this._roundSize((i.width-o*r)/2),y=this._roundSize((i.height-o*r)/2),m=c+this._roundSize(i.imageOptions.margin+(o*r-e)/2),A=y+this._roundSize(i.imageOptions.margin+(o*r-t)/2),C=e-2*i.imageOptions.margin,$=t-2*i.imageOptions.margin,k=this._window.document.createElementNS("http://www.w3.org/2000/svg","image");k.setAttribute("href",this._imageUri||""),k.setAttribute("xlink:href",this._imageUri||""),k.setAttribute("x",String(m)),k.setAttribute("y",String(A)),k.setAttribute("width",`${C}px`),k.setAttribute("height",`${$}px`),this._element.appendChild(k)}_createColor({options:e,color:t,additionalRotation:o,x:r,y:i,height:c,width:y,name:m}){const A=y>c?y:c,C=this._window.document.createElementNS("http://www.w3.org/2000/svg","rect");if(C.setAttribute("x",String(r)),C.setAttribute("y",String(i)),C.setAttribute("height",String(c)),C.setAttribute("width",String(y)),C.setAttribute("clip-path",`url('#clip-path-${m}')`),e){let $;if(e.type==="radial")$=this._window.document.createElementNS("http://www.w3.org/2000/svg","radialGradient"),$.setAttribute("id",m),$.setAttribute("gradientUnits","userSpaceOnUse"),$.setAttribute("fx",String(r+y/2)),$.setAttribute("fy",String(i+c/2)),$.setAttribute("cx",String(r+y/2)),$.setAttribute("cy",String(i+c/2)),$.setAttribute("r",String(A/2));else{const k=((e.rotation||0)+o)%(2*Math.PI),O=(k+2*Math.PI)%(2*Math.PI);let B=r+y/2,q=i+c/2,a=r+y/2,h=i+c/2;O>=0&&O<=.25*Math.PI||O>1.75*Math.PI&&O<=2*Math.PI?(B-=y/2,q-=c/2*Math.tan(k),a+=y/2,h+=c/2*Math.tan(k)):O>.25*Math.PI&&O<=.75*Math.PI?(q-=c/2,B-=y/2/Math.tan(k),h+=c/2,a+=y/2/Math.tan(k)):O>.75*Math.PI&&O<=1.25*Math.PI?(B+=y/2,q+=c/2*Math.tan(k),a-=y/2,h-=c/2*Math.tan(k)):O>1.25*Math.PI&&O<=1.75*Math.PI&&(q+=c/2,B+=y/2/Math.tan(k),h-=c/2,a-=y/2/Math.tan(k)),$=this._window.document.createElementNS("http://www.w3.org/2000/svg","linearGradient"),$.setAttribute("id",m),$.setAttribute("gradientUnits","userSpaceOnUse"),$.setAttribute("x1",String(Math.round(B))),$.setAttribute("y1",String(Math.round(q))),$.setAttribute("x2",String(Math.round(a))),$.setAttribute("y2",String(Math.round(h)))}e.colorStops.forEach(({offset:k,color:O})=>{const B=this._window.document.createElementNS("http://www.w3.org/2000/svg","stop");B.setAttribute("offset",100*k+"%"),B.setAttribute("stop-color",O),$.appendChild(B)}),C.setAttribute("fill",`url('#${m}')`),this._defs.appendChild($)}else t&&C.setAttribute("fill",t);this._element.appendChild(C)}}ft.instanceCount=0;const zt=ft,xt="canvas",L={};for(let u=0;u<=40;u++)L[u]=u;const it={type:xt,shape:"square",width:300,height:300,data:"",margin:0,qrOptions:{typeNumber:L[0],mode:void 0,errorCorrectionLevel:"Q"},imageOptions:{saveAsBlob:!0,hideBackgroundDots:!0,imageSize:.4,crossOrigin:void 0,margin:0},dotsOptions:{type:"square",color:"#000",roundSize:!0},backgroundOptions:{round:0,color:"#fff"}};function W(u){const e=Object.assign({},u);if(!e.colorStops||!e.colorStops.length)throw"Field 'colorStops' is required in gradient";return e.rotation?e.rotation=Number(e.rotation):e.rotation=0,e.colorStops=e.colorStops.map(t=>Object.assign(Object.assign({},t),{offset:Number(t.offset)})),e}function dt(u){const e=Object.assign({},u);return e.width=Number(e.width),e.height=Number(e.height),e.margin=Number(e.margin),e.imageOptions=Object.assign(Object.assign({},e.imageOptions),{hideBackgroundDots:!!e.imageOptions.hideBackgroundDots,imageSize:Number(e.imageOptions.imageSize),margin:Number(e.imageOptions.margin)}),e.margin>Math.min(e.width,e.height)&&(e.margin=Math.min(e.width,e.height)),e.dotsOptions=Object.assign({},e.dotsOptions),e.dotsOptions.gradient&&(e.dotsOptions.gradient=W(e.dotsOptions.gradient)),e.cornersSquareOptions&&(e.cornersSquareOptions=Object.assign({},e.cornersSquareOptions),e.cornersSquareOptions.gradient&&(e.cornersSquareOptions.gradient=W(e.cornersSquareOptions.gradient))),e.cornersDotOptions&&(e.cornersDotOptions=Object.assign({},e.cornersDotOptions),e.cornersDotOptions.gradient&&(e.cornersDotOptions.gradient=W(e.cornersDotOptions.gradient))),e.backgroundOptions&&(e.backgroundOptions=Object.assign({},e.backgroundOptions),e.backgroundOptions.gradient&&(e.backgroundOptions.gradient=W(e.backgroundOptions.gradient))),e}var pt=v(873),_t=v.n(pt);function ut(u){if(!u)throw new Error("Extension must be defined");u[0]==="."&&(u=u.substring(1));const e={bmp:"image/bmp",gif:"image/gif",ico:"image/vnd.microsoft.icon",jpeg:"image/jpeg",jpg:"image/jpeg",png:"image/png",svg:"image/svg+xml",tif:"image/tiff",tiff:"image/tiff",webp:"image/webp",pdf:"application/pdf"}[u.toLowerCase()];if(!e)throw new Error(`Extension "${u}" is not supported`);return e}class p{constructor(e){e!=null&&e.jsdom?this._window=new e.jsdom("",{resources:"usable"}).window:this._window=window,this._options=e?dt(x(it,e)):it,this.update()}static _clearContainer(e){e&&(e.innerHTML="")}_setupSvg(){if(!this._qr)return;const e=new zt(this._options,this._window);this._svg=e.getElement(),this._svgDrawingPromise=e.drawQR(this._qr).then(()=>{var t;this._svg&&((t=this._extension)===null||t===void 0||t.call(this,e.getElement(),this._options))})}_setupCanvas(){var e,t;this._qr&&(!((e=this._options.nodeCanvas)===null||e===void 0)&&e.createCanvas?(this._nodeCanvas=this._options.nodeCanvas.createCanvas(this._options.width,this._options.height),this._nodeCanvas.width=this._options.width,this._nodeCanvas.height=this._options.height):(this._domCanvas=document.createElement("canvas"),this._domCanvas.width=this._options.width,this._domCanvas.height=this._options.height),this._setupSvg(),this._canvasDrawingPromise=(t=this._svgDrawingPromise)===null||t===void 0?void 0:t.then(()=>{var o;if(!this._svg)return;const r=this._svg,i=new this._window.XMLSerializer().serializeToString(r),c=btoa(i),y=`data:${ut("svg")};base64,${c}`;if(!((o=this._options.nodeCanvas)===null||o===void 0)&&o.loadImage)return this._options.nodeCanvas.loadImage(y).then(m=>{var A,C;m.width=this._options.width,m.height=this._options.height,(C=(A=this._nodeCanvas)===null||A===void 0?void 0:A.getContext("2d"))===null||C===void 0||C.drawImage(m,0,0)});{const m=new this._window.Image;return new Promise(A=>{m.onload=()=>{var C,$;($=(C=this._domCanvas)===null||C===void 0?void 0:C.getContext("2d"))===null||$===void 0||$.drawImage(m,0,0),A()},m.src=y})}}))}async _getElement(e="png"){if(!this._qr)throw"QR code is empty";return e.toLowerCase()==="svg"?(this._svg&&this._svgDrawingPromise||this._setupSvg(),await this._svgDrawingPromise,this._svg):((this._domCanvas||this._nodeCanvas)&&this._canvasDrawingPromise||this._setupCanvas(),await this._canvasDrawingPromise,this._domCanvas||this._nodeCanvas)}update(e){p._clearContainer(this._container),this._options=e?dt(x(this._options,e)):this._options,this._options.data&&(this._qr=_t()(this._options.qrOptions.typeNumber,this._options.qrOptions.errorCorrectionLevel),this._qr.addData(this._options.data,this._options.qrOptions.mode||function(t){switch(!0){case/^[0-9]*$/.test(t):return"Numeric";case/^[0-9A-Z $%*+\-./:]*$/.test(t):return"Alphanumeric";default:return"Byte"}}(this._options.data)),this._qr.make(),this._options.type===xt?this._setupCanvas():this._setupSvg(),this.append(this._container))}append(e){if(e){if(typeof e.appendChild!="function")throw"Container should be a single DOM node";this._options.type===xt?this._domCanvas&&e.appendChild(this._domCanvas):this._svg&&e.appendChild(this._svg),this._container=e}}applyExtension(e){if(!e)throw"Extension function should be defined.";this._extension=e,this.update()}deleteExtension(){this._extension=void 0,this.update()}async getRawData(e="png"){if(!this._qr)throw"QR code is empty";const t=await this._getElement(e),o=ut(e);if(!t)return null;if(e.toLowerCase()==="svg"){const r=`<?xml version="1.0" standalone="no"?>\r
${new this._window.XMLSerializer().serializeToString(t)}`;return typeof Blob>"u"||this._options.jsdom?Buffer.from(r):new Blob([r],{type:o})}return new Promise(r=>{const i=t;if("toBuffer"in i)if(o==="image/png")r(i.toBuffer(o));else if(o==="image/jpeg")r(i.toBuffer(o));else{if(o!=="application/pdf")throw Error("Unsupported extension");r(i.toBuffer(o))}else"toBlob"in i&&i.toBlob(r,o,1)})}async download(e){if(!this._qr)throw"QR code is empty";if(typeof Blob>"u")throw"Cannot download in Node.js, call getRawData instead.";let t="png",o="qr";typeof e=="string"?(t=e,console.warn("Extension is deprecated as argument for 'download' method, please pass object { name: '...', extension: '...' } as argument")):typeof e=="object"&&e!==null&&(e.name&&(o=e.name),e.extension&&(t=e.extension));const r=await this._getElement(t);if(r)if(t.toLowerCase()==="svg"){let i=new XMLSerializer().serializeToString(r);i=`<?xml version="1.0" standalone="no"?>\r
`+i,E(`data:${ut(t)};charset=utf-8,${encodeURIComponent(i)}`,`${o}.svg`)}else E(r.toDataURL(ut(t)),`${o}.${t}`)}}const w=p})(),_.default})())}(Ft)),Ft.exports}var _e=xe();const Se=ve(_e),Ce=`
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
`;var $t=(n=>(n.PENDING="PENDING",n.IN_FLIGHT="IN_FLIGHT",n.COMPLETED="COMPLETED",n.FAILED="FAILED",n.CANCELLED="CANCELLED",n))($t||{});ne(["click"]);var ke=kt('<div class=test-mode-badge tabindex=0><svg width=16 height=16 viewBox="0 0 20 20"fill=none xmlns=http://www.w3.org/2000/svg><circle cx=10 cy=10 r=9 stroke=#b45309 stroke-width=2 fill=#fef3c7></circle><text x=10 y=15 text-anchor=middle font-size=12 fill=#b45309 font-family=Arial font-weight=bold>i</text></svg><span class=test-mode-badge-text>Test Mode</span><div class=test-mode-tooltip>Test Mode: No real money will be moved.'),Ae=kt("<div class=qr-code-container id=qrcode-container>"),$e=kt("<div class=zenobia-error>"),ze=kt('<div class=mobile-button-container><button class=mobile-button title="Open on mobile device"><svg width=16 height=16 viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round><rect x=5 y=2 width=14 height=20 rx=2 ry=2></rect><line x1=12 y1=18 x2=12 y2=18></line></svg><span>Open on mobile'),Oe=kt('<div class="zenobia-qr-popup-overlay visible"><div class=zenobia-qr-popup-content><button class=zenobia-qr-close><svg viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2><path d="M18 6L6 18M6 6l12 12"></path></svg></button><div class=modal-header><div class=header-content><h3>Pay by bank with Zenobia</h3><p class=subtitle>Scan to complete your purchase</p></div></div><div class=modal-body><div class=payment-amount>$</div><div class=savings-badge></div><div class=payment-status><div class=spinner></div><div class=payment-instructions>'),Me=kt("<div class=qr-code-container><div class=zenobia-qr-placeholder>");const qe=n=>{const[s,d]=yt(null),g={current:null},[v,_]=yt($t.PENDING),[S,x]=yt(null),[E,Q]=yt(!1),[H,X]=yt(null),[J,nt]=yt(null),[ot,N]=yt(!1),[ct,gt]=yt("");Yt(()=>{if(n.isOpen&&!H()){const L=new me(n.isTest);if(X(L),n.transferRequest)nt(n.transferRequest),L.listenToTransfer(n.transferRequest.transferRequestId,n.transferRequest.signature||"",K,tt,ft);else if(n.url){N(!0),x(null);const it=n.metadata||{amount:n.amount,statementItems:{name:"Payment",amount:n.amount}};L.createTransfer(n.url,it).then(W=>{nt({transferRequestId:W.transferRequestId,merchantId:W.merchantId,expiry:W.expiry,signature:W.signature}),L.listenToTransfer(W.transferRequestId,W.signature||"",K,tt,ft)}).catch(W=>{x(W instanceof Error?W.message:"An error occurred"),n.onError&&W instanceof Error&&n.onError(W)}).finally(()=>{N(!1)})}else x("No URL provided for creating a new transfer")}}),Yt(()=>{var L;if((L=J())!=null&&L.transferRequestId){const it=J().transferRequestId.replace(/-/g,"");let dt=`https://zenobiapay.com/clip?id=${btoa(it).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}`;n.isTest&&(dt+="&type=test"),gt(dt);const _t=n.qrCodeSize||220,ut=new Se({width:_t,height:_t,type:"svg",data:dt,image:void 0,dotsOptions:{color:"#000000",type:"dots"},backgroundOptions:{color:"#ffffff"},cornersSquareOptions:{type:"extra-rounded"},cornersDotOptions:{type:"dot"},qrOptions:{errorCorrectionLevel:"M"}});d(ut),g.current&&(g.current.innerHTML="",ut.append(g.current))}});const K=L=>{console.log("Received status update:",L);let it;switch(L.status){case"COMPLETED":case"IN_FLIGHT":it=$t.COMPLETED,n.onSuccess&&J()&&n.onSuccess(J(),L);const W=H();W&&(W.disconnect(),X(null));break;case"FAILED":it=$t.FAILED;const dt=H();dt&&(dt.disconnect(),X(null));break;case"CANCELLED":it=$t.CANCELLED;const pt=H();pt&&(pt.disconnect(),X(null));break;default:it=$t.PENDING}_(it),n.onStatusChange&&n.onStatusChange(it)},tt=L=>{console.error("WebSocket error:",L),x(L)},ft=L=>{console.log("WebSocket connection status:",L?"Connected":"Disconnected"),Q(L)};ae(()=>{const L=H();L&&L.disconnect()});const zt=()=>n.discountAmount!==void 0?n.discountAmount:Math.round(n.amount/100),xt=()=>{const L=zt();return L<1e3?`✨ ${(L/n.amount*100).toFixed(0)}% cashback applied!`:`✨ Applied $${(L/100).toFixed(2)} cashback!`};return Ct(It,{get when(){return n.isOpen},get children(){var L=Oe(),it=L.firstChild,W=it.firstChild,dt=W.nextSibling,pt=dt.firstChild,_t=pt.firstChild;_t.nextSibling;var ut=dt.nextSibling,p=ut.firstChild;p.firstChild;var w=p.nextSibling,u=w.nextSibling,e=u.firstChild,t=e.nextSibling;return pe(W,"click",n.onClose),mt(pt,Ct(It,{get when(){return n.isTest},get children(){return ke()}}),null),mt(ut,Ct(It,{get when(){return Mt(()=>!!s())()&&J()},get fallback(){return(()=>{var o=Me(),r=o.firstChild;return o.style.setProperty("display","flex"),o.style.setProperty("justify-content","center"),o.style.setProperty("align-items","center"),Ot(i=>{var c=n.qrCodeSize?`${n.qrCodeSize}px`:"220px",y=n.qrCodeSize?`${n.qrCodeSize}px`:"220px",m=n.qrCodeSize?`${n.qrCodeSize}px`:"220px",A=n.qrCodeSize?`${n.qrCodeSize}px`:"220px";return c!==i.e&&((i.e=c)!=null?o.style.setProperty("width",c):o.style.removeProperty("width")),y!==i.t&&((i.t=y)!=null?o.style.setProperty("height",y):o.style.removeProperty("height")),m!==i.a&&((i.a=m)!=null?r.style.setProperty("width",m):r.style.removeProperty("width")),A!==i.o&&((i.o=A)!=null?r.style.setProperty("height",A):r.style.removeProperty("height")),i},{e:void 0,t:void 0,a:void 0,o:void 0}),o})()},get children(){var o=Ae();return we(r=>{g.current=r;const i=s();i&&r&&(r.innerHTML="",i.append(r))},o),o.style.setProperty("display","flex"),o.style.setProperty("justify-content","center"),o.style.setProperty("align-items","center"),Ot(r=>{var i=n.qrCodeSize?`${n.qrCodeSize}px`:"220px",c=n.qrCodeSize?`${n.qrCodeSize}px`:"220px";return i!==r.e&&((r.e=i)!=null?o.style.setProperty("width",i):o.style.removeProperty("width")),c!==r.t&&((r.t=c)!=null?o.style.setProperty("height",c):o.style.removeProperty("height")),r},{e:void 0,t:void 0}),o}}),p),mt(p,()=>(n.amount/100).toFixed(2),null),mt(w,xt),mt(t,(()=>{var o=Mt(()=>!!ot());return()=>o()?"Preparing payment...":J()?"Waiting for payment":"Creating payment..."})()),mt(ut,Ct(It,{get when(){return S()},get children(){var o=$e();return mt(o,S),o}}),null),mt(ut,Ct(It,{get when(){return ct()!==""},get children(){var o=ze(),r=o.firstChild;return r.$$click=()=>window.open(ct(),"_blank"),o}}),null),L}})};ne(["click"]);function Ee(){if(!document.getElementById("zenobia-payment-styles")){const n=document.createElement("style");n.id="zenobia-payment-styles",n.textContent=Ce,document.head.appendChild(n)}}function De(n){const s=typeof n.target=="string"?document.querySelector(n.target):n.target;if(!s){console.error("[zenobia-pay-modal] target element not found:",n.target);return}Ee(),ge(()=>Ct(qe,{get isOpen(){return n.isOpen},get onClose(){return n.onClose},get amount(){return n.amount},get discountAmount(){return n.discountAmount},get qrCodeSize(){return n.qrCodeSize},get isTest(){return n.isTest},get url(){return n.url},get metadata(){return n.metadata},get transferRequest(){return n.transferRequest},get onSuccess(){return n.onSuccess},get onError(){return n.onError},get onStatusChange(){return n.onStatusChange}}),s)}window.ZenobiaPayModal={init:De}})();
