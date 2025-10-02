class Models {
  constructor(client) {
    this.client = client;
  }

  async list() {
    const response = await this.client.request('/models/list');
    const data = await response.json();

    return data.data;
  }
}

module.exports = { Models };
