(this["webpackJsonprn-version-tracker"]=this["webpackJsonprn-version-tracker"]||[]).push([[2],{12:function(e,t,a){e.exports={app:"NavBar_app__2XT7W",contentContainer:"NavBar_contentContainer__3ZWmM",cardContainer:"NavBar_cardContainer__34cc2",nav:"NavBar_nav__3RKQP",scrolledAwayNav:"NavBar_scrolledAwayNav__3yG3z",navContent:"NavBar_navContent__27A_4",reactLogo:"NavBar_reactLogo__Yl33H",buttonRegion:"NavBar_buttonRegion__2UtT9",brightnessIconButton:"NavBar_brightnessIconButton__2higa",gitHubIconButton:"NavBar_gitHubIconButton__3BNyh",gitHubTextButton:"NavBar_gitHubTextButton__baZ16",brightnessIcon:"NavBar_brightnessIcon__2Kqk-",gitHubLogo:"NavBar_gitHubLogo__3Q_zp",mobileHeader:"NavBar_mobileHeader__2Ly24",mobileHeaderContent:"NavBar_mobileHeaderContent__IDHMs",mobileBrand:"NavBar_mobileBrand__r7wJS",brand:"NavBar_brand__1fibI"}},13:function(e,t,a){e.exports={cardFrame:"PackageCard_cardFrame__-F882",silhouette:"PackageCard_silhouette__2XR_w",shimmerRoot:"PackageCard_shimmerRoot__22ayQ",contentWrapper:"PackageCard_contentWrapper__1zz4p",disabledContentWrapper:"PackageCard_disabledContentWrapper__1CkAn",cardContent:"PackageCard_cardContent__2_TDD",headerLeft:"PackageCard_headerLeft__2JklH",header:"PackageCard_header__1ty5D",headerText:"PackageCard_headerText__3ysMZ",packageName:"PackageCard_packageName__2ftYU",headerControls:"PackageCard_headerControls__kcvrx",chartContainer:"PackageCard_chartContainer__39ifi",innerChartContainer:"PackageCard_innerChartContainer__Gj1VI","ms-motion-fadeIn":"PackageCard_ms-motion-fadeIn__1m_mO","ms-motion-fadeOut":"PackageCard_ms-motion-fadeOut__36jiw","ms-motion-scaleDownIn":"PackageCard_ms-motion-scaleDownIn__22x2o","ms-motion-scaleDownOut":"PackageCard_ms-motion-scaleDownOut__28DVF","ms-motion-slideLeftOut":"PackageCard_ms-motion-slideLeftOut__2mheK","ms-motion-slideRightOut":"PackageCard_ms-motion-slideRightOut__1ZMms","ms-motion-slideLeftIn":"PackageCard_ms-motion-slideLeftIn__3BNJN","ms-motion-slideRightIn":"PackageCard_ms-motion-slideRightIn__DvECY","ms-motion-slideUpOut":"PackageCard_ms-motion-slideUpOut__nP5Gz","ms-motion-slideDownOut":"PackageCard_ms-motion-slideDownOut__24abG","ms-motion-slideUpIn":"PackageCard_ms-motion-slideUpIn__gNucZ","ms-motion-slideDownIn":"PackageCard_ms-motion-slideDownIn__3MVtc"}},169:function(e,t,a){"use strict";a.r(t);var r=a(33),n=a(32),i=a(57),c=a(14),o=a(36),s=a(94),l=a(95),u=a(43),d=a.n(u),h=a(71);function m(e){if("0.0"===e)return"nightly";var t=e.match(Object(h.a)(/^0\.0\.0\x2D([0-9a-f]{1,7})[0-9a-f]*$/,{hash:1}));return t?"nightly@".concat(t.groups.hash):e}var b=function(e){return d.a.lt(e,"0.0.0")},f=function(e,t){return d.a.gte(e,"".concat(t,".0"),{includePrerelease:!0})},v={"react-native":{friendlyName:"React Native",versionFilter:function(e){return f(e,"0.63")||b(e)},versionLabeler:function(e){if("0.0"===e)return"nightly";var t=e.match(Object(h.a)(/^0\.0\.0\x2D([0-9]{4})([0-9]{2})([0-9]{2})\x2D[0-9]{4}\x2D[0-9a-f]+$/,{year:1,month:2,day:3}));if(t){var a=parseInt(t.groups.year,10),r=parseInt(t.groups.month,10),n=parseInt(t.groups.day,10),i=new Date(a,r-1,n);return"nightly@".concat(i.toLocaleDateString("en-US",{day:"2-digit",month:"2-digit"}))}return e}},"@types/react-native":{friendlyName:"DefinitelyTyped Typings",versionFilter:function(e){return f(e,"0.63")}},"react-native-windows":{friendlyName:"React Native Windows",versionFilter:function(e){return(f(e,"0.63")||b(e))&&"1.0.0"!==e},versionLabeler:function(e){if("0.0"===e)return"canary";var t=e.match(Object(h.a)(/^0\.0\.0\x2D(canary.[0-9]+)$/,{canary:1}));return t?t.groups.canary:e}},"react-native-macos":{friendlyName:"React Native macOS",versionFilter:function(e){return f(e,"0.63")||b(e)},versionLabeler:m},"react-native-web":{friendlyName:"React Native Web",versionFilter:function(e){return f(e,"0.11")||b(e)},versionLabeler:m}},j=function(){function e(t){Object(s.a)(this,e),this.pointCollection=void 0,this.majorDatePoints=null,this.prereleaseDatePoints=null;var a,r={versions:t.versions,points:[]},n=Object(o.a)(t.points);try{for(n.s();!(a=n.n()).done;){for(var i=a.value,l={date:t.epoch+1e3*i.date,versionCounts:{}},u=0,d=Object.entries(i.versionCounts);u<d.length;u++){var h=Object(c.a)(d[u],2),m=h[0],b=h[1];l.versionCounts[t.versions[parseInt(m,10)]]=b}r.points.push(l)}}catch(f){n.e(f)}finally{n.f()}this.pointCollection=r}return Object(l.a)(e,[{key:"getMajorDatePoints",value:function(){return this.majorDatePoints||(this.majorDatePoints=this.accumulateDatePoints({versionMapper:this.mapToMajor})),this.majorDatePoints}},{key:"mapToMajor",value:function(e){var t=d.a.parse(e);return 0===t.major?"0.".concat(t.minor):"".concat(t.major,".0")}},{key:"getPatchDatePoints",value:function(){return this.pointCollection}},{key:"getPrereleaseDataPoints",value:function(){return this.prereleaseDatePoints||(this.prereleaseDatePoints=this.accumulateDatePoints({versionFilter:function(e){return!!d.a.prerelease(e)}})),this.prereleaseDatePoints}},{key:"getDatePoints",value:function(e){switch(e){case"major":return this.getMajorDatePoints();case"patch":return this.getPatchDatePoints();case"prerelease":return this.getPrereleaseDataPoints()}}},{key:"accumulateDatePoints",value:function(e){var t=Object(i.a)(this.pointCollection.versions),a=function(e){var t,a=[],r=Object(o.a)(e);try{for(r.s();!(t=r.n()).done;)for(var n=t.value,i=0,s=Object.entries(n.versionCounts);i<s.length;i++){var l=Object(c.a)(s[i],2),u=l[0],d=l[1];a.push({date:n.date,version:u,count:d})}}catch(h){r.e(h)}finally{r.f()}return a}(this.pointCollection.points);if((null===e||void 0===e?void 0:e.versionFilter)&&(t=t.filter(e.versionFilter),a=a.filter((function(t){return e.versionFilter(t.version)}))),null===e||void 0===e?void 0:e.versionMapper){var r,s={},l=Object(o.a)(t);try{for(l.s();!(r=l.n()).done;){var u=r.value;s[u]=e.versionMapper(u)}}catch(C){l.e(C)}finally{l.f()}t=Object(i.a)(new Set(Object.values(s)));var d,h={},m=Object(o.a)(a);try{for(m.s();!(d=m.n()).done;){var b,f=d.value,v=s[f.version],j=null!==(b=h[v])&&void 0!==b?b:[];h[v]=j;for(var _=!1,p=j.length-1;p>=0;p--){if(j[p].date===f.date){_=!0,j[p].count+=f.count;break}if(j[p].date<f.date)break}_||j.push({date:f.date,count:f.count})}}catch(C){m.e(C)}finally{m.f()}a=[];for(var O=function(){var e,t=Object(c.a)(k[y],2),r=t[0],o=t[1].sort((function(e,t){return e.date-t.date}));(e=a).push.apply(e,Object(i.a)(o.map((function(e){return Object(n.a)(Object(n.a)({},e),{},{version:r})}))))},y=0,k=Object.entries(h);y<k.length;y++)O()}return{versions:t,points:g(a)}}}],[{key:"prefetch",value:function(){for(var t=0,a=Object.keys(v);t<a.length;t++){var r=a[t];this.historyImports[r]||(this.historyImports[r]=e.loadHistoryFile(r))}}},{key:"get",value:function(t){e.historyImports[t]||(e.historyImports[t]=e.loadHistoryFile(t));var a=e.lastAcquisition.then((function(){return e.historyImports[t]})).then((function(t){return new e(t)}));return this.lastAcquisition=a,a}},{key:"loadHistoryFile",value:function(e){switch(e){case"@types/react-native":return a.e(0).then(a.t.bind(null,531,3));case"react-native":return a.e(3).then(a.t.bind(null,532,3));case"react-native-macos":return a.e(4).then(a.t.bind(null,533,3));case"react-native-web":return a.e(5).then(a.t.bind(null,534,3));case"react-native-windows":return a.e(6).then(a.t.bind(null,535,3))}}}]),e}();function g(e){var t,a=[],n=Object(o.a)(e);try{var i=function(){var e=t.value,n=a.find((function(t){return t.date===e.date}));n?n.versionCounts[e.version]=e.count:a.push({date:e.date,versionCounts:Object(r.a)({},e.version,e.count)})};for(n.s();!(t=n.n()).done;)i()}catch(c){n.e(c)}finally{n.f()}return a}j.historyImports={},j.lastAcquisition=Promise.resolve();var _=a(0),p=a.n(_),O=a(47),y=a.n(O),k=a(69),C=a.n(k),x=a(13),N=a.n(x),P=a(227),D=a(225),w=a(232),L=a(223),I=a(226),A=a(219),B=a(35),T=Object(B.a)({isInverted:!0,palette:{themePrimary:"#79bdbc",themeLighterAlt:"#050808",themeLighter:"#131e1e",themeLight:"#243938",themeTertiary:"#487171",themeSecondary:"#6aa6a5",themeDarkAlt:"#84c3c2",themeDark:"#95cdcc",themeDarker:"#aedad9",neutralLighterAlt:"#000000",neutralLighter:"#000000",neutralLight:"#000000",neutralQuaternaryAlt:"#000000",neutralQuaternary:"#000000",neutralTertiaryAlt:"#000000",neutralTertiary:"#fafafa",neutralSecondary:"#fbfbfb",neutralPrimaryAlt:"#fcfcfc",neutralPrimary:"#f8f8f8",neutralDark:"#fdfdfd",black:"#fefefe",white:"#000000"}}),M=Object(B.a)({isInverted:!0,palette:{themePrimary:"#79bdbc",themeLighterAlt:"#f9fcfc",themeLighter:"#e6f4f4",themeLight:"#d2ebeb",themeTertiary:"#a9d7d6",themeSecondary:"#86c5c4",themeDarkAlt:"#6daaa9",themeDark:"#5c8f8f",themeDarker:"#446a69",neutralLighterAlt:"#302e2d",neutralLighter:"#383735",neutralLight:"#464443",neutralQuaternaryAlt:"#4e4d4b",neutralQuaternary:"#555352",neutralTertiaryAlt:"#72706e",neutralTertiary:"#c8c8c8",neutralSecondary:"#d0d0d0",neutralPrimaryAlt:"#dadada",neutralPrimary:"#ffffff",neutralDark:"#f4f4f4",black:"#f8f8f8",white:"#252423"}}),S=Object(B.a)({palette:{themePrimary:"#43706f",themeLighterAlt:"#f5f9f9",themeLighter:"#d9e8e8",themeLight:"#bbd4d4",themeTertiary:"#81a9a9",themeSecondary:"#548181",themeDarkAlt:"#3d6564",themeDark:"#335555",themeDarker:"#263f3e",neutralLighterAlt:"#e7e4e2",neutralLighter:"#e3e1de",neutralLight:"#dad8d5",neutralQuaternaryAlt:"#cbc9c7",neutralQuaternary:"#c2c0be",neutralTertiaryAlt:"#bab8b6",neutralTertiary:"#a19f9d",neutralSecondary:"#605e5c",neutralPrimaryAlt:"#3b3a39",neutralPrimary:"#323130",neutralDark:"#201f1e",black:"#000000",white:"#edebe9"}}),R=Object(B.a)({palette:{themePrimary:"#467877",themeLighterAlt:"#f5fafa",themeLighter:"#dae9e9",themeLight:"#bbd6d6",themeTertiary:"#82aead",themeSecondary:"#568887",themeDarkAlt:"#3f6c6b",themeDark:"#355b5a",themeDarker:"#274343",neutralLighterAlt:"#faf9f8",neutralLighter:"#f3f2f1",neutralLight:"#edebe9",neutralQuaternaryAlt:"#e1dfdd",neutralQuaternary:"#d0d0d0",neutralTertiaryAlt:"#c8c6c4",neutralTertiary:"#a19f9d",neutralSecondary:"#605e5c",neutralPrimaryAlt:"#3b3a39",neutralPrimary:"#323130",neutralDark:"#201f1e",black:"#000000",white:"#ffffff"}});var F,H=a(3),z=Promise.all([a.e(8),a.e(1)]).then(a.bind(null,544));function Q(e){switch(e){case"major":return 84;case"patch":return 28;case"prerelease":return 14}}z.then((function(e){return F=e.default}));var W=function(e){var t=e.theme,a=e.disabled,r=e.children;return Object(H.jsx)(I.a,{className:a?"".concat(N.a.cardFrame," ").concat(N.a.disabledCardFrame):N.a.cardFrame,theme:t,children:Object(H.jsx)("div",{className:a?"".concat(N.a.contentWrapper," ").concat(N.a.disabledContentWrapper):N.a.contentWrapper,children:Object(H.jsx)("div",{className:N.a.cardContent,children:r})})})},V=function(e){var t=e.identifier,a=e.versionFilter,i=e.theme,o=e.tooltipTheme,s=Object(_.useState)(a),l=Object(c.a)(s,2),u=l[0],d=l[1],h=Object(_.useState)(!1),m=Object(c.a)(h,2),b=m[0],f=m[1];Object(_.useEffect)((function(){a!==u&&(f(!1),d(a))}),[a,u]);var g=function(){var e=Object(_.useState)(void 0!==F),t=Object(c.a)(e,2),a=t[0],r=t[1];return Object(_.useEffect)((function(){a||z.then((function(){return r(!0)}))})),F}(),p=function(e,t){var a=Object(_.useState)({}),i=Object(c.a)(a,2),o=i[0],s=i[1],l=Object(_.useState)({}),u=Object(c.a)(l,2),d=u[0],h=u[1];return Object(_.useEffect)((function(){if(!o[e]){var t=j.get(e).then((function(t){return h(Object(n.a)(Object(n.a)({},d),{},Object(r.a)({},e,t))),t}));s(Object(n.a)(Object(n.a)({},s),{},Object(r.a)({},e,t)))}}),[o,e,d]),Object(_.useMemo)((function(){var a;return null===(a=d[e])||void 0===a?void 0:a.getDatePoints(t)}),[d,e,t])}(t,a),O=v[t],y=void 0!==p&&void 0!==g;return Object(H.jsxs)(W,{theme:null!==i&&void 0!==i?i:S,disabled:0===(null===p||void 0===p?void 0:p.points.length),children:[Object(H.jsxs)("div",{className:N.a.header,children:[Object(H.jsx)("div",{className:N.a.headerLeft}),Object(H.jsxs)("div",{className:N.a.headerText,children:[Object(H.jsx)(P.a,{variant:"large",className:N.a.packageName,children:O.friendlyName}),Object(H.jsx)(P.a,{variant:"medium",children:"(Downloads/Week)"})]}),Object(H.jsx)("div",{className:N.a.headerControls,children:Object(H.jsx)(D.a,{content:"Show as percentage",theme:o,children:Object(H.jsx)(w.a,{toggle:!0,"aria-label":"Show as percentage",disabled:!p||0===p.points.length,onRenderIcon:function(){return Object(H.jsx)(A.a,{})},checked:b,onClick:function(){return f(!b)}})})})]}),Object(H.jsxs)("div",{className:N.a.chartContainer,children:[Object(H.jsx)("div",{className:N.a.silhouette,children:Object(H.jsx)("div",{className:N.a.shimmerRoot,children:new Array(10).fill(null).map((function(e,t){return Object(H.jsx)(L.a,{isDataLoaded:y},t)}))})}),y&&Object(H.jsx)("div",{className:N.a.innerChartContainer,children:Object(H.jsx)(g,{history:p,maxDaysShown:Q(a),maxVersionsShown:6,maxTicks:4,unit:b?"percentage":"totalDownloads",versionLabeler:O.versionLabeler,theme:i,tooltipTheme:o})})]})]})},E=a(12),U=a.n(E),K=a(224),q=a(108),J=a(228),Z=a(234),G=a(220),Y=a(221),$=a(42),X=Object($.a)({displayName:"ReactLogoIcon",svg:function(e){var t=e.classes;return Object(H.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"120 2 600 600",className:t.svg,children:Object(H.jsxs)("g",{fill:"#61DAFB",children:[Object(H.jsx)("path",{d:"M666.3 296.5c0-32.5-40.7-63.3-103.1-82.4 14.4-63.6 8-114.2-20.2-130.4-6.5-3.8-14.1-5.6-22.4-5.6v22.3c4.6 0 8.3.9 11.4 2.6 13.6 7.8 19.5 37.5 14.9 75.7-1.1 9.4-2.9 19.3-5.1 29.4-19.6-4.8-41-8.5-63.5-10.9-13.5-18.5-27.5-35.3-41.6-50 32.6-30.3 63.2-46.9 84-46.9V78c-27.5 0-63.5 19.6-99.9 53.6-36.4-33.8-72.4-53.2-99.9-53.2v22.3c20.7 0 51.4 16.5 84 46.6-14 14.7-28 31.4-41.3 49.9-22.6 2.4-44 6.1-63.6 11-2.3-10-4-19.7-5.2-29-4.7-38.2 1.1-67.9 14.6-75.8 3-1.8 6.9-2.6 11.5-2.6V78.5c-8.4 0-16 1.8-22.6 5.6-28.1 16.2-34.4 66.7-19.9 130.1-62.2 19.2-102.7 49.9-102.7 82.3 0 32.5 40.7 63.3 103.1 82.4-14.4 63.6-8 114.2 20.2 130.4 6.5 3.8 14.1 5.6 22.5 5.6 27.5 0 63.5-19.6 99.9-53.6 36.4 33.8 72.4 53.2 99.9 53.2 8.4 0 16-1.8 22.6-5.6 28.1-16.2 34.4-66.7 19.9-130.1 62-19.1 102.5-49.9 102.5-82.3zm-130.2-66.7c-3.7 12.9-8.3 26.2-13.5 39.5-4.1-8-8.4-16-13.1-24-4.6-8-9.5-15.8-14.4-23.4 14.2 2.1 27.9 4.7 41 7.9zm-45.8 106.5c-7.8 13.5-15.8 26.3-24.1 38.2-14.9 1.3-30 2-45.2 2-15.1 0-30.2-.7-45-1.9-8.3-11.9-16.4-24.6-24.2-38-7.6-13.1-14.5-26.4-20.8-39.8 6.2-13.4 13.2-26.8 20.7-39.9 7.8-13.5 15.8-26.3 24.1-38.2 14.9-1.3 30-2 45.2-2 15.1 0 30.2.7 45 1.9 8.3 11.9 16.4 24.6 24.2 38 7.6 13.1 14.5 26.4 20.8 39.8-6.3 13.4-13.2 26.8-20.7 39.9zm32.3-13c5.4 13.4 10 26.8 13.8 39.8-13.1 3.2-26.9 5.9-41.2 8 4.9-7.7 9.8-15.6 14.4-23.7 4.6-8 8.9-16.1 13-24.1zM421.2 430c-9.3-9.6-18.6-20.3-27.8-32 9 .4 18.2.7 27.5.7 9.4 0 18.7-.2 27.8-.7-9 11.7-18.3 22.4-27.5 32zm-74.4-58.9c-14.2-2.1-27.9-4.7-41-7.9 3.7-12.9 8.3-26.2 13.5-39.5 4.1 8 8.4 16 13.1 24 4.7 8 9.5 15.8 14.4 23.4zM420.7 163c9.3 9.6 18.6 20.3 27.8 32-9-.4-18.2-.7-27.5-.7-9.4 0-18.7.2-27.8.7 9-11.7 18.3-22.4 27.5-32zm-74 58.9c-4.9 7.7-9.8 15.6-14.4 23.7-4.6 8-8.9 16-13 24-5.4-13.4-10-26.8-13.8-39.8 13.1-3.1 26.9-5.8 41.2-7.9zm-90.5 125.2c-35.4-15.1-58.3-34.9-58.3-50.6 0-15.7 22.9-35.6 58.3-50.6 8.6-3.7 18-7 27.7-10.1 5.7 19.6 13.2 40 22.5 60.9-9.2 20.8-16.6 41.1-22.2 60.6-9.9-3.1-19.3-6.5-28-10.2zM310 490c-13.6-7.8-19.5-37.5-14.9-75.7 1.1-9.4 2.9-19.3 5.1-29.4 19.6 4.8 41 8.5 63.5 10.9 13.5 18.5 27.5 35.3 41.6 50-32.6 30.3-63.2 46.9-84 46.9-4.5-.1-8.3-1-11.3-2.7zm237.2-76.2c4.7 38.2-1.1 67.9-14.6 75.8-3 1.8-6.9 2.6-11.5 2.6-20.7 0-51.4-16.5-84-46.6 14-14.7 28-31.4 41.3-49.9 22.6-2.4 44-6.1 63.6-11 2.3 10.1 4.1 19.8 5.2 29.1zm38.5-66.7c-8.6 3.7-18 7-27.7 10.1-5.7-19.6-13.2-40-22.5-60.9 9.2-20.8 16.6-41.1 22.2-60.6 9.9 3.1 19.3 6.5 28.1 10.2 35.4 15.1 58.3 34.9 58.3 50.6-.1 15.7-23 35.6-58.4 50.6zM320.8 78.4z"}),Object(H.jsx)("circle",{cx:"420.9",cy:"296.5",r:"45.7"}),Object(H.jsx)("path",{d:"M520.5 78.1z"})]})})}}),ee=function(e){var t=e.className;return Object(H.jsxs)("div",{className:t,children:[Object(H.jsx)(X,{className:U.a.reactLogo}),Object(H.jsx)(P.a,{variant:"large",children:"React Native Versions"})]})},te=function(e){var t,a,r=null!==(t=e.theme)&&void 0!==t?t:M,n={backgroundColor:(null!==(a=e.theme)&&void 0!==a?a:M).semanticColors.bodyBackground},i=Object(_.useState)(!1),o=Object(c.a)(i,2),s=o[0],l=o[1],u=Object(_.useRef)(null);return Object(_.useEffect)((function(){var e=new IntersectionObserver((function(e){return e.forEach((function(e){return l(e.intersectionRatio<1)}))}),{rootMargin:"10px"});return e.observe(u.current),function(){return e.disconnect()}})),Object(H.jsxs)(H.Fragment,{children:[Object(H.jsx)(I.a,{className:U.a.mobileHeader,theme:r,style:n,children:Object(H.jsx)("div",{className:U.a.mobileHeaderContent,children:Object(H.jsx)(ee,{className:U.a.mobileBrand})})}),Object(H.jsx)("div",{ref:u}),Object(H.jsx)(I.a,{className:s?"".concat(U.a.nav," ").concat(U.a.scrolledAwayNav):U.a.nav,theme:r,style:n,children:Object(H.jsxs)("div",{className:U.a.navContent,children:[Object(H.jsx)(ee,{className:U.a.brand}),Object(H.jsx)(K.a,{headersOnly:!0,className:U.a.pivot,onLinkClick:function(t){window.scrollTo({left:0,top:0,behavior:"smooth"}),e.onItemSelected&&e.onItemSelected(t.props.itemKey)},children:e.items.map((function(e){return Object(H.jsx)(q.a,{headerText:e.label,itemKey:e.key},e.key)}))}),Object(H.jsxs)("div",{className:U.a.buttonRegion,children:[Object(H.jsx)(D.a,{content:"Toggle dark mode",children:Object(H.jsx)(w.a,{toggle:!0,checked:e.darkMode,onClick:function(){return e.onToggleDarkMode&&e.onToggleDarkMode()},className:U.a.brightnessIconButton,"aria-label":"Toggle dark mode",onRenderIcon:function(){return Object(H.jsx)(G.a,{className:U.a.brightnessIcon})}})}),Object(H.jsxs)(J.a,{className:U.a.gitHubLink,underline:!1,href:"https://github.com/rn-versions/rn-versions.github.io",target:"_blank",rel:"noreferrer",children:[Object(H.jsx)(Z.a,{className:U.a.gitHubTextButton,text:"Contribute","aria-label":"Contribute",onRenderIcon:function(){return Object(H.jsx)(Y.a,{className:U.a.gitHubLogo})}}),Object(H.jsx)(w.a,{className:U.a.gitHubIconButton,"aria-label":"Contribute",onRenderIcon:function(){return Object(H.jsx)(Y.a,{className:U.a.gitHubLogo})}})]})]})]})})]})},ae=[{label:"Major",key:"major"},{label:"Patch",key:"patch"},{label:"Prerelease",key:"prerelease"}];var re=function(){var e=Object(_.useState)("major"),t=Object(c.a)(e,2),a=t[0],r=t[1],n=Object(_.useState)(window.matchMedia("(prefers-color-scheme: dark)").matches),i=Object(c.a)(n,2),o=i[0],s=i[1];return Object(H.jsxs)(I.a,{theme:o?T:S,className:C.a.app,children:[Object(H.jsx)(te,{items:ae,onItemSelected:function(e){return r(e)},darkMode:o,onToggleDarkMode:function(){return s(!o)},theme:o?T:S}),Object(H.jsx)("div",{className:C.a.contentContainer,children:Object(H.jsx)("div",{className:C.a.cardContainer,children:Object.keys(v).map((function(e){return Object(H.jsx)(V,{identifier:e,versionFilter:a,theme:o?M:R,tooltipTheme:o?T:S},e)}))})})]})};j.prefetch(),y.a.render(Object(H.jsx)(p.a.StrictMode,{children:Object(H.jsx)(re,{})}),document.getElementById("app"))},69:function(e,t,a){e.exports={app:"App_app__2K5xB",contentContainer:"App_contentContainer__2_2MV",cardContainer:"App_cardContainer__1goQq"}}},[[169,7,9]]]);
//# sourceMappingURL=main.28616e5a.chunk.js.map