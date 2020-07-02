import * as createHash from 'create-hash';

/**
 * Creates a SHA256 hash of the input value.
 * @param val input data
 */
export const sha256 = (val: Buffer): Buffer => {
    return createHash('sha256').update(val).digest();
}