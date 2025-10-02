class Balance {
  constructor(client) {
    this.client = client;
  }

  async get() {
    const response = await this.client.request('/balance');
    const data = await response.json();

    return data.data;
  }
}

module.exports = { Balance };
