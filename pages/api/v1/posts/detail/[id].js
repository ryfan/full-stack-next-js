import db from "../../../../../libs/db"
import authorization from "../../../../../middlewares/authorization"

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()

  const { id } = req.query

  const auth = await authorization(req, res)
  const posts = await db('posts').where({ id }).first()

  if(!posts) return res.status(404).end()

  res.status(200)
  res.json({
    status: 'OK',
    message: 'Posts data',
    data: posts
  })
}
