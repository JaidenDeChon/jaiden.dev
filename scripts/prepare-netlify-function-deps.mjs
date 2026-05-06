import { access, cp, lstat, rm } from 'node:fs/promises'
import path from 'node:path'

const projectRoot = process.cwd()
const sourceNodeModules = path.join(projectRoot, 'node_modules')
const functionNodeModules = path.join(
  projectRoot,
  '.netlify',
  'functions-internal',
  'server',
  'node_modules',
)

async function exists(targetPath) {
  try {
    await access(targetPath)
    return true
  } catch {
    return false
  }
}

async function replacePackage(relativePath) {
  const sourcePath = path.join(sourceNodeModules, relativePath)
  const targetPath = path.join(functionNodeModules, relativePath)

  if (!(await exists(sourcePath))) {
    return
  }

  if (await exists(targetPath)) {
    const stats = await lstat(targetPath)
    await rm(targetPath, {
      force: true,
      recursive: stats.isDirectory() && !stats.isSymbolicLink(),
    })
  }

  await cp(sourcePath, targetPath, {
    dereference: true,
    recursive: true,
  })
}

if (await exists(functionNodeModules)) {
  await replacePackage('vue')
  await replacePackage('@vue')
}