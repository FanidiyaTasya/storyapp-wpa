import HomePage from '../pages/home/home-page.js';
import LoginPage from '../pages/auth/login/login-page.js';
import RegisterPage from '../pages/auth/register/register-page.js';
import AddStoryPage from '../pages/add-story/add-story-page.js';
import DetailPage from '../pages/detail-story/detail-page.js';
import SavedPage from '../pages/saved-story/saved-page.js';
import NotFoundPage from '../pages/not-found/not-found-page.js';

const routes = {
  '/': new LoginPage(),
  '/register': new RegisterPage(),

  '/home': new HomePage(),
  '/add': new AddStoryPage(),
  '/detail/:id': new DetailPage(),
  '/saved': new SavedPage(),

  '/not-found': () => new NotFoundPage(),
};

export default routes;
