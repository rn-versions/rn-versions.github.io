import{_ as N,r as a,C as W,f as g,h as E,D as L,i as H,k as C,A as S,s as x,l as V,m as F,n as D,p as I,K as B,o as k,q as A,t as z}from"./index-a641becf.js";function K(t){return t.clientWidth<t.scrollWidth}function O(t){return t.clientHeight<t.scrollHeight}function G(t){return K(t)||O(t)}var q=H(),$=function(t){N(n,t);function n(){var o=t!==null&&t.apply(this,arguments)||this;return o._onRenderContent=function(e){return typeof e.content=="string"?a.createElement("p",{className:o._classNames.subText},e.content):a.createElement("div",{className:o._classNames.subText},e.content)},o}return n.prototype.render=function(){var o=this.props,e=o.className,i=o.calloutProps,s=o.directionalHint,d=o.directionalHintForRTL,r=o.styles,l=o.id,u=o.maxWidth,p=o.onRenderContent,c=p===void 0?this._onRenderContent:p,m=o.targetElement,_=o.theme;return this._classNames=q(r,{theme:_,className:e||i&&i.className,beakWidth:i&&i.beakWidth,gapSpace:i&&i.gapSpace,maxWidth:u}),a.createElement(W,g({target:m,directionalHint:s,directionalHintForRTL:d},i,E(this.props,C,["id"]),{className:this._classNames.root}),a.createElement("div",{className:this._classNames.content,id:l,onMouseEnter:this.props.onMouseEnter,onMouseLeave:this.props.onMouseLeave},c(this.props,this._onRenderContent)))},n.defaultProps={directionalHint:L.topCenter,maxWidth:"364px",calloutProps:{isBeakVisible:!0,beakWidth:16,gapSpace:0,setInitialFocus:!0,doNotLayer:!1}},n}(a.Component),U=function(t){var n=t.className,o=t.beakWidth,e=o===void 0?16:o,i=t.gapSpace,s=i===void 0?0:i,d=t.maxWidth,r=t.theme,l=r.semanticColors,u=r.fonts,p=r.effects,c=-(Math.sqrt(e*e/2)+s)+1/window.devicePixelRatio;return{root:["ms-Tooltip",r.fonts.medium,S.fadeIn200,{background:l.menuBackground,boxShadow:p.elevation8,padding:"8px",maxWidth:d,selectors:{":after":{content:"''",position:"absolute",bottom:c,left:c,right:c,top:c,zIndex:0}}},n],content:["ms-Tooltip-content",u.small,{position:"relative",zIndex:1,color:l.menuItemText,wordWrap:"break-word",overflowWrap:"break-word",overflow:"hidden"}],subText:["ms-Tooltip-subtext",{fontSize:"inherit",fontWeight:"inherit",color:"inherit",margin:0}]}},j=x($,U,void 0,{scope:"Tooltip"}),h;(function(t){t[t.zero=0]="zero",t[t.medium=1]="medium",t[t.long=2]="long"})(h||(h={}));var f;(function(t){t[t.Parent=0]="Parent",t[t.Self=1]="Self"})(f||(f={}));var J=H(),Q=function(t){N(n,t);function n(o){var e=t.call(this,o)||this;return e._tooltipHost=a.createRef(),e._defaultTooltipId=D("tooltip"),e.show=function(){e._toggleTooltip(!0)},e.dismiss=function(){e._hideTooltip()},e._getTargetElement=function(){if(e._tooltipHost.current){var i=e.props.overflowMode;if(i!==void 0)switch(i){case f.Parent:return e._tooltipHost.current.parentElement;case f.Self:return e._tooltipHost.current}return e._tooltipHost.current}},e._onTooltipFocus=function(i){if(e._ignoreNextFocusEvent){e._ignoreNextFocusEvent=!1;return}e._onTooltipMouseEnter(i)},e._onTooltipBlur=function(i){e._ignoreNextFocusEvent=(document==null?void 0:document.activeElement)===i.target,e._hideTooltip()},e._onTooltipMouseEnter=function(i){var s=e.props,d=s.overflowMode,r=s.delay;if(n._currentVisibleTooltip&&n._currentVisibleTooltip!==e&&n._currentVisibleTooltip.dismiss(),n._currentVisibleTooltip=e,d!==void 0){var l=e._getTargetElement();if(l&&!G(l))return}if(!(i.target&&I(i.target,e._getTargetElement())))if(e._clearDismissTimer(),e._clearOpenTimer(),r!==h.zero){e.setState({isAriaPlaceholderRendered:!0});var u=e._getDelayTime(r);e._openTimerId=e._async.setTimeout(function(){e._toggleTooltip(!0)},u)}else e._toggleTooltip(!0)},e._onTooltipMouseLeave=function(i){var s=e.props.closeDelay;e._clearDismissTimer(),e._clearOpenTimer(),s?e._dismissTimerId=e._async.setTimeout(function(){e._toggleTooltip(!1)},s):e._toggleTooltip(!1),n._currentVisibleTooltip===e&&(n._currentVisibleTooltip=void 0)},e._onTooltipKeyDown=function(i){(i.which===B.escape||i.ctrlKey)&&e.state.isTooltipVisible&&(e._hideTooltip(),i.stopPropagation())},e._clearDismissTimer=function(){e._async.clearTimeout(e._dismissTimerId)},e._clearOpenTimer=function(){e._async.clearTimeout(e._openTimerId)},e._hideTooltip=function(){e._clearOpenTimer(),e._clearDismissTimer(),e._toggleTooltip(!1)},e._toggleTooltip=function(i){e.state.isTooltipVisible!==i&&e.setState({isAriaPlaceholderRendered:!1,isTooltipVisible:i},function(){return e.props.onTooltipToggle&&e.props.onTooltipToggle(i)})},e._getDelayTime=function(i){switch(i){case h.medium:return 300;case h.long:return 500;default:return 0}},k(e),e.state={isAriaPlaceholderRendered:!1,isTooltipVisible:!1},e._async=new A(e),e}return n.prototype.render=function(){var o=this.props,e=o.calloutProps,i=o.children,s=o.content,d=o.directionalHint,r=o.directionalHintForRTL,l=o.hostClassName,u=o.id,p=o.setAriaDescribedBy,c=p===void 0?!0:p,m=o.tooltipProps,_=o.styles,P=o.theme;this._classNames=J(_,{theme:P,className:l});var v=this.state,M=v.isAriaPlaceholderRendered,b=v.isTooltipVisible,T=u||this._defaultTooltipId,y=!!(s||m&&m.onRenderContent&&m.onRenderContent()),w=b&&y,R=c&&b&&y?T:void 0;return a.createElement("div",g({className:this._classNames.root,ref:this._tooltipHost},{onFocusCapture:this._onTooltipFocus},{onBlurCapture:this._onTooltipBlur},{onMouseEnter:this._onTooltipMouseEnter,onMouseLeave:this._onTooltipMouseLeave,onKeyDown:this._onTooltipKeyDown,role:"none","aria-describedby":R}),i,w&&a.createElement(j,g({id:T,content:s,targetElement:this._getTargetElement(),directionalHint:d,directionalHintForRTL:r,calloutProps:V({},e,{onDismiss:this._hideTooltip,onMouseEnter:this._onTooltipMouseEnter,onMouseLeave:this._onTooltipMouseLeave}),onMouseEnter:this._onTooltipMouseEnter,onMouseLeave:this._onTooltipMouseLeave},E(this.props,C),m)),M&&a.createElement("div",{id:T,role:"none",style:F},s))},n.prototype.componentWillUnmount=function(){n._currentVisibleTooltip&&n._currentVisibleTooltip===this&&(n._currentVisibleTooltip=void 0),this._async.dispose()},n.defaultProps={delay:h.medium},n}(a.Component),X={root:"ms-TooltipHost",ariaPlaceholder:"ms-TooltipHost-aria-placeholder"},Y=function(t){var n=t.className,o=t.theme,e=z(X,o);return{root:[e.root,{display:"inline"},n]}},ee=x(Q,Y,void 0,{scope:"TooltipHost"});export{j as Tooltip,$ as TooltipBase,h as TooltipDelay,ee as TooltipHost,Q as TooltipHostBase,f as TooltipOverflowMode};