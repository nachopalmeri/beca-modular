import test from 'node:test';
import assert from 'node:assert/strict';
import { projectYield, stressScenarios } from '../yield.mjs';

const base={capital:1200,obligations:1000,months:12,payoutMonths:12,investmentPct:100,rate:4,cost:5,loss:0,delayDays:0,noticeDays:14,recipient:'education',studentShare:50,awardAmount:500,exposeCommitted:false};

test('safe allocation never invests committed scholarship principal',()=>{
 const r=projectYield(base);
 assert.equal(r.surplus,200); assert.equal(r.investment,200); assert.equal(r.liquidStart,1000);
 assert.ok(Math.abs(r.paidOnTime-1000)<0.01); assert.equal(r.dueDateTopUp,0); assert.equal(r.capitalTopUp,0);
});

test('committed amount equal to the full pool leaves no investable balance',()=>{
 const r=projectYield({...base,capital:1000,obligations:1000});
 assert.equal(r.investment,0); assert.equal(r.gross,0); assert.equal(r.paidOnTime,1000);
});

test('positive net is distributed only under the selected policy',()=>{
 const r=projectYield(base); assert.ok(Math.abs(r.gross-8)<1e-9); assert.equal(r.net,3);
 assert.equal(r.education,3); assert.equal(r.student,0); assert.equal(r.program,0);
 const student=projectYield({...base,recipient:'student'}); assert.equal(student.student,3);
 const split=projectYield({...base,recipient:'split',studentShare:40}); assert.equal(split.student,1.2); assert.equal(split.education,1.8);
 const sponsor=projectYield({...base,recipient:'sponsor'}); assert.equal(sponsor.program,3);
});

test('losses and costs eliminate distributable result without charging the student',()=>{
 const r=projectYield({...base,loss:5,cost:20,recipient:'student'});
 assert.equal(r.net,-22.4); assert.equal(r.distributable,0); assert.equal(r.student,0); assert.equal(r.capitalTopUp,0);
});

test('unsafe exposure is visibly capable of putting installments at risk',()=>{
 const r=projectYield({...base,exposeCommitted:true,investmentPct:70,delayDays:45,noticeDays:14});
 assert.equal(r.investment,840); assert.ok(r.paidOnTime<1000); assert.ok(r.dueDateTopUp>0); assert.ok(r.peakArrears>0);
});

test('loss on exposed commitments produces a funding top-up requirement',()=>{
 const r=projectYield({...base,capital:1000,obligations:1000,exposeCommitted:true,investmentPct:100,loss:5});
 assert.equal(r.capitalTopUp,55); assert.equal(r.distributable,0); assert.ok(r.dueDateTopUp>=50);
});

test('exit inside notice window can be used in the simplified on-time scenario',()=>{
 const r=projectYield({...base,exposeCommitted:true,investmentPct:50,delayDays:10,noticeDays:14});
 assert.equal(r.exitOnTime,true); assert.equal(r.dueDateTopUp,0); assert.ok(Math.abs(r.paidOnTime-1000)<0.01);
});

test('ten stress cases include a no-surplus case and preserve unpaid obligations',()=>{
 const rows=stressScenarios(base); assert.equal(rows.length,10);
 assert.equal(rows[9].name,'Sin excedente libre'); assert.equal(rows[9].invested,0); assert.equal(rows[9].paidOnTime,1200);
 assert.ok(rows.some(x=>x.name==='Retiro 90 días / aviso 14'));
});

test('scenario ledger sums installment obligations when on time',()=>{
 const r=projectYield(base); assert.equal(r.rows.length,12);
 assert.ok(Math.abs(r.rows.reduce((sum,row)=>sum+row.installment,0)-1000)<1e-8);
 assert.ok(r.rows.every(row=>row.arrears===0));
});

test('education returns show only whole additional awards and their remainder',()=>{
 const none=projectYield(base);
 assert.equal(none.potentialAwards,0); assert.equal(none.remainingEducation,3);
 const one=projectYield({...base,rate:100,cost:0,awardAmount:100});
 assert.equal(one.education,200); assert.equal(one.potentialAwards,2); assert.equal(one.remainingEducation,0);
 const student=projectYield({...base,recipient:'student',rate:100,cost:0,awardAmount:100});
 assert.equal(student.student,200); assert.equal(student.potentialAwards,0);
});

test('invalid assumptions and beneficiary policies are rejected',()=>{
 for(const patch of [{months:1.5},{months:0},{payoutMonths:13},{investmentPct:101},{capital:-1},{obligations:-1},{rate:NaN},{rate:101},{loss:101},{cost:-1},{delayDays:181},{noticeDays:31},{studentShare:101},{awardAmount:0},{awardAmount:0.001},{recipient:'owner'}]) assert.throws(()=>projectYield({...base,...patch}),RangeError);
});
