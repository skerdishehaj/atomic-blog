import { createContext, useEffect, useState, useContext } from 'react';
import { faker } from '@faker-js/faker';

// This function generates a random post object with a title and a body
function createRandomPost() {
  return {
    title: `${faker.hacker.adjective()} ${faker.hacker.noun()}`,
    body: faker.hacker.phrase(),
  };
}

const Section = ({ children }) => <section>{children}</section>;
const Button = ({ children, onClick, className }) => (
  <button
    className={className}
    onClick={onClick}
  >
    {children}
  </button>
);

// 1) Create the Post Context
const PostContext = createContext();

function App() {
  const [posts, setPosts] = useState(() =>
    Array.from({ length: 30 }, () => createRandomPost()),
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [isFakeDark, setIsFakeDark] = useState(false);

  // Derived state. These are the posts that will actually be displayed
  const searchedPosts =
    searchQuery.length > 0
      ? posts.filter((post) =>
          `${post.title} ${post.body}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase()),
        )
      : posts;

  function handleAddPost(post) {
    setPosts((posts) => [post, ...posts]);
  }

  function handleClearPosts() {
    setPosts([]);
  }

  // Whenever `isFakeDark` changes, we toggle the `fake-dark-mode` class on the HTML element (see in "Elements" dev tool).
  useEffect(
    function () {
      document.documentElement.classList.toggle('fake-dark-mode');
    },
    [isFakeDark],
  );

  return (
    // 2) Wrap the whole app in the Post Context Provider to provide values to all the child components
    <PostContext.Provider
      value={{
        posts: searchedPosts,
        onAddPost: handleAddPost,
        onClearPosts: handleClearPosts,
        searchQuery,
        setSearchQuery,
      }}
    >
      <Section>
        <Button
          onClick={() => setIsFakeDark((isFakeDark) => !isFakeDark)}
          className='btn-fake-dark-mode'
        >
          {isFakeDark ? '☀️' : '🌙'}
        </Button>
        <Header />
        <Main />
        <Archive />
        <Footer />
      </Section>
    </PostContext.Provider>
  );
}

// This component will display the header of the page which contains the title, the search bar and the button to clear the posts
function Header() {
  // 3) Consume the Post Context to get the values we need
  const { onClearPosts } = useContext(PostContext);
  return (
    <header>
      <h1>
        <span>⚛️</span>The Atomic Blog
      </h1>
      <div>
        <Results />
        <SearchPosts />
        <button onClick={onClearPosts}>Clear posts</button>
      </div>
    </header>
  );
}

//This component returns the search bar
function SearchPosts() {
  const { searchQuery, setSearchQuery } = useContext(PostContext);
  return (
    <input
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      placeholder='Search posts...'
    />
  );
}

// Tgis component returns the number of posts found
function Results() {
  const { posts } = useContext(PostContext);
  return <p>🚀 {posts.length} atomic posts found</p>;
}

// This component is the main page that holds the form to add new post and also the list of current posts
function Main() {
  return (
    <main>
      <FormAddPost />
      <Posts />
    </main>
  );
}
// Retunrs the list of posts in a section
function Posts() {
  return (
    <section>
      <List />
    </section>
  );
}
// This component returns the form to add new post
function FormAddPost() {
  const { onAddPost } = useContext(PostContext);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const handleSubmit = function (e) {
    e.preventDefault();
    if (!body || !title) return;
    onAddPost({ title, body });
    setTitle('');
    setBody('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder='Post title'
      />
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder='Post body'
      />
      <button>Add post</button>
    </form>
  );
}

// This component returns the list of posts that will be displayed
function List() {
  const { posts } = useContext(PostContext);
  return (
    <ul>
      {posts.map((post, i) => (
        <li key={i}>
          <h3>{post.title}</h3>
          <p>{post.body}</p>
        </li>
      ))}
    </ul>
  );
}

// This component returns the archive of posts and then by clicking on the button, you can add them to the list of posts
function Archive() {
  const { onAddPost } = useContext(PostContext);
  // Here we don't need the setter function. We're only using state to store these posts because the callback function passed into useState (which generates the posts) is only called once, on the initial render. So we use this trick as an optimization technique, because if we just used a regular variable, these posts would be re-created on every render. We could also move the posts outside the components, but I wanted to show you this trick 😉
  const [posts] = useState(() =>
    // 💥 WARNING: This might make your computer slow! Try a smaller `length` first
    Array.from({ length: 10000 }, () => createRandomPost()),
  );

  const [showArchive, setShowArchive] = useState(false);

  return (
    <aside>
      <h2>Post archive</h2>
      <button onClick={() => setShowArchive((s) => !s)}>
        {showArchive ? 'Hide archive posts' : 'Show archive posts'}
      </button>

      {showArchive && (
        <ul>
          {posts.map((post, i) => (
            <li key={i}>
              <p>
                <strong>{post.title}:</strong> {post.body}
              </p>
              <button onClick={() => onAddPost(post)}>Add as new post</button>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}

//This component returns the footer of the page
function Footer() {
  return <footer>&copy; by The Atomic Blog ✌️</footer>;
}

export default App;

