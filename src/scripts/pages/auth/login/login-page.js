import LoginPresenter from './login-presenter.js';
import * as StoryAPI from '../../../data/api.js';
import * as AuthModel from '../../../utils/auth.js';

export default class LoginPage {
  #presenter = null;

  async render() {
    return `
      <section class="login-section">
        <div class="login-card">
          <h1>Login</h1>
          <form id="login-form" class="login-form">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" required placeholder="Type your email..." class="form-input" />
            
            <label for="password">Password</label>
            <input type="password" id="password" name="password" required placeholder="Type your password..." class="form-input" />
            
            <div id="submit-button-container">
              <button type="submit" class="form-button">Login</button>
            </div>
          </form>
          <p class="form-footer">
            Don’t have an account?
            <a href="#/register" class="form-link">Register here</a>
          </p>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new LoginPresenter({
      view: this,
      model: StoryAPI,
      authModel: AuthModel,
    });

    this.#setupForm();
  }

  #setupForm() {
    document.getElementById('login-form').addEventListener('submit', async (event) => {
      event.preventDefault();

      const data = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
      };
      await this.#presenter.getLogin(data);
    });
  }

  showSubmitLoadingButton() {
    document.getElementById('submit-button-container').innerHTML = `
      <button type="submit" class="form-button" disabled>
        <span class="loader"></span> Logging in...
      </button>
    `;
  }

  hideSubmitLoadingButton() {
    document.getElementById('submit-button-container').innerHTML = `
      <button type="submit" class="form-button">Login</button>
    `;
  }
}
