// Local demonstration only: a synthetic institutional key signs a fixed milestone.
// This model does not authenticate real institutions, persist funds or transfer assets.
const algorithm={name:'ECDSA',hash:'SHA-256'};
const fields=['version','programId','studentId','milestone','amount','nonce','issuedAt','expiresAt'];
const hex=bytes=>Array.from(new Uint8Array(bytes),v=>v.toString(16).padStart(2,'0')).join('');
function freeze(value){if(value&&typeof value==='object'){Object.values(value).forEach(freeze);Object.freeze(value);}return value;}
function positive(n){return Number.isSafeInteger(n)&&n>0;}
export function initialScholarship({total=10000,tranche=2000,programId='beca-demo-01',studentId='alumno-demo-01'}={}){
 if(!positive(total)||!positive(tranche)||total%tranche!==0||typeof programId!=='string'||!programId||typeof studentId!=='string'||!studentId)throw new Error('Configuración de beca inválida.');
 return freeze({programId,studentId,total,tranche,paid:0,remaining:total,reassigned:0,status:'active',receipts:[]});
}
export async function createAttestor(){
 const keys=await crypto.subtle.generateKey({name:'ECDSA',namedCurve:'P-256'},false,['sign','verify']);
 return {...keys,publicJwk:await crypto.subtle.exportKey('jwk',keys.publicKey)};
}
function encodeClaim(claim){
 if(!claim||typeof claim!=='object'||Object.keys(claim).length!==fields.length||fields.some(k=>!Object.hasOwn(claim,k))||claim.version!==1||!positive(claim.amount)||!positive(claim.milestone)||!positive(claim.issuedAt)||!positive(claim.expiresAt)||claim.expiresAt<=claim.issuedAt||claim.expiresAt-claim.issuedAt>300000||['programId','studentId','nonce'].some(k=>typeof claim[k]!=='string'||!claim[k]||claim[k].length>128))throw new Error('Formato de atestación inválido.');
 return new TextEncoder().encode(JSON.stringify(Object.fromEntries(fields.map(k=>[k,claim[k]]))));
}
export async function signMilestone(state,privateKey,{now=Date.now(),nonce=crypto.randomUUID(),ttlMs=120000}={}){
 const claim={version:1,programId:state.programId,studentId:state.studentId,milestone:state.receipts.length+1,amount:state.tranche,nonce,issuedAt:now,expiresAt:now+ttlMs};
 const signature=hex(await crypto.subtle.sign(algorithm,privateKey,encodeClaim(claim)));
 return freeze({claim,signature});
}
export async function verifyAttestation(envelope,trustedPublicKey){
 if(!envelope||typeof envelope.signature!=='string'||!/^[a-f0-9]{128}$/i.test(envelope.signature))throw new Error('Formato de firma inválido.');
 const encoded=encodeClaim(envelope.claim);
 const bytes=Uint8Array.from(envelope.signature.match(/../g),v=>Number.parseInt(v,16));
 return crypto.subtle.verify(algorithm,trustedPublicKey,bytes,encoded);
}
export async function releaseScholarship(state,envelope,{trustedPublicKey,now=Date.now()}={}){
 if(state.status==='paused')throw new Error('Programa en pausa: no se libera un tramo.');
 if(state.status!=='active')throw new Error('Programa cerrado o completo.');
 // Capture the supplied claim before awaiting cryptographic verification.
 const receipt=structuredClone(envelope);
 if(!await verifyAttestation(receipt,trustedPublicKey))throw new Error('Firma inválida: la atestación no coincide con la autoridad de prueba.');
 const c=receipt.claim;
 if(c.programId!==state.programId||c.studentId!==state.studentId)throw new Error('Programa o destino incorrecto.');
 if(c.amount!==state.tranche)throw new Error('El importe no coincide con el tramo acordado.');
 if(!Number.isSafeInteger(now)||now<c.issuedAt||now>=c.expiresAt)throw new Error('Atestación fuera de vigencia.');
 if(state.receipts.some(r=>r.claim.nonce===c.nonce||r.claim.milestone===c.milestone))throw new Error('Hito repetido: no se paga dos veces.');
 if(c.milestone!==state.receipts.length+1)throw new Error('Hito fuera de secuencia.');
 if(state.remaining<c.amount)throw new Error('Saldo reservado insuficiente.');
 const paid=state.paid+c.amount,remaining=state.remaining-c.amount;
 if(paid+remaining+state.reassigned!==state.total)throw new Error('El fondo no concilia.');
 return freeze({...state,paid,remaining,status:remaining===0?'completed':'active',receipts:[...state.receipts,receipt]});
}
export function pauseScholarship(state){
 if(state.status!=='active')throw new Error('El programa no admite una nueva pausa.');
 return freeze({...state,status:'paused'});
}
export function reassignScholarship(state){
 if(state.status!=='paused')throw new Error('La simulación administrativa requiere una pausa previa.');
 return freeze({...state,remaining:0,reassigned:state.reassigned+state.remaining,status:'closed'});
}
export async function publicKeyFingerprint(jwk){
 if(jwk?.kty!=='EC'||jwk?.crv!=='P-256'||typeof jwk.x!=='string'||typeof jwk.y!=='string')throw new Error('Clave pública inválida.');
 return hex(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(JSON.stringify({kty:jwk.kty,crv:jwk.crv,x:jwk.x,y:jwk.y}))));
}

// Verify a downloaded claim against an explicitly trusted fingerprint, not a key supplied on faith.
export async function verifyPublicReceipt(proof,expectedFingerprint){
 if(typeof expectedFingerprint!=='string'||!/^[a-f0-9]{64}$/.test(expectedFingerprint))throw new Error('Se requiere la huella completa de la autoridad de confianza.');
 if(proof?.format!=='beca-modular-local-proof-v1'||proof.publicKey?.d)throw new Error('Formato de comprobante público inválido.');
 const fingerprint=await publicKeyFingerprint(proof.publicKey);
 if(fingerprint!==expectedFingerprint)throw new Error('La clave del comprobante no coincide con la autoridad de confianza.');
 const key=await crypto.subtle.importKey('jwk',proof.publicKey,{name:'ECDSA',namedCurve:'P-256'},false,['verify']);
 if(!await verifyAttestation(proof.attestation,key))throw new Error('Firma inválida en el comprobante.');
 return {authorityFingerprint:fingerprint,claim:proof.attestation.claim};
}
