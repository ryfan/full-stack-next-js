import React, { useState } from 'react'
import { authPage } from '../../middlewares/authorizationPage'
import Router from 'next/router'
import Nav from '../../components/Nav'

export async function getServerSideProps(ctx) {
  const { token } = await authPage(ctx)
  return {
    props: {
      token
    },
  }
}

export default function PostCreate(props) {
  const [fields, setFields] = useState({
    title: '',
    content: '',
  })

  const [status, setStatus] = useState('normal')

  async function createHandler(e) {
    e.preventDefault()
    const { token } = props
    setStatus('loading...')
    const create = await fetch('/api/v1/posts/create', {
      method: 'POST',
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
      <h1>Create Post</h1>
      <Nav />
      <form onSubmit={createHandler.bind(this)}>
        <input
          name="title"
          type="text"
          placeholder="Title"
          onChange={fieldHandler.bind(this)}
        /><br />
        <textarea
          name="content"
          placeholder="Content"
          onChange={fieldHandler.bind(this)}
        /><br />
        <button
          type="submit">
          Create Post
        </button>
        <div>
          <p>Output: {status}</p>
        </div>
      </form>
    </>
  )
}