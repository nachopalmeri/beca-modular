import test from 'node:test';
import assert from 'node:assert/strict';
import {financial,scenarios,initialSession,transition} from '../model.mjs';

test('base scenario reconciles educational principal and platform accounts independently',()=>{
 const r=financial(scenarios.base);
 assert.equal(r.learners,800);assert.equal(r.allocated,96000);assert.equal(r.payouts,62400);assert.equal(r.unused,33600);
 assert.equal(r.revenue,2500);assert.ok(Math.abs(r.cogs-2414.4)<1e-8);assert.ok(Math.abs(r.result+5914.4)<1e-8);assert.equal(r.breakEven,701);
 assert.equal(r.allocated,r.payouts+r.unused);assert.equal(r.totalSponsorOutlay,r.payouts+r.revenue);
});
test('all scenario accounts conserve funds including optional sponsor surcharge',()=>{
 for(const preset of Object.values(scenarios)) for(const utilization of [0,1,65,100]) for(const fee of [0,2,10]){
  const r=financial({...preset,utilization,fee});
  assert.ok(Math.abs(r.allocated-r.payouts-r.unused)<1e-7);
  assert.ok(Math.abs(r.revenue-r.subscriptionRevenue-r.feeRevenue)<1e-7);
  assert.ok(Math.abs(r.result-(r.revenue-r.payment-r.infraCost-r.aiCost-r.supportCost-r.fixed))<1e-7);
  assert.ok(r.payouts>=0&&r.unused>=0);
 }
});
test('no sponsors and no revenue avoid divide-by-zero or imaginary break-even',()=>{
 const r=financial({...scenarios.base,sponsors:0,subscription:0});assert.equal(r.revenue,0);assert.equal(r.margin,null);assert.equal(r.result,-6000);assert.equal(r.breakEven,null);
});
test('invalid and fractional count inputs rejected',()=>{
 for(const invalid of [{utilization:101},{fee:-1},{sponsors:NaN},{students:2.5},{budget:Infinity}])assert.throws(()=>financial({...scenarios.base,...invalid}),RangeError);
});
test('higher utilization pays providers more but does not create license revenue',()=>{
 const a=financial(scenarios.base),b=financial({...scenarios.base,utilization:80});assert.ok(b.payouts>a.payouts);assert.equal(a.revenue,b.revenue);assert.ok(b.result<a.result);
});
test('optimistic profit requires the explicitly higher license assumption',()=>{
 const r=financial(scenarios.optimistic);assert.equal(r.revenue,30000);assert.equal(r.cogs,10179);assert.equal(r.result,7821);
 const cheaper=financial({...scenarios.optimistic,subscription:500});assert.equal(cheaper.result,-7179);
});
test('session closes exact cumulative total instead of adding accumulated vouchers',()=>{
 let s=transition(initialSession(),{type:'open'});
 for(const [id,price]of [['a',200],['b',300],['c',400]])s=transition(s,{type:'consume',id,price});
 assert.equal(s.authorized,900);s=transition(s,{type:'close'});assert.equal(s.settled,900);assert.equal(s.returned,100);assert.equal(s.settled+s.returned,s.cap);
});
test('cap, duplicate, pause and closed-session requests cannot alter liability',()=>{
 let s=transition(initialSession(),{type:'open'});s=transition(s,{type:'consume',id:'a',price:200});
 const before=JSON.stringify(s);assert.throws(()=>transition(s,{type:'consume',id:'a',price:200}),/ya autorizada/);assert.throws(()=>transition(s,{type:'consume',id:'b',price:900}),/excede/);assert.equal(JSON.stringify(s),before);
 s=transition(s,{type:'pause'});assert.throws(()=>transition(s,{type:'consume',id:'c',price:100}),/habilitada/);
 s=transition(s,{type:'close'});assert.equal(s.returned,800);assert.throws(()=>transition(s,{type:'consume',id:'d',price:100}));assert.throws(()=>transition(s,{type:'close'}));
});
test('zero-use close returns full cap; invalid unit amount cannot issue spend',()=>{
 let s=transition(initialSession(),{type:'open'});for(const price of [0,-1,2.5,NaN])assert.throws(()=>transition(s,{type:'consume',id:'x',price}));s=transition(s,{type:'close'});assert.equal(s.settled,0);assert.equal(s.returned,1000);
});
