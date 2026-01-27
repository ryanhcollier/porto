import React from 'react';
import { projects } from './projects'; // Import your data
import './App.css';

function App() {
  return (
    <div className="porto-layout">
      <nav className="porto-nav">
        <div className="logo">PORTO.</div>
        <ul className="nav-links">
          <li><a href="#work">Work</a></li>
          <li><a href="https://github.com" target="_blank">GitHub</a></li>
        </ul>
      </nav>

      <header className="porto-hero">
        <h1>Creative Technologist & Brand Designer</h1>
        <p>Currently focused on bridging the gap between high-end design and functional code.</p>
      </header>

      <section id="work" className="porto-work">
        <div className="porto-grid">
          {projects.map((project) => (
            <div key={project.id} className="porto-card">
              <div className="card-content">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="tags">
                  {project.tags.map(tag => <span key={tag}>{tag}</span>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default App;