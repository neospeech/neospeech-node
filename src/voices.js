class Voices {
  constructor(client) {
    this.client = client;
  }

  async list(filters = {}) {
    const params = new URLSearchParams();

    if (filters.gender) params.append('gender', filters.gender);
    if (filters.locale) params.append('locale', filters.locale);
    if (filters.search) params.append('search', filters.search);
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.offset) params.append('offset', filters.offset.toString());

    const queryString = params.toString();
    const endpoint = `/voices/list${queryString ? '?' + queryString : ''}`;

    const response = await this.client.request(endpoint);
    const data = await response.json();

    return data.data;
  }
}

module.exports = { Voices };
