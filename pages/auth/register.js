import React, { useState } from 'react'
import { unauthPage } from '../../middlewares/authorizationPage'
import Link from 'next/link'

export async function getServerSideProps(ctx) {
  await unauthPage(ctx)
  return {
    props: {},
  }
}

export default function Register() {
  const [fields, setFields] = useState({
    name: '',
    email: '',
    password: '',
  })

  const [status, setStatus] = useState('normal')

  async function registerHandler(e) {
    e.preventDefault()
    setStatus('loading...')

    const registerReq = await fetch('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(fields),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!registerReq.ok) return setStatus('error ' + registerReq.status)

    const registerRes = await registerReq.json()
    setFields({
      name: '',
      email: '',
      password: '',
    })
    e.target.reset()
    setStatus('success!')
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
      <h1>Register</h1>
      <form onSubmit={registerHandler.bind(this)}>
        <input
          name="name"
          type="text"
          placeholder="name"
          onChange={fieldHandler.bind(this)}
        /><br />
        <input
          name="email"
          type="email"
          placeholder="email"
          onChange={fieldHandler.bind(this)}
        /><br />
        <input
          name="password"
          type="password"
          placeholder="password"
          onChange={fieldHandler.bind(this)}
        /><br />
        <button
          type="submit">
          Register
        </button>
        <div>
          <p>Sudah punya akun? <Link href="/auth/login">LogIn</Link></p>
          <p>Output: {status}</p>
        </div>
      </form>
    </>
  )
}