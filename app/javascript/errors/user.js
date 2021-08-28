export class UserError extends Error {
    constructor(message) {
        super(message);
        this.message = message;
        this.name = this.constructor.name;
    }
}

export class InvalidCredentials extends UserError {}
export class UnknownError extends UserError {}
export class AlreadyConfirmed extends UserError {}
export class InvalidToken extends UserError {}
export class InvalidPassword extends UserError {}
export class EmailTaken extends UserError {}
