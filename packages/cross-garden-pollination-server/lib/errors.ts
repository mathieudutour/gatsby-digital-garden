export class BadRequest extends Error {
  statusCode = 400;
  data = null;
}

export class NotFound extends Error {
  statusCode = 404;
  data = null;
}

export class Unauthorized extends Error {
  statusCode = 401;
  data = null;
}

export class Forbidden extends Error {
  statusCode = 403;
  data = null;
}
