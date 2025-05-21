import NotFoundPage from '../pages/not-found/not-found-page.js';
import routes from '../routes/routes.js';
import { getActiveRoute } from '../routes/url-parser.js';
import { getAccessToken, removeAccessToken } from '../utils/auth.js';

class App {
  #content = null;
  #logoutLink = null;

  constructor({ content }) {
    this.#content = content;
    this.#logoutLink = document.getElementById('logout-link');
  }

  isProtectedRoute(url) {
    const protectedRoutes = ['/home', '/add', '/detail/:id', '/saved'];
    return protectedRoutes.includes(url);
  }

  async handleLogout() {
    const confirmLogout = confirm('Are you sure you want to logout?');
    if (confirmLogout) {
      removeAccessToken();
      window.location.hash = '/';
    } else {
      window.history.back();
    }
  }

  getPage(url) {
    let page = routes[url];
    if (!page) {
      page = new NotFoundPage();
    }
    return page;
  }

  async renderContent(page) {
    if (document.startViewTransition) {
      await document.startViewTransition(async () => {
        this.#content.innerHTML = await page.render();
        await page.afterRender();
      });
    } else {
      this.#content.innerHTML = await page.render();
      await page.afterRender();
    }
  }

  async renderPage() {
    const url = getActiveRoute();
    const accessToken = getAccessToken();

    const body = document.body;
    if (accessToken) {
      body.classList.add('logged-in');
    } else {
      body.classList.remove('logged-in');
    }

    if (this.isProtectedRoute(url) && !accessToken) {
      window.location.hash = '/';
      return;
    }

    if (url === '/logout') {
      await this.handleLogout();
      return;
    }

    const page = this.getPage(url);
    await this.renderContent(page);
  }
}

export default App;
