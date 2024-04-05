// @ts-ignore
import { encode, decode } from '@jeffriggle/bison/dist/cjs/index.js'

export default function encodeJsonToBinary(json: any) {
    return encode(json)
}

export function decodeBinaryToJson(binary: any) {
    return decode(binary)
}