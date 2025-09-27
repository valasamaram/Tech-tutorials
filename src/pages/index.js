import React from 'react';
import Layout from '@theme/Layout';

export default function Home() {
  return (
    <Layout
      title="Tech Tutorials"
      description="Learn new technologies with step-by-step guides"
    >
      <main className="container margin-vert--lg">
        <h1>🚀 Welcome to Tech Tutorials</h1>
        <p>
          Explore tutorials on Cloud, AI, and DevOps.  
          Stay updated with the latest technologies!
        </p>

        <div className="row">
          <div className="col col--4">
            <h3>☁️ Cloud</h3>
            <p>Learn Azure, AWS, and GCP basics.</p>
          </div>
          <div className="col col--4">
            <h3>🤖 AI</h3>
            <p>Intro to Machine Learning and AI tools.</p>
          </div>
          <div className="col col--4">
            <h3>⚙️ DevOps</h3>
            <p>CI/CD, Docker, Kubernetes tutorials.</p>
          </div>
        </div>
      </main>
    </Layout>
  );
}
