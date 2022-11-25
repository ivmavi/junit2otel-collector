# junit2otel-collector

GitHub Action to process and send to a OpenTelemetry service a JUnit result file stored as artifact on a workflow run.

## Troubleshooting

# ERR_OSSL_EVP_UNSUPPORTED

In some environments you need to export the following env var `export NODE_OPTIONS=--openssl-legacy-provider`,
to avoid the following error.(see [stackoverflow](https://stackoverflow.com/questions/69394632/webpack-build-failing-with-err-ossl-evp-unsupported))

```
> junit2otel-collector@1.0.0 prepare
> ncc build index.js -o dist --source-map --license licenses.txt

ncc: Version 0.31.1
ncc: Compiling file index.js into CJS
Error: error:0308010C:digital envelope routines::unsupported
    at new Hash (node:internal/crypto/hash:71:19)
    at Object.createHash (node:crypto:133:10)
    at hashOf (/Users/inifc/src/junit2otel-collector/node_modules/@vercel/ncc/dist/ncc/index.js.cache.js:37:1855992)
    at ncc (/Users/inifc/src/junit2otel-collector/node_modules/@vercel/ncc/dist/ncc/index.js.cache.js:37:1860457)
    at runCmd (/Users/inifc/src/junit2otel-collector/node_modules/@vercel/ncc/dist/ncc/cli.js.cache.js:1:55128)
    at 819 (/Users/inifc/src/junit2otel-collector/node_modules/@vercel/ncc/dist/ncc/cli.js.cache.js:1:51698)
    at __webpack_require__ (/Users/inifc/src/junit2otel-collector/node_modules/@vercel/ncc/dist/ncc/cli.js.cache.js:1:59048)
    at /Users/inifc/src/junit2otel-collector/node_modules/@vercel/ncc/dist/ncc/cli.js.cache.js:1:59260
    at /Users/inifc/src/junit2otel-collector/node_modules/@vercel/ncc/dist/ncc/cli.js.cache.js:1:59321
    at Object.<anonymous> (/Users/inifc/src/junit2otel-collector/node_modules/@vercel/ncc/dist/ncc/cli.js:8:28) {
  opensslErrorStack: [ 'error:03000086:digital envelope routines::initialization error' ],
  library: 'digital envelope routines',
  reason: 'unsupported',
  code: 'ERR_OSSL_EVP_UNSUPPORTED'
}
```
