import { useEffect, useState } from 'react'
import { authPage } from '../../middlewares/authorizationPage'
import Router, { useRouter } from 'next/router';
import Nav from '../../components/Nav'

export async function getServerSideProps(ctx) {
  const { token } = await authPage(ctx)
  const postReq = await fetch('http://localhost:3000/api/v1/posts', {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  })

  const posts = await postReq.json()
  return {
    props: {
      posts: posts.data,
      token
    },
  }
}

export default function PostIndex(props) {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshData = () => {
    router.replace(router.asPath);
    setIsRefreshing(true);
  };

  useEffect(() => {
    setIsRefreshing(false);
  }, [props]);

  async function deleteHandler(id, e) {
    e.preventDefault()
    const { token } = props
    const ask = confirm('Apakah data ini akan dihapus?')
    if (ask) {
      const remove = await fetch('/api/v1/posts/delete/' + id, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + token
        }
      })

      const res = await remove.json()
      refreshData();
    }
  }

  function editHandler(id) {
    Router.push('/posts/edit/' + id)
  }

  return (
    <>
      <h1>Posts</h1>
      <Nav />
      <ol>
        {
          props.posts.map((post, idx) => {
            return (
              <li key={idx}>
                <h3>{post.title}</h3>
                <p>{post.content}</p>
                <button onClick={editHandler.bind(this, post.id)}>Edit</button>
                <button onClick={deleteHandler.bind(this, post.id)}>Remove</button>
                <hr />
              </li>
            )
          })
        }
      </ol>
    </>
  )
}