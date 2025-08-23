import { Exception } from "./exception.js";

export default class InvalidOptionsException extends Exception {
  constructor(forr: string, key: string, expected: string, got: string) {
    super(
      `Invalid option for ${forr}, expected ${key} to be ${expected} but got ${got}`,
    );
  }
}
