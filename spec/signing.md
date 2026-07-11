# Provenance — Ed25519 signing

This is Level 4 of the [verifiability pyramid](./verifiability-pyramid.md): the agent **proves** authenticity instead of trusting it. It is the single feature that most moves agent behavior (+23–31% trust in controlled tests) and it is cheap: a 64-byte signature, a 32-byte public key, sub-millisecond to sign or verify.

## Why asymmetric, not HMAC

A symmetric (HMAC) signature is only verifiable by whoever holds the secret — useless to a third-party agent. Ed25519 is **asymmetric**: the brand signs with a private key, and *any* agent verifies against the published public key. No shared secret, no trust in the issuer.

## What to serve

1. **`/.well-known/brand.json`** — the profile.
2. **`/.well-known/brand.json.sig`** — a detached signature over the **exact bytes** of `brand.json`:
   ```json
   {
     "alg": "Ed25519",
     "kid": "71952e93b97ac2b8",
     "value": "<base64 signature>",
     "public_key_url": "/.well-known/keys.json"
   }
   ```
3. **`/.well-known/keys.json`** — the public key:
   ```json
   {
     "keys": [{
       "key_id": "brand-2026-primary",
       "kid": "71952e93b97ac2b8",
       "kty": "OKP", "crv": "Ed25519", "alg": "Ed25519", "use": "sig",
       "public_key_b64": "<base64 32-byte public key>",
       "status": "active"
     }]
   }
   ```

## Verification (agent side)

```
sig   = fetch(/.well-known/brand.json.sig)
body  = fetch(/.well-known/brand.json)          # exact bytes
pub   = fetch(sig.public_key_url).keys[kid==sig.kid].public_key
valid = Ed25519.verify(sig.value, body, pub)
```

## Invariants

- The signature is over the **exact served bytes**. If the profile is regenerated or edited, it MUST be re-signed. The signer and the server must not drift — the recommended architecture is **one signer emits `brand.json` and `.sig` together**, and the site serves that output.
- `kid` is a stable hash of the public key. Rotating the key changes `kid`; keep the old key `status: "retired"` in `keys.json` during rotation so in-flight signatures still verify.
- The private key never leaves the signer. Store it in a vault or a service-role-only table, never in client code.
