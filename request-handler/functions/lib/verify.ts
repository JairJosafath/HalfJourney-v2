import nacl from 'tweetnacl';

const PUBLIC_KEY: string | undefined = process.env.PUBLIC_KEY;

interface Event {
  headers: {
    "x-signature-ed25519"?: string;
    "x-signature-timestamp"?: string;
  };
  body: string;
}

export function verifyRequest(event: any): { statusCode: number; body: string } {
  const signature = event.headers["x-signature-ed25519"] || "";
  const timestamp = event.headers["x-signature-timestamp"] || "";
  const body = event.body;

  const isVerified = nacl.sign.detached.verify(
    Buffer.from(timestamp + body),
    Buffer.from(signature, "hex"),
    Buffer.from(PUBLIC_KEY || "", "hex")
  );

  if (!isVerified) {
    console.log("invalid request signature");
    return {
      statusCode: 401,
      body: JSON.stringify({
        message: "invalid request signature",
      }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ type: 1 }),
  };
}
