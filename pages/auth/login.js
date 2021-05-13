import React, { useState } from 'react'
import Cookie from 'js-cookie'
import Router from 'next/router'
import { unauthPage } from '../../middlewares/authorizationPage'
import Link from 'next/link'

export async function getServerSideProps(ctx) {
  await unauthPage(ctx)
  return {
    props: {},
  }
}

export default function Login() {
  const [fields, setFields] = useState({
    email: '',
    password: '',
  })

  const [status, setStatus] = useState('normal')

  async function loginHandler(e) {
    e.preventDefault()
    setStatus('loading...')

    const loginReq = await fetch('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(fields),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!loginReq.ok) return setStatus('error ' + loginReq.status)

    const loginRes = await loginReq.json()
    setStatus('success!')

    Cookie.set('token', loginRes.token)

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
      <h1>Login</h1>
      <form onSubmit={loginHandler.bind(this)}>
        <input
          name="email"
          type="email"
          placeholder="email"
          onChange={fieldHandler.bind(this)}
        />
        <input
          name="password"
          type="password"
          placeholder="password"
          onChange={fieldHandler.bind(this)}
        />
        <button
          type="submit">
          Login
        </button>
        <div>
          <p>Belum punya akun? <Link href="/auth/register">Register</Link></p>
          <p>Output: {status}</p>
        </div>
      </form>
    </>
  )
}