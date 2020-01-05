
const core = require("@actions/core")
const exec = require("@actions/exec")
const io = require("@actions/io")
const tc = require("@actions/tool-cache")

const path = require("path")

const INSTALL_PREFIX = ".install"
const FLATBUFFERS_PREFIX = ".flatbuffers"

async function main() {
  let flatbuffersVersion = core.getInput('flatbuffersVersion', { required: true })
  let flatbuffersCompileFlags = core.getInput('flatbuffersCompileFlags')

  const flatbuffersExtractPath = path.join(process.cwd(), INSTALL_PREFIX, `flatbuffers-${flatbuffersVersion}`)
  const flatbuffersInstallPath = path.join(process.cwd(), FLATBUFFERS_PREFIX)

  const flatbuffersSourceTar = await tc.downloadTool(`https://github.com/google/flatbuffers/archive/v${flatbuffersVersion}.tar.gz`)
  await io.mkdirP(flatbuffersExtractPath)
  await tc.extractTar(flatbuffersSourceTar, INSTALL_PREFIX)

  await exec.exec(`cmake -G "Unix Makefiles" -DCMAKE_BUILD_TYPE=Release -DCMAKE_INSTALL_PREFIX=${flatbuffersInstallPath}`, undefined, {
    cwd: flatbuffersExtractPath
  })

  const compileFlagsArray = [
    "-j",
  ]

  if (flatbuffersCompileFlags) {
    compileFlagsArray.push(flatbuffersCompileFlags)
  }

  await exec.exec("make", compileFlagsArray, {
    cwd: flatbuffersExtractPath
  })
  
  await exec.exec("ctest", undefined, {
	  cwd: flatbuffersExtractPath
  })

  await exec.exec(`make -j install`, undefined, {
    cwd: flatbuffersExtractPath
  })

  core.addPath(path.join(flatbuffersInstallPath, "bin"));
}

main().catch(err => {
  core.setFailed(`Failed to install Flatbuffers: ${err}`);
})
