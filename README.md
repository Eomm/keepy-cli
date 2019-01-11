# keepy-cli

A CLI tool to save encripted `KEY=VALUE` pairs in file that you can store securely in your repository.

If you are tired to store elsewhere your `env` keys, now you can save them directly in the repository!
Like `npm`, this cli will create a `keepy-store.json` where it store all the keys encripted with
the `aes-256-gcm` algorithm: all you need is a single password!

Some sugar feature to add tags to the keys and restore the file, and you are ready to play with your
token.

This is a simple example of the output:

```json
{
  "meta": {
    "version": "0.0.1",
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

# **WORK IN PROGRESS**
This cli is not ready to use, be prepared for the v1.0.0 that will be released on February 2019.
Meanwhile check the [man](man/) directory to see the commands that will be implemented.

### Architecture

This cli architecture has been inspired by [fastify-cli](https://github.com/fastify/fastify-cli)
