"use strict";(self.webpackChunkchurchvest_v2=self.webpackChunkchurchvest_v2||[]).push([[611],{2118:(p,d,i)=>{i.d(d,{m:()=>l});var o=i(7716);let l=(()=>{class t{constructor(){}ngOnInit(){}}return t.\u0275fac=function(c){return new(c||t)},t.\u0275cmp=o.Xpm({type:t,selectors:[["app-loading-roller"]],decls:14,vars:0,consts:[[1,"d-flex","align-items-center","flex-column","my-5"],[1,"lds-default"]],template:function(c,m){1&c&&(o.TgZ(0,"section",0),o.TgZ(1,"div",1),o._UZ(2,"div"),o._UZ(3,"div"),o._UZ(4,"div"),o._UZ(5,"div"),o._UZ(6,"div"),o._UZ(7,"div"),o._UZ(8,"div"),o._UZ(9,"div"),o._UZ(10,"div"),o._UZ(11,"div"),o._UZ(12,"div"),o._UZ(13,"div"),o.qZA(),o.qZA())},styles:[".mw-450[_ngcontent-%COMP%]{min-width:450px}"]}),t})()},6314:(p,d,i)=>{i.d(d,{a:()=>t});var o=i(8583),l=i(7716);let t=(()=>{class s{}return s.\u0275fac=function(m){return new(m||s)},s.\u0275mod=l.oAB({type:s}),s.\u0275inj=l.cJS({imports:[[o.ez]]}),s})()},9611:(p,d,i)=>{i.r(d),i.d(d,{ActivityModule:()=>P});var o=i(8583),l=i(4655),t=i(7716),s=i(8002),c=i(5304),m=i(2592),Z=i(2340),f=i(1841),h=i(7556);let w=(()=>{class e{constructor(n,r){this.http=n,this.authService=r,this.authService.getChurchSlug()}fetchSummary(){return this.http.get(Z.N.managementbaseUrl+`/${this.authService.getChurchSlug()}/summary`).pipe((0,s.U)(n=>n),(0,c.K)(m.S))}}return e.\u0275fac=function(n){return new(n||e)(t.LFG(f.eN),t.LFG(h.e))},e.\u0275prov=t.Yz7({token:e,factory:e.\u0275fac,providedIn:"root"}),e})();var A=i(7423),u=i(5245),_=i(2118),g=i(5086);const b=["scrollItems"];function T(e,a){1&e&&(t.ynx(0),t._UZ(1,"app-loading-roller"),t.BQk())}function x(e,a){if(1&e&&(t.TgZ(0,"div",10),t.TgZ(1,"div",15),t._UZ(2,"img",16),t.TgZ(3,"div",17),t.TgZ(4,"span"),t.TgZ(5,"mat-icon"),t._uU(6,"more_horiz"),t.qZA(),t.qZA(),t.TgZ(7,"mat-menu",null,18),t.TgZ(9,"button",19),t._uU(10," View all "),t.qZA(),t.qZA(),t.qZA(),t.qZA(),t.TgZ(11,"label",20),t._uU(12),t.qZA(),t.TgZ(13,"label",21),t._uU(14),t.qZA(),t.qZA()),2&e){const n=a.$implicit,r=t.MAs(8);t.xp6(2),t.Q6J("src","assets/img/svg/"+n.icon+".svg",t.LSH),t.xp6(1),t.Q6J("matMenuTriggerFor",r),t.xp6(6),t.Q6J("routerLink",n.url),t.xp6(3),t.Oqu(n.count),t.xp6(2),t.Oqu(n.title)}}let C=(()=>{class e{constructor(n){this.summaryService=n,this._loading_=!1,this.activitiesItems=[]}ngOnInit(){this.getSummary()}scrollRight(){this.scrollItems.nativeElement.scrollTo({left:this.scrollItems.nativeElement.scrollLeft+400,behavior:"smooth"})}scrollLeft(){this.scrollItems.nativeElement.scrollTo({left:this.scrollItems.nativeElement.scrollLeft-400,behavior:"smooth"})}getSummary(){this._loading_=!0,this.summaryService.fetchSummary().subscribe(n=>{this._loading_=!1;const{summary:r}=n.data;this.getActivitySummary(r)},()=>{this._loading_=!1})}getActivitySummary(n){this.activitiesItems=[{title:"Regular Members",url:"/portal/people/members",count:n.regular_members,icon:"plus-heart"},{title:"New Departments",url:"/portal/department",count:n.departments,icon:"square-add"},{title:"Events",url:"/portal/events",count:n.events,icon:"events-icon"},{title:"Fellowships",url:"/portal/people/house-fellowship",count:n.fellowships,icon:"hand_with_love"},{title:"Reconciled",url:"",count:"0",icon:"reconciliation"}]}}return e.\u0275fac=function(n){return new(n||e)(t.Y36(w))},e.\u0275cmp=t.Xpm({type:e,selectors:[["app-stats-overview"]],viewQuery:function(n,r){if(1&n&&t.Gf(b,5),2&n){let v;t.iGM(v=t.CRH())&&(r.scrollItems=v.first)}},decls:47,vars:2,consts:[[1,"stats-overview"],[1,"d-flex","justify-content-end","mb-res"],["mat-mini-fab","",1,"me-2","white-bg",3,"click"],["mat-mini-fab","",1,"white-bg",3,"click"],[1,"card--list--wrap"],["scrollItems",""],[4,"ngIf"],[1,"items-wrap"],["class","card",4,"ngFor","ngForOf"],[1,"transactions"],[1,"card"],[1,"title-sm","mb-3"],[1,"item","d-flex","justify-content-between","align-items-center"],[1,"icon","d-flex"],[1,"f12"],[1,"d-flex","justify-content-between","align-items-center"],["alt","people",1,"icon",3,"src"],[1,"cursor",3,"matMenuTriggerFor"],["menu","matMenu"],["type","button","mat-menu-item","",3,"routerLink"],[1,"title-lg"],[1,"f14","txt-grey"]],template:function(n,r){1&n&&(t.TgZ(0,"section",0),t.TgZ(1,"div",1),t.TgZ(2,"button",2),t.NdJ("click",function(){return r.scrollLeft()}),t.TgZ(3,"mat-icon"),t._uU(4,"navigate_before"),t.qZA(),t.qZA(),t.TgZ(5,"button",3),t.NdJ("click",function(){return r.scrollRight()}),t.TgZ(6,"mat-icon"),t._uU(7,"navigate_next"),t.qZA(),t.qZA(),t.qZA(),t.TgZ(8,"div",4,5),t.YNc(10,T,2,0,"ng-container",6),t.TgZ(11,"div",7),t.YNc(12,x,15,5,"div",8),t.qZA(),t.qZA(),t.TgZ(13,"div",9),t.TgZ(14,"div",10),t.TgZ(15,"div",11),t._uU(16,"Pending Transactions"),t.qZA(),t.TgZ(17,"div",12),t.TgZ(18,"div",13),t.TgZ(19,"mat-icon"),t._uU(20,"pending_actions"),t.qZA(),t.qZA(),t.TgZ(21,"label",14),t._uU(22,"Adam Smith"),t.qZA(),t.TgZ(23,"label",14),t._uU(24,"Update marketing campaign"),t.qZA(),t.TgZ(25,"label",14),t._uU(26,"Feb 12"),t.qZA(),t.qZA(),t.TgZ(27,"div",12),t.TgZ(28,"div",13),t.TgZ(29,"mat-icon"),t._uU(30,"pending_actions"),t.qZA(),t.qZA(),t.TgZ(31,"label",14),t._uU(32,"Jeremiah Austin"),t.qZA(),t.TgZ(33,"label",14),t._uU(34,"Update marketing campaign"),t.qZA(),t.TgZ(35,"label",14),t._uU(36,"Feb 12"),t.qZA(),t.qZA(),t.TgZ(37,"div",12),t.TgZ(38,"div",13),t.TgZ(39,"mat-icon"),t._uU(40,"pending_actions"),t.qZA(),t.qZA(),t.TgZ(41,"label",14),t._uU(42,"Ezekiel Davies"),t.qZA(),t.TgZ(43,"label",14),t._uU(44,"Update marketing campaign"),t.qZA(),t.TgZ(45,"label",14),t._uU(46,"Feb 12"),t.qZA(),t.qZA(),t.qZA(),t.qZA(),t.qZA()),2&n&&(t.xp6(10),t.Q6J("ngIf",r._loading_),t.xp6(2),t.Q6J("ngForOf",r.activitiesItems))},directives:[A.lW,u.Hw,o.O5,o.sg,_.m,g.p6,g.VK,g.OP,l.rH],styles:[".stats-overview{position:relative;width:800px}  .stats-overview .mat-mini-fab.mat-accent.white-bg{background:none;box-shadow:none}  .stats-overview .mat-mini-fab.mat-accent.white-bg mat-icon{color:#000}  .stats-overview .mat-mini-fab.mat-accent.white-bg:hover{background:white;box-shadow:0 1px 15px 2px #d2daf5}  .stats-overview .card--list--wrap{overflow:hidden}  .stats-overview .card--list--wrap .items-wrap{padding:1em 0 1.5em;flex-wrap:nowrap;display:flex;align-items:flex-start;justify-content:center;margin:0 auto;width:1369px}  .stats-overview .card--list--wrap .card{padding:1em;width:258px;height:188px;margin:.5em;border:none;border-radius:10px;box-shadow:0 1px 15px 2px #d2daf5}  .stats-overview .card--list--wrap .card .title-lg{font-size:40px}  .stats-overview .card--list--wrap .card label.txt-grey{width:35%}  .stats-overview .card--list--wrap .card .icon{width:50px}  .stats-overview .transactions .card{background:#ffffff6b;border-radius:10px;border:none;box-shadow:0 1px 3px #fff;padding:1em}  .stats-overview .transactions .card .item{padding:1em;border-radius:10px;transition:.3s ease-in}  .stats-overview .transactions .card .item .icon{background:#cdd7fa;border-radius:8px;padding:.3em}  .stats-overview .transactions .card .item .icon mat-icon{color:#fff}  .stats-overview .transactions .card .item label{width:150px;text-overflow:ellipsis;overflow:hidden;white-space:nowrap}  .stats-overview .transactions .card .item label:last-child{width:-moz-fit-content;width:fit-content}  .stats-overview .transactions .card .item:hover{background:#fff}  .stats-overview .transactions .card .item:hover label{color:#463e79;transition:.3s ease-in}  .stats-overview .transactions .card .item:last-child{margin-bottom:0}@media only screen and (min-width: 320px) and (max-width: 991px){  .stats-overview{width:auto}  .stats-overview .mb-res{display:none!important}  .stats-overview .card--list--wrap{overflow:visible}  .stats-overview .card--list--wrap .items-wrap{width:auto;justify-content:flex-start;flex-direction:column}  .stats-overview .card--list--wrap .card{width:100%;margin:0 0 1em}  .stats-overview .transactions .card{display:none!important}}"]}),e})(),y=(()=>{class e{constructor(){}ngOnInit(){}}return e.\u0275fac=function(n){return new(n||e)},e.\u0275cmp=t.Xpm({type:e,selectors:[["app-events"]],decls:36,vars:0,consts:[[1,"event-list-wrap"],[1,"title-sm"],[1,"list--items"],[1,"item","d-flex","align-items-center"],[1,"icon","d-flex","align-items-center","me-2"],[1,"overdue-event","mt-auto"],[1,"d-flex","flex-column"],[1,"f12","txt-grey"]],template:function(n,r){1&n&&(t.TgZ(0,"section",0),t.TgZ(1,"div",1),t._uU(2,"Upcoming Events"),t.qZA(),t.TgZ(3,"div",2),t.TgZ(4,"div",3),t.TgZ(5,"div",4),t.TgZ(6,"mat-icon"),t._uU(7,"receipt"),t.qZA(),t.qZA(),t.TgZ(8,"label"),t._uU(9,"Assign new member "),t.TgZ(10,"span"),t._uU(11,"March, 6, 10:00PM"),t.qZA(),t.qZA(),t.qZA(),t.TgZ(12,"div",3),t.TgZ(13,"div",4),t.TgZ(14,"mat-icon"),t._uU(15,"receipt"),t.qZA(),t.qZA(),t.TgZ(16,"label"),t._uU(17,"Sign board resolution"),t.TgZ(18,"span"),t._uU(19,"June, 8, 10:00PM"),t.qZA(),t.qZA(),t.qZA(),t.TgZ(20,"div",3),t.TgZ(21,"div",4),t.TgZ(22,"mat-icon"),t._uU(23,"receipt"),t.qZA(),t.qZA(),t.TgZ(24,"label"),t._uU(25,"Finish onboarding John Doe "),t.TgZ(26,"span"),t._uU(27,"June, 8, 10:00PM"),t.qZA(),t.qZA(),t.qZA(),t.qZA(),t.TgZ(28,"div",5),t.TgZ(29,"div",6),t.TgZ(30,"label"),t._uU(31,"Board Meeting "),t.TgZ(32,"span",7),t._uU(33,"Feb 12"),t.qZA(),t.qZA(),t.TgZ(34,"p"),t._uU(35," You have been invited to attend the following meeting with directions "),t.qZA(),t.qZA(),t.qZA(),t.qZA())},directives:[u.Hw],styles:['.event-list-wrap[_ngcontent-%COMP%]{display:flex;flex-direction:column;padding:1em;border-radius:10px;background:#ffffff;box-shadow:0 1px 15px 2px #fff;height:100%}.event-list-wrap[_ngcontent-%COMP%]   .list--items[_ngcontent-%COMP%]{margin:2em 0 3em}.event-list-wrap[_ngcontent-%COMP%]   .list--items[_ngcontent-%COMP%]   .item[_ngcontent-%COMP%]{margin-bottom:1em}.event-list-wrap[_ngcontent-%COMP%]   .list--items[_ngcontent-%COMP%]   .item[_ngcontent-%COMP%]   .icon[_ngcontent-%COMP%]{background:#cdd7fa;border-radius:8px;padding:.3em}.event-list-wrap[_ngcontent-%COMP%]   .list--items[_ngcontent-%COMP%]   .item[_ngcontent-%COMP%]   .icon[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{color:#fff}.event-list-wrap[_ngcontent-%COMP%]   .list--items[_ngcontent-%COMP%]   .item[_ngcontent-%COMP%]   label[_ngcontent-%COMP%]{font-size:13px}.event-list-wrap[_ngcontent-%COMP%]   .list--items[_ngcontent-%COMP%]   .item[_ngcontent-%COMP%]   label[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{font-size:12px;color:#0000004d;display:block}.event-list-wrap[_ngcontent-%COMP%]   .overdue-event[_ngcontent-%COMP%]{background:#e3e8f7;border-radius:10px;box-shadow:0 1px 3px 2px #fff;padding:1em}.event-list-wrap[_ngcontent-%COMP%]   .overdue-event[_ngcontent-%COMP%]   label[_ngcontent-%COMP%]{position:relative;padding-left:.5em}.event-list-wrap[_ngcontent-%COMP%]   .overdue-event[_ngcontent-%COMP%]   label[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{display:block}.event-list-wrap[_ngcontent-%COMP%]   .overdue-event[_ngcontent-%COMP%]   label[_ngcontent-%COMP%]:before{content:"";position:absolute;width:7px;height:7px;background:#463e79;border-radius:50%;left:-7px;top:.5em}.event-list-wrap[_ngcontent-%COMP%]   .overdue-event[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{font-size:11px;color:#0000004d;margin:1em 0 0}']}),e})();const M=[{path:"",component:(()=>{class e{constructor(){}ngOnInit(){}}return e.\u0275fac=function(n){return new(n||e)},e.\u0275cmp=t.Xpm({type:e,selectors:[["app-activity"]],decls:7,vars:0,consts:[[1,"header","d-flex","align-items-center","justify-content-between","mb-4"],[1,"title"],[1,"grid","grid--2fr--1fr","grid-gap-30"]],template:function(n,r){1&n&&(t.TgZ(0,"section"),t.TgZ(1,"div",0),t.TgZ(2,"div",1),t._uU(3,"Activity"),t.qZA(),t.qZA(),t.TgZ(4,"div",2),t._UZ(5,"app-stats-overview"),t._UZ(6,"app-events"),t.qZA(),t.qZA())},directives:[C,y],styles:[""]}),e})()}];let O=(()=>{class e{}return e.\u0275fac=function(n){return new(n||e)},e.\u0275mod=t.oAB({type:e}),e.\u0275inj=t.cJS({imports:[[l.Bz.forChild(M)],l.Bz]}),e})();var U=i(8097),q=i(6314);let P=(()=>{class e{}return e.\u0275fac=function(n){return new(n||e)},e.\u0275mod=t.oAB({type:e}),e.\u0275inj=t.cJS({imports:[[o.ez,O,U.h,q.a]]}),e})()}}]);