(function(){"use strict";const Bt={equals:(n,s)=>n===s};let Wt=Jt;const yt=1,Lt=2,Gt={owned:null,cleanups:null,context:null,owner:null};var tt=null;let Ht=null,re=null,K=null,st=null,vt=null,Tt=0;function se(n,s){const l=K,g=tt,m=n.length===0,x=s===void 0?g:s,S=m?Gt:{owned:null,cleanups:null,context:x?x.context:null,owner:x},y=m?n:()=>n(()=>At(()=>Et(S)));tt=S,K=null;try{return Pt(y,!0)}finally{K=l,tt=g}}function mt(n,s){s=s?Object.assign({},Bt,s):Bt;const l={value:n,observers:null,observerSlots:null,comparator:s.equals||void 0},g=m=>(typeof m=="function"&&(m=m(l.value)),Vt(l,m));return[Zt.bind(l),g]}function $t(n,s,l){const g=Qt(n,s,!1,yt);It(g)}function Yt(n,s,l){Wt=de;const g=Qt(n,s,!1,yt);g.user=!0,vt?vt.push(g):It(g)}function kt(n,s,l){l=l?Object.assign({},Bt,l):Bt;const g=Qt(n,s,!0,0);return g.observers=null,g.observerSlots=null,g.comparator=l.equals||void 0,It(g),Zt.bind(g)}function At(n){if(K===null)return n();const s=K;K=null;try{return n()}finally{K=s}}function ae(n){return tt===null||(tt.cleanups===null?tt.cleanups=[n]:tt.cleanups.push(n)),n}function Zt(){if(this.sources&&this.state)if(this.state===yt)It(this);else{const n=st;st=null,Pt(()=>Rt(this),!1),st=n}if(K){const n=this.observers?this.observers.length:0;K.sources?(K.sources.push(this),K.sourceSlots.push(n)):(K.sources=[this],K.sourceSlots=[n]),this.observers?(this.observers.push(K),this.observerSlots.push(K.sources.length-1)):(this.observers=[K],this.observerSlots=[K.sources.length-1])}return this.value}function Vt(n,s,l){let g=n.value;return(!n.comparator||!n.comparator(g,s))&&(n.value=s,n.observers&&n.observers.length&&Pt(()=>{for(let m=0;m<n.observers.length;m+=1){const x=n.observers[m],S=Ht&&Ht.running;S&&Ht.disposed.has(x),(S?!x.tState:!x.state)&&(x.pure?st.push(x):vt.push(x),x.observers&&Kt(x)),S||(x.state=yt)}if(st.length>1e6)throw st=[],new Error},!1)),s}function It(n){if(!n.fn)return;Et(n);const s=Tt;le(n,n.value,s)}function le(n,s,l){let g;const m=tt,x=K;K=tt=n;try{g=n.fn(s)}catch(S){return n.pure&&(n.state=yt,n.owned&&n.owned.forEach(Et),n.owned=null),n.updatedAt=l+1,te(S)}finally{K=x,tt=m}(!n.updatedAt||n.updatedAt<=l)&&(n.updatedAt!=null&&"observers"in n?Vt(n,g):n.value=g,n.updatedAt=l)}function Qt(n,s,l,g=yt,m){const x={fn:n,state:g,updatedAt:null,owned:null,sources:null,sourceSlots:null,cleanups:null,value:s,owner:tt,context:tt?tt.context:null,pure:l};return tt===null||tt!==Gt&&(tt.owned?tt.owned.push(x):tt.owned=[x]),x}function Nt(n){if(n.state===0)return;if(n.state===Lt)return Rt(n);if(n.suspense&&At(n.suspense.inFallback))return n.suspense.effects.push(n);const s=[n];for(;(n=n.owner)&&(!n.updatedAt||n.updatedAt<Tt);)n.state&&s.push(n);for(let l=s.length-1;l>=0;l--)if(n=s[l],n.state===yt)It(n);else if(n.state===Lt){const g=st;st=null,Pt(()=>Rt(n,s[0]),!1),st=g}}function Pt(n,s){if(st)return n();let l=!1;s||(st=[]),vt?l=!0:vt=[],Tt++;try{const g=n();return ce(l),g}catch(g){l||(vt=null),st=null,te(g)}}function ce(n){if(st&&(Jt(st),st=null),n)return;const s=vt;vt=null,s.length&&Pt(()=>Wt(s),!1)}function Jt(n){for(let s=0;s<n.length;s++)Nt(n[s])}function de(n){let s,l=0;for(s=0;s<n.length;s++){const g=n[s];g.user?n[l++]=g:Nt(g)}for(s=0;s<l;s++)Nt(n[s])}function Rt(n,s){n.state=0;for(let l=0;l<n.sources.length;l+=1){const g=n.sources[l];if(g.sources){const m=g.state;m===yt?g!==s&&(!g.updatedAt||g.updatedAt<Tt)&&Nt(g):m===Lt&&Rt(g,s)}}}function Kt(n){for(let s=0;s<n.observers.length;s+=1){const l=n.observers[s];l.state||(l.state=Lt,l.pure?st.push(l):vt.push(l),l.observers&&Kt(l))}}function Et(n){let s;if(n.sources)for(;n.sources.length;){const l=n.sources.pop(),g=n.sourceSlots.pop(),m=l.observers;if(m&&m.length){const x=m.pop(),S=l.observerSlots.pop();g<m.length&&(x.sourceSlots[S]=g,m[g]=x,l.observerSlots[g]=S)}}if(n.tOwned){for(s=n.tOwned.length-1;s>=0;s--)Et(n.tOwned[s]);delete n.tOwned}if(n.owned){for(s=n.owned.length-1;s>=0;s--)Et(n.owned[s]);n.owned=null}if(n.cleanups){for(s=n.cleanups.length-1;s>=0;s--)n.cleanups[s]();n.cleanups=null}n.state=0}function ue(n){return n instanceof Error?n:new Error(typeof n=="string"?n:"Unknown error",{cause:n})}function te(n,s=tt){throw ue(n)}function xt(n,s){return At(()=>n(s||{}))}const he=n=>`Stale read from <${n}>.`;function zt(n){const s=n.keyed,l=kt(()=>n.when,void 0,void 0),g=s?l:kt(l,void 0,{equals:(m,x)=>!m==!x});return kt(()=>{const m=g();if(m){const x=n.children;return typeof x=="function"&&x.length>0?At(()=>x(s?m:()=>{if(!At(g))throw he("Show");return l()})):x}return n.fallback},void 0,void 0)}function fe(n,s,l){let g=l.length,m=s.length,x=g,S=0,y=0,O=s[m-1].nextSibling,H=null;for(;S<m||y<x;){if(s[S]===l[y]){S++,y++;continue}for(;s[m-1]===l[x-1];)m--,x--;if(m===S){const T=x<g?y?l[y-1].nextSibling:l[x-y]:O;for(;y<x;)n.insertBefore(l[y++],T)}else if(x===y)for(;S<m;)(!H||!H.has(s[S]))&&s[S].remove(),S++;else if(s[S]===l[x-1]&&l[y]===s[m-1]){const T=s[--m].nextSibling;n.insertBefore(l[y++],s[S++].nextSibling),n.insertBefore(l[--x],T),s[m]=l[x]}else{if(!H){H=new Map;let L=y;for(;L<x;)H.set(l[L],L++)}const T=H.get(s[S]);if(T!=null)if(y<T&&T<x){let L=S,W=1,Y;for(;++L<m&&L<x&&!((Y=H.get(s[L]))==null||Y!==T+W);)W++;if(W>T-y){const V=s[S];for(;y<T;)n.insertBefore(l[y++],V)}else n.replaceChild(l[y++],s[S++])}else S++;else s[S++].remove()}}}const ee="_$DX_DELEGATE";function ge(n,s,l,g={}){let m;return se(x=>{m=x,s===document?n():ht(s,n(),s.firstChild?null:void 0,l)},g.owner),()=>{m(),s.textContent=""}}function _t(n,s,l,g){let m;const x=()=>{const y=document.createElement("template");return y.innerHTML=n,y.content.firstChild},S=()=>(m||(m=x())).cloneNode(!0);return S.cloneNode=S,S}function ne(n,s=window.document){const l=s[ee]||(s[ee]=new Set);for(let g=0,m=n.length;g<m;g++){const x=n[g];l.has(x)||(l.add(x),s.addEventListener(x,be))}}function pe(n,s,l,g){Array.isArray(l)?(n[`$$${s}`]=l[0],n[`$$${s}Data`]=l[1]):n[`$$${s}`]=l}function we(n,s,l){return At(()=>n(s,l))}function ht(n,s,l,g){if(l!==void 0&&!g&&(g=[]),typeof s!="function")return jt(n,s,g,l);$t(m=>jt(n,s(),m,l),g)}function be(n){let s=n.target;const l=`$$${n.type}`,g=n.target,m=n.currentTarget,x=O=>Object.defineProperty(n,"target",{configurable:!0,value:O}),S=()=>{const O=s[l];if(O&&!s.disabled){const H=s[`${l}Data`];if(H!==void 0?O.call(s,H,n):O.call(s,n),n.cancelBubble)return}return s.host&&typeof s.host!="string"&&!s.host._$host&&s.contains(n.target)&&x(s.host),!0},y=()=>{for(;S()&&(s=s._$host||s.parentNode||s.host););};if(Object.defineProperty(n,"currentTarget",{configurable:!0,get(){return s||document}}),n.composedPath){const O=n.composedPath();x(O[0]);for(let H=0;H<O.length-2&&(s=O[H],!!S());H++){if(s._$host){s=s._$host,y();break}if(s.parentNode===m)break}}else y();x(g)}function jt(n,s,l,g,m){for(;typeof l=="function";)l=l();if(s===l)return l;const x=typeof s,S=g!==void 0;if(n=S&&l[0]&&l[0].parentNode||n,x==="string"||x==="number"){if(x==="number"&&(s=s.toString(),s===l))return l;if(S){let y=l[0];y&&y.nodeType===3?y.data!==s&&(y.data=s):y=document.createTextNode(s),l=Ot(n,l,g,y)}else l!==""&&typeof l=="string"?l=n.firstChild.data=s:l=n.textContent=s}else if(s==null||x==="boolean")l=Ot(n,l,g);else{if(x==="function")return $t(()=>{let y=s();for(;typeof y=="function";)y=y();l=jt(n,y,l,g)}),()=>l;if(Array.isArray(s)){const y=[],O=l&&Array.isArray(l);if(Xt(y,s,l,m))return $t(()=>l=jt(n,y,l,g,!0)),()=>l;if(y.length===0){if(l=Ot(n,l,g),S)return l}else O?l.length===0?ie(n,y,g):fe(n,l,y):(l&&Ot(n),ie(n,y));l=y}else if(s.nodeType){if(Array.isArray(l)){if(S)return l=Ot(n,l,g,s);Ot(n,l,null,s)}else l==null||l===""||!n.firstChild?n.appendChild(s):n.replaceChild(s,n.firstChild);l=s}}return l}function Xt(n,s,l,g){let m=!1;for(let x=0,S=s.length;x<S;x++){let y=s[x],O=l&&l[n.length],H;if(!(y==null||y===!0||y===!1))if((H=typeof y)=="object"&&y.nodeType)n.push(y);else if(Array.isArray(y))m=Xt(n,y,O)||m;else if(H==="function")if(g){for(;typeof y=="function";)y=y();m=Xt(n,Array.isArray(y)?y:[y],Array.isArray(O)?O:[O])||m}else n.push(y),m=!0;else{const T=String(y);O&&O.nodeType===3&&O.data===T?n.push(O):n.push(document.createTextNode(T))}}return m}function ie(n,s,l=null){for(let g=0,m=s.length;g<m;g++)n.insertBefore(s[g],l)}function Ot(n,s,l,g){if(l===void 0)return n.textContent="";const m=g||document.createTextNode("");if(s.length){let x=!1;for(let S=s.length-1;S>=0;S--){const y=s[S];if(m!==y){const O=y.parentNode===n;!x&&!S?O?n.replaceChild(m,y):n.insertBefore(m,l):O&&y.remove()}else x=!0}}else n.insertBefore(m,l);return[m]}class me{constructor(s=!1){this.socket=null,this.reconnectTimeout=null,this.reconnectAttempts=0,this.maxReconnectAttempts=6,this.transferId=null,this.signature=null,this.onStatusCallback=null,this.onErrorCallback=null,this.onConnectionCallback=null,this.onScanCallback=null,this.wsBaseUrl=s?"transfer-status-test.zenobiapay.com":"transfer-status.zenobiapay.com"}getSignature(){return this.signature}getTransferId(){return this.transferId}async createTransfer(s,l){try{const g=await fetch(s,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(l)});if(!g.ok){const x=await g.json();throw new Error(x.message||"Failed to create transfer request")}const m=await g.json();return this.transferId=m.transferRequestId,this.signature=m.signature,m}catch(g){throw console.error("Error creating transfer request:",g),g instanceof Error?g:new Error("Failed to create transfer request")}}listenToTransfer(s,l,g,m,x,S){this.transferId=s,this.signature=l,g&&(this.onStatusCallback=g),m&&(this.onErrorCallback=m),x&&(this.onConnectionCallback=x),S&&(this.onScanCallback=S),this.connectWebSocket()}async createTransferAndListen(s,l,g,m,x,S){const y=await this.createTransfer(s,l);return this.listenToTransfer(y.transferRequestId,y.signature,g,m,x,S),y}connectWebSocket(){if(this.socket&&(this.socket.close(),this.socket=null,this.notifyConnectionStatus(!1)),!this.transferId||!this.signature){console.error("Cannot connect to WebSocket: Missing transfer ID or signature");return}try{const l=`${window.location.protocol==="https:"?"wss:":"ws:"}//${this.wsBaseUrl}/transfers/${this.transferId}/ws?token=${this.signature}`,g=new WebSocket(l);this.socket=g,g.onopen=()=>{this.notifyConnectionStatus(!0),this.reconnectAttempts=0},g.onclose=m=>{this.notifyConnectionStatus(!1),this.socket=null,m.code!==1e3&&this.reconnectAttempts<this.maxReconnectAttempts&&this.attemptReconnect()},g.onerror=m=>{console.error(`WebSocket error for transfer: ${this.transferId}`,m),this.notifyError("WebSocket error occurred")},g.onmessage=m=>{console.log(`WebSocket message received for transfer: ${this.transferId}`,m.data);try{const x=JSON.parse(m.data);x.type==="status"&&x.transfer?this.notifyStatus(x.transfer):x.type==="error"&&x.message?this.notifyError(x.message):x.type==="scan"?this.notifyScan(x):x.type==="ping"&&g.readyState===WebSocket.OPEN&&g.send(JSON.stringify({type:"pong"}))}catch{this.notifyError("Failed to parse message")}}}catch{this.notifyError("Failed to establish WebSocket connection")}}attemptReconnect(){this.reconnectAttempts++;const s=Math.min(1e3*Math.pow(2,this.reconnectAttempts-1),3e4);console.log(`Attempting to reconnect in ${s}ms (attempt ${this.reconnectAttempts})`),this.reconnectTimeout&&window.clearTimeout(this.reconnectTimeout),this.reconnectTimeout=window.setTimeout(()=>{console.log(`Reconnecting to WebSocket (attempt ${this.reconnectAttempts})...`),this.connectWebSocket()},s)}disconnect(){this.reconnectTimeout&&(window.clearTimeout(this.reconnectTimeout),this.reconnectTimeout=null),this.socket&&this.socket.readyState<2&&(console.log(`Closing WebSocket for transfer: ${this.transferId}`),this.socket.close(),this.socket=null,this.notifyConnectionStatus(!1)),this.transferId=null,this.signature=null}notifyConnectionStatus(s){this.onConnectionCallback&&this.onConnectionCallback(s)}notifyStatus(s){this.onStatusCallback&&this.onStatusCallback(s)}notifyError(s){this.onErrorCallback&&this.onErrorCallback(s)}notifyScan(s){this.onScanCallback&&this.onScanCallback(s)}}function ve(n){return n&&n.__esModule&&Object.prototype.hasOwnProperty.call(n,"default")?n.default:n}var Ft={exports:{}},ye=Ft.exports,oe;function xe(){return oe||(oe=1,function(n,s){(function(l,g){n.exports=g()})(ye,()=>(()=>{var l={873:(S,y)=>{var O,H,T=function(){var L=function(p,w){var u=p,e=pt[w],t=null,o=0,r=null,i=[],d={},_=function(a,h){t=function(c){for(var f=new Array(c),b=0;b<c;b+=1){f[b]=new Array(c);for(var z=0;z<c;z+=1)f[b][z]=null}return f}(o=4*u+17),v(0,0),v(o-7,0),v(0,o-7),C(),$(),k(a,h),u>=7&&A(a),r==null&&(r=B(u,e,i)),M(r,h)},v=function(a,h){for(var c=-1;c<=7;c+=1)if(!(a+c<=-1||o<=a+c))for(var f=-1;f<=7;f+=1)h+f<=-1||o<=h+f||(t[a+c][h+f]=0<=c&&c<=6&&(f==0||f==6)||0<=f&&f<=6&&(c==0||c==6)||2<=c&&c<=4&&2<=f&&f<=4)},$=function(){for(var a=8;a<o-8;a+=1)t[a][6]==null&&(t[a][6]=a%2==0);for(var h=8;h<o-8;h+=1)t[6][h]==null&&(t[6][h]=h%2==0)},C=function(){for(var a=et.getPatternPosition(u),h=0;h<a.length;h+=1)for(var c=0;c<a.length;c+=1){var f=a[h],b=a[c];if(t[f][b]==null)for(var z=-2;z<=2;z+=1)for(var P=-2;P<=2;P+=1)t[f+z][b+P]=z==-2||z==2||P==-2||P==2||z==0&&P==0}},A=function(a){for(var h=et.getBCHTypeNumber(u),c=0;c<18;c+=1){var f=!a&&(h>>c&1)==1;t[Math.floor(c/3)][c%3+o-8-3]=f}for(c=0;c<18;c+=1)f=!a&&(h>>c&1)==1,t[c%3+o-8-3][Math.floor(c/3)]=f},k=function(a,h){for(var c=e<<3|h,f=et.getBCHTypeInfo(c),b=0;b<15;b+=1){var z=!a&&(f>>b&1)==1;b<6?t[b][8]=z:b<8?t[b+1][8]=z:t[o-15+b][8]=z}for(b=0;b<15;b+=1)z=!a&&(f>>b&1)==1,b<8?t[8][o-b-1]=z:b<9?t[8][15-b-1+1]=z:t[8][15-b-1]=z;t[o-8][8]=!a},M=function(a,h){for(var c=-1,f=o-1,b=7,z=0,P=et.getMaskFunction(h),D=o-1;D>0;D-=2)for(D==6&&(D-=1);;){for(var R=0;R<2;R+=1)if(t[f][D-R]==null){var j=!1;z<a.length&&(j=(a[z]>>>b&1)==1),P(f,D-R)&&(j=!j),t[f][D-R]=j,(b-=1)==-1&&(z+=1,b=7)}if((f+=c)<0||o<=f){f-=c,c=-c;break}}},B=function(a,h,c){for(var f=qt.getRSBlocks(a,h),b=St(),z=0;z<c.length;z+=1){var P=c[z];b.put(P.getMode(),4),b.put(P.getLength(),et.getLengthInBits(P.getMode(),a)),P.write(b)}var D=0;for(z=0;z<f.length;z+=1)D+=f[z].dataCount;if(b.getLengthInBits()>8*D)throw"code length overflow. ("+b.getLengthInBits()+">"+8*D+")";for(b.getLengthInBits()+4<=8*D&&b.put(0,4);b.getLengthInBits()%8!=0;)b.putBit(!1);for(;!(b.getLengthInBits()>=8*D||(b.put(236,8),b.getLengthInBits()>=8*D));)b.put(17,8);return function(R,j){for(var Q=0,rt=0,J=0,X=new Array(j.length),F=new Array(j.length),q=0;q<j.length;q+=1){var Z=j[q].dataCount,it=j[q].totalCount-Z;rt=Math.max(rt,Z),J=Math.max(J,it),X[q]=new Array(Z);for(var E=0;E<X[q].length;E+=1)X[q][E]=255&R.getBuffer()[E+Q];Q+=Z;var ut=et.getErrorCorrectPolynomial(it),lt=ft(X[q],ut.getLength()-1).mod(ut);for(F[q]=new Array(ut.getLength()-1),E=0;E<F[q].length;E+=1){var at=E+lt.getLength()-F[q].length;F[q][E]=at>=0?lt.getAt(at):0}}var Ut=0;for(E=0;E<j.length;E+=1)Ut+=j[E].totalCount;var Dt=new Array(Ut),bt=0;for(E=0;E<rt;E+=1)for(q=0;q<j.length;q+=1)E<X[q].length&&(Dt[bt]=X[q][E],bt+=1);for(E=0;E<J;E+=1)for(q=0;q<j.length;q+=1)E<F[q].length&&(Dt[bt]=F[q][E],bt+=1);return Dt}(b,f)};d.addData=function(a,h){var c=null;switch(h=h||"Byte"){case"Numeric":c=N(a);break;case"Alphanumeric":c=ot(a);break;case"Byte":c=G(a);break;case"Kanji":c=dt(a);break;default:throw"mode:"+h}i.push(c),r=null},d.isDark=function(a,h){if(a<0||o<=a||h<0||o<=h)throw a+","+h;return t[a][h]},d.getModuleCount=function(){return o},d.make=function(){if(u<1){for(var a=1;a<40;a++){for(var h=qt.getRSBlocks(a,e),c=St(),f=0;f<i.length;f++){var b=i[f];c.put(b.getMode(),4),c.put(b.getLength(),et.getLengthInBits(b.getMode(),a)),b.write(c)}var z=0;for(f=0;f<h.length;f++)z+=h[f].dataCount;if(c.getLengthInBits()<=8*z)break}u=a}_(!1,function(){for(var P=0,D=0,R=0;R<8;R+=1){_(!0,R);var j=et.getLostPoint(d);(R==0||P>j)&&(P=j,D=R)}return D}())},d.createTableTag=function(a,h){a=a||2;var c="";c+='<table style="',c+=" border-width: 0px; border-style: none;",c+=" border-collapse: collapse;",c+=" padding: 0px; margin: "+(h=h===void 0?4*a:h)+"px;",c+='">',c+="<tbody>";for(var f=0;f<d.getModuleCount();f+=1){c+="<tr>";for(var b=0;b<d.getModuleCount();b+=1)c+='<td style="',c+=" border-width: 0px; border-style: none;",c+=" border-collapse: collapse;",c+=" padding: 0px; margin: 0px;",c+=" width: "+a+"px;",c+=" height: "+a+"px;",c+=" background-color: ",c+=d.isDark(f,b)?"#000000":"#ffffff",c+=";",c+='"/>';c+="</tr>"}return(c+="</tbody>")+"</table>"},d.createSvgTag=function(a,h,c,f){var b={};typeof arguments[0]=="object"&&(a=(b=arguments[0]).cellSize,h=b.margin,c=b.alt,f=b.title),a=a||2,h=h===void 0?4*a:h,(c=typeof c=="string"?{text:c}:c||{}).text=c.text||null,c.id=c.text?c.id||"qrcode-description":null,(f=typeof f=="string"?{text:f}:f||{}).text=f.text||null,f.id=f.text?f.id||"qrcode-title":null;var z,P,D,R,j=d.getModuleCount()*a+2*h,Q="";for(R="l"+a+",0 0,"+a+" -"+a+",0 0,-"+a+"z ",Q+='<svg version="1.1" xmlns="http://www.w3.org/2000/svg"',Q+=b.scalable?"":' width="'+j+'px" height="'+j+'px"',Q+=' viewBox="0 0 '+j+" "+j+'" ',Q+=' preserveAspectRatio="xMinYMin meet"',Q+=f.text||c.text?' role="img" aria-labelledby="'+I([f.id,c.id].join(" ").trim())+'"':"",Q+=">",Q+=f.text?'<title id="'+I(f.id)+'">'+I(f.text)+"</title>":"",Q+=c.text?'<description id="'+I(c.id)+'">'+I(c.text)+"</description>":"",Q+='<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>',Q+='<path d="',P=0;P<d.getModuleCount();P+=1)for(D=P*a+h,z=0;z<d.getModuleCount();z+=1)d.isDark(P,z)&&(Q+="M"+(z*a+h)+","+D+R);return(Q+='" stroke="transparent" fill="black"/>')+"</svg>"},d.createDataURL=function(a,h){a=a||2,h=h===void 0?4*a:h;var c=d.getModuleCount()*a+2*h,f=h,b=c-h;return gt(c,c,function(z,P){if(f<=z&&z<b&&f<=P&&P<b){var D=Math.floor((z-f)/a),R=Math.floor((P-f)/a);return d.isDark(R,D)?0:1}return 1})},d.createImgTag=function(a,h,c){a=a||2,h=h===void 0?4*a:h;var f=d.getModuleCount()*a+2*h,b="";return b+="<img",b+=' src="',b+=d.createDataURL(a,h),b+='"',b+=' width="',b+=f,b+='"',b+=' height="',b+=f,b+='"',c&&(b+=' alt="',b+=I(c),b+='"'),b+"/>"};var I=function(a){for(var h="",c=0;c<a.length;c+=1){var f=a.charAt(c);switch(f){case"<":h+="&lt;";break;case">":h+="&gt;";break;case"&":h+="&amp;";break;case'"':h+="&quot;";break;default:h+=f}}return h};return d.createASCII=function(a,h){if((a=a||1)<2)return function(X){X=X===void 0?2:X;var F,q,Z,it,E,ut=1*d.getModuleCount()+2*X,lt=X,at=ut-X,Ut={"██":"█","█ ":"▀"," █":"▄","  ":" "},Dt={"██":"▀","█ ":"▀"," █":" ","  ":" "},bt="";for(F=0;F<ut;F+=2){for(Z=Math.floor((F-lt)/1),it=Math.floor((F+1-lt)/1),q=0;q<ut;q+=1)E="█",lt<=q&&q<at&&lt<=F&&F<at&&d.isDark(Z,Math.floor((q-lt)/1))&&(E=" "),lt<=q&&q<at&&lt<=F+1&&F+1<at&&d.isDark(it,Math.floor((q-lt)/1))?E+=" ":E+="█",bt+=X<1&&F+1>=at?Dt[E]:Ut[E];bt+=`
`}return ut%2&&X>0?bt.substring(0,bt.length-ut-1)+Array(ut+1).join("▀"):bt.substring(0,bt.length-1)}(h);a-=1,h=h===void 0?2*a:h;var c,f,b,z,P=d.getModuleCount()*a+2*h,D=h,R=P-h,j=Array(a+1).join("██"),Q=Array(a+1).join("  "),rt="",J="";for(c=0;c<P;c+=1){for(b=Math.floor((c-D)/a),J="",f=0;f<P;f+=1)z=1,D<=f&&f<R&&D<=c&&c<R&&d.isDark(b,Math.floor((f-D)/a))&&(z=0),J+=z?j:Q;for(b=0;b<a;b+=1)rt+=J+`
`}return rt.substring(0,rt.length-1)},d.renderTo2dContext=function(a,h){h=h||2;for(var c=d.getModuleCount(),f=0;f<c;f++)for(var b=0;b<c;b++)a.fillStyle=d.isDark(f,b)?"black":"white",a.fillRect(f*h,b*h,h,h)},d};L.stringToBytes=(L.stringToBytesFuncs={default:function(p){for(var w=[],u=0;u<p.length;u+=1){var e=p.charCodeAt(u);w.push(255&e)}return w}}).default,L.createStringToBytes=function(p,w){var u=function(){for(var t=Ct(p),o=function(){var $=t.read();if($==-1)throw"eof";return $},r=0,i={};;){var d=t.read();if(d==-1)break;var _=o(),v=o()<<8|o();i[String.fromCharCode(d<<8|_)]=v,r+=1}if(r!=w)throw r+" != "+w;return i}(),e=63;return function(t){for(var o=[],r=0;r<t.length;r+=1){var i=t.charCodeAt(r);if(i<128)o.push(i);else{var d=u[t.charAt(r)];typeof d=="number"?(255&d)==d?o.push(d):(o.push(d>>>8),o.push(255&d)):o.push(e)}}return o}};var W,Y,V,U,ct,pt={L:1,M:0,Q:3,H:2},et=(W=[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],Y=1335,V=7973,ct=function(p){for(var w=0;p!=0;)w+=1,p>>>=1;return w},(U={}).getBCHTypeInfo=function(p){for(var w=p<<10;ct(w)-ct(Y)>=0;)w^=Y<<ct(w)-ct(Y);return 21522^(p<<10|w)},U.getBCHTypeNumber=function(p){for(var w=p<<12;ct(w)-ct(V)>=0;)w^=V<<ct(w)-ct(V);return p<<12|w},U.getPatternPosition=function(p){return W[p-1]},U.getMaskFunction=function(p){switch(p){case 0:return function(w,u){return(w+u)%2==0};case 1:return function(w,u){return w%2==0};case 2:return function(w,u){return u%3==0};case 3:return function(w,u){return(w+u)%3==0};case 4:return function(w,u){return(Math.floor(w/2)+Math.floor(u/3))%2==0};case 5:return function(w,u){return w*u%2+w*u%3==0};case 6:return function(w,u){return(w*u%2+w*u%3)%2==0};case 7:return function(w,u){return(w*u%3+(w+u)%2)%2==0};default:throw"bad maskPattern:"+p}},U.getErrorCorrectPolynomial=function(p){for(var w=ft([1],0),u=0;u<p;u+=1)w=w.multiply(ft([1,nt.gexp(u)],0));return w},U.getLengthInBits=function(p,w){if(1<=w&&w<10)switch(p){case 1:return 10;case 2:return 9;case 4:case 8:return 8;default:throw"mode:"+p}else if(w<27)switch(p){case 1:return 12;case 2:return 11;case 4:return 16;case 8:return 10;default:throw"mode:"+p}else{if(!(w<41))throw"type:"+w;switch(p){case 1:return 14;case 2:return 13;case 4:return 16;case 8:return 12;default:throw"mode:"+p}}},U.getLostPoint=function(p){for(var w=p.getModuleCount(),u=0,e=0;e<w;e+=1)for(var t=0;t<w;t+=1){for(var o=0,r=p.isDark(e,t),i=-1;i<=1;i+=1)if(!(e+i<0||w<=e+i))for(var d=-1;d<=1;d+=1)t+d<0||w<=t+d||i==0&&d==0||r==p.isDark(e+i,t+d)&&(o+=1);o>5&&(u+=3+o-5)}for(e=0;e<w-1;e+=1)for(t=0;t<w-1;t+=1){var _=0;p.isDark(e,t)&&(_+=1),p.isDark(e+1,t)&&(_+=1),p.isDark(e,t+1)&&(_+=1),p.isDark(e+1,t+1)&&(_+=1),_!=0&&_!=4||(u+=3)}for(e=0;e<w;e+=1)for(t=0;t<w-6;t+=1)p.isDark(e,t)&&!p.isDark(e,t+1)&&p.isDark(e,t+2)&&p.isDark(e,t+3)&&p.isDark(e,t+4)&&!p.isDark(e,t+5)&&p.isDark(e,t+6)&&(u+=40);for(t=0;t<w;t+=1)for(e=0;e<w-6;e+=1)p.isDark(e,t)&&!p.isDark(e+1,t)&&p.isDark(e+2,t)&&p.isDark(e+3,t)&&p.isDark(e+4,t)&&!p.isDark(e+5,t)&&p.isDark(e+6,t)&&(u+=40);var v=0;for(t=0;t<w;t+=1)for(e=0;e<w;e+=1)p.isDark(e,t)&&(v+=1);return u+Math.abs(100*v/w/w-50)/5*10},U),nt=function(){for(var p=new Array(256),w=new Array(256),u=0;u<8;u+=1)p[u]=1<<u;for(u=8;u<256;u+=1)p[u]=p[u-4]^p[u-5]^p[u-6]^p[u-8];for(u=0;u<255;u+=1)w[p[u]]=u;return{glog:function(e){if(e<1)throw"glog("+e+")";return w[e]},gexp:function(e){for(;e<0;)e+=255;for(;e>=256;)e-=255;return p[e]}}}();function ft(p,w){if(p.length===void 0)throw p.length+"/"+w;var u=function(){for(var t=0;t<p.length&&p[t]==0;)t+=1;for(var o=new Array(p.length-t+w),r=0;r<p.length-t;r+=1)o[r]=p[r+t];return o}(),e={getAt:function(t){return u[t]},getLength:function(){return u.length},multiply:function(t){for(var o=new Array(e.getLength()+t.getLength()-1),r=0;r<e.getLength();r+=1)for(var i=0;i<t.getLength();i+=1)o[r+i]^=nt.gexp(nt.glog(e.getAt(r))+nt.glog(t.getAt(i)));return ft(o,0)},mod:function(t){if(e.getLength()-t.getLength()<0)return e;for(var o=nt.glog(e.getAt(0))-nt.glog(t.getAt(0)),r=new Array(e.getLength()),i=0;i<e.getLength();i+=1)r[i]=e.getAt(i);for(i=0;i<t.getLength();i+=1)r[i]^=nt.gexp(nt.glog(t.getAt(i))+o);return ft(r,0).mod(t)}};return e}var qt=function(){var p=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12,7,37,13],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]],w=function(e,t){var o={};return o.totalCount=e,o.dataCount=t,o},u={getRSBlocks:function(e,t){var o=function(A,k){switch(k){case pt.L:return p[4*(A-1)+0];case pt.M:return p[4*(A-1)+1];case pt.Q:return p[4*(A-1)+2];case pt.H:return p[4*(A-1)+3];default:return}}(e,t);if(o===void 0)throw"bad rs block @ typeNumber:"+e+"/errorCorrectionLevel:"+t;for(var r=o.length/3,i=[],d=0;d<r;d+=1)for(var _=o[3*d+0],v=o[3*d+1],$=o[3*d+2],C=0;C<_;C+=1)i.push(w(v,$));return i}};return u}(),St=function(){var p=[],w=0,u={getBuffer:function(){return p},getAt:function(e){var t=Math.floor(e/8);return(p[t]>>>7-e%8&1)==1},put:function(e,t){for(var o=0;o<t;o+=1)u.putBit((e>>>t-o-1&1)==1)},getLengthInBits:function(){return w},putBit:function(e){var t=Math.floor(w/8);p.length<=t&&p.push(0),e&&(p[t]|=128>>>w%8),w+=1}};return u},N=function(p){var w=p,u={getMode:function(){return 1},getLength:function(o){return w.length},write:function(o){for(var r=w,i=0;i+2<r.length;)o.put(e(r.substring(i,i+3)),10),i+=3;i<r.length&&(r.length-i==1?o.put(e(r.substring(i,i+1)),4):r.length-i==2&&o.put(e(r.substring(i,i+2)),7))}},e=function(o){for(var r=0,i=0;i<o.length;i+=1)r=10*r+t(o.charAt(i));return r},t=function(o){if("0"<=o&&o<="9")return o.charCodeAt(0)-48;throw"illegal char :"+o};return u},ot=function(p){var w=p,u={getMode:function(){return 2},getLength:function(t){return w.length},write:function(t){for(var o=w,r=0;r+1<o.length;)t.put(45*e(o.charAt(r))+e(o.charAt(r+1)),11),r+=2;r<o.length&&t.put(e(o.charAt(r)),6)}},e=function(t){if("0"<=t&&t<="9")return t.charCodeAt(0)-48;if("A"<=t&&t<="Z")return t.charCodeAt(0)-65+10;switch(t){case" ":return 36;case"$":return 37;case"%":return 38;case"*":return 39;case"+":return 40;case"-":return 41;case".":return 42;case"/":return 43;case":":return 44;default:throw"illegal char :"+t}};return u},G=function(p){var w=L.stringToBytes(p);return{getMode:function(){return 4},getLength:function(u){return w.length},write:function(u){for(var e=0;e<w.length;e+=1)u.put(w[e],8)}}},dt=function(p){var w=L.stringToBytesFuncs.SJIS;if(!w)throw"sjis not supported.";(function(){var t=w("友");if(t.length!=2||(t[0]<<8|t[1])!=38726)throw"sjis not supported."})();var u=w(p),e={getMode:function(){return 8},getLength:function(t){return~~(u.length/2)},write:function(t){for(var o=u,r=0;r+1<o.length;){var i=(255&o[r])<<8|255&o[r+1];if(33088<=i&&i<=40956)i-=33088;else{if(!(57408<=i&&i<=60351))throw"illegal char at "+(r+1)+"/"+i;i-=49472}i=192*(i>>>8&255)+(255&i),t.put(i,13),r+=2}if(r<o.length)throw"illegal char at "+(r+1)}};return e},wt=function(){var p=[],w={writeByte:function(u){p.push(255&u)},writeShort:function(u){w.writeByte(u),w.writeByte(u>>>8)},writeBytes:function(u,e,t){e=e||0,t=t||u.length;for(var o=0;o<t;o+=1)w.writeByte(u[o+e])},writeString:function(u){for(var e=0;e<u.length;e+=1)w.writeByte(u.charCodeAt(e))},toByteArray:function(){return p},toString:function(){var u="";u+="[";for(var e=0;e<p.length;e+=1)e>0&&(u+=","),u+=p[e];return u+"]"}};return w},Ct=function(p){var w=p,u=0,e=0,t=0,o={read:function(){for(;t<8;){if(u>=w.length){if(t==0)return-1;throw"unexpected end of file./"+t}var i=w.charAt(u);if(u+=1,i=="=")return t=0,-1;i.match(/^\s$/)||(e=e<<6|r(i.charCodeAt(0)),t+=6)}var d=e>>>t-8&255;return t-=8,d}},r=function(i){if(65<=i&&i<=90)return i-65;if(97<=i&&i<=122)return i-97+26;if(48<=i&&i<=57)return i-48+52;if(i==43)return 62;if(i==47)return 63;throw"c:"+i};return o},gt=function(p,w,u){for(var e=function(v,$){var C=v,A=$,k=new Array(v*$),M={setPixel:function(a,h,c){k[h*C+a]=c},write:function(a){a.writeString("GIF87a"),a.writeShort(C),a.writeShort(A),a.writeByte(128),a.writeByte(0),a.writeByte(0),a.writeByte(0),a.writeByte(0),a.writeByte(0),a.writeByte(255),a.writeByte(255),a.writeByte(255),a.writeString(","),a.writeShort(0),a.writeShort(0),a.writeShort(C),a.writeShort(A),a.writeByte(0);var h=B(2);a.writeByte(2);for(var c=0;h.length-c>255;)a.writeByte(255),a.writeBytes(h,c,255),c+=255;a.writeByte(h.length-c),a.writeBytes(h,c,h.length-c),a.writeByte(0),a.writeString(";")}},B=function(a){for(var h=1<<a,c=1+(1<<a),f=a+1,b=I(),z=0;z<h;z+=1)b.add(String.fromCharCode(z));b.add(String.fromCharCode(h)),b.add(String.fromCharCode(c));var P,D,R,j=wt(),Q=(P=j,D=0,R=0,{write:function(F,q){if(F>>>q)throw"length over";for(;D+q>=8;)P.writeByte(255&(F<<D|R)),q-=8-D,F>>>=8-D,R=0,D=0;R|=F<<D,D+=q},flush:function(){D>0&&P.writeByte(R)}});Q.write(h,f);var rt=0,J=String.fromCharCode(k[rt]);for(rt+=1;rt<k.length;){var X=String.fromCharCode(k[rt]);rt+=1,b.contains(J+X)?J+=X:(Q.write(b.indexOf(J),f),b.size()<4095&&(b.size()==1<<f&&(f+=1),b.add(J+X)),J=X)}return Q.write(b.indexOf(J),f),Q.write(c,f),Q.flush(),j.toByteArray()},I=function(){var a={},h=0,c={add:function(f){if(c.contains(f))throw"dup key:"+f;a[f]=h,h+=1},size:function(){return h},indexOf:function(f){return a[f]},contains:function(f){return a[f]!==void 0}};return c};return M}(p,w),t=0;t<w;t+=1)for(var o=0;o<p;o+=1)e.setPixel(o,t,u(o,t));var r=wt();e.write(r);for(var i=function(){var v=0,$=0,C=0,A="",k={},M=function(I){A+=String.fromCharCode(B(63&I))},B=function(I){if(!(I<0)){if(I<26)return 65+I;if(I<52)return I-26+97;if(I<62)return I-52+48;if(I==62)return 43;if(I==63)return 47}throw"n:"+I};return k.writeByte=function(I){for(v=v<<8|255&I,$+=8,C+=1;$>=6;)M(v>>>$-6),$-=6},k.flush=function(){if($>0&&(M(v<<6-$),v=0,$=0),C%3!=0)for(var I=3-C%3,a=0;a<I;a+=1)A+="="},k.toString=function(){return A},k}(),d=r.toByteArray(),_=0;_<d.length;_+=1)i.writeByte(d[_]);return i.flush(),"data:image/gif;base64,"+i};return L}();T.stringToBytesFuncs["UTF-8"]=function(L){return function(W){for(var Y=[],V=0;V<W.length;V++){var U=W.charCodeAt(V);U<128?Y.push(U):U<2048?Y.push(192|U>>6,128|63&U):U<55296||U>=57344?Y.push(224|U>>12,128|U>>6&63,128|63&U):(V++,U=65536+((1023&U)<<10|1023&W.charCodeAt(V)),Y.push(240|U>>18,128|U>>12&63,128|U>>6&63,128|63&U))}return Y}(L)},(H=typeof(O=function(){return T})=="function"?O.apply(y,[]):O)===void 0||(S.exports=H)}},g={};function m(S){var y=g[S];if(y!==void 0)return y.exports;var O=g[S]={exports:{}};return l[S](O,O.exports,m),O.exports}m.n=S=>{var y=S&&S.__esModule?()=>S.default:()=>S;return m.d(y,{a:y}),y},m.d=(S,y)=>{for(var O in y)m.o(y,O)&&!m.o(S,O)&&Object.defineProperty(S,O,{enumerable:!0,get:y[O]})},m.o=(S,y)=>Object.prototype.hasOwnProperty.call(S,y);var x={};return(()=>{m.d(x,{default:()=>w});const S=u=>!!u&&typeof u=="object"&&!Array.isArray(u);function y(u,...e){if(!e.length)return u;const t=e.shift();return t!==void 0&&S(u)&&S(t)?(u=Object.assign({},u),Object.keys(t).forEach(o=>{const r=u[o],i=t[o];Array.isArray(r)&&Array.isArray(i)?u[o]=i:S(r)&&S(i)?u[o]=y(Object.assign({},r),i):u[o]=i}),y(u,...e)):u}function O(u,e){const t=document.createElement("a");t.download=e,t.href=u,document.body.appendChild(t),t.click(),document.body.removeChild(t)}const H={L:.07,M:.15,Q:.25,H:.3};class T{constructor({svg:e,type:t,window:o}){this._svg=e,this._type=t,this._window=o}draw(e,t,o,r){let i;switch(this._type){case"dots":i=this._drawDot;break;case"classy":i=this._drawClassy;break;case"classy-rounded":i=this._drawClassyRounded;break;case"rounded":i=this._drawRounded;break;case"extra-rounded":i=this._drawExtraRounded;break;default:i=this._drawSquare}i.call(this,{x:e,y:t,size:o,getNeighbor:r})}_rotateFigure({x:e,y:t,size:o,rotation:r=0,draw:i}){var d;const _=e+o/2,v=t+o/2;i(),(d=this._element)===null||d===void 0||d.setAttribute("transform",`rotate(${180*r/Math.PI},${_},${v})`)}_basicDot(e){const{size:t,x:o,y:r}=e;this._rotateFigure(Object.assign(Object.assign({},e),{draw:()=>{this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","circle"),this._element.setAttribute("cx",String(o+t/2)),this._element.setAttribute("cy",String(r+t/2)),this._element.setAttribute("r",String(t/2))}}))}_basicSquare(e){const{size:t,x:o,y:r}=e;this._rotateFigure(Object.assign(Object.assign({},e),{draw:()=>{this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","rect"),this._element.setAttribute("x",String(o)),this._element.setAttribute("y",String(r)),this._element.setAttribute("width",String(t)),this._element.setAttribute("height",String(t))}}))}_basicSideRounded(e){const{size:t,x:o,y:r}=e;this._rotateFigure(Object.assign(Object.assign({},e),{draw:()=>{this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","path"),this._element.setAttribute("d",`M ${o} ${r}v ${t}h `+t/2+`a ${t/2} ${t/2}, 0, 0, 0, 0 ${-t}`)}}))}_basicCornerRounded(e){const{size:t,x:o,y:r}=e;this._rotateFigure(Object.assign(Object.assign({},e),{draw:()=>{this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","path"),this._element.setAttribute("d",`M ${o} ${r}v ${t}h ${t}v `+-t/2+`a ${t/2} ${t/2}, 0, 0, 0, ${-t/2} ${-t/2}`)}}))}_basicCornerExtraRounded(e){const{size:t,x:o,y:r}=e;this._rotateFigure(Object.assign(Object.assign({},e),{draw:()=>{this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","path"),this._element.setAttribute("d",`M ${o} ${r}v ${t}h ${t}a ${t} ${t}, 0, 0, 0, ${-t} ${-t}`)}}))}_basicCornersRounded(e){const{size:t,x:o,y:r}=e;this._rotateFigure(Object.assign(Object.assign({},e),{draw:()=>{this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","path"),this._element.setAttribute("d",`M ${o} ${r}v `+t/2+`a ${t/2} ${t/2}, 0, 0, 0, ${t/2} ${t/2}h `+t/2+"v "+-t/2+`a ${t/2} ${t/2}, 0, 0, 0, ${-t/2} ${-t/2}`)}}))}_drawDot({x:e,y:t,size:o}){this._basicDot({x:e,y:t,size:o,rotation:0})}_drawSquare({x:e,y:t,size:o}){this._basicSquare({x:e,y:t,size:o,rotation:0})}_drawRounded({x:e,y:t,size:o,getNeighbor:r}){const i=r?+r(-1,0):0,d=r?+r(1,0):0,_=r?+r(0,-1):0,v=r?+r(0,1):0,$=i+d+_+v;if($!==0)if($>2||i&&d||_&&v)this._basicSquare({x:e,y:t,size:o,rotation:0});else{if($===2){let C=0;return i&&_?C=Math.PI/2:_&&d?C=Math.PI:d&&v&&(C=-Math.PI/2),void this._basicCornerRounded({x:e,y:t,size:o,rotation:C})}if($===1){let C=0;return _?C=Math.PI/2:d?C=Math.PI:v&&(C=-Math.PI/2),void this._basicSideRounded({x:e,y:t,size:o,rotation:C})}}else this._basicDot({x:e,y:t,size:o,rotation:0})}_drawExtraRounded({x:e,y:t,size:o,getNeighbor:r}){const i=r?+r(-1,0):0,d=r?+r(1,0):0,_=r?+r(0,-1):0,v=r?+r(0,1):0,$=i+d+_+v;if($!==0)if($>2||i&&d||_&&v)this._basicSquare({x:e,y:t,size:o,rotation:0});else{if($===2){let C=0;return i&&_?C=Math.PI/2:_&&d?C=Math.PI:d&&v&&(C=-Math.PI/2),void this._basicCornerExtraRounded({x:e,y:t,size:o,rotation:C})}if($===1){let C=0;return _?C=Math.PI/2:d?C=Math.PI:v&&(C=-Math.PI/2),void this._basicSideRounded({x:e,y:t,size:o,rotation:C})}}else this._basicDot({x:e,y:t,size:o,rotation:0})}_drawClassy({x:e,y:t,size:o,getNeighbor:r}){const i=r?+r(-1,0):0,d=r?+r(1,0):0,_=r?+r(0,-1):0,v=r?+r(0,1):0;i+d+_+v!==0?i||_?d||v?this._basicSquare({x:e,y:t,size:o,rotation:0}):this._basicCornerRounded({x:e,y:t,size:o,rotation:Math.PI/2}):this._basicCornerRounded({x:e,y:t,size:o,rotation:-Math.PI/2}):this._basicCornersRounded({x:e,y:t,size:o,rotation:Math.PI/2})}_drawClassyRounded({x:e,y:t,size:o,getNeighbor:r}){const i=r?+r(-1,0):0,d=r?+r(1,0):0,_=r?+r(0,-1):0,v=r?+r(0,1):0;i+d+_+v!==0?i||_?d||v?this._basicSquare({x:e,y:t,size:o,rotation:0}):this._basicCornerExtraRounded({x:e,y:t,size:o,rotation:Math.PI/2}):this._basicCornerExtraRounded({x:e,y:t,size:o,rotation:-Math.PI/2}):this._basicCornersRounded({x:e,y:t,size:o,rotation:Math.PI/2})}}const L={dot:"dot",square:"square",extraRounded:"extra-rounded"},W=Object.values(L);class Y{constructor({svg:e,type:t,window:o}){this._svg=e,this._type=t,this._window=o}draw(e,t,o,r){let i;switch(this._type){case L.square:i=this._drawSquare;break;case L.extraRounded:i=this._drawExtraRounded;break;default:i=this._drawDot}i.call(this,{x:e,y:t,size:o,rotation:r})}_rotateFigure({x:e,y:t,size:o,rotation:r=0,draw:i}){var d;const _=e+o/2,v=t+o/2;i(),(d=this._element)===null||d===void 0||d.setAttribute("transform",`rotate(${180*r/Math.PI},${_},${v})`)}_basicDot(e){const{size:t,x:o,y:r}=e,i=t/7;this._rotateFigure(Object.assign(Object.assign({},e),{draw:()=>{this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","path"),this._element.setAttribute("clip-rule","evenodd"),this._element.setAttribute("d",`M ${o+t/2} ${r}a ${t/2} ${t/2} 0 1 0 0.1 0zm 0 ${i}a ${t/2-i} ${t/2-i} 0 1 1 -0.1 0Z`)}}))}_basicSquare(e){const{size:t,x:o,y:r}=e,i=t/7;this._rotateFigure(Object.assign(Object.assign({},e),{draw:()=>{this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","path"),this._element.setAttribute("clip-rule","evenodd"),this._element.setAttribute("d",`M ${o} ${r}v ${t}h ${t}v `+-t+`zM ${o+i} ${r+i}h `+(t-2*i)+"v "+(t-2*i)+"h "+(2*i-t)+"z")}}))}_basicExtraRounded(e){const{size:t,x:o,y:r}=e,i=t/7;this._rotateFigure(Object.assign(Object.assign({},e),{draw:()=>{this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","path"),this._element.setAttribute("clip-rule","evenodd"),this._element.setAttribute("d",`M ${o} ${r+2.5*i}v `+2*i+`a ${2.5*i} ${2.5*i}, 0, 0, 0, ${2.5*i} ${2.5*i}h `+2*i+`a ${2.5*i} ${2.5*i}, 0, 0, 0, ${2.5*i} ${2.5*-i}v `+-2*i+`a ${2.5*i} ${2.5*i}, 0, 0, 0, ${2.5*-i} ${2.5*-i}h `+-2*i+`a ${2.5*i} ${2.5*i}, 0, 0, 0, ${2.5*-i} ${2.5*i}M ${o+2.5*i} ${r+i}h `+2*i+`a ${1.5*i} ${1.5*i}, 0, 0, 1, ${1.5*i} ${1.5*i}v `+2*i+`a ${1.5*i} ${1.5*i}, 0, 0, 1, ${1.5*-i} ${1.5*i}h `+-2*i+`a ${1.5*i} ${1.5*i}, 0, 0, 1, ${1.5*-i} ${1.5*-i}v `+-2*i+`a ${1.5*i} ${1.5*i}, 0, 0, 1, ${1.5*i} ${1.5*-i}`)}}))}_drawDot({x:e,y:t,size:o,rotation:r}){this._basicDot({x:e,y:t,size:o,rotation:r})}_drawSquare({x:e,y:t,size:o,rotation:r}){this._basicSquare({x:e,y:t,size:o,rotation:r})}_drawExtraRounded({x:e,y:t,size:o,rotation:r}){this._basicExtraRounded({x:e,y:t,size:o,rotation:r})}}const V={dot:"dot",square:"square"},U=Object.values(V);class ct{constructor({svg:e,type:t,window:o}){this._svg=e,this._type=t,this._window=o}draw(e,t,o,r){let i;i=this._type===V.square?this._drawSquare:this._drawDot,i.call(this,{x:e,y:t,size:o,rotation:r})}_rotateFigure({x:e,y:t,size:o,rotation:r=0,draw:i}){var d;const _=e+o/2,v=t+o/2;i(),(d=this._element)===null||d===void 0||d.setAttribute("transform",`rotate(${180*r/Math.PI},${_},${v})`)}_basicDot(e){const{size:t,x:o,y:r}=e;this._rotateFigure(Object.assign(Object.assign({},e),{draw:()=>{this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","circle"),this._element.setAttribute("cx",String(o+t/2)),this._element.setAttribute("cy",String(r+t/2)),this._element.setAttribute("r",String(t/2))}}))}_basicSquare(e){const{size:t,x:o,y:r}=e;this._rotateFigure(Object.assign(Object.assign({},e),{draw:()=>{this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","rect"),this._element.setAttribute("x",String(o)),this._element.setAttribute("y",String(r)),this._element.setAttribute("width",String(t)),this._element.setAttribute("height",String(t))}}))}_drawDot({x:e,y:t,size:o,rotation:r}){this._basicDot({x:e,y:t,size:o,rotation:r})}_drawSquare({x:e,y:t,size:o,rotation:r}){this._basicSquare({x:e,y:t,size:o,rotation:r})}}const pt="circle",et=[[1,1,1,1,1,1,1],[1,0,0,0,0,0,1],[1,0,0,0,0,0,1],[1,0,0,0,0,0,1],[1,0,0,0,0,0,1],[1,0,0,0,0,0,1],[1,1,1,1,1,1,1]],nt=[[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,1,1,1,0,0],[0,0,1,1,1,0,0],[0,0,1,1,1,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0]];class ft{constructor(e,t){this._roundSize=o=>this._options.dotsOptions.roundSize?Math.floor(o):o,this._window=t,this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","svg"),this._element.setAttribute("width",String(e.width)),this._element.setAttribute("height",String(e.height)),this._element.setAttribute("xmlns:xlink","http://www.w3.org/1999/xlink"),e.dotsOptions.roundSize||this._element.setAttribute("shape-rendering","crispEdges"),this._element.setAttribute("viewBox",`0 0 ${e.width} ${e.height}`),this._defs=this._window.document.createElementNS("http://www.w3.org/2000/svg","defs"),this._element.appendChild(this._defs),this._imageUri=e.image,this._instanceId=ft.instanceCount++,this._options=e}get width(){return this._options.width}get height(){return this._options.height}getElement(){return this._element}async drawQR(e){const t=e.getModuleCount(),o=Math.min(this._options.width,this._options.height)-2*this._options.margin,r=this._options.shape===pt?o/Math.sqrt(2):o,i=this._roundSize(r/t);let d={hideXDots:0,hideYDots:0,width:0,height:0};if(this._qr=e,this._options.image){if(await this.loadImage(),!this._image)return;const{imageOptions:_,qrOptions:v}=this._options,$=_.imageSize*H[v.errorCorrectionLevel],C=Math.floor($*t*t);d=function({originalHeight:A,originalWidth:k,maxHiddenDots:M,maxHiddenAxisDots:B,dotSize:I}){const a={x:0,y:0},h={x:0,y:0};if(A<=0||k<=0||M<=0||I<=0)return{height:0,width:0,hideYDots:0,hideXDots:0};const c=A/k;return a.x=Math.floor(Math.sqrt(M/c)),a.x<=0&&(a.x=1),B&&B<a.x&&(a.x=B),a.x%2==0&&a.x--,h.x=a.x*I,a.y=1+2*Math.ceil((a.x*c-1)/2),h.y=Math.round(h.x*c),(a.y*a.x>M||B&&B<a.y)&&(B&&B<a.y?(a.y=B,a.y%2==0&&a.x--):a.y-=2,h.y=a.y*I,a.x=1+2*Math.ceil((a.y/c-1)/2),h.x=Math.round(h.y/c)),{height:h.y,width:h.x,hideYDots:a.y,hideXDots:a.x}}({originalWidth:this._image.width,originalHeight:this._image.height,maxHiddenDots:C,maxHiddenAxisDots:t-14,dotSize:i})}this.drawBackground(),this.drawDots((_,v)=>{var $,C,A,k,M,B;return!(this._options.imageOptions.hideBackgroundDots&&_>=(t-d.hideYDots)/2&&_<(t+d.hideYDots)/2&&v>=(t-d.hideXDots)/2&&v<(t+d.hideXDots)/2||!(($=et[_])===null||$===void 0)&&$[v]||!((C=et[_-t+7])===null||C===void 0)&&C[v]||!((A=et[_])===null||A===void 0)&&A[v-t+7]||!((k=nt[_])===null||k===void 0)&&k[v]||!((M=nt[_-t+7])===null||M===void 0)&&M[v]||!((B=nt[_])===null||B===void 0)&&B[v-t+7])}),this.drawCorners(),this._options.image&&await this.drawImage({width:d.width,height:d.height,count:t,dotSize:i})}drawBackground(){var e,t,o;const r=this._element,i=this._options;if(r){const d=(e=i.backgroundOptions)===null||e===void 0?void 0:e.gradient,_=(t=i.backgroundOptions)===null||t===void 0?void 0:t.color;let v=i.height,$=i.width;if(d||_){const C=this._window.document.createElementNS("http://www.w3.org/2000/svg","rect");this._backgroundClipPath=this._window.document.createElementNS("http://www.w3.org/2000/svg","clipPath"),this._backgroundClipPath.setAttribute("id",`clip-path-background-color-${this._instanceId}`),this._defs.appendChild(this._backgroundClipPath),!((o=i.backgroundOptions)===null||o===void 0)&&o.round&&(v=$=Math.min(i.width,i.height),C.setAttribute("rx",String(v/2*i.backgroundOptions.round))),C.setAttribute("x",String(this._roundSize((i.width-$)/2))),C.setAttribute("y",String(this._roundSize((i.height-v)/2))),C.setAttribute("width",String($)),C.setAttribute("height",String(v)),this._backgroundClipPath.appendChild(C),this._createColor({options:d,color:_,additionalRotation:0,x:0,y:0,height:i.height,width:i.width,name:`background-color-${this._instanceId}`})}}}drawDots(e){var t,o;if(!this._qr)throw"QR code is not defined";const r=this._options,i=this._qr.getModuleCount();if(i>r.width||i>r.height)throw"The canvas is too small.";const d=Math.min(r.width,r.height)-2*r.margin,_=r.shape===pt?d/Math.sqrt(2):d,v=this._roundSize(_/i),$=this._roundSize((r.width-i*v)/2),C=this._roundSize((r.height-i*v)/2),A=new T({svg:this._element,type:r.dotsOptions.type,window:this._window});this._dotsClipPath=this._window.document.createElementNS("http://www.w3.org/2000/svg","clipPath"),this._dotsClipPath.setAttribute("id",`clip-path-dot-color-${this._instanceId}`),this._defs.appendChild(this._dotsClipPath),this._createColor({options:(t=r.dotsOptions)===null||t===void 0?void 0:t.gradient,color:r.dotsOptions.color,additionalRotation:0,x:0,y:0,height:r.height,width:r.width,name:`dot-color-${this._instanceId}`});for(let k=0;k<i;k++)for(let M=0;M<i;M++)e&&!e(k,M)||!((o=this._qr)===null||o===void 0)&&o.isDark(k,M)&&(A.draw($+M*v,C+k*v,v,(B,I)=>!(M+B<0||k+I<0||M+B>=i||k+I>=i)&&!(e&&!e(k+I,M+B))&&!!this._qr&&this._qr.isDark(k+I,M+B)),A._element&&this._dotsClipPath&&this._dotsClipPath.appendChild(A._element));if(r.shape===pt){const k=this._roundSize((d/v-i)/2),M=i+2*k,B=$-k*v,I=C-k*v,a=[],h=this._roundSize(M/2);for(let c=0;c<M;c++){a[c]=[];for(let f=0;f<M;f++)c>=k-1&&c<=M-k&&f>=k-1&&f<=M-k||Math.sqrt((c-h)*(c-h)+(f-h)*(f-h))>h?a[c][f]=0:a[c][f]=this._qr.isDark(f-2*k<0?f:f>=i?f-2*k:f-k,c-2*k<0?c:c>=i?c-2*k:c-k)?1:0}for(let c=0;c<M;c++)for(let f=0;f<M;f++)a[c][f]&&(A.draw(B+f*v,I+c*v,v,(b,z)=>{var P;return!!(!((P=a[c+z])===null||P===void 0)&&P[f+b])}),A._element&&this._dotsClipPath&&this._dotsClipPath.appendChild(A._element))}}drawCorners(){if(!this._qr)throw"QR code is not defined";const e=this._element,t=this._options;if(!e)throw"Element code is not defined";const o=this._qr.getModuleCount(),r=Math.min(t.width,t.height)-2*t.margin,i=t.shape===pt?r/Math.sqrt(2):r,d=this._roundSize(i/o),_=7*d,v=3*d,$=this._roundSize((t.width-o*d)/2),C=this._roundSize((t.height-o*d)/2);[[0,0,0],[1,0,Math.PI/2],[0,1,-Math.PI/2]].forEach(([A,k,M])=>{var B,I,a,h,c,f,b,z,P,D,R,j,Q,rt;const J=$+A*d*(o-7),X=C+k*d*(o-7);let F=this._dotsClipPath,q=this._dotsClipPath;if((!((B=t.cornersSquareOptions)===null||B===void 0)&&B.gradient||!((I=t.cornersSquareOptions)===null||I===void 0)&&I.color)&&(F=this._window.document.createElementNS("http://www.w3.org/2000/svg","clipPath"),F.setAttribute("id",`clip-path-corners-square-color-${A}-${k}-${this._instanceId}`),this._defs.appendChild(F),this._cornersSquareClipPath=this._cornersDotClipPath=q=F,this._createColor({options:(a=t.cornersSquareOptions)===null||a===void 0?void 0:a.gradient,color:(h=t.cornersSquareOptions)===null||h===void 0?void 0:h.color,additionalRotation:M,x:J,y:X,height:_,width:_,name:`corners-square-color-${A}-${k}-${this._instanceId}`})),((c=t.cornersSquareOptions)===null||c===void 0?void 0:c.type)&&W.includes(t.cornersSquareOptions.type)){const Z=new Y({svg:this._element,type:t.cornersSquareOptions.type,window:this._window});Z.draw(J,X,_,M),Z._element&&F&&F.appendChild(Z._element)}else{const Z=new T({svg:this._element,type:((f=t.cornersSquareOptions)===null||f===void 0?void 0:f.type)||t.dotsOptions.type,window:this._window});for(let it=0;it<et.length;it++)for(let E=0;E<et[it].length;E++)!((b=et[it])===null||b===void 0)&&b[E]&&(Z.draw(J+E*d,X+it*d,d,(ut,lt)=>{var at;return!!(!((at=et[it+lt])===null||at===void 0)&&at[E+ut])}),Z._element&&F&&F.appendChild(Z._element))}if((!((z=t.cornersDotOptions)===null||z===void 0)&&z.gradient||!((P=t.cornersDotOptions)===null||P===void 0)&&P.color)&&(q=this._window.document.createElementNS("http://www.w3.org/2000/svg","clipPath"),q.setAttribute("id",`clip-path-corners-dot-color-${A}-${k}-${this._instanceId}`),this._defs.appendChild(q),this._cornersDotClipPath=q,this._createColor({options:(D=t.cornersDotOptions)===null||D===void 0?void 0:D.gradient,color:(R=t.cornersDotOptions)===null||R===void 0?void 0:R.color,additionalRotation:M,x:J+2*d,y:X+2*d,height:v,width:v,name:`corners-dot-color-${A}-${k}-${this._instanceId}`})),((j=t.cornersDotOptions)===null||j===void 0?void 0:j.type)&&U.includes(t.cornersDotOptions.type)){const Z=new ct({svg:this._element,type:t.cornersDotOptions.type,window:this._window});Z.draw(J+2*d,X+2*d,v,M),Z._element&&q&&q.appendChild(Z._element)}else{const Z=new T({svg:this._element,type:((Q=t.cornersDotOptions)===null||Q===void 0?void 0:Q.type)||t.dotsOptions.type,window:this._window});for(let it=0;it<nt.length;it++)for(let E=0;E<nt[it].length;E++)!((rt=nt[it])===null||rt===void 0)&&rt[E]&&(Z.draw(J+E*d,X+it*d,d,(ut,lt)=>{var at;return!!(!((at=nt[it+lt])===null||at===void 0)&&at[E+ut])}),Z._element&&q&&q.appendChild(Z._element))}})}loadImage(){return new Promise((e,t)=>{var o;const r=this._options;if(!r.image)return t("Image is not defined");if(!((o=r.nodeCanvas)===null||o===void 0)&&o.loadImage)r.nodeCanvas.loadImage(r.image).then(i=>{var d,_;if(this._image=i,this._options.imageOptions.saveAsBlob){const v=(d=r.nodeCanvas)===null||d===void 0?void 0:d.createCanvas(this._image.width,this._image.height);(_=v==null?void 0:v.getContext("2d"))===null||_===void 0||_.drawImage(i,0,0),this._imageUri=v==null?void 0:v.toDataURL()}e()}).catch(t);else{const i=new this._window.Image;typeof r.imageOptions.crossOrigin=="string"&&(i.crossOrigin=r.imageOptions.crossOrigin),this._image=i,i.onload=async()=>{this._options.imageOptions.saveAsBlob&&(this._imageUri=await async function(d,_){return new Promise(v=>{const $=new _.XMLHttpRequest;$.onload=function(){const C=new _.FileReader;C.onloadend=function(){v(C.result)},C.readAsDataURL($.response)},$.open("GET",d),$.responseType="blob",$.send()})}(r.image||"",this._window)),e()},i.src=r.image}})}async drawImage({width:e,height:t,count:o,dotSize:r}){const i=this._options,d=this._roundSize((i.width-o*r)/2),_=this._roundSize((i.height-o*r)/2),v=d+this._roundSize(i.imageOptions.margin+(o*r-e)/2),$=_+this._roundSize(i.imageOptions.margin+(o*r-t)/2),C=e-2*i.imageOptions.margin,A=t-2*i.imageOptions.margin,k=this._window.document.createElementNS("http://www.w3.org/2000/svg","image");k.setAttribute("href",this._imageUri||""),k.setAttribute("xlink:href",this._imageUri||""),k.setAttribute("x",String(v)),k.setAttribute("y",String($)),k.setAttribute("width",`${C}px`),k.setAttribute("height",`${A}px`),this._element.appendChild(k)}_createColor({options:e,color:t,additionalRotation:o,x:r,y:i,height:d,width:_,name:v}){const $=_>d?_:d,C=this._window.document.createElementNS("http://www.w3.org/2000/svg","rect");if(C.setAttribute("x",String(r)),C.setAttribute("y",String(i)),C.setAttribute("height",String(d)),C.setAttribute("width",String(_)),C.setAttribute("clip-path",`url('#clip-path-${v}')`),e){let A;if(e.type==="radial")A=this._window.document.createElementNS("http://www.w3.org/2000/svg","radialGradient"),A.setAttribute("id",v),A.setAttribute("gradientUnits","userSpaceOnUse"),A.setAttribute("fx",String(r+_/2)),A.setAttribute("fy",String(i+d/2)),A.setAttribute("cx",String(r+_/2)),A.setAttribute("cy",String(i+d/2)),A.setAttribute("r",String($/2));else{const k=((e.rotation||0)+o)%(2*Math.PI),M=(k+2*Math.PI)%(2*Math.PI);let B=r+_/2,I=i+d/2,a=r+_/2,h=i+d/2;M>=0&&M<=.25*Math.PI||M>1.75*Math.PI&&M<=2*Math.PI?(B-=_/2,I-=d/2*Math.tan(k),a+=_/2,h+=d/2*Math.tan(k)):M>.25*Math.PI&&M<=.75*Math.PI?(I-=d/2,B-=_/2/Math.tan(k),h+=d/2,a+=_/2/Math.tan(k)):M>.75*Math.PI&&M<=1.25*Math.PI?(B+=_/2,I+=d/2*Math.tan(k),a-=_/2,h-=d/2*Math.tan(k)):M>1.25*Math.PI&&M<=1.75*Math.PI&&(I+=d/2,B+=_/2/Math.tan(k),h-=d/2,a-=_/2/Math.tan(k)),A=this._window.document.createElementNS("http://www.w3.org/2000/svg","linearGradient"),A.setAttribute("id",v),A.setAttribute("gradientUnits","userSpaceOnUse"),A.setAttribute("x1",String(Math.round(B))),A.setAttribute("y1",String(Math.round(I))),A.setAttribute("x2",String(Math.round(a))),A.setAttribute("y2",String(Math.round(h)))}e.colorStops.forEach(({offset:k,color:M})=>{const B=this._window.document.createElementNS("http://www.w3.org/2000/svg","stop");B.setAttribute("offset",100*k+"%"),B.setAttribute("stop-color",M),A.appendChild(B)}),C.setAttribute("fill",`url('#${v}')`),this._defs.appendChild(A)}else t&&C.setAttribute("fill",t);this._element.appendChild(C)}}ft.instanceCount=0;const qt=ft,St="canvas",N={};for(let u=0;u<=40;u++)N[u]=u;const ot={type:St,shape:"square",width:300,height:300,data:"",margin:0,qrOptions:{typeNumber:N[0],mode:void 0,errorCorrectionLevel:"Q"},imageOptions:{saveAsBlob:!0,hideBackgroundDots:!0,imageSize:.4,crossOrigin:void 0,margin:0},dotsOptions:{type:"square",color:"#000",roundSize:!0},backgroundOptions:{round:0,color:"#fff"}};function G(u){const e=Object.assign({},u);if(!e.colorStops||!e.colorStops.length)throw"Field 'colorStops' is required in gradient";return e.rotation?e.rotation=Number(e.rotation):e.rotation=0,e.colorStops=e.colorStops.map(t=>Object.assign(Object.assign({},t),{offset:Number(t.offset)})),e}function dt(u){const e=Object.assign({},u);return e.width=Number(e.width),e.height=Number(e.height),e.margin=Number(e.margin),e.imageOptions=Object.assign(Object.assign({},e.imageOptions),{hideBackgroundDots:!!e.imageOptions.hideBackgroundDots,imageSize:Number(e.imageOptions.imageSize),margin:Number(e.imageOptions.margin)}),e.margin>Math.min(e.width,e.height)&&(e.margin=Math.min(e.width,e.height)),e.dotsOptions=Object.assign({},e.dotsOptions),e.dotsOptions.gradient&&(e.dotsOptions.gradient=G(e.dotsOptions.gradient)),e.cornersSquareOptions&&(e.cornersSquareOptions=Object.assign({},e.cornersSquareOptions),e.cornersSquareOptions.gradient&&(e.cornersSquareOptions.gradient=G(e.cornersSquareOptions.gradient))),e.cornersDotOptions&&(e.cornersDotOptions=Object.assign({},e.cornersDotOptions),e.cornersDotOptions.gradient&&(e.cornersDotOptions.gradient=G(e.cornersDotOptions.gradient))),e.backgroundOptions&&(e.backgroundOptions=Object.assign({},e.backgroundOptions),e.backgroundOptions.gradient&&(e.backgroundOptions.gradient=G(e.backgroundOptions.gradient))),e}var wt=m(873),Ct=m.n(wt);function gt(u){if(!u)throw new Error("Extension must be defined");u[0]==="."&&(u=u.substring(1));const e={bmp:"image/bmp",gif:"image/gif",ico:"image/vnd.microsoft.icon",jpeg:"image/jpeg",jpg:"image/jpeg",png:"image/png",svg:"image/svg+xml",tif:"image/tiff",tiff:"image/tiff",webp:"image/webp",pdf:"application/pdf"}[u.toLowerCase()];if(!e)throw new Error(`Extension "${u}" is not supported`);return e}class p{constructor(e){e!=null&&e.jsdom?this._window=new e.jsdom("",{resources:"usable"}).window:this._window=window,this._options=e?dt(y(ot,e)):ot,this.update()}static _clearContainer(e){e&&(e.innerHTML="")}_setupSvg(){if(!this._qr)return;const e=new qt(this._options,this._window);this._svg=e.getElement(),this._svgDrawingPromise=e.drawQR(this._qr).then(()=>{var t;this._svg&&((t=this._extension)===null||t===void 0||t.call(this,e.getElement(),this._options))})}_setupCanvas(){var e,t;this._qr&&(!((e=this._options.nodeCanvas)===null||e===void 0)&&e.createCanvas?(this._nodeCanvas=this._options.nodeCanvas.createCanvas(this._options.width,this._options.height),this._nodeCanvas.width=this._options.width,this._nodeCanvas.height=this._options.height):(this._domCanvas=document.createElement("canvas"),this._domCanvas.width=this._options.width,this._domCanvas.height=this._options.height),this._setupSvg(),this._canvasDrawingPromise=(t=this._svgDrawingPromise)===null||t===void 0?void 0:t.then(()=>{var o;if(!this._svg)return;const r=this._svg,i=new this._window.XMLSerializer().serializeToString(r),d=btoa(i),_=`data:${gt("svg")};base64,${d}`;if(!((o=this._options.nodeCanvas)===null||o===void 0)&&o.loadImage)return this._options.nodeCanvas.loadImage(_).then(v=>{var $,C;v.width=this._options.width,v.height=this._options.height,(C=($=this._nodeCanvas)===null||$===void 0?void 0:$.getContext("2d"))===null||C===void 0||C.drawImage(v,0,0)});{const v=new this._window.Image;return new Promise($=>{v.onload=()=>{var C,A;(A=(C=this._domCanvas)===null||C===void 0?void 0:C.getContext("2d"))===null||A===void 0||A.drawImage(v,0,0),$()},v.src=_})}}))}async _getElement(e="png"){if(!this._qr)throw"QR code is empty";return e.toLowerCase()==="svg"?(this._svg&&this._svgDrawingPromise||this._setupSvg(),await this._svgDrawingPromise,this._svg):((this._domCanvas||this._nodeCanvas)&&this._canvasDrawingPromise||this._setupCanvas(),await this._canvasDrawingPromise,this._domCanvas||this._nodeCanvas)}update(e){p._clearContainer(this._container),this._options=e?dt(y(this._options,e)):this._options,this._options.data&&(this._qr=Ct()(this._options.qrOptions.typeNumber,this._options.qrOptions.errorCorrectionLevel),this._qr.addData(this._options.data,this._options.qrOptions.mode||function(t){switch(!0){case/^[0-9]*$/.test(t):return"Numeric";case/^[0-9A-Z $%*+\-./:]*$/.test(t):return"Alphanumeric";default:return"Byte"}}(this._options.data)),this._qr.make(),this._options.type===St?this._setupCanvas():this._setupSvg(),this.append(this._container))}append(e){if(e){if(typeof e.appendChild!="function")throw"Container should be a single DOM node";this._options.type===St?this._domCanvas&&e.appendChild(this._domCanvas):this._svg&&e.appendChild(this._svg),this._container=e}}applyExtension(e){if(!e)throw"Extension function should be defined.";this._extension=e,this.update()}deleteExtension(){this._extension=void 0,this.update()}async getRawData(e="png"){if(!this._qr)throw"QR code is empty";const t=await this._getElement(e),o=gt(e);if(!t)return null;if(e.toLowerCase()==="svg"){const r=`<?xml version="1.0" standalone="no"?>\r
${new this._window.XMLSerializer().serializeToString(t)}`;return typeof Blob>"u"||this._options.jsdom?Buffer.from(r):new Blob([r],{type:o})}return new Promise(r=>{const i=t;if("toBuffer"in i)if(o==="image/png")r(i.toBuffer(o));else if(o==="image/jpeg")r(i.toBuffer(o));else{if(o!=="application/pdf")throw Error("Unsupported extension");r(i.toBuffer(o))}else"toBlob"in i&&i.toBlob(r,o,1)})}async download(e){if(!this._qr)throw"QR code is empty";if(typeof Blob>"u")throw"Cannot download in Node.js, call getRawData instead.";let t="png",o="qr";typeof e=="string"?(t=e,console.warn("Extension is deprecated as argument for 'download' method, please pass object { name: '...', extension: '...' } as argument")):typeof e=="object"&&e!==null&&(e.name&&(o=e.name),e.extension&&(t=e.extension));const r=await this._getElement(t);if(r)if(t.toLowerCase()==="svg"){let i=new XMLSerializer().serializeToString(r);i=`<?xml version="1.0" standalone="no"?>\r
`+i,O(`data:${gt(t)};charset=utf-8,${encodeURIComponent(i)}`,`${o}.svg`)}else O(r.toDataURL(gt(t)),`${o}.${t}`)}}const w=p})(),x.default})())}(Ft)),Ft.exports}var _e=xe();const Se=ve(_e);var Ce=_t('<div class=test-mode-badge tabindex=0><svg width=16 height=16 viewBox="0 0 20 20"fill=none xmlns=http://www.w3.org/2000/svg><circle cx=10 cy=10 r=9 stroke=#b45309 stroke-width=2 fill=#fef3c7></circle><text x=10 y=15 text-anchor=middle font-size=12 fill=#b45309 font-family=Arial font-weight=bold>i</text></svg><span class=test-mode-badge-text>Test Mode</span><div class=test-mode-tooltip>Test Mode: No real money will be moved.'),ke=_t('<div class=mobile-button-container><button class=mobile-button title="Open on mobile device"><svg width=20 height=20 viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round><rect x=5 y=2 width=14 height=20 rx=2 ry=2></rect><line x1=12 y1=18 x2=12 y2=18></line></svg><span>Open app to continue'),$e=_t("<div class=zenobia-error>"),Ae=_t('<div class="zenobia-qr-popup-overlay visible"><div class=zenobia-qr-popup-content><button class=zenobia-qr-close><svg viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2><path d="M18 6L6 18M6 6l12 12"></path></svg></button><div class=modal-header><div class=header-content><h3>Pay by bank with Zenobia</h3><p class=subtitle>Scan to complete your purchase</p></div></div><div class=modal-body><div class=payment-amount>$</div><div class=savings-badge></div><div class=payment-status><div class=spinner></div><div class=payment-instructions>'),ze=_t("<div class=qr-code-container id=qrcode-container>"),Oe=_t("<div class=qr-code-container><div class=zenobia-qr-placeholder>");const Me=()=>{if(typeof window>"u")return!1;const n=window.navigator.userAgent.toLowerCase(),s=/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(n),l="ontouchstart"in window||navigator.maxTouchPoints>0,g=window.innerWidth<=768;return s||l&&g},qe=n=>{const[s,l]=mt(null),g={current:null},[m,x]=mt(Mt.PENDING),[S,y]=mt(null),[O,H]=mt(!1),[T,L]=mt(null),[W,Y]=mt(null),[V,U]=mt(!1),[ct,pt]=mt("");Yt(()=>{if(n.isOpen&&!T()){const N=new me(n.isTest);if(L(N),n.transferRequest)Y(n.transferRequest),N.listenToTransfer(n.transferRequest.transferRequestId,n.transferRequest.signature||"",et,nt,ft);else if(n.url){U(!0),y(null);const ot=n.metadata||{amount:n.amount,statementItems:{name:"Payment",amount:n.amount}};N.createTransfer(n.url,ot).then(G=>{Y({transferRequestId:G.transferRequestId,merchantId:G.merchantId,expiry:G.expiry,signature:G.signature}),N.listenToTransfer(G.transferRequestId,G.signature||"",et,nt,ft)}).catch(G=>{y(G instanceof Error?G.message:"An error occurred"),n.onError&&G instanceof Error&&n.onError(G)}).finally(()=>{U(!1)})}else y("No URL provided for creating a new transfer")}}),Yt(()=>{var N;if((N=W())!=null&&N.transferRequestId){const ot=W().transferRequestId.replace(/-/g,"");let dt=`https://zenobiapay.com/clip?id=${btoa(ot).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}`;n.isTest&&(dt+="&type=test"),pt(dt);const Ct=n.qrCodeSize||220,gt=new Se({width:Ct,height:Ct,type:"svg",data:dt,image:void 0,dotsOptions:{color:"#000000",type:"dots"},backgroundOptions:{color:"#ffffff"},cornersSquareOptions:{type:"extra-rounded"},cornersDotOptions:{type:"dot"},qrOptions:{errorCorrectionLevel:"M"}});l(gt),g.current&&(g.current.innerHTML="",gt.append(g.current))}});const et=N=>{console.log("Received status update:",N);let ot;switch(N.status){case"COMPLETED":case"IN_FLIGHT":ot=Mt.COMPLETED,n.onSuccess&&W()&&n.onSuccess(W(),N);const G=T();G&&(G.disconnect(),L(null));break;case"FAILED":ot=Mt.FAILED;const dt=T();dt&&(dt.disconnect(),L(null));break;case"CANCELLED":ot=Mt.CANCELLED;const wt=T();wt&&(wt.disconnect(),L(null));break;default:ot=Mt.PENDING}x(ot),n.onStatusChange&&n.onStatusChange(ot)},nt=N=>{console.error("WebSocket error:",N),y(N)},ft=N=>{console.log("WebSocket connection status:",N?"Connected":"Disconnected"),H(N)};ae(()=>{const N=T();N&&N.disconnect()});const qt=()=>n.discountAmount!==void 0?n.discountAmount:Math.round(n.amount/100),St=()=>{const N=qt();return N<1e3?`✨ ${(N/n.amount*100).toFixed(0)}% cashback applied!`:`✨ Applied $${(N/100).toFixed(2)} cashback!`};return xt(zt,{get when(){return n.isOpen},get children(){var N=Ae(),ot=N.firstChild,G=ot.firstChild,dt=G.nextSibling,wt=dt.firstChild,Ct=wt.firstChild;Ct.nextSibling;var gt=dt.nextSibling,p=gt.firstChild;p.firstChild;var w=p.nextSibling,u=w.nextSibling,e=u.firstChild,t=e.nextSibling;return pe(G,"click",n.onClose),ht(wt,xt(zt,{get when(){return n.isTest},get children(){return Ce()}}),null),ht(gt,xt(zt,{get when(){return kt(()=>!!Me())()&&ct()!==""},get fallback(){return xt(zt,{get when(){return kt(()=>!!s())()&&W()},get fallback(){return(()=>{var o=Oe(),r=o.firstChild;return o.style.setProperty("display","flex"),o.style.setProperty("justify-content","center"),o.style.setProperty("align-items","center"),$t(i=>{var d=n.qrCodeSize?`${n.qrCodeSize}px`:"220px",_=n.qrCodeSize?`${n.qrCodeSize}px`:"220px",v=n.qrCodeSize?`${n.qrCodeSize}px`:"220px",$=n.qrCodeSize?`${n.qrCodeSize}px`:"220px";return d!==i.e&&((i.e=d)!=null?o.style.setProperty("width",d):o.style.removeProperty("width")),_!==i.t&&((i.t=_)!=null?o.style.setProperty("height",_):o.style.removeProperty("height")),v!==i.a&&((i.a=v)!=null?r.style.setProperty("width",v):r.style.removeProperty("width")),$!==i.o&&((i.o=$)!=null?r.style.setProperty("height",$):r.style.removeProperty("height")),i},{e:void 0,t:void 0,a:void 0,o:void 0}),o})()},get children(){var o=ze();return we(r=>{g.current=r;const i=s();i&&r&&(r.innerHTML="",i.append(r))},o),o.style.setProperty("display","flex"),o.style.setProperty("justify-content","center"),o.style.setProperty("align-items","center"),$t(r=>{var i=n.qrCodeSize?`${n.qrCodeSize}px`:"220px",d=n.qrCodeSize?`${n.qrCodeSize}px`:"220px";return i!==r.e&&((r.e=i)!=null?o.style.setProperty("width",i):o.style.removeProperty("width")),d!==r.t&&((r.t=d)!=null?o.style.setProperty("height",d):o.style.removeProperty("height")),r},{e:void 0,t:void 0}),o}})},get children(){var o=ke(),r=o.firstChild;return o.style.setProperty("text-align","center"),o.style.setProperty("margin","20px 0"),r.$$click=()=>window.open(ct(),"_blank"),r.style.setProperty("background-color","#000"),r.style.setProperty("color","#fff"),r.style.setProperty("border","none"),r.style.setProperty("padding","16px 24px"),r.style.setProperty("border-radius","8px"),r.style.setProperty("font-size","16px"),r.style.setProperty("font-weight","500"),r.style.setProperty("cursor","pointer"),r.style.setProperty("display","flex"),r.style.setProperty("align-items","center"),r.style.setProperty("gap","8px"),r.style.setProperty("margin","0 auto"),r.style.setProperty("transition","background-color 0.2s ease"),o}}),p),ht(p,()=>(n.amount/100).toFixed(2),null),ht(w,St),ht(t,(()=>{var o=kt(()=>!!V());return()=>o()?"Preparing payment...":W()?"Waiting for payment":"Creating payment..."})()),ht(gt,xt(zt,{get when(){return S()},get children(){var o=$e();return ht(o,S),o}}),null),N}})};ne(["click"]);const Ie=`
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
`;var Pe=_t("<div class=zenobia-payment-container><style></style><button class=zenobia-payment-button>"),Ee=_t("<div class=button-text-container><div class=initial-text></div><div class=hover-text>"),Mt=(n=>(n.PENDING="PENDING",n.IN_FLIGHT="IN_FLIGHT",n.COMPLETED="COMPLETED",n.FAILED="FAILED",n.CANCELLED="CANCELLED",n))(Mt||{});const De=n=>{const[s,l]=mt("INITIAL"),[g,m]=mt(!1),x=()=>{const O=n.discountAmount||0;return O==0?n.buttonText:O<1e3?`Get ${(O/n.amount*100).toFixed(0)}% cashback`:`Get $${(O/100).toFixed(2)} cashback`},S=()=>{l("QR_EXPANDING"),setTimeout(()=>{l("QR_VISIBLE")},300)},y=()=>{m(!0),l("INITIAL"),setTimeout(()=>{setTimeout(()=>{m(!1)},300)},50)};return(()=>{var O=Pe(),H=O.firstChild,T=H.nextSibling;return ht(H,Ie),T.$$click=S,T.style.setProperty("background-color","black"),ht(T,(()=>{var L=kt(()=>s()!=="INITIAL"&&!g());return()=>L()?n.buttonText||`Pay ${(n.amount/100).toFixed(2)}`:(()=>{var W=Ee(),Y=W.firstChild,V=Y.nextSibling;return ht(Y,x),ht(V,()=>n.buttonText||"Pay with Zenobia"),W})()})()),ht(O,xt(zt,{get when(){return s()==="QR_EXPANDING"||s()==="QR_VISIBLE"},get children(){return xt(qe,{get isOpen(){return s()==="QR_VISIBLE"},onClose:y,get amount(){return n.amount},get discountAmount(){return n.discountAmount},get qrCodeSize(){return n.qrCodeSize},get isTest(){return n.isTest},get url(){return n.url},get metadata(){return n.metadata},get onSuccess(){return n.onSuccess},get onError(){return n.onError},get onStatusChange(){return n.onStatusChange},get hideQrOnMobile(){return n.hideQrOnMobile},get showCashback(){return n.showCashback}})}}),null),$t(L=>{var W=s()!=="INITIAL",Y=!!g(),V=s()!=="INITIAL";return W!==L.e&&T.classList.toggle("modal-open",L.e=W),Y!==L.t&&T.classList.toggle("closing",L.t=Y),V!==L.a&&(T.disabled=L.a=V),L},{e:void 0,t:void 0,a:void 0}),O})()};ne(["click"]);function Be(n){const s=typeof n.target=="string"?document.querySelector(n.target):n.target;if(!s){console.error("[zenobia-pay] target element not found:",n.target);return}ge(()=>xt(De,{get url(){return n.url},get amount(){return n.amount},get metadata(){return n.metadata},get buttonText(){return n.buttonText},get buttonClass(){return n.buttonClass},get qrCodeSize(){return n.qrCodeSize},get onSuccess(){return n.onSuccess},get onError(){return n.onError},get onStatusChange(){return n.onStatusChange}}),s)}window.ZenobiaPay={init:Be}})();
