(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-4866d462"],{"498a":function(t,e,a){"use strict";var r=a("23e7"),i=a("58a8").trim,n=a("c8d2");r({target:"String",proto:!0,forced:n("trim")},{trim:function(){return i(this)}})},5899:function(t,e){t.exports="\t\n\v\f\r                　\u2028\u2029\ufeff"},"58a8":function(t,e,a){var r=a("1d80"),i=a("5899"),n="["+i+"]",s=RegExp("^"+n+n+"*"),l=RegExp(n+n+"*$"),o=function(t){return function(e){var a=String(r(e));return 1&t&&(a=a.replace(s,"")),2&t&&(a=a.replace(l,"")),a}};t.exports={start:o(1),end:o(2),trim:o(3)}},7640:function(t,e,a){"use strict";a.r(e);var r=a("7a23"),i=Object(r["Q"])("data-v-327806b3");Object(r["x"])("data-v-327806b3");var n={class:"p-grid p-fluid"},s={class:"p-col-12"},l={class:"card"},o={class:"p-fluid p-formgrid p-grid"},u={class:"p-field p-col-12 p-md-6"},c=Object(r["k"])("label",null,"First Name",-1),d={class:"p-error"},m={class:"p-field p-col-12 p-md-6"},v=Object(r["k"])("label",null,"Last Name",-1),f={class:"p-error"},p={class:"p-field p-col-12 p-md-6"},b=Object(r["k"])("label",null,"Email",-1),h={class:"p-col-4 p-offset-8"};Object(r["v"])();var j=i((function(t,e,a,i,j,O){var k=Object(r["C"])("InputText"),_=Object(r["C"])("Button");return Object(r["u"])(),Object(r["f"])("div",n,[Object(r["k"])("div",s,[Object(r["k"])("div",l,[Object(r["k"])("div",o,[Object(r["k"])("div",u,[c,Object(r["k"])(k,{modelValue:j.tutor.first_name,"onUpdate:modelValue":e[1]||(e[1]=function(t){return j.tutor.first_name=t}),type:"text",class:{"p-invalid":j.validationErrors.first_name&&j.submitted}},null,8,["modelValue","class"]),Object(r["N"])(Object(r["k"])("small",d,"First Name is required.",512),[[r["K"],j.validationErrors.first_name&&j.submitted]])]),Object(r["k"])("div",m,[v,Object(r["k"])(k,{modelValue:j.tutor.last_name,"onUpdate:modelValue":e[2]||(e[2]=function(t){return j.tutor.last_name=t}),type:"text",class:{"p-invalid":j.validationErrors.last_name&&j.submitted}},null,8,["modelValue","class"]),Object(r["N"])(Object(r["k"])("small",f,"Last Name is required.",512),[[r["K"],j.validationErrors.last_name&&j.submitted]])]),Object(r["k"])("div",p,[b,Object(r["k"])(k,{id:"email",modelValue:j.tutor.email,"onUpdate:modelValue":e[3]||(e[3]=function(t){return j.tutor.email=t}),type:"text",class:{"p-invalid":j.validationErrors.email&&j.submitted}},null,8,["modelValue","class"]),Object(r["N"])(Object(r["k"])("small",{class:"p-error"},Object(r["G"])(j.validationErrors.email),513),[[r["K"],j.validationErrors.email&&j.submitted]])]),Object(r["k"])("div",h,[Object(r["k"])(_,{onClick:O.addTutor,label:"Submit",class:"p-button-raised"},null,8,["onClick"])])])])])])})),O=(a("b64b"),a("498a"),a("96cf"),a("1da1")),k=a("54ef"),_={data:function(){return{tutor:{first_name:"",last_name:"",email:""},familyGroups:null,validationErrors:{},submitted:!1,avatars:[null,"avatar_1.png","avatar_2.png","avatar_3.png","avatar_4.png"]}},familyGroupService:null,studentService:null,tutorService:null,created:function(){this.tutorService=new k["a"]},mounted:function(){return Object(O["a"])(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:case"end":return t.stop()}}),t)})))()},methods:{addTutor:function(){var t=this;return Object(O["a"])(regeneratorRuntime.mark((function e(){var a;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(t.submitted=!0,!t.validateForm()){e.next=16;break}return e.prev=2,e.next=5,t.tutorService.addTutor(t.tutor);case 5:a=e.sent,console.log(a),a=a.tutor,t.showSuccess("Add Tutor Success","Successfully added "+a.first_name+" "+a.last_name),t.reset(),e.next=16;break;case 12:e.prev=12,e.t0=e["catch"](2),console.log(e.t0.response.data),t.showFail("Add Tutor Failed",e.t0);case 16:case"end":return e.stop()}}),e,null,[[2,12]])})))()},reset:function(){this.tutor={first_name:"",last_name:"",email:""}},validateForm:function(){return this.tutor.first_name.trim()?delete this.validationErrors["first_name"]:this.validationErrors["first_name"]=!0,this.tutor.last_name.trim()?delete this.validationErrors["last_name"]:this.validationErrors["last_name"]=!0,this.tutor.email.trim()&&!this.validateEmail(this.tutor.email.trim())?this.validationErrors["email"]="Invalid email.":delete this.validationErrors["email"],!Object.keys(this.validationErrors).length},validateEmail:function(t){var e=/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;return e.test(String(t).toLowerCase())},showSuccess:function(t,e){this.$toast.add({severity:"success",summary:t,detail:e,life:3e3})},showFail:function(t,e){this.$toast.add({severity:"error",summary:t,detail:e,life:3e3})}}};a("85d4");_.render=j,_.__scopeId="data-v-327806b3";e["default"]=_},"85d4":function(t,e,a){"use strict";a("89c6")},"89c6":function(t,e,a){},c8d2:function(t,e,a){var r=a("d039"),i=a("5899"),n="​᠎";t.exports=function(t){return r((function(){return!!i[t]()||n[t]()!=n||i[t].name!==t}))}}}]);
//# sourceMappingURL=chunk-4866d462.bf08a66a.js.map