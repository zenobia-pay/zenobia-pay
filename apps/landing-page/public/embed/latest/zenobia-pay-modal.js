(function(){"use strict";const Bt={equals:(n,a)=>n===a};let Gt=Kt;const _t=1,Lt=2,Vt={owned:null,cleanups:null,context:null,owner:null};var J=null;let Wt=null,ce=null,V=null,rt=null,bt=null,jt=0;function de(n,a){const d=V,w=J,_=n.length===0,C=a===void 0?w:a,A=_?Vt:{owned:null,cleanups:null,context:C?C.context:null,owner:C},x=_?n:()=>n(()=>At(()=>Et(A)));J=A,V=null;try{return Mt(x,!0)}finally{V=d,J=w}}function at(n,a){a=a?Object.assign({},Bt,a):Bt;const d={value:n,observers:null,observerSlots:null,comparator:a.equals||void 0},w=_=>(typeof _=="function"&&(_=_(d.value)),Jt(d,_));return[Zt.bind(d),w]}function St(n,a,d){const w=Xt(n,a,!1,_t);Ot(w)}function Tt(n,a,d){Gt=ge;const w=Xt(n,a,!1,_t);w.user=!0,bt?bt.push(w):Ot(w)}function Ct(n,a,d){d=d?Object.assign({},Bt,d):Bt;const w=Xt(n,a,!0,0);return w.observers=null,w.observerSlots=null,w.comparator=d.equals||void 0,Ot(w),Zt.bind(w)}function At(n){if(V===null)return n();const a=V;V=null;try{return n()}finally{V=a}}function ue(n){return J===null||(J.cleanups===null?J.cleanups=[n]:J.cleanups.push(n)),n}function Zt(){if(this.sources&&this.state)if(this.state===_t)Ot(this);else{const n=rt;rt=null,Mt(()=>Nt(this),!1),rt=n}if(V){const n=this.observers?this.observers.length:0;V.sources?(V.sources.push(this),V.sourceSlots.push(n)):(V.sources=[this],V.sourceSlots=[n]),this.observers?(this.observers.push(V),this.observerSlots.push(V.sources.length-1)):(this.observers=[V],this.observerSlots=[V.sources.length-1])}return this.value}function Jt(n,a,d){let w=n.value;return(!n.comparator||!n.comparator(w,a))&&(n.value=a,n.observers&&n.observers.length&&Mt(()=>{for(let _=0;_<n.observers.length;_+=1){const C=n.observers[_],A=Wt&&Wt.running;A&&Wt.disposed.has(C),(A?!C.tState:!C.state)&&(C.pure?rt.push(C):bt.push(C),C.observers&&te(C)),A||(C.state=_t)}if(rt.length>1e6)throw rt=[],new Error},!1)),a}function Ot(n){if(!n.fn)return;Et(n);const a=jt;he(n,n.value,a)}function he(n,a,d){let w;const _=J,C=V;V=J=n;try{w=n.fn(a)}catch(A){return n.pure&&(n.state=_t,n.owned&&n.owned.forEach(Et),n.owned=null),n.updatedAt=d+1,ee(A)}finally{V=C,J=_}(!n.updatedAt||n.updatedAt<=d)&&(n.updatedAt!=null&&"observers"in n?Jt(n,w):n.value=w,n.updatedAt=d)}function Xt(n,a,d,w=_t,_){const C={fn:n,state:w,updatedAt:null,owned:null,sources:null,sourceSlots:null,cleanups:null,value:a,owner:J,context:J?J.context:null,pure:d};return J===null||J!==Vt&&(J.owned?J.owned.push(C):J.owned=[C]),C}function Rt(n){if(n.state===0)return;if(n.state===Lt)return Nt(n);if(n.suspense&&At(n.suspense.inFallback))return n.suspense.effects.push(n);const a=[n];for(;(n=n.owner)&&(!n.updatedAt||n.updatedAt<jt);)n.state&&a.push(n);for(let d=a.length-1;d>=0;d--)if(n=a[d],n.state===_t)Ot(n);else if(n.state===Lt){const w=rt;rt=null,Mt(()=>Nt(n,a[0]),!1),rt=w}}function Mt(n,a){if(rt)return n();let d=!1;a||(rt=[]),bt?d=!0:bt=[],jt++;try{const w=n();return fe(d),w}catch(w){d||(bt=null),rt=null,ee(w)}}function fe(n){if(rt&&(Kt(rt),rt=null),n)return;const a=bt;bt=null,a.length&&Mt(()=>Gt(a),!1)}function Kt(n){for(let a=0;a<n.length;a++)Rt(n[a])}function ge(n){let a,d=0;for(a=0;a<n.length;a++){const w=n[a];w.user?n[d++]=w:Rt(w)}for(a=0;a<d;a++)Rt(n[a])}function Nt(n,a){n.state=0;for(let d=0;d<n.sources.length;d+=1){const w=n.sources[d];if(w.sources){const _=w.state;_===_t?w!==a&&(!w.updatedAt||w.updatedAt<jt)&&Rt(w):_===Lt&&Nt(w,a)}}}function te(n){for(let a=0;a<n.observers.length;a+=1){const d=n.observers[a];d.state||(d.state=Lt,d.pure?rt.push(d):bt.push(d),d.observers&&te(d))}}function Et(n){let a;if(n.sources)for(;n.sources.length;){const d=n.sources.pop(),w=n.sourceSlots.pop(),_=d.observers;if(_&&_.length){const C=_.pop(),A=d.observerSlots.pop();w<_.length&&(C.sourceSlots[A]=w,_[w]=C,d.observerSlots[w]=A)}}if(n.tOwned){for(a=n.tOwned.length-1;a>=0;a--)Et(n.tOwned[a]);delete n.tOwned}if(n.owned){for(a=n.owned.length-1;a>=0;a--)Et(n.owned[a]);n.owned=null}if(n.cleanups){for(a=n.cleanups.length-1;a>=0;a--)n.cleanups[a]();n.cleanups=null}n.state=0}function pe(n){return n instanceof Error?n:new Error(typeof n=="string"?n:"Unknown error",{cause:n})}function ee(n,a=J){throw pe(n)}function ht(n,a){return At(()=>n(a||{}))}const ye=n=>`Stale read from <${n}>.`;function gt(n){const a=n.keyed,d=Ct(()=>n.when,void 0,void 0),w=a?d:Ct(d,void 0,{equals:(_,C)=>!_==!C});return Ct(()=>{const _=w();if(_){const C=n.children;return typeof C=="function"&&C.length>0?At(()=>C(a?_:()=>{if(!At(w))throw ye("Show");return d()})):C}return n.fallback},void 0,void 0)}function we(n,a,d){let w=d.length,_=a.length,C=w,A=0,x=0,B=a[_-1].nextSibling,W=null;for(;A<_||x<C;){if(a[A]===d[x]){A++,x++;continue}for(;a[_-1]===d[C-1];)_--,C--;if(_===A){const F=C<w?x?d[x-1].nextSibling:d[C-x]:B;for(;x<C;)n.insertBefore(d[x++],F)}else if(C===x)for(;A<_;)(!W||!W.has(a[A]))&&a[A].remove(),A++;else if(a[A]===d[C-1]&&d[x]===a[_-1]){const F=a[--_].nextSibling;n.insertBefore(d[x++],a[A++].nextSibling),n.insertBefore(d[--C],F),a[_]=d[C]}else{if(!W){W=new Map;let H=x;for(;H<C;)W.set(d[H],H++)}const F=W.get(a[A]);if(F!=null)if(x<F&&F<C){let H=A,Z=1,et;for(;++H<_&&H<C&&!((et=W.get(a[H]))==null||et!==F+Z);)Z++;if(Z>F-x){const nt=a[A];for(;x<F;)n.insertBefore(d[x++],nt)}else n.replaceChild(d[x++],a[A++])}else A++;else a[A++].remove()}}}const ne="_$DX_DELEGATE";function be(n,a,d,w={}){let _;return de(C=>{_=C,a===document?n():lt(a,n(),a.firstChild?null:void 0,d)},w.owner),()=>{_(),a.textContent=""}}function yt(n,a,d,w){let _;const C=()=>{const x=document.createElement("template");return x.innerHTML=n,x.content.firstChild},A=()=>(_||(_=C())).cloneNode(!0);return A.cloneNode=A,A}function re(n,a=window.document){const d=a[ne]||(a[ne]=new Set);for(let w=0,_=n.length;w<_;w++){const C=n[w];d.has(C)||(d.add(C),a.addEventListener(C,ve))}}function me(n,a,d,w){Array.isArray(d)?(n[`$$${a}`]=d[0],n[`$$${a}Data`]=d[1]):n[`$$${a}`]=d}function Qt(n,a,d){return At(()=>n(a,d))}function lt(n,a,d,w){if(d!==void 0&&!w&&(w=[]),typeof a!="function")return Ft(n,a,w,d);St(_=>Ft(n,a(),_,d),w)}function ve(n){let a=n.target;const d=`$$${n.type}`,w=n.target,_=n.currentTarget,C=B=>Object.defineProperty(n,"target",{configurable:!0,value:B}),A=()=>{const B=a[d];if(B&&!a.disabled){const W=a[`${d}Data`];if(W!==void 0?B.call(a,W,n):B.call(a,n),n.cancelBubble)return}return a.host&&typeof a.host!="string"&&!a.host._$host&&a.contains(n.target)&&C(a.host),!0},x=()=>{for(;A()&&(a=a._$host||a.parentNode||a.host););};if(Object.defineProperty(n,"currentTarget",{configurable:!0,get(){return a||document}}),n.composedPath){const B=n.composedPath();C(B[0]);for(let W=0;W<B.length-2&&(a=B[W],!!A());W++){if(a._$host){a=a._$host,x();break}if(a.parentNode===_)break}}else x();C(w)}function Ft(n,a,d,w,_){for(;typeof d=="function";)d=d();if(a===d)return d;const C=typeof a,A=w!==void 0;if(n=A&&d[0]&&d[0].parentNode||n,C==="string"||C==="number"){if(C==="number"&&(a=a.toString(),a===d))return d;if(A){let x=d[0];x&&x.nodeType===3?x.data!==a&&(x.data=a):x=document.createTextNode(a),d=$t(n,d,w,x)}else d!==""&&typeof d=="string"?d=n.firstChild.data=a:d=n.textContent=a}else if(a==null||C==="boolean")d=$t(n,d,w);else{if(C==="function")return St(()=>{let x=a();for(;typeof x=="function";)x=x();d=Ft(n,x,d,w)}),()=>d;if(Array.isArray(a)){const x=[],B=d&&Array.isArray(d);if(Yt(x,a,d,_))return St(()=>d=Ft(n,x,d,w,!0)),()=>d;if(x.length===0){if(d=$t(n,d,w),A)return d}else B?d.length===0?oe(n,x,w):we(n,d,x):(d&&$t(n),oe(n,x));d=x}else if(a.nodeType){if(Array.isArray(d)){if(A)return d=$t(n,d,w,a);$t(n,d,null,a)}else d==null||d===""||!n.firstChild?n.appendChild(a):n.replaceChild(a,n.firstChild);d=a}}return d}function Yt(n,a,d,w){let _=!1;for(let C=0,A=a.length;C<A;C++){let x=a[C],B=d&&d[n.length],W;if(!(x==null||x===!0||x===!1))if((W=typeof x)=="object"&&x.nodeType)n.push(x);else if(Array.isArray(x))_=Yt(n,x,B)||_;else if(W==="function")if(w){for(;typeof x=="function";)x=x();_=Yt(n,Array.isArray(x)?x:[x],Array.isArray(B)?B:[B])||_}else n.push(x),_=!0;else{const F=String(x);B&&B.nodeType===3&&B.data===F?n.push(B):n.push(document.createTextNode(F))}}return _}function oe(n,a,d=null){for(let w=0,_=a.length;w<_;w++)n.insertBefore(a[w],d)}function $t(n,a,d,w){if(d===void 0)return n.textContent="";const _=w||document.createTextNode("");if(a.length){let C=!1;for(let A=a.length-1;A>=0;A--){const x=a[A];if(_!==x){const B=x.parentNode===n;!C&&!A?B?n.replaceChild(_,x):n.insertBefore(_,d):B&&x.remove()}else C=!0}}else n.insertBefore(_,d);return[_]}class xe{constructor(a=!1){this.socket=null,this.reconnectTimeout=null,this.reconnectAttempts=0,this.maxReconnectAttempts=6,this.transferId=null,this.signature=null,this.onStatusCallback=null,this.onErrorCallback=null,this.onConnectionCallback=null,this.onScanCallback=null,this.wsBaseUrl=a?"transfer-status-test.zenobiapay.com":"transfer-status.zenobiapay.com"}getSignature(){return this.signature}getTransferId(){return this.transferId}async createTransfer(a,d){try{const w=await fetch(a,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(d)});if(!w.ok){const C=await w.json();throw new Error(C.message||"Failed to create transfer request")}const _=await w.json();return this.transferId=_.transferRequestId,this.signature=_.signature,_}catch(w){throw console.error("Error creating transfer request:",w),w instanceof Error?w:new Error("Failed to create transfer request")}}listenToTransfer(a,d,w,_,C,A){this.transferId=a,this.signature=d,w&&(this.onStatusCallback=w),_&&(this.onErrorCallback=_),C&&(this.onConnectionCallback=C),A&&(this.onScanCallback=A),this.connectWebSocket()}async createTransferAndListen(a,d,w,_,C,A){const x=await this.createTransfer(a,d);return this.listenToTransfer(x.transferRequestId,x.signature,w,_,C,A),x}connectWebSocket(){if(this.socket&&(this.socket.close(),this.socket=null,this.notifyConnectionStatus(!1)),!this.transferId||!this.signature){console.error("Cannot connect to WebSocket: Missing transfer ID or signature");return}try{const d=`${window.location.protocol==="https:"?"wss:":"ws:"}//${this.wsBaseUrl}/transfers/${this.transferId}/ws?token=${this.signature}`,w=new WebSocket(d);this.socket=w,w.onopen=()=>{this.notifyConnectionStatus(!0),this.reconnectAttempts=0},w.onclose=_=>{this.notifyConnectionStatus(!1),this.socket=null,_.code!==1e3&&this.reconnectAttempts<this.maxReconnectAttempts&&this.attemptReconnect()},w.onerror=_=>{console.error(`WebSocket error for transfer: ${this.transferId}`,_),this.notifyError("WebSocket error occurred")},w.onmessage=_=>{console.log(`WebSocket message received for transfer: ${this.transferId}`,_.data);try{const C=JSON.parse(_.data);C.type==="status"&&C.transfer?this.notifyStatus(C.transfer):C.type==="error"&&C.message?this.notifyError(C.message):C.type==="scan"?this.notifyScan(C):C.type==="ping"&&w.readyState===WebSocket.OPEN&&w.send(JSON.stringify({type:"pong"}))}catch{this.notifyError("Failed to parse message")}}}catch{this.notifyError("Failed to establish WebSocket connection")}}attemptReconnect(){this.reconnectAttempts++;const a=Math.min(1e3*Math.pow(2,this.reconnectAttempts-1),3e4);console.log(`Attempting to reconnect in ${a}ms (attempt ${this.reconnectAttempts})`),this.reconnectTimeout&&window.clearTimeout(this.reconnectTimeout),this.reconnectTimeout=window.setTimeout(()=>{console.log(`Reconnecting to WebSocket (attempt ${this.reconnectAttempts})...`),this.connectWebSocket()},a)}disconnect(){this.reconnectTimeout&&(window.clearTimeout(this.reconnectTimeout),this.reconnectTimeout=null),this.socket&&this.socket.readyState<2&&(console.log(`Closing WebSocket for transfer: ${this.transferId}`),this.socket.close(),this.socket=null,this.notifyConnectionStatus(!1)),this.transferId=null,this.signature=null}notifyConnectionStatus(a){this.onConnectionCallback&&this.onConnectionCallback(a)}notifyStatus(a){this.onStatusCallback&&this.onStatusCallback(a)}notifyError(a){this.onErrorCallback&&this.onErrorCallback(a)}notifyScan(a){this.onScanCallback&&this.onScanCallback(a)}}function _e(n){return n&&n.__esModule&&Object.prototype.hasOwnProperty.call(n,"default")?n.default:n}var Ut={exports:{}},Se=Ut.exports,ie;function Ce(){return ie||(ie=1,function(n,a){(function(d,w){n.exports=w()})(Se,()=>(()=>{var d={873:(A,x)=>{var B,W,F=function(){var H=function(b,m){var h=b,e=ft[m],t=null,o=0,s=null,r=[],u={},f=function(c,p){t=function(i){for(var l=new Array(i),g=0;g<i;g+=1){l[g]=new Array(i);for(var S=0;S<i;S+=1)l[g][S]=null}return l}(o=4*h+17),y(0,0),y(o-7,0),y(0,o-7),P(),k(),z(c,p),h>=7&&$(c),s==null&&(s=E(h,e,r)),O(s,p)},y=function(c,p){for(var i=-1;i<=7;i+=1)if(!(c+i<=-1||o<=c+i))for(var l=-1;l<=7;l+=1)p+l<=-1||o<=p+l||(t[c+i][p+l]=0<=i&&i<=6&&(l==0||l==6)||0<=l&&l<=6&&(i==0||i==6)||2<=i&&i<=4&&2<=l&&l<=4)},k=function(){for(var c=8;c<o-8;c+=1)t[c][6]==null&&(t[c][6]=c%2==0);for(var p=8;p<o-8;p+=1)t[6][p]==null&&(t[6][p]=p%2==0)},P=function(){for(var c=K.getPatternPosition(h),p=0;p<c.length;p+=1)for(var i=0;i<c.length;i+=1){var l=c[p],g=c[i];if(t[l][g]==null)for(var S=-2;S<=2;S+=1)for(var v=-2;v<=2;v+=1)t[l+S][g+v]=S==-2||S==2||v==-2||v==2||S==0&&v==0}},$=function(c){for(var p=K.getBCHTypeNumber(h),i=0;i<18;i+=1){var l=!c&&(p>>i&1)==1;t[Math.floor(i/3)][i%3+o-8-3]=l}for(i=0;i<18;i+=1)l=!c&&(p>>i&1)==1,t[i%3+o-8-3][Math.floor(i/3)]=l},z=function(c,p){for(var i=e<<3|p,l=K.getBCHTypeInfo(i),g=0;g<15;g+=1){var S=!c&&(l>>g&1)==1;g<6?t[g][8]=S:g<8?t[g+1][8]=S:t[o-15+g][8]=S}for(g=0;g<15;g+=1)S=!c&&(l>>g&1)==1,g<8?t[8][o-g-1]=S:g<9?t[8][15-g-1+1]=S:t[8][15-g-1]=S;t[o-8][8]=!c},O=function(c,p){for(var i=-1,l=o-1,g=7,S=0,v=K.getMaskFunction(p),q=o-1;q>0;q-=2)for(q==6&&(q-=1);;){for(var D=0;D<2;D+=1)if(t[l][q-D]==null){var j=!1;S<c.length&&(j=(c[S]>>>g&1)==1),v(l,q-D)&&(j=!j),t[l][q-D]=j,(g-=1)==-1&&(S+=1,g=7)}if((l+=i)<0||o<=l){l-=i,i=-i;break}}},E=function(c,p,i){for(var l=wt.getRSBlocks(c,p),g=zt(),S=0;S<i.length;S+=1){var v=i[S];g.put(v.getMode(),4),g.put(v.getLength(),K.getLengthInBits(v.getMode(),c)),v.write(g)}var q=0;for(S=0;S<l.length;S+=1)q+=l[S].dataCount;if(g.getLengthInBits()>8*q)throw"code length overflow. ("+g.getLengthInBits()+">"+8*q+")";for(g.getLengthInBits()+4<=8*q&&g.put(0,4);g.getLengthInBits()%8!=0;)g.putBit(!1);for(;!(g.getLengthInBits()>=8*q||(g.put(236,8),g.getLengthInBits()>=8*q));)g.put(17,8);return function(D,j){for(var T=0,Y=0,G=0,U=new Array(j.length),R=new Array(j.length),I=0;I<j.length;I+=1){var X=j[I].dataCount,tt=j[I].totalCount-X;Y=Math.max(Y,X),G=Math.max(G,tt),U[I]=new Array(X);for(var L=0;L<U[I].length;L+=1)U[I][L]=255&D.getBuffer()[L+T];T+=X;var dt=K.getErrorCorrectPolynomial(tt),st=it(U[I],dt.getLength()-1).mod(dt);for(R[I]=new Array(dt.getLength()-1),L=0;L<R[I].length;L+=1){var ot=L+st.getLength()-R[I].length;R[I][L]=ot>=0?st.getAt(ot):0}}var Ht=0;for(L=0;L<j.length;L+=1)Ht+=j[L].totalCount;var It=new Array(Ht),pt=0;for(L=0;L<Y;L+=1)for(I=0;I<j.length;I+=1)L<U[I].length&&(It[pt]=U[I][L],pt+=1);for(L=0;L<G;L+=1)for(I=0;I<j.length;I+=1)L<R[I].length&&(It[pt]=R[I][L],pt+=1);return It}(g,l)};u.addData=function(c,p){var i=null;switch(p=p||"Byte"){case"Numeric":i=mt(c);break;case"Alphanumeric":i=ut(c);break;case"Byte":i=vt(c);break;case"Kanji":i=Pt(c);break;default:throw"mode:"+p}r.push(i),s=null},u.isDark=function(c,p){if(c<0||o<=c||p<0||o<=p)throw c+","+p;return t[c][p]},u.getModuleCount=function(){return o},u.make=function(){if(h<1){for(var c=1;c<40;c++){for(var p=wt.getRSBlocks(c,e),i=zt(),l=0;l<r.length;l++){var g=r[l];i.put(g.getMode(),4),i.put(g.getLength(),K.getLengthInBits(g.getMode(),c)),g.write(i)}var S=0;for(l=0;l<p.length;l++)S+=p[l].dataCount;if(i.getLengthInBits()<=8*S)break}h=c}f(!1,function(){for(var v=0,q=0,D=0;D<8;D+=1){f(!0,D);var j=K.getLostPoint(u);(D==0||v>j)&&(v=j,q=D)}return q}())},u.createTableTag=function(c,p){c=c||2;var i="";i+='<table style="',i+=" border-width: 0px; border-style: none;",i+=" border-collapse: collapse;",i+=" padding: 0px; margin: "+(p=p===void 0?4*c:p)+"px;",i+='">',i+="<tbody>";for(var l=0;l<u.getModuleCount();l+=1){i+="<tr>";for(var g=0;g<u.getModuleCount();g+=1)i+='<td style="',i+=" border-width: 0px; border-style: none;",i+=" border-collapse: collapse;",i+=" padding: 0px; margin: 0px;",i+=" width: "+c+"px;",i+=" height: "+c+"px;",i+=" background-color: ",i+=u.isDark(l,g)?"#000000":"#ffffff",i+=";",i+='"/>';i+="</tr>"}return(i+="</tbody>")+"</table>"},u.createSvgTag=function(c,p,i,l){var g={};typeof arguments[0]=="object"&&(c=(g=arguments[0]).cellSize,p=g.margin,i=g.alt,l=g.title),c=c||2,p=p===void 0?4*c:p,(i=typeof i=="string"?{text:i}:i||{}).text=i.text||null,i.id=i.text?i.id||"qrcode-description":null,(l=typeof l=="string"?{text:l}:l||{}).text=l.text||null,l.id=l.text?l.id||"qrcode-title":null;var S,v,q,D,j=u.getModuleCount()*c+2*p,T="";for(D="l"+c+",0 0,"+c+" -"+c+",0 0,-"+c+"z ",T+='<svg version="1.1" xmlns="http://www.w3.org/2000/svg"',T+=g.scalable?"":' width="'+j+'px" height="'+j+'px"',T+=' viewBox="0 0 '+j+" "+j+'" ',T+=' preserveAspectRatio="xMinYMin meet"',T+=l.text||i.text?' role="img" aria-labelledby="'+M([l.id,i.id].join(" ").trim())+'"':"",T+=">",T+=l.text?'<title id="'+M(l.id)+'">'+M(l.text)+"</title>":"",T+=i.text?'<description id="'+M(i.id)+'">'+M(i.text)+"</description>":"",T+='<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>',T+='<path d="',v=0;v<u.getModuleCount();v+=1)for(q=v*c+p,S=0;S<u.getModuleCount();S+=1)u.isDark(v,S)&&(T+="M"+(S*c+p)+","+q+D);return(T+='" stroke="transparent" fill="black"/>')+"</svg>"},u.createDataURL=function(c,p){c=c||2,p=p===void 0?4*c:p;var i=u.getModuleCount()*c+2*p,l=p,g=i-p;return xt(i,i,function(S,v){if(l<=S&&S<g&&l<=v&&v<g){var q=Math.floor((S-l)/c),D=Math.floor((v-l)/c);return u.isDark(D,q)?0:1}return 1})},u.createImgTag=function(c,p,i){c=c||2,p=p===void 0?4*c:p;var l=u.getModuleCount()*c+2*p,g="";return g+="<img",g+=' src="',g+=u.createDataURL(c,p),g+='"',g+=' width="',g+=l,g+='"',g+=' height="',g+=l,g+='"',i&&(g+=' alt="',g+=M(i),g+='"'),g+"/>"};var M=function(c){for(var p="",i=0;i<c.length;i+=1){var l=c.charAt(i);switch(l){case"<":p+="&lt;";break;case">":p+="&gt;";break;case"&":p+="&amp;";break;case'"':p+="&quot;";break;default:p+=l}}return p};return u.createASCII=function(c,p){if((c=c||1)<2)return function(U){U=U===void 0?2:U;var R,I,X,tt,L,dt=1*u.getModuleCount()+2*U,st=U,ot=dt-U,Ht={"██":"█","█ ":"▀"," █":"▄","  ":" "},It={"██":"▀","█ ":"▀"," █":" ","  ":" "},pt="";for(R=0;R<dt;R+=2){for(X=Math.floor((R-st)/1),tt=Math.floor((R+1-st)/1),I=0;I<dt;I+=1)L="█",st<=I&&I<ot&&st<=R&&R<ot&&u.isDark(X,Math.floor((I-st)/1))&&(L=" "),st<=I&&I<ot&&st<=R+1&&R+1<ot&&u.isDark(tt,Math.floor((I-st)/1))?L+=" ":L+="█",pt+=U<1&&R+1>=ot?It[L]:Ht[L];pt+=`
`}return dt%2&&U>0?pt.substring(0,pt.length-dt-1)+Array(dt+1).join("▀"):pt.substring(0,pt.length-1)}(p);c-=1,p=p===void 0?2*c:p;var i,l,g,S,v=u.getModuleCount()*c+2*p,q=p,D=v-p,j=Array(c+1).join("██"),T=Array(c+1).join("  "),Y="",G="";for(i=0;i<v;i+=1){for(g=Math.floor((i-q)/c),G="",l=0;l<v;l+=1)S=1,q<=l&&l<D&&q<=i&&i<D&&u.isDark(g,Math.floor((l-q)/c))&&(S=0),G+=S?j:T;for(g=0;g<c;g+=1)Y+=G+`
`}return Y.substring(0,Y.length-1)},u.renderTo2dContext=function(c,p){p=p||2;for(var i=u.getModuleCount(),l=0;l<i;l++)for(var g=0;g<i;g++)c.fillStyle=u.isDark(l,g)?"black":"white",c.fillRect(l*p,g*p,p,p)},u};H.stringToBytes=(H.stringToBytesFuncs={default:function(b){for(var m=[],h=0;h<b.length;h+=1){var e=b.charCodeAt(h);m.push(255&e)}return m}}).default,H.createStringToBytes=function(b,m){var h=function(){for(var t=Dt(b),o=function(){var k=t.read();if(k==-1)throw"eof";return k},s=0,r={};;){var u=t.read();if(u==-1)break;var f=o(),y=o()<<8|o();r[String.fromCharCode(u<<8|f)]=y,s+=1}if(s!=m)throw s+" != "+m;return r}(),e=63;return function(t){for(var o=[],s=0;s<t.length;s+=1){var r=t.charCodeAt(s);if(r<128)o.push(r);else{var u=h[t.charAt(s)];typeof u=="number"?(255&u)==u?o.push(u):(o.push(u>>>8),o.push(255&u)):o.push(e)}}return o}};var Z,et,nt,N,ct,ft={L:1,M:0,Q:3,H:2},K=(Z=[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],et=1335,nt=7973,ct=function(b){for(var m=0;b!=0;)m+=1,b>>>=1;return m},(N={}).getBCHTypeInfo=function(b){for(var m=b<<10;ct(m)-ct(et)>=0;)m^=et<<ct(m)-ct(et);return 21522^(b<<10|m)},N.getBCHTypeNumber=function(b){for(var m=b<<12;ct(m)-ct(nt)>=0;)m^=nt<<ct(m)-ct(nt);return b<<12|m},N.getPatternPosition=function(b){return Z[b-1]},N.getMaskFunction=function(b){switch(b){case 0:return function(m,h){return(m+h)%2==0};case 1:return function(m,h){return m%2==0};case 2:return function(m,h){return h%3==0};case 3:return function(m,h){return(m+h)%3==0};case 4:return function(m,h){return(Math.floor(m/2)+Math.floor(h/3))%2==0};case 5:return function(m,h){return m*h%2+m*h%3==0};case 6:return function(m,h){return(m*h%2+m*h%3)%2==0};case 7:return function(m,h){return(m*h%3+(m+h)%2)%2==0};default:throw"bad maskPattern:"+b}},N.getErrorCorrectPolynomial=function(b){for(var m=it([1],0),h=0;h<b;h+=1)m=m.multiply(it([1,Q.gexp(h)],0));return m},N.getLengthInBits=function(b,m){if(1<=m&&m<10)switch(b){case 1:return 10;case 2:return 9;case 4:case 8:return 8;default:throw"mode:"+b}else if(m<27)switch(b){case 1:return 12;case 2:return 11;case 4:return 16;case 8:return 10;default:throw"mode:"+b}else{if(!(m<41))throw"type:"+m;switch(b){case 1:return 14;case 2:return 13;case 4:return 16;case 8:return 12;default:throw"mode:"+b}}},N.getLostPoint=function(b){for(var m=b.getModuleCount(),h=0,e=0;e<m;e+=1)for(var t=0;t<m;t+=1){for(var o=0,s=b.isDark(e,t),r=-1;r<=1;r+=1)if(!(e+r<0||m<=e+r))for(var u=-1;u<=1;u+=1)t+u<0||m<=t+u||r==0&&u==0||s==b.isDark(e+r,t+u)&&(o+=1);o>5&&(h+=3+o-5)}for(e=0;e<m-1;e+=1)for(t=0;t<m-1;t+=1){var f=0;b.isDark(e,t)&&(f+=1),b.isDark(e+1,t)&&(f+=1),b.isDark(e,t+1)&&(f+=1),b.isDark(e+1,t+1)&&(f+=1),f!=0&&f!=4||(h+=3)}for(e=0;e<m;e+=1)for(t=0;t<m-6;t+=1)b.isDark(e,t)&&!b.isDark(e,t+1)&&b.isDark(e,t+2)&&b.isDark(e,t+3)&&b.isDark(e,t+4)&&!b.isDark(e,t+5)&&b.isDark(e,t+6)&&(h+=40);for(t=0;t<m;t+=1)for(e=0;e<m-6;e+=1)b.isDark(e,t)&&!b.isDark(e+1,t)&&b.isDark(e+2,t)&&b.isDark(e+3,t)&&b.isDark(e+4,t)&&!b.isDark(e+5,t)&&b.isDark(e+6,t)&&(h+=40);var y=0;for(t=0;t<m;t+=1)for(e=0;e<m;e+=1)b.isDark(e,t)&&(y+=1);return h+Math.abs(100*y/m/m-50)/5*10},N),Q=function(){for(var b=new Array(256),m=new Array(256),h=0;h<8;h+=1)b[h]=1<<h;for(h=8;h<256;h+=1)b[h]=b[h-4]^b[h-5]^b[h-6]^b[h-8];for(h=0;h<255;h+=1)m[b[h]]=h;return{glog:function(e){if(e<1)throw"glog("+e+")";return m[e]},gexp:function(e){for(;e<0;)e+=255;for(;e>=256;)e-=255;return b[e]}}}();function it(b,m){if(b.length===void 0)throw b.length+"/"+m;var h=function(){for(var t=0;t<b.length&&b[t]==0;)t+=1;for(var o=new Array(b.length-t+m),s=0;s<b.length-t;s+=1)o[s]=b[s+t];return o}(),e={getAt:function(t){return h[t]},getLength:function(){return h.length},multiply:function(t){for(var o=new Array(e.getLength()+t.getLength()-1),s=0;s<e.getLength();s+=1)for(var r=0;r<t.getLength();r+=1)o[s+r]^=Q.gexp(Q.glog(e.getAt(s))+Q.glog(t.getAt(r)));return it(o,0)},mod:function(t){if(e.getLength()-t.getLength()<0)return e;for(var o=Q.glog(e.getAt(0))-Q.glog(t.getAt(0)),s=new Array(e.getLength()),r=0;r<e.getLength();r+=1)s[r]=e.getAt(r);for(r=0;r<t.getLength();r+=1)s[r]^=Q.gexp(Q.glog(t.getAt(r))+o);return it(s,0).mod(t)}};return e}var wt=function(){var b=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12,7,37,13],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]],m=function(e,t){var o={};return o.totalCount=e,o.dataCount=t,o},h={getRSBlocks:function(e,t){var o=function($,z){switch(z){case ft.L:return b[4*($-1)+0];case ft.M:return b[4*($-1)+1];case ft.Q:return b[4*($-1)+2];case ft.H:return b[4*($-1)+3];default:return}}(e,t);if(o===void 0)throw"bad rs block @ typeNumber:"+e+"/errorCorrectionLevel:"+t;for(var s=o.length/3,r=[],u=0;u<s;u+=1)for(var f=o[3*u+0],y=o[3*u+1],k=o[3*u+2],P=0;P<f;P+=1)r.push(m(y,k));return r}};return h}(),zt=function(){var b=[],m=0,h={getBuffer:function(){return b},getAt:function(e){var t=Math.floor(e/8);return(b[t]>>>7-e%8&1)==1},put:function(e,t){for(var o=0;o<t;o+=1)h.putBit((e>>>t-o-1&1)==1)},getLengthInBits:function(){return m},putBit:function(e){var t=Math.floor(m/8);b.length<=t&&b.push(0),e&&(b[t]|=128>>>m%8),m+=1}};return h},mt=function(b){var m=b,h={getMode:function(){return 1},getLength:function(o){return m.length},write:function(o){for(var s=m,r=0;r+2<s.length;)o.put(e(s.substring(r,r+3)),10),r+=3;r<s.length&&(s.length-r==1?o.put(e(s.substring(r,r+1)),4):s.length-r==2&&o.put(e(s.substring(r,r+2)),7))}},e=function(o){for(var s=0,r=0;r<o.length;r+=1)s=10*s+t(o.charAt(r));return s},t=function(o){if("0"<=o&&o<="9")return o.charCodeAt(0)-48;throw"illegal char :"+o};return h},ut=function(b){var m=b,h={getMode:function(){return 2},getLength:function(t){return m.length},write:function(t){for(var o=m,s=0;s+1<o.length;)t.put(45*e(o.charAt(s))+e(o.charAt(s+1)),11),s+=2;s<o.length&&t.put(e(o.charAt(s)),6)}},e=function(t){if("0"<=t&&t<="9")return t.charCodeAt(0)-48;if("A"<=t&&t<="Z")return t.charCodeAt(0)-65+10;switch(t){case" ":return 36;case"$":return 37;case"%":return 38;case"*":return 39;case"+":return 40;case"-":return 41;case".":return 42;case"/":return 43;case":":return 44;default:throw"illegal char :"+t}};return h},vt=function(b){var m=H.stringToBytes(b);return{getMode:function(){return 4},getLength:function(h){return m.length},write:function(h){for(var e=0;e<m.length;e+=1)h.put(m[e],8)}}},Pt=function(b){var m=H.stringToBytesFuncs.SJIS;if(!m)throw"sjis not supported.";(function(){var t=m("友");if(t.length!=2||(t[0]<<8|t[1])!=38726)throw"sjis not supported."})();var h=m(b),e={getMode:function(){return 8},getLength:function(t){return~~(h.length/2)},write:function(t){for(var o=h,s=0;s+1<o.length;){var r=(255&o[s])<<8|255&o[s+1];if(33088<=r&&r<=40956)r-=33088;else{if(!(57408<=r&&r<=60351))throw"illegal char at "+(s+1)+"/"+r;r-=49472}r=192*(r>>>8&255)+(255&r),t.put(r,13),s+=2}if(s<o.length)throw"illegal char at "+(s+1)}};return e},kt=function(){var b=[],m={writeByte:function(h){b.push(255&h)},writeShort:function(h){m.writeByte(h),m.writeByte(h>>>8)},writeBytes:function(h,e,t){e=e||0,t=t||h.length;for(var o=0;o<t;o+=1)m.writeByte(h[o+e])},writeString:function(h){for(var e=0;e<h.length;e+=1)m.writeByte(h.charCodeAt(e))},toByteArray:function(){return b},toString:function(){var h="";h+="[";for(var e=0;e<b.length;e+=1)e>0&&(h+=","),h+=b[e];return h+"]"}};return m},Dt=function(b){var m=b,h=0,e=0,t=0,o={read:function(){for(;t<8;){if(h>=m.length){if(t==0)return-1;throw"unexpected end of file./"+t}var r=m.charAt(h);if(h+=1,r=="=")return t=0,-1;r.match(/^\s$/)||(e=e<<6|s(r.charCodeAt(0)),t+=6)}var u=e>>>t-8&255;return t-=8,u}},s=function(r){if(65<=r&&r<=90)return r-65;if(97<=r&&r<=122)return r-97+26;if(48<=r&&r<=57)return r-48+52;if(r==43)return 62;if(r==47)return 63;throw"c:"+r};return o},xt=function(b,m,h){for(var e=function(y,k){var P=y,$=k,z=new Array(y*k),O={setPixel:function(c,p,i){z[p*P+c]=i},write:function(c){c.writeString("GIF87a"),c.writeShort(P),c.writeShort($),c.writeByte(128),c.writeByte(0),c.writeByte(0),c.writeByte(0),c.writeByte(0),c.writeByte(0),c.writeByte(255),c.writeByte(255),c.writeByte(255),c.writeString(","),c.writeShort(0),c.writeShort(0),c.writeShort(P),c.writeShort($),c.writeByte(0);var p=E(2);c.writeByte(2);for(var i=0;p.length-i>255;)c.writeByte(255),c.writeBytes(p,i,255),i+=255;c.writeByte(p.length-i),c.writeBytes(p,i,p.length-i),c.writeByte(0),c.writeString(";")}},E=function(c){for(var p=1<<c,i=1+(1<<c),l=c+1,g=M(),S=0;S<p;S+=1)g.add(String.fromCharCode(S));g.add(String.fromCharCode(p)),g.add(String.fromCharCode(i));var v,q,D,j=kt(),T=(v=j,q=0,D=0,{write:function(R,I){if(R>>>I)throw"length over";for(;q+I>=8;)v.writeByte(255&(R<<q|D)),I-=8-q,R>>>=8-q,D=0,q=0;D|=R<<q,q+=I},flush:function(){q>0&&v.writeByte(D)}});T.write(p,l);var Y=0,G=String.fromCharCode(z[Y]);for(Y+=1;Y<z.length;){var U=String.fromCharCode(z[Y]);Y+=1,g.contains(G+U)?G+=U:(T.write(g.indexOf(G),l),g.size()<4095&&(g.size()==1<<l&&(l+=1),g.add(G+U)),G=U)}return T.write(g.indexOf(G),l),T.write(i,l),T.flush(),j.toByteArray()},M=function(){var c={},p=0,i={add:function(l){if(i.contains(l))throw"dup key:"+l;c[l]=p,p+=1},size:function(){return p},indexOf:function(l){return c[l]},contains:function(l){return c[l]!==void 0}};return i};return O}(b,m),t=0;t<m;t+=1)for(var o=0;o<b;o+=1)e.setPixel(o,t,h(o,t));var s=kt();e.write(s);for(var r=function(){var y=0,k=0,P=0,$="",z={},O=function(M){$+=String.fromCharCode(E(63&M))},E=function(M){if(!(M<0)){if(M<26)return 65+M;if(M<52)return M-26+97;if(M<62)return M-52+48;if(M==62)return 43;if(M==63)return 47}throw"n:"+M};return z.writeByte=function(M){for(y=y<<8|255&M,k+=8,P+=1;k>=6;)O(y>>>k-6),k-=6},z.flush=function(){if(k>0&&(O(y<<6-k),y=0,k=0),P%3!=0)for(var M=3-P%3,c=0;c<M;c+=1)$+="="},z.toString=function(){return $},z}(),u=s.toByteArray(),f=0;f<u.length;f+=1)r.writeByte(u[f]);return r.flush(),"data:image/gif;base64,"+r};return H}();F.stringToBytesFuncs["UTF-8"]=function(H){return function(Z){for(var et=[],nt=0;nt<Z.length;nt++){var N=Z.charCodeAt(nt);N<128?et.push(N):N<2048?et.push(192|N>>6,128|63&N):N<55296||N>=57344?et.push(224|N>>12,128|N>>6&63,128|63&N):(nt++,N=65536+((1023&N)<<10|1023&Z.charCodeAt(nt)),et.push(240|N>>18,128|N>>12&63,128|N>>6&63,128|63&N))}return et}(H)},(W=typeof(B=function(){return F})=="function"?B.apply(x,[]):B)===void 0||(A.exports=W)}},w={};function _(A){var x=w[A];if(x!==void 0)return x.exports;var B=w[A]={exports:{}};return d[A](B,B.exports,_),B.exports}_.n=A=>{var x=A&&A.__esModule?()=>A.default:()=>A;return _.d(x,{a:x}),x},_.d=(A,x)=>{for(var B in x)_.o(x,B)&&!_.o(A,B)&&Object.defineProperty(A,B,{enumerable:!0,get:x[B]})},_.o=(A,x)=>Object.prototype.hasOwnProperty.call(A,x);var C={};return(()=>{_.d(C,{default:()=>m});const A=h=>!!h&&typeof h=="object"&&!Array.isArray(h);function x(h,...e){if(!e.length)return h;const t=e.shift();return t!==void 0&&A(h)&&A(t)?(h=Object.assign({},h),Object.keys(t).forEach(o=>{const s=h[o],r=t[o];Array.isArray(s)&&Array.isArray(r)?h[o]=r:A(s)&&A(r)?h[o]=x(Object.assign({},s),r):h[o]=r}),x(h,...e)):h}function B(h,e){const t=document.createElement("a");t.download=e,t.href=h,document.body.appendChild(t),t.click(),document.body.removeChild(t)}const W={L:.07,M:.15,Q:.25,H:.3};class F{constructor({svg:e,type:t,window:o}){this._svg=e,this._type=t,this._window=o}draw(e,t,o,s){let r;switch(this._type){case"dots":r=this._drawDot;break;case"classy":r=this._drawClassy;break;case"classy-rounded":r=this._drawClassyRounded;break;case"rounded":r=this._drawRounded;break;case"extra-rounded":r=this._drawExtraRounded;break;default:r=this._drawSquare}r.call(this,{x:e,y:t,size:o,getNeighbor:s})}_rotateFigure({x:e,y:t,size:o,rotation:s=0,draw:r}){var u;const f=e+o/2,y=t+o/2;r(),(u=this._element)===null||u===void 0||u.setAttribute("transform",`rotate(${180*s/Math.PI},${f},${y})`)}_basicDot(e){const{size:t,x:o,y:s}=e;this._rotateFigure(Object.assign(Object.assign({},e),{draw:()=>{this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","circle"),this._element.setAttribute("cx",String(o+t/2)),this._element.setAttribute("cy",String(s+t/2)),this._element.setAttribute("r",String(t/2))}}))}_basicSquare(e){const{size:t,x:o,y:s}=e;this._rotateFigure(Object.assign(Object.assign({},e),{draw:()=>{this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","rect"),this._element.setAttribute("x",String(o)),this._element.setAttribute("y",String(s)),this._element.setAttribute("width",String(t)),this._element.setAttribute("height",String(t))}}))}_basicSideRounded(e){const{size:t,x:o,y:s}=e;this._rotateFigure(Object.assign(Object.assign({},e),{draw:()=>{this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","path"),this._element.setAttribute("d",`M ${o} ${s}v ${t}h `+t/2+`a ${t/2} ${t/2}, 0, 0, 0, 0 ${-t}`)}}))}_basicCornerRounded(e){const{size:t,x:o,y:s}=e;this._rotateFigure(Object.assign(Object.assign({},e),{draw:()=>{this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","path"),this._element.setAttribute("d",`M ${o} ${s}v ${t}h ${t}v `+-t/2+`a ${t/2} ${t/2}, 0, 0, 0, ${-t/2} ${-t/2}`)}}))}_basicCornerExtraRounded(e){const{size:t,x:o,y:s}=e;this._rotateFigure(Object.assign(Object.assign({},e),{draw:()=>{this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","path"),this._element.setAttribute("d",`M ${o} ${s}v ${t}h ${t}a ${t} ${t}, 0, 0, 0, ${-t} ${-t}`)}}))}_basicCornersRounded(e){const{size:t,x:o,y:s}=e;this._rotateFigure(Object.assign(Object.assign({},e),{draw:()=>{this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","path"),this._element.setAttribute("d",`M ${o} ${s}v `+t/2+`a ${t/2} ${t/2}, 0, 0, 0, ${t/2} ${t/2}h `+t/2+"v "+-t/2+`a ${t/2} ${t/2}, 0, 0, 0, ${-t/2} ${-t/2}`)}}))}_drawDot({x:e,y:t,size:o}){this._basicDot({x:e,y:t,size:o,rotation:0})}_drawSquare({x:e,y:t,size:o}){this._basicSquare({x:e,y:t,size:o,rotation:0})}_drawRounded({x:e,y:t,size:o,getNeighbor:s}){const r=s?+s(-1,0):0,u=s?+s(1,0):0,f=s?+s(0,-1):0,y=s?+s(0,1):0,k=r+u+f+y;if(k!==0)if(k>2||r&&u||f&&y)this._basicSquare({x:e,y:t,size:o,rotation:0});else{if(k===2){let P=0;return r&&f?P=Math.PI/2:f&&u?P=Math.PI:u&&y&&(P=-Math.PI/2),void this._basicCornerRounded({x:e,y:t,size:o,rotation:P})}if(k===1){let P=0;return f?P=Math.PI/2:u?P=Math.PI:y&&(P=-Math.PI/2),void this._basicSideRounded({x:e,y:t,size:o,rotation:P})}}else this._basicDot({x:e,y:t,size:o,rotation:0})}_drawExtraRounded({x:e,y:t,size:o,getNeighbor:s}){const r=s?+s(-1,0):0,u=s?+s(1,0):0,f=s?+s(0,-1):0,y=s?+s(0,1):0,k=r+u+f+y;if(k!==0)if(k>2||r&&u||f&&y)this._basicSquare({x:e,y:t,size:o,rotation:0});else{if(k===2){let P=0;return r&&f?P=Math.PI/2:f&&u?P=Math.PI:u&&y&&(P=-Math.PI/2),void this._basicCornerExtraRounded({x:e,y:t,size:o,rotation:P})}if(k===1){let P=0;return f?P=Math.PI/2:u?P=Math.PI:y&&(P=-Math.PI/2),void this._basicSideRounded({x:e,y:t,size:o,rotation:P})}}else this._basicDot({x:e,y:t,size:o,rotation:0})}_drawClassy({x:e,y:t,size:o,getNeighbor:s}){const r=s?+s(-1,0):0,u=s?+s(1,0):0,f=s?+s(0,-1):0,y=s?+s(0,1):0;r+u+f+y!==0?r||f?u||y?this._basicSquare({x:e,y:t,size:o,rotation:0}):this._basicCornerRounded({x:e,y:t,size:o,rotation:Math.PI/2}):this._basicCornerRounded({x:e,y:t,size:o,rotation:-Math.PI/2}):this._basicCornersRounded({x:e,y:t,size:o,rotation:Math.PI/2})}_drawClassyRounded({x:e,y:t,size:o,getNeighbor:s}){const r=s?+s(-1,0):0,u=s?+s(1,0):0,f=s?+s(0,-1):0,y=s?+s(0,1):0;r+u+f+y!==0?r||f?u||y?this._basicSquare({x:e,y:t,size:o,rotation:0}):this._basicCornerExtraRounded({x:e,y:t,size:o,rotation:Math.PI/2}):this._basicCornerExtraRounded({x:e,y:t,size:o,rotation:-Math.PI/2}):this._basicCornersRounded({x:e,y:t,size:o,rotation:Math.PI/2})}}const H={dot:"dot",square:"square",extraRounded:"extra-rounded"},Z=Object.values(H);class et{constructor({svg:e,type:t,window:o}){this._svg=e,this._type=t,this._window=o}draw(e,t,o,s){let r;switch(this._type){case H.square:r=this._drawSquare;break;case H.extraRounded:r=this._drawExtraRounded;break;default:r=this._drawDot}r.call(this,{x:e,y:t,size:o,rotation:s})}_rotateFigure({x:e,y:t,size:o,rotation:s=0,draw:r}){var u;const f=e+o/2,y=t+o/2;r(),(u=this._element)===null||u===void 0||u.setAttribute("transform",`rotate(${180*s/Math.PI},${f},${y})`)}_basicDot(e){const{size:t,x:o,y:s}=e,r=t/7;this._rotateFigure(Object.assign(Object.assign({},e),{draw:()=>{this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","path"),this._element.setAttribute("clip-rule","evenodd"),this._element.setAttribute("d",`M ${o+t/2} ${s}a ${t/2} ${t/2} 0 1 0 0.1 0zm 0 ${r}a ${t/2-r} ${t/2-r} 0 1 1 -0.1 0Z`)}}))}_basicSquare(e){const{size:t,x:o,y:s}=e,r=t/7;this._rotateFigure(Object.assign(Object.assign({},e),{draw:()=>{this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","path"),this._element.setAttribute("clip-rule","evenodd"),this._element.setAttribute("d",`M ${o} ${s}v ${t}h ${t}v `+-t+`zM ${o+r} ${s+r}h `+(t-2*r)+"v "+(t-2*r)+"h "+(2*r-t)+"z")}}))}_basicExtraRounded(e){const{size:t,x:o,y:s}=e,r=t/7;this._rotateFigure(Object.assign(Object.assign({},e),{draw:()=>{this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","path"),this._element.setAttribute("clip-rule","evenodd"),this._element.setAttribute("d",`M ${o} ${s+2.5*r}v `+2*r+`a ${2.5*r} ${2.5*r}, 0, 0, 0, ${2.5*r} ${2.5*r}h `+2*r+`a ${2.5*r} ${2.5*r}, 0, 0, 0, ${2.5*r} ${2.5*-r}v `+-2*r+`a ${2.5*r} ${2.5*r}, 0, 0, 0, ${2.5*-r} ${2.5*-r}h `+-2*r+`a ${2.5*r} ${2.5*r}, 0, 0, 0, ${2.5*-r} ${2.5*r}M ${o+2.5*r} ${s+r}h `+2*r+`a ${1.5*r} ${1.5*r}, 0, 0, 1, ${1.5*r} ${1.5*r}v `+2*r+`a ${1.5*r} ${1.5*r}, 0, 0, 1, ${1.5*-r} ${1.5*r}h `+-2*r+`a ${1.5*r} ${1.5*r}, 0, 0, 1, ${1.5*-r} ${1.5*-r}v `+-2*r+`a ${1.5*r} ${1.5*r}, 0, 0, 1, ${1.5*r} ${1.5*-r}`)}}))}_drawDot({x:e,y:t,size:o,rotation:s}){this._basicDot({x:e,y:t,size:o,rotation:s})}_drawSquare({x:e,y:t,size:o,rotation:s}){this._basicSquare({x:e,y:t,size:o,rotation:s})}_drawExtraRounded({x:e,y:t,size:o,rotation:s}){this._basicExtraRounded({x:e,y:t,size:o,rotation:s})}}const nt={dot:"dot",square:"square"},N=Object.values(nt);class ct{constructor({svg:e,type:t,window:o}){this._svg=e,this._type=t,this._window=o}draw(e,t,o,s){let r;r=this._type===nt.square?this._drawSquare:this._drawDot,r.call(this,{x:e,y:t,size:o,rotation:s})}_rotateFigure({x:e,y:t,size:o,rotation:s=0,draw:r}){var u;const f=e+o/2,y=t+o/2;r(),(u=this._element)===null||u===void 0||u.setAttribute("transform",`rotate(${180*s/Math.PI},${f},${y})`)}_basicDot(e){const{size:t,x:o,y:s}=e;this._rotateFigure(Object.assign(Object.assign({},e),{draw:()=>{this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","circle"),this._element.setAttribute("cx",String(o+t/2)),this._element.setAttribute("cy",String(s+t/2)),this._element.setAttribute("r",String(t/2))}}))}_basicSquare(e){const{size:t,x:o,y:s}=e;this._rotateFigure(Object.assign(Object.assign({},e),{draw:()=>{this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","rect"),this._element.setAttribute("x",String(o)),this._element.setAttribute("y",String(s)),this._element.setAttribute("width",String(t)),this._element.setAttribute("height",String(t))}}))}_drawDot({x:e,y:t,size:o,rotation:s}){this._basicDot({x:e,y:t,size:o,rotation:s})}_drawSquare({x:e,y:t,size:o,rotation:s}){this._basicSquare({x:e,y:t,size:o,rotation:s})}}const ft="circle",K=[[1,1,1,1,1,1,1],[1,0,0,0,0,0,1],[1,0,0,0,0,0,1],[1,0,0,0,0,0,1],[1,0,0,0,0,0,1],[1,0,0,0,0,0,1],[1,1,1,1,1,1,1]],Q=[[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,1,1,1,0,0],[0,0,1,1,1,0,0],[0,0,1,1,1,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0]];class it{constructor(e,t){this._roundSize=o=>this._options.dotsOptions.roundSize?Math.floor(o):o,this._window=t,this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","svg"),this._element.setAttribute("width",String(e.width)),this._element.setAttribute("height",String(e.height)),this._element.setAttribute("xmlns:xlink","http://www.w3.org/1999/xlink"),e.dotsOptions.roundSize||this._element.setAttribute("shape-rendering","crispEdges"),this._element.setAttribute("viewBox",`0 0 ${e.width} ${e.height}`),this._defs=this._window.document.createElementNS("http://www.w3.org/2000/svg","defs"),this._element.appendChild(this._defs),this._imageUri=e.image,this._instanceId=it.instanceCount++,this._options=e}get width(){return this._options.width}get height(){return this._options.height}getElement(){return this._element}async drawQR(e){const t=e.getModuleCount(),o=Math.min(this._options.width,this._options.height)-2*this._options.margin,s=this._options.shape===ft?o/Math.sqrt(2):o,r=this._roundSize(s/t);let u={hideXDots:0,hideYDots:0,width:0,height:0};if(this._qr=e,this._options.image){if(await this.loadImage(),!this._image)return;const{imageOptions:f,qrOptions:y}=this._options,k=f.imageSize*W[y.errorCorrectionLevel],P=Math.floor(k*t*t);u=function({originalHeight:$,originalWidth:z,maxHiddenDots:O,maxHiddenAxisDots:E,dotSize:M}){const c={x:0,y:0},p={x:0,y:0};if($<=0||z<=0||O<=0||M<=0)return{height:0,width:0,hideYDots:0,hideXDots:0};const i=$/z;return c.x=Math.floor(Math.sqrt(O/i)),c.x<=0&&(c.x=1),E&&E<c.x&&(c.x=E),c.x%2==0&&c.x--,p.x=c.x*M,c.y=1+2*Math.ceil((c.x*i-1)/2),p.y=Math.round(p.x*i),(c.y*c.x>O||E&&E<c.y)&&(E&&E<c.y?(c.y=E,c.y%2==0&&c.x--):c.y-=2,p.y=c.y*M,c.x=1+2*Math.ceil((c.y/i-1)/2),p.x=Math.round(p.y/i)),{height:p.y,width:p.x,hideYDots:c.y,hideXDots:c.x}}({originalWidth:this._image.width,originalHeight:this._image.height,maxHiddenDots:P,maxHiddenAxisDots:t-14,dotSize:r})}this.drawBackground(),this.drawDots((f,y)=>{var k,P,$,z,O,E;return!(this._options.imageOptions.hideBackgroundDots&&f>=(t-u.hideYDots)/2&&f<(t+u.hideYDots)/2&&y>=(t-u.hideXDots)/2&&y<(t+u.hideXDots)/2||!((k=K[f])===null||k===void 0)&&k[y]||!((P=K[f-t+7])===null||P===void 0)&&P[y]||!(($=K[f])===null||$===void 0)&&$[y-t+7]||!((z=Q[f])===null||z===void 0)&&z[y]||!((O=Q[f-t+7])===null||O===void 0)&&O[y]||!((E=Q[f])===null||E===void 0)&&E[y-t+7])}),this.drawCorners(),this._options.image&&await this.drawImage({width:u.width,height:u.height,count:t,dotSize:r})}drawBackground(){var e,t,o;const s=this._element,r=this._options;if(s){const u=(e=r.backgroundOptions)===null||e===void 0?void 0:e.gradient,f=(t=r.backgroundOptions)===null||t===void 0?void 0:t.color;let y=r.height,k=r.width;if(u||f){const P=this._window.document.createElementNS("http://www.w3.org/2000/svg","rect");this._backgroundClipPath=this._window.document.createElementNS("http://www.w3.org/2000/svg","clipPath"),this._backgroundClipPath.setAttribute("id",`clip-path-background-color-${this._instanceId}`),this._defs.appendChild(this._backgroundClipPath),!((o=r.backgroundOptions)===null||o===void 0)&&o.round&&(y=k=Math.min(r.width,r.height),P.setAttribute("rx",String(y/2*r.backgroundOptions.round))),P.setAttribute("x",String(this._roundSize((r.width-k)/2))),P.setAttribute("y",String(this._roundSize((r.height-y)/2))),P.setAttribute("width",String(k)),P.setAttribute("height",String(y)),this._backgroundClipPath.appendChild(P),this._createColor({options:u,color:f,additionalRotation:0,x:0,y:0,height:r.height,width:r.width,name:`background-color-${this._instanceId}`})}}}drawDots(e){var t,o;if(!this._qr)throw"QR code is not defined";const s=this._options,r=this._qr.getModuleCount();if(r>s.width||r>s.height)throw"The canvas is too small.";const u=Math.min(s.width,s.height)-2*s.margin,f=s.shape===ft?u/Math.sqrt(2):u,y=this._roundSize(f/r),k=this._roundSize((s.width-r*y)/2),P=this._roundSize((s.height-r*y)/2),$=new F({svg:this._element,type:s.dotsOptions.type,window:this._window});this._dotsClipPath=this._window.document.createElementNS("http://www.w3.org/2000/svg","clipPath"),this._dotsClipPath.setAttribute("id",`clip-path-dot-color-${this._instanceId}`),this._defs.appendChild(this._dotsClipPath),this._createColor({options:(t=s.dotsOptions)===null||t===void 0?void 0:t.gradient,color:s.dotsOptions.color,additionalRotation:0,x:0,y:0,height:s.height,width:s.width,name:`dot-color-${this._instanceId}`});for(let z=0;z<r;z++)for(let O=0;O<r;O++)e&&!e(z,O)||!((o=this._qr)===null||o===void 0)&&o.isDark(z,O)&&($.draw(k+O*y,P+z*y,y,(E,M)=>!(O+E<0||z+M<0||O+E>=r||z+M>=r)&&!(e&&!e(z+M,O+E))&&!!this._qr&&this._qr.isDark(z+M,O+E)),$._element&&this._dotsClipPath&&this._dotsClipPath.appendChild($._element));if(s.shape===ft){const z=this._roundSize((u/y-r)/2),O=r+2*z,E=k-z*y,M=P-z*y,c=[],p=this._roundSize(O/2);for(let i=0;i<O;i++){c[i]=[];for(let l=0;l<O;l++)i>=z-1&&i<=O-z&&l>=z-1&&l<=O-z||Math.sqrt((i-p)*(i-p)+(l-p)*(l-p))>p?c[i][l]=0:c[i][l]=this._qr.isDark(l-2*z<0?l:l>=r?l-2*z:l-z,i-2*z<0?i:i>=r?i-2*z:i-z)?1:0}for(let i=0;i<O;i++)for(let l=0;l<O;l++)c[i][l]&&($.draw(E+l*y,M+i*y,y,(g,S)=>{var v;return!!(!((v=c[i+S])===null||v===void 0)&&v[l+g])}),$._element&&this._dotsClipPath&&this._dotsClipPath.appendChild($._element))}}drawCorners(){if(!this._qr)throw"QR code is not defined";const e=this._element,t=this._options;if(!e)throw"Element code is not defined";const o=this._qr.getModuleCount(),s=Math.min(t.width,t.height)-2*t.margin,r=t.shape===ft?s/Math.sqrt(2):s,u=this._roundSize(r/o),f=7*u,y=3*u,k=this._roundSize((t.width-o*u)/2),P=this._roundSize((t.height-o*u)/2);[[0,0,0],[1,0,Math.PI/2],[0,1,-Math.PI/2]].forEach(([$,z,O])=>{var E,M,c,p,i,l,g,S,v,q,D,j,T,Y;const G=k+$*u*(o-7),U=P+z*u*(o-7);let R=this._dotsClipPath,I=this._dotsClipPath;if((!((E=t.cornersSquareOptions)===null||E===void 0)&&E.gradient||!((M=t.cornersSquareOptions)===null||M===void 0)&&M.color)&&(R=this._window.document.createElementNS("http://www.w3.org/2000/svg","clipPath"),R.setAttribute("id",`clip-path-corners-square-color-${$}-${z}-${this._instanceId}`),this._defs.appendChild(R),this._cornersSquareClipPath=this._cornersDotClipPath=I=R,this._createColor({options:(c=t.cornersSquareOptions)===null||c===void 0?void 0:c.gradient,color:(p=t.cornersSquareOptions)===null||p===void 0?void 0:p.color,additionalRotation:O,x:G,y:U,height:f,width:f,name:`corners-square-color-${$}-${z}-${this._instanceId}`})),((i=t.cornersSquareOptions)===null||i===void 0?void 0:i.type)&&Z.includes(t.cornersSquareOptions.type)){const X=new et({svg:this._element,type:t.cornersSquareOptions.type,window:this._window});X.draw(G,U,f,O),X._element&&R&&R.appendChild(X._element)}else{const X=new F({svg:this._element,type:((l=t.cornersSquareOptions)===null||l===void 0?void 0:l.type)||t.dotsOptions.type,window:this._window});for(let tt=0;tt<K.length;tt++)for(let L=0;L<K[tt].length;L++)!((g=K[tt])===null||g===void 0)&&g[L]&&(X.draw(G+L*u,U+tt*u,u,(dt,st)=>{var ot;return!!(!((ot=K[tt+st])===null||ot===void 0)&&ot[L+dt])}),X._element&&R&&R.appendChild(X._element))}if((!((S=t.cornersDotOptions)===null||S===void 0)&&S.gradient||!((v=t.cornersDotOptions)===null||v===void 0)&&v.color)&&(I=this._window.document.createElementNS("http://www.w3.org/2000/svg","clipPath"),I.setAttribute("id",`clip-path-corners-dot-color-${$}-${z}-${this._instanceId}`),this._defs.appendChild(I),this._cornersDotClipPath=I,this._createColor({options:(q=t.cornersDotOptions)===null||q===void 0?void 0:q.gradient,color:(D=t.cornersDotOptions)===null||D===void 0?void 0:D.color,additionalRotation:O,x:G+2*u,y:U+2*u,height:y,width:y,name:`corners-dot-color-${$}-${z}-${this._instanceId}`})),((j=t.cornersDotOptions)===null||j===void 0?void 0:j.type)&&N.includes(t.cornersDotOptions.type)){const X=new ct({svg:this._element,type:t.cornersDotOptions.type,window:this._window});X.draw(G+2*u,U+2*u,y,O),X._element&&I&&I.appendChild(X._element)}else{const X=new F({svg:this._element,type:((T=t.cornersDotOptions)===null||T===void 0?void 0:T.type)||t.dotsOptions.type,window:this._window});for(let tt=0;tt<Q.length;tt++)for(let L=0;L<Q[tt].length;L++)!((Y=Q[tt])===null||Y===void 0)&&Y[L]&&(X.draw(G+L*u,U+tt*u,u,(dt,st)=>{var ot;return!!(!((ot=Q[tt+st])===null||ot===void 0)&&ot[L+dt])}),X._element&&I&&I.appendChild(X._element))}})}loadImage(){return new Promise((e,t)=>{var o;const s=this._options;if(!s.image)return t("Image is not defined");if(!((o=s.nodeCanvas)===null||o===void 0)&&o.loadImage)s.nodeCanvas.loadImage(s.image).then(r=>{var u,f;if(this._image=r,this._options.imageOptions.saveAsBlob){const y=(u=s.nodeCanvas)===null||u===void 0?void 0:u.createCanvas(this._image.width,this._image.height);(f=y==null?void 0:y.getContext("2d"))===null||f===void 0||f.drawImage(r,0,0),this._imageUri=y==null?void 0:y.toDataURL()}e()}).catch(t);else{const r=new this._window.Image;typeof s.imageOptions.crossOrigin=="string"&&(r.crossOrigin=s.imageOptions.crossOrigin),this._image=r,r.onload=async()=>{this._options.imageOptions.saveAsBlob&&(this._imageUri=await async function(u,f){return new Promise(y=>{const k=new f.XMLHttpRequest;k.onload=function(){const P=new f.FileReader;P.onloadend=function(){y(P.result)},P.readAsDataURL(k.response)},k.open("GET",u),k.responseType="blob",k.send()})}(s.image||"",this._window)),e()},r.src=s.image}})}async drawImage({width:e,height:t,count:o,dotSize:s}){const r=this._options,u=this._roundSize((r.width-o*s)/2),f=this._roundSize((r.height-o*s)/2),y=u+this._roundSize(r.imageOptions.margin+(o*s-e)/2),k=f+this._roundSize(r.imageOptions.margin+(o*s-t)/2),P=e-2*r.imageOptions.margin,$=t-2*r.imageOptions.margin,z=this._window.document.createElementNS("http://www.w3.org/2000/svg","image");z.setAttribute("href",this._imageUri||""),z.setAttribute("xlink:href",this._imageUri||""),z.setAttribute("x",String(y)),z.setAttribute("y",String(k)),z.setAttribute("width",`${P}px`),z.setAttribute("height",`${$}px`),this._element.appendChild(z)}_createColor({options:e,color:t,additionalRotation:o,x:s,y:r,height:u,width:f,name:y}){const k=f>u?f:u,P=this._window.document.createElementNS("http://www.w3.org/2000/svg","rect");if(P.setAttribute("x",String(s)),P.setAttribute("y",String(r)),P.setAttribute("height",String(u)),P.setAttribute("width",String(f)),P.setAttribute("clip-path",`url('#clip-path-${y}')`),e){let $;if(e.type==="radial")$=this._window.document.createElementNS("http://www.w3.org/2000/svg","radialGradient"),$.setAttribute("id",y),$.setAttribute("gradientUnits","userSpaceOnUse"),$.setAttribute("fx",String(s+f/2)),$.setAttribute("fy",String(r+u/2)),$.setAttribute("cx",String(s+f/2)),$.setAttribute("cy",String(r+u/2)),$.setAttribute("r",String(k/2));else{const z=((e.rotation||0)+o)%(2*Math.PI),O=(z+2*Math.PI)%(2*Math.PI);let E=s+f/2,M=r+u/2,c=s+f/2,p=r+u/2;O>=0&&O<=.25*Math.PI||O>1.75*Math.PI&&O<=2*Math.PI?(E-=f/2,M-=u/2*Math.tan(z),c+=f/2,p+=u/2*Math.tan(z)):O>.25*Math.PI&&O<=.75*Math.PI?(M-=u/2,E-=f/2/Math.tan(z),p+=u/2,c+=f/2/Math.tan(z)):O>.75*Math.PI&&O<=1.25*Math.PI?(E+=f/2,M+=u/2*Math.tan(z),c-=f/2,p-=u/2*Math.tan(z)):O>1.25*Math.PI&&O<=1.75*Math.PI&&(M+=u/2,E+=f/2/Math.tan(z),p-=u/2,c-=f/2/Math.tan(z)),$=this._window.document.createElementNS("http://www.w3.org/2000/svg","linearGradient"),$.setAttribute("id",y),$.setAttribute("gradientUnits","userSpaceOnUse"),$.setAttribute("x1",String(Math.round(E))),$.setAttribute("y1",String(Math.round(M))),$.setAttribute("x2",String(Math.round(c))),$.setAttribute("y2",String(Math.round(p)))}e.colorStops.forEach(({offset:z,color:O})=>{const E=this._window.document.createElementNS("http://www.w3.org/2000/svg","stop");E.setAttribute("offset",100*z+"%"),E.setAttribute("stop-color",O),$.appendChild(E)}),P.setAttribute("fill",`url('#${y}')`),this._defs.appendChild($)}else t&&P.setAttribute("fill",t);this._element.appendChild(P)}}it.instanceCount=0;const wt=it,zt="canvas",mt={};for(let h=0;h<=40;h++)mt[h]=h;const ut={type:zt,shape:"square",width:300,height:300,data:"",margin:0,qrOptions:{typeNumber:mt[0],mode:void 0,errorCorrectionLevel:"Q"},imageOptions:{saveAsBlob:!0,hideBackgroundDots:!0,imageSize:.4,crossOrigin:void 0,margin:0},dotsOptions:{type:"square",color:"#000",roundSize:!0},backgroundOptions:{round:0,color:"#fff"}};function vt(h){const e=Object.assign({},h);if(!e.colorStops||!e.colorStops.length)throw"Field 'colorStops' is required in gradient";return e.rotation?e.rotation=Number(e.rotation):e.rotation=0,e.colorStops=e.colorStops.map(t=>Object.assign(Object.assign({},t),{offset:Number(t.offset)})),e}function Pt(h){const e=Object.assign({},h);return e.width=Number(e.width),e.height=Number(e.height),e.margin=Number(e.margin),e.imageOptions=Object.assign(Object.assign({},e.imageOptions),{hideBackgroundDots:!!e.imageOptions.hideBackgroundDots,imageSize:Number(e.imageOptions.imageSize),margin:Number(e.imageOptions.margin)}),e.margin>Math.min(e.width,e.height)&&(e.margin=Math.min(e.width,e.height)),e.dotsOptions=Object.assign({},e.dotsOptions),e.dotsOptions.gradient&&(e.dotsOptions.gradient=vt(e.dotsOptions.gradient)),e.cornersSquareOptions&&(e.cornersSquareOptions=Object.assign({},e.cornersSquareOptions),e.cornersSquareOptions.gradient&&(e.cornersSquareOptions.gradient=vt(e.cornersSquareOptions.gradient))),e.cornersDotOptions&&(e.cornersDotOptions=Object.assign({},e.cornersDotOptions),e.cornersDotOptions.gradient&&(e.cornersDotOptions.gradient=vt(e.cornersDotOptions.gradient))),e.backgroundOptions&&(e.backgroundOptions=Object.assign({},e.backgroundOptions),e.backgroundOptions.gradient&&(e.backgroundOptions.gradient=vt(e.backgroundOptions.gradient))),e}var kt=_(873),Dt=_.n(kt);function xt(h){if(!h)throw new Error("Extension must be defined");h[0]==="."&&(h=h.substring(1));const e={bmp:"image/bmp",gif:"image/gif",ico:"image/vnd.microsoft.icon",jpeg:"image/jpeg",jpg:"image/jpeg",png:"image/png",svg:"image/svg+xml",tif:"image/tiff",tiff:"image/tiff",webp:"image/webp",pdf:"application/pdf"}[h.toLowerCase()];if(!e)throw new Error(`Extension "${h}" is not supported`);return e}class b{constructor(e){e!=null&&e.jsdom?this._window=new e.jsdom("",{resources:"usable"}).window:this._window=window,this._options=e?Pt(x(ut,e)):ut,this.update()}static _clearContainer(e){e&&(e.innerHTML="")}_setupSvg(){if(!this._qr)return;const e=new wt(this._options,this._window);this._svg=e.getElement(),this._svgDrawingPromise=e.drawQR(this._qr).then(()=>{var t;this._svg&&((t=this._extension)===null||t===void 0||t.call(this,e.getElement(),this._options))})}_setupCanvas(){var e,t;this._qr&&(!((e=this._options.nodeCanvas)===null||e===void 0)&&e.createCanvas?(this._nodeCanvas=this._options.nodeCanvas.createCanvas(this._options.width,this._options.height),this._nodeCanvas.width=this._options.width,this._nodeCanvas.height=this._options.height):(this._domCanvas=document.createElement("canvas"),this._domCanvas.width=this._options.width,this._domCanvas.height=this._options.height),this._setupSvg(),this._canvasDrawingPromise=(t=this._svgDrawingPromise)===null||t===void 0?void 0:t.then(()=>{var o;if(!this._svg)return;const s=this._svg,r=new this._window.XMLSerializer().serializeToString(s),u=btoa(r),f=`data:${xt("svg")};base64,${u}`;if(!((o=this._options.nodeCanvas)===null||o===void 0)&&o.loadImage)return this._options.nodeCanvas.loadImage(f).then(y=>{var k,P;y.width=this._options.width,y.height=this._options.height,(P=(k=this._nodeCanvas)===null||k===void 0?void 0:k.getContext("2d"))===null||P===void 0||P.drawImage(y,0,0)});{const y=new this._window.Image;return new Promise(k=>{y.onload=()=>{var P,$;($=(P=this._domCanvas)===null||P===void 0?void 0:P.getContext("2d"))===null||$===void 0||$.drawImage(y,0,0),k()},y.src=f})}}))}async _getElement(e="png"){if(!this._qr)throw"QR code is empty";return e.toLowerCase()==="svg"?(this._svg&&this._svgDrawingPromise||this._setupSvg(),await this._svgDrawingPromise,this._svg):((this._domCanvas||this._nodeCanvas)&&this._canvasDrawingPromise||this._setupCanvas(),await this._canvasDrawingPromise,this._domCanvas||this._nodeCanvas)}update(e){b._clearContainer(this._container),this._options=e?Pt(x(this._options,e)):this._options,this._options.data&&(this._qr=Dt()(this._options.qrOptions.typeNumber,this._options.qrOptions.errorCorrectionLevel),this._qr.addData(this._options.data,this._options.qrOptions.mode||function(t){switch(!0){case/^[0-9]*$/.test(t):return"Numeric";case/^[0-9A-Z $%*+\-./:]*$/.test(t):return"Alphanumeric";default:return"Byte"}}(this._options.data)),this._qr.make(),this._options.type===zt?this._setupCanvas():this._setupSvg(),this.append(this._container))}append(e){if(e){if(typeof e.appendChild!="function")throw"Container should be a single DOM node";this._options.type===zt?this._domCanvas&&e.appendChild(this._domCanvas):this._svg&&e.appendChild(this._svg),this._container=e}}applyExtension(e){if(!e)throw"Extension function should be defined.";this._extension=e,this.update()}deleteExtension(){this._extension=void 0,this.update()}async getRawData(e="png"){if(!this._qr)throw"QR code is empty";const t=await this._getElement(e),o=xt(e);if(!t)return null;if(e.toLowerCase()==="svg"){const s=`<?xml version="1.0" standalone="no"?>\r
${new this._window.XMLSerializer().serializeToString(t)}`;return typeof Blob>"u"||this._options.jsdom?Buffer.from(s):new Blob([s],{type:o})}return new Promise(s=>{const r=t;if("toBuffer"in r)if(o==="image/png")s(r.toBuffer(o));else if(o==="image/jpeg")s(r.toBuffer(o));else{if(o!=="application/pdf")throw Error("Unsupported extension");s(r.toBuffer(o))}else"toBlob"in r&&r.toBlob(s,o,1)})}async download(e){if(!this._qr)throw"QR code is empty";if(typeof Blob>"u")throw"Cannot download in Node.js, call getRawData instead.";let t="png",o="qr";typeof e=="string"?(t=e,console.warn("Extension is deprecated as argument for 'download' method, please pass object { name: '...', extension: '...' } as argument")):typeof e=="object"&&e!==null&&(e.name&&(o=e.name),e.extension&&(t=e.extension));const s=await this._getElement(t);if(s)if(t.toLowerCase()==="svg"){let r=new XMLSerializer().serializeToString(s);r=`<?xml version="1.0" standalone="no"?>\r
`+r,B(`data:${xt(t)};charset=utf-8,${encodeURIComponent(r)}`,`${o}.svg`)}else B(s.toDataURL(xt(t)),`${o}.${t}`)}}const m=b})(),C.default})())}(Ut)),Ut.exports}var Pe=Ce();const ke=_e(Pe),ze=`
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
`;var qt=(n=>(n.PENDING="PENDING",n.PAID="PAID",n.SETTLED="SETTLED",n.FAILED="FAILED",n.CANCELLED="CANCELLED",n))(qt||{});re(["click"]);var Ae=yt('<div class=test-mode-badge tabindex=0><svg width=16 height=16 viewBox="0 0 20 20"fill=none xmlns=http://www.w3.org/2000/svg><circle cx=10 cy=10 r=9 stroke=#b45309 stroke-width=2 fill=#fef3c7></circle><text x=10 y=15 text-anchor=middle font-size=12 fill=#b45309 font-family=Arial font-weight=bold>i</text></svg><span class=test-mode-badge-text>Test Mode</span><div class=test-mode-tooltip>Test Mode: No real money will be moved.'),se=yt("<div>Complete on your phone"),ae=yt("<div>Attempting to reconnect..."),$e=yt("<div class=qr-code-container id=qrcode-container-mobile>"),qe=yt('<div><div class=mobile-button-container><button class=mobile-button title="Open on mobile device"><svg width=20 height=20 viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round><rect x=5 y=2 width=14 height=20 rx=2 ry=2></rect><line x1=12 y1=18 x2=12 y2=18></line></svg><span>Open app to continue'),Oe=yt("<div class=savings-badge>"),Me=yt("<div class=zenobia-error>"),Ee=yt('<div class="zenobia-qr-popup-overlay visible"><div class=zenobia-qr-popup-content><button class=zenobia-qr-close><svg viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2><path d="M18 6L6 18M6 6l12 12"></path></svg></button><div class=modal-header><div class=header-content><h3>Pay by bank with Zenobia</h3><p class=subtitle>Scan to complete your purchase</p></div></div><div class=modal-body><div class=payment-amount>$</div><div class=payment-status><div class=spinner></div><div class=payment-instructions>'),De=yt("<div class=qr-code-container id=qrcode-container>"),le=yt("<div class=qr-code-container><div class=zenobia-qr-placeholder>");const Ie=()=>{if(typeof window>"u")return!1;const n=window.navigator.userAgent.toLowerCase(),a=/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(n),d="ontouchstart"in window||navigator.maxTouchPoints>0,w=window.innerWidth<=768;return a||d&&w},Be=n=>{const[a,d]=at(null),w={current:null},[_,C]=at(qt.PENDING),[A,x]=at(null),[B,W]=at(!1),[F,H]=at(null),[Z,et]=at(null),[nt,N]=at(!1),[ct,ft]=at(""),[K,Q]=at(!1),[it,wt]=at(!1),[zt,mt]=at(null),[ut,vt]=at(!1),[Pt,kt]=at({x:0,y:0}),[Dt,xt]=at({x:400,y:400});let b=null;const m=()=>{if(ut())return;const f=400,y=600,k=(window.innerWidth-f)/2,P=(window.innerHeight-y)/2;vt(!0),kt({x:k,y:P}),xt({x:400,y:400});const $=()=>{if(!ut())return;const z=Pt(),O=Dt(),E=z.x+O.x,M=z.y+O.y,c=window.innerWidth,p=window.innerHeight;let i=O.x,l=O.y;(E<=0||E+f>=c)&&(i=-i),(M<=0||M+y>=p)&&(l=-l),kt({x:Math.max(0,Math.min(E,c-f)),y:Math.max(0,Math.min(M,p-y))}),xt({x:i,y:l}),b=requestAnimationFrame($)};b=requestAnimationFrame($)},h=()=>{vt(!1),b&&(cancelAnimationFrame(b),b=null),kt({x:0,y:0})};Tt(()=>{if(n.isOpen&&!F()){Q(!1),wt(!1),mt(null),x(null);const f=new xe(n.isTest);if(H(f),n.transferRequest)et(n.transferRequest),f.listenToTransfer(n.transferRequest.transferRequestId,n.transferRequest.signature||"",e,t,o,s);else if(n.url){N(!0),x(null);const y=n.metadata||{amount:n.amount,statementItems:{name:"Payment",amount:n.amount}};f.createTransfer(n.url,y).then(k=>{et({transferRequestId:k.transferRequestId,merchantId:k.merchantId,expiry:k.expiry,signature:k.signature}),f.listenToTransfer(k.transferRequestId,k.signature||"",e,t,o,s)}).catch(k=>{x(k instanceof Error?k.message:"An error occurred"),n.onError&&k instanceof Error&&n.onError(k)}).finally(()=>{N(!1)})}else x("No URL provided for creating a new transfer")}}),Tt(()=>{var f;if((f=Z())!=null&&f.transferRequestId){const y=Z().transferRequestId.replace(/-/g,"");let P=`https://zenobiapay.com/clip?id=${btoa(y).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}`;n.isTest&&(P+="&type=test"),ft(P);const z=n.qrCodeSize||220,O=new ke({width:z,height:z,type:"svg",data:P,image:void 0,dotsOptions:{color:"#000000",type:"dots"},backgroundOptions:{color:"#ffffff"},cornersSquareOptions:{type:"extra-rounded"},cornersDotOptions:{type:"dot"},qrOptions:{errorCorrectionLevel:"M"}});d(O)}}),Tt(()=>{const f=a();setTimeout(()=>{f&&w.current&&(w.current.innerHTML="",f.append(w.current))},0)});const e=f=>{console.log("Received status update:",f);let y;switch(f.status){case"SETTLED":case"PAID":y=qt.PAID,n.onSuccess&&Z()&&n.onSuccess(Z(),f);const k=F();k&&(k.disconnect(),H(null));break;case"FAILED":y=qt.FAILED;const P=F();P&&(P.disconnect(),H(null));break;case"CANCELLED":y=qt.CANCELLED;const $=F();$&&($.disconnect(),H(null));break;default:y=qt.PENDING}C(y),n.onStatusChange&&n.onStatusChange(y)},t=f=>{console.error("WebSocket error:",f),f.toLowerCase().includes("disconnect")||f.toLowerCase().includes("connection lost")||f.toLowerCase().includes("network error")||f.toLowerCase().includes("timeout")?(mt(f),wt(!0)):(x(f),n.onError&&n.onError(new Error(f)))},o=f=>{console.log("WebSocket connection status:",f?"Connected":"Disconnected"),W(f),f?(wt(!1),mt(null)):wt(!0)},s=f=>{console.log("Scan update received:",f.scanType),f.scanType==="scanned"?(Q(!0),m()):f.scanType==="unscanned"&&(Q(!1),h())};ue(()=>{const f=F();f&&f.disconnect(),h()}),Tt(()=>{if(!n.isOpen){const f=F();f&&(f.disconnect(),H(null)),Q(!1),wt(!1),mt(null),x(null),h()}});const r=()=>n.discountAmount!==void 0?n.discountAmount:Math.round(n.amount/100),u=()=>{if(!n.showCashback)return null;const f=r();return f<1e3?`✨ ${(f/n.amount*100).toFixed(0)}% cashback applied!`:`✨ Applied $${(f/100).toFixed(2)} cashback!`};return ht(gt,{get when(){return n.isOpen},get children(){var f=Ee(),y=f.firstChild,k=y.firstChild,P=k.nextSibling,$=P.firstChild,z=$.firstChild;z.nextSibling;var O=P.nextSibling,E=O.firstChild;E.firstChild;var M=E.nextSibling,c=M.firstChild,p=c.nextSibling;return Qt(i=>{},y),me(k,"click",n.onClose),lt($,ht(gt,{get when(){return n.isTest},get children(){return Ae()}}),null),lt(O,ht(gt,{get when(){return Ie()&&ct()!==""&&!n.hideQrOnMobile},get fallback(){return ht(gt,{get when(){return Ct(()=>!!a())()&&Z()},get fallback(){return(()=>{var i=le(),l=i.firstChild;return i.style.setProperty("display","flex"),i.style.setProperty("justify-content","center"),i.style.setProperty("align-items","center"),St(g=>{var S=n.qrCodeSize?`${n.qrCodeSize}px`:"220px",v=n.qrCodeSize?`${n.qrCodeSize}px`:"220px",q=n.qrCodeSize?`${n.qrCodeSize}px`:"220px",D=n.qrCodeSize?`${n.qrCodeSize}px`:"220px";return S!==g.e&&((g.e=S)!=null?i.style.setProperty("width",S):i.style.removeProperty("width")),v!==g.t&&((g.t=v)!=null?i.style.setProperty("height",v):i.style.removeProperty("height")),q!==g.a&&((g.a=q)!=null?l.style.setProperty("width",q):l.style.removeProperty("width")),D!==g.o&&((g.o=D)!=null?l.style.setProperty("height",D):l.style.removeProperty("height")),g},{e:void 0,t:void 0,a:void 0,o:void 0}),i})()},get children(){var i=De();return Qt(l=>{w.current=l},i),i.style.setProperty("display","flex"),i.style.setProperty("justify-content","center"),i.style.setProperty("align-items","center"),i.style.setProperty("position","relative"),lt(i,ht(gt,{get when(){return K()},get children(){var l=se();return l.style.setProperty("position","absolute"),l.style.setProperty("top","0"),l.style.setProperty("left","0"),l.style.setProperty("right","0"),l.style.setProperty("bottom","0"),l.style.setProperty("background","rgba(0, 0, 0, 0.95)"),l.style.setProperty("display","flex"),l.style.setProperty("justify-content","center"),l.style.setProperty("align-items","center"),l.style.setProperty("border-radius","8px"),l.style.setProperty("color","white"),l.style.setProperty("font-size","16px"),l.style.setProperty("font-weight","500"),l.style.setProperty("text-align","center"),l.style.setProperty("padding","20px"),l.style.setProperty("z-index","10"),l}}),null),lt(i,ht(gt,{get when(){return it()},get children(){var l=ae();return l.style.setProperty("position","absolute"),l.style.setProperty("top","0"),l.style.setProperty("left","0"),l.style.setProperty("right","0"),l.style.setProperty("bottom","0"),l.style.setProperty("background","rgba(0, 0, 0, 0.9)"),l.style.setProperty("display","flex"),l.style.setProperty("justify-content","center"),l.style.setProperty("align-items","center"),l.style.setProperty("border-radius","8px"),l.style.setProperty("color","white"),l.style.setProperty("font-size","16px"),l.style.setProperty("font-weight","500"),l.style.setProperty("text-align","center"),l.style.setProperty("padding","20px"),l.style.setProperty("z-index","10"),l}}),null),St(l=>{var g=n.qrCodeSize?`${n.qrCodeSize}px`:"220px",S=n.qrCodeSize?`${n.qrCodeSize}px`:"220px";return g!==l.e&&((l.e=g)!=null?i.style.setProperty("width",g):i.style.removeProperty("width")),S!==l.t&&((l.t=S)!=null?i.style.setProperty("height",S):i.style.removeProperty("height")),l},{e:void 0,t:void 0}),i}})},get children(){var i=qe(),l=i.firstChild,g=l.firstChild;return i.style.setProperty("text-align","center"),i.style.setProperty("margin","20px 0"),l.style.setProperty("text-align","center"),l.style.setProperty("margin","20px 0"),g.$$click=()=>window.open(ct(),"_blank"),g.style.setProperty("background-color","#000"),g.style.setProperty("color","#fff"),g.style.setProperty("border","none"),g.style.setProperty("padding","16px 24px"),g.style.setProperty("border-radius","8px"),g.style.setProperty("font-size","16px"),g.style.setProperty("font-weight","500"),g.style.setProperty("cursor","pointer"),g.style.setProperty("display","flex"),g.style.setProperty("align-items","center"),g.style.setProperty("gap","8px"),g.style.setProperty("margin","0 auto"),g.style.setProperty("transition","background-color 0.2s ease"),lt(i,ht(gt,{get when(){return Ct(()=>!!a())()&&Z()},get fallback(){return(()=>{var S=le(),v=S.firstChild;return S.style.setProperty("display","flex"),S.style.setProperty("justify-content","center"),S.style.setProperty("align-items","center"),S.style.setProperty("margin","20px auto"),St(q=>{var D=n.qrCodeSize?`${n.qrCodeSize}px`:"220px",j=n.qrCodeSize?`${n.qrCodeSize}px`:"220px",T=n.qrCodeSize?`${n.qrCodeSize}px`:"220px",Y=n.qrCodeSize?`${n.qrCodeSize}px`:"220px";return D!==q.e&&((q.e=D)!=null?S.style.setProperty("width",D):S.style.removeProperty("width")),j!==q.t&&((q.t=j)!=null?S.style.setProperty("height",j):S.style.removeProperty("height")),T!==q.a&&((q.a=T)!=null?v.style.setProperty("width",T):v.style.removeProperty("width")),Y!==q.o&&((q.o=Y)!=null?v.style.setProperty("height",Y):v.style.removeProperty("height")),q},{e:void 0,t:void 0,a:void 0,o:void 0}),S})()},get children(){var S=$e();return Qt(v=>{if(v){const q=a();q&&(v.innerHTML="",q.append(v))}},S),S.style.setProperty("display","flex"),S.style.setProperty("justify-content","center"),S.style.setProperty("align-items","center"),S.style.setProperty("margin","20px auto"),S.style.setProperty("position","relative"),lt(S,ht(gt,{get when(){return K()},get children(){var v=se();return v.style.setProperty("position","absolute"),v.style.setProperty("top","0"),v.style.setProperty("left","0"),v.style.setProperty("right","0"),v.style.setProperty("bottom","0"),v.style.setProperty("background","rgba(0, 0, 0, 0.95)"),v.style.setProperty("display","flex"),v.style.setProperty("justify-content","center"),v.style.setProperty("align-items","center"),v.style.setProperty("border-radius","8px"),v.style.setProperty("color","white"),v.style.setProperty("font-size","16px"),v.style.setProperty("font-weight","500"),v.style.setProperty("text-align","center"),v.style.setProperty("padding","20px"),v.style.setProperty("z-index","10"),v}}),null),lt(S,ht(gt,{get when(){return it()},get children(){var v=ae();return v.style.setProperty("position","absolute"),v.style.setProperty("top","0"),v.style.setProperty("left","0"),v.style.setProperty("right","0"),v.style.setProperty("bottom","0"),v.style.setProperty("background","rgba(0, 0, 0, 0.9)"),v.style.setProperty("display","flex"),v.style.setProperty("justify-content","center"),v.style.setProperty("align-items","center"),v.style.setProperty("border-radius","8px"),v.style.setProperty("color","white"),v.style.setProperty("font-size","16px"),v.style.setProperty("font-weight","500"),v.style.setProperty("text-align","center"),v.style.setProperty("padding","20px"),v.style.setProperty("z-index","10"),v}}),null),St(v=>{var q=n.qrCodeSize?`${n.qrCodeSize}px`:"220px",D=n.qrCodeSize?`${n.qrCodeSize}px`:"220px";return q!==v.e&&((v.e=q)!=null?S.style.setProperty("width",q):S.style.removeProperty("width")),D!==v.t&&((v.t=D)!=null?S.style.setProperty("height",D):S.style.removeProperty("height")),v},{e:void 0,t:void 0}),S}}),null),i}}),E),lt(E,()=>(n.amount/100).toFixed(2),null),lt(O,ht(gt,{get when(){return u()},get children(){var i=Oe();return lt(i,u),i}}),M),lt(p,(()=>{var i=Ct(()=>!!nt());return()=>i()?"Preparing payment...":Ct(()=>!Z())()?"Creating payment...":it()?"Reconnecting...":"Waiting for payment"})()),lt(O,ht(gt,{get when(){return Ct(()=>!!A())()&&!it()},get children(){var i=Me();return lt(i,A),i}}),null),St(i=>{var l=ut()?`translate(${Pt().x}px, ${Pt().y}px)`:"none",g=ut()?"none":"transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)",S=ut()?"fixed":"relative",v=ut()?"0":"auto",q=ut()?"0":"auto",D=ut()?"9999":"auto";return l!==i.e&&((i.e=l)!=null?y.style.setProperty("transform",l):y.style.removeProperty("transform")),g!==i.t&&((i.t=g)!=null?y.style.setProperty("transition",g):y.style.removeProperty("transition")),S!==i.a&&((i.a=S)!=null?y.style.setProperty("position",S):y.style.removeProperty("position")),v!==i.o&&((i.o=v)!=null?y.style.setProperty("top",v):y.style.removeProperty("top")),q!==i.i&&((i.i=q)!=null?y.style.setProperty("left",q):y.style.removeProperty("left")),D!==i.n&&((i.n=D)!=null?y.style.setProperty("z-index",D):y.style.removeProperty("z-index")),i},{e:void 0,t:void 0,a:void 0,o:void 0,i:void 0,n:void 0}),f}})};re(["click"]);function Le(){if(!document.getElementById("zenobia-payment-styles")){const n=document.createElement("style");n.id="zenobia-payment-styles",n.textContent=ze,document.head.appendChild(n)}}function je(n){const a=typeof n.target=="string"?document.querySelector(n.target):n.target;if(!a){console.error("[zenobia-pay-modal] target element not found:",n.target);return}Le(),be(()=>ht(Be,{get isOpen(){return n.isOpen},get onClose(){return n.onClose},get amount(){return n.amount},get discountAmount(){return n.discountAmount},get qrCodeSize(){return n.qrCodeSize},get isTest(){return n.isTest},get url(){return n.url},get metadata(){return n.metadata},get transferRequest(){return n.transferRequest},get hideQrOnMobile(){return n.hideQrOnMobile},get showCashback(){return n.showCashback},get onSuccess(){return n.onSuccess},get onError(){return n.onError},get onStatusChange(){return n.onStatusChange}}),a)}window.ZenobiaPayModal={init:je}})();
