import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const POSTS_DIRECTORY = path.join(process.cwd(), 'pages/posts')

export function getSortedPostsData() {
  const fileNames = fs.readdirSync(POSTS_DIRECTORY)
  const allPostsData = fileNames.map(fileName => {
    const id = fileName.replace(/\.md$/, '')

    const fullPath = path.join(POSTS_DIRECTORY, fileName)
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    const matterResult = matter(fileContents)

    return {
      id,
      ...(matterResult.data as { date: string; title: string })
    }
  })

  return allPostsData.sort((a, b) => {
    if (a.date < b.date) return 1
    else return -1
  })
}