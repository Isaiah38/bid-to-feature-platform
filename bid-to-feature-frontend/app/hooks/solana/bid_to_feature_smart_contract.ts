/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/bid_to_feature_smart_contract.json`.
 */
export type BidToFeatureSmartContract = {
  address: '2EjhzjMZGBKJsEPDAqYALCcsWn12knJGydCso1YpAGBf';
  metadata: {
    name: 'bidToFeatureSmartContract';
    version: '0.1.0';
    spec: '0.1.0';
    description: 'Created with Anchor';
  };
  instructions: [
    {
      name: 'closeBid';
      discriminator: [169, 171, 66, 115, 220, 168, 231, 21];
      accounts: [
        {
          name: 'tempCategory';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [
                  102,
                  101,
                  97,
                  116,
                  117,
                  114,
                  101,
                  100,
                  95,
                  99,
                  97,
                  116,
                  101,
                  103,
                  111,
                  114,
                  121,
                ];
              },
              {
                kind: 'arg';
                path: 'categoryName';
              },
            ];
          };
        },
        {
          name: 'mainCategory';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [
                  102,
                  101,
                  97,
                  116,
                  117,
                  114,
                  101,
                  100,
                  95,
                  99,
                  97,
                  116,
                  101,
                  103,
                  111,
                  114,
                  121,
                ];
              },
              {
                kind: 'arg';
                path: 'baseName';
              },
            ];
          };
        },
        {
          name: 'bidder1';
          writable: true;
        },
        {
          name: 'bidder2';
          writable: true;
        },
        {
          name: 'bidder3';
          writable: true;
        },
        {
          name: 'authority';
          writable: true;
          signer: true;
        },
        {
          name: 'systemProgram';
          address: '11111111111111111111111111111111';
        },
      ];
      args: [
        {
          name: 'categoryName';
          type: 'string';
        },
        {
          name: 'baseName';
          type: 'string';
        },
      ];
    },
    {
      name: 'createCategory';
      discriminator: [220, 242, 238, 47, 228, 219, 223, 230];
      accounts: [
        {
          name: 'featuredCategory';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [
                  102,
                  101,
                  97,
                  116,
                  117,
                  114,
                  101,
                  100,
                  95,
                  99,
                  97,
                  116,
                  101,
                  103,
                  111,
                  114,
                  121,
                ];
              },
              {
                kind: 'arg';
                path: 'name';
              },
            ];
          };
        },
        {
          name: 'authority';
          writable: true;
          signer: true;
        },
        {
          name: 'systemProgram';
          address: '11111111111111111111111111111111';
        },
      ];
      args: [
        {
          name: 'name';
          type: 'string';
        },
      ];
    },
    {
      name: 'getBidderBalance';
      discriminator: [165, 73, 231, 106, 100, 119, 240, 169];
      accounts: [
        {
          name: 'bidderAccount';
          writable: true;
        },
        {
          name: 'authority';
          signer: true;
        },
      ];
      args: [];
      returns: 'u64';
    },
    {
      name: 'initialize';
      discriminator: [175, 175, 109, 31, 13, 152, 155, 237];
      accounts: [
        {
          name: 'initializer';
          writable: true;
          signer: true;
        },
        {
          name: 'escrowAccount';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [101, 115, 99, 114, 111, 119];
              },
              {
                kind: 'account';
                path: 'initializer';
              },
            ];
          };
        },
        {
          name: 'systemProgram';
          address: '11111111111111111111111111111111';
        },
      ];
      args: [
        {
          name: 'amount';
          type: 'u64';
        },
      ];
    },
    {
      name: 'placeBid';
      discriminator: [238, 77, 148, 91, 200, 151, 92, 146];
      accounts: [
        {
          name: 'bidder';
          writable: true;
          signer: true;
        },
        {
          name: 'bidderAccount';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [
                  98,
                  105,
                  100,
                  100,
                  101,
                  114,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116,
                ];
              },
              {
                kind: 'account';
                path: 'bidder';
              },
            ];
          };
        },
        {
          name: 'featuredCategory';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [
                  102,
                  101,
                  97,
                  116,
                  117,
                  114,
                  101,
                  100,
                  95,
                  99,
                  97,
                  116,
                  101,
                  103,
                  111,
                  114,
                  121,
                ];
              },
              {
                kind: 'arg';
                path: 'categoryName';
              },
            ];
          };
        },
        {
          name: 'systemProgram';
          address: '11111111111111111111111111111111';
        },
      ];
      args: [
        {
          name: 'categoryName';
          type: 'string';
        },
        {
          name: 'amount';
          type: 'u64';
        },
      ];
    },
    {
      name: 'withdraw';
      discriminator: [183, 18, 70, 156, 148, 109, 161, 34];
      accounts: [
        {
          name: 'bidder';
          writable: true;
          signer: true;
        },
        {
          name: 'bidderAccount';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [
                  98,
                  105,
                  100,
                  100,
                  101,
                  114,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116,
                ];
              },
              {
                kind: 'account';
                path: 'bidder';
              },
            ];
          };
        },
        {
          name: 'systemProgram';
          address: '11111111111111111111111111111111';
        },
      ];
      args: [
        {
          name: 'amount';
          type: 'u64';
        },
      ];
    },
  ];
  accounts: [
    {
      name: 'bidderAccount';
      discriminator: [147, 36, 226, 65, 101, 184, 70, 222];
    },
    {
      name: 'escrowAccount';
      discriminator: [36, 69, 48, 18, 128, 225, 125, 135];
    },
    {
      name: 'featuredCategory';
      discriminator: [197, 214, 229, 14, 202, 212, 106, 126];
    },
  ];
  errors: [
    {
      code: 6000;
      name: 'insufficientBalance';
      msg: 'Insufficient Balance';
    },
    {
      code: 6001;
      name: 'invalidBidder';
      msg: 'Invalid Bidder';
    },
    {
      code: 6002;
      name: 'invalidAmount';
      msg: 'Invalid Amount';
    },
    {
      code: 6003;
      name: 'invalidCategoryName';
      msg: 'Invalid Category Name';
    },
    {
      code: 6004;
      name: 'unauthorized';
      msg: 'unauthorized';
    },
  ];
  types: [
    {
      name: 'bid';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'bidder';
            type: 'pubkey';
          },
          {
            name: 'category';
            type: 'string';
          },
          {
            name: 'amount';
            type: 'u64';
          },
        ];
      };
    },
    {
      name: 'bidderAccount';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'owner';
            type: 'pubkey';
          },
          {
            name: 'amount';
            type: 'u64';
          },
        ];
      };
    },
    {
      name: 'escrowAccount';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'initializer';
            type: 'pubkey';
          },
          {
            name: 'amount';
            type: 'u64';
          },
          {
            name: 'isActive';
            type: 'bool';
          },
        ];
      };
    },
    {
      name: 'featuredCategory';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'authority';
            type: 'pubkey';
          },
          {
            name: 'name';
            type: 'string';
          },
          {
            name: 'top3Bids';
            type: {
              vec: {
                defined: {
                  name: 'bid';
                };
              };
            };
          },
        ];
      };
    },
  ];
};
