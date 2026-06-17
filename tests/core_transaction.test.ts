import { CoreEngine } from '../src/core/engine';
import {
  FeeBumpTransactionEnvelope,
  TransactionEnvelope,
} from '../src/core/transaction';

describe('CoreEngine fee bump transactions', () => {
  it('accepts a valid fee bump transaction envelope', async () => {
    const envelope: FeeBumpTransactionEnvelope = {
      type: 'feeBump',
      feeBumpTx: {
        feeSource: 'GFEESOURCE',
        fee: 200,
        innerTx: {
          sourceAccount: 'GINNER',
          fee: 100,
          sequenceNumber: '1234567890',
          operations: [{ type: 'payment', amount: '10', destination: 'GDEST' }],
          signatures: [{ hint: '1234', signature: 'abcd' }],
        },
        signatures: [{ hint: '5678', signature: 'efgh' }],
      },
    };

    const engine = new CoreEngine();
    const result = await engine.submitEnvelope(envelope);
    expect(result.success).toBe(true);
  });

  it('rejects fee bump envelopes with insufficient top-level fee', async () => {
    const envelope: FeeBumpTransactionEnvelope = {
      type: 'feeBump',
      feeBumpTx: {
        feeSource: 'GFEESOURCE',
        fee: 50,
        innerTx: {
          sourceAccount: 'GINNER',
          fee: 100,
          sequenceNumber: '1234567890',
          operations: [{ type: 'payment', amount: '10', destination: 'GDEST' }],
          signatures: [{ hint: '1234', signature: 'abcd' }],
        },
        signatures: [{ hint: '5678', signature: 'efgh' }],
      },
    };

    const engine = new CoreEngine();
    const result = await engine.submitEnvelope(envelope);
    expect(result.success).toBe(false);
    expect(result.reason).toContain('Invalid transaction envelope');
  });

  it('accepts a normal transaction envelope', async () => {
    const envelope: TransactionEnvelope = {
      type: 'transaction',
      tx: {
        sourceAccount: 'GNORMAL',
        fee: 100,
        sequenceNumber: '2222222222',
        operations: [{ type: 'contract', contractId: 'ABC123' }],
        signatures: [{ hint: '9999', signature: 'sign' }],
      },
    };

    const engine = new CoreEngine();
    const result = await engine.submitEnvelope(envelope);
    expect(result.success).toBe(true);
  });
});
