(this.webpackJsonpapp=this.webpackJsonpapp||[]).push([[0],{33:function(e,t,a){e.exports=a(47)},38:function(e,t,a){},47:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),l=a(26),o=a.n(l),c=(a(38),a(12)),s=a.n(c),i=a(13),u=a(14),m=a(17),d=a(15),h=a(10),f=a(16),b=(a(22),a(11)),p=a.n(b);function v(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},a={};return p.a.isEmpty(t)||(a.headers=t),fetch(e,a).then((function(e){return p.a.get(e,"ok")?e.json():Promise.reject(e)})).then((function(e){return{response:e}}),(function(e){return{error:e.message||"Something bad happened"}}))}function E(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},a={credentials:"same-origin",method:"POST",headers:{Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify(t)};return fetch(e,a).then((function(e){return{response:e}}),(function(e){return{error:e.message||"Something bad happened"}}))}var g=a(27),k=a.n(g),y=a(48),C=a(50),j=a(51),w=function(e){function t(e){var a;return Object(i.a)(this,t),(a=Object(m.a)(this,Object(d.a)(t).call(this,e))).state={form:{name:"",rating:"",feedback:""}},a.handleChange=a.handleChange.bind(Object(h.a)(a)),a.validateForm=a.validateForm.bind(Object(h.a)(a)),a}return Object(f.a)(t,e),Object(u.a)(t,[{key:"handleChange",value:function(e){var t=this.state.form;t[e.target.name]=e.target.value,this.setState({form:t})}},{key:"validateForm",value:function(e){var t,a;return s.a.async((function(n){for(;;)switch(n.prev=n.next){case 0:n.t0=s.a.keys(e);case 1:if((n.t1=n.t0()).done){n.next=7;break}if(t=n.t1.value,!p.a.isEmpty(e[t].toString())){n.next=5;break}return n.abrupt("return");case 5:n.next=1;break;case 7:return n.next=10,s.a.awrap(E("/db/feedbacks",this.state.form));case 10:return a=n.sent,console.log(a),void 0!==typeof a.response&&this.setState({form:{name:"",rating:"",feedback:""}}),n.abrupt("return");case 14:case"end":return n.stop()}}),null,this)}},{key:"render",value:function(){var e=this;return console.log(this.state),r.a.createElement(y.a,null,r.a.createElement(C.a,null,r.a.createElement(C.a.Group,{controlId:"exampleForm.ControlInput1"},r.a.createElement(C.a.Label,null,"Name"),r.a.createElement(C.a.Control,{value:this.state.form.name,type:"text",name:"name",placeholder:"name",onChange:this.handleChange})),r.a.createElement(C.a.Group,{controlId:"exampleForm.ControlTextarea1"},r.a.createElement(C.a.Label,null,"Rating"),r.a.createElement(k.a,{count:5,value:this.state.form.rating,onChange:function(t){return e.handleChange({target:{name:"rating",value:t}})},size:24,color2:"#ffd700"})),r.a.createElement(C.a.Group,{controlId:"exampleForm.ControlTextarea1"},r.a.createElement(C.a.Label,null,"Feedback"),r.a.createElement(C.a.Control,{value:this.state.form.feedback,as:"textarea",name:"feedback",rows:"3",onChange:this.handleChange})),r.a.createElement(j.a,{onClick:function(){return e.validateForm(e.state.form)}},"Submit")))}}]),t}(r.a.Component),x=a(49),O=function(e){function t(e){var a;return Object(i.a)(this,t),(a=Object(m.a)(this,Object(d.a)(t).call(this,e))).state={feedbacks:[]},a.loadFeedbacks=a.loadFeedbacks.bind(Object(h.a)(a)),a.loadFeedbacks(),a}return Object(f.a)(t,e),Object(u.a)(t,[{key:"loadFeedbacks",value:function(){var e;return s.a.async((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,s.a.awrap(v("/db/feedbacks"));case 2:e=t.sent,this.setState({feedbacks:e.response});case 4:case"end":return t.stop()}}),null,this)}},{key:"renderTableRows",value:function(e){return p.a.map(e,(function(e){return r.a.createElement("tr",null,r.a.createElement("td",null,e._id),r.a.createElement("td",null,e.name),r.a.createElement("td",null,e.rating),r.a.createElement("td",null,e.feedback))}))}},{key:"render",value:function(){return r.a.createElement(y.a,null,r.a.createElement(x.a,{striped:!0,bordered:!0,hover:!0},r.a.createElement("thead",null,r.a.createElement("tr",null,r.a.createElement("th",null,"_id"),r.a.createElement("th",null,"Name"),r.a.createElement("th",null,"Rating"),r.a.createElement("th",null,"Feedback"))),r.a.createElement("tbody",null,this.renderTableRows(this.state.feedbacks))))}}]),t}(r.a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));var F=a(29),S=a(9);a.d(t,"Routers",(function(){return T}));var T=function(){return r.a.createElement(F.a,null,r.a.createElement("div",null,r.a.createElement(S.c,null,r.a.createElement(S.a,{path:"/Feedbacks"},r.a.createElement(O,null)),r.a.createElement(S.a,{path:"/"},r.a.createElement(w,null)))))};o.a.render(r.a.createElement(T,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))}},[[33,1,2]]]);
//# sourceMappingURL=main.284192dc.chunk.js.map