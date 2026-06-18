# Quickstart: Hello World Soroban Contract

This guide takes you from zero to a deployed "Hello World" Soroban smart contract using **sharif-soroban-tools**. By the end you will have a compiled WASM file and a live contract on a standalone Soroban network.

---

## Prerequisites

Make sure the following are installed before you begin.

| Tool | Minimum version | Install |
|------|----------------|---------|
| Node.js | 20 | https://nodejs.org |
| Rust + Cargo | stable | https://rustup.rs |
| Soroban CLI | latest | `cargo install --locked soroban-cli` |
| Docker | any | https://docs.docker.com/get-docker/ (needed for the standalone network) |

Verify your setup:

```bash
node --version        # v20.x.x or higher
cargo --version       # cargo 1.x.x
soroban --version     # soroban x.x.x
docker --version      # Docker version x.x.x
```

---

## 1. Clone and install

```bash
git clone https://github.com/damiedee96/sharif-soroban-tools.git
cd sharif-soroban-tools
npm install
```

`npm install` pulls down all TypeScript tooling dependencies (ESLint, Jest, ts-jest, TypeScript, and type definitions) declared in `package.json`.

---

## 2. Scaffold a new contract project

Create a dedicated folder for your contract and initialise a Soroban contract crate inside it:

```bash
mkdir -p contracts/hello-world
cd contracts/hello-world
cargo init --lib
```

Add the Soroban SDK to your contract's `Cargo.toml`:

```toml
[lib]
crate-type = ["cdylib"]

[dependencies]
soroban-sdk = { version = "20", features = ["alloc"] }
```

Replace the generated `src/lib.rs` with a minimal "Hello World" contract:

```rust
#![no_std]
use soroban_sdk::{contract, contractimpl, symbol_short, vec, Env, Symbol, Vec};

#[contract]
pub struct HelloContract;

#[contractimpl]
impl HelloContract {
    pub fn hello(env: Env, to: Symbol) -> Vec<Symbol> {
        vec![&env, symbol_short!("Hello"), to]
    }
}
```

Return to the repo root when done:

```bash
cd ../..
```

---

## 3. Build the WASM file

Compile the contract to WebAssembly. The Soroban CLI handles the Rust target and optimisation flags for you:

```bash
soroban contract build --manifest-path contracts/hello-world/Cargo.toml
```

The compiled artefact is written to:

```
contracts/hello-world/target/wasm32-unknown-unknown/release/hello_world.wasm
```

> **Tip:** run `soroban contract build --help` to see additional flags such as `--profile` for debug builds.

---

## 4. Start a standalone network

Spin up a local Soroban-enabled Stellar node with Docker:

```bash
docker run --rm -it \
  -p 8000:8000 \
  --name stellar-standalone \
  stellar/quickstart:soroban-dev \
  --standalone \
  --enable-soroban-rpc
```

Wait until you see a log line similar to:

```
INFO  stellar_node  Synced, current ledger: 2
```

The RPC endpoint is now available at `http://localhost:8000/soroban/rpc`.

---

## 5. Configure a network identity

Generate a keypair and fund it from the local friendbot:

```bash
soroban keys generate --overwrite alice
soroban keys fund alice --network standalone --rpc-url http://localhost:8000/soroban/rpc
```

Check the balance to confirm funding worked:

```bash
soroban keys address alice
# Copy the printed public key, then:
curl "http://localhost:8000/accounts/<PUBLIC_KEY>"
```

---

## 6. Deploy the contract

Use the sharif-soroban-tools CLI to deploy the compiled WASM to the standalone network:

```bash
cargo run -- --contract-path contracts/hello-world/target/wasm32-unknown-unknown/release/hello_world.wasm
```

The CLI calls `deploy::execute_deploy` internally and prints:

```
Deploying contract from contracts/hello-world/target/...
Successfully deployed: contracts/hello-world/target/...
```

Alternatively, deploy directly with the Soroban CLI:

```bash
soroban contract deploy \
  --wasm contracts/hello-world/target/wasm32-unknown-unknown/release/hello_world.wasm \
  --source alice \
  --network standalone \
  --rpc-url http://localhost:8000/soroban/rpc
```

Copy the contract ID printed to stdout — you will need it in the next step.

---

## 7. Invoke the contract

Call the `hello` function with your name:

```bash
soroban contract invoke \
  --id <CONTRACT_ID> \
  --source alice \
  --network standalone \
  --rpc-url http://localhost:8000/soroban/rpc \
  -- hello --to World
```

Expected output:

```json
["Hello", "World"]
```

---

## 8. Run the test suite

Verify nothing is broken after your changes:

```bash
# TypeScript / Jest tests
npm test

# Rust unit and integration tests
cargo test
```

---

## Next steps

- Read the [Contributing Guidelines](../CONTRIBUTING.md) before opening a pull request.
- Explore `src/core/engine.ts` and `src/core/transaction.ts` to understand transaction envelope processing.
- Check `src/scripts/audit-rpc-load-balancer.ts` for RPC load-balancing utilities.
- See `tests/integration/flow.test.ts` for end-to-end flow examples.
