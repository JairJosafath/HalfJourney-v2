import { verifyRequest } from "./lib/verify"
import {startExecution} from "./lib/startExecution"

export const lambdaHandler = async (event: any, context: any) => {
  return handleRequest(event);
};

async function handleRequest(event: any) {
  const body = JSON.parse(event.body);

  if (body.type === 1) {
    // verify request
    return verifyRequest(event);
  }

  if (body.type === 2) {
    // handle interaction
    return await startExecution(body);
  }

  // invalid request
  console.log(`Invalid request, does not match type 1 or 2\n event: ${JSON.stringify(event)}`);
  return {
    statusCode: 400,
    body: "Bad Request",
  };
}
