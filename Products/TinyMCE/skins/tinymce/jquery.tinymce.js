(function($){var undef,lazyLoading,delayedInits=[],win=window;$.fn.tinymce=function(settings){var self=this,url,ed,base,pos,lang,query="",suffix=""; if(!self.length)
return self; if(!settings)
return tinyMCE.get(self[0].id);self.css('visibility','hidden'); function init(){var editors=[],initCount=0; if(applyPatch){applyPatch();applyPatch=null;} 
self.each(function(i,node){var ed,id=node.id,oninit=settings.oninit; if(!id)
node.id=id=tinymce.DOM.uniqueId(); ed=new tinymce.Editor(id,settings);editors.push(ed);ed.onInit.add(function(){var scope,func=oninit;self.css('visibility',''); if(oninit){ if(++initCount==editors.length){if(tinymce.is(func,"string")){scope=(func.indexOf(".")===-1)?null:tinymce.resolve(func.replace(/\.\w+$/,""));func=tinymce.resolve(func);} 
func.apply(scope||tinymce,editors);}}});}); $.each(editors,function(i,ed){ed.render();});} 
if(!win.tinymce&&!lazyLoading&&(url=settings.script_url)){lazyLoading=1;base=url.substring(0,url.lastIndexOf("/")); if(/_(src|dev)\.js/g.test(url))
suffix="_src"; pos=url.lastIndexOf("?");if(pos!=-1)
query=url.substring(pos+1); win.tinyMCEPreInit=win.tinyMCEPreInit||{base:base,suffix:suffix,query:query}; if(url.indexOf('gzip')!=-1){lang=settings.language||"en";url=url+(/\?/.test(url)?'&':'?')+"js=true&core=true&suffix="+escape(suffix)+"&themes="+escape(settings.theme)+"&plugins="+escape(settings.plugins)+"&languages="+lang; if(!win.tinyMCE_GZ){tinyMCE_GZ={start:function(){tinymce.suffix=suffix;function load(url){tinymce.ScriptLoader.markDone(tinyMCE.baseURI.toAbsolute(url));} 
load("langs/"+lang+".js"); load("themes/"+settings.theme+"/editor_template"+suffix+".js");load("themes/"+settings.theme+"/langs/"+lang+".js"); $.each(settings.plugins.split(","),function(i,name){if(name){load("plugins/"+name+"/editor_plugin"+suffix+".js");load("plugins/"+name+"/langs/"+lang+".js");}});},end:function(){}}}} 
$.ajax({type:"GET",url:url,dataType:"script",cache:true,success:function(){tinymce.dom.Event.domLoaded=1;lazyLoading=2; if(settings.script_loaded)
settings.script_loaded();init();$.each(delayedInits,function(i,init){init();});}});}else{ if(lazyLoading===1)
delayedInits.push(init);else
init();}
return self;};$.extend($.expr[":"],{tinymce:function(e){return!!(e.id&&"tinyMCE"in window&&tinyMCE.get(e.id));}}); function applyPatch(){ function removeEditors(name){ if(name==="remove"){this.each(function(i,node){var ed=tinyMCEInstance(node);if(ed)
ed.remove();});}
this.find("span.mceEditor,div.mceEditor").each(function(i,node){var ed=tinyMCE.get(node.id.replace(/_parent$/,""));if(ed)
ed.remove();});} 
function loadOrSave(value){var self=this,ed; if(value!==undef){removeEditors.call(self); self.each(function(i,node){var ed;if(ed=tinyMCE.get(node.id))
ed.setContent(value);});}else if(self.length>0){ if(ed=tinyMCE.get(self[0].id))
return ed.getContent();}} 
function tinyMCEInstance(element){var ed=null;(element)&&(element.id)&&(win.tinymce)&&(ed=tinyMCE.get(element.id));return ed;} 
function containsTinyMCE(matchedSet){return!!((matchedSet)&&(matchedSet.length)&&(win.tinymce)&&(matchedSet.is(":tinymce")));} 
var jQueryFn={}; $.each(["text","html","val"],function(i,name){var origFn=jQueryFn[name]=$.fn[name],textProc=(name==="text");$.fn[name]=function(value){var self=this;if(!containsTinyMCE(self))
return origFn.apply(self,arguments);if(value!==undef){loadOrSave.call(self.filter(":tinymce"),value);origFn.apply(self.not(":tinymce"),arguments);return self;}else{var ret="";var args=arguments;(textProc?self:self.eq(0)).each(function(i,node){var ed=tinyMCEInstance(node);ret+=ed?(textProc?ed.getContent().replace(/<(?:"[^"]*"|'[^']*'|[^'">])*>/g,""):ed.getContent({save:true})):origFn.apply($(node),args);});return ret;}};}); $.each(["append","prepend"],function(i,name){var origFn=jQueryFn[name]=$.fn[name],prepend=(name==="prepend");$.fn[name]=function(value){var self=this;if(!containsTinyMCE(self))
return origFn.apply(self,arguments);if(value!==undef){self.filter(":tinymce").each(function(i,node){var ed=tinyMCEInstance(node);ed&&ed.setContent(prepend?value+ed.getContent():ed.getContent()+value);});origFn.apply(self.not(":tinymce"),arguments);return self;}};}); $.each(["remove","replaceWith","replaceAll","empty"],function(i,name){var origFn=jQueryFn[name]=$.fn[name];$.fn[name]=function(){removeEditors.call(this,name);return origFn.apply(this,arguments);};});jQueryFn.attr=$.fn.attr; $.fn.attr=function(name,value){var self=this,args=arguments;if((!name)||(name!=="value")||(!containsTinyMCE(self))){if(value!==undef){return jQueryFn.attr.apply(self,args);}else{return jQueryFn.attr.apply(self,args);}}
if(value!==undef){loadOrSave.call(self.filter(":tinymce"),value);jQueryFn.attr.apply(self.not(":tinymce"),args);return self;}else{var node=self[0],ed=tinyMCEInstance(node);return ed?ed.getContent({save:true}):jQueryFn.attr.apply($(node),args);}};}})(jQuery);