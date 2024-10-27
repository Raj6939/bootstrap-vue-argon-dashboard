const universitySchema ={
    context: [
      "https://raw.githubusercontent.com/hypersign-protocol/hypersign-contexts/main/CredentialSchema.jsonld",
      "https://w3id.org/security/suites/ed25519-2020/v1"
    ],
    type: "https://w3c-ccg.github.io/vc-json-schemas/v1/schema/1.0/schema.json",
    modelVersion: "1.0",
    id: "sch:hid:testnet:z6MkezirC1Wd2ENEVrdNnSEbMk1UiFN2KMUfj1E2aafRrMYU:1.0",
    name: "UniversityDegreeCertificate",
    author: "did:hid:testnet:789533dc-13f5-4fc8-b60f-00af1b20c95d",
    authored: "2024-10-21T21:31:39Z",
    schema: {
      schema: "http://json-schema.org/draft-07/schema",
      description: "University Degree Schema\"",
      type: "https://schema.org/object",
      properties: {
        recipientFullName: {
          type: "string"
        },
        recipientEmail: {
          type: "string"
        },
        degreeType: {
          type: "string"
        },
        degreeName: {
          type: "string"
        },
        dateOfBirth: {
          type: "string"
        },
        degreeEarnedDate: {
          type: "string"
        },
        issuerName: {
          type: "string"
        },
        enrollmentNumber: {
          type: "string"
        }
      },
      required: [],
      additionalProperties: false
    },
    proof: {
      type: "Ed25519Signature2020",
      created: "2024-10-21T21:33:19Z",
      verificationMethod: "did:hid:testnet:789533dc-13f5-4fc8-b60f-00af1b20c95d#key-1",
      proofPurpose: "assertionMethod",
      proofValue: "z4wJkwzxtDNqEBr9du2A5WmEMfbiQU2xau4aKUpcx5vFi2WVukC3suJWxvccQpjudS6ZpGf8qyYXZrKx4nwuVjzYm",
      clientSpecType: "CLIENT_SPEC_TYPE_NONE"
    }
  }

export default universitySchema