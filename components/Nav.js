import Link from 'next/link'
import Cookie from 'js-cookie'
import Router from 'next/router'

export default function Nav() {
  function logoutHandler(e){
    e.preventDefault()
    const ask = confirm('Apakah yakin untuk LogOut?')
    if(ask){
      Cookie.remove('token')
      Router.replace('/auth/login')
    } 
  }
  return (
    <>
      <Link href="/posts">Posts</Link>{' | '}
      <Link href="/posts/create">Create Post</Link>{' | '}
      <a href="#" onClick={logoutHandler.bind(this)}>LogOut</a>
    </>
  )
}