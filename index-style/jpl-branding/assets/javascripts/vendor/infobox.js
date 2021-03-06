/**
 * @name InfoBox
 * @version 1.1.11 [January 9, 2012]
 * @author Gary Little (inspired by proof-of-concept code from Pamela Fox of Google)
 * @copyright Copyright 2010 Gary Little [gary at luxcentral.com]
 * @fileoverview InfoBox extends the Google Maps JavaScript API V3 <tt>OverlayView</tt> class.
 *  <p>
 *  An InfoBox behaves like a <tt>google.maps.InfoWindow</tt>, but it supports several
 *  additional properties for advanced styling. An InfoBox can also be used as a map label.
 *  <p>
 *  An InfoBox also fires the same events as a <tt>google.maps.InfoWindow</tt>.
 */
/*!
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/*jslint browser:true */
/*global google */
/**
 * @name InfoBoxOptions
 * @class This class represents the optional parameter passed to the {@link InfoBox} constructor.
 * @property {string|Node} content The content of the InfoBox (plain text or an HTML DOM node).
 * @property {boolean} disableAutoPan Disable auto-pan on <tt>open</tt> (default is <tt>false</tt>).
 * @property {number} maxWidth The maximum width (in pixels) of the InfoBox. Set to 0 if no maximum.
 * @property {Size} pixelOffset The offset (in pixels) from the top left corner of the InfoBox
 *  (or the bottom left corner if the <code>alignBottom</code> property is <code>true</code>)
 *  to the map pixel corresponding to <tt>position</tt>.
 * @property {LatLng} position The geographic location at which to display the InfoBox.
 * @property {number} zIndex The CSS z-index style value for the InfoBox.
 *  Note: This value overrides a zIndex setting specified in the <tt>boxStyle</tt> property.
 * @property {string} boxClass The name of the CSS class defining the styles for the InfoBox container.
 *  The default name is <code>infoBox</code>.
 * @property {Object} [boxStyle] An object literal whose properties define specific CSS
 *  style values to be applied to the InfoBox. Style values defined here override those that may
 *  be defined in the <code>boxClass</code> style sheet. If this property is changed after the
 *  InfoBox has been created, all previously set styles (except those defined in the style sheet)
 *  are removed from the InfoBox before the new style values are applied.
 * @property {string} closeBoxMargin The CSS margin style value for the close box.
 *  The default is "2px" (a 2-pixel margin on all sides).
 * @property {string} closeBoxURL The URL of the image representing the close box.
 *  Note: The default is the URL for Google's standard close box.
 *  Set this property to "" if no close box is required.
 * @property {Size} infoBoxClearance Minimum offset (in pixels) from the InfoBox to the
 *  map edge after an auto-pan.
 * @property {boolean} isHidden Hide the InfoBox on <tt>open</tt> (default is <tt>false</tt>).
 * @property {boolean} alignBottom Align the bottom left corner of the InfoBox to the <code>position</code>
 *  location (default is <tt>false</tt> which means that the top left corner of the InfoBox is aligned).
 * @property {string} pane The pane where the InfoBox is to appear (default is "floatPane").
 *  Set the pane to "mapPane" if the InfoBox is being used as a map label.
 *  Valid pane names are the property names for the <tt>google.maps.MapPanes</tt> object.
 * @property {boolean} enableEventPropagation Propagate mousedown, mousemove, mouseover, mouseout,
 *  mouseup, click, dblclick, touchstart, touchend, touchmove, and contextmenu events in the InfoBox
 *  (default is <tt>false</tt> to mimic the behavior of a <tt>google.maps.InfoWindow</tt>). Set
 *  this property to <tt>true</tt> if the InfoBox is being used as a map label.
 */
/**
 * Creates an InfoBox with the options specified in {@link InfoBoxOptions}.
 *  Call <tt>InfoBox.open</tt> to add the box to the map.
 * @constructor
 * @param {InfoBoxOptions} [opt_opts]
 */

