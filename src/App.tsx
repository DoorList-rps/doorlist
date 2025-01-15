import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BlogPostContent from './components/blog/BlogPostContent';
import BlogPostHeader from './components/blog/BlogPostHeader';
import PublishedUrls from './pages/PublishedUrls';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<h1>Home</h1>} />
        <Route path="/blog/:id" element={<BlogPostContent content="<p>Blog content here</p>" />} />
        <Route path="/sitemap.xml" element={<PublishedUrls />} />
        <Route path="/published-urls.xml" element={<PublishedUrls />} />
      </Routes>
    </Router>
  );
}

export default App;
