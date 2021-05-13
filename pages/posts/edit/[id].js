import React, { useState } from 'react'
import { authPage } from '../../../middlewares/authorizationPage'
import Router from 'next/router'
import Nav from '../../../components/Nav'


export async function getServerSideProps(ctx) {
  const { token } = await authPage(ctx)
  const { id } = ctx.query
  
  const postReq = await fetch('http://localhost:3000/api/v1/posts/detail/' + id, {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  })

  const res = await postReq.json()

  return {
    props: {
      token,
      post: res.data
    },
  }
}

export default function PostEdit(props) {
  const { post } = props

  const [fields, setFields] = useState({
    title: post.title,
    content: post.content,
  })

  const [status, setStatus] = useState('normal')

  async function updateHandler(e) {
    e.preventDefault()
    const { token } = props
    setStatus('loading...')
    const create = await fetch('/api/v1/posts/update/' + post.id, {
      method: 'PUT',
      body: JSON.stringify(fields),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    })

    if (!create.ok) return setStatus('error ' + create.status)

    const res = await create.json()
    setFields({
      title: '',
      content: '',
    })
    e.target.reset()
    setStatus('success!')
    Router.push('/posts')
  }

  function fieldHandler(e) {
    const name = e.target.name
    setFields({
      ...fields,
      [name]: e.target.value
    })
  }

  return (
    <>
      <h1>Edit Post</h1>
      <Nav />
      <p>Post ID: {post.id}</p>
      <form onSubmit={updateHandler.bind(this)}>
        <input
          name="title"
          type="text"
          placeholder="Title"
          onChange={fieldHandler.bind(this)}
          defaultValue={post.title}
        /><br />
        <textarea
          name="content"
          placeholder="Content"
          onChange={fieldHandler.bind(this)}
          defaultValue={post.content}
        /><br />
        <button
          type="submit">
          Save Changes
        </button>
        <div>
          <p>Output: {status}</p>
        </div>
      </form>
    </>
  )
}