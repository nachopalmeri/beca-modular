import test from 'node:test';
import assert from 'node:assert/strict';
import {openingPose} from '../brote-motion.mjs';

test('Brote enters, walks, hops onto the headline, rests and exits in order',()=>{
  assert.deepEqual([.05,.3,.6,.78,.95].map(p=>openingPose(p).phase),['enter','walk','hop','rest','exit']);
  assert.equal(openingPose(0).opacity,0);
  assert.equal(openingPose(1).opacity,0);
  assert.equal(openingPose(.78).opacity,1);
});
test('reversing scroll restores the same pose without accumulated animation state',()=>{
  const outward=[0,.2,.4,.6,.8,1].map(openingPose);
  const backward=[1,.8,.6,.4,.2,0].map(openingPose).reverse();
  assert.deepEqual(backward,outward);
});
test('entry and exit stay bounded and all scroll samples produce finite poses',()=>{
  for(let i=-10;i<=110;i++)for(const [key,value] of Object.entries(openingPose(i/100))){
    if(key==='phase')continue;
    assert.equal(Number.isFinite(value),true,key);
    if(key==='opacity')assert.ok(value>=0&&value<=1);
  }
});
test('body position and opacity remain continuous across narrative beats',()=>{
  for(const boundary of [.12,.5,.68,.87])for(const key of ['x','lift','tilt','opacity','ground','shadow']){
    assert.ok(Math.abs(openingPose(boundary-1e-8)[key]-openingPose(boundary+1e-8)[key])<.001,`${boundary}: ${key}`);
  }
});

test('walking approaches a raised landing and departure clears the stage',()=>{
  assert.ok(openingPose(.3).ground > openingPose(.78).ground);
  assert.equal(openingPose(.68).ground,0);
  assert.ok(openingPose(0).x < -.9);
  assert.ok(openingPose(1).x > 1.9);
  assert.equal(openingPose(.78).shadow,1);
  assert.ok(openingPose(.59).shadow < 1);
});
