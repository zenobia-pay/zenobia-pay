(function(){"use strict";const Bt={equals:(n,s)=>n===s};let Gt=Jt;const xt=1,Lt=2,Yt={owned:null,cleanups:null,context:null,owner:null};var V=null;let Qt=null,ce=null,Y=null,rt=null,wt=null,jt=0;function de(n,s){const d=Y,w=V,C=n.length===0,P=s===void 0?w:s,$=C?Yt:{owned:null,cleanups:null,context:P?P.context:null,owner:P},x=C?n:()=>n(()=>$t(()=>Et($)));V=$,Y=null;try{return Mt(x,!0)}finally{Y=d,V=w}}function ht(n,s){s=s?Object.assign({},Bt,s):Bt;const d={value:n,observers:null,observerSlots:null,comparator:s.equals||void 0},w=C=>(typeof C=="function"&&(C=C(d.value)),Vt(d,C));return[Zt.bind(d),w]}function Ct(n,s,d){const w=Wt(n,s,!1,xt);Ot(w)}function Tt(n,s,d){Gt=ge;const w=Wt(n,s,!1,xt);w.user=!0,wt?wt.push(w):Ot(w)}function _t(n,s,d){d=d?Object.assign({},Bt,d):Bt;const w=Wt(n,s,!0,0);return w.observers=null,w.observerSlots=null,w.comparator=d.equals||void 0,Ot(w),Zt.bind(w)}function $t(n){if(Y===null)return n();const s=Y;Y=null;try{return n()}finally{Y=s}}function ue(n){return V===null||(V.cleanups===null?V.cleanups=[n]:V.cleanups.push(n)),n}function Zt(){if(this.sources&&this.state)if(this.state===xt)Ot(this);else{const n=rt;rt=null,Mt(()=>Nt(this),!1),rt=n}if(Y){const n=this.observers?this.observers.length:0;Y.sources?(Y.sources.push(this),Y.sourceSlots.push(n)):(Y.sources=[this],Y.sourceSlots=[n]),this.observers?(this.observers.push(Y),this.observerSlots.push(Y.sources.length-1)):(this.observers=[Y],this.observerSlots=[Y.sources.length-1])}return this.value}function Vt(n,s,d){let w=n.value;return(!n.comparator||!n.comparator(w,s))&&(n.value=s,n.observers&&n.observers.length&&Mt(()=>{for(let C=0;C<n.observers.length;C+=1){const P=n.observers[C],$=Qt&&Qt.running;$&&Qt.disposed.has(P),($?!P.tState:!P.state)&&(P.pure?rt.push(P):wt.push(P),P.observers&&Kt(P)),$||(P.state=xt)}if(rt.length>1e6)throw rt=[],new Error},!1)),s}function Ot(n){if(!n.fn)return;Et(n);const s=jt;he(n,n.value,s)}function he(n,s,d){let w;const C=V,P=Y;Y=V=n;try{w=n.fn(s)}catch($){return n.pure&&(n.state=xt,n.owned&&n.owned.forEach(Et),n.owned=null),n.updatedAt=d+1,te($)}finally{Y=P,V=C}(!n.updatedAt||n.updatedAt<=d)&&(n.updatedAt!=null&&"observers"in n?Vt(n,w):n.value=w,n.updatedAt=d)}function Wt(n,s,d,w=xt,C){const P={fn:n,state:w,updatedAt:null,owned:null,sources:null,sourceSlots:null,cleanups:null,value:s,owner:V,context:V?V.context:null,pure:d};return V===null||V!==Yt&&(V.owned?V.owned.push(P):V.owned=[P]),P}function Rt(n){if(n.state===0)return;if(n.state===Lt)return Nt(n);if(n.suspense&&$t(n.suspense.inFallback))return n.suspense.effects.push(n);const s=[n];for(;(n=n.owner)&&(!n.updatedAt||n.updatedAt<jt);)n.state&&s.push(n);for(let d=s.length-1;d>=0;d--)if(n=s[d],n.state===xt)Ot(n);else if(n.state===Lt){const w=rt;rt=null,Mt(()=>Nt(n,s[0]),!1),rt=w}}function Mt(n,s){if(rt)return n();let d=!1;s||(rt=[]),wt?d=!0:wt=[],jt++;try{const w=n();return fe(d),w}catch(w){d||(wt=null),rt=null,te(w)}}function fe(n){if(rt&&(Jt(rt),rt=null),n)return;const s=wt;wt=null,s.length&&Mt(()=>Gt(s),!1)}function Jt(n){for(let s=0;s<n.length;s++)Rt(n[s])}function ge(n){let s,d=0;for(s=0;s<n.length;s++){const w=n[s];w.user?n[d++]=w:Rt(w)}for(s=0;s<d;s++)Rt(n[s])}function Nt(n,s){n.state=0;for(let d=0;d<n.sources.length;d+=1){const w=n.sources[d];if(w.sources){const C=w.state;C===xt?w!==s&&(!w.updatedAt||w.updatedAt<jt)&&Rt(w):C===Lt&&Nt(w,s)}}}function Kt(n){for(let s=0;s<n.observers.length;s+=1){const d=n.observers[s];d.state||(d.state=Lt,d.pure?rt.push(d):wt.push(d),d.observers&&Kt(d))}}function Et(n){let s;if(n.sources)for(;n.sources.length;){const d=n.sources.pop(),w=n.sourceSlots.pop(),C=d.observers;if(C&&C.length){const P=C.pop(),$=d.observerSlots.pop();w<C.length&&(P.sourceSlots[$]=w,C[w]=P,d.observerSlots[w]=$)}}if(n.tOwned){for(s=n.tOwned.length-1;s>=0;s--)Et(n.tOwned[s]);delete n.tOwned}if(n.owned){for(s=n.owned.length-1;s>=0;s--)Et(n.owned[s]);n.owned=null}if(n.cleanups){for(s=n.cleanups.length-1;s>=0;s--)n.cleanups[s]();n.cleanups=null}n.state=0}function pe(n){return n instanceof Error?n:new Error(typeof n=="string"?n:"Unknown error",{cause:n})}function te(n,s=V){throw pe(n)}function dt(n,s){return $t(()=>n(s||{}))}const ye=n=>`Stale read from <${n}>.`;function ft(n){const s=n.keyed,d=_t(()=>n.when,void 0,void 0),w=s?d:_t(d,void 0,{equals:(C,P)=>!C==!P});return _t(()=>{const C=w();if(C){const P=n.children;return typeof P=="function"&&P.length>0?$t(()=>P(s?C:()=>{if(!$t(w))throw ye("Show");return d()})):P}return n.fallback},void 0,void 0)}function we(n,s,d){let w=d.length,C=s.length,P=w,$=0,x=0,E=s[C-1].nextSibling,Q=null;for(;$<C||x<P;){if(s[$]===d[x]){$++,x++;continue}for(;s[C-1]===d[P-1];)C--,P--;if(C===$){const N=P<w?x?d[x-1].nextSibling:d[P-x]:E;for(;x<P;)n.insertBefore(d[x++],N)}else if(P===x)for(;$<C;)(!Q||!Q.has(s[$]))&&s[$].remove(),$++;else if(s[$]===d[P-1]&&d[x]===s[C-1]){const N=s[--C].nextSibling;n.insertBefore(d[x++],s[$++].nextSibling),n.insertBefore(d[--P],N),s[C]=d[P]}else{if(!Q){Q=new Map;let H=x;for(;H<P;)Q.set(d[H],H++)}const N=Q.get(s[$]);if(N!=null)if(x<N&&N<P){let H=$,Z=1,tt;for(;++H<C&&H<P&&!((tt=Q.get(s[H]))==null||tt!==N+Z);)Z++;if(Z>N-x){const et=s[$];for(;x<N;)n.insertBefore(d[x++],et)}else n.replaceChild(d[x++],s[$++])}else $++;else s[$++].remove()}}}const ee="_$DX_DELEGATE";function be(n,s,d,w={}){let C;return de(P=>{C=P,s===document?n():at(s,n(),s.firstChild?null:void 0,d)},w.owner),()=>{C(),s.textContent=""}}function pt(n,s,d,w){let C;const P=()=>{const x=document.createElement("template");return x.innerHTML=n,x.content.firstChild},$=()=>(C||(C=P())).cloneNode(!0);return $.cloneNode=$,$}function ne(n,s=window.document){const d=s[ee]||(s[ee]=new Set);for(let w=0,C=n.length;w<C;w++){const P=n[w];d.has(P)||(d.add(P),s.addEventListener(P,ve))}}function me(n,s,d,w){Array.isArray(d)?(n[`$$${s}`]=d[0],n[`$$${s}Data`]=d[1]):n[`$$${s}`]=d}function re(n,s,d){return $t(()=>n(s,d))}function at(n,s,d,w){if(d!==void 0&&!w&&(w=[]),typeof s!="function")return Ft(n,s,w,d);Ct(C=>Ft(n,s(),C,d),w)}function ve(n){let s=n.target;const d=`$$${n.type}`,w=n.target,C=n.currentTarget,P=E=>Object.defineProperty(n,"target",{configurable:!0,value:E}),$=()=>{const E=s[d];if(E&&!s.disabled){const Q=s[`${d}Data`];if(Q!==void 0?E.call(s,Q,n):E.call(s,n),n.cancelBubble)return}return s.host&&typeof s.host!="string"&&!s.host._$host&&s.contains(n.target)&&P(s.host),!0},x=()=>{for(;$()&&(s=s._$host||s.parentNode||s.host););};if(Object.defineProperty(n,"currentTarget",{configurable:!0,get(){return s||document}}),n.composedPath){const E=n.composedPath();P(E[0]);for(let Q=0;Q<E.length-2&&(s=E[Q],!!$());Q++){if(s._$host){s=s._$host,x();break}if(s.parentNode===C)break}}else x();P(w)}function Ft(n,s,d,w,C){for(;typeof d=="function";)d=d();if(s===d)return d;const P=typeof s,$=w!==void 0;if(n=$&&d[0]&&d[0].parentNode||n,P==="string"||P==="number"){if(P==="number"&&(s=s.toString(),s===d))return d;if($){let x=d[0];x&&x.nodeType===3?x.data!==s&&(x.data=s):x=document.createTextNode(s),d=At(n,d,w,x)}else d!==""&&typeof d=="string"?d=n.firstChild.data=s:d=n.textContent=s}else if(s==null||P==="boolean")d=At(n,d,w);else{if(P==="function")return Ct(()=>{let x=s();for(;typeof x=="function";)x=x();d=Ft(n,x,d,w)}),()=>d;if(Array.isArray(s)){const x=[],E=d&&Array.isArray(d);if(Xt(x,s,d,C))return Ct(()=>d=Ft(n,x,d,w,!0)),()=>d;if(x.length===0){if(d=At(n,d,w),$)return d}else E?d.length===0?oe(n,x,w):we(n,d,x):(d&&At(n),oe(n,x));d=x}else if(s.nodeType){if(Array.isArray(d)){if($)return d=At(n,d,w,s);At(n,d,null,s)}else d==null||d===""||!n.firstChild?n.appendChild(s):n.replaceChild(s,n.firstChild);d=s}}return d}function Xt(n,s,d,w){let C=!1;for(let P=0,$=s.length;P<$;P++){let x=s[P],E=d&&d[n.length],Q;if(!(x==null||x===!0||x===!1))if((Q=typeof x)=="object"&&x.nodeType)n.push(x);else if(Array.isArray(x))C=Xt(n,x,E)||C;else if(Q==="function")if(w){for(;typeof x=="function";)x=x();C=Xt(n,Array.isArray(x)?x:[x],Array.isArray(E)?E:[E])||C}else n.push(x),C=!0;else{const N=String(x);E&&E.nodeType===3&&E.data===N?n.push(E):n.push(document.createTextNode(N))}}return C}function oe(n,s,d=null){for(let w=0,C=s.length;w<C;w++)n.insertBefore(s[w],d)}function At(n,s,d,w){if(d===void 0)return n.textContent="";const C=w||document.createTextNode("");if(s.length){let P=!1;for(let $=s.length-1;$>=0;$--){const x=s[$];if(C!==x){const E=x.parentNode===n;!P&&!$?E?n.replaceChild(C,x):n.insertBefore(C,d):E&&x.remove()}else P=!0}}else n.insertBefore(C,d);return[C]}class xe{constructor(s=!1){this.socket=null,this.reconnectTimeout=null,this.reconnectAttempts=0,this.maxReconnectAttempts=6,this.transferId=null,this.signature=null,this.onStatusCallback=null,this.onErrorCallback=null,this.onConnectionCallback=null,this.onScanCallback=null,this.wsBaseUrl=s?"transfer-status-test.zenobiapay.com":"transfer-status.zenobiapay.com"}getSignature(){return this.signature}getTransferId(){return this.transferId}async createTransfer(s,d){try{const w=await fetch(s,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(d)});if(!w.ok){const P=await w.json();throw new Error(P.message||"Failed to create transfer request")}const C=await w.json();return this.transferId=C.transferRequestId,this.signature=C.signature,C}catch(w){throw console.error("Error creating transfer request:",w),w instanceof Error?w:new Error("Failed to create transfer request")}}listenToTransfer(s,d,w,C,P,$){this.transferId=s,this.signature=d,w&&(this.onStatusCallback=w),C&&(this.onErrorCallback=C),P&&(this.onConnectionCallback=P),$&&(this.onScanCallback=$),this.connectWebSocket()}async createTransferAndListen(s,d,w,C,P,$){const x=await this.createTransfer(s,d);return this.listenToTransfer(x.transferRequestId,x.signature,w,C,P,$),x}connectWebSocket(){if(this.socket&&(this.socket.close(),this.socket=null,this.notifyConnectionStatus(!1)),!this.transferId||!this.signature){console.error("Cannot connect to WebSocket: Missing transfer ID or signature");return}try{const d=`${window.location.protocol==="https:"?"wss:":"ws:"}//${this.wsBaseUrl}/transfers/${this.transferId}/ws?token=${this.signature}`,w=new WebSocket(d);this.socket=w,w.onopen=()=>{this.notifyConnectionStatus(!0),this.reconnectAttempts=0},w.onclose=C=>{this.notifyConnectionStatus(!1),this.socket=null,C.code!==1e3&&this.reconnectAttempts<this.maxReconnectAttempts&&this.attemptReconnect()},w.onerror=C=>{console.error(`WebSocket error for transfer: ${this.transferId}`,C),this.notifyError("WebSocket error occurred")},w.onmessage=C=>{console.log(`WebSocket message received for transfer: ${this.transferId}`,C.data);try{const P=JSON.parse(C.data);P.type==="status"&&P.transfer?this.notifyStatus(P.transfer):P.type==="error"&&P.message?this.notifyError(P.message):P.type==="scan"?this.notifyScan(P):P.type==="ping"&&w.readyState===WebSocket.OPEN&&w.send(JSON.stringify({type:"pong"}))}catch{this.notifyError("Failed to parse message")}}}catch{this.notifyError("Failed to establish WebSocket connection")}}attemptReconnect(){this.reconnectAttempts++;const s=Math.min(1e3*Math.pow(2,this.reconnectAttempts-1),3e4);console.log(`Attempting to reconnect in ${s}ms (attempt ${this.reconnectAttempts})`),this.reconnectTimeout&&window.clearTimeout(this.reconnectTimeout),this.reconnectTimeout=window.setTimeout(()=>{console.log(`Reconnecting to WebSocket (attempt ${this.reconnectAttempts})...`),this.connectWebSocket()},s)}disconnect(){this.reconnectTimeout&&(window.clearTimeout(this.reconnectTimeout),this.reconnectTimeout=null),this.socket&&this.socket.readyState<2&&(console.log(`Closing WebSocket for transfer: ${this.transferId}`),this.socket.close(),this.socket=null,this.notifyConnectionStatus(!1)),this.transferId=null,this.signature=null}notifyConnectionStatus(s){this.onConnectionCallback&&this.onConnectionCallback(s)}notifyStatus(s){this.onStatusCallback&&this.onStatusCallback(s)}notifyError(s){this.onErrorCallback&&this.onErrorCallback(s)}notifyScan(s){this.onScanCallback&&this.onScanCallback(s)}}function _e(n){return n&&n.__esModule&&Object.prototype.hasOwnProperty.call(n,"default")?n.default:n}var Ut={exports:{}},Ce=Ut.exports,ie;function Se(){return ie||(ie=1,function(n,s){(function(d,w){n.exports=w()})(Ce,()=>(()=>{var d={873:($,x)=>{var E,Q,N=function(){var H=function(h,y){var c=h,e=ut[y],t=null,o=0,i=null,r=[],u={},k=function(a,f){t=function(l){for(var p=new Array(l),m=0;m<l;m+=1){p[m]=new Array(l);for(var O=0;O<l;O+=1)p[m][O]=null}return p}(o=4*c+17),_(0,0),_(o-7,0),_(0,o-7),g(),S(),v(a,f),c>=7&&z(a),i==null&&(i=A(c,e,r)),b(i,f)},_=function(a,f){for(var l=-1;l<=7;l+=1)if(!(a+l<=-1||o<=a+l))for(var p=-1;p<=7;p+=1)f+p<=-1||o<=f+p||(t[a+l][f+p]=0<=l&&l<=6&&(p==0||p==6)||0<=p&&p<=6&&(l==0||l==6)||2<=l&&l<=4&&2<=p&&p<=4)},S=function(){for(var a=8;a<o-8;a+=1)t[a][6]==null&&(t[a][6]=a%2==0);for(var f=8;f<o-8;f+=1)t[6][f]==null&&(t[6][f]=f%2==0)},g=function(){for(var a=J.getPatternPosition(c),f=0;f<a.length;f+=1)for(var l=0;l<a.length;l+=1){var p=a[f],m=a[l];if(t[p][m]==null)for(var O=-2;O<=2;O+=1)for(var D=-2;D<=2;D+=1)t[p+O][m+D]=O==-2||O==2||D==-2||D==2||O==0&&D==0}},z=function(a){for(var f=J.getBCHTypeNumber(c),l=0;l<18;l+=1){var p=!a&&(f>>l&1)==1;t[Math.floor(l/3)][l%3+o-8-3]=p}for(l=0;l<18;l+=1)p=!a&&(f>>l&1)==1,t[l%3+o-8-3][Math.floor(l/3)]=p},v=function(a,f){for(var l=e<<3|f,p=J.getBCHTypeInfo(l),m=0;m<15;m+=1){var O=!a&&(p>>m&1)==1;m<6?t[m][8]=O:m<8?t[m+1][8]=O:t[o-15+m][8]=O}for(m=0;m<15;m+=1)O=!a&&(p>>m&1)==1,m<8?t[8][o-m-1]=O:m<9?t[8][15-m-1+1]=O:t[8][15-m-1]=O;t[o-8][8]=!a},b=function(a,f){for(var l=-1,p=o-1,m=7,O=0,D=J.getMaskFunction(f),B=o-1;B>0;B-=2)for(B==6&&(B-=1);;){for(var L=0;L<2;L+=1)if(t[p][B-L]==null){var j=!1;O<a.length&&(j=(a[O]>>>m&1)==1),D(p,B-L)&&(j=!j),t[p][B-L]=j,(m-=1)==-1&&(O+=1,m=7)}if((p+=l)<0||o<=p){p-=l,l=-l;break}}},A=function(a,f,l){for(var p=yt.getRSBlocks(a,f),m=St(),O=0;O<l.length;O+=1){var D=l[O];m.put(D.getMode(),4),m.put(D.getLength(),J.getLengthInBits(D.getMode(),a)),D.write(m)}var B=0;for(O=0;O<p.length;O+=1)B+=p[O].dataCount;if(m.getLengthInBits()>8*B)throw"code length overflow. ("+m.getLengthInBits()+">"+8*B+")";for(m.getLengthInBits()+4<=8*B&&m.put(0,4);m.getLengthInBits()%8!=0;)m.putBit(!1);for(;!(m.getLengthInBits()>=8*B||(m.put(236,8),m.getLengthInBits()>=8*B));)m.put(17,8);return function(L,j){for(var F=0,nt=0,G=0,U=new Array(j.length),T=new Array(j.length),M=0;M<j.length;M+=1){var W=j[M].dataCount,K=j[M].totalCount-W;nt=Math.max(nt,W),G=Math.max(G,K),U[M]=new Array(W);for(var I=0;I<U[M].length;I+=1)U[M][I]=255&L.getBuffer()[I+F];F+=W;var ct=J.getErrorCorrectPolynomial(K),st=it(U[M],ct.getLength()-1).mod(ct);for(T[M]=new Array(ct.getLength()-1),I=0;I<T[M].length;I+=1){var ot=I+st.getLength()-T[M].length;T[M][I]=ot>=0?st.getAt(ot):0}}var Ht=0;for(I=0;I<j.length;I+=1)Ht+=j[I].totalCount;var It=new Array(Ht),gt=0;for(I=0;I<nt;I+=1)for(M=0;M<j.length;M+=1)I<U[M].length&&(It[gt]=U[M][I],gt+=1);for(I=0;I<G;I+=1)for(M=0;M<j.length;M+=1)I<T[M].length&&(It[gt]=T[M][I],gt+=1);return It}(m,p)};u.addData=function(a,f){var l=null;switch(f=f||"Byte"){case"Numeric":l=bt(a);break;case"Alphanumeric":l=Pt(a);break;case"Byte":l=mt(a);break;case"Kanji":l=kt(a);break;default:throw"mode:"+f}r.push(l),i=null},u.isDark=function(a,f){if(a<0||o<=a||f<0||o<=f)throw a+","+f;return t[a][f]},u.getModuleCount=function(){return o},u.make=function(){if(c<1){for(var a=1;a<40;a++){for(var f=yt.getRSBlocks(a,e),l=St(),p=0;p<r.length;p++){var m=r[p];l.put(m.getMode(),4),l.put(m.getLength(),J.getLengthInBits(m.getMode(),a)),m.write(l)}var O=0;for(p=0;p<f.length;p++)O+=f[p].dataCount;if(l.getLengthInBits()<=8*O)break}c=a}k(!1,function(){for(var D=0,B=0,L=0;L<8;L+=1){k(!0,L);var j=J.getLostPoint(u);(L==0||D>j)&&(D=j,B=L)}return B}())},u.createTableTag=function(a,f){a=a||2;var l="";l+='<table style="',l+=" border-width: 0px; border-style: none;",l+=" border-collapse: collapse;",l+=" padding: 0px; margin: "+(f=f===void 0?4*a:f)+"px;",l+='">',l+="<tbody>";for(var p=0;p<u.getModuleCount();p+=1){l+="<tr>";for(var m=0;m<u.getModuleCount();m+=1)l+='<td style="',l+=" border-width: 0px; border-style: none;",l+=" border-collapse: collapse;",l+=" padding: 0px; margin: 0px;",l+=" width: "+a+"px;",l+=" height: "+a+"px;",l+=" background-color: ",l+=u.isDark(p,m)?"#000000":"#ffffff",l+=";",l+='"/>';l+="</tr>"}return(l+="</tbody>")+"</table>"},u.createSvgTag=function(a,f,l,p){var m={};typeof arguments[0]=="object"&&(a=(m=arguments[0]).cellSize,f=m.margin,l=m.alt,p=m.title),a=a||2,f=f===void 0?4*a:f,(l=typeof l=="string"?{text:l}:l||{}).text=l.text||null,l.id=l.text?l.id||"qrcode-description":null,(p=typeof p=="string"?{text:p}:p||{}).text=p.text||null,p.id=p.text?p.id||"qrcode-title":null;var O,D,B,L,j=u.getModuleCount()*a+2*f,F="";for(L="l"+a+",0 0,"+a+" -"+a+",0 0,-"+a+"z ",F+='<svg version="1.1" xmlns="http://www.w3.org/2000/svg"',F+=m.scalable?"":' width="'+j+'px" height="'+j+'px"',F+=' viewBox="0 0 '+j+" "+j+'" ',F+=' preserveAspectRatio="xMinYMin meet"',F+=p.text||l.text?' role="img" aria-labelledby="'+q([p.id,l.id].join(" ").trim())+'"':"",F+=">",F+=p.text?'<title id="'+q(p.id)+'">'+q(p.text)+"</title>":"",F+=l.text?'<description id="'+q(l.id)+'">'+q(l.text)+"</description>":"",F+='<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>',F+='<path d="',D=0;D<u.getModuleCount();D+=1)for(B=D*a+f,O=0;O<u.getModuleCount();O+=1)u.isDark(D,O)&&(F+="M"+(O*a+f)+","+B+L);return(F+='" stroke="transparent" fill="black"/>')+"</svg>"},u.createDataURL=function(a,f){a=a||2,f=f===void 0?4*a:f;var l=u.getModuleCount()*a+2*f,p=f,m=l-f;return vt(l,l,function(O,D){if(p<=O&&O<m&&p<=D&&D<m){var B=Math.floor((O-p)/a),L=Math.floor((D-p)/a);return u.isDark(L,B)?0:1}return 1})},u.createImgTag=function(a,f,l){a=a||2,f=f===void 0?4*a:f;var p=u.getModuleCount()*a+2*f,m="";return m+="<img",m+=' src="',m+=u.createDataURL(a,f),m+='"',m+=' width="',m+=p,m+='"',m+=' height="',m+=p,m+='"',l&&(m+=' alt="',m+=q(l),m+='"'),m+"/>"};var q=function(a){for(var f="",l=0;l<a.length;l+=1){var p=a.charAt(l);switch(p){case"<":f+="&lt;";break;case">":f+="&gt;";break;case"&":f+="&amp;";break;case'"':f+="&quot;";break;default:f+=p}}return f};return u.createASCII=function(a,f){if((a=a||1)<2)return function(U){U=U===void 0?2:U;var T,M,W,K,I,ct=1*u.getModuleCount()+2*U,st=U,ot=ct-U,Ht={"██":"█","█ ":"▀"," █":"▄","  ":" "},It={"██":"▀","█ ":"▀"," █":" ","  ":" "},gt="";for(T=0;T<ct;T+=2){for(W=Math.floor((T-st)/1),K=Math.floor((T+1-st)/1),M=0;M<ct;M+=1)I="█",st<=M&&M<ot&&st<=T&&T<ot&&u.isDark(W,Math.floor((M-st)/1))&&(I=" "),st<=M&&M<ot&&st<=T+1&&T+1<ot&&u.isDark(K,Math.floor((M-st)/1))?I+=" ":I+="█",gt+=U<1&&T+1>=ot?It[I]:Ht[I];gt+=`
`}return ct%2&&U>0?gt.substring(0,gt.length-ct-1)+Array(ct+1).join("▀"):gt.substring(0,gt.length-1)}(f);a-=1,f=f===void 0?2*a:f;var l,p,m,O,D=u.getModuleCount()*a+2*f,B=f,L=D-f,j=Array(a+1).join("██"),F=Array(a+1).join("  "),nt="",G="";for(l=0;l<D;l+=1){for(m=Math.floor((l-B)/a),G="",p=0;p<D;p+=1)O=1,B<=p&&p<L&&B<=l&&l<L&&u.isDark(m,Math.floor((p-B)/a))&&(O=0),G+=O?j:F;for(m=0;m<a;m+=1)nt+=G+`
`}return nt.substring(0,nt.length-1)},u.renderTo2dContext=function(a,f){f=f||2;for(var l=u.getModuleCount(),p=0;p<l;p++)for(var m=0;m<l;m++)a.fillStyle=u.isDark(p,m)?"black":"white",a.fillRect(p*f,m*f,f,f)},u};H.stringToBytes=(H.stringToBytesFuncs={default:function(h){for(var y=[],c=0;c<h.length;c+=1){var e=h.charCodeAt(c);y.push(255&e)}return y}}).default,H.createStringToBytes=function(h,y){var c=function(){for(var t=Dt(h),o=function(){var S=t.read();if(S==-1)throw"eof";return S},i=0,r={};;){var u=t.read();if(u==-1)break;var k=o(),_=o()<<8|o();r[String.fromCharCode(u<<8|k)]=_,i+=1}if(i!=y)throw i+" != "+y;return r}(),e=63;return function(t){for(var o=[],i=0;i<t.length;i+=1){var r=t.charCodeAt(i);if(r<128)o.push(r);else{var u=c[t.charAt(i)];typeof u=="number"?(255&u)==u?o.push(u):(o.push(u>>>8),o.push(255&u)):o.push(e)}}return o}};var Z,tt,et,R,lt,ut={L:1,M:0,Q:3,H:2},J=(Z=[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],tt=1335,et=7973,lt=function(h){for(var y=0;h!=0;)y+=1,h>>>=1;return y},(R={}).getBCHTypeInfo=function(h){for(var y=h<<10;lt(y)-lt(tt)>=0;)y^=tt<<lt(y)-lt(tt);return 21522^(h<<10|y)},R.getBCHTypeNumber=function(h){for(var y=h<<12;lt(y)-lt(et)>=0;)y^=et<<lt(y)-lt(et);return h<<12|y},R.getPatternPosition=function(h){return Z[h-1]},R.getMaskFunction=function(h){switch(h){case 0:return function(y,c){return(y+c)%2==0};case 1:return function(y,c){return y%2==0};case 2:return function(y,c){return c%3==0};case 3:return function(y,c){return(y+c)%3==0};case 4:return function(y,c){return(Math.floor(y/2)+Math.floor(c/3))%2==0};case 5:return function(y,c){return y*c%2+y*c%3==0};case 6:return function(y,c){return(y*c%2+y*c%3)%2==0};case 7:return function(y,c){return(y*c%3+(y+c)%2)%2==0};default:throw"bad maskPattern:"+h}},R.getErrorCorrectPolynomial=function(h){for(var y=it([1],0),c=0;c<h;c+=1)y=y.multiply(it([1,X.gexp(c)],0));return y},R.getLengthInBits=function(h,y){if(1<=y&&y<10)switch(h){case 1:return 10;case 2:return 9;case 4:case 8:return 8;default:throw"mode:"+h}else if(y<27)switch(h){case 1:return 12;case 2:return 11;case 4:return 16;case 8:return 10;default:throw"mode:"+h}else{if(!(y<41))throw"type:"+y;switch(h){case 1:return 14;case 2:return 13;case 4:return 16;case 8:return 12;default:throw"mode:"+h}}},R.getLostPoint=function(h){for(var y=h.getModuleCount(),c=0,e=0;e<y;e+=1)for(var t=0;t<y;t+=1){for(var o=0,i=h.isDark(e,t),r=-1;r<=1;r+=1)if(!(e+r<0||y<=e+r))for(var u=-1;u<=1;u+=1)t+u<0||y<=t+u||r==0&&u==0||i==h.isDark(e+r,t+u)&&(o+=1);o>5&&(c+=3+o-5)}for(e=0;e<y-1;e+=1)for(t=0;t<y-1;t+=1){var k=0;h.isDark(e,t)&&(k+=1),h.isDark(e+1,t)&&(k+=1),h.isDark(e,t+1)&&(k+=1),h.isDark(e+1,t+1)&&(k+=1),k!=0&&k!=4||(c+=3)}for(e=0;e<y;e+=1)for(t=0;t<y-6;t+=1)h.isDark(e,t)&&!h.isDark(e,t+1)&&h.isDark(e,t+2)&&h.isDark(e,t+3)&&h.isDark(e,t+4)&&!h.isDark(e,t+5)&&h.isDark(e,t+6)&&(c+=40);for(t=0;t<y;t+=1)for(e=0;e<y-6;e+=1)h.isDark(e,t)&&!h.isDark(e+1,t)&&h.isDark(e+2,t)&&h.isDark(e+3,t)&&h.isDark(e+4,t)&&!h.isDark(e+5,t)&&h.isDark(e+6,t)&&(c+=40);var _=0;for(t=0;t<y;t+=1)for(e=0;e<y;e+=1)h.isDark(e,t)&&(_+=1);return c+Math.abs(100*_/y/y-50)/5*10},R),X=function(){for(var h=new Array(256),y=new Array(256),c=0;c<8;c+=1)h[c]=1<<c;for(c=8;c<256;c+=1)h[c]=h[c-4]^h[c-5]^h[c-6]^h[c-8];for(c=0;c<255;c+=1)y[h[c]]=c;return{glog:function(e){if(e<1)throw"glog("+e+")";return y[e]},gexp:function(e){for(;e<0;)e+=255;for(;e>=256;)e-=255;return h[e]}}}();function it(h,y){if(h.length===void 0)throw h.length+"/"+y;var c=function(){for(var t=0;t<h.length&&h[t]==0;)t+=1;for(var o=new Array(h.length-t+y),i=0;i<h.length-t;i+=1)o[i]=h[i+t];return o}(),e={getAt:function(t){return c[t]},getLength:function(){return c.length},multiply:function(t){for(var o=new Array(e.getLength()+t.getLength()-1),i=0;i<e.getLength();i+=1)for(var r=0;r<t.getLength();r+=1)o[i+r]^=X.gexp(X.glog(e.getAt(i))+X.glog(t.getAt(r)));return it(o,0)},mod:function(t){if(e.getLength()-t.getLength()<0)return e;for(var o=X.glog(e.getAt(0))-X.glog(t.getAt(0)),i=new Array(e.getLength()),r=0;r<e.getLength();r+=1)i[r]=e.getAt(r);for(r=0;r<t.getLength();r+=1)i[r]^=X.gexp(X.glog(t.getAt(r))+o);return it(i,0).mod(t)}};return e}var yt=function(){var h=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12,7,37,13],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]],y=function(e,t){var o={};return o.totalCount=e,o.dataCount=t,o},c={getRSBlocks:function(e,t){var o=function(z,v){switch(v){case ut.L:return h[4*(z-1)+0];case ut.M:return h[4*(z-1)+1];case ut.Q:return h[4*(z-1)+2];case ut.H:return h[4*(z-1)+3];default:return}}(e,t);if(o===void 0)throw"bad rs block @ typeNumber:"+e+"/errorCorrectionLevel:"+t;for(var i=o.length/3,r=[],u=0;u<i;u+=1)for(var k=o[3*u+0],_=o[3*u+1],S=o[3*u+2],g=0;g<k;g+=1)r.push(y(_,S));return r}};return c}(),St=function(){var h=[],y=0,c={getBuffer:function(){return h},getAt:function(e){var t=Math.floor(e/8);return(h[t]>>>7-e%8&1)==1},put:function(e,t){for(var o=0;o<t;o+=1)c.putBit((e>>>t-o-1&1)==1)},getLengthInBits:function(){return y},putBit:function(e){var t=Math.floor(y/8);h.length<=t&&h.push(0),e&&(h[t]|=128>>>y%8),y+=1}};return c},bt=function(h){var y=h,c={getMode:function(){return 1},getLength:function(o){return y.length},write:function(o){for(var i=y,r=0;r+2<i.length;)o.put(e(i.substring(r,r+3)),10),r+=3;r<i.length&&(i.length-r==1?o.put(e(i.substring(r,r+1)),4):i.length-r==2&&o.put(e(i.substring(r,r+2)),7))}},e=function(o){for(var i=0,r=0;r<o.length;r+=1)i=10*i+t(o.charAt(r));return i},t=function(o){if("0"<=o&&o<="9")return o.charCodeAt(0)-48;throw"illegal char :"+o};return c},Pt=function(h){var y=h,c={getMode:function(){return 2},getLength:function(t){return y.length},write:function(t){for(var o=y,i=0;i+1<o.length;)t.put(45*e(o.charAt(i))+e(o.charAt(i+1)),11),i+=2;i<o.length&&t.put(e(o.charAt(i)),6)}},e=function(t){if("0"<=t&&t<="9")return t.charCodeAt(0)-48;if("A"<=t&&t<="Z")return t.charCodeAt(0)-65+10;switch(t){case" ":return 36;case"$":return 37;case"%":return 38;case"*":return 39;case"+":return 40;case"-":return 41;case".":return 42;case"/":return 43;case":":return 44;default:throw"illegal char :"+t}};return c},mt=function(h){var y=H.stringToBytes(h);return{getMode:function(){return 4},getLength:function(c){return y.length},write:function(c){for(var e=0;e<y.length;e+=1)c.put(y[e],8)}}},kt=function(h){var y=H.stringToBytesFuncs.SJIS;if(!y)throw"sjis not supported.";(function(){var t=y("友");if(t.length!=2||(t[0]<<8|t[1])!=38726)throw"sjis not supported."})();var c=y(h),e={getMode:function(){return 8},getLength:function(t){return~~(c.length/2)},write:function(t){for(var o=c,i=0;i+1<o.length;){var r=(255&o[i])<<8|255&o[i+1];if(33088<=r&&r<=40956)r-=33088;else{if(!(57408<=r&&r<=60351))throw"illegal char at "+(i+1)+"/"+r;r-=49472}r=192*(r>>>8&255)+(255&r),t.put(r,13),i+=2}if(i<o.length)throw"illegal char at "+(i+1)}};return e},zt=function(){var h=[],y={writeByte:function(c){h.push(255&c)},writeShort:function(c){y.writeByte(c),y.writeByte(c>>>8)},writeBytes:function(c,e,t){e=e||0,t=t||c.length;for(var o=0;o<t;o+=1)y.writeByte(c[o+e])},writeString:function(c){for(var e=0;e<c.length;e+=1)y.writeByte(c.charCodeAt(e))},toByteArray:function(){return h},toString:function(){var c="";c+="[";for(var e=0;e<h.length;e+=1)e>0&&(c+=","),c+=h[e];return c+"]"}};return y},Dt=function(h){var y=h,c=0,e=0,t=0,o={read:function(){for(;t<8;){if(c>=y.length){if(t==0)return-1;throw"unexpected end of file./"+t}var r=y.charAt(c);if(c+=1,r=="=")return t=0,-1;r.match(/^\s$/)||(e=e<<6|i(r.charCodeAt(0)),t+=6)}var u=e>>>t-8&255;return t-=8,u}},i=function(r){if(65<=r&&r<=90)return r-65;if(97<=r&&r<=122)return r-97+26;if(48<=r&&r<=57)return r-48+52;if(r==43)return 62;if(r==47)return 63;throw"c:"+r};return o},vt=function(h,y,c){for(var e=function(_,S){var g=_,z=S,v=new Array(_*S),b={setPixel:function(a,f,l){v[f*g+a]=l},write:function(a){a.writeString("GIF87a"),a.writeShort(g),a.writeShort(z),a.writeByte(128),a.writeByte(0),a.writeByte(0),a.writeByte(0),a.writeByte(0),a.writeByte(0),a.writeByte(255),a.writeByte(255),a.writeByte(255),a.writeString(","),a.writeShort(0),a.writeShort(0),a.writeShort(g),a.writeShort(z),a.writeByte(0);var f=A(2);a.writeByte(2);for(var l=0;f.length-l>255;)a.writeByte(255),a.writeBytes(f,l,255),l+=255;a.writeByte(f.length-l),a.writeBytes(f,l,f.length-l),a.writeByte(0),a.writeString(";")}},A=function(a){for(var f=1<<a,l=1+(1<<a),p=a+1,m=q(),O=0;O<f;O+=1)m.add(String.fromCharCode(O));m.add(String.fromCharCode(f)),m.add(String.fromCharCode(l));var D,B,L,j=zt(),F=(D=j,B=0,L=0,{write:function(T,M){if(T>>>M)throw"length over";for(;B+M>=8;)D.writeByte(255&(T<<B|L)),M-=8-B,T>>>=8-B,L=0,B=0;L|=T<<B,B+=M},flush:function(){B>0&&D.writeByte(L)}});F.write(f,p);var nt=0,G=String.fromCharCode(v[nt]);for(nt+=1;nt<v.length;){var U=String.fromCharCode(v[nt]);nt+=1,m.contains(G+U)?G+=U:(F.write(m.indexOf(G),p),m.size()<4095&&(m.size()==1<<p&&(p+=1),m.add(G+U)),G=U)}return F.write(m.indexOf(G),p),F.write(l,p),F.flush(),j.toByteArray()},q=function(){var a={},f=0,l={add:function(p){if(l.contains(p))throw"dup key:"+p;a[p]=f,f+=1},size:function(){return f},indexOf:function(p){return a[p]},contains:function(p){return a[p]!==void 0}};return l};return b}(h,y),t=0;t<y;t+=1)for(var o=0;o<h;o+=1)e.setPixel(o,t,c(o,t));var i=zt();e.write(i);for(var r=function(){var _=0,S=0,g=0,z="",v={},b=function(q){z+=String.fromCharCode(A(63&q))},A=function(q){if(!(q<0)){if(q<26)return 65+q;if(q<52)return q-26+97;if(q<62)return q-52+48;if(q==62)return 43;if(q==63)return 47}throw"n:"+q};return v.writeByte=function(q){for(_=_<<8|255&q,S+=8,g+=1;S>=6;)b(_>>>S-6),S-=6},v.flush=function(){if(S>0&&(b(_<<6-S),_=0,S=0),g%3!=0)for(var q=3-g%3,a=0;a<q;a+=1)z+="="},v.toString=function(){return z},v}(),u=i.toByteArray(),k=0;k<u.length;k+=1)r.writeByte(u[k]);return r.flush(),"data:image/gif;base64,"+r};return H}();N.stringToBytesFuncs["UTF-8"]=function(H){return function(Z){for(var tt=[],et=0;et<Z.length;et++){var R=Z.charCodeAt(et);R<128?tt.push(R):R<2048?tt.push(192|R>>6,128|63&R):R<55296||R>=57344?tt.push(224|R>>12,128|R>>6&63,128|63&R):(et++,R=65536+((1023&R)<<10|1023&Z.charCodeAt(et)),tt.push(240|R>>18,128|R>>12&63,128|R>>6&63,128|63&R))}return tt}(H)},(Q=typeof(E=function(){return N})=="function"?E.apply(x,[]):E)===void 0||($.exports=Q)}},w={};function C($){var x=w[$];if(x!==void 0)return x.exports;var E=w[$]={exports:{}};return d[$](E,E.exports,C),E.exports}C.n=$=>{var x=$&&$.__esModule?()=>$.default:()=>$;return C.d(x,{a:x}),x},C.d=($,x)=>{for(var E in x)C.o(x,E)&&!C.o($,E)&&Object.defineProperty($,E,{enumerable:!0,get:x[E]})},C.o=($,x)=>Object.prototype.hasOwnProperty.call($,x);var P={};return(()=>{C.d(P,{default:()=>y});const $=c=>!!c&&typeof c=="object"&&!Array.isArray(c);function x(c,...e){if(!e.length)return c;const t=e.shift();return t!==void 0&&$(c)&&$(t)?(c=Object.assign({},c),Object.keys(t).forEach(o=>{const i=c[o],r=t[o];Array.isArray(i)&&Array.isArray(r)?c[o]=r:$(i)&&$(r)?c[o]=x(Object.assign({},i),r):c[o]=r}),x(c,...e)):c}function E(c,e){const t=document.createElement("a");t.download=e,t.href=c,document.body.appendChild(t),t.click(),document.body.removeChild(t)}const Q={L:.07,M:.15,Q:.25,H:.3};class N{constructor({svg:e,type:t,window:o}){this._svg=e,this._type=t,this._window=o}draw(e,t,o,i){let r;switch(this._type){case"dots":r=this._drawDot;break;case"classy":r=this._drawClassy;break;case"classy-rounded":r=this._drawClassyRounded;break;case"rounded":r=this._drawRounded;break;case"extra-rounded":r=this._drawExtraRounded;break;default:r=this._drawSquare}r.call(this,{x:e,y:t,size:o,getNeighbor:i})}_rotateFigure({x:e,y:t,size:o,rotation:i=0,draw:r}){var u;const k=e+o/2,_=t+o/2;r(),(u=this._element)===null||u===void 0||u.setAttribute("transform",`rotate(${180*i/Math.PI},${k},${_})`)}_basicDot(e){const{size:t,x:o,y:i}=e;this._rotateFigure(Object.assign(Object.assign({},e),{draw:()=>{this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","circle"),this._element.setAttribute("cx",String(o+t/2)),this._element.setAttribute("cy",String(i+t/2)),this._element.setAttribute("r",String(t/2))}}))}_basicSquare(e){const{size:t,x:o,y:i}=e;this._rotateFigure(Object.assign(Object.assign({},e),{draw:()=>{this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","rect"),this._element.setAttribute("x",String(o)),this._element.setAttribute("y",String(i)),this._element.setAttribute("width",String(t)),this._element.setAttribute("height",String(t))}}))}_basicSideRounded(e){const{size:t,x:o,y:i}=e;this._rotateFigure(Object.assign(Object.assign({},e),{draw:()=>{this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","path"),this._element.setAttribute("d",`M ${o} ${i}v ${t}h `+t/2+`a ${t/2} ${t/2}, 0, 0, 0, 0 ${-t}`)}}))}_basicCornerRounded(e){const{size:t,x:o,y:i}=e;this._rotateFigure(Object.assign(Object.assign({},e),{draw:()=>{this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","path"),this._element.setAttribute("d",`M ${o} ${i}v ${t}h ${t}v `+-t/2+`a ${t/2} ${t/2}, 0, 0, 0, ${-t/2} ${-t/2}`)}}))}_basicCornerExtraRounded(e){const{size:t,x:o,y:i}=e;this._rotateFigure(Object.assign(Object.assign({},e),{draw:()=>{this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","path"),this._element.setAttribute("d",`M ${o} ${i}v ${t}h ${t}a ${t} ${t}, 0, 0, 0, ${-t} ${-t}`)}}))}_basicCornersRounded(e){const{size:t,x:o,y:i}=e;this._rotateFigure(Object.assign(Object.assign({},e),{draw:()=>{this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","path"),this._element.setAttribute("d",`M ${o} ${i}v `+t/2+`a ${t/2} ${t/2}, 0, 0, 0, ${t/2} ${t/2}h `+t/2+"v "+-t/2+`a ${t/2} ${t/2}, 0, 0, 0, ${-t/2} ${-t/2}`)}}))}_drawDot({x:e,y:t,size:o}){this._basicDot({x:e,y:t,size:o,rotation:0})}_drawSquare({x:e,y:t,size:o}){this._basicSquare({x:e,y:t,size:o,rotation:0})}_drawRounded({x:e,y:t,size:o,getNeighbor:i}){const r=i?+i(-1,0):0,u=i?+i(1,0):0,k=i?+i(0,-1):0,_=i?+i(0,1):0,S=r+u+k+_;if(S!==0)if(S>2||r&&u||k&&_)this._basicSquare({x:e,y:t,size:o,rotation:0});else{if(S===2){let g=0;return r&&k?g=Math.PI/2:k&&u?g=Math.PI:u&&_&&(g=-Math.PI/2),void this._basicCornerRounded({x:e,y:t,size:o,rotation:g})}if(S===1){let g=0;return k?g=Math.PI/2:u?g=Math.PI:_&&(g=-Math.PI/2),void this._basicSideRounded({x:e,y:t,size:o,rotation:g})}}else this._basicDot({x:e,y:t,size:o,rotation:0})}_drawExtraRounded({x:e,y:t,size:o,getNeighbor:i}){const r=i?+i(-1,0):0,u=i?+i(1,0):0,k=i?+i(0,-1):0,_=i?+i(0,1):0,S=r+u+k+_;if(S!==0)if(S>2||r&&u||k&&_)this._basicSquare({x:e,y:t,size:o,rotation:0});else{if(S===2){let g=0;return r&&k?g=Math.PI/2:k&&u?g=Math.PI:u&&_&&(g=-Math.PI/2),void this._basicCornerExtraRounded({x:e,y:t,size:o,rotation:g})}if(S===1){let g=0;return k?g=Math.PI/2:u?g=Math.PI:_&&(g=-Math.PI/2),void this._basicSideRounded({x:e,y:t,size:o,rotation:g})}}else this._basicDot({x:e,y:t,size:o,rotation:0})}_drawClassy({x:e,y:t,size:o,getNeighbor:i}){const r=i?+i(-1,0):0,u=i?+i(1,0):0,k=i?+i(0,-1):0,_=i?+i(0,1):0;r+u+k+_!==0?r||k?u||_?this._basicSquare({x:e,y:t,size:o,rotation:0}):this._basicCornerRounded({x:e,y:t,size:o,rotation:Math.PI/2}):this._basicCornerRounded({x:e,y:t,size:o,rotation:-Math.PI/2}):this._basicCornersRounded({x:e,y:t,size:o,rotation:Math.PI/2})}_drawClassyRounded({x:e,y:t,size:o,getNeighbor:i}){const r=i?+i(-1,0):0,u=i?+i(1,0):0,k=i?+i(0,-1):0,_=i?+i(0,1):0;r+u+k+_!==0?r||k?u||_?this._basicSquare({x:e,y:t,size:o,rotation:0}):this._basicCornerExtraRounded({x:e,y:t,size:o,rotation:Math.PI/2}):this._basicCornerExtraRounded({x:e,y:t,size:o,rotation:-Math.PI/2}):this._basicCornersRounded({x:e,y:t,size:o,rotation:Math.PI/2})}}const H={dot:"dot",square:"square",extraRounded:"extra-rounded"},Z=Object.values(H);class tt{constructor({svg:e,type:t,window:o}){this._svg=e,this._type=t,this._window=o}draw(e,t,o,i){let r;switch(this._type){case H.square:r=this._drawSquare;break;case H.extraRounded:r=this._drawExtraRounded;break;default:r=this._drawDot}r.call(this,{x:e,y:t,size:o,rotation:i})}_rotateFigure({x:e,y:t,size:o,rotation:i=0,draw:r}){var u;const k=e+o/2,_=t+o/2;r(),(u=this._element)===null||u===void 0||u.setAttribute("transform",`rotate(${180*i/Math.PI},${k},${_})`)}_basicDot(e){const{size:t,x:o,y:i}=e,r=t/7;this._rotateFigure(Object.assign(Object.assign({},e),{draw:()=>{this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","path"),this._element.setAttribute("clip-rule","evenodd"),this._element.setAttribute("d",`M ${o+t/2} ${i}a ${t/2} ${t/2} 0 1 0 0.1 0zm 0 ${r}a ${t/2-r} ${t/2-r} 0 1 1 -0.1 0Z`)}}))}_basicSquare(e){const{size:t,x:o,y:i}=e,r=t/7;this._rotateFigure(Object.assign(Object.assign({},e),{draw:()=>{this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","path"),this._element.setAttribute("clip-rule","evenodd"),this._element.setAttribute("d",`M ${o} ${i}v ${t}h ${t}v `+-t+`zM ${o+r} ${i+r}h `+(t-2*r)+"v "+(t-2*r)+"h "+(2*r-t)+"z")}}))}_basicExtraRounded(e){const{size:t,x:o,y:i}=e,r=t/7;this._rotateFigure(Object.assign(Object.assign({},e),{draw:()=>{this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","path"),this._element.setAttribute("clip-rule","evenodd"),this._element.setAttribute("d",`M ${o} ${i+2.5*r}v `+2*r+`a ${2.5*r} ${2.5*r}, 0, 0, 0, ${2.5*r} ${2.5*r}h `+2*r+`a ${2.5*r} ${2.5*r}, 0, 0, 0, ${2.5*r} ${2.5*-r}v `+-2*r+`a ${2.5*r} ${2.5*r}, 0, 0, 0, ${2.5*-r} ${2.5*-r}h `+-2*r+`a ${2.5*r} ${2.5*r}, 0, 0, 0, ${2.5*-r} ${2.5*r}M ${o+2.5*r} ${i+r}h `+2*r+`a ${1.5*r} ${1.5*r}, 0, 0, 1, ${1.5*r} ${1.5*r}v `+2*r+`a ${1.5*r} ${1.5*r}, 0, 0, 1, ${1.5*-r} ${1.5*r}h `+-2*r+`a ${1.5*r} ${1.5*r}, 0, 0, 1, ${1.5*-r} ${1.5*-r}v `+-2*r+`a ${1.5*r} ${1.5*r}, 0, 0, 1, ${1.5*r} ${1.5*-r}`)}}))}_drawDot({x:e,y:t,size:o,rotation:i}){this._basicDot({x:e,y:t,size:o,rotation:i})}_drawSquare({x:e,y:t,size:o,rotation:i}){this._basicSquare({x:e,y:t,size:o,rotation:i})}_drawExtraRounded({x:e,y:t,size:o,rotation:i}){this._basicExtraRounded({x:e,y:t,size:o,rotation:i})}}const et={dot:"dot",square:"square"},R=Object.values(et);class lt{constructor({svg:e,type:t,window:o}){this._svg=e,this._type=t,this._window=o}draw(e,t,o,i){let r;r=this._type===et.square?this._drawSquare:this._drawDot,r.call(this,{x:e,y:t,size:o,rotation:i})}_rotateFigure({x:e,y:t,size:o,rotation:i=0,draw:r}){var u;const k=e+o/2,_=t+o/2;r(),(u=this._element)===null||u===void 0||u.setAttribute("transform",`rotate(${180*i/Math.PI},${k},${_})`)}_basicDot(e){const{size:t,x:o,y:i}=e;this._rotateFigure(Object.assign(Object.assign({},e),{draw:()=>{this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","circle"),this._element.setAttribute("cx",String(o+t/2)),this._element.setAttribute("cy",String(i+t/2)),this._element.setAttribute("r",String(t/2))}}))}_basicSquare(e){const{size:t,x:o,y:i}=e;this._rotateFigure(Object.assign(Object.assign({},e),{draw:()=>{this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","rect"),this._element.setAttribute("x",String(o)),this._element.setAttribute("y",String(i)),this._element.setAttribute("width",String(t)),this._element.setAttribute("height",String(t))}}))}_drawDot({x:e,y:t,size:o,rotation:i}){this._basicDot({x:e,y:t,size:o,rotation:i})}_drawSquare({x:e,y:t,size:o,rotation:i}){this._basicSquare({x:e,y:t,size:o,rotation:i})}}const ut="circle",J=[[1,1,1,1,1,1,1],[1,0,0,0,0,0,1],[1,0,0,0,0,0,1],[1,0,0,0,0,0,1],[1,0,0,0,0,0,1],[1,0,0,0,0,0,1],[1,1,1,1,1,1,1]],X=[[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,1,1,1,0,0],[0,0,1,1,1,0,0],[0,0,1,1,1,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0]];class it{constructor(e,t){this._roundSize=o=>this._options.dotsOptions.roundSize?Math.floor(o):o,this._window=t,this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","svg"),this._element.setAttribute("width",String(e.width)),this._element.setAttribute("height",String(e.height)),this._element.setAttribute("xmlns:xlink","http://www.w3.org/1999/xlink"),e.dotsOptions.roundSize||this._element.setAttribute("shape-rendering","crispEdges"),this._element.setAttribute("viewBox",`0 0 ${e.width} ${e.height}`),this._defs=this._window.document.createElementNS("http://www.w3.org/2000/svg","defs"),this._element.appendChild(this._defs),this._imageUri=e.image,this._instanceId=it.instanceCount++,this._options=e}get width(){return this._options.width}get height(){return this._options.height}getElement(){return this._element}async drawQR(e){const t=e.getModuleCount(),o=Math.min(this._options.width,this._options.height)-2*this._options.margin,i=this._options.shape===ut?o/Math.sqrt(2):o,r=this._roundSize(i/t);let u={hideXDots:0,hideYDots:0,width:0,height:0};if(this._qr=e,this._options.image){if(await this.loadImage(),!this._image)return;const{imageOptions:k,qrOptions:_}=this._options,S=k.imageSize*Q[_.errorCorrectionLevel],g=Math.floor(S*t*t);u=function({originalHeight:z,originalWidth:v,maxHiddenDots:b,maxHiddenAxisDots:A,dotSize:q}){const a={x:0,y:0},f={x:0,y:0};if(z<=0||v<=0||b<=0||q<=0)return{height:0,width:0,hideYDots:0,hideXDots:0};const l=z/v;return a.x=Math.floor(Math.sqrt(b/l)),a.x<=0&&(a.x=1),A&&A<a.x&&(a.x=A),a.x%2==0&&a.x--,f.x=a.x*q,a.y=1+2*Math.ceil((a.x*l-1)/2),f.y=Math.round(f.x*l),(a.y*a.x>b||A&&A<a.y)&&(A&&A<a.y?(a.y=A,a.y%2==0&&a.x--):a.y-=2,f.y=a.y*q,a.x=1+2*Math.ceil((a.y/l-1)/2),f.x=Math.round(f.y/l)),{height:f.y,width:f.x,hideYDots:a.y,hideXDots:a.x}}({originalWidth:this._image.width,originalHeight:this._image.height,maxHiddenDots:g,maxHiddenAxisDots:t-14,dotSize:r})}this.drawBackground(),this.drawDots((k,_)=>{var S,g,z,v,b,A;return!(this._options.imageOptions.hideBackgroundDots&&k>=(t-u.hideYDots)/2&&k<(t+u.hideYDots)/2&&_>=(t-u.hideXDots)/2&&_<(t+u.hideXDots)/2||!((S=J[k])===null||S===void 0)&&S[_]||!((g=J[k-t+7])===null||g===void 0)&&g[_]||!((z=J[k])===null||z===void 0)&&z[_-t+7]||!((v=X[k])===null||v===void 0)&&v[_]||!((b=X[k-t+7])===null||b===void 0)&&b[_]||!((A=X[k])===null||A===void 0)&&A[_-t+7])}),this.drawCorners(),this._options.image&&await this.drawImage({width:u.width,height:u.height,count:t,dotSize:r})}drawBackground(){var e,t,o;const i=this._element,r=this._options;if(i){const u=(e=r.backgroundOptions)===null||e===void 0?void 0:e.gradient,k=(t=r.backgroundOptions)===null||t===void 0?void 0:t.color;let _=r.height,S=r.width;if(u||k){const g=this._window.document.createElementNS("http://www.w3.org/2000/svg","rect");this._backgroundClipPath=this._window.document.createElementNS("http://www.w3.org/2000/svg","clipPath"),this._backgroundClipPath.setAttribute("id",`clip-path-background-color-${this._instanceId}`),this._defs.appendChild(this._backgroundClipPath),!((o=r.backgroundOptions)===null||o===void 0)&&o.round&&(_=S=Math.min(r.width,r.height),g.setAttribute("rx",String(_/2*r.backgroundOptions.round))),g.setAttribute("x",String(this._roundSize((r.width-S)/2))),g.setAttribute("y",String(this._roundSize((r.height-_)/2))),g.setAttribute("width",String(S)),g.setAttribute("height",String(_)),this._backgroundClipPath.appendChild(g),this._createColor({options:u,color:k,additionalRotation:0,x:0,y:0,height:r.height,width:r.width,name:`background-color-${this._instanceId}`})}}}drawDots(e){var t,o;if(!this._qr)throw"QR code is not defined";const i=this._options,r=this._qr.getModuleCount();if(r>i.width||r>i.height)throw"The canvas is too small.";const u=Math.min(i.width,i.height)-2*i.margin,k=i.shape===ut?u/Math.sqrt(2):u,_=this._roundSize(k/r),S=this._roundSize((i.width-r*_)/2),g=this._roundSize((i.height-r*_)/2),z=new N({svg:this._element,type:i.dotsOptions.type,window:this._window});this._dotsClipPath=this._window.document.createElementNS("http://www.w3.org/2000/svg","clipPath"),this._dotsClipPath.setAttribute("id",`clip-path-dot-color-${this._instanceId}`),this._defs.appendChild(this._dotsClipPath),this._createColor({options:(t=i.dotsOptions)===null||t===void 0?void 0:t.gradient,color:i.dotsOptions.color,additionalRotation:0,x:0,y:0,height:i.height,width:i.width,name:`dot-color-${this._instanceId}`});for(let v=0;v<r;v++)for(let b=0;b<r;b++)e&&!e(v,b)||!((o=this._qr)===null||o===void 0)&&o.isDark(v,b)&&(z.draw(S+b*_,g+v*_,_,(A,q)=>!(b+A<0||v+q<0||b+A>=r||v+q>=r)&&!(e&&!e(v+q,b+A))&&!!this._qr&&this._qr.isDark(v+q,b+A)),z._element&&this._dotsClipPath&&this._dotsClipPath.appendChild(z._element));if(i.shape===ut){const v=this._roundSize((u/_-r)/2),b=r+2*v,A=S-v*_,q=g-v*_,a=[],f=this._roundSize(b/2);for(let l=0;l<b;l++){a[l]=[];for(let p=0;p<b;p++)l>=v-1&&l<=b-v&&p>=v-1&&p<=b-v||Math.sqrt((l-f)*(l-f)+(p-f)*(p-f))>f?a[l][p]=0:a[l][p]=this._qr.isDark(p-2*v<0?p:p>=r?p-2*v:p-v,l-2*v<0?l:l>=r?l-2*v:l-v)?1:0}for(let l=0;l<b;l++)for(let p=0;p<b;p++)a[l][p]&&(z.draw(A+p*_,q+l*_,_,(m,O)=>{var D;return!!(!((D=a[l+O])===null||D===void 0)&&D[p+m])}),z._element&&this._dotsClipPath&&this._dotsClipPath.appendChild(z._element))}}drawCorners(){if(!this._qr)throw"QR code is not defined";const e=this._element,t=this._options;if(!e)throw"Element code is not defined";const o=this._qr.getModuleCount(),i=Math.min(t.width,t.height)-2*t.margin,r=t.shape===ut?i/Math.sqrt(2):i,u=this._roundSize(r/o),k=7*u,_=3*u,S=this._roundSize((t.width-o*u)/2),g=this._roundSize((t.height-o*u)/2);[[0,0,0],[1,0,Math.PI/2],[0,1,-Math.PI/2]].forEach(([z,v,b])=>{var A,q,a,f,l,p,m,O,D,B,L,j,F,nt;const G=S+z*u*(o-7),U=g+v*u*(o-7);let T=this._dotsClipPath,M=this._dotsClipPath;if((!((A=t.cornersSquareOptions)===null||A===void 0)&&A.gradient||!((q=t.cornersSquareOptions)===null||q===void 0)&&q.color)&&(T=this._window.document.createElementNS("http://www.w3.org/2000/svg","clipPath"),T.setAttribute("id",`clip-path-corners-square-color-${z}-${v}-${this._instanceId}`),this._defs.appendChild(T),this._cornersSquareClipPath=this._cornersDotClipPath=M=T,this._createColor({options:(a=t.cornersSquareOptions)===null||a===void 0?void 0:a.gradient,color:(f=t.cornersSquareOptions)===null||f===void 0?void 0:f.color,additionalRotation:b,x:G,y:U,height:k,width:k,name:`corners-square-color-${z}-${v}-${this._instanceId}`})),((l=t.cornersSquareOptions)===null||l===void 0?void 0:l.type)&&Z.includes(t.cornersSquareOptions.type)){const W=new tt({svg:this._element,type:t.cornersSquareOptions.type,window:this._window});W.draw(G,U,k,b),W._element&&T&&T.appendChild(W._element)}else{const W=new N({svg:this._element,type:((p=t.cornersSquareOptions)===null||p===void 0?void 0:p.type)||t.dotsOptions.type,window:this._window});for(let K=0;K<J.length;K++)for(let I=0;I<J[K].length;I++)!((m=J[K])===null||m===void 0)&&m[I]&&(W.draw(G+I*u,U+K*u,u,(ct,st)=>{var ot;return!!(!((ot=J[K+st])===null||ot===void 0)&&ot[I+ct])}),W._element&&T&&T.appendChild(W._element))}if((!((O=t.cornersDotOptions)===null||O===void 0)&&O.gradient||!((D=t.cornersDotOptions)===null||D===void 0)&&D.color)&&(M=this._window.document.createElementNS("http://www.w3.org/2000/svg","clipPath"),M.setAttribute("id",`clip-path-corners-dot-color-${z}-${v}-${this._instanceId}`),this._defs.appendChild(M),this._cornersDotClipPath=M,this._createColor({options:(B=t.cornersDotOptions)===null||B===void 0?void 0:B.gradient,color:(L=t.cornersDotOptions)===null||L===void 0?void 0:L.color,additionalRotation:b,x:G+2*u,y:U+2*u,height:_,width:_,name:`corners-dot-color-${z}-${v}-${this._instanceId}`})),((j=t.cornersDotOptions)===null||j===void 0?void 0:j.type)&&R.includes(t.cornersDotOptions.type)){const W=new lt({svg:this._element,type:t.cornersDotOptions.type,window:this._window});W.draw(G+2*u,U+2*u,_,b),W._element&&M&&M.appendChild(W._element)}else{const W=new N({svg:this._element,type:((F=t.cornersDotOptions)===null||F===void 0?void 0:F.type)||t.dotsOptions.type,window:this._window});for(let K=0;K<X.length;K++)for(let I=0;I<X[K].length;I++)!((nt=X[K])===null||nt===void 0)&&nt[I]&&(W.draw(G+I*u,U+K*u,u,(ct,st)=>{var ot;return!!(!((ot=X[K+st])===null||ot===void 0)&&ot[I+ct])}),W._element&&M&&M.appendChild(W._element))}})}loadImage(){return new Promise((e,t)=>{var o;const i=this._options;if(!i.image)return t("Image is not defined");if(!((o=i.nodeCanvas)===null||o===void 0)&&o.loadImage)i.nodeCanvas.loadImage(i.image).then(r=>{var u,k;if(this._image=r,this._options.imageOptions.saveAsBlob){const _=(u=i.nodeCanvas)===null||u===void 0?void 0:u.createCanvas(this._image.width,this._image.height);(k=_==null?void 0:_.getContext("2d"))===null||k===void 0||k.drawImage(r,0,0),this._imageUri=_==null?void 0:_.toDataURL()}e()}).catch(t);else{const r=new this._window.Image;typeof i.imageOptions.crossOrigin=="string"&&(r.crossOrigin=i.imageOptions.crossOrigin),this._image=r,r.onload=async()=>{this._options.imageOptions.saveAsBlob&&(this._imageUri=await async function(u,k){return new Promise(_=>{const S=new k.XMLHttpRequest;S.onload=function(){const g=new k.FileReader;g.onloadend=function(){_(g.result)},g.readAsDataURL(S.response)},S.open("GET",u),S.responseType="blob",S.send()})}(i.image||"",this._window)),e()},r.src=i.image}})}async drawImage({width:e,height:t,count:o,dotSize:i}){const r=this._options,u=this._roundSize((r.width-o*i)/2),k=this._roundSize((r.height-o*i)/2),_=u+this._roundSize(r.imageOptions.margin+(o*i-e)/2),S=k+this._roundSize(r.imageOptions.margin+(o*i-t)/2),g=e-2*r.imageOptions.margin,z=t-2*r.imageOptions.margin,v=this._window.document.createElementNS("http://www.w3.org/2000/svg","image");v.setAttribute("href",this._imageUri||""),v.setAttribute("xlink:href",this._imageUri||""),v.setAttribute("x",String(_)),v.setAttribute("y",String(S)),v.setAttribute("width",`${g}px`),v.setAttribute("height",`${z}px`),this._element.appendChild(v)}_createColor({options:e,color:t,additionalRotation:o,x:i,y:r,height:u,width:k,name:_}){const S=k>u?k:u,g=this._window.document.createElementNS("http://www.w3.org/2000/svg","rect");if(g.setAttribute("x",String(i)),g.setAttribute("y",String(r)),g.setAttribute("height",String(u)),g.setAttribute("width",String(k)),g.setAttribute("clip-path",`url('#clip-path-${_}')`),e){let z;if(e.type==="radial")z=this._window.document.createElementNS("http://www.w3.org/2000/svg","radialGradient"),z.setAttribute("id",_),z.setAttribute("gradientUnits","userSpaceOnUse"),z.setAttribute("fx",String(i+k/2)),z.setAttribute("fy",String(r+u/2)),z.setAttribute("cx",String(i+k/2)),z.setAttribute("cy",String(r+u/2)),z.setAttribute("r",String(S/2));else{const v=((e.rotation||0)+o)%(2*Math.PI),b=(v+2*Math.PI)%(2*Math.PI);let A=i+k/2,q=r+u/2,a=i+k/2,f=r+u/2;b>=0&&b<=.25*Math.PI||b>1.75*Math.PI&&b<=2*Math.PI?(A-=k/2,q-=u/2*Math.tan(v),a+=k/2,f+=u/2*Math.tan(v)):b>.25*Math.PI&&b<=.75*Math.PI?(q-=u/2,A-=k/2/Math.tan(v),f+=u/2,a+=k/2/Math.tan(v)):b>.75*Math.PI&&b<=1.25*Math.PI?(A+=k/2,q+=u/2*Math.tan(v),a-=k/2,f-=u/2*Math.tan(v)):b>1.25*Math.PI&&b<=1.75*Math.PI&&(q+=u/2,A+=k/2/Math.tan(v),f-=u/2,a-=k/2/Math.tan(v)),z=this._window.document.createElementNS("http://www.w3.org/2000/svg","linearGradient"),z.setAttribute("id",_),z.setAttribute("gradientUnits","userSpaceOnUse"),z.setAttribute("x1",String(Math.round(A))),z.setAttribute("y1",String(Math.round(q))),z.setAttribute("x2",String(Math.round(a))),z.setAttribute("y2",String(Math.round(f)))}e.colorStops.forEach(({offset:v,color:b})=>{const A=this._window.document.createElementNS("http://www.w3.org/2000/svg","stop");A.setAttribute("offset",100*v+"%"),A.setAttribute("stop-color",b),z.appendChild(A)}),g.setAttribute("fill",`url('#${_}')`),this._defs.appendChild(z)}else t&&g.setAttribute("fill",t);this._element.appendChild(g)}}it.instanceCount=0;const yt=it,St="canvas",bt={};for(let c=0;c<=40;c++)bt[c]=c;const Pt={type:St,shape:"square",width:300,height:300,data:"",margin:0,qrOptions:{typeNumber:bt[0],mode:void 0,errorCorrectionLevel:"Q"},imageOptions:{saveAsBlob:!0,hideBackgroundDots:!0,imageSize:.4,crossOrigin:void 0,margin:0},dotsOptions:{type:"square",color:"#000",roundSize:!0},backgroundOptions:{round:0,color:"#fff"}};function mt(c){const e=Object.assign({},c);if(!e.colorStops||!e.colorStops.length)throw"Field 'colorStops' is required in gradient";return e.rotation?e.rotation=Number(e.rotation):e.rotation=0,e.colorStops=e.colorStops.map(t=>Object.assign(Object.assign({},t),{offset:Number(t.offset)})),e}function kt(c){const e=Object.assign({},c);return e.width=Number(e.width),e.height=Number(e.height),e.margin=Number(e.margin),e.imageOptions=Object.assign(Object.assign({},e.imageOptions),{hideBackgroundDots:!!e.imageOptions.hideBackgroundDots,imageSize:Number(e.imageOptions.imageSize),margin:Number(e.imageOptions.margin)}),e.margin>Math.min(e.width,e.height)&&(e.margin=Math.min(e.width,e.height)),e.dotsOptions=Object.assign({},e.dotsOptions),e.dotsOptions.gradient&&(e.dotsOptions.gradient=mt(e.dotsOptions.gradient)),e.cornersSquareOptions&&(e.cornersSquareOptions=Object.assign({},e.cornersSquareOptions),e.cornersSquareOptions.gradient&&(e.cornersSquareOptions.gradient=mt(e.cornersSquareOptions.gradient))),e.cornersDotOptions&&(e.cornersDotOptions=Object.assign({},e.cornersDotOptions),e.cornersDotOptions.gradient&&(e.cornersDotOptions.gradient=mt(e.cornersDotOptions.gradient))),e.backgroundOptions&&(e.backgroundOptions=Object.assign({},e.backgroundOptions),e.backgroundOptions.gradient&&(e.backgroundOptions.gradient=mt(e.backgroundOptions.gradient))),e}var zt=C(873),Dt=C.n(zt);function vt(c){if(!c)throw new Error("Extension must be defined");c[0]==="."&&(c=c.substring(1));const e={bmp:"image/bmp",gif:"image/gif",ico:"image/vnd.microsoft.icon",jpeg:"image/jpeg",jpg:"image/jpeg",png:"image/png",svg:"image/svg+xml",tif:"image/tiff",tiff:"image/tiff",webp:"image/webp",pdf:"application/pdf"}[c.toLowerCase()];if(!e)throw new Error(`Extension "${c}" is not supported`);return e}class h{constructor(e){e!=null&&e.jsdom?this._window=new e.jsdom("",{resources:"usable"}).window:this._window=window,this._options=e?kt(x(Pt,e)):Pt,this.update()}static _clearContainer(e){e&&(e.innerHTML="")}_setupSvg(){if(!this._qr)return;const e=new yt(this._options,this._window);this._svg=e.getElement(),this._svgDrawingPromise=e.drawQR(this._qr).then(()=>{var t;this._svg&&((t=this._extension)===null||t===void 0||t.call(this,e.getElement(),this._options))})}_setupCanvas(){var e,t;this._qr&&(!((e=this._options.nodeCanvas)===null||e===void 0)&&e.createCanvas?(this._nodeCanvas=this._options.nodeCanvas.createCanvas(this._options.width,this._options.height),this._nodeCanvas.width=this._options.width,this._nodeCanvas.height=this._options.height):(this._domCanvas=document.createElement("canvas"),this._domCanvas.width=this._options.width,this._domCanvas.height=this._options.height),this._setupSvg(),this._canvasDrawingPromise=(t=this._svgDrawingPromise)===null||t===void 0?void 0:t.then(()=>{var o;if(!this._svg)return;const i=this._svg,r=new this._window.XMLSerializer().serializeToString(i),u=btoa(r),k=`data:${vt("svg")};base64,${u}`;if(!((o=this._options.nodeCanvas)===null||o===void 0)&&o.loadImage)return this._options.nodeCanvas.loadImage(k).then(_=>{var S,g;_.width=this._options.width,_.height=this._options.height,(g=(S=this._nodeCanvas)===null||S===void 0?void 0:S.getContext("2d"))===null||g===void 0||g.drawImage(_,0,0)});{const _=new this._window.Image;return new Promise(S=>{_.onload=()=>{var g,z;(z=(g=this._domCanvas)===null||g===void 0?void 0:g.getContext("2d"))===null||z===void 0||z.drawImage(_,0,0),S()},_.src=k})}}))}async _getElement(e="png"){if(!this._qr)throw"QR code is empty";return e.toLowerCase()==="svg"?(this._svg&&this._svgDrawingPromise||this._setupSvg(),await this._svgDrawingPromise,this._svg):((this._domCanvas||this._nodeCanvas)&&this._canvasDrawingPromise||this._setupCanvas(),await this._canvasDrawingPromise,this._domCanvas||this._nodeCanvas)}update(e){h._clearContainer(this._container),this._options=e?kt(x(this._options,e)):this._options,this._options.data&&(this._qr=Dt()(this._options.qrOptions.typeNumber,this._options.qrOptions.errorCorrectionLevel),this._qr.addData(this._options.data,this._options.qrOptions.mode||function(t){switch(!0){case/^[0-9]*$/.test(t):return"Numeric";case/^[0-9A-Z $%*+\-./:]*$/.test(t):return"Alphanumeric";default:return"Byte"}}(this._options.data)),this._qr.make(),this._options.type===St?this._setupCanvas():this._setupSvg(),this.append(this._container))}append(e){if(e){if(typeof e.appendChild!="function")throw"Container should be a single DOM node";this._options.type===St?this._domCanvas&&e.appendChild(this._domCanvas):this._svg&&e.appendChild(this._svg),this._container=e}}applyExtension(e){if(!e)throw"Extension function should be defined.";this._extension=e,this.update()}deleteExtension(){this._extension=void 0,this.update()}async getRawData(e="png"){if(!this._qr)throw"QR code is empty";const t=await this._getElement(e),o=vt(e);if(!t)return null;if(e.toLowerCase()==="svg"){const i=`<?xml version="1.0" standalone="no"?>\r
${new this._window.XMLSerializer().serializeToString(t)}`;return typeof Blob>"u"||this._options.jsdom?Buffer.from(i):new Blob([i],{type:o})}return new Promise(i=>{const r=t;if("toBuffer"in r)if(o==="image/png")i(r.toBuffer(o));else if(o==="image/jpeg")i(r.toBuffer(o));else{if(o!=="application/pdf")throw Error("Unsupported extension");i(r.toBuffer(o))}else"toBlob"in r&&r.toBlob(i,o,1)})}async download(e){if(!this._qr)throw"QR code is empty";if(typeof Blob>"u")throw"Cannot download in Node.js, call getRawData instead.";let t="png",o="qr";typeof e=="string"?(t=e,console.warn("Extension is deprecated as argument for 'download' method, please pass object { name: '...', extension: '...' } as argument")):typeof e=="object"&&e!==null&&(e.name&&(o=e.name),e.extension&&(t=e.extension));const i=await this._getElement(t);if(i)if(t.toLowerCase()==="svg"){let r=new XMLSerializer().serializeToString(i);r=`<?xml version="1.0" standalone="no"?>\r
`+r,E(`data:${vt(t)};charset=utf-8,${encodeURIComponent(r)}`,`${o}.svg`)}else E(i.toDataURL(vt(t)),`${o}.${t}`)}}const y=h})(),P.default})())}(Ut)),Ut.exports}var Pe=Se();const ke=_e(Pe),ze=`
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
`;var qt=(n=>(n.PENDING="PENDING",n.IN_FLIGHT="IN_FLIGHT",n.COMPLETED="COMPLETED",n.FAILED="FAILED",n.CANCELLED="CANCELLED",n))(qt||{});ne(["click"]);var $e=pt('<div class=test-mode-badge tabindex=0><svg width=16 height=16 viewBox="0 0 20 20"fill=none xmlns=http://www.w3.org/2000/svg><circle cx=10 cy=10 r=9 stroke=#b45309 stroke-width=2 fill=#fef3c7></circle><text x=10 y=15 text-anchor=middle font-size=12 fill=#b45309 font-family=Arial font-weight=bold>i</text></svg><span class=test-mode-badge-text>Test Mode</span><div class=test-mode-tooltip>Test Mode: No real money will be moved.'),se=pt("<div>Complete on your phone"),ae=pt("<div>Attempting to reconnect..."),Ae=pt("<div class=qr-code-container id=qrcode-container-mobile>"),qe=pt('<div><div class=mobile-button-container><button class=mobile-button title="Open on mobile device"><svg width=20 height=20 viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round><rect x=5 y=2 width=14 height=20 rx=2 ry=2></rect><line x1=12 y1=18 x2=12 y2=18></line></svg><span>Open app to continue'),Oe=pt("<div class=savings-badge>"),Me=pt("<div class=zenobia-error>"),Ee=pt('<div class="zenobia-qr-popup-overlay visible"><div class=zenobia-qr-popup-content><button class=zenobia-qr-close><svg viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2><path d="M18 6L6 18M6 6l12 12"></path></svg></button><div class=modal-header><div class=header-content><h3>Pay by bank with Zenobia</h3><p class=subtitle>Scan to complete your purchase</p></div></div><div class=modal-body><div class=payment-amount>$</div><div class=payment-status><div class=spinner></div><div class=payment-instructions>'),De=pt("<div class=qr-code-container id=qrcode-container>"),le=pt("<div class=qr-code-container><div class=zenobia-qr-placeholder>");const Ie=()=>{if(typeof window>"u")return!1;const n=window.navigator.userAgent.toLowerCase(),s=/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(n),d="ontouchstart"in window||navigator.maxTouchPoints>0,w=window.innerWidth<=768;return s||d&&w},Be=n=>{const[s,d]=ht(null),w={current:null},[C,P]=ht(qt.PENDING),[$,x]=ht(null),[E,Q]=ht(!1),[N,H]=ht(null),[Z,tt]=ht(null),[et,R]=ht(!1),[lt,ut]=ht(""),[J,X]=ht(!1),[it,yt]=ht(!1),[St,bt]=ht(null);Tt(()=>{if(n.isOpen&&!N()){X(!1),yt(!1),bt(null),x(null);const h=new xe(n.isTest);if(H(h),n.transferRequest)tt(n.transferRequest),h.listenToTransfer(n.transferRequest.transferRequestId,n.transferRequest.signature||"",Pt,mt,kt,zt);else if(n.url){R(!0),x(null);const y=n.metadata||{amount:n.amount,statementItems:{name:"Payment",amount:n.amount}};h.createTransfer(n.url,y).then(c=>{tt({transferRequestId:c.transferRequestId,merchantId:c.merchantId,expiry:c.expiry,signature:c.signature}),h.listenToTransfer(c.transferRequestId,c.signature||"",Pt,mt,kt,zt)}).catch(c=>{x(c instanceof Error?c.message:"An error occurred"),n.onError&&c instanceof Error&&n.onError(c)}).finally(()=>{R(!1)})}else x("No URL provided for creating a new transfer")}}),Tt(()=>{var h;if((h=Z())!=null&&h.transferRequestId){const y=Z().transferRequestId.replace(/-/g,"");let e=`https://zenobiapay.com/clip?id=${btoa(y).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}`;n.isTest&&(e+="&type=test"),ut(e);const o=n.qrCodeSize||220,i=new ke({width:o,height:o,type:"svg",data:e,image:void 0,dotsOptions:{color:"#000000",type:"dots"},backgroundOptions:{color:"#ffffff"},cornersSquareOptions:{type:"extra-rounded"},cornersDotOptions:{type:"dot"},qrOptions:{errorCorrectionLevel:"M"}});d(i)}}),Tt(()=>{const h=s();h&&w.current&&(w.current.innerHTML="",h.append(w.current))});const Pt=h=>{console.log("Received status update:",h);let y;switch(h.status){case"COMPLETED":case"IN_FLIGHT":y=qt.COMPLETED,n.onSuccess&&Z()&&n.onSuccess(Z(),h);const c=N();c&&(c.disconnect(),H(null));break;case"FAILED":y=qt.FAILED;const e=N();e&&(e.disconnect(),H(null));break;case"CANCELLED":y=qt.CANCELLED;const t=N();t&&(t.disconnect(),H(null));break;default:y=qt.PENDING}P(y),n.onStatusChange&&n.onStatusChange(y)},mt=h=>{console.error("WebSocket error:",h),h.toLowerCase().includes("disconnect")||h.toLowerCase().includes("connection lost")||h.toLowerCase().includes("network error")||h.toLowerCase().includes("timeout")?(bt(h),yt(!0)):(x(h),n.onError&&n.onError(new Error(h)))},kt=h=>{console.log("WebSocket connection status:",h?"Connected":"Disconnected"),Q(h),h?(yt(!1),bt(null)):yt(!0)},zt=h=>{console.log("Scan update received:",h.scanType),h.scanType==="scanned"?X(!0):h.scanType==="unscanned"&&X(!1)};ue(()=>{const h=N();h&&h.disconnect()}),Tt(()=>{if(!n.isOpen){const h=N();h&&(h.disconnect(),H(null)),X(!1),yt(!1),bt(null),x(null)}});const Dt=()=>n.discountAmount!==void 0?n.discountAmount:Math.round(n.amount/100),vt=()=>{if(!n.showCashback)return null;const h=Dt();return h<1e3?`✨ ${(h/n.amount*100).toFixed(0)}% cashback applied!`:`✨ Applied $${(h/100).toFixed(2)} cashback!`};return dt(ft,{get when(){return n.isOpen},get children(){var h=Ee(),y=h.firstChild,c=y.firstChild,e=c.nextSibling,t=e.firstChild,o=t.firstChild;o.nextSibling;var i=e.nextSibling,r=i.firstChild;r.firstChild;var u=r.nextSibling,k=u.firstChild,_=k.nextSibling;return me(c,"click",n.onClose),at(t,dt(ft,{get when(){return n.isTest},get children(){return $e()}}),null),at(i,dt(ft,{get when(){return Ie()&&lt()!==""&&!n.hideQrOnMobile},get fallback(){return dt(ft,{get when(){return _t(()=>!!s())()&&Z()},get fallback(){return(()=>{var S=le(),g=S.firstChild;return S.style.setProperty("display","flex"),S.style.setProperty("justify-content","center"),S.style.setProperty("align-items","center"),Ct(z=>{var v=n.qrCodeSize?`${n.qrCodeSize}px`:"220px",b=n.qrCodeSize?`${n.qrCodeSize}px`:"220px",A=n.qrCodeSize?`${n.qrCodeSize}px`:"220px",q=n.qrCodeSize?`${n.qrCodeSize}px`:"220px";return v!==z.e&&((z.e=v)!=null?S.style.setProperty("width",v):S.style.removeProperty("width")),b!==z.t&&((z.t=b)!=null?S.style.setProperty("height",b):S.style.removeProperty("height")),A!==z.a&&((z.a=A)!=null?g.style.setProperty("width",A):g.style.removeProperty("width")),q!==z.o&&((z.o=q)!=null?g.style.setProperty("height",q):g.style.removeProperty("height")),z},{e:void 0,t:void 0,a:void 0,o:void 0}),S})()},get children(){var S=De();return re(g=>{w.current=g},S),S.style.setProperty("display","flex"),S.style.setProperty("justify-content","center"),S.style.setProperty("align-items","center"),S.style.setProperty("position","relative"),at(S,dt(ft,{get when(){return J()},get children(){var g=se();return g.style.setProperty("position","absolute"),g.style.setProperty("top","0"),g.style.setProperty("left","0"),g.style.setProperty("right","0"),g.style.setProperty("bottom","0"),g.style.setProperty("background","rgba(0, 0, 0, 0.95)"),g.style.setProperty("display","flex"),g.style.setProperty("justify-content","center"),g.style.setProperty("align-items","center"),g.style.setProperty("border-radius","8px"),g.style.setProperty("color","white"),g.style.setProperty("font-size","16px"),g.style.setProperty("font-weight","500"),g.style.setProperty("text-align","center"),g.style.setProperty("padding","20px"),g.style.setProperty("z-index","10"),g}}),null),at(S,dt(ft,{get when(){return it()},get children(){var g=ae();return g.style.setProperty("position","absolute"),g.style.setProperty("top","0"),g.style.setProperty("left","0"),g.style.setProperty("right","0"),g.style.setProperty("bottom","0"),g.style.setProperty("background","rgba(0, 0, 0, 0.9)"),g.style.setProperty("display","flex"),g.style.setProperty("justify-content","center"),g.style.setProperty("align-items","center"),g.style.setProperty("border-radius","8px"),g.style.setProperty("color","white"),g.style.setProperty("font-size","16px"),g.style.setProperty("font-weight","500"),g.style.setProperty("text-align","center"),g.style.setProperty("padding","20px"),g.style.setProperty("z-index","10"),g}}),null),Ct(g=>{var z=n.qrCodeSize?`${n.qrCodeSize}px`:"220px",v=n.qrCodeSize?`${n.qrCodeSize}px`:"220px";return z!==g.e&&((g.e=z)!=null?S.style.setProperty("width",z):S.style.removeProperty("width")),v!==g.t&&((g.t=v)!=null?S.style.setProperty("height",v):S.style.removeProperty("height")),g},{e:void 0,t:void 0}),S}})},get children(){var S=qe(),g=S.firstChild,z=g.firstChild;return S.style.setProperty("text-align","center"),S.style.setProperty("margin","20px 0"),g.style.setProperty("text-align","center"),g.style.setProperty("margin","20px 0"),z.$$click=()=>window.open(lt(),"_blank"),z.style.setProperty("background-color","#000"),z.style.setProperty("color","#fff"),z.style.setProperty("border","none"),z.style.setProperty("padding","16px 24px"),z.style.setProperty("border-radius","8px"),z.style.setProperty("font-size","16px"),z.style.setProperty("font-weight","500"),z.style.setProperty("cursor","pointer"),z.style.setProperty("display","flex"),z.style.setProperty("align-items","center"),z.style.setProperty("gap","8px"),z.style.setProperty("margin","0 auto"),z.style.setProperty("transition","background-color 0.2s ease"),at(S,dt(ft,{get when(){return _t(()=>!!s())()&&Z()},get fallback(){return(()=>{var v=le(),b=v.firstChild;return v.style.setProperty("display","flex"),v.style.setProperty("justify-content","center"),v.style.setProperty("align-items","center"),v.style.setProperty("margin","20px auto"),Ct(A=>{var q=n.qrCodeSize?`${n.qrCodeSize}px`:"220px",a=n.qrCodeSize?`${n.qrCodeSize}px`:"220px",f=n.qrCodeSize?`${n.qrCodeSize}px`:"220px",l=n.qrCodeSize?`${n.qrCodeSize}px`:"220px";return q!==A.e&&((A.e=q)!=null?v.style.setProperty("width",q):v.style.removeProperty("width")),a!==A.t&&((A.t=a)!=null?v.style.setProperty("height",a):v.style.removeProperty("height")),f!==A.a&&((A.a=f)!=null?b.style.setProperty("width",f):b.style.removeProperty("width")),l!==A.o&&((A.o=l)!=null?b.style.setProperty("height",l):b.style.removeProperty("height")),A},{e:void 0,t:void 0,a:void 0,o:void 0}),v})()},get children(){var v=Ae();return re(b=>{if(b){const A=s();A&&(b.innerHTML="",A.append(b))}},v),v.style.setProperty("display","flex"),v.style.setProperty("justify-content","center"),v.style.setProperty("align-items","center"),v.style.setProperty("margin","20px auto"),v.style.setProperty("position","relative"),at(v,dt(ft,{get when(){return J()},get children(){var b=se();return b.style.setProperty("position","absolute"),b.style.setProperty("top","0"),b.style.setProperty("left","0"),b.style.setProperty("right","0"),b.style.setProperty("bottom","0"),b.style.setProperty("background","rgba(0, 0, 0, 0.95)"),b.style.setProperty("display","flex"),b.style.setProperty("justify-content","center"),b.style.setProperty("align-items","center"),b.style.setProperty("border-radius","8px"),b.style.setProperty("color","white"),b.style.setProperty("font-size","16px"),b.style.setProperty("font-weight","500"),b.style.setProperty("text-align","center"),b.style.setProperty("padding","20px"),b.style.setProperty("z-index","10"),b}}),null),at(v,dt(ft,{get when(){return it()},get children(){var b=ae();return b.style.setProperty("position","absolute"),b.style.setProperty("top","0"),b.style.setProperty("left","0"),b.style.setProperty("right","0"),b.style.setProperty("bottom","0"),b.style.setProperty("background","rgba(0, 0, 0, 0.9)"),b.style.setProperty("display","flex"),b.style.setProperty("justify-content","center"),b.style.setProperty("align-items","center"),b.style.setProperty("border-radius","8px"),b.style.setProperty("color","white"),b.style.setProperty("font-size","16px"),b.style.setProperty("font-weight","500"),b.style.setProperty("text-align","center"),b.style.setProperty("padding","20px"),b.style.setProperty("z-index","10"),b}}),null),Ct(b=>{var A=n.qrCodeSize?`${n.qrCodeSize}px`:"220px",q=n.qrCodeSize?`${n.qrCodeSize}px`:"220px";return A!==b.e&&((b.e=A)!=null?v.style.setProperty("width",A):v.style.removeProperty("width")),q!==b.t&&((b.t=q)!=null?v.style.setProperty("height",q):v.style.removeProperty("height")),b},{e:void 0,t:void 0}),v}}),null),S}}),r),at(r,()=>(n.amount/100).toFixed(2),null),at(i,dt(ft,{get when(){return vt()},get children(){var S=Oe();return at(S,vt),S}}),u),at(_,(()=>{var S=_t(()=>!!et());return()=>S()?"Preparing payment...":_t(()=>!Z())()?"Creating payment...":it()?"Reconnecting...":"Waiting for payment"})()),at(i,dt(ft,{get when(){return _t(()=>!!$())()&&!it()},get children(){var S=Me();return at(S,$),S}}),null),h}})};ne(["click"]);function Le(){if(!document.getElementById("zenobia-payment-styles")){const n=document.createElement("style");n.id="zenobia-payment-styles",n.textContent=ze,document.head.appendChild(n)}}function je(n){const s=typeof n.target=="string"?document.querySelector(n.target):n.target;if(!s){console.error("[zenobia-pay-modal] target element not found:",n.target);return}Le(),be(()=>dt(Be,{get isOpen(){return n.isOpen},get onClose(){return n.onClose},get amount(){return n.amount},get discountAmount(){return n.discountAmount},get qrCodeSize(){return n.qrCodeSize},get isTest(){return n.isTest},get url(){return n.url},get metadata(){return n.metadata},get transferRequest(){return n.transferRequest},get hideQrOnMobile(){return n.hideQrOnMobile},get showCashback(){return n.showCashback},get onSuccess(){return n.onSuccess},get onError(){return n.onError},get onStatusChange(){return n.onStatusChange}}),s)}window.ZenobiaPayModal={init:je}})();
