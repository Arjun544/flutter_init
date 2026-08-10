export type FileTreeNode = {
  name: string
  path: string
  type: "file" | "folder"
  children?: FileTreeNode[]
}

/**
 * Convert a flat path → content map into a nested folder tree.
 */
export function buildFileTree(files: Record<string, string>): FileTreeNode[] {
  const root: FileTreeNode[] = []

  const sortedPaths = Object.keys(files).sort((a, b) => a.localeCompare(b))

  for (const filePath of sortedPaths) {
    const parts = filePath.split("/").filter(Boolean)
    let current = root
    let accumulated = ""

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i]
      accumulated = accumulated ? `${accumulated}/${part}` : part
      const isFile = i === parts.length - 1

      if (isFile) {
        current.push({
          name: part,
          path: accumulated,
          type: "file",
        })
        continue
      }

      let folder = current.find(
        (node) => node.type === "folder" && node.name === part
      )
      if (!folder) {
        folder = {
          name: part,
          path: accumulated,
          type: "folder",
          children: [],
        }
        current.push(folder)
      }
      current = folder.children!
    }
  }

  sortTree(root)
  return root
}

function sortTree(nodes: FileTreeNode[]) {
  nodes.sort((a, b) => {
    if (a.type !== b.type) return a.type === "folder" ? -1 : 1
    return a.name.localeCompare(b.name)
  })
  for (const node of nodes) {
    if (node.children) sortTree(node.children)
  }
}

/** Folder paths that should start expanded in the tree. */
export function defaultOpenFolders(_tree: FileTreeNode[]): string[] {
  return []
}

export function basename(filePath: string): string {
  const parts = filePath.split("/")
  return parts[parts.length - 1] || filePath
}
