(function(){"use strict";const Lt={equals:(n,s)=>n===s};let Gt=Jt;const _t=1,Bt=2,Yt={owned:null,cleanups:null,context:null,owner:null};var K=null;let Ht=null,ce=null,J=null,ot=null,wt=null,Tt=0;function de(n,s){const c=J,y=K,_=n.length===0,P=s===void 0?y:s,z=_?Yt:{owned:null,cleanups:null,context:P?P.context:null,owner:P},x=_?n:()=>n(()=>zt(()=>Et(z)));K=z,J=null;try{return Mt(x,!0)}finally{J=c,K=y}}function ut(n,s){s=s?Object.assign({},Lt,s):Lt;const c={value:n,observers:null,observerSlots:null,comparator:s.equals||void 0},y=_=>(typeof _=="function"&&(_=_(c.value)),Vt(c,_));return[Zt.bind(c),y]}function St(n,s,c){const y=Xt(n,s,!1,_t);Ot(y)}function Rt(n,s,c){Gt=ge;const y=Xt(n,s,!1,_t);y.user=!0,wt?wt.push(y):Ot(y)}function bt(n,s,c){c=c?Object.assign({},Lt,c):Lt;const y=Xt(n,s,!0,0);return y.observers=null,y.observerSlots=null,y.comparator=c.equals||void 0,Ot(y),Zt.bind(y)}function zt(n){if(J===null)return n();const s=J;J=null;try{return n()}finally{J=s}}function ue(n){return K===null||(K.cleanups===null?K.cleanups=[n]:K.cleanups.push(n)),n}function Zt(){if(this.sources&&this.state)if(this.state===_t)Ot(this);else{const n=ot;ot=null,Mt(()=>Nt(this),!1),ot=n}if(J){const n=this.observers?this.observers.length:0;J.sources?(J.sources.push(this),J.sourceSlots.push(n)):(J.sources=[this],J.sourceSlots=[n]),this.observers?(this.observers.push(J),this.observerSlots.push(J.sources.length-1)):(this.observers=[J],this.observerSlots=[J.sources.length-1])}return this.value}function Vt(n,s,c){let y=n.value;return(!n.comparator||!n.comparator(y,s))&&(n.value=s,n.observers&&n.observers.length&&Mt(()=>{for(let _=0;_<n.observers.length;_+=1){const P=n.observers[_],z=Ht&&Ht.running;z&&Ht.disposed.has(P),(z?!P.tState:!P.state)&&(P.pure?ot.push(P):wt.push(P),P.observers&&Kt(P)),z||(P.state=_t)}if(ot.length>1e6)throw ot=[],new Error},!1)),s}function Ot(n){if(!n.fn)return;Et(n);const s=Tt;he(n,n.value,s)}function he(n,s,c){let y;const _=K,P=J;J=K=n;try{y=n.fn(s)}catch(z){return n.pure&&(n.state=_t,n.owned&&n.owned.forEach(Et),n.owned=null),n.updatedAt=c+1,te(z)}finally{J=P,K=_}(!n.updatedAt||n.updatedAt<=c)&&(n.updatedAt!=null&&"observers"in n?Vt(n,y):n.value=y,n.updatedAt=c)}function Xt(n,s,c,y=_t,_){const P={fn:n,state:y,updatedAt:null,owned:null,sources:null,sourceSlots:null,cleanups:null,value:s,owner:K,context:K?K.context:null,pure:c};return K===null||K!==Yt&&(K.owned?K.owned.push(P):K.owned=[P]),P}function jt(n){if(n.state===0)return;if(n.state===Bt)return Nt(n);if(n.suspense&&zt(n.suspense.inFallback))return n.suspense.effects.push(n);const s=[n];for(;(n=n.owner)&&(!n.updatedAt||n.updatedAt<Tt);)n.state&&s.push(n);for(let c=s.length-1;c>=0;c--)if(n=s[c],n.state===_t)Ot(n);else if(n.state===Bt){const y=ot;ot=null,Mt(()=>Nt(n,s[0]),!1),ot=y}}function Mt(n,s){if(ot)return n();let c=!1;s||(ot=[]),wt?c=!0:wt=[],Tt++;try{const y=n();return fe(c),y}catch(y){c||(wt=null),ot=null,te(y)}}function fe(n){if(ot&&(Jt(ot),ot=null),n)return;const s=wt;wt=null,s.length&&Mt(()=>Gt(s),!1)}function Jt(n){for(let s=0;s<n.length;s++)jt(n[s])}function ge(n){let s,c=0;for(s=0;s<n.length;s++){const y=n[s];y.user?n[c++]=y:jt(y)}for(s=0;s<c;s++)jt(n[s])}function Nt(n,s){n.state=0;for(let c=0;c<n.sources.length;c+=1){const y=n.sources[c];if(y.sources){const _=y.state;_===_t?y!==s&&(!y.updatedAt||y.updatedAt<Tt)&&jt(y):_===Bt&&Nt(y,s)}}}function Kt(n){for(let s=0;s<n.observers.length;s+=1){const c=n.observers[s];c.state||(c.state=Bt,c.pure?ot.push(c):wt.push(c),c.observers&&Kt(c))}}function Et(n){let s;if(n.sources)for(;n.sources.length;){const c=n.sources.pop(),y=n.sourceSlots.pop(),_=c.observers;if(_&&_.length){const P=_.pop(),z=c.observerSlots.pop();y<_.length&&(P.sourceSlots[z]=y,_[y]=P,c.observerSlots[y]=z)}}if(n.tOwned){for(s=n.tOwned.length-1;s>=0;s--)Et(n.tOwned[s]);delete n.tOwned}if(n.owned){for(s=n.owned.length-1;s>=0;s--)Et(n.owned[s]);n.owned=null}if(n.cleanups){for(s=n.cleanups.length-1;s>=0;s--)n.cleanups[s]();n.cleanups=null}n.state=0}function pe(n){return n instanceof Error?n:new Error(typeof n=="string"?n:"Unknown error",{cause:n})}function te(n,s=K){throw pe(n)}function lt(n,s){return zt(()=>n(s||{}))}const ye=n=>`Stale read from <${n}>.`;function ht(n){const s=n.keyed,c=bt(()=>n.when,void 0,void 0),y=s?c:bt(c,void 0,{equals:(_,P)=>!_==!P});return bt(()=>{const _=y();if(_){const P=n.children;return typeof P=="function"&&P.length>0?zt(()=>P(s?_:()=>{if(!zt(y))throw ye("Show");return c()})):P}return n.fallback},void 0,void 0)}function we(n,s,c){let y=c.length,_=s.length,P=y,z=0,x=0,M=s[_-1].nextSibling,U=null;for(;z<_||x<P;){if(s[z]===c[x]){z++,x++;continue}for(;s[_-1]===c[P-1];)_--,P--;if(_===z){const T=P<y?x?c[x-1].nextSibling:c[P-x]:M;for(;x<P;)n.insertBefore(c[x++],T)}else if(P===x)for(;z<_;)(!U||!U.has(s[z]))&&s[z].remove(),z++;else if(s[z]===c[P-1]&&c[x]===s[_-1]){const T=s[--_].nextSibling;n.insertBefore(c[x++],s[z++].nextSibling),n.insertBefore(c[--P],T),s[_]=c[P]}else{if(!U){U=new Map;let B=x;for(;B<P;)U.set(c[B],B++)}const T=U.get(s[z]);if(T!=null)if(x<T&&T<P){let B=z,X=1,W;for(;++B<_&&B<P&&!((W=U.get(s[B]))==null||W!==T+X);)X++;if(X>T-x){const Y=s[z];for(;x<T;)n.insertBefore(c[x++],Y)}else n.replaceChild(c[x++],s[z++])}else z++;else s[z++].remove()}}}const ee="_$DX_DELEGATE";function be(n,s,c,y={}){let _;return de(P=>{_=P,s===document?n():tt(s,n(),s.firstChild?null:void 0,c)},y.owner),()=>{_(),s.textContent=""}}function ft(n,s,c,y){let _;const P=()=>{const x=document.createElement("template");return x.innerHTML=n,x.content.firstChild},z=()=>(_||(_=P())).cloneNode(!0);return z.cloneNode=z,z}function ne(n,s=window.document){const c=s[ee]||(s[ee]=new Set);for(let y=0,_=n.length;y<_;y++){const P=n[y];c.has(P)||(c.add(P),s.addEventListener(P,ve))}}function me(n,s,c,y){Array.isArray(c)?(n[`$$${s}`]=c[0],n[`$$${s}Data`]=c[1]):n[`$$${s}`]=c}function re(n,s,c){return zt(()=>n(s,c))}function tt(n,s,c,y){if(c!==void 0&&!y&&(y=[]),typeof s!="function")return Ft(n,s,y,c);St(_=>Ft(n,s(),_,c),y)}function ve(n){let s=n.target;const c=`$$${n.type}`,y=n.target,_=n.currentTarget,P=M=>Object.defineProperty(n,"target",{configurable:!0,value:M}),z=()=>{const M=s[c];if(M&&!s.disabled){const U=s[`${c}Data`];if(U!==void 0?M.call(s,U,n):M.call(s,n),n.cancelBubble)return}return s.host&&typeof s.host!="string"&&!s.host._$host&&s.contains(n.target)&&P(s.host),!0},x=()=>{for(;z()&&(s=s._$host||s.parentNode||s.host););};if(Object.defineProperty(n,"currentTarget",{configurable:!0,get(){return s||document}}),n.composedPath){const M=n.composedPath();P(M[0]);for(let U=0;U<M.length-2&&(s=M[U],!!z());U++){if(s._$host){s=s._$host,x();break}if(s.parentNode===_)break}}else x();P(y)}function Ft(n,s,c,y,_){for(;typeof c=="function";)c=c();if(s===c)return c;const P=typeof s,z=y!==void 0;if(n=z&&c[0]&&c[0].parentNode||n,P==="string"||P==="number"){if(P==="number"&&(s=s.toString(),s===c))return c;if(z){let x=c[0];x&&x.nodeType===3?x.data!==s&&(x.data=s):x=document.createTextNode(s),c=At(n,c,y,x)}else c!==""&&typeof c=="string"?c=n.firstChild.data=s:c=n.textContent=s}else if(s==null||P==="boolean")c=At(n,c,y);else{if(P==="function")return St(()=>{let x=s();for(;typeof x=="function";)x=x();c=Ft(n,x,c,y)}),()=>c;if(Array.isArray(s)){const x=[],M=c&&Array.isArray(c);if(Wt(x,s,c,_))return St(()=>c=Ft(n,x,c,y,!0)),()=>c;if(x.length===0){if(c=At(n,c,y),z)return c}else M?c.length===0?oe(n,x,y):we(n,c,x):(c&&At(n),oe(n,x));c=x}else if(s.nodeType){if(Array.isArray(c)){if(z)return c=At(n,c,y,s);At(n,c,null,s)}else c==null||c===""||!n.firstChild?n.appendChild(s):n.replaceChild(s,n.firstChild);c=s}}return c}function Wt(n,s,c,y){let _=!1;for(let P=0,z=s.length;P<z;P++){let x=s[P],M=c&&c[n.length],U;if(!(x==null||x===!0||x===!1))if((U=typeof x)=="object"&&x.nodeType)n.push(x);else if(Array.isArray(x))_=Wt(n,x,M)||_;else if(U==="function")if(y){for(;typeof x=="function";)x=x();_=Wt(n,Array.isArray(x)?x:[x],Array.isArray(M)?M:[M])||_}else n.push(x),_=!0;else{const T=String(x);M&&M.nodeType===3&&M.data===T?n.push(M):n.push(document.createTextNode(T))}}return _}function oe(n,s,c=null){for(let y=0,_=s.length;y<_;y++)n.insertBefore(s[y],c)}function At(n,s,c,y){if(c===void 0)return n.textContent="";const _=y||document.createTextNode("");if(s.length){let P=!1;for(let z=s.length-1;z>=0;z--){const x=s[z];if(_!==x){const M=x.parentNode===n;!P&&!z?M?n.replaceChild(_,x):n.insertBefore(_,c):M&&x.remove()}else P=!0}}else n.insertBefore(_,c);return[_]}class xe{constructor(s=!1){this.socket=null,this.reconnectTimeout=null,this.reconnectAttempts=0,this.maxReconnectAttempts=6,this.transferId=null,this.signature=null,this.onStatusCallback=null,this.onErrorCallback=null,this.onConnectionCallback=null,this.onScanCallback=null,this.wsBaseUrl=s?"transfer-status-test.zenobiapay.com":"transfer-status.zenobiapay.com"}getSignature(){return this.signature}getTransferId(){return this.transferId}async createTransfer(s,c){try{const y=await fetch(s,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(c)});if(!y.ok){const P=await y.json();throw new Error(P.message||"Failed to create transfer request")}const _=await y.json();return this.transferId=_.transferRequestId,this.signature=_.signature,_}catch(y){throw console.error("Error creating transfer request:",y),y instanceof Error?y:new Error("Failed to create transfer request")}}listenToTransfer(s,c,y,_,P,z){this.transferId=s,this.signature=c,y&&(this.onStatusCallback=y),_&&(this.onErrorCallback=_),P&&(this.onConnectionCallback=P),z&&(this.onScanCallback=z),this.connectWebSocket()}async createTransferAndListen(s,c,y,_,P,z){const x=await this.createTransfer(s,c);return this.listenToTransfer(x.transferRequestId,x.signature,y,_,P,z),x}connectWebSocket(){if(this.socket&&(this.socket.close(),this.socket=null,this.notifyConnectionStatus(!1)),!this.transferId||!this.signature){console.error("Cannot connect to WebSocket: Missing transfer ID or signature");return}try{const c=`${window.location.protocol==="https:"?"wss:":"ws:"}//${this.wsBaseUrl}/transfers/${this.transferId}/ws?token=${this.signature}`,y=new WebSocket(c);this.socket=y,y.onopen=()=>{this.notifyConnectionStatus(!0),this.reconnectAttempts=0},y.onclose=_=>{this.notifyConnectionStatus(!1),this.socket=null,_.code!==1e3&&this.reconnectAttempts<this.maxReconnectAttempts&&this.attemptReconnect()},y.onerror=_=>{console.error(`WebSocket error for transfer: ${this.transferId}`,_),this.notifyError("WebSocket error occurred")},y.onmessage=_=>{console.log(`WebSocket message received for transfer: ${this.transferId}`,_.data);try{const P=JSON.parse(_.data);P.type==="status"&&P.transfer?this.notifyStatus(P.transfer):P.type==="error"&&P.message?this.notifyError(P.message):P.type==="scan"?this.notifyScan(P):P.type==="ping"&&y.readyState===WebSocket.OPEN&&y.send(JSON.stringify({type:"pong"}))}catch{this.notifyError("Failed to parse message")}}}catch{this.notifyError("Failed to establish WebSocket connection")}}attemptReconnect(){this.reconnectAttempts++;const s=Math.min(1e3*Math.pow(2,this.reconnectAttempts-1),3e4);console.log(`Attempting to reconnect in ${s}ms (attempt ${this.reconnectAttempts})`),this.reconnectTimeout&&window.clearTimeout(this.reconnectTimeout),this.reconnectTimeout=window.setTimeout(()=>{console.log(`Reconnecting to WebSocket (attempt ${this.reconnectAttempts})...`),this.connectWebSocket()},s)}disconnect(){this.reconnectTimeout&&(window.clearTimeout(this.reconnectTimeout),this.reconnectTimeout=null),this.socket&&this.socket.readyState<2&&(console.log(`Closing WebSocket for transfer: ${this.transferId}`),this.socket.close(),this.socket=null,this.notifyConnectionStatus(!1)),this.transferId=null,this.signature=null}notifyConnectionStatus(s){this.onConnectionCallback&&this.onConnectionCallback(s)}notifyStatus(s){this.onStatusCallback&&this.onStatusCallback(s)}notifyError(s){this.onErrorCallback&&this.onErrorCallback(s)}notifyScan(s){this.onScanCallback&&this.onScanCallback(s)}}function _e(n){return n&&n.__esModule&&Object.prototype.hasOwnProperty.call(n,"default")?n.default:n}var Ut={exports:{}},Se=Ut.exports,ie;function Ce(){return ie||(ie=1,function(n,s){(function(c,y){n.exports=y()})(Se,()=>(()=>{var c={873:(z,x)=>{var M,U,T=function(){var B=function(h,w){var d=h,e=gt[w],t=null,o=0,i=null,r=[],u={},k=function(a,f){t=function(l){for(var p=new Array(l),m=0;m<l;m+=1){p[m]=new Array(l);for(var O=0;O<l;O+=1)p[m][O]=null}return p}(o=4*d+17),S(0,0),S(o-7,0),S(0,o-7),g(),C(),v(a,f),d>=7&&$(a),i==null&&(i=A(d,e,r)),b(i,f)},S=function(a,f){for(var l=-1;l<=7;l+=1)if(!(a+l<=-1||o<=a+l))for(var p=-1;p<=7;p+=1)f+p<=-1||o<=f+p||(t[a+l][f+p]=0<=l&&l<=6&&(p==0||p==6)||0<=p&&p<=6&&(l==0||l==6)||2<=l&&l<=4&&2<=p&&p<=4)},C=function(){for(var a=8;a<o-8;a+=1)t[a][6]==null&&(t[a][6]=a%2==0);for(var f=8;f<o-8;f+=1)t[6][f]==null&&(t[6][f]=f%2==0)},g=function(){for(var a=et.getPatternPosition(d),f=0;f<a.length;f+=1)for(var l=0;l<a.length;l+=1){var p=a[f],m=a[l];if(t[p][m]==null)for(var O=-2;O<=2;O+=1)for(var I=-2;I<=2;I+=1)t[p+O][m+I]=O==-2||O==2||I==-2||I==2||O==0&&I==0}},$=function(a){for(var f=et.getBCHTypeNumber(d),l=0;l<18;l+=1){var p=!a&&(f>>l&1)==1;t[Math.floor(l/3)][l%3+o-8-3]=p}for(l=0;l<18;l+=1)p=!a&&(f>>l&1)==1,t[l%3+o-8-3][Math.floor(l/3)]=p},v=function(a,f){for(var l=e<<3|f,p=et.getBCHTypeInfo(l),m=0;m<15;m+=1){var O=!a&&(p>>m&1)==1;m<6?t[m][8]=O:m<8?t[m+1][8]=O:t[o-15+m][8]=O}for(m=0;m<15;m+=1)O=!a&&(p>>m&1)==1,m<8?t[8][o-m-1]=O:m<9?t[8][15-m-1+1]=O:t[8][15-m-1]=O;t[o-8][8]=!a},b=function(a,f){for(var l=-1,p=o-1,m=7,O=0,I=et.getMaskFunction(f),L=o-1;L>0;L-=2)for(L==6&&(L-=1);;){for(var R=0;R<2;R+=1)if(t[p][L-R]==null){var j=!1;O<a.length&&(j=(a[O]>>>m&1)==1),I(p,L-R)&&(j=!j),t[p][L-R]=j,(m-=1)==-1&&(O+=1,m=7)}if((p+=l)<0||o<=p){p-=l,l=-l;break}}},A=function(a,f,l){for(var p=yt.getRSBlocks(a,f),m=Ct(),O=0;O<l.length;O+=1){var I=l[O];m.put(I.getMode(),4),m.put(I.getLength(),et.getLengthInBits(I.getMode(),a)),I.write(m)}var L=0;for(O=0;O<p.length;O+=1)L+=p[O].dataCount;if(m.getLengthInBits()>8*L)throw"code length overflow. ("+m.getLengthInBits()+">"+8*L+")";for(m.getLengthInBits()+4<=8*L&&m.put(0,4);m.getLengthInBits()%8!=0;)m.putBit(!1);for(;!(m.getLengthInBits()>=8*L||(m.put(236,8),m.getLengthInBits()>=8*L));)m.put(17,8);return function(R,j){for(var Q=0,rt=0,V=0,H=new Array(j.length),N=new Array(j.length),E=0;E<j.length;E+=1){var G=j[E].dataCount,nt=j[E].totalCount-G;rt=Math.max(rt,G),V=Math.max(V,nt),H[E]=new Array(G);for(var D=0;D<H[E].length;D+=1)H[E][D]=255&R.getBuffer()[D+Q];Q+=G;var dt=et.getErrorCorrectPolynomial(nt),at=st(H[E],dt.getLength()-1).mod(dt);for(N[E]=new Array(dt.getLength()-1),D=0;D<N[E].length;D+=1){var it=D+at.getLength()-N[E].length;N[E][D]=it>=0?at.getAt(it):0}}var Qt=0;for(D=0;D<j.length;D+=1)Qt+=j[D].totalCount;var Dt=new Array(Qt),pt=0;for(D=0;D<rt;D+=1)for(E=0;E<j.length;E+=1)D<H[E].length&&(Dt[pt]=H[E][D],pt+=1);for(D=0;D<V;D+=1)for(E=0;E<j.length;E+=1)D<N[E].length&&(Dt[pt]=N[E][D],pt+=1);return Dt}(m,p)};u.addData=function(a,f){var l=null;switch(f=f||"Byte"){case"Numeric":l=mt(a);break;case"Alphanumeric":l=Pt(a);break;case"Byte":l=vt(a);break;case"Kanji":l=kt(a);break;default:throw"mode:"+f}r.push(l),i=null},u.isDark=function(a,f){if(a<0||o<=a||f<0||o<=f)throw a+","+f;return t[a][f]},u.getModuleCount=function(){return o},u.make=function(){if(d<1){for(var a=1;a<40;a++){for(var f=yt.getRSBlocks(a,e),l=Ct(),p=0;p<r.length;p++){var m=r[p];l.put(m.getMode(),4),l.put(m.getLength(),et.getLengthInBits(m.getMode(),a)),m.write(l)}var O=0;for(p=0;p<f.length;p++)O+=f[p].dataCount;if(l.getLengthInBits()<=8*O)break}d=a}k(!1,function(){for(var I=0,L=0,R=0;R<8;R+=1){k(!0,R);var j=et.getLostPoint(u);(R==0||I>j)&&(I=j,L=R)}return L}())},u.createTableTag=function(a,f){a=a||2;var l="";l+='<table style="',l+=" border-width: 0px; border-style: none;",l+=" border-collapse: collapse;",l+=" padding: 0px; margin: "+(f=f===void 0?4*a:f)+"px;",l+='">',l+="<tbody>";for(var p=0;p<u.getModuleCount();p+=1){l+="<tr>";for(var m=0;m<u.getModuleCount();m+=1)l+='<td style="',l+=" border-width: 0px; border-style: none;",l+=" border-collapse: collapse;",l+=" padding: 0px; margin: 0px;",l+=" width: "+a+"px;",l+=" height: "+a+"px;",l+=" background-color: ",l+=u.isDark(p,m)?"#000000":"#ffffff",l+=";",l+='"/>';l+="</tr>"}return(l+="</tbody>")+"</table>"},u.createSvgTag=function(a,f,l,p){var m={};typeof arguments[0]=="object"&&(a=(m=arguments[0]).cellSize,f=m.margin,l=m.alt,p=m.title),a=a||2,f=f===void 0?4*a:f,(l=typeof l=="string"?{text:l}:l||{}).text=l.text||null,l.id=l.text?l.id||"qrcode-description":null,(p=typeof p=="string"?{text:p}:p||{}).text=p.text||null,p.id=p.text?p.id||"qrcode-title":null;var O,I,L,R,j=u.getModuleCount()*a+2*f,Q="";for(R="l"+a+",0 0,"+a+" -"+a+",0 0,-"+a+"z ",Q+='<svg version="1.1" xmlns="http://www.w3.org/2000/svg"',Q+=m.scalable?"":' width="'+j+'px" height="'+j+'px"',Q+=' viewBox="0 0 '+j+" "+j+'" ',Q+=' preserveAspectRatio="xMinYMin meet"',Q+=p.text||l.text?' role="img" aria-labelledby="'+q([p.id,l.id].join(" ").trim())+'"':"",Q+=">",Q+=p.text?'<title id="'+q(p.id)+'">'+q(p.text)+"</title>":"",Q+=l.text?'<description id="'+q(l.id)+'">'+q(l.text)+"</description>":"",Q+='<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>',Q+='<path d="',I=0;I<u.getModuleCount();I+=1)for(L=I*a+f,O=0;O<u.getModuleCount();O+=1)u.isDark(I,O)&&(Q+="M"+(O*a+f)+","+L+R);return(Q+='" stroke="transparent" fill="black"/>')+"</svg>"},u.createDataURL=function(a,f){a=a||2,f=f===void 0?4*a:f;var l=u.getModuleCount()*a+2*f,p=f,m=l-f;return xt(l,l,function(O,I){if(p<=O&&O<m&&p<=I&&I<m){var L=Math.floor((O-p)/a),R=Math.floor((I-p)/a);return u.isDark(R,L)?0:1}return 1})},u.createImgTag=function(a,f,l){a=a||2,f=f===void 0?4*a:f;var p=u.getModuleCount()*a+2*f,m="";return m+="<img",m+=' src="',m+=u.createDataURL(a,f),m+='"',m+=' width="',m+=p,m+='"',m+=' height="',m+=p,m+='"',l&&(m+=' alt="',m+=q(l),m+='"'),m+"/>"};var q=function(a){for(var f="",l=0;l<a.length;l+=1){var p=a.charAt(l);switch(p){case"<":f+="&lt;";break;case">":f+="&gt;";break;case"&":f+="&amp;";break;case'"':f+="&quot;";break;default:f+=p}}return f};return u.createASCII=function(a,f){if((a=a||1)<2)return function(H){H=H===void 0?2:H;var N,E,G,nt,D,dt=1*u.getModuleCount()+2*H,at=H,it=dt-H,Qt={"██":"█","█ ":"▀"," █":"▄","  ":" "},Dt={"██":"▀","█ ":"▀"," █":" ","  ":" "},pt="";for(N=0;N<dt;N+=2){for(G=Math.floor((N-at)/1),nt=Math.floor((N+1-at)/1),E=0;E<dt;E+=1)D="█",at<=E&&E<it&&at<=N&&N<it&&u.isDark(G,Math.floor((E-at)/1))&&(D=" "),at<=E&&E<it&&at<=N+1&&N+1<it&&u.isDark(nt,Math.floor((E-at)/1))?D+=" ":D+="█",pt+=H<1&&N+1>=it?Dt[D]:Qt[D];pt+=`
`}return dt%2&&H>0?pt.substring(0,pt.length-dt-1)+Array(dt+1).join("▀"):pt.substring(0,pt.length-1)}(f);a-=1,f=f===void 0?2*a:f;var l,p,m,O,I=u.getModuleCount()*a+2*f,L=f,R=I-f,j=Array(a+1).join("██"),Q=Array(a+1).join("  "),rt="",V="";for(l=0;l<I;l+=1){for(m=Math.floor((l-L)/a),V="",p=0;p<I;p+=1)O=1,L<=p&&p<R&&L<=l&&l<R&&u.isDark(m,Math.floor((p-L)/a))&&(O=0),V+=O?j:Q;for(m=0;m<a;m+=1)rt+=V+`
`}return rt.substring(0,rt.length-1)},u.renderTo2dContext=function(a,f){f=f||2;for(var l=u.getModuleCount(),p=0;p<l;p++)for(var m=0;m<l;m++)a.fillStyle=u.isDark(p,m)?"black":"white",a.fillRect(p*f,m*f,f,f)},u};B.stringToBytes=(B.stringToBytesFuncs={default:function(h){for(var w=[],d=0;d<h.length;d+=1){var e=h.charCodeAt(d);w.push(255&e)}return w}}).default,B.createStringToBytes=function(h,w){var d=function(){for(var t=It(h),o=function(){var C=t.read();if(C==-1)throw"eof";return C},i=0,r={};;){var u=t.read();if(u==-1)break;var k=o(),S=o()<<8|o();r[String.fromCharCode(u<<8|k)]=S,i+=1}if(i!=w)throw i+" != "+w;return r}(),e=63;return function(t){for(var o=[],i=0;i<t.length;i+=1){var r=t.charCodeAt(i);if(r<128)o.push(r);else{var u=d[t.charAt(i)];typeof u=="number"?(255&u)==u?o.push(u):(o.push(u>>>8),o.push(255&u)):o.push(e)}}return o}};var X,W,Y,F,ct,gt={L:1,M:0,Q:3,H:2},et=(X=[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],W=1335,Y=7973,ct=function(h){for(var w=0;h!=0;)w+=1,h>>>=1;return w},(F={}).getBCHTypeInfo=function(h){for(var w=h<<10;ct(w)-ct(W)>=0;)w^=W<<ct(w)-ct(W);return 21522^(h<<10|w)},F.getBCHTypeNumber=function(h){for(var w=h<<12;ct(w)-ct(Y)>=0;)w^=Y<<ct(w)-ct(Y);return h<<12|w},F.getPatternPosition=function(h){return X[h-1]},F.getMaskFunction=function(h){switch(h){case 0:return function(w,d){return(w+d)%2==0};case 1:return function(w,d){return w%2==0};case 2:return function(w,d){return d%3==0};case 3:return function(w,d){return(w+d)%3==0};case 4:return function(w,d){return(Math.floor(w/2)+Math.floor(d/3))%2==0};case 5:return function(w,d){return w*d%2+w*d%3==0};case 6:return function(w,d){return(w*d%2+w*d%3)%2==0};case 7:return function(w,d){return(w*d%3+(w+d)%2)%2==0};default:throw"bad maskPattern:"+h}},F.getErrorCorrectPolynomial=function(h){for(var w=st([1],0),d=0;d<h;d+=1)w=w.multiply(st([1,Z.gexp(d)],0));return w},F.getLengthInBits=function(h,w){if(1<=w&&w<10)switch(h){case 1:return 10;case 2:return 9;case 4:case 8:return 8;default:throw"mode:"+h}else if(w<27)switch(h){case 1:return 12;case 2:return 11;case 4:return 16;case 8:return 10;default:throw"mode:"+h}else{if(!(w<41))throw"type:"+w;switch(h){case 1:return 14;case 2:return 13;case 4:return 16;case 8:return 12;default:throw"mode:"+h}}},F.getLostPoint=function(h){for(var w=h.getModuleCount(),d=0,e=0;e<w;e+=1)for(var t=0;t<w;t+=1){for(var o=0,i=h.isDark(e,t),r=-1;r<=1;r+=1)if(!(e+r<0||w<=e+r))for(var u=-1;u<=1;u+=1)t+u<0||w<=t+u||r==0&&u==0||i==h.isDark(e+r,t+u)&&(o+=1);o>5&&(d+=3+o-5)}for(e=0;e<w-1;e+=1)for(t=0;t<w-1;t+=1){var k=0;h.isDark(e,t)&&(k+=1),h.isDark(e+1,t)&&(k+=1),h.isDark(e,t+1)&&(k+=1),h.isDark(e+1,t+1)&&(k+=1),k!=0&&k!=4||(d+=3)}for(e=0;e<w;e+=1)for(t=0;t<w-6;t+=1)h.isDark(e,t)&&!h.isDark(e,t+1)&&h.isDark(e,t+2)&&h.isDark(e,t+3)&&h.isDark(e,t+4)&&!h.isDark(e,t+5)&&h.isDark(e,t+6)&&(d+=40);for(t=0;t<w;t+=1)for(e=0;e<w-6;e+=1)h.isDark(e,t)&&!h.isDark(e+1,t)&&h.isDark(e+2,t)&&h.isDark(e+3,t)&&h.isDark(e+4,t)&&!h.isDark(e+5,t)&&h.isDark(e+6,t)&&(d+=40);var S=0;for(t=0;t<w;t+=1)for(e=0;e<w;e+=1)h.isDark(e,t)&&(S+=1);return d+Math.abs(100*S/w/w-50)/5*10},F),Z=function(){for(var h=new Array(256),w=new Array(256),d=0;d<8;d+=1)h[d]=1<<d;for(d=8;d<256;d+=1)h[d]=h[d-4]^h[d-5]^h[d-6]^h[d-8];for(d=0;d<255;d+=1)w[h[d]]=d;return{glog:function(e){if(e<1)throw"glog("+e+")";return w[e]},gexp:function(e){for(;e<0;)e+=255;for(;e>=256;)e-=255;return h[e]}}}();function st(h,w){if(h.length===void 0)throw h.length+"/"+w;var d=function(){for(var t=0;t<h.length&&h[t]==0;)t+=1;for(var o=new Array(h.length-t+w),i=0;i<h.length-t;i+=1)o[i]=h[i+t];return o}(),e={getAt:function(t){return d[t]},getLength:function(){return d.length},multiply:function(t){for(var o=new Array(e.getLength()+t.getLength()-1),i=0;i<e.getLength();i+=1)for(var r=0;r<t.getLength();r+=1)o[i+r]^=Z.gexp(Z.glog(e.getAt(i))+Z.glog(t.getAt(r)));return st(o,0)},mod:function(t){if(e.getLength()-t.getLength()<0)return e;for(var o=Z.glog(e.getAt(0))-Z.glog(t.getAt(0)),i=new Array(e.getLength()),r=0;r<e.getLength();r+=1)i[r]=e.getAt(r);for(r=0;r<t.getLength();r+=1)i[r]^=Z.gexp(Z.glog(t.getAt(r))+o);return st(i,0).mod(t)}};return e}var yt=function(){var h=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12,7,37,13],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]],w=function(e,t){var o={};return o.totalCount=e,o.dataCount=t,o},d={getRSBlocks:function(e,t){var o=function($,v){switch(v){case gt.L:return h[4*($-1)+0];case gt.M:return h[4*($-1)+1];case gt.Q:return h[4*($-1)+2];case gt.H:return h[4*($-1)+3];default:return}}(e,t);if(o===void 0)throw"bad rs block @ typeNumber:"+e+"/errorCorrectionLevel:"+t;for(var i=o.length/3,r=[],u=0;u<i;u+=1)for(var k=o[3*u+0],S=o[3*u+1],C=o[3*u+2],g=0;g<k;g+=1)r.push(w(S,C));return r}};return d}(),Ct=function(){var h=[],w=0,d={getBuffer:function(){return h},getAt:function(e){var t=Math.floor(e/8);return(h[t]>>>7-e%8&1)==1},put:function(e,t){for(var o=0;o<t;o+=1)d.putBit((e>>>t-o-1&1)==1)},getLengthInBits:function(){return w},putBit:function(e){var t=Math.floor(w/8);h.length<=t&&h.push(0),e&&(h[t]|=128>>>w%8),w+=1}};return d},mt=function(h){var w=h,d={getMode:function(){return 1},getLength:function(o){return w.length},write:function(o){for(var i=w,r=0;r+2<i.length;)o.put(e(i.substring(r,r+3)),10),r+=3;r<i.length&&(i.length-r==1?o.put(e(i.substring(r,r+1)),4):i.length-r==2&&o.put(e(i.substring(r,r+2)),7))}},e=function(o){for(var i=0,r=0;r<o.length;r+=1)i=10*i+t(o.charAt(r));return i},t=function(o){if("0"<=o&&o<="9")return o.charCodeAt(0)-48;throw"illegal char :"+o};return d},Pt=function(h){var w=h,d={getMode:function(){return 2},getLength:function(t){return w.length},write:function(t){for(var o=w,i=0;i+1<o.length;)t.put(45*e(o.charAt(i))+e(o.charAt(i+1)),11),i+=2;i<o.length&&t.put(e(o.charAt(i)),6)}},e=function(t){if("0"<=t&&t<="9")return t.charCodeAt(0)-48;if("A"<=t&&t<="Z")return t.charCodeAt(0)-65+10;switch(t){case" ":return 36;case"$":return 37;case"%":return 38;case"*":return 39;case"+":return 40;case"-":return 41;case".":return 42;case"/":return 43;case":":return 44;default:throw"illegal char :"+t}};return d},vt=function(h){var w=B.stringToBytes(h);return{getMode:function(){return 4},getLength:function(d){return w.length},write:function(d){for(var e=0;e<w.length;e+=1)d.put(w[e],8)}}},kt=function(h){var w=B.stringToBytesFuncs.SJIS;if(!w)throw"sjis not supported.";(function(){var t=w("友");if(t.length!=2||(t[0]<<8|t[1])!=38726)throw"sjis not supported."})();var d=w(h),e={getMode:function(){return 8},getLength:function(t){return~~(d.length/2)},write:function(t){for(var o=d,i=0;i+1<o.length;){var r=(255&o[i])<<8|255&o[i+1];if(33088<=r&&r<=40956)r-=33088;else{if(!(57408<=r&&r<=60351))throw"illegal char at "+(i+1)+"/"+r;r-=49472}r=192*(r>>>8&255)+(255&r),t.put(r,13),i+=2}if(i<o.length)throw"illegal char at "+(i+1)}};return e},$t=function(){var h=[],w={writeByte:function(d){h.push(255&d)},writeShort:function(d){w.writeByte(d),w.writeByte(d>>>8)},writeBytes:function(d,e,t){e=e||0,t=t||d.length;for(var o=0;o<t;o+=1)w.writeByte(d[o+e])},writeString:function(d){for(var e=0;e<d.length;e+=1)w.writeByte(d.charCodeAt(e))},toByteArray:function(){return h},toString:function(){var d="";d+="[";for(var e=0;e<h.length;e+=1)e>0&&(d+=","),d+=h[e];return d+"]"}};return w},It=function(h){var w=h,d=0,e=0,t=0,o={read:function(){for(;t<8;){if(d>=w.length){if(t==0)return-1;throw"unexpected end of file./"+t}var r=w.charAt(d);if(d+=1,r=="=")return t=0,-1;r.match(/^\s$/)||(e=e<<6|i(r.charCodeAt(0)),t+=6)}var u=e>>>t-8&255;return t-=8,u}},i=function(r){if(65<=r&&r<=90)return r-65;if(97<=r&&r<=122)return r-97+26;if(48<=r&&r<=57)return r-48+52;if(r==43)return 62;if(r==47)return 63;throw"c:"+r};return o},xt=function(h,w,d){for(var e=function(S,C){var g=S,$=C,v=new Array(S*C),b={setPixel:function(a,f,l){v[f*g+a]=l},write:function(a){a.writeString("GIF87a"),a.writeShort(g),a.writeShort($),a.writeByte(128),a.writeByte(0),a.writeByte(0),a.writeByte(0),a.writeByte(0),a.writeByte(0),a.writeByte(255),a.writeByte(255),a.writeByte(255),a.writeString(","),a.writeShort(0),a.writeShort(0),a.writeShort(g),a.writeShort($),a.writeByte(0);var f=A(2);a.writeByte(2);for(var l=0;f.length-l>255;)a.writeByte(255),a.writeBytes(f,l,255),l+=255;a.writeByte(f.length-l),a.writeBytes(f,l,f.length-l),a.writeByte(0),a.writeString(";")}},A=function(a){for(var f=1<<a,l=1+(1<<a),p=a+1,m=q(),O=0;O<f;O+=1)m.add(String.fromCharCode(O));m.add(String.fromCharCode(f)),m.add(String.fromCharCode(l));var I,L,R,j=$t(),Q=(I=j,L=0,R=0,{write:function(N,E){if(N>>>E)throw"length over";for(;L+E>=8;)I.writeByte(255&(N<<L|R)),E-=8-L,N>>>=8-L,R=0,L=0;R|=N<<L,L+=E},flush:function(){L>0&&I.writeByte(R)}});Q.write(f,p);var rt=0,V=String.fromCharCode(v[rt]);for(rt+=1;rt<v.length;){var H=String.fromCharCode(v[rt]);rt+=1,m.contains(V+H)?V+=H:(Q.write(m.indexOf(V),p),m.size()<4095&&(m.size()==1<<p&&(p+=1),m.add(V+H)),V=H)}return Q.write(m.indexOf(V),p),Q.write(l,p),Q.flush(),j.toByteArray()},q=function(){var a={},f=0,l={add:function(p){if(l.contains(p))throw"dup key:"+p;a[p]=f,f+=1},size:function(){return f},indexOf:function(p){return a[p]},contains:function(p){return a[p]!==void 0}};return l};return b}(h,w),t=0;t<w;t+=1)for(var o=0;o<h;o+=1)e.setPixel(o,t,d(o,t));var i=$t();e.write(i);for(var r=function(){var S=0,C=0,g=0,$="",v={},b=function(q){$+=String.fromCharCode(A(63&q))},A=function(q){if(!(q<0)){if(q<26)return 65+q;if(q<52)return q-26+97;if(q<62)return q-52+48;if(q==62)return 43;if(q==63)return 47}throw"n:"+q};return v.writeByte=function(q){for(S=S<<8|255&q,C+=8,g+=1;C>=6;)b(S>>>C-6),C-=6},v.flush=function(){if(C>0&&(b(S<<6-C),S=0,C=0),g%3!=0)for(var q=3-g%3,a=0;a<q;a+=1)$+="="},v.toString=function(){return $},v}(),u=i.toByteArray(),k=0;k<u.length;k+=1)r.writeByte(u[k]);return r.flush(),"data:image/gif;base64,"+r};return B}();T.stringToBytesFuncs["UTF-8"]=function(B){return function(X){for(var W=[],Y=0;Y<X.length;Y++){var F=X.charCodeAt(Y);F<128?W.push(F):F<2048?W.push(192|F>>6,128|63&F):F<55296||F>=57344?W.push(224|F>>12,128|F>>6&63,128|63&F):(Y++,F=65536+((1023&F)<<10|1023&X.charCodeAt(Y)),W.push(240|F>>18,128|F>>12&63,128|F>>6&63,128|63&F))}return W}(B)},(U=typeof(M=function(){return T})=="function"?M.apply(x,[]):M)===void 0||(z.exports=U)}},y={};function _(z){var x=y[z];if(x!==void 0)return x.exports;var M=y[z]={exports:{}};return c[z](M,M.exports,_),M.exports}_.n=z=>{var x=z&&z.__esModule?()=>z.default:()=>z;return _.d(x,{a:x}),x},_.d=(z,x)=>{for(var M in x)_.o(x,M)&&!_.o(z,M)&&Object.defineProperty(z,M,{enumerable:!0,get:x[M]})},_.o=(z,x)=>Object.prototype.hasOwnProperty.call(z,x);var P={};return(()=>{_.d(P,{default:()=>w});const z=d=>!!d&&typeof d=="object"&&!Array.isArray(d);function x(d,...e){if(!e.length)return d;const t=e.shift();return t!==void 0&&z(d)&&z(t)?(d=Object.assign({},d),Object.keys(t).forEach(o=>{const i=d[o],r=t[o];Array.isArray(i)&&Array.isArray(r)?d[o]=r:z(i)&&z(r)?d[o]=x(Object.assign({},i),r):d[o]=r}),x(d,...e)):d}function M(d,e){const t=document.createElement("a");t.download=e,t.href=d,document.body.appendChild(t),t.click(),document.body.removeChild(t)}const U={L:.07,M:.15,Q:.25,H:.3};class T{constructor({svg:e,type:t,window:o}){this._svg=e,this._type=t,this._window=o}draw(e,t,o,i){let r;switch(this._type){case"dots":r=this._drawDot;break;case"classy":r=this._drawClassy;break;case"classy-rounded":r=this._drawClassyRounded;break;case"rounded":r=this._drawRounded;break;case"extra-rounded":r=this._drawExtraRounded;break;default:r=this._drawSquare}r.call(this,{x:e,y:t,size:o,getNeighbor:i})}_rotateFigure({x:e,y:t,size:o,rotation:i=0,draw:r}){var u;const k=e+o/2,S=t+o/2;r(),(u=this._element)===null||u===void 0||u.setAttribute("transform",`rotate(${180*i/Math.PI},${k},${S})`)}_basicDot(e){const{size:t,x:o,y:i}=e;this._rotateFigure(Object.assign(Object.assign({},e),{draw:()=>{this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","circle"),this._element.setAttribute("cx",String(o+t/2)),this._element.setAttribute("cy",String(i+t/2)),this._element.setAttribute("r",String(t/2))}}))}_basicSquare(e){const{size:t,x:o,y:i}=e;this._rotateFigure(Object.assign(Object.assign({},e),{draw:()=>{this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","rect"),this._element.setAttribute("x",String(o)),this._element.setAttribute("y",String(i)),this._element.setAttribute("width",String(t)),this._element.setAttribute("height",String(t))}}))}_basicSideRounded(e){const{size:t,x:o,y:i}=e;this._rotateFigure(Object.assign(Object.assign({},e),{draw:()=>{this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","path"),this._element.setAttribute("d",`M ${o} ${i}v ${t}h `+t/2+`a ${t/2} ${t/2}, 0, 0, 0, 0 ${-t}`)}}))}_basicCornerRounded(e){const{size:t,x:o,y:i}=e;this._rotateFigure(Object.assign(Object.assign({},e),{draw:()=>{this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","path"),this._element.setAttribute("d",`M ${o} ${i}v ${t}h ${t}v `+-t/2+`a ${t/2} ${t/2}, 0, 0, 0, ${-t/2} ${-t/2}`)}}))}_basicCornerExtraRounded(e){const{size:t,x:o,y:i}=e;this._rotateFigure(Object.assign(Object.assign({},e),{draw:()=>{this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","path"),this._element.setAttribute("d",`M ${o} ${i}v ${t}h ${t}a ${t} ${t}, 0, 0, 0, ${-t} ${-t}`)}}))}_basicCornersRounded(e){const{size:t,x:o,y:i}=e;this._rotateFigure(Object.assign(Object.assign({},e),{draw:()=>{this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","path"),this._element.setAttribute("d",`M ${o} ${i}v `+t/2+`a ${t/2} ${t/2}, 0, 0, 0, ${t/2} ${t/2}h `+t/2+"v "+-t/2+`a ${t/2} ${t/2}, 0, 0, 0, ${-t/2} ${-t/2}`)}}))}_drawDot({x:e,y:t,size:o}){this._basicDot({x:e,y:t,size:o,rotation:0})}_drawSquare({x:e,y:t,size:o}){this._basicSquare({x:e,y:t,size:o,rotation:0})}_drawRounded({x:e,y:t,size:o,getNeighbor:i}){const r=i?+i(-1,0):0,u=i?+i(1,0):0,k=i?+i(0,-1):0,S=i?+i(0,1):0,C=r+u+k+S;if(C!==0)if(C>2||r&&u||k&&S)this._basicSquare({x:e,y:t,size:o,rotation:0});else{if(C===2){let g=0;return r&&k?g=Math.PI/2:k&&u?g=Math.PI:u&&S&&(g=-Math.PI/2),void this._basicCornerRounded({x:e,y:t,size:o,rotation:g})}if(C===1){let g=0;return k?g=Math.PI/2:u?g=Math.PI:S&&(g=-Math.PI/2),void this._basicSideRounded({x:e,y:t,size:o,rotation:g})}}else this._basicDot({x:e,y:t,size:o,rotation:0})}_drawExtraRounded({x:e,y:t,size:o,getNeighbor:i}){const r=i?+i(-1,0):0,u=i?+i(1,0):0,k=i?+i(0,-1):0,S=i?+i(0,1):0,C=r+u+k+S;if(C!==0)if(C>2||r&&u||k&&S)this._basicSquare({x:e,y:t,size:o,rotation:0});else{if(C===2){let g=0;return r&&k?g=Math.PI/2:k&&u?g=Math.PI:u&&S&&(g=-Math.PI/2),void this._basicCornerExtraRounded({x:e,y:t,size:o,rotation:g})}if(C===1){let g=0;return k?g=Math.PI/2:u?g=Math.PI:S&&(g=-Math.PI/2),void this._basicSideRounded({x:e,y:t,size:o,rotation:g})}}else this._basicDot({x:e,y:t,size:o,rotation:0})}_drawClassy({x:e,y:t,size:o,getNeighbor:i}){const r=i?+i(-1,0):0,u=i?+i(1,0):0,k=i?+i(0,-1):0,S=i?+i(0,1):0;r+u+k+S!==0?r||k?u||S?this._basicSquare({x:e,y:t,size:o,rotation:0}):this._basicCornerRounded({x:e,y:t,size:o,rotation:Math.PI/2}):this._basicCornerRounded({x:e,y:t,size:o,rotation:-Math.PI/2}):this._basicCornersRounded({x:e,y:t,size:o,rotation:Math.PI/2})}_drawClassyRounded({x:e,y:t,size:o,getNeighbor:i}){const r=i?+i(-1,0):0,u=i?+i(1,0):0,k=i?+i(0,-1):0,S=i?+i(0,1):0;r+u+k+S!==0?r||k?u||S?this._basicSquare({x:e,y:t,size:o,rotation:0}):this._basicCornerExtraRounded({x:e,y:t,size:o,rotation:Math.PI/2}):this._basicCornerExtraRounded({x:e,y:t,size:o,rotation:-Math.PI/2}):this._basicCornersRounded({x:e,y:t,size:o,rotation:Math.PI/2})}}const B={dot:"dot",square:"square",extraRounded:"extra-rounded"},X=Object.values(B);class W{constructor({svg:e,type:t,window:o}){this._svg=e,this._type=t,this._window=o}draw(e,t,o,i){let r;switch(this._type){case B.square:r=this._drawSquare;break;case B.extraRounded:r=this._drawExtraRounded;break;default:r=this._drawDot}r.call(this,{x:e,y:t,size:o,rotation:i})}_rotateFigure({x:e,y:t,size:o,rotation:i=0,draw:r}){var u;const k=e+o/2,S=t+o/2;r(),(u=this._element)===null||u===void 0||u.setAttribute("transform",`rotate(${180*i/Math.PI},${k},${S})`)}_basicDot(e){const{size:t,x:o,y:i}=e,r=t/7;this._rotateFigure(Object.assign(Object.assign({},e),{draw:()=>{this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","path"),this._element.setAttribute("clip-rule","evenodd"),this._element.setAttribute("d",`M ${o+t/2} ${i}a ${t/2} ${t/2} 0 1 0 0.1 0zm 0 ${r}a ${t/2-r} ${t/2-r} 0 1 1 -0.1 0Z`)}}))}_basicSquare(e){const{size:t,x:o,y:i}=e,r=t/7;this._rotateFigure(Object.assign(Object.assign({},e),{draw:()=>{this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","path"),this._element.setAttribute("clip-rule","evenodd"),this._element.setAttribute("d",`M ${o} ${i}v ${t}h ${t}v `+-t+`zM ${o+r} ${i+r}h `+(t-2*r)+"v "+(t-2*r)+"h "+(2*r-t)+"z")}}))}_basicExtraRounded(e){const{size:t,x:o,y:i}=e,r=t/7;this._rotateFigure(Object.assign(Object.assign({},e),{draw:()=>{this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","path"),this._element.setAttribute("clip-rule","evenodd"),this._element.setAttribute("d",`M ${o} ${i+2.5*r}v `+2*r+`a ${2.5*r} ${2.5*r}, 0, 0, 0, ${2.5*r} ${2.5*r}h `+2*r+`a ${2.5*r} ${2.5*r}, 0, 0, 0, ${2.5*r} ${2.5*-r}v `+-2*r+`a ${2.5*r} ${2.5*r}, 0, 0, 0, ${2.5*-r} ${2.5*-r}h `+-2*r+`a ${2.5*r} ${2.5*r}, 0, 0, 0, ${2.5*-r} ${2.5*r}M ${o+2.5*r} ${i+r}h `+2*r+`a ${1.5*r} ${1.5*r}, 0, 0, 1, ${1.5*r} ${1.5*r}v `+2*r+`a ${1.5*r} ${1.5*r}, 0, 0, 1, ${1.5*-r} ${1.5*r}h `+-2*r+`a ${1.5*r} ${1.5*r}, 0, 0, 1, ${1.5*-r} ${1.5*-r}v `+-2*r+`a ${1.5*r} ${1.5*r}, 0, 0, 1, ${1.5*r} ${1.5*-r}`)}}))}_drawDot({x:e,y:t,size:o,rotation:i}){this._basicDot({x:e,y:t,size:o,rotation:i})}_drawSquare({x:e,y:t,size:o,rotation:i}){this._basicSquare({x:e,y:t,size:o,rotation:i})}_drawExtraRounded({x:e,y:t,size:o,rotation:i}){this._basicExtraRounded({x:e,y:t,size:o,rotation:i})}}const Y={dot:"dot",square:"square"},F=Object.values(Y);class ct{constructor({svg:e,type:t,window:o}){this._svg=e,this._type=t,this._window=o}draw(e,t,o,i){let r;r=this._type===Y.square?this._drawSquare:this._drawDot,r.call(this,{x:e,y:t,size:o,rotation:i})}_rotateFigure({x:e,y:t,size:o,rotation:i=0,draw:r}){var u;const k=e+o/2,S=t+o/2;r(),(u=this._element)===null||u===void 0||u.setAttribute("transform",`rotate(${180*i/Math.PI},${k},${S})`)}_basicDot(e){const{size:t,x:o,y:i}=e;this._rotateFigure(Object.assign(Object.assign({},e),{draw:()=>{this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","circle"),this._element.setAttribute("cx",String(o+t/2)),this._element.setAttribute("cy",String(i+t/2)),this._element.setAttribute("r",String(t/2))}}))}_basicSquare(e){const{size:t,x:o,y:i}=e;this._rotateFigure(Object.assign(Object.assign({},e),{draw:()=>{this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","rect"),this._element.setAttribute("x",String(o)),this._element.setAttribute("y",String(i)),this._element.setAttribute("width",String(t)),this._element.setAttribute("height",String(t))}}))}_drawDot({x:e,y:t,size:o,rotation:i}){this._basicDot({x:e,y:t,size:o,rotation:i})}_drawSquare({x:e,y:t,size:o,rotation:i}){this._basicSquare({x:e,y:t,size:o,rotation:i})}}const gt="circle",et=[[1,1,1,1,1,1,1],[1,0,0,0,0,0,1],[1,0,0,0,0,0,1],[1,0,0,0,0,0,1],[1,0,0,0,0,0,1],[1,0,0,0,0,0,1],[1,1,1,1,1,1,1]],Z=[[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,1,1,1,0,0],[0,0,1,1,1,0,0],[0,0,1,1,1,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0]];class st{constructor(e,t){this._roundSize=o=>this._options.dotsOptions.roundSize?Math.floor(o):o,this._window=t,this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","svg"),this._element.setAttribute("width",String(e.width)),this._element.setAttribute("height",String(e.height)),this._element.setAttribute("xmlns:xlink","http://www.w3.org/1999/xlink"),e.dotsOptions.roundSize||this._element.setAttribute("shape-rendering","crispEdges"),this._element.setAttribute("viewBox",`0 0 ${e.width} ${e.height}`),this._defs=this._window.document.createElementNS("http://www.w3.org/2000/svg","defs"),this._element.appendChild(this._defs),this._imageUri=e.image,this._instanceId=st.instanceCount++,this._options=e}get width(){return this._options.width}get height(){return this._options.height}getElement(){return this._element}async drawQR(e){const t=e.getModuleCount(),o=Math.min(this._options.width,this._options.height)-2*this._options.margin,i=this._options.shape===gt?o/Math.sqrt(2):o,r=this._roundSize(i/t);let u={hideXDots:0,hideYDots:0,width:0,height:0};if(this._qr=e,this._options.image){if(await this.loadImage(),!this._image)return;const{imageOptions:k,qrOptions:S}=this._options,C=k.imageSize*U[S.errorCorrectionLevel],g=Math.floor(C*t*t);u=function({originalHeight:$,originalWidth:v,maxHiddenDots:b,maxHiddenAxisDots:A,dotSize:q}){const a={x:0,y:0},f={x:0,y:0};if($<=0||v<=0||b<=0||q<=0)return{height:0,width:0,hideYDots:0,hideXDots:0};const l=$/v;return a.x=Math.floor(Math.sqrt(b/l)),a.x<=0&&(a.x=1),A&&A<a.x&&(a.x=A),a.x%2==0&&a.x--,f.x=a.x*q,a.y=1+2*Math.ceil((a.x*l-1)/2),f.y=Math.round(f.x*l),(a.y*a.x>b||A&&A<a.y)&&(A&&A<a.y?(a.y=A,a.y%2==0&&a.x--):a.y-=2,f.y=a.y*q,a.x=1+2*Math.ceil((a.y/l-1)/2),f.x=Math.round(f.y/l)),{height:f.y,width:f.x,hideYDots:a.y,hideXDots:a.x}}({originalWidth:this._image.width,originalHeight:this._image.height,maxHiddenDots:g,maxHiddenAxisDots:t-14,dotSize:r})}this.drawBackground(),this.drawDots((k,S)=>{var C,g,$,v,b,A;return!(this._options.imageOptions.hideBackgroundDots&&k>=(t-u.hideYDots)/2&&k<(t+u.hideYDots)/2&&S>=(t-u.hideXDots)/2&&S<(t+u.hideXDots)/2||!((C=et[k])===null||C===void 0)&&C[S]||!((g=et[k-t+7])===null||g===void 0)&&g[S]||!(($=et[k])===null||$===void 0)&&$[S-t+7]||!((v=Z[k])===null||v===void 0)&&v[S]||!((b=Z[k-t+7])===null||b===void 0)&&b[S]||!((A=Z[k])===null||A===void 0)&&A[S-t+7])}),this.drawCorners(),this._options.image&&await this.drawImage({width:u.width,height:u.height,count:t,dotSize:r})}drawBackground(){var e,t,o;const i=this._element,r=this._options;if(i){const u=(e=r.backgroundOptions)===null||e===void 0?void 0:e.gradient,k=(t=r.backgroundOptions)===null||t===void 0?void 0:t.color;let S=r.height,C=r.width;if(u||k){const g=this._window.document.createElementNS("http://www.w3.org/2000/svg","rect");this._backgroundClipPath=this._window.document.createElementNS("http://www.w3.org/2000/svg","clipPath"),this._backgroundClipPath.setAttribute("id",`clip-path-background-color-${this._instanceId}`),this._defs.appendChild(this._backgroundClipPath),!((o=r.backgroundOptions)===null||o===void 0)&&o.round&&(S=C=Math.min(r.width,r.height),g.setAttribute("rx",String(S/2*r.backgroundOptions.round))),g.setAttribute("x",String(this._roundSize((r.width-C)/2))),g.setAttribute("y",String(this._roundSize((r.height-S)/2))),g.setAttribute("width",String(C)),g.setAttribute("height",String(S)),this._backgroundClipPath.appendChild(g),this._createColor({options:u,color:k,additionalRotation:0,x:0,y:0,height:r.height,width:r.width,name:`background-color-${this._instanceId}`})}}}drawDots(e){var t,o;if(!this._qr)throw"QR code is not defined";const i=this._options,r=this._qr.getModuleCount();if(r>i.width||r>i.height)throw"The canvas is too small.";const u=Math.min(i.width,i.height)-2*i.margin,k=i.shape===gt?u/Math.sqrt(2):u,S=this._roundSize(k/r),C=this._roundSize((i.width-r*S)/2),g=this._roundSize((i.height-r*S)/2),$=new T({svg:this._element,type:i.dotsOptions.type,window:this._window});this._dotsClipPath=this._window.document.createElementNS("http://www.w3.org/2000/svg","clipPath"),this._dotsClipPath.setAttribute("id",`clip-path-dot-color-${this._instanceId}`),this._defs.appendChild(this._dotsClipPath),this._createColor({options:(t=i.dotsOptions)===null||t===void 0?void 0:t.gradient,color:i.dotsOptions.color,additionalRotation:0,x:0,y:0,height:i.height,width:i.width,name:`dot-color-${this._instanceId}`});for(let v=0;v<r;v++)for(let b=0;b<r;b++)e&&!e(v,b)||!((o=this._qr)===null||o===void 0)&&o.isDark(v,b)&&($.draw(C+b*S,g+v*S,S,(A,q)=>!(b+A<0||v+q<0||b+A>=r||v+q>=r)&&!(e&&!e(v+q,b+A))&&!!this._qr&&this._qr.isDark(v+q,b+A)),$._element&&this._dotsClipPath&&this._dotsClipPath.appendChild($._element));if(i.shape===gt){const v=this._roundSize((u/S-r)/2),b=r+2*v,A=C-v*S,q=g-v*S,a=[],f=this._roundSize(b/2);for(let l=0;l<b;l++){a[l]=[];for(let p=0;p<b;p++)l>=v-1&&l<=b-v&&p>=v-1&&p<=b-v||Math.sqrt((l-f)*(l-f)+(p-f)*(p-f))>f?a[l][p]=0:a[l][p]=this._qr.isDark(p-2*v<0?p:p>=r?p-2*v:p-v,l-2*v<0?l:l>=r?l-2*v:l-v)?1:0}for(let l=0;l<b;l++)for(let p=0;p<b;p++)a[l][p]&&($.draw(A+p*S,q+l*S,S,(m,O)=>{var I;return!!(!((I=a[l+O])===null||I===void 0)&&I[p+m])}),$._element&&this._dotsClipPath&&this._dotsClipPath.appendChild($._element))}}drawCorners(){if(!this._qr)throw"QR code is not defined";const e=this._element,t=this._options;if(!e)throw"Element code is not defined";const o=this._qr.getModuleCount(),i=Math.min(t.width,t.height)-2*t.margin,r=t.shape===gt?i/Math.sqrt(2):i,u=this._roundSize(r/o),k=7*u,S=3*u,C=this._roundSize((t.width-o*u)/2),g=this._roundSize((t.height-o*u)/2);[[0,0,0],[1,0,Math.PI/2],[0,1,-Math.PI/2]].forEach(([$,v,b])=>{var A,q,a,f,l,p,m,O,I,L,R,j,Q,rt;const V=C+$*u*(o-7),H=g+v*u*(o-7);let N=this._dotsClipPath,E=this._dotsClipPath;if((!((A=t.cornersSquareOptions)===null||A===void 0)&&A.gradient||!((q=t.cornersSquareOptions)===null||q===void 0)&&q.color)&&(N=this._window.document.createElementNS("http://www.w3.org/2000/svg","clipPath"),N.setAttribute("id",`clip-path-corners-square-color-${$}-${v}-${this._instanceId}`),this._defs.appendChild(N),this._cornersSquareClipPath=this._cornersDotClipPath=E=N,this._createColor({options:(a=t.cornersSquareOptions)===null||a===void 0?void 0:a.gradient,color:(f=t.cornersSquareOptions)===null||f===void 0?void 0:f.color,additionalRotation:b,x:V,y:H,height:k,width:k,name:`corners-square-color-${$}-${v}-${this._instanceId}`})),((l=t.cornersSquareOptions)===null||l===void 0?void 0:l.type)&&X.includes(t.cornersSquareOptions.type)){const G=new W({svg:this._element,type:t.cornersSquareOptions.type,window:this._window});G.draw(V,H,k,b),G._element&&N&&N.appendChild(G._element)}else{const G=new T({svg:this._element,type:((p=t.cornersSquareOptions)===null||p===void 0?void 0:p.type)||t.dotsOptions.type,window:this._window});for(let nt=0;nt<et.length;nt++)for(let D=0;D<et[nt].length;D++)!((m=et[nt])===null||m===void 0)&&m[D]&&(G.draw(V+D*u,H+nt*u,u,(dt,at)=>{var it;return!!(!((it=et[nt+at])===null||it===void 0)&&it[D+dt])}),G._element&&N&&N.appendChild(G._element))}if((!((O=t.cornersDotOptions)===null||O===void 0)&&O.gradient||!((I=t.cornersDotOptions)===null||I===void 0)&&I.color)&&(E=this._window.document.createElementNS("http://www.w3.org/2000/svg","clipPath"),E.setAttribute("id",`clip-path-corners-dot-color-${$}-${v}-${this._instanceId}`),this._defs.appendChild(E),this._cornersDotClipPath=E,this._createColor({options:(L=t.cornersDotOptions)===null||L===void 0?void 0:L.gradient,color:(R=t.cornersDotOptions)===null||R===void 0?void 0:R.color,additionalRotation:b,x:V+2*u,y:H+2*u,height:S,width:S,name:`corners-dot-color-${$}-${v}-${this._instanceId}`})),((j=t.cornersDotOptions)===null||j===void 0?void 0:j.type)&&F.includes(t.cornersDotOptions.type)){const G=new ct({svg:this._element,type:t.cornersDotOptions.type,window:this._window});G.draw(V+2*u,H+2*u,S,b),G._element&&E&&E.appendChild(G._element)}else{const G=new T({svg:this._element,type:((Q=t.cornersDotOptions)===null||Q===void 0?void 0:Q.type)||t.dotsOptions.type,window:this._window});for(let nt=0;nt<Z.length;nt++)for(let D=0;D<Z[nt].length;D++)!((rt=Z[nt])===null||rt===void 0)&&rt[D]&&(G.draw(V+D*u,H+nt*u,u,(dt,at)=>{var it;return!!(!((it=Z[nt+at])===null||it===void 0)&&it[D+dt])}),G._element&&E&&E.appendChild(G._element))}})}loadImage(){return new Promise((e,t)=>{var o;const i=this._options;if(!i.image)return t("Image is not defined");if(!((o=i.nodeCanvas)===null||o===void 0)&&o.loadImage)i.nodeCanvas.loadImage(i.image).then(r=>{var u,k;if(this._image=r,this._options.imageOptions.saveAsBlob){const S=(u=i.nodeCanvas)===null||u===void 0?void 0:u.createCanvas(this._image.width,this._image.height);(k=S==null?void 0:S.getContext("2d"))===null||k===void 0||k.drawImage(r,0,0),this._imageUri=S==null?void 0:S.toDataURL()}e()}).catch(t);else{const r=new this._window.Image;typeof i.imageOptions.crossOrigin=="string"&&(r.crossOrigin=i.imageOptions.crossOrigin),this._image=r,r.onload=async()=>{this._options.imageOptions.saveAsBlob&&(this._imageUri=await async function(u,k){return new Promise(S=>{const C=new k.XMLHttpRequest;C.onload=function(){const g=new k.FileReader;g.onloadend=function(){S(g.result)},g.readAsDataURL(C.response)},C.open("GET",u),C.responseType="blob",C.send()})}(i.image||"",this._window)),e()},r.src=i.image}})}async drawImage({width:e,height:t,count:o,dotSize:i}){const r=this._options,u=this._roundSize((r.width-o*i)/2),k=this._roundSize((r.height-o*i)/2),S=u+this._roundSize(r.imageOptions.margin+(o*i-e)/2),C=k+this._roundSize(r.imageOptions.margin+(o*i-t)/2),g=e-2*r.imageOptions.margin,$=t-2*r.imageOptions.margin,v=this._window.document.createElementNS("http://www.w3.org/2000/svg","image");v.setAttribute("href",this._imageUri||""),v.setAttribute("xlink:href",this._imageUri||""),v.setAttribute("x",String(S)),v.setAttribute("y",String(C)),v.setAttribute("width",`${g}px`),v.setAttribute("height",`${$}px`),this._element.appendChild(v)}_createColor({options:e,color:t,additionalRotation:o,x:i,y:r,height:u,width:k,name:S}){const C=k>u?k:u,g=this._window.document.createElementNS("http://www.w3.org/2000/svg","rect");if(g.setAttribute("x",String(i)),g.setAttribute("y",String(r)),g.setAttribute("height",String(u)),g.setAttribute("width",String(k)),g.setAttribute("clip-path",`url('#clip-path-${S}')`),e){let $;if(e.type==="radial")$=this._window.document.createElementNS("http://www.w3.org/2000/svg","radialGradient"),$.setAttribute("id",S),$.setAttribute("gradientUnits","userSpaceOnUse"),$.setAttribute("fx",String(i+k/2)),$.setAttribute("fy",String(r+u/2)),$.setAttribute("cx",String(i+k/2)),$.setAttribute("cy",String(r+u/2)),$.setAttribute("r",String(C/2));else{const v=((e.rotation||0)+o)%(2*Math.PI),b=(v+2*Math.PI)%(2*Math.PI);let A=i+k/2,q=r+u/2,a=i+k/2,f=r+u/2;b>=0&&b<=.25*Math.PI||b>1.75*Math.PI&&b<=2*Math.PI?(A-=k/2,q-=u/2*Math.tan(v),a+=k/2,f+=u/2*Math.tan(v)):b>.25*Math.PI&&b<=.75*Math.PI?(q-=u/2,A-=k/2/Math.tan(v),f+=u/2,a+=k/2/Math.tan(v)):b>.75*Math.PI&&b<=1.25*Math.PI?(A+=k/2,q+=u/2*Math.tan(v),a-=k/2,f-=u/2*Math.tan(v)):b>1.25*Math.PI&&b<=1.75*Math.PI&&(q+=u/2,A+=k/2/Math.tan(v),f-=u/2,a-=k/2/Math.tan(v)),$=this._window.document.createElementNS("http://www.w3.org/2000/svg","linearGradient"),$.setAttribute("id",S),$.setAttribute("gradientUnits","userSpaceOnUse"),$.setAttribute("x1",String(Math.round(A))),$.setAttribute("y1",String(Math.round(q))),$.setAttribute("x2",String(Math.round(a))),$.setAttribute("y2",String(Math.round(f)))}e.colorStops.forEach(({offset:v,color:b})=>{const A=this._window.document.createElementNS("http://www.w3.org/2000/svg","stop");A.setAttribute("offset",100*v+"%"),A.setAttribute("stop-color",b),$.appendChild(A)}),g.setAttribute("fill",`url('#${S}')`),this._defs.appendChild($)}else t&&g.setAttribute("fill",t);this._element.appendChild(g)}}st.instanceCount=0;const yt=st,Ct="canvas",mt={};for(let d=0;d<=40;d++)mt[d]=d;const Pt={type:Ct,shape:"square",width:300,height:300,data:"",margin:0,qrOptions:{typeNumber:mt[0],mode:void 0,errorCorrectionLevel:"Q"},imageOptions:{saveAsBlob:!0,hideBackgroundDots:!0,imageSize:.4,crossOrigin:void 0,margin:0},dotsOptions:{type:"square",color:"#000",roundSize:!0},backgroundOptions:{round:0,color:"#fff"}};function vt(d){const e=Object.assign({},d);if(!e.colorStops||!e.colorStops.length)throw"Field 'colorStops' is required in gradient";return e.rotation?e.rotation=Number(e.rotation):e.rotation=0,e.colorStops=e.colorStops.map(t=>Object.assign(Object.assign({},t),{offset:Number(t.offset)})),e}function kt(d){const e=Object.assign({},d);return e.width=Number(e.width),e.height=Number(e.height),e.margin=Number(e.margin),e.imageOptions=Object.assign(Object.assign({},e.imageOptions),{hideBackgroundDots:!!e.imageOptions.hideBackgroundDots,imageSize:Number(e.imageOptions.imageSize),margin:Number(e.imageOptions.margin)}),e.margin>Math.min(e.width,e.height)&&(e.margin=Math.min(e.width,e.height)),e.dotsOptions=Object.assign({},e.dotsOptions),e.dotsOptions.gradient&&(e.dotsOptions.gradient=vt(e.dotsOptions.gradient)),e.cornersSquareOptions&&(e.cornersSquareOptions=Object.assign({},e.cornersSquareOptions),e.cornersSquareOptions.gradient&&(e.cornersSquareOptions.gradient=vt(e.cornersSquareOptions.gradient))),e.cornersDotOptions&&(e.cornersDotOptions=Object.assign({},e.cornersDotOptions),e.cornersDotOptions.gradient&&(e.cornersDotOptions.gradient=vt(e.cornersDotOptions.gradient))),e.backgroundOptions&&(e.backgroundOptions=Object.assign({},e.backgroundOptions),e.backgroundOptions.gradient&&(e.backgroundOptions.gradient=vt(e.backgroundOptions.gradient))),e}var $t=_(873),It=_.n($t);function xt(d){if(!d)throw new Error("Extension must be defined");d[0]==="."&&(d=d.substring(1));const e={bmp:"image/bmp",gif:"image/gif",ico:"image/vnd.microsoft.icon",jpeg:"image/jpeg",jpg:"image/jpeg",png:"image/png",svg:"image/svg+xml",tif:"image/tiff",tiff:"image/tiff",webp:"image/webp",pdf:"application/pdf"}[d.toLowerCase()];if(!e)throw new Error(`Extension "${d}" is not supported`);return e}class h{constructor(e){e!=null&&e.jsdom?this._window=new e.jsdom("",{resources:"usable"}).window:this._window=window,this._options=e?kt(x(Pt,e)):Pt,this.update()}static _clearContainer(e){e&&(e.innerHTML="")}_setupSvg(){if(!this._qr)return;const e=new yt(this._options,this._window);this._svg=e.getElement(),this._svgDrawingPromise=e.drawQR(this._qr).then(()=>{var t;this._svg&&((t=this._extension)===null||t===void 0||t.call(this,e.getElement(),this._options))})}_setupCanvas(){var e,t;this._qr&&(!((e=this._options.nodeCanvas)===null||e===void 0)&&e.createCanvas?(this._nodeCanvas=this._options.nodeCanvas.createCanvas(this._options.width,this._options.height),this._nodeCanvas.width=this._options.width,this._nodeCanvas.height=this._options.height):(this._domCanvas=document.createElement("canvas"),this._domCanvas.width=this._options.width,this._domCanvas.height=this._options.height),this._setupSvg(),this._canvasDrawingPromise=(t=this._svgDrawingPromise)===null||t===void 0?void 0:t.then(()=>{var o;if(!this._svg)return;const i=this._svg,r=new this._window.XMLSerializer().serializeToString(i),u=btoa(r),k=`data:${xt("svg")};base64,${u}`;if(!((o=this._options.nodeCanvas)===null||o===void 0)&&o.loadImage)return this._options.nodeCanvas.loadImage(k).then(S=>{var C,g;S.width=this._options.width,S.height=this._options.height,(g=(C=this._nodeCanvas)===null||C===void 0?void 0:C.getContext("2d"))===null||g===void 0||g.drawImage(S,0,0)});{const S=new this._window.Image;return new Promise(C=>{S.onload=()=>{var g,$;($=(g=this._domCanvas)===null||g===void 0?void 0:g.getContext("2d"))===null||$===void 0||$.drawImage(S,0,0),C()},S.src=k})}}))}async _getElement(e="png"){if(!this._qr)throw"QR code is empty";return e.toLowerCase()==="svg"?(this._svg&&this._svgDrawingPromise||this._setupSvg(),await this._svgDrawingPromise,this._svg):((this._domCanvas||this._nodeCanvas)&&this._canvasDrawingPromise||this._setupCanvas(),await this._canvasDrawingPromise,this._domCanvas||this._nodeCanvas)}update(e){h._clearContainer(this._container),this._options=e?kt(x(this._options,e)):this._options,this._options.data&&(this._qr=It()(this._options.qrOptions.typeNumber,this._options.qrOptions.errorCorrectionLevel),this._qr.addData(this._options.data,this._options.qrOptions.mode||function(t){switch(!0){case/^[0-9]*$/.test(t):return"Numeric";case/^[0-9A-Z $%*+\-./:]*$/.test(t):return"Alphanumeric";default:return"Byte"}}(this._options.data)),this._qr.make(),this._options.type===Ct?this._setupCanvas():this._setupSvg(),this.append(this._container))}append(e){if(e){if(typeof e.appendChild!="function")throw"Container should be a single DOM node";this._options.type===Ct?this._domCanvas&&e.appendChild(this._domCanvas):this._svg&&e.appendChild(this._svg),this._container=e}}applyExtension(e){if(!e)throw"Extension function should be defined.";this._extension=e,this.update()}deleteExtension(){this._extension=void 0,this.update()}async getRawData(e="png"){if(!this._qr)throw"QR code is empty";const t=await this._getElement(e),o=xt(e);if(!t)return null;if(e.toLowerCase()==="svg"){const i=`<?xml version="1.0" standalone="no"?>\r
${new this._window.XMLSerializer().serializeToString(t)}`;return typeof Blob>"u"||this._options.jsdom?Buffer.from(i):new Blob([i],{type:o})}return new Promise(i=>{const r=t;if("toBuffer"in r)if(o==="image/png")i(r.toBuffer(o));else if(o==="image/jpeg")i(r.toBuffer(o));else{if(o!=="application/pdf")throw Error("Unsupported extension");i(r.toBuffer(o))}else"toBlob"in r&&r.toBlob(i,o,1)})}async download(e){if(!this._qr)throw"QR code is empty";if(typeof Blob>"u")throw"Cannot download in Node.js, call getRawData instead.";let t="png",o="qr";typeof e=="string"?(t=e,console.warn("Extension is deprecated as argument for 'download' method, please pass object { name: '...', extension: '...' } as argument")):typeof e=="object"&&e!==null&&(e.name&&(o=e.name),e.extension&&(t=e.extension));const i=await this._getElement(t);if(i)if(t.toLowerCase()==="svg"){let r=new XMLSerializer().serializeToString(i);r=`<?xml version="1.0" standalone="no"?>\r
`+r,M(`data:${xt(t)};charset=utf-8,${encodeURIComponent(r)}`,`${o}.svg`)}else M(i.toDataURL(xt(t)),`${o}.${t}`)}}const w=h})(),P.default})())}(Ut)),Ut.exports}var Pe=Ce();const ke=_e(Pe);var $e=ft('<div class=test-mode-badge tabindex=0><svg width=16 height=16 viewBox="0 0 20 20"fill=none xmlns=http://www.w3.org/2000/svg><circle cx=10 cy=10 r=9 stroke=#b45309 stroke-width=2 fill=#fef3c7></circle><text x=10 y=15 text-anchor=middle font-size=12 fill=#b45309 font-family=Arial font-weight=bold>i</text></svg><span class=test-mode-badge-text>Test Mode</span><div class=test-mode-tooltip>Test Mode: No real money will be moved.'),se=ft("<div>Complete on your phone"),ae=ft("<div>Attempting to reconnect..."),ze=ft("<div class=qr-code-container id=qrcode-container-mobile>"),Ae=ft('<div><div class=mobile-button-container><button class=mobile-button title="Open on mobile device"><svg width=20 height=20 viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round><rect x=5 y=2 width=14 height=20 rx=2 ry=2></rect><line x1=12 y1=18 x2=12 y2=18></line></svg><span>Open app to continue'),qe=ft("<div class=savings-badge>"),Oe=ft("<div class=zenobia-error>"),Me=ft('<div class="zenobia-qr-popup-overlay visible"><div class=zenobia-qr-popup-content><button class=zenobia-qr-close><svg viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2><path d="M18 6L6 18M6 6l12 12"></path></svg></button><div class=modal-header><div class=header-content><h3>Pay by bank with Zenobia</h3><p class=subtitle>Scan to complete your purchase</p></div></div><div class=modal-body><div class=payment-amount>$</div><div class=payment-status><div class=spinner></div><div class=payment-instructions>'),Ee=ft("<div class=qr-code-container id=qrcode-container>"),le=ft("<div class=qr-code-container><div class=zenobia-qr-placeholder>");const Ie=()=>{if(typeof window>"u")return!1;const n=window.navigator.userAgent.toLowerCase(),s=/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(n),c="ontouchstart"in window||navigator.maxTouchPoints>0,y=window.innerWidth<=768;return s||c&&y},De=n=>{const[s,c]=ut(null),y={current:null},[_,P]=ut(qt.PENDING),[z,x]=ut(null),[M,U]=ut(!1),[T,B]=ut(null),[X,W]=ut(null),[Y,F]=ut(!1),[ct,gt]=ut(""),[et,Z]=ut(!1),[st,yt]=ut(!1),[Ct,mt]=ut(null);Rt(()=>{if(n.isOpen&&!T()){Z(!1),yt(!1),mt(null),x(null);const h=new xe(n.isTest);if(B(h),n.transferRequest)W(n.transferRequest),h.listenToTransfer(n.transferRequest.transferRequestId,n.transferRequest.signature||"",Pt,vt,kt,$t);else if(n.url){F(!0),x(null);const w=n.metadata||{amount:n.amount,statementItems:{name:"Payment",amount:n.amount}};h.createTransfer(n.url,w).then(d=>{W({transferRequestId:d.transferRequestId,merchantId:d.merchantId,expiry:d.expiry,signature:d.signature}),h.listenToTransfer(d.transferRequestId,d.signature||"",Pt,vt,kt,$t)}).catch(d=>{x(d instanceof Error?d.message:"An error occurred"),n.onError&&d instanceof Error&&n.onError(d)}).finally(()=>{F(!1)})}else x("No URL provided for creating a new transfer")}}),Rt(()=>{var h;if((h=X())!=null&&h.transferRequestId){const w=X().transferRequestId.replace(/-/g,"");let e=`https://zenobiapay.com/clip?id=${btoa(w).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}`;n.isTest&&(e+="&type=test"),gt(e);const o=n.qrCodeSize||220,i=new ke({width:o,height:o,type:"svg",data:e,image:void 0,dotsOptions:{color:"#000000",type:"dots"},backgroundOptions:{color:"#ffffff"},cornersSquareOptions:{type:"extra-rounded"},cornersDotOptions:{type:"dot"},qrOptions:{errorCorrectionLevel:"M"}});c(i)}}),Rt(()=>{const h=s();setTimeout(()=>{h&&y.current&&(y.current.innerHTML="",h.append(y.current))},0)});const Pt=h=>{console.log("Received status update:",h);let w;switch(h.status){case"COMPLETED":case"IN_FLIGHT":w=qt.COMPLETED,n.onSuccess&&X()&&n.onSuccess(X(),h);const d=T();d&&(d.disconnect(),B(null));break;case"FAILED":w=qt.FAILED;const e=T();e&&(e.disconnect(),B(null));break;case"CANCELLED":w=qt.CANCELLED;const t=T();t&&(t.disconnect(),B(null));break;default:w=qt.PENDING}P(w),n.onStatusChange&&n.onStatusChange(w)},vt=h=>{console.error("WebSocket error:",h),h.toLowerCase().includes("disconnect")||h.toLowerCase().includes("connection lost")||h.toLowerCase().includes("network error")||h.toLowerCase().includes("timeout")?(mt(h),yt(!0)):(x(h),n.onError&&n.onError(new Error(h)))},kt=h=>{console.log("WebSocket connection status:",h?"Connected":"Disconnected"),U(h),h?(yt(!1),mt(null)):yt(!0)},$t=h=>{console.log("Scan update received:",h.scanType),h.scanType==="scanned"?Z(!0):h.scanType==="unscanned"&&Z(!1)};ue(()=>{const h=T();h&&h.disconnect()}),Rt(()=>{if(!n.isOpen){const h=T();h&&(h.disconnect(),B(null)),Z(!1),yt(!1),mt(null),x(null)}});const It=()=>n.discountAmount!==void 0?n.discountAmount:Math.round(n.amount/100),xt=()=>{if(!n.showCashback)return null;const h=It();return h<1e3?`✨ ${(h/n.amount*100).toFixed(0)}% cashback applied!`:`✨ Applied $${(h/100).toFixed(2)} cashback!`};return lt(ht,{get when(){return n.isOpen},get children(){var h=Me(),w=h.firstChild,d=w.firstChild,e=d.nextSibling,t=e.firstChild,o=t.firstChild;o.nextSibling;var i=e.nextSibling,r=i.firstChild;r.firstChild;var u=r.nextSibling,k=u.firstChild,S=k.nextSibling;return me(d,"click",n.onClose),tt(t,lt(ht,{get when(){return n.isTest},get children(){return $e()}}),null),tt(i,lt(ht,{get when(){return Ie()&&ct()!==""&&!n.hideQrOnMobile},get fallback(){return lt(ht,{get when(){return bt(()=>!!s())()&&X()},get fallback(){return(()=>{var C=le(),g=C.firstChild;return C.style.setProperty("display","flex"),C.style.setProperty("justify-content","center"),C.style.setProperty("align-items","center"),St($=>{var v=n.qrCodeSize?`${n.qrCodeSize}px`:"220px",b=n.qrCodeSize?`${n.qrCodeSize}px`:"220px",A=n.qrCodeSize?`${n.qrCodeSize}px`:"220px",q=n.qrCodeSize?`${n.qrCodeSize}px`:"220px";return v!==$.e&&(($.e=v)!=null?C.style.setProperty("width",v):C.style.removeProperty("width")),b!==$.t&&(($.t=b)!=null?C.style.setProperty("height",b):C.style.removeProperty("height")),A!==$.a&&(($.a=A)!=null?g.style.setProperty("width",A):g.style.removeProperty("width")),q!==$.o&&(($.o=q)!=null?g.style.setProperty("height",q):g.style.removeProperty("height")),$},{e:void 0,t:void 0,a:void 0,o:void 0}),C})()},get children(){var C=Ee();return re(g=>{y.current=g},C),C.style.setProperty("display","flex"),C.style.setProperty("justify-content","center"),C.style.setProperty("align-items","center"),C.style.setProperty("position","relative"),tt(C,lt(ht,{get when(){return et()},get children(){var g=se();return g.style.setProperty("position","absolute"),g.style.setProperty("top","0"),g.style.setProperty("left","0"),g.style.setProperty("right","0"),g.style.setProperty("bottom","0"),g.style.setProperty("background","rgba(0, 0, 0, 0.95)"),g.style.setProperty("display","flex"),g.style.setProperty("justify-content","center"),g.style.setProperty("align-items","center"),g.style.setProperty("border-radius","8px"),g.style.setProperty("color","white"),g.style.setProperty("font-size","16px"),g.style.setProperty("font-weight","500"),g.style.setProperty("text-align","center"),g.style.setProperty("padding","20px"),g.style.setProperty("z-index","10"),g}}),null),tt(C,lt(ht,{get when(){return st()},get children(){var g=ae();return g.style.setProperty("position","absolute"),g.style.setProperty("top","0"),g.style.setProperty("left","0"),g.style.setProperty("right","0"),g.style.setProperty("bottom","0"),g.style.setProperty("background","rgba(0, 0, 0, 0.9)"),g.style.setProperty("display","flex"),g.style.setProperty("justify-content","center"),g.style.setProperty("align-items","center"),g.style.setProperty("border-radius","8px"),g.style.setProperty("color","white"),g.style.setProperty("font-size","16px"),g.style.setProperty("font-weight","500"),g.style.setProperty("text-align","center"),g.style.setProperty("padding","20px"),g.style.setProperty("z-index","10"),g}}),null),St(g=>{var $=n.qrCodeSize?`${n.qrCodeSize}px`:"220px",v=n.qrCodeSize?`${n.qrCodeSize}px`:"220px";return $!==g.e&&((g.e=$)!=null?C.style.setProperty("width",$):C.style.removeProperty("width")),v!==g.t&&((g.t=v)!=null?C.style.setProperty("height",v):C.style.removeProperty("height")),g},{e:void 0,t:void 0}),C}})},get children(){var C=Ae(),g=C.firstChild,$=g.firstChild;return C.style.setProperty("text-align","center"),C.style.setProperty("margin","20px 0"),g.style.setProperty("text-align","center"),g.style.setProperty("margin","20px 0"),$.$$click=()=>window.open(ct(),"_blank"),$.style.setProperty("background-color","#000"),$.style.setProperty("color","#fff"),$.style.setProperty("border","none"),$.style.setProperty("padding","16px 24px"),$.style.setProperty("border-radius","8px"),$.style.setProperty("font-size","16px"),$.style.setProperty("font-weight","500"),$.style.setProperty("cursor","pointer"),$.style.setProperty("display","flex"),$.style.setProperty("align-items","center"),$.style.setProperty("gap","8px"),$.style.setProperty("margin","0 auto"),$.style.setProperty("transition","background-color 0.2s ease"),tt(C,lt(ht,{get when(){return bt(()=>!!s())()&&X()},get fallback(){return(()=>{var v=le(),b=v.firstChild;return v.style.setProperty("display","flex"),v.style.setProperty("justify-content","center"),v.style.setProperty("align-items","center"),v.style.setProperty("margin","20px auto"),St(A=>{var q=n.qrCodeSize?`${n.qrCodeSize}px`:"220px",a=n.qrCodeSize?`${n.qrCodeSize}px`:"220px",f=n.qrCodeSize?`${n.qrCodeSize}px`:"220px",l=n.qrCodeSize?`${n.qrCodeSize}px`:"220px";return q!==A.e&&((A.e=q)!=null?v.style.setProperty("width",q):v.style.removeProperty("width")),a!==A.t&&((A.t=a)!=null?v.style.setProperty("height",a):v.style.removeProperty("height")),f!==A.a&&((A.a=f)!=null?b.style.setProperty("width",f):b.style.removeProperty("width")),l!==A.o&&((A.o=l)!=null?b.style.setProperty("height",l):b.style.removeProperty("height")),A},{e:void 0,t:void 0,a:void 0,o:void 0}),v})()},get children(){var v=ze();return re(b=>{if(b){const A=s();A&&(b.innerHTML="",A.append(b))}},v),v.style.setProperty("display","flex"),v.style.setProperty("justify-content","center"),v.style.setProperty("align-items","center"),v.style.setProperty("margin","20px auto"),v.style.setProperty("position","relative"),tt(v,lt(ht,{get when(){return et()},get children(){var b=se();return b.style.setProperty("position","absolute"),b.style.setProperty("top","0"),b.style.setProperty("left","0"),b.style.setProperty("right","0"),b.style.setProperty("bottom","0"),b.style.setProperty("background","rgba(0, 0, 0, 0.95)"),b.style.setProperty("display","flex"),b.style.setProperty("justify-content","center"),b.style.setProperty("align-items","center"),b.style.setProperty("border-radius","8px"),b.style.setProperty("color","white"),b.style.setProperty("font-size","16px"),b.style.setProperty("font-weight","500"),b.style.setProperty("text-align","center"),b.style.setProperty("padding","20px"),b.style.setProperty("z-index","10"),b}}),null),tt(v,lt(ht,{get when(){return st()},get children(){var b=ae();return b.style.setProperty("position","absolute"),b.style.setProperty("top","0"),b.style.setProperty("left","0"),b.style.setProperty("right","0"),b.style.setProperty("bottom","0"),b.style.setProperty("background","rgba(0, 0, 0, 0.9)"),b.style.setProperty("display","flex"),b.style.setProperty("justify-content","center"),b.style.setProperty("align-items","center"),b.style.setProperty("border-radius","8px"),b.style.setProperty("color","white"),b.style.setProperty("font-size","16px"),b.style.setProperty("font-weight","500"),b.style.setProperty("text-align","center"),b.style.setProperty("padding","20px"),b.style.setProperty("z-index","10"),b}}),null),St(b=>{var A=n.qrCodeSize?`${n.qrCodeSize}px`:"220px",q=n.qrCodeSize?`${n.qrCodeSize}px`:"220px";return A!==b.e&&((b.e=A)!=null?v.style.setProperty("width",A):v.style.removeProperty("width")),q!==b.t&&((b.t=q)!=null?v.style.setProperty("height",q):v.style.removeProperty("height")),b},{e:void 0,t:void 0}),v}}),null),C}}),r),tt(r,()=>(n.amount/100).toFixed(2),null),tt(i,lt(ht,{get when(){return xt()},get children(){var C=qe();return tt(C,xt),C}}),u),tt(S,(()=>{var C=bt(()=>!!Y());return()=>C()?"Preparing payment...":bt(()=>!X())()?"Creating payment...":st()?"Reconnecting...":"Waiting for payment"})()),tt(i,lt(ht,{get when(){return bt(()=>!!z())()&&!st()},get children(){var C=Oe();return tt(C,z),C}}),null),h}})};ne(["click"]);const Le=`
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
`;var Be=ft("<div class=zenobia-payment-container><style></style><button class=zenobia-payment-button>"),Te=ft("<div class=button-text-container><div class=initial-text></div><div class=hover-text>"),qt=(n=>(n.PENDING="PENDING",n.IN_FLIGHT="IN_FLIGHT",n.COMPLETED="COMPLETED",n.FAILED="FAILED",n.CANCELLED="CANCELLED",n))(qt||{});const Re=n=>{const[s,c]=ut("INITIAL"),[y,_]=ut(!1),P=()=>{const M=n.discountAmount||0;return M==0?n.buttonText:M<1e3?`Get ${(M/n.amount*100).toFixed(0)}% cashback`:`Get $${(M/100).toFixed(2)} cashback`},z=()=>{c("QR_EXPANDING"),setTimeout(()=>{c("QR_VISIBLE")},300)},x=()=>{_(!0),c("INITIAL"),setTimeout(()=>{setTimeout(()=>{_(!1)},300)},50)};return(()=>{var M=Be(),U=M.firstChild,T=U.nextSibling;return tt(U,Le),T.$$click=z,T.style.setProperty("background-color","black"),tt(T,(()=>{var B=bt(()=>s()!=="INITIAL"&&!y());return()=>B()?n.buttonText||`Pay ${(n.amount/100).toFixed(2)}`:(()=>{var X=Te(),W=X.firstChild,Y=W.nextSibling;return tt(W,P),tt(Y,()=>n.buttonText||"Pay with Zenobia"),X})()})()),tt(M,lt(ht,{get when(){return s()==="QR_EXPANDING"||s()==="QR_VISIBLE"},get children(){return lt(De,{get isOpen(){return s()==="QR_VISIBLE"},onClose:x,get amount(){return n.amount},get discountAmount(){return n.discountAmount},get qrCodeSize(){return n.qrCodeSize},get isTest(){return n.isTest},get url(){return n.url},get metadata(){return n.metadata},get onSuccess(){return n.onSuccess},get onError(){return n.onError},get onStatusChange(){return n.onStatusChange},get hideQrOnMobile(){return n.hideQrOnMobile},get showCashback(){return n.showCashback}})}}),null),St(B=>{var X=s()!=="INITIAL",W=!!y(),Y=s()!=="INITIAL";return X!==B.e&&T.classList.toggle("modal-open",B.e=X),W!==B.t&&T.classList.toggle("closing",B.t=W),Y!==B.a&&(T.disabled=B.a=Y),B},{e:void 0,t:void 0,a:void 0}),M})()};ne(["click"]);function je(n){const s=typeof n.target=="string"?document.querySelector(n.target):n.target;if(!s){console.error("[zenobia-pay] target element not found:",n.target);return}be(()=>lt(Re,{get url(){return n.url},get amount(){return n.amount},get metadata(){return n.metadata},get buttonText(){return n.buttonText},get buttonClass(){return n.buttonClass},get qrCodeSize(){return n.qrCodeSize},get onSuccess(){return n.onSuccess},get onError(){return n.onError},get onStatusChange(){return n.onStatusChange}}),s)}window.ZenobiaPay={init:je}})();
