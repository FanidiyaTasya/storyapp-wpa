import RegisterPresenter from './register-presenter.js';
import * as StoryAPI from '../../../data/api.js';

export default class RegisterPage {
  #presenter = null;

  async render() {
    return `
      <section class="login-section">
        <div class="login-card">
          <h1>Register</h1>
          <form id="register-form" class="login-form">
            <label for="name">Name</label>
            <input type="text" id="name" name="name" required placeholder="Your full name..." class="form-input" />

            <label for="email">Email</label>
            <input type="email" id="email" name="email" required placeholder="Type your email..." class="form-input" />

            <label for="password">Password</label>
            <input type="password" id="password" name="password" required placeholder="Minimum 8 characters..." class="form-input" minlength="8" />

            <div id="submit-button-container">
              <button type="submit" class="form-button">Register</button>
            </div>
          </form>
          <p class="form-footer">
            Already have an account?
            <a href="#/login" class="form-link">Login here</a>
          </p>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new RegisterPresenter({
      view: this,
      model: StoryAPI,
    });

    this.#setupForm();
  }

  #setupForm() {
    document.getElementById('register-form').addEventListener('submit', async (event) => {
      event.preventDefault();

      const data = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        password: document.getElementById('password').value,
      };
      await this.#presenter.submitRegister(data);
    });
  }

  showSubmitLoadingButton() {
    document.getElementById('submit-button-container').innerHTML = `
      <button type="submit" class="form-button" disabled>
        <span class="loader"></span> Registering...
      </button>
    `;
  }

  hideSubmitLoadingButton() {
    document.getElementById('submit-button-container').innerHTML = `
      <button type="submit" class="form-button">Register</button>
    `;
  }
}
