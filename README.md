# Github Action for Flatbuffers

## Created from `leafo/gh-actions-lua`, thank you leafo!

### `pulynerain/gh-actions-flatbuffers`

[![Actions Status](https://github.com/pulynerain/gh-actions-flatbuffers/workflows/test/badge.svg)](https://github.com/pulynerain/gh-actions-flatbuffers/actions)

Builds and installs Flatbuffers into the `.flatbuffers/` directory in the working directory.
Adds the `.flatbuffers/bin` to the `PATH` environment variable so `flatc` can be called
directly in workflows.

**Is your build failing when installing Lua?** GitHub Action's Ubuntu base image changed default packages, please update to v5 or later

## Usage

Install Flatbuffers: (Will typically default to the latest release, 1.11.0 as of this readme)

```yaml
- uses: pulynerain/gh-actions-flatbuffers@v1
```

Install specific version of Flatbuffers:

```yaml
- uses: pulynerain/gh-actions-flatbuffers@v1
  with:
    flatbuffersVersion: "1.11.0"
```

## Inputs

### `flatbuffersVersion`

**Default**: `"1.11.0"`

Specifies the version of Flatbuffers to install. The version name instructs the action
where to download the source from.

Examples of versions:

* `"1.10.0"`

## Full Example

This example is for compiling a Flatbuffers schema.

Create `.github/workflows/test.yml` in your repository:

```yaml
name: test

on: [push]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@master

    - uses: pulynerain/gh-actions-flatbuffers@v1
      with:
        flatbuffersVersion: "1.11.0"

    - name: build
      run: |
	    flatc schema.fbs
```

This example:

* Uses Flatbuffers 1.11.0 — You can use another version by chaning the `flatbuffersVersion` variable.

### Version build matrix

You can test against multiple versions of Flatbuffers using a matrix strategy:

```yaml
jobs:
  test:
    strategy:
      matrix:
        flatbuffersVersion: ["1.10.0","1.11.0"]

    steps:
    - uses: actions/checkout@master
    - uses: pulynerain/gh-actions-flatbuffers@v1
      with:
        flatbuffersVersion: ${{ matrix.flatbuffersVersion }}

    # ...
```