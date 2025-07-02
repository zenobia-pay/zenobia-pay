(function(){"use strict";const Bt={equals:(n,s)=>n===s};let Qt=Jt;const vt=1,Lt=2,Gt={owned:null,cleanups:null,context:null,owner:null};var ot=null;let Ht=null,le=null,nt=null,at=null,wt=null,Tt=0;function ce(n,s){const l=nt,h=ot,m=n.length===0,b=s===void 0?h:s,S=m?Gt:{owned:null,cleanups:null,context:b?b.context:null,owner:b},y=m?n:()=>n(()=>Ct(()=>Mt(S)));ot=S,nt=null;try{return It(y,!0)}finally{nt=l,ot=h}}function pt(n,s){s=s?Object.assign({},Bt,s):Bt;const l={value:n,observers:null,observerSlots:null,comparator:s.equals||void 0},h=m=>(typeof m=="function"&&(m=m(l.value)),Yt(l,m));return[Vt.bind(l),h]}function St(n,s,l){const h=Wt(n,s,!1,vt);Ot(h)}function Zt(n,s,l){Qt=fe;const h=Wt(n,s,!1,vt);h.user=!0,wt?wt.push(h):Ot(h)}function qt(n,s,l){l=l?Object.assign({},Bt,l):Bt;const h=Wt(n,s,!0,0);return h.observers=null,h.observerSlots=null,h.comparator=l.equals||void 0,Ot(h),Vt.bind(h)}function Ct(n){if(nt===null)return n();const s=nt;nt=null;try{return n()}finally{nt=s}}function de(n){return ot===null||(ot.cleanups===null?ot.cleanups=[n]:ot.cleanups.push(n)),n}function Vt(){if(this.sources&&this.state)if(this.state===vt)Ot(this);else{const n=at;at=null,It(()=>Rt(this),!1),at=n}if(nt){const n=this.observers?this.observers.length:0;nt.sources?(nt.sources.push(this),nt.sourceSlots.push(n)):(nt.sources=[this],nt.sourceSlots=[n]),this.observers?(this.observers.push(nt),this.observerSlots.push(nt.sources.length-1)):(this.observers=[nt],this.observerSlots=[nt.sources.length-1])}return this.value}function Yt(n,s,l){let h=n.value;return(!n.comparator||!n.comparator(h,s))&&(n.value=s,n.observers&&n.observers.length&&It(()=>{for(let m=0;m<n.observers.length;m+=1){const b=n.observers[m],S=Ht&&Ht.running;S&&Ht.disposed.has(b),(S?!b.tState:!b.state)&&(b.pure?at.push(b):wt.push(b),b.observers&&Kt(b)),S||(b.state=vt)}if(at.length>1e6)throw at=[],new Error},!1)),s}function Ot(n){if(!n.fn)return;Mt(n);const s=Tt;ue(n,n.value,s)}function ue(n,s,l){let h;const m=ot,b=nt;nt=ot=n;try{h=n.fn(s)}catch(S){return n.pure&&(n.state=vt,n.owned&&n.owned.forEach(Mt),n.owned=null),n.updatedAt=l+1,te(S)}finally{nt=b,ot=m}(!n.updatedAt||n.updatedAt<=l)&&(n.updatedAt!=null&&"observers"in n?Yt(n,h):n.value=h,n.updatedAt=l)}function Wt(n,s,l,h=vt,m){const b={fn:n,state:h,updatedAt:null,owned:null,sources:null,sourceSlots:null,cleanups:null,value:s,owner:ot,context:ot?ot.context:null,pure:l};return ot===null||ot!==Gt&&(ot.owned?ot.owned.push(b):ot.owned=[b]),b}function Nt(n){if(n.state===0)return;if(n.state===Lt)return Rt(n);if(n.suspense&&Ct(n.suspense.inFallback))return n.suspense.effects.push(n);const s=[n];for(;(n=n.owner)&&(!n.updatedAt||n.updatedAt<Tt);)n.state&&s.push(n);for(let l=s.length-1;l>=0;l--)if(n=s[l],n.state===vt)Ot(n);else if(n.state===Lt){const h=at;at=null,It(()=>Rt(n,s[0]),!1),at=h}}function It(n,s){if(at)return n();let l=!1;s||(at=[]),wt?l=!0:wt=[],Tt++;try{const h=n();return he(l),h}catch(h){l||(wt=null),at=null,te(h)}}function he(n){if(at&&(Jt(at),at=null),n)return;const s=wt;wt=null,s.length&&It(()=>Qt(s),!1)}function Jt(n){for(let s=0;s<n.length;s++)Nt(n[s])}function fe(n){let s,l=0;for(s=0;s<n.length;s++){const h=n[s];h.user?n[l++]=h:Nt(h)}for(s=0;s<l;s++)Nt(n[s])}function Rt(n,s){n.state=0;for(let l=0;l<n.sources.length;l+=1){const h=n.sources[l];if(h.sources){const m=h.state;m===vt?h!==s&&(!h.updatedAt||h.updatedAt<Tt)&&Nt(h):m===Lt&&Rt(h,s)}}}function Kt(n){for(let s=0;s<n.observers.length;s+=1){const l=n.observers[s];l.state||(l.state=Lt,l.pure?at.push(l):wt.push(l),l.observers&&Kt(l))}}function Mt(n){let s;if(n.sources)for(;n.sources.length;){const l=n.sources.pop(),h=n.sourceSlots.pop(),m=l.observers;if(m&&m.length){const b=m.pop(),S=l.observerSlots.pop();h<m.length&&(b.sourceSlots[S]=h,m[h]=b,l.observerSlots[h]=S)}}if(n.tOwned){for(s=n.tOwned.length-1;s>=0;s--)Mt(n.tOwned[s]);delete n.tOwned}if(n.owned){for(s=n.owned.length-1;s>=0;s--)Mt(n.owned[s]);n.owned=null}if(n.cleanups){for(s=n.cleanups.length-1;s>=0;s--)n.cleanups[s]();n.cleanups=null}n.state=0}function ge(n){return n instanceof Error?n:new Error(typeof n=="string"?n:"Unknown error",{cause:n})}function te(n,s=ot){throw ge(n)}function xt(n,s){return Ct(()=>n(s||{}))}const pe=n=>`Stale read from <${n}>.`;function Et(n){const s=n.keyed,l=qt(()=>n.when,void 0,void 0),h=s?l:qt(l,void 0,{equals:(m,b)=>!m==!b});return qt(()=>{const m=h();if(m){const b=n.children;return typeof b=="function"&&b.length>0?Ct(()=>b(s?m:()=>{if(!Ct(h))throw pe("Show");return l()})):b}return n.fallback},void 0,void 0)}function we(n,s,l){let h=l.length,m=s.length,b=h,S=0,y=0,O=s[m-1].nextSibling,Y=null;for(;S<m||y<b;){if(s[S]===l[y]){S++,y++;continue}for(;s[m-1]===l[b-1];)m--,b--;if(m===S){const F=b<h?y?l[y-1].nextSibling:l[b-y]:O;for(;y<b;)n.insertBefore(l[y++],F)}else if(b===y)for(;S<m;)(!Y||!Y.has(s[S]))&&s[S].remove(),S++;else if(s[S]===l[b-1]&&l[y]===s[m-1]){const F=s[--m].nextSibling;n.insertBefore(l[y++],s[S++].nextSibling),n.insertBefore(l[--b],F),s[m]=l[b]}else{if(!Y){Y=new Map;let X=y;for(;X<b;)Y.set(l[X],X++)}const F=Y.get(s[S]);if(F!=null)if(y<F&&F<b){let X=S,rt=1,J;for(;++X<m&&X<b&&!((J=Y.get(s[X]))==null||J!==F+rt);)rt++;if(rt>F-y){const N=s[S];for(;y<F;)n.insertBefore(l[y++],N)}else n.replaceChild(l[y++],s[S++])}else S++;else s[S++].remove()}}}const ee="_$DX_DELEGATE";function me(n,s,l,h={}){let m;return ce(b=>{m=b,s===document?n():ht(s,n(),s.firstChild?null:void 0,l)},h.owner),()=>{m(),s.textContent=""}}function _t(n,s,l,h){let m;const b=()=>{const y=document.createElement("template");return y.innerHTML=n,y.content.firstChild},S=()=>(m||(m=b())).cloneNode(!0);return S.cloneNode=S,S}function ne(n,s=window.document){const l=s[ee]||(s[ee]=new Set);for(let h=0,m=n.length;h<m;h++){const b=n[h];l.has(b)||(l.add(b),s.addEventListener(b,ye))}}function be(n,s,l,h){Array.isArray(l)?(n[`$$${s}`]=l[0],n[`$$${s}Data`]=l[1]):n[`$$${s}`]=l}function ve(n,s,l){return Ct(()=>n(s,l))}function ht(n,s,l,h){if(l!==void 0&&!h&&(h=[]),typeof s!="function")return jt(n,s,h,l);St(m=>jt(n,s(),m,l),h)}function ye(n){let s=n.target;const l=`$$${n.type}`,h=n.target,m=n.currentTarget,b=O=>Object.defineProperty(n,"target",{configurable:!0,value:O}),S=()=>{const O=s[l];if(O&&!s.disabled){const Y=s[`${l}Data`];if(Y!==void 0?O.call(s,Y,n):O.call(s,n),n.cancelBubble)return}return s.host&&typeof s.host!="string"&&!s.host._$host&&s.contains(n.target)&&b(s.host),!0},y=()=>{for(;S()&&(s=s._$host||s.parentNode||s.host););};if(Object.defineProperty(n,"currentTarget",{configurable:!0,get(){return s||document}}),n.composedPath){const O=n.composedPath();b(O[0]);for(let Y=0;Y<O.length-2&&(s=O[Y],!!S());Y++){if(s._$host){s=s._$host,y();break}if(s.parentNode===m)break}}else y();b(h)}function jt(n,s,l,h,m){for(;typeof l=="function";)l=l();if(s===l)return l;const b=typeof s,S=h!==void 0;if(n=S&&l[0]&&l[0].parentNode||n,b==="string"||b==="number"){if(b==="number"&&(s=s.toString(),s===l))return l;if(S){let y=l[0];y&&y.nodeType===3?y.data!==s&&(y.data=s):y=document.createTextNode(s),l=At(n,l,h,y)}else l!==""&&typeof l=="string"?l=n.firstChild.data=s:l=n.textContent=s}else if(s==null||b==="boolean")l=At(n,l,h);else{if(b==="function")return St(()=>{let y=s();for(;typeof y=="function";)y=y();l=jt(n,y,l,h)}),()=>l;if(Array.isArray(s)){const y=[],O=l&&Array.isArray(l);if(Xt(y,s,l,m))return St(()=>l=jt(n,y,l,h,!0)),()=>l;if(y.length===0){if(l=At(n,l,h),S)return l}else O?l.length===0?oe(n,y,h):we(n,l,y):(l&&At(n),oe(n,y));l=y}else if(s.nodeType){if(Array.isArray(l)){if(S)return l=At(n,l,h,s);At(n,l,null,s)}else l==null||l===""||!n.firstChild?n.appendChild(s):n.replaceChild(s,n.firstChild);l=s}}return l}function Xt(n,s,l,h){let m=!1;for(let b=0,S=s.length;b<S;b++){let y=s[b],O=l&&l[n.length],Y;if(!(y==null||y===!0||y===!1))if((Y=typeof y)=="object"&&y.nodeType)n.push(y);else if(Array.isArray(y))m=Xt(n,y,O)||m;else if(Y==="function")if(h){for(;typeof y=="function";)y=y();m=Xt(n,Array.isArray(y)?y:[y],Array.isArray(O)?O:[O])||m}else n.push(y),m=!0;else{const F=String(y);O&&O.nodeType===3&&O.data===F?n.push(O):n.push(document.createTextNode(F))}}return m}function oe(n,s,l=null){for(let h=0,m=s.length;h<m;h++)n.insertBefore(s[h],l)}function At(n,s,l,h){if(l===void 0)return n.textContent="";const m=h||document.createTextNode("");if(s.length){let b=!1;for(let S=s.length-1;S>=0;S--){const y=s[S];if(m!==y){const O=y.parentNode===n;!b&&!S?O?n.replaceChild(m,y):n.insertBefore(m,l):O&&y.remove()}else b=!0}}else n.insertBefore(m,l);return[m]}class ie{constructor(){this.socket=null,this.reconnectTimeout=null,this.reconnectAttempts=0,this.maxReconnectAttempts=5,this.transferId=null,this.signature=null,this.wsBaseUrl="transfer-status.zenobiapay.com",this.onStatusCallback=null,this.onErrorCallback=null,this.onConnectionCallback=null}getSignature(){return this.signature}getTransferId(){return this.transferId}async createTransfer(s,l){try{const h=await fetch(s,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(l)});if(!h.ok){const b=await h.json();throw new Error(b.message||"Failed to create transfer request")}const m=await h.json();return this.transferId=m.transferRequestId,this.signature=m.signature,m}catch(h){throw console.error("Error creating transfer request:",h),h instanceof Error?h:new Error("Failed to create transfer request")}}listenToTransfer(s,l,h,m,b){this.transferId=s,this.signature=l,h&&(this.onStatusCallback=h),m&&(this.onErrorCallback=m),b&&(this.onConnectionCallback=b),this.connectWebSocket()}async createTransferAndListen(s,l,h,m,b){const S=await this.createTransfer(s,l);return this.listenToTransfer(S.transferRequestId,S.signature,h,m,b),S}connectWebSocket(){if(this.socket&&(this.socket.close(),this.socket=null,this.notifyConnectionStatus(!1)),!this.transferId||!this.signature){console.error("Cannot connect to WebSocket: Missing transfer ID or signature");return}try{const l=`${window.location.protocol==="https:"?"wss:":"ws:"}//${this.wsBaseUrl}/transfers/${this.transferId}/ws?token=${this.signature}`,h=new WebSocket(l);this.socket=h,h.onopen=()=>{this.notifyConnectionStatus(!0),this.reconnectAttempts=0},h.onclose=m=>{this.notifyConnectionStatus(!1),this.socket=null,m.code!==1e3&&this.reconnectAttempts<this.maxReconnectAttempts&&this.attemptReconnect()},h.onerror=m=>{console.error(`WebSocket error for transfer: ${this.transferId}`,m),this.notifyError("WebSocket error occurred")},h.onmessage=m=>{console.log(`WebSocket message received for transfer: ${this.transferId}`,m.data);try{const b=JSON.parse(m.data);b.type==="status"&&b.transfer?this.notifyStatus(b.transfer):b.type==="error"&&b.message?this.notifyError(b.message):b.type==="ping"&&h.readyState===WebSocket.OPEN&&h.send(JSON.stringify({type:"pong"}))}catch{this.notifyError("Failed to parse message")}}}catch{this.notifyError("Failed to establish WebSocket connection")}}attemptReconnect(){this.reconnectAttempts++;const s=Math.min(1e3*Math.pow(2,this.reconnectAttempts-1),3e4);console.log(`Attempting to reconnect in ${s}ms (attempt ${this.reconnectAttempts})`),this.reconnectTimeout&&window.clearTimeout(this.reconnectTimeout),this.reconnectTimeout=window.setTimeout(()=>{console.log(`Reconnecting to WebSocket (attempt ${this.reconnectAttempts})...`),this.connectWebSocket()},s)}disconnect(){this.reconnectTimeout&&(window.clearTimeout(this.reconnectTimeout),this.reconnectTimeout=null),this.socket&&this.socket.readyState<2&&(console.log(`Closing WebSocket for transfer: ${this.transferId}`),this.socket.close(),this.socket=null,this.notifyConnectionStatus(!1)),this.transferId=null,this.signature=null}notifyConnectionStatus(s){this.onConnectionCallback&&this.onConnectionCallback(s)}notifyStatus(s){this.onStatusCallback&&this.onStatusCallback(s)}notifyError(s){this.onErrorCallback&&this.onErrorCallback(s)}}function xe(n){return n&&n.__esModule&&Object.prototype.hasOwnProperty.call(n,"default")?n.default:n}var Ft={exports:{}},_e=Ft.exports,re;function Se(){return re||(re=1,function(n,s){(function(l,h){n.exports=h()})(_e,()=>(()=>{var l={873:(S,y)=>{var O,Y,F=function(){var X=function(w,p){var u=w,e=k[p],t=null,i=0,r=null,o=[],d={},_=function(a,f){t=function(c){for(var g=new Array(c),v=0;v<c;v+=1){g[v]=new Array(c);for(var q=0;q<c;q+=1)g[v][q]=null}return g}(i=4*u+17),x(0,0),x(i-7,0),x(0,i-7),C(),z(),A(a,f),u>=7&&$(a),r==null&&(r=L(u,e,o)),I(r,f)},x=function(a,f){for(var c=-1;c<=7;c+=1)if(!(a+c<=-1||i<=a+c))for(var g=-1;g<=7;g+=1)f+g<=-1||i<=f+g||(t[a+c][f+g]=0<=c&&c<=6&&(g==0||g==6)||0<=g&&g<=6&&(c==0||c==6)||2<=c&&c<=4&&2<=g&&g<=4)},z=function(){for(var a=8;a<i-8;a+=1)t[a][6]==null&&(t[a][6]=a%2==0);for(var f=8;f<i-8;f+=1)t[6][f]==null&&(t[6][f]=f%2==0)},C=function(){for(var a=R.getPatternPosition(u),f=0;f<a.length;f+=1)for(var c=0;c<a.length;c+=1){var g=a[f],v=a[c];if(t[g][v]==null)for(var q=-2;q<=2;q+=1)for(var P=-2;P<=2;P+=1)t[g+q][v+P]=q==-2||q==2||P==-2||P==2||q==0&&P==0}},$=function(a){for(var f=R.getBCHTypeNumber(u),c=0;c<18;c+=1){var g=!a&&(f>>c&1)==1;t[Math.floor(c/3)][c%3+i-8-3]=g}for(c=0;c<18;c+=1)g=!a&&(f>>c&1)==1,t[c%3+i-8-3][Math.floor(c/3)]=g},A=function(a,f){for(var c=e<<3|f,g=R.getBCHTypeInfo(c),v=0;v<15;v+=1){var q=!a&&(g>>v&1)==1;v<6?t[v][8]=q:v<8?t[v+1][8]=q:t[i-15+v][8]=q}for(v=0;v<15;v+=1)q=!a&&(g>>v&1)==1,v<8?t[8][i-v-1]=q:v<9?t[8][15-v-1+1]=q:t[8][15-v-1]=q;t[i-8][8]=!a},I=function(a,f){for(var c=-1,g=i-1,v=7,q=0,P=R.getMaskFunction(f),B=i-1;B>0;B-=2)for(B==6&&(B-=1);;){for(var U=0;U<2;U+=1)if(t[g][B-U]==null){var H=!1;q<a.length&&(H=(a[q]>>>v&1)==1),P(g,B-U)&&(H=!H),t[g][B-U]=H,(v-=1)==-1&&(q+=1,v=7)}if((g+=c)<0||i<=g){g-=c,c=-c;break}}},L=function(a,f,c){for(var g=ct.getRSBlocks(a,f),v=ft(),q=0;q<c.length;q+=1){var P=c[q];v.put(P.getMode(),4),v.put(P.getLength(),R.getLengthInBits(P.getMode(),a)),P.write(v)}var B=0;for(q=0;q<g.length;q+=1)B+=g[q].dataCount;if(v.getLengthInBits()>8*B)throw"code length overflow. ("+v.getLengthInBits()+">"+8*B+")";for(v.getLengthInBits()+4<=8*B&&v.put(0,4);v.getLengthInBits()%8!=0;)v.putBit(!1);for(;!(v.getLengthInBits()>=8*B||(v.put(236,8),v.getLengthInBits()>=8*B));)v.put(17,8);return function(U,H){for(var Z=0,st=0,et=0,V=new Array(H.length),W=new Array(H.length),M=0;M<H.length;M+=1){var tt=H[M].dataCount,it=H[M].totalCount-tt;st=Math.max(st,tt),et=Math.max(et,it),V[M]=new Array(tt);for(var D=0;D<V[M].length;D+=1)V[M][D]=255&U.getBuffer()[D+Z];Z+=tt;var ut=R.getErrorCorrectPolynomial(it),dt=K(V[M],ut.getLength()-1).mod(ut);for(W[M]=new Array(ut.getLength()-1),D=0;D<W[M].length;D+=1){var lt=D+dt.getLength()-W[M].length;W[M][D]=lt>=0?dt.getAt(lt):0}}var Ut=0;for(D=0;D<H.length;D+=1)Ut+=H[D].totalCount;var Dt=new Array(Ut),gt=0;for(D=0;D<st;D+=1)for(M=0;M<H.length;M+=1)D<V[M].length&&(Dt[gt]=V[M][D],gt+=1);for(D=0;D<et;D+=1)for(M=0;M<H.length;M+=1)D<W[M].length&&(Dt[gt]=W[M][D],gt+=1);return Dt}(v,g)};d.addData=function(a,f){var c=null;switch(f=f||"Byte"){case"Numeric":c=yt(a);break;case"Alphanumeric":c=mt(a);break;case"Byte":c=bt(a);break;case"Kanji":c=zt(a);break;default:throw"mode:"+f}o.push(c),r=null},d.isDark=function(a,f){if(a<0||i<=a||f<0||i<=f)throw a+","+f;return t[a][f]},d.getModuleCount=function(){return i},d.make=function(){if(u<1){for(var a=1;a<40;a++){for(var f=ct.getRSBlocks(a,e),c=ft(),g=0;g<o.length;g++){var v=o[g];c.put(v.getMode(),4),c.put(v.getLength(),R.getLengthInBits(v.getMode(),a)),v.write(c)}var q=0;for(g=0;g<f.length;g++)q+=f[g].dataCount;if(c.getLengthInBits()<=8*q)break}u=a}_(!1,function(){for(var P=0,B=0,U=0;U<8;U+=1){_(!0,U);var H=R.getLostPoint(d);(U==0||P>H)&&(P=H,B=U)}return B}())},d.createTableTag=function(a,f){a=a||2;var c="";c+='<table style="',c+=" border-width: 0px; border-style: none;",c+=" border-collapse: collapse;",c+=" padding: 0px; margin: "+(f=f===void 0?4*a:f)+"px;",c+='">',c+="<tbody>";for(var g=0;g<d.getModuleCount();g+=1){c+="<tr>";for(var v=0;v<d.getModuleCount();v+=1)c+='<td style="',c+=" border-width: 0px; border-style: none;",c+=" border-collapse: collapse;",c+=" padding: 0px; margin: 0px;",c+=" width: "+a+"px;",c+=" height: "+a+"px;",c+=" background-color: ",c+=d.isDark(g,v)?"#000000":"#ffffff",c+=";",c+='"/>';c+="</tr>"}return(c+="</tbody>")+"</table>"},d.createSvgTag=function(a,f,c,g){var v={};typeof arguments[0]=="object"&&(a=(v=arguments[0]).cellSize,f=v.margin,c=v.alt,g=v.title),a=a||2,f=f===void 0?4*a:f,(c=typeof c=="string"?{text:c}:c||{}).text=c.text||null,c.id=c.text?c.id||"qrcode-description":null,(g=typeof g=="string"?{text:g}:g||{}).text=g.text||null,g.id=g.text?g.id||"qrcode-title":null;var q,P,B,U,H=d.getModuleCount()*a+2*f,Z="";for(U="l"+a+",0 0,"+a+" -"+a+",0 0,-"+a+"z ",Z+='<svg version="1.1" xmlns="http://www.w3.org/2000/svg"',Z+=v.scalable?"":' width="'+H+'px" height="'+H+'px"',Z+=' viewBox="0 0 '+H+" "+H+'" ',Z+=' preserveAspectRatio="xMinYMin meet"',Z+=g.text||c.text?' role="img" aria-labelledby="'+E([g.id,c.id].join(" ").trim())+'"':"",Z+=">",Z+=g.text?'<title id="'+E(g.id)+'">'+E(g.text)+"</title>":"",Z+=c.text?'<description id="'+E(c.id)+'">'+E(c.text)+"</description>":"",Z+='<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>',Z+='<path d="',P=0;P<d.getModuleCount();P+=1)for(B=P*a+f,q=0;q<d.getModuleCount();q+=1)d.isDark(P,q)&&(Z+="M"+(q*a+f)+","+B+U);return(Z+='" stroke="transparent" fill="black"/>')+"</svg>"},d.createDataURL=function(a,f){a=a||2,f=f===void 0?4*a:f;var c=d.getModuleCount()*a+2*f,g=f,v=c-f;return G(c,c,function(q,P){if(g<=q&&q<v&&g<=P&&P<v){var B=Math.floor((q-g)/a),U=Math.floor((P-g)/a);return d.isDark(U,B)?0:1}return 1})},d.createImgTag=function(a,f,c){a=a||2,f=f===void 0?4*a:f;var g=d.getModuleCount()*a+2*f,v="";return v+="<img",v+=' src="',v+=d.createDataURL(a,f),v+='"',v+=' width="',v+=g,v+='"',v+=' height="',v+=g,v+='"',c&&(v+=' alt="',v+=E(c),v+='"'),v+"/>"};var E=function(a){for(var f="",c=0;c<a.length;c+=1){var g=a.charAt(c);switch(g){case"<":f+="&lt;";break;case">":f+="&gt;";break;case"&":f+="&amp;";break;case'"':f+="&quot;";break;default:f+=g}}return f};return d.createASCII=function(a,f){if((a=a||1)<2)return function(V){V=V===void 0?2:V;var W,M,tt,it,D,ut=1*d.getModuleCount()+2*V,dt=V,lt=ut-V,Ut={"██":"█","█ ":"▀"," █":"▄","  ":" "},Dt={"██":"▀","█ ":"▀"," █":" ","  ":" "},gt="";for(W=0;W<ut;W+=2){for(tt=Math.floor((W-dt)/1),it=Math.floor((W+1-dt)/1),M=0;M<ut;M+=1)D="█",dt<=M&&M<lt&&dt<=W&&W<lt&&d.isDark(tt,Math.floor((M-dt)/1))&&(D=" "),dt<=M&&M<lt&&dt<=W+1&&W+1<lt&&d.isDark(it,Math.floor((M-dt)/1))?D+=" ":D+="█",gt+=V<1&&W+1>=lt?Dt[D]:Ut[D];gt+=`
`}return ut%2&&V>0?gt.substring(0,gt.length-ut-1)+Array(ut+1).join("▀"):gt.substring(0,gt.length-1)}(f);a-=1,f=f===void 0?2*a:f;var c,g,v,q,P=d.getModuleCount()*a+2*f,B=f,U=P-f,H=Array(a+1).join("██"),Z=Array(a+1).join("  "),st="",et="";for(c=0;c<P;c+=1){for(v=Math.floor((c-B)/a),et="",g=0;g<P;g+=1)q=1,B<=g&&g<U&&B<=c&&c<U&&d.isDark(v,Math.floor((g-B)/a))&&(q=0),et+=q?H:Z;for(v=0;v<a;v+=1)st+=et+`
`}return st.substring(0,st.length-1)},d.renderTo2dContext=function(a,f){f=f||2;for(var c=d.getModuleCount(),g=0;g<c;g++)for(var v=0;v<c;v++)a.fillStyle=d.isDark(g,v)?"black":"white",a.fillRect(g*f,v*f,f,f)},d};X.stringToBytes=(X.stringToBytesFuncs={default:function(w){for(var p=[],u=0;u<w.length;u+=1){var e=w.charCodeAt(u);p.push(255&e)}return p}}).default,X.createStringToBytes=function(w,p){var u=function(){for(var t=Pt(w),i=function(){var z=t.read();if(z==-1)throw"eof";return z},r=0,o={};;){var d=t.read();if(d==-1)break;var _=i(),x=i()<<8|i();o[String.fromCharCode(d<<8|_)]=x,r+=1}if(r!=p)throw r+" != "+p;return o}(),e=63;return function(t){for(var i=[],r=0;r<t.length;r+=1){var o=t.charCodeAt(r);if(o<128)i.push(o);else{var d=u[t.charAt(r)];typeof d=="number"?(255&d)==d?i.push(d):(i.push(d>>>8),i.push(255&d)):i.push(e)}}return i}};var rt,J,N,T,Q,k={L:1,M:0,Q:3,H:2},R=(rt=[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],J=1335,N=7973,Q=function(w){for(var p=0;w!=0;)p+=1,w>>>=1;return p},(T={}).getBCHTypeInfo=function(w){for(var p=w<<10;Q(p)-Q(J)>=0;)p^=J<<Q(p)-Q(J);return 21522^(w<<10|p)},T.getBCHTypeNumber=function(w){for(var p=w<<12;Q(p)-Q(N)>=0;)p^=N<<Q(p)-Q(N);return w<<12|p},T.getPatternPosition=function(w){return rt[w-1]},T.getMaskFunction=function(w){switch(w){case 0:return function(p,u){return(p+u)%2==0};case 1:return function(p,u){return p%2==0};case 2:return function(p,u){return u%3==0};case 3:return function(p,u){return(p+u)%3==0};case 4:return function(p,u){return(Math.floor(p/2)+Math.floor(u/3))%2==0};case 5:return function(p,u){return p*u%2+p*u%3==0};case 6:return function(p,u){return(p*u%2+p*u%3)%2==0};case 7:return function(p,u){return(p*u%3+(p+u)%2)%2==0};default:throw"bad maskPattern:"+w}},T.getErrorCorrectPolynomial=function(w){for(var p=K([1],0),u=0;u<w;u+=1)p=p.multiply(K([1,j.gexp(u)],0));return p},T.getLengthInBits=function(w,p){if(1<=p&&p<10)switch(w){case 1:return 10;case 2:return 9;case 4:case 8:return 8;default:throw"mode:"+w}else if(p<27)switch(w){case 1:return 12;case 2:return 11;case 4:return 16;case 8:return 10;default:throw"mode:"+w}else{if(!(p<41))throw"type:"+p;switch(w){case 1:return 14;case 2:return 13;case 4:return 16;case 8:return 12;default:throw"mode:"+w}}},T.getLostPoint=function(w){for(var p=w.getModuleCount(),u=0,e=0;e<p;e+=1)for(var t=0;t<p;t+=1){for(var i=0,r=w.isDark(e,t),o=-1;o<=1;o+=1)if(!(e+o<0||p<=e+o))for(var d=-1;d<=1;d+=1)t+d<0||p<=t+d||o==0&&d==0||r==w.isDark(e+o,t+d)&&(i+=1);i>5&&(u+=3+i-5)}for(e=0;e<p-1;e+=1)for(t=0;t<p-1;t+=1){var _=0;w.isDark(e,t)&&(_+=1),w.isDark(e+1,t)&&(_+=1),w.isDark(e,t+1)&&(_+=1),w.isDark(e+1,t+1)&&(_+=1),_!=0&&_!=4||(u+=3)}for(e=0;e<p;e+=1)for(t=0;t<p-6;t+=1)w.isDark(e,t)&&!w.isDark(e,t+1)&&w.isDark(e,t+2)&&w.isDark(e,t+3)&&w.isDark(e,t+4)&&!w.isDark(e,t+5)&&w.isDark(e,t+6)&&(u+=40);for(t=0;t<p;t+=1)for(e=0;e<p-6;e+=1)w.isDark(e,t)&&!w.isDark(e+1,t)&&w.isDark(e+2,t)&&w.isDark(e+3,t)&&w.isDark(e+4,t)&&!w.isDark(e+5,t)&&w.isDark(e+6,t)&&(u+=40);var x=0;for(t=0;t<p;t+=1)for(e=0;e<p;e+=1)w.isDark(e,t)&&(x+=1);return u+Math.abs(100*x/p/p-50)/5*10},T),j=function(){for(var w=new Array(256),p=new Array(256),u=0;u<8;u+=1)w[u]=1<<u;for(u=8;u<256;u+=1)w[u]=w[u-4]^w[u-5]^w[u-6]^w[u-8];for(u=0;u<255;u+=1)p[w[u]]=u;return{glog:function(e){if(e<1)throw"glog("+e+")";return p[e]},gexp:function(e){for(;e<0;)e+=255;for(;e>=256;)e-=255;return w[e]}}}();function K(w,p){if(w.length===void 0)throw w.length+"/"+p;var u=function(){for(var t=0;t<w.length&&w[t]==0;)t+=1;for(var i=new Array(w.length-t+p),r=0;r<w.length-t;r+=1)i[r]=w[r+t];return i}(),e={getAt:function(t){return u[t]},getLength:function(){return u.length},multiply:function(t){for(var i=new Array(e.getLength()+t.getLength()-1),r=0;r<e.getLength();r+=1)for(var o=0;o<t.getLength();o+=1)i[r+o]^=j.gexp(j.glog(e.getAt(r))+j.glog(t.getAt(o)));return K(i,0)},mod:function(t){if(e.getLength()-t.getLength()<0)return e;for(var i=j.glog(e.getAt(0))-j.glog(t.getAt(0)),r=new Array(e.getLength()),o=0;o<e.getLength();o+=1)r[o]=e.getAt(o);for(o=0;o<t.getLength();o+=1)r[o]^=j.gexp(j.glog(t.getAt(o))+i);return K(r,0).mod(t)}};return e}var ct=function(){var w=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12,7,37,13],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]],p=function(e,t){var i={};return i.totalCount=e,i.dataCount=t,i},u={getRSBlocks:function(e,t){var i=function($,A){switch(A){case k.L:return w[4*($-1)+0];case k.M:return w[4*($-1)+1];case k.Q:return w[4*($-1)+2];case k.H:return w[4*($-1)+3];default:return}}(e,t);if(i===void 0)throw"bad rs block @ typeNumber:"+e+"/errorCorrectionLevel:"+t;for(var r=i.length/3,o=[],d=0;d<r;d+=1)for(var _=i[3*d+0],x=i[3*d+1],z=i[3*d+2],C=0;C<_;C+=1)o.push(p(x,z));return o}};return u}(),ft=function(){var w=[],p=0,u={getBuffer:function(){return w},getAt:function(e){var t=Math.floor(e/8);return(w[t]>>>7-e%8&1)==1},put:function(e,t){for(var i=0;i<t;i+=1)u.putBit((e>>>t-i-1&1)==1)},getLengthInBits:function(){return p},putBit:function(e){var t=Math.floor(p/8);w.length<=t&&w.push(0),e&&(w[t]|=128>>>p%8),p+=1}};return u},yt=function(w){var p=w,u={getMode:function(){return 1},getLength:function(i){return p.length},write:function(i){for(var r=p,o=0;o+2<r.length;)i.put(e(r.substring(o,o+3)),10),o+=3;o<r.length&&(r.length-o==1?i.put(e(r.substring(o,o+1)),4):r.length-o==2&&i.put(e(r.substring(o,o+2)),7))}},e=function(i){for(var r=0,o=0;o<i.length;o+=1)r=10*r+t(i.charAt(o));return r},t=function(i){if("0"<=i&&i<="9")return i.charCodeAt(0)-48;throw"illegal char :"+i};return u},mt=function(w){var p=w,u={getMode:function(){return 2},getLength:function(t){return p.length},write:function(t){for(var i=p,r=0;r+1<i.length;)t.put(45*e(i.charAt(r))+e(i.charAt(r+1)),11),r+=2;r<i.length&&t.put(e(i.charAt(r)),6)}},e=function(t){if("0"<=t&&t<="9")return t.charCodeAt(0)-48;if("A"<=t&&t<="Z")return t.charCodeAt(0)-65+10;switch(t){case" ":return 36;case"$":return 37;case"%":return 38;case"*":return 39;case"+":return 40;case"-":return 41;case".":return 42;case"/":return 43;case":":return 44;default:throw"illegal char :"+t}};return u},bt=function(w){var p=X.stringToBytes(w);return{getMode:function(){return 4},getLength:function(u){return p.length},write:function(u){for(var e=0;e<p.length;e+=1)u.put(p[e],8)}}},zt=function(w){var p=X.stringToBytesFuncs.SJIS;if(!p)throw"sjis not supported.";(function(){var t=p("友");if(t.length!=2||(t[0]<<8|t[1])!=38726)throw"sjis not supported."})();var u=p(w),e={getMode:function(){return 8},getLength:function(t){return~~(u.length/2)},write:function(t){for(var i=u,r=0;r+1<i.length;){var o=(255&i[r])<<8|255&i[r+1];if(33088<=o&&o<=40956)o-=33088;else{if(!(57408<=o&&o<=60351))throw"illegal char at "+(r+1)+"/"+o;o-=49472}o=192*(o>>>8&255)+(255&o),t.put(o,13),r+=2}if(r<i.length)throw"illegal char at "+(r+1)}};return e},$t=function(){var w=[],p={writeByte:function(u){w.push(255&u)},writeShort:function(u){p.writeByte(u),p.writeByte(u>>>8)},writeBytes:function(u,e,t){e=e||0,t=t||u.length;for(var i=0;i<t;i+=1)p.writeByte(u[i+e])},writeString:function(u){for(var e=0;e<u.length;e+=1)p.writeByte(u.charCodeAt(e))},toByteArray:function(){return w},toString:function(){var u="";u+="[";for(var e=0;e<w.length;e+=1)e>0&&(u+=","),u+=w[e];return u+"]"}};return p},Pt=function(w){var p=w,u=0,e=0,t=0,i={read:function(){for(;t<8;){if(u>=p.length){if(t==0)return-1;throw"unexpected end of file./"+t}var o=p.charAt(u);if(u+=1,o=="=")return t=0,-1;o.match(/^\s$/)||(e=e<<6|r(o.charCodeAt(0)),t+=6)}var d=e>>>t-8&255;return t-=8,d}},r=function(o){if(65<=o&&o<=90)return o-65;if(97<=o&&o<=122)return o-97+26;if(48<=o&&o<=57)return o-48+52;if(o==43)return 62;if(o==47)return 63;throw"c:"+o};return i},G=function(w,p,u){for(var e=function(x,z){var C=x,$=z,A=new Array(x*z),I={setPixel:function(a,f,c){A[f*C+a]=c},write:function(a){a.writeString("GIF87a"),a.writeShort(C),a.writeShort($),a.writeByte(128),a.writeByte(0),a.writeByte(0),a.writeByte(0),a.writeByte(0),a.writeByte(0),a.writeByte(255),a.writeByte(255),a.writeByte(255),a.writeString(","),a.writeShort(0),a.writeShort(0),a.writeShort(C),a.writeShort($),a.writeByte(0);var f=L(2);a.writeByte(2);for(var c=0;f.length-c>255;)a.writeByte(255),a.writeBytes(f,c,255),c+=255;a.writeByte(f.length-c),a.writeBytes(f,c,f.length-c),a.writeByte(0),a.writeString(";")}},L=function(a){for(var f=1<<a,c=1+(1<<a),g=a+1,v=E(),q=0;q<f;q+=1)v.add(String.fromCharCode(q));v.add(String.fromCharCode(f)),v.add(String.fromCharCode(c));var P,B,U,H=$t(),Z=(P=H,B=0,U=0,{write:function(W,M){if(W>>>M)throw"length over";for(;B+M>=8;)P.writeByte(255&(W<<B|U)),M-=8-B,W>>>=8-B,U=0,B=0;U|=W<<B,B+=M},flush:function(){B>0&&P.writeByte(U)}});Z.write(f,g);var st=0,et=String.fromCharCode(A[st]);for(st+=1;st<A.length;){var V=String.fromCharCode(A[st]);st+=1,v.contains(et+V)?et+=V:(Z.write(v.indexOf(et),g),v.size()<4095&&(v.size()==1<<g&&(g+=1),v.add(et+V)),et=V)}return Z.write(v.indexOf(et),g),Z.write(c,g),Z.flush(),H.toByteArray()},E=function(){var a={},f=0,c={add:function(g){if(c.contains(g))throw"dup key:"+g;a[g]=f,f+=1},size:function(){return f},indexOf:function(g){return a[g]},contains:function(g){return a[g]!==void 0}};return c};return I}(w,p),t=0;t<p;t+=1)for(var i=0;i<w;i+=1)e.setPixel(i,t,u(i,t));var r=$t();e.write(r);for(var o=function(){var x=0,z=0,C=0,$="",A={},I=function(E){$+=String.fromCharCode(L(63&E))},L=function(E){if(!(E<0)){if(E<26)return 65+E;if(E<52)return E-26+97;if(E<62)return E-52+48;if(E==62)return 43;if(E==63)return 47}throw"n:"+E};return A.writeByte=function(E){for(x=x<<8|255&E,z+=8,C+=1;z>=6;)I(x>>>z-6),z-=6},A.flush=function(){if(z>0&&(I(x<<6-z),x=0,z=0),C%3!=0)for(var E=3-C%3,a=0;a<E;a+=1)$+="="},A.toString=function(){return $},A}(),d=r.toByteArray(),_=0;_<d.length;_+=1)o.writeByte(d[_]);return o.flush(),"data:image/gif;base64,"+o};return X}();F.stringToBytesFuncs["UTF-8"]=function(X){return function(rt){for(var J=[],N=0;N<rt.length;N++){var T=rt.charCodeAt(N);T<128?J.push(T):T<2048?J.push(192|T>>6,128|63&T):T<55296||T>=57344?J.push(224|T>>12,128|T>>6&63,128|63&T):(N++,T=65536+((1023&T)<<10|1023&rt.charCodeAt(N)),J.push(240|T>>18,128|T>>12&63,128|T>>6&63,128|63&T))}return J}(X)},(Y=typeof(O=function(){return F})=="function"?O.apply(y,[]):O)===void 0||(S.exports=Y)}},h={};function m(S){var y=h[S];if(y!==void 0)return y.exports;var O=h[S]={exports:{}};return l[S](O,O.exports,m),O.exports}m.n=S=>{var y=S&&S.__esModule?()=>S.default:()=>S;return m.d(y,{a:y}),y},m.d=(S,y)=>{for(var O in y)m.o(y,O)&&!m.o(S,O)&&Object.defineProperty(S,O,{enumerable:!0,get:y[O]})},m.o=(S,y)=>Object.prototype.hasOwnProperty.call(S,y);var b={};return(()=>{m.d(b,{default:()=>p});const S=u=>!!u&&typeof u=="object"&&!Array.isArray(u);function y(u,...e){if(!e.length)return u;const t=e.shift();return t!==void 0&&S(u)&&S(t)?(u=Object.assign({},u),Object.keys(t).forEach(i=>{const r=u[i],o=t[i];Array.isArray(r)&&Array.isArray(o)?u[i]=o:S(r)&&S(o)?u[i]=y(Object.assign({},r),o):u[i]=o}),y(u,...e)):u}function O(u,e){const t=document.createElement("a");t.download=e,t.href=u,document.body.appendChild(t),t.click(),document.body.removeChild(t)}const Y={L:.07,M:.15,Q:.25,H:.3};class F{constructor({svg:e,type:t,window:i}){this._svg=e,this._type=t,this._window=i}draw(e,t,i,r){let o;switch(this._type){case"dots":o=this._drawDot;break;case"classy":o=this._drawClassy;break;case"classy-rounded":o=this._drawClassyRounded;break;case"rounded":o=this._drawRounded;break;case"extra-rounded":o=this._drawExtraRounded;break;default:o=this._drawSquare}o.call(this,{x:e,y:t,size:i,getNeighbor:r})}_rotateFigure({x:e,y:t,size:i,rotation:r=0,draw:o}){var d;const _=e+i/2,x=t+i/2;o(),(d=this._element)===null||d===void 0||d.setAttribute("transform",`rotate(${180*r/Math.PI},${_},${x})`)}_basicDot(e){const{size:t,x:i,y:r}=e;this._rotateFigure(Object.assign(Object.assign({},e),{draw:()=>{this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","circle"),this._element.setAttribute("cx",String(i+t/2)),this._element.setAttribute("cy",String(r+t/2)),this._element.setAttribute("r",String(t/2))}}))}_basicSquare(e){const{size:t,x:i,y:r}=e;this._rotateFigure(Object.assign(Object.assign({},e),{draw:()=>{this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","rect"),this._element.setAttribute("x",String(i)),this._element.setAttribute("y",String(r)),this._element.setAttribute("width",String(t)),this._element.setAttribute("height",String(t))}}))}_basicSideRounded(e){const{size:t,x:i,y:r}=e;this._rotateFigure(Object.assign(Object.assign({},e),{draw:()=>{this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","path"),this._element.setAttribute("d",`M ${i} ${r}v ${t}h `+t/2+`a ${t/2} ${t/2}, 0, 0, 0, 0 ${-t}`)}}))}_basicCornerRounded(e){const{size:t,x:i,y:r}=e;this._rotateFigure(Object.assign(Object.assign({},e),{draw:()=>{this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","path"),this._element.setAttribute("d",`M ${i} ${r}v ${t}h ${t}v `+-t/2+`a ${t/2} ${t/2}, 0, 0, 0, ${-t/2} ${-t/2}`)}}))}_basicCornerExtraRounded(e){const{size:t,x:i,y:r}=e;this._rotateFigure(Object.assign(Object.assign({},e),{draw:()=>{this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","path"),this._element.setAttribute("d",`M ${i} ${r}v ${t}h ${t}a ${t} ${t}, 0, 0, 0, ${-t} ${-t}`)}}))}_basicCornersRounded(e){const{size:t,x:i,y:r}=e;this._rotateFigure(Object.assign(Object.assign({},e),{draw:()=>{this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","path"),this._element.setAttribute("d",`M ${i} ${r}v `+t/2+`a ${t/2} ${t/2}, 0, 0, 0, ${t/2} ${t/2}h `+t/2+"v "+-t/2+`a ${t/2} ${t/2}, 0, 0, 0, ${-t/2} ${-t/2}`)}}))}_drawDot({x:e,y:t,size:i}){this._basicDot({x:e,y:t,size:i,rotation:0})}_drawSquare({x:e,y:t,size:i}){this._basicSquare({x:e,y:t,size:i,rotation:0})}_drawRounded({x:e,y:t,size:i,getNeighbor:r}){const o=r?+r(-1,0):0,d=r?+r(1,0):0,_=r?+r(0,-1):0,x=r?+r(0,1):0,z=o+d+_+x;if(z!==0)if(z>2||o&&d||_&&x)this._basicSquare({x:e,y:t,size:i,rotation:0});else{if(z===2){let C=0;return o&&_?C=Math.PI/2:_&&d?C=Math.PI:d&&x&&(C=-Math.PI/2),void this._basicCornerRounded({x:e,y:t,size:i,rotation:C})}if(z===1){let C=0;return _?C=Math.PI/2:d?C=Math.PI:x&&(C=-Math.PI/2),void this._basicSideRounded({x:e,y:t,size:i,rotation:C})}}else this._basicDot({x:e,y:t,size:i,rotation:0})}_drawExtraRounded({x:e,y:t,size:i,getNeighbor:r}){const o=r?+r(-1,0):0,d=r?+r(1,0):0,_=r?+r(0,-1):0,x=r?+r(0,1):0,z=o+d+_+x;if(z!==0)if(z>2||o&&d||_&&x)this._basicSquare({x:e,y:t,size:i,rotation:0});else{if(z===2){let C=0;return o&&_?C=Math.PI/2:_&&d?C=Math.PI:d&&x&&(C=-Math.PI/2),void this._basicCornerExtraRounded({x:e,y:t,size:i,rotation:C})}if(z===1){let C=0;return _?C=Math.PI/2:d?C=Math.PI:x&&(C=-Math.PI/2),void this._basicSideRounded({x:e,y:t,size:i,rotation:C})}}else this._basicDot({x:e,y:t,size:i,rotation:0})}_drawClassy({x:e,y:t,size:i,getNeighbor:r}){const o=r?+r(-1,0):0,d=r?+r(1,0):0,_=r?+r(0,-1):0,x=r?+r(0,1):0;o+d+_+x!==0?o||_?d||x?this._basicSquare({x:e,y:t,size:i,rotation:0}):this._basicCornerRounded({x:e,y:t,size:i,rotation:Math.PI/2}):this._basicCornerRounded({x:e,y:t,size:i,rotation:-Math.PI/2}):this._basicCornersRounded({x:e,y:t,size:i,rotation:Math.PI/2})}_drawClassyRounded({x:e,y:t,size:i,getNeighbor:r}){const o=r?+r(-1,0):0,d=r?+r(1,0):0,_=r?+r(0,-1):0,x=r?+r(0,1):0;o+d+_+x!==0?o||_?d||x?this._basicSquare({x:e,y:t,size:i,rotation:0}):this._basicCornerExtraRounded({x:e,y:t,size:i,rotation:Math.PI/2}):this._basicCornerExtraRounded({x:e,y:t,size:i,rotation:-Math.PI/2}):this._basicCornersRounded({x:e,y:t,size:i,rotation:Math.PI/2})}}const X={dot:"dot",square:"square",extraRounded:"extra-rounded"},rt=Object.values(X);class J{constructor({svg:e,type:t,window:i}){this._svg=e,this._type=t,this._window=i}draw(e,t,i,r){let o;switch(this._type){case X.square:o=this._drawSquare;break;case X.extraRounded:o=this._drawExtraRounded;break;default:o=this._drawDot}o.call(this,{x:e,y:t,size:i,rotation:r})}_rotateFigure({x:e,y:t,size:i,rotation:r=0,draw:o}){var d;const _=e+i/2,x=t+i/2;o(),(d=this._element)===null||d===void 0||d.setAttribute("transform",`rotate(${180*r/Math.PI},${_},${x})`)}_basicDot(e){const{size:t,x:i,y:r}=e,o=t/7;this._rotateFigure(Object.assign(Object.assign({},e),{draw:()=>{this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","path"),this._element.setAttribute("clip-rule","evenodd"),this._element.setAttribute("d",`M ${i+t/2} ${r}a ${t/2} ${t/2} 0 1 0 0.1 0zm 0 ${o}a ${t/2-o} ${t/2-o} 0 1 1 -0.1 0Z`)}}))}_basicSquare(e){const{size:t,x:i,y:r}=e,o=t/7;this._rotateFigure(Object.assign(Object.assign({},e),{draw:()=>{this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","path"),this._element.setAttribute("clip-rule","evenodd"),this._element.setAttribute("d",`M ${i} ${r}v ${t}h ${t}v `+-t+`zM ${i+o} ${r+o}h `+(t-2*o)+"v "+(t-2*o)+"h "+(2*o-t)+"z")}}))}_basicExtraRounded(e){const{size:t,x:i,y:r}=e,o=t/7;this._rotateFigure(Object.assign(Object.assign({},e),{draw:()=>{this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","path"),this._element.setAttribute("clip-rule","evenodd"),this._element.setAttribute("d",`M ${i} ${r+2.5*o}v `+2*o+`a ${2.5*o} ${2.5*o}, 0, 0, 0, ${2.5*o} ${2.5*o}h `+2*o+`a ${2.5*o} ${2.5*o}, 0, 0, 0, ${2.5*o} ${2.5*-o}v `+-2*o+`a ${2.5*o} ${2.5*o}, 0, 0, 0, ${2.5*-o} ${2.5*-o}h `+-2*o+`a ${2.5*o} ${2.5*o}, 0, 0, 0, ${2.5*-o} ${2.5*o}M ${i+2.5*o} ${r+o}h `+2*o+`a ${1.5*o} ${1.5*o}, 0, 0, 1, ${1.5*o} ${1.5*o}v `+2*o+`a ${1.5*o} ${1.5*o}, 0, 0, 1, ${1.5*-o} ${1.5*o}h `+-2*o+`a ${1.5*o} ${1.5*o}, 0, 0, 1, ${1.5*-o} ${1.5*-o}v `+-2*o+`a ${1.5*o} ${1.5*o}, 0, 0, 1, ${1.5*o} ${1.5*-o}`)}}))}_drawDot({x:e,y:t,size:i,rotation:r}){this._basicDot({x:e,y:t,size:i,rotation:r})}_drawSquare({x:e,y:t,size:i,rotation:r}){this._basicSquare({x:e,y:t,size:i,rotation:r})}_drawExtraRounded({x:e,y:t,size:i,rotation:r}){this._basicExtraRounded({x:e,y:t,size:i,rotation:r})}}const N={dot:"dot",square:"square"},T=Object.values(N);class Q{constructor({svg:e,type:t,window:i}){this._svg=e,this._type=t,this._window=i}draw(e,t,i,r){let o;o=this._type===N.square?this._drawSquare:this._drawDot,o.call(this,{x:e,y:t,size:i,rotation:r})}_rotateFigure({x:e,y:t,size:i,rotation:r=0,draw:o}){var d;const _=e+i/2,x=t+i/2;o(),(d=this._element)===null||d===void 0||d.setAttribute("transform",`rotate(${180*r/Math.PI},${_},${x})`)}_basicDot(e){const{size:t,x:i,y:r}=e;this._rotateFigure(Object.assign(Object.assign({},e),{draw:()=>{this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","circle"),this._element.setAttribute("cx",String(i+t/2)),this._element.setAttribute("cy",String(r+t/2)),this._element.setAttribute("r",String(t/2))}}))}_basicSquare(e){const{size:t,x:i,y:r}=e;this._rotateFigure(Object.assign(Object.assign({},e),{draw:()=>{this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","rect"),this._element.setAttribute("x",String(i)),this._element.setAttribute("y",String(r)),this._element.setAttribute("width",String(t)),this._element.setAttribute("height",String(t))}}))}_drawDot({x:e,y:t,size:i,rotation:r}){this._basicDot({x:e,y:t,size:i,rotation:r})}_drawSquare({x:e,y:t,size:i,rotation:r}){this._basicSquare({x:e,y:t,size:i,rotation:r})}}const k="circle",R=[[1,1,1,1,1,1,1],[1,0,0,0,0,0,1],[1,0,0,0,0,0,1],[1,0,0,0,0,0,1],[1,0,0,0,0,0,1],[1,0,0,0,0,0,1],[1,1,1,1,1,1,1]],j=[[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,1,1,1,0,0],[0,0,1,1,1,0,0],[0,0,1,1,1,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0]];class K{constructor(e,t){this._roundSize=i=>this._options.dotsOptions.roundSize?Math.floor(i):i,this._window=t,this._element=this._window.document.createElementNS("http://www.w3.org/2000/svg","svg"),this._element.setAttribute("width",String(e.width)),this._element.setAttribute("height",String(e.height)),this._element.setAttribute("xmlns:xlink","http://www.w3.org/1999/xlink"),e.dotsOptions.roundSize||this._element.setAttribute("shape-rendering","crispEdges"),this._element.setAttribute("viewBox",`0 0 ${e.width} ${e.height}`),this._defs=this._window.document.createElementNS("http://www.w3.org/2000/svg","defs"),this._element.appendChild(this._defs),this._imageUri=e.image,this._instanceId=K.instanceCount++,this._options=e}get width(){return this._options.width}get height(){return this._options.height}getElement(){return this._element}async drawQR(e){const t=e.getModuleCount(),i=Math.min(this._options.width,this._options.height)-2*this._options.margin,r=this._options.shape===k?i/Math.sqrt(2):i,o=this._roundSize(r/t);let d={hideXDots:0,hideYDots:0,width:0,height:0};if(this._qr=e,this._options.image){if(await this.loadImage(),!this._image)return;const{imageOptions:_,qrOptions:x}=this._options,z=_.imageSize*Y[x.errorCorrectionLevel],C=Math.floor(z*t*t);d=function({originalHeight:$,originalWidth:A,maxHiddenDots:I,maxHiddenAxisDots:L,dotSize:E}){const a={x:0,y:0},f={x:0,y:0};if($<=0||A<=0||I<=0||E<=0)return{height:0,width:0,hideYDots:0,hideXDots:0};const c=$/A;return a.x=Math.floor(Math.sqrt(I/c)),a.x<=0&&(a.x=1),L&&L<a.x&&(a.x=L),a.x%2==0&&a.x--,f.x=a.x*E,a.y=1+2*Math.ceil((a.x*c-1)/2),f.y=Math.round(f.x*c),(a.y*a.x>I||L&&L<a.y)&&(L&&L<a.y?(a.y=L,a.y%2==0&&a.x--):a.y-=2,f.y=a.y*E,a.x=1+2*Math.ceil((a.y/c-1)/2),f.x=Math.round(f.y/c)),{height:f.y,width:f.x,hideYDots:a.y,hideXDots:a.x}}({originalWidth:this._image.width,originalHeight:this._image.height,maxHiddenDots:C,maxHiddenAxisDots:t-14,dotSize:o})}this.drawBackground(),this.drawDots((_,x)=>{var z,C,$,A,I,L;return!(this._options.imageOptions.hideBackgroundDots&&_>=(t-d.hideYDots)/2&&_<(t+d.hideYDots)/2&&x>=(t-d.hideXDots)/2&&x<(t+d.hideXDots)/2||!((z=R[_])===null||z===void 0)&&z[x]||!((C=R[_-t+7])===null||C===void 0)&&C[x]||!(($=R[_])===null||$===void 0)&&$[x-t+7]||!((A=j[_])===null||A===void 0)&&A[x]||!((I=j[_-t+7])===null||I===void 0)&&I[x]||!((L=j[_])===null||L===void 0)&&L[x-t+7])}),this.drawCorners(),this._options.image&&await this.drawImage({width:d.width,height:d.height,count:t,dotSize:o})}drawBackground(){var e,t,i;const r=this._element,o=this._options;if(r){const d=(e=o.backgroundOptions)===null||e===void 0?void 0:e.gradient,_=(t=o.backgroundOptions)===null||t===void 0?void 0:t.color;let x=o.height,z=o.width;if(d||_){const C=this._window.document.createElementNS("http://www.w3.org/2000/svg","rect");this._backgroundClipPath=this._window.document.createElementNS("http://www.w3.org/2000/svg","clipPath"),this._backgroundClipPath.setAttribute("id",`clip-path-background-color-${this._instanceId}`),this._defs.appendChild(this._backgroundClipPath),!((i=o.backgroundOptions)===null||i===void 0)&&i.round&&(x=z=Math.min(o.width,o.height),C.setAttribute("rx",String(x/2*o.backgroundOptions.round))),C.setAttribute("x",String(this._roundSize((o.width-z)/2))),C.setAttribute("y",String(this._roundSize((o.height-x)/2))),C.setAttribute("width",String(z)),C.setAttribute("height",String(x)),this._backgroundClipPath.appendChild(C),this._createColor({options:d,color:_,additionalRotation:0,x:0,y:0,height:o.height,width:o.width,name:`background-color-${this._instanceId}`})}}}drawDots(e){var t,i;if(!this._qr)throw"QR code is not defined";const r=this._options,o=this._qr.getModuleCount();if(o>r.width||o>r.height)throw"The canvas is too small.";const d=Math.min(r.width,r.height)-2*r.margin,_=r.shape===k?d/Math.sqrt(2):d,x=this._roundSize(_/o),z=this._roundSize((r.width-o*x)/2),C=this._roundSize((r.height-o*x)/2),$=new F({svg:this._element,type:r.dotsOptions.type,window:this._window});this._dotsClipPath=this._window.document.createElementNS("http://www.w3.org/2000/svg","clipPath"),this._dotsClipPath.setAttribute("id",`clip-path-dot-color-${this._instanceId}`),this._defs.appendChild(this._dotsClipPath),this._createColor({options:(t=r.dotsOptions)===null||t===void 0?void 0:t.gradient,color:r.dotsOptions.color,additionalRotation:0,x:0,y:0,height:r.height,width:r.width,name:`dot-color-${this._instanceId}`});for(let A=0;A<o;A++)for(let I=0;I<o;I++)e&&!e(A,I)||!((i=this._qr)===null||i===void 0)&&i.isDark(A,I)&&($.draw(z+I*x,C+A*x,x,(L,E)=>!(I+L<0||A+E<0||I+L>=o||A+E>=o)&&!(e&&!e(A+E,I+L))&&!!this._qr&&this._qr.isDark(A+E,I+L)),$._element&&this._dotsClipPath&&this._dotsClipPath.appendChild($._element));if(r.shape===k){const A=this._roundSize((d/x-o)/2),I=o+2*A,L=z-A*x,E=C-A*x,a=[],f=this._roundSize(I/2);for(let c=0;c<I;c++){a[c]=[];for(let g=0;g<I;g++)c>=A-1&&c<=I-A&&g>=A-1&&g<=I-A||Math.sqrt((c-f)*(c-f)+(g-f)*(g-f))>f?a[c][g]=0:a[c][g]=this._qr.isDark(g-2*A<0?g:g>=o?g-2*A:g-A,c-2*A<0?c:c>=o?c-2*A:c-A)?1:0}for(let c=0;c<I;c++)for(let g=0;g<I;g++)a[c][g]&&($.draw(L+g*x,E+c*x,x,(v,q)=>{var P;return!!(!((P=a[c+q])===null||P===void 0)&&P[g+v])}),$._element&&this._dotsClipPath&&this._dotsClipPath.appendChild($._element))}}drawCorners(){if(!this._qr)throw"QR code is not defined";const e=this._element,t=this._options;if(!e)throw"Element code is not defined";const i=this._qr.getModuleCount(),r=Math.min(t.width,t.height)-2*t.margin,o=t.shape===k?r/Math.sqrt(2):r,d=this._roundSize(o/i),_=7*d,x=3*d,z=this._roundSize((t.width-i*d)/2),C=this._roundSize((t.height-i*d)/2);[[0,0,0],[1,0,Math.PI/2],[0,1,-Math.PI/2]].forEach(([$,A,I])=>{var L,E,a,f,c,g,v,q,P,B,U,H,Z,st;const et=z+$*d*(i-7),V=C+A*d*(i-7);let W=this._dotsClipPath,M=this._dotsClipPath;if((!((L=t.cornersSquareOptions)===null||L===void 0)&&L.gradient||!((E=t.cornersSquareOptions)===null||E===void 0)&&E.color)&&(W=this._window.document.createElementNS("http://www.w3.org/2000/svg","clipPath"),W.setAttribute("id",`clip-path-corners-square-color-${$}-${A}-${this._instanceId}`),this._defs.appendChild(W),this._cornersSquareClipPath=this._cornersDotClipPath=M=W,this._createColor({options:(a=t.cornersSquareOptions)===null||a===void 0?void 0:a.gradient,color:(f=t.cornersSquareOptions)===null||f===void 0?void 0:f.color,additionalRotation:I,x:et,y:V,height:_,width:_,name:`corners-square-color-${$}-${A}-${this._instanceId}`})),((c=t.cornersSquareOptions)===null||c===void 0?void 0:c.type)&&rt.includes(t.cornersSquareOptions.type)){const tt=new J({svg:this._element,type:t.cornersSquareOptions.type,window:this._window});tt.draw(et,V,_,I),tt._element&&W&&W.appendChild(tt._element)}else{const tt=new F({svg:this._element,type:((g=t.cornersSquareOptions)===null||g===void 0?void 0:g.type)||t.dotsOptions.type,window:this._window});for(let it=0;it<R.length;it++)for(let D=0;D<R[it].length;D++)!((v=R[it])===null||v===void 0)&&v[D]&&(tt.draw(et+D*d,V+it*d,d,(ut,dt)=>{var lt;return!!(!((lt=R[it+dt])===null||lt===void 0)&&lt[D+ut])}),tt._element&&W&&W.appendChild(tt._element))}if((!((q=t.cornersDotOptions)===null||q===void 0)&&q.gradient||!((P=t.cornersDotOptions)===null||P===void 0)&&P.color)&&(M=this._window.document.createElementNS("http://www.w3.org/2000/svg","clipPath"),M.setAttribute("id",`clip-path-corners-dot-color-${$}-${A}-${this._instanceId}`),this._defs.appendChild(M),this._cornersDotClipPath=M,this._createColor({options:(B=t.cornersDotOptions)===null||B===void 0?void 0:B.gradient,color:(U=t.cornersDotOptions)===null||U===void 0?void 0:U.color,additionalRotation:I,x:et+2*d,y:V+2*d,height:x,width:x,name:`corners-dot-color-${$}-${A}-${this._instanceId}`})),((H=t.cornersDotOptions)===null||H===void 0?void 0:H.type)&&T.includes(t.cornersDotOptions.type)){const tt=new Q({svg:this._element,type:t.cornersDotOptions.type,window:this._window});tt.draw(et+2*d,V+2*d,x,I),tt._element&&M&&M.appendChild(tt._element)}else{const tt=new F({svg:this._element,type:((Z=t.cornersDotOptions)===null||Z===void 0?void 0:Z.type)||t.dotsOptions.type,window:this._window});for(let it=0;it<j.length;it++)for(let D=0;D<j[it].length;D++)!((st=j[it])===null||st===void 0)&&st[D]&&(tt.draw(et+D*d,V+it*d,d,(ut,dt)=>{var lt;return!!(!((lt=j[it+dt])===null||lt===void 0)&&lt[D+ut])}),tt._element&&M&&M.appendChild(tt._element))}})}loadImage(){return new Promise((e,t)=>{var i;const r=this._options;if(!r.image)return t("Image is not defined");if(!((i=r.nodeCanvas)===null||i===void 0)&&i.loadImage)r.nodeCanvas.loadImage(r.image).then(o=>{var d,_;if(this._image=o,this._options.imageOptions.saveAsBlob){const x=(d=r.nodeCanvas)===null||d===void 0?void 0:d.createCanvas(this._image.width,this._image.height);(_=x==null?void 0:x.getContext("2d"))===null||_===void 0||_.drawImage(o,0,0),this._imageUri=x==null?void 0:x.toDataURL()}e()}).catch(t);else{const o=new this._window.Image;typeof r.imageOptions.crossOrigin=="string"&&(o.crossOrigin=r.imageOptions.crossOrigin),this._image=o,o.onload=async()=>{this._options.imageOptions.saveAsBlob&&(this._imageUri=await async function(d,_){return new Promise(x=>{const z=new _.XMLHttpRequest;z.onload=function(){const C=new _.FileReader;C.onloadend=function(){x(C.result)},C.readAsDataURL(z.response)},z.open("GET",d),z.responseType="blob",z.send()})}(r.image||"",this._window)),e()},o.src=r.image}})}async drawImage({width:e,height:t,count:i,dotSize:r}){const o=this._options,d=this._roundSize((o.width-i*r)/2),_=this._roundSize((o.height-i*r)/2),x=d+this._roundSize(o.imageOptions.margin+(i*r-e)/2),z=_+this._roundSize(o.imageOptions.margin+(i*r-t)/2),C=e-2*o.imageOptions.margin,$=t-2*o.imageOptions.margin,A=this._window.document.createElementNS("http://www.w3.org/2000/svg","image");A.setAttribute("href",this._imageUri||""),A.setAttribute("xlink:href",this._imageUri||""),A.setAttribute("x",String(x)),A.setAttribute("y",String(z)),A.setAttribute("width",`${C}px`),A.setAttribute("height",`${$}px`),this._element.appendChild(A)}_createColor({options:e,color:t,additionalRotation:i,x:r,y:o,height:d,width:_,name:x}){const z=_>d?_:d,C=this._window.document.createElementNS("http://www.w3.org/2000/svg","rect");if(C.setAttribute("x",String(r)),C.setAttribute("y",String(o)),C.setAttribute("height",String(d)),C.setAttribute("width",String(_)),C.setAttribute("clip-path",`url('#clip-path-${x}')`),e){let $;if(e.type==="radial")$=this._window.document.createElementNS("http://www.w3.org/2000/svg","radialGradient"),$.setAttribute("id",x),$.setAttribute("gradientUnits","userSpaceOnUse"),$.setAttribute("fx",String(r+_/2)),$.setAttribute("fy",String(o+d/2)),$.setAttribute("cx",String(r+_/2)),$.setAttribute("cy",String(o+d/2)),$.setAttribute("r",String(z/2));else{const A=((e.rotation||0)+i)%(2*Math.PI),I=(A+2*Math.PI)%(2*Math.PI);let L=r+_/2,E=o+d/2,a=r+_/2,f=o+d/2;I>=0&&I<=.25*Math.PI||I>1.75*Math.PI&&I<=2*Math.PI?(L-=_/2,E-=d/2*Math.tan(A),a+=_/2,f+=d/2*Math.tan(A)):I>.25*Math.PI&&I<=.75*Math.PI?(E-=d/2,L-=_/2/Math.tan(A),f+=d/2,a+=_/2/Math.tan(A)):I>.75*Math.PI&&I<=1.25*Math.PI?(L+=_/2,E+=d/2*Math.tan(A),a-=_/2,f-=d/2*Math.tan(A)):I>1.25*Math.PI&&I<=1.75*Math.PI&&(E+=d/2,L+=_/2/Math.tan(A),f-=d/2,a-=_/2/Math.tan(A)),$=this._window.document.createElementNS("http://www.w3.org/2000/svg","linearGradient"),$.setAttribute("id",x),$.setAttribute("gradientUnits","userSpaceOnUse"),$.setAttribute("x1",String(Math.round(L))),$.setAttribute("y1",String(Math.round(E))),$.setAttribute("x2",String(Math.round(a))),$.setAttribute("y2",String(Math.round(f)))}e.colorStops.forEach(({offset:A,color:I})=>{const L=this._window.document.createElementNS("http://www.w3.org/2000/svg","stop");L.setAttribute("offset",100*A+"%"),L.setAttribute("stop-color",I),$.appendChild(L)}),C.setAttribute("fill",`url('#${x}')`),this._defs.appendChild($)}else t&&C.setAttribute("fill",t);this._element.appendChild(C)}}K.instanceCount=0;const ct=K,ft="canvas",yt={};for(let u=0;u<=40;u++)yt[u]=u;const mt={type:ft,shape:"square",width:300,height:300,data:"",margin:0,qrOptions:{typeNumber:yt[0],mode:void 0,errorCorrectionLevel:"Q"},imageOptions:{saveAsBlob:!0,hideBackgroundDots:!0,imageSize:.4,crossOrigin:void 0,margin:0},dotsOptions:{type:"square",color:"#000",roundSize:!0},backgroundOptions:{round:0,color:"#fff"}};function bt(u){const e=Object.assign({},u);if(!e.colorStops||!e.colorStops.length)throw"Field 'colorStops' is required in gradient";return e.rotation?e.rotation=Number(e.rotation):e.rotation=0,e.colorStops=e.colorStops.map(t=>Object.assign(Object.assign({},t),{offset:Number(t.offset)})),e}function zt(u){const e=Object.assign({},u);return e.width=Number(e.width),e.height=Number(e.height),e.margin=Number(e.margin),e.imageOptions=Object.assign(Object.assign({},e.imageOptions),{hideBackgroundDots:!!e.imageOptions.hideBackgroundDots,imageSize:Number(e.imageOptions.imageSize),margin:Number(e.imageOptions.margin)}),e.margin>Math.min(e.width,e.height)&&(e.margin=Math.min(e.width,e.height)),e.dotsOptions=Object.assign({},e.dotsOptions),e.dotsOptions.gradient&&(e.dotsOptions.gradient=bt(e.dotsOptions.gradient)),e.cornersSquareOptions&&(e.cornersSquareOptions=Object.assign({},e.cornersSquareOptions),e.cornersSquareOptions.gradient&&(e.cornersSquareOptions.gradient=bt(e.cornersSquareOptions.gradient))),e.cornersDotOptions&&(e.cornersDotOptions=Object.assign({},e.cornersDotOptions),e.cornersDotOptions.gradient&&(e.cornersDotOptions.gradient=bt(e.cornersDotOptions.gradient))),e.backgroundOptions&&(e.backgroundOptions=Object.assign({},e.backgroundOptions),e.backgroundOptions.gradient&&(e.backgroundOptions.gradient=bt(e.backgroundOptions.gradient))),e}var $t=m(873),Pt=m.n($t);function G(u){if(!u)throw new Error("Extension must be defined");u[0]==="."&&(u=u.substring(1));const e={bmp:"image/bmp",gif:"image/gif",ico:"image/vnd.microsoft.icon",jpeg:"image/jpeg",jpg:"image/jpeg",png:"image/png",svg:"image/svg+xml",tif:"image/tiff",tiff:"image/tiff",webp:"image/webp",pdf:"application/pdf"}[u.toLowerCase()];if(!e)throw new Error(`Extension "${u}" is not supported`);return e}class w{constructor(e){e!=null&&e.jsdom?this._window=new e.jsdom("",{resources:"usable"}).window:this._window=window,this._options=e?zt(y(mt,e)):mt,this.update()}static _clearContainer(e){e&&(e.innerHTML="")}_setupSvg(){if(!this._qr)return;const e=new ct(this._options,this._window);this._svg=e.getElement(),this._svgDrawingPromise=e.drawQR(this._qr).then(()=>{var t;this._svg&&((t=this._extension)===null||t===void 0||t.call(this,e.getElement(),this._options))})}_setupCanvas(){var e,t;this._qr&&(!((e=this._options.nodeCanvas)===null||e===void 0)&&e.createCanvas?(this._nodeCanvas=this._options.nodeCanvas.createCanvas(this._options.width,this._options.height),this._nodeCanvas.width=this._options.width,this._nodeCanvas.height=this._options.height):(this._domCanvas=document.createElement("canvas"),this._domCanvas.width=this._options.width,this._domCanvas.height=this._options.height),this._setupSvg(),this._canvasDrawingPromise=(t=this._svgDrawingPromise)===null||t===void 0?void 0:t.then(()=>{var i;if(!this._svg)return;const r=this._svg,o=new this._window.XMLSerializer().serializeToString(r),d=btoa(o),_=`data:${G("svg")};base64,${d}`;if(!((i=this._options.nodeCanvas)===null||i===void 0)&&i.loadImage)return this._options.nodeCanvas.loadImage(_).then(x=>{var z,C;x.width=this._options.width,x.height=this._options.height,(C=(z=this._nodeCanvas)===null||z===void 0?void 0:z.getContext("2d"))===null||C===void 0||C.drawImage(x,0,0)});{const x=new this._window.Image;return new Promise(z=>{x.onload=()=>{var C,$;($=(C=this._domCanvas)===null||C===void 0?void 0:C.getContext("2d"))===null||$===void 0||$.drawImage(x,0,0),z()},x.src=_})}}))}async _getElement(e="png"){if(!this._qr)throw"QR code is empty";return e.toLowerCase()==="svg"?(this._svg&&this._svgDrawingPromise||this._setupSvg(),await this._svgDrawingPromise,this._svg):((this._domCanvas||this._nodeCanvas)&&this._canvasDrawingPromise||this._setupCanvas(),await this._canvasDrawingPromise,this._domCanvas||this._nodeCanvas)}update(e){w._clearContainer(this._container),this._options=e?zt(y(this._options,e)):this._options,this._options.data&&(this._qr=Pt()(this._options.qrOptions.typeNumber,this._options.qrOptions.errorCorrectionLevel),this._qr.addData(this._options.data,this._options.qrOptions.mode||function(t){switch(!0){case/^[0-9]*$/.test(t):return"Numeric";case/^[0-9A-Z $%*+\-./:]*$/.test(t):return"Alphanumeric";default:return"Byte"}}(this._options.data)),this._qr.make(),this._options.type===ft?this._setupCanvas():this._setupSvg(),this.append(this._container))}append(e){if(e){if(typeof e.appendChild!="function")throw"Container should be a single DOM node";this._options.type===ft?this._domCanvas&&e.appendChild(this._domCanvas):this._svg&&e.appendChild(this._svg),this._container=e}}applyExtension(e){if(!e)throw"Extension function should be defined.";this._extension=e,this.update()}deleteExtension(){this._extension=void 0,this.update()}async getRawData(e="png"){if(!this._qr)throw"QR code is empty";const t=await this._getElement(e),i=G(e);if(!t)return null;if(e.toLowerCase()==="svg"){const r=`<?xml version="1.0" standalone="no"?>\r
${new this._window.XMLSerializer().serializeToString(t)}`;return typeof Blob>"u"||this._options.jsdom?Buffer.from(r):new Blob([r],{type:i})}return new Promise(r=>{const o=t;if("toBuffer"in o)if(i==="image/png")r(o.toBuffer(i));else if(i==="image/jpeg")r(o.toBuffer(i));else{if(i!=="application/pdf")throw Error("Unsupported extension");r(o.toBuffer(i))}else"toBlob"in o&&o.toBlob(r,i,1)})}async download(e){if(!this._qr)throw"QR code is empty";if(typeof Blob>"u")throw"Cannot download in Node.js, call getRawData instead.";let t="png",i="qr";typeof e=="string"?(t=e,console.warn("Extension is deprecated as argument for 'download' method, please pass object { name: '...', extension: '...' } as argument")):typeof e=="object"&&e!==null&&(e.name&&(i=e.name),e.extension&&(t=e.extension));const r=await this._getElement(t);if(r)if(t.toLowerCase()==="svg"){let o=new XMLSerializer().serializeToString(r);o=`<?xml version="1.0" standalone="no"?>\r
`+o,O(`data:${G(t)};charset=utf-8,${encodeURIComponent(o)}`,`${i}.svg`)}else O(r.toDataURL(G(t)),`${i}.${t}`)}}const p=w})(),b.default})())}(Ft)),Ft.exports}var Ce=Se();const Ae=xe(Ce);var ke=_t('<div class=test-mode-badge tabindex=0><svg width=16 height=16 viewBox="0 0 20 20"fill=none xmlns=http://www.w3.org/2000/svg><circle cx=10 cy=10 r=9 stroke=#b45309 stroke-width=2 fill=#fef3c7></circle><text x=10 y=15 text-anchor=middle font-size=12 fill=#b45309 font-family=Arial font-weight=bold>i</text></svg><span class=test-mode-badge-text>Test Mode</span><div class=test-mode-tooltip>Test Mode: No real money will be moved.'),ze=_t("<div class=qr-code-container id=qrcode-container>"),$e=_t("<div class=zenobia-error>"),qe=_t('<div class="zenobia-qr-popup-overlay visible"><div class=zenobia-qr-popup-content><button class=zenobia-qr-close><svg viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2><path d="M18 6L6 18M6 6l12 12"></path></svg></button><div class=modal-header><div class=header-content><h3>Pay by bank with Zenobia</h3><p class=subtitle>Scan to complete your purchase</p></div></div><div class=modal-body><div class=payment-amount>$</div><div class=savings-badge></div><div class=payment-status><div class=spinner></div><div class=payment-instructions>'),Oe=_t("<div class=qr-code-container><div class=zenobia-qr-placeholder>");const Ie=n=>{const[s,l]=pt(null),h={current:null},[m,b]=pt(kt.PENDING),[S,y]=pt(null),[O,Y]=pt(!1),[F,X]=pt(null);Zt(()=>{if(n.transferRequestId&&!F()){const k=new ie;X(k),k.listenToTransfer(n.transferRequestId,n.signature||"",rt,J,N)}}),Zt(()=>{if(n.transferRequestId){const k=n.transferRequestId.replace(/-/g,""),j=`https://zenobiapay.com/clip?id=${btoa(k).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}`,ct=n.qrCodeSize||220,ft=new Ae({width:ct,height:ct,type:"svg",data:j,image:void 0,dotsOptions:{color:"#000000",type:"dots"},backgroundOptions:{color:"#ffffff"},cornersSquareOptions:{type:"extra-rounded"},cornersDotOptions:{type:"dot"},qrOptions:{errorCorrectionLevel:"M"}});l(ft),h.current&&(h.current.innerHTML="",ft.append(h.current))}});const rt=k=>{console.log("Received status update:",k);let R;switch(k.status){case"COMPLETED":case"IN_FLIGHT":R=kt.COMPLETED,n.onSuccess&&n.onSuccess(k);const j=F();j&&(j.disconnect(),X(null));break;case"FAILED":R=kt.FAILED;const K=F();K&&(K.disconnect(),X(null));break;case"CANCELLED":R=kt.CANCELLED;const ct=F();ct&&(ct.disconnect(),X(null));break;default:R=kt.PENDING}b(R),n.onStatusChange&&n.onStatusChange(R)},J=k=>{console.error("WebSocket error:",k),y(k)},N=k=>{console.log("WebSocket connection status:",k?"Connected":"Disconnected"),Y(k)};de(()=>{const k=F();k&&k.disconnect()});const T=()=>n.discountAmount!==void 0?n.discountAmount:Math.round(n.amount/100),Q=()=>{const k=T();return k<1e3?`✨ ${(k/n.amount*100).toFixed(0)}% cashback applied!`:`✨ Applied $${(k/100).toFixed(2)} cashback!`};return xt(Et,{get when(){return n.isOpen},get children(){var k=qe(),R=k.firstChild,j=R.firstChild,K=j.nextSibling,ct=K.firstChild,ft=ct.firstChild;ft.nextSibling;var yt=K.nextSibling,mt=yt.firstChild;mt.firstChild;var bt=mt.nextSibling,zt=bt.nextSibling,$t=zt.firstChild,Pt=$t.nextSibling;return be(j,"click",n.onClose),ht(ct,xt(Et,{get when(){return n.isTest},get children(){return ke()}}),null),ht(yt,xt(Et,{get when(){return s()&&n.transferRequestId},get fallback(){return(()=>{var G=Oe(),w=G.firstChild;return G.style.setProperty("display","flex"),G.style.setProperty("justify-content","center"),G.style.setProperty("align-items","center"),St(p=>{var u=n.qrCodeSize?`${n.qrCodeSize}px`:"220px",e=n.qrCodeSize?`${n.qrCodeSize}px`:"220px",t=n.qrCodeSize?`${n.qrCodeSize}px`:"220px",i=n.qrCodeSize?`${n.qrCodeSize}px`:"220px";return u!==p.e&&((p.e=u)!=null?G.style.setProperty("width",u):G.style.removeProperty("width")),e!==p.t&&((p.t=e)!=null?G.style.setProperty("height",e):G.style.removeProperty("height")),t!==p.a&&((p.a=t)!=null?w.style.setProperty("width",t):w.style.removeProperty("width")),i!==p.o&&((p.o=i)!=null?w.style.setProperty("height",i):w.style.removeProperty("height")),p},{e:void 0,t:void 0,a:void 0,o:void 0}),G})()},get children(){var G=ze();return ve(w=>{h.current=w;const p=s();p&&w&&(w.innerHTML="",p.append(w))},G),G.style.setProperty("display","flex"),G.style.setProperty("justify-content","center"),G.style.setProperty("align-items","center"),St(w=>{var p=n.qrCodeSize?`${n.qrCodeSize}px`:"220px",u=n.qrCodeSize?`${n.qrCodeSize}px`:"220px";return p!==w.e&&((w.e=p)!=null?G.style.setProperty("width",p):G.style.removeProperty("width")),u!==w.t&&((w.t=u)!=null?G.style.setProperty("height",u):G.style.removeProperty("height")),w},{e:void 0,t:void 0}),G}}),mt),ht(mt,()=>(n.amount/100).toFixed(2),null),ht(bt,Q),ht(Pt,()=>n.transferRequestId?"Waiting for payment":"Preparing payment..."),ht(yt,xt(Et,{get when(){return S()},get children(){var G=$e();return ht(G,S),G}}),null),k}})};ne(["click"]);const Me=`
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
`;var Ee=_t("<div class=zenobia-payment-container><style></style><button class=zenobia-payment-button>"),Pe=_t("<div class=button-text-container><div class=initial-text></div><div class=hover-text>"),kt=(n=>(n.PENDING="PENDING",n.IN_FLIGHT="IN_FLIGHT",n.COMPLETED="COMPLETED",n.FAILED="FAILED",n.CANCELLED="CANCELLED",n))(kt||{}),se=(n=>(n.ABOVE="ABOVE",n.BELOW="BELOW",n.POPUP="POPUP",n))(se||{});const De=()=>{if(typeof window>"u")return!1;const n=window.navigator.userAgent.toLowerCase();return/iphone|ipad|ipod/.test(n)||n.includes("mac")&&"ontouchend"in document},Be=n=>{const[s,l]=pt(!1),[h,m]=pt("INITIAL"),[b,S]=pt(!1),[y,O]=pt(null),[Y,F]=pt(null),X=()=>{const N=n.discountAmount||0;return N==0?n.buttonText:N<1e3?`Get ${(N/n.amount*100).toFixed(0)}% cashback`:`Get $${(N/100).toFixed(2)} cashback`},rt=async()=>{if(!s()){l(!0),F(null);try{m("QR_EXPANDING"),setTimeout(()=>{m("QR_VISIBLE")},300);const N=new ie,T=n.metadata||{amount:n.amount,statementItems:{name:"Payment",amount:n.amount}},Q=await N.createTransfer(n.url,T);O({transferRequestId:Q.transferRequestId,merchantId:Q.merchantId,expiry:Q.expiry,signature:Q.signature}),l(!1)}catch(N){l(!1),m("INITIAL"),F(N instanceof Error?N.message:"An error occurred"),n.onError&&N instanceof Error&&n.onError(N)}}},J=()=>{S(!0),m("INITIAL"),setTimeout(()=>{O(null),setTimeout(()=>{S(!1)},300)},50)};return(()=>{var N=Ee(),T=N.firstChild,Q=T.nextSibling;return ht(T,Me),Q.$$click=rt,Q.style.setProperty("background-color","black"),ht(Q,(()=>{var k=qt(()=>h()!=="INITIAL"&&!b());return()=>k()?n.buttonText||`Pay ${(n.amount/100).toFixed(2)}`:(()=>{var R=Pe(),j=R.firstChild,K=j.nextSibling;return ht(j,X),ht(K,()=>n.buttonText||"Pay with Zenobia"),R})()})()),ht(N,xt(Et,{get when(){return qt(()=>!De())()&&(h()==="QR_EXPANDING"||h()==="QR_VISIBLE")},get children(){return xt(Ie,{get isOpen(){return h()==="QR_VISIBLE"},onClose:J,get transferRequestId(){var k;return(k=y())==null?void 0:k.transferRequestId},get signature(){var k;return(k=y())==null?void 0:k.signature},get amount(){return n.amount},get discountAmount(){return n.discountAmount},get qrCodeSize(){return n.qrCodeSize},get url(){return n.url},onSuccess:k=>{n.onSuccess&&y()&&n.onSuccess(y(),k)},get onError(){return n.onError},get onStatusChange(){return n.onStatusChange}})}}),null),St(k=>{var R=h()!=="INITIAL",j=!!b(),K=h()!=="INITIAL";return R!==k.e&&Q.classList.toggle("modal-open",k.e=R),j!==k.t&&Q.classList.toggle("closing",k.t=j),K!==k.a&&(Q.disabled=k.a=K),k},{e:void 0,t:void 0,a:void 0}),N})()};ne(["click"]);function Le(){return new Promise((n,s)=>{const l=document.createElement("script");l.src="https://checkout-sdk.bigcommerce.com/v1/loader.js",l.onload=async()=>{try{const h=await window.checkoutKitLoader.load("checkout-sdk");n(h)}catch(h){s(h)}},l.onerror=s,document.body.appendChild(l)})}function Te(){return new Promise(n=>{const s=new MutationObserver(l=>{for(const h of l){const m=h.target;if(m.classList.contains("checkout-step--payment")&&m.querySelector(".checkout-view-content")){s.disconnect(),n();return}}});s.observe(document.body,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["class"]})})}async function ae(n){var s,l;try{await Te();const m=(await Le()).createCheckoutService();await m.loadCheckout();const b=m.getState().data.getCheckout();console.log("checkoutId:",b==null?void 0:b.id),console.log("email:",(s=b==null?void 0:b.billingAddress)==null?void 0:s.email),console.log("items:",b);const S=document.querySelector(".form-checklist.optimizedCheckout-form-checklist");if(S){const O=document.createElement("li");O.className="form-checklist-item optimizedCheckout-form-checklist-item",O.innerHTML=`
        <div class="form-checklist-header">
          <div class="form-field">
            <input id="radio-zenobiapay" type="radio" class="form-checklist-checkbox optimizedCheckout-form-checklist-checkbox" name="paymentProviderRadio" value="zenobiapay">
            <label for="radio-zenobiapay" class="form-label optimizedCheckout-form-label">
              <div class="paymentProviderHeader-container">
                <div class="paymentProviderHeader-nameContainer" data-test="payment-method-zenobiapay">
                  <div aria-level="6" class="paymentProviderHeader-name" data-test="payment-method-name" role="heading">Pay with your phone with Zenobia Pay</div>
                </div>
              </div>
            </label>
          </div>
        </div>
      `,S.appendChild(O),S.querySelectorAll('input[name="paymentProviderRadio"]').forEach(F=>{F.addEventListener("change",X=>{var N;const rt=X.target,J=document.querySelector(".form-actions");if(J)if(rt.value==="zenobiapay"){if(J.querySelectorAll("*:not(.zenobia-pay-button-container)").forEach(k=>{k.style.display="none"}),!J.querySelector(".zenobia-pay-button-container")){const k=document.createElement("div");k.className="zenobia-pay-button-container",J.insertBefore(k,J.firstChild);const R={...n.metadata,checkoutId:b==null?void 0:b.id,customerEmail:(N=b==null?void 0:b.billingAddress)==null?void 0:N.email};me(()=>xt(Be,{get url(){return n.url},get amount(){return n.amount},metadata:R,get buttonText(){return n.buttonText},get buttonClass(){return n.buttonClass},get qrCodeSize(){return n.qrCodeSize},onSuccess:(j,K)=>{const ct=j.signature,ft=j.transferRequestId;window.location.href=`https://order-confirmation-9bg.pages.dev/checkout/order-confirmation?signature=${ct}&transferRequestId=${ft}&returnUrl=${window.location.hostname}`},get onError(){return n.onError},get onStatusChange(){return n.onStatusChange},get qrPosition(){return se.POPUP}}),k)}}else{J.querySelectorAll("*").forEach(k=>{k.style.display=""});const Q=document.querySelector(".zenobia-pay-button-container");Q&&Q.remove()}})})}const y=document.querySelector(".form-actions");if(y){const O=y.querySelector(".zenobia-pay-button-container");O&&(O.style.display="none")}}catch(h){console.error("[zenobia-pay] Error initializing payment:",h),(l=n.onError)==null||l.call(n,h)}}(function(){ae({amount:0,target:".zenobia-pay-button-container",metadata:{},url:"https://dashboard.zenobiapay.com/bigcommerce/create-transfer",buttonText:"Zenobia Pay",buttonClass:"button button--primary button--large button--slab"})})(),window.ZenobiaPay={init:ae}})();
