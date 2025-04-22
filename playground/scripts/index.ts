import * as dotenv from "dotenv";
dotenv.config();

async function main() {
  console.log("Starting script...");

  // List DIDs
  // const { data } = await listDids();

  // Create a new DID
  // const params = {
  //   network: "testnet",
  //   identifierFormatType: "uuid",
  //   verificationMethodType: "Ed25519VerificationKey2018",
  // };
  // const { data } = await createDid(params);

  // Create a new DID linked resource
  // const params = {
  //   data: Buffer.from(
  //     JSON.stringify(cheqdConfig.aiAgentAuthorisationSchema)
  //   ).toString("base64"),
  //   encoding: "base64",
  //   name: "AIAgentAuthorisation",
  //   type: "JSONSchemaValidator2020",
  // };
  // const { data } = await createDidLinkedResource(params);

  // console.log("Data:", data);
}

main().catch((error) => {
  console.error("Error:", error);
  process.exitCode = 1;
});
