import { APIGatewayProxyEvent, APIGatewayProxyHandler } from "aws-lambda";

export const _handler = (
  fn: (event: APIGatewayProxyEvent) => Promise<any>
): APIGatewayProxyHandler => async (event: APIGatewayProxyEvent) => {
  try {
    const result = (await fn(event)) || {};

    return {
      statusCode: result.statusCode || 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
        ...(result.headers || {}),
      },
      body: result.isBase64Encoded ? result.result : JSON.stringify(result),
      isBase64Encoded: result.isBase64Encoded,
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: err.statusCode || 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        message: err.message,
        data: err.data,
      }),
    };
  }
};
