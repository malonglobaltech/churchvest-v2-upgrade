"use strict";(self.webpackChunkchurchvest_v2=self.webpackChunkchurchvest_v2||[]).push([[592],{1419:(c,o,e)=>{e.d(o,{P:()=>s});var p=e(8583),a=e(8097),r=e(7716);let s=(()=>{class h{}return h.\u0275fac=function(n){return new(n||h)},h.\u0275mod=r.oAB({type:h}),h.\u0275inj=r.cJS({imports:[[p.ez,a.h]]}),h})()},5336:(c,o,e)=>{e.d(o,{r:()=>m});var p=e(8583),a=e(3679),r=e(2290),s=e(8097),h=e(7716);let m=(()=>{class n{}return n.\u0275fac=function(u){return new(u||n)},n.\u0275mod=h.oAB({type:n}),n.\u0275inj=h.cJS({providers:[{provide:r._W}],imports:[[p.ez,s.h,a.UX,a.u5,r.Rh.forRoot({positionClass:"toast-top-right"})]]}),n})()},3476:(c,o,e)=>{e.d(o,{n:()=>l});var p=e(8002),a=e(5304),r=e(2592),s=e(2340),h=e(7716),m=e(1841),n=e(7556);let l=(()=>{class u{constructor(t,_){this.http=t,this.authService=_,this.authService.getChurchSlug()}addDepartment(t){return this.http.post(` ${s.N.managementbaseUrl}/${this.authService.getChurchSlug()}/departments`,t).pipe((0,p.U)(_=>_),(0,a.K)(r.S))}deleteFromTrash(t){return this.http.post(` ${s.N.managementbaseUrl}/${this.authService.getChurchSlug()}/departments/trash/delete`,t).pipe((0,p.U)(_=>_),(0,a.K)(r.S))}fetchAllDepartment(){return this.http.get(`${s.N.managementbaseUrl}/${this.authService.getChurchSlug()}/departments`).pipe((0,a.K)(r.S))}fetchAllFromTrash(t){return this.http.get(`${s.N.managementbaseUrl}/${this.authService.getChurchSlug()}/departments/trash/departments_trashed?page=${t}`).pipe((0,a.K)(r.S))}fetchDepartmentDetails(t,_){return this.http.get(s.N.managementbaseUrl+`/${this.authService.getChurchSlug()}/departments/${t}`).pipe((0,a.K)(r.S))}fetchDeptFromTrash(t){return this.http.get(`${s.N.managementbaseUrl}/${this.authService.getChurchSlug()}/departments/trash?page=${t}`).pipe((0,a.K)(r.S))}fetchTrashedDept(t){return this.http.get(s.N.managementbaseUrl+`${this.authService.getChurchSlug()}/departments/trash/${t}`).pipe((0,a.K)(r.S))}getAllDepartment(t){return this.http.get(`${s.N.managementbaseUrl}/${this.authService.getChurchSlug()}/departments?page=${t}`).pipe((0,a.K)(r.S))}moveToTrash(t){return this.http.post(`${s.N.managementbaseUrl}/${this.authService.getChurchSlug()}/departments/delete`,t)}restore(t){return this.http.post(`${s.N.managementbaseUrl}/${this.authService.getChurchSlug()}/departments/trash/restore`,t).pipe((0,p.U)(_=>_),(0,a.K)(r.S))}updateDepartment(t,_){return this.http.post(` ${s.N.managementbaseUrl}/${this.authService.getChurchSlug()}/departments/${_}/update`,t).pipe((0,p.U)(g=>g),(0,a.K)(r.S))}}return u.\u0275fac=function(t){return new(t||u)(h.LFG(m.eN),h.LFG(n.e))},u.\u0275prov=h.Yz7({token:u,factory:u.\u0275fac,providedIn:"root"}),u})()}}]);