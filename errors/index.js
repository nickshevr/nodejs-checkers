'use strict';

class UnrecoverableError extends Error {
    constructor(message, status) {
        super(message);
        this.name = 'UnrecoverableError';
        this.status = status || 456;
        this.description = 'There are some errors in db data resolve';
    }
}

class NotAcceptable extends Error {
    constructor(message, status) {
        super(message);
        this.name = 'NotAcceptable';
        this.status = status || 406;
        this.description = 'Bad request data';
    }
}

class NotFoundError extends Error {
    constructor(message, status) {
        super(message);
        this.name = 'NotFoundError';
        this.status = status || 404;
        this.description = 'Requested object not found.';
    }
}

class ForbiddenError extends Error {
    constructor(message, status) {
        super(message);
        this.name = 'ForbiddenError';
        this.status = status || 403;
        this.description = 'Operation forbidden.';
    }
}

class ValidationError extends Error {
    constructor(message, status) {
        super(message);
        this.name = 'ForbiddenError';
        this.status = status || 422;
        this.description = 'This action not allowed.';
    }
}

module.exports = {
    UnrecoverableError,
    NotAcceptable,
    NotFoundError,
    ForbiddenError,
    ValidationError
};