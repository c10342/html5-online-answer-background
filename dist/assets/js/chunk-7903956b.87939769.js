(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-7903956b"],{"268f":function(e,t,r){e.exports=r("fde4")},"454f":function(e,t,r){r("46a7");var n=r("584a").Object;e.exports=function(e,t,r){return n.defineProperty(e,t,r)}},"46a7":function(e,t,r){var n=r("63b6");n(n.S+n.F*!r("8e60"),"Object",{defineProperty:r("d9f6").f})},"85f2":function(e,t,r){e.exports=r("454f")},aca2:function(e,t,r){"use strict";var n=r("bdfb"),a=r.n(n);a.a},af5b:function(e,t,r){"use strict";r.r(t);var n=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("bg",[[r("div",{staticClass:"form_container"},[r("el-form",{ref:"Form",staticClass:"form",attrs:{model:e.form,rules:e.rules,"label-width":"80px"}},[r("el-form-item",{attrs:{label:"新用户名",prop:"name"}},[r("el-input",{attrs:{placeholder:"请输入新用户名"},model:{value:e.form.name,callback:function(t){e.$set(e.form,"name",t)},expression:"form.name"}})],1),r("el-form-item",[r("el-button",{staticClass:"submit_btn",attrs:{type:"primary"},on:{click:function(t){e.submitForm("Form")}}},[e._v("修改用户名")])],1)],1)],1)]],2)},a=[],o=(r("6b54"),r("96cf"),r("3b8d")),s=r("cebc"),c=r("adb5"),u=r("2f62"),i={data:function(){return{form:{name:""},rules:{name:[{required:!0,message:"用户名不能为空",trigger:"blur"},{min:2,max:30,message:"用户名长度应为2到30个字符",trigger:"blur"}]}}},methods:Object(s["a"])({},Object(u["c"])(["setUserInfo"]),{submitForm:function(e){var t=this;this.$refs[e].validate(function(){var e=Object(o["a"])(regeneratorRuntime.mark(function e(r){var n;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:if(!r){e.next=11;break}return e.prev=1,e.next=4,Object(c["b"])("/api/user/updateName",Object(s["a"])({},t.form,{_id:t.userInfo._id}));case 4:n=e.sent,200==n.statusCode?(t.$message({showClose:!0,message:n.message,type:"success"}),t.setUserInfo(n.data.userInfo),t.$router.push({name:"home"})):t.$message({showClose:!0,message:n.message,type:"warning"}),e.next=11;break;case 8:e.prev=8,e.t0=e["catch"](1),t.$message({showClose:!0,message:e.t0.toString(),type:"error"});case 11:case"end":return e.stop()}},e,this,[[1,8]])}));return function(t){return e.apply(this,arguments)}}())}}),computed:Object(s["a"])({},Object(u["b"])(["userInfo"]))},f=i,b=(r("aca2"),r("2877")),m=Object(b["a"])(f,n,a,!1,null,"ab1ef816",null);m.options.__file="UpdateName.vue";t["default"]=m.exports},bdfb:function(e,t,r){},bf90:function(e,t,r){var n=r("36c3"),a=r("bf0b").f;r("ce7e")("getOwnPropertyDescriptor",function(){return function(e,t){return a(n(e),t)}})},cebc:function(e,t,r){"use strict";var n=r("268f"),a=r.n(n),o=r("e265"),s=r.n(o),c=r("a4bb"),u=r.n(c),i=r("85f2"),f=r.n(i);function b(e,t,r){return t in e?f()(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function m(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{},n=u()(r);"function"===typeof s.a&&(n=n.concat(s()(r).filter(function(e){return a()(r,e).enumerable}))),n.forEach(function(t){b(e,t,r[t])})}return e}r.d(t,"a",function(){return m})},e265:function(e,t,r){e.exports=r("ed33")},ed33:function(e,t,r){r("014b"),e.exports=r("584a").Object.getOwnPropertySymbols},fde4:function(e,t,r){r("bf90");var n=r("584a").Object;e.exports=function(e,t){return n.getOwnPropertyDescriptor(e,t)}}}]);
//# sourceMappingURL=chunk-7903956b.87939769.js.map