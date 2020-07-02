import * as rlp from 'rlp';
import * as createKeccakHash from 'keccak';
import * as ethUtil from 'ethjs-util'
import { sha256 as _sha256 } from './lib';

export namespace CidaroCrypto {
    /**
     * Creates a Keccak hash of a Buffer input.
     * @param buf input data
     * @param bits keccak width (default 256)
     */
    export function keccak(buf: Buffer, bits: number = 256): Buffer {
        return createKeccakHash(`keccak${bits}`).update(buf).digest();
    }

    /**
     * Creates a Keccak-256 hash of the input buffer.
     * @param buf input data
     */
    export function keccak256(buf: Buffer): Buffer {
        return this.keccak(buf);
    }

    /**
     * Creates a Keccak hash of the input string.
     * @param str input data
     * @param bits keccak width (default 256)
     * @param encoding string encoding (default utf-8)
     */
    export function stringToKeccak(str: string, bits: number = 256, encoding: BufferEncoding = 'utf-8'): Buffer {
        return this.keccak(Buffer.from(str, encoding), bits);
    }

    /**
     * Creates a Keccak hash of the input hex string.
     * @param str input data (hex str)
     * @param bits keccak width (default 256)
     */
    export function hexStringToKeccak(str: string, bits: number = 256): Buffer {
        return this.keccak(toBuffer(str), bits);
    }

    /**
     * Creates a Keccak hash of the input number array.
     * @param arr input data (number[])
     * @param bits keccak width (default 256)
     */
    export function arrayToKeccak(arr: number[], bits: number = 256): Buffer {
        return this.keccak(toBuffer(arr), bits);
    }

    /**
     * Creates a SHA256 hash of the input buffer.
     * @param buf Buffer to hash
     */
    export function sha256(buf: Buffer): Buffer {
        return _sha256(buf);
    }

    /**
     * Creates a SHA256 hash of the input string.
     * @param str string to hash
     */
    export function stringToSha256(str: string): Buffer {
        return _sha256(toBuffer(str));
    }

    /**
     * Creates a SHA256 hash of the input number array.
     * @param arr array to hash
     */
    export function arrayToSha256(arr: number[]): Buffer {
        return _sha256(toBuffer(arr));
    }

    /**
     * Creates a SHA3 hash of the RLP encoded version of the input.
     * @param value value to hash
     */
    export function rlpHash(value: rlp.Input): Buffer {
        return this.keccak(rlp.encode(value));
    }

    
    /**
     * Converts the input value into a Buffer.
     * @param value value to convert to a Buffer
     */
    export function toBuffer(value: any): Buffer {
        if (Buffer.isBuffer(value)) return value;
        if (Array.isArray(value) || value instanceof Uint8Array) return Buffer.from(value);
        if (typeof value === 'string') {
            if (ethUtil.isHexString(value)) return Buffer.from(ethUtil.padToEven(ethUtil.stripHexPrefix(value)), 'hex');
        } else if (typeof value === 'number') {
            return ethUtil.intToBuffer(value);
        } else if (value === null || value === undefined) {
            return Buffer.allocUnsafe(0);
        } else if (value.toArray) {
            return Buffer.from(value.toArray());
        }
        throw new Error('invalid type for buffer conversion')
    }
}