import{W as k,c as y,C as T,_ as F,E as ee,P,F as _e,x as R,o as Ne,$ as Me,J as Oe,e as De,k as v,Y as Fe,m as Pe}from"./firebase-DHP4QguL.js";import{S as $,i as te,g as ne,d as Re}from"./index-N2wkJnkL.js";const oe="@firebase/installations",K="0.6.22";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ie=1e4,re=`w:${K}`,se="FIS_v2",$e="https://firebaseinstallations.googleapis.com/v1",Ke=3600*1e3,qe="installations",Le="Installations";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const je={"missing-app-config-values":'Missing App configuration value: "{$valueName}"',"not-registered":"Firebase Installation is not registered.","installation-not-found":"Firebase Installation not found.","request-failed":'{$requestName} request failed with error "{$serverCode} {$serverStatus}: {$serverMessage}"',"app-offline":"Could not process request. Application offline.","delete-pending-registration":"Can't delete installation while there is a pending registration request."},g=new ee(qe,Le,je);function ae(e){return e instanceof _e&&e.code.includes("request-failed")}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ce({projectId:e}){return`${$e}/projects/${e}/installations`}function ue(e){return{token:e.token,requestStatus:2,expiresIn:Be(e.expiresIn),creationTime:Date.now()}}async function de(e,t){const o=(await t.json()).error;return g.create("request-failed",{requestName:e,serverCode:o.code,serverMessage:o.message,serverStatus:o.status})}function fe({apiKey:e}){return new Headers({"Content-Type":"application/json",Accept:"application/json","x-goog-api-key":e})}function xe(e,{refreshToken:t}){const n=fe(e);return n.append("Authorization",Ve(t)),n}async function le(e){const t=await e();return t.status>=500&&t.status<600?e():t}function Be(e){return Number(e.replace("s","000"))}function Ve(e){return`${se} ${e}`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function We({appConfig:e,heartbeatServiceProvider:t},{fid:n}){const o=ce(e),r=fe(e),i=t.getImmediate({optional:!0});if(i){const f=await i.getHeartbeatsHeader();f&&r.append("x-firebase-client",f)}const s={fid:n,authVersion:se,appId:e.appId,sdkVersion:re},c={method:"POST",headers:r,body:JSON.stringify(s)},d=await le(()=>fetch(o,c));if(d.ok){const f=await d.json();return{fid:f.fid||n,registrationStatus:2,refreshToken:f.refreshToken,authToken:ue(f.authToken)}}else throw await de("Create Installation",d)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function pe(e){return new Promise(t=>{setTimeout(t,e)})}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function He(e){return btoa(String.fromCharCode(...e)).replace(/\+/g,"-").replace(/\//g,"_")}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ue=/^[cdef][\w-]{21}$/,O="";function Ge(){try{const e=new Uint8Array(17);(self.crypto||self.msCrypto).getRandomValues(e),e[0]=112+e[0]%16;const n=Je(e);return Ue.test(n)?n:O}catch(e){return O}}function Je(e){return He(e).substr(0,22)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function S(e){return`${e.appName}!${e.appId}`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ge=new Map;function we(e,t){const n=S(e);he(n,t),ze(n,t)}function he(e,t){const n=ge.get(e);if(n)for(const o of n)o(t)}function ze(e,t){const n=Ye();n&&n.postMessage({key:e,fid:t}),Xe()}let p=null;function Ye(){return!p&&"BroadcastChannel"in self&&(p=new BroadcastChannel("[Firebase] FID Change"),p.onmessage=e=>{he(e.data.key,e.data.fid)}),p}function Xe(){ge.size===0&&p&&(p.close(),p=null)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Qe="firebase-installations-database",Ze=1,w="firebase-installations-store";let E=null;function q(){return E||(E=P(Qe,Ze,{upgrade:(e,t)=>{switch(t){case 0:e.createObjectStore(w)}}})),E}async function I(e,t){const n=S(e),r=(await q()).transaction(w,"readwrite"),i=r.objectStore(w),s=await i.get(n);return await i.put(t,n),await r.done,(!s||s.fid!==t.fid)&&we(e,t.fid),t}async function be(e){const t=S(e),o=(await q()).transaction(w,"readwrite");await o.objectStore(w).delete(t),await o.done}async function A(e,t){const n=S(e),r=(await q()).transaction(w,"readwrite"),i=r.objectStore(w),s=await i.get(n),c=t(s);return c===void 0?await i.delete(n):await i.put(c,n),await r.done,c&&(!s||s.fid!==c.fid)&&we(e,c.fid),c}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function L(e){let t;const n=await A(e.appConfig,o=>{const r=et(o),i=tt(e,r);return t=i.registrationPromise,i.installationEntry});return n.fid===O?{installationEntry:await t}:{installationEntry:n,registrationPromise:t}}function et(e){const t=e||{fid:Ge(),registrationStatus:0};return me(t)}function tt(e,t){if(t.registrationStatus===0){if(!navigator.onLine){const r=Promise.reject(g.create("app-offline"));return{installationEntry:t,registrationPromise:r}}const n={fid:t.fid,registrationStatus:1,registrationTime:Date.now()},o=nt(e,n);return{installationEntry:n,registrationPromise:o}}else return t.registrationStatus===1?{installationEntry:t,registrationPromise:ot(e)}:{installationEntry:t}}async function nt(e,t){try{const n=await We(e,t);return I(e.appConfig,n)}catch(n){throw ae(n)&&n.customData.serverCode===409?await be(e.appConfig):await I(e.appConfig,{fid:t.fid,registrationStatus:0}),n}}async function ot(e){let t=await W(e.appConfig);for(;t.registrationStatus===1;)await pe(100),t=await W(e.appConfig);if(t.registrationStatus===0){const{installationEntry:n,registrationPromise:o}=await L(e);return o||n}return t}function W(e){return A(e,t=>{if(!t)throw g.create("installation-not-found");return me(t)})}function me(e){return it(e)?{fid:e.fid,registrationStatus:0}:e}function it(e){return e.registrationStatus===1&&e.registrationTime+ie<Date.now()}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function rt({appConfig:e,heartbeatServiceProvider:t},n){const o=st(e,n),r=xe(e,n),i=t.getImmediate({optional:!0});if(i){const f=await i.getHeartbeatsHeader();f&&r.append("x-firebase-client",f)}const s={installation:{sdkVersion:re,appId:e.appId}},c={method:"POST",headers:r,body:JSON.stringify(s)},d=await le(()=>fetch(o,c));if(d.ok){const f=await d.json();return ue(f)}else throw await de("Generate Auth Token",d)}function st(e,{fid:t}){return`${ce(e)}/${t}/authTokens:generate`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function j(e,t=!1){let n;const o=await A(e.appConfig,i=>{if(!ke(i))throw g.create("not-registered");const s=i.authToken;if(!t&&ut(s))return i;if(s.requestStatus===1)return n=at(e,t),i;{if(!navigator.onLine)throw g.create("app-offline");const c=ft(i);return n=ct(e,c),c}});return n?await n:o.authToken}async function at(e,t){let n=await H(e.appConfig);for(;n.authToken.requestStatus===1;)await pe(100),n=await H(e.appConfig);const o=n.authToken;return o.requestStatus===0?j(e,t):o}function H(e){return A(e,t=>{if(!ke(t))throw g.create("not-registered");const n=t.authToken;return lt(n)?{...t,authToken:{requestStatus:0}}:t})}async function ct(e,t){try{const n=await rt(e,t),o={...t,authToken:n};return await I(e.appConfig,o),n}catch(n){if(ae(n)&&(n.customData.serverCode===401||n.customData.serverCode===404))await be(e.appConfig);else{const o={...t,authToken:{requestStatus:0}};await I(e.appConfig,o)}throw n}}function ke(e){return e!==void 0&&e.registrationStatus===2}function ut(e){return e.requestStatus===2&&!dt(e)}function dt(e){const t=Date.now();return t<e.creationTime||e.creationTime+e.expiresIn<t+Ke}function ft(e){const t={requestStatus:1,requestTime:Date.now()};return{...e,authToken:t}}function lt(e){return e.requestStatus===1&&e.requestTime+ie<Date.now()}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function pt(e){const t=e,{installationEntry:n,registrationPromise:o}=await L(t);return o?o.catch(console.error):j(t).catch(console.error),n.fid}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function gt(e,t=!1){const n=e;return await wt(n),(await j(n,t)).token}async function wt(e){const{registrationPromise:t}=await L(e);t&&await t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ht(e){if(!e||!e.options)throw C("App Configuration");if(!e.name)throw C("App Name");const t=["projectId","apiKey","appId"];for(const n of t)if(!e.options[n])throw C(n);return{appName:e.name,projectId:e.options.projectId,apiKey:e.options.apiKey,appId:e.options.appId}}function C(e){return g.create("missing-app-config-values",{valueName:e})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ye="installations",bt="installations-internal",mt=e=>{const t=e.getProvider("app").getImmediate(),n=ht(t),o=F(t,"heartbeat");return{app:t,appConfig:n,heartbeatServiceProvider:o,_delete:()=>Promise.resolve()}},kt=e=>{const t=e.getProvider("app").getImmediate(),n=F(t,ye).getImmediate();return{getId:()=>pt(n),getToken:r=>gt(n,r)}};function yt(){y(new T(ye,mt,"PUBLIC")),y(new T(bt,kt,"PRIVATE"))}yt();k(oe,K);k(oe,K,"esm2020");/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Tt="/firebase-messaging-sw.js",It="/firebase-cloud-messaging-push-scope",Te="BDOU99-h67HcA6JeFXHbSNMu7e2yNNu3RzoMj8TM4W88jITfq7ZmPvIM1Iv-4_l2LxQcYwhqby2xGpWwzjfAnG4",St="https://fcmregistrations.googleapis.com/v1",Ie="google.c.a.c_id",At="google.c.a.c_l",vt="google.c.a.ts",Et="google.c.a.e",U=1e4;var G;(function(e){e[e.DATA_MESSAGE=1]="DATA_MESSAGE",e[e.DISPLAY_NOTIFICATION=3]="DISPLAY_NOTIFICATION"})(G||(G={}));/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing permissions and limitations under
 * the License.
 */var b;(function(e){e.PUSH_RECEIVED="push-received",e.NOTIFICATION_CLICKED="notification-clicked"})(b||(b={}));/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function l(e){const t=new Uint8Array(e);return btoa(String.fromCharCode(...t)).replace(/=/g,"").replace(/\+/g,"-").replace(/\//g,"_")}function Ct(e){const t="=".repeat((4-e.length%4)%4),n=(e+t).replace(/\-/g,"+").replace(/_/g,"/"),o=atob(n),r=new Uint8Array(o.length);for(let i=0;i<o.length;++i)r[i]=o.charCodeAt(i);return r}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _="fcm_token_details_db",_t=5,J="fcm_token_object_Store";async function Nt(e){if("databases"in indexedDB&&!(await indexedDB.databases()).map(i=>i.name).includes(_))return null;let t=null;return(await P(_,_t,{upgrade:async(o,r,i,s)=>{var f;if(r<2||!o.objectStoreNames.contains(J))return;const c=s.objectStore(J),d=await c.index("fcmSenderId").get(e);if(await c.clear(),!!d){if(r===2){const a=d;if(!a.auth||!a.p256dh||!a.endpoint)return;t={token:a.fcmToken,createTime:(f=a.createTime)!=null?f:Date.now(),subscriptionOptions:{auth:a.auth,p256dh:a.p256dh,endpoint:a.endpoint,swScope:a.swScope,vapidKey:typeof a.vapidKey=="string"?a.vapidKey:l(a.vapidKey)}}}else if(r===3){const a=d;t={token:a.fcmToken,createTime:a.createTime,subscriptionOptions:{auth:l(a.auth),p256dh:l(a.p256dh),endpoint:a.endpoint,swScope:a.swScope,vapidKey:l(a.vapidKey)}}}else if(r===4){const a=d;t={token:a.fcmToken,createTime:a.createTime,subscriptionOptions:{auth:l(a.auth),p256dh:l(a.p256dh),endpoint:a.endpoint,swScope:a.swScope,vapidKey:l(a.vapidKey)}}}}}})).close(),await v(_),await v("fcm_vapid_details_db"),await v("undefined"),Mt(t)?t:null}function Mt(e){if(!e||!e.subscriptionOptions)return!1;const{subscriptionOptions:t}=e;return typeof e.createTime=="number"&&e.createTime>0&&typeof e.token=="string"&&e.token.length>0&&typeof t.auth=="string"&&t.auth.length>0&&typeof t.p256dh=="string"&&t.p256dh.length>0&&typeof t.endpoint=="string"&&t.endpoint.length>0&&typeof t.swScope=="string"&&t.swScope.length>0&&typeof t.vapidKey=="string"&&t.vapidKey.length>0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ot="firebase-messaging-database",Dt=1,m="firebase-messaging-store";let N=null;function Se(){return N||(N=P(Ot,Dt,{upgrade:(e,t)=>{switch(t){case 0:e.createObjectStore(m)}}})),N}async function Ft(e){const t=Ae(e),o=await(await Se()).transaction(m).objectStore(m).get(t);if(o)return o;{const r=await Nt(e.appConfig.senderId);if(r)return await x(e,r),r}}async function x(e,t){const n=Ae(e),r=(await Se()).transaction(m,"readwrite");return await r.objectStore(m).put(t,n),await r.done,t}function Ae({appConfig:e}){return e.appId}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Pt={"missing-app-config-values":'Missing App configuration value: "{$valueName}"',"only-available-in-window":"This method is available in a Window context.","only-available-in-sw":"This method is available in a service worker context.","permission-default":"The notification permission was not granted and dismissed instead.","permission-blocked":"The notification permission was not granted and blocked instead.","unsupported-browser":"This browser doesn't support the API's required to use the Firebase SDK.","indexed-db-unsupported":"This browser doesn't support indexedDb.open() (ex. Safari iFrame, Firefox Private Browsing, etc)","failed-service-worker-registration":"We are unable to register the default service worker. {$browserErrorMessage}","token-subscribe-failed":"A problem occurred while subscribing the user to FCM: {$errorInfo}","token-subscribe-no-token":"FCM returned no token when subscribing the user to push.","token-unsubscribe-failed":"A problem occurred while unsubscribing the user from FCM: {$errorInfo}","token-update-failed":"A problem occurred while updating the user from FCM: {$errorInfo}","token-update-no-token":"FCM returned no token when updating the user to push.","use-sw-after-get-token":"The useServiceWorker() method may only be called once and must be called before calling getToken() to ensure your service worker is used.","invalid-sw-registration":"The input to useServiceWorker() must be a ServiceWorkerRegistration.","invalid-bg-handler":"The input to setBackgroundMessageHandler() must be a function.","invalid-vapid-key":"The public VAPID key must be a string.","use-vapid-key-after-get-token":"The usePublicVapidKey() method may only be called once and must be called before calling getToken() to ensure your VAPID key is used."},u=new ee("messaging","Messaging",Pt);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Rt(e,t){const n=await V(e),o=ve(t),r={method:"POST",headers:n,body:JSON.stringify(o)};let i;try{i=await(await fetch(B(e.appConfig),r)).json()}catch(s){throw u.create("token-subscribe-failed",{errorInfo:s==null?void 0:s.toString()})}if(i.error){const s=i.error.message;throw u.create("token-subscribe-failed",{errorInfo:s})}if(!i.token)throw u.create("token-subscribe-no-token");return i.token}async function $t(e,t){const n=await V(e),o=ve(t.subscriptionOptions),r={method:"PATCH",headers:n,body:JSON.stringify(o)};let i;try{i=await(await fetch(`${B(e.appConfig)}/${t.token}`,r)).json()}catch(s){throw u.create("token-update-failed",{errorInfo:s==null?void 0:s.toString()})}if(i.error){const s=i.error.message;throw u.create("token-update-failed",{errorInfo:s})}if(!i.token)throw u.create("token-update-no-token");return i.token}async function Kt(e,t){const o={method:"DELETE",headers:await V(e)};try{const i=await(await fetch(`${B(e.appConfig)}/${t}`,o)).json();if(i.error){const s=i.error.message;throw u.create("token-unsubscribe-failed",{errorInfo:s})}}catch(r){throw u.create("token-unsubscribe-failed",{errorInfo:r==null?void 0:r.toString()})}}function B({projectId:e}){return`${St}/projects/${e}/registrations`}async function V({appConfig:e,installations:t}){const n=await t.getToken();return new Headers({"Content-Type":"application/json",Accept:"application/json","x-goog-api-key":e.apiKey,"x-goog-firebase-installations-auth":`FIS ${n}`})}function ve({p256dh:e,auth:t,endpoint:n,vapidKey:o}){const r={web:{endpoint:n,auth:t,p256dh:e}};return o!==Te&&(r.web.applicationPubKey=o),r}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qt=10080*60*1e3;async function Lt(e){const t=await xt(e.swRegistration,e.vapidKey),n={vapidKey:e.vapidKey,swScope:e.swRegistration.scope,endpoint:t.endpoint,auth:l(t.getKey("auth")),p256dh:l(t.getKey("p256dh"))},o=await Ft(e.firebaseDependencies);if(o){if(Bt(o.subscriptionOptions,n))return Date.now()>=o.createTime+qt?jt(e,{token:o.token,createTime:Date.now(),subscriptionOptions:n}):o.token;try{await Kt(e.firebaseDependencies,o.token)}catch(r){console.warn(r)}return z(e.firebaseDependencies,n)}else return z(e.firebaseDependencies,n)}async function jt(e,t){try{const n=await $t(e.firebaseDependencies,t),o={...t,token:n,createTime:Date.now()};return await x(e.firebaseDependencies,o),n}catch(n){throw n}}async function z(e,t){const o={token:await Rt(e,t),createTime:Date.now(),subscriptionOptions:t};return await x(e,o),o.token}async function xt(e,t){const n=await e.pushManager.getSubscription();return n||e.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:Ct(t)})}function Bt(e,t){const n=t.vapidKey===e.vapidKey,o=t.endpoint===e.endpoint,r=t.auth===e.auth,i=t.p256dh===e.p256dh;return n&&o&&r&&i}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Y(e){const t={from:e.from,collapseKey:e.collapse_key,messageId:e.fcmMessageId};return Vt(t,e),Wt(t,e),Ht(t,e),t}function Vt(e,t){if(!t.notification)return;e.notification={};const n=t.notification.title;n&&(e.notification.title=n);const o=t.notification.body;o&&(e.notification.body=o);const r=t.notification.image;r&&(e.notification.image=r);const i=t.notification.icon;i&&(e.notification.icon=i)}function Wt(e,t){t.data&&(e.data=t.data)}function Ht(e,t){var r,i,s,c,d;if(!t.fcmOptions&&!((r=t.notification)!=null&&r.click_action))return;e.fcmOptions={};const n=(c=(i=t.fcmOptions)==null?void 0:i.link)!=null?c:(s=t.notification)==null?void 0:s.click_action;n&&(e.fcmOptions.link=n);const o=(d=t.fcmOptions)==null?void 0:d.analytics_label;o&&(e.fcmOptions.analyticsLabel=o)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ut(e){return typeof e=="object"&&!!e&&Ie in e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Gt(e){if(!e||!e.options)throw M("App Configuration Object");if(!e.name)throw M("App Name");const t=["projectId","apiKey","appId","messagingSenderId"],{options:n}=e;for(const o of t)if(!n[o])throw M(o);return{appName:e.name,projectId:n.projectId,apiKey:n.apiKey,appId:n.appId,senderId:n.messagingSenderId}}function M(e){return u.create("missing-app-config-values",{valueName:e})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jt{constructor(t,n,o){this.deliveryMetricsExportedToBigQueryEnabled=!1,this.onBackgroundMessageHandler=null,this.onMessageHandler=null,this.logEvents=[],this.isLogServiceStarted=!1;const r=Gt(t);this.firebaseDependencies={app:t,appConfig:r,installations:n,analyticsProvider:o}}_delete(){return Promise.resolve()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function zt(e){try{e.swRegistration=await navigator.serviceWorker.register(Tt,{scope:It}),e.swRegistration.update().catch(()=>{}),await Yt(e.swRegistration)}catch(t){throw u.create("failed-service-worker-registration",{browserErrorMessage:t==null?void 0:t.message})}}async function Yt(e){return new Promise((t,n)=>{const o=setTimeout(()=>n(new Error(`Service worker not registered after ${U} ms`)),U),r=e.installing||e.waiting;e.active?(clearTimeout(o),t()):r?r.onstatechange=i=>{var s;((s=i.target)==null?void 0:s.state)==="activated"&&(r.onstatechange=null,clearTimeout(o),t())}:(clearTimeout(o),n(new Error("No incoming service worker found.")))})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Xt(e,t){if(!t&&!e.swRegistration&&await zt(e),!(!t&&e.swRegistration)){if(!(t instanceof ServiceWorkerRegistration))throw u.create("invalid-sw-registration");e.swRegistration=t}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Qt(e,t){t?e.vapidKey=t:e.vapidKey||(e.vapidKey=Te)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ee(e,t){if(!navigator)throw u.create("only-available-in-window");if(Notification.permission==="default"&&await Notification.requestPermission(),Notification.permission!=="granted")throw u.create("permission-blocked");return await Qt(e,t==null?void 0:t.vapidKey),await Xt(e,t==null?void 0:t.serviceWorkerRegistration),Lt(e)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Zt(e,t,n){const o=en(t);(await e.firebaseDependencies.analyticsProvider.get()).logEvent(o,{message_id:n[Ie],message_name:n[At],message_time:n[vt],message_device_time:Math.floor(Date.now()/1e3)})}function en(e){switch(e){case b.NOTIFICATION_CLICKED:return"notification_open";case b.PUSH_RECEIVED:return"notification_foreground";default:throw new Error}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function tn(e,t){const n=t.data;if(!n.isFirebaseMessaging)return;e.onMessageHandler&&n.messageType===b.PUSH_RECEIVED&&(typeof e.onMessageHandler=="function"?e.onMessageHandler(Y(n)):e.onMessageHandler.next(Y(n)));const o=n.data;Ut(o)&&o[Et]==="1"&&await Zt(e,n.messageType,o)}const X="@firebase/messaging",Q="0.12.26";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const nn=e=>{const t=new Jt(e.getProvider("app").getImmediate(),e.getProvider("installations-internal").getImmediate(),e.getProvider("analytics-internal"));return navigator.serviceWorker.addEventListener("message",n=>tn(t,n)),t},on=e=>{const t=e.getProvider("messaging").getImmediate();return{getToken:o=>Ee(t,o)}};function rn(){y(new T("messaging",nn,"PUBLIC")),y(new T("messaging-internal",on,"PRIVATE")),k(X,Q),k(X,Q,"esm2020")}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function sn(){try{await Me()}catch(e){return!1}return typeof window!="undefined"&&Oe()&&De()&&"serviceWorker"in navigator&&"PushManager"in window&&"Notification"in window&&"fetch"in window&&ServiceWorkerRegistration.prototype.hasOwnProperty("showNotification")&&PushSubscription.prototype.hasOwnProperty("getKey")}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function an(e,t){if(!navigator)throw u.create("only-available-in-window");return e.onMessageHandler=t,()=>{e.onMessageHandler=null}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ce(e=Ne()){return sn().then(t=>{if(!t)throw u.create("unsupported-browser")},t=>{throw u.create("indexed-db-unsupported")}),F(R(e),"messaging").getImmediate()}async function cn(e,t){return e=R(e),Ee(e,t)}function un(e,t){return e=R(e),an(e,t)}rn();const dn="/api".trim()||"/api";let h=null;const D=async()=>{if(!te())return console.warn("Firebase client is not configured. FCM will be disabled."),null;if(!("serviceWorker"in navigator))return console.warn("Service Workers are not supported. FCM will be disabled."),null;if(!("Notification"in window))return console.warn("Notifications are not supported by this browser. FCM will be disabled."),null;try{if(Notification.permission==="default"&&await Notification.requestPermission()!=="granted")return console.warn("User denied notification permission"),null;if(Notification.permission!=="granted")return console.warn("Notification permission is not granted"),null;let e;try{e=await navigator.serviceWorker.register("/firebase-messaging-sw.js",{scope:"/"}),console.log("Service Worker registered for FCM:",e)}catch(o){console.warn("Service Worker registration failed:",o)}const t=Ce(ne()),n=await cn(t,{vapidKey:"".trim(),serviceWorkerRegistration:e});if(!n)throw new Error("Failed to get FCM token");return console.log("FCM token obtained:",n.substring(0,20)+"..."),$.saveFCMToken(n),fn(),n}catch(e){const t=e instanceof Error?e.message:"Unknown error";return console.error("Failed to initialize FCM:",t),null}},gn=async()=>{const e=$.getFCMToken();return e||D()},wn=async(e,t,n,o)=>{let r=!1;try{const i=Re(),c=`tok_${(n||"anonymous").replace(/[^a-zA-Z0-9]/g,"_")}_${e.slice(-10)}`;await Fe(Pe(i,"notification_tokens",c),{id:c,fcmToken:e,role:t,userId:n,outletId:o||null,isActive:!0,updatedAt:new Date().toISOString(),createdAt:new Date().toISOString(),platform:Z(),userAgent:navigator.userAgent},{merge:!0}),r=!0,console.log("[FCM] Token stored directly in Firestore notification_tokens for:",n)}catch(i){console.warn("[FCM] Direct Firestore token storage warning:",i)}try{const i=$.getAdminSession(),s={"Content-Type":"application/json"};i!=null&&i.token&&(s.Authorization=`Bearer ${i.token}`),i!=null&&i.sessionId&&(s["X-Session-Id"]=i.sessionId),await fetch(`${dn}/notifications/token`,{method:"POST",headers:s,body:JSON.stringify({fcmToken:e,role:t,userId:n,outletId:o||void 0,deviceInfo:{userAgent:navigator.userAgent,platform:Z()}})})}catch(i){}return r},fn=e=>{if(!te())return null;try{const t=Ce(ne());return h=un(t,n=>{if(console.log("FCM message received (app in foreground):",n),e){e(n);return}const{title:o,body:r}=n.notification||{},i=n.data;o&&r&&Notification.permission==="granted"&&new Notification(o,{body:r,icon:(i==null?void 0:i.icon)||"/icon-192.png",badge:(i==null?void 0:i.badge)||"/icon-192.png",tag:(i==null?void 0:i.tag)||"harinos-notification",data:i})}),console.log("FCM message listener subscribed"),h}catch(t){const n=t instanceof Error?t.message:"Unknown error";return console.error("Error subscribing to FCM messages:",n),null}},hn=()=>{h&&(h(),h=null,console.log("FCM message listener unsubscribed"))},Z=()=>{const e=navigator.userAgent.toLowerCase();return e.includes("iphone")||e.includes("ipad")?"iOS":e.includes("android")?"Android":"Web"},bn=async()=>{if(!("Notification"in window))return{permission:"denied",token:null};if(Notification.permission==="granted")return{permission:"granted",token:await D()};if(Notification.permission==="denied")return{permission:"denied",token:null};const e=await Notification.requestPermission();if(e==="granted"){const t=await D();return{permission:e,token:t}}return{permission:e,token:null}};export{gn as getOrCreateFCMToken,D as initializeFCM,bn as requestNotificationPermissionAndInitFCM,wn as sendTokenToServer,fn as subscribeFCMMessages,hn as unsubscribeFCMMessages};
