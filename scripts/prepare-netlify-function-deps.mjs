import { access, cp, lstat, readdir, rm } from 'node:fs/promises'
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

async function replaceSymlinkedPackages() {
  const entries = await readdir(functionNodeModules, { withFileTypes: true })

  for (const entry of entries) {
    if (entry.name.startsWith('.')) {
      continue
    }

    if (entry.isSymbolicLink()) {
      await replacePackage(entry.name)
      continue
    }

    if (!entry.isDirectory() || !entry.name.startsWith('@')) {
      continue
    }

    const scopePath = path.join(functionNodeModules, entry.name)
    const scopedEntries = await readdir(scopePath, { withFileTypes: true })

    for (const scopedEntry of scopedEntries) {
      if (!scopedEntry.isSymbolicLink()) {
        continue
      }

      await replacePackage(path.join(entry.name, scopedEntry.name))
    }
  }
}

if (await exists(functionNodeModules)) {
  await replacePackage('vue')
  await replacePackage('@vue')
  await replaceSymlinkedPackages()
}