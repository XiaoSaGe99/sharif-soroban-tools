export type Operation = { type: string; [key: string]: unknown };

export type Signature = {
  hint: string;
  signature: string;
};

export interface Transaction {
  sourceAccount: string;
  fee: number;
  sequenceNumber: string;
  operations: Operation[];
  memo?: string;
  signatures: Signature[];
}

export interface FeeBumpTransaction {
  feeSource: string;
  fee: number;
  innerTx: Transaction;
  signatures: Signature[];
}

export interface TransactionEnvelope {
  type: 'transaction';
  tx: Transaction;
}

export interface FeeBumpTransactionEnvelope {
  type: 'feeBump';
  feeBumpTx: FeeBumpTransaction;
}

export type StellarEnvelope = TransactionEnvelope | FeeBumpTransactionEnvelope;

export function isFeeBumpTransactionEnvelope(
  envelope: StellarEnvelope,
): envelope is FeeBumpTransactionEnvelope {
  return envelope.type === 'feeBump';
}

export function getTransactionEnvelopeFee(
  envelope: StellarEnvelope,
): number {
  return isFeeBumpTransactionEnvelope(envelope)
    ? envelope.feeBumpTx.fee
    : envelope.tx.fee;
}

export function getFeeBumpInnerTransaction(
  envelope: StellarEnvelope,
): Transaction {
  return isFeeBumpTransactionEnvelope(envelope)
    ? envelope.feeBumpTx.innerTx
    : envelope.tx;
}

export function validateFeeBumpTransactionEnvelope(
  envelope: FeeBumpTransactionEnvelope,
  baseFee: number,
): {
  valid: boolean;
  error?: string;
  expectedMinimumFee?: number;
} {
  const innerTx = envelope.feeBumpTx.innerTx;
  const operationCount = Math.max(innerTx.operations.length, 1);
  const minimumFee = baseFee * operationCount;

  if (envelope.feeBumpTx.fee < minimumFee) {
    return {
      valid: false,
      error: `Fee bump transaction fee ${envelope.feeBumpTx.fee} is less than required minimum ${minimumFee}.`,
      expectedMinimumFee: minimumFee,
    };
  }

  if (!Array.isArray(envelope.feeBumpTx.signatures) || envelope.feeBumpTx.signatures.length === 0) {
    return {
      valid: false,
      error: 'Fee bump transaction requires at least one fee source signature.',
    };
  }

  if (!Array.isArray(innerTx.signatures) || innerTx.signatures.length === 0) {
    return {
      valid: false,
      error: 'Inner transaction requires at least one signature.',
    };
  }

  if (innerTx.fee < baseFee * operationCount) {
    return {
      valid: false,
      error: 'Inner transaction fee is below the base fee requirement for its operations.',
      expectedMinimumFee: minimumFee,
    };
  }

  return { valid: true };
}
