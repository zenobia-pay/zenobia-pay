(function(){"use strict";const Bt={equals:(n,a)=>n===a};let Gt=Kt;const Ct=1,Tt=2,Vt={owned:null,cleanups:null,context:null,owner:null};var tt=null;let Ht=null,ce=null,K=null,ot=null,bt=null,Lt=0;function de(n,a){const d=K,w=tt,_=n.length===0,C=a===void 0?w:a,k=_?Vt:{owned:null,cleanups:null,context:C?C.context:null,owner:C},x=_?n:()=>n(()=>At(()=>It(k)));tt=k,K=null;try{return Mt(x,!0)}finally{K=d,tt=w}}function it(n,a){a=a?Object.assign({},Bt,a):Bt;const d={value:n,observers:null,observerSlots:null,comparator:a.equals||void 0},w=_=>(typeof _=="function"&&(_=_(d.value)),Jt(d,_));return[Zt.bind(d),w]}function mt(n,a,d){const w=Wt(n,a,!1,Ct);Ot(w)}function Rt(n,a,d){Gt=ge;const w=Wt(n,a,!1,Ct);w.user=!0,bt?bt.push(w):Ot(w)}function vt(n,a,d){d=d?Object.assign({},Bt,d):Bt;const w=Wt(n,a,!0,0);return w.observers=null,w.observerSlots=null,w.comparator=d.equals||void 0,Ot(w),Zt.bind(w)}function At(n){if(K===null)return n();const a=K;K=null;try{return n()}finally{K=a}}function ue(n){return tt===null||(tt.cleanups===null?tt.cleanups=[n]:tt.cleanups.push(n)),n}function Zt(){if(this.sources&&this.state)if(this.state===Ct)Ot(this);else{const n=ot;ot=null,Mt(()=>Nt(this),!1),ot=n}if(K){const n=this.observers?this.observers.length:0;K.sources?(K.sources.push(this),K.sourceSlots.push(n)):(K.sources=[this],K.sourceSlots=[n]),this.observers?(this.observers.push(K),this.observerSlots.push(K.sources.length-1)):(this.observers=[K],this.observerSlots=[K.sources.length-1])}return this.value}function Jt(n,a,d){let w=n.value;return(!n.comparator||!n.comparator(w,a))&&(n.value=a,n.observers&&n.observers.length&&Mt(()=>{for(let _=0;_<n.observers.length;_+=1){const C=n.observers[_],k=Ht&&Ht.running;k&&Ht.disposed.has(C),(k?!C.tState:!C.state)&&(C.pure?ot.push(C):bt.push(C),C.observers&&te(C)),k||(C.state=Ct)}if(ot.length>1e6)throw ot=[],new Error},!1)),a}function Ot(n){if(!n.fn)return;It(n);const a=Lt;he(n,n.value,a)}function he(n,a,d){let w;const _=tt,C=K;K=tt=n;try{w=n.fn(a)}catch(k){return n.pure&&(n.state=Ct,n.owned&&n.owned.forEach(It),n.owned=null),n.updatedAt=d+1,ee(k)}finally{K=C,tt=_}(!n.updatedAt||n.updatedAt<=d)&&(n.updatedAt!=null&&"observers"in n?Jt(n,w):n.value=w,n.updatedAt=d)}function Wt(n,a,d,w=Ct,_){const C={fn:n,state:w,updatedAt:null,owned:null,sources:null,sourceSlots:null,cleanups:null,value:a,owner:tt,context:tt?tt.context:null,pure:d};return tt===null||tt!==Vt&&(tt.owned?tt.owned.push(C):tt.owned=[C]),C}function jt(n){if(n.state===0)return;if(n.state===Tt)return Nt(n);if(n.suspense&&At(n.suspense.inFallback))return n.suspense.effects.push(n);const a=[n];for(;(n=n.owner)&&(!n.updatedAt||n.updatedAt<Lt);)n.state&&a.push(n);for(let d=a.length-1;d>=0;d--)if(n=a[d],n.state===Ct)Ot(n);else if(n.state===Tt){const w=ot;ot=null,Mt(()=>Nt(n,a[0]),!1),ot=w}}function Mt(n,a){if(ot)return n();let d=!1;a||(ot=[]),bt?d=!0:bt=[],Lt++;try{const w=n();return fe(d),w}catch(w){d||(bt=null),ot=null,ee(w)}}function fe(n){if(ot&&(Kt(ot),ot=null),n)return;const a=bt;bt=null,a.length&&Mt(()=>Gt(a),!1)}function Kt(n){for(let a=0;a<n.length;a++)jt(n[a])}function ge(n){let a,d=0;for(a=0;a<n.length;a++){const w=n[a];w.user?n[d++]=w:jt(w)}for(a=0;a<d;a++)jt(n[a])}function Nt(n,a){n.state=0;for(let d=0;d<n.sources.length;d+=1){const w=n.sources[d];if(w.sources){const _=w.state;_===Ct?w!==a&&(!w.updatedAt||w.updatedAt<Lt)&&jt(w):_===Tt&&Nt(w,a)}}}function te(n){for(let a=0;a<n.observers.length;a+=1){const d=n.observers[a];d.state||(d.state=Tt,d.pure?ot.push(d):bt.push(d),d.observers&&te(d))}}function It(n){let a;if(n.sources)for(;n.sources.length;){const d=n.sources.pop(),w=n.sourceSlots.pop(),_=d.observers;if(_&&_.length){const C=_.pop(),k=d.observerSlots.pop();w<_.length&&(C.sourceSlots[k]=w,_[w]=C,d.observerSlots[w]=k)}}if(n.tOwned){for(a=n.tOwned.length-1;a>=0;a--)It(n.tOwned[a]);delete n.tOwned}if(n.owned){for(a=n.owned.length-1;a>=0;a--)It(n.owned[a]);n.owned=null}if(n.cleanups){for(a=n.cleanups.length-1;a>=0;a--)n.cleanups[a]();n.cleanups=null}n.state=0}function pe(n){return n instanceof Error?n:new Error(typeof n=="string"?n:"Unknown error",{cause:n})}function ee(n,a=tt){throw pe(n)}function ct(n,a){return At(()=>n(a||{}))}const ye=n=>`Stale read from <${n}>.`;function ft(n){const a=n.keyed,d=vt(()=>n.when,void 0,void 0),w=a?d:vt(d,void 0,{equals:(_,C)=>!_==!C});return vt(()=>{const _=w();if(_){const C=n.children;return typeof C=="function"&&C.length>0?At(()=>C(a?_:()=>{if(!At(w))throw ye("Show");return d()})):C}return n.fallback},void 0,void 0)}function we(n,a,d){let w=d.length,_=a.length,C=w,k=0,x=0,I=a[_-1].nextSibling,Q=null;for(;k<_||x<C;){if(a[k]===d[x]){k++,x++;continue}for(;a[_-1]===d[C-1];)_--,C--;if(_===k){const j=C<w?x?d[x-1].nextSibling:d[C-x]:I;for(;x<C;)n.insertBefore(d[x++],j)}else if(C===x)for(;k<_;)(!Q||!Q.has(a[k]))&&a[k].remove(),k++;else if(a[k]===d[C-1]&&d[x]===a[_-1]){const j=a[--_].nextSibling;n.insertBefore(d[x++],a[k++].nextSibling),n.insertBefore(d[--C],j),a[_]=d[C]}else{if(!Q){Q=new Map;let L=x;for(;L<C;)Q.set(d[L],L++)}const j=Q.get(a[k]);if(j!=null)if(x<j&&j<C){let L=k,W=1,X;for(;++L<_&&L<C&&!((X=Q.get(a[L]))==null||X!==j+W);)W++;if(W>j-x){const G=a[k];for(;x<j;)n.insertBefore(d[x++],G)}else n.replaceChild(d[x++],a[k++])}else k++;else a[k++].remove()}}}const ne="_$DX_DELEGATE";function be(n,a,d,w={}){let _;return de(C=>{_=C,a===document?n():et(a,n(),a.firstChild?null:void 0,d)},w.owner),()=>{_(),a.textContent=""}}function gt(n,a,d,w){let _;const C=()=>{const x=document.createElement("template");return x.innerHTML=n,x.content.firstChild},k=()=>(_||(_=C())).cloneNode(!0);return k.cloneNode=k,k}function re(n,a=window.document){const d=a[ne]||(a[ne]=new Set);for(let w=0,_=n.length;w<_;w++){const C=n[w];d.has(C)||(d.add(C),a.addEventListener(C,ve))}}function me(n,a,d,w){Array.isArray(d)?(n[`$$${a}`]=d[0],n[`$$${a}Data`]=d[1]):n[`$$${a}`]=d}function Xt(n,a,d){return At(()=>n(a,d))}function et(n,a,d,w){if(d!==void 0&&!w&&(w=[]),typeof a!="function")return Ft(n,a,w,d);mt(_=>Ft(n,a(),_,d),w)}function ve(n){let a=n.target;const d=`$$${n.type}`,w=n.target,_=n.currentTarget,C=I=>Object.defineProperty(n,"target",{configurable:!0,value:I}),k=()=>{const I=a[d];if(I&&!a.disabled){const Q=a[`${d}Data`];if(Q!==void 0?I.call(a,Q,n):I.call(a,n),n.cancelBubble)return}return a.host&&typeof a.host!="string"&&!a.host._$host&&a.contains(n.target)&&C(a.host),!0},x=()=>{for(;k()&&(a=a._$host||a.parentNode||a.host););};if(Object.defineProperty(n,"currentTarget",{configurable:!0,get(){return a||document}}),n.composedPath){const I=n.composedPath();C(I[0]);for(let Q=0;Q<I.length-2&&(a=I[Q],!!k());Q++){if(a._$host){a=a._$host,x();break}if(a.parentNode===_)break}}else x();C(w)}function Ft(n,a,d,w,_){for(;typeof d=="function";)d=d();if(a===d)return d;const C=typeof a,k=w!==void 0;if(n=k&&d[0]&&d[0].parentNode||n,C==="string"||C==="number"){if(C==="number"&&(a=a.toString(),a===d))return d;if(k){let x=d[0];x&&x.nodeType===3?x.data!==a&&(x.data=a):x=document.createTextNode(a),d=zt(n,d,w,x)}else d!==""&&typeof d=="string"?d=n.firstChild.data=a:d=n.textContent=a}else if(a==null||C==="boolean")d=zt(n,d,w);else{if(C==="function")return mt(()=>{let x=a();for(;typeof x=="function";)x=x();d=Ft(n,x,d,w)}),()=>d;if(Array.isArray(a)){const x=[],I=d&&Array.isArray(d);if(Yt(x,a,d,_))return mt(()=>d=Ft(n,x,d,w,!0)),()=>d;if(x.length===0){if(d=zt(n,d,w),k)return d}else I?d.length===0?oe(n,x,w):we(n,d,x):(d&&zt(n),oe(n,x));d=x}else if(a.nodeType){if(Array.isArray(d)){if(k)return d=zt(n,d,w,a);zt(n,d,null,a)}else d==null||d===""||!n.firstChild?n.appendChild(a):n.replaceChild(a,n.firstChild);d=a}}return d}function Yt(n,a,d,w){let _=!1;for(let C=0,k=a.length;C<k;C++){let x=a[C],I=d&&d[n.length],Q;if(!(x==null||x===!0||x===!1))if((Q=typeof x)=="object"&&x.nodeType)n.push(x);else if(Array.isArray(x))_=Yt(n,x,I)||_;else if(Q==="function")if(w){for(;typeof x=="function";)x=x();_=Yt(n,Array.isArray(x)?x:[x],Array.isArray(I)?I:[I])||_}else n.push(x),_=!0;else{const j=String(x);I&&I.nodeType===3&&I.data===j?n.push(I):n.push(document.createTextNode(j))}}return _}function oe(n,a,d=null){for(let w=0,_=a.length;w<_;w++)n.insertBefore(a[w],d)}function zt(n,a,d,w){if(d===void 0)return n.textContent="";const _=w||document.createTextNode("");if(a.length){let C=!1;for(let k=a.length-1;k>=0;k--){const x=a[k];if(_!==x){const I=x.parentNode===n;!C&&!k?I?n.replaceChild(_,x):n.insertBefore(_,d):I&&x.remove()}else C=!0}}else n.insertBefore(_,d);return[_]}class xe{constructor(a=!1){this.socket=null,this.reconnectTimeout=null,this.reconnectAttempts=0,this.maxReconnectAttempts=6,this.transferId=null,this.signature=null,this.onStatusCallback=null,this.onErrorCallback=null,this.onConnectionCallback=null,this.onScanCallback=null,this.wsBaseUrl=a?"transfer-status-test.zenobiapay.com":"transfer-status.zenobiapay.com"}getSignature(){return this.signature}getTransferId(){return this.transferId}async createTransfer(a,d){try{const w=await fetch(a,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(d)});if(!w.ok){const C=await w.json();throw new Error(C.message||"Failed to create transfer request")}const _=await w.json();return this.transferId=_.transferRequestId,this.signature=_.signature,_}catch(w){throw console.error("Error creating transfer request:",w),w instanceof Error?w:new Error("Failed to create transfer request")}}listenToTransfer(a,d,w,_,C,k){this.transferId=a,this.signature=d,w&&(this.onStatusCallback=w),_&&(this.onErrorCallback=_),C&&(this.onConnectionCallback=C),k&&(this.onScanCallback=k),this.connectWebSocket()}async createTransferAndListen(a,d,w,_,C,k){const x=await this.createTransfer(a,d);return this.listenToTransfer(x.transferRequestId,x.signature,w,_,C,k),x}connectWebSocket(){if(this.socket&&(this.socket.close(),this.socket=null,this.notifyConnectionStatus(!1)),!this.transferId||!this.signature){console.error("Cannot connect to WebSocket: Missing transfer ID or signature");return}try{const d=`${window.location.protocol==="https:"?"wss:":"ws:"}//${this.wsBaseUrl}/transfers/${this.transferId}/ws?token=${this.signature}`,w=new WebSocket(d);this.socket=w,w.onopen=()=>{this.notifyConnectionStatus(!0),this.reconnectAttempts=0},w.onclose=_=>{this.notifyConnectionStatus(!1),this.socket=null,_.code!==1e3&&this.reconnectAttempts<this.maxReconnectAttempts&&this.attemptReconnect()},w.onerror=_=>{console.error(`WebSocket error for transfer: ${this.transferId}`,_),this.notifyError("WebSocket error occurred")},w.onmessage=_=>{console.log(`WebSocket message received for transfer: ${this.transferId}`,_.data);try{const C=JSON.parse(_.data);C.type==="status"&&C.transfer?this.notifyStatus(C.transfer):C.type==="error"&&C.message?this.notifyError(C.message):C.type==="scan"?this.notifyScan(C):C.type==="ping"&&w.readyState===WebSocket.OPEN&&w.send(JSON.stringify({type:"pong"}))}catch{this.notifyError("Failed to parse message")}}}catch{this.notifyError("Failed to establish WebSocket connection")}}attemptReconnect(){this.reconnectAttempts++;const a=Math.min(1e3*Math.pow(2,this.reconnectAttempts-1),3e4);console.log(`Attempting to reconnect in ${a}ms (attempt ${this.reconnectAttempts})`),this.reconnectTimeout&&window.clearTimeout(this.reconnectTimeout),this.reconnectTimeout=window.setTimeout(()=>{console.log(`Reconnecting to WebSocket (attempt ${this.reconnectAttempts})...`),this.connectWebSocket()},a)}disconnect(){this.reconnectTimeout&&(window.clearTimeout(this.reconnectTimeout),this.reconnectTimeout=null),this.socket&&this.socket.readyState<2&&(console.log(`Closing WebSocket for transfer: ${this.transferId}`),this.socket.close(),this.socket=null,this.notifyConnectionStatus(!1)),this.transferId=null,this.signature=null}notifyConnectionStatus(a){this.onConnectionCallback&&this.onConnectionCallback(a)}notifyStatus(a){this.onStatusCallback&&this.onStatusCallback(a)}notifyError(a){this.onErrorCallback&&this.onErrorCallback(a)}notifyScan(a){this.onScanCallback&&this.onScanCallback(a)}}function _e(n){return n&&n.__esModule&&Object.prototype.hasOwnProperty.call(n,"default")?n.default:n}var Ut={exports:{}},Se=Ut.exports,ie;function Ce(){return ie||(ie=1,function(n,a){(function(d,w){n.exports=w()})(Se,()=>(()=>{var d={873:(k,x)=>{var I,Q,j=function(){var L=function(b,m){var h=b,e=pt[m],t=null,o=0,s=null,r=[],u={},f=function(c,p){t=function(i){for(var l=new Array(i),g=0;g<i;g+=1){l[g]=new Array(i);for(var S=0;S<i;S+=1)l[g][S]=null}return l}(o=4*h+17),y(0,0),y(o-7,0),y(0,o-7),P(),$(),A(c,p),h>=7&&z(c),s==null&&(s=E(h,e,r)),O(s,p)},y=function(c,p){for(var i=-1;i<=7;i+=1)if(!(c+i<=-1||o<=c+i))for(var l=-1;l<=7;l+=1)p+l<=-1||o<=p+l||(t[c+i][p+l]=0<=i&&i<=6&&(l==0||l==6)||0<=l&&l<=6&&(i==0||i==6)||2<=i&&i<=4&&2<=l&&l<=4)},$=function(){for(var c=8;c<o-8;c+=1)t[c][6]==null&&(t[c][6]=c%2==0);for(var p=8;p<o-8;p+=1)t[6][p]==null&&(t[6][p]=p%2==0)},P=function(){for(var c=nt.getPatternPosition(h),p=0;p<c.length;p+=1)for(var i=0;i<c.length;i+=1){var l=c[p],g=c[i];if(t[l][g]==null)for(var S=-2;S<=2;S+=1)for(var v=-2;v<=2;v+=1)t[l+S][g+v]=S==-2||S==2||v==-2||v==2||S==0&&v==0}},z=function(c){for(var p=nt.getBCHTypeNumber(h),i=0;i<18;i+=1){var l=!c&&(p>>i&1)==1;t[Math.floor(i/3)][i%3+o-8-3]=l}for(i=0;i<18;i+=1)l=!c&&(p>>i&1)==1,t[i%3+o-8-3][Math.floor(i/3)]=l},A=function(c,p){for(var i=e<<3|p,l=nt.getBCHTypeInfo(i),g=0;g<15;g+=1){var S=!c&&(l>>g&1)==1;g<6?t[g][8]=S:g<8?t[g+1][8]=S:t[o-15+g][8]=S}for(g=0;g<15;g+=1)S=!c&&(l>>g&1)==1,g<8?t[8][o-g-1]=S:g<9?t[8][15-g-1+1]=S:t[8][15-g-1]=S;t[o-8][8]=!c},O=function(c,p){for(var i=-1,l=o-1,g=7,S=0,v=nt.getMaskFunction(p),q=o-1;q>0;q-=2)for(q==6&&(q-=1);;){for(var D=0;D<2;D+=1)if(t[l][q-D]==null){var R=!1;S<c.length&&(R=(c[S]>>>g&1)==1),v(l,q-D)&&(R=!R),t[l][q-D]=R,(g-=1)==-1&&(S+=1,g=7)}if((l+=i)<0||o<=l){l-=i,i=-i;break}}},E=function(c,p,i){for(var l=wt.getRSBlocks(c,p),g=$t(),S=0;S<i.length;S+=1){var v=i[S];g.put(v.getMode(),4),g.put(v.getLength(),nt.getLengthInBits(v.getMode(),c)),v.write(g)}var q=0;for(S=0;S<l.length;S+=1)q+=l[S].dataCount;if(g.getLengthInBits()>8*q)throw"code length overflow. ("+g.getLengthInBits()+">"+8*q+")";for(g.getLengthInBits()+4<=8*q&&g.put(0,4);g.getLengthInBits()%8!=0;)g.putBit(!1);for(;!(g.getLengthInBits()>=8*q||(g.put(236,8),g.getLengthInBits()>=8*q));)g.put(17,8);return function(D,R){for(var N=0,Z=0,J=0,H=new Array(R.length),F=new Array(R.length),B=0;B<R.length;B+=1){var Y=R[B].dataCount,rt=R[B].totalCount-Y;Z=Math.max(Z,Y),J=Math.max(J,rt),H[B]=new Array(Y);for(var T=0;T<H[B].length;T+=1)H[B][T]=255&D.getBuffer()[T+N];N+=Y;var ut=nt.getErrorCorrectPolynomial(rt),lt=at(H[B],ut.getLength()-1).mod(ut);for(F[B]=new Array(ut.getLength()-1),T=0;T<F[B].length;T+=1){var st=T+lt.getLength()-F[B].length;F[B][T]=st>=0?lt.getAt(st):0}}var Qt=0;for(T=0;T<R.length;T+=1)Qt+=R[T].totalCount;var Dt=new Array(Qt),yt=0;for(T=0;T<Z;T+=1)for(B=0;B<R.length;B+=1)T<H[B].length&&(Dt[yt]=H[B][T],yt+=1);for(T=0;T<J;T+=1)for(B=0;B<R.length;B+=1)T<F[B].length&&(Dt[yt]=F[B][T],yt+=1);return Dt}(g,l)};u.addData=function(c,p){var i=null;switch(p=p||"Byte"){case"Numeric":i=xt(c);break;case"Alphanumeric":i=ht(c);break;case"Byte":i=_t(c);break;case"Kanji":i=Pt(c);break;default:throw"mode:"+p}r.push(i),s=null},u.isDark=function(c,p){if(c<0||o<=c||p<0||o<=p)throw c+","+p;return t[c][p]},u.getModuleCount=function(){return o},u.make=function(){if(h<1){for(var c=1;c<40;c++){for(var p=wt.getRSBlocks(c,e),i=$t(),l=0;l<r.length;l++){var g=r[l];i.put(g.getMode(),4),i.put(g.getLength(),nt.getLengthInBits(g.getMode(),c)),g.write(i)}var S=0;for(l=0;l<p.length;l++)S+=p[l].dataCount;if(i.getLengthInBits()<=8*S)break}h=c}f(!1,function(){for(var v=0,q=0,D=0;D<8;D+=1){f(!0,D);var R=nt.getLostPoint(u);(D==0||v>R)&&(v=R,q=D)}return q}())},u.createTableTag=function(c,p){c=c||2;var i="";i+='<table style="',i+=" border-width: 0px; border-style: none;",i+=" border-collapse: collapse;",i+=" padding: 0px; margin: "+(p=p===void 0?4*c:p)+"px;",i+='">',i+="<tbody>";for(var l=0;l<u.getModuleCount();l+=1){i+="<tr>";for(var g=0;g<u.getModuleCount();g+=1)i+='<td style="',i+=" border-width: 0px; border-style: none;",i+=" border-collapse: collapse;",i+=" padding: 0px; margin: 0px;",i+=" width: "+c+"px;",i+=" height: "+c+"px;",i+=" background-color: ",i+=u.isDark(l,g)?"#000000":"#ffffff",i+=";",i+='"/>';i+="</tr>"}return(i+="</tbody>")+"</table>"},u.createSvgTag=function(c,p,i,l){var g={};typeof arguments[0]=="object"&&(c=(g=arguments[0]).cellSize,p=g.margin,i=g.alt,l=g.title),c=c||2,p=p===void 0?4*c:p,(i=typeof i=="string"?{text:i}:i||{}).text=i.text||null,i.id=i.text?i.id||"qrcode-description":null,(l=typeof l=="string"?{text:l}:l||{}).text=l.text||null,l.id=l.text?l.id||"qrcode-title":null;var S,v,q,D,R=u.getModuleCount()*c+2*p,N="";for(D="l"+c+",0 0,"+c+" -"+c+",0 0,-"+c+"z ",N+='<svg version="1.1" xmlns="http://www.w3.org/2000/svg"',N+=g.scalable?"":' width="'+R+'px" height="'+R+'px"',N+=' viewBox="0 0 '+R+" "+R+'" ',N+=' preserveAspectRatio="xMinYMin meet"',N+=l.text||i.text?' role="img" aria-labelledby="'+M([l.id,i.id].join(" ").trim())+'"':"",N+=">",N+=l.text?'<title id="'+M(l.id)+'">'+M(l.text)+"</title>":"",N+=i.text?'<description id="'+M(i.id)+'">'+M(i.text)+"</description>":"",N+='<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>',N+='<path d="',v=0;v<u.getModuleCount();v+=1)for(q=v*c+p,S=0;S<u.getModuleCount();S+=1)u.isDark(v,S)&&(N+="M"+(S*c+p)+","+q+D);return(N+='" stroke="transparent" fill="black"/>')+"</svg>"},u.createDataURL=function(c,p){c=c||2,p=p===void 0?4*c:p;var i=u.getModuleCount()*c+2*p,l=p,g=i-p;return St(i,i,function(S,v){if(l<=S&&S<g&&l<=v&&v<g){var q=Math.floor((S-l)/c),D=Math.floor((v-l)/c);return u.isDark(D,q)?0:1}return 1})},u.createImgTag=function(c,p,i){c=c||2,p=p===void 0?4*c:p;var l=u.getModuleCount()*c+2*p,g="";return g+="<img",g+=' src="',g+=u.createDataURL(c,p),g+='"',g+=' width="',g+=l,g+='"',g+=' height="',g+=l,g+='"',i&&(g+=' alt="',g+=M(i),g+='"'),g+"/>"};var M=function(c){for(var p="",i=0;i<c.length;i+=1){var l=c.charAt(i);switch(l){case"<":p+="&lt;";break;case">":p+="&gt;";break;case"&":p+="&amp;";break;case'"':p+="&quot;";break;default:p+=l}}return p};return u.createASCII=function(c,p){if((c=c||1)<2)return function(H){H=H===void 0?2:H;var F,B,Y,rt,T,ut=1*u.getModuleCount()+2*H,lt=H,st=ut-H,Qt={"██":"█","█ ":"▀"," █":"▄","  ":" "},Dt={"██":"▀","█ ":"▀"," █":" ","  ":" "},yt="";for(F=0;F<ut;F+=2){for(Y=Math.floor((F-lt)/1),rt=Math.floor((F+1-lt)/1),B=0;B<ut;B+=1)T="█",lt<=B&&B<st&&lt<=F&&F<st&&u.isDark(Y,Math.floor((B-lt)/1))&&(T=" "),lt<=B&&B<st&&lt<=F+1&&F+1<st&&u.isDark(rt,Math.floor((B-lt)/1))?T+=" ":T+="█",yt+=H<1&&F+1>=st?Dt[T]:Qt[T];yt+=`
`}return ut%2&&H>0?yt.substring(0,yt.length-ut-1)+Array(ut+1).join("▀"):yt.substring(0,yt.length-1)}(p);c-=1,p=p===void 0?2*c:p;var i,l,g,S,v=u.getModuleCount()*c+2*p,q=p,D=v-p,R=Array(c+1).join("██"),N=Array(c+1).join("  "),Z="",J="";for(i=0;i<v;i+=1){for(g=Math.floor((i-q)/c),J="",l=0;l<v;l+=1)S=1,q<=l&&l<D&&q<=i&&i<D&&u.isDark(g,Math.floor((l-q)/c))&&(S=0),J+=S?R:N;for(g=0;g<c;g+=1)Z+=J+`
`}return Z.substring(0,Z.length-1)},u.renderTo2dContext=function(c,p){p=p||2;for(var i=u.getModuleCount(),l=0;l<i;l++)for(var g=0;g<i;g++)c.fillStyle=u.isDark(l,g)?"black":"white",c.fillRect(l*p,g*p,p,p)},u};L.stringToBytes=(L.stringToBytesFuncs={default:function(b){for(var m=[],h=0;h<b.length;h+=1){var e=b.charCodeAt(h);m.push(255&e)}return m}}).default,L.createStringToBytes=function(b,m){var h=function(){for(var t=Et(b),o=function(){var $=t.read();if($==-1)throw"eof";return $},s=0,r={};;){var u=t.read();if(u==-1)break;var f=o(),y=o()<<8|o();r[String.fromCharCode(u<<8|f)]=y,s+=1}if(s!=m)throw s+" != "+m;return r}(),e=63;return function(t){for(var o=[],s=0;s<t.length;s+=1){var r=t.charCodeAt(s);if(r<128)o.push(r);else{var u=h[t.charAt(s)];typeof u=="number"?(255&u)==u?o.push(u):(o.push(u>>>8),o.push(255&u)):o.push(e)}}return o}};var W,X,G,U,dt,pt={L:1,M:0,Q:3,H:2},nt=(W=[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],X=1335,G=7973,dt=function(b){for(var m=0;b!=0;)m+=1,b>>>=1;return m},(U={}).getBCHTypeInfo=function(b){for(var m=b<<10;dt(m)-dt(X)>=0;)m^=X<<dt(m)-dt(X);return 21522^(b<<10|m)},U.getBCHTypeNumber=function(b){for(var m=b<<12;dt(m)-dt(G)>=0;)m^=G<<dt(m)-dt(G);return b<<12|m},U.getPatternPosition=function(b){return W[b-1]},U.getMaskFunction=function(b){switch(b){case 0:return function(m,h){return(m+h)%2==0};case 1:return function(m,h){return m%2==0};case 2:return function(m,h){return h%3==0};case 3:return function(m,h){return(m+h)%3==0};case 4:return function(m,h){return(Math.floor(m/2)+Math.floor(h/3))%2==0};case 5:return function(m,h){return m*h%2+m*h%3==0};case 6:return function(m,h){return(m*h%2+m*h%3)%2==0};case 7:return function(m,h){return(m*h%3+(m+h)%2)%2==0};default:throw"bad maskPattern:"+b}},U.getErrorCorrectPolynomial=function(b){for(var m=at([1],0),h=0;h<b;h+=1)m=m.multiply(at([1,V.gexp(h)],0));return m},U.getLengthInBits=function(b,m){if(1<=m&&m<10)switch(b){case 1:return 10;case 2:return 9;case 4:case 8:return 8;default:throw"mode:"+b}else if(m<27)switch(b){case 1:return 12;case 2:return 11;case 4:return 16;case 8:return 10;default:throw"mode:"+b}else{if(!(m<41))throw"type:"+m;switch(b){case 1:return 14;case 2:return 13;case 4:return 16;case 8:return 12;default:throw"mode:"+b}}},U.getLostPoint=function(b){for(var m=b.getModuleCount(),h=0,e=0;e<m;e+=1)for(var t=0;t<m;t+=1){for(var o=0,s=b.isDark(e,t),r=-1;r<=1;r+=1)if(!(e+r<0||m<=e+r))for(var u=-1;u<=1;u+=1)t+u<0||m<=t+u||r==0&&u==0||s==b.isDark(e+r,t+u)&&(o+=1);o>5&&(h+=3+o-5)}for(e=0;e<m-1;e+=1)for(t=0;t<m-1;t+=1){var f=0;b.isDark(e,t)&&(f+=1),b.isDark(e+1,t)&&(f+=1),b.isDark(e,t+1)&&(f+=1),b.isDark(e+1,t+1)&&(f+=1),f!=0&&f!=4||(h+=3)}for(e=0;e<m;e+=1)for(t=0;t<m-6;t+=1)b.isDark(e,t)&&!b.isDark(e,t+1)&&b.isDark(e,t+2)&&b.isDark(e,t+3)&&b.isDark(e,t+4)&&!b.isDark(e,t+5)&&b.isDark(e,t+6)&&(h+=40);for(t=0;t<m;t+=1)for(e=0;e<m-6;e+=1)b.isDark(e,t)&&!b.isDark(e+1,t)&&b.isDark(e+2,t)&&b.isDark(e+3,t)&&b.isDark(e+4,t)&&!b.isDark(e+5,t)&&b.isDark(e+6,t)&&(h+=40);var y=0;for(t=0;t<m;t+=1)for(e=0;e<m;e+=1)b.isDark(e,t)&&(y+=1);return h+Math.abs(100*y/m/m-50)/5*10},U),V=function(){for(var b=new Array(256),m=new Array(256),h=0;h<8;h+=1)b[h]=1<<h;for(h=8;h<256;h+=1)b[h]=b[h-4]^b[h-5]^b[h-6]^b[h-8];for(h=0;h<255;h+=1)m[b[h]]=h;return{glog:function(e){if(e<1)throw"glog("+e+")";return m[e]},gexp:function(e){for(;e<0;)e+=255;for(;e>=256;)e-=255;return b[e]}}}();function at(b,m){if(b.length===void 0)throw b.length+"/"+m;var h=function(){for(var t=0;t<b.length&&b[t]==0;)t+=1;for(var o=new Array(b.length-t+m),s=0;s<b.length-t;s+=1)o[s]=b[s+t];return o}(),e={getAt:function(t){return h[t]},getLength:function(){return h.length},multiply:function(t){for(var o=new Array(e.getLength()+t.getLength()-1),s=0;s<e.getLength();s+=1)for(var r=0;r<t.getLength();r+=1)o[s+r]^=V.gexp(V.glog(e.getAt(s))+V.glog(t.getAt(r)));return at(o,0)},mod:function(t){if(e.getLength()-t.getLength()<0)return e;for(var o=V.glog(e.getAt(0))-V.glog(t.getAt(0)),s=new Array(e.getLength()),r=0;r<e.getLength();r+=1)s[r]=e.getAt(r);for(r=0;r<t.getLength();r+=1)s[r]^=V.gexp(V.glog(t.getAt(r))+o);return at(s,0).mod(t)}};return e}var wt=function(){var b=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12,7,37,13],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]],m=function(e,t){var o={};return o.totalCount=e,o.dataCount=t,o},h={getRSBlocks:function(e,t){var o=function(z,A){switch(A){case pt.L:return b[4*(z-1)+0];case pt.M:return b[4*(z-1)+1];case pt.Q:return b[4*(z-1)+2];case pt.H:return b[4*(z-1)+3];default:return}}(e,t);if(o===void 0)throw"bad rs block @ typeNumber:"+e+"/errorCorrectionLevel:"+t;for(var s=o.length/3,r=[],u=0;u<s;u+=1)for(var f=o[3*u+0],y=o[3*u+1],$=o[3*u+2],P=0;P<f;P+=1)r.push(m(y,$));return r}};return h}(),$t=function(){var b=[],m=0,h={getBuffer:function(){return b},getAt:function(e){var t=Math.floor(e/8);return(b[t]>>>7-e%8&1)==1},put:function(e,t){for(var o=0;o<t;o+=1)h.putBit((e>>>t-o-1&1)==1)},getLengthInBits:function(){return m},putBit:function(e){var t=Math.floor(m/8);b.length<=t&&b.push(0),e&&(b[t]|=128>>>m%8),m+=1}};return h},xt=function(b){var m=b,h={getMode:function(){return 1},getLength:function(o){return m.length},write:function(o){for(var s=m,r=0;r+2<s.length;)o.put(e(s.substring(r,r+3)),10),r+=3;r<s.length&&(s.length-r==1?o.put(e(s.substring(r,r+1)),4):s.length-r==2&&o.put(e(s.substring(r,r+2)),7))}},e=function(o){for(var s=0,r=0;r<o.length;r+=1)s=10*s+t(o.charAt(r));return s},t=function(o){if("0"<=o&&o<="9")return o.charCodeAt(0)-48;throw"illegal char :"+o};return h},ht=function(b){var m=b,h={getMode:function(){return 2},getLength:function(t){return m.length},write:function(t){for(var o=m,s=0;s+1<o.length;)t.put(45*e(o.charAt(s))+e(o.charAt(s+1)),11),s+=2;s<o.length&&t.put(e(o.charAt(s)),6)}},e=function(t){if("0"<=t&&t<="9")return t.charCodeAt(0)-48;if("A"<=t&&t<="Z")return t.charCodeAt(0)-65+10;switch(t){case" ":return 36;case"$":return 37;case"%":return 38;case"*":return 39;case"+":return 40;case"-":return 41;case".":return 42;case"/":return 43;case":":return 44;default:throw"illegal char :"+t}};return h},_t=function(b){var m=L.stringToBytes(b);return{getMode:function(){return 4},getLength:function(h){return m.length},write:function(h){for(var e=0;e<m.length;e+=1)h.put(m[e],8)}}},Pt=function(b){var m=L.stringToBytesFuncs.SJIS;if(!m)throw"sjis not supported.";(function(){var t=m("友");if(t.length!=2||(t[0]<<8|t[1])!=38726)throw"sjis not supported."})();var h=m(b),e={getMode:function(){return 8},getLength:function(t){return~~(h.length/2)},write:function(t){for(var o=h,s=0;s+1<o.length;){var r=(255&o[s])<<8|255&o[s+1];if(33088<=r&&r<=40956)r-=33088;else{if(!(57408<=r&&r<=60351))throw"illegal char at "+(s+1)+"/"+r;r-=49472}r=192*(r>>>8&255)+(255&r),t.put(r,13),s+=2}if(s<o.length)throw"illegal char at "+(s+1)}};return e},kt=function(){var b=[],m={writeByte:function(h){b.push(255&h)},writeShort:function(h){m.writeByte(h),m.writeByte(h>>>8)},writeBytes:function(h,e,t){e=e||0,t=t||h.length;for(var o=0;o<t;o+=1)m.writeByte(h[o+e])},writeString:function(h){for(var e=0;e<h.length;e+=1)m.writeByte(h.charCodeAt(e))},toByteArray:function(){return b},toString:function(){var h="";h+="[";for(var e=0;e<b.length;e+=1)e>0&&(h+=","),h+=b[e];return h+"]"}};return m},Et=function(b){var m=b,h=0,e=0,t=0,o={read:function(){for(;t<8;){if(h>=m.length){if(t==0)return-1;throw"unexpected end of file./"+t}var r=m.charAt(h);if(h+=1,r=="=")return t=0,-1;r.match(/^\s$/)||(e=e<<6|s(r.charCodeAt(0)),t+=6)}var u=e>>>t-8&255;return t-=8,u}},s=function(r){if(65<=r&&r<=90)return r-65;if(97<=r&&r<=122)return r-97+26;if(48<=r&&r<=57)return r-48+52;if(r==43)return 62;if(r==47)return 63;throw"c:"+r};return o},St=function(b,m,h){for(var e=function(y,$){var P=y,z=$,A=new Array(y*$),O={setPixel:function(c,p,i){A[p*P+c]=i},write:function(c){c.writeString("GIF87a"),c.writeShort(P),c.writeShort(z),c.writeByte(128),c.writeByte(0),c.writeByte(0),c.writeByte(0),c.writeByte(0),c.writeByte(0),c.writeByte(255),c.writeByte(255),c.writeByte(255),c.writeString(","),c.writeShort(0),c.writeShort(0),c.writeShort(P),c.writeShort(z),c.writeByte(0);var p=E(2);c.writeByte(2);for(var i=0;p.length-i>255;)c.writeByte(255),c.writeBytes(p,i,255),i+=255;c.writeByte(p.length-i),c.writeBytes(p,i,p.length-i),c.writeByte(0),c.writeString(";")}},E=function(c){for(var p=1<<c,i=1+(1<<c),l=c+1,g=M(),S=0;S<p;S+=1)g.add(String.fromCharCode(S));g.add(String.fromCharCode(p)),g.add(String.fromCharCode(i));var v,q,D,R=kt(),N=(v=R,q=0,D=0,{write:function(F,B){if(F>>>B)throw"length over";for(;q+B>=8;)v.writeByte(255&(F<<q|D)),B-=8-q,F>>>=8-q,D=0,q=0;D|=F<<q,q+=B},flush:function(){q>0&&v.writeByte(D)}});N.write(p,l);var Z=0,J=String.fromCharCode(A[Z]);for(Z+=1;Z<A.length;){var H=String.fromCharCode(A[Z]);Z+=1,g.contains(J+H)?J+=H:(N.write(g.indexOf(J),l),g.size()<4095&&(g.size()==1<<l&&(l+=1),g.add(J+H)),J=H)}return N.write(g.indexOf(J),l),N.write(i,l),N.flush(),R.toByteArray()},M=function(){var c={},p=0,i={add:function(l){if(i.contains(l))throw"dup key:"+l;c[l]=p,p+=1},size:function(){return p},indexOf:function(l){return c[l]},contains:function(l){return c[l]!==void 0}};return i};return O}(b,m),t=0;t<m;t+=1)for(var o=0;o<b;o+=1)e.setPixel(o,t,h(o,t));var s=kt();e.write(s);for(var r=function(){var y=0,$=0,P=0,z="",A={},O=function(M){z+=String.fromCharCode(E(63&M))},E=function(M){if(!(M<0)){if(M<26)return 65+M;if(M<52)return M-26+97;if(M<62)return M-52+48;if(M==62)return 43;if(M==63)return 47}throw"n:"+M};return A.writeByte=function(M){for(y=y<<8|255&M,$+=8,P+=1;$>=6;)O(y>>>$-6),$-=6},A.flush=function(){if($>0&&(O(y<<6-$),y=0,$=0),P%3!=0)for(var M=3-P%3,c=0;c<M;c+=1)z+="="},A.toString=function(){return z},A}(),u=s.toByteArray(),f=0;f<u.length;f+=1)r.writeByte(u[f]);return r.flush(),"data:image/gif;base64,"+r};return L}();j.stringToBytesFuncs["UTF-8"]=function(L){return function(W){for(var X=[],G=0;G<W.length;G++){var U=W.charCodeAt(G);U<128?X.push(U):U<2048?X.push(192|U>>6,128|63&U):U<55296||U>=57344?X.push(224|U>>12,128|U>>6&63,128|63&U):(G++,U=65536+((1023&U)<<10|1023&W.charCodeAt(G)),X.push(240|U>>18,128|U>>12&63,128|U>>6&63,128|63&U))}return X}(L)},(Q=typeof(I=function(){return j})=="function"?I.apply(x,[]):I)===void 0||(k.exports=Q)}},w={};function _(k){var x=w[k];if(x!==void 0)return x.exports;var I=w[k]={exports:{}};return d[k](I,I.exports,_),I.exports}_.n=k=>{var x=k&&k.__esModule?()=>k.default:()=>k;return _.d(x,{a:x}),x},_.d=(k,x)=>{for(var I in x)_.o(x,I)&&!_.o(k,I)&&Object.defineProperty(k,I,{enumerable:!0,get:x[I]})},_.o=(k,x)=>Object.prototype.hasOwnProperty.call(k,x);var C={};return(()=>{_.d(C,{default:()=>m});const k=h=>!!h&&typeof h=="object"&&!Array.isArray(h);function x(h,...e){if(!e.length)return h;const t=e.shift();return t!==void 0&&k(h)&&k(t)?(h=Object.assign({},h),Object.keys(t).forEach(o=>{const s=h[o],r=t[o];Array.isArray(s)&&Array.isArray(r)?h[o]=r:k(s)&&k(r)?h[o]=x(Object.assign({},s),r):h[o]=r}),x(h,...e)):h}function I(h,e){const t=document.createElement("a");t.download=e,t.href=h,document.body.appendChild(t),t.click(),document.body.removeChild(t)}const Q={L:.07,M:.15,Q:.25,H:.3};class j{constructor({svg:e,type:t,window:o}){this._svg=e,this._type=t,this._window=o}draw(e,t,o,s){let r;switch(this._type){case"dots":r=this._drawDot;break;case"classy":r=this._drawClassy;break;case"classy-rounded":r=this._drawClassyRounded;break;case"rounded":r=this._drawRounded;break;case"extra-rounded":r=this._drawExtraRounded;break;default:r=this._drawSquare}r.call(this,{x:e,y:t,size:o,getNeighbor:s})}_rotateFigure({x:e,y:t,size:o,rotation:s=0,draw:r}){var u;const f=e+o/2,y=t+o/2;r(),(u=this._element)===null||u===void 0||u.setAttribute("transform",`rotate(${180*s/Math.PI},${f},${y})`)}_basicDot(e){const{size:t,x:o,y:s}=e;this._rotateFigure(Object.assign(Object.assign({},e),{draw:()=>{this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","circle"),this._element.setAttribute("cx",String(o+t/2)),this._element.setAttribute("cy",String(s+t/2)),this._element.setAttribute("r",String(t/2))}}))}_basicSquare(e){const{size:t,x:o,y:s}=e;this._rotateFigure(Object.assign(Object.assign({},e),{draw:()=>{this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","rect"),this._element.setAttribute("x",String(o)),this._element.setAttribute("y",String(s)),this._element.setAttribute("width",String(t)),this._element.setAttribute("height",String(t))}}))}_basicSideRounded(e){const{size:t,x:o,y:s}=e;this._rotateFigure(Object.assign(Object.assign({},e),{draw:()=>{this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","path"),this._element.setAttribute("d",`M ${o} ${s}v ${t}h `+t/2+`a ${t/2} ${t/2}, 0, 0, 0, 0 ${-t}`)}}))}_basicCornerRounded(e){const{size:t,x:o,y:s}=e;this._rotateFigure(Object.assign(Object.assign({},e),{draw:()=>{this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","path"),this._element.setAttribute("d",`M ${o} ${s}v ${t}h ${t}v `+-t/2+`a ${t/2} ${t/2}, 0, 0, 0, ${-t/2} ${-t/2}`)}}))}_basicCornerExtraRounded(e){const{size:t,x:o,y:s}=e;this._rotateFigure(Object.assign(Object.assign({},e),{draw:()=>{this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","path"),this._element.setAttribute("d",`M ${o} ${s}v ${t}h ${t}a ${t} ${t}, 0, 0, 0, ${-t} ${-t}`)}}))}_basicCornersRounded(e){const{size:t,x:o,y:s}=e;this._rotateFigure(Object.assign(Object.assign({},e),{draw:()=>{this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","path"),this._element.setAttribute("d",`M ${o} ${s}v `+t/2+`a ${t/2} ${t/2}, 0, 0, 0, ${t/2} ${t/2}h `+t/2+"v "+-t/2+`a ${t/2} ${t/2}, 0, 0, 0, ${-t/2} ${-t/2}`)}}))}_drawDot({x:e,y:t,size:o}){this._basicDot({x:e,y:t,size:o,rotation:0})}_drawSquare({x:e,y:t,size:o}){this._basicSquare({x:e,y:t,size:o,rotation:0})}_drawRounded({x:e,y:t,size:o,getNeighbor:s}){const r=s?+s(-1,0):0,u=s?+s(1,0):0,f=s?+s(0,-1):0,y=s?+s(0,1):0,$=r+u+f+y;if($!==0)if($>2||r&&u||f&&y)this._basicSquare({x:e,y:t,size:o,rotation:0});else{if($===2){let P=0;return r&&f?P=Math.PI/2:f&&u?P=Math.PI:u&&y&&(P=-Math.PI/2),void this._basicCornerRounded({x:e,y:t,size:o,rotation:P})}if($===1){let P=0;return f?P=Math.PI/2:u?P=Math.PI:y&&(P=-Math.PI/2),void this._basicSideRounded({x:e,y:t,size:o,rotation:P})}}else this._basicDot({x:e,y:t,size:o,rotation:0})}_drawExtraRounded({x:e,y:t,size:o,getNeighbor:s}){const r=s?+s(-1,0):0,u=s?+s(1,0):0,f=s?+s(0,-1):0,y=s?+s(0,1):0,$=r+u+f+y;if($!==0)if($>2||r&&u||f&&y)this._basicSquare({x:e,y:t,size:o,rotation:0});else{if($===2){let P=0;return r&&f?P=Math.PI/2:f&&u?P=Math.PI:u&&y&&(P=-Math.PI/2),void this._basicCornerExtraRounded({x:e,y:t,size:o,rotation:P})}if($===1){let P=0;return f?P=Math.PI/2:u?P=Math.PI:y&&(P=-Math.PI/2),void this._basicSideRounded({x:e,y:t,size:o,rotation:P})}}else this._basicDot({x:e,y:t,size:o,rotation:0})}_drawClassy({x:e,y:t,size:o,getNeighbor:s}){const r=s?+s(-1,0):0,u=s?+s(1,0):0,f=s?+s(0,-1):0,y=s?+s(0,1):0;r+u+f+y!==0?r||f?u||y?this._basicSquare({x:e,y:t,size:o,rotation:0}):this._basicCornerRounded({x:e,y:t,size:o,rotation:Math.PI/2}):this._basicCornerRounded({x:e,y:t,size:o,rotation:-Math.PI/2}):this._basicCornersRounded({x:e,y:t,size:o,rotation:Math.PI/2})}_drawClassyRounded({x:e,y:t,size:o,getNeighbor:s}){const r=s?+s(-1,0):0,u=s?+s(1,0):0,f=s?+s(0,-1):0,y=s?+s(0,1):0;r+u+f+y!==0?r||f?u||y?this._basicSquare({x:e,y:t,size:o,rotation:0}):this._basicCornerExtraRounded({x:e,y:t,size:o,rotation:Math.PI/2}):this._basicCornerExtraRounded({x:e,y:t,size:o,rotation:-Math.PI/2}):this._basicCornersRounded({x:e,y:t,size:o,rotation:Math.PI/2})}}const L={dot:"dot",square:"square",extraRounded:"extra-rounded"},W=Object.values(L);class X{constructor({svg:e,type:t,window:o}){this._svg=e,this._type=t,this._window=o}draw(e,t,o,s){let r;switch(this._type){case L.square:r=this._drawSquare;break;case L.extraRounded:r=this._drawExtraRounded;break;default:r=this._drawDot}r.call(this,{x:e,y:t,size:o,rotation:s})}_rotateFigure({x:e,y:t,size:o,rotation:s=0,draw:r}){var u;const f=e+o/2,y=t+o/2;r(),(u=this._element)===null||u===void 0||u.setAttribute("transform",`rotate(${180*s/Math.PI},${f},${y})`)}_basicDot(e){const{size:t,x:o,y:s}=e,r=t/7;this._rotateFigure(Object.assign(Object.assign({},e),{draw:()=>{this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","path"),this._element.setAttribute("clip-rule","evenodd"),this._element.setAttribute("d",`M ${o+t/2} ${s}a ${t/2} ${t/2} 0 1 0 0.1 0zm 0 ${r}a ${t/2-r} ${t/2-r} 0 1 1 -0.1 0Z`)}}))}_basicSquare(e){const{size:t,x:o,y:s}=e,r=t/7;this._rotateFigure(Object.assign(Object.assign({},e),{draw:()=>{this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","path"),this._element.setAttribute("clip-rule","evenodd"),this._element.setAttribute("d",`M ${o} ${s}v ${t}h ${t}v `+-t+`zM ${o+r} ${s+r}h `+(t-2*r)+"v "+(t-2*r)+"h "+(2*r-t)+"z")}}))}_basicExtraRounded(e){const{size:t,x:o,y:s}=e,r=t/7;this._rotateFigure(Object.assign(Object.assign({},e),{draw:()=>{this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","path"),this._element.setAttribute("clip-rule","evenodd"),this._element.setAttribute("d",`M ${o} ${s+2.5*r}v `+2*r+`a ${2.5*r} ${2.5*r}, 0, 0, 0, ${2.5*r} ${2.5*r}h `+2*r+`a ${2.5*r} ${2.5*r}, 0, 0, 0, ${2.5*r} ${2.5*-r}v `+-2*r+`a ${2.5*r} ${2.5*r}, 0, 0, 0, ${2.5*-r} ${2.5*-r}h `+-2*r+`a ${2.5*r} ${2.5*r}, 0, 0, 0, ${2.5*-r} ${2.5*r}M ${o+2.5*r} ${s+r}h `+2*r+`a ${1.5*r} ${1.5*r}, 0, 0, 1, ${1.5*r} ${1.5*r}v `+2*r+`a ${1.5*r} ${1.5*r}, 0, 0, 1, ${1.5*-r} ${1.5*r}h `+-2*r+`a ${1.5*r} ${1.5*r}, 0, 0, 1, ${1.5*-r} ${1.5*-r}v `+-2*r+`a ${1.5*r} ${1.5*r}, 0, 0, 1, ${1.5*r} ${1.5*-r}`)}}))}_drawDot({x:e,y:t,size:o,rotation:s}){this._basicDot({x:e,y:t,size:o,rotation:s})}_drawSquare({x:e,y:t,size:o,rotation:s}){this._basicSquare({x:e,y:t,size:o,rotation:s})}_drawExtraRounded({x:e,y:t,size:o,rotation:s}){this._basicExtraRounded({x:e,y:t,size:o,rotation:s})}}const G={dot:"dot",square:"square"},U=Object.values(G);class dt{constructor({svg:e,type:t,window:o}){this._svg=e,this._type=t,this._window=o}draw(e,t,o,s){let r;r=this._type===G.square?this._drawSquare:this._drawDot,r.call(this,{x:e,y:t,size:o,rotation:s})}_rotateFigure({x:e,y:t,size:o,rotation:s=0,draw:r}){var u;const f=e+o/2,y=t+o/2;r(),(u=this._element)===null||u===void 0||u.setAttribute("transform",`rotate(${180*s/Math.PI},${f},${y})`)}_basicDot(e){const{size:t,x:o,y:s}=e;this._rotateFigure(Object.assign(Object.assign({},e),{draw:()=>{this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","circle"),this._element.setAttribute("cx",String(o+t/2)),this._element.setAttribute("cy",String(s+t/2)),this._element.setAttribute("r",String(t/2))}}))}_basicSquare(e){const{size:t,x:o,y:s}=e;this._rotateFigure(Object.assign(Object.assign({},e),{draw:()=>{this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","rect"),this._element.setAttribute("x",String(o)),this._element.setAttribute("y",String(s)),this._element.setAttribute("width",String(t)),this._element.setAttribute("height",String(t))}}))}_drawDot({x:e,y:t,size:o,rotation:s}){this._basicDot({x:e,y:t,size:o,rotation:s})}_drawSquare({x:e,y:t,size:o,rotation:s}){this._basicSquare({x:e,y:t,size:o,rotation:s})}}const pt="circle",nt=[[1,1,1,1,1,1,1],[1,0,0,0,0,0,1],[1,0,0,0,0,0,1],[1,0,0,0,0,0,1],[1,0,0,0,0,0,1],[1,0,0,0,0,0,1],[1,1,1,1,1,1,1]],V=[[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,1,1,1,0,0],[0,0,1,1,1,0,0],[0,0,1,1,1,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0]];class at{constructor(e,t){this._roundSize=o=>this._options.dotsOptions.roundSize?Math.floor(o):o,this._window=t,this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","svg"),this._element.setAttribute("width",String(e.width)),this._element.setAttribute("height",String(e.height)),this._element.setAttribute("xmlns:xlink","http://www.w3.org/1999/xlink"),e.dotsOptions.roundSize||this._element.setAttribute("shape-rendering","crispEdges"),this._element.setAttribute("viewBox",`0 0 ${e.width} ${e.height}`),this._defs=this._window.document.createElementNS("http://www.w3.org/2000/svg","defs"),this._element.appendChild(this._defs),this._imageUri=e.image,this._instanceId=at.instanceCount++,this._options=e}get width(){return this._options.width}get height(){return this._options.height}getElement(){return this._element}async drawQR(e){const t=e.getModuleCount(),o=Math.min(this._options.width,this._options.height)-2*this._options.margin,s=this._options.shape===pt?o/Math.sqrt(2):o,r=this._roundSize(s/t);let u={hideXDots:0,hideYDots:0,width:0,height:0};if(this._qr=e,this._options.image){if(await this.loadImage(),!this._image)return;const{imageOptions:f,qrOptions:y}=this._options,$=f.imageSize*Q[y.errorCorrectionLevel],P=Math.floor($*t*t);u=function({originalHeight:z,originalWidth:A,maxHiddenDots:O,maxHiddenAxisDots:E,dotSize:M}){const c={x:0,y:0},p={x:0,y:0};if(z<=0||A<=0||O<=0||M<=0)return{height:0,width:0,hideYDots:0,hideXDots:0};const i=z/A;return c.x=Math.floor(Math.sqrt(O/i)),c.x<=0&&(c.x=1),E&&E<c.x&&(c.x=E),c.x%2==0&&c.x--,p.x=c.x*M,c.y=1+2*Math.ceil((c.x*i-1)/2),p.y=Math.round(p.x*i),(c.y*c.x>O||E&&E<c.y)&&(E&&E<c.y?(c.y=E,c.y%2==0&&c.x--):c.y-=2,p.y=c.y*M,c.x=1+2*Math.ceil((c.y/i-1)/2),p.x=Math.round(p.y/i)),{height:p.y,width:p.x,hideYDots:c.y,hideXDots:c.x}}({originalWidth:this._image.width,originalHeight:this._image.height,maxHiddenDots:P,maxHiddenAxisDots:t-14,dotSize:r})}this.drawBackground(),this.drawDots((f,y)=>{var $,P,z,A,O,E;return!(this._options.imageOptions.hideBackgroundDots&&f>=(t-u.hideYDots)/2&&f<(t+u.hideYDots)/2&&y>=(t-u.hideXDots)/2&&y<(t+u.hideXDots)/2||!(($=nt[f])===null||$===void 0)&&$[y]||!((P=nt[f-t+7])===null||P===void 0)&&P[y]||!((z=nt[f])===null||z===void 0)&&z[y-t+7]||!((A=V[f])===null||A===void 0)&&A[y]||!((O=V[f-t+7])===null||O===void 0)&&O[y]||!((E=V[f])===null||E===void 0)&&E[y-t+7])}),this.drawCorners(),this._options.image&&await this.drawImage({width:u.width,height:u.height,count:t,dotSize:r})}drawBackground(){var e,t,o;const s=this._element,r=this._options;if(s){const u=(e=r.backgroundOptions)===null||e===void 0?void 0:e.gradient,f=(t=r.backgroundOptions)===null||t===void 0?void 0:t.color;let y=r.height,$=r.width;if(u||f){const P=this._window.document.createElementNS("http://www.w3.org/2000/svg","rect");this._backgroundClipPath=this._window.document.createElementNS("http://www.w3.org/2000/svg","clipPath"),this._backgroundClipPath.setAttribute("id",`clip-path-background-color-${this._instanceId}`),this._defs.appendChild(this._backgroundClipPath),!((o=r.backgroundOptions)===null||o===void 0)&&o.round&&(y=$=Math.min(r.width,r.height),P.setAttribute("rx",String(y/2*r.backgroundOptions.round))),P.setAttribute("x",String(this._roundSize((r.width-$)/2))),P.setAttribute("y",String(this._roundSize((r.height-y)/2))),P.setAttribute("width",String($)),P.setAttribute("height",String(y)),this._backgroundClipPath.appendChild(P),this._createColor({options:u,color:f,additionalRotation:0,x:0,y:0,height:r.height,width:r.width,name:`background-color-${this._instanceId}`})}}}drawDots(e){var t,o;if(!this._qr)throw"QR code is not defined";const s=this._options,r=this._qr.getModuleCount();if(r>s.width||r>s.height)throw"The canvas is too small.";const u=Math.min(s.width,s.height)-2*s.margin,f=s.shape===pt?u/Math.sqrt(2):u,y=this._roundSize(f/r),$=this._roundSize((s.width-r*y)/2),P=this._roundSize((s.height-r*y)/2),z=new j({svg:this._element,type:s.dotsOptions.type,window:this._window});this._dotsClipPath=this._window.document.createElementNS("http://www.w3.org/2000/svg","clipPath"),this._dotsClipPath.setAttribute("id",`clip-path-dot-color-${this._instanceId}`),this._defs.appendChild(this._dotsClipPath),this._createColor({options:(t=s.dotsOptions)===null||t===void 0?void 0:t.gradient,color:s.dotsOptions.color,additionalRotation:0,x:0,y:0,height:s.height,width:s.width,name:`dot-color-${this._instanceId}`});for(let A=0;A<r;A++)for(let O=0;O<r;O++)e&&!e(A,O)||!((o=this._qr)===null||o===void 0)&&o.isDark(A,O)&&(z.draw($+O*y,P+A*y,y,(E,M)=>!(O+E<0||A+M<0||O+E>=r||A+M>=r)&&!(e&&!e(A+M,O+E))&&!!this._qr&&this._qr.isDark(A+M,O+E)),z._element&&this._dotsClipPath&&this._dotsClipPath.appendChild(z._element));if(s.shape===pt){const A=this._roundSize((u/y-r)/2),O=r+2*A,E=$-A*y,M=P-A*y,c=[],p=this._roundSize(O/2);for(let i=0;i<O;i++){c[i]=[];for(let l=0;l<O;l++)i>=A-1&&i<=O-A&&l>=A-1&&l<=O-A||Math.sqrt((i-p)*(i-p)+(l-p)*(l-p))>p?c[i][l]=0:c[i][l]=this._qr.isDark(l-2*A<0?l:l>=r?l-2*A:l-A,i-2*A<0?i:i>=r?i-2*A:i-A)?1:0}for(let i=0;i<O;i++)for(let l=0;l<O;l++)c[i][l]&&(z.draw(E+l*y,M+i*y,y,(g,S)=>{var v;return!!(!((v=c[i+S])===null||v===void 0)&&v[l+g])}),z._element&&this._dotsClipPath&&this._dotsClipPath.appendChild(z._element))}}drawCorners(){if(!this._qr)throw"QR code is not defined";const e=this._element,t=this._options;if(!e)throw"Element code is not defined";const o=this._qr.getModuleCount(),s=Math.min(t.width,t.height)-2*t.margin,r=t.shape===pt?s/Math.sqrt(2):s,u=this._roundSize(r/o),f=7*u,y=3*u,$=this._roundSize((t.width-o*u)/2),P=this._roundSize((t.height-o*u)/2);[[0,0,0],[1,0,Math.PI/2],[0,1,-Math.PI/2]].forEach(([z,A,O])=>{var E,M,c,p,i,l,g,S,v,q,D,R,N,Z;const J=$+z*u*(o-7),H=P+A*u*(o-7);let F=this._dotsClipPath,B=this._dotsClipPath;if((!((E=t.cornersSquareOptions)===null||E===void 0)&&E.gradient||!((M=t.cornersSquareOptions)===null||M===void 0)&&M.color)&&(F=this._window.document.createElementNS("http://www.w3.org/2000/svg","clipPath"),F.setAttribute("id",`clip-path-corners-square-color-${z}-${A}-${this._instanceId}`),this._defs.appendChild(F),this._cornersSquareClipPath=this._cornersDotClipPath=B=F,this._createColor({options:(c=t.cornersSquareOptions)===null||c===void 0?void 0:c.gradient,color:(p=t.cornersSquareOptions)===null||p===void 0?void 0:p.color,additionalRotation:O,x:J,y:H,height:f,width:f,name:`corners-square-color-${z}-${A}-${this._instanceId}`})),((i=t.cornersSquareOptions)===null||i===void 0?void 0:i.type)&&W.includes(t.cornersSquareOptions.type)){const Y=new X({svg:this._element,type:t.cornersSquareOptions.type,window:this._window});Y.draw(J,H,f,O),Y._element&&F&&F.appendChild(Y._element)}else{const Y=new j({svg:this._element,type:((l=t.cornersSquareOptions)===null||l===void 0?void 0:l.type)||t.dotsOptions.type,window:this._window});for(let rt=0;rt<nt.length;rt++)for(let T=0;T<nt[rt].length;T++)!((g=nt[rt])===null||g===void 0)&&g[T]&&(Y.draw(J+T*u,H+rt*u,u,(ut,lt)=>{var st;return!!(!((st=nt[rt+lt])===null||st===void 0)&&st[T+ut])}),Y._element&&F&&F.appendChild(Y._element))}if((!((S=t.cornersDotOptions)===null||S===void 0)&&S.gradient||!((v=t.cornersDotOptions)===null||v===void 0)&&v.color)&&(B=this._window.document.createElementNS("http://www.w3.org/2000/svg","clipPath"),B.setAttribute("id",`clip-path-corners-dot-color-${z}-${A}-${this._instanceId}`),this._defs.appendChild(B),this._cornersDotClipPath=B,this._createColor({options:(q=t.cornersDotOptions)===null||q===void 0?void 0:q.gradient,color:(D=t.cornersDotOptions)===null||D===void 0?void 0:D.color,additionalRotation:O,x:J+2*u,y:H+2*u,height:y,width:y,name:`corners-dot-color-${z}-${A}-${this._instanceId}`})),((R=t.cornersDotOptions)===null||R===void 0?void 0:R.type)&&U.includes(t.cornersDotOptions.type)){const Y=new dt({svg:this._element,type:t.cornersDotOptions.type,window:this._window});Y.draw(J+2*u,H+2*u,y,O),Y._element&&B&&B.appendChild(Y._element)}else{const Y=new j({svg:this._element,type:((N=t.cornersDotOptions)===null||N===void 0?void 0:N.type)||t.dotsOptions.type,window:this._window});for(let rt=0;rt<V.length;rt++)for(let T=0;T<V[rt].length;T++)!((Z=V[rt])===null||Z===void 0)&&Z[T]&&(Y.draw(J+T*u,H+rt*u,u,(ut,lt)=>{var st;return!!(!((st=V[rt+lt])===null||st===void 0)&&st[T+ut])}),Y._element&&B&&B.appendChild(Y._element))}})}loadImage(){return new Promise((e,t)=>{var o;const s=this._options;if(!s.image)return t("Image is not defined");if(!((o=s.nodeCanvas)===null||o===void 0)&&o.loadImage)s.nodeCanvas.loadImage(s.image).then(r=>{var u,f;if(this._image=r,this._options.imageOptions.saveAsBlob){const y=(u=s.nodeCanvas)===null||u===void 0?void 0:u.createCanvas(this._image.width,this._image.height);(f=y==null?void 0:y.getContext("2d"))===null||f===void 0||f.drawImage(r,0,0),this._imageUri=y==null?void 0:y.toDataURL()}e()}).catch(t);else{const r=new this._window.Image;typeof s.imageOptions.crossOrigin=="string"&&(r.crossOrigin=s.imageOptions.crossOrigin),this._image=r,r.onload=async()=>{this._options.imageOptions.saveAsBlob&&(this._imageUri=await async function(u,f){return new Promise(y=>{const $=new f.XMLHttpRequest;$.onload=function(){const P=new f.FileReader;P.onloadend=function(){y(P.result)},P.readAsDataURL($.response)},$.open("GET",u),$.responseType="blob",$.send()})}(s.image||"",this._window)),e()},r.src=s.image}})}async drawImage({width:e,height:t,count:o,dotSize:s}){const r=this._options,u=this._roundSize((r.width-o*s)/2),f=this._roundSize((r.height-o*s)/2),y=u+this._roundSize(r.imageOptions.margin+(o*s-e)/2),$=f+this._roundSize(r.imageOptions.margin+(o*s-t)/2),P=e-2*r.imageOptions.margin,z=t-2*r.imageOptions.margin,A=this._window.document.createElementNS("http://www.w3.org/2000/svg","image");A.setAttribute("href",this._imageUri||""),A.setAttribute("xlink:href",this._imageUri||""),A.setAttribute("x",String(y)),A.setAttribute("y",String($)),A.setAttribute("width",`${P}px`),A.setAttribute("height",`${z}px`),this._element.appendChild(A)}_createColor({options:e,color:t,additionalRotation:o,x:s,y:r,height:u,width:f,name:y}){const $=f>u?f:u,P=this._window.document.createElementNS("http://www.w3.org/2000/svg","rect");if(P.setAttribute("x",String(s)),P.setAttribute("y",String(r)),P.setAttribute("height",String(u)),P.setAttribute("width",String(f)),P.setAttribute("clip-path",`url('#clip-path-${y}')`),e){let z;if(e.type==="radial")z=this._window.document.createElementNS("http://www.w3.org/2000/svg","radialGradient"),z.setAttribute("id",y),z.setAttribute("gradientUnits","userSpaceOnUse"),z.setAttribute("fx",String(s+f/2)),z.setAttribute("fy",String(r+u/2)),z.setAttribute("cx",String(s+f/2)),z.setAttribute("cy",String(r+u/2)),z.setAttribute("r",String($/2));else{const A=((e.rotation||0)+o)%(2*Math.PI),O=(A+2*Math.PI)%(2*Math.PI);let E=s+f/2,M=r+u/2,c=s+f/2,p=r+u/2;O>=0&&O<=.25*Math.PI||O>1.75*Math.PI&&O<=2*Math.PI?(E-=f/2,M-=u/2*Math.tan(A),c+=f/2,p+=u/2*Math.tan(A)):O>.25*Math.PI&&O<=.75*Math.PI?(M-=u/2,E-=f/2/Math.tan(A),p+=u/2,c+=f/2/Math.tan(A)):O>.75*Math.PI&&O<=1.25*Math.PI?(E+=f/2,M+=u/2*Math.tan(A),c-=f/2,p-=u/2*Math.tan(A)):O>1.25*Math.PI&&O<=1.75*Math.PI&&(M+=u/2,E+=f/2/Math.tan(A),p-=u/2,c-=f/2/Math.tan(A)),z=this._window.document.createElementNS("http://www.w3.org/2000/svg","linearGradient"),z.setAttribute("id",y),z.setAttribute("gradientUnits","userSpaceOnUse"),z.setAttribute("x1",String(Math.round(E))),z.setAttribute("y1",String(Math.round(M))),z.setAttribute("x2",String(Math.round(c))),z.setAttribute("y2",String(Math.round(p)))}e.colorStops.forEach(({offset:A,color:O})=>{const E=this._window.document.createElementNS("http://www.w3.org/2000/svg","stop");E.setAttribute("offset",100*A+"%"),E.setAttribute("stop-color",O),z.appendChild(E)}),P.setAttribute("fill",`url('#${y}')`),this._defs.appendChild(z)}else t&&P.setAttribute("fill",t);this._element.appendChild(P)}}at.instanceCount=0;const wt=at,$t="canvas",xt={};for(let h=0;h<=40;h++)xt[h]=h;const ht={type:$t,shape:"square",width:300,height:300,data:"",margin:0,qrOptions:{typeNumber:xt[0],mode:void 0,errorCorrectionLevel:"Q"},imageOptions:{saveAsBlob:!0,hideBackgroundDots:!0,imageSize:.4,crossOrigin:void 0,margin:0},dotsOptions:{type:"square",color:"#000",roundSize:!0},backgroundOptions:{round:0,color:"#fff"}};function _t(h){const e=Object.assign({},h);if(!e.colorStops||!e.colorStops.length)throw"Field 'colorStops' is required in gradient";return e.rotation?e.rotation=Number(e.rotation):e.rotation=0,e.colorStops=e.colorStops.map(t=>Object.assign(Object.assign({},t),{offset:Number(t.offset)})),e}function Pt(h){const e=Object.assign({},h);return e.width=Number(e.width),e.height=Number(e.height),e.margin=Number(e.margin),e.imageOptions=Object.assign(Object.assign({},e.imageOptions),{hideBackgroundDots:!!e.imageOptions.hideBackgroundDots,imageSize:Number(e.imageOptions.imageSize),margin:Number(e.imageOptions.margin)}),e.margin>Math.min(e.width,e.height)&&(e.margin=Math.min(e.width,e.height)),e.dotsOptions=Object.assign({},e.dotsOptions),e.dotsOptions.gradient&&(e.dotsOptions.gradient=_t(e.dotsOptions.gradient)),e.cornersSquareOptions&&(e.cornersSquareOptions=Object.assign({},e.cornersSquareOptions),e.cornersSquareOptions.gradient&&(e.cornersSquareOptions.gradient=_t(e.cornersSquareOptions.gradient))),e.cornersDotOptions&&(e.cornersDotOptions=Object.assign({},e.cornersDotOptions),e.cornersDotOptions.gradient&&(e.cornersDotOptions.gradient=_t(e.cornersDotOptions.gradient))),e.backgroundOptions&&(e.backgroundOptions=Object.assign({},e.backgroundOptions),e.backgroundOptions.gradient&&(e.backgroundOptions.gradient=_t(e.backgroundOptions.gradient))),e}var kt=_(873),Et=_.n(kt);function St(h){if(!h)throw new Error("Extension must be defined");h[0]==="."&&(h=h.substring(1));const e={bmp:"image/bmp",gif:"image/gif",ico:"image/vnd.microsoft.icon",jpeg:"image/jpeg",jpg:"image/jpeg",png:"image/png",svg:"image/svg+xml",tif:"image/tiff",tiff:"image/tiff",webp:"image/webp",pdf:"application/pdf"}[h.toLowerCase()];if(!e)throw new Error(`Extension "${h}" is not supported`);return e}class b{constructor(e){e!=null&&e.jsdom?this._window=new e.jsdom("",{resources:"usable"}).window:this._window=window,this._options=e?Pt(x(ht,e)):ht,this.update()}static _clearContainer(e){e&&(e.innerHTML="")}_setupSvg(){if(!this._qr)return;const e=new wt(this._options,this._window);this._svg=e.getElement(),this._svgDrawingPromise=e.drawQR(this._qr).then(()=>{var t;this._svg&&((t=this._extension)===null||t===void 0||t.call(this,e.getElement(),this._options))})}_setupCanvas(){var e,t;this._qr&&(!((e=this._options.nodeCanvas)===null||e===void 0)&&e.createCanvas?(this._nodeCanvas=this._options.nodeCanvas.createCanvas(this._options.width,this._options.height),this._nodeCanvas.width=this._options.width,this._nodeCanvas.height=this._options.height):(this._domCanvas=document.createElement("canvas"),this._domCanvas.width=this._options.width,this._domCanvas.height=this._options.height),this._setupSvg(),this._canvasDrawingPromise=(t=this._svgDrawingPromise)===null||t===void 0?void 0:t.then(()=>{var o;if(!this._svg)return;const s=this._svg,r=new this._window.XMLSerializer().serializeToString(s),u=btoa(r),f=`data:${St("svg")};base64,${u}`;if(!((o=this._options.nodeCanvas)===null||o===void 0)&&o.loadImage)return this._options.nodeCanvas.loadImage(f).then(y=>{var $,P;y.width=this._options.width,y.height=this._options.height,(P=($=this._nodeCanvas)===null||$===void 0?void 0:$.getContext("2d"))===null||P===void 0||P.drawImage(y,0,0)});{const y=new this._window.Image;return new Promise($=>{y.onload=()=>{var P,z;(z=(P=this._domCanvas)===null||P===void 0?void 0:P.getContext("2d"))===null||z===void 0||z.drawImage(y,0,0),$()},y.src=f})}}))}async _getElement(e="png"){if(!this._qr)throw"QR code is empty";return e.toLowerCase()==="svg"?(this._svg&&this._svgDrawingPromise||this._setupSvg(),await this._svgDrawingPromise,this._svg):((this._domCanvas||this._nodeCanvas)&&this._canvasDrawingPromise||this._setupCanvas(),await this._canvasDrawingPromise,this._domCanvas||this._nodeCanvas)}update(e){b._clearContainer(this._container),this._options=e?Pt(x(this._options,e)):this._options,this._options.data&&(this._qr=Et()(this._options.qrOptions.typeNumber,this._options.qrOptions.errorCorrectionLevel),this._qr.addData(this._options.data,this._options.qrOptions.mode||function(t){switch(!0){case/^[0-9]*$/.test(t):return"Numeric";case/^[0-9A-Z $%*+\-./:]*$/.test(t):return"Alphanumeric";default:return"Byte"}}(this._options.data)),this._qr.make(),this._options.type===$t?this._setupCanvas():this._setupSvg(),this.append(this._container))}append(e){if(e){if(typeof e.appendChild!="function")throw"Container should be a single DOM node";this._options.type===$t?this._domCanvas&&e.appendChild(this._domCanvas):this._svg&&e.appendChild(this._svg),this._container=e}}applyExtension(e){if(!e)throw"Extension function should be defined.";this._extension=e,this.update()}deleteExtension(){this._extension=void 0,this.update()}async getRawData(e="png"){if(!this._qr)throw"QR code is empty";const t=await this._getElement(e),o=St(e);if(!t)return null;if(e.toLowerCase()==="svg"){const s=`<?xml version="1.0" standalone="no"?>\r
${new this._window.XMLSerializer().serializeToString(t)}`;return typeof Blob>"u"||this._options.jsdom?Buffer.from(s):new Blob([s],{type:o})}return new Promise(s=>{const r=t;if("toBuffer"in r)if(o==="image/png")s(r.toBuffer(o));else if(o==="image/jpeg")s(r.toBuffer(o));else{if(o!=="application/pdf")throw Error("Unsupported extension");s(r.toBuffer(o))}else"toBlob"in r&&r.toBlob(s,o,1)})}async download(e){if(!this._qr)throw"QR code is empty";if(typeof Blob>"u")throw"Cannot download in Node.js, call getRawData instead.";let t="png",o="qr";typeof e=="string"?(t=e,console.warn("Extension is deprecated as argument for 'download' method, please pass object { name: '...', extension: '...' } as argument")):typeof e=="object"&&e!==null&&(e.name&&(o=e.name),e.extension&&(t=e.extension));const s=await this._getElement(t);if(s)if(t.toLowerCase()==="svg"){let r=new XMLSerializer().serializeToString(s);r=`<?xml version="1.0" standalone="no"?>\r
`+r,I(`data:${St(t)};charset=utf-8,${encodeURIComponent(r)}`,`${o}.svg`)}else I(s.toDataURL(St(t)),`${o}.${t}`)}}const m=b})(),C.default})())}(Ut)),Ut.exports}var Pe=Ce();const ke=_e(Pe);var $e=gt('<div class=test-mode-badge tabindex=0><svg width=16 height=16 viewBox="0 0 20 20"fill=none xmlns=http://www.w3.org/2000/svg><circle cx=10 cy=10 r=9 stroke=#b45309 stroke-width=2 fill=#fef3c7></circle><text x=10 y=15 text-anchor=middle font-size=12 fill=#b45309 font-family=Arial font-weight=bold>i</text></svg><span class=test-mode-badge-text>Test Mode</span><div class=test-mode-tooltip>Test Mode: No real money will be moved.'),se=gt("<div>Complete on your phone"),ae=gt("<div>Attempting to reconnect..."),Ae=gt("<div class=qr-code-container id=qrcode-container-mobile>"),ze=gt('<div><div class=mobile-button-container><button class=mobile-button title="Open on mobile device"><svg width=20 height=20 viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round><rect x=5 y=2 width=14 height=20 rx=2 ry=2></rect><line x1=12 y1=18 x2=12 y2=18></line></svg><span>Open app to continue'),qe=gt("<div class=savings-badge>"),Oe=gt("<div class=zenobia-error>"),Me=gt('<div class="zenobia-qr-popup-overlay visible"><div class=zenobia-qr-popup-content><button class=zenobia-qr-close><svg viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2><path d="M18 6L6 18M6 6l12 12"></path></svg></button><div class=modal-header><div class=header-content><h3>Pay by bank with Zenobia</h3><p class=subtitle>Scan to complete your purchase</p></div></div><div class=modal-body><div class=payment-amount>$</div><div class=payment-status><div class=spinner></div><div class=payment-instructions>'),Ie=gt("<div class=qr-code-container id=qrcode-container>"),le=gt("<div class=qr-code-container><div class=zenobia-qr-placeholder>");const Ee=()=>{if(typeof window>"u")return!1;const n=window.navigator.userAgent.toLowerCase(),a=/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(n),d="ontouchstart"in window||navigator.maxTouchPoints>0,w=window.innerWidth<=768;return a||d&&w},De=n=>{const[a,d]=it(null),w={current:null},[_,C]=it(qt.PENDING),[k,x]=it(null),[I,Q]=it(!1),[j,L]=it(null),[W,X]=it(null),[G,U]=it(!1),[dt,pt]=it(""),[nt,V]=it(!1),[at,wt]=it(!1),[$t,xt]=it(null),[ht,_t]=it(!1),[Pt,kt]=it({x:0,y:0}),[Et,St]=it({x:400,y:400});let b=null;const m=()=>{if(ht())return;const f=400,y=600,$=(window.innerWidth-f)/2,P=(window.innerHeight-y)/2;_t(!0),kt({x:$,y:P}),St({x:400,y:400});const z=()=>{if(!ht())return;const A=Pt(),O=Et(),E=A.x+O.x,M=A.y+O.y,c=window.innerWidth,p=window.innerHeight;let i=O.x,l=O.y;(E<=0||E+f>=c)&&(i=-i),(M<=0||M+y>=p)&&(l=-l),kt({x:Math.max(0,Math.min(E,c-f)),y:Math.max(0,Math.min(M,p-y))}),St({x:i,y:l}),b=requestAnimationFrame(z)};b=requestAnimationFrame(z)},h=()=>{_t(!1),b&&(cancelAnimationFrame(b),b=null),kt({x:0,y:0})};Rt(()=>{if(n.isOpen&&!j()){V(!1),wt(!1),xt(null),x(null);const f=new xe(n.isTest);if(L(f),n.transferRequest)X(n.transferRequest),f.listenToTransfer(n.transferRequest.transferRequestId,n.transferRequest.signature||"",e,t,o,s);else if(n.url){U(!0),x(null);const y=n.metadata||{amount:n.amount,statementItems:{name:"Payment",amount:n.amount}};f.createTransfer(n.url,y).then($=>{X({transferRequestId:$.transferRequestId,merchantId:$.merchantId,expiry:$.expiry,signature:$.signature}),f.listenToTransfer($.transferRequestId,$.signature||"",e,t,o,s)}).catch($=>{x($ instanceof Error?$.message:"An error occurred"),n.onError&&$ instanceof Error&&n.onError($)}).finally(()=>{U(!1)})}else x("No URL provided for creating a new transfer")}}),Rt(()=>{var f;if((f=W())!=null&&f.transferRequestId){const y=W().transferRequestId.replace(/-/g,"");let P=`https://zenobiapay.com/clip?id=${btoa(y).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}`;n.isTest&&(P+="&type=test"),pt(P);const A=n.qrCodeSize||220,O=new ke({width:A,height:A,type:"svg",data:P,image:void 0,dotsOptions:{color:"#000000",type:"dots"},backgroundOptions:{color:"#ffffff"},cornersSquareOptions:{type:"extra-rounded"},cornersDotOptions:{type:"dot"},qrOptions:{errorCorrectionLevel:"M"}});d(O)}}),Rt(()=>{const f=a();setTimeout(()=>{f&&w.current&&(w.current.innerHTML="",f.append(w.current))},0)});const e=f=>{console.log("Received status update:",f);let y;switch(f.status){case"SETTLED":case"PAID":y=qt.PAID,n.onSuccess&&W()&&n.onSuccess(W(),f);const $=j();$&&($.disconnect(),L(null));break;case"FAILED":y=qt.FAILED;const P=j();P&&(P.disconnect(),L(null));break;case"CANCELLED":y=qt.CANCELLED;const z=j();z&&(z.disconnect(),L(null));break;default:y=qt.PENDING}C(y),n.onStatusChange&&n.onStatusChange(y)},t=f=>{console.error("WebSocket error:",f),f.toLowerCase().includes("disconnect")||f.toLowerCase().includes("connection lost")||f.toLowerCase().includes("network error")||f.toLowerCase().includes("timeout")?(xt(f),wt(!0)):(x(f),n.onError&&n.onError(new Error(f)))},o=f=>{console.log("WebSocket connection status:",f?"Connected":"Disconnected"),Q(f),f?(wt(!1),xt(null)):wt(!0)},s=f=>{console.log("Scan update received:",f.scanType),f.scanType==="scanned"?(V(!0),m()):f.scanType==="unscanned"&&(V(!1),h())};ue(()=>{const f=j();f&&f.disconnect(),h()}),Rt(()=>{if(!n.isOpen){const f=j();f&&(f.disconnect(),L(null)),V(!1),wt(!1),xt(null),x(null),h()}});const r=()=>n.discountAmount!==void 0?n.discountAmount:Math.round(n.amount/100),u=()=>{if(!n.showCashback)return null;const f=r();return f<1e3?`✨ ${(f/n.amount*100).toFixed(0)}% cashback applied!`:`✨ Applied $${(f/100).toFixed(2)} cashback!`};return ct(ft,{get when(){return n.isOpen},get children(){var f=Me(),y=f.firstChild,$=y.firstChild,P=$.nextSibling,z=P.firstChild,A=z.firstChild;A.nextSibling;var O=P.nextSibling,E=O.firstChild;E.firstChild;var M=E.nextSibling,c=M.firstChild,p=c.nextSibling;return Xt(i=>{},y),me($,"click",n.onClose),et(z,ct(ft,{get when(){return n.isTest},get children(){return $e()}}),null),et(O,ct(ft,{get when(){return Ee()&&dt()!==""&&!n.hideQrOnMobile},get fallback(){return ct(ft,{get when(){return vt(()=>!!a())()&&W()},get fallback(){return(()=>{var i=le(),l=i.firstChild;return i.style.setProperty("display","flex"),i.style.setProperty("justify-content","center"),i.style.setProperty("align-items","center"),mt(g=>{var S=n.qrCodeSize?`${n.qrCodeSize}px`:"220px",v=n.qrCodeSize?`${n.qrCodeSize}px`:"220px",q=n.qrCodeSize?`${n.qrCodeSize}px`:"220px",D=n.qrCodeSize?`${n.qrCodeSize}px`:"220px";return S!==g.e&&((g.e=S)!=null?i.style.setProperty("width",S):i.style.removeProperty("width")),v!==g.t&&((g.t=v)!=null?i.style.setProperty("height",v):i.style.removeProperty("height")),q!==g.a&&((g.a=q)!=null?l.style.setProperty("width",q):l.style.removeProperty("width")),D!==g.o&&((g.o=D)!=null?l.style.setProperty("height",D):l.style.removeProperty("height")),g},{e:void 0,t:void 0,a:void 0,o:void 0}),i})()},get children(){var i=Ie();return Xt(l=>{w.current=l},i),i.style.setProperty("display","flex"),i.style.setProperty("justify-content","center"),i.style.setProperty("align-items","center"),i.style.setProperty("position","relative"),et(i,ct(ft,{get when(){return nt()},get children(){var l=se();return l.style.setProperty("position","absolute"),l.style.setProperty("top","0"),l.style.setProperty("left","0"),l.style.setProperty("right","0"),l.style.setProperty("bottom","0"),l.style.setProperty("background","rgba(0, 0, 0, 0.95)"),l.style.setProperty("display","flex"),l.style.setProperty("justify-content","center"),l.style.setProperty("align-items","center"),l.style.setProperty("border-radius","8px"),l.style.setProperty("color","white"),l.style.setProperty("font-size","16px"),l.style.setProperty("font-weight","500"),l.style.setProperty("text-align","center"),l.style.setProperty("padding","20px"),l.style.setProperty("z-index","10"),l}}),null),et(i,ct(ft,{get when(){return at()},get children(){var l=ae();return l.style.setProperty("position","absolute"),l.style.setProperty("top","0"),l.style.setProperty("left","0"),l.style.setProperty("right","0"),l.style.setProperty("bottom","0"),l.style.setProperty("background","rgba(0, 0, 0, 0.9)"),l.style.setProperty("display","flex"),l.style.setProperty("justify-content","center"),l.style.setProperty("align-items","center"),l.style.setProperty("border-radius","8px"),l.style.setProperty("color","white"),l.style.setProperty("font-size","16px"),l.style.setProperty("font-weight","500"),l.style.setProperty("text-align","center"),l.style.setProperty("padding","20px"),l.style.setProperty("z-index","10"),l}}),null),mt(l=>{var g=n.qrCodeSize?`${n.qrCodeSize}px`:"220px",S=n.qrCodeSize?`${n.qrCodeSize}px`:"220px";return g!==l.e&&((l.e=g)!=null?i.style.setProperty("width",g):i.style.removeProperty("width")),S!==l.t&&((l.t=S)!=null?i.style.setProperty("height",S):i.style.removeProperty("height")),l},{e:void 0,t:void 0}),i}})},get children(){var i=ze(),l=i.firstChild,g=l.firstChild;return i.style.setProperty("text-align","center"),i.style.setProperty("margin","20px 0"),l.style.setProperty("text-align","center"),l.style.setProperty("margin","20px 0"),g.$$click=()=>window.open(dt(),"_blank"),g.style.setProperty("background-color","#000"),g.style.setProperty("color","#fff"),g.style.setProperty("border","none"),g.style.setProperty("padding","16px 24px"),g.style.setProperty("border-radius","8px"),g.style.setProperty("font-size","16px"),g.style.setProperty("font-weight","500"),g.style.setProperty("cursor","pointer"),g.style.setProperty("display","flex"),g.style.setProperty("align-items","center"),g.style.setProperty("gap","8px"),g.style.setProperty("margin","0 auto"),g.style.setProperty("transition","background-color 0.2s ease"),et(i,ct(ft,{get when(){return vt(()=>!!a())()&&W()},get fallback(){return(()=>{var S=le(),v=S.firstChild;return S.style.setProperty("display","flex"),S.style.setProperty("justify-content","center"),S.style.setProperty("align-items","center"),S.style.setProperty("margin","20px auto"),mt(q=>{var D=n.qrCodeSize?`${n.qrCodeSize}px`:"220px",R=n.qrCodeSize?`${n.qrCodeSize}px`:"220px",N=n.qrCodeSize?`${n.qrCodeSize}px`:"220px",Z=n.qrCodeSize?`${n.qrCodeSize}px`:"220px";return D!==q.e&&((q.e=D)!=null?S.style.setProperty("width",D):S.style.removeProperty("width")),R!==q.t&&((q.t=R)!=null?S.style.setProperty("height",R):S.style.removeProperty("height")),N!==q.a&&((q.a=N)!=null?v.style.setProperty("width",N):v.style.removeProperty("width")),Z!==q.o&&((q.o=Z)!=null?v.style.setProperty("height",Z):v.style.removeProperty("height")),q},{e:void 0,t:void 0,a:void 0,o:void 0}),S})()},get children(){var S=Ae();return Xt(v=>{if(v){const q=a();q&&(v.innerHTML="",q.append(v))}},S),S.style.setProperty("display","flex"),S.style.setProperty("justify-content","center"),S.style.setProperty("align-items","center"),S.style.setProperty("margin","20px auto"),S.style.setProperty("position","relative"),et(S,ct(ft,{get when(){return nt()},get children(){var v=se();return v.style.setProperty("position","absolute"),v.style.setProperty("top","0"),v.style.setProperty("left","0"),v.style.setProperty("right","0"),v.style.setProperty("bottom","0"),v.style.setProperty("background","rgba(0, 0, 0, 0.95)"),v.style.setProperty("display","flex"),v.style.setProperty("justify-content","center"),v.style.setProperty("align-items","center"),v.style.setProperty("border-radius","8px"),v.style.setProperty("color","white"),v.style.setProperty("font-size","16px"),v.style.setProperty("font-weight","500"),v.style.setProperty("text-align","center"),v.style.setProperty("padding","20px"),v.style.setProperty("z-index","10"),v}}),null),et(S,ct(ft,{get when(){return at()},get children(){var v=ae();return v.style.setProperty("position","absolute"),v.style.setProperty("top","0"),v.style.setProperty("left","0"),v.style.setProperty("right","0"),v.style.setProperty("bottom","0"),v.style.setProperty("background","rgba(0, 0, 0, 0.9)"),v.style.setProperty("display","flex"),v.style.setProperty("justify-content","center"),v.style.setProperty("align-items","center"),v.style.setProperty("border-radius","8px"),v.style.setProperty("color","white"),v.style.setProperty("font-size","16px"),v.style.setProperty("font-weight","500"),v.style.setProperty("text-align","center"),v.style.setProperty("padding","20px"),v.style.setProperty("z-index","10"),v}}),null),mt(v=>{var q=n.qrCodeSize?`${n.qrCodeSize}px`:"220px",D=n.qrCodeSize?`${n.qrCodeSize}px`:"220px";return q!==v.e&&((v.e=q)!=null?S.style.setProperty("width",q):S.style.removeProperty("width")),D!==v.t&&((v.t=D)!=null?S.style.setProperty("height",D):S.style.removeProperty("height")),v},{e:void 0,t:void 0}),S}}),null),i}}),E),et(E,()=>(n.amount/100).toFixed(2),null),et(O,ct(ft,{get when(){return u()},get children(){var i=qe();return et(i,u),i}}),M),et(p,(()=>{var i=vt(()=>!!G());return()=>i()?"Preparing payment...":vt(()=>!W())()?"Creating payment...":at()?"Reconnecting...":"Waiting for payment"})()),et(O,ct(ft,{get when(){return vt(()=>!!k())()&&!at()},get children(){var i=Oe();return et(i,k),i}}),null),mt(i=>{var l=ht()?`translate(${Pt().x}px, ${Pt().y}px)`:"none",g=ht()?"none":"transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)",S=ht()?"fixed":"relative",v=ht()?"0":"auto",q=ht()?"0":"auto",D=ht()?"9999":"auto";return l!==i.e&&((i.e=l)!=null?y.style.setProperty("transform",l):y.style.removeProperty("transform")),g!==i.t&&((i.t=g)!=null?y.style.setProperty("transition",g):y.style.removeProperty("transition")),S!==i.a&&((i.a=S)!=null?y.style.setProperty("position",S):y.style.removeProperty("position")),v!==i.o&&((i.o=v)!=null?y.style.setProperty("top",v):y.style.removeProperty("top")),q!==i.i&&((i.i=q)!=null?y.style.setProperty("left",q):y.style.removeProperty("left")),D!==i.n&&((i.n=D)!=null?y.style.setProperty("z-index",D):y.style.removeProperty("z-index")),i},{e:void 0,t:void 0,a:void 0,o:void 0,i:void 0,n:void 0}),f}})};re(["click"]);const Be=`
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
`;var Te=gt("<div class=zenobia-payment-container><style></style><button class=zenobia-payment-button>"),Le=gt("<div class=button-text-container><div class=initial-text></div><div class=hover-text>"),qt=(n=>(n.PENDING="PENDING",n.PAID="PAID",n.SETTLED="SETTLED",n.FAILED="FAILED",n.CANCELLED="CANCELLED",n))(qt||{});const Re=n=>{const[a,d]=it("INITIAL"),[w,_]=it(!1),C=()=>{const I=n.discountAmount||0;return I==0?n.buttonText:I<1e3?`Get ${(I/n.amount*100).toFixed(0)}% cashback`:`Get $${(I/100).toFixed(2)} cashback`},k=()=>{d("QR_EXPANDING"),setTimeout(()=>{d("QR_VISIBLE")},300)},x=()=>{_(!0),d("INITIAL"),setTimeout(()=>{setTimeout(()=>{_(!1)},300)},50)};return(()=>{var I=Te(),Q=I.firstChild,j=Q.nextSibling;return et(Q,Be),j.$$click=k,j.style.setProperty("background-color","black"),et(j,(()=>{var L=vt(()=>a()!=="INITIAL"&&!w());return()=>L()?n.buttonText||`Pay ${(n.amount/100).toFixed(2)}`:(()=>{var W=Le(),X=W.firstChild,G=X.nextSibling;return et(X,C),et(G,()=>n.buttonText||"Pay with Zenobia"),W})()})()),et(I,ct(ft,{get when(){return a()==="QR_EXPANDING"||a()==="QR_VISIBLE"},get children(){return ct(De,{get isOpen(){return a()==="QR_VISIBLE"},onClose:x,get amount(){return n.amount},get discountAmount(){return n.discountAmount},get qrCodeSize(){return n.qrCodeSize},get isTest(){return n.isTest},get url(){return n.url},get metadata(){return n.metadata},get onSuccess(){return n.onSuccess},get onError(){return n.onError},get onStatusChange(){return n.onStatusChange},get hideQrOnMobile(){return n.hideQrOnMobile},get showCashback(){return n.showCashback}})}}),null),mt(L=>{var W=a()!=="INITIAL",X=!!w(),G=a()!=="INITIAL";return W!==L.e&&j.classList.toggle("modal-open",L.e=W),X!==L.t&&j.classList.toggle("closing",L.t=X),G!==L.a&&(j.disabled=L.a=G),L},{e:void 0,t:void 0,a:void 0}),I})()};re(["click"]);function je(n){const a=typeof n.target=="string"?document.querySelector(n.target):n.target;if(!a){console.error("[zenobia-pay] target element not found:",n.target);return}be(()=>ct(Re,{get url(){return n.url},get amount(){return n.amount},get metadata(){return n.metadata},get buttonText(){return n.buttonText},get buttonClass(){return n.buttonClass},get qrCodeSize(){return n.qrCodeSize},get onSuccess(){return n.onSuccess},get onError(){return n.onError},get onStatusChange(){return n.onStatusChange}}),a)}window.ZenobiaPay={init:je}})();