function InfoBox(e){e=e||{},google.maps.OverlayView.apply(this,arguments),this.content_=e.content||"",this.disableAutoPan_=e.disableAutoPan||!1,this.maxWidth_=e.maxWidth||0,this.pixelOffset_=e.pixelOffset||new google.maps.Size(0,0),this.position_=e.position||new google.maps.LatLng(0,0),this.zIndex_=e.zIndex||null,this.boxClass_=e.boxClass||"infoBox",this.boxStyle_=e.boxStyle||{},this.closeBoxMargin_=e.closeBoxMargin||"2px",this.closeBoxURL_=e.closeBoxURL||"http://www.google.com/intl/en_us/mapfiles/close.gif",e.closeBoxURL===""&&(this.closeBoxURL_=""),this.infoBoxClearance_=e.infoBoxClearance||new google.maps.Size(1,1),this.isHidden_=e.isHidden||!1,this.alignBottom_=e.alignBottom||!1,this.pane_=e.pane||"floatPane",this.enableEventPropagation_=e.enableEventPropagation||!1,this.div_=null,this.closeListener_=null,this.moveListener_=null,this.contextListener_=null,this.eventListeners_=null,this.fixedWidthSet_=null}InfoBox.prototype=new google.maps.OverlayView,InfoBox.prototype.createInfoBoxDiv_=function(){var e,t,n,r=this,i=function(e){e.cancelBubble=!0,e.stopPropagation&&e.stopPropagation()},s=function(e){e.returnValue=!1,e.preventDefault&&e.preventDefault(),r.enableEventPropagation_||i(e)};if(!this.div_){this.div_=document.createElement("div"),this.setBoxStyle_(),typeof this.content_.nodeType=="undefined"?this.div_.innerHTML=this.getCloseBoxImg_()+this.content_:(this.div_.innerHTML=this.getCloseBoxImg_(),this.div_.appendChild(this.content_)),this.getPanes()[this.pane_].appendChild(this.div_),this.addClickHandler_(),this.div_.style.width?this.fixedWidthSet_=!0:this.maxWidth_!==0&&this.div_.offsetWidth>this.maxWidth_?(this.div_.style.width=this.maxWidth_,this.div_.style.overflow="auto",this.fixedWidthSet_=!0):(n=this.getBoxWidths_(),this.div_.style.width=this.div_.offsetWidth-n.left-n.right+"px",this.fixedWidthSet_=!1),this.panBox_(this.disableAutoPan_);if(!this.enableEventPropagation_){this.eventListeners_=[],t=["mousedown","mouseover","mouseout","mouseup","click","dblclick","touchstart","touchend","touchmove"];for(e=0;e<t.length;e++)this.eventListeners_.push(google.maps.event.addDomListener(this.div_,t[e],i));this.eventListeners_.push(google.maps.event.addDomListener(this.div_,"mouseover",function(e){this.style.cursor="default"}))}this.contextListener_=google.maps.event.addDomListener(this.div_,"contextmenu",s),google.maps.event.trigger(this,"domready")}},InfoBox.prototype.getCloseBoxImg_=function(){var e="";return this.closeBoxURL_!==""&&(e="<img",e+=" src='"+this.closeBoxURL_+"'",e+=" class='infobox-close'>"),e},InfoBox.prototype.addClickHandler_=function(){var e;this.closeBoxURL_!==""?(e=this.div_.firstChild,this.closeListener_=google.maps.event.addDomListener(e,"click",this.getCloseClickHandler_())):this.closeListener_=null},InfoBox.prototype.getCloseClickHandler_=function(){var e=this;return function(t){t.cancelBubble=!0,t.stopPropagation&&t.stopPropagation(),google.maps.event.trigger(e,"closeclick"),e.close()}},InfoBox.prototype.panBox_=function(e){var t,n,r=0,i=0;if(!e){t=this.getMap();if(t instanceof google.maps.Map){t.getBounds().contains(this.position_)||t.setCenter(this.position_),n=t.getBounds();var s=t.getDiv(),o=s.offsetWidth,u=s.offsetHeight,a=this.pixelOffset_.width,f=this.pixelOffset_.height,l=this.div_.offsetWidth,c=this.div_.offsetHeight,h=this.infoBoxClearance_.width,p=this.infoBoxClearance_.height,d=this.getProjection().fromLatLngToContainerPixel(this.position_);d.x<-a+h?r=d.x+a-h:d.x+l+a+h>o&&(r=d.x+l+a+h-o),this.alignBottom_?d.y<-f+p+c?i=d.y+f-p-c:d.y+f+p>u&&(i=d.y+f+p-u):d.y<-f+p?i=d.y+f-p:d.y+c+f+p>u&&(i=d.y+c+f+p-u);if(r!==0||i!==0){var v=t.getCenter();t.panBy(r,i)}}}},InfoBox.prototype.setBoxStyle_=function(){var e,t;if(this.div_){this.div_.className=this.boxClass_,this.div_.style.cssText="",t=this.boxStyle_;for(e in t)t.hasOwnProperty(e)&&(this.div_.style[e]=t[e]);typeof this.div_.style.opacity!="undefined"&&this.div_.style.opacity!==""&&(this.div_.style.filter="alpha(opacity="+this.div_.style.opacity*100+")"),this.div_.style.position="absolute",this.div_.style.visibility="hidden",this.zIndex_!==null&&(this.div_.style.zIndex=this.zIndex_)}},InfoBox.prototype.getBoxWidths_=function(){var e,t={top:0,bottom:0,left:0,right:0},n=this.div_;return document.defaultView&&document.defaultView.getComputedStyle?(e=n.ownerDocument.defaultView.getComputedStyle(n,""),e&&(t.top=parseInt(e.borderTopWidth,10)||0,t.bottom=parseInt(e.borderBottomWidth,10)||0,t.left=parseInt(e.borderLeftWidth,10)||0,t.right=parseInt(e.borderRightWidth,10)||0)):document.documentElement.currentStyle&&n.currentStyle&&(t.top=parseInt(n.currentStyle.borderTopWidth,10)||0,t.bottom=parseInt(n.currentStyle.borderBottomWidth,10)||0,t.left=parseInt(n.currentStyle.borderLeftWidth,10)||0,t.right=parseInt(n.currentStyle.borderRightWidth,10)||0),t},InfoBox.prototype.onRemove=function(){this.div_&&(this.div_.parentNode.removeChild(this.div_),this.div_=null)},InfoBox.prototype.draw=function(){this.createInfoBoxDiv_();var e=this.getProjection().fromLatLngToDivPixel(this.position_);this.div_.style.left=e.x+this.pixelOffset_.width+"px",this.alignBottom_?this.div_.style.bottom=-(e.y+this.pixelOffset_.height)+"px":this.div_.style.top=e.y+this.pixelOffset_.height+"px",this.isHidden_?this.div_.style.visibility="hidden":this.div_.style.visibility="visible"},InfoBox.prototype.setOptions=function(e){typeof e.boxClass!="undefined"&&(this.boxClass_=e.boxClass,this.setBoxStyle_()),typeof e.boxStyle!="undefined"&&(this.boxStyle_=e.boxStyle,this.setBoxStyle_()),typeof e.content!="undefined"&&this.setContent(e.content),typeof e.disableAutoPan!="undefined"&&(this.disableAutoPan_=e.disableAutoPan),typeof e.maxWidth!="undefined"&&(this.maxWidth_=e.maxWidth),typeof e.pixelOffset!="undefined"&&(this.pixelOffset_=e.pixelOffset),typeof e.alignBottom!="undefined"&&(this.alignBottom_=e.alignBottom),typeof e.position!="undefined"&&this.setPosition(e.position),typeof e.zIndex!="undefined"&&this.setZIndex(e.zIndex),typeof e.closeBoxMargin!="undefined"&&(this.closeBoxMargin_=e.closeBoxMargin),typeof e.closeBoxURL!="undefined"&&(this.closeBoxURL_=e.closeBoxURL),typeof e.infoBoxClearance!="undefined"&&(this.infoBoxClearance_=e.infoBoxClearance),typeof e.isHidden!="undefined"&&(this.isHidden_=e.isHidden),typeof e.enableEventPropagation!="undefined"&&(this.enableEventPropagation_=e.enableEventPropagation),this.div_&&this.draw()},InfoBox.prototype.setContent=function(e){this.content_=e,this.div_&&(this.closeListener_&&(google.maps.event.removeListener(this.closeListener_),this.closeListener_=null),this.fixedWidthSet_||(this.div_.style.width=""),typeof e.nodeType=="undefined"?this.div_.innerHTML=this.getCloseBoxImg_()+e:(this.div_.innerHTML=this.getCloseBoxImg_(),this.div_.appendChild(e)),this.fixedWidthSet_||(this.div_.style.width=this.div_.offsetWidth+"px",typeof e.nodeType=="undefined"?this.div_.innerHTML=this.getCloseBoxImg_()+e:(this.div_.innerHTML=this.getCloseBoxImg_(),this.div_.appendChild(e))),this.addClickHandler_()),google.maps.event.trigger(this,"content_changed")},InfoBox.prototype.setPosition=function(e){this.position_=e,this.div_&&this.draw(),google.maps.event.trigger(this,"position_changed")},InfoBox.prototype.setZIndex=function(e){this.zIndex_=e,this.div_&&(this.div_.style.zIndex=e),google.maps.event.trigger(this,"zindex_changed")},InfoBox.prototype.getContent=function(){return this.content_},InfoBox.prototype.getPosition=function(){return this.position_},InfoBox.prototype.getZIndex=function(){return this.zIndex_},InfoBox.prototype.show=function(){this.isHidden_=!1,this.div_&&(this.div_.style.visibility="visible")},InfoBox.prototype.hide=function(){this.isHidden_=!0,this.div_&&(this.div_.style.visibility="hidden")},InfoBox.prototype.open=function(e,t){var n=this;t&&(this.position_=t.getPosition(),this.moveListener_=google.maps.event.addListener(t,"position_changed",function(){n.setPosition(this.getPosition())})),this.setMap(e),this.div_&&this.panBox_()},InfoBox.prototype.close=function(){var e;this.closeListener_&&(google.maps.event.removeListener(this.closeListener_),this.closeListener_=null);if(this.eventListeners_){for(e=0;e<this.eventListeners_.length;e++)google.maps.event.removeListener(this.eventListeners_[e]);this.eventListeners_=null}this.moveListener_&&(google.maps.event.removeListener(this.moveListener_),this.moveListener_=null),this.contextListener_&&(google.maps.event.removeListener(this.contextListener_),this.contextListener_=null),this.setMap(null)};
