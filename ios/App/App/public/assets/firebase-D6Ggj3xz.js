const lg=()=>{};var Lc={};/**
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
 */const yh=function(r){const e=[];let t=0;for(let n=0;n<r.length;n++){let s=r.charCodeAt(n);s<128?e[t++]=s:s<2048?(e[t++]=s>>6|192,e[t++]=s&63|128):(s&64512)===55296&&n+1<r.length&&(r.charCodeAt(n+1)&64512)===56320?(s=65536+((s&1023)<<10)+(r.charCodeAt(++n)&1023),e[t++]=s>>18|240,e[t++]=s>>12&63|128,e[t++]=s>>6&63|128,e[t++]=s&63|128):(e[t++]=s>>12|224,e[t++]=s>>6&63|128,e[t++]=s&63|128)}return e},hg=function(r){const e=[];let t=0,n=0;for(;t<r.length;){const s=r[t++];if(s<128)e[n++]=String.fromCharCode(s);else if(s>191&&s<224){const i=r[t++];e[n++]=String.fromCharCode((s&31)<<6|i&63)}else if(s>239&&s<365){const i=r[t++],o=r[t++],u=r[t++],c=((s&7)<<18|(i&63)<<12|(o&63)<<6|u&63)-65536;e[n++]=String.fromCharCode(55296+(c>>10)),e[n++]=String.fromCharCode(56320+(c&1023))}else{const i=r[t++],o=r[t++];e[n++]=String.fromCharCode((s&15)<<12|(i&63)<<6|o&63)}}return e.join("")},Ih={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(r,e){if(!Array.isArray(r))throw Error("encodeByteArray takes an array as a parameter");this.init_();const t=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,n=[];for(let s=0;s<r.length;s+=3){const i=r[s],o=s+1<r.length,u=o?r[s+1]:0,c=s+2<r.length,h=c?r[s+2]:0,f=i>>2,m=(i&3)<<4|u>>4;let p=(u&15)<<2|h>>6,v=h&63;c||(v=64,o||(p=64)),n.push(t[f],t[m],t[p],t[v])}return n.join("")},encodeString(r,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(r):this.encodeByteArray(yh(r),e)},decodeString(r,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(r):hg(this.decodeStringToByteArray(r,e))},decodeStringToByteArray(r,e){this.init_();const t=e?this.charToByteMapWebSafe_:this.charToByteMap_,n=[];for(let s=0;s<r.length;){const i=t[r.charAt(s++)],u=s<r.length?t[r.charAt(s)]:0;++s;const h=s<r.length?t[r.charAt(s)]:64;++s;const m=s<r.length?t[r.charAt(s)]:64;if(++s,i==null||u==null||h==null||m==null)throw new dg;const p=i<<2|u>>4;if(n.push(p),h!==64){const v=u<<4&240|h>>2;if(n.push(v),m!==64){const C=h<<6&192|m;n.push(C)}}}return n},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let r=0;r<this.ENCODED_VALS.length;r++)this.byteToCharMap_[r]=this.ENCODED_VALS.charAt(r),this.charToByteMap_[this.byteToCharMap_[r]]=r,this.byteToCharMapWebSafe_[r]=this.ENCODED_VALS_WEBSAFE.charAt(r),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[r]]=r,r>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(r)]=r,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(r)]=r)}}};class dg extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const fg=function(r){const e=yh(r);return Ih.encodeByteArray(e,!0)},_i=function(r){return fg(r).replace(/\./g,"")},mg=function(r){try{return Ih.decodeString(r,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 * @license
 * Copyright 2022 Google LLC
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
 */function Eh(){if(typeof self!="undefined")return self;if(typeof window!="undefined")return window;if(typeof global!="undefined")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
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
 */const gg=()=>Eh().__FIREBASE_DEFAULTS__,pg=()=>{if(typeof process=="undefined"||typeof Lc=="undefined")return;const r=Lc.__FIREBASE_DEFAULTS__;if(r)return JSON.parse(r)},_g=()=>{if(typeof document=="undefined")return;let r;try{r=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch(t){return}const e=r&&mg(r[1]);return e&&JSON.parse(e)},Mi=()=>{try{return lg()||gg()||pg()||_g()}catch(r){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${r}`);return}},yg=r=>{var e,t;return(t=(e=Mi())==null?void 0:e.emulatorHosts)==null?void 0:t[r]},Ig=r=>{const e=yg(r);if(!e)return;const t=e.lastIndexOf(":");if(t<=0||t+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const n=parseInt(e.substring(t+1),10);return e[0]==="["?[e.substring(1,t-1),n]:[e.substring(0,t),n]},Th=()=>{var r;return(r=Mi())==null?void 0:r.config},WT=r=>{var e;return(e=Mi())==null?void 0:e[`_${r}`]};/**
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
 */class Eg{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,n)=>{t?this.reject(t):this.resolve(n),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(t):e(t,n))}}}/**
 * @license
 * Copyright 2021 Google LLC
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
 */function Tg(r,e){if(r.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const t={alg:"none",type:"JWT"},n=e||"demo-project",s=r.iat||0,i=r.sub||r.user_id;if(!i)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const o={iss:`https://securetoken.google.com/${n}`,aud:n,iat:s,exp:s+3600,auth_time:s,sub:i,user_id:i,firebase:{sign_in_provider:"custom",identities:{}},...r};return[_i(JSON.stringify(t)),_i(JSON.stringify(o)),""].join(".")}/**
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
 */function Kn(){return typeof navigator!="undefined"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function HT(){return typeof window!="undefined"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(Kn())}function wh(){var e;const r=(e=Mi())==null?void 0:e.forceEnvironment;if(r==="node")return!0;if(r==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch(t){return!1}}function JT(){return typeof navigator!="undefined"&&navigator.userAgent==="Cloudflare-Workers"}function YT(){const r=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof r=="object"&&r.id!==void 0}function XT(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function ZT(){const r=Kn();return r.indexOf("MSIE ")>=0||r.indexOf("Trident/")>=0}function vh(){return!wh()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function Ah(){return!wh()&&!!navigator.userAgent&&(navigator.userAgent.includes("Safari")||navigator.userAgent.includes("WebKit"))&&!navigator.userAgent.includes("Chrome")}function bh(){try{return typeof indexedDB=="object"}catch(r){return!1}}function wg(){return new Promise((r,e)=>{try{let t=!0;const n="validate-browser-context-for-indexeddb-analytics-module",s=self.indexedDB.open(n);s.onsuccess=()=>{s.result.close(),t||self.indexedDB.deleteDatabase(n),r(!0)},s.onupgradeneeded=()=>{t=!1},s.onerror=()=>{var i;e(((i=s.error)==null?void 0:i.message)||"")}}catch(t){e(t)}})}function ew(){return!(typeof navigator=="undefined"||!navigator.cookieEnabled)}/**
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
 */const vg="FirebaseError";class mr extends Error{constructor(e,t,n){super(t),this.code=e,this.customData=n,this.name=vg,Object.setPrototypeOf(this,mr.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,Rh.prototype.create)}}class Rh{constructor(e,t,n){this.service=e,this.serviceName=t,this.errors=n}create(e,...t){const n=t[0]||{},s=`${this.service}/${e}`,i=this.errors[e],o=i?Ag(i,n):"Error",u=`${this.serviceName}: ${o} (${s}).`;return new mr(s,u,n)}}function Ag(r,e){return r.replace(bg,(t,n)=>{const s=e[n];return s!=null?String(s):`<${n}?>`})}const bg=/\{\$([^}]+)}/g;function tw(r){for(const e in r)if(Object.prototype.hasOwnProperty.call(r,e))return!1;return!0}function Mt(r,e){if(r===e)return!0;const t=Object.keys(r),n=Object.keys(e);for(const s of t){if(!n.includes(s))return!1;const i=r[s],o=e[s];if(Bc(i)&&Bc(o)){if(!Mt(i,o))return!1}else if(i!==o)return!1}for(const s of n)if(!t.includes(s))return!1;return!0}function Bc(r){return r!==null&&typeof r=="object"}/**
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
 */function nw(r){const e=[];for(const[t,n]of Object.entries(r))Array.isArray(n)?n.forEach(s=>{e.push(encodeURIComponent(t)+"="+encodeURIComponent(s))}):e.push(encodeURIComponent(t)+"="+encodeURIComponent(n));return e.length?"&"+e.join("&"):""}function rw(r){const e={};return r.replace(/^\?/,"").split("&").forEach(n=>{if(n){const[s,i]=n.split("=");e[decodeURIComponent(s)]=decodeURIComponent(i)}}),e}function sw(r){const e=r.indexOf("?");if(!e)return"";const t=r.indexOf("#",e);return r.substring(e,t>0?t:void 0)}function iw(r,e){const t=new Rg(r,e);return t.subscribe.bind(t)}class Rg{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(n=>{this.error(n)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,n){let s;if(e===void 0&&t===void 0&&n===void 0)throw new Error("Missing Observer.");Sg(e,["next","error","complete"])?s=e:s={next:e,error:t,complete:n},s.next===void 0&&(s.next=xo),s.error===void 0&&(s.error=xo),s.complete===void 0&&(s.complete=xo);const i=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?s.error(this.finalError):s.complete()}catch(o){}}),this.observers.push(s),i}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{t(this.observers[e])}catch(n){typeof console!="undefined"&&console.error&&console.error(n)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function Sg(r,e){if(typeof r!="object"||r===null)return!1;for(const t of e)if(t in r&&typeof r[t]=="function")return!0;return!1}function xo(){}/**
 * @license
 * Copyright 2021 Google LLC
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
 */function Ee(r){return r&&r._delegate?r._delegate:r}/**
 * @license
 * Copyright 2025 Google LLC
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
 */function Ra(r){try{return(r.startsWith("http://")||r.startsWith("https://")?new URL(r).hostname:r).endsWith(".cloudworkstations.dev")}catch(e){return!1}}async function Sh(r){return(await fetch(r,{credentials:"include"})).ok}class ls{constructor(e,t,n){this.name=e,this.instanceFactory=t,this.type=n,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
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
 */const sn="[DEFAULT]";/**
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
 */class Pg{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const n=new Eg;if(this.instancesDeferred.set(t,n),this.isInitialized(t)||this.shouldAutoInitialize())try{const s=this.getOrInitializeService({instanceIdentifier:t});s&&n.resolve(s)}catch(s){}}return this.instancesDeferred.get(t).promise}getImmediate(e){var s;const t=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),n=(s=e==null?void 0:e.optional)!=null?s:!1;if(this.isInitialized(t)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:t})}catch(i){if(n)return null;throw i}else{if(n)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(Cg(e))try{this.getOrInitializeService({instanceIdentifier:sn})}catch(t){}for(const[t,n]of this.instancesDeferred.entries()){const s=this.normalizeInstanceIdentifier(t);try{const i=this.getOrInitializeService({instanceIdentifier:s});n.resolve(i)}catch(i){}}}}clearInstance(e=sn){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(t=>"INTERNAL"in t).map(t=>t.INTERNAL.delete()),...e.filter(t=>"_delete"in t).map(t=>t._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=sn){return this.instances.has(e)}getOptions(e=sn){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,n=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(n))throw Error(`${this.name}(${n}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const s=this.getOrInitializeService({instanceIdentifier:n,options:t});for(const[i,o]of this.instancesDeferred.entries()){const u=this.normalizeInstanceIdentifier(i);n===u&&o.resolve(s)}return s}onInit(e,t){var o;const n=this.normalizeInstanceIdentifier(t),s=(o=this.onInitCallbacks.get(n))!=null?o:new Set;s.add(e),this.onInitCallbacks.set(n,s);const i=this.instances.get(n);return i&&e(i,n),()=>{s.delete(e)}}invokeOnInitCallbacks(e,t){const n=this.onInitCallbacks.get(t);if(n)for(const s of n)try{s(e,t)}catch(i){}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let n=this.instances.get(e);if(!n&&this.component&&(n=this.component.instanceFactory(this.container,{instanceIdentifier:Vg(e),options:t}),this.instances.set(e,n),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(n,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,n)}catch(s){}return n||null}normalizeInstanceIdentifier(e=sn){return this.component?this.component.multipleInstances?e:sn:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function Vg(r){return r===sn?void 0:r}function Cg(r){return r.instantiationMode==="EAGER"}/**
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
 */class Dg{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const t=new Pg(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}/**
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
 */var X;(function(r){r[r.DEBUG=0]="DEBUG",r[r.VERBOSE=1]="VERBOSE",r[r.INFO=2]="INFO",r[r.WARN=3]="WARN",r[r.ERROR=4]="ERROR",r[r.SILENT=5]="SILENT"})(X||(X={}));const xg={debug:X.DEBUG,verbose:X.VERBOSE,info:X.INFO,warn:X.WARN,error:X.ERROR,silent:X.SILENT},Ng=X.INFO,kg={[X.DEBUG]:"log",[X.VERBOSE]:"log",[X.INFO]:"info",[X.WARN]:"warn",[X.ERROR]:"error"},Mg=(r,e,...t)=>{if(e<r.logLevel)return;const n=new Date().toISOString(),s=kg[e];if(s)console[s](`[${n}]  ${r.name}:`,...t);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class Ph{constructor(e){this.name=e,this._logLevel=Ng,this._logHandler=Mg,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in X))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?xg[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,X.DEBUG,...e),this._logHandler(this,X.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,X.VERBOSE,...e),this._logHandler(this,X.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,X.INFO,...e),this._logHandler(this,X.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,X.WARN,...e),this._logHandler(this,X.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,X.ERROR,...e),this._logHandler(this,X.ERROR,...e)}}const Og=(r,e)=>e.some(t=>r instanceof t);let Uc,qc;function Fg(){return Uc||(Uc=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Lg(){return qc||(qc=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const Vh=new WeakMap,Ko=new WeakMap,Ch=new WeakMap,No=new WeakMap,Sa=new WeakMap;function Bg(r){const e=new Promise((t,n)=>{const s=()=>{r.removeEventListener("success",i),r.removeEventListener("error",o)},i=()=>{t(ct(r.result)),s()},o=()=>{n(r.error),s()};r.addEventListener("success",i),r.addEventListener("error",o)});return e.then(t=>{t instanceof IDBCursor&&Vh.set(t,r)}).catch(()=>{}),Sa.set(e,r),e}function Ug(r){if(Ko.has(r))return;const e=new Promise((t,n)=>{const s=()=>{r.removeEventListener("complete",i),r.removeEventListener("error",o),r.removeEventListener("abort",o)},i=()=>{t(),s()},o=()=>{n(r.error||new DOMException("AbortError","AbortError")),s()};r.addEventListener("complete",i),r.addEventListener("error",o),r.addEventListener("abort",o)});Ko.set(r,e)}let Qo={get(r,e,t){if(r instanceof IDBTransaction){if(e==="done")return Ko.get(r);if(e==="objectStoreNames")return r.objectStoreNames||Ch.get(r);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return ct(r[e])},set(r,e,t){return r[e]=t,!0},has(r,e){return r instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in r}};function qg(r){Qo=r(Qo)}function jg(r){return r===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...t){const n=r.call(ko(this),e,...t);return Ch.set(n,e.sort?e.sort():[e]),ct(n)}:Lg().includes(r)?function(...e){return r.apply(ko(this),e),ct(Vh.get(this))}:function(...e){return ct(r.apply(ko(this),e))}}function zg(r){return typeof r=="function"?jg(r):(r instanceof IDBTransaction&&Ug(r),Og(r,Fg())?new Proxy(r,Qo):r)}function ct(r){if(r instanceof IDBRequest)return Bg(r);if(No.has(r))return No.get(r);const e=zg(r);return e!==r&&(No.set(r,e),Sa.set(e,r)),e}const ko=r=>Sa.get(r);function $g(r,e,{blocked:t,upgrade:n,blocking:s,terminated:i}={}){const o=indexedDB.open(r,e),u=ct(o);return n&&o.addEventListener("upgradeneeded",c=>{n(ct(o.result),c.oldVersion,c.newVersion,ct(o.transaction),c)}),t&&o.addEventListener("blocked",c=>t(c.oldVersion,c.newVersion,c)),u.then(c=>{i&&c.addEventListener("close",()=>i()),s&&c.addEventListener("versionchange",h=>s(h.oldVersion,h.newVersion,h))}).catch(()=>{}),u}function ow(r,{blocked:e}={}){const t=indexedDB.deleteDatabase(r);return e&&t.addEventListener("blocked",n=>e(n.oldVersion,n)),ct(t).then(()=>{})}const Gg=["get","getKey","getAll","getAllKeys","count"],Kg=["put","add","delete","clear"],Mo=new Map;function jc(r,e){if(!(r instanceof IDBDatabase&&!(e in r)&&typeof e=="string"))return;if(Mo.get(e))return Mo.get(e);const t=e.replace(/FromIndex$/,""),n=e!==t,s=Kg.includes(t);if(!(t in(n?IDBIndex:IDBObjectStore).prototype)||!(s||Gg.includes(t)))return;const i=async function(o,...u){const c=this.transaction(o,s?"readwrite":"readonly");let h=c.store;return n&&(h=h.index(u.shift())),(await Promise.all([h[t](...u),s&&c.done]))[0]};return Mo.set(e,i),i}qg(r=>({...r,get:(e,t,n)=>jc(e,t)||r.get(e,t,n),has:(e,t)=>!!jc(e,t)||r.has(e,t)}));/**
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
 */class Qg{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(t=>{if(Wg(t)){const n=t.getImmediate();return`${n.library}/${n.version}`}else return null}).filter(t=>t).join(" ")}}function Wg(r){const e=r.getComponent();return(e==null?void 0:e.type)==="VERSION"}const Wo="@firebase/app",zc="0.14.12";/**
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
 */const lt=new Ph("@firebase/app"),Hg="@firebase/app-compat",Jg="@firebase/analytics-compat",Yg="@firebase/analytics",Xg="@firebase/app-check-compat",Zg="@firebase/app-check",ep="@firebase/auth",tp="@firebase/auth-compat",np="@firebase/database",rp="@firebase/data-connect",sp="@firebase/database-compat",ip="@firebase/functions",op="@firebase/functions-compat",ap="@firebase/installations",up="@firebase/installations-compat",cp="@firebase/messaging",lp="@firebase/messaging-compat",hp="@firebase/performance",dp="@firebase/performance-compat",fp="@firebase/remote-config",mp="@firebase/remote-config-compat",gp="@firebase/storage",pp="@firebase/storage-compat",_p="@firebase/firestore",yp="@firebase/ai",Ip="@firebase/firestore-compat",Ep="firebase",Tp="12.13.0";/**
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
 */const yi="[DEFAULT]",wp={[Wo]:"fire-core",[Hg]:"fire-core-compat",[Yg]:"fire-analytics",[Jg]:"fire-analytics-compat",[Zg]:"fire-app-check",[Xg]:"fire-app-check-compat",[ep]:"fire-auth",[tp]:"fire-auth-compat",[np]:"fire-rtdb",[rp]:"fire-data-connect",[sp]:"fire-rtdb-compat",[ip]:"fire-fn",[op]:"fire-fn-compat",[ap]:"fire-iid",[up]:"fire-iid-compat",[cp]:"fire-fcm",[lp]:"fire-fcm-compat",[hp]:"fire-perf",[dp]:"fire-perf-compat",[fp]:"fire-rc",[mp]:"fire-rc-compat",[gp]:"fire-gcs",[pp]:"fire-gcs-compat",[_p]:"fire-fst",[Ip]:"fire-fst-compat",[yp]:"fire-vertex","fire-js":"fire-js",[Ep]:"fire-js-all"};/**
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
 */const hs=new Map,vp=new Map,Ho=new Map;function $c(r,e){try{r.container.addComponent(e)}catch(t){lt.debug(`Component ${e.name} failed to register with FirebaseApp ${r.name}`,t)}}function Ii(r){const e=r.name;if(Ho.has(e))return lt.debug(`There were multiple attempts to register component ${e}.`),!1;Ho.set(e,r);for(const t of hs.values())$c(t,r);for(const t of vp.values())$c(t,r);return!0}function Pa(r,e){const t=r.container.getProvider("heartbeat").getImmediate({optional:!0});return t&&t.triggerHeartbeat(),r.container.getProvider(e)}function Ap(r,e,t=yi){Pa(r,e).clearInstance(t)}function bp(r){return r==null?!1:r.settings!==void 0}/**
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
 */const Rp={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},xt=new Rh("app","Firebase",Rp);/**
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
 */class Sp{constructor(e,t,n){this._isDeleted=!1,this._options={...e},this._config={...t},this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=n,this.container.addComponent(new ls("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw xt.create("app-deleted",{appName:this._name})}}/**
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
 */const Pp=Tp;function Vp(r,e={}){let t=r;typeof e!="object"&&(e={name:e});const n={name:yi,automaticDataCollectionEnabled:!0,...e},s=n.name;if(typeof s!="string"||!s)throw xt.create("bad-app-name",{appName:String(s)});if(t||(t=Th()),!t)throw xt.create("no-options");const i=hs.get(s);if(i){if(Mt(t,i.options)&&Mt(n,i.config))return i;throw xt.create("duplicate-app",{appName:s})}const o=new Dg(s);for(const c of Ho.values())o.addComponent(c);const u=new Sp(t,n,o);return hs.set(s,u),u}function Cp(r=yi){const e=hs.get(r);if(!e&&r===yi&&Th())return Vp();if(!e)throw xt.create("no-app",{appName:r});return e}function aw(){return Array.from(hs.values())}function jn(r,e,t){var o;let n=(o=wp[r])!=null?o:r;t&&(n+=`-${t}`);const s=n.match(/\s|\//),i=e.match(/\s|\//);if(s||i){const u=[`Unable to register library "${n}" with version "${e}":`];s&&u.push(`library name "${n}" contains illegal characters (whitespace or "/")`),s&&i&&u.push("and"),i&&u.push(`version name "${e}" contains illegal characters (whitespace or "/")`),lt.warn(u.join(" "));return}Ii(new ls(`${n}-version`,()=>({library:n,version:e}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
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
 */const Dp="firebase-heartbeat-database",xp=1,ds="firebase-heartbeat-store";let Oo=null;function Dh(){return Oo||(Oo=$g(Dp,xp,{upgrade:(r,e)=>{switch(e){case 0:try{r.createObjectStore(ds)}catch(t){console.warn(t)}}}}).catch(r=>{throw xt.create("idb-open",{originalErrorMessage:r.message})})),Oo}async function Np(r){try{const t=(await Dh()).transaction(ds),n=await t.objectStore(ds).get(xh(r));return await t.done,n}catch(e){if(e instanceof mr)lt.warn(e.message);else{const t=xt.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});lt.warn(t.message)}}}async function Gc(r,e){try{const n=(await Dh()).transaction(ds,"readwrite");await n.objectStore(ds).put(e,xh(r)),await n.done}catch(t){if(t instanceof mr)lt.warn(t.message);else{const n=xt.create("idb-set",{originalErrorMessage:t==null?void 0:t.message});lt.warn(n.message)}}}function xh(r){return`${r.name}!${r.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
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
 */const kp=1024,Mp=30;class Op{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new Lp(t),this._heartbeatsCachePromise=this._storage.read().then(n=>(this._heartbeatsCache=n,n))}async triggerHeartbeat(){var e,t;try{const s=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),i=Kc();if(((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((t=this._heartbeatsCache)==null?void 0:t.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===i||this._heartbeatsCache.heartbeats.some(o=>o.date===i))return;if(this._heartbeatsCache.heartbeats.push({date:i,agent:s}),this._heartbeatsCache.heartbeats.length>Mp){const o=Bp(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(o,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(n){lt.warn(n)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const t=Kc(),{heartbeatsToSend:n,unsentEntries:s}=Fp(this._heartbeatsCache.heartbeats),i=_i(JSON.stringify({version:2,heartbeats:n}));return this._heartbeatsCache.lastSentHeartbeatDate=t,s.length>0?(this._heartbeatsCache.heartbeats=s,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),i}catch(t){return lt.warn(t),""}}}function Kc(){return new Date().toISOString().substring(0,10)}function Fp(r,e=kp){const t=[];let n=r.slice();for(const s of r){const i=t.find(o=>o.agent===s.agent);if(i){if(i.dates.push(s.date),Qc(t)>e){i.dates.pop();break}}else if(t.push({agent:s.agent,dates:[s.date]}),Qc(t)>e){t.pop();break}n=n.slice(1)}return{heartbeatsToSend:t,unsentEntries:n}}class Lp{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return bh()?wg().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const t=await Np(this.app);return t!=null&&t.heartbeats?t:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){var n;if(await this._canUseIndexedDBPromise){const s=await this.read();return Gc(this.app,{lastSentHeartbeatDate:(n=e.lastSentHeartbeatDate)!=null?n:s.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){var n;if(await this._canUseIndexedDBPromise){const s=await this.read();return Gc(this.app,{lastSentHeartbeatDate:(n=e.lastSentHeartbeatDate)!=null?n:s.lastSentHeartbeatDate,heartbeats:[...s.heartbeats,...e.heartbeats]})}else return}}function Qc(r){return _i(JSON.stringify({version:2,heartbeats:r})).length}function Bp(r){if(r.length===0)return-1;let e=0,t=r[0].date;for(let n=1;n<r.length;n++)r[n].date<t&&(t=r[n].date,e=n);return e}/**
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
 */function Up(r){Ii(new ls("platform-logger",e=>new Qg(e),"PRIVATE")),Ii(new ls("heartbeat",e=>new Op(e),"PRIVATE")),jn(Wo,zc,r),jn(Wo,zc,"esm2020"),jn("fire-js","")}Up("");var qp="firebase",jp="12.13.0";/**
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
 */jn(qp,jp,"app");var Wc=typeof globalThis!="undefined"?globalThis:typeof window!="undefined"?window:typeof global!="undefined"?global:typeof self!="undefined"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Nt,Nh;(function(){var r;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(E,_){function I(){}I.prototype=_.prototype,E.F=_.prototype,E.prototype=new I,E.prototype.constructor=E,E.D=function(w,T,S){for(var y=Array(arguments.length-2),Oe=2;Oe<arguments.length;Oe++)y[Oe-2]=arguments[Oe];return _.prototype[T].apply(w,y)}}function t(){this.blockSize=-1}function n(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.C=Array(this.blockSize),this.o=this.h=0,this.u()}e(n,t),n.prototype.u=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function s(E,_,I){I||(I=0);const w=Array(16);if(typeof _=="string")for(var T=0;T<16;++T)w[T]=_.charCodeAt(I++)|_.charCodeAt(I++)<<8|_.charCodeAt(I++)<<16|_.charCodeAt(I++)<<24;else for(T=0;T<16;++T)w[T]=_[I++]|_[I++]<<8|_[I++]<<16|_[I++]<<24;_=E.g[0],I=E.g[1],T=E.g[2];let S=E.g[3],y;y=_+(S^I&(T^S))+w[0]+3614090360&4294967295,_=I+(y<<7&4294967295|y>>>25),y=S+(T^_&(I^T))+w[1]+3905402710&4294967295,S=_+(y<<12&4294967295|y>>>20),y=T+(I^S&(_^I))+w[2]+606105819&4294967295,T=S+(y<<17&4294967295|y>>>15),y=I+(_^T&(S^_))+w[3]+3250441966&4294967295,I=T+(y<<22&4294967295|y>>>10),y=_+(S^I&(T^S))+w[4]+4118548399&4294967295,_=I+(y<<7&4294967295|y>>>25),y=S+(T^_&(I^T))+w[5]+1200080426&4294967295,S=_+(y<<12&4294967295|y>>>20),y=T+(I^S&(_^I))+w[6]+2821735955&4294967295,T=S+(y<<17&4294967295|y>>>15),y=I+(_^T&(S^_))+w[7]+4249261313&4294967295,I=T+(y<<22&4294967295|y>>>10),y=_+(S^I&(T^S))+w[8]+1770035416&4294967295,_=I+(y<<7&4294967295|y>>>25),y=S+(T^_&(I^T))+w[9]+2336552879&4294967295,S=_+(y<<12&4294967295|y>>>20),y=T+(I^S&(_^I))+w[10]+4294925233&4294967295,T=S+(y<<17&4294967295|y>>>15),y=I+(_^T&(S^_))+w[11]+2304563134&4294967295,I=T+(y<<22&4294967295|y>>>10),y=_+(S^I&(T^S))+w[12]+1804603682&4294967295,_=I+(y<<7&4294967295|y>>>25),y=S+(T^_&(I^T))+w[13]+4254626195&4294967295,S=_+(y<<12&4294967295|y>>>20),y=T+(I^S&(_^I))+w[14]+2792965006&4294967295,T=S+(y<<17&4294967295|y>>>15),y=I+(_^T&(S^_))+w[15]+1236535329&4294967295,I=T+(y<<22&4294967295|y>>>10),y=_+(T^S&(I^T))+w[1]+4129170786&4294967295,_=I+(y<<5&4294967295|y>>>27),y=S+(I^T&(_^I))+w[6]+3225465664&4294967295,S=_+(y<<9&4294967295|y>>>23),y=T+(_^I&(S^_))+w[11]+643717713&4294967295,T=S+(y<<14&4294967295|y>>>18),y=I+(S^_&(T^S))+w[0]+3921069994&4294967295,I=T+(y<<20&4294967295|y>>>12),y=_+(T^S&(I^T))+w[5]+3593408605&4294967295,_=I+(y<<5&4294967295|y>>>27),y=S+(I^T&(_^I))+w[10]+38016083&4294967295,S=_+(y<<9&4294967295|y>>>23),y=T+(_^I&(S^_))+w[15]+3634488961&4294967295,T=S+(y<<14&4294967295|y>>>18),y=I+(S^_&(T^S))+w[4]+3889429448&4294967295,I=T+(y<<20&4294967295|y>>>12),y=_+(T^S&(I^T))+w[9]+568446438&4294967295,_=I+(y<<5&4294967295|y>>>27),y=S+(I^T&(_^I))+w[14]+3275163606&4294967295,S=_+(y<<9&4294967295|y>>>23),y=T+(_^I&(S^_))+w[3]+4107603335&4294967295,T=S+(y<<14&4294967295|y>>>18),y=I+(S^_&(T^S))+w[8]+1163531501&4294967295,I=T+(y<<20&4294967295|y>>>12),y=_+(T^S&(I^T))+w[13]+2850285829&4294967295,_=I+(y<<5&4294967295|y>>>27),y=S+(I^T&(_^I))+w[2]+4243563512&4294967295,S=_+(y<<9&4294967295|y>>>23),y=T+(_^I&(S^_))+w[7]+1735328473&4294967295,T=S+(y<<14&4294967295|y>>>18),y=I+(S^_&(T^S))+w[12]+2368359562&4294967295,I=T+(y<<20&4294967295|y>>>12),y=_+(I^T^S)+w[5]+4294588738&4294967295,_=I+(y<<4&4294967295|y>>>28),y=S+(_^I^T)+w[8]+2272392833&4294967295,S=_+(y<<11&4294967295|y>>>21),y=T+(S^_^I)+w[11]+1839030562&4294967295,T=S+(y<<16&4294967295|y>>>16),y=I+(T^S^_)+w[14]+4259657740&4294967295,I=T+(y<<23&4294967295|y>>>9),y=_+(I^T^S)+w[1]+2763975236&4294967295,_=I+(y<<4&4294967295|y>>>28),y=S+(_^I^T)+w[4]+1272893353&4294967295,S=_+(y<<11&4294967295|y>>>21),y=T+(S^_^I)+w[7]+4139469664&4294967295,T=S+(y<<16&4294967295|y>>>16),y=I+(T^S^_)+w[10]+3200236656&4294967295,I=T+(y<<23&4294967295|y>>>9),y=_+(I^T^S)+w[13]+681279174&4294967295,_=I+(y<<4&4294967295|y>>>28),y=S+(_^I^T)+w[0]+3936430074&4294967295,S=_+(y<<11&4294967295|y>>>21),y=T+(S^_^I)+w[3]+3572445317&4294967295,T=S+(y<<16&4294967295|y>>>16),y=I+(T^S^_)+w[6]+76029189&4294967295,I=T+(y<<23&4294967295|y>>>9),y=_+(I^T^S)+w[9]+3654602809&4294967295,_=I+(y<<4&4294967295|y>>>28),y=S+(_^I^T)+w[12]+3873151461&4294967295,S=_+(y<<11&4294967295|y>>>21),y=T+(S^_^I)+w[15]+530742520&4294967295,T=S+(y<<16&4294967295|y>>>16),y=I+(T^S^_)+w[2]+3299628645&4294967295,I=T+(y<<23&4294967295|y>>>9),y=_+(T^(I|~S))+w[0]+4096336452&4294967295,_=I+(y<<6&4294967295|y>>>26),y=S+(I^(_|~T))+w[7]+1126891415&4294967295,S=_+(y<<10&4294967295|y>>>22),y=T+(_^(S|~I))+w[14]+2878612391&4294967295,T=S+(y<<15&4294967295|y>>>17),y=I+(S^(T|~_))+w[5]+4237533241&4294967295,I=T+(y<<21&4294967295|y>>>11),y=_+(T^(I|~S))+w[12]+1700485571&4294967295,_=I+(y<<6&4294967295|y>>>26),y=S+(I^(_|~T))+w[3]+2399980690&4294967295,S=_+(y<<10&4294967295|y>>>22),y=T+(_^(S|~I))+w[10]+4293915773&4294967295,T=S+(y<<15&4294967295|y>>>17),y=I+(S^(T|~_))+w[1]+2240044497&4294967295,I=T+(y<<21&4294967295|y>>>11),y=_+(T^(I|~S))+w[8]+1873313359&4294967295,_=I+(y<<6&4294967295|y>>>26),y=S+(I^(_|~T))+w[15]+4264355552&4294967295,S=_+(y<<10&4294967295|y>>>22),y=T+(_^(S|~I))+w[6]+2734768916&4294967295,T=S+(y<<15&4294967295|y>>>17),y=I+(S^(T|~_))+w[13]+1309151649&4294967295,I=T+(y<<21&4294967295|y>>>11),y=_+(T^(I|~S))+w[4]+4149444226&4294967295,_=I+(y<<6&4294967295|y>>>26),y=S+(I^(_|~T))+w[11]+3174756917&4294967295,S=_+(y<<10&4294967295|y>>>22),y=T+(_^(S|~I))+w[2]+718787259&4294967295,T=S+(y<<15&4294967295|y>>>17),y=I+(S^(T|~_))+w[9]+3951481745&4294967295,E.g[0]=E.g[0]+_&4294967295,E.g[1]=E.g[1]+(T+(y<<21&4294967295|y>>>11))&4294967295,E.g[2]=E.g[2]+T&4294967295,E.g[3]=E.g[3]+S&4294967295}n.prototype.v=function(E,_){_===void 0&&(_=E.length);const I=_-this.blockSize,w=this.C;let T=this.h,S=0;for(;S<_;){if(T==0)for(;S<=I;)s(this,E,S),S+=this.blockSize;if(typeof E=="string"){for(;S<_;)if(w[T++]=E.charCodeAt(S++),T==this.blockSize){s(this,w),T=0;break}}else for(;S<_;)if(w[T++]=E[S++],T==this.blockSize){s(this,w),T=0;break}}this.h=T,this.o+=_},n.prototype.A=function(){var E=Array((this.h<56?this.blockSize:this.blockSize*2)-this.h);E[0]=128;for(var _=1;_<E.length-8;++_)E[_]=0;_=this.o*8;for(var I=E.length-8;I<E.length;++I)E[I]=_&255,_/=256;for(this.v(E),E=Array(16),_=0,I=0;I<4;++I)for(let w=0;w<32;w+=8)E[_++]=this.g[I]>>>w&255;return E};function i(E,_){var I=u;return Object.prototype.hasOwnProperty.call(I,E)?I[E]:I[E]=_(E)}function o(E,_){this.h=_;const I=[];let w=!0;for(let T=E.length-1;T>=0;T--){const S=E[T]|0;w&&S==_||(I[T]=S,w=!1)}this.g=I}var u={};function c(E){return-128<=E&&E<128?i(E,function(_){return new o([_|0],_<0?-1:0)}):new o([E|0],E<0?-1:0)}function h(E){if(isNaN(E)||!isFinite(E))return m;if(E<0)return D(h(-E));const _=[];let I=1;for(let w=0;E>=I;w++)_[w]=E/I|0,I*=4294967296;return new o(_,0)}function f(E,_){if(E.length==0)throw Error("number format error: empty string");if(_=_||10,_<2||36<_)throw Error("radix out of range: "+_);if(E.charAt(0)=="-")return D(f(E.substring(1),_));if(E.indexOf("-")>=0)throw Error('number format error: interior "-" character');const I=h(Math.pow(_,8));let w=m;for(let S=0;S<E.length;S+=8){var T=Math.min(8,E.length-S);const y=parseInt(E.substring(S,S+T),_);T<8?(T=h(Math.pow(_,T)),w=w.j(T).add(h(y))):(w=w.j(I),w=w.add(h(y)))}return w}var m=c(0),p=c(1),v=c(16777216);r=o.prototype,r.m=function(){if(N(this))return-D(this).m();let E=0,_=1;for(let I=0;I<this.g.length;I++){const w=this.i(I);E+=(w>=0?w:4294967296+w)*_,_*=4294967296}return E},r.toString=function(E){if(E=E||10,E<2||36<E)throw Error("radix out of range: "+E);if(C(this))return"0";if(N(this))return"-"+D(this).toString(E);const _=h(Math.pow(E,6));var I=this;let w="";for(;;){const T=Z(I,_).g;I=B(I,T.j(_));let S=((I.g.length>0?I.g[0]:I.h)>>>0).toString(E);if(I=T,C(I))return S+w;for(;S.length<6;)S="0"+S;w=S+w}},r.i=function(E){return E<0?0:E<this.g.length?this.g[E]:this.h};function C(E){if(E.h!=0)return!1;for(let _=0;_<E.g.length;_++)if(E.g[_]!=0)return!1;return!0}function N(E){return E.h==-1}r.l=function(E){return E=B(this,E),N(E)?-1:C(E)?0:1};function D(E){const _=E.g.length,I=[];for(let w=0;w<_;w++)I[w]=~E.g[w];return new o(I,~E.h).add(p)}r.abs=function(){return N(this)?D(this):this},r.add=function(E){const _=Math.max(this.g.length,E.g.length),I=[];let w=0;for(let T=0;T<=_;T++){let S=w+(this.i(T)&65535)+(E.i(T)&65535),y=(S>>>16)+(this.i(T)>>>16)+(E.i(T)>>>16);w=y>>>16,S&=65535,y&=65535,I[T]=y<<16|S}return new o(I,I[I.length-1]&-2147483648?-1:0)};function B(E,_){return E.add(D(_))}r.j=function(E){if(C(this)||C(E))return m;if(N(this))return N(E)?D(this).j(D(E)):D(D(this).j(E));if(N(E))return D(this.j(D(E)));if(this.l(v)<0&&E.l(v)<0)return h(this.m()*E.m());const _=this.g.length+E.g.length,I=[];for(var w=0;w<2*_;w++)I[w]=0;for(w=0;w<this.g.length;w++)for(let T=0;T<E.g.length;T++){const S=this.i(w)>>>16,y=this.i(w)&65535,Oe=E.i(T)>>>16,Yt=E.i(T)&65535;I[2*w+2*T]+=y*Yt,j(I,2*w+2*T),I[2*w+2*T+1]+=S*Yt,j(I,2*w+2*T+1),I[2*w+2*T+1]+=y*Oe,j(I,2*w+2*T+1),I[2*w+2*T+2]+=S*Oe,j(I,2*w+2*T+2)}for(E=0;E<_;E++)I[E]=I[2*E+1]<<16|I[2*E];for(E=_;E<2*_;E++)I[E]=0;return new o(I,0)};function j(E,_){for(;(E[_]&65535)!=E[_];)E[_+1]+=E[_]>>>16,E[_]&=65535,_++}function q(E,_){this.g=E,this.h=_}function Z(E,_){if(C(_))throw Error("division by zero");if(C(E))return new q(m,m);if(N(E))return _=Z(D(E),_),new q(D(_.g),D(_.h));if(N(_))return _=Z(E,D(_)),new q(D(_.g),_.h);if(E.g.length>30){if(N(E)||N(_))throw Error("slowDivide_ only works with positive integers.");for(var I=p,w=_;w.l(E)<=0;)I=W(I),w=W(w);var T=J(I,1),S=J(w,1);for(w=J(w,2),I=J(I,2);!C(w);){var y=S.add(w);y.l(E)<=0&&(T=T.add(I),S=y),w=J(w,1),I=J(I,1)}return _=B(E,T.j(_)),new q(T,_)}for(T=m;E.l(_)>=0;){for(I=Math.max(1,Math.floor(E.m()/_.m())),w=Math.ceil(Math.log(I)/Math.LN2),w=w<=48?1:Math.pow(2,w-48),S=h(I),y=S.j(_);N(y)||y.l(E)>0;)I-=w,S=h(I),y=S.j(_);C(S)&&(S=p),T=T.add(S),E=B(E,y)}return new q(T,E)}r.B=function(E){return Z(this,E).h},r.and=function(E){const _=Math.max(this.g.length,E.g.length),I=[];for(let w=0;w<_;w++)I[w]=this.i(w)&E.i(w);return new o(I,this.h&E.h)},r.or=function(E){const _=Math.max(this.g.length,E.g.length),I=[];for(let w=0;w<_;w++)I[w]=this.i(w)|E.i(w);return new o(I,this.h|E.h)},r.xor=function(E){const _=Math.max(this.g.length,E.g.length),I=[];for(let w=0;w<_;w++)I[w]=this.i(w)^E.i(w);return new o(I,this.h^E.h)};function W(E){const _=E.g.length+1,I=[];for(let w=0;w<_;w++)I[w]=E.i(w)<<1|E.i(w-1)>>>31;return new o(I,E.h)}function J(E,_){const I=_>>5;_%=32;const w=E.g.length-I,T=[];for(let S=0;S<w;S++)T[S]=_>0?E.i(S+I)>>>_|E.i(S+I+1)<<32-_:E.i(S+I);return new o(T,E.h)}n.prototype.digest=n.prototype.A,n.prototype.reset=n.prototype.u,n.prototype.update=n.prototype.v,Nh=n,o.prototype.add=o.prototype.add,o.prototype.multiply=o.prototype.j,o.prototype.modulo=o.prototype.B,o.prototype.compare=o.prototype.l,o.prototype.toNumber=o.prototype.m,o.prototype.toString=o.prototype.toString,o.prototype.getBits=o.prototype.i,o.fromNumber=h,o.fromString=f,Nt=o}).apply(typeof Wc!="undefined"?Wc:typeof self!="undefined"?self:typeof window!="undefined"?window:{});var Zs=typeof globalThis!="undefined"?globalThis:typeof window!="undefined"?window:typeof global!="undefined"?global:typeof self!="undefined"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var kh,Jr,Mh,ai,Jo,Oh,Fh,Lh;(function(){var r,e=Object.defineProperty;function t(a){a=[typeof globalThis=="object"&&globalThis,a,typeof window=="object"&&window,typeof self=="object"&&self,typeof Zs=="object"&&Zs];for(var l=0;l<a.length;++l){var d=a[l];if(d&&d.Math==Math)return d}throw Error("Cannot find global object")}var n=t(this);function s(a,l){if(l)e:{var d=n;a=a.split(".");for(var g=0;g<a.length-1;g++){var b=a[g];if(!(b in d))break e;d=d[b]}a=a[a.length-1],g=d[a],l=l(g),l!=g&&l!=null&&e(d,a,{configurable:!0,writable:!0,value:l})}}s("Symbol.dispose",function(a){return a||Symbol("Symbol.dispose")}),s("Array.prototype.values",function(a){return a||function(){return this[Symbol.iterator]()}}),s("Object.entries",function(a){return a||function(l){var d=[],g;for(g in l)Object.prototype.hasOwnProperty.call(l,g)&&d.push([g,l[g]]);return d}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var i=i||{},o=this||self;function u(a){var l=typeof a;return l=="object"&&a!=null||l=="function"}function c(a,l,d){return a.call.apply(a.bind,arguments)}function h(a,l,d){return h=c,h.apply(null,arguments)}function f(a,l){var d=Array.prototype.slice.call(arguments,1);return function(){var g=d.slice();return g.push.apply(g,arguments),a.apply(this,g)}}function m(a,l){function d(){}d.prototype=l.prototype,a.Z=l.prototype,a.prototype=new d,a.prototype.constructor=a,a.Ob=function(g,b,P){for(var O=Array(arguments.length-2),G=2;G<arguments.length;G++)O[G-2]=arguments[G];return l.prototype[b].apply(g,O)}}var p=typeof AsyncContext!="undefined"&&typeof AsyncContext.Snapshot=="function"?a=>a&&AsyncContext.Snapshot.wrap(a):a=>a;function v(a){const l=a.length;if(l>0){const d=Array(l);for(let g=0;g<l;g++)d[g]=a[g];return d}return[]}function C(a,l){for(let g=1;g<arguments.length;g++){const b=arguments[g];var d=typeof b;if(d=d!="object"?d:b?Array.isArray(b)?"array":d:"null",d=="array"||d=="object"&&typeof b.length=="number"){d=a.length||0;const P=b.length||0;a.length=d+P;for(let O=0;O<P;O++)a[d+O]=b[O]}else a.push(b)}}class N{constructor(l,d){this.i=l,this.j=d,this.h=0,this.g=null}get(){let l;return this.h>0?(this.h--,l=this.g,this.g=l.next,l.next=null):l=this.i(),l}}function D(a){o.setTimeout(()=>{throw a},0)}function B(){var a=E;let l=null;return a.g&&(l=a.g,a.g=a.g.next,a.g||(a.h=null),l.next=null),l}class j{constructor(){this.h=this.g=null}add(l,d){const g=q.get();g.set(l,d),this.h?this.h.next=g:this.g=g,this.h=g}}var q=new N(()=>new Z,a=>a.reset());class Z{constructor(){this.next=this.g=this.h=null}set(l,d){this.h=l,this.g=d,this.next=null}reset(){this.next=this.g=this.h=null}}let W,J=!1,E=new j,_=()=>{const a=Promise.resolve(void 0);W=()=>{a.then(I)}};function I(){for(var a;a=B();){try{a.h.call(a.g)}catch(d){D(d)}var l=q;l.j(a),l.h<100&&(l.h++,a.next=l.g,l.g=a)}J=!1}function w(){this.u=this.u,this.C=this.C}w.prototype.u=!1,w.prototype.dispose=function(){this.u||(this.u=!0,this.N())},w.prototype[Symbol.dispose]=function(){this.dispose()},w.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function T(a,l){this.type=a,this.g=this.target=l,this.defaultPrevented=!1}T.prototype.h=function(){this.defaultPrevented=!0};var S=(function(){if(!o.addEventListener||!Object.defineProperty)return!1;var a=!1,l=Object.defineProperty({},"passive",{get:function(){a=!0}});try{const d=()=>{};o.addEventListener("test",d,l),o.removeEventListener("test",d,l)}catch(d){}return a})();function y(a){return/^[\s\xa0]*$/.test(a)}function Oe(a,l){T.call(this,a?a.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,a&&this.init(a,l)}m(Oe,T),Oe.prototype.init=function(a,l){const d=this.type=a.type,g=a.changedTouches&&a.changedTouches.length?a.changedTouches[0]:null;this.target=a.target||a.srcElement,this.g=l,l=a.relatedTarget,l||(d=="mouseover"?l=a.fromElement:d=="mouseout"&&(l=a.toElement)),this.relatedTarget=l,g?(this.clientX=g.clientX!==void 0?g.clientX:g.pageX,this.clientY=g.clientY!==void 0?g.clientY:g.pageY,this.screenX=g.screenX||0,this.screenY=g.screenY||0):(this.clientX=a.clientX!==void 0?a.clientX:a.pageX,this.clientY=a.clientY!==void 0?a.clientY:a.pageY,this.screenX=a.screenX||0,this.screenY=a.screenY||0),this.button=a.button,this.key=a.key||"",this.ctrlKey=a.ctrlKey,this.altKey=a.altKey,this.shiftKey=a.shiftKey,this.metaKey=a.metaKey,this.pointerId=a.pointerId||0,this.pointerType=a.pointerType,this.state=a.state,this.i=a,a.defaultPrevented&&Oe.Z.h.call(this)},Oe.prototype.h=function(){Oe.Z.h.call(this);const a=this.i;a.preventDefault?a.preventDefault():a.returnValue=!1};var Yt="closure_listenable_"+(Math.random()*1e6|0),xm=0;function Nm(a,l,d,g,b){this.listener=a,this.proxy=null,this.src=l,this.type=d,this.capture=!!g,this.ha=b,this.key=++xm,this.da=this.fa=!1}function Ls(a){a.da=!0,a.listener=null,a.proxy=null,a.src=null,a.ha=null}function Bs(a,l,d){for(const g in a)l.call(d,a[g],g,a)}function km(a,l){for(const d in a)l.call(void 0,a[d],d,a)}function Fu(a){const l={};for(const d in a)l[d]=a[d];return l}const Lu="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function Bu(a,l){let d,g;for(let b=1;b<arguments.length;b++){g=arguments[b];for(d in g)a[d]=g[d];for(let P=0;P<Lu.length;P++)d=Lu[P],Object.prototype.hasOwnProperty.call(g,d)&&(a[d]=g[d])}}function Us(a){this.src=a,this.g={},this.h=0}Us.prototype.add=function(a,l,d,g,b){const P=a.toString();a=this.g[P],a||(a=this.g[P]=[],this.h++);const O=uo(a,l,g,b);return O>-1?(l=a[O],d||(l.fa=!1)):(l=new Nm(l,this.src,P,!!g,b),l.fa=d,a.push(l)),l};function ao(a,l){const d=l.type;if(d in a.g){var g=a.g[d],b=Array.prototype.indexOf.call(g,l,void 0),P;(P=b>=0)&&Array.prototype.splice.call(g,b,1),P&&(Ls(l),a.g[d].length==0&&(delete a.g[d],a.h--))}}function uo(a,l,d,g){for(let b=0;b<a.length;++b){const P=a[b];if(!P.da&&P.listener==l&&P.capture==!!d&&P.ha==g)return b}return-1}var co="closure_lm_"+(Math.random()*1e6|0),lo={};function Uu(a,l,d,g,b){if(Array.isArray(l)){for(let P=0;P<l.length;P++)Uu(a,l[P],d,g,b);return null}return d=zu(d),a&&a[Yt]?a.J(l,d,u(g)?!!g.capture:!1,b):Mm(a,l,d,!1,g,b)}function Mm(a,l,d,g,b,P){if(!l)throw Error("Invalid event type");const O=u(b)?!!b.capture:!!b;let G=fo(a);if(G||(a[co]=G=new Us(a)),d=G.add(l,d,g,O,P),d.proxy)return d;if(g=Om(),d.proxy=g,g.src=a,g.listener=d,a.addEventListener)S||(b=O),b===void 0&&(b=!1),a.addEventListener(l.toString(),g,b);else if(a.attachEvent)a.attachEvent(ju(l.toString()),g);else if(a.addListener&&a.removeListener)a.addListener(g);else throw Error("addEventListener and attachEvent are unavailable.");return d}function Om(){function a(d){return l.call(a.src,a.listener,d)}const l=Fm;return a}function qu(a,l,d,g,b){if(Array.isArray(l))for(var P=0;P<l.length;P++)qu(a,l[P],d,g,b);else g=u(g)?!!g.capture:!!g,d=zu(d),a&&a[Yt]?(a=a.i,P=String(l).toString(),P in a.g&&(l=a.g[P],d=uo(l,d,g,b),d>-1&&(Ls(l[d]),Array.prototype.splice.call(l,d,1),l.length==0&&(delete a.g[P],a.h--)))):a&&(a=fo(a))&&(l=a.g[l.toString()],a=-1,l&&(a=uo(l,d,g,b)),(d=a>-1?l[a]:null)&&ho(d))}function ho(a){if(typeof a!="number"&&a&&!a.da){var l=a.src;if(l&&l[Yt])ao(l.i,a);else{var d=a.type,g=a.proxy;l.removeEventListener?l.removeEventListener(d,g,a.capture):l.detachEvent?l.detachEvent(ju(d),g):l.addListener&&l.removeListener&&l.removeListener(g),(d=fo(l))?(ao(d,a),d.h==0&&(d.src=null,l[co]=null)):Ls(a)}}}function ju(a){return a in lo?lo[a]:lo[a]="on"+a}function Fm(a,l){if(a.da)a=!0;else{l=new Oe(l,this);const d=a.listener,g=a.ha||a.src;a.fa&&ho(a),a=d.call(g,l)}return a}function fo(a){return a=a[co],a instanceof Us?a:null}var mo="__closure_events_fn_"+(Math.random()*1e9>>>0);function zu(a){return typeof a=="function"?a:(a[mo]||(a[mo]=function(l){return a.handleEvent(l)}),a[mo])}function Ve(){w.call(this),this.i=new Us(this),this.M=this,this.G=null}m(Ve,w),Ve.prototype[Yt]=!0,Ve.prototype.removeEventListener=function(a,l,d,g){qu(this,a,l,d,g)};function ke(a,l){var d,g=a.G;if(g)for(d=[];g;g=g.G)d.push(g);if(a=a.M,g=l.type||l,typeof l=="string")l=new T(l,a);else if(l instanceof T)l.target=l.target||a;else{var b=l;l=new T(g,a),Bu(l,b)}b=!0;let P,O;if(d)for(O=d.length-1;O>=0;O--)P=l.g=d[O],b=qs(P,g,!0,l)&&b;if(P=l.g=a,b=qs(P,g,!0,l)&&b,b=qs(P,g,!1,l)&&b,d)for(O=0;O<d.length;O++)P=l.g=d[O],b=qs(P,g,!1,l)&&b}Ve.prototype.N=function(){if(Ve.Z.N.call(this),this.i){var a=this.i;for(const l in a.g){const d=a.g[l];for(let g=0;g<d.length;g++)Ls(d[g]);delete a.g[l],a.h--}}this.G=null},Ve.prototype.J=function(a,l,d,g){return this.i.add(String(a),l,!1,d,g)},Ve.prototype.K=function(a,l,d,g){return this.i.add(String(a),l,!0,d,g)};function qs(a,l,d,g){if(l=a.i.g[String(l)],!l)return!0;l=l.concat();let b=!0;for(let P=0;P<l.length;++P){const O=l[P];if(O&&!O.da&&O.capture==d){const G=O.listener,Ie=O.ha||O.src;O.fa&&ao(a.i,O),b=G.call(Ie,g)!==!1&&b}}return b&&!g.defaultPrevented}function Lm(a,l){if(typeof a!="function")if(a&&typeof a.handleEvent=="function")a=h(a.handleEvent,a);else throw Error("Invalid listener argument");return Number(l)>2147483647?-1:o.setTimeout(a,l||0)}function $u(a){a.g=Lm(()=>{a.g=null,a.i&&(a.i=!1,$u(a))},a.l);const l=a.h;a.h=null,a.m.apply(null,l)}class Bm extends w{constructor(l,d){super(),this.m=l,this.l=d,this.h=null,this.i=!1,this.g=null}j(l){this.h=arguments,this.g?this.i=!0:$u(this)}N(){super.N(),this.g&&(o.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function Pr(a){w.call(this),this.h=a,this.g={}}m(Pr,w);var Gu=[];function Ku(a){Bs(a.g,function(l,d){this.g.hasOwnProperty(d)&&ho(l)},a),a.g={}}Pr.prototype.N=function(){Pr.Z.N.call(this),Ku(this)},Pr.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var go=o.JSON.stringify,Um=o.JSON.parse,qm=class{stringify(a){return o.JSON.stringify(a,void 0)}parse(a){return o.JSON.parse(a,void 0)}};function Qu(){}function Wu(){}var Vr={OPEN:"a",hb:"b",ERROR:"c",tb:"d"};function po(){T.call(this,"d")}m(po,T);function _o(){T.call(this,"c")}m(_o,T);var Xt={},Hu=null;function js(){return Hu=Hu||new Ve}Xt.Ia="serverreachability";function Ju(a){T.call(this,Xt.Ia,a)}m(Ju,T);function Cr(a){const l=js();ke(l,new Ju(l))}Xt.STAT_EVENT="statevent";function Yu(a,l){T.call(this,Xt.STAT_EVENT,a),this.stat=l}m(Yu,T);function Me(a){const l=js();ke(l,new Yu(l,a))}Xt.Ja="timingevent";function Xu(a,l){T.call(this,Xt.Ja,a),this.size=l}m(Xu,T);function Dr(a,l){if(typeof a!="function")throw Error("Fn must not be null and must be a function");return o.setTimeout(function(){a()},l)}function xr(){this.g=!0}xr.prototype.ua=function(){this.g=!1};function jm(a,l,d,g,b,P){a.info(function(){if(a.g)if(P){var O="",G=P.split("&");for(let ie=0;ie<G.length;ie++){var Ie=G[ie].split("=");if(Ie.length>1){const ve=Ie[0];Ie=Ie[1];const Xe=ve.split("_");O=Xe.length>=2&&Xe[1]=="type"?O+(ve+"="+Ie+"&"):O+(ve+"=redacted&")}}}else O=null;else O=P;return"XMLHTTP REQ ("+g+") [attempt "+b+"]: "+l+`
`+d+`
`+O})}function zm(a,l,d,g,b,P,O){a.info(function(){return"XMLHTTP RESP ("+g+") [ attempt "+b+"]: "+l+`
`+d+`
`+P+" "+O})}function Vn(a,l,d,g){a.info(function(){return"XMLHTTP TEXT ("+l+"): "+Gm(a,d)+(g?" "+g:"")})}function $m(a,l){a.info(function(){return"TIMEOUT: "+l})}xr.prototype.info=function(){};function Gm(a,l){if(!a.g)return l;if(!l)return null;try{const P=JSON.parse(l);if(P){for(a=0;a<P.length;a++)if(Array.isArray(P[a])){var d=P[a];if(!(d.length<2)){var g=d[1];if(Array.isArray(g)&&!(g.length<1)){var b=g[0];if(b!="noop"&&b!="stop"&&b!="close")for(let O=1;O<g.length;O++)g[O]=""}}}}return go(P)}catch(P){return l}}var zs={NO_ERROR:0,cb:1,qb:2,pb:3,kb:4,ob:5,rb:6,Ga:7,TIMEOUT:8,ub:9},Zu={ib:"complete",Fb:"success",ERROR:"error",Ga:"abort",xb:"ready",yb:"readystatechange",TIMEOUT:"timeout",sb:"incrementaldata",wb:"progress",lb:"downloadprogress",Nb:"uploadprogress"},ec;function yo(){}m(yo,Qu),yo.prototype.g=function(){return new XMLHttpRequest},ec=new yo;function Nr(a){return encodeURIComponent(String(a))}function Km(a){var l=1;a=a.split(":");const d=[];for(;l>0&&a.length;)d.push(a.shift()),l--;return a.length&&d.push(a.join(":")),d}function It(a,l,d,g){this.j=a,this.i=l,this.l=d,this.S=g||1,this.V=new Pr(this),this.H=45e3,this.J=null,this.o=!1,this.u=this.B=this.A=this.M=this.F=this.T=this.D=null,this.G=[],this.g=null,this.C=0,this.m=this.v=null,this.X=-1,this.K=!1,this.P=0,this.O=null,this.W=this.L=this.U=this.R=!1,this.h=new tc}function tc(){this.i=null,this.g="",this.h=!1}var nc={},Io={};function Eo(a,l,d){a.M=1,a.A=Gs(Ye(l)),a.u=d,a.R=!0,rc(a,null)}function rc(a,l){a.F=Date.now(),$s(a),a.B=Ye(a.A);var d=a.B,g=a.S;Array.isArray(g)||(g=[String(g)]),pc(d.i,"t",g),a.C=0,d=a.j.L,a.h=new tc,a.g=kc(a.j,d?l:null,!a.u),a.P>0&&(a.O=new Bm(h(a.Y,a,a.g),a.P)),l=a.V,d=a.g,g=a.ba;var b="readystatechange";Array.isArray(b)||(b&&(Gu[0]=b.toString()),b=Gu);for(let P=0;P<b.length;P++){const O=Uu(d,b[P],g||l.handleEvent,!1,l.h||l);if(!O)break;l.g[O.key]=O}l=a.J?Fu(a.J):{},a.u?(a.v||(a.v="POST"),l["Content-Type"]="application/x-www-form-urlencoded",a.g.ea(a.B,a.v,a.u,l)):(a.v="GET",a.g.ea(a.B,a.v,null,l)),Cr(),jm(a.i,a.v,a.B,a.l,a.S,a.u)}It.prototype.ba=function(a){a=a.target;const l=this.O;l&&wt(a)==3?l.j():this.Y(a)},It.prototype.Y=function(a){try{if(a==this.g)e:{const G=wt(this.g),Ie=this.g.ya(),ie=this.g.ca();if(!(G<3)&&(G!=3||this.g&&(this.h.h||this.g.la()||vc(this.g)))){this.K||G!=4||Ie==7||(Ie==8||ie<=0?Cr(3):Cr(2)),To(this);var l=this.g.ca();this.X=l;var d=Qm(this);if(this.o=l==200,zm(this.i,this.v,this.B,this.l,this.S,G,l),this.o){if(this.U&&!this.L){t:{if(this.g){var g,b=this.g;if((g=b.g?b.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!y(g)){var P=g;break t}}P=null}if(a=P)Vn(this.i,this.l,a,"Initial handshake response via X-HTTP-Initial-Response"),this.L=!0,wo(this,a);else{this.o=!1,this.m=3,Me(12),Zt(this),kr(this);break e}}if(this.R){a=!0;let ve;for(;!this.K&&this.C<d.length;)if(ve=Wm(this,d),ve==Io){G==4&&(this.m=4,Me(14),a=!1),Vn(this.i,this.l,null,"[Incomplete Response]");break}else if(ve==nc){this.m=4,Me(15),Vn(this.i,this.l,d,"[Invalid Chunk]"),a=!1;break}else Vn(this.i,this.l,ve,null),wo(this,ve);if(sc(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),G!=4||d.length!=0||this.h.h||(this.m=1,Me(16),a=!1),this.o=this.o&&a,!a)Vn(this.i,this.l,d,"[Invalid Chunked Response]"),Zt(this),kr(this);else if(d.length>0&&!this.W){this.W=!0;var O=this.j;O.g==this&&O.aa&&!O.P&&(O.j.info("Great, no buffering proxy detected. Bytes received: "+d.length),Co(O),O.P=!0,Me(11))}}else Vn(this.i,this.l,d,null),wo(this,d);G==4&&Zt(this),this.o&&!this.K&&(G==4?Cc(this.j,this):(this.o=!1,$s(this)))}else ug(this.g),l==400&&d.indexOf("Unknown SID")>0?(this.m=3,Me(12)):(this.m=0,Me(13)),Zt(this),kr(this)}}}catch(G){}finally{}};function Qm(a){if(!sc(a))return a.g.la();const l=vc(a.g);if(l==="")return"";let d="";const g=l.length,b=wt(a.g)==4;if(!a.h.i){if(typeof TextDecoder=="undefined")return Zt(a),kr(a),"";a.h.i=new o.TextDecoder}for(let P=0;P<g;P++)a.h.h=!0,d+=a.h.i.decode(l[P],{stream:!(b&&P==g-1)});return l.length=0,a.h.g+=d,a.C=0,a.h.g}function sc(a){return a.g?a.v=="GET"&&a.M!=2&&a.j.Aa:!1}function Wm(a,l){var d=a.C,g=l.indexOf(`
`,d);return g==-1?Io:(d=Number(l.substring(d,g)),isNaN(d)?nc:(g+=1,g+d>l.length?Io:(l=l.slice(g,g+d),a.C=g+d,l)))}It.prototype.cancel=function(){this.K=!0,Zt(this)};function $s(a){a.T=Date.now()+a.H,ic(a,a.H)}function ic(a,l){if(a.D!=null)throw Error("WatchDog timer not null");a.D=Dr(h(a.aa,a),l)}function To(a){a.D&&(o.clearTimeout(a.D),a.D=null)}It.prototype.aa=function(){this.D=null;const a=Date.now();a-this.T>=0?($m(this.i,this.B),this.M!=2&&(Cr(),Me(17)),Zt(this),this.m=2,kr(this)):ic(this,this.T-a)};function kr(a){a.j.I==0||a.K||Cc(a.j,a)}function Zt(a){To(a);var l=a.O;l&&typeof l.dispose=="function"&&l.dispose(),a.O=null,Ku(a.V),a.g&&(l=a.g,a.g=null,l.abort(),l.dispose())}function wo(a,l){try{var d=a.j;if(d.I!=0&&(d.g==a||vo(d.h,a))){if(!a.L&&vo(d.h,a)&&d.I==3){try{var g=d.Ba.g.parse(l)}catch(ie){g=null}if(Array.isArray(g)&&g.length==3){var b=g;if(b[0]==0){e:if(!d.v){if(d.g)if(d.g.F+3e3<a.F)Js(d),Ws(d);else break e;Vo(d),Me(18)}}else d.xa=b[1],0<d.xa-d.K&&b[2]<37500&&d.F&&d.A==0&&!d.C&&(d.C=Dr(h(d.Va,d),6e3));uc(d.h)<=1&&d.ta&&(d.ta=void 0)}else tn(d,11)}else if((a.L||d.g==a)&&Js(d),!y(l))for(b=d.Ba.g.parse(l),l=0;l<b.length;l++){let ie=b[l];const ve=ie[0];if(!(ve<=d.K))if(d.K=ve,ie=ie[1],d.I==2)if(ie[0]=="c"){d.M=ie[1],d.ba=ie[2];const Xe=ie[3];Xe!=null&&(d.ka=Xe,d.j.info("VER="+d.ka));const nn=ie[4];nn!=null&&(d.za=nn,d.j.info("SVER="+d.za));const vt=ie[5];vt!=null&&typeof vt=="number"&&vt>0&&(g=1.5*vt,d.O=g,d.j.info("backChannelRequestTimeoutMs_="+g)),g=d;const At=a.g;if(At){const Xs=At.g?At.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(Xs){var P=g.h;P.g||Xs.indexOf("spdy")==-1&&Xs.indexOf("quic")==-1&&Xs.indexOf("h2")==-1||(P.j=P.l,P.g=new Set,P.h&&(Ao(P,P.h),P.h=null))}if(g.G){const Do=At.g?At.g.getResponseHeader("X-HTTP-Session-Id"):null;Do&&(g.wa=Do,ae(g.J,g.G,Do))}}d.I=3,d.l&&d.l.ra(),d.aa&&(d.T=Date.now()-a.F,d.j.info("Handshake RTT: "+d.T+"ms")),g=d;var O=a;if(g.na=Nc(g,g.L?g.ba:null,g.W),O.L){cc(g.h,O);var G=O,Ie=g.O;Ie&&(G.H=Ie),G.D&&(To(G),$s(G)),g.g=O}else Pc(g);d.i.length>0&&Hs(d)}else ie[0]!="stop"&&ie[0]!="close"||tn(d,7);else d.I==3&&(ie[0]=="stop"||ie[0]=="close"?ie[0]=="stop"?tn(d,7):Po(d):ie[0]!="noop"&&d.l&&d.l.qa(ie),d.A=0)}}Cr(4)}catch(ie){}}var Hm=class{constructor(a,l){this.g=a,this.map=l}};function oc(a){this.l=a||10,o.PerformanceNavigationTiming?(a=o.performance.getEntriesByType("navigation"),a=a.length>0&&(a[0].nextHopProtocol=="hq"||a[0].nextHopProtocol=="h2")):a=!!(o.chrome&&o.chrome.loadTimes&&o.chrome.loadTimes()&&o.chrome.loadTimes().wasFetchedViaSpdy),this.j=a?this.l:1,this.g=null,this.j>1&&(this.g=new Set),this.h=null,this.i=[]}function ac(a){return a.h?!0:a.g?a.g.size>=a.j:!1}function uc(a){return a.h?1:a.g?a.g.size:0}function vo(a,l){return a.h?a.h==l:a.g?a.g.has(l):!1}function Ao(a,l){a.g?a.g.add(l):a.h=l}function cc(a,l){a.h&&a.h==l?a.h=null:a.g&&a.g.has(l)&&a.g.delete(l)}oc.prototype.cancel=function(){if(this.i=lc(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const a of this.g.values())a.cancel();this.g.clear()}};function lc(a){if(a.h!=null)return a.i.concat(a.h.G);if(a.g!=null&&a.g.size!==0){let l=a.i;for(const d of a.g.values())l=l.concat(d.G);return l}return v(a.i)}var hc=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function Jm(a,l){if(a){a=a.split("&");for(let d=0;d<a.length;d++){const g=a[d].indexOf("=");let b,P=null;g>=0?(b=a[d].substring(0,g),P=a[d].substring(g+1)):b=a[d],l(b,P?decodeURIComponent(P.replace(/\+/g," ")):"")}}}function Et(a){this.g=this.o=this.j="",this.u=null,this.m=this.h="",this.l=!1;let l;a instanceof Et?(this.l=a.l,Mr(this,a.j),this.o=a.o,this.g=a.g,Or(this,a.u),this.h=a.h,bo(this,_c(a.i)),this.m=a.m):a&&(l=String(a).match(hc))?(this.l=!1,Mr(this,l[1]||"",!0),this.o=Fr(l[2]||""),this.g=Fr(l[3]||"",!0),Or(this,l[4]),this.h=Fr(l[5]||"",!0),bo(this,l[6]||"",!0),this.m=Fr(l[7]||"")):(this.l=!1,this.i=new Br(null,this.l))}Et.prototype.toString=function(){const a=[];var l=this.j;l&&a.push(Lr(l,dc,!0),":");var d=this.g;return(d||l=="file")&&(a.push("//"),(l=this.o)&&a.push(Lr(l,dc,!0),"@"),a.push(Nr(d).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),d=this.u,d!=null&&a.push(":",String(d))),(d=this.h)&&(this.g&&d.charAt(0)!="/"&&a.push("/"),a.push(Lr(d,d.charAt(0)=="/"?Zm:Xm,!0))),(d=this.i.toString())&&a.push("?",d),(d=this.m)&&a.push("#",Lr(d,tg)),a.join("")},Et.prototype.resolve=function(a){const l=Ye(this);let d=!!a.j;d?Mr(l,a.j):d=!!a.o,d?l.o=a.o:d=!!a.g,d?l.g=a.g:d=a.u!=null;var g=a.h;if(d)Or(l,a.u);else if(d=!!a.h){if(g.charAt(0)!="/")if(this.g&&!this.h)g="/"+g;else{var b=l.h.lastIndexOf("/");b!=-1&&(g=l.h.slice(0,b+1)+g)}if(b=g,b==".."||b==".")g="";else if(b.indexOf("./")!=-1||b.indexOf("/.")!=-1){g=b.lastIndexOf("/",0)==0,b=b.split("/");const P=[];for(let O=0;O<b.length;){const G=b[O++];G=="."?g&&O==b.length&&P.push(""):G==".."?((P.length>1||P.length==1&&P[0]!="")&&P.pop(),g&&O==b.length&&P.push("")):(P.push(G),g=!0)}g=P.join("/")}else g=b}return d?l.h=g:d=a.i.toString()!=="",d?bo(l,_c(a.i)):d=!!a.m,d&&(l.m=a.m),l};function Ye(a){return new Et(a)}function Mr(a,l,d){a.j=d?Fr(l,!0):l,a.j&&(a.j=a.j.replace(/:$/,""))}function Or(a,l){if(l){if(l=Number(l),isNaN(l)||l<0)throw Error("Bad port number "+l);a.u=l}else a.u=null}function bo(a,l,d){l instanceof Br?(a.i=l,ng(a.i,a.l)):(d||(l=Lr(l,eg)),a.i=new Br(l,a.l))}function ae(a,l,d){a.i.set(l,d)}function Gs(a){return ae(a,"zx",Math.floor(Math.random()*2147483648).toString(36)+Math.abs(Math.floor(Math.random()*2147483648)^Date.now()).toString(36)),a}function Fr(a,l){return a?l?decodeURI(a.replace(/%25/g,"%2525")):decodeURIComponent(a):""}function Lr(a,l,d){return typeof a=="string"?(a=encodeURI(a).replace(l,Ym),d&&(a=a.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),a):null}function Ym(a){return a=a.charCodeAt(0),"%"+(a>>4&15).toString(16)+(a&15).toString(16)}var dc=/[#\/\?@]/g,Xm=/[#\?:]/g,Zm=/[#\?]/g,eg=/[#\?@]/g,tg=/#/g;function Br(a,l){this.h=this.g=null,this.i=a||null,this.j=!!l}function en(a){a.g||(a.g=new Map,a.h=0,a.i&&Jm(a.i,function(l,d){a.add(decodeURIComponent(l.replace(/\+/g," ")),d)}))}r=Br.prototype,r.add=function(a,l){en(this),this.i=null,a=Cn(this,a);let d=this.g.get(a);return d||this.g.set(a,d=[]),d.push(l),this.h+=1,this};function fc(a,l){en(a),l=Cn(a,l),a.g.has(l)&&(a.i=null,a.h-=a.g.get(l).length,a.g.delete(l))}function mc(a,l){return en(a),l=Cn(a,l),a.g.has(l)}r.forEach=function(a,l){en(this),this.g.forEach(function(d,g){d.forEach(function(b){a.call(l,b,g,this)},this)},this)};function gc(a,l){en(a);let d=[];if(typeof l=="string")mc(a,l)&&(d=d.concat(a.g.get(Cn(a,l))));else for(a=Array.from(a.g.values()),l=0;l<a.length;l++)d=d.concat(a[l]);return d}r.set=function(a,l){return en(this),this.i=null,a=Cn(this,a),mc(this,a)&&(this.h-=this.g.get(a).length),this.g.set(a,[l]),this.h+=1,this},r.get=function(a,l){return a?(a=gc(this,a),a.length>0?String(a[0]):l):l};function pc(a,l,d){fc(a,l),d.length>0&&(a.i=null,a.g.set(Cn(a,l),v(d)),a.h+=d.length)}r.toString=function(){if(this.i)return this.i;if(!this.g)return"";const a=[],l=Array.from(this.g.keys());for(let g=0;g<l.length;g++){var d=l[g];const b=Nr(d);d=gc(this,d);for(let P=0;P<d.length;P++){let O=b;d[P]!==""&&(O+="="+Nr(d[P])),a.push(O)}}return this.i=a.join("&")};function _c(a){const l=new Br;return l.i=a.i,a.g&&(l.g=new Map(a.g),l.h=a.h),l}function Cn(a,l){return l=String(l),a.j&&(l=l.toLowerCase()),l}function ng(a,l){l&&!a.j&&(en(a),a.i=null,a.g.forEach(function(d,g){const b=g.toLowerCase();g!=b&&(fc(this,g),pc(this,b,d))},a)),a.j=l}function rg(a,l){const d=new xr;if(o.Image){const g=new Image;g.onload=f(Tt,d,"TestLoadImage: loaded",!0,l,g),g.onerror=f(Tt,d,"TestLoadImage: error",!1,l,g),g.onabort=f(Tt,d,"TestLoadImage: abort",!1,l,g),g.ontimeout=f(Tt,d,"TestLoadImage: timeout",!1,l,g),o.setTimeout(function(){g.ontimeout&&g.ontimeout()},1e4),g.src=a}else l(!1)}function sg(a,l){const d=new xr,g=new AbortController,b=setTimeout(()=>{g.abort(),Tt(d,"TestPingServer: timeout",!1,l)},1e4);fetch(a,{signal:g.signal}).then(P=>{clearTimeout(b),P.ok?Tt(d,"TestPingServer: ok",!0,l):Tt(d,"TestPingServer: server error",!1,l)}).catch(()=>{clearTimeout(b),Tt(d,"TestPingServer: error",!1,l)})}function Tt(a,l,d,g,b){try{b&&(b.onload=null,b.onerror=null,b.onabort=null,b.ontimeout=null),g(d)}catch(P){}}function ig(){this.g=new qm}function Ro(a){this.i=a.Sb||null,this.h=a.ab||!1}m(Ro,Qu),Ro.prototype.g=function(){return new Ks(this.i,this.h)};function Ks(a,l){Ve.call(this),this.H=a,this.o=l,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.A=new Headers,this.h=null,this.F="GET",this.D="",this.g=!1,this.B=this.j=this.l=null,this.v=new AbortController}m(Ks,Ve),r=Ks.prototype,r.open=function(a,l){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.F=a,this.D=l,this.readyState=1,qr(this)},r.send=function(a){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");if(this.v.signal.aborted)throw this.abort(),Error("Request was aborted.");this.g=!0;const l={headers:this.A,method:this.F,credentials:this.m,cache:void 0,signal:this.v.signal};a&&(l.body=a),(this.H||o).fetch(new Request(this.D,l)).then(this.Pa.bind(this),this.ga.bind(this))},r.abort=function(){this.response=this.responseText="",this.A=new Headers,this.status=0,this.v.abort(),this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),this.readyState>=1&&this.g&&this.readyState!=4&&(this.g=!1,Ur(this)),this.readyState=0},r.Pa=function(a){if(this.g&&(this.l=a,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=a.headers,this.readyState=2,qr(this)),this.g&&(this.readyState=3,qr(this),this.g)))if(this.responseType==="arraybuffer")a.arrayBuffer().then(this.Na.bind(this),this.ga.bind(this));else if(typeof o.ReadableStream!="undefined"&&"body"in a){if(this.j=a.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.B=new TextDecoder;yc(this)}else a.text().then(this.Oa.bind(this),this.ga.bind(this))};function yc(a){a.j.read().then(a.Ma.bind(a)).catch(a.ga.bind(a))}r.Ma=function(a){if(this.g){if(this.o&&a.value)this.response.push(a.value);else if(!this.o){var l=a.value?a.value:new Uint8Array(0);(l=this.B.decode(l,{stream:!a.done}))&&(this.response=this.responseText+=l)}a.done?Ur(this):qr(this),this.readyState==3&&yc(this)}},r.Oa=function(a){this.g&&(this.response=this.responseText=a,Ur(this))},r.Na=function(a){this.g&&(this.response=a,Ur(this))},r.ga=function(){this.g&&Ur(this)};function Ur(a){a.readyState=4,a.l=null,a.j=null,a.B=null,qr(a)}r.setRequestHeader=function(a,l){this.A.append(a,l)},r.getResponseHeader=function(a){return this.h&&this.h.get(a.toLowerCase())||""},r.getAllResponseHeaders=function(){if(!this.h)return"";const a=[],l=this.h.entries();for(var d=l.next();!d.done;)d=d.value,a.push(d[0]+": "+d[1]),d=l.next();return a.join(`\r
`)};function qr(a){a.onreadystatechange&&a.onreadystatechange.call(a)}Object.defineProperty(Ks.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(a){this.m=a?"include":"same-origin"}});function Ic(a){let l="";return Bs(a,function(d,g){l+=g,l+=":",l+=d,l+=`\r
`}),l}function So(a,l,d){e:{for(g in d){var g=!1;break e}g=!0}g||(d=Ic(d),typeof a=="string"?d!=null&&Nr(d):ae(a,l,d))}function me(a){Ve.call(this),this.headers=new Map,this.L=a||null,this.h=!1,this.g=null,this.D="",this.o=0,this.l="",this.j=this.B=this.v=this.A=!1,this.m=null,this.F="",this.H=!1}m(me,Ve);var og=/^https?$/i,ag=["POST","PUT"];r=me.prototype,r.Fa=function(a){this.H=a},r.ea=function(a,l,d,g){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+a);l=l?l.toUpperCase():"GET",this.D=a,this.l="",this.o=0,this.A=!1,this.h=!0,this.g=this.L?this.L.g():ec.g(),this.g.onreadystatechange=p(h(this.Ca,this));try{this.B=!0,this.g.open(l,String(a),!0),this.B=!1}catch(P){Ec(this,P);return}if(a=d||"",d=new Map(this.headers),g)if(Object.getPrototypeOf(g)===Object.prototype)for(var b in g)d.set(b,g[b]);else if(typeof g.keys=="function"&&typeof g.get=="function")for(const P of g.keys())d.set(P,g.get(P));else throw Error("Unknown input type for opt_headers: "+String(g));g=Array.from(d.keys()).find(P=>P.toLowerCase()=="content-type"),b=o.FormData&&a instanceof o.FormData,!(Array.prototype.indexOf.call(ag,l,void 0)>=0)||g||b||d.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[P,O]of d)this.g.setRequestHeader(P,O);this.F&&(this.g.responseType=this.F),"withCredentials"in this.g&&this.g.withCredentials!==this.H&&(this.g.withCredentials=this.H);try{this.m&&(clearTimeout(this.m),this.m=null),this.v=!0,this.g.send(a),this.v=!1}catch(P){Ec(this,P)}};function Ec(a,l){a.h=!1,a.g&&(a.j=!0,a.g.abort(),a.j=!1),a.l=l,a.o=5,Tc(a),Qs(a)}function Tc(a){a.A||(a.A=!0,ke(a,"complete"),ke(a,"error"))}r.abort=function(a){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.o=a||7,ke(this,"complete"),ke(this,"abort"),Qs(this))},r.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),Qs(this,!0)),me.Z.N.call(this)},r.Ca=function(){this.u||(this.B||this.v||this.j?wc(this):this.Xa())},r.Xa=function(){wc(this)};function wc(a){if(a.h&&typeof i!="undefined"){if(a.v&&wt(a)==4)setTimeout(a.Ca.bind(a),0);else if(ke(a,"readystatechange"),wt(a)==4){a.h=!1;try{const P=a.ca();e:switch(P){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var l=!0;break e;default:l=!1}var d;if(!(d=l)){var g;if(g=P===0){let O=String(a.D).match(hc)[1]||null;!O&&o.self&&o.self.location&&(O=o.self.location.protocol.slice(0,-1)),g=!og.test(O?O.toLowerCase():"")}d=g}if(d)ke(a,"complete"),ke(a,"success");else{a.o=6;try{var b=wt(a)>2?a.g.statusText:""}catch(O){b=""}a.l=b+" ["+a.ca()+"]",Tc(a)}}finally{Qs(a)}}}}function Qs(a,l){if(a.g){a.m&&(clearTimeout(a.m),a.m=null);const d=a.g;a.g=null,l||ke(a,"ready");try{d.onreadystatechange=null}catch(g){}}}r.isActive=function(){return!!this.g};function wt(a){return a.g?a.g.readyState:0}r.ca=function(){try{return wt(this)>2?this.g.status:-1}catch(a){return-1}},r.la=function(){try{return this.g?this.g.responseText:""}catch(a){return""}},r.La=function(a){if(this.g){var l=this.g.responseText;return a&&l.indexOf(a)==0&&(l=l.substring(a.length)),Um(l)}};function vc(a){try{if(!a.g)return null;if("response"in a.g)return a.g.response;switch(a.F){case"":case"text":return a.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in a.g)return a.g.mozResponseArrayBuffer}return null}catch(l){return null}}function ug(a){const l={};a=(a.g&&wt(a)>=2&&a.g.getAllResponseHeaders()||"").split(`\r
`);for(let g=0;g<a.length;g++){if(y(a[g]))continue;var d=Km(a[g]);const b=d[0];if(d=d[1],typeof d!="string")continue;d=d.trim();const P=l[b]||[];l[b]=P,P.push(d)}km(l,function(g){return g.join(", ")})}r.ya=function(){return this.o},r.Ha=function(){return typeof this.l=="string"?this.l:String(this.l)};function jr(a,l,d){return d&&d.internalChannelParams&&d.internalChannelParams[a]||l}function Ac(a){this.za=0,this.i=[],this.j=new xr,this.ba=this.na=this.J=this.W=this.g=this.wa=this.G=this.H=this.u=this.U=this.o=null,this.Ya=this.V=0,this.Sa=jr("failFast",!1,a),this.F=this.C=this.v=this.m=this.l=null,this.X=!0,this.xa=this.K=-1,this.Y=this.A=this.D=0,this.Qa=jr("baseRetryDelayMs",5e3,a),this.Za=jr("retryDelaySeedMs",1e4,a),this.Ta=jr("forwardChannelMaxRetries",2,a),this.va=jr("forwardChannelRequestTimeoutMs",2e4,a),this.ma=a&&a.xmlHttpFactory||void 0,this.Ua=a&&a.Rb||void 0,this.Aa=a&&a.useFetchStreams||!1,this.O=void 0,this.L=a&&a.supportsCrossDomainXhr||!1,this.M="",this.h=new oc(a&&a.concurrentRequestLimit),this.Ba=new ig,this.S=a&&a.fastHandshake||!1,this.R=a&&a.encodeInitMessageHeaders||!1,this.S&&this.R&&(this.R=!1),this.Ra=a&&a.Pb||!1,a&&a.ua&&this.j.ua(),a&&a.forceLongPolling&&(this.X=!1),this.aa=!this.S&&this.X&&a&&a.detectBufferingProxy||!1,this.ia=void 0,a&&a.longPollingTimeout&&a.longPollingTimeout>0&&(this.ia=a.longPollingTimeout),this.ta=void 0,this.T=0,this.P=!1,this.ja=this.B=null}r=Ac.prototype,r.ka=8,r.I=1,r.connect=function(a,l,d,g){Me(0),this.W=a,this.H=l||{},d&&g!==void 0&&(this.H.OSID=d,this.H.OAID=g),this.F=this.X,this.J=Nc(this,null,this.W),Hs(this)};function Po(a){if(bc(a),a.I==3){var l=a.V++,d=Ye(a.J);if(ae(d,"SID",a.M),ae(d,"RID",l),ae(d,"TYPE","terminate"),zr(a,d),l=new It(a,a.j,l),l.M=2,l.A=Gs(Ye(d)),d=!1,o.navigator&&o.navigator.sendBeacon)try{d=o.navigator.sendBeacon(l.A.toString(),"")}catch(g){}!d&&o.Image&&(new Image().src=l.A,d=!0),d||(l.g=kc(l.j,null),l.g.ea(l.A)),l.F=Date.now(),$s(l)}xc(a)}function Ws(a){a.g&&(Co(a),a.g.cancel(),a.g=null)}function bc(a){Ws(a),a.v&&(o.clearTimeout(a.v),a.v=null),Js(a),a.h.cancel(),a.m&&(typeof a.m=="number"&&o.clearTimeout(a.m),a.m=null)}function Hs(a){if(!ac(a.h)&&!a.m){a.m=!0;var l=a.Ea;W||_(),J||(W(),J=!0),E.add(l,a),a.D=0}}function cg(a,l){return uc(a.h)>=a.h.j-(a.m?1:0)?!1:a.m?(a.i=l.G.concat(a.i),!0):a.I==1||a.I==2||a.D>=(a.Sa?0:a.Ta)?!1:(a.m=Dr(h(a.Ea,a,l),Dc(a,a.D)),a.D++,!0)}r.Ea=function(a){if(this.m)if(this.m=null,this.I==1){if(!a){this.V=Math.floor(Math.random()*1e5),a=this.V++;const b=new It(this,this.j,a);let P=this.o;if(this.U&&(P?(P=Fu(P),Bu(P,this.U)):P=this.U),this.u!==null||this.R||(b.J=P,P=null),this.S)e:{for(var l=0,d=0;d<this.i.length;d++){t:{var g=this.i[d];if("__data__"in g.map&&(g=g.map.__data__,typeof g=="string")){g=g.length;break t}g=void 0}if(g===void 0)break;if(l+=g,l>4096){l=d;break e}if(l===4096||d===this.i.length-1){l=d+1;break e}}l=1e3}else l=1e3;l=Sc(this,b,l),d=Ye(this.J),ae(d,"RID",a),ae(d,"CVER",22),this.G&&ae(d,"X-HTTP-Session-Id",this.G),zr(this,d),P&&(this.R?l="headers="+Nr(Ic(P))+"&"+l:this.u&&So(d,this.u,P)),Ao(this.h,b),this.Ra&&ae(d,"TYPE","init"),this.S?(ae(d,"$req",l),ae(d,"SID","null"),b.U=!0,Eo(b,d,null)):Eo(b,d,l),this.I=2}}else this.I==3&&(a?Rc(this,a):this.i.length==0||ac(this.h)||Rc(this))};function Rc(a,l){var d;l?d=l.l:d=a.V++;const g=Ye(a.J);ae(g,"SID",a.M),ae(g,"RID",d),ae(g,"AID",a.K),zr(a,g),a.u&&a.o&&So(g,a.u,a.o),d=new It(a,a.j,d,a.D+1),a.u===null&&(d.J=a.o),l&&(a.i=l.G.concat(a.i)),l=Sc(a,d,1e3),d.H=Math.round(a.va*.5)+Math.round(a.va*.5*Math.random()),Ao(a.h,d),Eo(d,g,l)}function zr(a,l){a.H&&Bs(a.H,function(d,g){ae(l,g,d)}),a.l&&Bs({},function(d,g){ae(l,g,d)})}function Sc(a,l,d){d=Math.min(a.i.length,d);const g=a.l?h(a.l.Ka,a.l,a):null;e:{var b=a.i;let G=-1;for(;;){const Ie=["count="+d];G==-1?d>0?(G=b[0].g,Ie.push("ofs="+G)):G=0:Ie.push("ofs="+G);let ie=!0;for(let ve=0;ve<d;ve++){var P=b[ve].g;const Xe=b[ve].map;if(P-=G,P<0)G=Math.max(0,b[ve].g-100),ie=!1;else try{P="req"+P+"_"||"";try{var O=Xe instanceof Map?Xe:Object.entries(Xe);for(const[nn,vt]of O){let At=vt;u(vt)&&(At=go(vt)),Ie.push(P+nn+"="+encodeURIComponent(At))}}catch(nn){throw Ie.push(P+"type="+encodeURIComponent("_badmap")),nn}}catch(nn){g&&g(Xe)}}if(ie){O=Ie.join("&");break e}}O=void 0}return a=a.i.splice(0,d),l.G=a,O}function Pc(a){if(!a.g&&!a.v){a.Y=1;var l=a.Da;W||_(),J||(W(),J=!0),E.add(l,a),a.A=0}}function Vo(a){return a.g||a.v||a.A>=3?!1:(a.Y++,a.v=Dr(h(a.Da,a),Dc(a,a.A)),a.A++,!0)}r.Da=function(){if(this.v=null,Vc(this),this.aa&&!(this.P||this.g==null||this.T<=0)){var a=4*this.T;this.j.info("BP detection timer enabled: "+a),this.B=Dr(h(this.Wa,this),a)}},r.Wa=function(){this.B&&(this.B=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.P=!0,Me(10),Ws(this),Vc(this))};function Co(a){a.B!=null&&(o.clearTimeout(a.B),a.B=null)}function Vc(a){a.g=new It(a,a.j,"rpc",a.Y),a.u===null&&(a.g.J=a.o),a.g.P=0;var l=Ye(a.na);ae(l,"RID","rpc"),ae(l,"SID",a.M),ae(l,"AID",a.K),ae(l,"CI",a.F?"0":"1"),!a.F&&a.ia&&ae(l,"TO",a.ia),ae(l,"TYPE","xmlhttp"),zr(a,l),a.u&&a.o&&So(l,a.u,a.o),a.O&&(a.g.H=a.O);var d=a.g;a=a.ba,d.M=1,d.A=Gs(Ye(l)),d.u=null,d.R=!0,rc(d,a)}r.Va=function(){this.C!=null&&(this.C=null,Ws(this),Vo(this),Me(19))};function Js(a){a.C!=null&&(o.clearTimeout(a.C),a.C=null)}function Cc(a,l){var d=null;if(a.g==l){Js(a),Co(a),a.g=null;var g=2}else if(vo(a.h,l))d=l.G,cc(a.h,l),g=1;else return;if(a.I!=0){if(l.o)if(g==1){d=l.u?l.u.length:0,l=Date.now()-l.F;var b=a.D;g=js(),ke(g,new Xu(g,d)),Hs(a)}else Pc(a);else if(b=l.m,b==3||b==0&&l.X>0||!(g==1&&cg(a,l)||g==2&&Vo(a)))switch(d&&d.length>0&&(l=a.h,l.i=l.i.concat(d)),b){case 1:tn(a,5);break;case 4:tn(a,10);break;case 3:tn(a,6);break;default:tn(a,2)}}}function Dc(a,l){let d=a.Qa+Math.floor(Math.random()*a.Za);return a.isActive()||(d*=2),d*l}function tn(a,l){if(a.j.info("Error code "+l),l==2){var d=h(a.bb,a),g=a.Ua;const b=!g;g=new Et(g||"//www.google.com/images/cleardot.gif"),o.location&&o.location.protocol=="http"||Mr(g,"https"),Gs(g),b?rg(g.toString(),d):sg(g.toString(),d)}else Me(2);a.I=0,a.l&&a.l.pa(l),xc(a),bc(a)}r.bb=function(a){a?(this.j.info("Successfully pinged google.com"),Me(2)):(this.j.info("Failed to ping google.com"),Me(1))};function xc(a){if(a.I=0,a.ja=[],a.l){const l=lc(a.h);(l.length!=0||a.i.length!=0)&&(C(a.ja,l),C(a.ja,a.i),a.h.i.length=0,v(a.i),a.i.length=0),a.l.oa()}}function Nc(a,l,d){var g=d instanceof Et?Ye(d):new Et(d);if(g.g!="")l&&(g.g=l+"."+g.g),Or(g,g.u);else{var b=o.location;g=b.protocol,l=l?l+"."+b.hostname:b.hostname,b=+b.port;const P=new Et(null);g&&Mr(P,g),l&&(P.g=l),b&&Or(P,b),d&&(P.h=d),g=P}return d=a.G,l=a.wa,d&&l&&ae(g,d,l),ae(g,"VER",a.ka),zr(a,g),g}function kc(a,l,d){if(l&&!a.L)throw Error("Can't create secondary domain capable XhrIo object.");return l=a.Aa&&!a.ma?new me(new Ro({ab:d})):new me(a.ma),l.Fa(a.L),l}r.isActive=function(){return!!this.l&&this.l.isActive(this)};function Mc(){}r=Mc.prototype,r.ra=function(){},r.qa=function(){},r.pa=function(){},r.oa=function(){},r.isActive=function(){return!0},r.Ka=function(){};function Ys(){}Ys.prototype.g=function(a,l){return new $e(a,l)};function $e(a,l){Ve.call(this),this.g=new Ac(l),this.l=a,this.h=l&&l.messageUrlParams||null,a=l&&l.messageHeaders||null,l&&l.clientProtocolHeaderRequired&&(a?a["X-Client-Protocol"]="webchannel":a={"X-Client-Protocol":"webchannel"}),this.g.o=a,a=l&&l.initMessageHeaders||null,l&&l.messageContentType&&(a?a["X-WebChannel-Content-Type"]=l.messageContentType:a={"X-WebChannel-Content-Type":l.messageContentType}),l&&l.sa&&(a?a["X-WebChannel-Client-Profile"]=l.sa:a={"X-WebChannel-Client-Profile":l.sa}),this.g.U=a,(a=l&&l.Qb)&&!y(a)&&(this.g.u=a),this.A=l&&l.supportsCrossDomainXhr||!1,this.v=l&&l.sendRawJson||!1,(l=l&&l.httpSessionIdParam)&&!y(l)&&(this.g.G=l,a=this.h,a!==null&&l in a&&(a=this.h,l in a&&delete a[l])),this.j=new Dn(this)}m($e,Ve),$e.prototype.m=function(){this.g.l=this.j,this.A&&(this.g.L=!0),this.g.connect(this.l,this.h||void 0)},$e.prototype.close=function(){Po(this.g)},$e.prototype.o=function(a){var l=this.g;if(typeof a=="string"){var d={};d.__data__=a,a=d}else this.v&&(d={},d.__data__=go(a),a=d);l.i.push(new Hm(l.Ya++,a)),l.I==3&&Hs(l)},$e.prototype.N=function(){this.g.l=null,delete this.j,Po(this.g),delete this.g,$e.Z.N.call(this)};function Oc(a){po.call(this),a.__headers__&&(this.headers=a.__headers__,this.statusCode=a.__status__,delete a.__headers__,delete a.__status__);var l=a.__sm__;if(l){e:{for(const d in l){a=d;break e}a=void 0}(this.i=a)&&(a=this.i,l=l!==null&&a in l?l[a]:void 0),this.data=l}else this.data=a}m(Oc,po);function Fc(){_o.call(this),this.status=1}m(Fc,_o);function Dn(a){this.g=a}m(Dn,Mc),Dn.prototype.ra=function(){ke(this.g,"a")},Dn.prototype.qa=function(a){ke(this.g,new Oc(a))},Dn.prototype.pa=function(a){ke(this.g,new Fc)},Dn.prototype.oa=function(){ke(this.g,"b")},Ys.prototype.createWebChannel=Ys.prototype.g,$e.prototype.send=$e.prototype.o,$e.prototype.open=$e.prototype.m,$e.prototype.close=$e.prototype.close,Lh=function(){return new Ys},Fh=function(){return js()},Oh=Xt,Jo={jb:0,mb:1,nb:2,Hb:3,Mb:4,Jb:5,Kb:6,Ib:7,Gb:8,Lb:9,PROXY:10,NOPROXY:11,Eb:12,Ab:13,Bb:14,zb:15,Cb:16,Db:17,fb:18,eb:19,gb:20},zs.NO_ERROR=0,zs.TIMEOUT=8,zs.HTTP_ERROR=6,ai=zs,Zu.COMPLETE="complete",Mh=Zu,Wu.EventType=Vr,Vr.OPEN="a",Vr.CLOSE="b",Vr.ERROR="c",Vr.MESSAGE="d",Ve.prototype.listen=Ve.prototype.J,Jr=Wu,me.prototype.listenOnce=me.prototype.K,me.prototype.getLastError=me.prototype.Ha,me.prototype.getLastErrorCode=me.prototype.ya,me.prototype.getStatus=me.prototype.ca,me.prototype.getResponseJson=me.prototype.La,me.prototype.getResponseText=me.prototype.la,me.prototype.send=me.prototype.ea,me.prototype.setWithCredentials=me.prototype.Fa,kh=me}).apply(typeof Zs!="undefined"?Zs:typeof self!="undefined"?self:typeof window!="undefined"?window:{});/**
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
 */class be{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}be.UNAUTHENTICATED=new be(null),be.GOOGLE_CREDENTIALS=new be("google-credentials-uid"),be.FIRST_PARTY=new be("first-party-uid"),be.MOCK_USER=new be("mock-user");/**
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
 */let gr="12.13.0";function zp(r){gr=r}/**
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
 *//**
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
 */const Ot=new Ph("@firebase/firestore");function Ln(){return Ot.logLevel}function $p(r){Ot.setLogLevel(r)}function x(r,...e){if(Ot.logLevel<=X.DEBUG){const t=e.map(Va);Ot.debug(`Firestore (${gr}): ${r}`,...t)}}function ge(r,...e){if(Ot.logLevel<=X.ERROR){const t=e.map(Va);Ot.error(`Firestore (${gr}): ${r}`,...t)}}function ze(r,...e){if(Ot.logLevel<=X.WARN){const t=e.map(Va);Ot.warn(`Firestore (${gr}): ${r}`,...t)}}function Va(r){if(typeof r=="string")return r;try{return(function(t){return JSON.stringify(t)})(r)}catch(e){return r}}/**
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
 */function F(r,e,t){let n="Unexpected state";typeof e=="string"?n=e:t=e,Bh(r,n,t)}function Bh(r,e,t){let n=`FIRESTORE (${gr}) INTERNAL ASSERTION FAILED: ${e} (ID: ${r.toString(16)})`;if(t!==void 0)try{n+=" CONTEXT: "+JSON.stringify(t)}catch(s){n+=" CONTEXT: "+t}throw ge(n),new Error(n)}function L(r,e,t,n){let s="Unexpected state";typeof t=="string"?s=t:n=t,r||Bh(e,s,n)}function Gp(r,e){r||F(57014,e)}function M(r,e){return r}/**
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
 */const R={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class V extends mr{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
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
 */class Se{constructor(){this.promise=new Promise(((e,t)=>{this.resolve=e,this.reject=t}))}}/**
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
 */class Uh{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class qh{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable((()=>t(be.UNAUTHENTICATED)))}shutdown(){}}class Kp{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable((()=>t(this.token.user)))}shutdown(){this.changeListener=null}}class Qp{constructor(e){this.t=e,this.currentUser=be.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,t){L(this.o===void 0,42304);let n=this.i;const s=c=>this.i!==n?(n=this.i,t(c)):Promise.resolve();let i=new Se;this.o=()=>{this.i++,this.currentUser=this.u(),i.resolve(),i=new Se,e.enqueueRetryable((()=>s(this.currentUser)))};const o=()=>{const c=i;e.enqueueRetryable((async()=>{await c.promise,await s(this.currentUser)}))},u=c=>{x("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=c,this.o&&(this.auth.addAuthTokenListener(this.o),o())};this.t.onInit((c=>u(c))),setTimeout((()=>{if(!this.auth){const c=this.t.getImmediate({optional:!0});c?u(c):(x("FirebaseAuthCredentialsProvider","Auth not yet detected"),i.resolve(),i=new Se)}}),0),o()}getToken(){const e=this.i,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then((n=>this.i!==e?(x("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):n?(L(typeof n.accessToken=="string",31837,{l:n}),new Uh(n.accessToken,this.currentUser)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return L(e===null||typeof e=="string",2055,{h:e}),new be(e)}}class Wp{constructor(e,t,n){this.P=e,this.T=t,this.I=n,this.type="FirstParty",this.user=be.FIRST_PARTY,this.R=new Map}A(){return this.I?this.I():null}get headers(){this.R.set("X-Goog-AuthUser",this.P);const e=this.A();return e&&this.R.set("Authorization",e),this.T&&this.R.set("X-Goog-Iam-Authorization-Token",this.T),this.R}}class Hp{constructor(e,t,n){this.P=e,this.T=t,this.I=n}getToken(){return Promise.resolve(new Wp(this.P,this.T,this.I))}start(e,t){e.enqueueRetryable((()=>t(be.FIRST_PARTY)))}shutdown(){}invalidateToken(){}}class Yo{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class Jp{constructor(e,t){this.V=t,this.forceRefresh=!1,this.appCheck=null,this.m=null,this.p=null,bp(e)&&e.settings.appCheckToken&&(this.p=e.settings.appCheckToken)}start(e,t){L(this.o===void 0,3512);const n=i=>{i.error!=null&&x("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${i.error.message}`);const o=i.token!==this.m;return this.m=i.token,x("FirebaseAppCheckTokenProvider",`Received ${o?"new":"existing"} token.`),o?t(i.token):Promise.resolve()};this.o=i=>{e.enqueueRetryable((()=>n(i)))};const s=i=>{x("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=i,this.o&&this.appCheck.addTokenListener(this.o)};this.V.onInit((i=>s(i))),setTimeout((()=>{if(!this.appCheck){const i=this.V.getImmediate({optional:!0});i?s(i):x("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}}),0)}getToken(){if(this.p)return Promise.resolve(new Yo(this.p));const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then((t=>t?(L(typeof t.token=="string",44558,{tokenResult:t}),this.m=t.token,new Yo(t.token)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}class Yp{getToken(){return Promise.resolve(new Yo(""))}invalidateToken(){}start(e,t){}shutdown(){}}/**
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
 */function Xp(r){const e=typeof self!="undefined"&&(self.crypto||self.msCrypto),t=new Uint8Array(r);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(t);else for(let n=0;n<r;n++)t[n]=Math.floor(256*Math.random());return t}/**
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
 */class Oi{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=62*Math.floor(4.129032258064516);let n="";for(;n.length<20;){const s=Xp(40);for(let i=0;i<s.length;++i)n.length<20&&s[i]<t&&(n+=e.charAt(s[i]%62))}return n}}function z(r,e){return r<e?-1:r>e?1:0}function Xo(r,e){const t=Math.min(r.length,e.length);for(let n=0;n<t;n++){const s=r.charAt(n),i=e.charAt(n);if(s!==i)return Fo(s)===Fo(i)?z(s,i):Fo(s)?1:-1}return z(r.length,e.length)}const Zp=55296,e_=57343;function Fo(r){const e=r.charCodeAt(0);return e>=Zp&&e<=e_}function Qn(r,e,t){return r.length===e.length&&r.every(((n,s)=>t(n,e[s])))}function jh(r){return r+"\0"}/**
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
 */const Zo="__name__";class Ze{constructor(e,t,n){t===void 0?t=0:t>e.length&&F(637,{offset:t,range:e.length}),n===void 0?n=e.length-t:n>e.length-t&&F(1746,{length:n,range:e.length-t}),this.segments=e,this.offset=t,this.len=n}get length(){return this.len}isEqual(e){return Ze.comparator(this,e)===0}child(e){const t=this.segments.slice(this.offset,this.limit());return e instanceof Ze?e.forEach((n=>{t.push(n)})):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,n=this.limit();t<n;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){const n=Math.min(e.length,t.length);for(let s=0;s<n;s++){const i=Ze.compareSegments(e.get(s),t.get(s));if(i!==0)return i}return z(e.length,t.length)}static compareSegments(e,t){const n=Ze.isNumericId(e),s=Ze.isNumericId(t);return n&&!s?-1:!n&&s?1:n&&s?Ze.extractNumericId(e).compare(Ze.extractNumericId(t)):Xo(e,t)}static isNumericId(e){return e.startsWith("__id")&&e.endsWith("__")}static extractNumericId(e){return Nt.fromString(e.substring(4,e.length-2))}}class K extends Ze{construct(e,t,n){return new K(e,t,n)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const t=[];for(const n of e){if(n.indexOf("//")>=0)throw new V(R.INVALID_ARGUMENT,`Invalid segment (${n}). Paths must not contain // in them.`);t.push(...n.split("/").filter((s=>s.length>0)))}return new K(t)}static emptyPath(){return new K([])}}const t_=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class ce extends Ze{construct(e,t,n){return new ce(e,t,n)}static isValidIdentifier(e){return t_.test(e)}canonicalString(){return this.toArray().map((e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),ce.isValidIdentifier(e)||(e="`"+e+"`"),e))).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)===Zo}static keyField(){return new ce([Zo])}static fromServerFormat(e){const t=[];let n="",s=0;const i=()=>{if(n.length===0)throw new V(R.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(n),n=""};let o=!1;for(;s<e.length;){const u=e[s];if(u==="\\"){if(s+1===e.length)throw new V(R.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const c=e[s+1];if(c!=="\\"&&c!=="."&&c!=="`")throw new V(R.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);n+=c,s+=2}else u==="`"?(o=!o,s++):u!=="."||o?(n+=u,s++):(i(),s++)}if(i(),o)throw new V(R.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new ce(t)}static emptyPath(){return new ce([])}}/**
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
 */class k{constructor(e){this.path=e}static fromPath(e){return new k(K.fromString(e))}static fromName(e){return new k(K.fromString(e).popFirst(5))}static empty(){return new k(K.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&K.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,t){return K.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new k(new K(e.slice()))}}/**
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
 */function Ca(r,e,t){if(!t)throw new V(R.INVALID_ARGUMENT,`Function ${r}() cannot be called with an empty ${e}.`)}function zh(r,e,t,n){if(e===!0&&n===!0)throw new V(R.INVALID_ARGUMENT,`${r} and ${t} cannot be used together.`)}function Hc(r){if(!k.isDocumentKey(r))throw new V(R.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${r} has ${r.length}.`)}function Jc(r){if(k.isDocumentKey(r))throw new V(R.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${r} has ${r.length}.`)}function $h(r){return typeof r=="object"&&r!==null&&(Object.getPrototypeOf(r)===Object.prototype||Object.getPrototypeOf(r)===null)}function Fi(r){if(r===void 0)return"undefined";if(r===null)return"null";if(typeof r=="string")return r.length>20&&(r=`${r.substring(0,20)}...`),JSON.stringify(r);if(typeof r=="number"||typeof r=="boolean")return""+r;if(typeof r=="object"){if(r instanceof Array)return"an array";{const e=(function(n){return n.constructor?n.constructor.name:null})(r);return e?`a custom ${e} object`:"an object"}}return typeof r=="function"?"a function":F(12329,{type:typeof r})}function Q(r,e){if("_delegate"in r&&(r=r._delegate),!(r instanceof e)){if(e.name===r.constructor.name)throw new V(R.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const t=Fi(r);throw new V(R.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${t}`)}}return r}function Gh(r,e){if(e<=0)throw new V(R.INVALID_ARGUMENT,`Function ${r}() requires a positive number, but it was: ${e}.`)}/**
 * @license
 * Copyright 2025 Google LLC
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
 */function ye(r,e){const t={typeString:r};return e&&(t.value=e),t}function vn(r,e){if(!$h(r))throw new V(R.INVALID_ARGUMENT,"JSON must be an object");let t;for(const n in e)if(e[n]){const s=e[n].typeString,i="value"in e[n]?{value:e[n].value}:void 0;if(!(n in r)){t=`JSON missing required field: '${n}'`;break}const o=r[n];if(s&&typeof o!==s){t=`JSON field '${n}' must be a ${s}.`;break}if(i!==void 0&&o!==i.value){t=`Expected '${n}' field to equal '${i.value}'`;break}}if(t)throw new V(R.INVALID_ARGUMENT,t);return!0}/**
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
 */const Yc=-62135596800,Xc=1e6;class ee{static now(){return ee.fromMillis(Date.now())}static fromDate(e){return ee.fromMillis(e.getTime())}static fromMillis(e){const t=Math.floor(e/1e3),n=Math.floor((e-1e3*t)*Xc);return new ee(t,n)}constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new V(R.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new V(R.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<Yc)throw new V(R.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new V(R.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/Xc}_compareTo(e){return this.seconds===e.seconds?z(this.nanoseconds,e.nanoseconds):z(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{type:ee._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(e){if(vn(e,ee._jsonSchema))return new ee(e.seconds,e.nanoseconds)}valueOf(){const e=this.seconds-Yc;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}ee._jsonSchemaVersion="firestore/timestamp/1.0",ee._jsonSchema={type:ye("string",ee._jsonSchemaVersion),seconds:ye("number"),nanoseconds:ye("number")};/**
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
 */class U{static fromTimestamp(e){return new U(e)}static min(){return new U(new ee(0,0))}static max(){return new U(new ee(253402300799,999999999))}constructor(e){this.timestamp=e}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
 * @license
 * Copyright 2021 Google LLC
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
 */const Wn=-1;class Hn{constructor(e,t,n,s){this.indexId=e,this.collectionGroup=t,this.fields=n,this.indexState=s}}function ea(r){return r.fields.find((e=>e.kind===2))}function on(r){return r.fields.filter((e=>e.kind!==2))}function n_(r,e){let t=z(r.collectionGroup,e.collectionGroup);if(t!==0)return t;for(let n=0;n<Math.min(r.fields.length,e.fields.length);++n)if(t=r_(r.fields[n],e.fields[n]),t!==0)return t;return z(r.fields.length,e.fields.length)}Hn.UNKNOWN_ID=-1;class fn{constructor(e,t){this.fieldPath=e,this.kind=t}}function r_(r,e){const t=ce.comparator(r.fieldPath,e.fieldPath);return t!==0?t:z(r.kind,e.kind)}class Jn{constructor(e,t){this.sequenceNumber=e,this.offset=t}static empty(){return new Jn(0,Qe.min())}}function Kh(r,e){const t=r.toTimestamp().seconds,n=r.toTimestamp().nanoseconds+1,s=U.fromTimestamp(n===1e9?new ee(t+1,0):new ee(t,n));return new Qe(s,k.empty(),e)}function Qh(r){return new Qe(r.readTime,r.key,Wn)}class Qe{constructor(e,t,n){this.readTime=e,this.documentKey=t,this.largestBatchId=n}static min(){return new Qe(U.min(),k.empty(),Wn)}static max(){return new Qe(U.max(),k.empty(),Wn)}}function Da(r,e){let t=r.readTime.compareTo(e.readTime);return t!==0?t:(t=k.comparator(r.documentKey,e.documentKey),t!==0?t:z(r.largestBatchId,e.largestBatchId))}/**
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
 */const Wh="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class Hh{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach((e=>e()))}}/**
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
 */async function $t(r){if(r.code!==R.FAILED_PRECONDITION||r.message!==Wh)throw r;x("LocalStore","Unexpectedly lost primary lease")}/**
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
 */class A{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e((t=>{this.isDone=!0,this.result=t,this.nextCallback&&this.nextCallback(t)}),(t=>{this.isDone=!0,this.error=t,this.catchCallback&&this.catchCallback(t)}))}catch(e){return this.next(void 0,e)}next(e,t){return this.callbackAttached&&F(59440),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(t,this.error):this.wrapSuccess(e,this.result):new A(((n,s)=>{this.nextCallback=i=>{this.wrapSuccess(e,i).next(n,s)},this.catchCallback=i=>{this.wrapFailure(t,i).next(n,s)}}))}toPromise(){return new Promise(((e,t)=>{this.next(e,t)}))}wrapUserFunction(e){try{const t=e();return t instanceof A?t:A.resolve(t)}catch(t){return A.reject(t)}}wrapSuccess(e,t){return e?this.wrapUserFunction((()=>e(t))):A.resolve(t)}wrapFailure(e,t){return e?this.wrapUserFunction((()=>e(t))):A.reject(t)}static resolve(e){return new A(((t,n)=>{t(e)}))}static reject(e){return new A(((t,n)=>{n(e)}))}static waitFor(e){return new A(((t,n)=>{let s=0,i=0,o=!1;e.forEach((u=>{++s,u.next((()=>{++i,o&&i===s&&t()}),(c=>n(c)))})),o=!0,i===s&&t()}))}static or(e){let t=A.resolve(!1);for(const n of e)t=t.next((s=>s?A.resolve(s):n()));return t}static forEach(e,t){const n=[];return e.forEach(((s,i)=>{n.push(t.call(this,s,i))})),this.waitFor(n)}static mapArray(e,t){return new A(((n,s)=>{const i=e.length,o=new Array(i);let u=0;for(let c=0;c<i;c++){const h=c;t(e[h]).next((f=>{o[h]=f,++u,u===i&&n(o)}),(f=>s(f)))}}))}static doWhile(e,t){return new A(((n,s)=>{const i=()=>{e()===!0?t().next((()=>{i()}),s):n()};i()}))}}/**
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
 */const Ge="SimpleDb";class Li{static open(e,t,n,s){try{return new Li(t,e.transaction(s,n))}catch(i){throw new es(t,i)}}constructor(e,t){this.action=e,this.transaction=t,this.aborted=!1,this.S=new Se,this.transaction.oncomplete=()=>{this.S.resolve()},this.transaction.onabort=()=>{t.error?this.S.reject(new es(e,t.error)):this.S.resolve()},this.transaction.onerror=n=>{const s=xa(n.target.error);this.S.reject(new es(e,s))}}get D(){return this.S.promise}abort(e){e&&this.S.reject(e),this.aborted||(x(Ge,"Aborting transaction:",e?e.message:"Client-initiated abort"),this.aborted=!0,this.transaction.abort())}C(){const e=this.transaction;this.aborted||typeof e.commit!="function"||e.commit()}store(e){const t=this.transaction.objectStore(e);return new i_(t)}}class st{static delete(e){return x(Ge,"Removing database:",e),un(Eh().indexedDB.deleteDatabase(e)).toPromise()}static v(){if(!bh())return!1;if(st.F())return!0;const e=Kn(),t=st.M(e),n=0<t&&t<10,s=Jh(e),i=0<s&&s<4.5;return!(e.indexOf("MSIE ")>0||e.indexOf("Trident/")>0||e.indexOf("Edge/")>0||n||i)}static F(){var e;return typeof process!="undefined"&&((e=process.__PRIVATE_env)==null?void 0:e.__PRIVATE_USE_MOCK_PERSISTENCE)==="YES"}static O(e,t){return e.store(t)}static M(e){const t=e.match(/i(?:phone|pad|pod) os ([\d_]+)/i),n=t?t[1].split("_").slice(0,2).join("."):"-1";return Number(n)}constructor(e,t,n){this.name=e,this.version=t,this.N=n,this.B=null,st.M(Kn())===12.2&&ge("Firestore persistence suffers from a bug in iOS 12.2 Safari that may cause your app to stop working. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.")}async L(e){return this.db||(x(Ge,"Opening database:",this.name),this.db=await new Promise(((t,n)=>{const s=indexedDB.open(this.name,this.version);s.onsuccess=i=>{const o=i.target.result;t(o)},s.onblocked=()=>{n(new es(e,"Cannot upgrade IndexedDB schema while another tab is open. Close all tabs that access Firestore and reload this page to proceed."))},s.onerror=i=>{const o=i.target.error;o.name==="VersionError"?n(new V(R.FAILED_PRECONDITION,"A newer version of the Firestore SDK was previously used and so the persisted data is not compatible with the version of the SDK you are now using. The SDK will operate with persistence disabled. If you need persistence, please re-upgrade to a newer version of the SDK or else clear the persisted IndexedDB data for your app to start fresh.")):o.name==="InvalidStateError"?n(new V(R.FAILED_PRECONDITION,"Unable to open an IndexedDB connection. This could be due to running in a private browsing session on a browser whose private browsing sessions do not support IndexedDB: "+o)):n(new es(e,o))},s.onupgradeneeded=i=>{x(Ge,'Database "'+this.name+'" requires upgrade from version:',i.oldVersion);const o=i.target.result;this.N.k(o,s.transaction,i.oldVersion,this.version).next((()=>{x(Ge,"Database upgrade to version "+this.version+" complete")}))}}))),this.K&&(this.db.onversionchange=t=>this.K(t)),this.db}q(e){this.K=e,this.db&&(this.db.onversionchange=t=>e(t))}async runTransaction(e,t,n,s){const i=t==="readonly";let o=0;for(;;){++o;try{this.db=await this.L(e);const u=Li.open(this.db,e,i?"readonly":"readwrite",n),c=s(u).next((h=>(u.C(),h))).catch((h=>(u.abort(h),A.reject(h)))).toPromise();return c.catch((()=>{})),await u.D,c}catch(u){const c=u,h=c.name!=="FirebaseError"&&o<3;if(x(Ge,"Transaction failed with error:",c.message,"Retrying:",h),this.close(),!h)return Promise.reject(c)}}}close(){this.db&&this.db.close(),this.db=void 0}}function Jh(r){const e=r.match(/Android ([\d.]+)/i),t=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(t)}class s_{constructor(e){this.U=e,this.$=!1,this.W=null}get isDone(){return this.$}get G(){return this.W}set cursor(e){this.U=e}done(){this.$=!0}j(e){this.W=e}delete(){return un(this.U.delete())}}class es extends V{constructor(e,t){super(R.UNAVAILABLE,`IndexedDB transaction '${e}' failed: ${t}`),this.name="IndexedDbTransactionError"}}function Gt(r){return r.name==="IndexedDbTransactionError"}class i_{constructor(e){this.store=e}put(e,t){let n;return t!==void 0?(x(Ge,"PUT",this.store.name,e,t),n=this.store.put(t,e)):(x(Ge,"PUT",this.store.name,"<auto-key>",e),n=this.store.put(e)),un(n)}add(e){return x(Ge,"ADD",this.store.name,e,e),un(this.store.add(e))}get(e){return un(this.store.get(e)).next((t=>(t===void 0&&(t=null),x(Ge,"GET",this.store.name,e,t),t)))}delete(e){return x(Ge,"DELETE",this.store.name,e),un(this.store.delete(e))}count(){return x(Ge,"COUNT",this.store.name),un(this.store.count())}J(e,t){const n=this.options(e,t),s=n.index?this.store.index(n.index):this.store;if(typeof s.getAll=="function"){const i=s.getAll(n.range);return new A(((o,u)=>{i.onerror=c=>{u(c.target.error)},i.onsuccess=c=>{o(c.target.result)}}))}{const i=this.cursor(n),o=[];return this.H(i,((u,c)=>{o.push(c)})).next((()=>o))}}Z(e,t){const n=this.store.getAll(e,t===null?void 0:t);return new A(((s,i)=>{n.onerror=o=>{i(o.target.error)},n.onsuccess=o=>{s(o.target.result)}}))}X(e,t){x(Ge,"DELETE ALL",this.store.name);const n=this.options(e,t);n.Y=!1;const s=this.cursor(n);return this.H(s,((i,o,u)=>u.delete()))}ee(e,t){let n;t?n=e:(n={},t=e);const s=this.cursor(n);return this.H(s,t)}te(e){const t=this.cursor({});return new A(((n,s)=>{t.onerror=i=>{const o=xa(i.target.error);s(o)},t.onsuccess=i=>{const o=i.target.result;o?e(o.primaryKey,o.value).next((u=>{u?o.continue():n()})):n()}}))}H(e,t){const n=[];return new A(((s,i)=>{e.onerror=o=>{i(o.target.error)},e.onsuccess=o=>{const u=o.target.result;if(!u)return void s();const c=new s_(u),h=t(u.primaryKey,u.value,c);if(h instanceof A){const f=h.catch((m=>(c.done(),A.reject(m))));n.push(f)}c.isDone?s():c.G===null?u.continue():u.continue(c.G)}})).next((()=>A.waitFor(n)))}options(e,t){let n;return e!==void 0&&(typeof e=="string"?n=e:t=e),{index:n,range:t}}cursor(e){let t="next";if(e.reverse&&(t="prev"),e.index){const n=this.store.index(e.index);return e.Y?n.openKeyCursor(e.range,t):n.openCursor(e.range,t)}return this.store.openCursor(e.range,t)}}function un(r){return new A(((e,t)=>{r.onsuccess=n=>{const s=n.target.result;e(s)},r.onerror=n=>{const s=xa(n.target.error);t(s)}}))}let Zc=!1;function xa(r){const e=st.M(Kn());if(e>=12.2&&e<13){const t="An internal error was encountered in the Indexed Database server";if(r.message.indexOf(t)>=0){const n=new V("internal",`IOS_INDEXEDDB_BUG1: IndexedDb has thrown '${t}'. This is likely due to an unavoidable bug in iOS. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.`);return Zc||(Zc=!0,setTimeout((()=>{throw n}),0)),n}}return r}const ts="IndexBackfiller";class o_{constructor(e,t){this.asyncQueue=e,this.ne=t,this.task=null}start(){this.re(15e3)}stop(){this.task&&(this.task.cancel(),this.task=null)}get started(){return this.task!==null}re(e){x(ts,`Scheduled in ${e}ms`),this.task=this.asyncQueue.enqueueAfterDelay("index_backfill",e,(async()=>{this.task=null;try{const t=await this.ne.ie();x(ts,`Documents written: ${t}`)}catch(t){Gt(t)?x(ts,"Ignoring IndexedDB error during index backfill: ",t):await $t(t)}await this.re(6e4)}))}}class a_{constructor(e,t){this.localStore=e,this.persistence=t}async ie(e=50){return this.persistence.runTransaction("Backfill Indexes","readwrite-primary",(t=>this.se(t,e)))}se(e,t){const n=new Set;let s=t,i=!0;return A.doWhile((()=>i===!0&&s>0),(()=>this.localStore.indexManager.getNextCollectionGroupToUpdate(e).next((o=>{if(o!==null&&!n.has(o))return x(ts,`Processing collection: ${o}`),this.oe(e,o,s).next((u=>{s-=u,n.add(o)}));i=!1})))).next((()=>t-s))}oe(e,t,n){return this.localStore.indexManager.getMinOffsetFromCollectionGroup(e,t).next((s=>this.localStore.localDocuments.getNextDocuments(e,t,s,n).next((i=>{const o=i.changes;return this.localStore.indexManager.updateIndexEntries(e,o).next((()=>this._e(s,i))).next((u=>(x(ts,`Updating offset: ${u}`),this.localStore.indexManager.updateCollectionGroup(e,t,u)))).next((()=>o.size))}))))}_e(e,t){let n=e;return t.changes.forEach(((s,i)=>{const o=Qh(i);Da(o,n)>0&&(n=o)})),new Qe(n.readTime,n.documentKey,Math.max(t.batchId,e.largestBatchId))}}/**
 * @license
 * Copyright 2018 Google LLC
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
 */class Le{constructor(e,t){this.previousValue=e,t&&(t.sequenceNumberHandler=n=>this.ae(n),this.ue=n=>t.writeSequenceNumber(n))}ae(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.ue&&this.ue(e),e}}Le.ce=-1;/**
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
 */const kt=-1;function bs(r){return r==null}function fs(r){return r===0&&1/r==-1/0}function Yh(r){return typeof r=="number"&&Number.isInteger(r)&&!fs(r)&&r<=Number.MAX_SAFE_INTEGER&&r>=Number.MIN_SAFE_INTEGER}/**
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
 */const Ei="";function xe(r){let e="";for(let t=0;t<r.length;t++)e.length>0&&(e=el(e)),e=u_(r.get(t),e);return el(e)}function u_(r,e){let t=e;const n=r.length;for(let s=0;s<n;s++){const i=r.charAt(s);switch(i){case"\0":t+="";break;case Ei:t+="";break;default:t+=i}}return t}function el(r){return r+Ei+""}function tt(r){const e=r.length;if(L(e>=2,64408,{path:r}),e===2)return L(r.charAt(0)===Ei&&r.charAt(1)==="",56145,{path:r}),K.emptyPath();const t=e-2,n=[];let s="";for(let i=0;i<e;){const o=r.indexOf(Ei,i);switch((o<0||o>t)&&F(50515,{path:r}),r.charAt(o+1)){case"":const u=r.substring(i,o);let c;s.length===0?c=u:(s+=u,c=s,s=""),n.push(c);break;case"":s+=r.substring(i,o),s+="\0";break;case"":s+=r.substring(i,o+1);break;default:F(61167,{path:r})}i=o+2}return new K(n)}/**
 * @license
 * Copyright 2022 Google LLC
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
 */const an="remoteDocuments",Rs="owner",xn="owner",ms="mutationQueues",c_="userId",We="mutations",tl="batchId",dn="userMutationsIndex",nl=["userId","batchId"];/**
 * @license
 * Copyright 2022 Google LLC
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
 */function ui(r,e){return[r,xe(e)]}function Xh(r,e,t){return[r,xe(e),t]}const l_={},Yn="documentMutations",Ti="remoteDocumentsV14",h_=["prefixPath","collectionGroup","readTime","documentId"],ci="documentKeyIndex",d_=["prefixPath","collectionGroup","documentId"],Zh="collectionGroupIndex",f_=["collectionGroup","readTime","prefixPath","documentId"],gs="remoteDocumentGlobal",ta="remoteDocumentGlobalKey",Xn="targets",ed="queryTargetsIndex",m_=["canonicalId","targetId"],Zn="targetDocuments",g_=["targetId","path"],Na="documentTargetsIndex",p_=["path","targetId"],wi="targetGlobalKey",mn="targetGlobal",ps="collectionParents",__=["collectionId","parent"],er="clientMetadata",y_="clientId",Bi="bundles",I_="bundleId",Ui="namedQueries",E_="name",ka="indexConfiguration",T_="indexId",na="collectionGroupIndex",w_="collectionGroup",ns="indexState",v_=["indexId","uid"],td="sequenceNumberIndex",A_=["uid","sequenceNumber"],rs="indexEntries",b_=["indexId","uid","arrayValue","directionalValue","orderedDocumentKey","documentKey"],nd="documentKeyIndex",R_=["indexId","uid","orderedDocumentKey"],qi="documentOverlays",S_=["userId","collectionPath","documentId"],ra="collectionPathOverlayIndex",P_=["userId","collectionPath","largestBatchId"],rd="collectionGroupOverlayIndex",V_=["userId","collectionGroup","largestBatchId"],Ma="globals",C_="name",sd=[ms,We,Yn,an,Xn,Rs,mn,Zn,er,gs,ps,Bi,Ui],D_=[...sd,qi],id=[ms,We,Yn,Ti,Xn,Rs,mn,Zn,er,gs,ps,Bi,Ui,qi],od=id,Oa=[...od,ka,ns,rs],x_=Oa,ad=[...Oa,Ma],N_=ad;/**
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
 */class sa extends Hh{constructor(e,t){super(),this.le=e,this.currentSequenceNumber=t}}function we(r,e){const t=M(r);return st.O(t.le,e)}/**
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
 */function rl(r){let e=0;for(const t in r)Object.prototype.hasOwnProperty.call(r,t)&&e++;return e}function Kt(r,e){for(const t in r)Object.prototype.hasOwnProperty.call(r,t)&&e(t,r[t])}function ud(r,e){const t=[];for(const n in r)Object.prototype.hasOwnProperty.call(r,n)&&t.push(e(r[n],n,r));return t}function cd(r){for(const e in r)if(Object.prototype.hasOwnProperty.call(r,e))return!1;return!0}/**
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
 */class oe{constructor(e,t){this.comparator=e,this.root=t||Pe.EMPTY}insert(e,t){return new oe(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,Pe.BLACK,null,null))}remove(e){return new oe(this.comparator,this.root.remove(e,this.comparator).copy(null,null,Pe.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){const n=this.comparator(e,t.key);if(n===0)return t.value;n<0?t=t.left:n>0&&(t=t.right)}return null}indexOf(e){let t=0,n=this.root;for(;!n.isEmpty();){const s=this.comparator(e,n.key);if(s===0)return t+n.left.size;s<0?n=n.left:(t+=n.left.size+1,n=n.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal(((t,n)=>(e(t,n),!1)))}toString(){const e=[];return this.inorderTraversal(((t,n)=>(e.push(`${t}:${n}`),!1))),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new ei(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new ei(this.root,e,this.comparator,!1)}getReverseIterator(){return new ei(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new ei(this.root,e,this.comparator,!0)}}class ei{constructor(e,t,n,s){this.isReverse=s,this.nodeStack=[];let i=1;for(;!e.isEmpty();)if(i=t?n(e.key,t):1,t&&s&&(i*=-1),i<0)e=this.isReverse?e.left:e.right;else{if(i===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class Pe{constructor(e,t,n,s,i){this.key=e,this.value=t,this.color=n!=null?n:Pe.RED,this.left=s!=null?s:Pe.EMPTY,this.right=i!=null?i:Pe.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,n,s,i){return new Pe(e!=null?e:this.key,t!=null?t:this.value,n!=null?n:this.color,s!=null?s:this.left,i!=null?i:this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,n){let s=this;const i=n(e,s.key);return s=i<0?s.copy(null,null,null,s.left.insert(e,t,n),null):i===0?s.copy(null,t,null,null,null):s.copy(null,null,null,null,s.right.insert(e,t,n)),s.fixUp()}removeMin(){if(this.left.isEmpty())return Pe.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,t){let n,s=this;if(t(e,s.key)<0)s.left.isEmpty()||s.left.isRed()||s.left.left.isRed()||(s=s.moveRedLeft()),s=s.copy(null,null,null,s.left.remove(e,t),null);else{if(s.left.isRed()&&(s=s.rotateRight()),s.right.isEmpty()||s.right.isRed()||s.right.left.isRed()||(s=s.moveRedRight()),t(e,s.key)===0){if(s.right.isEmpty())return Pe.EMPTY;n=s.right.min(),s=s.copy(n.key,n.value,null,null,s.right.removeMin())}s=s.copy(null,null,null,null,s.right.remove(e,t))}return s.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,Pe.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,Pe.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed())throw F(43730,{key:this.key,value:this.value});if(this.right.isRed())throw F(14113,{key:this.key,value:this.value});const e=this.left.check();if(e!==this.right.check())throw F(27949);return e+(this.isRed()?0:1)}}Pe.EMPTY=null,Pe.RED=!0,Pe.BLACK=!1;Pe.EMPTY=new class{constructor(){this.size=0}get key(){throw F(57766)}get value(){throw F(16141)}get color(){throw F(16727)}get left(){throw F(29726)}get right(){throw F(36894)}copy(e,t,n,s,i){return this}insert(e,t,n){return new Pe(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
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
 */class re{constructor(e){this.comparator=e,this.data=new oe(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal(((t,n)=>(e(t),!1)))}forEachInRange(e,t){const n=this.data.getIteratorFrom(e[0]);for(;n.hasNext();){const s=n.getNext();if(this.comparator(s.key,e[1])>=0)return;t(s.key)}}forEachWhile(e,t){let n;for(n=t!==void 0?this.data.getIteratorFrom(t):this.data.getIterator();n.hasNext();)if(!e(n.getNext().key))return}firstAfterOrEqual(e){const t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new sl(this.data.getIterator())}getIteratorFrom(e){return new sl(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach((n=>{t=t.add(n)})),t}isEqual(e){if(!(e instanceof re)||this.size!==e.size)return!1;const t=this.data.getIterator(),n=e.data.getIterator();for(;t.hasNext();){const s=t.getNext().key,i=n.getNext().key;if(this.comparator(s,i)!==0)return!1}return!0}toArray(){const e=[];return this.forEach((t=>{e.push(t)})),e}toString(){const e=[];return this.forEach((t=>e.push(t))),"SortedSet("+e.toString()+")"}copy(e){const t=new re(this.comparator);return t.data=e,t}}class sl{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}function Nn(r){return r.hasNext()?r.getNext():void 0}/**
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
 */class Be{constructor(e){this.fields=e,e.sort(ce.comparator)}static empty(){return new Be([])}unionWith(e){let t=new re(ce.comparator);for(const n of this.fields)t=t.add(n);for(const n of e)t=t.add(n);return new Be(t.toArray())}covers(e){for(const t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return Qn(this.fields,e.fields,((t,n)=>t.isEqual(n)))}}/**
 * @license
 * Copyright 2023 Google LLC
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
 */class ld extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
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
 */function k_(){return typeof atob!="undefined"}/**
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
 */class fe{constructor(e){this.binaryString=e}static fromBase64String(e){const t=(function(s){try{return atob(s)}catch(i){throw typeof DOMException!="undefined"&&i instanceof DOMException?new ld("Invalid base64 string: "+i):i}})(e);return new fe(t)}static fromUint8Array(e){const t=(function(s){let i="";for(let o=0;o<s.length;++o)i+=String.fromCharCode(s[o]);return i})(e);return new fe(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return(function(t){return btoa(t)})(this.binaryString)}toUint8Array(){return(function(t){const n=new Uint8Array(t.length);for(let s=0;s<t.length;s++)n[s]=t.charCodeAt(s);return n})(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return z(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}fe.EMPTY_BYTE_STRING=new fe("");const M_=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function ht(r){if(L(!!r,39018),typeof r=="string"){let e=0;const t=M_.exec(r);if(L(!!t,46558,{timestamp:r}),t[1]){let s=t[1];s=(s+"000000000").substr(0,9),e=Number(s)}const n=new Date(r);return{seconds:Math.floor(n.getTime()/1e3),nanos:e}}return{seconds:le(r.seconds),nanos:le(r.nanos)}}function le(r){return typeof r=="number"?r:typeof r=="string"?Number(r):0}function dt(r){return typeof r=="string"?fe.fromBase64String(r):fe.fromUint8Array(r)}/**
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
 */const hd="server_timestamp",dd="__type__",fd="__previous_value__",md="__local_write_time__";function ji(r){var t,n;return((n=(((t=r==null?void 0:r.mapValue)==null?void 0:t.fields)||{})[dd])==null?void 0:n.stringValue)===hd}function zi(r){const e=r.mapValue.fields[fd];return ji(e)?zi(e):e}function _s(r){const e=ht(r.mapValue.fields[md].timestampValue);return new ee(e.seconds,e.nanos)}/**
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
 */class O_{constructor(e,t,n,s,i,o,u,c,h,f,m){this.databaseId=e,this.appId=t,this.persistenceKey=n,this.host=s,this.ssl=i,this.forceLongPolling=o,this.autoDetectLongPolling=u,this.longPollingOptions=c,this.useFetchStreams=h,this.isUsingEmulator=f,this.apiKey=m}}const ys="(default)";class Ft{constructor(e,t){this.projectId=e,this.database=t||ys}static empty(){return new Ft("","")}get isDefaultDatabase(){return this.database===ys}isEqual(e){return e instanceof Ft&&e.projectId===this.projectId&&e.database===this.database}}function F_(r,e){if(!Object.prototype.hasOwnProperty.apply(r.options,["projectId"]))throw new V(R.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new Ft(r.options.projectId,e)}/**
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
 */const Fa="__type__",gd="__max__",Ct={mapValue:{fields:{__type__:{stringValue:gd}}}},La="__vector__",tr="value",li={nullValue:"NULL_VALUE"};function Lt(r){return"nullValue"in r?0:"booleanValue"in r?1:"integerValue"in r||"doubleValue"in r?2:"timestampValue"in r?3:"stringValue"in r?5:"bytesValue"in r?6:"referenceValue"in r?7:"geoPointValue"in r?8:"arrayValue"in r?9:"mapValue"in r?ji(r)?4:pd(r)?9007199254740991:$i(r)?10:11:F(28295,{value:r})}function ot(r,e){if(r===e)return!0;const t=Lt(r);if(t!==Lt(e))return!1;switch(t){case 0:case 9007199254740991:return!0;case 1:return r.booleanValue===e.booleanValue;case 4:return _s(r).isEqual(_s(e));case 3:return(function(s,i){if(typeof s.timestampValue=="string"&&typeof i.timestampValue=="string"&&s.timestampValue.length===i.timestampValue.length)return s.timestampValue===i.timestampValue;const o=ht(s.timestampValue),u=ht(i.timestampValue);return o.seconds===u.seconds&&o.nanos===u.nanos})(r,e);case 5:return r.stringValue===e.stringValue;case 6:return(function(s,i){return dt(s.bytesValue).isEqual(dt(i.bytesValue))})(r,e);case 7:return r.referenceValue===e.referenceValue;case 8:return(function(s,i){return le(s.geoPointValue.latitude)===le(i.geoPointValue.latitude)&&le(s.geoPointValue.longitude)===le(i.geoPointValue.longitude)})(r,e);case 2:return(function(s,i){if("integerValue"in s&&"integerValue"in i)return le(s.integerValue)===le(i.integerValue);if("doubleValue"in s&&"doubleValue"in i){const o=le(s.doubleValue),u=le(i.doubleValue);return o===u?fs(o)===fs(u):isNaN(o)&&isNaN(u)}return!1})(r,e);case 9:return Qn(r.arrayValue.values||[],e.arrayValue.values||[],ot);case 10:case 11:return(function(s,i){const o=s.mapValue.fields||{},u=i.mapValue.fields||{};if(rl(o)!==rl(u))return!1;for(const c in o)if(o.hasOwnProperty(c)&&(u[c]===void 0||!ot(o[c],u[c])))return!1;return!0})(r,e);default:return F(52216,{left:r})}}function Is(r,e){return(r.values||[]).find((t=>ot(t,e)))!==void 0}function Bt(r,e){if(r===e)return 0;const t=Lt(r),n=Lt(e);if(t!==n)return z(t,n);switch(t){case 0:case 9007199254740991:return 0;case 1:return z(r.booleanValue,e.booleanValue);case 2:return(function(i,o){const u=le(i.integerValue||i.doubleValue),c=le(o.integerValue||o.doubleValue);return u<c?-1:u>c?1:u===c?0:isNaN(u)?isNaN(c)?0:-1:1})(r,e);case 3:return il(r.timestampValue,e.timestampValue);case 4:return il(_s(r),_s(e));case 5:return Xo(r.stringValue,e.stringValue);case 6:return(function(i,o){const u=dt(i),c=dt(o);return u.compareTo(c)})(r.bytesValue,e.bytesValue);case 7:return(function(i,o){const u=i.split("/"),c=o.split("/");for(let h=0;h<u.length&&h<c.length;h++){const f=z(u[h],c[h]);if(f!==0)return f}return z(u.length,c.length)})(r.referenceValue,e.referenceValue);case 8:return(function(i,o){const u=z(le(i.latitude),le(o.latitude));return u!==0?u:z(le(i.longitude),le(o.longitude))})(r.geoPointValue,e.geoPointValue);case 9:return ol(r.arrayValue,e.arrayValue);case 10:return(function(i,o){var p,v,C,N;const u=i.fields||{},c=o.fields||{},h=(p=u[tr])==null?void 0:p.arrayValue,f=(v=c[tr])==null?void 0:v.arrayValue,m=z(((C=h==null?void 0:h.values)==null?void 0:C.length)||0,((N=f==null?void 0:f.values)==null?void 0:N.length)||0);return m!==0?m:ol(h,f)})(r.mapValue,e.mapValue);case 11:return(function(i,o){if(i===Ct.mapValue&&o===Ct.mapValue)return 0;if(i===Ct.mapValue)return 1;if(o===Ct.mapValue)return-1;const u=i.fields||{},c=Object.keys(u),h=o.fields||{},f=Object.keys(h);c.sort(),f.sort();for(let m=0;m<c.length&&m<f.length;++m){const p=Xo(c[m],f[m]);if(p!==0)return p;const v=Bt(u[c[m]],h[f[m]]);if(v!==0)return v}return z(c.length,f.length)})(r.mapValue,e.mapValue);default:throw F(23264,{he:t})}}function il(r,e){if(typeof r=="string"&&typeof e=="string"&&r.length===e.length)return z(r,e);const t=ht(r),n=ht(e),s=z(t.seconds,n.seconds);return s!==0?s:z(t.nanos,n.nanos)}function ol(r,e){const t=r.values||[],n=e.values||[];for(let s=0;s<t.length&&s<n.length;++s){const i=Bt(t[s],n[s]);if(i)return i}return z(t.length,n.length)}function nr(r){return ia(r)}function ia(r){return"nullValue"in r?"null":"booleanValue"in r?""+r.booleanValue:"integerValue"in r?""+r.integerValue:"doubleValue"in r?""+r.doubleValue:"timestampValue"in r?(function(t){const n=ht(t);return`time(${n.seconds},${n.nanos})`})(r.timestampValue):"stringValue"in r?r.stringValue:"bytesValue"in r?(function(t){return dt(t).toBase64()})(r.bytesValue):"referenceValue"in r?(function(t){return k.fromName(t).toString()})(r.referenceValue):"geoPointValue"in r?(function(t){return`geo(${t.latitude},${t.longitude})`})(r.geoPointValue):"arrayValue"in r?(function(t){let n="[",s=!0;for(const i of t.values||[])s?s=!1:n+=",",n+=ia(i);return n+"]"})(r.arrayValue):"mapValue"in r?(function(t){const n=Object.keys(t.fields||{}).sort();let s="{",i=!0;for(const o of n)i?i=!1:s+=",",s+=`${o}:${ia(t.fields[o])}`;return s+"}"})(r.mapValue):F(61005,{value:r})}function hi(r){switch(Lt(r)){case 0:case 1:return 4;case 2:return 8;case 3:case 8:return 16;case 4:const e=zi(r);return e?16+hi(e):16;case 5:return 2*r.stringValue.length;case 6:return dt(r.bytesValue).approximateByteSize();case 7:return r.referenceValue.length;case 9:return(function(n){return(n.values||[]).reduce(((s,i)=>s+hi(i)),0)})(r.arrayValue);case 10:case 11:return(function(n){let s=0;return Kt(n.fields,((i,o)=>{s+=i.length+hi(o)})),s})(r.mapValue);default:throw F(13486,{value:r})}}function pn(r,e){return{referenceValue:`projects/${r.projectId}/databases/${r.database}/documents/${e.path.canonicalString()}`}}function oa(r){return!!r&&"integerValue"in r}function Es(r){return!!r&&"arrayValue"in r}function al(r){return!!r&&"nullValue"in r}function ul(r){return!!r&&"doubleValue"in r&&isNaN(Number(r.doubleValue))}function di(r){return!!r&&"mapValue"in r}function $i(r){var t,n;return((n=(((t=r==null?void 0:r.mapValue)==null?void 0:t.fields)||{})[Fa])==null?void 0:n.stringValue)===La}function ss(r){if(r.geoPointValue)return{geoPointValue:{...r.geoPointValue}};if(r.timestampValue&&typeof r.timestampValue=="object")return{timestampValue:{...r.timestampValue}};if(r.mapValue){const e={mapValue:{fields:{}}};return Kt(r.mapValue.fields,((t,n)=>e.mapValue.fields[t]=ss(n))),e}if(r.arrayValue){const e={arrayValue:{values:[]}};for(let t=0;t<(r.arrayValue.values||[]).length;++t)e.arrayValue.values[t]=ss(r.arrayValue.values[t]);return e}return{...r}}function pd(r){return(((r.mapValue||{}).fields||{}).__type__||{}).stringValue===gd}const _d={mapValue:{fields:{[Fa]:{stringValue:La},[tr]:{arrayValue:{}}}}};function L_(r){return"nullValue"in r?li:"booleanValue"in r?{booleanValue:!1}:"integerValue"in r||"doubleValue"in r?{doubleValue:NaN}:"timestampValue"in r?{timestampValue:{seconds:Number.MIN_SAFE_INTEGER}}:"stringValue"in r?{stringValue:""}:"bytesValue"in r?{bytesValue:""}:"referenceValue"in r?pn(Ft.empty(),k.empty()):"geoPointValue"in r?{geoPointValue:{latitude:-90,longitude:-180}}:"arrayValue"in r?{arrayValue:{}}:"mapValue"in r?$i(r)?_d:{mapValue:{}}:F(35942,{value:r})}function B_(r){return"nullValue"in r?{booleanValue:!1}:"booleanValue"in r?{doubleValue:NaN}:"integerValue"in r||"doubleValue"in r?{timestampValue:{seconds:Number.MIN_SAFE_INTEGER}}:"timestampValue"in r?{stringValue:""}:"stringValue"in r?{bytesValue:""}:"bytesValue"in r?pn(Ft.empty(),k.empty()):"referenceValue"in r?{geoPointValue:{latitude:-90,longitude:-180}}:"geoPointValue"in r?{arrayValue:{}}:"arrayValue"in r?_d:"mapValue"in r?$i(r)?{mapValue:{}}:Ct:F(61959,{value:r})}function cl(r,e){const t=Bt(r.value,e.value);return t!==0?t:r.inclusive&&!e.inclusive?-1:!r.inclusive&&e.inclusive?1:0}function ll(r,e){const t=Bt(r.value,e.value);return t!==0?t:r.inclusive&&!e.inclusive?1:!r.inclusive&&e.inclusive?-1:0}/**
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
 */class Re{constructor(e){this.value=e}static empty(){return new Re({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let n=0;n<e.length-1;++n)if(t=(t.mapValue.fields||{})[e.get(n)],!di(t))return null;return t=(t.mapValue.fields||{})[e.lastSegment()],t||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=ss(t)}setAll(e){let t=ce.emptyPath(),n={},s=[];e.forEach(((o,u)=>{if(!t.isImmediateParentOf(u)){const c=this.getFieldsMap(t);this.applyChanges(c,n,s),n={},s=[],t=u.popLast()}o?n[u.lastSegment()]=ss(o):s.push(u.lastSegment())}));const i=this.getFieldsMap(t);this.applyChanges(i,n,s)}delete(e){const t=this.field(e.popLast());di(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return ot(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let n=0;n<e.length;++n){let s=t.mapValue.fields[e.get(n)];di(s)&&s.mapValue.fields||(s={mapValue:{fields:{}}},t.mapValue.fields[e.get(n)]=s),t=s}return t.mapValue.fields}applyChanges(e,t,n){Kt(t,((s,i)=>e[s]=i));for(const s of n)delete e[s]}clone(){return new Re(ss(this.value))}}function yd(r){const e=[];return Kt(r.fields,((t,n)=>{const s=new ce([t]);if(di(n)){const i=yd(n.mapValue).fields;if(i.length===0)e.push(s);else for(const o of i)e.push(s.child(o))}else e.push(s)})),new Be(e)}/**
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
 */class ue{constructor(e,t,n,s,i,o,u){this.key=e,this.documentType=t,this.version=n,this.readTime=s,this.createTime=i,this.data=o,this.documentState=u}static newInvalidDocument(e){return new ue(e,0,U.min(),U.min(),U.min(),Re.empty(),0)}static newFoundDocument(e,t,n,s){return new ue(e,1,t,U.min(),n,s,0)}static newNoDocument(e,t){return new ue(e,2,t,U.min(),U.min(),Re.empty(),0)}static newUnknownDocument(e,t){return new ue(e,3,t,U.min(),U.min(),Re.empty(),2)}convertToFoundDocument(e,t){return!this.createTime.isEqual(U.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=Re.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=Re.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=U.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof ue&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new ue(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
 * @license
 * Copyright 2022 Google LLC
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
 */class Ut{constructor(e,t){this.position=e,this.inclusive=t}}function hl(r,e,t){let n=0;for(let s=0;s<r.position.length;s++){const i=e[s],o=r.position[s];if(i.field.isKeyField()?n=k.comparator(k.fromName(o.referenceValue),t.key):n=Bt(o,t.data.field(i.field)),i.dir==="desc"&&(n*=-1),n!==0)break}return n}function dl(r,e){if(r===null)return e===null;if(e===null||r.inclusive!==e.inclusive||r.position.length!==e.position.length)return!1;for(let t=0;t<r.position.length;t++)if(!ot(r.position[t],e.position[t]))return!1;return!0}/**
 * @license
 * Copyright 2022 Google LLC
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
 */class Ts{constructor(e,t="asc"){this.field=e,this.dir=t}}function U_(r,e){return r.dir===e.dir&&r.field.isEqual(e.field)}/**
 * @license
 * Copyright 2022 Google LLC
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
 */class Id{}class H extends Id{constructor(e,t,n){super(),this.field=e,this.op=t,this.value=n}static create(e,t,n){return e.isKeyField()?t==="in"||t==="not-in"?this.createKeyFieldInFilter(e,t,n):new q_(e,t,n):t==="array-contains"?new $_(e,n):t==="in"?new bd(e,n):t==="not-in"?new G_(e,n):t==="array-contains-any"?new K_(e,n):new H(e,t,n)}static createKeyFieldInFilter(e,t,n){return t==="in"?new j_(e,n):new z_(e,n)}matches(e){const t=e.data.field(this.field);return this.op==="!="?t!==null&&t.nullValue===void 0&&this.matchesComparison(Bt(t,this.value)):t!==null&&Lt(this.value)===Lt(t)&&this.matchesComparison(Bt(t,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return F(47266,{operator:this.op})}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class te extends Id{constructor(e,t){super(),this.filters=e,this.op=t,this.Pe=null}static create(e,t){return new te(e,t)}matches(e){return rr(this)?this.filters.find((t=>!t.matches(e)))===void 0:this.filters.find((t=>t.matches(e)))!==void 0}getFlattenedFilters(){return this.Pe!==null||(this.Pe=this.filters.reduce(((e,t)=>e.concat(t.getFlattenedFilters())),[])),this.Pe}getFilters(){return Object.assign([],this.filters)}}function rr(r){return r.op==="and"}function aa(r){return r.op==="or"}function Ba(r){return Ed(r)&&rr(r)}function Ed(r){for(const e of r.filters)if(e instanceof te)return!1;return!0}function ua(r){if(r instanceof H)return r.field.canonicalString()+r.op.toString()+nr(r.value);if(Ba(r))return r.filters.map((e=>ua(e))).join(",");{const e=r.filters.map((t=>ua(t))).join(",");return`${r.op}(${e})`}}function Td(r,e){return r instanceof H?(function(n,s){return s instanceof H&&n.op===s.op&&n.field.isEqual(s.field)&&ot(n.value,s.value)})(r,e):r instanceof te?(function(n,s){return s instanceof te&&n.op===s.op&&n.filters.length===s.filters.length?n.filters.reduce(((i,o,u)=>i&&Td(o,s.filters[u])),!0):!1})(r,e):void F(19439)}function wd(r,e){const t=r.filters.concat(e);return te.create(t,r.op)}function vd(r){return r instanceof H?(function(t){return`${t.field.canonicalString()} ${t.op} ${nr(t.value)}`})(r):r instanceof te?(function(t){return t.op.toString()+" {"+t.getFilters().map(vd).join(" ,")+"}"})(r):"Filter"}class q_ extends H{constructor(e,t,n){super(e,t,n),this.key=k.fromName(n.referenceValue)}matches(e){const t=k.comparator(e.key,this.key);return this.matchesComparison(t)}}class j_ extends H{constructor(e,t){super(e,"in",t),this.keys=Ad("in",t)}matches(e){return this.keys.some((t=>t.isEqual(e.key)))}}class z_ extends H{constructor(e,t){super(e,"not-in",t),this.keys=Ad("not-in",t)}matches(e){return!this.keys.some((t=>t.isEqual(e.key)))}}function Ad(r,e){var t;return(((t=e.arrayValue)==null?void 0:t.values)||[]).map((n=>k.fromName(n.referenceValue)))}class $_ extends H{constructor(e,t){super(e,"array-contains",t)}matches(e){const t=e.data.field(this.field);return Es(t)&&Is(t.arrayValue,this.value)}}class bd extends H{constructor(e,t){super(e,"in",t)}matches(e){const t=e.data.field(this.field);return t!==null&&Is(this.value.arrayValue,t)}}class G_ extends H{constructor(e,t){super(e,"not-in",t)}matches(e){if(Is(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const t=e.data.field(this.field);return t!==null&&t.nullValue===void 0&&!Is(this.value.arrayValue,t)}}class K_ extends H{constructor(e,t){super(e,"array-contains-any",t)}matches(e){const t=e.data.field(this.field);return!(!Es(t)||!t.arrayValue.values)&&t.arrayValue.values.some((n=>Is(this.value.arrayValue,n)))}}/**
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
 */class Q_{constructor(e,t=null,n=[],s=[],i=null,o=null,u=null){this.path=e,this.collectionGroup=t,this.orderBy=n,this.filters=s,this.limit=i,this.startAt=o,this.endAt=u,this.Te=null}}function ca(r,e=null,t=[],n=[],s=null,i=null,o=null){return new Q_(r,e,t,n,s,i,o)}function _n(r){const e=M(r);if(e.Te===null){let t=e.path.canonicalString();e.collectionGroup!==null&&(t+="|cg:"+e.collectionGroup),t+="|f:",t+=e.filters.map((n=>ua(n))).join(","),t+="|ob:",t+=e.orderBy.map((n=>(function(i){return i.field.canonicalString()+i.dir})(n))).join(","),bs(e.limit)||(t+="|l:",t+=e.limit),e.startAt&&(t+="|lb:",t+=e.startAt.inclusive?"b:":"a:",t+=e.startAt.position.map((n=>nr(n))).join(",")),e.endAt&&(t+="|ub:",t+=e.endAt.inclusive?"a:":"b:",t+=e.endAt.position.map((n=>nr(n))).join(",")),e.Te=t}return e.Te}function Ss(r,e){if(r.limit!==e.limit||r.orderBy.length!==e.orderBy.length)return!1;for(let t=0;t<r.orderBy.length;t++)if(!U_(r.orderBy[t],e.orderBy[t]))return!1;if(r.filters.length!==e.filters.length)return!1;for(let t=0;t<r.filters.length;t++)if(!Td(r.filters[t],e.filters[t]))return!1;return r.collectionGroup===e.collectionGroup&&!!r.path.isEqual(e.path)&&!!dl(r.startAt,e.startAt)&&dl(r.endAt,e.endAt)}function vi(r){return k.isDocumentKey(r.path)&&r.collectionGroup===null&&r.filters.length===0}function Ai(r,e){return r.filters.filter((t=>t instanceof H&&t.field.isEqual(e)))}function fl(r,e,t){let n=li,s=!0;for(const i of Ai(r,e)){let o=li,u=!0;switch(i.op){case"<":case"<=":o=L_(i.value);break;case"==":case"in":case">=":o=i.value;break;case">":o=i.value,u=!1;break;case"!=":case"not-in":o=li}cl({value:n,inclusive:s},{value:o,inclusive:u})<0&&(n=o,s=u)}if(t!==null){for(let i=0;i<r.orderBy.length;++i)if(r.orderBy[i].field.isEqual(e)){const o=t.position[i];cl({value:n,inclusive:s},{value:o,inclusive:t.inclusive})<0&&(n=o,s=t.inclusive);break}}return{value:n,inclusive:s}}function ml(r,e,t){let n=Ct,s=!0;for(const i of Ai(r,e)){let o=Ct,u=!0;switch(i.op){case">=":case">":o=B_(i.value),u=!1;break;case"==":case"in":case"<=":o=i.value;break;case"<":o=i.value,u=!1;break;case"!=":case"not-in":o=Ct}ll({value:n,inclusive:s},{value:o,inclusive:u})>0&&(n=o,s=u)}if(t!==null){for(let i=0;i<r.orderBy.length;++i)if(r.orderBy[i].field.isEqual(e)){const o=t.position[i];ll({value:n,inclusive:s},{value:o,inclusive:t.inclusive})>0&&(n=o,s=t.inclusive);break}}return{value:n,inclusive:s}}/**
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
 */class gt{constructor(e,t=null,n=[],s=[],i=null,o="F",u=null,c=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=n,this.filters=s,this.limit=i,this.limitType=o,this.startAt=u,this.endAt=c,this.Ie=null,this.Ee=null,this.Re=null,this.startAt,this.endAt}}function Rd(r,e,t,n,s,i,o,u){return new gt(r,e,t,n,s,i,o,u)}function pr(r){return new gt(r)}function gl(r){return r.filters.length===0&&r.limit===null&&r.startAt==null&&r.endAt==null&&(r.explicitOrderBy.length===0||r.explicitOrderBy.length===1&&r.explicitOrderBy[0].field.isKeyField())}function W_(r){return k.isDocumentKey(r.path)&&r.collectionGroup===null&&r.filters.length===0}function Ua(r){return r.collectionGroup!==null}function zn(r){const e=M(r);if(e.Ie===null){e.Ie=[];const t=new Set;for(const i of e.explicitOrderBy)e.Ie.push(i),t.add(i.field.canonicalString());const n=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(o){let u=new re(ce.comparator);return o.filters.forEach((c=>{c.getFlattenedFilters().forEach((h=>{h.isInequality()&&(u=u.add(h.field))}))})),u})(e).forEach((i=>{t.has(i.canonicalString())||i.isKeyField()||e.Ie.push(new Ts(i,n))})),t.has(ce.keyField().canonicalString())||e.Ie.push(new Ts(ce.keyField(),n))}return e.Ie}function Ne(r){const e=M(r);return e.Ee||(e.Ee=Pd(e,zn(r))),e.Ee}function Sd(r){const e=M(r);return e.Re||(e.Re=Pd(e,r.explicitOrderBy)),e.Re}function Pd(r,e){if(r.limitType==="F")return ca(r.path,r.collectionGroup,e,r.filters,r.limit,r.startAt,r.endAt);{e=e.map((s=>{const i=s.dir==="desc"?"asc":"desc";return new Ts(s.field,i)}));const t=r.endAt?new Ut(r.endAt.position,r.endAt.inclusive):null,n=r.startAt?new Ut(r.startAt.position,r.startAt.inclusive):null;return ca(r.path,r.collectionGroup,e,r.filters,r.limit,t,n)}}function la(r,e){const t=r.filters.concat([e]);return new gt(r.path,r.collectionGroup,r.explicitOrderBy.slice(),t,r.limit,r.limitType,r.startAt,r.endAt)}function H_(r,e){const t=r.explicitOrderBy.concat([e]);return new gt(r.path,r.collectionGroup,t,r.filters.slice(),r.limit,r.limitType,r.startAt,r.endAt)}function bi(r,e,t){return new gt(r.path,r.collectionGroup,r.explicitOrderBy.slice(),r.filters.slice(),e,t,r.startAt,r.endAt)}function J_(r,e){return new gt(r.path,r.collectionGroup,r.explicitOrderBy.slice(),r.filters.slice(),r.limit,r.limitType,e,r.endAt)}function Y_(r,e){return new gt(r.path,r.collectionGroup,r.explicitOrderBy.slice(),r.filters.slice(),r.limit,r.limitType,r.startAt,e)}function Ps(r,e){return Ss(Ne(r),Ne(e))&&r.limitType===e.limitType}function Vd(r){return`${_n(Ne(r))}|lt:${r.limitType}`}function Bn(r){return`Query(target=${(function(t){let n=t.path.canonicalString();return t.collectionGroup!==null&&(n+=" collectionGroup="+t.collectionGroup),t.filters.length>0&&(n+=`, filters: [${t.filters.map((s=>vd(s))).join(", ")}]`),bs(t.limit)||(n+=", limit: "+t.limit),t.orderBy.length>0&&(n+=`, orderBy: [${t.orderBy.map((s=>(function(o){return`${o.field.canonicalString()} (${o.dir})`})(s))).join(", ")}]`),t.startAt&&(n+=", startAt: ",n+=t.startAt.inclusive?"b:":"a:",n+=t.startAt.position.map((s=>nr(s))).join(",")),t.endAt&&(n+=", endAt: ",n+=t.endAt.inclusive?"a:":"b:",n+=t.endAt.position.map((s=>nr(s))).join(",")),`Target(${n})`})(Ne(r))}; limitType=${r.limitType})`}function Vs(r,e){return e.isFoundDocument()&&(function(n,s){const i=s.key.path;return n.collectionGroup!==null?s.key.hasCollectionId(n.collectionGroup)&&n.path.isPrefixOf(i):k.isDocumentKey(n.path)?n.path.isEqual(i):n.path.isImmediateParentOf(i)})(r,e)&&(function(n,s){for(const i of zn(n))if(!i.field.isKeyField()&&s.data.field(i.field)===null)return!1;return!0})(r,e)&&(function(n,s){for(const i of n.filters)if(!i.matches(s))return!1;return!0})(r,e)&&(function(n,s){return!(n.startAt&&!(function(o,u,c){const h=hl(o,u,c);return o.inclusive?h<=0:h<0})(n.startAt,zn(n),s)||n.endAt&&!(function(o,u,c){const h=hl(o,u,c);return o.inclusive?h>=0:h>0})(n.endAt,zn(n),s))})(r,e)}function Cd(r){return r.collectionGroup||(r.path.length%2==1?r.path.lastSegment():r.path.get(r.path.length-2))}function Dd(r){return(e,t)=>{let n=!1;for(const s of zn(r)){const i=X_(s,e,t);if(i!==0)return i;n=n||s.field.isKeyField()}return 0}}function X_(r,e,t){const n=r.field.isKeyField()?k.comparator(e.key,t.key):(function(i,o,u){const c=o.data.field(i),h=u.data.field(i);return c!==null&&h!==null?Bt(c,h):F(42886)})(r.field,e,t);switch(r.dir){case"asc":return n;case"desc":return-1*n;default:return F(19790,{direction:r.dir})}}/**
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
 */class pt{constructor(e,t){this.mapKeyFn=e,this.equalsFn=t,this.inner={},this.innerSize=0}get(e){const t=this.mapKeyFn(e),n=this.inner[t];if(n!==void 0){for(const[s,i]of n)if(this.equalsFn(s,e))return i}}has(e){return this.get(e)!==void 0}set(e,t){const n=this.mapKeyFn(e),s=this.inner[n];if(s===void 0)return this.inner[n]=[[e,t]],void this.innerSize++;for(let i=0;i<s.length;i++)if(this.equalsFn(s[i][0],e))return void(s[i]=[e,t]);s.push([e,t]),this.innerSize++}delete(e){const t=this.mapKeyFn(e),n=this.inner[t];if(n===void 0)return!1;for(let s=0;s<n.length;s++)if(this.equalsFn(n[s][0],e))return n.length===1?delete this.inner[t]:n.splice(s,1),this.innerSize--,!0;return!1}forEach(e){Kt(this.inner,((t,n)=>{for(const[s,i]of n)e(s,i)}))}isEmpty(){return cd(this.inner)}size(){return this.innerSize}}/**
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
 */const Z_=new oe(k.comparator);function Ue(){return Z_}const xd=new oe(k.comparator);function Yr(...r){let e=xd;for(const t of r)e=e.insert(t.key,t);return e}function Nd(r){let e=xd;return r.forEach(((t,n)=>e=e.insert(t,n.overlayedDocument))),e}function nt(){return is()}function kd(){return is()}function is(){return new pt((r=>r.toString()),((r,e)=>r.isEqual(e)))}const ey=new oe(k.comparator),ty=new re(k.comparator);function $(...r){let e=ty;for(const t of r)e=e.add(t);return e}const ny=new re(z);function qa(){return ny}/**
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
 */function ja(r,e){if(r.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:fs(e)?"-0":e}}function Md(r){return{integerValue:""+r}}function Od(r,e){return Yh(e)?Md(e):ja(r,e)}/**
 * @license
 * Copyright 2018 Google LLC
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
 */class Gi{constructor(){this._=void 0}}function ry(r,e,t){return r instanceof sr?(function(s,i){const o={fields:{[dd]:{stringValue:hd},[md]:{timestampValue:{seconds:s.seconds,nanos:s.nanoseconds}}}};return i&&ji(i)&&(i=zi(i)),i&&(o.fields[fd]=i),{mapValue:o}})(t,e):r instanceof yn?Ld(r,e):r instanceof In?Bd(r,e):(function(s,i){const o=Fd(s,i),u=pl(o)+pl(s.Ae);return oa(o)&&oa(s.Ae)?Md(u):ja(s.serializer,u)})(r,e)}function sy(r,e,t){return r instanceof yn?Ld(r,e):r instanceof In?Bd(r,e):t}function Fd(r,e){return r instanceof ir?(function(n){return oa(n)||(function(i){return!!i&&"doubleValue"in i})(n)})(e)?e:{integerValue:0}:null}class sr extends Gi{}class yn extends Gi{constructor(e){super(),this.elements=e}}function Ld(r,e){const t=Ud(e);for(const n of r.elements)t.some((s=>ot(s,n)))||t.push(n);return{arrayValue:{values:t}}}class In extends Gi{constructor(e){super(),this.elements=e}}function Bd(r,e){let t=Ud(e);for(const n of r.elements)t=t.filter((s=>!ot(s,n)));return{arrayValue:{values:t}}}class ir extends Gi{constructor(e,t){super(),this.serializer=e,this.Ae=t}}function pl(r){return le(r.integerValue||r.doubleValue)}function Ud(r){return Es(r)&&r.arrayValue.values?r.arrayValue.values.slice():[]}/**
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
 */class Cs{constructor(e,t){this.field=e,this.transform=t}}function iy(r,e){return r.field.isEqual(e.field)&&(function(n,s){return n instanceof yn&&s instanceof yn||n instanceof In&&s instanceof In?Qn(n.elements,s.elements,ot):n instanceof ir&&s instanceof ir?ot(n.Ae,s.Ae):n instanceof sr&&s instanceof sr})(r.transform,e.transform)}class oy{constructor(e,t){this.version=e,this.transformResults=t}}class he{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new he}static exists(e){return new he(void 0,e)}static updateTime(e){return new he(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function fi(r,e){return r.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(r.updateTime):r.exists===void 0||r.exists===e.isFoundDocument()}class Ki{}function qd(r,e){if(!r.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return r.isNoDocument()?new yr(r.key,he.none()):new _r(r.key,r.data,he.none());{const t=r.data,n=Re.empty();let s=new re(ce.comparator);for(let i of e.fields)if(!s.has(i)){let o=t.field(i);o===null&&i.length>1&&(i=i.popLast(),o=t.field(i)),o===null?n.delete(i):n.set(i,o),s=s.add(i)}return new _t(r.key,n,new Be(s.toArray()),he.none())}}function ay(r,e,t){r instanceof _r?(function(s,i,o){const u=s.value.clone(),c=yl(s.fieldTransforms,i,o.transformResults);u.setAll(c),i.convertToFoundDocument(o.version,u).setHasCommittedMutations()})(r,e,t):r instanceof _t?(function(s,i,o){if(!fi(s.precondition,i))return void i.convertToUnknownDocument(o.version);const u=yl(s.fieldTransforms,i,o.transformResults),c=i.data;c.setAll(jd(s)),c.setAll(u),i.convertToFoundDocument(o.version,c).setHasCommittedMutations()})(r,e,t):(function(s,i,o){i.convertToNoDocument(o.version).setHasCommittedMutations()})(0,e,t)}function os(r,e,t,n){return r instanceof _r?(function(i,o,u,c){if(!fi(i.precondition,o))return u;const h=i.value.clone(),f=Il(i.fieldTransforms,c,o);return h.setAll(f),o.convertToFoundDocument(o.version,h).setHasLocalMutations(),null})(r,e,t,n):r instanceof _t?(function(i,o,u,c){if(!fi(i.precondition,o))return u;const h=Il(i.fieldTransforms,c,o),f=o.data;return f.setAll(jd(i)),f.setAll(h),o.convertToFoundDocument(o.version,f).setHasLocalMutations(),u===null?null:u.unionWith(i.fieldMask.fields).unionWith(i.fieldTransforms.map((m=>m.field)))})(r,e,t,n):(function(i,o,u){return fi(i.precondition,o)?(o.convertToNoDocument(o.version).setHasLocalMutations(),null):u})(r,e,t)}function uy(r,e){let t=null;for(const n of r.fieldTransforms){const s=e.data.field(n.field),i=Fd(n.transform,s||null);i!=null&&(t===null&&(t=Re.empty()),t.set(n.field,i))}return t||null}function _l(r,e){return r.type===e.type&&!!r.key.isEqual(e.key)&&!!r.precondition.isEqual(e.precondition)&&!!(function(n,s){return n===void 0&&s===void 0||!(!n||!s)&&Qn(n,s,((i,o)=>iy(i,o)))})(r.fieldTransforms,e.fieldTransforms)&&(r.type===0?r.value.isEqual(e.value):r.type!==1||r.data.isEqual(e.data)&&r.fieldMask.isEqual(e.fieldMask))}class _r extends Ki{constructor(e,t,n,s=[]){super(),this.key=e,this.value=t,this.precondition=n,this.fieldTransforms=s,this.type=0}getFieldMask(){return null}}class _t extends Ki{constructor(e,t,n,s,i=[]){super(),this.key=e,this.data=t,this.fieldMask=n,this.precondition=s,this.fieldTransforms=i,this.type=1}getFieldMask(){return this.fieldMask}}function jd(r){const e=new Map;return r.fieldMask.fields.forEach((t=>{if(!t.isEmpty()){const n=r.data.field(t);e.set(t,n)}})),e}function yl(r,e,t){const n=new Map;L(r.length===t.length,32656,{Ve:t.length,de:r.length});for(let s=0;s<t.length;s++){const i=r[s],o=i.transform,u=e.data.field(i.field);n.set(i.field,sy(o,u,t[s]))}return n}function Il(r,e,t){const n=new Map;for(const s of r){const i=s.transform,o=t.data.field(s.field);n.set(s.field,ry(i,o,e))}return n}class yr extends Ki{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class za extends Ki{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
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
 */class $a{constructor(e,t,n,s){this.batchId=e,this.localWriteTime=t,this.baseMutations=n,this.mutations=s}applyToRemoteDocument(e,t){const n=t.mutationResults;for(let s=0;s<this.mutations.length;s++){const i=this.mutations[s];i.key.isEqual(e.key)&&ay(i,e,n[s])}}applyToLocalView(e,t){for(const n of this.baseMutations)n.key.isEqual(e.key)&&(t=os(n,e,t,this.localWriteTime));for(const n of this.mutations)n.key.isEqual(e.key)&&(t=os(n,e,t,this.localWriteTime));return t}applyToLocalDocumentSet(e,t){const n=kd();return this.mutations.forEach((s=>{const i=e.get(s.key),o=i.overlayedDocument;let u=this.applyToLocalView(o,i.mutatedFields);u=t.has(s.key)?null:u;const c=qd(o,u);c!==null&&n.set(s.key,c),o.isValidDocument()||o.convertToNoDocument(U.min())})),n}keys(){return this.mutations.reduce(((e,t)=>e.add(t.key)),$())}isEqual(e){return this.batchId===e.batchId&&Qn(this.mutations,e.mutations,((t,n)=>_l(t,n)))&&Qn(this.baseMutations,e.baseMutations,((t,n)=>_l(t,n)))}}class Ga{constructor(e,t,n,s){this.batch=e,this.commitVersion=t,this.mutationResults=n,this.docVersions=s}static from(e,t,n){L(e.mutations.length===n.length,58842,{me:e.mutations.length,fe:n.length});let s=(function(){return ey})();const i=e.mutations;for(let o=0;o<i.length;o++)s=s.insert(i[o].key,n[o].version);return new Ga(e,t,n,s)}}/**
 * @license
 * Copyright 2022 Google LLC
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
 */class Ka{constructor(e,t){this.largestBatchId=e,this.mutation=t}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`}}/**
 * @license
 * Copyright 2023 Google LLC
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
 */class zd{constructor(e,t,n){this.alias=e,this.aggregateType=t,this.fieldPath=n}}/**
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
 */class cy{constructor(e,t){this.count=e,this.unchangedNames=t}}/**
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
 */var _e,Y;function $d(r){switch(r){case R.OK:return F(64938);case R.CANCELLED:case R.UNKNOWN:case R.DEADLINE_EXCEEDED:case R.RESOURCE_EXHAUSTED:case R.INTERNAL:case R.UNAVAILABLE:case R.UNAUTHENTICATED:return!1;case R.INVALID_ARGUMENT:case R.NOT_FOUND:case R.ALREADY_EXISTS:case R.PERMISSION_DENIED:case R.FAILED_PRECONDITION:case R.ABORTED:case R.OUT_OF_RANGE:case R.UNIMPLEMENTED:case R.DATA_LOSS:return!0;default:return F(15467,{code:r})}}function Gd(r){if(r===void 0)return ge("GRPC error has no .code"),R.UNKNOWN;switch(r){case _e.OK:return R.OK;case _e.CANCELLED:return R.CANCELLED;case _e.UNKNOWN:return R.UNKNOWN;case _e.DEADLINE_EXCEEDED:return R.DEADLINE_EXCEEDED;case _e.RESOURCE_EXHAUSTED:return R.RESOURCE_EXHAUSTED;case _e.INTERNAL:return R.INTERNAL;case _e.UNAVAILABLE:return R.UNAVAILABLE;case _e.UNAUTHENTICATED:return R.UNAUTHENTICATED;case _e.INVALID_ARGUMENT:return R.INVALID_ARGUMENT;case _e.NOT_FOUND:return R.NOT_FOUND;case _e.ALREADY_EXISTS:return R.ALREADY_EXISTS;case _e.PERMISSION_DENIED:return R.PERMISSION_DENIED;case _e.FAILED_PRECONDITION:return R.FAILED_PRECONDITION;case _e.ABORTED:return R.ABORTED;case _e.OUT_OF_RANGE:return R.OUT_OF_RANGE;case _e.UNIMPLEMENTED:return R.UNIMPLEMENTED;case _e.DATA_LOSS:return R.DATA_LOSS;default:return F(39323,{code:r})}}(Y=_e||(_e={}))[Y.OK=0]="OK",Y[Y.CANCELLED=1]="CANCELLED",Y[Y.UNKNOWN=2]="UNKNOWN",Y[Y.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",Y[Y.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",Y[Y.NOT_FOUND=5]="NOT_FOUND",Y[Y.ALREADY_EXISTS=6]="ALREADY_EXISTS",Y[Y.PERMISSION_DENIED=7]="PERMISSION_DENIED",Y[Y.UNAUTHENTICATED=16]="UNAUTHENTICATED",Y[Y.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",Y[Y.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",Y[Y.ABORTED=10]="ABORTED",Y[Y.OUT_OF_RANGE=11]="OUT_OF_RANGE",Y[Y.UNIMPLEMENTED=12]="UNIMPLEMENTED",Y[Y.INTERNAL=13]="INTERNAL",Y[Y.UNAVAILABLE=14]="UNAVAILABLE",Y[Y.DATA_LOSS=15]="DATA_LOSS";/**
 * @license
 * Copyright 2023 Google LLC
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
 */let as=null;function ly(r){if(as)throw new Error("a TestingHooksSpi instance is already set");as=r}/**
 * @license
 * Copyright 2023 Google LLC
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
 */function Kd(){return new TextEncoder}/**
 * @license
 * Copyright 2022 Google LLC
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
 */const hy=new Nt([4294967295,4294967295],0);function El(r){const e=Kd().encode(r),t=new Nh;return t.update(e),new Uint8Array(t.digest())}function Tl(r){const e=new DataView(r.buffer),t=e.getUint32(0,!0),n=e.getUint32(4,!0),s=e.getUint32(8,!0),i=e.getUint32(12,!0);return[new Nt([t,n],0),new Nt([s,i],0)]}class Qa{constructor(e,t,n){if(this.bitmap=e,this.padding=t,this.hashCount=n,t<0||t>=8)throw new Xr(`Invalid padding: ${t}`);if(n<0)throw new Xr(`Invalid hash count: ${n}`);if(e.length>0&&this.hashCount===0)throw new Xr(`Invalid hash count: ${n}`);if(e.length===0&&t!==0)throw new Xr(`Invalid padding when bitmap length is 0: ${t}`);this.ge=8*e.length-t,this.pe=Nt.fromNumber(this.ge)}ye(e,t,n){let s=e.add(t.multiply(Nt.fromNumber(n)));return s.compare(hy)===1&&(s=new Nt([s.getBits(0),s.getBits(1)],0)),s.modulo(this.pe).toNumber()}we(e){return!!(this.bitmap[Math.floor(e/8)]&1<<e%8)}mightContain(e){if(this.ge===0)return!1;const t=El(e),[n,s]=Tl(t);for(let i=0;i<this.hashCount;i++){const o=this.ye(n,s,i);if(!this.we(o))return!1}return!0}static create(e,t,n){const s=e%8==0?0:8-e%8,i=new Uint8Array(Math.ceil(e/8)),o=new Qa(i,s,t);return n.forEach((u=>o.insert(u))),o}insert(e){if(this.ge===0)return;const t=El(e),[n,s]=Tl(t);for(let i=0;i<this.hashCount;i++){const o=this.ye(n,s,i);this.Se(o)}}Se(e){const t=Math.floor(e/8),n=e%8;this.bitmap[t]|=1<<n}}class Xr extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
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
 */class Ir{constructor(e,t,n,s,i){this.snapshotVersion=e,this.targetChanges=t,this.targetMismatches=n,this.documentUpdates=s,this.resolvedLimboDocuments=i}static createSynthesizedRemoteEventForCurrentChange(e,t,n){const s=new Map;return s.set(e,Ds.createSynthesizedTargetChangeForCurrentChange(e,t,n)),new Ir(U.min(),s,new oe(z),Ue(),$())}}class Ds{constructor(e,t,n,s,i){this.resumeToken=e,this.current=t,this.addedDocuments=n,this.modifiedDocuments=s,this.removedDocuments=i}static createSynthesizedTargetChangeForCurrentChange(e,t,n){return new Ds(n,t,$(),$(),$())}}/**
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
 */class mi{constructor(e,t,n,s){this.be=e,this.removedTargetIds=t,this.key=n,this.De=s}}class Qd{constructor(e,t){this.targetId=e,this.Ce=t}}class Wd{constructor(e,t,n=fe.EMPTY_BYTE_STRING,s=null){this.state=e,this.targetIds=t,this.resumeToken=n,this.cause=s}}class wl{constructor(){this.ve=0,this.Fe=vl(),this.Me=fe.EMPTY_BYTE_STRING,this.xe=!1,this.Oe=!0}get current(){return this.xe}get resumeToken(){return this.Me}get Ne(){return this.ve!==0}get Be(){return this.Oe}Le(e){e.approximateByteSize()>0&&(this.Oe=!0,this.Me=e)}ke(){let e=$(),t=$(),n=$();return this.Fe.forEach(((s,i)=>{switch(i){case 0:e=e.add(s);break;case 2:t=t.add(s);break;case 1:n=n.add(s);break;default:F(38017,{changeType:i})}})),new Ds(this.Me,this.xe,e,t,n)}Ke(){this.Oe=!1,this.Fe=vl()}qe(e,t){this.Oe=!0,this.Fe=this.Fe.insert(e,t)}Ue(e){this.Oe=!0,this.Fe=this.Fe.remove(e)}$e(){this.ve+=1}We(){this.ve-=1,L(this.ve>=0,3241,{ve:this.ve})}Qe(){this.Oe=!0,this.xe=!0}}class dy{constructor(e){this.Ge=e,this.ze=new Map,this.je=Ue(),this.Je=ti(),this.He=ti(),this.Ze=new oe(z)}Xe(e){for(const t of e.be)e.De&&e.De.isFoundDocument()?this.Ye(t,e.De):this.et(t,e.key,e.De);for(const t of e.removedTargetIds)this.et(t,e.key,e.De)}tt(e){this.forEachTarget(e,(t=>{const n=this.nt(t);switch(e.state){case 0:this.rt(t)&&n.Le(e.resumeToken);break;case 1:n.We(),n.Ne||n.Ke(),n.Le(e.resumeToken);break;case 2:n.We(),n.Ne||this.removeTarget(t);break;case 3:this.rt(t)&&(n.Qe(),n.Le(e.resumeToken));break;case 4:this.rt(t)&&(this.it(t),n.Le(e.resumeToken));break;default:F(56790,{state:e.state})}}))}forEachTarget(e,t){e.targetIds.length>0?e.targetIds.forEach(t):this.ze.forEach(((n,s)=>{this.rt(s)&&t(s)}))}st(e){const t=e.targetId,n=e.Ce.count,s=this.ot(t);if(s){const i=s.target;if(vi(i))if(n===0){const o=new k(i.path);this.et(t,o,ue.newNoDocument(o,U.min()))}else L(n===1,20013,{expectedCount:n});else{const o=this._t(t);if(o!==n){const u=this.ut(e),c=u?this.ct(u,e,o):1;if(c!==0){this.it(t);const h=c===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.Ze=this.Ze.insert(t,h)}as==null||as.o((function(f,m,p,v,C){var B,j,q,Z,W,J;const N={localCacheCount:f,existenceFilterCount:m.count,databaseId:p.database,projectId:p.projectId},D=m.unchangedNames;return D&&(N.bloomFilter={applied:C===0,hashCount:(B=D==null?void 0:D.hashCount)!=null?B:0,bitmapLength:(Z=(q=(j=D==null?void 0:D.bits)==null?void 0:j.bitmap)==null?void 0:q.length)!=null?Z:0,padding:(J=(W=D==null?void 0:D.bits)==null?void 0:W.padding)!=null?J:0,mightContain:E=>{var _;return(_=v==null?void 0:v.mightContain(E))!=null?_:!1}}),N})(o,e.Ce,this.Ge.ht(),u,c))}}}}ut(e){const t=e.Ce.unchangedNames;if(!t||!t.bits)return null;const{bits:{bitmap:n="",padding:s=0},hashCount:i=0}=t;let o,u;try{o=dt(n).toUint8Array()}catch(c){if(c instanceof ld)return ze("Decoding the base64 bloom filter in existence filter failed ("+c.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw c}try{u=new Qa(o,s,i)}catch(c){return ze(c instanceof Xr?"BloomFilter error: ":"Applying bloom filter failed: ",c),null}return u.ge===0?null:u}ct(e,t,n){return t.Ce.count===n-this.Pt(e,t.targetId)?0:2}Pt(e,t){const n=this.Ge.getRemoteKeysForTarget(t);let s=0;return n.forEach((i=>{const o=this.Ge.ht(),u=`projects/${o.projectId}/databases/${o.database}/documents/${i.path.canonicalString()}`;e.mightContain(u)||(this.et(t,i,null),s++)})),s}Tt(e){const t=new Map;this.ze.forEach(((i,o)=>{const u=this.ot(o);if(u){if(i.current&&vi(u.target)){const c=new k(u.target.path);this.It(c).has(o)||this.Et(o,c)||this.et(o,c,ue.newNoDocument(c,e))}i.Be&&(t.set(o,i.ke()),i.Ke())}}));let n=$();this.He.forEach(((i,o)=>{let u=!0;o.forEachWhile((c=>{const h=this.ot(c);return!h||h.purpose==="TargetPurposeLimboResolution"||(u=!1,!1)})),u&&(n=n.add(i))})),this.je.forEach(((i,o)=>o.setReadTime(e)));const s=new Ir(e,t,this.Ze,this.je,n);return this.je=Ue(),this.Je=ti(),this.He=ti(),this.Ze=new oe(z),s}Ye(e,t){if(!this.rt(e))return;const n=this.Et(e,t.key)?2:0;this.nt(e).qe(t.key,n),this.je=this.je.insert(t.key,t),this.Je=this.Je.insert(t.key,this.It(t.key).add(e)),this.He=this.He.insert(t.key,this.Rt(t.key).add(e))}et(e,t,n){if(!this.rt(e))return;const s=this.nt(e);this.Et(e,t)?s.qe(t,1):s.Ue(t),this.He=this.He.insert(t,this.Rt(t).delete(e)),this.He=this.He.insert(t,this.Rt(t).add(e)),n&&(this.je=this.je.insert(t,n))}removeTarget(e){this.ze.delete(e)}_t(e){const t=this.nt(e).ke();return this.Ge.getRemoteKeysForTarget(e).size+t.addedDocuments.size-t.removedDocuments.size}$e(e){this.nt(e).$e()}nt(e){let t=this.ze.get(e);return t||(t=new wl,this.ze.set(e,t)),t}Rt(e){let t=this.He.get(e);return t||(t=new re(z),this.He=this.He.insert(e,t)),t}It(e){let t=this.Je.get(e);return t||(t=new re(z),this.Je=this.Je.insert(e,t)),t}rt(e){const t=this.ot(e)!==null;return t||x("WatchChangeAggregator","Detected inactive target",e),t}ot(e){const t=this.ze.get(e);return t&&t.Ne?null:this.Ge.At(e)}it(e){this.ze.set(e,new wl),this.Ge.getRemoteKeysForTarget(e).forEach((t=>{this.et(e,t,null)}))}Et(e,t){return this.Ge.getRemoteKeysForTarget(e).has(t)}}function ti(){return new oe(k.comparator)}function vl(){return new oe(k.comparator)}const fy={asc:"ASCENDING",desc:"DESCENDING"},my={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},gy={and:"AND",or:"OR"};class py{constructor(e,t){this.databaseId=e,this.useProto3Json=t}}function ha(r,e){return r.useProto3Json||bs(e)?e:{value:e}}function or(r,e){return r.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function Hd(r,e){return r.useProto3Json?e.toBase64():e.toUint8Array()}function _y(r,e){return or(r,e.toTimestamp())}function pe(r){return L(!!r,49232),U.fromTimestamp((function(t){const n=ht(t);return new ee(n.seconds,n.nanos)})(r))}function Wa(r,e){return da(r,e).canonicalString()}function da(r,e){const t=(function(s){return new K(["projects",s.projectId,"databases",s.database])})(r).child("documents");return e===void 0?t:t.child(e)}function Jd(r){const e=K.fromString(r);return L(of(e),10190,{key:e.toString()}),e}function ws(r,e){return Wa(r.databaseId,e.path)}function it(r,e){const t=Jd(e);if(t.get(1)!==r.databaseId.projectId)throw new V(R.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+t.get(1)+" vs "+r.databaseId.projectId);if(t.get(3)!==r.databaseId.database)throw new V(R.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+t.get(3)+" vs "+r.databaseId.database);return new k(Zd(t))}function Yd(r,e){return Wa(r.databaseId,e)}function Xd(r){const e=Jd(r);return e.length===4?K.emptyPath():Zd(e)}function fa(r){return new K(["projects",r.databaseId.projectId,"databases",r.databaseId.database]).canonicalString()}function Zd(r){return L(r.length>4&&r.get(4)==="documents",29091,{key:r.toString()}),r.popFirst(5)}function Al(r,e,t){return{name:ws(r,e),fields:t.value.mapValue.fields}}function Qi(r,e,t){const n=it(r,e.name),s=pe(e.updateTime),i=e.createTime?pe(e.createTime):U.min(),o=new Re({mapValue:{fields:e.fields}}),u=ue.newFoundDocument(n,s,i,o);return t&&u.setHasCommittedMutations(),t?u.setHasCommittedMutations():u}function yy(r,e){return"found"in e?(function(n,s){L(!!s.found,43571),s.found.name,s.found.updateTime;const i=it(n,s.found.name),o=pe(s.found.updateTime),u=s.found.createTime?pe(s.found.createTime):U.min(),c=new Re({mapValue:{fields:s.found.fields}});return ue.newFoundDocument(i,o,u,c)})(r,e):"missing"in e?(function(n,s){L(!!s.missing,3894),L(!!s.readTime,22933);const i=it(n,s.missing),o=pe(s.readTime);return ue.newNoDocument(i,o)})(r,e):F(7234,{result:e})}function Iy(r,e){let t;if("targetChange"in e){e.targetChange;const n=(function(h){return h==="NO_CHANGE"?0:h==="ADD"?1:h==="REMOVE"?2:h==="CURRENT"?3:h==="RESET"?4:F(39313,{state:h})})(e.targetChange.targetChangeType||"NO_CHANGE"),s=e.targetChange.targetIds||[],i=(function(h,f){return h.useProto3Json?(L(f===void 0||typeof f=="string",58123),fe.fromBase64String(f||"")):(L(f===void 0||f instanceof Buffer||f instanceof Uint8Array,16193),fe.fromUint8Array(f||new Uint8Array))})(r,e.targetChange.resumeToken),o=e.targetChange.cause,u=o&&(function(h){const f=h.code===void 0?R.UNKNOWN:Gd(h.code);return new V(f,h.message||"")})(o);t=new Wd(n,s,i,u||null)}else if("documentChange"in e){e.documentChange;const n=e.documentChange;n.document,n.document.name,n.document.updateTime;const s=it(r,n.document.name),i=pe(n.document.updateTime),o=n.document.createTime?pe(n.document.createTime):U.min(),u=new Re({mapValue:{fields:n.document.fields}}),c=ue.newFoundDocument(s,i,o,u),h=n.targetIds||[],f=n.removedTargetIds||[];t=new mi(h,f,c.key,c)}else if("documentDelete"in e){e.documentDelete;const n=e.documentDelete;n.document;const s=it(r,n.document),i=n.readTime?pe(n.readTime):U.min(),o=ue.newNoDocument(s,i),u=n.removedTargetIds||[];t=new mi([],u,o.key,o)}else if("documentRemove"in e){e.documentRemove;const n=e.documentRemove;n.document;const s=it(r,n.document),i=n.removedTargetIds||[];t=new mi([],i,s,null)}else{if(!("filter"in e))return F(11601,{Vt:e});{e.filter;const n=e.filter;n.targetId;const{count:s=0,unchangedNames:i}=n,o=new cy(s,i),u=n.targetId;t=new Qd(u,o)}}return t}function vs(r,e){let t;if(e instanceof _r)t={update:Al(r,e.key,e.value)};else if(e instanceof yr)t={delete:ws(r,e.key)};else if(e instanceof _t)t={update:Al(r,e.key,e.data),updateMask:by(e.fieldMask)};else{if(!(e instanceof za))return F(16599,{dt:e.type});t={verify:ws(r,e.key)}}return e.fieldTransforms.length>0&&(t.updateTransforms=e.fieldTransforms.map((n=>(function(i,o){const u=o.transform;if(u instanceof sr)return{fieldPath:o.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(u instanceof yn)return{fieldPath:o.field.canonicalString(),appendMissingElements:{values:u.elements}};if(u instanceof In)return{fieldPath:o.field.canonicalString(),removeAllFromArray:{values:u.elements}};if(u instanceof ir)return{fieldPath:o.field.canonicalString(),increment:u.Ae};throw F(20930,{transform:o.transform})})(0,n)))),e.precondition.isNone||(t.currentDocument=(function(s,i){return i.updateTime!==void 0?{updateTime:_y(s,i.updateTime)}:i.exists!==void 0?{exists:i.exists}:F(27497)})(r,e.precondition)),t}function ma(r,e){const t=e.currentDocument?(function(i){return i.updateTime!==void 0?he.updateTime(pe(i.updateTime)):i.exists!==void 0?he.exists(i.exists):he.none()})(e.currentDocument):he.none(),n=e.updateTransforms?e.updateTransforms.map((s=>(function(o,u){let c=null;if("setToServerValue"in u)L(u.setToServerValue==="REQUEST_TIME",16630,{proto:u}),c=new sr;else if("appendMissingElements"in u){const f=u.appendMissingElements.values||[];c=new yn(f)}else if("removeAllFromArray"in u){const f=u.removeAllFromArray.values||[];c=new In(f)}else"increment"in u?c=new ir(o,u.increment):F(16584,{proto:u});const h=ce.fromServerFormat(u.fieldPath);return new Cs(h,c)})(r,s))):[];if(e.update){e.update.name;const s=it(r,e.update.name),i=new Re({mapValue:{fields:e.update.fields}});if(e.updateMask){const o=(function(c){const h=c.fieldPaths||[];return new Be(h.map((f=>ce.fromServerFormat(f))))})(e.updateMask);return new _t(s,i,o,t,n)}return new _r(s,i,t,n)}if(e.delete){const s=it(r,e.delete);return new yr(s,t)}if(e.verify){const s=it(r,e.verify);return new za(s,t)}return F(1463,{proto:e})}function Ey(r,e){return r&&r.length>0?(L(e!==void 0,14353),r.map((t=>(function(s,i){let o=s.updateTime?pe(s.updateTime):pe(i);return o.isEqual(U.min())&&(o=pe(i)),new oy(o,s.transformResults||[])})(t,e)))):[]}function ef(r,e){return{documents:[Yd(r,e.path)]}}function Wi(r,e){const t={structuredQuery:{}},n=e.path;let s;e.collectionGroup!==null?(s=n,t.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(s=n.popLast(),t.structuredQuery.from=[{collectionId:n.lastSegment()}]),t.parent=Yd(r,s);const i=(function(h){if(h.length!==0)return sf(te.create(h,"and"))})(e.filters);i&&(t.structuredQuery.where=i);const o=(function(h){if(h.length!==0)return h.map((f=>(function(p){return{field:Pt(p.field),direction:wy(p.dir)}})(f)))})(e.orderBy);o&&(t.structuredQuery.orderBy=o);const u=ha(r,e.limit);return u!==null&&(t.structuredQuery.limit=u),e.startAt&&(t.structuredQuery.startAt=(function(h){return{before:h.inclusive,values:h.position}})(e.startAt)),e.endAt&&(t.structuredQuery.endAt=(function(h){return{before:!h.inclusive,values:h.position}})(e.endAt)),{ft:t,parent:s}}function tf(r,e,t,n){const{ft:s,parent:i}=Wi(r,e),o={},u=[];let c=0;return t.forEach((h=>{const f=n?h.alias:"aggregate_"+c++;o[f]=h.alias,h.aggregateType==="count"?u.push({alias:f,count:{}}):h.aggregateType==="avg"?u.push({alias:f,avg:{field:Pt(h.fieldPath)}}):h.aggregateType==="sum"&&u.push({alias:f,sum:{field:Pt(h.fieldPath)}})})),{request:{structuredAggregationQuery:{aggregations:u,structuredQuery:s.structuredQuery},parent:s.parent},gt:o,parent:i}}function nf(r){let e=Xd(r.parent);const t=r.structuredQuery,n=t.from?t.from.length:0;let s=null;if(n>0){L(n===1,65062);const f=t.from[0];f.allDescendants?s=f.collectionId:e=e.child(f.collectionId)}let i=[];t.where&&(i=(function(m){const p=rf(m);return p instanceof te&&Ba(p)?p.getFilters():[p]})(t.where));let o=[];t.orderBy&&(o=(function(m){return m.map((p=>(function(C){return new Ts(Un(C.field),(function(D){switch(D){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}})(C.direction))})(p)))})(t.orderBy));let u=null;t.limit&&(u=(function(m){let p;return p=typeof m=="object"?m.value:m,bs(p)?null:p})(t.limit));let c=null;t.startAt&&(c=(function(m){const p=!!m.before,v=m.values||[];return new Ut(v,p)})(t.startAt));let h=null;return t.endAt&&(h=(function(m){const p=!m.before,v=m.values||[];return new Ut(v,p)})(t.endAt)),Rd(e,s,o,i,u,"F",c,h)}function Ty(r,e){const t=(function(s){switch(s){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return F(28987,{purpose:s})}})(e.purpose);return t==null?null:{"goog-listen-tags":t}}function rf(r){return r.unaryFilter!==void 0?(function(t){switch(t.unaryFilter.op){case"IS_NAN":const n=Un(t.unaryFilter.field);return H.create(n,"==",{doubleValue:NaN});case"IS_NULL":const s=Un(t.unaryFilter.field);return H.create(s,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const i=Un(t.unaryFilter.field);return H.create(i,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const o=Un(t.unaryFilter.field);return H.create(o,"!=",{nullValue:"NULL_VALUE"});case"OPERATOR_UNSPECIFIED":return F(61313);default:return F(60726)}})(r):r.fieldFilter!==void 0?(function(t){return H.create(Un(t.fieldFilter.field),(function(s){switch(s){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";case"OPERATOR_UNSPECIFIED":return F(58110);default:return F(50506)}})(t.fieldFilter.op),t.fieldFilter.value)})(r):r.compositeFilter!==void 0?(function(t){return te.create(t.compositeFilter.filters.map((n=>rf(n))),(function(s){switch(s){case"AND":return"and";case"OR":return"or";default:return F(1026)}})(t.compositeFilter.op))})(r):F(30097,{filter:r})}function wy(r){return fy[r]}function vy(r){return my[r]}function Ay(r){return gy[r]}function Pt(r){return{fieldPath:r.canonicalString()}}function Un(r){return ce.fromServerFormat(r.fieldPath)}function sf(r){return r instanceof H?(function(t){if(t.op==="=="){if(ul(t.value))return{unaryFilter:{field:Pt(t.field),op:"IS_NAN"}};if(al(t.value))return{unaryFilter:{field:Pt(t.field),op:"IS_NULL"}}}else if(t.op==="!="){if(ul(t.value))return{unaryFilter:{field:Pt(t.field),op:"IS_NOT_NAN"}};if(al(t.value))return{unaryFilter:{field:Pt(t.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:Pt(t.field),op:vy(t.op),value:t.value}}})(r):r instanceof te?(function(t){const n=t.getFilters().map((s=>sf(s)));return n.length===1?n[0]:{compositeFilter:{op:Ay(t.op),filters:n}}})(r):F(54877,{filter:r})}function by(r){const e=[];return r.fields.forEach((t=>e.push(t.canonicalString()))),{fieldPaths:e}}function of(r){return r.length>=4&&r.get(0)==="projects"&&r.get(2)==="databases"}function af(r){return!!r&&typeof r._toProto=="function"&&r._protoValueType==="ProtoValue"}/**
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
 */class rt{constructor(e,t,n,s,i=U.min(),o=U.min(),u=fe.EMPTY_BYTE_STRING,c=null){this.target=e,this.targetId=t,this.purpose=n,this.sequenceNumber=s,this.snapshotVersion=i,this.lastLimboFreeSnapshotVersion=o,this.resumeToken=u,this.expectedCount=c}withSequenceNumber(e){return new rt(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,t){return new rt(this.target,this.targetId,this.purpose,this.sequenceNumber,t,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new rt(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new rt(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}/**
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
 */class uf{constructor(e){this.yt=e}}function Ry(r,e){let t;if(e.document)t=Qi(r.yt,e.document,!!e.hasCommittedMutations);else if(e.noDocument){const n=k.fromSegments(e.noDocument.path),s=Tn(e.noDocument.readTime);t=ue.newNoDocument(n,s),e.hasCommittedMutations&&t.setHasCommittedMutations()}else{if(!e.unknownDocument)return F(56709);{const n=k.fromSegments(e.unknownDocument.path),s=Tn(e.unknownDocument.version);t=ue.newUnknownDocument(n,s)}}return e.readTime&&t.setReadTime((function(s){const i=new ee(s[0],s[1]);return U.fromTimestamp(i)})(e.readTime)),t}function bl(r,e){const t=e.key,n={prefixPath:t.getCollectionPath().popLast().toArray(),collectionGroup:t.collectionGroup,documentId:t.path.lastSegment(),readTime:Ri(e.readTime),hasCommittedMutations:e.hasCommittedMutations};if(e.isFoundDocument())n.document=(function(i,o){return{name:ws(i,o.key),fields:o.data.value.mapValue.fields,updateTime:or(i,o.version.toTimestamp()),createTime:or(i,o.createTime.toTimestamp())}})(r.yt,e);else if(e.isNoDocument())n.noDocument={path:t.path.toArray(),readTime:En(e.version)};else{if(!e.isUnknownDocument())return F(57904,{document:e});n.unknownDocument={path:t.path.toArray(),version:En(e.version)}}return n}function Ri(r){const e=r.toTimestamp();return[e.seconds,e.nanoseconds]}function En(r){const e=r.toTimestamp();return{seconds:e.seconds,nanoseconds:e.nanoseconds}}function Tn(r){const e=new ee(r.seconds,r.nanoseconds);return U.fromTimestamp(e)}function cn(r,e){const t=(e.baseMutations||[]).map((i=>ma(r.yt,i)));for(let i=0;i<e.mutations.length-1;++i){const o=e.mutations[i];if(i+1<e.mutations.length&&e.mutations[i+1].transform!==void 0){const u=e.mutations[i+1];o.updateTransforms=u.transform.fieldTransforms,e.mutations.splice(i+1,1),++i}}const n=e.mutations.map((i=>ma(r.yt,i))),s=ee.fromMillis(e.localWriteTimeMs);return new $a(e.batchId,s,t,n)}function Zr(r){const e=Tn(r.readTime),t=r.lastLimboFreeSnapshotVersion!==void 0?Tn(r.lastLimboFreeSnapshotVersion):U.min();let n;return n=(function(i){return i.documents!==void 0})(r.query)?(function(i){const o=i.documents.length;return L(o===1,1966,{count:o}),Ne(pr(Xd(i.documents[0])))})(r.query):(function(i){return Ne(nf(i))})(r.query),new rt(n,r.targetId,"TargetPurposeListen",r.lastListenSequenceNumber,e,t,fe.fromBase64String(r.resumeToken))}function cf(r,e){const t=En(e.snapshotVersion),n=En(e.lastLimboFreeSnapshotVersion);let s;s=vi(e.target)?ef(r.yt,e.target):Wi(r.yt,e.target).ft;const i=e.resumeToken.toBase64();return{targetId:e.targetId,canonicalId:_n(e.target),readTime:t,resumeToken:i,lastListenSequenceNumber:e.sequenceNumber,lastLimboFreeSnapshotVersion:n,query:s}}function Hi(r){const e=nf({parent:r.parent,structuredQuery:r.structuredQuery});return r.limitType==="LAST"?bi(e,e.limit,"L"):e}function Lo(r,e){return new Ka(e.largestBatchId,ma(r.yt,e.overlayMutation))}function Rl(r,e){const t=e.path.lastSegment();return[r,xe(e.path.popLast()),t]}function Sl(r,e,t,n){return{indexId:r,uid:e,sequenceNumber:t,readTime:En(n.readTime),documentKey:xe(n.documentKey.path),largestBatchId:n.largestBatchId}}/**
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
 */class Sy{getBundleMetadata(e,t){return Pl(e).get(t).next((n=>{if(n)return(function(i){return{id:i.bundleId,createTime:Tn(i.createTime),version:i.version}})(n)}))}saveBundleMetadata(e,t){return Pl(e).put((function(s){return{bundleId:s.id,createTime:En(pe(s.createTime)),version:s.version}})(t))}getNamedQuery(e,t){return Vl(e).get(t).next((n=>{if(n)return(function(i){return{name:i.name,query:Hi(i.bundledQuery),readTime:Tn(i.readTime)}})(n)}))}saveNamedQuery(e,t){return Vl(e).put((function(s){return{name:s.name,readTime:En(pe(s.readTime)),bundledQuery:s.bundledQuery}})(t))}}function Pl(r){return we(r,Bi)}function Vl(r){return we(r,Ui)}/**
 * @license
 * Copyright 2022 Google LLC
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
 */class Ji{constructor(e,t){this.serializer=e,this.userId=t}static wt(e,t){const n=t.uid||"";return new Ji(e,n)}getOverlay(e,t){return $r(e).get(Rl(this.userId,t)).next((n=>n?Lo(this.serializer,n):null))}getOverlays(e,t){const n=nt();return A.forEach(t,(s=>this.getOverlay(e,s).next((i=>{i!==null&&n.set(s,i)})))).next((()=>n))}saveOverlays(e,t,n){const s=[];return n.forEach(((i,o)=>{const u=new Ka(t,o);s.push(this.St(e,u))})),A.waitFor(s)}removeOverlaysForBatchId(e,t,n){const s=new Set;t.forEach((o=>s.add(xe(o.getCollectionPath()))));const i=[];return s.forEach((o=>{const u=IDBKeyRange.bound([this.userId,o,n],[this.userId,o,n+1],!1,!0);i.push($r(e).X(ra,u))})),A.waitFor(i)}getOverlaysForCollection(e,t,n){const s=nt(),i=xe(t),o=IDBKeyRange.bound([this.userId,i,n],[this.userId,i,Number.POSITIVE_INFINITY],!0);return $r(e).J(ra,o).next((u=>{for(const c of u){const h=Lo(this.serializer,c);s.set(h.getKey(),h)}return s}))}getOverlaysForCollectionGroup(e,t,n,s){const i=nt();let o;const u=IDBKeyRange.bound([this.userId,t,n],[this.userId,t,Number.POSITIVE_INFINITY],!0);return $r(e).ee({index:rd,range:u},((c,h,f)=>{const m=Lo(this.serializer,h);i.size()<s||m.largestBatchId===o?(i.set(m.getKey(),m),o=m.largestBatchId):f.done()})).next((()=>i))}St(e,t){return $r(e).put((function(s,i,o){const[u,c,h]=Rl(i,o.mutation.key);return{userId:i,collectionPath:c,documentId:h,collectionGroup:o.mutation.key.getCollectionGroup(),largestBatchId:o.largestBatchId,overlayMutation:vs(s.yt,o.mutation)}})(this.serializer,this.userId,t))}}function $r(r){return we(r,qi)}/**
 * @license
 * Copyright 2024 Google LLC
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
 */class Py{bt(e){return we(e,Ma)}getSessionToken(e){return this.bt(e).get("sessionToken").next((t=>{const n=t==null?void 0:t.value;return n?fe.fromUint8Array(n):fe.EMPTY_BYTE_STRING}))}setSessionToken(e,t){return this.bt(e).put({name:"sessionToken",value:t.toUint8Array()})}}/**
 * @license
 * Copyright 2021 Google LLC
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
 */class ln{constructor(){}Dt(e,t){this.Ct(e,t),t.vt()}Ct(e,t){if("nullValue"in e)this.Ft(t,5);else if("booleanValue"in e)this.Ft(t,10),t.Mt(e.booleanValue?1:0);else if("integerValue"in e)this.Ft(t,15),t.Mt(le(e.integerValue));else if("doubleValue"in e){const n=le(e.doubleValue);isNaN(n)?this.Ft(t,13):(this.Ft(t,15),fs(n)?t.Mt(0):t.Mt(n))}else if("timestampValue"in e){let n=e.timestampValue;this.Ft(t,20),typeof n=="string"&&(n=ht(n)),t.xt(`${n.seconds||""}`),t.Mt(n.nanos||0)}else if("stringValue"in e)this.Ot(e.stringValue,t),this.Nt(t);else if("bytesValue"in e)this.Ft(t,30),t.Bt(dt(e.bytesValue)),this.Nt(t);else if("referenceValue"in e)this.Lt(e.referenceValue,t);else if("geoPointValue"in e){const n=e.geoPointValue;this.Ft(t,45),t.Mt(n.latitude||0),t.Mt(n.longitude||0)}else"mapValue"in e?pd(e)?this.Ft(t,Number.MAX_SAFE_INTEGER):$i(e)?this.kt(e.mapValue,t):(this.Kt(e.mapValue,t),this.Nt(t)):"arrayValue"in e?(this.qt(e.arrayValue,t),this.Nt(t)):F(19022,{Ut:e})}Ot(e,t){this.Ft(t,25),this.$t(e,t)}$t(e,t){t.xt(e)}Kt(e,t){const n=e.fields||{};this.Ft(t,55);for(const s of Object.keys(n))this.Ot(s,t),this.Ct(n[s],t)}kt(e,t){var o,u;const n=e.fields||{};this.Ft(t,53);const s=tr,i=((u=(o=n[s].arrayValue)==null?void 0:o.values)==null?void 0:u.length)||0;this.Ft(t,15),t.Mt(le(i)),this.Ot(s,t),this.Ct(n[s],t)}qt(e,t){const n=e.values||[];this.Ft(t,50);for(const s of n)this.Ct(s,t)}Lt(e,t){this.Ft(t,37),k.fromName(e).path.forEach((n=>{this.Ft(t,60),this.$t(n,t)}))}Ft(e,t){e.Mt(t)}Nt(e){e.Mt(2)}}ln.Wt=new ln;/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law | agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES | CONDITIONS OF ANY KIND, either express | implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const kn=255;function Vy(r){if(r===0)return 8;let e=0;return r>>4||(e+=4,r<<=4),r>>6||(e+=2,r<<=2),r>>7||(e+=1),e}function Cl(r){const e=64-(function(n){let s=0;for(let i=0;i<8;++i){const o=Vy(255&n[i]);if(s+=o,o!==8)break}return s})(r);return Math.ceil(e/8)}class Cy{constructor(){this.buffer=new Uint8Array(1024),this.position=0}Qt(e){const t=e[Symbol.iterator]();let n=t.next();for(;!n.done;)this.Gt(n.value),n=t.next();this.zt()}jt(e){const t=e[Symbol.iterator]();let n=t.next();for(;!n.done;)this.Jt(n.value),n=t.next();this.Ht()}Zt(e){for(const t of e){const n=t.charCodeAt(0);if(n<128)this.Gt(n);else if(n<2048)this.Gt(960|n>>>6),this.Gt(128|63&n);else if(t<"\uD800"||"\uDBFF"<t)this.Gt(480|n>>>12),this.Gt(128|63&n>>>6),this.Gt(128|63&n);else{const s=t.codePointAt(0);this.Gt(240|s>>>18),this.Gt(128|63&s>>>12),this.Gt(128|63&s>>>6),this.Gt(128|63&s)}}this.zt()}Xt(e){for(const t of e){const n=t.charCodeAt(0);if(n<128)this.Jt(n);else if(n<2048)this.Jt(960|n>>>6),this.Jt(128|63&n);else if(t<"\uD800"||"\uDBFF"<t)this.Jt(480|n>>>12),this.Jt(128|63&n>>>6),this.Jt(128|63&n);else{const s=t.codePointAt(0);this.Jt(240|s>>>18),this.Jt(128|63&s>>>12),this.Jt(128|63&s>>>6),this.Jt(128|63&s)}}this.Ht()}Yt(e){const t=this.en(e),n=Cl(t);this.tn(1+n),this.buffer[this.position++]=255&n;for(let s=t.length-n;s<t.length;++s)this.buffer[this.position++]=255&t[s]}nn(e){const t=this.en(e),n=Cl(t);this.tn(1+n),this.buffer[this.position++]=~(255&n);for(let s=t.length-n;s<t.length;++s)this.buffer[this.position++]=~(255&t[s])}rn(){this.sn(kn),this.sn(255)}_n(){this.an(kn),this.an(255)}reset(){this.position=0}seed(e){this.tn(e.length),this.buffer.set(e,this.position),this.position+=e.length}un(){return this.buffer.slice(0,this.position)}en(e){const t=(function(i){const o=new DataView(new ArrayBuffer(8));return o.setFloat64(0,i,!1),new Uint8Array(o.buffer)})(e),n=!!(128&t[0]);t[0]^=n?255:128;for(let s=1;s<t.length;++s)t[s]^=n?255:0;return t}Gt(e){const t=255&e;t===0?(this.sn(0),this.sn(255)):t===kn?(this.sn(kn),this.sn(0)):this.sn(t)}Jt(e){const t=255&e;t===0?(this.an(0),this.an(255)):t===kn?(this.an(kn),this.an(0)):this.an(e)}zt(){this.sn(0),this.sn(1)}Ht(){this.an(0),this.an(1)}sn(e){this.tn(1),this.buffer[this.position++]=e}an(e){this.tn(1),this.buffer[this.position++]=~e}tn(e){const t=e+this.position;if(t<=this.buffer.length)return;let n=2*this.buffer.length;n<t&&(n=t);const s=new Uint8Array(n);s.set(this.buffer),this.buffer=s}}class Dy{constructor(e){this.cn=e}Bt(e){this.cn.Qt(e)}xt(e){this.cn.Zt(e)}Mt(e){this.cn.Yt(e)}vt(){this.cn.rn()}}class xy{constructor(e){this.cn=e}Bt(e){this.cn.jt(e)}xt(e){this.cn.Xt(e)}Mt(e){this.cn.nn(e)}vt(){this.cn._n()}}class Gr{constructor(){this.cn=new Cy,this.ascending=new Dy(this.cn),this.descending=new xy(this.cn)}seed(e){this.cn.seed(e)}ln(e){return e===0?this.ascending:this.descending}un(){return this.cn.un()}reset(){this.cn.reset()}}/**
 * @license
 * Copyright 2022 Google LLC
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
 */class hn{constructor(e,t,n,s){this.hn=e,this.Pn=t,this.Tn=n,this.In=s}En(){const e=this.In.length,t=e===0||this.In[e-1]===255?e+1:e,n=new Uint8Array(t);return n.set(this.In,0),t!==e?n.set([0],this.In.length):++n[n.length-1],new hn(this.hn,this.Pn,this.Tn,n)}Rn(e,t,n){return{indexId:this.hn,uid:e,arrayValue:gi(this.Tn),directionalValue:gi(this.In),orderedDocumentKey:gi(t),documentKey:n.path.toArray()}}An(e,t,n){const s=this.Rn(e,t,n);return[s.indexId,s.uid,s.arrayValue,s.directionalValue,s.orderedDocumentKey,s.documentKey]}}function bt(r,e){let t=r.hn-e.hn;return t!==0?t:(t=Dl(r.Tn,e.Tn),t!==0?t:(t=Dl(r.In,e.In),t!==0?t:k.comparator(r.Pn,e.Pn)))}function Dl(r,e){for(let t=0;t<r.length&&t<e.length;++t){const n=r[t]-e[t];if(n!==0)return n}return r.length-e.length}function gi(r){return Ah()?(function(t){let n="";for(let s=0;s<t.length;s++)n+=String.fromCharCode(t[s]);return n})(r):r}function xl(r){return typeof r!="string"?r:(function(t){const n=new Uint8Array(t.length);for(let s=0;s<t.length;s++)n[s]=t.charCodeAt(s);return n})(r)}class Nl{constructor(e){this.Vn=new re(((t,n)=>ce.comparator(t.field,n.field))),this.collectionId=e.collectionGroup!=null?e.collectionGroup:e.path.lastSegment(),this.dn=e.orderBy,this.mn=[];for(const t of e.filters){const n=t;n.isInequality()?this.Vn=this.Vn.add(n):this.mn.push(n)}}get fn(){return this.Vn.size>1}gn(e){if(L(e.collectionGroup===this.collectionId,49279),this.fn)return!1;const t=ea(e);if(t!==void 0&&!this.pn(t))return!1;const n=on(e);let s=new Set,i=0,o=0;for(;i<n.length&&this.pn(n[i]);++i)s=s.add(n[i].fieldPath.canonicalString());if(i===n.length)return!0;if(this.Vn.size>0){const u=this.Vn.getIterator().getNext();if(!s.has(u.field.canonicalString())){const c=n[i];if(!this.yn(u,c)||!this.wn(this.dn[o++],c))return!1}++i}for(;i<n.length;++i){const u=n[i];if(o>=this.dn.length||!this.wn(this.dn[o++],u))return!1}return!0}Sn(){if(this.fn)return null;let e=new re(ce.comparator);const t=[];for(const n of this.mn)if(!n.field.isKeyField())if(n.op==="array-contains"||n.op==="array-contains-any")t.push(new fn(n.field,2));else{if(e.has(n.field))continue;e=e.add(n.field),t.push(new fn(n.field,0))}for(const n of this.dn)n.field.isKeyField()||e.has(n.field)||(e=e.add(n.field),t.push(new fn(n.field,n.dir==="asc"?0:1)));return new Hn(Hn.UNKNOWN_ID,this.collectionId,t,Jn.empty())}pn(e){for(const t of this.mn)if(this.yn(t,e))return!0;return!1}yn(e,t){if(e===void 0||!e.field.isEqual(t.fieldPath))return!1;const n=e.op==="array-contains"||e.op==="array-contains-any";return t.kind===2===n}wn(e,t){return!!e.field.isEqual(t.fieldPath)&&(t.kind===0&&e.dir==="asc"||t.kind===1&&e.dir==="desc")}}/**
 * @license
 * Copyright 2022 Google LLC
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
 */function lf(r){var t,n;if(L(r instanceof H||r instanceof te,20012),r instanceof H){if(r instanceof bd){const s=((n=(t=r.value.arrayValue)==null?void 0:t.values)==null?void 0:n.map((i=>H.create(r.field,"==",i))))||[];return te.create(s,"or")}return r}const e=r.filters.map((s=>lf(s)));return te.create(e,r.op)}function Ny(r){if(r.getFilters().length===0)return[];const e=_a(lf(r));return L(hf(e),7391),ga(e)||pa(e)?[e]:e.getFilters()}function ga(r){return r instanceof H}function pa(r){return r instanceof te&&Ba(r)}function hf(r){return ga(r)||pa(r)||(function(t){if(t instanceof te&&aa(t)){for(const n of t.getFilters())if(!ga(n)&&!pa(n))return!1;return!0}return!1})(r)}function _a(r){if(L(r instanceof H||r instanceof te,34018),r instanceof H)return r;if(r.filters.length===1)return _a(r.filters[0]);const e=r.filters.map((n=>_a(n)));let t=te.create(e,r.op);return t=Si(t),hf(t)?t:(L(t instanceof te,64498),L(rr(t),40251),L(t.filters.length>1,57927),t.filters.reduce(((n,s)=>Ha(n,s))))}function Ha(r,e){let t;return L(r instanceof H||r instanceof te,38388),L(e instanceof H||e instanceof te,25473),t=r instanceof H?e instanceof H?(function(s,i){return te.create([s,i],"and")})(r,e):kl(r,e):e instanceof H?kl(e,r):(function(s,i){if(L(s.filters.length>0&&i.filters.length>0,48005),rr(s)&&rr(i))return wd(s,i.getFilters());const o=aa(s)?s:i,u=aa(s)?i:s,c=o.filters.map((h=>Ha(h,u)));return te.create(c,"or")})(r,e),Si(t)}function kl(r,e){if(rr(e))return wd(e,r.getFilters());{const t=e.filters.map((n=>Ha(r,n)));return te.create(t,"or")}}function Si(r){if(L(r instanceof H||r instanceof te,11850),r instanceof H)return r;const e=r.getFilters();if(e.length===1)return Si(e[0]);if(Ed(r))return r;const t=e.map((s=>Si(s))),n=[];return t.forEach((s=>{s instanceof H?n.push(s):s instanceof te&&(s.op===r.op?n.push(...s.filters):n.push(s))})),n.length===1?n[0]:te.create(n,r.op)}/**
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
 */class ky{constructor(){this.bn=new Ja}addToCollectionParentIndex(e,t){return this.bn.add(t),A.resolve()}getCollectionParents(e,t){return A.resolve(this.bn.getEntries(t))}addFieldIndex(e,t){return A.resolve()}deleteFieldIndex(e,t){return A.resolve()}deleteAllFieldIndexes(e){return A.resolve()}createTargetIndexes(e,t){return A.resolve()}getDocumentsMatchingTarget(e,t){return A.resolve(null)}getIndexType(e,t){return A.resolve(0)}getFieldIndexes(e,t){return A.resolve([])}getNextCollectionGroupToUpdate(e){return A.resolve(null)}getMinOffset(e,t){return A.resolve(Qe.min())}getMinOffsetFromCollectionGroup(e,t){return A.resolve(Qe.min())}updateCollectionGroup(e,t,n){return A.resolve()}updateIndexEntries(e,t){return A.resolve()}}class Ja{constructor(){this.index={}}add(e){const t=e.lastSegment(),n=e.popLast(),s=this.index[t]||new re(K.comparator),i=!s.has(n);return this.index[t]=s.add(n),i}has(e){const t=e.lastSegment(),n=e.popLast(),s=this.index[t];return s&&s.has(n)}getEntries(e){return(this.index[e]||new re(K.comparator)).toArray()}}/**
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
 */const Ml="IndexedDbIndexManager",ni=new Uint8Array(0);class My{constructor(e,t){this.databaseId=t,this.Dn=new Ja,this.Cn=new pt((n=>_n(n)),((n,s)=>Ss(n,s))),this.uid=e.uid||""}addToCollectionParentIndex(e,t){if(!this.Dn.has(t)){const n=t.lastSegment(),s=t.popLast();e.addOnCommittedListener((()=>{this.Dn.add(t)}));const i={collectionId:n,parent:xe(s)};return Ol(e).put(i)}return A.resolve()}getCollectionParents(e,t){const n=[],s=IDBKeyRange.bound([t,""],[jh(t),""],!1,!0);return Ol(e).J(s).next((i=>{for(const o of i){if(o.collectionId!==t)break;n.push(tt(o.parent))}return n}))}addFieldIndex(e,t){const n=Kr(e),s=(function(u){return{indexId:u.indexId,collectionGroup:u.collectionGroup,fields:u.fields.map((c=>[c.fieldPath.canonicalString(),c.kind]))}})(t);delete s.indexId;const i=n.add(s);if(t.indexState){const o=On(e);return i.next((u=>{o.put(Sl(u,this.uid,t.indexState.sequenceNumber,t.indexState.offset))}))}return i.next()}deleteFieldIndex(e,t){const n=Kr(e),s=On(e),i=Mn(e);return n.delete(t.indexId).next((()=>s.delete(IDBKeyRange.bound([t.indexId],[t.indexId+1],!1,!0)))).next((()=>i.delete(IDBKeyRange.bound([t.indexId],[t.indexId+1],!1,!0))))}deleteAllFieldIndexes(e){const t=Kr(e),n=Mn(e),s=On(e);return t.X().next((()=>n.X())).next((()=>s.X()))}createTargetIndexes(e,t){return A.forEach(this.vn(t),(n=>this.getIndexType(e,n).next((s=>{if(s===0||s===1){const i=new Nl(n).Sn();if(i!=null)return this.addFieldIndex(e,i)}}))))}getDocumentsMatchingTarget(e,t){const n=Mn(e);let s=!0;const i=new Map;return A.forEach(this.vn(t),(o=>this.Fn(e,o).next((u=>{s&&(s=!!u),i.set(o,u)})))).next((()=>{if(s){let o=$();const u=[];return A.forEach(i,((c,h)=>{x(Ml,`Using index ${(function(q){return`id=${q.indexId}|cg=${q.collectionGroup}|f=${q.fields.map((Z=>`${Z.fieldPath}:${Z.kind}`)).join(",")}`})(c)} to execute ${_n(t)}`);const f=(function(q,Z){const W=ea(Z);if(W===void 0)return null;for(const J of Ai(q,W.fieldPath))switch(J.op){case"array-contains-any":return J.value.arrayValue.values||[];case"array-contains":return[J.value]}return null})(h,c),m=(function(q,Z){const W=new Map;for(const J of on(Z))for(const E of Ai(q,J.fieldPath))switch(E.op){case"==":case"in":W.set(J.fieldPath.canonicalString(),E.value);break;case"not-in":case"!=":return W.set(J.fieldPath.canonicalString(),E.value),Array.from(W.values())}return null})(h,c),p=(function(q,Z){const W=[];let J=!0;for(const E of on(Z)){const _=E.kind===0?fl(q,E.fieldPath,q.startAt):ml(q,E.fieldPath,q.startAt);W.push(_.value),J&&(J=_.inclusive)}return new Ut(W,J)})(h,c),v=(function(q,Z){const W=[];let J=!0;for(const E of on(Z)){const _=E.kind===0?ml(q,E.fieldPath,q.endAt):fl(q,E.fieldPath,q.endAt);W.push(_.value),J&&(J=_.inclusive)}return new Ut(W,J)})(h,c),C=this.Mn(c,h,p),N=this.Mn(c,h,v),D=this.xn(c,h,m),B=this.On(c.indexId,f,C,p.inclusive,N,v.inclusive,D);return A.forEach(B,(j=>n.Z(j,t.limit).next((q=>{q.forEach((Z=>{const W=k.fromSegments(Z.documentKey);o.has(W)||(o=o.add(W),u.push(W))}))}))))})).next((()=>u))}return A.resolve(null)}))}vn(e){let t=this.Cn.get(e);return t||(e.filters.length===0?t=[e]:t=Ny(te.create(e.filters,"and")).map((n=>ca(e.path,e.collectionGroup,e.orderBy,n.getFilters(),e.limit,e.startAt,e.endAt))),this.Cn.set(e,t),t)}On(e,t,n,s,i,o,u){const c=(t!=null?t.length:1)*Math.max(n.length,i.length),h=c/(t!=null?t.length:1),f=[];for(let m=0;m<c;++m){const p=t?this.Nn(t[m/h]):ni,v=this.Bn(e,p,n[m%h],s),C=this.Ln(e,p,i[m%h],o),N=u.map((D=>this.Bn(e,p,D,!0)));f.push(...this.createRange(v,C,N))}return f}Bn(e,t,n,s){const i=new hn(e,k.empty(),t,n);return s?i:i.En()}Ln(e,t,n,s){const i=new hn(e,k.empty(),t,n);return s?i.En():i}Fn(e,t){const n=new Nl(t),s=t.collectionGroup!=null?t.collectionGroup:t.path.lastSegment();return this.getFieldIndexes(e,s).next((i=>{let o=null;for(const u of i)n.gn(u)&&(!o||u.fields.length>o.fields.length)&&(o=u);return o}))}getIndexType(e,t){let n=2;const s=this.vn(t);return A.forEach(s,(i=>this.Fn(e,i).next((o=>{o?n!==0&&o.fields.length<(function(c){let h=new re(ce.comparator),f=!1;for(const m of c.filters)for(const p of m.getFlattenedFilters())p.field.isKeyField()||(p.op==="array-contains"||p.op==="array-contains-any"?f=!0:h=h.add(p.field));for(const m of c.orderBy)m.field.isKeyField()||(h=h.add(m.field));return h.size+(f?1:0)})(i)&&(n=1):n=0})))).next((()=>(function(o){return o.limit!==null})(t)&&s.length>1&&n===2?1:n))}kn(e,t){const n=new Gr;for(const s of on(e)){const i=t.data.field(s.fieldPath);if(i==null)return null;const o=n.ln(s.kind);ln.Wt.Dt(i,o)}return n.un()}Nn(e){const t=new Gr;return ln.Wt.Dt(e,t.ln(0)),t.un()}Kn(e,t){const n=new Gr;return ln.Wt.Dt(pn(this.databaseId,t),n.ln((function(i){const o=on(i);return o.length===0?0:o[o.length-1].kind})(e))),n.un()}xn(e,t,n){if(n===null)return[];let s=[];s.push(new Gr);let i=0;for(const o of on(e)){const u=n[i++];for(const c of s)if(this.qn(t,o.fieldPath)&&Es(u))s=this.Un(s,o,u);else{const h=c.ln(o.kind);ln.Wt.Dt(u,h)}}return this.$n(s)}Mn(e,t,n){return this.xn(e,t,n.position)}$n(e){const t=[];for(let n=0;n<e.length;++n)t[n]=e[n].un();return t}Un(e,t,n){const s=[...e],i=[];for(const o of n.arrayValue.values||[])for(const u of s){const c=new Gr;c.seed(u.un()),ln.Wt.Dt(o,c.ln(t.kind)),i.push(c)}return i}qn(e,t){return!!e.filters.find((n=>n instanceof H&&n.field.isEqual(t)&&(n.op==="in"||n.op==="not-in")))}getFieldIndexes(e,t){const n=Kr(e),s=On(e);return(t?n.J(na,IDBKeyRange.bound(t,t)):n.J()).next((i=>{const o=[];return A.forEach(i,(u=>s.get([u.indexId,this.uid]).next((c=>{o.push((function(f,m){const p=m?new Jn(m.sequenceNumber,new Qe(Tn(m.readTime),new k(tt(m.documentKey)),m.largestBatchId)):Jn.empty(),v=f.fields.map((([C,N])=>new fn(ce.fromServerFormat(C),N)));return new Hn(f.indexId,f.collectionGroup,v,p)})(u,c))})))).next((()=>o))}))}getNextCollectionGroupToUpdate(e){return this.getFieldIndexes(e).next((t=>t.length===0?null:(t.sort(((n,s)=>{const i=n.indexState.sequenceNumber-s.indexState.sequenceNumber;return i!==0?i:z(n.collectionGroup,s.collectionGroup)})),t[0].collectionGroup)))}updateCollectionGroup(e,t,n){const s=Kr(e),i=On(e);return this.Wn(e).next((o=>s.J(na,IDBKeyRange.bound(t,t)).next((u=>A.forEach(u,(c=>i.put(Sl(c.indexId,this.uid,o,n))))))))}updateIndexEntries(e,t){const n=new Map;return A.forEach(t,((s,i)=>{const o=n.get(s.collectionGroup);return(o?A.resolve(o):this.getFieldIndexes(e,s.collectionGroup)).next((u=>(n.set(s.collectionGroup,u),A.forEach(u,(c=>this.Qn(e,s,c).next((h=>{const f=this.Gn(i,c);return h.isEqual(f)?A.resolve():this.zn(e,i,c,h,f)})))))))}))}jn(e,t,n,s){return Mn(e).put(s.Rn(this.uid,this.Kn(n,t.key),t.key))}Jn(e,t,n,s){return Mn(e).delete(s.An(this.uid,this.Kn(n,t.key),t.key))}Qn(e,t,n){const s=Mn(e);let i=new re(bt);return s.ee({index:nd,range:IDBKeyRange.only([n.indexId,this.uid,gi(this.Kn(n,t))])},((o,u)=>{i=i.add(new hn(n.indexId,t,xl(u.arrayValue),xl(u.directionalValue)))})).next((()=>i))}Gn(e,t){let n=new re(bt);const s=this.kn(t,e);if(s==null)return n;const i=ea(t);if(i!=null){const o=e.data.field(i.fieldPath);if(Es(o))for(const u of o.arrayValue.values||[])n=n.add(new hn(t.indexId,e.key,this.Nn(u),s))}else n=n.add(new hn(t.indexId,e.key,ni,s));return n}zn(e,t,n,s,i){x(Ml,"Updating index entries for document '%s'",t.key);const o=[];return(function(c,h,f,m,p){const v=c.getIterator(),C=h.getIterator();let N=Nn(v),D=Nn(C);for(;N||D;){let B=!1,j=!1;if(N&&D){const q=f(N,D);q<0?j=!0:q>0&&(B=!0)}else N!=null?j=!0:B=!0;B?(m(D),D=Nn(C)):j?(p(N),N=Nn(v)):(N=Nn(v),D=Nn(C))}})(s,i,bt,(u=>{o.push(this.jn(e,t,n,u))}),(u=>{o.push(this.Jn(e,t,n,u))})),A.waitFor(o)}Wn(e){let t=1;return On(e).ee({index:td,reverse:!0,range:IDBKeyRange.upperBound([this.uid,Number.MAX_SAFE_INTEGER])},((n,s,i)=>{i.done(),t=s.sequenceNumber+1})).next((()=>t))}createRange(e,t,n){n=n.sort(((o,u)=>bt(o,u))).filter(((o,u,c)=>!u||bt(o,c[u-1])!==0));const s=[];s.push(e);for(const o of n){const u=bt(o,e),c=bt(o,t);if(u===0)s[0]=e.En();else if(u>0&&c<0)s.push(o),s.push(o.En());else if(c>0)break}s.push(t);const i=[];for(let o=0;o<s.length;o+=2){if(this.Hn(s[o],s[o+1]))return[];const u=s[o].An(this.uid,ni,k.empty()),c=s[o+1].An(this.uid,ni,k.empty());i.push(IDBKeyRange.bound(u,c))}return i}Hn(e,t){return bt(e,t)>0}getMinOffsetFromCollectionGroup(e,t){return this.getFieldIndexes(e,t).next(Fl)}getMinOffset(e,t){return A.mapArray(this.vn(t),(n=>this.Fn(e,n).next((s=>s||F(44426))))).next(Fl)}}function Ol(r){return we(r,ps)}function Mn(r){return we(r,rs)}function Kr(r){return we(r,ka)}function On(r){return we(r,ns)}function Fl(r){L(r.length!==0,28825);let e=r[0].indexState.offset,t=e.largestBatchId;for(let n=1;n<r.length;n++){const s=r[n].indexState.offset;Da(s,e)<0&&(e=s),t<s.largestBatchId&&(t=s.largestBatchId)}return new Qe(e.readTime,e.documentKey,t)}/**
 * @license
 * Copyright 2018 Google LLC
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
 */const Ll={didRun:!1,sequenceNumbersCollected:0,targetsRemoved:0,documentsRemoved:0},df=41943040;class De{static withCacheSize(e){return new De(e,De.DEFAULT_COLLECTION_PERCENTILE,De.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}constructor(e,t,n){this.cacheSizeCollectionThreshold=e,this.percentileToCollect=t,this.maximumSequenceNumbersToCollect=n}}/**
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
 */function ff(r,e,t){const n=r.store(We),s=r.store(Yn),i=[],o=IDBKeyRange.only(t.batchId);let u=0;const c=n.ee({range:o},((f,m,p)=>(u++,p.delete())));i.push(c.next((()=>{L(u===1,47070,{batchId:t.batchId})})));const h=[];for(const f of t.mutations){const m=Xh(e,f.key.path,t.batchId);i.push(s.delete(m)),h.push(f.key)}return A.waitFor(i).next((()=>h))}function Pi(r){if(!r)return 0;let e;if(r.document)e=r.document;else if(r.unknownDocument)e=r.unknownDocument;else{if(!r.noDocument)throw F(14731);e=r.noDocument}return JSON.stringify(e).length}/**
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
 */De.DEFAULT_COLLECTION_PERCENTILE=10,De.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT=1e3,De.DEFAULT=new De(df,De.DEFAULT_COLLECTION_PERCENTILE,De.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT),De.DISABLED=new De(-1,0,0);class Yi{constructor(e,t,n,s){this.userId=e,this.serializer=t,this.indexManager=n,this.referenceDelegate=s,this.Zn={}}static wt(e,t,n,s){L(e.uid!=="",64387);const i=e.isAuthenticated()?e.uid:"";return new Yi(i,t,n,s)}checkEmpty(e){let t=!0;const n=IDBKeyRange.bound([this.userId,Number.NEGATIVE_INFINITY],[this.userId,Number.POSITIVE_INFINITY]);return Rt(e).ee({index:dn,range:n},((s,i,o)=>{t=!1,o.done()})).next((()=>t))}addMutationBatch(e,t,n,s){const i=qn(e),o=Rt(e);return o.add({}).next((u=>{L(typeof u=="number",49019);const c=new $a(u,t,n,s),h=(function(v,C,N){const D=N.baseMutations.map((j=>vs(v.yt,j))),B=N.mutations.map((j=>vs(v.yt,j)));return{userId:C,batchId:N.batchId,localWriteTimeMs:N.localWriteTime.toMillis(),baseMutations:D,mutations:B}})(this.serializer,this.userId,c),f=[];let m=new re(((p,v)=>z(p.canonicalString(),v.canonicalString())));for(const p of s){const v=Xh(this.userId,p.key.path,u);m=m.add(p.key.path.popLast()),f.push(o.put(h)),f.push(i.put(v,l_))}return m.forEach((p=>{f.push(this.indexManager.addToCollectionParentIndex(e,p))})),e.addOnCommittedListener((()=>{this.Zn[u]=c.keys()})),A.waitFor(f).next((()=>c))}))}lookupMutationBatch(e,t){return Rt(e).get(t).next((n=>n?(L(n.userId===this.userId,48,"Unexpected user for mutation batch",{userId:n.userId,batchId:t}),cn(this.serializer,n)):null))}Xn(e,t){return this.Zn[t]?A.resolve(this.Zn[t]):this.lookupMutationBatch(e,t).next((n=>{if(n){const s=n.keys();return this.Zn[t]=s,s}return null}))}getNextMutationBatchAfterBatchId(e,t){const n=t+1,s=IDBKeyRange.lowerBound([this.userId,n]);let i=null;return Rt(e).ee({index:dn,range:s},((o,u,c)=>{u.userId===this.userId&&(L(u.batchId>=n,47524,{Yn:n}),i=cn(this.serializer,u)),c.done()})).next((()=>i))}getHighestUnacknowledgedBatchId(e){const t=IDBKeyRange.upperBound([this.userId,Number.POSITIVE_INFINITY]);let n=kt;return Rt(e).ee({index:dn,range:t,reverse:!0},((s,i,o)=>{n=i.batchId,o.done()})).next((()=>n))}getAllMutationBatches(e){const t=IDBKeyRange.bound([this.userId,kt],[this.userId,Number.POSITIVE_INFINITY]);return Rt(e).J(dn,t).next((n=>n.map((s=>cn(this.serializer,s)))))}getAllMutationBatchesAffectingDocumentKey(e,t){const n=ui(this.userId,t.path),s=IDBKeyRange.lowerBound(n),i=[];return qn(e).ee({range:s},((o,u,c)=>{const[h,f,m]=o,p=tt(f);if(h===this.userId&&t.path.isEqual(p))return Rt(e).get(m).next((v=>{if(!v)throw F(61480,{er:o,batchId:m});L(v.userId===this.userId,10503,"Unexpected user for mutation batch",{userId:v.userId,batchId:m}),i.push(cn(this.serializer,v))}));c.done()})).next((()=>i))}getAllMutationBatchesAffectingDocumentKeys(e,t){let n=new re(z);const s=[];return t.forEach((i=>{const o=ui(this.userId,i.path),u=IDBKeyRange.lowerBound(o),c=qn(e).ee({range:u},((h,f,m)=>{const[p,v,C]=h,N=tt(v);p===this.userId&&i.path.isEqual(N)?n=n.add(C):m.done()}));s.push(c)})),A.waitFor(s).next((()=>this.tr(e,n)))}getAllMutationBatchesAffectingQuery(e,t){const n=t.path,s=n.length+1,i=ui(this.userId,n),o=IDBKeyRange.lowerBound(i);let u=new re(z);return qn(e).ee({range:o},((c,h,f)=>{const[m,p,v]=c,C=tt(p);m===this.userId&&n.isPrefixOf(C)?C.length===s&&(u=u.add(v)):f.done()})).next((()=>this.tr(e,u)))}tr(e,t){const n=[],s=[];return t.forEach((i=>{s.push(Rt(e).get(i).next((o=>{if(o===null)throw F(35274,{batchId:i});L(o.userId===this.userId,9748,"Unexpected user for mutation batch",{userId:o.userId,batchId:i}),n.push(cn(this.serializer,o))})))})),A.waitFor(s).next((()=>n))}removeMutationBatch(e,t){return ff(e.le,this.userId,t).next((n=>(e.addOnCommittedListener((()=>{this.nr(t.batchId)})),A.forEach(n,(s=>this.referenceDelegate.markPotentiallyOrphaned(e,s))))))}nr(e){delete this.Zn[e]}performConsistencyCheck(e){return this.checkEmpty(e).next((t=>{if(!t)return A.resolve();const n=IDBKeyRange.lowerBound((function(o){return[o]})(this.userId)),s=[];return qn(e).ee({range:n},((i,o,u)=>{if(i[0]===this.userId){const c=tt(i[1]);s.push(c)}else u.done()})).next((()=>{L(s.length===0,56720,{rr:s.map((i=>i.canonicalString()))})}))}))}containsKey(e,t){return mf(e,this.userId,t)}ir(e){return gf(e).get(this.userId).next((t=>t||{userId:this.userId,lastAcknowledgedBatchId:kt,lastStreamToken:""}))}}function mf(r,e,t){const n=ui(e,t.path),s=n[1],i=IDBKeyRange.lowerBound(n);let o=!1;return qn(r).ee({range:i,Y:!0},((u,c,h)=>{const[f,m,p]=u;f===e&&m===s&&(o=!0),h.done()})).next((()=>o))}function Rt(r){return we(r,We)}function qn(r){return we(r,Yn)}function gf(r){return we(r,ms)}/**
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
 */class ft{constructor(e){this.sr=e}next(){return this.sr+=2,this.sr}static _r(){return new ft(0)}static ar(){return new ft(-1)}}/**
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
 */class Oy{constructor(e,t){this.referenceDelegate=e,this.serializer=t}allocateTargetId(e){return this.ur(e).next((t=>{const n=new ft(t.highestTargetId);return t.highestTargetId=n.next(),this.cr(e,t).next((()=>t.highestTargetId))}))}getLastRemoteSnapshotVersion(e){return this.ur(e).next((t=>U.fromTimestamp(new ee(t.lastRemoteSnapshotVersion.seconds,t.lastRemoteSnapshotVersion.nanoseconds))))}getHighestSequenceNumber(e){return this.ur(e).next((t=>t.highestListenSequenceNumber))}setTargetsMetadata(e,t,n){return this.ur(e).next((s=>(s.highestListenSequenceNumber=t,n&&(s.lastRemoteSnapshotVersion=n.toTimestamp()),t>s.highestListenSequenceNumber&&(s.highestListenSequenceNumber=t),this.cr(e,s))))}addTargetData(e,t){return this.lr(e,t).next((()=>this.ur(e).next((n=>(n.targetCount+=1,this.hr(t,n),this.cr(e,n))))))}updateTargetData(e,t){return this.lr(e,t)}removeTargetData(e,t){return this.removeMatchingKeysForTargetId(e,t.targetId).next((()=>Fn(e).delete(t.targetId))).next((()=>this.ur(e))).next((n=>(L(n.targetCount>0,8065),n.targetCount-=1,this.cr(e,n))))}removeTargets(e,t,n){let s=0;const i=[];return Fn(e).ee(((o,u)=>{const c=Zr(u);c.sequenceNumber<=t&&n.get(c.targetId)===null&&(s++,i.push(this.removeTargetData(e,c)))})).next((()=>A.waitFor(i))).next((()=>s))}forEachTarget(e,t){return Fn(e).ee(((n,s)=>{const i=Zr(s);t(i)}))}ur(e){return Bl(e).get(wi).next((t=>(L(t!==null,2888),t)))}cr(e,t){return Bl(e).put(wi,t)}lr(e,t){return Fn(e).put(cf(this.serializer,t))}hr(e,t){let n=!1;return e.targetId>t.highestTargetId&&(t.highestTargetId=e.targetId,n=!0),e.sequenceNumber>t.highestListenSequenceNumber&&(t.highestListenSequenceNumber=e.sequenceNumber,n=!0),n}getTargetCount(e){return this.ur(e).next((t=>t.targetCount))}getTargetData(e,t){const n=_n(t),s=IDBKeyRange.bound([n,Number.NEGATIVE_INFINITY],[n,Number.POSITIVE_INFINITY]);let i=null;return Fn(e).ee({range:s,index:ed},((o,u,c)=>{const h=Zr(u);Ss(t,h.target)&&(i=h,c.done())})).next((()=>i))}addMatchingKeys(e,t,n){const s=[],i=Vt(e);return t.forEach((o=>{const u=xe(o.path);s.push(i.put({targetId:n,path:u})),s.push(this.referenceDelegate.addReference(e,n,o))})),A.waitFor(s)}removeMatchingKeys(e,t,n){const s=Vt(e);return A.forEach(t,(i=>{const o=xe(i.path);return A.waitFor([s.delete([n,o]),this.referenceDelegate.removeReference(e,n,i)])}))}removeMatchingKeysForTargetId(e,t){const n=Vt(e),s=IDBKeyRange.bound([t],[t+1],!1,!0);return n.delete(s)}getMatchingKeysForTargetId(e,t){const n=IDBKeyRange.bound([t],[t+1],!1,!0),s=Vt(e);let i=$();return s.ee({range:n,Y:!0},((o,u,c)=>{const h=tt(o[1]),f=new k(h);i=i.add(f)})).next((()=>i))}containsKey(e,t){const n=xe(t.path),s=IDBKeyRange.bound([n],[jh(n)],!1,!0);let i=0;return Vt(e).ee({index:Na,Y:!0,range:s},(([o,u],c,h)=>{o!==0&&(i++,h.done())})).next((()=>i>0))}At(e,t){return Fn(e).get(t).next((n=>n?Zr(n):null))}}function Fn(r){return we(r,Xn)}function Bl(r){return we(r,mn)}function Vt(r){return we(r,Zn)}/**
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
 */const Ul="LruGarbageCollector",pf=1048576;function ql([r,e],[t,n]){const s=z(r,t);return s===0?z(e,n):s}class Fy{constructor(e){this.Pr=e,this.buffer=new re(ql),this.Tr=0}Ir(){return++this.Tr}Er(e){const t=[e,this.Ir()];if(this.buffer.size<this.Pr)this.buffer=this.buffer.add(t);else{const n=this.buffer.last();ql(t,n)<0&&(this.buffer=this.buffer.delete(n).add(t))}}get maxValue(){return this.buffer.last()[0]}}class _f{constructor(e,t,n){this.garbageCollector=e,this.asyncQueue=t,this.localStore=n,this.Rr=null}start(){this.garbageCollector.params.cacheSizeCollectionThreshold!==-1&&this.Ar(6e4)}stop(){this.Rr&&(this.Rr.cancel(),this.Rr=null)}get started(){return this.Rr!==null}Ar(e){x(Ul,`Garbage collection scheduled in ${e}ms`),this.Rr=this.asyncQueue.enqueueAfterDelay("lru_garbage_collection",e,(async()=>{this.Rr=null;try{await this.localStore.collectGarbage(this.garbageCollector)}catch(t){Gt(t)?x(Ul,"Ignoring IndexedDB error during garbage collection: ",t):await $t(t)}await this.Ar(3e5)}))}}class Ly{constructor(e,t){this.Vr=e,this.params=t}calculateTargetCount(e,t){return this.Vr.dr(e).next((n=>Math.floor(t/100*n)))}nthSequenceNumber(e,t){if(t===0)return A.resolve(Le.ce);const n=new Fy(t);return this.Vr.forEachTarget(e,(s=>n.Er(s.sequenceNumber))).next((()=>this.Vr.mr(e,(s=>n.Er(s))))).next((()=>n.maxValue))}removeTargets(e,t,n){return this.Vr.removeTargets(e,t,n)}removeOrphanedDocuments(e,t){return this.Vr.removeOrphanedDocuments(e,t)}collect(e,t){return this.params.cacheSizeCollectionThreshold===-1?(x("LruGarbageCollector","Garbage collection skipped; disabled"),A.resolve(Ll)):this.getCacheSize(e).next((n=>n<this.params.cacheSizeCollectionThreshold?(x("LruGarbageCollector",`Garbage collection skipped; Cache size ${n} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`),Ll):this.gr(e,t)))}getCacheSize(e){return this.Vr.getCacheSize(e)}gr(e,t){let n,s,i,o,u,c,h;const f=Date.now();return this.calculateTargetCount(e,this.params.percentileToCollect).next((m=>(m>this.params.maximumSequenceNumbersToCollect?(x("LruGarbageCollector",`Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${m}`),s=this.params.maximumSequenceNumbersToCollect):s=m,o=Date.now(),this.nthSequenceNumber(e,s)))).next((m=>(n=m,u=Date.now(),this.removeTargets(e,n,t)))).next((m=>(i=m,c=Date.now(),this.removeOrphanedDocuments(e,n)))).next((m=>(h=Date.now(),Ln()<=X.DEBUG&&x("LruGarbageCollector",`LRU Garbage Collection
	Counted targets in ${o-f}ms
	Determined least recently used ${s} in `+(u-o)+`ms
	Removed ${i} targets in `+(c-u)+`ms
	Removed ${m} documents in `+(h-c)+`ms
Total Duration: ${h-f}ms`),A.resolve({didRun:!0,sequenceNumbersCollected:s,targetsRemoved:i,documentsRemoved:m}))))}}function yf(r,e){return new Ly(r,e)}/**
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
 */class By{constructor(e,t){this.db=e,this.garbageCollector=yf(this,t)}dr(e){const t=this.pr(e);return this.db.getTargetCache().getTargetCount(e).next((n=>t.next((s=>n+s))))}pr(e){let t=0;return this.mr(e,(n=>{t++})).next((()=>t))}forEachTarget(e,t){return this.db.getTargetCache().forEachTarget(e,t)}mr(e,t){return this.yr(e,((n,s)=>t(s)))}addReference(e,t,n){return ri(e,n)}removeReference(e,t,n){return ri(e,n)}removeTargets(e,t,n){return this.db.getTargetCache().removeTargets(e,t,n)}markPotentiallyOrphaned(e,t){return ri(e,t)}wr(e,t){return(function(s,i){let o=!1;return gf(s).te((u=>mf(s,u,i).next((c=>(c&&(o=!0),A.resolve(!c)))))).next((()=>o))})(e,t)}removeOrphanedDocuments(e,t){const n=this.db.getRemoteDocumentCache().newChangeBuffer(),s=[];let i=0;return this.yr(e,((o,u)=>{if(u<=t){const c=this.wr(e,o).next((h=>{if(!h)return i++,n.getEntry(e,o).next((()=>(n.removeEntry(o,U.min()),Vt(e).delete((function(m){return[0,xe(m.path)]})(o)))))}));s.push(c)}})).next((()=>A.waitFor(s))).next((()=>n.apply(e))).next((()=>i))}removeTarget(e,t){const n=t.withSequenceNumber(e.currentSequenceNumber);return this.db.getTargetCache().updateTargetData(e,n)}updateLimboDocument(e,t){return ri(e,t)}yr(e,t){const n=Vt(e);let s,i=Le.ce;return n.ee({index:Na},(([o,u],{path:c,sequenceNumber:h})=>{o===0?(i!==Le.ce&&t(new k(tt(s)),i),i=h,s=c):i=Le.ce})).next((()=>{i!==Le.ce&&t(new k(tt(s)),i)}))}getCacheSize(e){return this.db.getRemoteDocumentCache().getSize(e)}}function ri(r,e){return Vt(r).put((function(n,s){return{targetId:0,path:xe(n.path),sequenceNumber:s}})(e,r.currentSequenceNumber))}/**
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
 */class If{constructor(){this.changes=new pt((e=>e.toString()),((e,t)=>e.isEqual(t))),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,t){this.assertNotApplied(),this.changes.set(e,ue.newInvalidDocument(e).setReadTime(t))}getEntry(e,t){this.assertNotApplied();const n=this.changes.get(t);return n!==void 0?A.resolve(n):this.getFromCache(e,t)}getEntries(e,t){return this.getAllFromCache(e,t)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
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
 */class Uy{constructor(e){this.serializer=e}setIndexManager(e){this.indexManager=e}addEntry(e,t,n){return rn(e).put(n)}removeEntry(e,t,n){return rn(e).delete((function(i,o){const u=i.path.toArray();return[u.slice(0,u.length-2),u[u.length-2],Ri(o),u[u.length-1]]})(t,n))}updateMetadata(e,t){return this.getMetadata(e).next((n=>(n.byteSize+=t,this.Sr(e,n))))}getEntry(e,t){let n=ue.newInvalidDocument(t);return rn(e).ee({index:ci,range:IDBKeyRange.only(Qr(t))},((s,i)=>{n=this.br(t,i)})).next((()=>n))}Dr(e,t){let n={size:0,document:ue.newInvalidDocument(t)};return rn(e).ee({index:ci,range:IDBKeyRange.only(Qr(t))},((s,i)=>{n={document:this.br(t,i),size:Pi(i)}})).next((()=>n))}getEntries(e,t){let n=Ue();return this.Cr(e,t,((s,i)=>{const o=this.br(s,i);n=n.insert(s,o)})).next((()=>n))}vr(e,t){let n=Ue(),s=new oe(k.comparator);return this.Cr(e,t,((i,o)=>{const u=this.br(i,o);n=n.insert(i,u),s=s.insert(i,Pi(o))})).next((()=>({documents:n,Fr:s})))}Cr(e,t,n){if(t.isEmpty())return A.resolve();let s=new re($l);t.forEach((c=>s=s.add(c)));const i=IDBKeyRange.bound(Qr(s.first()),Qr(s.last())),o=s.getIterator();let u=o.getNext();return rn(e).ee({index:ci,range:i},((c,h,f)=>{const m=k.fromSegments([...h.prefixPath,h.collectionGroup,h.documentId]);for(;u&&$l(u,m)<0;)n(u,null),u=o.getNext();u&&u.isEqual(m)&&(n(u,h),u=o.hasNext()?o.getNext():null),u?f.j(Qr(u)):f.done()})).next((()=>{for(;u;)n(u,null),u=o.hasNext()?o.getNext():null}))}getDocumentsMatchingQuery(e,t,n,s,i){const o=t.path,u=[o.popLast().toArray(),o.lastSegment(),Ri(n.readTime),n.documentKey.path.isEmpty()?"":n.documentKey.path.lastSegment()],c=[o.popLast().toArray(),o.lastSegment(),[Number.MAX_SAFE_INTEGER,Number.MAX_SAFE_INTEGER],""];return rn(e).J(IDBKeyRange.bound(u,c,!0)).next((h=>{i==null||i.incrementDocumentReadCount(h.length);let f=Ue();for(const m of h){const p=this.br(k.fromSegments(m.prefixPath.concat(m.collectionGroup,m.documentId)),m);p.isFoundDocument()&&(Vs(t,p)||s.has(p.key))&&(f=f.insert(p.key,p))}return f}))}getAllFromCollectionGroup(e,t,n,s){let i=Ue();const o=zl(t,n),u=zl(t,Qe.max());return rn(e).ee({index:Zh,range:IDBKeyRange.bound(o,u,!0)},((c,h,f)=>{const m=this.br(k.fromSegments(h.prefixPath.concat(h.collectionGroup,h.documentId)),h);i=i.insert(m.key,m),i.size===s&&f.done()})).next((()=>i))}newChangeBuffer(e){return new qy(this,!!e&&e.trackRemovals)}getSize(e){return this.getMetadata(e).next((t=>t.byteSize))}getMetadata(e){return jl(e).get(ta).next((t=>(L(!!t,20021),t)))}Sr(e,t){return jl(e).put(ta,t)}br(e,t){if(t){const n=Ry(this.serializer,t);if(!(n.isNoDocument()&&n.version.isEqual(U.min())))return n}return ue.newInvalidDocument(e)}}function Ef(r){return new Uy(r)}class qy extends If{constructor(e,t){super(),this.Mr=e,this.trackRemovals=t,this.Or=new pt((n=>n.toString()),((n,s)=>n.isEqual(s)))}applyChanges(e){const t=[];let n=0,s=new re(((i,o)=>z(i.canonicalString(),o.canonicalString())));return this.changes.forEach(((i,o)=>{const u=this.Or.get(i);if(t.push(this.Mr.removeEntry(e,i,u.readTime)),o.isValidDocument()){const c=bl(this.Mr.serializer,o);s=s.add(i.path.popLast());const h=Pi(c);n+=h-u.size,t.push(this.Mr.addEntry(e,i,c))}else if(n-=u.size,this.trackRemovals){const c=bl(this.Mr.serializer,o.convertToNoDocument(U.min()));t.push(this.Mr.addEntry(e,i,c))}})),s.forEach((i=>{t.push(this.Mr.indexManager.addToCollectionParentIndex(e,i))})),t.push(this.Mr.updateMetadata(e,n)),A.waitFor(t)}getFromCache(e,t){return this.Mr.Dr(e,t).next((n=>(this.Or.set(t,{size:n.size,readTime:n.document.readTime}),n.document)))}getAllFromCache(e,t){return this.Mr.vr(e,t).next((({documents:n,Fr:s})=>(s.forEach(((i,o)=>{this.Or.set(i,{size:o,readTime:n.get(i).readTime})})),n)))}}function jl(r){return we(r,gs)}function rn(r){return we(r,Ti)}function Qr(r){const e=r.path.toArray();return[e.slice(0,e.length-2),e[e.length-2],e[e.length-1]]}function zl(r,e){const t=e.documentKey.path.toArray();return[r,Ri(e.readTime),t.slice(0,t.length-2),t.length>0?t[t.length-1]:""]}function $l(r,e){const t=r.path.toArray(),n=e.path.toArray();let s=0;for(let i=0;i<t.length-2&&i<n.length-2;++i)if(s=z(t[i],n[i]),s)return s;return s=z(t.length,n.length),s||(s=z(t[t.length-2],n[n.length-2]),s||z(t[t.length-1],n[n.length-1]))}/**
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
 *//**
 * @license
 * Copyright 2022 Google LLC
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
 */class jy{constructor(e,t){this.overlayedDocument=e,this.mutatedFields=t}}/**
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
 */class Tf{constructor(e,t,n,s){this.remoteDocumentCache=e,this.mutationQueue=t,this.documentOverlayCache=n,this.indexManager=s}getDocument(e,t){let n=null;return this.documentOverlayCache.getOverlay(e,t).next((s=>(n=s,this.remoteDocumentCache.getEntry(e,t)))).next((s=>(n!==null&&os(n.mutation,s,Be.empty(),ee.now()),s)))}getDocuments(e,t){return this.remoteDocumentCache.getEntries(e,t).next((n=>this.getLocalViewOfDocuments(e,n,$()).next((()=>n))))}getLocalViewOfDocuments(e,t,n=$()){const s=nt();return this.populateOverlays(e,s,t).next((()=>this.computeViews(e,t,s,n).next((i=>{let o=Yr();return i.forEach(((u,c)=>{o=o.insert(u,c.overlayedDocument)})),o}))))}getOverlayedDocuments(e,t){const n=nt();return this.populateOverlays(e,n,t).next((()=>this.computeViews(e,t,n,$())))}populateOverlays(e,t,n){const s=[];return n.forEach((i=>{t.has(i)||s.push(i)})),this.documentOverlayCache.getOverlays(e,s).next((i=>{i.forEach(((o,u)=>{t.set(o,u)}))}))}computeViews(e,t,n,s){let i=Ue();const o=is(),u=(function(){return is()})();return t.forEach(((c,h)=>{const f=n.get(h.key);s.has(h.key)&&(f===void 0||f.mutation instanceof _t)?i=i.insert(h.key,h):f!==void 0?(o.set(h.key,f.mutation.getFieldMask()),os(f.mutation,h,f.mutation.getFieldMask(),ee.now())):o.set(h.key,Be.empty())})),this.recalculateAndSaveOverlays(e,i).next((c=>(c.forEach(((h,f)=>o.set(h,f))),t.forEach(((h,f)=>{var m;return u.set(h,new jy(f,(m=o.get(h))!=null?m:null))})),u)))}recalculateAndSaveOverlays(e,t){const n=is();let s=new oe(((o,u)=>o-u)),i=$();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,t).next((o=>{for(const u of o)u.keys().forEach((c=>{const h=t.get(c);if(h===null)return;let f=n.get(c)||Be.empty();f=u.applyToLocalView(h,f),n.set(c,f);const m=(s.get(u.batchId)||$()).add(c);s=s.insert(u.batchId,m)}))})).next((()=>{const o=[],u=s.getReverseIterator();for(;u.hasNext();){const c=u.getNext(),h=c.key,f=c.value,m=kd();f.forEach((p=>{if(!i.has(p)){const v=qd(t.get(p),n.get(p));v!==null&&m.set(p,v),i=i.add(p)}})),o.push(this.documentOverlayCache.saveOverlays(e,h,m))}return A.waitFor(o)})).next((()=>n))}recalculateAndSaveOverlaysForDocumentKeys(e,t){return this.remoteDocumentCache.getEntries(e,t).next((n=>this.recalculateAndSaveOverlays(e,n)))}getDocumentsMatchingQuery(e,t,n,s){return W_(t)?this.getDocumentsMatchingDocumentQuery(e,t.path):Ua(t)?this.getDocumentsMatchingCollectionGroupQuery(e,t,n,s):this.getDocumentsMatchingCollectionQuery(e,t,n,s)}getNextDocuments(e,t,n,s){return this.remoteDocumentCache.getAllFromCollectionGroup(e,t,n,s).next((i=>{const o=s-i.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,t,n.largestBatchId,s-i.size):A.resolve(nt());let u=Wn,c=i;return o.next((h=>A.forEach(h,((f,m)=>(u<m.largestBatchId&&(u=m.largestBatchId),i.get(f)?A.resolve():this.remoteDocumentCache.getEntry(e,f).next((p=>{c=c.insert(f,p)}))))).next((()=>this.populateOverlays(e,h,i))).next((()=>this.computeViews(e,c,h,$()))).next((f=>({batchId:u,changes:Nd(f)})))))}))}getDocumentsMatchingDocumentQuery(e,t){return this.getDocument(e,new k(t)).next((n=>{let s=Yr();return n.isFoundDocument()&&(s=s.insert(n.key,n)),s}))}getDocumentsMatchingCollectionGroupQuery(e,t,n,s){const i=t.collectionGroup;let o=Yr();return this.indexManager.getCollectionParents(e,i).next((u=>A.forEach(u,(c=>{const h=(function(m,p){return new gt(p,null,m.explicitOrderBy.slice(),m.filters.slice(),m.limit,m.limitType,m.startAt,m.endAt)})(t,c.child(i));return this.getDocumentsMatchingCollectionQuery(e,h,n,s).next((f=>{f.forEach(((m,p)=>{o=o.insert(m,p)}))}))})).next((()=>o))))}getDocumentsMatchingCollectionQuery(e,t,n,s){let i;return this.documentOverlayCache.getOverlaysForCollection(e,t.path,n.largestBatchId).next((o=>(i=o,this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,n,i,s)))).next((o=>{i.forEach(((c,h)=>{const f=h.getKey();o.get(f)===null&&(o=o.insert(f,ue.newInvalidDocument(f)))}));let u=Yr();return o.forEach(((c,h)=>{const f=i.get(c);f!==void 0&&os(f.mutation,h,Be.empty(),ee.now()),Vs(t,h)&&(u=u.insert(c,h))})),u}))}}/**
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
 */class zy{constructor(e){this.serializer=e,this.Nr=new Map,this.Br=new Map}getBundleMetadata(e,t){return A.resolve(this.Nr.get(t))}saveBundleMetadata(e,t){return this.Nr.set(t.id,(function(s){return{id:s.id,version:s.version,createTime:pe(s.createTime)}})(t)),A.resolve()}getNamedQuery(e,t){return A.resolve(this.Br.get(t))}saveNamedQuery(e,t){return this.Br.set(t.name,(function(s){return{name:s.name,query:Hi(s.bundledQuery),readTime:pe(s.readTime)}})(t)),A.resolve()}}/**
 * @license
 * Copyright 2022 Google LLC
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
 */class $y{constructor(){this.overlays=new oe(k.comparator),this.Lr=new Map}getOverlay(e,t){return A.resolve(this.overlays.get(t))}getOverlays(e,t){const n=nt();return A.forEach(t,(s=>this.getOverlay(e,s).next((i=>{i!==null&&n.set(s,i)})))).next((()=>n))}saveOverlays(e,t,n){return n.forEach(((s,i)=>{this.St(e,t,i)})),A.resolve()}removeOverlaysForBatchId(e,t,n){const s=this.Lr.get(n);return s!==void 0&&(s.forEach((i=>this.overlays=this.overlays.remove(i))),this.Lr.delete(n)),A.resolve()}getOverlaysForCollection(e,t,n){const s=nt(),i=t.length+1,o=new k(t.child("")),u=this.overlays.getIteratorFrom(o);for(;u.hasNext();){const c=u.getNext().value,h=c.getKey();if(!t.isPrefixOf(h.path))break;h.path.length===i&&c.largestBatchId>n&&s.set(c.getKey(),c)}return A.resolve(s)}getOverlaysForCollectionGroup(e,t,n,s){let i=new oe(((h,f)=>h-f));const o=this.overlays.getIterator();for(;o.hasNext();){const h=o.getNext().value;if(h.getKey().getCollectionGroup()===t&&h.largestBatchId>n){let f=i.get(h.largestBatchId);f===null&&(f=nt(),i=i.insert(h.largestBatchId,f)),f.set(h.getKey(),h)}}const u=nt(),c=i.getIterator();for(;c.hasNext()&&(c.getNext().value.forEach(((h,f)=>u.set(h,f))),!(u.size()>=s)););return A.resolve(u)}St(e,t,n){const s=this.overlays.get(n.key);if(s!==null){const o=this.Lr.get(s.largestBatchId).delete(n.key);this.Lr.set(s.largestBatchId,o)}this.overlays=this.overlays.insert(n.key,new Ka(t,n));let i=this.Lr.get(t);i===void 0&&(i=$(),this.Lr.set(t,i)),this.Lr.set(t,i.add(n.key))}}/**
 * @license
 * Copyright 2024 Google LLC
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
 */class Gy{constructor(){this.sessionToken=fe.EMPTY_BYTE_STRING}getSessionToken(e){return A.resolve(this.sessionToken)}setSessionToken(e,t){return this.sessionToken=t,A.resolve()}}/**
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
 */class Ya{constructor(){this.kr=new re(Ae.Kr),this.qr=new re(Ae.Ur)}isEmpty(){return this.kr.isEmpty()}addReference(e,t){const n=new Ae(e,t);this.kr=this.kr.add(n),this.qr=this.qr.add(n)}$r(e,t){e.forEach((n=>this.addReference(n,t)))}removeReference(e,t){this.Wr(new Ae(e,t))}Qr(e,t){e.forEach((n=>this.removeReference(n,t)))}Gr(e){const t=new k(new K([])),n=new Ae(t,e),s=new Ae(t,e+1),i=[];return this.qr.forEachInRange([n,s],(o=>{this.Wr(o),i.push(o.key)})),i}zr(){this.kr.forEach((e=>this.Wr(e)))}Wr(e){this.kr=this.kr.delete(e),this.qr=this.qr.delete(e)}jr(e){const t=new k(new K([])),n=new Ae(t,e),s=new Ae(t,e+1);let i=$();return this.qr.forEachInRange([n,s],(o=>{i=i.add(o.key)})),i}containsKey(e){const t=new Ae(e,0),n=this.kr.firstAfterOrEqual(t);return n!==null&&e.isEqual(n.key)}}class Ae{constructor(e,t){this.key=e,this.Jr=t}static Kr(e,t){return k.comparator(e.key,t.key)||z(e.Jr,t.Jr)}static Ur(e,t){return z(e.Jr,t.Jr)||k.comparator(e.key,t.key)}}/**
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
 */class Ky{constructor(e,t){this.indexManager=e,this.referenceDelegate=t,this.mutationQueue=[],this.Yn=1,this.Hr=new re(Ae.Kr)}checkEmpty(e){return A.resolve(this.mutationQueue.length===0)}addMutationBatch(e,t,n,s){const i=this.Yn;this.Yn++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const o=new $a(i,t,n,s);this.mutationQueue.push(o);for(const u of s)this.Hr=this.Hr.add(new Ae(u.key,i)),this.indexManager.addToCollectionParentIndex(e,u.key.path.popLast());return A.resolve(o)}lookupMutationBatch(e,t){return A.resolve(this.Zr(t))}getNextMutationBatchAfterBatchId(e,t){const n=t+1,s=this.Xr(n),i=s<0?0:s;return A.resolve(this.mutationQueue.length>i?this.mutationQueue[i]:null)}getHighestUnacknowledgedBatchId(){return A.resolve(this.mutationQueue.length===0?kt:this.Yn-1)}getAllMutationBatches(e){return A.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,t){const n=new Ae(t,0),s=new Ae(t,Number.POSITIVE_INFINITY),i=[];return this.Hr.forEachInRange([n,s],(o=>{const u=this.Zr(o.Jr);i.push(u)})),A.resolve(i)}getAllMutationBatchesAffectingDocumentKeys(e,t){let n=new re(z);return t.forEach((s=>{const i=new Ae(s,0),o=new Ae(s,Number.POSITIVE_INFINITY);this.Hr.forEachInRange([i,o],(u=>{n=n.add(u.Jr)}))})),A.resolve(this.Yr(n))}getAllMutationBatchesAffectingQuery(e,t){const n=t.path,s=n.length+1;let i=n;k.isDocumentKey(i)||(i=i.child(""));const o=new Ae(new k(i),0);let u=new re(z);return this.Hr.forEachWhile((c=>{const h=c.key.path;return!!n.isPrefixOf(h)&&(h.length===s&&(u=u.add(c.Jr)),!0)}),o),A.resolve(this.Yr(u))}Yr(e){const t=[];return e.forEach((n=>{const s=this.Zr(n);s!==null&&t.push(s)})),t}removeMutationBatch(e,t){L(this.ei(t.batchId,"removed")===0,55003),this.mutationQueue.shift();let n=this.Hr;return A.forEach(t.mutations,(s=>{const i=new Ae(s.key,t.batchId);return n=n.delete(i),this.referenceDelegate.markPotentiallyOrphaned(e,s.key)})).next((()=>{this.Hr=n}))}nr(e){}containsKey(e,t){const n=new Ae(t,0),s=this.Hr.firstAfterOrEqual(n);return A.resolve(t.isEqual(s&&s.key))}performConsistencyCheck(e){return this.mutationQueue.length,A.resolve()}ei(e,t){return this.Xr(e)}Xr(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}Zr(e){const t=this.Xr(e);return t<0||t>=this.mutationQueue.length?null:this.mutationQueue[t]}}/**
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
 */class Qy{constructor(e){this.ti=e,this.docs=(function(){return new oe(k.comparator)})(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,t){const n=t.key,s=this.docs.get(n),i=s?s.size:0,o=this.ti(t);return this.docs=this.docs.insert(n,{document:t.mutableCopy(),size:o}),this.size+=o-i,this.indexManager.addToCollectionParentIndex(e,n.path.popLast())}removeEntry(e){const t=this.docs.get(e);t&&(this.docs=this.docs.remove(e),this.size-=t.size)}getEntry(e,t){const n=this.docs.get(t);return A.resolve(n?n.document.mutableCopy():ue.newInvalidDocument(t))}getEntries(e,t){let n=Ue();return t.forEach((s=>{const i=this.docs.get(s);n=n.insert(s,i?i.document.mutableCopy():ue.newInvalidDocument(s))})),A.resolve(n)}getDocumentsMatchingQuery(e,t,n,s){let i=Ue();const o=t.path,u=new k(o.child("__id-9223372036854775808__")),c=this.docs.getIteratorFrom(u);for(;c.hasNext();){const{key:h,value:{document:f}}=c.getNext();if(!o.isPrefixOf(h.path))break;h.path.length>o.length+1||Da(Qh(f),n)<=0||(s.has(f.key)||Vs(t,f))&&(i=i.insert(f.key,f.mutableCopy()))}return A.resolve(i)}getAllFromCollectionGroup(e,t,n,s){F(9500)}ni(e,t){return A.forEach(this.docs,(n=>t(n)))}newChangeBuffer(e){return new Wy(this)}getSize(e){return A.resolve(this.size)}}class Wy extends If{constructor(e){super(),this.Mr=e}applyChanges(e){const t=[];return this.changes.forEach(((n,s)=>{s.isValidDocument()?t.push(this.Mr.addEntry(e,s)):this.Mr.removeEntry(n)})),A.waitFor(t)}getFromCache(e,t){return this.Mr.getEntry(e,t)}getAllFromCache(e,t){return this.Mr.getEntries(e,t)}}/**
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
 */class Hy{constructor(e){this.persistence=e,this.ri=new pt((t=>_n(t)),Ss),this.lastRemoteSnapshotVersion=U.min(),this.highestTargetId=0,this.ii=0,this.si=new Ya,this.targetCount=0,this.oi=ft._r()}forEachTarget(e,t){return this.ri.forEach(((n,s)=>t(s))),A.resolve()}getLastRemoteSnapshotVersion(e){return A.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return A.resolve(this.ii)}allocateTargetId(e){return this.highestTargetId=this.oi.next(),A.resolve(this.highestTargetId)}setTargetsMetadata(e,t,n){return n&&(this.lastRemoteSnapshotVersion=n),t>this.ii&&(this.ii=t),A.resolve()}lr(e){this.ri.set(e.target,e);const t=e.targetId;t>this.highestTargetId&&(this.oi=new ft(t),this.highestTargetId=t),e.sequenceNumber>this.ii&&(this.ii=e.sequenceNumber)}addTargetData(e,t){return this.lr(t),this.targetCount+=1,A.resolve()}updateTargetData(e,t){return this.lr(t),A.resolve()}removeTargetData(e,t){return this.ri.delete(t.target),this.si.Gr(t.targetId),this.targetCount-=1,A.resolve()}removeTargets(e,t,n){let s=0;const i=[];return this.ri.forEach(((o,u)=>{u.sequenceNumber<=t&&n.get(u.targetId)===null&&(this.ri.delete(o),i.push(this.removeMatchingKeysForTargetId(e,u.targetId)),s++)})),A.waitFor(i).next((()=>s))}getTargetCount(e){return A.resolve(this.targetCount)}getTargetData(e,t){const n=this.ri.get(t)||null;return A.resolve(n)}addMatchingKeys(e,t,n){return this.si.$r(t,n),A.resolve()}removeMatchingKeys(e,t,n){this.si.Qr(t,n);const s=this.persistence.referenceDelegate,i=[];return s&&t.forEach((o=>{i.push(s.markPotentiallyOrphaned(e,o))})),A.waitFor(i)}removeMatchingKeysForTargetId(e,t){return this.si.Gr(t),A.resolve()}getMatchingKeysForTargetId(e,t){const n=this.si.jr(t);return A.resolve(n)}containsKey(e,t){return A.resolve(this.si.containsKey(t))}}/**
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
 */class Xa{constructor(e,t){this._i={},this.overlays={},this.ai=new Le(0),this.ui=!1,this.ui=!0,this.ci=new Gy,this.referenceDelegate=e(this),this.li=new Hy(this),this.indexManager=new ky,this.remoteDocumentCache=(function(s){return new Qy(s)})((n=>this.referenceDelegate.hi(n))),this.serializer=new uf(t),this.Pi=new zy(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.ui=!1,Promise.resolve()}get started(){return this.ui}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let t=this.overlays[e.toKey()];return t||(t=new $y,this.overlays[e.toKey()]=t),t}getMutationQueue(e,t){let n=this._i[e.toKey()];return n||(n=new Ky(t,this.referenceDelegate),this._i[e.toKey()]=n),n}getGlobalsCache(){return this.ci}getTargetCache(){return this.li}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Pi}runTransaction(e,t,n){x("MemoryPersistence","Starting transaction:",e);const s=new Jy(this.ai.next());return this.referenceDelegate.Ti(),n(s).next((i=>this.referenceDelegate.Ii(s).next((()=>i)))).toPromise().then((i=>(s.raiseOnCommittedEvent(),i)))}Ei(e,t){return A.or(Object.values(this._i).map((n=>()=>n.containsKey(e,t))))}}class Jy extends Hh{constructor(e){super(),this.currentSequenceNumber=e}}class Xi{constructor(e){this.persistence=e,this.Ri=new Ya,this.Ai=null}static Vi(e){return new Xi(e)}get di(){if(this.Ai)return this.Ai;throw F(60996)}addReference(e,t,n){return this.Ri.addReference(n,t),this.di.delete(n.toString()),A.resolve()}removeReference(e,t,n){return this.Ri.removeReference(n,t),this.di.add(n.toString()),A.resolve()}markPotentiallyOrphaned(e,t){return this.di.add(t.toString()),A.resolve()}removeTarget(e,t){this.Ri.Gr(t.targetId).forEach((s=>this.di.add(s.toString())));const n=this.persistence.getTargetCache();return n.getMatchingKeysForTargetId(e,t.targetId).next((s=>{s.forEach((i=>this.di.add(i.toString())))})).next((()=>n.removeTargetData(e,t)))}Ti(){this.Ai=new Set}Ii(e){const t=this.persistence.getRemoteDocumentCache().newChangeBuffer();return A.forEach(this.di,(n=>{const s=k.fromPath(n);return this.mi(e,s).next((i=>{i||t.removeEntry(s,U.min())}))})).next((()=>(this.Ai=null,t.apply(e))))}updateLimboDocument(e,t){return this.mi(e,t).next((n=>{n?this.di.delete(t.toString()):this.di.add(t.toString())}))}hi(e){return 0}mi(e,t){return A.or([()=>A.resolve(this.Ri.containsKey(t)),()=>this.persistence.getTargetCache().containsKey(e,t),()=>this.persistence.Ei(e,t)])}}class Vi{constructor(e,t){this.persistence=e,this.fi=new pt((n=>xe(n.path)),((n,s)=>n.isEqual(s))),this.garbageCollector=yf(this,t)}static Vi(e,t){return new Vi(e,t)}Ti(){}Ii(e){return A.resolve()}forEachTarget(e,t){return this.persistence.getTargetCache().forEachTarget(e,t)}dr(e){const t=this.pr(e);return this.persistence.getTargetCache().getTargetCount(e).next((n=>t.next((s=>n+s))))}pr(e){let t=0;return this.mr(e,(n=>{t++})).next((()=>t))}mr(e,t){return A.forEach(this.fi,((n,s)=>this.wr(e,n,s).next((i=>i?A.resolve():t(s)))))}removeTargets(e,t,n){return this.persistence.getTargetCache().removeTargets(e,t,n)}removeOrphanedDocuments(e,t){let n=0;const s=this.persistence.getRemoteDocumentCache(),i=s.newChangeBuffer();return s.ni(e,(o=>this.wr(e,o,t).next((u=>{u||(n++,i.removeEntry(o,U.min()))})))).next((()=>i.apply(e))).next((()=>n))}markPotentiallyOrphaned(e,t){return this.fi.set(t,e.currentSequenceNumber),A.resolve()}removeTarget(e,t){const n=t.withSequenceNumber(e.currentSequenceNumber);return this.persistence.getTargetCache().updateTargetData(e,n)}addReference(e,t,n){return this.fi.set(n,e.currentSequenceNumber),A.resolve()}removeReference(e,t,n){return this.fi.set(n,e.currentSequenceNumber),A.resolve()}updateLimboDocument(e,t){return this.fi.set(t,e.currentSequenceNumber),A.resolve()}hi(e){let t=e.key.toString().length;return e.isFoundDocument()&&(t+=hi(e.data.value)),t}wr(e,t,n){return A.or([()=>this.persistence.Ei(e,t),()=>this.persistence.getTargetCache().containsKey(e,t),()=>{const s=this.fi.get(t);return A.resolve(s!==void 0&&s>n)}])}getCacheSize(e){return this.persistence.getRemoteDocumentCache().getSize(e)}}/**
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
 */class Yy{constructor(e){this.serializer=e}k(e,t,n,s){const i=new Li("createOrUpgrade",t);n<1&&s>=1&&((function(c){c.createObjectStore(Rs)})(e),(function(c){c.createObjectStore(ms,{keyPath:c_}),c.createObjectStore(We,{keyPath:tl,autoIncrement:!0}).createIndex(dn,nl,{unique:!0}),c.createObjectStore(Yn)})(e),Gl(e),(function(c){c.createObjectStore(an)})(e));let o=A.resolve();return n<3&&s>=3&&(n!==0&&((function(c){c.deleteObjectStore(Zn),c.deleteObjectStore(Xn),c.deleteObjectStore(mn)})(e),Gl(e)),o=o.next((()=>(function(c){const h=c.store(mn),f={highestTargetId:0,highestListenSequenceNumber:0,lastRemoteSnapshotVersion:U.min().toTimestamp(),targetCount:0};return h.put(wi,f)})(i)))),n<4&&s>=4&&(n!==0&&(o=o.next((()=>(function(c,h){return h.store(We).J().next((m=>{c.deleteObjectStore(We),c.createObjectStore(We,{keyPath:tl,autoIncrement:!0}).createIndex(dn,nl,{unique:!0});const p=h.store(We),v=m.map((C=>p.put(C)));return A.waitFor(v)}))})(e,i)))),o=o.next((()=>{(function(c){c.createObjectStore(er,{keyPath:y_})})(e)}))),n<5&&s>=5&&(o=o.next((()=>this.gi(i)))),n<6&&s>=6&&(o=o.next((()=>((function(c){c.createObjectStore(gs)})(e),this.pi(i))))),n<7&&s>=7&&(o=o.next((()=>this.yi(i)))),n<8&&s>=8&&(o=o.next((()=>this.wi(e,i)))),n<9&&s>=9&&(o=o.next((()=>{(function(c){c.objectStoreNames.contains("remoteDocumentChanges")&&c.deleteObjectStore("remoteDocumentChanges")})(e)}))),n<10&&s>=10&&(o=o.next((()=>this.Si(i)))),n<11&&s>=11&&(o=o.next((()=>{(function(c){c.createObjectStore(Bi,{keyPath:I_})})(e),(function(c){c.createObjectStore(Ui,{keyPath:E_})})(e)}))),n<12&&s>=12&&(o=o.next((()=>{(function(c){const h=c.createObjectStore(qi,{keyPath:S_});h.createIndex(ra,P_,{unique:!1}),h.createIndex(rd,V_,{unique:!1})})(e)}))),n<13&&s>=13&&(o=o.next((()=>(function(c){const h=c.createObjectStore(Ti,{keyPath:h_});h.createIndex(ci,d_),h.createIndex(Zh,f_)})(e))).next((()=>this.bi(e,i))).next((()=>e.deleteObjectStore(an)))),n<14&&s>=14&&(o=o.next((()=>this.Di(e,i)))),n<15&&s>=15&&(o=o.next((()=>(function(c){c.createObjectStore(ka,{keyPath:T_,autoIncrement:!0}).createIndex(na,w_,{unique:!1}),c.createObjectStore(ns,{keyPath:v_}).createIndex(td,A_,{unique:!1}),c.createObjectStore(rs,{keyPath:b_}).createIndex(nd,R_,{unique:!1})})(e)))),n<16&&s>=16&&(o=o.next((()=>{t.objectStore(ns).clear()})).next((()=>{t.objectStore(rs).clear()}))),n<17&&s>=17&&(o=o.next((()=>{(function(c){c.createObjectStore(Ma,{keyPath:C_})})(e)}))),n<18&&s>=18&&Ah()&&(o=o.next((()=>{t.objectStore(ns).clear()})).next((()=>{t.objectStore(rs).clear()}))),o}pi(e){let t=0;return e.store(an).ee(((n,s)=>{t+=Pi(s)})).next((()=>{const n={byteSize:t};return e.store(gs).put(ta,n)}))}gi(e){const t=e.store(ms),n=e.store(We);return t.J().next((s=>A.forEach(s,(i=>{const o=IDBKeyRange.bound([i.userId,kt],[i.userId,i.lastAcknowledgedBatchId]);return n.J(dn,o).next((u=>A.forEach(u,(c=>{L(c.userId===i.userId,18650,"Cannot process batch from unexpected user",{batchId:c.batchId});const h=cn(this.serializer,c);return ff(e,i.userId,h).next((()=>{}))}))))}))))}yi(e){const t=e.store(Zn),n=e.store(an);return e.store(mn).get(wi).next((s=>{const i=[];return n.ee(((o,u)=>{const c=new K(o),h=(function(m){return[0,xe(m)]})(c);i.push(t.get(h).next((f=>f?A.resolve():(m=>t.put({targetId:0,path:xe(m),sequenceNumber:s.highestListenSequenceNumber}))(c))))})).next((()=>A.waitFor(i)))}))}wi(e,t){e.createObjectStore(ps,{keyPath:__});const n=t.store(ps),s=new Ja,i=o=>{if(s.add(o)){const u=o.lastSegment(),c=o.popLast();return n.put({collectionId:u,parent:xe(c)})}};return t.store(an).ee({Y:!0},((o,u)=>{const c=new K(o);return i(c.popLast())})).next((()=>t.store(Yn).ee({Y:!0},(([o,u,c],h)=>{const f=tt(u);return i(f.popLast())}))))}Si(e){const t=e.store(Xn);return t.ee(((n,s)=>{const i=Zr(s),o=cf(this.serializer,i);return t.put(o)}))}bi(e,t){const n=t.store(an),s=[];return n.ee(((i,o)=>{const u=t.store(Ti),c=(function(m){return m.document?new k(K.fromString(m.document.name).popFirst(5)):m.noDocument?k.fromSegments(m.noDocument.path):m.unknownDocument?k.fromSegments(m.unknownDocument.path):F(36783)})(o).path.toArray(),h={prefixPath:c.slice(0,c.length-2),collectionGroup:c[c.length-2],documentId:c[c.length-1],readTime:o.readTime||[0,0],unknownDocument:o.unknownDocument,noDocument:o.noDocument,document:o.document,hasCommittedMutations:!!o.hasCommittedMutations};s.push(u.put(h))})).next((()=>A.waitFor(s)))}Di(e,t){const n=t.store(We),s=Ef(this.serializer),i=new Xa(Xi.Vi,this.serializer.yt);return n.J().next((o=>{const u=new Map;return o.forEach((c=>{var f;let h=(f=u.get(c.userId))!=null?f:$();cn(this.serializer,c).keys().forEach((m=>h=h.add(m))),u.set(c.userId,h)})),A.forEach(u,((c,h)=>{const f=new be(h),m=Ji.wt(this.serializer,f),p=i.getIndexManager(f),v=Yi.wt(f,this.serializer,p,i.referenceDelegate);return new Tf(s,v,m,p).recalculateAndSaveOverlaysForDocumentKeys(new sa(t,Le.ce),c).next()}))}))}}function Gl(r){r.createObjectStore(Zn,{keyPath:g_}).createIndex(Na,p_,{unique:!0}),r.createObjectStore(Xn,{keyPath:"targetId"}).createIndex(ed,m_,{unique:!0}),r.createObjectStore(mn)}const St="IndexedDbPersistence",Bo=18e5,Uo=5e3,qo="Failed to obtain exclusive access to the persistence layer. To allow shared access, multi-tab synchronization has to be enabled in all tabs. If you are using `experimentalForceOwningTab:true`, make sure that only one tab has persistence enabled at any given time.",wf="main";class Za{constructor(e,t,n,s,i,o,u,c,h,f,m=18){if(this.allowTabSynchronization=e,this.persistenceKey=t,this.clientId=n,this.Ci=i,this.window=o,this.document=u,this.Fi=h,this.Mi=f,this.xi=m,this.ai=null,this.ui=!1,this.isPrimary=!1,this.networkEnabled=!0,this.Oi=null,this.inForeground=!1,this.Ni=null,this.Bi=null,this.Li=Number.NEGATIVE_INFINITY,this.ki=p=>Promise.resolve(),!Za.v())throw new V(R.UNIMPLEMENTED,"This platform is either missing IndexedDB or is known to have an incomplete implementation. Offline persistence has been disabled.");this.referenceDelegate=new By(this,s),this.Ki=t+wf,this.serializer=new uf(c),this.qi=new st(this.Ki,this.xi,new Yy(this.serializer)),this.ci=new Py,this.li=new Oy(this.referenceDelegate,this.serializer),this.remoteDocumentCache=Ef(this.serializer),this.Pi=new Sy,this.window&&this.window.localStorage?this.Ui=this.window.localStorage:(this.Ui=null,f===!1&&ge(St,"LocalStorage is unavailable. As a result, persistence may not work reliably. In particular enablePersistence() could fail immediately after refreshing the page."))}start(){return this.$i().then((()=>{if(!this.isPrimary&&!this.allowTabSynchronization)throw new V(R.FAILED_PRECONDITION,qo);return this.Wi(),this.Qi(),this.Gi(),this.runTransaction("getHighestListenSequenceNumber","readonly",(e=>this.li.getHighestSequenceNumber(e)))})).then((e=>{this.ai=new Le(e,this.Fi)})).then((()=>{this.ui=!0})).catch((e=>(this.qi&&this.qi.close(),Promise.reject(e))))}zi(e){return this.ki=async t=>{if(this.started)return e(t)},e(this.isPrimary)}setDatabaseDeletedListener(e){this.qi.q((async t=>{t.newVersion===null&&await e()}))}setNetworkEnabled(e){this.networkEnabled!==e&&(this.networkEnabled=e,this.Ci.enqueueAndForget((async()=>{this.started&&await this.$i()})))}$i(){return this.runTransaction("updateClientMetadataAndTryBecomePrimary","readwrite",(e=>si(e).put({clientId:this.clientId,updateTimeMs:Date.now(),networkEnabled:this.networkEnabled,inForeground:this.inForeground}).next((()=>{if(this.isPrimary)return this.ji(e).next((t=>{t||(this.isPrimary=!1,this.Ci.enqueueRetryable((()=>this.ki(!1))))}))})).next((()=>this.Ji(e))).next((t=>this.isPrimary&&!t?this.Hi(e).next((()=>!1)):!!t&&this.Zi(e).next((()=>!0)))))).catch((e=>{if(Gt(e))return x(St,"Failed to extend owner lease: ",e),this.isPrimary;if(!this.allowTabSynchronization)throw e;return x(St,"Releasing owner lease after error during lease refresh",e),!1})).then((e=>{this.isPrimary!==e&&this.Ci.enqueueRetryable((()=>this.ki(e))),this.isPrimary=e}))}ji(e){return Wr(e).get(xn).next((t=>A.resolve(this.Xi(t))))}Yi(e){return si(e).delete(this.clientId)}async es(){if(this.isPrimary&&!this.ts(this.Li,Bo)){this.Li=Date.now();const e=await this.runTransaction("maybeGarbageCollectMultiClientState","readwrite-primary",(t=>{const n=we(t,er);return n.J().next((s=>{const i=this.ns(s,Bo),o=s.filter((u=>i.indexOf(u)===-1));return A.forEach(o,(u=>n.delete(u.clientId))).next((()=>o))}))})).catch((()=>[]));if(this.Ui)for(const t of e)this.Ui.removeItem(this.rs(t.clientId))}}Gi(){this.Bi=this.Ci.enqueueAfterDelay("client_metadata_refresh",4e3,(()=>this.$i().then((()=>this.es())).then((()=>this.Gi()))))}Xi(e){return!!e&&e.ownerId===this.clientId}Ji(e){return this.Mi?A.resolve(!0):Wr(e).get(xn).next((t=>{if(t!==null&&this.ts(t.leaseTimestampMs,Uo)&&!this.ss(t.ownerId)){if(this.Xi(t)&&this.networkEnabled)return!0;if(!this.Xi(t)){if(!t.allowTabSynchronization)throw new V(R.FAILED_PRECONDITION,qo);return!1}}return!(!this.networkEnabled||!this.inForeground)||si(e).J().next((n=>this.ns(n,Uo).find((s=>{if(this.clientId!==s.clientId){const i=!this.networkEnabled&&s.networkEnabled,o=!this.inForeground&&s.inForeground,u=this.networkEnabled===s.networkEnabled;if(i||o&&u)return!0}return!1}))===void 0))})).next((t=>(this.isPrimary!==t&&x(St,`Client ${t?"is":"is not"} eligible for a primary lease.`),t)))}async shutdown(){this.ui=!1,this._s(),this.Bi&&(this.Bi.cancel(),this.Bi=null),this.us(),this.cs(),await this.qi.runTransaction("shutdown","readwrite",[Rs,er],(e=>{const t=new sa(e,Le.ce);return this.Hi(t).next((()=>this.Yi(t)))})),this.qi.close(),this.ls()}ns(e,t){return e.filter((n=>this.ts(n.updateTimeMs,t)&&!this.ss(n.clientId)))}hs(){return this.runTransaction("getActiveClients","readonly",(e=>si(e).J().next((t=>this.ns(t,Bo).map((n=>n.clientId))))))}get started(){return this.ui}getGlobalsCache(){return this.ci}getMutationQueue(e,t){return Yi.wt(e,this.serializer,t,this.referenceDelegate)}getTargetCache(){return this.li}getRemoteDocumentCache(){return this.remoteDocumentCache}getIndexManager(e){return new My(e,this.serializer.yt.databaseId)}getDocumentOverlayCache(e){return Ji.wt(this.serializer,e)}getBundleCache(){return this.Pi}runTransaction(e,t,n){x(St,"Starting transaction:",e);const s=t==="readonly"?"readonly":"readwrite",i=(function(c){return c===18?N_:c===17?ad:c===16?x_:c===15?Oa:c===14?od:c===13?id:c===12?D_:c===11?sd:void F(60245)})(this.xi);let o;return this.qi.runTransaction(e,s,i,(u=>(o=new sa(u,this.ai?this.ai.next():Le.ce),t==="readwrite-primary"?this.ji(o).next((c=>!!c||this.Ji(o))).next((c=>{if(!c)throw ge(`Failed to obtain primary lease for action '${e}'.`),this.isPrimary=!1,this.Ci.enqueueRetryable((()=>this.ki(!1))),new V(R.FAILED_PRECONDITION,Wh);return n(o)})).next((c=>this.Zi(o).next((()=>c)))):this.Ps(o).next((()=>n(o)))))).then((u=>(o.raiseOnCommittedEvent(),u)))}Ps(e){return Wr(e).get(xn).next((t=>{if(t!==null&&this.ts(t.leaseTimestampMs,Uo)&&!this.ss(t.ownerId)&&!this.Xi(t)&&!(this.Mi||this.allowTabSynchronization&&t.allowTabSynchronization))throw new V(R.FAILED_PRECONDITION,qo)}))}Zi(e){const t={ownerId:this.clientId,allowTabSynchronization:this.allowTabSynchronization,leaseTimestampMs:Date.now()};return Wr(e).put(xn,t)}static v(){return st.v()}Hi(e){const t=Wr(e);return t.get(xn).next((n=>this.Xi(n)?(x(St,"Releasing primary lease."),t.delete(xn)):A.resolve()))}ts(e,t){const n=Date.now();return!(e<n-t)&&(!(e>n)||(ge(`Detected an update time that is in the future: ${e} > ${n}`),!1))}Wi(){this.document!==null&&typeof this.document.addEventListener=="function"&&(this.Ni=()=>{this.Ci.enqueueAndForget((()=>(this.inForeground=this.document.visibilityState==="visible",this.$i())))},this.document.addEventListener("visibilitychange",this.Ni),this.inForeground=this.document.visibilityState==="visible")}us(){this.Ni&&(this.document.removeEventListener("visibilitychange",this.Ni),this.Ni=null)}Qi(){var e;typeof((e=this.window)==null?void 0:e.addEventListener)=="function"&&(this.Oi=()=>{this._s();const t=/(?:Version|Mobile)\/1[456]/;vh()&&(navigator.appVersion.match(t)||navigator.userAgent.match(t))&&this.Ci.enterRestrictedMode(!0),this.Ci.enqueueAndForget((()=>this.shutdown()))},this.window.addEventListener("pagehide",this.Oi))}cs(){this.Oi&&(this.window.removeEventListener("pagehide",this.Oi),this.Oi=null)}ss(e){var t;try{const n=((t=this.Ui)==null?void 0:t.getItem(this.rs(e)))!==null;return x(St,`Client '${e}' ${n?"is":"is not"} zombied in LocalStorage`),n}catch(n){return ge(St,"Failed to get zombied client id.",n),!1}}_s(){if(this.Ui)try{this.Ui.setItem(this.rs(this.clientId),String(Date.now()))}catch(e){ge("Failed to set zombie client id.",e)}}ls(){if(this.Ui)try{this.Ui.removeItem(this.rs(this.clientId))}catch(e){}}rs(e){return`firestore_zombie_${this.persistenceKey}_${e}`}}function Wr(r){return we(r,Rs)}function si(r){return we(r,er)}function eu(r,e){let t=r.projectId;return r.isDefaultDatabase||(t+="."+r.database),"firestore/"+e+"/"+t+"/"}/**
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
 */class tu{constructor(e,t,n,s){this.targetId=e,this.fromCache=t,this.Ts=n,this.Is=s}static Es(e,t){let n=$(),s=$();for(const i of t.docChanges)switch(i.type){case 0:n=n.add(i.doc.key);break;case 1:s=s.add(i.doc.key)}return new tu(e,t.fromCache,n,s)}}/**
 * @license
 * Copyright 2023 Google LLC
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
 */class Xy{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}/**
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
 */class vf{constructor(){this.Rs=!1,this.As=!1,this.Vs=100,this.ds=(function(){return vh()?8:Jh(Kn())>0?6:4})()}initialize(e,t){this.fs=e,this.indexManager=t,this.Rs=!0}getDocumentsMatchingQuery(e,t,n,s){const i={result:null};return this.gs(e,t).next((o=>{i.result=o})).next((()=>{if(!i.result)return this.ps(e,t,s,n).next((o=>{i.result=o}))})).next((()=>{if(i.result)return;const o=new Xy;return this.ys(e,t,o).next((u=>{if(i.result=u,this.As)return this.ws(e,t,o,u.size)}))})).next((()=>i.result))}ws(e,t,n,s){return n.documentReadCount<this.Vs?(Ln()<=X.DEBUG&&x("QueryEngine","SDK will not create cache indexes for query:",Bn(t),"since it only creates cache indexes for collection contains","more than or equal to",this.Vs,"documents"),A.resolve()):(Ln()<=X.DEBUG&&x("QueryEngine","Query:",Bn(t),"scans",n.documentReadCount,"local documents and returns",s,"documents as results."),n.documentReadCount>this.ds*s?(Ln()<=X.DEBUG&&x("QueryEngine","The SDK decides to create cache indexes for query:",Bn(t),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,Ne(t))):A.resolve())}gs(e,t){if(gl(t))return A.resolve(null);let n=Ne(t);return this.indexManager.getIndexType(e,n).next((s=>s===0?null:(t.limit!==null&&s===1&&(t=bi(t,null,"F"),n=Ne(t)),this.indexManager.getDocumentsMatchingTarget(e,n).next((i=>{const o=$(...i);return this.fs.getDocuments(e,o).next((u=>this.indexManager.getMinOffset(e,n).next((c=>{const h=this.Ss(t,u);return this.bs(t,h,o,c.readTime)?this.gs(e,bi(t,null,"F")):this.Ds(e,h,t,c)}))))})))))}ps(e,t,n,s){return gl(t)||s.isEqual(U.min())?A.resolve(null):this.fs.getDocuments(e,n).next((i=>{const o=this.Ss(t,i);return this.bs(t,o,n,s)?A.resolve(null):(Ln()<=X.DEBUG&&x("QueryEngine","Re-using previous result from %s to execute query: %s",s.toString(),Bn(t)),this.Ds(e,o,t,Kh(s,Wn)).next((u=>u)))}))}Ss(e,t){let n=new re(Dd(e));return t.forEach(((s,i)=>{Vs(e,i)&&(n=n.add(i))})),n}bs(e,t,n,s){if(e.limit===null)return!1;if(n.size!==t.size)return!0;const i=e.limitType==="F"?t.last():t.first();return!!i&&(i.hasPendingWrites||i.version.compareTo(s)>0)}ys(e,t,n){return Ln()<=X.DEBUG&&x("QueryEngine","Using full collection scan to execute query:",Bn(t)),this.fs.getDocumentsMatchingQuery(e,t,Qe.min(),n)}Ds(e,t,n,s){return this.fs.getDocumentsMatchingQuery(e,n,s).next((i=>(t.forEach((o=>{i=i.insert(o.key,o)})),i)))}}/**
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
 */const nu="LocalStore",Zy=3e8;class eI{constructor(e,t,n,s){this.persistence=e,this.Cs=t,this.serializer=s,this.vs=new oe(z),this.Fs=new pt((i=>_n(i)),Ss),this.Ms=new Map,this.xs=e.getRemoteDocumentCache(),this.li=e.getTargetCache(),this.Pi=e.getBundleCache(),this.Os(n)}Os(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new Tf(this.xs,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.xs.setIndexManager(this.indexManager),this.Cs.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",(t=>e.collect(t,this.vs)))}}function Af(r,e,t,n){return new eI(r,e,t,n)}async function bf(r,e){const t=M(r);return await t.persistence.runTransaction("Handle user change","readonly",(n=>{let s;return t.mutationQueue.getAllMutationBatches(n).next((i=>(s=i,t.Os(e),t.mutationQueue.getAllMutationBatches(n)))).next((i=>{const o=[],u=[];let c=$();for(const h of s){o.push(h.batchId);for(const f of h.mutations)c=c.add(f.key)}for(const h of i){u.push(h.batchId);for(const f of h.mutations)c=c.add(f.key)}return t.localDocuments.getDocuments(n,c).next((h=>({Ns:h,removedBatchIds:o,addedBatchIds:u})))}))}))}function tI(r,e){const t=M(r);return t.persistence.runTransaction("Acknowledge batch","readwrite-primary",(n=>{const s=e.batch.keys(),i=t.xs.newChangeBuffer({trackRemovals:!0});return(function(u,c,h,f){const m=h.batch,p=m.keys();let v=A.resolve();return p.forEach((C=>{v=v.next((()=>f.getEntry(c,C))).next((N=>{const D=h.docVersions.get(C);L(D!==null,48541),N.version.compareTo(D)<0&&(m.applyToRemoteDocument(N,h),N.isValidDocument()&&(N.setReadTime(h.commitVersion),f.addEntry(N)))}))})),v.next((()=>u.mutationQueue.removeMutationBatch(c,m)))})(t,n,e,i).next((()=>i.apply(n))).next((()=>t.mutationQueue.performConsistencyCheck(n))).next((()=>t.documentOverlayCache.removeOverlaysForBatchId(n,s,e.batch.batchId))).next((()=>t.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(n,(function(u){let c=$();for(let h=0;h<u.mutationResults.length;++h)u.mutationResults[h].transformResults.length>0&&(c=c.add(u.batch.mutations[h].key));return c})(e)))).next((()=>t.localDocuments.getDocuments(n,s)))}))}function Rf(r){const e=M(r);return e.persistence.runTransaction("Get last remote snapshot version","readonly",(t=>e.li.getLastRemoteSnapshotVersion(t)))}function nI(r,e){const t=M(r),n=e.snapshotVersion;let s=t.vs;return t.persistence.runTransaction("Apply remote event","readwrite-primary",(i=>{const o=t.xs.newChangeBuffer({trackRemovals:!0});s=t.vs;const u=[];e.targetChanges.forEach(((f,m)=>{const p=s.get(m);if(!p)return;u.push(t.li.removeMatchingKeys(i,f.removedDocuments,m).next((()=>t.li.addMatchingKeys(i,f.addedDocuments,m))));let v=p.withSequenceNumber(i.currentSequenceNumber);e.targetMismatches.get(m)!==null?v=v.withResumeToken(fe.EMPTY_BYTE_STRING,U.min()).withLastLimboFreeSnapshotVersion(U.min()):f.resumeToken.approximateByteSize()>0&&(v=v.withResumeToken(f.resumeToken,n)),s=s.insert(m,v),(function(N,D,B){return N.resumeToken.approximateByteSize()===0||D.snapshotVersion.toMicroseconds()-N.snapshotVersion.toMicroseconds()>=Zy?!0:B.addedDocuments.size+B.modifiedDocuments.size+B.removedDocuments.size>0})(p,v,f)&&u.push(t.li.updateTargetData(i,v))}));let c=Ue(),h=$();if(e.documentUpdates.forEach((f=>{e.resolvedLimboDocuments.has(f)&&u.push(t.persistence.referenceDelegate.updateLimboDocument(i,f))})),u.push(Sf(i,o,e.documentUpdates).next((f=>{c=f.Bs,h=f.Ls}))),!n.isEqual(U.min())){const f=t.li.getLastRemoteSnapshotVersion(i).next((m=>t.li.setTargetsMetadata(i,i.currentSequenceNumber,n)));u.push(f)}return A.waitFor(u).next((()=>o.apply(i))).next((()=>t.localDocuments.getLocalViewOfDocuments(i,c,h))).next((()=>c))})).then((i=>(t.vs=s,i)))}function Sf(r,e,t){let n=$(),s=$();return t.forEach((i=>n=n.add(i))),e.getEntries(r,n).next((i=>{let o=Ue();return t.forEach(((u,c)=>{const h=i.get(u);c.isFoundDocument()!==h.isFoundDocument()&&(s=s.add(u)),c.isNoDocument()&&c.version.isEqual(U.min())?(e.removeEntry(u,c.readTime),o=o.insert(u,c)):!h.isValidDocument()||c.version.compareTo(h.version)>0||c.version.compareTo(h.version)===0&&h.hasPendingWrites?(e.addEntry(c),o=o.insert(u,c)):x(nu,"Ignoring outdated watch update for ",u,". Current version:",h.version," Watch version:",c.version)})),{Bs:o,Ls:s}}))}function rI(r,e){const t=M(r);return t.persistence.runTransaction("Get next mutation batch","readonly",(n=>(e===void 0&&(e=kt),t.mutationQueue.getNextMutationBatchAfterBatchId(n,e))))}function ar(r,e){const t=M(r);return t.persistence.runTransaction("Allocate target","readwrite",(n=>{let s;return t.li.getTargetData(n,e).next((i=>i?(s=i,A.resolve(s)):t.li.allocateTargetId(n).next((o=>(s=new rt(e,o,"TargetPurposeListen",n.currentSequenceNumber),t.li.addTargetData(n,s).next((()=>s)))))))})).then((n=>{const s=t.vs.get(n.targetId);return(s===null||n.snapshotVersion.compareTo(s.snapshotVersion)>0)&&(t.vs=t.vs.insert(n.targetId,n),t.Fs.set(e,n.targetId)),n}))}async function ur(r,e,t){const n=M(r),s=n.vs.get(e),i=t?"readwrite":"readwrite-primary";try{t||await n.persistence.runTransaction("Release target",i,(o=>n.persistence.referenceDelegate.removeTarget(o,s)))}catch(o){if(!Gt(o))throw o;x(nu,`Failed to update sequence numbers for target ${e}: ${o}`)}n.vs=n.vs.remove(e),n.Fs.delete(s.target)}function Ci(r,e,t){const n=M(r);let s=U.min(),i=$();return n.persistence.runTransaction("Execute query","readwrite",(o=>(function(c,h,f){const m=M(c),p=m.Fs.get(f);return p!==void 0?A.resolve(m.vs.get(p)):m.li.getTargetData(h,f)})(n,o,Ne(e)).next((u=>{if(u)return s=u.lastLimboFreeSnapshotVersion,n.li.getMatchingKeysForTargetId(o,u.targetId).next((c=>{i=c}))})).next((()=>n.Cs.getDocumentsMatchingQuery(o,e,t?s:U.min(),t?i:$()))).next((u=>(Cf(n,Cd(e),u),{documents:u,ks:i})))))}function Pf(r,e){const t=M(r),n=M(t.li),s=t.vs.get(e);return s?Promise.resolve(s.target):t.persistence.runTransaction("Get target data","readonly",(i=>n.At(i,e).next((o=>o?o.target:null))))}function Vf(r,e){const t=M(r),n=t.Ms.get(e)||U.min();return t.persistence.runTransaction("Get new document changes","readonly",(s=>t.xs.getAllFromCollectionGroup(s,e,Kh(n,Wn),Number.MAX_SAFE_INTEGER))).then((s=>(Cf(t,e,s),s)))}function Cf(r,e,t){let n=r.Ms.get(e)||U.min();t.forEach(((s,i)=>{i.readTime.compareTo(n)>0&&(n=i.readTime)})),r.Ms.set(e,n)}async function sI(r,e,t,n){const s=M(r);let i=$(),o=Ue();for(const h of t){const f=e.Ks(h.metadata.name);h.document&&(i=i.add(f));const m=e.qs(h);m.setReadTime(e.Us(h.metadata.readTime)),o=o.insert(f,m)}const u=s.xs.newChangeBuffer({trackRemovals:!0}),c=await ar(s,(function(f){return Ne(pr(K.fromString(`__bundle__/docs/${f}`)))})(n));return s.persistence.runTransaction("Apply bundle documents","readwrite",(h=>Sf(h,u,o).next((f=>(u.apply(h),f))).next((f=>s.li.removeMatchingKeysForTargetId(h,c.targetId).next((()=>s.li.addMatchingKeys(h,i,c.targetId))).next((()=>s.localDocuments.getLocalViewOfDocuments(h,f.Bs,f.Ls))).next((()=>f.Bs))))))}async function iI(r,e,t=$()){const n=await ar(r,Ne(Hi(e.bundledQuery))),s=M(r);return s.persistence.runTransaction("Save named query","readwrite",(i=>{const o=pe(e.readTime);if(n.snapshotVersion.compareTo(o)>=0)return s.Pi.saveNamedQuery(i,e);const u=n.withResumeToken(fe.EMPTY_BYTE_STRING,o);return s.vs=s.vs.insert(u.targetId,u),s.li.updateTargetData(i,u).next((()=>s.li.removeMatchingKeysForTargetId(i,n.targetId))).next((()=>s.li.addMatchingKeys(i,t,n.targetId))).next((()=>s.Pi.saveNamedQuery(i,e)))}))}/**
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
 */const Df="firestore_clients";function Kl(r,e){return`${Df}_${r}_${e}`}const xf="firestore_mutations";function Ql(r,e,t){let n=`${xf}_${r}_${t}`;return e.isAuthenticated()&&(n+=`_${e.uid}`),n}const Nf="firestore_targets";function jo(r,e){return`${Nf}_${r}_${e}`}/**
 * @license
 * Copyright 2018 Google LLC
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
 */const et="SharedClientState";class Di{constructor(e,t,n,s){this.user=e,this.batchId=t,this.state=n,this.error=s}static $s(e,t,n){const s=JSON.parse(n);let i,o=typeof s=="object"&&["pending","acknowledged","rejected"].indexOf(s.state)!==-1&&(s.error===void 0||typeof s.error=="object");return o&&s.error&&(o=typeof s.error.message=="string"&&typeof s.error.code=="string",o&&(i=new V(s.error.code,s.error.message))),o?new Di(e,t,s.state,i):(ge(et,`Failed to parse mutation state for ID '${t}': ${n}`),null)}Ws(){const e={state:this.state,updateTimeMs:Date.now()};return this.error&&(e.error={code:this.error.code,message:this.error.message}),JSON.stringify(e)}}class us{constructor(e,t,n){this.targetId=e,this.state=t,this.error=n}static $s(e,t){const n=JSON.parse(t);let s,i=typeof n=="object"&&["not-current","current","rejected"].indexOf(n.state)!==-1&&(n.error===void 0||typeof n.error=="object");return i&&n.error&&(i=typeof n.error.message=="string"&&typeof n.error.code=="string",i&&(s=new V(n.error.code,n.error.message))),i?new us(e,n.state,s):(ge(et,`Failed to parse target state for ID '${e}': ${t}`),null)}Ws(){const e={state:this.state,updateTimeMs:Date.now()};return this.error&&(e.error={code:this.error.code,message:this.error.message}),JSON.stringify(e)}}class xi{constructor(e,t){this.clientId=e,this.activeTargetIds=t}static $s(e,t){const n=JSON.parse(t);let s=typeof n=="object"&&n.activeTargetIds instanceof Array,i=qa();for(let o=0;s&&o<n.activeTargetIds.length;++o)s=Yh(n.activeTargetIds[o]),i=i.add(n.activeTargetIds[o]);return s?new xi(e,i):(ge(et,`Failed to parse client data for instance '${e}': ${t}`),null)}}class ru{constructor(e,t){this.clientId=e,this.onlineState=t}static $s(e){const t=JSON.parse(e);return typeof t=="object"&&["Unknown","Online","Offline"].indexOf(t.onlineState)!==-1&&typeof t.clientId=="string"?new ru(t.clientId,t.onlineState):(ge(et,`Failed to parse online state: ${e}`),null)}}class ya{constructor(){this.activeTargetIds=qa()}Qs(e){this.activeTargetIds=this.activeTargetIds.add(e)}Gs(e){this.activeTargetIds=this.activeTargetIds.delete(e)}Ws(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class zo{constructor(e,t,n,s,i){this.window=e,this.Ci=t,this.persistenceKey=n,this.zs=s,this.syncEngine=null,this.onlineStateHandler=null,this.sequenceNumberHandler=null,this.js=this.Js.bind(this),this.Hs=new oe(z),this.started=!1,this.Zs=[];const o=n.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");this.storage=this.window.localStorage,this.currentUser=i,this.Xs=Kl(this.persistenceKey,this.zs),this.Ys=(function(c){return`firestore_sequence_number_${c}`})(this.persistenceKey),this.Hs=this.Hs.insert(this.zs,new ya),this.eo=new RegExp(`^${Df}_${o}_([^_]*)$`),this.no=new RegExp(`^${xf}_${o}_(\\d+)(?:_(.*))?$`),this.ro=new RegExp(`^${Nf}_${o}_(\\d+)$`),this.io=(function(c){return`firestore_online_state_${c}`})(this.persistenceKey),this.so=(function(c){return`firestore_bundle_loaded_v2_${c}`})(this.persistenceKey),this.window.addEventListener("storage",this.js)}static v(e){return!(!e||!e.localStorage)}async start(){const e=await this.syncEngine.hs();for(const n of e){if(n===this.zs)continue;const s=this.getItem(Kl(this.persistenceKey,n));if(s){const i=xi.$s(n,s);i&&(this.Hs=this.Hs.insert(i.clientId,i))}}this.oo();const t=this.storage.getItem(this.io);if(t){const n=this._o(t);n&&this.ao(n)}for(const n of this.Zs)this.Js(n);this.Zs=[],this.window.addEventListener("pagehide",(()=>this.shutdown())),this.started=!0}writeSequenceNumber(e){this.setItem(this.Ys,JSON.stringify(e))}getAllActiveQueryTargets(){return this.uo(this.Hs)}isActiveQueryTarget(e){let t=!1;return this.Hs.forEach(((n,s)=>{s.activeTargetIds.has(e)&&(t=!0)})),t}addPendingMutation(e){this.co(e,"pending")}updateMutationState(e,t,n){this.co(e,t,n),this.lo(e)}addLocalQueryTarget(e,t=!0){let n="not-current";if(this.isActiveQueryTarget(e)){const s=this.storage.getItem(jo(this.persistenceKey,e));if(s){const i=us.$s(e,s);i&&(n=i.state)}}return t&&this.ho.Qs(e),this.oo(),n}removeLocalQueryTarget(e){this.ho.Gs(e),this.oo()}isLocalQueryTarget(e){return this.ho.activeTargetIds.has(e)}clearQueryState(e){this.removeItem(jo(this.persistenceKey,e))}updateQueryState(e,t,n){this.Po(e,t,n)}handleUserChange(e,t,n){t.forEach((s=>{this.lo(s)})),this.currentUser=e,n.forEach((s=>{this.addPendingMutation(s)}))}setOnlineState(e){this.To(e)}notifyBundleLoaded(e){this.Io(e)}shutdown(){this.started&&(this.window.removeEventListener("storage",this.js),this.removeItem(this.Xs),this.started=!1)}getItem(e){const t=this.storage.getItem(e);return x(et,"READ",e,t),t}setItem(e,t){x(et,"SET",e,t),this.storage.setItem(e,t)}removeItem(e){x(et,"REMOVE",e),this.storage.removeItem(e)}Js(e){const t=e;if(t.storageArea===this.storage){if(x(et,"EVENT",t.key,t.newValue),t.key===this.Xs)return void ge("Received WebStorage notification for local change. Another client might have garbage-collected our state");this.Ci.enqueueRetryable((async()=>{if(this.started){if(t.key!==null){if(this.eo.test(t.key)){if(t.newValue==null){const n=this.Eo(t.key);return this.Ro(n,null)}{const n=this.Ao(t.key,t.newValue);if(n)return this.Ro(n.clientId,n)}}else if(this.no.test(t.key)){if(t.newValue!==null){const n=this.Vo(t.key,t.newValue);if(n)return this.mo(n)}}else if(this.ro.test(t.key)){if(t.newValue!==null){const n=this.fo(t.key,t.newValue);if(n)return this.po(n)}}else if(t.key===this.io){if(t.newValue!==null){const n=this._o(t.newValue);if(n)return this.ao(n)}}else if(t.key===this.Ys){const n=(function(i){let o=Le.ce;if(i!=null)try{const u=JSON.parse(i);L(typeof u=="number",30636,{yo:i}),o=u}catch(u){ge(et,"Failed to read sequence number from WebStorage",u)}return o})(t.newValue);n!==Le.ce&&this.sequenceNumberHandler(n)}else if(t.key===this.so){const n=this.wo(t.newValue);await Promise.all(n.map((s=>this.syncEngine.So(s))))}}}else this.Zs.push(t)}))}}get ho(){return this.Hs.get(this.zs)}oo(){this.setItem(this.Xs,this.ho.Ws())}co(e,t,n){const s=new Di(this.currentUser,e,t,n),i=Ql(this.persistenceKey,this.currentUser,e);this.setItem(i,s.Ws())}lo(e){const t=Ql(this.persistenceKey,this.currentUser,e);this.removeItem(t)}To(e){const t={clientId:this.zs,onlineState:e};this.storage.setItem(this.io,JSON.stringify(t))}Po(e,t,n){const s=jo(this.persistenceKey,e),i=new us(e,t,n);this.setItem(s,i.Ws())}Io(e){const t=JSON.stringify(Array.from(e));this.setItem(this.so,t)}Eo(e){const t=this.eo.exec(e);return t?t[1]:null}Ao(e,t){const n=this.Eo(e);return xi.$s(n,t)}Vo(e,t){const n=this.no.exec(e),s=Number(n[1]),i=n[2]!==void 0?n[2]:null;return Di.$s(new be(i),s,t)}fo(e,t){const n=this.ro.exec(e),s=Number(n[1]);return us.$s(s,t)}_o(e){return ru.$s(e)}wo(e){return JSON.parse(e)}async mo(e){if(e.user.uid===this.currentUser.uid)return this.syncEngine.bo(e.batchId,e.state,e.error);x(et,`Ignoring mutation for non-active user ${e.user.uid}`)}po(e){return this.syncEngine.Do(e.targetId,e.state,e.error)}Ro(e,t){const n=t?this.Hs.insert(e,t):this.Hs.remove(e),s=this.uo(this.Hs),i=this.uo(n),o=[],u=[];return i.forEach((c=>{s.has(c)||o.push(c)})),s.forEach((c=>{i.has(c)||u.push(c)})),this.syncEngine.Co(o,u).then((()=>{this.Hs=n}))}ao(e){this.Hs.get(e.clientId)&&this.onlineStateHandler(e.onlineState)}uo(e){let t=qa();return e.forEach(((n,s)=>{t=t.unionWith(s.activeTargetIds)})),t}}class kf{constructor(){this.vo=new ya,this.Fo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,t,n){}addLocalQueryTarget(e,t=!0){return t&&this.vo.Qs(e),this.Fo[e]||"not-current"}updateQueryState(e,t,n){this.Fo[e]=t}removeLocalQueryTarget(e){this.vo.Gs(e)}isLocalQueryTarget(e){return this.vo.activeTargetIds.has(e)}clearQueryState(e){delete this.Fo[e]}getAllActiveQueryTargets(){return this.vo.activeTargetIds}isActiveQueryTarget(e){return this.vo.activeTargetIds.has(e)}start(){return this.vo=new ya,Promise.resolve()}handleUserChange(e,t,n){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}/**
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
 */class oI{Mo(e){}shutdown(){}}/**
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
 */const Wl="ConnectivityMonitor";class Hl{constructor(){this.xo=()=>this.Oo(),this.No=()=>this.Bo(),this.Lo=[],this.ko()}Mo(e){this.Lo.push(e)}shutdown(){window.removeEventListener("online",this.xo),window.removeEventListener("offline",this.No)}ko(){window.addEventListener("online",this.xo),window.addEventListener("offline",this.No)}Oo(){x(Wl,"Network connectivity changed: AVAILABLE");for(const e of this.Lo)e(0)}Bo(){x(Wl,"Network connectivity changed: UNAVAILABLE");for(const e of this.Lo)e(1)}static v(){return typeof window!="undefined"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
 * @license
 * Copyright 2023 Google LLC
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
 */let ii=null;function Ia(){return ii===null?ii=(function(){return 268435456+Math.round(2147483648*Math.random())})():ii++,"0x"+ii.toString(16)}/**
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
 */const $o="RestConnection",aI={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery",ExecutePipeline:"executePipeline"};class uI{get Ko(){return!1}constructor(e){this.databaseInfo=e,this.databaseId=e.databaseId;const t=e.ssl?"https":"http",n=encodeURIComponent(this.databaseId.projectId),s=encodeURIComponent(this.databaseId.database);this.qo=t+"://"+e.host,this.Uo=`projects/${n}/databases/${s}`,this.$o=this.databaseId.database===ys?`project_id=${n}`:`project_id=${n}&database_id=${s}`}Wo(e,t,n,s,i){const o=Ia(),u=this.Qo(e,t.toUriEncodedString());x($o,`Sending RPC '${e}' ${o}:`,u,n);const c={"google-cloud-resource-prefix":this.Uo,"x-goog-request-params":this.$o};this.Go(c,s,i);const{host:h}=new URL(u),f=Ra(h);return this.zo(e,u,c,n,f).then((m=>(x($o,`Received RPC '${e}' ${o}: `,m),m)),(m=>{throw ze($o,`RPC '${e}' ${o} failed with error: `,m,"url: ",u,"request:",n),m}))}jo(e,t,n,s,i,o){return this.Wo(e,t,n,s,i)}Go(e,t,n){e["X-Goog-Api-Client"]=(function(){return"gl-js/ fire/"+gr})(),e["Content-Type"]="text/plain",this.databaseInfo.appId&&(e["X-Firebase-GMPID"]=this.databaseInfo.appId),t&&t.headers.forEach(((s,i)=>e[i]=s)),n&&n.headers.forEach(((s,i)=>e[i]=s))}Qo(e,t){const n=aI[e];let s=`${this.qo}/v1/${t}:${n}`;return this.databaseInfo.apiKey&&(s=`${s}?key=${encodeURIComponent(this.databaseInfo.apiKey)}`),s}terminate(){}}/**
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
 */class cI{constructor(e){this.Jo=e.Jo,this.Ho=e.Ho}Zo(e){this.Xo=e}Yo(e){this.e_=e}t_(e){this.n_=e}onMessage(e){this.r_=e}close(){this.Ho()}send(e){this.Jo(e)}i_(){this.Xo()}s_(){this.e_()}o_(e){this.n_(e)}__(e){this.r_(e)}}/**
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
 */const Ce="WebChannelConnection",Hr=(r,e,t)=>{r.listen(e,(n=>{try{t(n)}catch(s){setTimeout((()=>{throw s}),0)}}))};class $n extends uI{constructor(e){super(e),this.a_=[],this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}static u_(){if(!$n.c_){const e=Fh();Hr(e,Oh.STAT_EVENT,(t=>{t.stat===Jo.PROXY?x(Ce,"STAT_EVENT: detected buffering proxy"):t.stat===Jo.NOPROXY&&x(Ce,"STAT_EVENT: detected no buffering proxy")})),$n.c_=!0}}zo(e,t,n,s,i){const o=Ia();return new Promise(((u,c)=>{const h=new kh;h.setWithCredentials(!0),h.listenOnce(Mh.COMPLETE,(()=>{try{switch(h.getLastErrorCode()){case ai.NO_ERROR:const m=h.getResponseJson();x(Ce,`XHR for RPC '${e}' ${o} received:`,JSON.stringify(m)),u(m);break;case ai.TIMEOUT:x(Ce,`RPC '${e}' ${o} timed out`),c(new V(R.DEADLINE_EXCEEDED,"Request time out"));break;case ai.HTTP_ERROR:const p=h.getStatus();if(x(Ce,`RPC '${e}' ${o} failed with status:`,p,"response text:",h.getResponseText()),p>0){let v=h.getResponseJson();Array.isArray(v)&&(v=v[0]);const C=v==null?void 0:v.error;if(C&&C.status&&C.message){const N=(function(B){const j=B.toLowerCase().replace(/_/g,"-");return Object.values(R).indexOf(j)>=0?j:R.UNKNOWN})(C.status);c(new V(N,C.message))}else c(new V(R.UNKNOWN,"Server responded with status "+h.getStatus()))}else c(new V(R.UNAVAILABLE,"Connection failed."));break;default:F(9055,{l_:e,streamId:o,h_:h.getLastErrorCode(),P_:h.getLastError()})}}finally{x(Ce,`RPC '${e}' ${o} completed.`)}}));const f=JSON.stringify(s);x(Ce,`RPC '${e}' ${o} sending request:`,s),h.send(t,"POST",f,n,15)}))}T_(e,t,n){const s=Ia(),i=[this.qo,"/","google.firestore.v1.Firestore","/",e,"/channel"],o=this.createWebChannelTransport(),u={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},c=this.longPollingOptions.timeoutSeconds;c!==void 0&&(u.longPollingTimeout=Math.round(1e3*c)),this.useFetchStreams&&(u.useFetchStreams=!0),this.Go(u.initMessageHeaders,t,n),u.encodeInitMessageHeaders=!0;const h=i.join("");x(Ce,`Creating RPC '${e}' stream ${s}: ${h}`,u);const f=o.createWebChannel(h,u);this.I_(f);let m=!1,p=!1;const v=new cI({Jo:C=>{p?x(Ce,`Not sending because RPC '${e}' stream ${s} is closed:`,C):(m||(x(Ce,`Opening RPC '${e}' stream ${s} transport.`),f.open(),m=!0),x(Ce,`RPC '${e}' stream ${s} sending:`,C),f.send(C))},Ho:()=>f.close()});return Hr(f,Jr.EventType.OPEN,(()=>{p||(x(Ce,`RPC '${e}' stream ${s} transport opened.`),v.i_())})),Hr(f,Jr.EventType.CLOSE,(()=>{p||(p=!0,x(Ce,`RPC '${e}' stream ${s} transport closed`),v.o_(),this.E_(f))})),Hr(f,Jr.EventType.ERROR,(C=>{p||(p=!0,ze(Ce,`RPC '${e}' stream ${s} transport errored. Name:`,C.name,"Message:",C.message),v.o_(new V(R.UNAVAILABLE,"The operation could not be completed")))})),Hr(f,Jr.EventType.MESSAGE,(C=>{var N;if(!p){const D=C.data[0];L(!!D,16349);const B=D,j=(B==null?void 0:B.error)||((N=B[0])==null?void 0:N.error);if(j){x(Ce,`RPC '${e}' stream ${s} received error:`,j);const q=j.status;let Z=(function(E){const _=_e[E];if(_!==void 0)return Gd(_)})(q),W=j.message;q==="NOT_FOUND"&&W.includes("database")&&W.includes("does not exist")&&W.includes(this.databaseId.database)&&ze(`Database '${this.databaseId.database}' not found. Please check your project configuration.`),Z===void 0&&(Z=R.INTERNAL,W="Unknown error status: "+q+" with message "+j.message),p=!0,v.o_(new V(Z,W)),f.close()}else x(Ce,`RPC '${e}' stream ${s} received:`,D),v.__(D)}})),$n.u_(),setTimeout((()=>{v.s_()}),0),v}terminate(){this.a_.forEach((e=>e.close())),this.a_=[]}I_(e){this.a_.push(e)}E_(e){this.a_=this.a_.filter((t=>t===e))}Go(e,t,n){super.Go(e,t,n),this.databaseInfo.apiKey&&(e["x-goog-api-key"]=this.databaseInfo.apiKey)}createWebChannelTransport(){return Lh()}}/**
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
 */function lI(r){return new $n(r)}/**
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
 */function Mf(){return typeof window!="undefined"?window:null}function pi(){return typeof document!="undefined"?document:null}/**
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
 */function An(r){return new py(r,!0)}/**
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
 */$n.c_=!1;class su{constructor(e,t,n=1e3,s=1.5,i=6e4){this.Ci=e,this.timerId=t,this.R_=n,this.A_=s,this.V_=i,this.d_=0,this.m_=null,this.f_=Date.now(),this.reset()}reset(){this.d_=0}g_(){this.d_=this.V_}p_(e){this.cancel();const t=Math.floor(this.d_+this.y_()),n=Math.max(0,Date.now()-this.f_),s=Math.max(0,t-n);s>0&&x("ExponentialBackoff",`Backing off for ${s} ms (base delay: ${this.d_} ms, delay with jitter: ${t} ms, last attempt: ${n} ms ago)`),this.m_=this.Ci.enqueueAfterDelay(this.timerId,s,(()=>(this.f_=Date.now(),e()))),this.d_*=this.A_,this.d_<this.R_&&(this.d_=this.R_),this.d_>this.V_&&(this.d_=this.V_)}w_(){this.m_!==null&&(this.m_.skipDelay(),this.m_=null)}cancel(){this.m_!==null&&(this.m_.cancel(),this.m_=null)}y_(){return(Math.random()-.5)*this.d_}}/**
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
 */const Jl="PersistentStream";class Of{constructor(e,t,n,s,i,o,u,c){this.Ci=e,this.S_=n,this.b_=s,this.connection=i,this.authCredentialsProvider=o,this.appCheckCredentialsProvider=u,this.listener=c,this.state=0,this.D_=0,this.C_=null,this.v_=null,this.stream=null,this.F_=0,this.M_=new su(e,t)}x_(){return this.state===1||this.state===5||this.O_()}O_(){return this.state===2||this.state===3}start(){this.F_=0,this.state!==4?this.auth():this.N_()}async stop(){this.x_()&&await this.close(0)}B_(){this.state=0,this.M_.reset()}L_(){this.O_()&&this.C_===null&&(this.C_=this.Ci.enqueueAfterDelay(this.S_,6e4,(()=>this.k_())))}K_(e){this.q_(),this.stream.send(e)}async k_(){if(this.O_())return this.close(0)}q_(){this.C_&&(this.C_.cancel(),this.C_=null)}U_(){this.v_&&(this.v_.cancel(),this.v_=null)}async close(e,t){this.q_(),this.U_(),this.M_.cancel(),this.D_++,e!==4?this.M_.reset():t&&t.code===R.RESOURCE_EXHAUSTED?(ge(t.toString()),ge("Using maximum backoff delay to prevent overloading the backend."),this.M_.g_()):t&&t.code===R.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.W_(),this.stream.close(),this.stream=null),this.state=e,await this.listener.t_(t)}W_(){}auth(){this.state=1;const e=this.Q_(this.D_),t=this.D_;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then((([n,s])=>{this.D_===t&&this.G_(n,s)}),(n=>{e((()=>{const s=new V(R.UNKNOWN,"Fetching auth token failed: "+n.message);return this.z_(s)}))}))}G_(e,t){const n=this.Q_(this.D_);this.stream=this.j_(e,t),this.stream.Zo((()=>{n((()=>this.listener.Zo()))})),this.stream.Yo((()=>{n((()=>(this.state=2,this.v_=this.Ci.enqueueAfterDelay(this.b_,1e4,(()=>(this.O_()&&(this.state=3),Promise.resolve()))),this.listener.Yo())))})),this.stream.t_((s=>{n((()=>this.z_(s)))})),this.stream.onMessage((s=>{n((()=>++this.F_==1?this.J_(s):this.onNext(s)))}))}N_(){this.state=5,this.M_.p_((async()=>{this.state=0,this.start()}))}z_(e){return x(Jl,`close with error: ${e}`),this.stream=null,this.close(4,e)}Q_(e){return t=>{this.Ci.enqueueAndForget((()=>this.D_===e?t():(x(Jl,"stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve())))}}}class hI extends Of{constructor(e,t,n,s,i,o){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",t,n,s,o),this.serializer=i}j_(e,t){return this.connection.T_("Listen",e,t)}J_(e){return this.onNext(e)}onNext(e){this.M_.reset();const t=Iy(this.serializer,e),n=(function(i){if(!("targetChange"in i))return U.min();const o=i.targetChange;return o.targetIds&&o.targetIds.length?U.min():o.readTime?pe(o.readTime):U.min()})(e);return this.listener.H_(t,n)}Z_(e){const t={};t.database=fa(this.serializer),t.addTarget=(function(i,o){let u;const c=o.target;if(u=vi(c)?{documents:ef(i,c)}:{query:Wi(i,c).ft},u.targetId=o.targetId,o.resumeToken.approximateByteSize()>0){u.resumeToken=Hd(i,o.resumeToken);const h=ha(i,o.expectedCount);h!==null&&(u.expectedCount=h)}else if(o.snapshotVersion.compareTo(U.min())>0){u.readTime=or(i,o.snapshotVersion.toTimestamp());const h=ha(i,o.expectedCount);h!==null&&(u.expectedCount=h)}return u})(this.serializer,e);const n=Ty(this.serializer,e);n&&(t.labels=n),this.K_(t)}X_(e){const t={};t.database=fa(this.serializer),t.removeTarget=e,this.K_(t)}}class dI extends Of{constructor(e,t,n,s,i,o){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",t,n,s,o),this.serializer=i}get Y_(){return this.F_>0}start(){this.lastStreamToken=void 0,super.start()}W_(){this.Y_&&this.ea([])}j_(e,t){return this.connection.T_("Write",e,t)}J_(e){return L(!!e.streamToken,31322),this.lastStreamToken=e.streamToken,L(!e.writeResults||e.writeResults.length===0,55816),this.listener.ta()}onNext(e){L(!!e.streamToken,12678),this.lastStreamToken=e.streamToken,this.M_.reset();const t=Ey(e.writeResults,e.commitTime),n=pe(e.commitTime);return this.listener.na(n,t)}ra(){const e={};e.database=fa(this.serializer),this.K_(e)}ea(e){const t={streamToken:this.lastStreamToken,writes:e.map((n=>vs(this.serializer,n)))};this.K_(t)}}/**
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
 */class fI{}class mI extends fI{constructor(e,t,n,s){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=n,this.serializer=s,this.ia=!1}sa(){if(this.ia)throw new V(R.FAILED_PRECONDITION,"The client has already been terminated.")}Wo(e,t,n,s){return this.sa(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([i,o])=>this.connection.Wo(e,da(t,n),s,i,o))).catch((i=>{throw i.name==="FirebaseError"?(i.code===R.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),i):new V(R.UNKNOWN,i.toString())}))}jo(e,t,n,s,i){return this.sa(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([o,u])=>this.connection.jo(e,da(t,n),s,o,u,i))).catch((o=>{throw o.name==="FirebaseError"?(o.code===R.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),o):new V(R.UNKNOWN,o.toString())}))}terminate(){this.ia=!0,this.connection.terminate()}}function gI(r,e,t,n){return new mI(r,e,t,n)}class pI{constructor(e,t){this.asyncQueue=e,this.onlineStateHandler=t,this.state="Unknown",this.oa=0,this._a=null,this.aa=!0}ua(){this.oa===0&&(this.ca("Unknown"),this._a=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,(()=>(this._a=null,this.la("Backend didn't respond within 10 seconds."),this.ca("Offline"),Promise.resolve()))))}ha(e){this.state==="Online"?this.ca("Unknown"):(this.oa++,this.oa>=1&&(this.Pa(),this.la(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.ca("Offline")))}set(e){this.Pa(),this.oa=0,e==="Online"&&(this.aa=!1),this.ca(e)}ca(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}la(e){const t=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.aa?(ge(t),this.aa=!1):x("OnlineStateTracker",t)}Pa(){this._a!==null&&(this._a.cancel(),this._a=null)}}/**
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
 */const at="RemoteStore";class _I{constructor(e,t,n,s,i){this.localStore=e,this.datastore=t,this.asyncQueue=n,this.remoteSyncer={},this.Ta=[],this.Ia=new Map,this.Ea=new Map,this.Ra=new Map,this.Aa=new ft(1e3),this.Va=new ft(1001),this.da=new Set,this.ma=[],this.fa=i,this.fa.Mo((o=>{n.enqueueAndForget((async()=>{Qt(this)&&(x(at,"Restarting streams for network reachability change."),await(async function(c){const h=M(c);h.da.add(4),await Er(h),h.ga.set("Unknown"),h.da.delete(4),await xs(h)})(this))}))})),this.ga=new pI(n,s)}}async function xs(r){if(Qt(r))for(const e of r.ma)await e(!0)}async function Er(r){for(const e of r.ma)await e(!1)}function Ea(r,e){return r.Ea.get(e)||void 0}function Zi(r,e){const t=M(r),n=Ea(t,e.targetId);if(n!==void 0&&t.Ia.has(n))return;const s=(function(u,c){const h=Ea(u,c);h!==void 0&&u.Ra.delete(h);const f=(function(p,v){return v%2!=0?p.Va.next():p.Aa.next()})(u,c);return u.Ea.set(c,f),u.Ra.set(f,c),f})(t,e.targetId);x(at,"remoteStoreListen mapping SDK target ID to remote",e.targetId,s);const i=new rt(e.target,s,e.purpose,e.sequenceNumber,e.snapshotVersion,e.lastLimboFreeSnapshotVersion,e.resumeToken);t.Ia.set(s,i),au(t)?ou(t):wr(t).O_()&&iu(t,i)}function cr(r,e){const t=M(r),n=wr(t),s=Ea(t,e);x(at,"remoteStoreUnlisten removing mapping of SDK target ID to remote",e,s),t.Ia.delete(s),t.Ea.delete(e),t.Ra.delete(s),n.O_()&&Ff(t,s),t.Ia.size===0&&(n.O_()?n.L_():Qt(t)&&t.ga.set("Unknown"))}function iu(r,e){if(r.pa.$e(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo(U.min())>0){const t=r.Ra.get(e.targetId);if(t===void 0)return void x(at,"SDK target ID not found for remote ID: "+e.targetId);const n=r.remoteSyncer.getRemoteKeysForTarget(t).size;e=e.withExpectedCount(n)}wr(r).Z_(e)}function Ff(r,e){r.pa.$e(e),wr(r).X_(e)}function ou(r){r.pa=new dy({getRemoteKeysForTarget:e=>{const t=r.Ra.get(e);return t!==void 0?r.remoteSyncer.getRemoteKeysForTarget(t):$()},At:e=>r.Ia.get(e)||null,ht:()=>r.datastore.serializer.databaseId}),wr(r).start(),r.ga.ua()}function au(r){return Qt(r)&&!wr(r).x_()&&r.Ia.size>0}function Qt(r){return M(r).da.size===0}function Lf(r){r.pa=void 0}async function yI(r){r.ga.set("Online")}async function II(r){r.Ia.forEach(((e,t)=>{iu(r,e)}))}async function EI(r,e){Lf(r),au(r)?(r.ga.ha(e),ou(r)):r.ga.set("Unknown")}async function TI(r,e,t){if(r.ga.set("Online"),e instanceof Wd&&e.state===2&&e.cause)try{await(async function(s,i){const o=i.cause;for(const u of i.targetIds){if(s.Ia.has(u)){const c=s.Ra.get(u);c!==void 0&&(await s.remoteSyncer.rejectListen(c,o),s.Ea.delete(c),s.Ra.delete(u)),s.Ia.delete(u)}s.pa.removeTarget(u)}})(r,e)}catch(n){x(at,"Failed to remove targets %s: %s ",e.targetIds.join(","),n),await Ni(r,n)}else if(e instanceof mi?r.pa.Xe(e):e instanceof Qd?r.pa.st(e):r.pa.tt(e),!t.isEqual(U.min()))try{const n=await Rf(r.localStore);t.compareTo(n)>=0&&await(function(i,o){const u=i.pa.Tt(o);u.targetChanges.forEach(((h,f)=>{if(h.resumeToken.approximateByteSize()>0){const m=i.Ia.get(f);m&&i.Ia.set(f,m.withResumeToken(h.resumeToken,o))}})),u.targetMismatches.forEach(((h,f)=>{const m=i.Ia.get(h);if(!m)return;i.Ia.set(h,m.withResumeToken(fe.EMPTY_BYTE_STRING,m.snapshotVersion)),Ff(i,h);const p=new rt(m.target,h,f,m.sequenceNumber);iu(i,p)}));const c=(function(f,m){const p=new Map;m.targetChanges.forEach(((C,N)=>{const D=f.Ra.get(N);D!==void 0&&p.set(D,C)}));let v=new oe(z);return m.targetMismatches.forEach(((C,N)=>{const D=f.Ra.get(C);D!==void 0&&(v=v.insert(D,N))})),new Ir(m.snapshotVersion,p,v,m.documentUpdates,m.resolvedLimboDocuments)})(i,u);return i.remoteSyncer.applyRemoteEvent(c)})(r,t)}catch(n){x(at,"Failed to raise snapshot:",n),await Ni(r,n)}}async function Ni(r,e,t){if(!Gt(e))throw e;r.da.add(1),await Er(r),r.ga.set("Offline"),t||(t=()=>Rf(r.localStore)),r.asyncQueue.enqueueRetryable((async()=>{x(at,"Retrying IndexedDB access"),await t(),r.da.delete(1),await xs(r)}))}function Bf(r,e){return e().catch((t=>Ni(r,t,e)))}async function Tr(r){const e=M(r),t=qt(e);let n=e.Ta.length>0?e.Ta[e.Ta.length-1].batchId:kt;for(;wI(e);)try{const s=await rI(e.localStore,n);if(s===null){e.Ta.length===0&&t.L_();break}n=s.batchId,vI(e,s)}catch(s){await Ni(e,s)}Uf(e)&&qf(e)}function wI(r){return Qt(r)&&r.Ta.length<10}function vI(r,e){r.Ta.push(e);const t=qt(r);t.O_()&&t.Y_&&t.ea(e.mutations)}function Uf(r){return Qt(r)&&!qt(r).x_()&&r.Ta.length>0}function qf(r){qt(r).start()}async function AI(r){qt(r).ra()}async function bI(r){const e=qt(r);for(const t of r.Ta)e.ea(t.mutations)}async function RI(r,e,t){const n=r.Ta.shift(),s=Ga.from(n,e,t);await Bf(r,(()=>r.remoteSyncer.applySuccessfulWrite(s))),await Tr(r)}async function SI(r,e){e&&qt(r).Y_&&await(async function(n,s){if((function(o){return $d(o)&&o!==R.ABORTED})(s.code)){const i=n.Ta.shift();qt(n).B_(),await Bf(n,(()=>n.remoteSyncer.rejectFailedWrite(i.batchId,s))),await Tr(n)}})(r,e),Uf(r)&&qf(r)}async function Yl(r,e){const t=M(r);t.asyncQueue.verifyOperationInProgress(),x(at,"RemoteStore received new credentials");const n=Qt(t);t.da.add(3),await Er(t),n&&t.ga.set("Unknown"),await t.remoteSyncer.handleCredentialChange(e),t.da.delete(3),await xs(t)}async function Ta(r,e){const t=M(r);e?(t.da.delete(2),await xs(t)):e||(t.da.add(2),await Er(t),t.ga.set("Unknown"))}function wr(r){return r.ya||(r.ya=(function(t,n,s){const i=M(t);return i.sa(),new hI(n,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,s)})(r.datastore,r.asyncQueue,{Zo:yI.bind(null,r),Yo:II.bind(null,r),t_:EI.bind(null,r),H_:TI.bind(null,r)}),r.ma.push((async e=>{e?(r.ya.B_(),au(r)?ou(r):r.ga.set("Unknown")):(await r.ya.stop(),Lf(r))}))),r.ya}function qt(r){return r.wa||(r.wa=(function(t,n,s){const i=M(t);return i.sa(),new dI(n,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,s)})(r.datastore,r.asyncQueue,{Zo:()=>Promise.resolve(),Yo:AI.bind(null,r),t_:SI.bind(null,r),ta:bI.bind(null,r),na:RI.bind(null,r)}),r.ma.push((async e=>{e?(r.wa.B_(),await Tr(r)):(await r.wa.stop(),r.Ta.length>0&&(x(at,`Stopping write stream with ${r.Ta.length} pending writes`),r.Ta=[]))}))),r.wa}/**
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
 */class uu{constructor(e,t,n,s,i){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=n,this.op=s,this.removalCallback=i,this.deferred=new Se,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch((o=>{}))}get promise(){return this.deferred.promise}static createAndSchedule(e,t,n,s,i){const o=Date.now()+n,u=new uu(e,t,o,s,i);return u.start(n),u}start(e){this.timerHandle=setTimeout((()=>this.handleDelayElapsed()),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new V(R.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget((()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then((e=>this.deferred.resolve(e)))):Promise.resolve()))}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function vr(r,e){if(ge("AsyncQueue",`${e}: ${r}`),Gt(r))return new V(R.UNAVAILABLE,`${e}: ${r}`);throw r}/**
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
 */class gn{static emptySet(e){return new gn(e.comparator)}constructor(e){this.comparator=e?(t,n)=>e(t,n)||k.comparator(t.key,n.key):(t,n)=>k.comparator(t.key,n.key),this.keyedMap=Yr(),this.sortedSet=new oe(this.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const t=this.keyedMap.get(e);return t?this.sortedSet.indexOf(t):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal(((t,n)=>(e(t),!1)))}add(e){const t=this.delete(e.key);return t.copy(t.keyedMap.insert(e.key,e),t.sortedSet.insert(e,null))}delete(e){const t=this.get(e);return t?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(t)):this}isEqual(e){if(!(e instanceof gn)||this.size!==e.size)return!1;const t=this.sortedSet.getIterator(),n=e.sortedSet.getIterator();for(;t.hasNext();){const s=t.getNext().key,i=n.getNext().key;if(!s.isEqual(i))return!1}return!0}toString(){const e=[];return this.forEach((t=>{e.push(t.toString())})),e.length===0?"DocumentSet ()":`DocumentSet (
  `+e.join(`  
`)+`
)`}copy(e,t){const n=new gn;return n.comparator=this.comparator,n.keyedMap=e,n.sortedSet=t,n}}/**
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
 */class Xl{constructor(){this.Sa=new oe(k.comparator)}track(e){const t=e.doc.key,n=this.Sa.get(t);n?e.type!==0&&n.type===3?this.Sa=this.Sa.insert(t,e):e.type===3&&n.type!==1?this.Sa=this.Sa.insert(t,{type:n.type,doc:e.doc}):e.type===2&&n.type===2?this.Sa=this.Sa.insert(t,{type:2,doc:e.doc}):e.type===2&&n.type===0?this.Sa=this.Sa.insert(t,{type:0,doc:e.doc}):e.type===1&&n.type===0?this.Sa=this.Sa.remove(t):e.type===1&&n.type===2?this.Sa=this.Sa.insert(t,{type:1,doc:n.doc}):e.type===0&&n.type===1?this.Sa=this.Sa.insert(t,{type:2,doc:e.doc}):F(63341,{Vt:e,ba:n}):this.Sa=this.Sa.insert(t,e)}Da(){const e=[];return this.Sa.inorderTraversal(((t,n)=>{e.push(n)})),e}}class wn{constructor(e,t,n,s,i,o,u,c,h){this.query=e,this.docs=t,this.oldDocs=n,this.docChanges=s,this.mutatedKeys=i,this.fromCache=o,this.syncStateChanged=u,this.excludesMetadataChanges=c,this.hasCachedResults=h}static fromInitialDocuments(e,t,n,s,i){const o=[];return t.forEach((u=>{o.push({type:0,doc:u})})),new wn(e,t,gn.emptySet(t),o,n,s,!0,!1,i)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&Ps(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const t=this.docChanges,n=e.docChanges;if(t.length!==n.length)return!1;for(let s=0;s<t.length;s++)if(t[s].type!==n[s].type||!t[s].doc.isEqual(n[s].doc))return!1;return!0}}/**
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
 */class PI{constructor(){this.Ca=void 0,this.va=[]}Fa(){return this.va.some((e=>e.Ma()))}}class VI{constructor(){this.queries=Zl(),this.onlineState="Unknown",this.xa=new Set}terminate(){(function(t,n){const s=M(t),i=s.queries;s.queries=Zl(),i.forEach(((o,u)=>{for(const c of u.va)c.onError(n)}))})(this,new V(R.ABORTED,"Firestore shutting down"))}}function Zl(){return new pt((r=>Vd(r)),Ps)}async function cu(r,e){const t=M(r);let n=3;const s=e.query;let i=t.queries.get(s);i?!i.Fa()&&e.Ma()&&(n=2):(i=new PI,n=e.Ma()?0:1);try{switch(n){case 0:i.Ca=await t.onListen(s,!0);break;case 1:i.Ca=await t.onListen(s,!1);break;case 2:await t.onFirstRemoteStoreListen(s)}}catch(o){const u=vr(o,`Initialization of query '${Bn(e.query)}' failed`);return void e.onError(u)}t.queries.set(s,i),i.va.push(e),e.Oa(t.onlineState),i.Ca&&e.Na(i.Ca)&&hu(t)}async function lu(r,e){const t=M(r),n=e.query;let s=3;const i=t.queries.get(n);if(i){const o=i.va.indexOf(e);o>=0&&(i.va.splice(o,1),i.va.length===0?s=e.Ma()?0:1:!i.Fa()&&e.Ma()&&(s=2))}switch(s){case 0:return t.queries.delete(n),t.onUnlisten(n,!0);case 1:return t.queries.delete(n),t.onUnlisten(n,!1);case 2:return t.onLastRemoteStoreUnlisten(n);default:return}}function CI(r,e){const t=M(r);let n=!1;for(const s of e){const i=s.query,o=t.queries.get(i);if(o){for(const u of o.va)u.Na(s)&&(n=!0);o.Ca=s}}n&&hu(t)}function DI(r,e,t){const n=M(r),s=n.queries.get(e);if(s)for(const i of s.va)i.onError(t);n.queries.delete(e)}function hu(r){r.xa.forEach((e=>{e.next()}))}var wa,eh;(eh=wa||(wa={})).Ba="default",eh.Cache="cache";class du{constructor(e,t,n){this.query=e,this.La=t,this.ka=!1,this.Ka=null,this.onlineState="Unknown",this.options=n||{}}Na(e){if(!this.options.includeMetadataChanges){const n=[];for(const s of e.docChanges)s.type!==3&&n.push(s);e=new wn(e.query,e.docs,e.oldDocs,n,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let t=!1;return this.ka?this.qa(e)&&(this.La.next(e),t=!0):this.Ua(e,this.onlineState)&&(this.$a(e),t=!0),this.Ka=e,t}onError(e){this.La.error(e)}Oa(e){this.onlineState=e;let t=!1;return this.Ka&&!this.ka&&this.Ua(this.Ka,e)&&(this.$a(this.Ka),t=!0),t}Ua(e,t){if(!e.fromCache||!this.Ma())return!0;const n=t!=="Offline";return(!this.options.Wa||!n)&&(!e.docs.isEmpty()||e.hasCachedResults||t==="Offline")}qa(e){if(e.docChanges.length>0)return!0;const t=this.Ka&&this.Ka.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!t)&&this.options.includeMetadataChanges===!0}$a(e){e=wn.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.ka=!0,this.La.next(e)}Ma(){return this.options.source!==wa.Cache}}/**
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
 */class jf{constructor(e,t){this.Qa=e,this.byteLength=t}Ga(){return"metadata"in this.Qa}}/**
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
 */class th{constructor(e){this.serializer=e}Ks(e){return it(this.serializer,e)}qs(e){return e.metadata.exists?Qi(this.serializer,e.document,!1):ue.newNoDocument(this.Ks(e.metadata.name),this.Us(e.metadata.readTime))}Us(e){return pe(e)}}class fu{constructor(e,t){this.za=e,this.serializer=t,this.ja=[],this.Ja=[],this.collectionGroups=new Set,this.progress=zf(e)}get queries(){return this.ja}get documents(){return this.Ja}Ha(e){this.progress.bytesLoaded+=e.byteLength;let t=this.progress.documentsLoaded;if(e.Qa.namedQuery)this.ja.push(e.Qa.namedQuery);else if(e.Qa.documentMetadata){this.Ja.push({metadata:e.Qa.documentMetadata}),e.Qa.documentMetadata.exists||++t;const n=K.fromString(e.Qa.documentMetadata.name);this.collectionGroups.add(n.get(n.length-2))}else e.Qa.document&&(this.Ja[this.Ja.length-1].document=e.Qa.document,++t);return t!==this.progress.documentsLoaded?(this.progress.documentsLoaded=t,{...this.progress}):null}Za(e){const t=new Map,n=new th(this.serializer);for(const s of e)if(s.metadata.queries){const i=n.Ks(s.metadata.name);for(const o of s.metadata.queries){const u=(t.get(o)||$()).add(i);t.set(o,u)}}return t}async Xa(e){const t=await sI(e,new th(this.serializer),this.Ja,this.za.id),n=this.Za(this.documents);for(const s of this.ja)await iI(e,s,n.get(s.name));return this.progress.taskState="Success",{progress:this.progress,Ya:this.collectionGroups,eu:t}}}function zf(r){return{taskState:"Running",documentsLoaded:0,bytesLoaded:0,totalDocuments:r.totalDocuments,totalBytes:r.totalBytes}}/**
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
 */class $f{constructor(e){this.key=e}}class Gf{constructor(e){this.key=e}}class Kf{constructor(e,t){this.query=e,this.tu=t,this.nu=null,this.hasCachedResults=!1,this.current=!1,this.ru=$(),this.mutatedKeys=$(),this.iu=Dd(e),this.su=new gn(this.iu)}get ou(){return this.tu}_u(e,t){const n=t?t.au:new Xl,s=t?t.su:this.su;let i=t?t.mutatedKeys:this.mutatedKeys,o=s,u=!1;const c=this.query.limitType==="F"&&s.size===this.query.limit?s.last():null,h=this.query.limitType==="L"&&s.size===this.query.limit?s.first():null;if(e.inorderTraversal(((f,m)=>{const p=s.get(f),v=Vs(this.query,m)?m:null,C=!!p&&this.mutatedKeys.has(p.key),N=!!v&&(v.hasLocalMutations||this.mutatedKeys.has(v.key)&&v.hasCommittedMutations);let D=!1;p&&v?p.data.isEqual(v.data)?C!==N&&(n.track({type:3,doc:v}),D=!0):this.uu(p,v)||(n.track({type:2,doc:v}),D=!0,(c&&this.iu(v,c)>0||h&&this.iu(v,h)<0)&&(u=!0)):!p&&v?(n.track({type:0,doc:v}),D=!0):p&&!v&&(n.track({type:1,doc:p}),D=!0,(c||h)&&(u=!0)),D&&(v?(o=o.add(v),i=N?i.add(f):i.delete(f)):(o=o.delete(f),i=i.delete(f)))})),this.query.limit!==null)for(;o.size>this.query.limit;){const f=this.query.limitType==="F"?o.last():o.first();o=o.delete(f.key),i=i.delete(f.key),n.track({type:1,doc:f})}return{su:o,au:n,bs:u,mutatedKeys:i}}uu(e,t){return e.hasLocalMutations&&t.hasCommittedMutations&&!t.hasLocalMutations}applyChanges(e,t,n,s){const i=this.su;this.su=e.su,this.mutatedKeys=e.mutatedKeys;const o=e.au.Da();o.sort(((f,m)=>(function(v,C){const N=D=>{switch(D){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return F(20277,{Vt:D})}};return N(v)-N(C)})(f.type,m.type)||this.iu(f.doc,m.doc))),this.cu(n),s=s!=null?s:!1;const u=t&&!s?this.lu():[],c=this.ru.size===0&&this.current&&!s?1:0,h=c!==this.nu;return this.nu=c,o.length!==0||h?{snapshot:new wn(this.query,e.su,i,o,e.mutatedKeys,c===0,h,!1,!!n&&n.resumeToken.approximateByteSize()>0),hu:u}:{hu:u}}Oa(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({su:this.su,au:new Xl,mutatedKeys:this.mutatedKeys,bs:!1},!1)):{hu:[]}}Pu(e){return!this.tu.has(e)&&!!this.su.has(e)&&!this.su.get(e).hasLocalMutations}cu(e){e&&(e.addedDocuments.forEach((t=>this.tu=this.tu.add(t))),e.modifiedDocuments.forEach((t=>{})),e.removedDocuments.forEach((t=>this.tu=this.tu.delete(t))),this.current=e.current)}lu(){if(!this.current)return[];const e=this.ru;this.ru=$(),this.su.forEach((n=>{this.Pu(n.key)&&(this.ru=this.ru.add(n.key))}));const t=[];return e.forEach((n=>{this.ru.has(n)||t.push(new Gf(n))})),this.ru.forEach((n=>{e.has(n)||t.push(new $f(n))})),t}Tu(e){this.tu=e.ks,this.ru=$();const t=this._u(e.documents);return this.applyChanges(t,!0)}Iu(){return wn.fromInitialDocuments(this.query,this.su,this.mutatedKeys,this.nu===0,this.hasCachedResults)}}const Wt="SyncEngine";class xI{constructor(e,t,n){this.query=e,this.targetId=t,this.view=n}}class NI{constructor(e){this.key=e,this.Eu=!1}}class kI{constructor(e,t,n,s,i,o){this.localStore=e,this.remoteStore=t,this.eventManager=n,this.sharedClientState=s,this.currentUser=i,this.maxConcurrentLimboResolutions=o,this.Ru={},this.Au=new pt((u=>Vd(u)),Ps),this.Vu=new Map,this.du=new Set,this.mu=new oe(k.comparator),this.fu=new Map,this.gu=new Ya,this.pu={},this.yu=new Map,this.wu=ft.ar(),this.onlineState="Unknown",this.Su=void 0}get isPrimaryClient(){return this.Su===!0}}async function MI(r,e,t=!0){const n=eo(r);let s;const i=n.Au.get(e);return i?(n.sharedClientState.addLocalQueryTarget(i.targetId),s=i.view.Iu()):s=await Qf(n,e,t,!0),s}async function OI(r,e){const t=eo(r);await Qf(t,e,!0,!1)}async function Qf(r,e,t,n){const s=await ar(r.localStore,Ne(e)),i=s.targetId,o=r.sharedClientState.addLocalQueryTarget(i,t);let u;return n&&(u=await mu(r,e,i,o==="current",s.resumeToken)),r.isPrimaryClient&&t&&Zi(r.remoteStore,s),u}async function mu(r,e,t,n,s){r.bu=(m,p,v)=>(async function(N,D,B,j){let q=D.view._u(B);q.bs&&(q=await Ci(N.localStore,D.query,!1).then((({documents:E})=>D.view._u(E,q))));const Z=j&&j.targetChanges.get(D.targetId),W=j&&j.targetMismatches.get(D.targetId)!=null,J=D.view.applyChanges(q,N.isPrimaryClient,Z,W);return va(N,D.targetId,J.hu),J.snapshot})(r,m,p,v);const i=await Ci(r.localStore,e,!0),o=new Kf(e,i.ks),u=o._u(i.documents),c=Ds.createSynthesizedTargetChangeForCurrentChange(t,n&&r.onlineState!=="Offline",s),h=o.applyChanges(u,r.isPrimaryClient,c);va(r,t,h.hu);const f=new xI(e,t,o);return r.Au.set(e,f),r.Vu.has(t)?r.Vu.get(t).push(e):r.Vu.set(t,[e]),h.snapshot}async function FI(r,e,t){const n=M(r),s=n.Au.get(e),i=n.Vu.get(s.targetId);if(i.length>1)return n.Vu.set(s.targetId,i.filter((o=>!Ps(o,e)))),void n.Au.delete(e);n.isPrimaryClient?(n.sharedClientState.removeLocalQueryTarget(s.targetId),n.sharedClientState.isActiveQueryTarget(s.targetId)||await ur(n.localStore,s.targetId,!1).then((()=>{n.sharedClientState.clearQueryState(s.targetId),t&&cr(n.remoteStore,s.targetId),lr(n,s.targetId)})).catch($t)):(lr(n,s.targetId),await ur(n.localStore,s.targetId,!0))}async function LI(r,e){const t=M(r),n=t.Au.get(e),s=t.Vu.get(n.targetId);t.isPrimaryClient&&s.length===1&&(t.sharedClientState.removeLocalQueryTarget(n.targetId),cr(t.remoteStore,n.targetId))}async function BI(r,e,t){const n=yu(r);try{const s=await(function(o,u){const c=M(o),h=ee.now(),f=u.reduce(((v,C)=>v.add(C.key)),$());let m,p;return c.persistence.runTransaction("Locally write mutations","readwrite",(v=>{let C=Ue(),N=$();return c.xs.getEntries(v,f).next((D=>{C=D,C.forEach(((B,j)=>{j.isValidDocument()||(N=N.add(B))}))})).next((()=>c.localDocuments.getOverlayedDocuments(v,C))).next((D=>{m=D;const B=[];for(const j of u){const q=uy(j,m.get(j.key).overlayedDocument);q!=null&&B.push(new _t(j.key,q,yd(q.value.mapValue),he.exists(!0)))}return c.mutationQueue.addMutationBatch(v,h,B,u)})).next((D=>{p=D;const B=D.applyToLocalDocumentSet(m,N);return c.documentOverlayCache.saveOverlays(v,D.batchId,B)}))})).then((()=>({batchId:p.batchId,changes:Nd(m)})))})(n.localStore,e);n.sharedClientState.addPendingMutation(s.batchId),(function(o,u,c){let h=o.pu[o.currentUser.toKey()];h||(h=new oe(z)),h=h.insert(u,c),o.pu[o.currentUser.toKey()]=h})(n,s.batchId,t),await yt(n,s.changes),await Tr(n.remoteStore)}catch(s){const i=vr(s,"Failed to persist write");t.reject(i)}}async function Wf(r,e){const t=M(r);try{const n=await nI(t.localStore,e);e.targetChanges.forEach(((s,i)=>{const o=t.fu.get(i);o&&(L(s.addedDocuments.size+s.modifiedDocuments.size+s.removedDocuments.size<=1,22616),s.addedDocuments.size>0?o.Eu=!0:s.modifiedDocuments.size>0?L(o.Eu,14607):s.removedDocuments.size>0&&(L(o.Eu,42227),o.Eu=!1))})),await yt(t,n,e)}catch(n){await $t(n)}}function nh(r,e,t){const n=M(r);if(n.isPrimaryClient&&t===0||!n.isPrimaryClient&&t===1){const s=[];n.Au.forEach(((i,o)=>{const u=o.view.Oa(e);u.snapshot&&s.push(u.snapshot)})),(function(o,u){const c=M(o);c.onlineState=u;let h=!1;c.queries.forEach(((f,m)=>{for(const p of m.va)p.Oa(u)&&(h=!0)})),h&&hu(c)})(n.eventManager,e),s.length&&n.Ru.H_(s),n.onlineState=e,n.isPrimaryClient&&n.sharedClientState.setOnlineState(e)}}async function UI(r,e,t){const n=M(r);n.sharedClientState.updateQueryState(e,"rejected",t);const s=n.fu.get(e),i=s&&s.key;if(i){let o=new oe(k.comparator);o=o.insert(i,ue.newNoDocument(i,U.min()));const u=$().add(i),c=new Ir(U.min(),new Map,new oe(z),o,u);await Wf(n,c),n.mu=n.mu.remove(i),n.fu.delete(e),_u(n)}else await ur(n.localStore,e,!1).then((()=>lr(n,e,t))).catch($t)}async function qI(r,e){const t=M(r),n=e.batch.batchId;try{const s=await tI(t.localStore,e);pu(t,n,null),gu(t,n),t.sharedClientState.updateMutationState(n,"acknowledged"),await yt(t,s)}catch(s){await $t(s)}}async function jI(r,e,t){const n=M(r);try{const s=await(function(o,u){const c=M(o);return c.persistence.runTransaction("Reject batch","readwrite-primary",(h=>{let f;return c.mutationQueue.lookupMutationBatch(h,u).next((m=>(L(m!==null,37113),f=m.keys(),c.mutationQueue.removeMutationBatch(h,m)))).next((()=>c.mutationQueue.performConsistencyCheck(h))).next((()=>c.documentOverlayCache.removeOverlaysForBatchId(h,f,u))).next((()=>c.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(h,f))).next((()=>c.localDocuments.getDocuments(h,f)))}))})(n.localStore,e);pu(n,e,t),gu(n,e),n.sharedClientState.updateMutationState(e,"rejected",t),await yt(n,s)}catch(s){await $t(s)}}async function zI(r,e){const t=M(r);Qt(t.remoteStore)||x(Wt,"The network is disabled. The task returned by 'awaitPendingWrites()' will not complete until the network is enabled.");try{const n=await(function(o){const u=M(o);return u.persistence.runTransaction("Get highest unacknowledged batch id","readonly",(c=>u.mutationQueue.getHighestUnacknowledgedBatchId(c)))})(t.localStore);if(n===kt)return void e.resolve();const s=t.yu.get(n)||[];s.push(e),t.yu.set(n,s)}catch(n){const s=vr(n,"Initialization of waitForPendingWrites() operation failed");e.reject(s)}}function gu(r,e){(r.yu.get(e)||[]).forEach((t=>{t.resolve()})),r.yu.delete(e)}function pu(r,e,t){const n=M(r);let s=n.pu[n.currentUser.toKey()];if(s){const i=s.get(e);i&&(t?i.reject(t):i.resolve(),s=s.remove(e)),n.pu[n.currentUser.toKey()]=s}}function lr(r,e,t=null){r.sharedClientState.removeLocalQueryTarget(e);for(const n of r.Vu.get(e))r.Au.delete(n),t&&r.Ru.Du(n,t);r.Vu.delete(e),r.isPrimaryClient&&r.gu.Gr(e).forEach((n=>{r.gu.containsKey(n)||Hf(r,n)}))}function Hf(r,e){r.du.delete(e.path.canonicalString());const t=r.mu.get(e);t!==null&&(cr(r.remoteStore,t),r.mu=r.mu.remove(e),r.fu.delete(t),_u(r))}function va(r,e,t){for(const n of t)n instanceof $f?(r.gu.addReference(n.key,e),$I(r,n)):n instanceof Gf?(x(Wt,"Document no longer in limbo: "+n.key),r.gu.removeReference(n.key,e),r.gu.containsKey(n.key)||Hf(r,n.key)):F(19791,{Cu:n})}function $I(r,e){const t=e.key,n=t.path.canonicalString();r.mu.get(t)||r.du.has(n)||(x(Wt,"New document in limbo: "+t),r.du.add(n),_u(r))}function _u(r){for(;r.du.size>0&&r.mu.size<r.maxConcurrentLimboResolutions;){const e=r.du.values().next().value;r.du.delete(e);const t=new k(K.fromString(e)),n=r.wu.next();r.fu.set(n,new NI(t)),r.mu=r.mu.insert(t,n),Zi(r.remoteStore,new rt(Ne(pr(t.path)),n,"TargetPurposeLimboResolution",Le.ce))}}async function yt(r,e,t){const n=M(r),s=[],i=[],o=[];n.Au.isEmpty()||(n.Au.forEach(((u,c)=>{o.push(n.bu(c,e,t).then((h=>{var f;if((h||t)&&n.isPrimaryClient){const m=h?!h.fromCache:(f=t==null?void 0:t.targetChanges.get(c.targetId))==null?void 0:f.current;n.sharedClientState.updateQueryState(c.targetId,m?"current":"not-current")}if(h){s.push(h);const m=tu.Es(c.targetId,h);i.push(m)}})))})),await Promise.all(o),n.Ru.H_(s),await(async function(c,h){const f=M(c);try{await f.persistence.runTransaction("notifyLocalViewChanges","readwrite",(m=>A.forEach(h,(p=>A.forEach(p.Ts,(v=>f.persistence.referenceDelegate.addReference(m,p.targetId,v))).next((()=>A.forEach(p.Is,(v=>f.persistence.referenceDelegate.removeReference(m,p.targetId,v)))))))))}catch(m){if(!Gt(m))throw m;x(nu,"Failed to update sequence numbers: "+m)}for(const m of h){const p=m.targetId;if(!m.fromCache){const v=f.vs.get(p),C=v.snapshotVersion,N=v.withLastLimboFreeSnapshotVersion(C);f.vs=f.vs.insert(p,N)}}})(n.localStore,i))}async function GI(r,e){const t=M(r);if(!t.currentUser.isEqual(e)){x(Wt,"User change. New user:",e.toKey());const n=await bf(t.localStore,e);t.currentUser=e,(function(i,o){i.yu.forEach((u=>{u.forEach((c=>{c.reject(new V(R.CANCELLED,o))}))})),i.yu.clear()})(t,"'waitForPendingWrites' promise is rejected due to a user change."),t.sharedClientState.handleUserChange(e,n.removedBatchIds,n.addedBatchIds),await yt(t,n.Ns)}}function KI(r,e){const t=M(r),n=t.fu.get(e);if(n&&n.Eu)return $().add(n.key);{let s=$();const i=t.Vu.get(e);if(!i)return s;for(const o of i){const u=t.Au.get(o);s=s.unionWith(u.view.ou)}return s}}async function QI(r,e){const t=M(r),n=await Ci(t.localStore,e.query,!0),s=e.view.Tu(n);return t.isPrimaryClient&&va(t,e.targetId,s.hu),s}async function WI(r,e){const t=M(r);return Vf(t.localStore,e).then((n=>yt(t,n)))}async function HI(r,e,t,n){const s=M(r),i=await(function(u,c){const h=M(u),f=M(h.mutationQueue);return h.persistence.runTransaction("Lookup mutation documents","readonly",(m=>f.Xn(m,c).next((p=>p?h.localDocuments.getDocuments(m,p):A.resolve(null)))))})(s.localStore,e);i!==null?(t==="pending"?await Tr(s.remoteStore):t==="acknowledged"||t==="rejected"?(pu(s,e,n||null),gu(s,e),(function(u,c){M(M(u).mutationQueue).nr(c)})(s.localStore,e)):F(6720,"Unknown batchState",{vu:t}),await yt(s,i)):x(Wt,"Cannot apply mutation batch with id: "+e)}async function JI(r,e){const t=M(r);if(eo(t),yu(t),e===!0&&t.Su!==!0){const n=t.sharedClientState.getAllActiveQueryTargets(),s=await rh(t,n.toArray());t.Su=!0,await Ta(t.remoteStore,!0);for(const i of s)Zi(t.remoteStore,i)}else if(e===!1&&t.Su!==!1){const n=[];let s=Promise.resolve();t.Vu.forEach(((i,o)=>{t.sharedClientState.isLocalQueryTarget(o)?n.push(o):s=s.then((()=>(lr(t,o),ur(t.localStore,o,!0)))),cr(t.remoteStore,o)})),await s,await rh(t,n),(function(o){const u=M(o);u.fu.forEach(((c,h)=>{cr(u.remoteStore,h)})),u.gu.zr(),u.fu=new Map,u.mu=new oe(k.comparator)})(t),t.Su=!1,await Ta(t.remoteStore,!1)}}async function rh(r,e,t){const n=M(r),s=[],i=[];for(const o of e){let u;const c=n.Vu.get(o);if(c&&c.length!==0){u=await ar(n.localStore,Ne(c[0]));for(const h of c){const f=n.Au.get(h),m=await QI(n,f);m.snapshot&&i.push(m.snapshot)}}else{const h=await Pf(n.localStore,o);u=await ar(n.localStore,h),await mu(n,Jf(h),o,!1,u.resumeToken)}s.push(u)}return n.Ru.H_(i),s}function Jf(r){return Rd(r.path,r.collectionGroup,r.orderBy,r.filters,r.limit,"F",r.startAt,r.endAt)}function YI(r){return(function(t){return M(M(t).persistence).hs()})(M(r).localStore)}async function XI(r,e,t,n){const s=M(r);if(s.Su)return void x(Wt,"Ignoring unexpected query state notification.");const i=s.Vu.get(e);if(i&&i.length>0)switch(t){case"current":case"not-current":{const o=await Vf(s.localStore,Cd(i[0])),u=Ir.createSynthesizedRemoteEventForCurrentChange(e,t==="current",fe.EMPTY_BYTE_STRING);await yt(s,o,u);break}case"rejected":await ur(s.localStore,e,!0),lr(s,e,n);break;default:F(64155,t)}}async function ZI(r,e,t){const n=eo(r);if(n.Su){for(const s of e){if(n.Vu.has(s)&&n.sharedClientState.isActiveQueryTarget(s)){x(Wt,"Adding an already active target "+s);continue}const i=await Pf(n.localStore,s),o=await ar(n.localStore,i);await mu(n,Jf(i),o.targetId,!1,o.resumeToken),Zi(n.remoteStore,o)}for(const s of t)n.Vu.has(s)&&await ur(n.localStore,s,!1).then((()=>{cr(n.remoteStore,s),lr(n,s)})).catch($t)}}function eo(r){const e=M(r);return e.remoteStore.remoteSyncer.applyRemoteEvent=Wf.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=KI.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=UI.bind(null,e),e.Ru.H_=CI.bind(null,e.eventManager),e.Ru.Du=DI.bind(null,e.eventManager),e}function yu(r){const e=M(r);return e.remoteStore.remoteSyncer.applySuccessfulWrite=qI.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=jI.bind(null,e),e}function eE(r,e,t){const n=M(r);(async function(i,o,u){try{const c=await o.getMetadata();if(await(function(v,C){const N=M(v),D=pe(C.createTime);return N.persistence.runTransaction("hasNewerBundle","readonly",(B=>N.Pi.getBundleMetadata(B,C.id))).then((B=>!!B&&B.createTime.compareTo(D)>=0))})(i.localStore,c))return await o.close(),u._completeWith((function(v){return{taskState:"Success",documentsLoaded:v.totalDocuments,bytesLoaded:v.totalBytes,totalDocuments:v.totalDocuments,totalBytes:v.totalBytes}})(c)),Promise.resolve(new Set);u._updateProgress(zf(c));const h=new fu(c,o.serializer);let f=await o.Fu();for(;f;){const p=await h.Ha(f);p&&u._updateProgress(p),f=await o.Fu()}const m=await h.Xa(i.localStore);return await yt(i,m.eu,void 0),await(function(v,C){const N=M(v);return N.persistence.runTransaction("Save bundle","readwrite",(D=>N.Pi.saveBundleMetadata(D,C)))})(i.localStore,c),u._completeWith(m.progress),Promise.resolve(m.Ya)}catch(c){return ze(Wt,`Loading bundle failed with ${c}`),u._failWith(c),Promise.resolve(new Set)}})(n,e,t).then((s=>{n.sharedClientState.notifyBundleLoaded(s)}))}class hr{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=An(e.databaseInfo.databaseId),this.sharedClientState=this.Mu(e),this.persistence=this.xu(e),await this.persistence.start(),this.localStore=this.Ou(e),this.gcScheduler=this.Nu(e,this.localStore),this.indexBackfillerScheduler=this.Bu(e,this.localStore)}Nu(e,t){return null}Bu(e,t){return null}Ou(e){return Af(this.persistence,new vf,e.initialUser,this.serializer)}xu(e){return new Xa(Xi.Vi,this.serializer)}Mu(e){return new kf}async terminate(){var e,t;(e=this.gcScheduler)==null||e.stop(),(t=this.indexBackfillerScheduler)==null||t.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}hr.provider={build:()=>new hr};class Iu extends hr{constructor(e){super(),this.cacheSizeBytes=e}Nu(e,t){L(this.persistence.referenceDelegate instanceof Vi,46915);const n=this.persistence.referenceDelegate.garbageCollector;return new _f(n,e.asyncQueue,t)}xu(e){const t=this.cacheSizeBytes!==void 0?De.withCacheSize(this.cacheSizeBytes):De.DEFAULT;return new Xa((n=>Vi.Vi(n,t)),this.serializer)}}class Eu extends hr{constructor(e,t,n){super(),this.Lu=e,this.cacheSizeBytes=t,this.forceOwnership=n,this.kind="persistent",this.synchronizeTabs=!1}async initialize(e){await super.initialize(e),await this.Lu.initialize(this,e),await yu(this.Lu.syncEngine),await Tr(this.Lu.remoteStore),await this.persistence.zi((()=>(this.gcScheduler&&!this.gcScheduler.started&&this.gcScheduler.start(),this.indexBackfillerScheduler&&!this.indexBackfillerScheduler.started&&this.indexBackfillerScheduler.start(),Promise.resolve())))}Ou(e){return Af(this.persistence,new vf,e.initialUser,this.serializer)}Nu(e,t){const n=this.persistence.referenceDelegate.garbageCollector;return new _f(n,e.asyncQueue,t)}Bu(e,t){const n=new a_(t,this.persistence);return new o_(e.asyncQueue,n)}xu(e){const t=eu(e.databaseInfo.databaseId,e.databaseInfo.persistenceKey),n=this.cacheSizeBytes!==void 0?De.withCacheSize(this.cacheSizeBytes):De.DEFAULT;return new Za(this.synchronizeTabs,t,e.clientId,n,e.asyncQueue,Mf(),pi(),this.serializer,this.sharedClientState,!!this.forceOwnership)}Mu(e){return new kf}}class Yf extends Eu{constructor(e,t){super(e,t,!1),this.Lu=e,this.cacheSizeBytes=t,this.synchronizeTabs=!0}async initialize(e){await super.initialize(e);const t=this.Lu.syncEngine;this.sharedClientState instanceof zo&&(this.sharedClientState.syncEngine={bo:HI.bind(null,t),Do:XI.bind(null,t),Co:ZI.bind(null,t),hs:YI.bind(null,t),So:WI.bind(null,t)},await this.sharedClientState.start()),await this.persistence.zi((async n=>{await JI(this.Lu.syncEngine,n),this.gcScheduler&&(n&&!this.gcScheduler.started?this.gcScheduler.start():n||this.gcScheduler.stop()),this.indexBackfillerScheduler&&(n&&!this.indexBackfillerScheduler.started?this.indexBackfillerScheduler.start():n||this.indexBackfillerScheduler.stop())}))}Mu(e){const t=Mf();if(!zo.v(t))throw new V(R.UNIMPLEMENTED,"IndexedDB persistence is only available on platforms that support LocalStorage.");const n=eu(e.databaseInfo.databaseId,e.databaseInfo.persistenceKey);return new zo(t,e.asyncQueue,n,e.clientId,e.initialUser)}}class jt{async initialize(e,t){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(t),this.remoteStore=this.createRemoteStore(t),this.eventManager=this.createEventManager(t),this.syncEngine=this.createSyncEngine(t,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=n=>nh(this.syncEngine,n,1),this.remoteStore.remoteSyncer.handleCredentialChange=GI.bind(null,this.syncEngine),await Ta(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return(function(){return new VI})()}createDatastore(e){const t=An(e.databaseInfo.databaseId),n=lI(e.databaseInfo);return gI(e.authCredentials,e.appCheckCredentials,n,t)}createRemoteStore(e){return(function(n,s,i,o,u){return new _I(n,s,i,o,u)})(this.localStore,this.datastore,e.asyncQueue,(t=>nh(this.syncEngine,t,0)),(function(){return Hl.v()?new Hl:new oI})())}createSyncEngine(e,t){return(function(s,i,o,u,c,h,f){const m=new kI(s,i,o,u,c,h);return f&&(m.Su=!0),m})(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,t)}async terminate(){var e,t;await(async function(s){const i=M(s);x(at,"RemoteStore shutting down."),i.da.add(5),await Er(i),i.fa.shutdown(),i.ga.set("Unknown")})(this.remoteStore),(e=this.datastore)==null||e.terminate(),(t=this.eventManager)==null||t.terminate()}}jt.provider={build:()=>new jt};function sh(r,e=10240){let t=0;return{async read(){if(t<r.byteLength){const n={value:r.slice(t,t+e),done:!1};return t+=e,n}return{done:!0}},async cancel(){},releaseLock(){},closed:Promise.resolve()}}/**
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
 *//**
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
 */class to{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.ku(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.ku(this.observer.error,e):ge("Uncaught Error in snapshot listener:",e.toString()))}Ku(){this.muted=!0}ku(e,t){setTimeout((()=>{this.muted||e(t)}),0)}}/**
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
 */class tE{constructor(e,t){this.qu=e,this.serializer=t,this.metadata=new Se,this.buffer=new Uint8Array,this.Uu=(function(){return new TextDecoder("utf-8")})(),this.$u().then((n=>{n&&n.Ga()?this.metadata.resolve(n.Qa.metadata):this.metadata.reject(new Error(`The first element of the bundle is not a metadata, it is
             ${JSON.stringify(n==null?void 0:n.Qa)}`))}),(n=>this.metadata.reject(n)))}close(){return this.qu.cancel()}async getMetadata(){return this.metadata.promise}async Fu(){return await this.getMetadata(),this.$u()}async $u(){const e=await this.Wu();if(e===null)return null;const t=this.Uu.decode(e),n=Number(t);isNaN(n)&&this.Qu(`length string (${t}) is not valid number`);const s=await this.Gu(n);return new jf(JSON.parse(s),e.length+n)}zu(){return this.buffer.findIndex((e=>e===123))}async Wu(){for(;this.zu()<0&&!await this.ju(););if(this.buffer.length===0)return null;const e=this.zu();e<0&&this.Qu("Reached the end of bundle when a length string is expected.");const t=this.buffer.slice(0,e);return this.buffer=this.buffer.slice(e),t}async Gu(e){for(;this.buffer.length<e;)await this.ju()&&this.Qu("Reached the end of bundle when more is expected.");const t=this.Uu.decode(this.buffer.slice(0,e));return this.buffer=this.buffer.slice(e),t}Qu(e){throw this.qu.cancel(),new Error(`Invalid bundle format: ${e}`)}async ju(){const e=await this.qu.read();if(!e.done){const t=new Uint8Array(this.buffer.length+e.value.length);t.set(this.buffer),t.set(e.value,this.buffer.length),this.buffer=t}return e.done}}/**
 * @license
 * Copyright 2025 Google LLC
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
 */class nE{constructor(e,t){this.bundleData=e,this.serializer=t,this.cursor=0,this.elements=[];let n=this.Fu();if(!n||!n.Ga())throw new Error(`The first element of the bundle is not a metadata object, it is
         ${JSON.stringify(n==null?void 0:n.Qa)}`);this.metadata=n;do n=this.Fu(),n!==null&&this.elements.push(n);while(n!==null)}getMetadata(){return this.metadata}Ju(){return this.elements}Fu(){if(this.cursor===this.bundleData.length)return null;const e=this.Wu(),t=this.Gu(e);return new jf(JSON.parse(t),e)}Gu(e){if(this.cursor+e>this.bundleData.length)throw new V(R.INTERNAL,"Reached the end of bundle when more is expected.");return this.bundleData.slice(this.cursor,this.cursor+=e)}Wu(){const e=this.cursor;let t=this.cursor;for(;t<this.bundleData.length;){if(this.bundleData[t]==="{"){if(t===e)throw new Error("First character is a bracket and not a number");return this.cursor=t,Number(this.bundleData.slice(e,t))}t++}throw new Error("Reached the end of bundle when more is expected.")}}/**
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
 */let rE=class{constructor(e){this.datastore=e,this.readVersions=new Map,this.mutations=[],this.committed=!1,this.lastTransactionError=null,this.writtenDocs=new Set}async lookup(e){if(this.ensureCommitNotCalled(),this.mutations.length>0)throw this.lastTransactionError=new V(R.INVALID_ARGUMENT,"Firestore transactions require all reads to be executed before all writes."),this.lastTransactionError;const t=await(async function(s,i){const o=M(s),u={documents:i.map((m=>ws(o.serializer,m)))},c=await o.jo("BatchGetDocuments",o.serializer.databaseId,K.emptyPath(),u,i.length),h=new Map;c.forEach((m=>{const p=yy(o.serializer,m);h.set(p.key.toString(),p)}));const f=[];return i.forEach((m=>{const p=h.get(m.toString());L(!!p,55234,{key:m}),f.push(p)})),f})(this.datastore,e);return t.forEach((n=>this.recordVersion(n))),t}set(e,t){this.write(t.toMutation(e,this.precondition(e))),this.writtenDocs.add(e.toString())}update(e,t){try{this.write(t.toMutation(e,this.preconditionForUpdate(e)))}catch(n){this.lastTransactionError=n}this.writtenDocs.add(e.toString())}delete(e){this.write(new yr(e,this.precondition(e))),this.writtenDocs.add(e.toString())}async commit(){if(this.ensureCommitNotCalled(),this.lastTransactionError)throw this.lastTransactionError;const e=this.readVersions;this.mutations.forEach((t=>{e.delete(t.key.toString())})),e.forEach(((t,n)=>{const s=k.fromPath(n);this.mutations.push(new za(s,this.precondition(s)))})),await(async function(n,s){const i=M(n),o={writes:s.map((u=>vs(i.serializer,u)))};await i.Wo("Commit",i.serializer.databaseId,K.emptyPath(),o)})(this.datastore,this.mutations),this.committed=!0}recordVersion(e){let t;if(e.isFoundDocument())t=e.version;else{if(!e.isNoDocument())throw F(50498,{Hu:e.constructor.name});t=U.min()}const n=this.readVersions.get(e.key.toString());if(n){if(!t.isEqual(n))throw new V(R.ABORTED,"Document version changed between two reads.")}else this.readVersions.set(e.key.toString(),t)}precondition(e){const t=this.readVersions.get(e.toString());return!this.writtenDocs.has(e.toString())&&t?t.isEqual(U.min())?he.exists(!1):he.updateTime(t):he.none()}preconditionForUpdate(e){const t=this.readVersions.get(e.toString());if(!this.writtenDocs.has(e.toString())&&t){if(t.isEqual(U.min()))throw new V(R.INVALID_ARGUMENT,"Can't update a document that doesn't exist.");return he.updateTime(t)}return he.exists(!0)}write(e){this.ensureCommitNotCalled(),this.mutations.push(e)}ensureCommitNotCalled(){}};/**
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
 */class sE{constructor(e,t,n,s,i){this.asyncQueue=e,this.datastore=t,this.options=n,this.updateFunction=s,this.deferred=i,this.Zu=n.maxAttempts,this.M_=new su(this.asyncQueue,"transaction_retry")}Xu(){this.Zu-=1,this.Yu()}Yu(){this.M_.p_((async()=>{const e=new rE(this.datastore),t=this.ec(e);t&&t.then((n=>{this.asyncQueue.enqueueAndForget((()=>e.commit().then((()=>{this.deferred.resolve(n)})).catch((s=>{this.tc(s)}))))})).catch((n=>{this.tc(n)}))}))}ec(e){try{const t=this.updateFunction(e);return!bs(t)&&t.catch&&t.then?t:(this.deferred.reject(Error("Transaction callback must return a Promise")),null)}catch(t){return this.deferred.reject(t),null}}tc(e){this.Zu>0&&this.nc(e)?(this.Zu-=1,this.asyncQueue.enqueueAndForget((()=>(this.Yu(),Promise.resolve())))):this.deferred.reject(e)}nc(e){if((e==null?void 0:e.name)==="FirebaseError"){const t=e.code;return t==="aborted"||t==="failed-precondition"||t==="already-exists"||!$d(t)}return!1}}/**
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
 */const zt="FirestoreClient";class iE{constructor(e,t,n,s,i){this.authCredentials=e,this.appCheckCredentials=t,this.asyncQueue=n,this._databaseInfo=s,this.user=be.UNAUTHENTICATED,this.clientId=Oi.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=i,this.authCredentials.start(n,(async o=>{x(zt,"Received user=",o.uid),await this.authCredentialListener(o),this.user=o})),this.appCheckCredentials.start(n,(o=>(x(zt,"Received new app check token=",o),this.appCheckCredentialListener(o,this.user))))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this._databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new Se;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted((async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(t){const n=vr(t,"Failed to shutdown persistence");e.reject(n)}})),e.promise}}async function Go(r,e){r.asyncQueue.verifyOperationInProgress(),x(zt,"Initializing OfflineComponentProvider");const t=r.configuration;await e.initialize(t);let n=t.initialUser;r.setCredentialChangeListener((async s=>{n.isEqual(s)||(await bf(e.localStore,s),n=s)})),e.persistence.setDatabaseDeletedListener((()=>r.terminate())),r._offlineComponents=e}async function ih(r,e){r.asyncQueue.verifyOperationInProgress();const t=await Tu(r);x(zt,"Initializing OnlineComponentProvider"),await e.initialize(t,r.configuration),r.setCredentialChangeListener((n=>Yl(e.remoteStore,n))),r.setAppCheckTokenChangeListener(((n,s)=>Yl(e.remoteStore,s))),r._onlineComponents=e}async function Tu(r){if(!r._offlineComponents)if(r._uninitializedComponentsProvider){x(zt,"Using user provided OfflineComponentProvider");try{await Go(r,r._uninitializedComponentsProvider._offline)}catch(e){const t=e;if(!(function(s){return s.name==="FirebaseError"?s.code===R.FAILED_PRECONDITION||s.code===R.UNIMPLEMENTED:!(typeof DOMException!="undefined"&&s instanceof DOMException)||s.code===22||s.code===20||s.code===11})(t))throw t;ze("Error using user provided cache. Falling back to memory cache: "+t),await Go(r,new hr)}}else x(zt,"Using default OfflineComponentProvider"),await Go(r,new Iu(void 0));return r._offlineComponents}async function no(r){return r._onlineComponents||(r._uninitializedComponentsProvider?(x(zt,"Using user provided OnlineComponentProvider"),await ih(r,r._uninitializedComponentsProvider._online)):(x(zt,"Using default OnlineComponentProvider"),await ih(r,new jt))),r._onlineComponents}function Xf(r){return Tu(r).then((e=>e.persistence))}function Ar(r){return Tu(r).then((e=>e.localStore))}function Zf(r){return no(r).then((e=>e.remoteStore))}function wu(r){return no(r).then((e=>e.syncEngine))}function em(r){return no(r).then((e=>e.datastore))}async function dr(r){const e=await no(r),t=e.eventManager;return t.onListen=MI.bind(null,e.syncEngine),t.onUnlisten=FI.bind(null,e.syncEngine),t.onFirstRemoteStoreListen=OI.bind(null,e.syncEngine),t.onLastRemoteStoreUnlisten=LI.bind(null,e.syncEngine),t}function oE(r){return r.asyncQueue.enqueue((async()=>{const e=await Xf(r),t=await Zf(r);return e.setNetworkEnabled(!0),(function(s){const i=M(s);return i.da.delete(0),xs(i)})(t)}))}function aE(r){return r.asyncQueue.enqueue((async()=>{const e=await Xf(r),t=await Zf(r);return e.setNetworkEnabled(!1),(async function(s){const i=M(s);i.da.add(0),await Er(i),i.ga.set("Offline")})(t)}))}function uE(r,e,t,n){const s=new to(n),i=new du(e,s,t);return r.asyncQueue.enqueueAndForget((async()=>cu(await dr(r),i))),()=>{s.Ku(),r.asyncQueue.enqueueAndForget((async()=>lu(await dr(r),i)))}}function cE(r,e){const t=new Se;return r.asyncQueue.enqueueAndForget((async()=>(async function(s,i,o){try{const u=await(function(h,f){const m=M(h);return m.persistence.runTransaction("read document","readonly",(p=>m.localDocuments.getDocument(p,f)))})(s,i);u.isFoundDocument()?o.resolve(u):u.isNoDocument()?o.resolve(null):o.reject(new V(R.UNAVAILABLE,"Failed to get document from cache. (However, this document may exist on the server. Run again without setting 'source' in the GetOptions to attempt to retrieve the document from the server.)"))}catch(u){const c=vr(u,`Failed to get document '${i} from cache`);o.reject(c)}})(await Ar(r),e,t))),t.promise}function tm(r,e,t={}){const n=new Se;return r.asyncQueue.enqueueAndForget((async()=>(function(i,o,u,c,h){const f=new to({next:p=>{f.Ku(),o.enqueueAndForget((()=>lu(i,m)));const v=p.docs.has(u);!v&&p.fromCache?h.reject(new V(R.UNAVAILABLE,"Failed to get document because the client is offline.")):v&&p.fromCache&&c&&c.source==="server"?h.reject(new V(R.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):h.resolve(p)},error:p=>h.reject(p)}),m=new du(pr(u.path),f,{includeMetadataChanges:!0,Wa:!0});return cu(i,m)})(await dr(r),r.asyncQueue,e,t,n))),n.promise}function lE(r,e){const t=new Se;return r.asyncQueue.enqueueAndForget((async()=>(async function(s,i,o){try{const u=await Ci(s,i,!0),c=new Kf(i,u.ks),h=c._u(u.documents),f=c.applyChanges(h,!1);o.resolve(f.snapshot)}catch(u){const c=vr(u,`Failed to execute query '${i} against cache`);o.reject(c)}})(await Ar(r),e,t))),t.promise}function nm(r,e,t={}){const n=new Se;return r.asyncQueue.enqueueAndForget((async()=>(function(i,o,u,c,h){const f=new to({next:p=>{f.Ku(),o.enqueueAndForget((()=>lu(i,m))),p.fromCache&&c.source==="server"?h.reject(new V(R.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):h.resolve(p)},error:p=>h.reject(p)}),m=new du(u,f,{includeMetadataChanges:!0,Wa:!0});return cu(i,m)})(await dr(r),r.asyncQueue,e,t,n))),n.promise}function hE(r,e,t){const n=new Se;return r.asyncQueue.enqueueAndForget((async()=>{try{const s=await em(r);n.resolve((async function(o,u,c){var N;const h=M(o),{request:f,gt:m,parent:p}=tf(h.serializer,Sd(u),c);h.connection.Ko||delete f.parent;const v=(await h.jo("RunAggregationQuery",h.serializer.databaseId,p,f,1)).filter((D=>!!D.result));L(v.length===1,64727);const C=(N=v[0].result)==null?void 0:N.aggregateFields;return Object.keys(C).reduce(((D,B)=>(D[m[B]]=C[B],D)),{})})(s,e,t))}catch(s){n.reject(s)}})),n.promise}function dE(r,e){const t=new Se;return r.asyncQueue.enqueueAndForget((async()=>BI(await wu(r),e,t))),t.promise}function fE(r,e){const t=new to(e);return r.asyncQueue.enqueueAndForget((async()=>(function(s,i){M(s).xa.add(i),i.next()})(await dr(r),t))),()=>{t.Ku(),r.asyncQueue.enqueueAndForget((async()=>(function(s,i){M(s).xa.delete(i)})(await dr(r),t)))}}function mE(r,e,t){const n=new Se;return r.asyncQueue.enqueueAndForget((async()=>{const s=await em(r);new sE(r.asyncQueue,s,t,e,n).Xu()})),n.promise}function gE(r,e,t,n){const s=(function(o,u){let c;return c=typeof o=="string"?Kd().encode(o):o,(function(f,m){return new tE(f,m)})((function(f,m){if(f instanceof Uint8Array)return sh(f,m);if(f instanceof ArrayBuffer)return sh(new Uint8Array(f),m);if(f instanceof ReadableStream)return f.getReader();throw new Error("Source of `toByteStreamReader` has to be a ArrayBuffer or ReadableStream")})(c),u)})(t,An(e));r.asyncQueue.enqueueAndForget((async()=>{eE(await wu(r),s,n)}))}function pE(r,e){return r.asyncQueue.enqueue((async()=>(function(n,s){const i=M(n);return i.persistence.runTransaction("Get named query","readonly",(o=>i.Pi.getNamedQuery(o,s)))})(await Ar(r),e)))}function rm(r,e){return(function(n,s){return new nE(n,s)})(r,e)}function _E(r,e){return r.asyncQueue.enqueue((async()=>(async function(n,s){const i=M(n),o=i.indexManager,u=[];return i.persistence.runTransaction("Configure indexes","readwrite",(c=>o.getFieldIndexes(c).next((h=>(function(m,p,v,C,N){m=[...m],p=[...p],m.sort(v),p.sort(v);const D=m.length,B=p.length;let j=0,q=0;for(;j<B&&q<D;){const Z=v(m[q],p[j]);Z<0?N(m[q++]):Z>0?C(p[j++]):(j++,q++)}for(;j<B;)C(p[j++]);for(;q<D;)N(m[q++])})(h,s,n_,(f=>{u.push(o.addFieldIndex(c,f))}),(f=>{u.push(o.deleteFieldIndex(c,f))})))).next((()=>A.waitFor(u)))))})(await Ar(r),e)))}function yE(r,e){return r.asyncQueue.enqueue((async()=>(function(n,s){M(n).Cs.As=s})(await Ar(r),e)))}function IE(r){return r.asyncQueue.enqueue((async()=>(function(t){const n=M(t),s=n.indexManager;return n.persistence.runTransaction("Delete All Indexes","readwrite",(i=>s.deleteAllFieldIndexes(i)))})(await Ar(r))))}/**
 * @license
 * Copyright 2023 Google LLC
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
 */function sm(r){const e={};return r.timeoutSeconds!==void 0&&(e.timeoutSeconds=r.timeoutSeconds),e}/**
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
 */const EE="ComponentProvider",oh=new Map;function TE(r,e,t,n,s){return new O_(r,e,t,s.host,s.ssl,s.experimentalForceLongPolling,s.experimentalAutoDetectLongPolling,sm(s.experimentalLongPollingOptions),s.useFetchStreams,s.isUsingEmulator,n)}/**
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
 */const im="firestore.googleapis.com",ah=!0;class uh{constructor(e){var t,n;if(e.host===void 0){if(e.ssl!==void 0)throw new V(R.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=im,this.ssl=ah}else this.host=e.host,this.ssl=(t=e.ssl)!=null?t:ah;if(this.isUsingEmulator=e.emulatorOptions!==void 0,this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=df;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<pf)throw new V(R.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}zh("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=sm((n=e.experimentalLongPollingOptions)!=null?n:{}),(function(i){if(i.timeoutSeconds!==void 0){if(isNaN(i.timeoutSeconds))throw new V(R.INVALID_ARGUMENT,`invalid long polling timeout: ${i.timeoutSeconds} (must not be NaN)`);if(i.timeoutSeconds<5)throw new V(R.INVALID_ARGUMENT,`invalid long polling timeout: ${i.timeoutSeconds} (minimum allowed value is 5)`);if(i.timeoutSeconds>30)throw new V(R.INVALID_ARGUMENT,`invalid long polling timeout: ${i.timeoutSeconds} (maximum allowed value is 30)`)}})(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&(function(n,s){return n.timeoutSeconds===s.timeoutSeconds})(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class Ns{constructor(e,t,n,s){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=n,this._app=s,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new uh({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new V(R.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new V(R.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new uh(e),this._emulatorOptions=e.emulatorOptions||{},e.credentials!==void 0&&(this._authCredentials=(function(n){if(!n)return new qh;switch(n.type){case"firstParty":return new Hp(n.sessionIndex||"0",n.iamToken||null,n.authTokenFactory||null);case"provider":return n.client;default:throw new V(R.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}})(e.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return(function(t){const n=oh.get(t);n&&(x(EE,"Removing Datastore"),oh.delete(t),n.terminate())})(this),Promise.resolve()}}function om(r,e,t,n={}){var h;r=Q(r,Ns);const s=Ra(e),i=r._getSettings(),o={...i,emulatorOptions:r._getEmulatorOptions()},u=`${e}:${t}`;s&&Sh(`https://${u}`),i.host!==im&&i.host!==u&&ze("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.");const c={...i,host:u,ssl:s,emulatorOptions:n};if(!Mt(c,o)&&(r._setSettings(c),n.mockUserToken)){let f,m;if(typeof n.mockUserToken=="string")f=n.mockUserToken,m=be.MOCK_USER;else{f=Tg(n.mockUserToken,(h=r._app)==null?void 0:h.options.projectId);const p=n.mockUserToken.sub||n.mockUserToken.user_id;if(!p)throw new V(R.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");m=new be(p)}r._authCredentials=new Kp(new Uh(f,m))}}/**
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
 */class Te{constructor(e,t,n){this.converter=t,this._query=n,this.type="query",this.firestore=e}withConverter(e){return new Te(this.firestore,e,this._query)}}class ne{constructor(e,t,n){this.converter=t,this._key=n,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new He(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new ne(this.firestore,e,this._key)}toJSON(){return{type:ne._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(e,t,n){if(vn(t,ne._jsonSchema))return new ne(e,n||null,new k(K.fromString(t.referencePath)))}}ne._jsonSchemaVersion="firestore/documentReference/1.0",ne._jsonSchema={type:ye("string",ne._jsonSchemaVersion),referencePath:ye("string")};class He extends Te{constructor(e,t,n){super(e,t,pr(n)),this._path=n,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new ne(this.firestore,null,new k(e))}withConverter(e){return new He(this.firestore,e,this._path)}}function wE(r,e,...t){if(r=Ee(r),Ca("collection","path",e),r instanceof Ns){const n=K.fromString(e,...t);return Jc(n),new He(r,null,n)}{if(!(r instanceof ne||r instanceof He))throw new V(R.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const n=r._path.child(K.fromString(e,...t));return Jc(n),new He(r.firestore,null,n)}}function vE(r,e){if(r=Q(r,Ns),Ca("collectionGroup","collection id",e),e.indexOf("/")>=0)throw new V(R.INVALID_ARGUMENT,`Invalid collection ID '${e}' passed to function collectionGroup(). Collection IDs must not contain '/'.`);return new Te(r,null,(function(n){return new gt(K.emptyPath(),n)})(e))}function am(r,e,...t){if(r=Ee(r),arguments.length===1&&(e=Oi.newId()),Ca("doc","path",e),r instanceof Ns){const n=K.fromString(e,...t);return Hc(n),new ne(r,null,new k(n))}{if(!(r instanceof ne||r instanceof He))throw new V(R.INVALID_ARGUMENT,"Expected first argument to doc() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const n=r._path.child(K.fromString(e,...t));return Hc(n),new ne(r.firestore,r instanceof He?r.converter:null,new k(n))}}function AE(r,e){return r=Ee(r),e=Ee(e),(r instanceof ne||r instanceof He)&&(e instanceof ne||e instanceof He)&&r.firestore===e.firestore&&r.path===e.path&&r.converter===e.converter}function vu(r,e){return r=Ee(r),e=Ee(e),r instanceof Te&&e instanceof Te&&r.firestore===e.firestore&&Ps(r._query,e._query)&&r.converter===e.converter}/**
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
 */const ch="AsyncQueue";class lh{constructor(e=Promise.resolve()){this.rc=[],this.sc=!1,this.oc=[],this._c=null,this.ac=!1,this.uc=!1,this.cc=[],this.M_=new su(this,"async_queue_retry"),this.lc=()=>{const n=pi();n&&x(ch,"Visibility state changed to "+n.visibilityState),this.M_.w_()},this.hc=e;const t=pi();t&&typeof t.addEventListener=="function"&&t.addEventListener("visibilitychange",this.lc)}get isShuttingDown(){return this.sc}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.Pc(),this.Tc(e)}enterRestrictedMode(e){if(!this.sc){this.sc=!0,this.uc=e||!1;const t=pi();t&&typeof t.removeEventListener=="function"&&t.removeEventListener("visibilitychange",this.lc)}}enqueue(e){if(this.Pc(),this.sc)return new Promise((()=>{}));const t=new Se;return this.Tc((()=>this.sc&&this.uc?Promise.resolve():(e().then(t.resolve,t.reject),t.promise))).then((()=>t.promise))}enqueueRetryable(e){this.enqueueAndForget((()=>(this.rc.push(e),this.Ic())))}async Ic(){if(this.rc.length!==0){try{await this.rc[0](),this.rc.shift(),this.M_.reset()}catch(e){if(!Gt(e))throw e;x(ch,"Operation failed with retryable error: "+e)}this.rc.length>0&&this.M_.p_((()=>this.Ic()))}}Tc(e){const t=this.hc.then((()=>(this.ac=!0,e().catch((n=>{throw this._c=n,this.ac=!1,ge("INTERNAL UNHANDLED ERROR: ",hh(n)),n})).then((n=>(this.ac=!1,n))))));return this.hc=t,t}enqueueAfterDelay(e,t,n){this.Pc(),this.cc.indexOf(e)>-1&&(t=0);const s=uu.createAndSchedule(this,e,t,n,(i=>this.Ec(i)));return this.oc.push(s),s}Pc(){this._c&&F(47125,{Rc:hh(this._c)})}verifyOperationInProgress(){}async Ac(){let e;do e=this.hc,await e;while(e!==this.hc)}Vc(e){for(const t of this.oc)if(t.timerId===e)return!0;return!1}dc(e){return this.Ac().then((()=>{this.oc.sort(((t,n)=>t.targetTimeMs-n.targetTimeMs));for(const t of this.oc)if(t.skipDelay(),e!=="all"&&t.timerId===e)break;return this.Ac()}))}mc(e){this.cc.push(e)}Ec(e){const t=this.oc.indexOf(e);this.oc.splice(t,1)}}function hh(r){let e=r.message||"";return r.stack&&(e=r.stack.includes(r.message)?r.stack:r.message+`
`+r.stack),e}/**
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
 */class um{constructor(){this._progressObserver={},this._taskCompletionResolver=new Se,this._lastProgress={taskState:"Running",totalBytes:0,totalDocuments:0,bytesLoaded:0,documentsLoaded:0}}onProgress(e,t,n){this._progressObserver={next:e,error:t,complete:n}}catch(e){return this._taskCompletionResolver.promise.catch(e)}then(e,t){return this._taskCompletionResolver.promise.then(e,t)}_completeWith(e){this._updateProgress(e),this._progressObserver.complete&&this._progressObserver.complete(),this._taskCompletionResolver.resolve(e)}_failWith(e){this._lastProgress.taskState="Error",this._progressObserver.next&&this._progressObserver.next(this._lastProgress),this._progressObserver.error&&this._progressObserver.error(e),this._taskCompletionResolver.reject(e)}_updateProgress(e){this._lastProgress=e,this._progressObserver.next&&this._progressObserver.next(e)}}/**
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
 */const bE=-1;class se extends Ns{constructor(e,t,n,s){super(e,t,n,s),this.type="firestore",this._queue=new lh,this._persistenceKey=(s==null?void 0:s.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new lh(e),this._firestoreClient=void 0,await e}}}function RE(r,e,t){t||(t=ys);const n=Pa(r,"firestore");if(n.isInitialized(t)){const s=n.getImmediate({identifier:t}),i=n.getOptions(t);if(Mt(i,e))return s;throw new V(R.FAILED_PRECONDITION,"initializeFirestore() has already been called with different options. To avoid this error, call initializeFirestore() with the same options as when it was originally called, or call getFirestore() to return the already initialized instance.")}if(e.cacheSizeBytes!==void 0&&e.localCache!==void 0)throw new V(R.INVALID_ARGUMENT,"cache and cacheSizeBytes cannot be specified at the same time as cacheSizeBytes willbe deprecated. Instead, specify the cache size in the cache object");if(e.cacheSizeBytes!==void 0&&e.cacheSizeBytes!==-1&&e.cacheSizeBytes<pf)throw new V(R.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");return e.host&&Ra(e.host)&&Sh(e.host),n.initialize({options:e,instanceIdentifier:t})}function SE(r,e){const t=typeof r=="object"?r:Cp(),n=typeof r=="string"?r:e||ys,s=Pa(t,"firestore").getImmediate({identifier:n});if(!s._initialized){const i=Ig("firestore");i&&om(s,...i)}return s}function de(r){if(r._terminated)throw new V(R.FAILED_PRECONDITION,"The client has already been terminated.");return r._firestoreClient||cm(r),r._firestoreClient}function cm(r){var n,s,i,o;const e=r._freezeSettings(),t=TE(r._databaseId,((n=r._app)==null?void 0:n.options.appId)||"",r._persistenceKey,(s=r._app)==null?void 0:s.options.apiKey,e);r._componentsProvider||(i=e.localCache)!=null&&i._offlineComponentProvider&&((o=e.localCache)!=null&&o._onlineComponentProvider)&&(r._componentsProvider={_offline:e.localCache._offlineComponentProvider,_online:e.localCache._onlineComponentProvider}),r._firestoreClient=new iE(r._authCredentials,r._appCheckCredentials,r._queue,t,r._componentsProvider&&(function(c){const h=c==null?void 0:c._online.build();return{_offline:c==null?void 0:c._offline.build(h),_online:h}})(r._componentsProvider))}function PE(r,e){ze("enableIndexedDbPersistence() will be deprecated in the future, you can use `FirestoreSettings.cache` instead.");const t=r._freezeSettings();return lm(r,jt.provider,{build:n=>new Eu(n,t.cacheSizeBytes,e==null?void 0:e.forceOwnership)}),Promise.resolve()}async function VE(r){ze("enableMultiTabIndexedDbPersistence() will be deprecated in the future, you can use `FirestoreSettings.cache` instead.");const e=r._freezeSettings();lm(r,jt.provider,{build:t=>new Yf(t,e.cacheSizeBytes)})}function lm(r,e,t){if((r=Q(r,se))._firestoreClient||r._terminated)throw new V(R.FAILED_PRECONDITION,"Firestore has already been started and persistence can no longer be enabled. You can only enable persistence before calling any other methods on a Firestore object.");if(r._componentsProvider||r._getSettings().localCache)throw new V(R.FAILED_PRECONDITION,"SDK cache is already specified.");r._componentsProvider={_online:e,_offline:t},cm(r)}function CE(r){if(r._initialized&&!r._terminated)throw new V(R.FAILED_PRECONDITION,"Persistence can only be cleared before a Firestore instance is initialized or after it is terminated.");const e=new Se;return r._queue.enqueueAndForgetEvenWhileRestricted((async()=>{try{await(async function(n){if(!st.v())return Promise.resolve();const s=n+wf;await st.delete(s)})(eu(r._databaseId,r._persistenceKey)),e.resolve()}catch(t){e.reject(t)}})),e.promise}function DE(r){return(function(t){const n=new Se;return t.asyncQueue.enqueueAndForget((async()=>zI(await wu(t),n))),n.promise})(de(r=Q(r,se)))}function xE(r){return oE(de(r=Q(r,se)))}function NE(r){return aE(de(r=Q(r,se)))}function kE(r){return Ap(r.app,"firestore",r._databaseId.database),r._delete()}function Aa(r,e){const t=de(r=Q(r,se)),n=new um;return gE(t,r._databaseId,e,n),n}function hm(r,e){return pE(de(r=Q(r,se)),e).then((t=>t?new Te(r,null,t.query):null))}/**
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
 */class Fe{constructor(e){this._byteString=e}static fromBase64String(e){try{return new Fe(fe.fromBase64String(e))}catch(t){throw new V(R.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+t)}}static fromUint8Array(e){return new Fe(fe.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}toJSON(){return{type:Fe._jsonSchemaVersion,bytes:this.toBase64()}}static fromJSON(e){if(vn(e,Fe._jsonSchema))return Fe.fromBase64String(e.bytes)}}Fe._jsonSchemaVersion="firestore/bytes/1.0",Fe._jsonSchema={type:ye("string",Fe._jsonSchemaVersion),bytes:ye("string")};/**
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
 */class bn{constructor(...e){for(let t=0;t<e.length;++t)if(e[t].length===0)throw new V(R.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new ce(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}function ME(){return new bn(Zo)}/**
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
 */class Ht{constructor(e){this._methodName=e}}/**
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
 */class Je{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new V(R.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new V(R.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}_compareTo(e){return z(this._lat,e._lat)||z(this._long,e._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:Je._jsonSchemaVersion}}static fromJSON(e){if(vn(e,Je._jsonSchema))return new Je(e.latitude,e.longitude)}}Je._jsonSchemaVersion="firestore/geoPoint/1.0",Je._jsonSchema={type:ye("string",Je._jsonSchemaVersion),latitude:ye("number"),longitude:ye("number")};/**
 * @license
 * Copyright 2024 Google LLC
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
 */class Ke{constructor(e){this._values=(e||[]).map((t=>t))}toArray(){return this._values.map((e=>e))}isEqual(e){return(function(n,s){if(n.length!==s.length)return!1;for(let i=0;i<n.length;++i)if(n[i]!==s[i])return!1;return!0})(this._values,e._values)}toJSON(){return{type:Ke._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(e){if(vn(e,Ke._jsonSchema)){if(Array.isArray(e.vectorValues)&&e.vectorValues.every((t=>typeof t=="number")))return new Ke(e.vectorValues);throw new V(R.INVALID_ARGUMENT,"Expected 'vectorValues' field to be a number array")}}}Ke._jsonSchemaVersion="firestore/vectorValue/1.0",Ke._jsonSchema={type:ye("string",Ke._jsonSchemaVersion),vectorValues:ye("object")};/**
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
 */const OE=/^__.*__$/;class FE{constructor(e,t,n){this.data=e,this.fieldMask=t,this.fieldTransforms=n}toMutation(e,t){return this.fieldMask!==null?new _t(e,this.data,this.fieldMask,t,this.fieldTransforms):new _r(e,this.data,t,this.fieldTransforms)}}class dm{constructor(e,t,n){this.data=e,this.fieldMask=t,this.fieldTransforms=n}toMutation(e,t){return new _t(e,this.data,this.fieldMask,t,this.fieldTransforms)}}function fm(r){switch(r){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw F(40011,{dataSource:r})}}class ro{constructor(e,t,n,s,i,o){this.settings=e,this.databaseId=t,this.serializer=n,this.ignoreUndefinedProperties=s,i===void 0&&this.fc(),this.fieldTransforms=i||[],this.fieldMask=o||[]}get path(){return this.settings.path}get dataSource(){return this.settings.dataSource}i(e){return new ro({...this.settings,...e},this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}yc(e){var s;const t=(s=this.path)==null?void 0:s.child(e),n=this.i({path:t,arrayElement:!1});return n.wc(e),n}Sc(e){var s;const t=(s=this.path)==null?void 0:s.child(e),n=this.i({path:t,arrayElement:!1});return n.fc(),n}bc(e){return this.i({path:void 0,arrayElement:!0})}Dc(e){return ki(e,this.settings.methodName,this.settings.hasConverter||!1,this.path,this.settings.targetDoc)}contains(e){return this.fieldMask.find((t=>e.isPrefixOf(t)))!==void 0||this.fieldTransforms.find((t=>e.isPrefixOf(t.field)))!==void 0}fc(){if(this.path)for(let e=0;e<this.path.length;e++)this.wc(this.path.get(e))}wc(e){if(e.length===0)throw this.Dc("Document fields must not be empty");if(fm(this.dataSource)&&OE.test(e))throw this.Dc('Document fields cannot begin and end with "__"')}}class LE{constructor(e,t,n){this.databaseId=e,this.ignoreUndefinedProperties=t,this.serializer=n||An(e)}V(e,t,n,s=!1){return new ro({dataSource:e,methodName:t,targetDoc:n,path:ce.emptyPath(),arrayElement:!1,hasConverter:s},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function Rn(r){const e=r._freezeSettings(),t=An(r._databaseId);return new LE(r._databaseId,!!e.ignoreUndefinedProperties,t)}function so(r,e,t,n,s,i={}){const o=r.V(i.merge||i.mergeFields?2:0,e,t,s);Cu("Data must be an object, but it was:",o,n);const u=pm(n,o);let c,h;if(i.merge)c=new Be(o.fieldMask),h=o.fieldTransforms;else if(i.mergeFields){const f=[];for(const m of i.mergeFields){const p=mt(e,m,t);if(!o.contains(p))throw new V(R.INVALID_ARGUMENT,`Field '${p}' is specified in your field mask but missing from your input data.`);ym(f,p)||f.push(p)}c=new Be(f),h=o.fieldTransforms.filter((m=>c.covers(m.field)))}else c=null,h=o.fieldTransforms;return new FE(new Re(u),c,h)}class ks extends Ht{_toFieldTransform(e){if(e.dataSource!==2)throw e.dataSource===1?e.Dc(`${this._methodName}() can only appear at the top level of your update data`):e.Dc(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return e.fieldMask.push(e.path),null}isEqual(e){return e instanceof ks}}function mm(r,e,t){return new ro({dataSource:3,targetDoc:e.settings.targetDoc,methodName:r._methodName,arrayElement:t},e.databaseId,e.serializer,e.ignoreUndefinedProperties)}class Au extends Ht{_toFieldTransform(e){return new Cs(e.path,new sr)}isEqual(e){return e instanceof Au}}class bu extends Ht{constructor(e,t){super(e),this.vc=t}_toFieldTransform(e){const t=mm(this,e,!0),n=this.vc.map((i=>Sn(i,t))),s=new yn(n);return new Cs(e.path,s)}isEqual(e){return e instanceof bu&&Mt(this.vc,e.vc)}}class Ru extends Ht{constructor(e,t){super(e),this.vc=t}_toFieldTransform(e){const t=mm(this,e,!0),n=this.vc.map((i=>Sn(i,t))),s=new In(n);return new Cs(e.path,s)}isEqual(e){return e instanceof Ru&&Mt(this.vc,e.vc)}}class Su extends Ht{constructor(e,t){super(e),this.Fc=t}_toFieldTransform(e){const t=new ir(e.serializer,Od(e.serializer,this.Fc));return new Cs(e.path,t)}isEqual(e){return e instanceof Su&&this.Fc===e.Fc}}function Pu(r,e,t,n){const s=r.V(1,e,t);Cu("Data must be an object, but it was:",s,n);const i=[],o=Re.empty();Kt(n,((c,h)=>{const f=Du(e,c,t);h=Ee(h);const m=s.Sc(f);if(h instanceof ks)i.push(f);else{const p=Sn(h,m);p!=null&&(i.push(f),o.set(f,p))}}));const u=new Be(i);return new dm(o,u,s.fieldTransforms)}function Vu(r,e,t,n,s,i){const o=r.V(1,e,t),u=[mt(e,n,t)],c=[s];if(i.length%2!=0)throw new V(R.INVALID_ARGUMENT,`Function ${e}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let p=0;p<i.length;p+=2)u.push(mt(e,i[p])),c.push(i[p+1]);const h=[],f=Re.empty();for(let p=u.length-1;p>=0;--p)if(!ym(h,u[p])){const v=u[p];let C=c[p];C=Ee(C);const N=o.Sc(v);if(C instanceof ks)h.push(v);else{const D=Sn(C,N);D!=null&&(h.push(v),f.set(v,D))}}const m=new Be(h);return new dm(f,m,o.fieldTransforms)}function gm(r,e,t,n=!1){return Sn(t,r.V(n?4:3,e))}function Sn(r,e){if(_m(r=Ee(r)))return Cu("Unsupported field value:",e,r),pm(r,e);if(r instanceof Ht)return(function(n,s){if(!fm(s.dataSource))throw s.Dc(`${n._methodName}() can only be used with update() and set()`);if(!s.path)throw s.Dc(`${n._methodName}() is not currently supported inside arrays`);const i=n._toFieldTransform(s);i&&s.fieldTransforms.push(i)})(r,e),null;if(r===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),r instanceof Array){if(e.settings.arrayElement&&e.dataSource!==4)throw e.Dc("Nested arrays are not supported");return(function(n,s){const i=[];let o=0;for(const u of n){let c=Sn(u,s.bc(o));c==null&&(c={nullValue:"NULL_VALUE"}),i.push(c),o++}return{arrayValue:{values:i}}})(r,e)}return(function(n,s){if((n=Ee(n))===null)return{nullValue:"NULL_VALUE"};if(typeof n=="number")return Od(s.serializer,n);if(typeof n=="boolean")return{booleanValue:n};if(typeof n=="string")return{stringValue:n};if(n instanceof Date){const i=ee.fromDate(n);return{timestampValue:or(s.serializer,i)}}if(n instanceof ee){const i=new ee(n.seconds,1e3*Math.floor(n.nanoseconds/1e3));return{timestampValue:or(s.serializer,i)}}if(n instanceof Je)return{geoPointValue:{latitude:n.latitude,longitude:n.longitude}};if(n instanceof Fe)return{bytesValue:Hd(s.serializer,n._byteString)};if(n instanceof ne){const i=s.databaseId,o=n.firestore._databaseId;if(!o.isEqual(i))throw s.Dc(`Document reference is for database ${o.projectId}/${o.database} but should be for database ${i.projectId}/${i.database}`);return{referenceValue:Wa(n.firestore._databaseId||s.databaseId,n._key.path)}}if(n instanceof Ke)return(function(o,u){const c=o instanceof Ke?o.toArray():o;return{mapValue:{fields:{[Fa]:{stringValue:La},[tr]:{arrayValue:{values:c.map((f=>{if(typeof f!="number")throw u.Dc("VectorValues must only contain numeric values.");return ja(u.serializer,f)}))}}}}}})(n,s);if(af(n))return n._toProto(s.serializer);throw s.Dc(`Unsupported field value: ${Fi(n)}`)})(r,e)}function pm(r,e){const t={};return cd(r)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):Kt(r,((n,s)=>{const i=Sn(s,e.yc(n));i!=null&&(t[n]=i)})),{mapValue:{fields:t}}}function _m(r){return!(typeof r!="object"||r===null||r instanceof Array||r instanceof Date||r instanceof ee||r instanceof Je||r instanceof Fe||r instanceof ne||r instanceof Ht||r instanceof Ke||af(r))}function Cu(r,e,t){if(!_m(t)||!$h(t)){const n=Fi(t);throw n==="an object"?e.Dc(r+" a custom object"):e.Dc(r+" "+n)}}function mt(r,e,t){if((e=Ee(e))instanceof bn)return e._internalPath;if(typeof e=="string")return Du(r,e);throw ki("Field path arguments must be of type string or ",r,!1,void 0,t)}const BE=new RegExp("[~\\*/\\[\\]]");function Du(r,e,t){if(e.search(BE)>=0)throw ki(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,r,!1,void 0,t);try{return new bn(...e.split("."))._internalPath}catch(n){throw ki(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,r,!1,void 0,t)}}function ki(r,e,t,n,s){const i=n&&!n.isEmpty(),o=s!==void 0;let u=`Function ${e}() called with invalid data`;t&&(u+=" (via `toFirestore()`)"),u+=". ";let c="";return(i||o)&&(c+=" (found",i&&(c+=` in field ${n}`),o&&(c+=` in document ${s}`),c+=")"),new V(R.INVALID_ARGUMENT,u+r+c)}function ym(r,e){return r.some((t=>t.isEqual(e)))}/**
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
 */class xu{convertValue(e,t="none"){switch(Lt(e)){case 0:return null;case 1:return e.booleanValue;case 2:return le(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,t);case 5:return e.stringValue;case 6:return this.convertBytes(dt(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,t);case 11:return this.convertObject(e.mapValue,t);case 10:return this.convertVectorValue(e.mapValue);default:throw F(62114,{value:e})}}convertObject(e,t){return this.convertObjectMap(e.fields,t)}convertObjectMap(e,t="none"){const n={};return Kt(e,((s,i)=>{n[s]=this.convertValue(i,t)})),n}convertVectorValue(e){var n,s,i;const t=(i=(s=(n=e.fields)==null?void 0:n[tr].arrayValue)==null?void 0:s.values)==null?void 0:i.map((o=>le(o.doubleValue)));return new Ke(t)}convertGeoPoint(e){return new Je(le(e.latitude),le(e.longitude))}convertArray(e,t){return(e.values||[]).map((n=>this.convertValue(n,t)))}convertServerTimestamp(e,t){switch(t){case"previous":const n=zi(e);return n==null?null:this.convertValue(n,t);case"estimate":return this.convertTimestamp(_s(e));default:return null}}convertTimestamp(e){const t=ht(e);return new ee(t.seconds,t.nanos)}convertDocumentKey(e,t){const n=K.fromString(e);L(of(n),9688,{name:e});const s=new Ft(n.get(1),n.get(3)),i=new k(n.popFirst(5));return s.isEqual(t)||ge(`Document ${i} contains a document reference within a different database (${s.projectId}/${s.database}) which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`),i}}/**
 * @license
 * Copyright 2024 Google LLC
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
 */class Jt extends xu{constructor(e){super(),this.firestore=e}convertBytes(e){return new Fe(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new ne(this.firestore,null,t)}}/**
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
 */function UE(){return new ks("deleteField")}function qE(){return new Au("serverTimestamp")}function jE(...r){return new bu("arrayUnion",r)}function zE(...r){return new Ru("arrayRemove",r)}function $E(r){return new Su("increment",r)}function GE(r){return new Ke(r)}/**
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
 */function KE(r){var n;const e=de(Q(r.firestore,se)),t=(n=e._onlineComponents)==null?void 0:n.datastore.serializer;return t===void 0?null:Wi(t,Ne(r._query)).ft}function QE(r,e){var i;const t=ud(e,((o,u)=>new zd(u,o.aggregateType,o._internalFieldPath))),n=de(Q(r.firestore,se)),s=(i=n._onlineComponents)==null?void 0:i.datastore.serializer;return s===void 0?null:tf(s,Sd(r._query),t,!0).request}const dh="@firebase/firestore",fh="4.14.1";/**
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
 */function Gn(r){return(function(t,n){if(typeof t!="object"||t===null)return!1;const s=t;for(const i of n)if(i in s&&typeof s[i]=="function")return!0;return!1})(r,["next","error","complete"])}/**
 * @license
 * Copyright 2022 Google LLC
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
 */class fr{constructor(e="count",t){this._internalFieldPath=t,this.type="AggregateField",this.aggregateType=e}}class Im{constructor(e,t,n){this._userDataWriter=t,this._data=n,this.type="AggregateQuerySnapshot",this.query=e}data(){return this._userDataWriter.convertObjectMap(this._data)}_fieldsProto(){return new Re({mapValue:{fields:this._data}}).clone().value.mapValue.fields}}/**
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
 */class As{constructor(e,t,n,s,i){this._firestore=e,this._userDataWriter=t,this._key=n,this._document=s,this._converter=i}get id(){return this._key.path.lastSegment()}get ref(){return new ne(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new WE(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}_fieldsProto(){var e,t;return(t=(e=this._document)==null?void 0:e.data.clone().value.mapValue.fields)!=null?t:void 0}get(e){if(this._document){const t=this._document.data.field(mt("DocumentSnapshot.get",e));if(t!==null)return this._userDataWriter.convertValue(t)}}}class WE extends As{data(){return super.data()}}/**
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
 */function Em(r){if(r.limitType==="L"&&r.explicitOrderBy.length===0)throw new V(R.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class Nu{}class br extends Nu{}function HE(r,e,...t){let n=[];e instanceof Nu&&n.push(e),n=n.concat(t),(function(i){const o=i.filter((c=>c instanceof Pn)).length,u=i.filter((c=>c instanceof Rr)).length;if(o>1||o>0&&u>0)throw new V(R.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")})(n);for(const s of n)r=s._apply(r);return r}class Rr extends br{constructor(e,t,n){super(),this._field=e,this._op=t,this._value=n,this.type="where"}static _create(e,t,n){return new Rr(e,t,n)}_apply(e){const t=this._parse(e);return wm(e._query,t),new Te(e.firestore,e.converter,la(e._query,t))}_parse(e){const t=Rn(e.firestore);return(function(i,o,u,c,h,f,m){let p;if(h.isKeyField()){if(f==="array-contains"||f==="array-contains-any")throw new V(R.INVALID_ARGUMENT,`Invalid Query. You can't perform '${f}' queries on documentId().`);if(f==="in"||f==="not-in"){gh(m,f);const C=[];for(const N of m)C.push(mh(c,i,N));p={arrayValue:{values:C}}}else p=mh(c,i,m)}else f!=="in"&&f!=="not-in"&&f!=="array-contains-any"||gh(m,f),p=gm(u,o,m,f==="in"||f==="not-in");return H.create(h,f,p)})(e._query,"where",t,e.firestore._databaseId,this._field,this._op,this._value)}}function JE(r,e,t){const n=e,s=mt("where",r);return Rr._create(s,n,t)}class Pn extends Nu{constructor(e,t){super(),this.type=e,this._queryConstraints=t}static _create(e,t){return new Pn(e,t)}_parse(e){const t=this._queryConstraints.map((n=>n._parse(e))).filter((n=>n.getFilters().length>0));return t.length===1?t[0]:te.create(t,this._getOperator())}_apply(e){const t=this._parse(e);return t.getFilters().length===0?e:((function(s,i){let o=s;const u=i.getFlattenedFilters();for(const c of u)wm(o,c),o=la(o,c)})(e._query,t),new Te(e.firestore,e.converter,la(e._query,t)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return this.type==="and"?"and":"or"}}function YE(...r){return r.forEach((e=>vm("or",e))),Pn._create("or",r)}function XE(...r){return r.forEach((e=>vm("and",e))),Pn._create("and",r)}class io extends br{constructor(e,t){super(),this._field=e,this._direction=t,this.type="orderBy"}static _create(e,t){return new io(e,t)}_apply(e){const t=(function(s,i,o){if(s.startAt!==null)throw new V(R.INVALID_ARGUMENT,"Invalid query. You must not call startAt() or startAfter() before calling orderBy().");if(s.endAt!==null)throw new V(R.INVALID_ARGUMENT,"Invalid query. You must not call endAt() or endBefore() before calling orderBy().");return new Ts(i,o)})(e._query,this._field,this._direction);return new Te(e.firestore,e.converter,H_(e._query,t))}}function ZE(r,e="asc"){const t=e,n=mt("orderBy",r);return io._create(n,t)}class Ms extends br{constructor(e,t,n){super(),this.type=e,this._limit=t,this._limitType=n}static _create(e,t,n){return new Ms(e,t,n)}_apply(e){return new Te(e.firestore,e.converter,bi(e._query,this._limit,this._limitType))}}function eT(r){return Gh("limit",r),Ms._create("limit",r,"F")}function tT(r){return Gh("limitToLast",r),Ms._create("limitToLast",r,"L")}class Os extends br{constructor(e,t,n){super(),this.type=e,this._docOrFields=t,this._inclusive=n}static _create(e,t,n){return new Os(e,t,n)}_apply(e){const t=Tm(e,this.type,this._docOrFields,this._inclusive);return new Te(e.firestore,e.converter,J_(e._query,t))}}function nT(...r){return Os._create("startAt",r,!0)}function rT(...r){return Os._create("startAfter",r,!1)}class Fs extends br{constructor(e,t,n){super(),this.type=e,this._docOrFields=t,this._inclusive=n}static _create(e,t,n){return new Fs(e,t,n)}_apply(e){const t=Tm(e,this.type,this._docOrFields,this._inclusive);return new Te(e.firestore,e.converter,Y_(e._query,t))}}function sT(...r){return Fs._create("endBefore",r,!1)}function iT(...r){return Fs._create("endAt",r,!0)}function Tm(r,e,t,n){if(t[0]=Ee(t[0]),t[0]instanceof As)return(function(i,o,u,c,h){if(!c)throw new V(R.NOT_FOUND,`Can't use a DocumentSnapshot that doesn't exist for ${u}().`);const f=[];for(const m of zn(i))if(m.field.isKeyField())f.push(pn(o,c.key));else{const p=c.data.field(m.field);if(ji(p))throw new V(R.INVALID_ARGUMENT,'Invalid query. You are trying to start or end a query using a document for which the field "'+m.field+'" is an uncommitted server timestamp. (Since the value of this field is unknown, you cannot start/end a query with it.)');if(p===null){const v=m.field.canonicalString();throw new V(R.INVALID_ARGUMENT,`Invalid query. You are trying to start or end a query using a document for which the field '${v}' (used as the orderBy) does not exist.`)}f.push(p)}return new Ut(f,h)})(r._query,r.firestore._databaseId,e,t[0]._document,n);{const s=Rn(r.firestore);return(function(o,u,c,h,f,m){const p=o.explicitOrderBy;if(f.length>p.length)throw new V(R.INVALID_ARGUMENT,`Too many arguments provided to ${h}(). The number of arguments must be less than or equal to the number of orderBy() clauses`);const v=[];for(let C=0;C<f.length;C++){const N=f[C];if(p[C].field.isKeyField()){if(typeof N!="string")throw new V(R.INVALID_ARGUMENT,`Invalid query. Expected a string for document ID in ${h}(), but got a ${typeof N}`);if(!Ua(o)&&N.indexOf("/")!==-1)throw new V(R.INVALID_ARGUMENT,`Invalid query. When querying a collection and ordering by documentId(), the value passed to ${h}() must be a plain document ID, but '${N}' contains a slash.`);const D=o.path.child(K.fromString(N));if(!k.isDocumentKey(D))throw new V(R.INVALID_ARGUMENT,`Invalid query. When querying a collection group and ordering by documentId(), the value passed to ${h}() must result in a valid document path, but '${D}' is not because it contains an odd number of segments.`);const B=new k(D);v.push(pn(u,B))}else{const D=gm(c,h,N);v.push(D)}}return new Ut(v,m)})(r._query,r.firestore._databaseId,s,e,t,n)}}function mh(r,e,t){if(typeof(t=Ee(t))=="string"){if(t==="")throw new V(R.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!Ua(e)&&t.indexOf("/")!==-1)throw new V(R.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${t}' contains a '/' character.`);const n=e.path.child(K.fromString(t));if(!k.isDocumentKey(n))throw new V(R.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${n}' is not because it has an odd number of segments (${n.length}).`);return pn(r,new k(n))}if(t instanceof ne)return pn(r,t._key);throw new V(R.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${Fi(t)}.`)}function gh(r,e){if(!Array.isArray(r)||r.length===0)throw new V(R.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${e.toString()}' filters.`)}function wm(r,e){const t=(function(s,i){for(const o of s)for(const u of o.getFlattenedFilters())if(i.indexOf(u.op)>=0)return u.op;return null})(r.filters,(function(s){switch(s){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}})(e.op));if(t!==null)throw t===e.op?new V(R.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${e.op.toString()}' filter.`):new V(R.INVALID_ARGUMENT,`Invalid query. You cannot use '${e.op.toString()}' filters with '${t.toString()}' filters.`)}function vm(r,e){if(!(e instanceof Rr||e instanceof Pn))throw new V(R.INVALID_ARGUMENT,`Function ${r}() requires AppliableConstraints created with a call to 'where(...)', 'or(...)', or 'and(...)'.`)}function oo(r,e,t){let n;return n=r?t&&(t.merge||t.mergeFields)?r.toFirestore(e,t):r.toFirestore(e):e,n}class ku extends xu{constructor(e){super(),this.firestore=e}convertBytes(e){return new Fe(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new ne(this.firestore,null,t)}}/**
 * @license
 * Copyright 2022 Google LLC
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
 */function oT(r){return new fr("sum",mt("sum",r))}function aT(r){return new fr("avg",mt("average",r))}function Am(){return new fr("count")}function uT(r,e){var t,n;return r instanceof fr&&e instanceof fr&&r.aggregateType===e.aggregateType&&((t=r._internalFieldPath)==null?void 0:t.canonicalString())===((n=e._internalFieldPath)==null?void 0:n.canonicalString())}function cT(r,e){return vu(r.query,e.query)&&Mt(r.data(),e.data())}/**
 * @license
 * Copyright 2022 Google LLC
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
 */function lT(r){return bm(r,{count:Am()})}function bm(r,e){const t=Q(r.firestore,se),n=de(t),s=ud(e,((i,o)=>new zd(o,i.aggregateType,i._internalFieldPath)));return hE(n,r._query,s).then((i=>(function(u,c,h){const f=new Jt(u);return new Im(c,f,h)})(t,r,i)))}class hT{constructor(e){this.kind="memory",this._onlineComponentProvider=jt.provider,this._offlineComponentProvider=e!=null&&e.garbageCollector?e.garbageCollector._offlineComponentProvider:{build:()=>new Iu(void 0)}}toJSON(){return{kind:this.kind}}}class dT{constructor(e){let t;this.kind="persistent",e!=null&&e.tabManager?(e.tabManager._initialize(e),t=e.tabManager):(t=Rm(void 0),t._initialize(e)),this._onlineComponentProvider=t._onlineComponentProvider,this._offlineComponentProvider=t._offlineComponentProvider}toJSON(){return{kind:this.kind}}}class fT{constructor(){this.kind="memoryEager",this._offlineComponentProvider=hr.provider}toJSON(){return{kind:this.kind}}}class mT{constructor(e){this.kind="memoryLru",this._offlineComponentProvider={build:()=>new Iu(e)}}toJSON(){return{kind:this.kind}}}function gT(){return new fT}function pT(r){return new mT(r==null?void 0:r.cacheSizeBytes)}function _T(r){return new hT(r)}function yT(r){return new dT(r)}class IT{constructor(e){this.forceOwnership=e,this.kind="persistentSingleTab"}toJSON(){return{kind:this.kind}}_initialize(e){this._onlineComponentProvider=jt.provider,this._offlineComponentProvider={build:t=>new Eu(t,e==null?void 0:e.cacheSizeBytes,this.forceOwnership)}}}class ET{constructor(){this.kind="PersistentMultipleTab"}toJSON(){return{kind:this.kind}}_initialize(e){this._onlineComponentProvider=jt.provider,this._offlineComponentProvider={build:t=>new Yf(t,e==null?void 0:e.cacheSizeBytes)}}}function Rm(r){return new IT(r==null?void 0:r.forceOwnership)}function TT(){return new ET}/**
 * @license
 * Copyright 2025 Google LLC
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
 *//**
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
 */const Sm="NOT SUPPORTED";class ut{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class qe extends As{constructor(e,t,n,s,i,o){super(e,t,n,s,o),this._firestore=e,this._firestoreImpl=e,this.metadata=i}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const t=new cs(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){const n=this._document.data.field(mt("DocumentSnapshot.get",e));if(n!==null)return this._userDataWriter.convertValue(n,t.serverTimestamps)}}toJSON(){if(this.metadata.hasPendingWrites)throw new V(R.FAILED_PRECONDITION,"DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e=this._document,t={};return t.type=qe._jsonSchemaVersion,t.bundle="",t.bundleSource="DocumentSnapshot",t.bundleName=this._key.toString(),!e||!e.isValidDocument()||!e.isFoundDocument()?t:(this._userDataWriter.convertObjectMap(e.data.value.mapValue.fields,"previous"),t.bundle=(this._firestore,this.ref.path,"NOT SUPPORTED"),t)}}function wT(r,e,t){if(vn(e,qe._jsonSchema)){if(e.bundle===Sm)throw new V(R.INVALID_ARGUMENT,"The provided JSON object was created in a client environment, which is not supported.");const n=An(r._databaseId),s=rm(e.bundle,n),i=s.Ju(),o=new fu(s.getMetadata(),n);for(const f of i)o.Ha(f);const u=o.documents;if(u.length!==1)throw new V(R.INVALID_ARGUMENT,`Expected bundle data to contain 1 document, but it contains ${u.length} documents.`);const c=Qi(n,u[0].document),h=new k(K.fromString(e.bundleName));return new qe(r,new ku(r),h,c,new ut(!1,!1),t||null)}}qe._jsonSchemaVersion="firestore/documentSnapshot/1.0",qe._jsonSchema={type:ye("string",qe._jsonSchemaVersion),bundleSource:ye("string","DocumentSnapshot"),bundleName:ye("string"),bundle:ye("string")};class cs extends qe{data(e={}){return super.data(e)}}class je{constructor(e,t,n,s){this._firestore=e,this._userDataWriter=t,this._snapshot=s,this.metadata=new ut(s.hasPendingWrites,s.fromCache),this.query=n}get docs(){const e=[];return this.forEach((t=>e.push(t))),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,t){this._snapshot.docs.forEach((n=>{e.call(t,new cs(this._firestore,this._userDataWriter,n.key,n,new ut(this._snapshot.mutatedKeys.has(n.key),this._snapshot.fromCache),this.query.converter))}))}docChanges(e={}){const t=!!e.includeMetadataChanges;if(t&&this._snapshot.excludesMetadataChanges)throw new V(R.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===t||(this._cachedChanges=(function(s,i){if(s._snapshot.oldDocs.isEmpty()){let o=0;return s._snapshot.docChanges.map((u=>{const c=new cs(s._firestore,s._userDataWriter,u.doc.key,u.doc,new ut(s._snapshot.mutatedKeys.has(u.doc.key),s._snapshot.fromCache),s.query.converter);return u.doc,{type:"added",doc:c,oldIndex:-1,newIndex:o++}}))}{let o=s._snapshot.oldDocs;return s._snapshot.docChanges.filter((u=>i||u.type!==3)).map((u=>{const c=new cs(s._firestore,s._userDataWriter,u.doc.key,u.doc,new ut(s._snapshot.mutatedKeys.has(u.doc.key),s._snapshot.fromCache),s.query.converter);let h=-1,f=-1;return u.type!==0&&(h=o.indexOf(u.doc.key),o=o.delete(u.doc.key)),u.type!==1&&(o=o.add(u.doc),f=o.indexOf(u.doc.key)),{type:AT(u.type),doc:c,oldIndex:h,newIndex:f}}))}})(this,t),this._cachedChangesIncludeMetadataChanges=t),this._cachedChanges}toJSON(){if(this.metadata.hasPendingWrites)throw new V(R.FAILED_PRECONDITION,"QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e={};e.type=je._jsonSchemaVersion,e.bundleSource="QuerySnapshot",e.bundleName=Oi.newId(),this._firestore._databaseId.database,this._firestore._databaseId.projectId;const t=[],n=[],s=[];return this.docs.forEach((i=>{i._document!==null&&(t.push(i._document),n.push(this._userDataWriter.convertObjectMap(i._document.data.value.mapValue.fields,"previous")),s.push(i.ref.path))})),e.bundle=(this._firestore,this.query._query,e.bundleName,"NOT SUPPORTED"),e}}function vT(r,e,t){if(vn(e,je._jsonSchema)){if(e.bundle===Sm)throw new V(R.INVALID_ARGUMENT,"The provided JSON object was created in a client environment, which is not supported.");const n=An(r._databaseId),s=rm(e.bundle,n),i=s.Ju(),o=new fu(s.getMetadata(),n);for(const p of i)o.Ha(p);if(o.queries.length!==1)throw new V(R.INVALID_ARGUMENT,`Snapshot data expected 1 query but found ${o.queries.length} queries.`);const u=Hi(o.queries[0].bundledQuery),c=o.documents;let h=new gn;c.map((p=>{const v=Qi(n,p.document);h=h.add(v)}));const f=wn.fromInitialDocuments(u,h,$(),!1,!1),m=new Te(r,t||null,u);return new je(r,new ku(r),m,f)}}function AT(r){switch(r){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return F(61501,{type:r})}}function bT(r,e){return r instanceof qe&&e instanceof qe?r._firestore===e._firestore&&r._key.isEqual(e._key)&&(r._document===null?e._document===null:r._document.isEqual(e._document))&&r._converter===e._converter:r instanceof je&&e instanceof je&&r._firestore===e._firestore&&vu(r.query,e.query)&&r.metadata.isEqual(e.metadata)&&r._snapshot.isEqual(e._snapshot)}/**
 * @license
 * Copyright 2022 Google LLC
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
 */je._jsonSchemaVersion="firestore/querySnapshot/1.0",je._jsonSchema={type:ye("string",je._jsonSchemaVersion),bundleSource:ye("string","QuerySnapshot"),bundleName:ye("string"),bundle:ye("string")};const RT={maxAttempts:5};/**
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
 */class Pm{constructor(e,t){this._firestore=e,this._commitHandler=t,this._mutations=[],this._committed=!1,this._dataReader=Rn(e)}set(e,t,n){this._verifyNotCommitted();const s=Dt(e,this._firestore),i=oo(s.converter,t,n),o=so(this._dataReader,"WriteBatch.set",s._key,i,s.converter!==null,n);return this._mutations.push(o.toMutation(s._key,he.none())),this}update(e,t,n,...s){this._verifyNotCommitted();const i=Dt(e,this._firestore);let o;return o=typeof(t=Ee(t))=="string"||t instanceof bn?Vu(this._dataReader,"WriteBatch.update",i._key,t,n,s):Pu(this._dataReader,"WriteBatch.update",i._key,t),this._mutations.push(o.toMutation(i._key,he.exists(!0))),this}delete(e){this._verifyNotCommitted();const t=Dt(e,this._firestore);return this._mutations=this._mutations.concat(new yr(t._key,he.none())),this}commit(){return this._verifyNotCommitted(),this._committed=!0,this._mutations.length>0?this._commitHandler(this._mutations):Promise.resolve()}_verifyNotCommitted(){if(this._committed)throw new V(R.FAILED_PRECONDITION,"A write batch can no longer be used after commit() has been called.")}}function Dt(r,e){if((r=Ee(r)).firestore!==e)throw new V(R.INVALID_ARGUMENT,"Provided document reference is from a different Firestore instance.");return r}/**
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
 */class ST{constructor(e,t){this._firestore=e,this._transaction=t,this._dataReader=Rn(e)}get(e){const t=Dt(e,this._firestore),n=new ku(this._firestore);return this._transaction.lookup([t._key]).then((s=>{if(!s||s.length!==1)return F(24041);const i=s[0];if(i.isFoundDocument())return new As(this._firestore,n,i.key,i,t.converter);if(i.isNoDocument())return new As(this._firestore,n,t._key,null,t.converter);throw F(18433,{doc:i})}))}set(e,t,n){const s=Dt(e,this._firestore),i=oo(s.converter,t,n),o=so(this._dataReader,"Transaction.set",s._key,i,s.converter!==null,n);return this._transaction.set(s._key,o),this}update(e,t,n,...s){const i=Dt(e,this._firestore);let o;return o=typeof(t=Ee(t))=="string"||t instanceof bn?Vu(this._dataReader,"Transaction.update",i._key,t,n,s):Pu(this._dataReader,"Transaction.update",i._key,t),this._transaction.update(i._key,o),this}delete(e){const t=Dt(e,this._firestore);return this._transaction.delete(t._key),this}}/**
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
 */class Vm extends ST{constructor(e,t){super(e,t),this._firestore=e}get(e){const t=Dt(e,this._firestore),n=new Jt(this._firestore);return super.get(e).then((s=>new qe(this._firestore,n,t._key,s._document,new ut(!1,!1),t.converter)))}}function PT(r,e,t){r=Q(r,se);const n={...RT,...t};(function(o){if(o.maxAttempts<1)throw new V(R.INVALID_ARGUMENT,"Max attempts must be at least 1")})(n);const s=de(r);return mE(s,(i=>e(new Vm(r,i))),n)}/**
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
 */function VT(r){r=Q(r,ne);const e=Q(r.firestore,se),t=de(e);return tm(t,r._key).then((n=>Mu(e,r,n)))}function CT(r){r=Q(r,ne);const e=Q(r.firestore,se),t=de(e),n=new Jt(e);return cE(t,r._key).then((s=>new qe(e,n,r._key,s,new ut(s!==null&&s.hasLocalMutations,!0),r.converter)))}function DT(r){r=Q(r,ne);const e=Q(r.firestore,se),t=de(e);return tm(t,r._key,{source:"server"}).then((n=>Mu(e,r,n)))}function xT(r){r=Q(r,Te);const e=Q(r.firestore,se),t=de(e),n=new Jt(e);return Em(r._query),nm(t,r._query).then((s=>new je(e,n,r,s)))}function NT(r){r=Q(r,Te);const e=Q(r.firestore,se),t=de(e),n=new Jt(e);return lE(t,r._query).then((s=>new je(e,n,r,s)))}function kT(r){r=Q(r,Te);const e=Q(r.firestore,se),t=de(e),n=new Jt(e);return nm(t,r._query,{source:"server"}).then((s=>new je(e,n,r,s)))}function MT(r,e,t){r=Q(r,ne);const n=Q(r.firestore,se),s=oo(r.converter,e,t),i=Rn(n);return Sr(n,[so(i,"setDoc",r._key,s,r.converter!==null,t).toMutation(r._key,he.none())])}function OT(r,e,t,...n){r=Q(r,ne);const s=Q(r.firestore,se),i=Rn(s);let o;return o=typeof(e=Ee(e))=="string"||e instanceof bn?Vu(i,"updateDoc",r._key,e,t,n):Pu(i,"updateDoc",r._key,e),Sr(s,[o.toMutation(r._key,he.exists(!0))])}function FT(r){return Sr(Q(r.firestore,se),[new yr(r._key,he.none())])}function LT(r,e){const t=Q(r.firestore,se),n=am(r),s=oo(r.converter,e),i=Rn(r.firestore);return Sr(t,[so(i,"addDoc",n._key,s,r.converter!==null,{}).toMutation(n._key,he.exists(!1))]).then((()=>n))}function ba(r,...e){var h,f,m;r=Ee(r);let t={includeMetadataChanges:!1,source:"default"},n=0;typeof e[n]!="object"||Gn(e[n])||(t=e[n++]);const s={includeMetadataChanges:t.includeMetadataChanges,source:t.source};if(Gn(e[n])){const p=e[n];e[n]=(h=p.next)==null?void 0:h.bind(p),e[n+1]=(f=p.error)==null?void 0:f.bind(p),e[n+2]=(m=p.complete)==null?void 0:m.bind(p)}let i,o,u;if(r instanceof ne)o=Q(r.firestore,se),u=pr(r._key.path),i={next:p=>{e[n]&&e[n](Mu(o,r,p))},error:e[n+1],complete:e[n+2]};else{const p=Q(r,Te);o=Q(p.firestore,se),u=p._query;const v=new Jt(o);i={next:C=>{e[n]&&e[n](new je(o,v,p,C))},error:e[n+1],complete:e[n+2]},Em(r._query)}const c=de(o);return uE(c,u,s,i)}function BT(r,e,...t){const n=Ee(r),s=(function(c){const h={bundle:"",bundleName:"",bundleSource:""},f=["bundle","bundleName","bundleSource"];for(const m of f){if(!(m in c)){h.error=`snapshotJson missing required field: ${m}`;break}const p=c[m];if(typeof p!="string"){h.error=`snapshotJson field '${m}' must be a string.`;break}if(p.length===0){h.error=`snapshotJson field '${m}' cannot be an empty string.`;break}m==="bundle"?h.bundle=p:m==="bundleName"?h.bundleName=p:m==="bundleSource"&&(h.bundleSource=p)}return h})(e);if(s.error)throw new V(R.INVALID_ARGUMENT,s.error);let i,o=0;if(typeof t[o]!="object"||Gn(t[o])||(i=t[o++]),s.bundleSource==="QuerySnapshot"){let u=null;if(typeof t[o]=="object"&&Gn(t[o])){const c=t[o++];u={next:c.next,error:c.error,complete:c.complete}}else u={next:t[o++],error:t[o++],complete:t[o++]};return(function(h,f,m,p,v){let C,N=!1;return Aa(h,f.bundle).then((()=>hm(h,f.bundleName))).then((B=>{B&&!N&&(v&&B.withConverter(v),C=ba(B,m||{},p))})).catch((B=>(p.error&&p.error(B),()=>{}))),()=>{N||(N=!0,C&&C())}})(n,s,i,u,t[o])}if(s.bundleSource==="DocumentSnapshot"){let u=null;if(typeof t[o]=="object"&&Gn(t[o])){const c=t[o++];u={next:c.next,error:c.error,complete:c.complete}}else u={next:t[o++],error:t[o++],complete:t[o++]};return(function(h,f,m,p,v){let C,N=!1;return Aa(h,f.bundle).then((()=>{if(!N){const B=new ne(h,v||null,k.fromPath(f.bundleName));C=ba(B,m||{},p)}})).catch((B=>(p.error&&p.error(B),()=>{}))),()=>{N||(N=!0,C&&C())}})(n,s,i,u,t[o])}throw new V(R.INVALID_ARGUMENT,`unsupported bundle source: ${s.bundleSource}`)}function UT(r,e){r=Q(r,se);const t=de(r),n=Gn(e)?e:{next:e};return fE(t,n)}function Sr(r,e){const t=de(r);return dE(t,e)}function Mu(r,e,t){const n=t.docs.get(e._key),s=new Jt(r);return new qe(r,s,e._key,n,new ut(t.hasPendingWrites,t.fromCache),e.converter)}function qT(r){return r=Q(r,se),de(r),new Pm(r,(e=>Sr(r,e)))}/**
 * @license
 * Copyright 2021 Google LLC
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
 */function jT(r,e){r=Q(r,se);const t=de(r);if(!t._uninitializedComponentsProvider||t._uninitializedComponentsProvider._offline.kind==="memory")return ze("Cannot enable indexes when persistence is disabled"),Promise.resolve();const n=(function(i){const o=typeof i=="string"?(function(h){try{return JSON.parse(h)}catch(f){throw new V(R.INVALID_ARGUMENT,"Failed to parse JSON: "+(f==null?void 0:f.message))}})(i):i,u=[];if(Array.isArray(o.indexes))for(const c of o.indexes){const h=ph(c,"collectionGroup"),f=[];if(Array.isArray(c.fields))for(const m of c.fields){const p=ph(m,"fieldPath"),v=Du("setIndexConfiguration",p);m.arrayConfig==="CONTAINS"?f.push(new fn(v,2)):m.order==="ASCENDING"?f.push(new fn(v,0)):m.order==="DESCENDING"&&f.push(new fn(v,1))}u.push(new Hn(Hn.UNKNOWN_ID,h,f,Jn.empty()))}return u})(e);return _E(t,n)}function ph(r,e){if(typeof r[e]!="string")throw new V(R.INVALID_ARGUMENT,"Missing string value for: "+e);return r[e]}/**
 * @license
 * Copyright 2023 Google LLC
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
 */class Cm{constructor(e){this._firestore=e,this.type="PersistentCacheIndexManager"}}function zT(r){var s;r=Q(r,se);const e=_h.get(r);if(e)return e;if(((s=de(r)._uninitializedComponentsProvider)==null?void 0:s._offline.kind)!=="persistent")return null;const n=new Cm(r);return _h.set(r,n),n}function $T(r){Dm(r,!0)}function GT(r){Dm(r,!1)}function KT(r){const e=de(r._firestore);IE(e).then((t=>x("deleting all persistent cache indexes succeeded"))).catch((t=>ze("deleting all persistent cache indexes failed",t)))}function Dm(r,e){const t=de(r._firestore);yE(t,e).then((n=>x(`setting persistent cache index auto creation isEnabled=${e} succeeded`))).catch((n=>ze(`setting persistent cache index auto creation isEnabled=${e} failed`,n)))}const _h=new WeakMap;/**
 * @license
 * Copyright 2023 Google LLC
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
 */class QT{constructor(){throw new Error("instances of this class should not be created")}static onExistenceFilterMismatch(e){return Ou.instance.onExistenceFilterMismatch(e)}}class Ou{constructor(){this.t=new Map}static get instance(){return oi||(oi=new Ou,ly(oi)),oi}o(e){this.t.forEach((t=>t(e)))}onExistenceFilterMismatch(e){const t=Symbol(),n=this.t;return n.set(t,e),()=>n.delete(t)}}let oi=null;(function(e,t=!0){zp(Pp),Ii(new ls("firestore",((n,{instanceIdentifier:s,options:i})=>{const o=n.getProvider("app").getImmediate(),u=new se(new Qp(n.getProvider("auth-internal")),new Jp(o,n.getProvider("app-check-internal")),F_(o,s),o);return i={useFetchStreams:t,...i},u._setSettings(i),u}),"PUBLIC").setMultipleInstances(!0)),jn(dh,fh,e),jn(dh,fh,"esm2020")})();const lw=Object.freeze(Object.defineProperty({__proto__:null,AbstractUserDataWriter:xu,AggregateField:fr,AggregateQuerySnapshot:Im,Bytes:Fe,CACHE_SIZE_UNLIMITED:bE,CollectionReference:He,DocumentReference:ne,DocumentSnapshot:qe,FieldPath:bn,FieldValue:Ht,Firestore:se,FirestoreError:V,GeoPoint:Je,LoadBundleTask:um,PersistentCacheIndexManager:Cm,Query:Te,QueryCompositeFilterConstraint:Pn,QueryConstraint:br,QueryDocumentSnapshot:cs,QueryEndAtConstraint:Fs,QueryFieldFilterConstraint:Rr,QueryLimitConstraint:Ms,QueryOrderByConstraint:io,QuerySnapshot:je,QueryStartAtConstraint:Os,SnapshotMetadata:ut,Timestamp:ee,Transaction:Vm,VectorValue:Ke,WriteBatch:Pm,_AutoId:Oi,_ByteString:fe,_DatabaseId:Ft,_DocumentKey:k,_EmptyAppCheckTokenProvider:Yp,_EmptyAuthCredentialsProvider:qh,_FieldPath:ce,_TestingHooks:QT,_cast:Q,_debugAssert:Gp,_internalAggregationQueryToProtoRunAggregationQueryRequest:QE,_internalQueryToProtoQueryTarget:KE,_isBase64Available:k_,_logWarn:ze,_validateIsNotUsedTogether:zh,addDoc:LT,aggregateFieldEqual:uT,aggregateQuerySnapshotEqual:cT,and:XE,arrayRemove:zE,arrayUnion:jE,average:aT,clearIndexedDbPersistence:CE,collection:wE,collectionGroup:vE,connectFirestoreEmulator:om,count:Am,deleteAllPersistentCacheIndexes:KT,deleteDoc:FT,deleteField:UE,disableNetwork:NE,disablePersistentCacheIndexAutoCreation:GT,doc:am,documentId:ME,documentSnapshotFromJSON:wT,enableIndexedDbPersistence:PE,enableMultiTabIndexedDbPersistence:VE,enableNetwork:xE,enablePersistentCacheIndexAutoCreation:$T,endAt:iT,endBefore:sT,ensureFirestoreConfigured:de,executeWrite:Sr,getAggregateFromServer:bm,getCountFromServer:lT,getDoc:VT,getDocFromCache:CT,getDocFromServer:DT,getDocs:xT,getDocsFromCache:NT,getDocsFromServer:kT,getFirestore:SE,getPersistentCacheIndexManager:zT,increment:$E,initializeFirestore:RE,limit:eT,limitToLast:tT,loadBundle:Aa,memoryEagerGarbageCollector:gT,memoryLocalCache:_T,memoryLruGarbageCollector:pT,namedQuery:hm,onSnapshot:ba,onSnapshotResume:BT,onSnapshotsInSync:UT,or:YE,orderBy:ZE,persistentLocalCache:yT,persistentMultipleTabManager:TT,persistentSingleTabManager:Rm,query:HE,queryEqual:vu,querySnapshotFromJSON:vT,refEqual:AE,runTransaction:PT,serverTimestamp:qE,setDoc:MT,setIndexConfiguration:jT,setLogLevel:$p,snapshotEqual:bT,startAfter:rT,startAt:nT,sum:oT,terminate:kE,updateDoc:OT,vector:GE,waitForPendingWrites:DE,where:JE,writeBatch:qT},Symbol.toStringTag,{value:"Module"}));export{ew as $,aw as A,Vp as B,ls as C,ba as D,Rh as E,mr as F,am as G,VT as H,xT as I,HE as J,wE as K,Ph as L,ZE as M,eT as N,MT as O,OT as P,FT as Q,JE as R,Pp as S,lT as T,PT as U,LT as V,$g as W,ow as X,wg as Y,bh as Z,Ii as _,XT as a,lw as a0,YT as b,bp as c,Ee as d,iw as e,X as f,WT as g,Kn as h,HT as i,mg as j,Ra as k,Pa as l,yg as m,Cp as n,Mt as o,Sh as p,nw as q,jn as r,rw as s,sw as t,ZT as u,tw as v,JT as w,Ig as x,Tg as y,SE as z};
