"use strict";(self.webpackChunkchurchvest_v2=self.webpackChunkchurchvest_v2||[]).push([[345],{1345:(T,l,o)=>{o.r(l),o.d(l,{ActivityModule:()=>A});var d=o(8583),r=o(4655),t=o(7716),m=o(7423),g=o(5245),c=o(5086);const v=["scrollItems"];function p(e,i){if(1&e&&(t.TgZ(0,"div",9),t.TgZ(1,"div",14),t._UZ(2,"img",15),t.TgZ(3,"div",16),t.TgZ(4,"span"),t.TgZ(5,"mat-icon"),t._uU(6,"more_horiz"),t.qZA(),t.qZA(),t.TgZ(7,"mat-menu",null,17),t.TgZ(9,"button",18),t._uU(10," View all "),t.qZA(),t.qZA(),t.qZA(),t.qZA(),t.TgZ(11,"label",19),t._uU(12),t.qZA(),t.TgZ(13,"label",20),t._uU(14),t.qZA(),t.qZA()),2&e){const n=i.$implicit,a=t.MAs(8);t.xp6(2),t.Q6J("src","assets/img/svg/"+n.icon+".svg",t.LSH),t.xp6(1),t.Q6J("matMenuTriggerFor",a),t.xp6(6),t.Q6J("routerLink",n.url),t.xp6(3),t.Oqu(n.count),t.xp6(2),t.Oqu(n.title)}}let u=(()=>{class e{constructor(){this.activitiesItems=[{title:"Regular Members",url:"/portal/people/members",count:"1",icon:"plus-heart"},{title:"New Departments",url:"",count:"0",icon:"square-add"},{title:"Income",url:"",count:"0",icon:"income"},{title:"Expense",url:"",count:"0",icon:"expense"},{title:"Reconciled",url:"",count:"0",icon:"reconciliation"}]}ngOnInit(){}scrollRight(){this.scrollItems.nativeElement.scrollTo({left:this.scrollItems.nativeElement.scrollLeft+400,behavior:"smooth"})}scrollLeft(){this.scrollItems.nativeElement.scrollTo({left:this.scrollItems.nativeElement.scrollLeft-400,behavior:"smooth"})}}return e.\u0275fac=function(n){return new(n||e)},e.\u0275cmp=t.Xpm({type:e,selectors:[["app-stats-overview"]],viewQuery:function(n,a){if(1&n&&t.Gf(v,5),2&n){let s;t.iGM(s=t.CRH())&&(a.scrollItems=s.first)}},decls:46,vars:1,consts:[[1,"stats-overview"],[1,"d-flex","justify-content-end","mb-res"],["mat-mini-fab","",1,"me-2","white-bg",3,"click"],["mat-mini-fab","",1,"white-bg",3,"click"],[1,"card--list--wrap"],["scrollItems",""],[1,"items-wrap"],["class","card",4,"ngFor","ngForOf"],[1,"transactions"],[1,"card"],[1,"title-sm","mb-3"],[1,"item","d-flex","justify-content-between","align-items-center"],[1,"icon","d-flex"],[1,"f12"],[1,"d-flex","justify-content-between","align-items-center"],["alt","people",1,"icon",3,"src"],[1,"cursor",3,"matMenuTriggerFor"],["menu","matMenu"],["type","button","mat-menu-item","",3,"routerLink"],[1,"title-lg"],[1,"f14","txt-grey"]],template:function(n,a){1&n&&(t.TgZ(0,"section",0),t.TgZ(1,"div",1),t.TgZ(2,"button",2),t.NdJ("click",function(){return a.scrollLeft()}),t.TgZ(3,"mat-icon"),t._uU(4,"navigate_before"),t.qZA(),t.qZA(),t.TgZ(5,"button",3),t.NdJ("click",function(){return a.scrollRight()}),t.TgZ(6,"mat-icon"),t._uU(7,"navigate_next"),t.qZA(),t.qZA(),t.qZA(),t.TgZ(8,"div",4,5),t.TgZ(10,"div",6),t.YNc(11,p,15,5,"div",7),t.qZA(),t.qZA(),t.TgZ(12,"div",8),t.TgZ(13,"div",9),t.TgZ(14,"div",10),t._uU(15,"Pending Transactions"),t.qZA(),t.TgZ(16,"div",11),t.TgZ(17,"div",12),t.TgZ(18,"mat-icon"),t._uU(19,"pending_actions"),t.qZA(),t.qZA(),t.TgZ(20,"label",13),t._uU(21,"Adam Smith"),t.qZA(),t.TgZ(22,"label",13),t._uU(23,"Update marketing campaign"),t.qZA(),t.TgZ(24,"label",13),t._uU(25,"Feb 12"),t.qZA(),t.qZA(),t.TgZ(26,"div",11),t.TgZ(27,"div",12),t.TgZ(28,"mat-icon"),t._uU(29,"pending_actions"),t.qZA(),t.qZA(),t.TgZ(30,"label",13),t._uU(31,"Jeremiah Austin"),t.qZA(),t.TgZ(32,"label",13),t._uU(33,"Update marketing campaign"),t.qZA(),t.TgZ(34,"label",13),t._uU(35,"Feb 12"),t.qZA(),t.qZA(),t.TgZ(36,"div",11),t.TgZ(37,"div",12),t.TgZ(38,"mat-icon"),t._uU(39,"pending_actions"),t.qZA(),t.qZA(),t.TgZ(40,"label",13),t._uU(41,"Ezekiel Davies"),t.qZA(),t.TgZ(42,"label",13),t._uU(43,"Update marketing campaign"),t.qZA(),t.TgZ(44,"label",13),t._uU(45,"Feb 12"),t.qZA(),t.qZA(),t.qZA(),t.qZA(),t.qZA()),2&n&&(t.xp6(11),t.Q6J("ngForOf",a.activitiesItems))},directives:[m.lW,g.Hw,d.sg,c.p6,c.VK,c.OP,r.rH],styles:[".stats-overview{position:relative;width:800px}  .stats-overview .mat-mini-fab.mat-accent.white-bg{background:none;box-shadow:none}  .stats-overview .mat-mini-fab.mat-accent.white-bg mat-icon{color:#000}  .stats-overview .mat-mini-fab.mat-accent.white-bg:hover{background:white;box-shadow:0 1px 15px 2px #d2daf5}  .stats-overview .card--list--wrap{overflow:hidden}  .stats-overview .card--list--wrap .items-wrap{padding:1em 0 1.5em;flex-wrap:nowrap;display:flex;align-items:flex-start;justify-content:center;margin:0 auto;width:1369px}  .stats-overview .card--list--wrap .card{padding:1em;width:258px;height:188px;margin:.5em;border:none;border-radius:10px;box-shadow:0 1px 15px 2px #d2daf5}  .stats-overview .card--list--wrap .card .title-lg{font-size:40px}  .stats-overview .card--list--wrap .card label.txt-grey{width:35%}  .stats-overview .card--list--wrap .card .icon{width:60px}  .stats-overview .transactions .card{background:#ffffff6b;border-radius:10px;border:none;box-shadow:0 1px 3px #fff;padding:1em}  .stats-overview .transactions .card .item{padding:1em;border-radius:10px;transition:.3s ease-in}  .stats-overview .transactions .card .item .icon{background:#cdd7fa;border-radius:8px;padding:.3em}  .stats-overview .transactions .card .item .icon mat-icon{color:#fff}  .stats-overview .transactions .card .item label{color:#6f6af880;width:150px;text-overflow:ellipsis;overflow:hidden;white-space:nowrap}  .stats-overview .transactions .card .item label:last-child{width:-moz-fit-content;width:fit-content}  .stats-overview .transactions .card .item:hover{background:#fff}  .stats-overview .transactions .card .item:hover label{color:#6f6af8bd;transition:.3s ease-in}  .stats-overview .transactions .card .item:last-child{margin-bottom:0}@media only screen and (min-width: 320px) and (max-width: 991px){  .stats-overview{width:auto}  .stats-overview .mb-res{display:none!important}  .stats-overview .card--list--wrap{overflow:visible}  .stats-overview .card--list--wrap .items-wrap{width:auto;justify-content:flex-start;flex-direction:column}  .stats-overview .card--list--wrap .card{width:100%;margin:0 0 1em}  .stats-overview .transactions .card{display:none!important}}"]}),e})(),Z=(()=>{class e{constructor(){}ngOnInit(){}}return e.\u0275fac=function(n){return new(n||e)},e.\u0275cmp=t.Xpm({type:e,selectors:[["app-events"]],decls:36,vars:0,consts:[[1,"event-list-wrap"],[1,"title-sm"],[1,"list--items"],[1,"item","d-flex","align-items-center"],[1,"icon","d-flex","align-items-center","me-2"],[1,"overdue-event","mt-auto"],[1,"d-flex","flex-column"],[1,"f12","txt-grey"]],template:function(n,a){1&n&&(t.TgZ(0,"section",0),t.TgZ(1,"div",1),t._uU(2,"Upcoming Events"),t.qZA(),t.TgZ(3,"div",2),t.TgZ(4,"div",3),t.TgZ(5,"div",4),t.TgZ(6,"mat-icon"),t._uU(7,"receipt"),t.qZA(),t.qZA(),t.TgZ(8,"label"),t._uU(9,"Assign new member "),t.TgZ(10,"span"),t._uU(11,"March, 6, 10:00PM"),t.qZA(),t.qZA(),t.qZA(),t.TgZ(12,"div",3),t.TgZ(13,"div",4),t.TgZ(14,"mat-icon"),t._uU(15,"receipt"),t.qZA(),t.qZA(),t.TgZ(16,"label"),t._uU(17,"Sign board resolution"),t.TgZ(18,"span"),t._uU(19,"June, 8, 10:00PM"),t.qZA(),t.qZA(),t.qZA(),t.TgZ(20,"div",3),t.TgZ(21,"div",4),t.TgZ(22,"mat-icon"),t._uU(23,"receipt"),t.qZA(),t.qZA(),t.TgZ(24,"label"),t._uU(25,"Finish onboarding John Doe "),t.TgZ(26,"span"),t._uU(27,"June, 8, 10:00PM"),t.qZA(),t.qZA(),t.qZA(),t.qZA(),t.TgZ(28,"div",5),t.TgZ(29,"div",6),t.TgZ(30,"label"),t._uU(31,"Board Meeting "),t.TgZ(32,"span",7),t._uU(33,"Feb 12"),t.qZA(),t.qZA(),t.TgZ(34,"p"),t._uU(35," You have been invited to attend the following meeting with directions "),t.qZA(),t.qZA(),t.qZA(),t.qZA())},directives:[g.Hw],styles:['.event-list-wrap[_ngcontent-%COMP%]{display:flex;flex-direction:column;padding:1em;border-radius:10px;background:#d0d8f96b;box-shadow:0 1px 15px 2px #d2daf6;height:100%}.event-list-wrap[_ngcontent-%COMP%]   .list--items[_ngcontent-%COMP%]{margin:2em 0 3em}.event-list-wrap[_ngcontent-%COMP%]   .list--items[_ngcontent-%COMP%]   .item[_ngcontent-%COMP%]{margin-bottom:1em}.event-list-wrap[_ngcontent-%COMP%]   .list--items[_ngcontent-%COMP%]   .item[_ngcontent-%COMP%]   .icon[_ngcontent-%COMP%]{background:#cdd7fa;border-radius:8px;padding:.3em}.event-list-wrap[_ngcontent-%COMP%]   .list--items[_ngcontent-%COMP%]   .item[_ngcontent-%COMP%]   .icon[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{color:#fff}.event-list-wrap[_ngcontent-%COMP%]   .list--items[_ngcontent-%COMP%]   .item[_ngcontent-%COMP%]   label[_ngcontent-%COMP%]{font-size:13px}.event-list-wrap[_ngcontent-%COMP%]   .list--items[_ngcontent-%COMP%]   .item[_ngcontent-%COMP%]   label[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{font-size:12px;color:#0000004d;display:block}.event-list-wrap[_ngcontent-%COMP%]   .overdue-event[_ngcontent-%COMP%]{background:#fff;border-radius:10px;box-shadow:0 1px 3px 2px #fff;padding:1em}.event-list-wrap[_ngcontent-%COMP%]   .overdue-event[_ngcontent-%COMP%]   label[_ngcontent-%COMP%]{position:relative;padding-left:.5em}.event-list-wrap[_ngcontent-%COMP%]   .overdue-event[_ngcontent-%COMP%]   label[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{display:block}.event-list-wrap[_ngcontent-%COMP%]   .overdue-event[_ngcontent-%COMP%]   label[_ngcontent-%COMP%]:before{content:"";position:absolute;width:7px;height:7px;background:#6f6af8bd;border-radius:50%;left:-7px;top:.5em}.event-list-wrap[_ngcontent-%COMP%]   .overdue-event[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{font-size:11px;color:#0000004d;margin:1em 0 0}']}),e})();const f=[{path:"",component:(()=>{class e{constructor(){}ngOnInit(){}}return e.\u0275fac=function(n){return new(n||e)},e.\u0275cmp=t.Xpm({type:e,selectors:[["app-activity"]],decls:7,vars:0,consts:[[1,"header","d-flex","align-items-center","justify-content-between","mb-4"],[1,"title"],[1,"grid","grid--2fr--1fr","grid-gap-30"]],template:function(n,a){1&n&&(t.TgZ(0,"section"),t.TgZ(1,"div",0),t.TgZ(2,"div",1),t._uU(3,"Activity"),t.qZA(),t.qZA(),t.TgZ(4,"div",2),t._UZ(5,"app-stats-overview"),t._UZ(6,"app-events"),t.qZA(),t.qZA())},directives:[u,Z],styles:[""]}),e})()}];let w=(()=>{class e{}return e.\u0275fac=function(n){return new(n||e)},e.\u0275mod=t.oAB({type:e}),e.\u0275inj=t.cJS({imports:[[r.Bz.forChild(f)],r.Bz]}),e})();var b=o(9273);let A=(()=>{class e{}return e.\u0275fac=function(n){return new(n||e)},e.\u0275mod=t.oAB({type:e}),e.\u0275inj=t.cJS({imports:[[d.ez,w,b.h]]}),e})()}}]);