(this["webpackJsonprn-version-tracker"]=this["webpackJsonprn-version-tracker"]||[]).push([[0],{145:function(e,t,a){e.exports={app:"App_app__2ziFi",contentContainer:"App_contentContainer__3BvVB",cardContainer:"App_cardContainer__2YSdb"}},35:function(e,t,a){e.exports={packageCardFrame:"PackageCard_packageCardFrame__37prK",visibleCardFrame:"PackageCard_visibleCardFrame__3sw4n",fadedCardFrame:"PackageCard_fadedCardFrame__h8you",noDataCardFrame:"PackageCard_noDataCardFrame__9FLQg",packageCardContent:"PackageCard_packageCardContent__3Kr50",visibleCardContent:"PackageCard_visibleCardContent__4_7O-",fadedCardContent:"PackageCard_fadedCardContent__1fKCN",noDataCardContent:"PackageCard_noDataCardContent__2PBHC",headerLeft:"PackageCard_headerLeft__udvRl",header:"PackageCard_header__1bpM1",headerText:"PackageCard_headerText__3etfm",packageName:"PackageCard_packageName__3oAJu",headerControls:"PackageCard_headerControls__3S0-z",chartContainer:"PackageCard_chartContainer__2-gCP"}},40:function(e,t,a){e.exports={app:"NavBar_app__2ndwE",contentContainer:"NavBar_contentContainer__1HrNg",cardContainer:"NavBar_cardContainer__2-0S2",nav:"NavBar_nav__kUiGN",navSpacer:"NavBar_navSpacer__1qgrd",navContent:"NavBar_navContent__WY6pJ",reactLogo:"NavBar_reactLogo__31oQg",gitHubLink:"NavBar_gitHubLink__129fm",gitHubIconStroke:"NavBar_gitHubIconStroke__fEafs",gitHubIconButton:"NavBar_gitHubIconButton__B7oPV",gitHubTextButton:"NavBar_gitHubTextButton__31Ju7",gitHubLogo:"NavBar_gitHubLogo__2VQ1M",mobileHeader:"NavBar_mobileHeader__2NWsD",mobileHeaderContent:"NavBar_mobileHeaderContent__3s4_A",mobileBrand:"NavBar_mobileBrand__3wO91",brand:"NavBar_brand__2ilIm",pivot:"NavBar_pivot__2oWsQ"}},462:function(e,t,a){},463:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),i=a(74),o=a.n(i),c=a(26),s=a(145),l=a.n(s),u=a(43),d=a.n(u),v=a(101),h=a(35),m=a.n(h),f={area:{isAnimationActive:!1},responsiveContainer:{width:"100%",height:260},grid:{strokeDasharray:"3 3"},xAxis:{height:32,tickLine:!1,tickMargin:10},yAxis:{width:72,tickLine:!1,tickMargin:10,tickSize:0,tickCount:5},tooltip:{animationDuration:300,animationEasing:"ease-in-out"},legend:{height:32,wrapperStyle:{position:"absolute",bottom:0}}},b=a(527),j=a(524),p=a(529),g=a(523),_=a(520),O=a(148),y=a(91),x=a.n(y);function C(e){if("0.0"===e)return"nightly";var t=e.match(Object(O.a)(/^0\.0\.0\x2D([0-9a-f]{1,7})[0-9a-f]*$/,{hash:1}));return t?"nightly@".concat(t.groups.hash):e}var k=function(e){return x.a.lt(e,"0.0.0")},N=function(e,t){return x.a.gte(e,"".concat(t,".0"),{includePrerelease:!0})},D={"@types/react-native":{friendlyName:"DefinitelyTyped Typings",versionFilter:function(e){return N(e,"0.63")}},"react-native":{friendlyName:"React Native",versionFilter:function(e){return N(e,"0.63")||k(e)},versionLabeler:function(e){if("0.0"===e)return"nightly";var t=e.match(Object(O.a)(/^0\.0\.0\x2D([0-9]{4})([0-9]{2})([0-9]{2})\x2D[0-9]{4}\x2D[0-9a-f]+$/,{year:1,month:2,day:3}));if(t){var a=parseInt(t.groups.year,10),n=parseInt(t.groups.month,10),r=parseInt(t.groups.day,10),i=new Date(a,n-1,r);return"nightly@".concat(i.toLocaleDateString("en-US",{day:"2-digit",month:"2-digit"}))}return e}},"react-native-macos":{friendlyName:"React Native macOS",versionFilter:function(e){return N(e,"0.63")||k(e)},versionLabeler:C},"react-native-web":{friendlyName:"React Native Web",versionFilter:function(e){return N(e,"0.11")||k(e)},versionLabeler:C},"react-native-windows":{friendlyName:"React Native Windows",versionFilter:function(e){return(N(e,"0.63")||k(e))&&"1.0.0"!==e},versionLabeler:function(e){if("0.0"===e)return"canary";var t=e.match(Object(O.a)(/^0\.0\.0\x2D(canary.[0-9]+)$/,{canary:1}));return t?t.groups.canary:e}}},P=a(130),w=a(19),L=a(30),T=a(49),S=a(228),B=a.n(S);function F(e,t,a){var n=(2-t/100)*a/2,r=t*a/(n<50?2*n:200-2*n);return"hsl(".concat(e,", ").concat(Math.round(r),"%, ").concat(Math.round(n),"%)")}function H(e,t){return Math.abs((e-t+.5)%1-.5)}var M=a(72),I=a.n(M),A=a(135),z=a(3);var V=function(e){var t=e.label,a=e.payload,n=e.measurementTransform,r=e.theme,i=Object(T.a)(null!==a&&void 0!==a?a:[]);i.reverse();var o=i.length>0&&Object(z.jsx)("ul",{className:I.a.versionsList,children:i.map((function(e,t){var a=function(e,t,a){var n=t.payload.versionCounts,r=e/Object.values(n).reduce((function(e,t){return e+t}),0)*100;return"percentage"===a?"".concat(Math.round(100*r)/100,"%"):"".concat(e.toLocaleString()," (").concat(Math.round(r),"%)")}(e.value,e,n);return Object(z.jsxs)("li",{className:I.a.versionsListItem,children:[Object(z.jsx)("div",{className:I.a.versionColorIndicator,style:{backgroundColor:e.color||"#000"}}),Object(z.jsx)(b.a,{variant:"small",className:I.a.versionLabel,children:e.name}),Object(z.jsx)(b.a,{variant:"small",className:I.a.versionCount,children:a})]},t)}))});return Object(z.jsx)(A.a.Consumer,{children:function(e){var a,n,i,c;return r=null!==(a=r)&&void 0!==a?a:e,Object(z.jsxs)(g.a,{theme:r,className:I.a.frame,style:{backgroundColor:null===(n=null!==(i=r)&&void 0!==i?i:e)||void 0===n?void 0:n.semanticColors.bodyBackground},children:[Object(z.jsx)(b.a,{className:I.a.date,variant:"medium",children:(c=t,new Date(c).toLocaleDateString("en-US",{month:"short",day:"numeric"}))}),o]})}})},R=a(262),Q=a(506),E=a(507),K=a(249),W=a(250),J=a(508),U=a(110),Y=a(108);function $(e,t){var a=e[0],n=e[e.length-1];if(0===t)return[];if(1===t)return[a];if(2===t)return[a,n];for(var r=n-a,i=t-1,o=6048e5;Math.floor(r/o)>i;)o*=2;var c,s=new Set([a]),l=G(a,o),u=Object(w.a)(e);try{for(u.s();!(c=u.n()).done;){var d=c.value;d>=l&&(s.add(d),l=G(d,o))}}catch(v){u.e(v)}finally{u.f()}return console.log(s),Object(T.a)(s)}function G(e,t){var a=new Date(e);return a.setHours(0,0,0,0),a.getTime()+t}var q=function(e){var t,a=e.historyPoints,r=e.maxDaysShown,i=e.maxVersionsShown,o=e.maxTicks,c=e.showLegend,s=e.showTooltip,l=e.measurementTransform,u=e.versionLabeler,d=e.tooltipTheme;r=null!==(t=r)&&void 0!==t?t:30;var v,h,m=i?function(e,t,a){if(0===e.length)return[];var n,r=e[e.length-1].date,i=new Date(r).setHours(0,0,0,0)-24*a*60*60*1e3,o=[],c=Object(w.a)(e);try{var s=function(){var e=n.value;if(e.date>=i){var t=o.find((function(t){return t.version===e.version})),a=e.date<i?0:e.count;t?t.count+=a:o.push({version:e.version,count:a})}};for(c.s();!(n=c.n()).done;)s()}catch(H){c.e(H)}finally{c.f()}var l,u=o.sort((function(e,t){return e.count-t.count})).slice(-t).map((function(e){return e.version})),d=[],v=Object(w.a)(e);try{for(v.s();!(l=v.n()).done;){var h=l.value;u.includes(h.version)&&!d.includes(h.version)&&d.push(h.version)}}catch(H){v.e(H)}finally{v.f()}var m,f=[],b=Object(w.a)(e);try{for(b.s();!(m=b.n()).done;){var j=m.value;u.includes(j.version)&&f.push(j)}}catch(H){b.e(H)}finally{b.f()}for(var p=new Map,g=0,_=f;g<_.length;g++){var O,y=_[g],x=null!==(O=p.get(y.date))&&void 0!==O?O:[];p.set(y.date,[].concat(Object(T.a)(x),[y]))}var C,k=Object(T.a)(p.keys()).sort(),N=[],D=Object(w.a)(k);try{for(D.s();!(C=D.n()).done;){var P=C.value;if(!(P<i)){var S,B=Object(w.a)(d);try{var F=function(){var e=S.value,t=p.get(P).find((function(t){return t.version===e}));t?N.push(Object(L.a)({date:P},t)):N.push({date:P,version:e,count:0})};for(B.s();!(S=B.n()).done;)F()}catch(H){B.e(H)}finally{B.f()}}}}catch(H){D.e(H)}finally{D.f()}return N}(a,i,r):a,b="percentage"===l?function(e){var t,a={},n=Object(w.a)(e);try{for(n.s();!(t=n.n()).done;){var r,i=t.value,o=null!==(r=a[i.date])&&void 0!==r?r:0;a[i.date]=o+i.count}}catch(c){n.e(c)}finally{n.f()}return e.map((function(e){return Object(L.a)(Object(L.a)({},e),{},{count:e.count/a[e.date]})}))}(m):m,j=new Intl.DateTimeFormat("en-US",{month:"short",day:"numeric"}),p=new Set(b.map((function(e){return e.version}))),g=Object(T.a)(p),_=void 0,O=g.map((function(e,t){var a=function(e,t){var a,n,r=B.a.create(e),i=100;do{n=r.random(),n+=.618033988749895,n%=1}while(t&&--i>0&&(H(n,t.adjacentHue)<.25||t.allHues.find((function(e){return H(n,e)<.05}))));return{color:F(360*n,100,90),avoidToken:{adjacentHue:n,allHues:[].concat(Object(T.a)(null!==(a=null===t||void 0===t?void 0:t.allHues)&&void 0!==a?a:[]),[n])}}}(e,_),r=a.color,i=a.avoidToken;return _=i,Object(n.createElement)(R.a,Object(L.a)(Object(L.a)({},f.area),{},{name:u?u(e):e,key:e,dataKey:function(t){return t.versionCounts[e]},stackId:"1",stroke:r,fill:r}))})),y=[],x=Object(w.a)(g);try{for(x.s();!(v=x.n()).done;){var C,k=v.value,N=Object(w.a)(b);try{var D=function(){var e=C.value;if(e.version===k){var t=y.find((function(t){return t.date===e.date}));t?t.versionCounts[k]=e.count:y.push({date:e.date,versionCounts:Object(P.a)({},k,e.count)})}};for(N.s();!(C=N.n()).done;)D()}catch(S){N.e(S)}finally{N.f()}}}catch(S){x.e(S)}finally{x.f()}return 0===b.length?Object(z.jsx)("div",{style:{height:f.responsiveContainer.height,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column"}}):Object(z.jsx)(Q.a,Object(L.a)(Object(L.a)({},f.responsiveContainer),{},{children:Object(z.jsxs)(E.a,{data:y,children:[Object(z.jsx)(K.a,Object(L.a)(Object(L.a)({},f.xAxis),{},{dataKey:"date",type:"number",scale:"time",domain:["dataMin","dataMax"],tickFormatter:function(e){return j.format(new Date(e))},interval:0,ticks:$(b.map((function(e){return e.date})),null!==o&&void 0!==o?o:6)})),Object(z.jsx)(W.a,Object(L.a)(Object(L.a)({},f.yAxis),{},{type:"number"},"percentage"===l?{domain:[0,1],tickFormatter:function(e){return"".concat(Math.round(100*e),"%")}}:{domain:["auto","auto"],tickFormatter:function(e){return e.toLocaleString()}})),Object(z.jsx)(J.a,Object(L.a)({},f.grid)),!1!==s&&Object(z.jsx)(U.a,{content:(h={measurementTransform:l,theme:d},function(e){return Object(z.jsx)(V,Object(L.a)(Object(L.a)({},h),e))})}),!1!==c&&Object(z.jsx)(Y.a,Object(L.a)({},f.legend)),O]})}))},X=a(251),Z=a(252),ee=function(){function e(t,a){Object(X.a)(this,e),this.packageDescription=void 0,this.historyPoints=void 0,this.majorDatePoints=null,this.patchDatePoints=null,this.prereleaseDatePoints=null,this.packageDescription=D[t],this.historyPoints=a}return Object(Z.a)(e,[{key:"getMajorDatePoints",value:function(){return this.majorDatePoints||(this.majorDatePoints=this.accumulateDatePoints({versionMapper:this.mapToMajor})),this.majorDatePoints}},{key:"mapToMajor",value:function(e){var t=x.a.parse(e);return 0===t.major?"0.".concat(t.minor):"".concat(t.major,".0")}},{key:"getPatchDatePoints",value:function(){return this.patchDatePoints||(this.patchDatePoints=this.accumulateDatePoints()),this.patchDatePoints}},{key:"getPrereleaseDataPoints",value:function(){return this.prereleaseDatePoints||(this.prereleaseDatePoints=this.accumulateDatePoints({extraFilter:function(e){return!!x.a.prerelease(e.version)}})),this.prereleaseDatePoints}},{key:"getDatePoints",value:function(e){switch(e){case"major":return this.getMajorDatePoints();case"patch":return this.getPatchDatePoints();case"prerelease":return this.getPrereleaseDataPoints()}}},{key:"accumulateDatePoints",value:function(e){var t,a=this;if(t=(null===e||void 0===e?void 0:e.extraFilter)?this.historyPoints.filter((function(t){return e.extraFilter(t)&&a.packageDescription.versionFilter(t.version)})):this.historyPoints.filter((function(e){return a.packageDescription.versionFilter(e.version)})),null===e||void 0===e?void 0:e.versionMapper){var n,r={},i=Object(w.a)(t);try{var o=function(){var t,a=n.value,i=e.versionMapper(a.version),o=null!==(t=r[i])&&void 0!==t?t:[];r[i]=o;var c=o.find((function(e){return a.date===e.date}));c?c.count+=a.count:o.push({date:a.date,count:a.count})};for(i.s();!(n=i.n()).done;)o()}catch(d){i.e(d)}finally{i.f()}t=[];for(var s=function(){var e,a=Object(c.a)(u[l],2),n=a[0],r=a[1].sort((function(e,t){return e.date-t.date}));(e=t).push.apply(e,Object(T.a)(r.map((function(e){return Object(L.a)(Object(L.a)({},e),{},{version:n})}))))},l=0,u=Object.entries(r);l<u.length;l++)s()}return t}}],[{key:"get",value:function(){var t=Object(v.a)(d.a.mark((function t(a){var n;return d.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(e.instances[a]){t.next=5;break}return t.next=3,e.loadHistoryFile(a);case 3:n=t.sent,e.instances[a]=new e(a,n.points);case 5:return t.abrupt("return",e.instances[a]);case 6:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}()},{key:"loadHistoryFile",value:function(){var e=Object(v.a)(d.a.mark((function e(t){return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:e.t0=t,e.next="@types/react-native"===e.t0?3:"react-native"===e.t0?6:"react-native-macos"===e.t0?9:"react-native-web"===e.t0?12:"react-native-windows"===e.t0?15:18;break;case 3:return e.next=5,a.e(3).then(a.t.bind(null,536,3));case 5:case 8:case 11:case 14:case 17:return e.abrupt("return",e.sent);case 6:return e.next=8,a.e(7).then(a.t.bind(null,537,3));case 9:return e.next=11,a.e(4).then(a.t.bind(null,538,3));case 12:return e.next=14,a.e(5).then(a.t.bind(null,539,3));case 15:return e.next=17,a.e(6).then(a.t.bind(null,540,3));case 18:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()}]),e}();ee.instances={};var te=a(79),ae=Object(te.a)({palette:{themePrimary:"#79bdbc",themeLighterAlt:"#f9fcfc",themeLighter:"#e6f4f4",themeLight:"#d2ebeb",themeTertiary:"#a9d7d6",themeSecondary:"#86c5c4",themeDarkAlt:"#6daaa9",themeDark:"#5c8f8f",themeDarker:"#446a69",neutralLighterAlt:"#302e2d",neutralLighter:"#383735",neutralLight:"#464443",neutralQuaternaryAlt:"#4e4d4b",neutralQuaternary:"#555352",neutralTertiaryAlt:"#72706e",neutralTertiary:"#c8c8c8",neutralSecondary:"#d0d0d0",neutralPrimaryAlt:"#dadada",neutralPrimary:"#ffffff",neutralDark:"#f4f4f4",black:"#f8f8f8",white:"#252423"}}),ne=Object(te.a)({palette:{themePrimary:"#467877",themeLighterAlt:"#f5fafa",themeLighter:"#dae9e9",themeLight:"#bbd6d6",themeTertiary:"#82aead",themeSecondary:"#568887",themeDarkAlt:"#3f6c6b",themeDark:"#355b5a",themeDarker:"#274343",neutralLighterAlt:"#f8f8f8",neutralLighter:"#f4f4f4",neutralLight:"#eaeaea",neutralQuaternaryAlt:"#dadada",neutralQuaternary:"#d0d0d0",neutralTertiaryAlt:"#c8c8c8",neutralTertiary:"#0d0d0c",neutralSecondary:"#111110",neutralPrimaryAlt:"#151514",neutralPrimary:"#252423",neutralDark:"#1e1d1c",black:"#222120",white:"#ffffff"}});function re(e){switch(e){case"major":return 56;case"patch":return 28;case"prerelease":return 14}}var ie=function(e){var t=e.loaded,a=e.hasData,n=e.theme,r=e.children;return Object(z.jsx)(g.a,{theme:n,className:"".concat(m.a.packageCardFrame," ").concat(t?a?m.a.visibleCardFrame:m.a.noDataCardFrame:m.a.fadedCardFrame),children:Object(z.jsx)("div",{className:"".concat(m.a.packageCardContent," ").concat(t?a?m.a.visibleCardContent:m.a.noDataCardContent:m.a.fadedCardContent),children:r})})},oe=function(e){var t=e.identifier,a=e.versionFilter,r=e.theme,i=e.tooltipTheme,o=Object(n.useState)(a),s=Object(c.a)(o,2),l=s[0],u=s[1],h=Object(n.useState)(!1),g=Object(c.a)(h,2),O=g[0],y=g[1],x=Object(n.useState)(null),C=Object(c.a)(x,2),k=C[0],N=C[1];Object(n.useEffect)((function(){k||Object(v.a)(d.a.mark((function e(){var a;return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,ee.get(t);case 2:a=e.sent,N(a);case 4:case"end":return e.stop()}}),e)})))()}),[k,t]),Object(n.useEffect)((function(){a!==l&&(y(!1),u(a))}),[a,l]);var P=null===k||void 0===k?void 0:k.getDatePoints(a),w=D[t];return Object(z.jsxs)(ie,{theme:null!==r&&void 0!==r?r:ne,loaded:!!P,hasData:!!P&&P.length>0,children:[Object(z.jsxs)("div",{className:m.a.header,children:[Object(z.jsx)("div",{className:m.a.headerLeft}),Object(z.jsxs)("div",{className:m.a.headerText,children:[Object(z.jsx)(b.a,{variant:"large",className:m.a.packageName,children:w.friendlyName}),Object(z.jsx)(b.a,{variant:"medium",children:"(Downloads/Week)"})]}),Object(z.jsx)("div",{className:m.a.headerControls,children:Object(z.jsx)(j.a,{content:"Show as percentage",theme:i,children:Object(z.jsx)(p.a,{toggle:!0,"aria-label":"Show as percentage",disabled:!P||0===P.length,onRenderIcon:function(){return Object(z.jsx)(_.a,{})},checked:O,onClick:function(){return y(!O)}})})})]}),P?Object(z.jsx)("div",{className:m.a.chartContainer,children:Object(z.jsx)(q,{historyPoints:P,maxDaysShown:re(a),maxVersionsShown:7,measurementTransform:O?"percentage":"totalDownloads",versionLabeler:w.versionLabeler,tooltipTheme:i})}):Object(z.jsx)("div",{style:{height:f.responsiveContainer.height}})]})},ce=a(40),se=a.n(ce),le=a(526),ue=a(258),de=a(528),ve=a(264),he=a(521),me=a(142),fe=Object(me.a)({displayName:"ReactLogoIcon",svg:function(e){var t=e.classes;return Object(z.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"120 2 600 600",className:t.svg,children:Object(z.jsxs)("g",{fill:"#61DAFB",children:[Object(z.jsx)("path",{d:"M666.3 296.5c0-32.5-40.7-63.3-103.1-82.4 14.4-63.6 8-114.2-20.2-130.4-6.5-3.8-14.1-5.6-22.4-5.6v22.3c4.6 0 8.3.9 11.4 2.6 13.6 7.8 19.5 37.5 14.9 75.7-1.1 9.4-2.9 19.3-5.1 29.4-19.6-4.8-41-8.5-63.5-10.9-13.5-18.5-27.5-35.3-41.6-50 32.6-30.3 63.2-46.9 84-46.9V78c-27.5 0-63.5 19.6-99.9 53.6-36.4-33.8-72.4-53.2-99.9-53.2v22.3c20.7 0 51.4 16.5 84 46.6-14 14.7-28 31.4-41.3 49.9-22.6 2.4-44 6.1-63.6 11-2.3-10-4-19.7-5.2-29-4.7-38.2 1.1-67.9 14.6-75.8 3-1.8 6.9-2.6 11.5-2.6V78.5c-8.4 0-16 1.8-22.6 5.6-28.1 16.2-34.4 66.7-19.9 130.1-62.2 19.2-102.7 49.9-102.7 82.3 0 32.5 40.7 63.3 103.1 82.4-14.4 63.6-8 114.2 20.2 130.4 6.5 3.8 14.1 5.6 22.5 5.6 27.5 0 63.5-19.6 99.9-53.6 36.4 33.8 72.4 53.2 99.9 53.2 8.4 0 16-1.8 22.6-5.6 28.1-16.2 34.4-66.7 19.9-130.1 62-19.1 102.5-49.9 102.5-82.3zm-130.2-66.7c-3.7 12.9-8.3 26.2-13.5 39.5-4.1-8-8.4-16-13.1-24-4.6-8-9.5-15.8-14.4-23.4 14.2 2.1 27.9 4.7 41 7.9zm-45.8 106.5c-7.8 13.5-15.8 26.3-24.1 38.2-14.9 1.3-30 2-45.2 2-15.1 0-30.2-.7-45-1.9-8.3-11.9-16.4-24.6-24.2-38-7.6-13.1-14.5-26.4-20.8-39.8 6.2-13.4 13.2-26.8 20.7-39.9 7.8-13.5 15.8-26.3 24.1-38.2 14.9-1.3 30-2 45.2-2 15.1 0 30.2.7 45 1.9 8.3 11.9 16.4 24.6 24.2 38 7.6 13.1 14.5 26.4 20.8 39.8-6.3 13.4-13.2 26.8-20.7 39.9zm32.3-13c5.4 13.4 10 26.8 13.8 39.8-13.1 3.2-26.9 5.9-41.2 8 4.9-7.7 9.8-15.6 14.4-23.7 4.6-8 8.9-16.1 13-24.1zM421.2 430c-9.3-9.6-18.6-20.3-27.8-32 9 .4 18.2.7 27.5.7 9.4 0 18.7-.2 27.8-.7-9 11.7-18.3 22.4-27.5 32zm-74.4-58.9c-14.2-2.1-27.9-4.7-41-7.9 3.7-12.9 8.3-26.2 13.5-39.5 4.1 8 8.4 16 13.1 24 4.7 8 9.5 15.8 14.4 23.4zM420.7 163c9.3 9.6 18.6 20.3 27.8 32-9-.4-18.2-.7-27.5-.7-9.4 0-18.7.2-27.8.7 9-11.7 18.3-22.4 27.5-32zm-74 58.9c-4.9 7.7-9.8 15.6-14.4 23.7-4.6 8-8.9 16-13 24-5.4-13.4-10-26.8-13.8-39.8 13.1-3.1 26.9-5.8 41.2-7.9zm-90.5 125.2c-35.4-15.1-58.3-34.9-58.3-50.6 0-15.7 22.9-35.6 58.3-50.6 8.6-3.7 18-7 27.7-10.1 5.7 19.6 13.2 40 22.5 60.9-9.2 20.8-16.6 41.1-22.2 60.6-9.9-3.1-19.3-6.5-28-10.2zM310 490c-13.6-7.8-19.5-37.5-14.9-75.7 1.1-9.4 2.9-19.3 5.1-29.4 19.6 4.8 41 8.5 63.5 10.9 13.5 18.5 27.5 35.3 41.6 50-32.6 30.3-63.2 46.9-84 46.9-4.5-.1-8.3-1-11.3-2.7zm237.2-76.2c4.7 38.2-1.1 67.9-14.6 75.8-3 1.8-6.9 2.6-11.5 2.6-20.7 0-51.4-16.5-84-46.6 14-14.7 28-31.4 41.3-49.9 22.6-2.4 44-6.1 63.6-11 2.3 10.1 4.1 19.8 5.2 29.1zm38.5-66.7c-8.6 3.7-18 7-27.7 10.1-5.7-19.6-13.2-40-22.5-60.9 9.2-20.8 16.6-41.1 22.2-60.6 9.9 3.1 19.3 6.5 28.1 10.2 35.4 15.1 58.3 34.9 58.3 50.6-.1 15.7-23 35.6-58.4 50.6zM320.8 78.4z"}),Object(z.jsx)("circle",{cx:"420.9",cy:"296.5",r:"45.7"}),Object(z.jsx)("path",{d:"M520.5 78.1z"})]})})}}),be=function(e){var t=e.className;return Object(z.jsxs)("div",{className:t,children:[Object(z.jsx)(fe,{className:se.a.reactLogo}),Object(z.jsx)(b.a,{variant:"large",children:"React Native Versions"})]})},je=function(e){var t,a,n=null!==(t=e.theme)&&void 0!==t?t:ae,r={backgroundColor:(null!==(a=e.theme)&&void 0!==a?a:ae).semanticColors.bodyBackground};return Object(z.jsxs)(z.Fragment,{children:[Object(z.jsx)(g.a,{className:se.a.mobileHeader,theme:n,style:r,children:Object(z.jsx)("div",{className:se.a.mobileHeaderContent,children:Object(z.jsx)(be,{className:se.a.mobileBrand})})}),Object(z.jsx)(g.a,{className:se.a.nav,theme:n,style:r,children:Object(z.jsxs)("div",{className:se.a.navContent,children:[Object(z.jsx)(be,{className:se.a.brand}),Object(z.jsx)(le.a,{headersOnly:!0,className:se.a.pivot,onLinkClick:function(t){window.scrollTo({left:0,top:0,behavior:"smooth"}),e.onItemSelected&&e.onItemSelected(t.props.itemKey)},children:e.items.map((function(e){return Object(z.jsx)(ue.a,{headerText:e.label,itemKey:e.key})}))}),Object(z.jsxs)(de.a,{className:se.a.gitHubLink,underline:!1,href:"https://github.com/rn-versions/rn-versions.github.io",target:"_blank",rel:"noreferrer",children:[Object(z.jsx)(ve.a,{className:se.a.gitHubTextButton,text:"Contribute","aria-label":"Contribute",onRenderIcon:function(){return Object(z.jsx)(he.a,{className:se.a.gitHubLogo})}}),Object(z.jsx)(p.a,{className:se.a.gitHubIconButton,"aria-label":"Contribute",onRenderIcon:function(){return Object(z.jsx)(he.a,{className:se.a.gitHubLogo})}})]})]})})]})},pe=[{name:"react-native"},{name:"@types/react-native"},{name:"react-native-windows"},{name:"react-native-macos"},{name:"react-native-web"}],ge=[{label:"Major",key:"major"},{label:"Patch",key:"patch"},{label:"Prerelease",key:"prerelease"}];var _e=function(){var e=Object(n.useState)("major"),t=Object(c.a)(e,2),a=t[0],r=t[1];return Object(z.jsxs)("div",{className:l.a.app,children:[Object(z.jsx)(je,{items:ge,onItemSelected:function(e){return r(e)},theme:ae}),Object(z.jsx)("div",{className:l.a.contentContainer,children:Object(z.jsx)("div",{className:l.a.cardContainer,children:pe.map((function(e){return Object(z.jsx)(oe,{identifier:e.name,versionFilter:a,theme:ne,tooltipTheme:ae},e.name)}))})})]})};a(462);o.a.render(Object(z.jsx)(r.a.StrictMode,{children:Object(z.jsx)(_e,{})}),document.body)},72:function(e,t,a){e.exports={frame:"VersionTooltip_frame__Ear68",date:"VersionTooltip_date__3iXaR",versionsList:"VersionTooltip_versionsList__pBT1t",versionsListItem:"VersionTooltip_versionsListItem__9IYnp",versionColorIndicator:"VersionTooltip_versionColorIndicator__16U_R",versionLabel:"VersionTooltip_versionLabel__3hu-9",versionCount:"VersionTooltip_versionCount__3pGiH"}}},[[463,1,2]]]);
//# sourceMappingURL=main.4e6c6e4e.chunk.js.map