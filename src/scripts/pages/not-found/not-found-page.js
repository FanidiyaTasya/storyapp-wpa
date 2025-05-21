export default class NotFoundPage {
  async render() {
    return `
      <section class="notfound-section container" role="region" aria-labelledby="notfound-heading">
        <img src="images/not-found.png" alt="Not Found Illustration" />
        <h2 id="notfound-heading">404 - Page Not Found</h2>
        <p>
          Oops! The page you're looking for doesn't exist or may have been moved.
        </p>
        <a href="#/home" class="back-link">
          <i class="fas fa-arrow-left" aria-hidden="true"></i> Back to Home
        </a>
      </section>
    `;
  }
}
