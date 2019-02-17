# keepy-cli 

[![Coverage Status](https://coveralls.io/repos/github/Eomm/keepy-cli/badge.svg?branch=master)](https://coveralls.io/github/Eomm/keepy-cli?branch=master) [![install size](https://packagephobia.now.sh/badge?p=keepy-cli)](https://packagephobia.now.sh/result?p=keepy-cli)


A CLI tool to save encrypted `KEY=VALUE` pairs in file that you can store securely in your repository.

If you are tired to store elsewhere your `env` keys, now you can save them where you want!
Like `npm init`, `keepy init` will create a `keepy-store.json` where it store all the keys encrypted with
the `aes-256-gcm` algorithm: all you need is a single password!
This is a file that you can store directly in the repository, in a secure hard drive or share via email:
it's just a secure file of which only you have control and ownership.

Some sugar feature to add tags to the keys and restore the file, and you are ready to play with your
token without losing them in your multiple PC or dev's environments!


## Install

To use this tool you need at least Node.js 10.5.0 because it uses [crypto.scryptSync](https://nodejs.org/api/crypto.html#crypto_crypto_scryptsync_password_salt_keylen_options): **only standard lib to crypt your keys**.

### NPM

```sh
npm i keepy-cli -g
```
If you install `keepy-cli` globally, you can use it in your command line via `keepy` (without the `-cli`).

### NPX

Of course, you can use `keepy-cli` via npx. You have only to change the commands
from `keepy <command>` ➡️ to `npx keepy-cli <command>`


## Features

Check the [man](man/) directory to see all the arguments detail or type `npx keepy-cli help` 
to get a preview.

### Init

```sh
keepy init [--yes|-Y]
           [--overwrite|-F]
           [--password|-w <string>]
           [--help|-h]
```
Creates a keepy-store.json where all the protected keys will be saved.
The file will be create in the current directory.

### Add

```sh
keepy add [--key|-k <string>]
          [--payload|-p <string>]
          [--file|-f <file path>]
          [--env|-e]
          [--update|-u]
          [--tags|-t <string 1> <string 2> <string n>]
          [--help|-h]
```
This command adds one key to the keepy-store.json. If you set a file, all the keys will be added with the input tags.
If you set all the args `payload`, `env`, `file`, they will be evaluated in this order without overwriting.

### Restore

```sh
keepy restore [--stout|-s]
              [--env|-e]
              [--key|-k <string>]
              [--tag|-t <string>]
              [--file|-f <file>]
              [--overwrite|-F]
              [--password|-w <string>]
              [--help|-h]
```
Restore the desired keys stored in keepy-store.json to:
+ stout
+ environment variable
+ `K=V` file
If you set multiple output, all will we executed because they are independent.

### Delete

```sh
keepy delete [--env|-e]
             [--key|-k <string>]
             [--tag|-t <string>]
             [--password|-w <string>]
             [--help|-h]
```
Delete the desired key from the keepy-store.json.

### Help

```sh
keepy -h
```

---

This is a `keepy-store.json` example:

```json
{
  "meta": {
    "version": "1.0.0",
    "secured": true,
    "hint": "Say hi in italian.."
  },
  "secure": {
    "salt": "nWs2oqgGZ3CTxa6lI1MuxaVm4ONLqYROMSsruyJ1buE=",
    "verify": "WfaOAnvYI+hCRlnJzn1E+OnXTOY9XdafHFIyGu6kxlPgXWqdQ7B2IX4kP5v0eAyGz/+1GmvDXdrE8QSkOKaNT+DqrtPq5NN74W9QV+KtHSjStL3Nyy0="
  },
  "data": [
    {
      "key": "7rR9aPIkfXedJQ072PpJNXWirn2RNMxkpAcPGx71/3z+cBtHi03T916OGu33dUo3pNz83oL/3TLFGqtBkEQK7j1lGzlShRNTFpu3uXIF90K1",
      "payload": "5WrTzsRiWPg08tmBIqcToX7gKZs0dKpjZmlK03lqHE8tTVIMA+yI1dty4zUv8Tp7kPXYEJzj7S+LGJ+AVp4fWHT/2QhKEC7Aw43TInIRrBXz",
      "tags": [
        "7T6aoF7qdPyJkDqon3+w/NGprabn4FnzN6sdSS33AvJcJOYWwSvEXj2Tq2TcecpS2xB6oQZk4A9f6yj5dL6+foBVsuTk4Fu65+j3/uTbujfbhw==",
        "7fTUENiDEFEWSglpDwsoyB5RdmimgVXGeDabkUfaOtM/QlOps0mNgV+bkvQ10g6KfFuGTCtUdse2qu1ubX119eeQHzjq6ybYBZ3NsIYoIug9HA=="
      ]
    }
  ]
}
```


## Architecture

This cli architecture has been inspired by [fastify-cli](https://github.com/fastify/fastify-cli)


## Test

For run the tests simply execute:
```
npm test
```


## License

Copyright [Manuel Spigolon](https://github.com/Eomm), Licensed under [MIT](./LICENSE).
