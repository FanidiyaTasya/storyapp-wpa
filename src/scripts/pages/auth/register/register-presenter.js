export default class RegisterPresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async submitRegister({ name, email, password }) {
    this.#view.showSubmitLoadingButton();
    try {
      const response = await this.#model.register({ name, email, password });

      if (!response.ok) {
        alert(response.message);
        return;
      }

      alert('Register success! Please login.');
      window.location.hash = '#/login';
    } catch (error) {
      console.error('submitRegister error:', error);
      alert('Registration failed. Please try again.');
    } finally {
      this.#view.hideSubmitLoadingButton();
    }
  }
}
