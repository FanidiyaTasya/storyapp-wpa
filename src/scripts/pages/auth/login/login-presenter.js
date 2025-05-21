export default class LoginPresenter {
  #view;
  #model;
  #authModel;

  constructor({ view, model, authModel }) {
    this.#view = view;
    this.#model = model;
    this.#authModel = authModel;
  }

  async getLogin({ email, password }) {
    this.#view.showSubmitLoadingButton();
    try {
      const response = await this.#model.login({ email, password });

      if (!response.ok) {
        console.error('getLogin: response:', response.message);
        alert(response.message);
        return;
      }
      this.#authModel.putAccessToken(response.data.accessToken);
      console.log('Token:', response.data.accessToken);

      location.hash = '/home';
    } catch (error) {
      console.error('getLogin: error:', error);
      alert('Login failed. Please try again.');
    } finally {
      this.#view.hideSubmitLoadingButton();
    }
  }
}
